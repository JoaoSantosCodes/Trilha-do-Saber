'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import Header from '@/components/Header'
import Button from '@/components/Button'
import PageLoading from '@/components/PageLoading'
import EmptyState from '@/components/EmptyState'
import { useLicao } from '@/hooks/useLicao'
import { useProgresso } from '@/hooks/useProgresso'
import { useAluno } from '@/hooks/useAluno'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/supabase/config'

export default function LicaoInterativaPage() {
  const router = useRouter()
  const params = useParams()
  const licaoId = params.licaoId as string
  const materia = params.materia as string
  const { user } = useAuth()
  const { licao, loading: loadingLicao } = useLicao(licaoId)
  const { atualizarProgressoLicao, getProgressoLicao } = useProgresso()
  const { aluno, updateAluno } = useAluno()

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [lives, setLives] = useState(3)
  const [progress, setProgress] = useState(0)
  const [startTime] = useState(Date.now())
  const [acertos, setAcertos] = useState(0)
  const [erros, setErros] = useState(0)
  const [tempoTotal, setTempoTotal] = useState(0)
  const progressoRef = useRef<any>(null)

  // Carregar progresso existente
  useEffect(() => {
    if (licaoId && user) {
      const progresso = getProgressoLicao(licaoId)
      if (progresso) {
        progressoRef.current = progresso
        setLives(Math.max(1, 3 - progresso.erros))
        setAcertos(progresso.acertos)
        setErros(progresso.erros)
        setTempoTotal(progresso.tempo_total_segundos)
      }
    }
  }, [licaoId, user, getProgressoLicao])

  // Calcular progresso
  useEffect(() => {
    if (licao?.questoes) {
      const total = licao.questoes.length
      const progressoAtual = ((currentQuestionIndex + 1) / total) * 100
      setProgress(progressoAtual)
    }
  }, [currentQuestionIndex, licao])

  if (loadingLicao) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background-dark text-text-dark">
        <Header showBack title="Carregando..." />
        <PageLoading message="Carregando lição..." />
      </div>
    )
  }

  if (!licao || !licao.questoes || licao.questoes.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background-dark text-text-dark">
        <Header showBack title="Erro" />
        <EmptyState
          icon="error"
          title="Lição não encontrada"
          description="A lição não foi encontrada ou não possui questões disponíveis."
          actionLabel="Voltar"
          onAction={() => router.back()}
        />
      </div>
    )
  }

  const currentQuestion = licao.questoes[currentQuestionIndex]
  const selectedOpcao = currentQuestion?.opcoes.find((o) => o.id === selectedAnswer)
  const isCorrect = selectedOpcao?.correta || false

  const handleAnswerSelect = (opcaoId: string) => {
    if (showFeedback) return
    setSelectedAnswer(opcaoId)
  }

  const salvarResposta = async (correta: boolean) => {
    if (!user || !currentQuestion || !selectedOpcao) return

    try {
      const tempoResposta = Math.floor((Date.now() - startTime) / 1000)

      // Salvar resposta do aluno
      await supabase.from('respostas_aluno').insert({
        aluno_id: user.id,
        questao_id: currentQuestion.id,
        opcao_id: selectedOpcao.id,
        correta,
        tempo_resposta_segundos: tempoResposta,
        vidas_restantes: lives,
      })

      // Atualizar estatísticas
      if (correta) {
        setAcertos((prev) => prev + 1)
      } else {
        setErros((prev) => prev + 1)
        setLives((prev) => Math.max(0, prev - 1))
      }

      setTempoTotal((prev) => prev + tempoResposta)
    } catch (error) {
      console.error('Erro ao salvar resposta:', error)
    }
  }

  const handleVerify = async () => {
    if (selectedAnswer === null) return

    setShowFeedback(true)
    await salvarResposta(isCorrect)

    // Se perdeu todas as vidas, finalizar lição
    if (!isCorrect && lives <= 1) {
      setTimeout(() => {
        finalizarLicao(false)
      }, 2000)
    }
  }

  const finalizarLicao = async (concluida: boolean) => {
    if (!user || !licao) return

    try {
      const tempoTotalSegundos = Math.floor((Date.now() - startTime) / 1000) + tempoTotal
      const pontosGanhos = concluida ? licao.pontos_recompensa : 0
      const moedasGanhas = concluida ? licao.moedas_recompensa : 0

      // Atualizar progresso da lição
      await atualizarProgressoLicao(licaoId, {
        status: concluida ? 'concluida' : 'em_andamento',
        pontos_ganhos: pontosGanhos,
        moedas_ganhas: moedasGanhas,
        tentativas: (progressoRef.current?.tentativas || 0) + 1,
        acertos: acertos + (isCorrect ? 1 : 0),
        erros: erros + (isCorrect ? 0 : 1),
        tempo_total_segundos: tempoTotalSegundos,
        data_inicio: progressoRef.current?.data_inicio || new Date().toISOString(),
        data_conclusao: concluida ? new Date().toISOString() : null,
      })

      // Atualizar pontos e moedas do aluno
      if (concluida && aluno) {
        await updateAluno({
          pontos: (aluno.pontos || 0) + pontosGanhos,
          moedas: (aluno.moedas || 0) + moedasGanhas,
        })
      }

      // Redirecionar
      if (concluida) {
        router.push(`/aluno/trilha/${materia}/recompensa?licao=${licaoId}`)
      } else {
        router.push(`/aluno/trilha/${materia}`)
      }
    } catch (error) {
      console.error('Erro ao finalizar lição:', error)
    }
  }

  const handleNext = async () => {
    if (currentQuestionIndex < licao.questoes.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
      setSelectedAnswer(null)
      setShowFeedback(false)
    } else {
      // Última questão - finalizar lição
      await finalizarLicao(true)
    }
  }

  const handleSkip = () => {
    if (currentQuestionIndex < licao.questoes.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
      setSelectedAnswer(null)
      setShowFeedback(false)
    }
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-dark text-text-dark overflow-x-hidden">
      <main className="flex flex-1 flex-col px-4 pt-4 pb-32">
        {/* Header com Progresso e Vidas */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center h-10 w-10"
          >
            <span className="material-symbols-outlined text-3xl text-text-dark/60">
              close
            </span>
          </button>
          <div className="flex-1">
            <div className="h-4 w-full rounded-full bg-surface-dark">
              <div
                className="h-4 rounded-full bg-primary shadow-[0_0_10px_rgba(37,244,106,0.7)] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-1 text-error">
            <span
              className="material-symbols-outlined text-2xl"
              style={{ textShadow: '0 0 8px rgba(255, 77, 77, 0.7)' }}
            >
              favorite
            </span>
            <span className="font-bold text-lg">{lives}</span>
          </div>
        </div>

        {/* Conteúdo da Lição */}
        <div className="flex-1 flex flex-col justify-center">
          {/* Pergunta com Mascote */}
          <div className="flex items-start gap-4 mt-8">
            <Image
              className="h-20 w-20"
              alt="Mascote Coruja sorrindo"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOplSmJ012e45daI8E2b2IuS-dYElKt0QX3w3AW81Dm2UKPgvAq1_CRqUxXP3TJl8QLwOxlMcarCLAlBJtXPD5W3zOQPBnNEL_e0gqwyTZ452-DGYlLbw5e11fh-6Orzwkm7W675HFZcIX1kL-WsusCtiCsh9R-JCyBbdSMJPV_Wmkrjl7E3NljIS-DMcSseOmEg3ZMqsP8SqlEGHELED0Qrvaba2MzFE15lMk7XLhTp0ciLVKOBezlPZPKSGY2U-TBmWBzmf9Wjvl"
              width={80}
              height={80}
              unoptimized
            />
            <div className="relative mt-2 rounded-lg border border-border-dark bg-surface-dark p-4">
              <div className="absolute -left-2 top-4 h-4 w-4 rotate-45 border-l border-b border-border-dark bg-surface-dark" />
              <h1 className="text-xl font-bold leading-tight text-text-dark">
                {currentQuestion.texto}
              </h1>
              {currentQuestion.mensagem_mascote && (
                <p className="text-text-dark/70 text-sm mt-2">{currentQuestion.mensagem_mascote}</p>
              )}
            </div>
          </div>

          {/* Opções de Resposta */}
          <div className="grid grid-cols-2 gap-4 mt-12 w-full max-w-md mx-auto">
            {currentQuestion.opcoes.map((opcao) => (
              <button
                key={opcao.id}
                onClick={() => handleAnswerSelect(opcao.id)}
                disabled={showFeedback || lives === 0}
                className={`flex h-28 cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-lg border-2 p-4 text-lg font-bold text-text-dark transition-all ${
                  selectedAnswer === opcao.id
                    ? 'border-primary/50 bg-primary/20'
                    : 'border-border-dark bg-surface-dark hover:bg-primary/20 focus:border-primary/50'
                } ${
                  showFeedback && opcao.correta
                    ? 'border-green-500 bg-green-500/20'
                    : ''
                } ${
                  showFeedback &&
                  selectedAnswer === opcao.id &&
                  !isCorrect
                    ? 'border-error bg-error/20'
                    : ''
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {opcao.emoji && <span className="text-3xl">{opcao.emoji}</span>}
                <span>{opcao.texto}</span>
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Mascote de Incentivo */}
      {!showFeedback && (
        <div className="fixed bottom-[148px] left-4 z-10">
          <div className="relative w-40">
            <Image
              className="h-auto w-full"
              alt="Mascote Coruja com placa 'Você Consegue!'"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOplSmJ012e45daI8E2b2IuS-dYElKt0QX3w3AW81Dm2UKPgvAq1_CRqUxXP3TJl8QLwOxlMcarCLAlBJtXPD5W3zOQPBnNEL_e0gqwyTZ452-DGYlLbw5e11fh-6Orzwkm7W675HFZcIX1kL-WsusCtiCsh9R-JCyBbdSMJPV_Wmkrjl7E3NljIS-DMcSseOmEg3ZMqsP8SqlEGHELED0Qrvaba2MzFE15lMk7XLhTp0ciLVKOBezlPZPKSGY2U-TBmWBzmf9Wjvl"
              width={160}
              height={160}
              unoptimized
            />
            <div className="absolute -top-6 -right-2 transform -rotate-12">
              <div className="bg-white text-gray-800 font-bold text-sm px-3 py-1.5 rounded-lg shadow-lg -rotate-6">
                <p>Você consegue!</p>
              </div>
              <div className="absolute bottom-0 left-1/2 w-3 h-3 bg-white transform -translate-x-1/2 translate-y-1/2 rotate-45" />
            </div>
          </div>
        </div>
      )}

      {/* Footer com Feedback e Botão */}
      <footer className="fixed bottom-0 left-0 w-full">
        {showFeedback && (
          <div
            className={`p-6 ${
              isCorrect ? 'bg-success/20 text-success' : 'bg-error/20 text-error'
            }`}
          >
            <div className="flex items-center gap-4 max-w-xl mx-auto">
              <span className="material-symbols-outlined text-3xl font-bold">
                {isCorrect ? 'check_circle' : 'cancel'}
              </span>
              <div>
                <h2 className="font-bold text-lg">
                  {isCorrect ? 'Correto!' : 'Incorreto'}
                </h2>
                <p className="text-sm">
                  {isCorrect
                    ? 'Bom trabalho!'
                    : 'Tente novamente. Você consegue!'}
                </p>
              </div>
            </div>
          </div>
        )}
        <div className="px-4 py-3 border-t border-border-dark bg-surface-dark">
          <div className="flex gap-3 max-w-xl mx-auto">
            <Button
              onClick={handleSkip}
              disabled={showFeedback || lives === 0}
              className="flex-1 bg-gray-600 text-white h-12 disabled:opacity-50"
            >
              Pular
            </Button>
            <Button
              onClick={showFeedback ? handleNext : handleVerify}
              disabled={selectedAnswer === null || lives === 0}
              className="flex-1 bg-primary text-background-dark h-12 shadow-[0_0_15px_rgba(37,244,106,0.6)] disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {showFeedback
                ? currentQuestionIndex < licao.questoes.length - 1
                  ? 'Próxima'
                  : 'Concluir'
                : 'Verificar'}
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}

