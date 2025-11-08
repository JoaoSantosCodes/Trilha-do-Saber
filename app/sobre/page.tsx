'use client'

import { useRouter } from 'next/navigation'

export default function SobrePage() {
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
          Sobre o App
        </h1>
        <div className="flex w-10 sm:w-12 items-center justify-end"></div>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-3 sm:px-4 py-3 sm:py-4 overflow-y-auto smooth-scroll pb-24 sm:pb-28 safe-area-bottom">
        <div className="flex flex-col gap-4 sm:gap-6 max-w-2xl mx-auto">
          {/* App Info */}
          <div className="rounded-xl bg-primary/20 border border-primary/50 p-4 sm:p-6 text-center">
            <span className="material-symbols-outlined text-4xl sm:text-6xl text-primary mb-3 sm:mb-4">school</span>
            <h2 className="text-white text-xl sm:text-2xl font-bold mb-1.5 sm:mb-2">Trilha do Saber</h2>
            <p className="text-white/80 text-xs sm:text-sm mb-3 sm:mb-4">Versão 1.0.0</p>
          </div>

          {/* Description */}
          <div className="rounded-xl bg-white/5 border border-white/10 p-4 sm:p-6">
            <h3 className="text-white text-base sm:text-lg font-bold mb-3 sm:mb-4">Sobre o Aplicativo</h3>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 break-words">
              Trilha do Saber é uma plataforma educacional gamificada que transforma o aprendizado
              em uma aventura divertida e envolvente. Nossa missão é tornar o estudo mais
              interessante e motivador para alunos de todas as idades.
            </p>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed break-words">
              Com trilhas de conhecimento, lições interativas, sistema de recompensas e
              acompanhamento em tempo real, ajudamos alunos a alcançarem seu potencial máximo de
              forma lúdica e eficaz.
            </p>
          </div>

          {/* Features */}
          <div className="rounded-xl bg-white/5 border border-white/10 p-4 sm:p-6">
            <h3 className="text-white text-base sm:text-lg font-bold mb-3 sm:mb-4">Principais Funcionalidades</h3>
            <ul className="flex flex-col gap-2.5 sm:gap-3">
              {[
                'Trilhas de conhecimento por matéria',
                'Lições interativas com feedback imediato',
                'Sistema de pontos e moedas',
                'Loja de recompensas',
                'Ranking e competições amigáveis',
                'Sistema de amizades',
                'Acompanhamento de progresso',
                'Comunicação entre pais e professores',
              ].map((feature, index) => (
                <li key={index} className="flex items-start gap-2 sm:gap-3">
                  <span className="material-symbols-outlined text-primary text-lg sm:text-xl shrink-0 mt-0.5">check_circle</span>
                  <span className="text-gray-400 text-xs sm:text-sm flex-1 break-words">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Credits */}
          <div className="rounded-xl bg-white/5 border border-white/10 p-4 sm:p-6 text-center">
            <p className="text-gray-400 text-xs sm:text-sm break-words">
              Desenvolvido com ❤️ para transformar a educação
            </p>
            <p className="text-gray-500 text-[10px] sm:text-xs mt-1.5 sm:mt-2">© 2024 Trilha do Saber. Todos os direitos reservados.</p>
          </div>
        </div>
      </main>
    </div>
  )
}

