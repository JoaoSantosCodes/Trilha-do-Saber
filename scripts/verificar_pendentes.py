#!/usr/bin/env python3
"""
Script para verificar quais telas ainda estão pendentes
"""
import os
from pathlib import Path

# Páginas já criadas
paginas_criadas = {
    'boas-vindas': 'tela_de_boas-vindas_do_app_de_reforço',
    'login': 'tela_de_login_com_coruja_(tema_escuro)',
    'cadastro': ['tela_de_criar_conta_com_coruja_(tema_escuro)_1', 'tela_de_criar_conta_com_coruja_(tema_escuro)_2'],
    'esqueci-senha': 'tela_de_esqueci_minha_senha_(tema_escuro)',
    'aluno/materias': ['seleção_de_matéria_escolar_1', 'seleção_de_matéria_escolar_2', 'seleção_de_matéria_escolar_3', 'seleção_de_matéria_escolar_4', 'seleção_de_matéria_escolar_5'],
    'professor/painel': 'painel_de_controle_do_professor_(tema_escuro)',
}

def main():
    # Caminho relativo a partir da pasta scripts/
    html_dir = Path('../stitch_sele_o_de_mat_ria_escolar')
    
    if not html_dir.exists():
        print(f"Diretorio {html_dir} nao encontrado!")
        return
    
    # Listar todas as pastas HTML
    todas_pastas = [d.name for d in html_dir.iterdir() if d.is_dir()]
    
    # Criar lista de pastas já implementadas
    pastas_implementadas = set()
    for key, value in paginas_criadas.items():
        if isinstance(value, list):
            pastas_implementadas.update(value)
        else:
            pastas_implementadas.add(value)
    
    # Filtrar pastas pendentes
    pastas_pendentes = [p for p in todas_pastas if p not in pastas_implementadas and p != 'Tela de login']
    
    # Separar por categoria
    categorias = {
        'Autenticação': [],
        'Aluno': [],
        'Professor': [],
        'Coordenador': [],
        'Pais/Responsáveis': [],
        'Pop-ups/Modais': [],
        'Outros': [],
    }
    
    for pasta in sorted(pastas_pendentes):
        nome_lower = pasta.lower()
        
        if any(x in nome_lower for x in ['login', 'cadastro', 'conta', 'senha', 'email']):
            categorias['Autenticação'].append(pasta)
        elif any(x in nome_lower for x in ['aluno', 'perfil_do_aluno', 'ranking', 'amigo', 'pedido']):
            categorias['Aluno'].append(pasta)
        elif any(x in nome_lower for x in ['professor', 'tarefa', 'análise', 'acompanhamento', 'relatório']):
            categorias['Professor'].append(pasta)
        elif any(x in nome_lower for x in ['coordenador', 'gerenciamento', 'comunicado']):
            categorias['Coordenador'].append(pasta)
        elif any(x in nome_lower for x in ['pais', 'responsável', 'painel_de_acompanhamento', 'caixa_de_entrada']):
            categorias['Pais/Responsáveis'].append(pasta)
        elif any(x in nome_lower for x in ['pop-up', 'popup']):
            categorias['Pop-ups/Modais'].append(pasta)
        else:
            categorias['Outros'].append(pasta)
    
    print("=" * 80)
    print("TELAS PENDENTES PARA IMPLEMENTACAO")
    print("=" * 80)
    print(f"\nTotal de telas HTML: {len(todas_pastas)}")
    print(f"Telas ja implementadas: {len(pastas_implementadas)}")
    print(f"Telas pendentes: {len(pastas_pendentes)}\n")
    
    total_pendentes = 0
    for categoria, pastas in categorias.items():
        if pastas:
            print(f"\n[{categoria}] ({len(pastas)} telas)")
            print("-" * 80)
            for pasta in pastas:
                print(f"  - {pasta}")
                total_pendentes += 1
    
    print("\n" + "=" * 80)
    print(f"TOTAL DE TELAS PENDENTES: {total_pendentes}")
    print("=" * 80)
    
    # Listar telas já implementadas
    print("\n\nTELAS JA IMPLEMENTADAS:")
    print("-" * 80)
    for key, value in paginas_criadas.items():
        if isinstance(value, list):
            print(f"  {key}: {len(value)} variacoes")
        else:
            print(f"  {key}: {value}")

if __name__ == '__main__':
    main()

