import { useQuery } from '@tanstack/react-query'
import { getMonthlyBudget } from '../../../api/budgetApi'
import { budgetQueryKeys } from '../queryKeys'

export function useMonthlyBudget(targetMonth: string) {
  return useQuery({
    queryKey: budgetQueryKeys.monthlyBudget(targetMonth),
    queryFn: () => getMonthlyBudget(targetMonth),
    enabled: Boolean(targetMonth),
    retry: false,
  })
}
