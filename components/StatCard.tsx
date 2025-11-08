interface StatCardProps {
  icon: string
  label: string
  value: string
}

export default function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <div className="flex flex-1 flex-col gap-2 rounded-lg p-4 bg-background-light dark:bg-surface-dark">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-primary text-xl">
          {icon}
        </span>
        <p className="text-sm font-medium text-text-light dark:text-text-secondary-dark">
          {label}
        </p>
      </div>
      <p className="text-3xl font-bold leading-tight">{value}</p>
    </div>
  )
}

