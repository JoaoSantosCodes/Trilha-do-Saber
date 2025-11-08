'use client'

interface LoadingSkeletonProps {
  type?: 'card' | 'list' | 'grid' | 'text' | 'circle'
  count?: number
  className?: string
}

export default function LoadingSkeleton({ type = 'card', count = 1, className = '' }: LoadingSkeletonProps) {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="rounded-xl bg-white/5 border border-white/10 p-3 sm:p-4 animate-pulse">
            <div className="h-3 sm:h-4 bg-white/10 rounded w-3/4 mb-2 sm:mb-3"></div>
            <div className="h-2.5 sm:h-3 bg-white/10 rounded w-1/2 mb-1.5 sm:mb-2"></div>
            <div className="h-2.5 sm:h-3 bg-white/10 rounded w-2/3"></div>
          </div>
        )
      case 'list':
        return (
          <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 animate-pulse">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 shrink-0"></div>
            <div className="flex-1 min-w-0">
              <div className="h-3 sm:h-4 bg-white/10 rounded w-3/4 mb-1.5 sm:mb-2"></div>
              <div className="h-2.5 sm:h-3 bg-white/10 rounded w-1/2"></div>
            </div>
          </div>
        )
      case 'grid':
        return (
          <div className="rounded-xl bg-white/5 border border-white/10 p-3 sm:p-4 animate-pulse">
            <div className="aspect-square bg-white/10 rounded-lg mb-2 sm:mb-3"></div>
            <div className="h-3 sm:h-4 bg-white/10 rounded w-3/4"></div>
          </div>
        )
      case 'text':
        return (
          <div className="animate-pulse">
            <div className="h-4 bg-white/10 rounded w-full mb-2"></div>
            <div className="h-4 bg-white/10 rounded w-5/6 mb-2"></div>
            <div className="h-4 bg-white/10 rounded w-4/6"></div>
          </div>
        )
      case 'circle':
        return <div className="w-12 h-12 rounded-full bg-white/10 animate-pulse"></div>
      default:
        return null
    }
  }

  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>{renderSkeleton()}</div>
      ))}
    </div>
  )
}

