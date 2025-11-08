# 🚀 Próximos Passos - Trilha do Saber

## ✅ O que já está pronto

1. ✅ **Todas as telas implementadas** (100% - 11 grupos)
2. ✅ **Banco de dados criado e validado** no Supabase
3. ✅ **Configuração do Supabase** concluída
4. ✅ **Estrutura do projeto** completa

---

## 📋 Próximos Passos (Por Prioridade)

### 🔥 Prioridade ALTA (Funcionalidades Core)

#### 1. **Sistema de Autenticação** 🔐
**Status**: ⏳ Pendente

**Tarefas**:
- [ ] Implementar login com Supabase Auth
- [ ] Implementar cadastro com Supabase Auth
- [ ] Implementar recuperação de senha
- [ ] Criar perfil automaticamente ao cadastrar
- [ ] Proteção de rotas (middleware)
- [ ] Context de autenticação

**Arquivos a criar/modificar**:
- `lib/auth.ts` - Funções de autenticação
- `contexts/AuthContext.tsx` - Context de autenticação
- `middleware.ts` - Proteção de rotas
- `app/login/page.tsx` - Integrar com Supabase
- `app/cadastro/page.tsx` - Integrar com Supabase
- `app/esqueci-senha/page.tsx` - Integrar com Supabase

**Estimativa**: 2-3 horas

---

#### 2. **Hooks Personalizados para Supabase** 🎣
**Status**: ⏳ Pendente

**Tarefas**:
- [ ] `useAuth()` - Hook de autenticação
- [ ] `useMaterias()` - Hook para matérias
- [ ] `useProgresso()` - Hook para progresso
- [ ] `useAluno()` - Hook para dados do aluno
- [ ] `useRanking()` - Hook para ranking
- [ ] `useAmizades()` - Hook para amizades
- [ ] `useLoja()` - Hook para loja

**Arquivos a criar**:
- `hooks/useAuth.ts`
- `hooks/useMaterias.ts`
- `hooks/useProgresso.ts`
- `hooks/useAluno.ts`
- `hooks/useRanking.ts`
- `hooks/useAmizades.ts`
- `hooks/useLoja.ts`

**Estimativa**: 2-3 horas

---

#### 3. **Integração: Página de Matérias** 📚
**Status**: ⏳ Pendente

**Tarefas**:
- [ ] Buscar matérias do banco
- [ ] Exibir matérias dinamicamente
- [ ] Adicionar loading states
- [ ] Tratamento de erros

**Arquivos a modificar**:
- `app/aluno/materias/page.tsx`

**Estimativa**: 30 minutos

---

#### 4. **Integração: Perfil do Aluno** 👤
**Status**: ⏳ Pendente

**Tarefas**:
- [ ] Buscar dados do aluno do banco
- [ ] Buscar conquistas do aluno
- [ ] Buscar progresso semanal
- [ ] Buscar amigos
- [ ] Atualizar perfil

**Arquivos a modificar**:
- `app/aluno/perfil/page.tsx`
- `app/aluno/perfil/editar/page.tsx`

**Estimativa**: 1-2 horas

---

### 🟡 Prioridade MÉDIA (Funcionalidades Importantes)

#### 5. **Sistema de Trilhas e Lições** 🎮
**Status**: ⏳ Pendente

**Tarefas**:
- [ ] Buscar trilhas do banco
- [ ] Buscar lições da trilha
- [ ] Implementar progresso de lições
- [ ] Salvar respostas do aluno
- [ ] Atualizar pontos e moedas
- [ ] Sistema de vidas

**Arquivos a modificar**:
- `app/aluno/trilha/[materia]/page.tsx`
- `app/aluno/trilha/[materia]/licao/[licaoId]/page.tsx`

**Estimativa**: 3-4 horas

---

#### 6. **Sistema de Ranking** 🏆
**Status**: ⏳ Pendente

**Tarefas**:
- [ ] Buscar ranking do banco
- [ ] Calcular posições
- [ ] Atualizar ranking semanal
- [ ] Filtrar por amigos/global

**Arquivos a modificar**:
- `app/aluno/ranking/page.tsx`

**Estimativa**: 1-2 horas

---

#### 7. **Sistema de Amizades** 👥
**Status**: ⏳ Pendente

**Tarefas**:
- [ ] Buscar amigos do banco
- [ ] Buscar pedidos de amizade
- [ ] Implementar adicionar amigo
- [ ] Implementar aceitar/recusar pedido
- [ ] Buscar usuários para adicionar

**Arquivos a modificar**:
- `app/aluno/buscar-amigos/page.tsx`
- `app/aluno/pedidos-amizade/page.tsx`

**Estimativa**: 2-3 horas

---

#### 8. **Sistema de Loja** 🛒
**Status**: ⏳ Pendente

