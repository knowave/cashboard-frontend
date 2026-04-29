import { AccountList } from '../features/accounts/AccountList'

export function AccountsPage() {
  return (
    <>
      <header className="page-header">
        <div>
          <span>Portfolio</span>
          <h1>Accounts</h1>
        </div>
        <p>Balances grouped by everyday cash and long-term holdings.</p>
      </header>
      <AccountList />
    </>
  )
}
