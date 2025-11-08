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
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/5 mb-4">
        <span className="material-symbols-outlined text-4xl text-gray-400">{icon}</span>
      </div>
      <h3 className="text-white text-lg font-bold mb-2">{title}</h3>
      {description && <p className="text-gray-400 text-sm max-w-md">{description}</p>}
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-4 bg-primary text-background-dark">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

