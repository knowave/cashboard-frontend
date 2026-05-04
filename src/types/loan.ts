export type LoanRequest = {
  principal: number
  annualInterestRate: number
  monthlyPayment: number
  currentBalance: number
  startMonth: string
  maturityMonth: string
}

export type LoanResponse = {
  id: string
  principal: number
  annualInterestRate: number
  monthlyPayment: number
  currentBalance: number
  startMonth: string
  maturityMonth: string
  createdAt: string
  updatedAt: string
}

export type LoanFormValues = LoanRequest
