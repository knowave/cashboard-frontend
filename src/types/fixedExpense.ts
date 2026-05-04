export type FixedExpenseRequest = {
  name: string
  amount: number
  category: string
  startMonth: string
  endMonth?: string | null
}

export type FixedExpenseResponse = {
  id: string
  name: string
  amount: number
  category: string
  startMonth: string
  endMonth?: string | null
  createdAt: string
  updatedAt: string
}

export type FixedExpenseFormValues = FixedExpenseRequest
