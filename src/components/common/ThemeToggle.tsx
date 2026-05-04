import { useTheme } from '../../hooks/useTheme'

export function ThemeToggle() {
  const { resolvedTheme, setMode } = useTheme()
  const isDark = resolvedTheme === 'dark'

  return (
    <button
      type="button"
      aria-label={isDark ? '라이트 모드로 변경' : '다크 모드로 변경'}
      aria-pressed={isDark}
      className="relative inline-flex h-10 w-[76px] items-center rounded-full border border-slate-200 bg-white p-1 text-slate-500 shadow-sm transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:focus-visible:ring-offset-slate-950"
      onClick={() => setMode(isDark ? 'light' : 'dark')}
    >
      <span
        className={`absolute left-1 top-1 grid size-8 place-items-center rounded-full bg-blue-600 text-white shadow-sm transition-transform dark:bg-blue-500 ${
          isDark ? 'translate-x-9' : 'translate-x-0'
        }`}
      >
        {isDark ? <MoonIcon /> : <SunIcon />}
      </span>
      <span className="grid size-8 place-items-center">
        <SunIcon />
      </span>
      <span className="ml-auto grid size-8 place-items-center">
        <MoonIcon />
      </span>
    </button>
  )
}

function SunIcon() {
  return (
    <svg aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M20.99 12.68A8.5 8.5 0 1 1 11.31 3a6.5 6.5 0 0 0 9.68 9.68Z" />
    </svg>
  )
}
