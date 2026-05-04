import { useState } from 'react'
import { EmptyState } from '../components/common/EmptyState'
import { ErrorState } from '../components/common/ErrorState'
import { LoadingState } from '../components/common/LoadingState'
import { SectionHeader } from '../components/common/SectionHeader'
import { StatCard } from '../components/common/StatCard'
import { AccountForm } from '../features/accounts/AccountForm'
import { AccountsTable } from '../features/accounts/AccountsTable'
import {
  useAccounts,
  useCreateAccount,
  useDeleteAccount,
  useUpdateAccount,
} from '../features/accounts/hooks/useAccounts'
import type { AccountFormValues, AccountResponse } from '../types/account'
import { formatCurrency } from '../utils/format'

export function AccountsPage() {
  const [editingAccount, setEditingAccount] = useState<AccountResponse | null>(null)
  const { data = [], isError, isLoading } = useAccounts()
  const createMutation = useCreateAccount()
  const updateMutation = useUpdateAccount()
  const deleteMutation = useDeleteAccount()
  const totals = data.reduce(
    (acc, account) => ({
      ...acc,
      [account.type]: (acc[account.type] ?? 0) + account.balance,
      total: acc.total + account.balance,
    }),
    { total: 0 } as Record<string, number>,
  )

  const handleSubmit = (values: AccountFormValues) => {
    if (editingAccount) {
      updateMutation.mutate(
        { id: editingAccount.id, payload: values },
        { onSuccess: () => setEditingAccount(null) },
      )
      return
    }

    createMutation.mutate(values)
  }

  return (
    <div className="grid gap-6">
      <SectionHeader
        title="Accounts"
        description="유동 현금, 비상금, 저축, 투자 자산을 분리해서 확인합니다."
      />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="유동 현금" value={formatCurrency(totals.LIQUID ?? 0)} tone="primary" />
        <StatCard label="비상금" value={formatCurrency(totals.EMERGENCY ?? 0)} tone="success" />
        <StatCard label="저축" value={formatCurrency(totals.SAVINGS ?? 0)} tone="neutral" />
        <StatCard label="투자" value={formatCurrency(totals.INVESTMENT ?? 0)} tone="warning" />
      </section>

      <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <AccountForm
          key={editingAccount?.id ?? 'new-account'}
          initialAccount={editingAccount}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
          onCancel={editingAccount ? () => setEditingAccount(null) : undefined}
          onSubmit={handleSubmit}
        />
        <section>
          {isLoading ? <LoadingState title="계좌 목록을 불러오는 중입니다" /> : null}
          {isError ? <ErrorState title="계좌 조회 실패" description="API 서버 또는 네트워크 상태를 확인해주세요." /> : null}
          {!isLoading && !isError && data.length === 0 ? (
            <EmptyState title="계좌가 없습니다" description="왼쪽 폼에서 첫 계좌를 생성하세요." />
          ) : null}
          {!isLoading && !isError && data.length > 0 ? (
            <AccountsTable accounts={data} onDelete={deleteMutation.mutate} onEdit={setEditingAccount} />
          ) : null}
        </section>
      </div>
    </div>
  )
}
