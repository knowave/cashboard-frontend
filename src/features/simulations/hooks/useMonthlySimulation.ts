import { useQuery } from '@tanstack/react-query'
import { getMonthlySimulations } from '../../../api/simulationApi'
import type { MonthlySimulationParams } from '../../../types/simulation'

export const monthlySimulationQueryKeys = {
  all: ['monthly-simulations'] as const,
  list: (params: MonthlySimulationParams) => ['monthly-simulations', params] as const,
}

export function useMonthlySimulation(params: MonthlySimulationParams, enabled: boolean) {
  return useQuery({
    queryKey: monthlySimulationQueryKeys.list(params),
    queryFn: () => getMonthlySimulations(params),
    enabled,
  })
}
