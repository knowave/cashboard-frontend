import { NAV_ITEMS } from '../../constants/navigation'
import type { PageKey } from '../../types/finance'

type SidebarProps = {
  activePage: PageKey
  onNavigate: (page: PageKey) => void
}

export function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark">C</span>
        <span>Cashboard</span>
      </div>
      <nav aria-label="Primary navigation">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            type="button"
            className={activePage === item.key ? 'active' : undefined}
            onClick={() => onNavigate(item.key)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  )
}
