import { NavLink } from 'react-router-dom'

const navItems = [
  { icon: '⌂', label: 'Home', to: '/' },
  { icon: '₩', label: 'Assets', to: '/accounts' },
  { icon: '↗', label: 'Bills', to: '/fixed-expenses' },
  { icon: '↓', label: 'Loans', to: '/loans' },
  { icon: '◆', label: 'Plan', to: '/simulations' },
]

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-24 flex-col items-center border-r border-slate-200/80 bg-white/90 px-3 py-6 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/90 lg:flex">
      <div className="mb-8 grid justify-items-center gap-2">
        <span className="grid size-11 place-items-center rounded-3xl bg-blue-600 text-lg font-bold text-white shadow-lg shadow-blue-200/70 dark:shadow-none">
          C
        </span>
        <strong className="text-xs text-slate-950 dark:text-slate-50">Cashboard</strong>
      </div>
      <nav className="grid w-full gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `grid justify-items-center gap-1 rounded-3xl px-2 py-3 text-xs font-semibold transition ${
                isActive
                  ? 'bg-blue-50 text-blue-700 shadow-sm dark:bg-blue-950/50 dark:text-blue-300'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50'
              }`
            }
          >
            <span className="grid size-8 place-items-center rounded-2xl bg-current/5 text-base">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
