import { StatCard } from '../../components/common/StatCard'
import { accounts, expenses, loans } from '../../constants/mockData'
import { formatCurrency } from '../../utils/formatters'

export function DashboardSummary() {
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0)
  const monthlySpend = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const debt = loans.reduce((sum, loan) => sum + loan.principal, 0)

  return (
    <section className="summary-grid">
      <StatCard label="Net worth" value={formatCurrency(totalBalance - debt)} detail="After open loans" />
      <StatCard label="Cash available" value={formatCurrency(totalBalance)} detail="Across 3 accounts" />
      <StatCard label="Monthly spend" value={formatCurrency(monthlySpend)} detail="Current cycle" />
    </section>
  )
}
