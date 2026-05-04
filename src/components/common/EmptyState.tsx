type EmptyStateProps = {
  title: string
  description?: string
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-8 text-center dark:border-slate-700 dark:bg-slate-900/70">
      <strong className="block text-slate-800 dark:text-slate-100">{title}</strong>
      {description ? <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{description}</p> : null}
    </div>
  )
}
