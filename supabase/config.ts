// Configuração do Supabase Client
// Este arquivo deve ser usado no lado do cliente (browser)

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  // Apenas logar em desenvolvimento
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.warn(
      '⚠️ Supabase URL ou Anon Key não configurados. Configure as variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY'
    )
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

// Tipos TypeScript para o banco de dados
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          username: string | null
          avatar_url: string | null
          role: 'aluno' | 'professor' | 'coordenador' | 'pais'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          username?: string | null
          avatar_url?: string | null
          role: 'aluno' | 'professor' | 'coordenador' | 'pais'
        }
        Update: {
          email?: string
          full_name?: string | null
          username?: string | null
          avatar_url?: string | null
          role?: 'aluno' | 'professor' | 'coordenador' | 'pais'
        }
      }
      alunos: {
        Row: {
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
        Insert: {
          id: string
          data_nascimento?: string | null
          serie?: string | null
          pontos?: number
          moedas?: number
          sequencia_atual?: number
          cor_fundo_perfil?: string
          icone_conquista_favorito?: string | null
        }
        Update: {
          data_nascimento?: string | null
          serie?: string | null
          pontos?: number
          moedas?: number
          sequencia_atual?: number
          cor_fundo_perfil?: string
          icone_conquista_favorito?: string | null
        }
      }
      materias: {
        Row: {
          id: string
          nome: string
          slug: string
          descricao: string | null
          cor_primaria: string | null
          cor_secundaria: string | null
          imagem_url: string | null
          icone: string | null
          ordem: number
          ativo: boolean
          created_at: string
          updated_at: string
        }
      }
      turmas: {
        Row: {
          id: string
          nome: string
          codigo: string
          professor_id: string
          serie: string | null
          periodo: 'manha' | 'tarde' | 'noite' | null
          ano_letivo: string | null
          ativo: boolean
          created_at: string
          updated_at: string
        }
      }
      licoes: {
        Row: {
          id: string
          trilha_id: string
          titulo: string
          descricao: string | null
          tipo: 'licao' | 'desafio'
          icone: string | null
          posicao_top: string | null
          posicao_left: string | null
          ordem: number
          pontos_recompensa: number
          moedas_recompensa: number
          created_at: string
          updated_at: string
        }
      }
      progresso_licoes: {
        Row: {
          id: string
          aluno_id: string
          licao_id: string
          status: 'bloqueada' | 'disponivel' | 'em_andamento' | 'concluida'
          pontos_ganhos: number
          moedas_ganhas: number
          tentativas: number
          acertos: number
          erros: number
          tempo_total_segundos: number
          data_inicio: string | null
          data_conclusao: string | null
          created_at: string
          updated_at: string
        }
      }
      amizades: {
        Row: {
          id: string
          aluno_id: string
          amigo_id: string
          status: 'pendente' | 'aceita' | 'recusada' | 'bloqueada'
          solicitado_por: string
          data_solicitacao: string
          data_resposta: string | null
          created_at: string
          updated_at: string
        }
      }
      itens_loja: {
        Row: {
          id: string
          nome: string
          descricao: string | null
          imagem_url: string
          categoria: 'avatar' | 'coruja' | 'powerup'
          subcategoria: string | null
          preco_moedas: number
          preco_pontos: number
          raridade: 'comum' | 'raro' | 'epico' | 'lendario' | null
          ativo: boolean
          ordem: number
          created_at: string
          updated_at: string
        }
      }
      inventario_aluno: {
        Row: {
          id: string
          aluno_id: string
          item_id: string
          equipado: boolean
          data_compra: string
        }
      }
      ranking_semanal: {
        Row: {
          id: string
          aluno_id: string
          semana_inicio: string
          pontos_xp: number
          posicao: number | null
          tipo: 'amigos' | 'global'
          created_at: string
          updated_at: string
        }
      }
    }
  }
}

