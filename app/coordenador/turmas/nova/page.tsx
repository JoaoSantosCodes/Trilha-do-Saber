'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/Button'
import Input from '@/components/Input'
import { supabase } from '@/supabase/config'
import { useAuth } from '@/contexts/AuthContext'

export default function NovaTurmaPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [nome, setNome] = useState('')
  const [codigo, setCodigo] = useState('')
  const [professorId, setProfessorId] = useState('')
  const [serie, setSerie] = useState('')
  const [periodo, setPeriodo] = useState<'manha' | 'tarde' | 'noite'>('manha')
  const [anoLetivo, setAnoLetivo] = useState('')
  const [professores, setProfessores] = useState<{ id: string; nome: string }[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [loadingProfessores, setLoadingProfessores] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProfessores()
  }, [])

  const fetchProfessores = async () => {
    try {
      setLoadingProfessores(true)
      
      // Verificar se há sessão válida antes de fazer queries
      console.log('Verificando sessão...')
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      console.log('Sessão:', session ? 'EXISTE' : 'NÃO EXISTE', 'Token:', session?.access_token ? 'EXISTE' : 'NÃO EXISTE')
      
      if (!session || !session.access_token) {
        console.warn('Nenhuma sessão válida encontrada', sessionError)
        setProfessores([])
        setLoadingProfessores(false)
        return
      }
      
      // Tentar teachers primeiro, depois professores (fallback)
      let professoresIds: string[] = []
      
      // 1. Buscar professores de teachers
      // Tentar primeiro com autenticação, depois sem
      console.log('Buscando professores de teachers...')
      const teachersResult = await supabase
        .from('teachers')
        .select('user_id')
        .limit(100)

      console.log('Resultado teachers:', teachersResult.error ? 'ERRO' : 'SUCESSO', teachersResult.data?.length || 0)

      if (teachersResult.error || !teachersResult.data || teachersResult.data.length === 0) {
        // Se erro ou sem dados, tentar fallback para professores
        console.log('Tentando fallback para professores...')
        const professoresResult = await supabase
          .from('professores')
          .select('id')
          .eq('status', 'ativo')
          .limit(100)
        
        console.log('Resultado professores (fallback):', professoresResult.error ? 'ERRO' : 'SUCESSO', professoresResult.data?.length || 0)
        
        if (!professoresResult.error && professoresResult.data) {
          professoresIds = professoresResult.data.map((p) => p.id)
        } else {
          console.warn('Erro ao buscar professores (fallback):', professoresResult.error)
        }
      } else {
        // Se teachers funcionou, usar user_id
        professoresIds = teachersResult.data?.map((t) => t.user_id).filter(Boolean) || []
      }

      if (professoresIds.length === 0) {
        console.warn('Nenhum professor encontrado')
        setProfessores([])
        setLoadingProfessores(false)
        return
      }

      // 2. Buscar perfis dos professores
      // Tentar users primeiro, depois profiles (fallback)
      let perfis: any[] | null = null
      let errPerfis: any = null
      
      console.log('Buscando perfis de professores...', professoresIds.length, 'IDs')
      const usersResult = await supabase
        .from('users')
        .select('id, name, role')
        .in('id', professoresIds)
        .eq('role', 'teacher')
        .limit(100)
      
      console.log('Resultado users:', usersResult.error ? 'ERRO' : 'SUCESSO', usersResult.data?.length || 0)

      if (usersResult.error || !usersResult.data || usersResult.data.length === 0) {
        // Se erro ou sem dados, tentar fallback para profiles
        console.log('Tentando fallback para profiles...')
        const profilesResult = await supabase
          .from('profiles')
          .select('id, full_name, username')
          .in('id', professoresIds)
          .eq('role', 'professor')
          .limit(100)
        
        console.log('Resultado profiles (fallback):', profilesResult.error ? 'ERRO' : 'SUCESSO', profilesResult.data?.length || 0)
        
        perfis = profilesResult.data
        errPerfis = profilesResult.error
      } else {
        perfis = usersResult.data?.map((u: any) => ({
          id: u.id,
          full_name: u.name || null,
          username: u.name?.split(' ')[0] || null
        })) || null
      }

      if (errPerfis && !errPerfis.message?.includes('does not exist')) {
        console.warn('Erro ao buscar perfis:', errPerfis)
      }

      const professoresFormatados =
        perfis?.map((perfil) => ({
          id: perfil.id,
          nome: perfil.full_name || perfil.username || 'Professor',
        })) || []

      if (professoresFormatados.length === 0) {
        console.warn('Nenhum professor formatado encontrado')
      } else {
        console.log('Professores formatados:', professoresFormatados.length, professoresFormatados)
      }
      console.log('Definindo professores:', professoresFormatados.length)
      setProfessores(professoresFormatados)
    } catch (err: any) {
      console.error('Erro ao buscar professores:', err)
      setProfessores([])
    } finally {
      console.log('Finalizando busca de professores - desativando loading')
      setLoadingProfessores(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!nome.trim()) {
      setError('Digite o nome da turma')
      return
    }

    if (!codigo.trim()) {
      setError('Digite o código da turma')
      return
    }

    if (!professorId) {
      setError('Selecione um professor')
      return
    }

    setIsLoading(true)

    try {
      // Verificar se código já existe
      // Tentar classrooms primeiro, depois turmas (fallback)
      let codigoExistente: any = null
      
      const classroomsResult = await supabase
        .from('classrooms')
        .select('id')
        .eq('name', codigo.trim())
        .maybeSingle()

      if (classroomsResult.error && !classroomsResult.error.message?.includes('does not exist')) {
        throw classroomsResult.error
      }

      if (classroomsResult.data) {
        codigoExistente = classroomsResult.data
      } else {
        // Fallback para turmas
        const turmasResult = await supabase
          .from('turmas')
          .select('id')
          .eq('codigo', codigo.trim())
          .maybeSingle()

        if (turmasResult.error && turmasResult.error.code !== 'PGRST116') {
          throw turmasResult.error
        }

        if (turmasResult.data) {
          codigoExistente = turmasResult.data
        }
      }

      if (codigoExistente) {
        setError('Este código de turma já está em uso')
        setIsLoading(false)
        return
      }

      // Criar turma
      // Tentar classrooms primeiro, depois turmas (fallback)
      // Para classrooms, precisamos do teacher_id (que é o id da tabela teachers, não user_id)
      // Mas temos o user_id do professor, então precisamos buscar o id do teacher
      let teacherTableId: string | null = null
      
      const teacherRecord = await supabase
        .from('teachers')
        .select('id')
        .eq('user_id', professorId)
        .maybeSingle()

      if (!teacherRecord.error && teacherRecord.data) {
        teacherTableId = teacherRecord.data.id
      }

      // Tentar criar em classrooms primeiro
      let turmaError: any = null
      
      if (teacherTableId) {
        const classroomsInsertResult = await supabase.from('classrooms').insert({
          name: nome.trim(),
          teacher_id: teacherTableId,
          grade_level: parseInt(serie) || 1,
          shift: periodo,
          is_active: true,
        })

        if (classroomsInsertResult.error) {
          turmaError = classroomsInsertResult.error
        }
      } else {
        // Se não encontrou teacher_id, tentar criar em turmas
        turmaError = { message: 'Teacher not found, trying turmas' }
      }

      // Se deu erro em classrooms ou não encontrou teacher_id, tentar turmas
      if (turmaError || !teacherTableId) {
        const turmasInsertResult = await supabase.from('turmas').insert({
          nome: nome.trim(),
          codigo: codigo.trim(),
          professor_id: professorId,
          serie: serie.trim() || null,
          periodo: periodo,
          ano_letivo: anoLetivo.trim() || null,
          ativo: true,
        })

        if (turmasInsertResult.error) {
          throw turmasInsertResult.error
        }
      }

      // Redirecionar de volta à lista
      router.push('/coordenador/turmas')
    } catch (err: any) {
      setError(err.message || 'Erro ao criar turma')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-dark text-gray-200">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center bg-background-dark/95 p-3 sm:p-4 pb-2 backdrop-blur-sm justify-between safe-area-top">
        <div className="flex size-10 sm:size-12 shrink-0 items-center justify-start">
          <button onClick={() => router.back()} className="touch-manipulation active:opacity-70" aria-label="Voltar">
            <span className="material-symbols-outlined text-white text-xl sm:text-2xl">arrow_back</span>
          </button>
        </div>
        <h1 className="text-white text-base sm:text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center px-2 truncate">
          Nova Turma
        </h1>
        <div className="flex w-10 sm:w-12 items-center justify-end"></div>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-3 sm:px-4 py-3 sm:py-4 overflow-y-auto smooth-scroll pb-24 sm:pb-28 safe-area-bottom">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-6">
          {/* Nome */}
          <div>
            <Input
              label="Nome da Turma"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Turma 301 - Manhã"
              required
            />
          </div>

          {/* Código */}
          <div>
            <Input
              label="Código da Turma"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="Ex: TURMA-301-M"
              required
            />
            <p className="text-gray-400 text-xs mt-1">Código único para identificar a turma</p>
          </div>

          {/* Professor */}
          <div>
            <label className="text-white text-xs sm:text-sm font-medium mb-2 block">Professor Responsável</label>
            {loadingProfessores ? (
              <div className="flex items-center justify-center py-3 sm:py-4">
                <span className="material-symbols-outlined animate-spin text-xl sm:text-2xl text-white">
                  refresh
                </span>
              </div>
            ) : (
              <select
                value={professorId}
                onChange={(e) => setProfessorId(e.target.value)}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-3 sm:px-4 py-2.5 sm:py-3 text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary touch-manipulation"
                required
              >
                <option value="">Selecione um professor</option>
                {professores.map((prof) => (
                  <option key={prof.id} value={prof.id}>
                    {prof.nome}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Série */}
          <div>
            <Input
              label="Série (opcional)"
              value={serie}
              onChange={(e) => setSerie(e.target.value)}
              placeholder="Ex: 3º Ano, 1º Ano"
            />
          </div>

          {/* Período */}
          <div>
            <label className="text-white text-xs sm:text-sm font-medium mb-2 block">Período</label>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {[
                { value: 'manha', label: 'Manhã', icon: 'wb_sunny' },
                { value: 'tarde', label: 'Tarde', icon: 'brightness_4' },
                { value: 'noite', label: 'Noite', icon: 'nights_stay' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setPeriodo(option.value as any)}
                  className={`flex flex-col items-center justify-center gap-1.5 sm:gap-2 rounded-xl p-3 sm:p-4 transition-colors touch-manipulation active:opacity-80 ${
                    periodo === option.value
                      ? 'bg-primary text-background-dark'
                      : 'bg-white/5 text-white hover:bg-white/10 active:bg-white/15'
                  }`}
                >
                  <span className="material-symbols-outlined text-2xl sm:text-3xl">{option.icon}</span>
                  <p className="text-xs sm:text-sm font-bold">{option.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Ano Letivo */}
          <div>
            <Input
              label="Ano Letivo (opcional)"
              value={anoLetivo}
              onChange={(e) => setAnoLetivo(e.target.value)}
              placeholder="Ex: 2024"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-xl bg-red-500/20 border border-red-500/50 p-3 sm:p-4">
              <p className="text-red-400 text-xs sm:text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4">
            <Button
              type="button"
              onClick={() => router.back()}
              className="flex-1 bg-white/20 text-white h-12 sm:h-14 text-sm sm:text-base touch-manipulation"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !nome.trim() || !codigo.trim() || !professorId}
              className="flex-1 bg-primary text-background-dark h-12 sm:h-14 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined animate-spin text-lg sm:text-xl">refresh</span>
                  <span className="text-xs sm:text-sm">Criando...</span>
                </span>
              ) : (
                'Criar Turma'
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}

