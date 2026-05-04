import { useState } from 'react'
import { EmptyState } from '../components/common/EmptyState'
import { ErrorState } from '../components/common/ErrorState'
import { LoadingState } from '../components/common/LoadingState'
import { SectionHeader } from '../components/common/SectionHeader'
import { StatCard } from '../components/common/StatCard'
import { FixedExpenseForm } from '../features/fixed-expenses/FixedExpenseForm'
import { FixedExpensesTable } from '../features/fixed-expenses/FixedExpensesTable'
import {
  useCreateFixedExpense,
  useDeleteFixedExpense,
  useFixedExpenses,
  useUpdateFixedExpense,
} from '../features/fixed-expenses/hooks/useFixedExpenses'
import type { FixedExpenseFormValues, FixedExpenseResponse } from '../types/fixedExpense'
import { formatCurrency } from '../utils/format'

export function FixedExpensesPage() {
  const [editingExpense, setEditingExpense] = useState<FixedExpenseResponse | null>(null)
  const { data = [], isError, isLoading } = useFixedExpenses()
  const createMutation = useCreateFixedExpense()
  const updateMutation = useUpdateFixedExpense()
  const deleteMutation = useDeleteFixedExpense()
  const totalAmount = data.reduce((sum, expense) => sum + expense.amount, 0)
  const endingSoonCount = data.filter((expense) => Boolean(expense.endMonth)).length

  const handleSubmit = (values: FixedExpenseFormValues) => {
    if (editingExpense) {
      updateMutation.mutate(
        { id: editingExpense.id, payload: values },
        { onSuccess: () => setEditingExpense(null) },
      )
      return
    }

    createMutation.mutate(values)
  }

  return (
    <div className="grid gap-6">
      <SectionHeader
        title="Fixed Expenses"
        description="매월 고정으로 빠져나가는 지출과 종료 예정 항목을 확인합니다."
      />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="월 고정지출 총합" value={formatCurrency(totalAmount)} tone="warning" />
        <StatCard label="등록 항목" value={`${data.length}개`} />
        <StatCard label="종료 예정" value={`${endingSoonCount}개`} tone="primary" />
      </section>
      <div className="grid gap-6 xl:grid-cols-[400px_minmax(0,1fr)]">
        <FixedExpenseForm
          key={editingExpense?.id ?? 'new-fixed-expense'}
          initialExpense={editingExpense}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
          onCancel={editingExpense ? () => setEditingExpense(null) : undefined}
          onSubmit={handleSubmit}
        />
        <section>
          {isLoading ? <LoadingState title="고정지출 목록을 불러오는 중입니다" /> : null}
          {isError ? <ErrorState title="고정지출 조회 실패" description="API 서버 또는 네트워크 상태를 확인해주세요." /> : null}
          {!isLoading && !isError && data.length === 0 ? (
            <EmptyState title="고정지출이 없습니다" description="왼쪽 폼에서 첫 고정지출을 생성하세요." />
          ) : null}
          {!isLoading && !isError && data.length > 0 ? (
            <FixedExpensesTable expenses={data} onDelete={deleteMutation.mutate} onEdit={setEditingExpense} />
          ) : null}
        </section>
      </div>
    </div>
  )
}
