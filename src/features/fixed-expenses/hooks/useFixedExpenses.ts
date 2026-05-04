import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createFixedExpense,
  deleteFixedExpense,
  getFixedExpense,
  getFixedExpenses,
  updateFixedExpense,
} from '../../../api/fixedExpenseApi'
import type { FixedExpenseRequest } from '../../../types/fixedExpense'

export const fixedExpenseQueryKeys = {
  all: ['fixed-expenses'] as const,
  detail: (id: string) => ['fixed-expenses', id] as const,
}

export function useFixedExpenses() {
  return useQuery({
    queryKey: fixedExpenseQueryKeys.all,
    queryFn: getFixedExpenses,
  })
}

export function useFixedExpense(id: string) {
  return useQuery({
    queryKey: fixedExpenseQueryKeys.detail(id),
    queryFn: () => getFixedExpense(id),
    enabled: Boolean(id),
  })
}

export function useCreateFixedExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createFixedExpense,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: fixedExpenseQueryKeys.all }),
  })
}

export function useUpdateFixedExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: FixedExpenseRequest }) =>
      updateFixedExpense(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: fixedExpenseQueryKeys.all })
      queryClient.invalidateQueries({ queryKey: fixedExpenseQueryKeys.detail(variables.id) })
    },
  })
}

export function useDeleteFixedExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteFixedExpense,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: fixedExpenseQueryKeys.all }),
  })
}
