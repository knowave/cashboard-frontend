import type { Account, Expense, Loan, SimulationScenario } from '../types/finance'

export const accounts: Account[] = [
  { id: 'main-checking', name: 'Main Checking', type: 'checking', balance: 12480, change: 4.2 },
  { id: 'rainy-day', name: 'Rainy Day', type: 'savings', balance: 18200, change: 2.1 },
  { id: 'long-term', name: 'Long-term Index', type: 'investment', balance: 47250, change: 8.6 },
]

export const expenses: Expense[] = [
  { id: 'housing', category: 'Housing', amount: 2100, budget: 2400 },
  { id: 'food', category: 'Food', amount: 760, budget: 900 },
  { id: 'transport', category: 'Transport', amount: 420, budget: 500 },
  { id: 'subscriptions', category: 'Subscriptions', amount: 180, budget: 220 },
]

export const loans: Loan[] = [
  { id: 'student', name: 'Student Loan', principal: 14800, rate: 4.1, monthlyPayment: 420, remainingMonths: 38 },
  { id: 'auto', name: 'Auto Loan', principal: 9200, rate: 5.3, monthlyPayment: 360, remainingMonths: 27 },
]

export const scenarios: SimulationScenario[] = [
  { id: 'steady', name: 'Steady saving', monthlySavings: 900, projectedBalance: 112000, horizonMonths: 48 },
  { id: 'loan-first', name: 'Loan payoff first', monthlySavings: 550, projectedBalance: 97400, horizonMonths: 48 },
  { id: 'aggressive', name: 'Aggressive investing', monthlySavings: 1300, projectedBalance: 128600, horizonMonths: 48 },
]
