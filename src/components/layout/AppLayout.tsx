import type { PageKey } from '../../types/finance'
import { Sidebar } from './Sidebar'

type AppLayoutProps = {
  activePage: PageKey
  children: React.ReactNode
  onNavigate: (page: PageKey) => void
}

export function AppLayout({ activePage, children, onNavigate }: AppLayoutProps) {
  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} onNavigate={onNavigate} />
      <main className="page-shell">{children}</main>
    </div>
  )
}
