export const budgetQueryKeys = {
  monthlyBudget: (targetMonth: string) => ['monthly-budget', targetMonth] as const,
  expenses: (monthlyBudgetId: string) => ['budget-expenses', monthlyBudgetId] as const,
}
