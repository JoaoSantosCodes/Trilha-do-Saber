'use client'

import { useRouter } from 'next/navigation'
import Button from '@/components/Button'
import Link from 'next/link'

const faqItems = [
  {
    id: '1',
    question: 'Como faço para entrar em uma turma?',
    answer:
      'Você precisa do código da turma fornecido pelo seu professor. Acesse a opção "Inserir Código da Turma" no menu e digite o código.',
  },
  {
    id: '2',
    question: 'Como ganho pontos e moedas?',
    answer:
      'Você ganha pontos e moedas completando lições e desafios. Quanto melhor seu desempenho, mais recompensas você recebe!',
  },
  {
    id: '3',
    question: 'O que são conquistas?',
    answer:
      'Conquistas são badges especiais que você desbloqueia ao atingir certos objetivos, como completar várias lições ou manter uma sequência de estudos.',
  },
  {
    id: '4',
    question: 'Como adiciono amigos?',
    answer:
      'Acesse a seção "Buscar Amigos" no seu perfil e procure pelo nome de usuário ou nome completo do seu amigo. Depois, envie uma solicitação de amizade.',
  },
  {
    id: '5',
    question: 'Posso usar a loja sem moedas?',
    answer:
      'Não, você precisa de moedas para comprar itens na loja. Complete lições para ganhar moedas e desbloquear novos itens para seu avatar e coruja!',
  },
]

export default function AjudaPage() {
  const router = useRouter()

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
          Ajuda e Suporte
        </h1>
        <div className="flex w-10 sm:w-12 items-center justify-end"></div>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-3 sm:px-4 py-3 sm:py-4 overflow-y-auto smooth-scroll pb-24 sm:pb-28 safe-area-bottom">
        <div className="flex flex-col gap-4 sm:gap-6 max-w-2xl mx-auto">
          {/* Welcome Section */}
          <div className="rounded-xl bg-primary/20 border border-primary/50 p-4 sm:p-6 text-center">
            <span className="material-symbols-outlined text-4xl sm:text-6xl text-primary mb-3 sm:mb-4">help</span>
            <h2 className="text-white text-lg sm:text-xl font-bold mb-1.5 sm:mb-2">Como podemos ajudar?</h2>
            <p className="text-white/80 text-xs sm:text-sm break-words">
              Encontre respostas para as perguntas mais frequentes ou entre em contato conosco.
            </p>
          </div>

          {/* FAQ Section */}
          <div>
            <h3 className="text-white text-base sm:text-lg font-bold mb-3 sm:mb-4">Perguntas Frequentes</h3>
            <div className="flex flex-col gap-3 sm:gap-4">
              {faqItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl bg-white/5 border border-white/10 p-3 sm:p-4 hover:bg-white/10 active:bg-white/15 transition-colors touch-manipulation"
                >
                  <h4 className="text-white text-sm sm:text-base font-semibold mb-1.5 sm:mb-2 break-words">{item.question}</h4>
                  <p className="text-gray-400 text-xs sm:text-sm break-words">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div className="rounded-xl bg-white/5 border border-white/10 p-4 sm:p-6">
            <h3 className="text-white text-base sm:text-lg font-bold mb-3 sm:mb-4">Ainda precisa de ajuda?</h3>
            <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4 break-words">
              Entre em contato com o suporte através do email ou fale com seu professor.
            </p>
            <div className="flex flex-col gap-2 sm:gap-3">
              <Button
                onClick={() => (window.location.href = 'mailto:suporte@trilhad saber.com')}
                className="w-full bg-primary text-background-dark h-11 sm:h-12 text-sm sm:text-base touch-manipulation"
              >
                <span className="material-symbols-outlined mr-2 text-lg sm:text-xl">email</span>
                Enviar Email
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

