import { Button } from '../../components/common/Button'
import type { AccountResponse } from '../../types/account'
import { formatCurrency } from '../../utils/format'

type AccountsTableProps = {
  accounts: AccountResponse[]
  onDelete: (id: string) => void
  onEdit: (account: AccountResponse) => void
}

export function AccountsTable({ accounts, onDelete, onEdit }: AccountsTableProps) {
  return (
    <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <table className="w-full min-w-[620px] text-left text-sm">
        <thead className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <tr>
            <th className="px-4 py-3">이름</th>
            <th className="px-4 py-3">유형</th>
            <th className="px-4 py-3 text-right">잔액</th>
            <th className="px-4 py-3 text-right">작업</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {accounts.map((account) => (
            <tr key={account.id}>
              <td className="px-4 py-3 font-medium text-slate-950 dark:text-slate-50">{account.name}</td>
              <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{account.type}</td>
              <td className="px-4 py-3 text-right font-semibold text-slate-950 dark:text-slate-50">{formatCurrency(account.balance)}</td>
              <td className="space-x-2 px-4 py-3 text-right">
                <Button className="min-h-8 px-3 py-1.5" type="button" variant="ghost" onClick={() => onEdit(account)}>
                  수정
                </Button>
                <Button className="min-h-8 px-3 py-1.5" type="button" variant="danger" onClick={() => onDelete(account.id)}>
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
