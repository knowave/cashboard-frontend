import { apiClient } from './client'
import type { ApiResponse } from '../types/common'
import type { DashboardResponse } from '../types/dashboard'

export async function getDashboard(): Promise<DashboardResponse> {
  const res = await apiClient.get<ApiResponse<DashboardResponse>>('/dashboard')

  return res.data.data
}
