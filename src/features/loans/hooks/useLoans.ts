import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createLoan, deleteLoan, getLoan, getLoans, updateLoan } from '../../../api/loanApi'
import type { LoanRequest } from '../../../types/loan'

export const loanQueryKeys = {
  all: ['loans'] as const,
  detail: (id: string) => ['loans', id] as const,
}

export function useLoans() {
  return useQuery({
    queryKey: loanQueryKeys.all,
    queryFn: getLoans,
  })
}

export function useLoan(id: string) {
  return useQuery({
    queryKey: loanQueryKeys.detail(id),
    queryFn: () => getLoan(id),
    enabled: Boolean(id),
  })
}

export function useCreateLoan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createLoan,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: loanQueryKeys.all }),
  })
}

export function useUpdateLoan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: LoanRequest }) => updateLoan(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: loanQueryKeys.all })
      queryClient.invalidateQueries({ queryKey: loanQueryKeys.detail(variables.id) })
    },
  })
}

export function useDeleteLoan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteLoan,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: loanQueryKeys.all }),
  })
}
