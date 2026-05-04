import { apiClient } from './client'
import type { ApiResponse } from '../types/common'
import type {
  EarlyRepaymentSimulationRequest,
  EarlyRepaymentSimulationResponse,
  MonthlySimulationParams,
  MonthlySimulationResponse,
} from '../types/simulation'

export async function getMonthlySimulations(
  params: MonthlySimulationParams,
): Promise<MonthlySimulationResponse[]> {
  const res = await apiClient.get<ApiResponse<MonthlySimulationResponse[]>>('/simulations/monthly', {
    params,
  })

  return res.data.data
}

export async function simulateEarlyRepayment(
  payload: EarlyRepaymentSimulationRequest,
): Promise<EarlyRepaymentSimulationResponse> {
  const res = await apiClient.post<ApiResponse<EarlyRepaymentSimulationResponse>>(
    '/simulations/early-repayment',
    payload,
  )

  return res.data.data
}
