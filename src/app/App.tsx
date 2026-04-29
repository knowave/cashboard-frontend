import { AppLayout } from '../components/layout/AppLayout'
import { usePageNavigation } from '../hooks/usePageNavigation'
import { AccountsPage } from '../pages/AccountsPage'
import { DashboardPage } from '../pages/DashboardPage'
import { LoansPage } from '../pages/LoansPage'
import { SimulationPage } from '../pages/SimulationPage'
import './App.css'

function App() {
  const { activePage, setActivePage } = usePageNavigation()

  const pages = {
    dashboard: <DashboardPage />,
    accounts: <AccountsPage />,
    loans: <LoansPage />,
    simulation: <SimulationPage />,
  }

  return (
    <AppLayout activePage={activePage} onNavigate={setActivePage}>
      {pages[activePage]}
    </AppLayout>
  )
}

export default App
