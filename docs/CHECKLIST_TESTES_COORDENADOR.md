# Checklist de Testes - Coordenador

## 🎯 Objetivo
Testar todas as páginas e funções do coordenador como se fosse um usuário real.

---

## ✅ Teste 1: Login
- [ ] Acessar página de login
- [ ] Preencher email: `coordenador@teste.com`
- [ ] Preencher senha: `teste123`
- [ ] Clicar em "Entrar"
- [ ] Verificar redirecionamento para `/coordenador/painel`
- [ ] Verificar se não há erros no console

---

## ✅ Teste 2: Painel do Coordenador (Dashboard)
- [ ] Acessar `/coordenador/painel`
- [ ] Verificar se os cards de estatísticas aparecem:
  - [ ] Gerenciar Professores (contador)
  - [ ] Gerenciar Turmas (contador)
  - [ ] Gerenciar Alunos (contador)
- [ ] Verificar se os botões funcionam:
  - [ ] "Ver Lista" (professores)
  - [ ] "Ver Todas" (turmas)
  - [ ] "Buscar Aluno" (alunos)
- [ ] Verificar se não há erros no console

---

## ✅ Teste 3: Listagem de Professores
- [ ] Acessar `/coordenador/professores`
- [ ] Verificar se a lista de professores aparece
- [ ] Verificar se há filtros e ordenação
- [ ] Verificar se o botão "Novo Professor" aparece
- [ ] Verificar se não há erros no console

---

## ✅ Teste 4: Criação de Professor
- [ ] Acessar `/coordenador/professores/novo`
- [ ] Preencher formulário:
  - [ ] Nome: `Professor Teste`
  - [ ] Email: `professor.teste@escola.com`
  - [ ] Senha: `teste123`
  - [ ] Matrícula: `PROF-001`
- [ ] Clicar em "Criar Professor"
- [ ] Verificar se o professor foi criado com sucesso
- [ ] Verificar redirecionamento para lista de professores
- [ ] Verificar se o novo professor aparece na lista
- [ ] Verificar se não há erros no console

---

## ✅ Teste 5: Listagem de Turmas
- [ ] Acessar `/coordenador/turmas`
- [ ] Verificar se a lista de turmas aparece
- [ ] Verificar se há filtros e ordenação
- [ ] Verificar se o botão "Nova Turma" aparece
- [ ] Verificar se não há erros no console

---

## ✅ Teste 6: Criação de Turma
- [ ] Acessar `/coordenador/turmas/nova`
- [ ] Verificar se o select de professores está preenchido
- [ ] Preencher formulário:
  - [ ] Nome da Turma: `Turma 301 - Manhã`
  - [ ] Código da Turma: `TURMA-301-M`
  - [ ] Professor Responsável: Selecionar um professor
  - [ ] Série: `3º Ano`
  - [ ] Período: Selecionar um período
  - [ ] Ano Letivo: `2024`
- [ ] Clicar em "Criar Turma"
- [ ] Verificar se a turma foi criada com sucesso
- [ ] Verificar redirecionamento para lista de turmas
- [ ] Verificar se a nova turma aparece na lista
- [ ] Verificar se não há erros no console

---

## ✅ Teste 7: Listagem de Alunos
- [ ] Acessar `/coordenador/alunos`
- [ ] Verificar se a lista de alunos aparece
- [ ] Verificar se há filtros e ordenação
- [ ] Verificar se o botão "Novo Aluno" aparece
- [ ] Verificar se não há erros no console

---

## ✅ Teste 8: Criação de Aluno
- [ ] Acessar `/coordenador/alunos/novo`
- [ ] Verificar se o select de turmas está preenchido
- [ ] Preencher formulário:
  - [ ] Nome: `Aluno Teste`
  - [ ] Email: `aluno.teste@escola.com`
  - [ ] Senha: `teste123`
  - [ ] Data de Nascimento: `2010-01-01`
  - [ ] Turma: Selecionar uma turma
  - [ ] Série: `3º Ano`
- [ ] Clicar em "Criar Aluno"
- [ ] Verificar se o aluno foi criado com sucesso
- [ ] Verificar redirecionamento para lista de alunos
- [ ] Verificar se o novo aluno aparece na lista
- [ ] Verificar se não há erros no console

---

## ✅ Teste 9: Envio de Comunicado
- [ ] Acessar `/coordenador/comunicado`
- [ ] Preencher formulário:
  - [ ] Tipo: Selecionar um tipo
  - [ ] Turma: Selecionar uma turma (ou "Geral")
  - [ ] Título: `Comunicado Teste`
  - [ ] Conteúdo: `Este é um comunicado de teste`
- [ ] Clicar em "Enviar Comunicado"
- [ ] Verificar se o comunicado foi enviado com sucesso
- [ ] Verificar se não há erros no console

---

## ✅ Teste 10: Notificações
- [ ] Acessar `/coordenador/notificacoes`
- [ ] Verificar se a página carrega corretamente
- [ ] Verificar se não há erros no console

---

## ✅ Teste 11: Navegação e Menu
- [ ] Verificar se o menu lateral funciona
- [ ] Verificar se os links de navegação funcionam
- [ ] Verificar se o botão de logout funciona
- [ ] Verificar se não há erros no console

---

## 📊 Resultados dos Testes

### Testes Passados: 0/11
### Testes Falhados: 0/11
### Erros Encontrados: 0

---

## 🔍 Observações

- Anotar qualquer erro encontrado
- Anotar qualquer comportamento inesperado
- Anotar sugestões de melhoria

---

## ✅ Próximos Passos

Após completar todos os testes:
1. Documentar resultados
2. Corrigir erros encontrados
3. Testar novamente as correções

