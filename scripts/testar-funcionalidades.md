# 🧪 Guia de Testes Manuais - Trilha do Saber

**Data**: Dezembro 2024  
**Status**: ✅ **Guia de Testes Criado**

---

## 📋 Checklist de Testes

### 1. Autenticação

#### Login
- [ ] Acessar `/login`
- [ ] Inserir email e senha válidos
- [ ] Verificar redirecionamento baseado no role
- [ ] Testar com credenciais inválidas
- [ ] Verificar mensagens de erro

#### Cadastro
- [ ] Acessar `/cadastro`
- [ ] Preencher formulário completo
- [ ] Selecionar role (aluno, professor, coordenador, pais)
- [ ] Verificar validação de campos
- [ ] Testar cadastro com email já existente
- [ ] Verificar redirecionamento após cadastro

#### Recuperação de Senha
- [ ] Acessar `/esqueci-senha`
- [ ] Inserir email válido
- [ ] Verificar envio de email de recuperação
- [ ] Testar com email inválido

---

### 2. Módulo do Aluno

#### Matérias
- [ ] Acessar `/aluno/materias`
- [ ] Verificar listagem de matérias
- [ ] Acessar detalhes de uma matéria
- [ ] Verificar informações da matéria

#### Trilhas
- [ ] Acessar `/aluno/trilha/[materia]`
- [ ] Verificar listagem de lições
- [ ] Acessar uma lição
- [ ] Completar uma lição
- [ ] Verificar atualização de progresso

#### Perfil
- [ ] Acessar `/aluno/perfil`
- [ ] Verificar informações do perfil
- [ ] Acessar `/aluno/perfil/editar`
- [ ] Editar informações do perfil
- [ ] Salvar alterações
- [ ] Acessar perfil público `/aluno/perfil/[username]`

#### Ranking
- [ ] Acessar `/aluno/ranking`
- [ ] Verificar ranking global
- [ ] Verificar ranking de amigos
- [ ] Verificar pódio

#### Loja
- [ ] Acessar `/aluno/loja`
- [ ] Verificar listagem de itens
- [ ] Comprar um item
- [ ] Verificar dedução de moedas
- [ ] Verificar item no inventário

#### Amizades
- [ ] Acessar `/aluno/buscar-amigos`
- [ ] Buscar usuários
- [ ] Enviar pedido de amizade
- [ ] Acessar `/aluno/pedidos-amizade`
- [ ] Aceitar pedido de amizade
- [ ] Rejeitar pedido de amizade
- [ ] Verificar lista de amigos

---

### 3. Módulo do Professor

#### Painel
- [ ] Acessar `/professor/painel`
- [ ] Verificar estatísticas das turmas
- [ ] Selecionar uma turma
- [ ] Verificar listagem de alunos
- [ ] Verificar estatísticas da turma

#### Detalhes do Aluno
- [ ] Acessar `/professor/aluno/[id]`
- [ ] Verificar informações do aluno
- [ ] Verificar progresso do aluno
- [ ] Verificar estatísticas do aluno

---

### 4. Módulo dos Pais

#### Painel
- [ ] Acessar `/pais/painel`
- [ ] Verificar listagem de filhos
- [ ] Selecionar um filho
- [ ] Verificar progresso do filho
- [ ] Verificar conquistas do filho

#### Tarefas
- [ ] Acessar `/pais/tarefas/nova`
- [ ] Criar uma nova tarefa
- [ ] Selecionar filho
- [ ] Definir tipo de tarefa
- [ ] Definir meta e recompensa
- [ ] Salvar tarefa
- [ ] Verificar tarefa no painel

#### Comunicados
- [ ] Acessar `/pais/comunicados`
- [ ] Verificar listagem de comunicados
- [ ] Acessar detalhes de um comunicado
- [ ] Verificar notificações

---

### 5. Módulo do Coordenador

#### Painel
- [ ] Acessar `/coordenador/painel`
- [ ] Verificar estatísticas gerais
- [ ] Verificar gráficos e métricas

#### Turmas
- [ ] Acessar `/coordenador/turmas`
- [ ] Verificar listagem de turmas
- [ ] Criar nova turma
- [ ] Editar turma existente
- [ ] Verificar alunos da turma

#### Professores
- [ ] Acessar `/coordenador/professores`
- [ ] Verificar listagem de professores
- [ ] Criar novo professor
- [ ] Editar professor existente
- [ ] Verificar turmas do professor

#### Alunos
- [ ] Acessar `/coordenador/alunos`
- [ ] Verificar listagem de alunos
- [ ] Criar novo aluno
- [ ] Editar aluno existente
- [ ] Verificar turma do aluno

#### Comunicados
- [ ] Acessar `/coordenador/comunicado`
- [ ] Criar novo comunicado
- [ ] Selecionar destinatários
- [ ] Enviar comunicado
- [ ] Verificar envio

---

### 6. Chat

#### Conversas
- [ ] Acessar `/chat`
- [ ] Verificar listagem de conversas
- [ ] Iniciar nova conversa
- [ ] Acessar conversa existente
- [ ] Enviar mensagem
- [ ] Verificar mensagens em tempo real
- [ ] Verificar notificações

---

### 7. Funcionalidades Gerais

#### Tema
- [ ] Alternar entre tema claro e escuro
- [ ] Verificar persistência do tema
- [ ] Verificar aplicação do tema em todas as páginas

#### Navegação
- [ ] Verificar navegação entre páginas
- [ ] Verificar breadcrumbs
- [ ] Verificar botões de voltar
- [ ] Verificar links de navegação

#### Responsividade
- [ ] Testar em desktop
- [ ] Testar em tablet
- [ ] Testar em mobile
- [ ] Verificar layout responsivo

#### Performance
- [ ] Verificar tempo de carregamento
- [ ] Verificar lazy loading
- [ ] Verificar otimização de imagens
- [ ] Verificar cache

---

## 🐛 Problemas Conhecidos

Nenhum problema conhecido no momento.

---

## ✅ Resultado dos Testes

Após executar os testes, preencha:

- **Testes Executados**: ___ / ___
- **Testes Passando**: ___ / ___
- **Testes Falhando**: ___ / ___
- **Problemas Encontrados**: ___

---

## 📝 Notas

- Teste em diferentes navegadores (Chrome, Firefox, Safari, Edge)
- Teste em diferentes dispositivos
- Teste com diferentes roles de usuário
- Teste com dados válidos e inválidos

---

**Última atualização**: Dezembro 2024

