import { useQuery } from '@tanstack/react-query'
import { getDashboard } from '../../../api/dashboardApi'

export const dashboardQueryKeys = {
  all: ['dashboard'] as const,
}

export function useDashboard() {
  return useQuery({
    queryKey: dashboardQueryKeys.all,
    queryFn: getDashboard,
  })
}
