# 📁 Organização do Projeto

Este documento descreve a organização atual do projeto Trilha do Saber.

## 📂 Estrutura de Pastas

```
stitch/
├── app/                          # Next.js App Router
│   ├── aluno/                    # Área do aluno
│   ├── professor/                # Área do professor
│   ├── pais/                     # Área dos pais
│   ├── coordenador/              # Área do coordenador
│   ├── api/                      # API Routes
│   └── ...                       # Outras páginas públicas
│
├── components/                   # Componentes reutilizáveis
│   ├── modals/                   # Modais diversos
│   └── ...
│
├── hooks/                        # Custom Hooks
├── contexts/                     # React Contexts
├── lib/                          # Utilitários e funções auxiliares
├── supabase/                     # Configuração Supabase
│   ├── config.ts                 # Cliente Supabase
│   ├── schema.sql                # Schema do banco de dados
│   └── validar-banco.ts          # Script de validação
│
├── docs/                         # 📚 Documentação do projeto
│   ├── CHECKLIST_IMPLEMENTACAO.md
│   ├── CONFIGURACAO_SUPABASE.md
│   ├── PROGRESSO_IMPLEMENTACAO.md
│   ├── PROXIMOS_PASSOS.md
│   ├── RESUMO_IMPLEMENTACAO.md
│   ├── RESUMO_PROXIMOS_PASSOS.md
│   ├── TELAS_PENDENTES.md
│   ├── VALIDACAO_RELATORIO.md
│   └── README.md
│
├── scripts/                      # 🔧 Scripts utilitários (Python)
│   ├── validate_html.py          # Valida arquivos HTML
│   ├── validate_pages.py          # Valida páginas Next.js
│   ├── verificar_pendentes.py     # Verifica telas pendentes
│   └── README.md
│
├── stitch_sele_o_de_mat_ria_escolar/  # Protótipos HTML originais
│
├── README.md                      # README principal
├── QUICKSTART.md                  # Guia rápido de início
├── package.json                   # Dependências do projeto
├── tsconfig.json                  # Configuração TypeScript
├── tailwind.config.ts             # Configuração Tailwind CSS
├── next.config.js                 # Configuração Next.js
└── middleware.ts                  # Middleware de proteção de rotas
```

## 📋 Organização por Tipo de Arquivo

### Documentação (`docs/`)
- **Checklist e Progresso**: `CHECKLIST_IMPLEMENTACAO.md`, `PROGRESSO_IMPLEMENTACAO.md`
- **Configuração**: `CONFIGURACAO_SUPABASE.md`
- **Resumos**: `RESUMO_IMPLEMENTACAO.md`, `RESUMO_PROXIMOS_PASSOS.md`
- **Validação**: `VALIDACAO_RELATORIO.md`, `TELAS_PENDENTES.md`
- **Próximos Passos**: `PROXIMOS_PASSOS.md`

### Scripts (`scripts/`)
- **Validação HTML**: `validate_html.py`
- **Validação de Páginas**: `validate_pages.py`
- **Verificação de Pendentes**: `verificar_pendentes.py`

### Código Fonte
- **Páginas**: `app/` (Next.js App Router)
- **Componentes**: `components/`
- **Hooks**: `hooks/`
- **Contexts**: `contexts/`
- **Utilitários**: `lib/`
- **Configuração**: `supabase/`

## 🔄 Mudanças Realizadas

### Organização de Arquivos
1. ✅ Criada pasta `docs/` para documentação
2. ✅ Criada pasta `scripts/` para scripts Python
3. ✅ Movidos todos os arquivos `.md` de documentação para `docs/`
4. ✅ Movidos todos os scripts Python para `scripts/`
5. ✅ Atualizados caminhos relativos nos scripts
6. ✅ Atualizado `.gitignore` para ignorar pasta de templates HTML
7. ✅ Criados READMEs em `docs/` e `scripts/`
8. ✅ Atualizado README principal com nova estrutura

### Arquivos na Raiz
Apenas os seguintes arquivos permanecem na raiz:
- `README.md` - README principal do projeto
- `QUICKSTART.md` - Guia rápido de início
- Arquivos de configuração (`.json`, `.js`, `.ts`, etc.)

## 📝 Convenções

### Nomenclatura
- **Páginas**: `page.tsx` (sempre em minúsculas)
- **Componentes**: PascalCase (ex: `Button.tsx`)
- **Hooks**: camelCase com prefixo `use` (ex: `useAluno.ts`)
- **Documentação**: UPPERCASE com underscores (ex: `CHECKLIST_IMPLEMENTACAO.md`)

### Estrutura
- Cada página em sua própria pasta com `page.tsx`
- Componentes reutilizáveis em `/components`
- Hooks customizados em `/hooks`
- Documentação em `/docs`
- Scripts utilitários em `/scripts`

## 🚀 Como Usar

### Documentação
Consulte [`docs/README.md`](README.md) para ver todos os arquivos de documentação disponíveis.

### Scripts
Consulte [`scripts/README.md`](../scripts/README.md) para ver como usar os scripts utilitários.

### Estrutura do Projeto
Consulte [`CHECKLIST_IMPLEMENTACAO.md`](CHECKLIST_IMPLEMENTACAO.md) para ver a organização completa e o organograma do projeto.

