'use client'

interface PageLoadingProps {
  message?: string
  fullScreen?: boolean
}

export default function PageLoading({ message = 'Carregando...', fullScreen = true }: PageLoadingProps) {
  const containerClass = fullScreen
    ? 'flex min-h-screen-mobile items-center justify-center safe-area-top safe-area-bottom'
    : 'flex items-center justify-center py-8 sm:py-12'

  return (
    <div className={containerClass}>
      <div className="flex flex-col items-center gap-3 sm:gap-4 px-4">
        <span className="material-symbols-outlined animate-spin text-3xl sm:text-4xl text-primary">refresh</span>
        <p className="text-gray-400 text-sm sm:text-base text-center">{message}</p>
      </div>
    </div>
  )
}

