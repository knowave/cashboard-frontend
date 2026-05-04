import { Button } from '../../components/common/Button'
import type { LoanResponse } from '../../types/loan'
import { formatCurrency, formatMonth } from '../../utils/format'

type LoansTableProps = {
  loans: LoanResponse[]
  onDelete: (id: string) => void
  onEdit: (loan: LoanResponse) => void
}

export function LoansTable({ loans, onDelete, onEdit }: LoansTableProps) {
  return (
    <div className="grid gap-3">
      {loans.map((loan) => {
        const progress = loan.principal > 0
          ? Math.min(100, Math.max(0, ((loan.principal - loan.currentBalance) / loan.principal) * 100))
          : 0

        return (
          <article
            key={loan.id}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">현재 잔액</p>
                <strong className="mt-1 block text-2xl font-black text-slate-950 dark:text-slate-50">
                  {formatCurrency(loan.currentBalance)}
                </strong>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button className="min-h-9 px-3 py-1.5" type="button" variant="secondary" onClick={() => onEdit(loan)}>
                  수정
                </Button>
                <Button className="min-h-9 px-3 py-1.5" type="button" variant="danger" onClick={() => onDelete(loan.id)}>
                  삭제
                </Button>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-4">
              <Metric label="원금" value={formatCurrency(loan.principal)} />
              <Metric label="이자율" value={`${loan.annualInterestRate}%`} />
              <Metric label="월 납입액" value={formatCurrency(loan.monthlyPayment)} />
              <Metric label="기간" value={`${formatMonth(loan.startMonth)} - ${formatMonth(loan.maturityMonth)}`} />
            </div>

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span>상환 진행률</span>
                <span>{progress.toFixed(0)}%</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <span className="block h-full rounded-full bg-blue-500" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-950">
      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-100">{value}</p>
    </div>
  )
}
