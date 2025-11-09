# Checklist Completo de Testes - Trilha do Saber

## 📋 Índice
1. [Autenticação](#autenticação)
2. [Páginas Públicas](#páginas-públicas)
3. [Páginas de Aluno](#páginas-de-aluno)
4. [Páginas de Professor](#páginas-de-professor)
5. [Páginas de Coordenador](#páginas-de-coordenador)
6. [Páginas de Pais](#páginas-de-pais)
7. [Validação de Banco de Dados](#validação-de-banco-de-dados)
8. [Validação de Integração](#validação-de-integração)
9. [Hooks Customizados](#hooks-customizados)
10. [Tratamento de Erros](#tratamento-de-erros)

---

## 🔐 Autenticação

### Login (`/login`)
- [ ] Página carrega corretamente
- [ ] Validação de campos (email, senha)
- [ ] Mensagens de erro exibidas corretamente
- [ ] Login bem-sucedido redireciona para página correta
- [ ] Login falha exibe mensagem de erro
- [ ] Redirecionamento baseado em role (aluno, professor, coordenador, pais)
- [ ] Suporte para roles em inglês e português
- [ ] Cookies de sessão salvos corretamente
- [ ] Middleware detecta sessão após login

### Cadastro (`/cadastro`)
- [ ] Página carrega corretamente
- [ ] Validação de campos (email, senha, nome, role)
- [ ] Cadastro bem-sucedido cria usuário no Supabase Auth
- [ ] Cadastro falha exibe mensagem de erro
- [ ] Redirecionamento após cadastro

### Esqueci Senha (`/esqueci-senha`)
- [ ] Página carrega corretamente
- [ ] Validação de email
- [ ] Envio de email de recuperação

### Alterar Senha (`/alterar-senha`)
- [ ] Página carrega corretamente
- [ ] Validação de senhas (atual, nova, confirmação)
- [ ] Alteração de senha bem-sucedida
- [ ] Erro ao alterar senha exibido corretamente

### Logout
- [ ] Logout remove sessão
- [ ] Redirecionamento para login após logout
- [ ] Cookies limpos após logout

---

## 🌐 Páginas Públicas

### Boas-vindas (`/boas-vindas`)
- [ ] Página carrega corretamente
- [ ] Navegação para login e cadastro funciona
- [ ] Layout responsivo

### Sobre (`/sobre`)
- [ ] Página carrega corretamente
- [ ] Informações exibidas corretamente
- [ ] Layout responsivo

### Ajuda (`/ajuda`)
- [ ] Página carrega corretamente
- [ ] FAQ exibido corretamente
- [ ] Layout responsivo

### Termos (`/termos`)
- [ ] Página carrega corretamente
- [ ] Conteúdo exibido corretamente
- [ ] Layout responsivo

### Política de Privacidade (`/politica-privacidade`)
- [ ] Página carrega corretamente
- [ ] Conteúdo exibido corretamente
- [ ] Layout responsivo

### Configurações (`/configuracoes`)
- [ ] Página carrega corretamente
- [ ] Links para outras páginas funcionam
- [ ] Toggles de som e notificações funcionam
- [ ] Layout responsivo

---

## 👨‍🎓 Páginas de Aluno

### Matérias (`/aluno/materias`)
- [ ] Página carrega corretamente
- [ ] Lista de matérias exibida
- [ ] Navegação para detalhes da matéria funciona
- [ ] Loading state exibido durante carregamento
- [ ] Empty state exibido quando não há matérias
- [ ] Integração com banco de dados (tabela `subjects` ou `materias`)

### Detalhes da Matéria (`/aluno/materias/[materia]`)
- [ ] Página carrega corretamente
- [ ] Informações da matéria exibidas
- [ ] Lista de lições exibida
- [ ] Navegação para lições funciona
- [ ] Integração com banco de dados

### Trilha (`/aluno/trilha/[materia]`)
- [ ] Página carrega corretamente
- [ ] Mapa da trilha exibido
- [ ] Lições exibidas no mapa
- [ ] Navegação para lições funciona
- [ ] Integração com banco de dados

### Lição (`/aluno/trilha/[materia]/licao/[licaoId]`)
- [ ] Página carrega corretamente
- [ ] Questões exibidas
- [ ] Respostas podem ser selecionadas
- [ ] Feedback exibido após resposta
- [ ] Progresso salvo no banco de dados
- [ ] Pontos e moedas atualizados

### Perfil (`/aluno/perfil`)
- [ ] Página carrega corretamente
- [ ] Informações do aluno exibidas
- [ ] Estatísticas exibidas (pontos, moedas, conquistas)
- [ ] Tabs funcionam (conquistas, progresso)
- [ ] Integração com banco de dados

### Editar Perfil (`/aluno/perfil/editar`)
- [ ] Página carrega corretamente
- [ ] Formulário pré-preenchido com dados atuais
- [ ] Validação de campos
- [ ] Atualização salva no banco de dados
- [ ] Mensagens de sucesso/erro exibidas

### Perfil Público (`/aluno/perfil/[username]`)
- [ ] Página carrega corretamente
- [ ] Informações públicas do aluno exibidas
- [ ] Botão de adicionar amigo funciona
- [ ] Integração com banco de dados

### Loja (`/aluno/loja`)
- [ ] Página carrega corretamente
- [ ] Itens da loja exibidos
- [ ] Filtros por categoria funcionam
- [ ] Compra de itens funciona
- [ ] Saldo de moedas atualizado
- [ ] Integração com banco de dados

### Buscar Amigos (`/aluno/buscar-amigos`)
- [ ] Página carrega corretamente
- [ ] Busca de usuários funciona
- [ ] Lista de resultados exibida
- [ ] Envio de solicitação de amizade funciona
- [ ] Integração com banco de dados

### Pedidos de Amizade (`/aluno/pedidos-amizade`)
- [ ] Página carrega corretamente
- [ ] Lista de pedidos pendentes exibida
- [ ] Aceitar/recusar pedidos funciona
- [ ] Integração com banco de dados

### Ranking (`/aluno/ranking`)
- [ ] Página carrega corretamente
- [ ] Ranking exibido (amigos/global)
- [ ] Alternância entre rankings funciona
- [ ] Integração com banco de dados

### Inserir Código de Turma (`/aluno/inserir-codigo-turma`)
- [ ] Página carrega corretamente
- [ ] Validação de código
- [ ] Inserção na turma funciona
- [ ] Integração com banco de dados

### Chat (`/chat/[id]`)
- [ ] Página carrega corretamente
- [ ] Mensagens exibidas
- [ ] Envio de mensagens funciona
- [ ] Realtime funciona (novas mensagens aparecem)
- [ ] Integração com banco de dados

---

## 👨‍🏫 Páginas de Professor

### Painel (`/professor/painel`)
- [ ] Página carrega corretamente
- [ ] Estatísticas exibidas
- [ ] Lista de alunos exibida
- [ ] Seleção de turma funciona
- [ ] Integração com banco de dados

### Detalhes do Aluno (`/professor/aluno/[id]`)
- [ ] Página carrega corretamente
- [ ] Informações do aluno exibidas
- [ ] Progresso por matéria exibido
- [ ] Integração com banco de dados

---

## 👔 Páginas de Coordenador

### Painel (`/coordenador/painel`)
- [ ] Página carrega corretamente
- [ ] Estatísticas exibidas (professores, turmas, alunos)
- [ ] Gráfico de engajamento exibido
- [ ] Navegação para outras páginas funciona
- [ ] Integração com banco de dados

### Professores (`/coordenador/professores`)
- [ ] Página carrega corretamente
- [ ] Lista de professores exibida
- [ ] Busca e filtros funcionam
- [ ] Integração com banco de dados

### Novo Professor (`/coordenador/professores/novo`)
- [ ] Página carrega corretamente
- [ ] Formulário de criação exibido
- [ ] Validação de campos
- [ ] Criação de professor funciona
- [ ] Integração com banco de dados

### Alunos (`/coordenador/alunos`)
- [ ] Página carrega corretamente
- [ ] Lista de alunos exibida
- [ ] Busca e filtros funcionam
- [ ] Integração com banco de dados

### Novo Aluno (`/coordenador/alunos/novo`)
- [ ] Página carrega corretamente
- [ ] Formulário de criação exibido
- [ ] Validação de campos
- [ ] Seleção de turma funciona
- [ ] Criação de aluno funciona
- [ ] Integração com banco de dados

### Turmas (`/coordenador/turmas`)
- [ ] Página carrega corretamente
- [ ] Lista de turmas exibida
- [ ] Busca e filtros funcionam
- [ ] Integração com banco de dados

### Nova Turma (`/coordenador/turmas/nova`)
- [ ] Página carrega corretamente
- [ ] Formulário de criação exibido
- [ ] Validação de campos
- [ ] Seleção de professor funciona
- [ ] Criação de turma funciona
- [ ] Integração com banco de dados

### Comunicado (`/coordenador/comunicado`)
- [ ] Página carrega corretamente
- [ ] Formulário de envio exibido
- [ ] Validação de campos
- [ ] Seleção de turma funciona
- [ ] Envio de comunicado funciona
- [ ] Integração com banco de dados

### Notificações (`/coordenador/notificacoes`)
- [ ] Página carrega corretamente
- [ ] Lista de notificações exibida
- [ ] Integração com banco de dados

---

## 👨‍👩‍👧 Páginas de Pais

### Painel (`/pais/painel`)
- [ ] Página carrega corretamente
- [ ] Seleção de filho funciona
- [ ] Resumo semanal exibido
- [ ] Atividades recentes exibidas
- [ ] Integração com banco de dados

### Comunicados (`/pais/comunicados`)
- [ ] Página carrega corretamente
- [ ] Lista de comunicados exibida
- [ ] Detalhes do comunicado exibidos
- [ ] Integração com banco de dados

### Nova Tarefa (`/pais/tarefas/nova`)
- [ ] Página carrega corretamente
- [ ] Formulário de criação exibido
- [ ] Validação de campos
- [ ] Seleção de filho funciona
- [ ] Criação de tarefa funciona
- [ ] Integração com banco de dados

---

## 🗄️ Validação de Banco de Dados

### Tabelas Principais
- [ ] Tabela `users` existe e tem dados
- [ ] Tabela `students` existe e tem dados
- [ ] Tabela `teachers` existe e tem dados
- [ ] Tabela `coordinators` existe e tem dados
- [ ] Tabela `parents` existe e tem dados
- [ ] Tabela `classrooms` (ou `turmas`) existe e tem dados
- [ ] Tabela `subjects` (ou `materias`) existe e tem dados
- [ ] Tabela `lesson_plans` (ou `licoes`) existe e tem dados
- [ ] Tabela `questions` existe e tem dados
- [ ] Tabela `student_subject_performance` existe e tem dados

### Row Level Security (RLS)
- [ ] RLS habilitado em todas as tabelas públicas
- [ ] Políticas RLS configuradas corretamente
- [ ] Usuários autenticados podem acessar dados permitidos
- [ ] Usuários não autenticados não podem acessar dados privados
- [ ] Coordenadores podem gerenciar todos os recursos
- [ ] Professores podem ver seus alunos
- [ ] Alunos podem ver seus próprios dados
- [ ] Pais podem ver dados de seus filhos

### Dados de Teste
- [ ] Usuário coordenador existe (`coordenador@teste.com`)
- [ ] Usuário professor existe (`professor@teste.com`)
- [ ] Usuário aluno existe (`aluno@teste.com`)
- [ ] Usuário pai existe (`pais@teste.com`)
- [ ] Dados de teste criados corretamente
- [ ] Relacionamentos entre tabelas corretos

### Integridade Referencial
- [ ] Foreign keys configuradas corretamente
- [ ] Constraints funcionam
- [ ] Triggers funcionam (se houver)

---

## 🔌 Validação de Integração

### Supabase Auth
- [ ] Autenticação funciona corretamente
- [ ] Sessões persistem entre recarregamentos
- [ ] Cookies salvos corretamente
- [ ] Middleware detecta sessão
- [ ] Logout remove sessão

### Supabase Database
- [ ] Conexão com banco funciona
- [ ] Queries retornam dados corretos
- [ ] Inserts funcionam
- [ ] Updates funcionam
- [ ] Deletes funcionam
- [ ] Fallback para tabelas em português funciona

### Supabase Realtime
- [ ] Subscriptions funcionam
- [ ] Novas mensagens aparecem em tempo real
- [ ] Atualizações aparecem em tempo real

### API Routes
- [ ] `/api/admin/criar-aluno` funciona
- [ ] `/api/admin/criar-professor` funciona
- [ ] Validação de dados nas rotas
- [ ] Tratamento de erros nas rotas

---

## 🎣 Hooks Customizados

### useAuth
- [ ] Hook funciona corretamente
- [ ] Estado de autenticação atualizado
- [ ] Funções de login/logout funcionam
- [ ] Carregamento de perfil funciona

### useAluno
- [ ] Hook funciona corretamente
- [ ] Dados do aluno carregados
- [ ] Atualização de dados funciona

### useProfessor
- [ ] Hook funciona corretamente
- [ ] Lista de alunos carregada
- [ ] Dados do professor carregados

### useCoordenador
- [ ] Hook funciona corretamente
- [ ] Estatísticas carregadas
- [ ] Engajamento carregado
- [ ] Envio de comunicado funciona

### usePais
- [ ] Hook funciona corretamente
- [ ] Lista de filhos carregada
- [ ] Dados dos filhos carregados

### useChat
- [ ] Hook funciona corretamente
- [ ] Mensagens carregadas
- [ ] Envio de mensagens funciona
- [ ] Realtime funciona

### useAmizades
- [ ] Hook funciona corretamente
- [ ] Lista de amigos carregada
- [ ] Busca de usuários funciona
- [ ] Solicitações de amizade funcionam

### useMaterias
- [ ] Hook funciona corretamente
- [ ] Lista de matérias carregada

### useTrilha
- [ ] Hook funciona corretamente
- [ ] Dados da trilha carregados

### useLicao
- [ ] Hook funciona corretamente
- [ ] Dados da lição carregados
- [ ] Questões carregadas

### useProgresso
- [ ] Hook funciona corretamente
- [ ] Progresso carregado
- [ ] Atualização de progresso funciona

### useConquistas
- [ ] Hook funciona corretamente
- [ ] Conquistas carregadas

### useRanking
- [ ] Hook funciona corretamente
- [ ] Ranking carregado

### useLoja
- [ ] Hook funciona corretamente
- [ ] Itens da loja carregados
- [ ] Compra de itens funciona

---

## ⚠️ Tratamento de Erros

### Erros de Rede
- [ ] Erros 404 tratados corretamente
- [ ] Erros 500 tratados corretamente
- [ ] Timeouts tratados corretamente
- [ ] Mensagens de erro exibidas ao usuário

### Erros de Validação
- [ ] Validação de formulários funciona
- [ ] Mensagens de erro exibidas
- [ ] Campos inválidos destacados

### Erros de RLS
- [ ] Erros de permissão tratados
- [ ] Mensagens apropriadas exibidas
- [ ] Fallback para tabelas alternativas funciona

### Erros de Banco de Dados
- [ ] Erros de conexão tratados
- [ ] Erros de query tratados
- [ ] Mensagens de erro exibidas

### Error Boundaries
- [ ] ErrorBoundary funciona corretamente
- [ ] Erros capturados e exibidos
- [ ] Opção de recarregar página

---

## 📱 Responsividade

### Mobile
- [ ] Todas as páginas funcionam em mobile
- [ ] Layout responsivo
- [ ] Touch-friendly
- [ ] Safe areas respeitadas

### Tablet
- [ ] Todas as páginas funcionam em tablet
- [ ] Layout adaptado

### Desktop
- [ ] Todas as páginas funcionam em desktop
- [ ] Layout otimizado

---

## 🎨 UI/UX

### Loading States
- [ ] Loading skeletons exibidos
- [ ] Spinners exibidos durante carregamento
- [ ] Estados de loading consistentes

### Empty States
- [ ] Empty states exibidos quando não há dados
- [ ] Mensagens apropriadas
- [ ] Ações sugeridas

### Feedback Visual
- [ ] Mensagens de sucesso exibidas
- [ ] Mensagens de erro exibidas
- [ ] Animações suaves

---

## 📝 Notas

- Data de criação: 2025-01-09
- Última atualização: 2025-01-09
- Status: Em progresso

