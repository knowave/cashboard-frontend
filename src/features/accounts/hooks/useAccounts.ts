import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createAccount,
  deleteAccount,
  getAccount,
  getAccounts,
  updateAccount,
} from '../../../api/accountApi'
import type { AccountRequest } from '../../../types/account'

export const accountQueryKeys = {
  all: ['accounts'] as const,
  detail: (id: string) => ['accounts', id] as const,
}

export function useAccounts() {
  return useQuery({
    queryKey: accountQueryKeys.all,
    queryFn: getAccounts,
  })
}

export function useAccount(id: string) {
  return useQuery({
    queryKey: accountQueryKeys.detail(id),
    queryFn: () => getAccount(id),
    enabled: Boolean(id),
  })
}

export function useCreateAccount() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createAccount,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: accountQueryKeys.all }),
  })
}

export function useUpdateAccount() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AccountRequest }) => updateAccount(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: accountQueryKeys.all })
      queryClient.invalidateQueries({ queryKey: accountQueryKeys.detail(variables.id) })
    },
  })
}

export function useDeleteAccount() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: accountQueryKeys.all }),
  })
}
