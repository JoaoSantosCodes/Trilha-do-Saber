#!/usr/bin/env python3
"""
Script para validar arquivos HTML do projeto
"""
import os
import re
from pathlib import Path
from html.parser import HTMLParser
from collections import defaultdict

class HTMLValidator(HTMLParser):
    def __init__(self):
        super().__init__()
        self.errors = []
        self.warnings = []
        self.tag_stack = []
        self.has_doctype = False
        self.has_html = False
        self.has_head = False
        self.has_body = False
        
    def handle_decl(self, decl):
        if decl.lower().startswith('doctype'):
            self.has_doctype = True
    
    def handle_starttag(self, tag, attrs):
        if tag == 'html':
            self.has_html = True
        elif tag == 'head':
            self.has_head = True
        elif tag == 'body':
            self.has_body = True
        
        # Tags que não precisam fechar
        void_tags = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 
                     'link', 'meta', 'param', 'source', 'track', 'wbr'}
        
        if tag not in void_tags:
            self.tag_stack.append(tag)
    
    def handle_endtag(self, tag):
        # Tags void não devem ter fechamento
        void_tags = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 
                     'link', 'meta', 'param', 'source', 'track', 'wbr'}
        
        if tag in void_tags:
            # Ignorar tags de fechamento de elementos void (são falsos positivos)
            return
        
        if tag == 'html':
            if not self.has_html:
                self.errors.append("Tag </html> encontrada sem tag <html> correspondente")
        
        if self.tag_stack:
            if self.tag_stack[-1] == tag:
                self.tag_stack.pop()
            elif tag in self.tag_stack:
                self.errors.append(f"Tag </{tag}> fechada fora de ordem. Tag aberta esperada: </{self.tag_stack[-1]}>")
                # Remove da pilha se encontrada
                if tag in self.tag_stack:
                    self.tag_stack.remove(tag)
            else:
                self.errors.append(f"Tag </{tag}> fechada sem tag <{tag}> correspondente")
        else:
            self.errors.append(f"Tag </{tag}> fechada sem tag <{tag}> correspondente")
    
    def get_unclosed_tags(self):
        return self.tag_stack

def validate_html_file(file_path):
    """Valida um arquivo HTML individual"""
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
    
    # Verificações básicas
    if not content.strip():
        issues['errors'].append("Arquivo vazio")
        return issues
    
    # Verifica DOCTYPE
    if not re.search(r'<!DOCTYPE\s+html', content, re.IGNORECASE):
        issues['warnings'].append("DOCTYPE html não encontrado")
    else:
        issues['info'].append("DOCTYPE html presente")
    
    # Verifica tag <html>
    if not re.search(r'<html', content, re.IGNORECASE):
        issues['errors'].append("Tag <html> não encontrada")
    else:
        issues['info'].append("Tag <html> presente")
    
    # Verifica tag </html>
    if not re.search(r'</html>', content, re.IGNORECASE):
        issues['errors'].append("Tag </html> não encontrada")
    else:
        issues['info'].append("Tag </html> presente")
    
    # Verifica tag <body>
    if not re.search(r'<body', content, re.IGNORECASE):
        issues['warnings'].append("Tag <body> não encontrada")
    else:
        issues['info'].append("Tag <body> presente")
    
    # Verifica tag </body>
    if not re.search(r'</body>', content, re.IGNORECASE):
        issues['warnings'].append("Tag </body> não encontrada")
    else:
        issues['info'].append("Tag </body> presente")
    
    # Verifica charset
    if not re.search(r'<meta\s+[^>]*charset', content, re.IGNORECASE):
        issues['warnings'].append("Meta charset não encontrado")
    else:
        issues['info'].append("Meta charset presente")
    
    # Verifica viewport
    if not re.search(r'<meta\s+[^>]*viewport', content, re.IGNORECASE):
        issues['warnings'].append("Meta viewport não encontrado")
    else:
        issues['info'].append("Meta viewport presente")
    
    # Validação com parser HTML
    try:
        validator = HTMLValidator()
        validator.feed(content)
        
        if not validator.has_doctype:
            issues['warnings'].append("DOCTYPE não detectado pelo parser")
        
        if not validator.has_html:
            issues['errors'].append("Tag <html> não detectada pelo parser")
        
        if not validator.has_body:
            issues['warnings'].append("Tag <body> não detectada pelo parser")
        
        unclosed = validator.get_unclosed_tags()
        if unclosed:
            issues['errors'].append(f"Tags não fechadas: {', '.join(unclosed)}")
        
        issues['errors'].extend(validator.errors)
        issues['warnings'].extend(validator.warnings)
        
    except Exception as e:
        issues['warnings'].append(f"Erro no parser HTML: {e}")
    
    return issues

def main():
    import sys
    import io
    
    # Configurar encoding UTF-8 para stdout no Windows
    if sys.platform == 'win32':
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    
    # Caminho relativo a partir da pasta scripts/
    project_dir = Path('../stitch_sele_o_de_mat_ria_escolar')
    
    if not project_dir.exists():
        print(f"Diretorio {project_dir} nao encontrado!")
        return
    
    html_files = list(project_dir.rglob('*.html'))
    
    if not html_files:
        print("Nenhum arquivo HTML encontrado!")
        return
    
    print(f"Validando {len(html_files)} arquivos HTML...\n")
    print("=" * 80)
    
    total_errors = 0
    total_warnings = 0
    files_with_issues = []
    
    for html_file in sorted(html_files):
        relative_path = html_file.relative_to(project_dir.parent)
        issues = validate_html_file(html_file)
        
        if issues['errors'] or issues['warnings']:
            files_with_issues.append((relative_path, issues))
            total_errors += len(issues['errors'])
            total_warnings += len(issues['warnings'])
    
    # Relatorio
    if files_with_issues:
        print("\nRELATORIO DE VALIDACAO\n")
        print("=" * 80)
        
        for file_path, issues in files_with_issues:
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
            
            if issues['info'] and not issues['errors'] and not issues['warnings']:
                print("  [OK] Arquivo valido")
        
        print("\n" + "=" * 80)
        print(f"\nRESUMO:")
        print(f"  Total de arquivos: {len(html_files)}")
        print(f"  Arquivos com problemas: {len(files_with_issues)}")
        print(f"  Total de erros: {total_errors}")
        print(f"  Total de avisos: {total_warnings}")
        
        if total_errors == 0:
            print("\n[OK] Todos os arquivos estao estruturalmente validos!")
            if total_warnings > 0:
                print("[AVISO] Alguns avisos foram encontrados, mas nao sao criticos.")
        else:
            print(f"\n[ERRO] {total_errors} erro(s) encontrado(s) que precisam ser corrigidos.")
    else:
        print("\n[OK] Todos os arquivos HTML estao validos!")
        print(f"   {len(html_files)} arquivos validados com sucesso.")
    
    print("\n" + "=" * 80)

if __name__ == '__main__':
    main()

