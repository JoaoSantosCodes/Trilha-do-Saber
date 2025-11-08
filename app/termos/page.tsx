'use client'

import { useRouter } from 'next/navigation'

export default function TermosPage() {
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
          Termos de Serviço
        </h1>
        <div className="flex w-10 sm:w-12 items-center justify-end"></div>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-3 sm:px-4 py-3 sm:py-4 overflow-y-auto smooth-scroll pb-24 sm:pb-28 safe-area-bottom">
        <div className="flex flex-col gap-4 sm:gap-6 max-w-2xl mx-auto pb-6 sm:pb-8">
          <div className="rounded-xl bg-white/5 border border-white/10 p-4 sm:p-6">
            <h2 className="text-white text-lg sm:text-xl font-bold mb-3 sm:mb-4">Termos de Serviço</h2>
            <p className="text-gray-400 text-[10px] sm:text-xs mb-4 sm:mb-6">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>

            <div className="flex flex-col gap-4 sm:gap-6">
              <section>
                <h3 className="text-white text-sm sm:text-base font-semibold mb-1.5 sm:mb-2">1. Aceitação dos Termos</h3>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed break-words">
                  Ao acessar e usar o Trilha do Saber, você concorda em cumprir e estar vinculado
                  a estes Termos de Serviço. Se você não concordar com alguma parte destes termos,
                  não deve usar nosso serviço.
                </p>
              </section>

              <section>
                <h3 className="text-white text-sm sm:text-base font-semibold mb-1.5 sm:mb-2">2. Uso do Serviço</h3>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed break-words">
                  Você concorda em usar o Trilha do Saber apenas para fins educacionais legítimos.
                  É proibido usar o serviço de forma que possa danificar, desabilitar ou
                  sobrecarregar nossos servidores ou redes.
                </p>
              </section>

              <section>
                <h3 className="text-white text-sm sm:text-base font-semibold mb-1.5 sm:mb-2">3. Conta do Usuário</h3>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed break-words">
                  Você é responsável por manter a confidencialidade de sua conta e senha. Você
                  concorda em notificar-nos imediatamente sobre qualquer uso não autorizado de sua
                  conta.
                </p>
              </section>

              <section>
                <h3 className="text-white text-sm sm:text-base font-semibold mb-1.5 sm:mb-2">4. Conteúdo do Usuário</h3>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed break-words">
                  Você mantém todos os direitos sobre o conteúdo que você cria ou envia através do
                  serviço. Ao usar o serviço, você nos concede uma licença para usar, exibir e
                  distribuir seu conteúdo conforme necessário para fornecer o serviço.
                </p>
              </section>

              <section>
                <h3 className="text-white text-sm sm:text-base font-semibold mb-1.5 sm:mb-2">5. Propriedade Intelectual</h3>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed break-words">
                  Todo o conteúdo do Trilha do Saber, incluindo textos, gráficos, logotipos, ícones
                  e software, é propriedade do Trilha do Saber ou de seus fornecedores de conteúdo
                  e está protegido por leis de direitos autorais.
                </p>
              </section>

              <section>
                <h3 className="text-white text-sm sm:text-base font-semibold mb-1.5 sm:mb-2">6. Limitação de Responsabilidade</h3>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed break-words">
                  O Trilha do Saber é fornecido "como está" sem garantias de qualquer tipo. Não
                  nos responsabilizamos por danos diretos, indiretos, incidentais ou consequenciais
                  resultantes do uso ou incapacidade de usar o serviço.
                </p>
              </section>

              <section>
                <h3 className="text-white text-sm sm:text-base font-semibold mb-1.5 sm:mb-2">7. Modificações dos Termos</h3>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed break-words">
                  Reservamos o direito de modificar estes termos a qualquer momento. Notificaremos
                  os usuários sobre mudanças significativas através do aplicativo ou por email.
                </p>
              </section>

              <section>
                <h3 className="text-white text-sm sm:text-base font-semibold mb-1.5 sm:mb-2">8. Contato</h3>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed break-words">
                  Se você tiver dúvidas sobre estes Termos de Serviço, entre em contato conosco
                  através do email: termos@trilhad saber.com
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

