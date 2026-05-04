import { apiClient } from './client'
import type { ApiResponse } from '../types/common'
import type { LoanRequest, LoanResponse } from '../types/loan'

export async function getLoans(): Promise<LoanResponse[]> {
  const res = await apiClient.get<ApiResponse<LoanResponse[]>>('/loans')

  return res.data.data
}

export async function getLoan(id: string): Promise<LoanResponse> {
  const res = await apiClient.get<ApiResponse<LoanResponse>>(`/loans/${id}`)

  return res.data.data
}

export async function createLoan(payload: LoanRequest): Promise<LoanResponse> {
  const res = await apiClient.post<ApiResponse<LoanResponse>>('/loans', payload)

  return res.data.data
}

export async function updateLoan(id: string, payload: LoanRequest): Promise<LoanResponse> {
  const res = await apiClient.put<ApiResponse<LoanResponse>>(`/loans/${id}`, payload)

  return res.data.data
}

export async function deleteLoan(id: string): Promise<boolean> {
  const res = await apiClient.delete<ApiResponse<boolean>>(`/loans/${id}`)

  return res.data.data
}
