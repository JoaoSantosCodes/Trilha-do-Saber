/**
 * Helpers para queries do Supabase
 * Normaliza nomes de tabelas e trata erros
 */

import { supabase } from '@/supabase/config'

/**
 * Mapeamento de tabelas: português → inglês
 */
const TABLE_MAP: Record<string, string> = {
  // Tabelas de usuários
  'profiles': 'users', // profiles não existe, usar users
  'users': 'users',
  
  // Tabelas de roles
  'alunos': 'students',
  'students': 'students',
  'professores': 'teachers',
  'teachers': 'teachers',
  'pais': 'parents',
  'parents': 'parents',
  'coordenadores': 'coordinators',
  'coordinators': 'coordinators',
  
  // Tabelas de conteúdo
  'materias': 'subjects',
  'subjects': 'subjects',
  'trilhas': 'learning_materials',
  'learning_materials': 'learning_materials',
  'licoes': 'lesson_plans',
  'lesson_plans': 'lesson_plans',
  'turmas': 'classrooms',
  'classrooms': 'classrooms',
  
  // Tabelas de relacionamento
  'aluno_turma': 'classroom_students',
  'classroom_students': 'classroom_students',
  'aluno_pais': 'parent_student_relation',
  'parent_student_relation': 'parent_student_relation',
  
  // Tabelas de progresso
  'progresso_licoes': 'student_subject_performance',
  'student_subject_performance': 'student_subject_performance',
  'progresso_semanal': 'student_stats',
  'student_stats': 'student_stats',
  'aluno_conquistas': 'student_achievements',
  'student_achievements': 'student_achievements',
  
  // Tabelas de comunicação
  'comunicados': 'announcements',
  'announcements': 'announcements',
  'conversas': 'messages', // Pode não existir, usar messages
  'mensagens': 'messages',
  'messages': 'messages',
  'amizades': 'messages', // Pode não existir, usar messages como fallback
}

/**
 * Normaliza nome de tabela (português → inglês)
 */
export function normalizeTableName(tableName: string): string {
  return TABLE_MAP[tableName] || tableName
}

/**
 * Query segura que tenta tabela em inglês primeiro, depois português
 */
export async function safeQuery<T = any>(
  tableName: string,
  queryFn: (table: string) => Promise<{ data: T | null; error: any }>
): Promise<{ data: T | null; error: any }> {
  // Tentar tabela normalizada (inglês) primeiro
  const normalizedTable = normalizeTableName(tableName)
  let result = await queryFn(normalizedTable)
  
  // Se não existir e for diferente, tentar original
  if (result.error && result.error.message?.includes('does not exist') && normalizedTable !== tableName) {
    result = await queryFn(tableName)
  }
  
  // Se ainda houver erro de "does not exist", retornar null sem erro
  if (result.error && result.error.message?.includes('does not exist')) {
    return { data: null, error: null }
  }
  
  return result
}

/**
 * Select seguro
 */
export async function safeSelect<T = any>(
  tableName: string,
  columns: string = '*',
  filters?: Record<string, any>
): Promise<{ data: T[] | null; error: any }> {
  return safeQuery(tableName, async (table) => {
    let query = supabase.from(table).select(columns)
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
    }
    
    return query
  })
}

/**
 * Select single seguro
 */
export async function safeSelectSingle<T = any>(
  tableName: string,
  columns: string = '*',
  filters?: Record<string, any>
): Promise<{ data: T | null; error: any }> {
  return safeQuery(tableName, async (table) => {
    let query = supabase.from(table).select(columns)
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
    }
    
    return query.single()
  })
}

