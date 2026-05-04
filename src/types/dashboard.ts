export type DashboardResponse = {
  totalAccountBalance: number
  liquidCash: number
  emergencyBalance: number
  savingsBalance: number
  investmentBalance: number
  totalLoanBalance: number
  monthlyFixedExpense: number
  monthlyLoanPayment: number
  netWorth: number
  earlyRepaymentPossibleAmount: number
  earlyRepaymentDecision: string
  earlyRepaymentDecisionDescription: string
}
