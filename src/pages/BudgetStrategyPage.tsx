import { useMemo, useState } from 'react'
import { Badge, type BadgeTone } from '../components/common/Badge'
import { Button } from '../components/common/Button'
import { Card } from '../components/common/Card'
import { CurrencyInput } from '../components/common/CurrencyInput'
import { EmptyState } from '../components/common/EmptyState'
import { ErrorState } from '../components/common/ErrorState'
import { Input } from '../components/common/Input'
import { LoadingState } from '../components/common/LoadingState'
import { MonthPicker } from '../components/common/MonthPicker'
import { SectionHeader } from '../components/common/SectionHeader'
import { Select } from '../components/common/Select'
import { StatCard } from '../components/common/StatCard'
import { useBudgetExpenses } from '../features/budget/hooks/useBudgetExpenses'
import {
  useAddBudgetExpense,
  useCreateMonthlyBudget,
  useDeleteBudgetExpense,
  useUpdateMonthlyBudget,
} from '../features/budget/hooks/useBudgetMutations'
import { useMonthlyBudget } from '../features/budget/hooks/useMonthlyBudget'
import type {
  BudgetExpenseResponse,
  BudgetStatus,
  MonthlyBudgetResponse,
} from '../types/budget'
import { getCurrentMonth, getTodayDate } from '../utils/date'
import { formatCurrency, formatMonth } from '../utils/format'

const budgetStatusMeta: Record<
  BudgetStatus,
  {
    accent: string
    description: string
    label: string
    tone: BadgeTone
  }
> = {
  EMERGENCY: {
    accent: 'text-rose-700 dark:text-rose-300',
    description:
      '하루 사용 가능 금액이 15,000원 이하입니다. 배달, 쇼핑, 카페 지출을 멈추고 필수 지출만 유지하세요.',
    label: '비상상태',
    tone: 'danger',
  },
  DANGER: {
    accent: 'text-orange-700 dark:text-orange-300',
    description: '소비 속도가 빠릅니다. 이번 주는 외식과 편의점 지출을 줄이는 것이 좋습니다.',
    label: '위험',
    tone: 'danger',
  },
  CAUTION: {
    accent: 'text-amber-700 dark:text-amber-300',
    description: '주의가 필요합니다. 주간 예산을 넘지 않도록 소비를 기록하세요.',
    label: '주의',
    tone: 'warning',
  },
  STABLE: {
    accent: 'text-blue-700 dark:text-blue-300',
    description: '현재 소비 흐름은 안정적입니다. 이 속도를 유지하세요.',
    label: '안정',
    tone: 'info',
  },
  GOOD: {
    accent: 'text-green-700 dark:text-green-300',
    description: '여유가 있습니다. 남은 금액은 비상금 이월 또는 조기상환 검토가 가능합니다.',
    label: '여유',
    tone: 'success',
  },
}

const categoryOptions = [
  { label: '식비', value: 'FOOD' },
  { label: '카페', value: 'CAFE' },
  { label: '교통', value: 'TRANSPORT' },
  { label: '쇼핑', value: 'SHOPPING' },
  { label: '생활', value: 'LIVING' },
  { label: '기타', value: 'ETC' },
]

const categoryLabels = categoryOptions.reduce<Record<string, string>>((acc, option) => {
  acc[option.value] = option.label
  return acc
}, {})

type ErrorWithResponse = {
  response?: {
    status?: number
  }
}

function isNotFoundError(error: unknown) {
  return (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    (error as ErrorWithResponse).response?.status === 404
  )
}

function getEffectiveStatus(budget: MonthlyBudgetResponse): BudgetStatus {
  if (budget.dailyAvailableAmount <= 15000) {
    return 'EMERGENCY'
  }

  return budget.status
}

export function BudgetStrategyPage() {
  const [targetMonth, setTargetMonth] = useState(getCurrentMonth)
  const monthlyBudgetQuery = useMonthlyBudget(targetMonth)
  const budget = monthlyBudgetQuery.data
  const effectiveStatus = budget ? getEffectiveStatus(budget) : undefined
  const statusMeta = effectiveStatus ? budgetStatusMeta[effectiveStatus] : undefined

  return (
    <div className="grid gap-7">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeader
          title="생활비 전략"
          description="이번 달 남은 생활비를 기준으로 하루와 일주일 사용 가능 금액을 계산합니다."
        />
        <div className="w-full sm:w-56">
          <MonthPicker label="전략 월" value={targetMonth} onChange={setTargetMonth} required />
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[420px_minmax(0,1fr)]">
        <BudgetSetupCard
          key={`${targetMonth}-${budget?.id ?? 'empty'}`}
          budget={budget}
          targetMonth={targetMonth}
        />

        {monthlyBudgetQuery.isLoading ? (
          <LoadingState title="생활비 전략을 불러오는 중입니다." />
        ) : budget && statusMeta ? (
          <BudgetSummary budget={budget} statusMeta={statusMeta} />
        ) : monthlyBudgetQuery.isError && !isNotFoundError(monthlyBudgetQuery.error) ? (
          <ErrorState
            title="생활비 전략 정보를 불러오지 못했습니다."
            description="잠시 후 다시 시도해주세요."
          />
        ) : (
          <EmptyState
            title="아직 이번 달 생활비 예산이 없습니다."
            description="예산을 먼저 생성해주세요."
          />
        )}
      </section>

      {budget ? (
        <section className="grid gap-5 xl:grid-cols-[420px_minmax(0,1fr)]">
          <ExpenseForm budgetId={budget.id} targetMonth={targetMonth} />
          <ExpenseList budgetId={budget.id} targetMonth={targetMonth} />
        </section>
      ) : null}
    </div>
  )
}

