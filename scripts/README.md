# 🔧 Scripts do Projeto

Esta pasta contém scripts utilitários para o projeto Trilha do Saber.

## 📜 Scripts Disponíveis

### `validate_html.py`
Script para validar arquivos HTML do projeto.

**Uso:**
```bash
python scripts/validate_html.py
```

**Funcionalidades:**
- Valida estrutura HTML
- Verifica tags não fechadas
- Identifica elementos void
- Gera relatório de erros

### `validate_pages.py`
Script para validar todas as páginas criadas no projeto Next.js.

**Uso:**
```bash
python scripts/validate_pages.py
```

**Funcionalidades:**
- Valida arquivos de página (`page.tsx`)
- Verifica estrutura de componentes
- Identifica problemas comuns
- Verifica uso de hooks e imports

### `verificar_pendentes.py`
Script para verificar quais telas HTML ainda estão pendentes de implementação.

**Uso:**
```bash
python scripts/verificar_pendentes.py
```

**Funcionalidades:**
- Lista telas HTML pendentes
- Organiza por categoria
- Compara com páginas já implementadas

## 📋 Requisitos

- Python 3.7+
- Acesso ao diretório `stitch_sele_o_de_mat_ria_escolar/` (para scripts de validação HTML)

## 🚀 Como Executar

Todos os scripts podem ser executados diretamente:

```bash
# Windows
python scripts\validate_html.py
python scripts\validate_pages.py
python scripts\verificar_pendentes.py

# Linux/Mac
python3 scripts/validate_html.py
python3 scripts/validate_pages.py
python3 scripts/verificar_pendentes.py
```

