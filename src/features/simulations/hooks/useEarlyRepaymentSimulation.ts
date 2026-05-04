import { useMutation } from '@tanstack/react-query'
import { simulateEarlyRepayment } from '../../../api/simulationApi'

export const earlyRepaymentSimulationQueryKeys = {
  all: ['early-repayment-simulation'] as const,
}

export function useEarlyRepaymentSimulation() {
  return useMutation({
    mutationFn: simulateEarlyRepayment,
  })
}
