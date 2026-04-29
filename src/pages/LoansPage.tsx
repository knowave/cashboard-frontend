import { LoanList } from '../features/loans/LoanList'

export function LoansPage() {
  return (
    <>
      <header className="page-header">
        <div>
          <span>Debt plan</span>
          <h1>Loans</h1>
        </div>
        <p>Monitor payoff timelines and required monthly payments.</p>
      </header>
      <LoanList />
    </>
  )
}
