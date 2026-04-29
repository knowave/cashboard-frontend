import { AccountList } from '../features/accounts/AccountList'
import { DashboardSummary } from '../features/dashboard/DashboardSummary'
import { ExpenseBreakdown } from '../features/expenses/ExpenseBreakdown'

export function DashboardPage() {
  return (
    <>
      <header className="page-header">
        <div>
          <span>Overview</span>
          <h1>Financial dashboard</h1>
        </div>
        <p>Track cash, spending, and debt in one place.</p>
      </header>
      <DashboardSummary />
      <div className="content-grid">
        <AccountList />
        <ExpenseBreakdown />
      </div>
    </>
  )
}
