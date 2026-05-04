import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { MobileNav } from './MobileNav'
import { Sidebar } from './Sidebar'

export function AppLayout() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#eaf2ff_0,#f8fafc_34rem)] dark:bg-[radial-gradient(circle_at_top_left,#0f172a_0,#020617_34rem)]">
      <Sidebar />
      <main className="min-w-0 pb-24 lg:pl-24 lg:pb-8">
        <div className="mx-auto w-full max-w-6xl px-4 py-4 sm:px-6 lg:px-10">
          <Header />
          <Outlet />
        </div>
      </main>
      <MobileNav />
    </div>
  )
}
