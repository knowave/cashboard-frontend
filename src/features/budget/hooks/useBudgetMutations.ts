import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  addBudgetExpense,
  createMonthlyBudget,
  deleteBudgetExpense,
  updateMonthlyBudget,
  updateUsedAmount,
} from '../../../api/budgetApi'
import type {
  BudgetExpenseRequest,
  MonthlyBudgetRequest,
  UpdateUsedAmountRequest,
} from '../../../types/budget'
import { budgetQueryKeys } from '../queryKeys'

export function useCreateMonthlyBudget(targetMonth: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createMonthlyBudget,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: budgetQueryKeys.monthlyBudget(targetMonth) })
      queryClient.invalidateQueries({ queryKey: budgetQueryKeys.monthlyBudget(data.targetMonth) })
    },
  })
}

export function useUpdateMonthlyBudget(targetMonth: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: MonthlyBudgetRequest }) =>
      updateMonthlyBudget(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: budgetQueryKeys.monthlyBudget(targetMonth) })
      queryClient.invalidateQueries({ queryKey: budgetQueryKeys.monthlyBudget(data.targetMonth) })
    },
  })
}

export function useUpdateUsedAmount(targetMonth: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUsedAmountRequest }) =>
      updateUsedAmount(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: budgetQueryKeys.monthlyBudget(targetMonth) })
      queryClient.invalidateQueries({ queryKey: budgetQueryKeys.monthlyBudget(data.targetMonth) })
    },
  })
}

export function useAddBudgetExpense(targetMonth: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      monthlyBudgetId,
      payload,
    }: {
      monthlyBudgetId: string
      payload: BudgetExpenseRequest
    }) => addBudgetExpense(monthlyBudgetId, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: budgetQueryKeys.monthlyBudget(targetMonth) })
      queryClient.invalidateQueries({ queryKey: budgetQueryKeys.monthlyBudget(data.targetMonth) })
      queryClient.invalidateQueries({ queryKey: budgetQueryKeys.expenses(variables.monthlyBudgetId) })
    },
  })
}

export function useDeleteBudgetExpense(targetMonth: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      expenseId,
      monthlyBudgetId,
    }: {
      expenseId: string
      monthlyBudgetId: string
    }) => deleteBudgetExpense(monthlyBudgetId, expenseId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: budgetQueryKeys.monthlyBudget(targetMonth) })
      queryClient.invalidateQueries({ queryKey: budgetQueryKeys.expenses(variables.monthlyBudgetId) })
    },
  })
}
