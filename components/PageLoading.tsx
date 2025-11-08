'use client'

interface PageLoadingProps {
  message?: string
  fullScreen?: boolean
}

export default function PageLoading({ message = 'Carregando...', fullScreen = true }: PageLoadingProps) {
  const containerClass = fullScreen
    ? 'flex min-h-screen items-center justify-center'
    : 'flex items-center justify-center py-12'

  return (
    <div className={containerClass}>
      <div className="flex flex-col items-center gap-4">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">refresh</span>
        <p className="text-gray-400">{message}</p>
      </div>
    </div>
  )
}

