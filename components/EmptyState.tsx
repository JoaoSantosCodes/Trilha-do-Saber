'use client'

import Button from './Button'

interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

export default function EmptyState({
  icon = 'inbox',
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-4 text-center">
      <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-white/5 mb-3 sm:mb-4">
        <span className="material-symbols-outlined text-3xl sm:text-4xl text-gray-400">{icon}</span>
      </div>
      <h3 className="text-white text-base sm:text-lg font-bold mb-2 px-2">{title}</h3>
      {description && <p className="text-gray-400 text-xs sm:text-sm max-w-md px-2">{description}</p>}
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-4 bg-primary text-background-dark max-w-[280px] sm:max-w-none">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

