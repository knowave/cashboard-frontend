import { loans } from '../../constants/mockData'
import { formatCurrency, formatPercent } from '../../utils/formatters'

export function LoanList() {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Loans</h2>
        <span>{formatCurrency(loans.reduce((sum, loan) => sum + loan.principal, 0))} remaining</span>
      </div>
      <div className="stack-list">
        {loans.map((loan) => (
          <article key={loan.id} className="list-row split">
            <div>
              <strong>{loan.name}</strong>
              <small>
                {formatPercent(loan.rate)} APR · {loan.remainingMonths} months left
              </small>
            </div>
            <div className="amount-group">
              <strong>{formatCurrency(loan.principal)}</strong>
              <small>{formatCurrency(loan.monthlyPayment)} / month</small>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
