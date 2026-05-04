export type MonthlySimulationParams = {
  from: string
  to: string
  monthlySalary?: number
  emergencyFund?: number
  savings?: number
}

export type MonthlySimulationResponse = {
  month: string
  salary: number
  fixedExpense: number
  emergencyFund: number
  savings: number
  loanPayment: number
  availableLivingExpense: number
  netCashFlow: number
  estimatedLoanBalance: number
}

export type EarlyRepaymentSimulationRequest = {
  emergencyReserveThreshold: number
  targetLoanId: string
  desiredRepaymentAmount: number
}

export type EarlyRepaymentSimulationResponse = {
  liquidCash: number
  emergencyReserveThreshold: number
  possibleRepaymentAmount: number
  desiredRepaymentAmount: number
  executableRepaymentAmount: number
  targetLoanCurrentBalance: number
  decision: string
  decisionDescription: string
}
