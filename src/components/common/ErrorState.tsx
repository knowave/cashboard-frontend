type ErrorStateProps = {
  title: string
  description?: string
}

export function ErrorState({ title, description }: ErrorStateProps) {
  return (
    <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-200">
      <strong className="block">{title}</strong>
      {description ? <p className="mt-2 text-sm leading-6">{description}</p> : null}
    </div>
  )
}
