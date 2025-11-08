'use client'

import Button from '@/components/Button'

interface SequenceProtectedModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SequenceProtectedModal({
  isOpen,
  onClose,
}: SequenceProtectedModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 safe-area-top safe-area-bottom">
      <div className="relative flex w-full max-w-sm flex-col items-center rounded-xl bg-[#FFFBEB] dark:bg-[#1A3122] text-center shadow-2xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto smooth-scroll">
        {/* Owl Mascot Image */}
        <div className="absolute -top-16 sm:-top-20 hidden sm:block">
          <div className="relative w-32 h-32 sm:w-40 sm:h-40">
            <div
              className="w-full h-full bg-center bg-no-repeat bg-contain"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCa-scarUn9r84GI7G-ZxZnNzPWGM6QsiQ-txbtkSYNjZZHzKW1NOPz4udfHWXC6y3D6DKfQrquG6dujgB8KaLofbW3G8FAZRUxAjzDT6QV__lTQC0PsnUBaw1vRCZYxaL52psdUqw6h4JZwvZjOADq0wEsAtbTO0N6yBWs7MKHblfylh-rrBFdwlthG6fjs7_zHkV2PjFbmS8h2QyCkoldMcexS6H6UgFoXKaH4f8UaWeMYOTZQAadNUbI1r4bU_jDcn__Ka51snVp')"
              }}
            />
          </div>
        </div>

        {/* Headline Text */}
        <h1 className="text-[#4B4B4B] dark:text-white tracking-light text-xl sm:text-[32px] font-bold leading-tight pt-16 sm:pt-24 pb-2 sm:pb-3 px-2">
          Sequência Protegida!
        </h1>

        {/* Broken Shield Icon */}
        <div className="relative flex items-center justify-center my-3 sm:my-4">
          <span className="material-symbols-outlined text-6xl sm:text-8xl text-blue-400 dark:text-blue-300">
            shield_with_heart
          </span>
          <span className="material-symbols-outlined absolute text-4xl sm:text-5xl text-blue-200 dark:text-blue-100/80 -translate-y-1">
            brick
          </span>
        </div>

        {/* Body Text */}
        <p className="text-[#4B4B4B] dark:text-white/80 text-sm sm:text-base font-normal leading-normal pb-3 pt-1 px-2">
          Ufa, essa foi por pouco! Seu escudo protegeu sua sequência de acertos. Continue assim!
        </p>

        {/* Single Button */}
        <div className="flex w-full pt-4 sm:pt-6 justify-center px-2">
          <Button
            onClick={onClose}
            className="flex min-w-[84px] max-w-[480px] items-center justify-center overflow-hidden rounded-full h-12 px-5 flex-1 bg-primary text-background-dark text-base font-bold leading-normal tracking-[0.015em] shadow-[0_4px_0_0_#13894A] active:translate-y-1 active:shadow-none transition-transform touch-manipulation"
          >
            <span className="truncate">Continuar</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

