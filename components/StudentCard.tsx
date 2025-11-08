interface Student {
  id: string
  name: string
  initials: string
  progress: number
}

interface StudentCardProps {
  student: Student
}

export default function StudentCard({ student }: StudentCardProps) {
  return (
    <div className="flex items-center gap-3 sm:gap-4 rounded-lg bg-background-light dark:bg-surface-dark p-3">
      <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary font-bold text-base sm:text-lg">
        <span>{student.initials}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm sm:text-base text-text-light dark:text-text-dark truncate">
          {student.name}
        </p>
        <div className="mt-1 w-full bg-primary/20 rounded-full h-1.5">
          <div
            className="bg-primary h-1.5 rounded-full transition-all"
            style={{ width: `${student.progress}%` }}
          ></div>
        </div>
      </div>
      <button className="flex items-center justify-center h-9 sm:h-10 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-medium border border-primary/50 text-text-light dark:text-text-dark bg-transparent hover:bg-primary/10 active:bg-primary/20 transition-colors touch-manipulation shrink-0">
        Detalhes
      </button>
    </div>
  )
}