**Tarefas**:
- [ ] Buscar itens da loja do banco
- [ ] Buscar inventário do aluno
- [ ] Implementar compra de itens
- [ ] Implementar equipar itens
- [ ] Atualizar moedas após compra

**Arquivos a modificar**:
- `app/aluno/loja/page.tsx`

**Estimativa**: 2-3 horas

---

#### 9. **Painel dos Pais** 👨‍👩‍👧
**Status**: ⏳ Pendente

**Tarefas**:
- [ ] Buscar dados dos filhos
- [ ] Buscar progresso dos filhos
- [ ] Buscar tarefas criadas
- [ ] Implementar criar tarefa
- [ ] Buscar conquistas dos filhos

**Arquivos a modificar**:
- `app/pais/painel/page.tsx`

**Estimativa**: 2-3 horas

---

#### 10. **Sistema de Chat** 💬
**Status**: ⏳ Pendente

**Tarefas**:
- [ ] Buscar conversas do banco
- [ ] Buscar mensagens
- [ ] Implementar envio de mensagens
- [ ] Real-time com Supabase Realtime
- [ ] Marcar mensagens como lidas

**Arquivos a modificar**:
- `app/chat/[id]/page.tsx`

**Estimativa**: 2-3 horas

---

### 🟢 Prioridade BAIXA (Melhorias e Extras)

#### 11. **Painel do Coordenador** 🎓
**Status**: ⏳ Pendente

**Tarefas**:
- [ ] Buscar estatísticas do banco
- [ ] Buscar turmas
- [ ] Buscar professores
- [ ] Buscar alunos
- [ ] Implementar criar turma/professor/aluno
- [ ] Implementar enviar comunicado

**Arquivos a modificar**:
- `app/coordenador/painel/page.tsx`
- `app/coordenador/turmas/page.tsx`
- `app/coordenador/professores/page.tsx`
- `app/coordenador/alunos/page.tsx`

**Estimativa**: 3-4 horas

---

#### 12. **Painel do Professor** 👨‍🏫
**Status**: ⏳ Pendente

**Tarefas**:
- [ ] Buscar turmas do professor
- [ ] Buscar alunos das turmas
- [ ] Buscar progresso dos alunos
- [ ] Implementar análise de progresso

**Arquivos a modificar**:
- `app/professor/painel/page.tsx`

**Estimativa**: 2-3 horas

---

#### 13. **Configurações** ⚙️
**Status**: ⏳ Pendente

**Tarefas**:
- [ ] Buscar configurações do banco
- [ ] Salvar configurações
- [ ] Sincronizar com perfil

**Arquivos a modificar**:
- `app/configuracoes/page.tsx`

**Estimativa**: 1 hora

---

## 🛠️ Infraestrutura Necessária

### Contexts
- [ ] `AuthContext` - Gerenciamento de autenticação
- [ ] `AlunoContext` - Dados do aluno logado
- [ ] `ThemeContext` - Já existe (next-themes)

### Utilitários
- [ ] `lib/utils.ts` - Funções utilitárias
- [ ] `lib/constants.ts` - Constantes do app
- [ ] `lib/validations.ts` - Validações de formulário

### Middleware
- [ ] `middleware.ts` - Proteção de rotas baseada em role

---

## 📊 Ordem Recomendada de Implementação

### Fase 1: Fundação (1-2 dias)
1. ✅ Sistema de Autenticação
2. ✅ Hooks Personalizados
3. ✅ Context de Autenticação
4. ✅ Proteção de Rotas

### Fase 2: Funcionalidades Core (3-5 dias)
5. ✅ Página de Matérias
6. ✅ Perfil do Aluno
7. ✅ Sistema de Trilhas e Lições
8. ✅ Sistema de Ranking

### Fase 3: Funcionalidades Sociais (2-3 dias)
9. ✅ Sistema de Amizades
10. ✅ Sistema de Loja
11. ✅ Sistema de Chat

### Fase 4: Painéis (2-3 dias)
12. ✅ Painel dos Pais
13. ✅ Painel do Professor
14. ✅ Painel do Coordenador

### Fase 5: Polimento (1-2 dias)
15. ✅ Configurações
16. ✅ Tratamento de erros global
17. ✅ Loading states
18. ✅ Notificações

---

## 🎯 Meta Final

**Objetivo**: Aplicativo totalmente funcional e integrado com o banco de dados

**Tempo estimado total**: 10-15 dias de desenvolvimento

**Próximo passo imediato**: Implementar Sistema de Autenticação

---

## 📝 Notas

- Todas as telas já estão criadas e funcionais (UI)
- Banco de dados está pronto e validado
- Foco agora é na integração backend-frontend
- Use os hooks personalizados para manter código limpo
- Implemente tratamento de erros em todas as operações
- Adicione loading states para melhor UX

