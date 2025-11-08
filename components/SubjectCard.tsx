'use client'

interface Subject {
  id: string
  name: string
  icon: string
  color: string
}

interface SubjectCardProps {
  subject: Subject
  onClick: () => void
}

const colorClasses: Record<string, string> = {
  matematica: 'text-matematica',
  ciencias: 'text-ciencias',
  portugues: 'text-portugues',
  historia: 'text-historia',
  geografia: 'text-geografia',
  artes: 'text-artes',
}

export default function SubjectCard({ subject, onClick }: SubjectCardProps) {
  const colorClass = colorClasses[subject.color] || 'text-primary'

  return (
    <button
      onClick={onClick}
      className="flex flex-1 flex-col items-center justify-center gap-3 sm:gap-4 rounded-lg border border-slate-700 bg-card-dark p-3 sm:p-4 aspect-square hover:bg-card-dark/80 active:bg-card-dark/70 transition-colors touch-manipulation min-h-[120px] sm:min-h-[140px]"
    >
      <span className={`material-symbols-outlined ${colorClass} !text-5xl sm:!text-6xl`}>
        {subject.icon}
      </span>
      <div className="flex flex-col gap-1 text-center">
        <h2 className={`${colorClass} text-base sm:text-lg font-bold leading-tight`}>
          {subject.name}
        </h2>
      </div>
    </button>
  )
}

