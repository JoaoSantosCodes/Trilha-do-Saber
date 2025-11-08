// Hook para buscar dados do aluno
import { useState, useEffect } from 'react'
import { supabase } from '@/supabase/config'
import { useAuth } from '@/contexts/AuthContext'

export interface AlunoData {
  id: string
  data_nascimento: string | null
  serie: string | null
  pontos: number
  moedas: number
  sequencia_atual: number
  cor_fundo_perfil: string
  icone_conquista_favorito: string | null
  created_at: string
  updated_at: string
}

export function useAluno() {
  const { user } = useAuth()
  const [aluno, setAluno] = useState<AlunoData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchAluno()
    } else {
      setLoading(false)
    }
  }, [user])

  const fetchAluno = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      // Tentar students primeiro, depois alunos (fallback)
      let alunoData: any = null
      let err: any = null
      
      const studentsResult = await supabase
        .from('students')
        .select('user_id as id, grade as serie, total_points as pontos, level as sequencia_atual')
        .eq('user_id', user.id)
        .single()

      if (studentsResult.error && studentsResult.error.message?.includes('does not exist')) {
        const alunosResult = await supabase
          .from('alunos')
          .select('*')
          .eq('id', user.id)
          .single()
        alunoData = alunosResult.data
        err = alunosResult.error
      } else {
        // Mapear students para formato de alunos
        alunoData = studentsResult.data ? {
          id: studentsResult.data.id,
          data_nascimento: null,
          serie: studentsResult.data.serie?.toString() || null,
          pontos: studentsResult.data.pontos || 0,
          moedas: 0, // students não tem moedas
          sequencia_atual: studentsResult.data.sequencia_atual || 0,
          cor_fundo_perfil: '#E57373',
          icone_conquista_favorito: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } : null
        err = studentsResult.error
      }

      if (err && !err.message?.includes('No rows')) throw err
      setAluno(alunoData)
    } catch (err: any) {
      setError(err.message)
      console.error('Erro ao buscar dados do aluno:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateAluno = async (updates: Partial<AlunoData>) => {
    if (!user) return { error: 'Usuário não autenticado' }

    try {
      // Tentar students primeiro, depois alunos (fallback)
      let data: any = null
      let err: any = null
      
      // Mapear updates para formato de students
      const studentsUpdates: any = {}
      if (updates.pontos !== undefined) studentsUpdates.total_points = updates.pontos
      if (updates.sequencia_atual !== undefined) studentsUpdates.level = updates.sequencia_atual
      if (updates.serie !== undefined) studentsUpdates.grade = parseInt(updates.serie) || 1
      
      const studentsResult = await supabase
        .from('students')
        .update(studentsUpdates)
        .eq('user_id', user.id)
        .select('user_id as id, grade as serie, total_points as pontos, level as sequencia_atual')
        .single()

      if (studentsResult.error && studentsResult.error.message?.includes('does not exist')) {
        const alunosResult = await supabase
          .from('alunos')
          .update(updates)
          .eq('id', user.id)
          .select()
          .single()
        data = alunosResult.data
        err = alunosResult.error
      } else {
        // Mapear de volta para formato de alunos
        data = studentsResult.data ? {
          ...aluno,
          ...updates,
          id: studentsResult.data.id,
          pontos: studentsResult.data.pontos || 0,
          sequencia_atual: studentsResult.data.sequencia_atual || 0,
          serie: studentsResult.data.serie?.toString() || null
        } : null
        err = studentsResult.error
      }

      if (err && !err.message?.includes('No rows')) throw err
      
      if (data) setAluno(data)
      return { data, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  }

  return { aluno, loading, error, refetch: fetchAluno, updateAluno }
}

