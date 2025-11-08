# 🚀 Guia Rápido de Início

## Instalação Rápida

```bash
# 1. Instalar dependências
npm install

# 2. Executar o servidor de desenvolvimento
npm run dev

# 3. Abrir no navegador
# http://localhost:3000
```

## Rotas Disponíveis

- `/` - Redireciona para `/login`
- `/login` - Página de login
- `/cadastro` - Página de cadastro
- `/esqueci-senha` - Recuperação de senha
- `/aluno/materias` - Seleção de matérias (aluno)
- `/aluno/materias/[materia]` - Detalhes da matéria
- `/professor/painel` - Painel do professor

## Estrutura de Componentes

### Componentes Reutilizáveis

- `Button` - Botão estilizado
- `Input` - Campo de entrada com ícone
- `Header` - Cabeçalho da página
- `SubjectCard` - Card de matéria
- `StatCard` - Card de estatística
- `StudentCard` - Card de aluno

## Personalização

### Cores

As cores podem ser ajustadas em `tailwind.config.ts`:

```typescript
colors: {
  primary: '#25f46a',
  matematica: '#FF7B25',
  // ... outras cores
}
```

### Tema

O tema claro/escuro é gerenciado pelo `next-themes`. Para alterar o tema padrão, edite `app/layout.tsx`:

```typescript
<ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
```

## Próximos Passos

1. Implementar autenticação real
2. Adicionar banco de dados
3. Criar API routes
4. Implementar sistema de lições
5. Adicionar mais páginas baseadas nos HTMLs originais