function BudgetSetupCard({
  budget,
  targetMonth,
}: {
  budget?: MonthlyBudgetResponse
  targetMonth: string
}) {
  const [monthlyBudget, setMonthlyBudget] = useState<number | ''>(budget?.monthlyBudget ?? '')
  const [usedAmount, setUsedAmount] = useState<number | ''>(budget?.usedAmount ?? '')
  const createMutation = useCreateMonthlyBudget(targetMonth)
  const updateMutation = useUpdateMonthlyBudget(targetMonth)
  const isSubmitting = createMutation.isPending || updateMutation.isPending

  return (
    <Card>
      <SectionHeader
        title={budget ? '생활비 예산 수정' : '생활비 예산 설정'}
        description="이번 달 실제로 사용할 수 있는 돈과 이미 쓴 금액을 입력하세요."
      />

      <form
        className="mt-5 grid gap-4"
        onSubmit={(event) => {
          event.preventDefault()

          const payload = {
            monthlyBudget: monthlyBudget === '' ? 0 : monthlyBudget,
            targetMonth,
            usedAmount: usedAmount === '' ? 0 : usedAmount,
          }

          if (budget) {
            updateMutation.mutate({ id: budget.id, payload })
            return
          }

          createMutation.mutate(payload)
        }}
      >
        <CurrencyInput
          label="이번 달 생활비 예산"
          placeholder="예: 425000"
          required
          value={monthlyBudget}
          onChange={setMonthlyBudget}
        />
        <CurrencyInput
          label="현재까지 사용한 금액"
          placeholder="예: 125000"
          required
          value={usedAmount}
          onChange={setUsedAmount}
        />

        <div className="rounded-3xl bg-slate-50 p-4 text-sm leading-6 text-slate-500 dark:bg-slate-950 dark:text-slate-400">
          이번 달 생활비 예산은 고정지출, 저축, 비상금을 제외하고 실제로 사용할 수 있는 돈입니다.
          현재까지 사용한 금액은 이번 달 생활비 예산에서 이미 사용한 금액입니다.
        </div>

        {(createMutation.isError || updateMutation.isError) ? (
          <ErrorState title="생활비 예산을 저장하지 못했습니다." />
        ) : null}

        <Button className="w-fit" disabled={isSubmitting} type="submit">
          {budget ? '수정' : '저장'}
        </Button>
      </form>
    </Card>
  )
}

function BudgetSummary({
  budget,
  statusMeta,
}: {
  budget: MonthlyBudgetResponse
  statusMeta: (typeof budgetStatusMeta)[BudgetStatus]
}) {
  const progress = Math.min(Math.max((budget.usedAmount / Math.max(budget.monthlyBudget, 1)) * 100, 0), 100)

  return (
    <div className="grid gap-5">
      <Card className="overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-sky-400 p-8 text-white dark:from-blue-500 dark:via-blue-600 dark:to-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-blue-100">오늘 쓸 수 있는 돈</p>
            <strong className="mt-3 block text-5xl font-black tracking-tight">
              {formatCurrency(budget.dailyAvailableAmount)}
            </strong>
          </div>
          <Badge tone={statusMeta.tone}>{statusMeta.label}</Badge>
        </div>
        <p className="mt-5 text-lg font-semibold text-blue-50">
          이번 주 사용 가능 금액은 {formatCurrency(budget.weeklyAvailableAmount)}입니다.
        </p>
      </Card>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="남은 생활비" value={formatCurrency(budget.remainingAmount)} tone="primary" />
        <StatCard label="남은 일수" value={`${budget.remainingDays}일`} tone="neutral" />
        <StatCard label="현재까지 사용" value={formatCurrency(budget.usedAmount)} tone="warning" />
        <StatCard label="월 생활비 예산" value={formatCurrency(budget.monthlyBudget)} tone="success" />
      </section>

      <Card>
        <div className="flex flex-wrap items-center gap-3">
          <Badge tone={statusMeta.tone}>{statusMeta.label}</Badge>
          <span className="text-sm font-semibold text-slate-400 dark:text-slate-500">
            {formatMonth(budget.targetMonth)} 소비 상태
          </span>
        </div>
        <p className={`mt-4 text-3xl font-black ${statusMeta.accent}`}>
          {budget.strategyMessage || statusMeta.description}
        </p>
        <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">{statusMeta.description}</p>
        <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div className="h-full rounded-full bg-blue-600" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-2 flex justify-between text-xs font-semibold text-slate-400">
          <span>사용률</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </Card>
    </div>
  )
}

