'use client'

import Image from 'next/image'

interface LoginErrorModalProps {
  isOpen: boolean
  onClose: () => void
  message?: string
}

export default function LoginErrorModal({ 
  isOpen, 
  onClose, 
  message = 'A senha ou o email que você digitou não estão corretos. Por favor, tente novamente.' 
}: LoginErrorModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden p-4">
      {/* Background com blur */}
      <div className="absolute inset-0 z-0 bg-background-dark"></div>
      <div className="absolute -top-1/4 -left-1/4 z-0 h-1/2 w-1/2 rounded-full bg-primary/20 blur-3xl"></div>
      <div className="absolute -bottom-1/4 -right-1/4 z-0 h-1/2 w-1/2 rounded-full bg-primary/20 blur-3xl"></div>
      
      {/* Overlay */}
      <div 
        className="absolute inset-0 z-10 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative z-20 flex w-full max-w-lg items-end justify-center">
        {/* Mascote Coruja (visível em telas maiores) */}
        <div className="absolute -bottom-12 -right-8 z-0 hidden sm:block md:-right-16 lg:-right-24">
          <Image 
            alt="Mascote coruja com uma expressão preocupada" 
            className="h-48 w-48 md:h-64 md:w-64"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDl93QZ8OtoRm6DMeKkWmwXQD2XVLKWppOUCUFQRXK7m0M7og_lJAxwI1GTYEi6orGTI9nCcpSGErzrzm6YRDVjaaFoLuLpMtcWt_IE7Wy6zJmSQfRaIObfvgCMbjpS-Oi6xuSOsyeDdsltiq-xjrJsAkIPEaIIoYPBx0vMRXHg_zq77tt1RcDRHdsReaInM48qAadw2HTYu7YnedMsM5Sp90b042VihKPJWdZ3T6ML-VQqygs7D9Lmt2p6tiuMJZ4Q9r-seio17yS2"
            width={256}
            height={256}
            unoptimized
          />
        </div>

        {/* Pop-up Card */}
        <div className="relative z-10 w-full max-w-md transform-gpu rounded-lg bg-white p-6 text-center shadow-2xl md:p-8">
          {/* Ícone de Alerta */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 text-yellow-500">
            <span className="material-symbols-outlined !text-4xl">
              priority_high
            </span>
          </div>

          {/* Título */}
          <h1 className="mt-4 text-2xl font-bold text-slate-800">
            Ops! Login falhou
          </h1>

          {/* Mensagem */}
          <p className="mt-2 text-base text-slate-600">
            {message}
          </p>

          {/* Botão */}
          <button
            onClick={onClose}
            className="mt-6 flex w-full min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-6 bg-primary text-background-dark text-base font-bold leading-normal transition-transform hover:scale-105"
          >
            <span className="truncate">Tentar Novamente</span>
          </button>
        </div>
      </div>
    </div>
  )
}

