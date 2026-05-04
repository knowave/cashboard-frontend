import { Badge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import type { FixedExpenseResponse } from '../../types/fixedExpense'
import { formatCurrency, formatMonth } from '../../utils/format'

type FixedExpensesTableProps = {
  expenses: FixedExpenseResponse[]
  onDelete: (id: string) => void
  onEdit: (expense: FixedExpenseResponse) => void
}

export function FixedExpensesTable({ expenses, onDelete, onEdit }: FixedExpensesTableProps) {
  return (
    <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <tr>
            <th className="px-4 py-3">이름</th>
            <th className="px-4 py-3">카테고리</th>
            <th className="px-4 py-3 text-right">금액</th>
            <th className="px-4 py-3">기간</th>
            <th className="px-4 py-3 text-right">작업</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {expenses.map((expense) => (
            <tr key={expense.id}>
              <td className="px-4 py-3 font-medium text-slate-950 dark:text-slate-50">{expense.name}</td>
              <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{expense.category}</td>
              <td className="px-4 py-3 text-right font-semibold text-slate-950 dark:text-slate-50">{formatCurrency(expense.amount)}</td>
              <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <span>{formatMonth(expense.startMonth)} - {formatMonth(expense.endMonth ?? '')}</span>
                  {expense.endMonth ? <Badge tone="warning">종료 예정</Badge> : null}
                </div>
              </td>
              <td className="space-x-2 px-4 py-3 text-right">
                <Button className="min-h-8 px-3 py-1.5" type="button" variant="ghost" onClick={() => onEdit(expense)}>
                  수정
                </Button>
                <Button className="min-h-8 px-3 py-1.5" type="button" variant="danger" onClick={() => onDelete(expense.id)}>
                  삭제
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
