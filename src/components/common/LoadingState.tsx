type LoadingStateProps = {
  title?: string
}

export function LoadingState({ title = '불러오는 중입니다' }: LoadingStateProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
      <span className="mx-auto mb-3 block size-6 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600 dark:border-slate-700 dark:border-t-blue-400" />
      {title}
    </div>
  )
}
