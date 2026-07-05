import { useQuery } from '@tanstack/react-query'
import { getBudgetExpenses } from '../../../api/budgetApi'
import { budgetQueryKeys } from '../queryKeys'

export function useBudgetExpenses(monthlyBudgetId?: string) {
  return useQuery({
    queryKey: budgetQueryKeys.expenses(monthlyBudgetId ?? ''),
    queryFn: () => getBudgetExpenses(monthlyBudgetId ?? ''),
    enabled: Boolean(monthlyBudgetId),
  })
}
