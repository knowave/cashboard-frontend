import { apiClient } from './client'
import type {
  BudgetExpenseRequest,
  BudgetExpenseResponse,
  MonthlyBudgetRequest,
  MonthlyBudgetResponse,
  UpdateUsedAmountRequest,
} from '../types/budget'
import type { ApiResponse } from '../types/common'

export async function getMonthlyBudget(targetMonth: string): Promise<MonthlyBudgetResponse> {
  const res = await apiClient.get<ApiResponse<MonthlyBudgetResponse>>(`/monthly-budgets/${targetMonth}`)

  return res.data.data
}

export async function createMonthlyBudget(
  payload: MonthlyBudgetRequest,
): Promise<MonthlyBudgetResponse> {
  const res = await apiClient.post<ApiResponse<MonthlyBudgetResponse>>('/monthly-budgets', payload)

  return res.data.data
}

export async function updateMonthlyBudget(
  id: string,
  payload: MonthlyBudgetRequest,
): Promise<MonthlyBudgetResponse> {
  const res = await apiClient.put<ApiResponse<MonthlyBudgetResponse>>(`/monthly-budgets/${id}`, payload)

  return res.data.data
}

export async function updateUsedAmount(
  id: string,
  payload: UpdateUsedAmountRequest,
): Promise<MonthlyBudgetResponse> {
  const res = await apiClient.patch<ApiResponse<MonthlyBudgetResponse>>(
    `/monthly-budgets/${id}/used-amount`,
    payload,
  )

  return res.data.data
}

export async function addBudgetExpense(
  monthlyBudgetId: string,
  payload: BudgetExpenseRequest,
): Promise<MonthlyBudgetResponse> {
  const res = await apiClient.post<ApiResponse<MonthlyBudgetResponse>>(
    `/monthly-budgets/${monthlyBudgetId}/expenses`,
    payload,
  )

  return res.data.data
}

export async function getBudgetExpenses(
  monthlyBudgetId: string,
): Promise<BudgetExpenseResponse[]> {
  const res = await apiClient.get<ApiResponse<BudgetExpenseResponse[]>>(
    `/monthly-budgets/${monthlyBudgetId}/expenses`,
  )

  return res.data.data
}

export async function deleteBudgetExpense(
  monthlyBudgetId: string,
  expenseId: string,
): Promise<boolean> {
  const res = await apiClient.delete<ApiResponse<boolean>>(
    `/monthly-budgets/${monthlyBudgetId}/expenses/${expenseId}`,
  )

  return res.data.data
}
