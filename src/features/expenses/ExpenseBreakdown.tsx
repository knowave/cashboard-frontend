import { ProgressBar } from '../../components/common/ProgressBar'
import { expenses } from '../../constants/mockData'
import { formatCurrency } from '../../utils/formatters'

export function ExpenseBreakdown() {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Expense Breakdown</h2>
        <span>This month</span>
      </div>
      <div className="stack-list">
        {expenses.map((expense) => (
          <article key={expense.id} className="list-row">
            <div>
              <strong>{expense.category}</strong>
              <small>
                {formatCurrency(expense.amount)} of {formatCurrency(expense.budget)}
              </small>
            </div>
            <ProgressBar value={expense.amount} max={expense.budget} />
          </article>
        ))}
      </div>
    </section>
  )
}
