export type PageKey = 'dashboard' | 'accounts' | 'loans' | 'simulation'

export type Account = {
  id: string
  name: string
  type: 'checking' | 'savings' | 'investment'
  balance: number
  change: number
}

export type Expense = {
  id: string
  category: string
  amount: number
  budget: number
}

export type Loan = {
  id: string
  name: string
  principal: number
  rate: number
  monthlyPayment: number
  remainingMonths: number
}

export type SimulationScenario = {
  id: string
  name: string
  monthlySavings: number
  projectedBalance: number
  horizonMonths: number
}
