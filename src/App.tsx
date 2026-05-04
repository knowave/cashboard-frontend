import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { AccountsPage } from './pages/AccountsPage'
import { DashboardPage } from './pages/DashboardPage'
import { FixedExpensesPage } from './pages/FixedExpensesPage'
import { LoansPage } from './pages/LoansPage'
import { SimulationsPage } from './pages/SimulationsPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/accounts" element={<AccountsPage />} />
          <Route path="/fixed-expenses" element={<FixedExpensesPage />} />
          <Route path="/loans" element={<LoansPage />} />
          <Route path="/simulations" element={<SimulationsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
