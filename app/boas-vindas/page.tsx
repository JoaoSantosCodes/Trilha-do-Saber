'use client'

import Link from 'next/link'
import Button from '@/components/Button'

export default function BoasVindasPage() {
  return (
    <div className="relative flex h-screen w-full flex-col bg-[#1F2937] overflow-hidden" suppressHydrationWarning>
      {/* Background Pattern - Removido devido a 404 */}

      <div className="relative z-10 flex flex-1 flex-col items-center justify-between p-4">
        {/* Header */}
        <header className="flex w-full items-center justify-center pt-8">
          <h1 className="text-3xl font-bold tracking-tighter text-white">
            Aprende+
          </h1>
        </header>

        {/* Main Content */}
        <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
          {/* Coruja Mascote */}
          <div className="flex w-full max-w-[300px] grow items-center justify-center">
            <div className="w-full aspect-square flex items-center justify-center">
              <div 
                className="w-full h-full bg-center bg-no-repeat bg-cover rounded-none"
                style={{
                  backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBAgTWskrmH7cndneNfyiCM5vxH5s6XOMV_QF3AsGpQkTeHmI87J7Zh-pTkYiEXTyNQO1BtZwaDdE7pve1E9I34MUuV2WtBPjrL2N-FAYWiTNW1-PV3h5D51k96vUObh5rqIN0fN2pDC9xX1wBbdY-gGxYPMZYzL0QwfZc158hrAGfgdERtUQPkj5LFv6V0ikwMekIxZJb7-ldcfTkEXWdHjd7-vgljDuiK3LRQJOFbr2N85R5WSSgncpAMZ1nipKgqUjCUh9EmkS5F')"
                }}
                role="img"
                aria-label="Ilustração de uma coruja amigável e sorridente usando óculos, o mascote do aplicativo."
              />
            </div>
          </div>

          {/* Texto Principal */}
          <div className="w-full pb-3 pt-5">
            <h2 className="text-gray-100 tracking-tight text-[28px] font-bold leading-tight">
              Aprender é divertido!
            </h2>
          </div>
        </main>

        {/* Footer com Botões */}
        <footer className="w-full max-w-sm pb-8">
          {/* Botão Primário - Começar a Aprender */}
          <div className="flex px-4 py-3 w-full">
            <Link href="/cadastro" className="w-full flex min-w-[84px] max-w-[480px]">
              <Button 
                variant="primary" 
                size="lg"
                fullWidth
                className="bg-welcome-primary text-gray-800 hover:bg-welcome-primary/90 w-full"
              >
                Começar a Aprender
              </Button>
            </Link>
          </div>

          {/* Botão Secundário - Já tenho uma conta */}
          <div className="flex px-4 pt-1 pb-3 w-full">
            <Link href="/login" className="w-full flex min-w-[84px] max-w-[480px]">
              <Button 
                variant="outline"
                size="lg"
                fullWidth
                className="border-2 border-welcome-secondary bg-transparent text-welcome-secondary hover:bg-welcome-secondary/10 w-full"
              >
                Já tenho uma conta
              </Button>
            </Link>
          </div>
        </footer>
      </div>
    </div>
  )
}

