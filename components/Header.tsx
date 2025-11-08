'use client'

import { useRouter } from 'next/navigation'

interface HeaderProps {
  title?: string
  showBack?: boolean
  showSettings?: boolean
}

export default function Header({ 
  title, 
  showBack = false, 
  showSettings = true 
}: HeaderProps) {
  const router = useRouter()

  return (
    <header className="flex items-center bg-background-dark dark:bg-background-dark p-4 pb-2 justify-between">
      <div className="flex size-12 shrink-0 items-center justify-start">
        {showBack ? (
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center rounded-full h-10 w-10 text-white hover:bg-card-dark transition-colors"
          >
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>
        ) : (
          <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 bg-primary/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary">school</span>
          </div>
        )}
      </div>
      
      {title && (
        <h1 className="text-xl font-bold leading-tight tracking-tight flex-1 text-center">
          {title}
        </h1>
      )}

      <div className="flex w-12 items-center justify-end">
        {showSettings && (
          <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 text-white gap-2 text-base font-bold leading-normal tracking-[0.015em] min-w-0 p-0 hover:bg-card-dark transition-colors">
            <span className="material-symbols-outlined text-3xl">settings</span>
          </button>
        )}
      </div>
    </header>
  )
}

