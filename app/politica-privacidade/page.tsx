'use client'

import { useRouter } from 'next/navigation'

export default function PoliticaPrivacidadePage() {
  const router = useRouter()

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-dark text-gray-200">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center bg-background-dark/80 p-4 pb-2 backdrop-blur-sm justify-between">
        <div className="flex size-12 shrink-0 items-center justify-start">
          <button onClick={() => router.back()}>
            <span className="material-symbols-outlined text-white text-2xl">arrow_back</span>
          </button>
        </div>
        <h1 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
          Política de Privacidade
        </h1>
        <div className="flex w-12 items-center justify-end"></div>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-4 py-4 overflow-y-auto">
        <div className="flex flex-col gap-6 max-w-2xl mx-auto pb-8">
          <div className="rounded-xl bg-white/5 border border-white/10 p-6">
            <h2 className="text-white text-xl font-bold mb-4">Política de Privacidade</h2>
            <p className="text-gray-400 text-xs mb-6">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>

            <div className="flex flex-col gap-6">
              <section>
                <h3 className="text-white text-base font-semibold mb-2">1. Informações que Coletamos</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Coletamos informações que você nos fornece diretamente, como nome, email, dados de
                  perfil e progresso educacional. Também coletamos informações automaticamente
                  quando você usa nosso serviço.
                </p>
              </section>

              <section>
                <h3 className="text-white text-base font-semibold mb-2">2. Como Usamos suas Informações</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Utilizamos suas informações para fornecer, manter e melhorar nossos serviços,
                  personalizar sua experiência, processar transações e comunicar com você sobre
                  atualizações e novidades.
                </p>
              </section>

              <section>
                <h3 className="text-white text-base font-semibold mb-2">3. Compartilhamento de Informações</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Não vendemos suas informações pessoais. Podemos compartilhar informações apenas
                  com professores e responsáveis autorizados, conforme necessário para o
                  funcionamento do serviço educacional.
                </p>
              </section>

              <section>
                <h3 className="text-white text-base font-semibold mb-2">4. Segurança</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Implementamos medidas de segurança técnicas e organizacionais para proteger suas
                  informações contra acesso não autorizado, alteração, divulgação ou destruição.
                </p>
              </section>

              <section>
                <h3 className="text-white text-base font-semibold mb-2">5. Seus Direitos</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Você tem o direito de acessar, corrigir ou excluir suas informações pessoais a
                  qualquer momento através das configurações da sua conta.
                </p>
              </section>

              <section>
                <h3 className="text-white text-base font-semibold mb-2">6. Contato</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato
                  conosco através do email: privacidade@trilhad saber.com
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

