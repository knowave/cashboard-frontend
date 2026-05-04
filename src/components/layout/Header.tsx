import { ThemeToggle } from '../common/ThemeToggle'

export function Header() {
  return (
    <header className="sticky top-0 z-20 mb-5 flex items-center justify-between gap-4 bg-transparent py-4 backdrop-blur">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">Cashboard</p>
        <h1 className="mt-1 text-base font-bold text-slate-950 dark:text-slate-50 sm:text-lg">
          내 돈의 다음 결정을 돕는 곳
        </h1>
      </div>
      <ThemeToggle />
    </header>
  )
}
