import { apiClient } from './client'
import type { AccountRequest, AccountResponse } from '../types/account'
import type { ApiResponse } from '../types/common'

export async function getAccounts(): Promise<AccountResponse[]> {
  const res = await apiClient.get<ApiResponse<AccountResponse[]>>('/accounts')

  return res.data.data
}

export async function getAccount(id: string): Promise<AccountResponse> {
  const res = await apiClient.get<ApiResponse<AccountResponse>>(`/accounts/${id}`)

  return res.data.data
}

export async function createAccount(payload: AccountRequest): Promise<AccountResponse> {
  const res = await apiClient.post<ApiResponse<AccountResponse>>('/accounts', payload)

  return res.data.data
}

export async function updateAccount(id: string, payload: AccountRequest): Promise<AccountResponse> {
  const res = await apiClient.put<ApiResponse<AccountResponse>>(`/accounts/${id}`, payload)

  return res.data.data
}

export async function deleteAccount(id: string): Promise<boolean> {
  const res = await apiClient.delete<ApiResponse<boolean>>(`/accounts/${id}`)

  return res.data.data
}
