export type BudgetStatus = 'EMERGENCY' | 'DANGER' | 'CAUTION' | 'STABLE' | 'GOOD'

export type MonthlyBudgetRequest = {
  targetMonth: string
  monthlyBudget: number
  usedAmount: number
}

export type UpdateUsedAmountRequest = {
  usedAmount: number
}

export type MonthlyBudgetResponse = {
  id: string
  targetMonth: string
  monthlyBudget: number
  usedAmount: number
  remainingAmount: number
  remainingDays: number
  dailyAvailableAmount: number
  weeklyAvailableAmount: number
  status: BudgetStatus
  strategyMessage: string
  createdAt: string | null
  updatedAt: string | null
}

export type BudgetExpenseRequest = {
  amount: number
  category?: string | null
  memo?: string | null
  spentAt: string
}

export type BudgetExpenseResponse = {
  id: string
  monthlyBudgetId: string
  amount: number
  category?: string | null
  memo?: string | null
  spentAt: string
  createdAt: string | null
  updatedAt: string | null
}
