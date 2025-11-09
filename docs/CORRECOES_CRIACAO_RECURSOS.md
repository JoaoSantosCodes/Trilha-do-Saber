# Correções na Criação de Recursos

## 📋 Problemas Identificados e Corrigidos

### 1. Criação de Professor
**Problema**: 
- Tentava inserir `employee_id` na tabela `teachers`, mas essa coluna não existe
- Verificação de matrícula falhava porque `teachers` não tem essa coluna

**Solução**:
- Removida tentativa de inserir `employee_id` em `teachers`
- Verificação de matrícula agora só verifica em `professores` (se existir)
- Criação em `teachers` agora usa apenas `user_id`
- Verificação de email melhorada para usar `maybeSingle()` e verificar também em `auth.users`

**Arquivo**: `app/api/admin/criar-professor/route.ts`

### 2. Criação de Turma
**Problema**: 
- Buscava professores apenas de `professores`, não de `teachers`
- Criava turma apenas em `turmas`, não em `classrooms`
- Usava `professor_id` mas `classrooms` usa `teacher_id` (que é o id da tabela teachers, não user_id)

**Solução**:
- Busca de professores agora tenta `teachers` primeiro, depois `professores` (fallback)
- Criação de turma agora tenta `classrooms` primeiro, depois `turmas` (fallback)
- Para `classrooms`, busca o `id` da tabela `teachers` usando o `user_id` do professor
- Para `turmas`, usa `professor_id` diretamente (user_id)

**Arquivo**: `app/coordenador/turmas/nova/page.tsx`

### 3. Criação de Aluno
**Problema**: 
- Associação à turma usava apenas `aluno_turma`, não `classroom_students`

**Solução**:
- Associação à turma agora tenta `classroom_students` primeiro (se for `classroom`), depois `aluno_turma` (se for `turma`)
- Verifica se `turmaId` é de `classrooms` ou `turmas` antes de associar

**Arquivo**: `app/api/admin/criar-aluno/route.ts`

## ✅ Fluxo Corrigido

### Criar Professor
1. Verificar se email já existe (users, profiles, auth.users)
2. Verificar se matrícula já existe (professores, se existir)
3. Criar usuário em `auth.users`
4. Criar/atualizar perfil em `users` (ou `profiles` como fallback)
5. Criar registro em `teachers` (ou `professores` como fallback)

### Criar Turma
1. Buscar professores de `teachers` (ou `professores` como fallback)
2. Verificar se código já existe em `classrooms` (ou `turmas` como fallback)
3. Buscar `id` da tabela `teachers` usando `user_id` do professor
4. Criar turma em `classrooms` (ou `turmas` como fallback)
   - `classrooms`: usa `teacher_id` (id da tabela teachers)
   - `turmas`: usa `professor_id` (user_id)

### Criar Aluno
1. Verificar se email já existe
2. Criar usuário em `auth.users`
3. Criar/atualizar perfil em `users` (ou `profiles` como fallback)
4. Criar registro em `students` (ou `alunos` como fallback)
5. Associar à turma em `classroom_students` (ou `aluno_turma` como fallback)

## 📝 Próximos Passos

1. Testar criação de professor
2. Testar criação de turma
3. Testar criação de aluno
4. Validar fluxo completo: professor -> turma -> aluno

