import { Card } from './Card'

type StatCardProps = {
  label: string
  value: string
  description?: string
  tone?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral'
  emphasis?: boolean
}

const accentClass = {
  primary: 'text-blue-700 dark:text-blue-300',
  success: 'text-green-700 dark:text-green-300',
  warning: 'text-amber-700 dark:text-amber-300',
  danger: 'text-rose-700 dark:text-rose-300',
  neutral: 'text-slate-950 dark:text-slate-50',
}

const surfaceClass = {
  primary: 'bg-blue-50/70 dark:bg-blue-950/20',
  success: 'bg-green-50/70 dark:bg-green-950/20',
  warning: 'bg-amber-50/70 dark:bg-amber-950/20',
  danger: 'bg-rose-50/70 dark:bg-rose-950/20',
  neutral: 'bg-white dark:bg-slate-900',
}

export function StatCard({
  label,
  value,
  description,
  tone = 'neutral',
  emphasis = false,
}: StatCardProps) {
  return (
    <Card as="article" className={`p-6 ${surfaceClass[tone]}`} interactive>
      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</p>
      <strong
        className={`mt-3 block font-bold tracking-tight ${accentClass[tone]} ${
          emphasis ? 'text-4xl' : 'text-2xl'
        }`}
      >
        {value}
      </strong>
      {description ? (
        <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">{description}</p>
      ) : null}
    </Card>
  )
}