function ExpenseForm({ budgetId, targetMonth }: { budgetId: string; targetMonth: string }) {
  const [amount, setAmount] = useState<number | ''>('')
  const [category, setCategory] = useState('FOOD')
  const [memo, setMemo] = useState('')
  const [spentAt, setSpentAt] = useState(getTodayDate)
  const addExpenseMutation = useAddBudgetExpense(targetMonth)

  return (
    <Card>
      <SectionHeader
        title="지출 추가"
        description="생활비에서 빠져나간 금액을 기록하면 남은 하루 예산이 갱신됩니다."
      />
      <form
        className="mt-5 grid gap-4"
        onSubmit={(event) => {
          event.preventDefault()

          if (amount === '' || amount <= 0) {
            return
          }

          addExpenseMutation.mutate(
            {
              monthlyBudgetId: budgetId,
              payload: {
                amount,
                category,
                memo: memo.trim() || null,
                spentAt,
              },
            },
            {
              onSuccess: () => {
                setAmount('')
                setCategory('FOOD')
                setMemo('')
                setSpentAt(getTodayDate())
              },
            },
          )
        }}
      >
        <CurrencyInput label="금액" placeholder="예: 12900" value={amount} onChange={setAmount} required />
        <Select label="카테고리" options={categoryOptions} value={category} onChange={(event) => setCategory(event.target.value)} />
        <Input label="메모" placeholder="예: 청국장 배달" value={memo} onChange={(event) => setMemo(event.target.value)} />
        <Input label="사용일" type="date" value={spentAt} onChange={(event) => setSpentAt(event.target.value)} required />

        {addExpenseMutation.isError ? <ErrorState title="지출을 추가하지 못했습니다." /> : null}

        <Button className="w-fit" disabled={addExpenseMutation.isPending || amount === '' || amount <= 0} type="submit">
          지출 추가
        </Button>
      </form>
    </Card>
  )
}

function ExpenseList({ budgetId, targetMonth }: { budgetId: string; targetMonth: string }) {
  const expensesQuery = useBudgetExpenses(budgetId)
  const deleteExpenseMutation = useDeleteBudgetExpense(targetMonth)
  const expenses = useMemo(
    () => [...(expensesQuery.data ?? [])].sort((a, b) => b.spentAt.localeCompare(a.spentAt)),
    [expensesQuery.data],
  )

  if (expensesQuery.isLoading) {
    return <LoadingState title="지출 목록을 불러오는 중입니다." />
  }

  if (expensesQuery.isError) {
    return <ErrorState title="지출 목록을 불러오지 못했습니다." />
  }

  return (
    <Card>
      <SectionHeader
        title="지출 목록"
        description="최근 사용 내역부터 확인하고 잘못 입력한 지출은 삭제할 수 있습니다."
      />

      {expenses.length === 0 ? (
        <div className="mt-5">
          <EmptyState title="아직 기록된 지출이 없습니다." description="첫 지출을 추가해 생활비 흐름을 확인하세요." />
        </div>
      ) : (
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-950 dark:text-slate-400">
              <tr>
                <th className="rounded-l-2xl px-4 py-3">사용일</th>
                <th className="px-4 py-3">카테고리</th>
                <th className="px-4 py-3">메모</th>
                <th className="px-4 py-3 text-right">금액</th>
                <th className="rounded-r-2xl px-4 py-3 text-right">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {expenses.map((expense) => (
                <ExpenseRow
                  key={expense.id}
                  expense={expense}
                  isDeleting={deleteExpenseMutation.isPending}
                  onDelete={() => deleteExpenseMutation.mutate({ expenseId: expense.id, monthlyBudgetId: budgetId })}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}

function ExpenseRow({
  expense,
  isDeleting,
  onDelete,
}: {
  expense: BudgetExpenseResponse
  isDeleting: boolean
  onDelete: () => void
}) {
  return (
    <tr className="text-slate-700 dark:text-slate-200">
      <td className="px-4 py-4 font-semibold">{expense.spentAt}</td>
      <td className="px-4 py-4">
        <Badge tone="neutral">{categoryLabels[expense.category ?? ''] ?? '기타'}</Badge>
      </td>
      <td className="px-4 py-4 text-slate-500 dark:text-slate-400">{expense.memo || '-'}</td>
      <td className="px-4 py-4 text-right font-bold text-slate-950 dark:text-slate-50">
        {formatCurrency(expense.amount)}
      </td>
      <td className="px-4 py-4 text-right">
        <Button disabled={isDeleting} type="button" variant="danger" onClick={onDelete}>
          삭제
        </Button>
      </td>
    </tr>
  )
}
