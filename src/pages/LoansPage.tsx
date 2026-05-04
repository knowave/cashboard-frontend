import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/common/Button'
import { EmptyState } from '../components/common/EmptyState'
import { ErrorState } from '../components/common/ErrorState'
import { LoadingState } from '../components/common/LoadingState'
import { SectionHeader } from '../components/common/SectionHeader'
import { StatCard } from '../components/common/StatCard'
import { LoanForm } from '../features/loans/LoanForm'
import { LoansTable } from '../features/loans/LoansTable'
import { useCreateLoan, useDeleteLoan, useLoans, useUpdateLoan } from '../features/loans/hooks/useLoans'
import type { LoanFormValues, LoanResponse } from '../types/loan'
import { formatCurrency } from '../utils/format'

export function LoansPage() {
  const [editingLoan, setEditingLoan] = useState<LoanResponse | null>(null)
  const { data = [], isError, isLoading } = useLoans()
  const createMutation = useCreateLoan()
  const updateMutation = useUpdateLoan()
  const deleteMutation = useDeleteLoan()
  const totalBalance = data.reduce((sum, loan) => sum + loan.currentBalance, 0)
  const totalMonthlyPayment = data.reduce((sum, loan) => sum + loan.monthlyPayment, 0)
  const averageRate = data.length
    ? data.reduce((sum, loan) => sum + loan.annualInterestRate, 0) / data.length
    : 0

  const handleSubmit = (values: LoanFormValues) => {
    if (editingLoan) {
      updateMutation.mutate({ id: editingLoan.id, payload: values }, { onSuccess: () => setEditingLoan(null) })
      return
    }

    createMutation.mutate(values)
  }

  return (
    <div className="grid gap-6">
      <SectionHeader
        title="Loans"
        description="대출 잔액이 줄고 있는지, 월 납입 부담은 어느 정도인지 확인합니다."
        action={
          <Link to="/simulations">
            <Button type="button" variant="secondary">조기상환 시뮬레이션</Button>
          </Link>
        }
      />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="대출 잔액" value={formatCurrency(totalBalance)} tone="danger" />
        <StatCard label="월 납입액" value={formatCurrency(totalMonthlyPayment)} tone="warning" />
        <StatCard label="평균 금리" value={`${averageRate.toFixed(2)}%`} tone="primary" />
      </section>
      <div className="grid gap-6 xl:grid-cols-[430px_minmax(0,1fr)]">
        <LoanForm
          key={editingLoan?.id ?? 'new-loan'}
          initialLoan={editingLoan}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
          onCancel={editingLoan ? () => setEditingLoan(null) : undefined}
          onSubmit={handleSubmit}
        />
        <section>
          {isLoading ? <LoadingState title="대출 목록을 불러오는 중입니다" /> : null}
          {isError ? <ErrorState title="대출 조회 실패" description="API 서버 또는 네트워크 상태를 확인해주세요." /> : null}
          {!isLoading && !isError && data.length === 0 ? (
            <EmptyState title="대출이 없습니다" description="왼쪽 폼에서 첫 대출을 생성하세요." />
          ) : null}
          {!isLoading && !isError && data.length > 0 ? (
            <LoansTable loans={data} onDelete={deleteMutation.mutate} onEdit={setEditingLoan} />
          ) : null}
        </section>
      </div>
    </div>
  )
}
