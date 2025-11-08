#!/usr/bin/env python3
"""
Script para validar todas as páginas criadas no projeto
"""
import os
import re
from pathlib import Path
from collections import defaultdict

def validate_page_file(file_path):
    """Valida um arquivo de página"""
    issues = {
        'errors': [],
        'warnings': [],
        'info': []
    }
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        issues['errors'].append(f"Erro ao ler arquivo: {e}")
        return issues
    
    if not content.strip():
        issues['errors'].append("Arquivo vazio")
        return issues
    
    # Verifica se é um componente client-side
    if "'use client'" not in content and "export default" in content:
        # Verifica se precisa ser client component
        if any(hook in content for hook in ['useState', 'useEffect', 'useRouter', 'onClick', 'onChange']):
            issues['warnings'].append("Pode precisar de 'use client' no topo")
    
    # Verifica imports
    if "import" not in content:
        issues['warnings'].append("Nenhum import encontrado")
    
    # Verifica export default
    if "export default" not in content:
        issues['errors'].append("Export default não encontrado")
    
    # Verifica componentes do projeto
    if "@/components" in content:
        issues['info'].append("Usa componentes do projeto")
    
    # Verifica se usa Next.js Link
    if "from 'next/link'" in content or 'from "next/link"' in content:
        issues['info'].append("Usa Next.js Link")
    
    # Verifica se usa Next.js navigation
    if "useRouter" in content or "usePathname" in content:
        issues['info'].append("Usa navegação do Next.js")
    
    # Verifica estrutura básica
    if "return" not in content:
        issues['errors'].append("Função não retorna JSX")
    
    # Verifica se tem JSX
    if "<div" not in content and "<>" not in content:
        issues['warnings'].append("Pode não ter JSX válido")
    
    return issues

def main():
    # Caminho relativo a partir da pasta scripts/
    project_dir = Path('..')
    app_dir = project_dir / 'app'
    components_dir = project_dir / 'components'
    
    print("=" * 80)
    print("VALIDACAO DE PAGINAS DO PROJETO")
    print("=" * 80)
    
    # Encontrar todas as páginas
    page_files = list(app_dir.rglob('page.tsx'))
    component_files = list(components_dir.glob('*.tsx')) if components_dir.exists() else []
    
    print(f"\nEncontradas {len(page_files)} paginas e {len(component_files)} componentes\n")
    
    total_errors = 0
    total_warnings = 0
    pages_with_issues = []
    
    # Validar páginas
    print("VALIDANDO PAGINAS:")
    print("-" * 80)
    
    for page_file in sorted(page_files):
        relative_path = page_file.relative_to(project_dir)
        issues = validate_page_file(page_file)
        
        if issues['errors'] or issues['warnings']:
            pages_with_issues.append((relative_path, issues))
            total_errors += len(issues['errors'])
            total_warnings += len(issues['warnings'])
        
        status = "OK" if not issues['errors'] and not issues['warnings'] else "ISSUES"
        print(f"  [{status}] {relative_path}")
        if issues['info']:
            for info in issues['info']:
                print(f"    - {info}")
    
    # Validar componentes
    print("\nVALIDANDO COMPONENTES:")
    print("-" * 80)
    
    components_with_issues = []
    for comp_file in sorted(component_files):
        relative_path = comp_file.relative_to(project_dir)
        issues = validate_page_file(comp_file)
        
        if issues['errors'] or issues['warnings']:
            components_with_issues.append((relative_path, issues))
            total_errors += len(issues['errors'])
            total_warnings += len(issues['warnings'])
        
        status = "OK" if not issues['errors'] and not issues['warnings'] else "ISSUES"
        print(f"  [{status}] {relative_path}")
        if issues['info']:
            for info in issues['info']:
                print(f"    - {info}")
    
    # Relatório detalhado
    if pages_with_issues or components_with_issues:
        print("\n" + "=" * 80)
        print("RELATORIO DETALHADO")
        print("=" * 80)
        
        all_issues = pages_with_issues + components_with_issues
        
        for file_path, issues in all_issues:
            print(f"\n[ARQUIVO] {file_path}")
            print("-" * 80)
            
            if issues['errors']:
                print("  [ERRO] ERROS:")
                for error in issues['errors']:
                    print(f"    - {error}")
            
            if issues['warnings']:
                print("  [AVISO] AVISOS:")
                for warning in issues['warnings']:
                    print(f"    - {warning}")
    
    # Resumo
    print("\n" + "=" * 80)
    print("RESUMO")
    print("=" * 80)
    print(f"  Total de paginas: {len(page_files)}")
    print(f"  Total de componentes: {len(component_files)}")
    print(f"  Arquivos com problemas: {len(pages_with_issues) + len(components_with_issues)}")
    print(f"  Total de erros: {total_errors}")
    print(f"  Total de avisos: {total_warnings}")
    
    if total_errors == 0 and total_warnings == 0:
        print("\n[OK] Todas as paginas e componentes estao validos!")
    elif total_errors == 0:
        print(f"\n[OK] Nenhum erro encontrado!")
        print(f"[AVISO] {total_warnings} aviso(s) encontrado(s), mas nao sao criticos.")
    else:
        print(f"\n[ERRO] {total_errors} erro(s) encontrado(s) que precisam ser corrigidos.")
    
    print("\n" + "=" * 80)
    
    # Lista de rotas
    print("\nROTAS DISPONIVEIS:")
    print("-" * 80)
    routes = []
    for page_file in sorted(page_files):
        relative_path = page_file.relative_to(app_dir)
        route = '/' + str(relative_path.parent).replace('\\', '/').replace('page.tsx', '').replace('page', '')
        if route == '/':
            route = '/'
        elif route.endswith('/'):
            route = route[:-1]
        route = route.replace('(materia)', '[materia]')
        routes.append(route)
    
    for route in sorted(set(routes)):
        print(f"  {route}")

if __name__ == '__main__':
    main()

