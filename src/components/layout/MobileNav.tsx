import { NavLink } from 'react-router-dom'

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Assets', to: '/accounts' },
  { label: 'Bills', to: '/fixed-expenses' },
  { label: 'Loans', to: '/loans' },
  { label: 'Plan', to: '/simulations' },
  { label: 'Budget', to: '/budget-strategy' },
]

export function MobileNav() {
  return (
    <nav className="fixed inset-x-3 bottom-3 z-30 grid grid-cols-6 rounded-[1.75rem] border border-slate-200 bg-white/95 p-2 shadow-2xl shadow-slate-900/10 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 lg:hidden">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) =>
            `rounded-2xl px-2 py-2 text-center text-xs font-semibold transition ${
              isActive
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
                : 'text-slate-500 dark:text-slate-400'
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}
