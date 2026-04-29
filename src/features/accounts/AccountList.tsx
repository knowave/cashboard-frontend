import { accounts } from '../../constants/mockData'
import { formatCurrency, formatPercent } from '../../utils/formatters'

export function AccountList() {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Accounts</h2>
        <span>{accounts.length} active</span>
      </div>
      <div className="stack-list">
        {accounts.map((account) => (
          <article key={account.id} className="list-row split">
            <div>
              <strong>{account.name}</strong>
              <small>{account.type}</small>
            </div>
            <div className="amount-group">
              <strong>{formatCurrency(account.balance)}</strong>
              <small>+{formatPercent(account.change)}</small>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
