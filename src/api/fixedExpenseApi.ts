import { apiClient } from './client'
import type { ApiResponse } from '../types/common'
import type { FixedExpenseRequest, FixedExpenseResponse } from '../types/fixedExpense'

export async function getFixedExpenses(): Promise<FixedExpenseResponse[]> {
  const res = await apiClient.get<ApiResponse<FixedExpenseResponse[]>>('/fixed-expenses')

  return res.data.data
}

export async function getFixedExpense(id: string): Promise<FixedExpenseResponse> {
  const res = await apiClient.get<ApiResponse<FixedExpenseResponse>>(`/fixed-expenses/${id}`)

  return res.data.data
}

export async function createFixedExpense(
  payload: FixedExpenseRequest,
): Promise<FixedExpenseResponse> {
  const res = await apiClient.post<ApiResponse<FixedExpenseResponse>>('/fixed-expenses', payload)

  return res.data.data
}

export async function updateFixedExpense(
  id: string,
  payload: FixedExpenseRequest,
): Promise<FixedExpenseResponse> {
  const res = await apiClient.put<ApiResponse<FixedExpenseResponse>>(`/fixed-expenses/${id}`, payload)

  return res.data.data
}

export async function deleteFixedExpense(id: string): Promise<boolean> {
  const res = await apiClient.delete<ApiResponse<boolean>>(`/fixed-expenses/${id}`)

  return res.data.data
}
