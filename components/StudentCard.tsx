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
    <div className="flex items-center gap-4 rounded-lg bg-background-light dark:bg-surface-dark p-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary font-bold text-lg">
        <span>{student.initials}</span>
      </div>
      <div className="flex-1">
        <p className="font-semibold text-text-light dark:text-text-dark">
          {student.name}
        </p>
        <div className="mt-1 w-full bg-primary/20 rounded-full h-1.5">
          <div
            className="bg-primary h-1.5 rounded-full transition-all"
            style={{ width: `${student.progress}%` }}
          ></div>
        </div>
      </div>
      <button className="flex items-center justify-center h-10 px-4 rounded-lg text-sm font-medium border border-primary/50 text-text-light dark:text-text-dark bg-transparent hover:bg-primary/10 transition-colors">
        Detalhes
      </button>
    </div>
  )
}

