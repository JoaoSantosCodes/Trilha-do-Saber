'use client'

import Button from '@/components/Button'

interface PurchaseSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  itemName?: string | null
  itemImage?: string | null
}

export default function PurchaseSuccessModal({
  isOpen,
  onClose,
  itemName,
  itemImage,
}: PurchaseSuccessModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D1B69]/80 safe-area-top safe-area-bottom">
      {/* Confetti Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(9)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2.5 h-5 rounded-sm opacity-80"
            style={{
              backgroundColor: ['#ffd700', '#50E3C2', '#F8E71C', '#E91E63'][i % 4],
              top: `${10 + i * 10}%`,
              left: `${15 + i * 10}%`,
              transform: `rotate(${i * 20}deg)`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-md flex-col items-center gap-3 sm:gap-4 rounded-xl bg-[#4A3F8C] p-4 sm:p-6 text-center shadow-2xl max-h-[90vh] overflow-y-auto smooth-scroll">
        <div className="relative w-full max-w-[240px] sm:max-w-[280px] aspect-square">
          {/* Mascot Image */}
          <div className="absolute -top-16 sm:-top-24 left-1/2 z-10 h-24 w-24 sm:h-32 sm:w-32 -translate-x-1/2 transform hidden sm:block">
            <div
              className="h-full w-full rounded-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDKRUFv46eq9PrUC6KENlLg0Itpk6jpHzx6w_-ihWsZOEsxrsofiAarive3Ue0PA1FYUzIg43WHljW7VwlTvxJxcY5wgLIdqEFx1R-fNCDlWxmJn9rNe61S_5Ruy-QrzTatp5yVyPOKBFKvYVKFp483rCb7D2a2F_uM6TEO52jk2l5oGJjLHKA0Z8rGVumY5fGRkDvc8AjLgbopogDZR98LkWQAgG3xsww2efpCI3pBMXHut5fj_4-0jwwVOaX5eu3mSEa6WNYSihet')"
              }}
            />
          </div>
          {/* Purchased Item Image */}
          <div className="relative flex w-full grow items-center justify-center overflow-hidden rounded-lg bg-[#2D1B69]/50 aspect-square">
            {itemImage ? (
              <div
                className="h-4/5 w-4/5 bg-center bg-no-repeat bg-contain"
                style={{ backgroundImage: `url('${itemImage}')` }}
              />
            ) : (
              <span className="material-symbols-outlined text-5xl sm:text-6xl text-white/50">shopping_bag</span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 px-3 sm:px-4">
          <h1 className="font-display text-xl sm:text-3xl font-bold tracking-tight text-[#F8E71C]">
            Compra realizada com sucesso!
          </h1>
          <p className="font-display text-sm sm:text-base font-normal leading-normal text-white/90">
            Ótima escolha! Você pode equipar seu novo item no seu perfil.
          </p>
        </div>
        <div className="flex w-full px-3 sm:px-4 py-2 sm:py-3">
          <Button
            onClick={onClose}
            className="flex min-w-[84px] max-w-[480px] items-center justify-center overflow-hidden rounded-full h-12 flex-1 bg-[#50E3C2] text-[#2D1B69] text-base font-bold leading-normal tracking-[0.015em] shadow-lg transition-transform hover:scale-105 active:scale-100 touch-manipulation"
          >
            <span className="truncate">Ok, legal!</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

