import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Link } from 'react-router-dom'
import { Badge, type BadgeTone } from '../components/common/Badge'
import { Card } from '../components/common/Card'
import { EmptyState } from '../components/common/EmptyState'
import { LoadingState } from '../components/common/LoadingState'
import { SectionHeader } from '../components/common/SectionHeader'
import { StatCard } from '../components/common/StatCard'
import { useMonthlyBudget } from '../features/budget/hooks/useMonthlyBudget'
import { useDashboard } from '../features/dashboard/hooks/useDashboard'
import type { BudgetStatus, MonthlyBudgetResponse } from '../types/budget'
import type { DashboardResponse } from '../types/dashboard'
import { getCurrentMonth } from '../utils/date'
import { formatCurrency } from '../utils/format'

function getDecisionTone(decision: string): BadgeTone {
  const normalized = decision.toUpperCase()

  if (['GOOD', 'AVAILABLE', 'RECOMMENDED'].includes(normalized)) {
    return 'success'
  }

  if (['CAUTION', 'POSSIBLE'].includes(normalized)) {
    return 'info'
  }

  if (['DANGER', 'RISKY'].includes(normalized)) {
    return 'danger'
  }

  return 'warning'
}

function getDecisionLabel(decision: string) {
  const normalized = decision.toUpperCase()

  const labels: Record<string, string> = {
    AVAILABLE: '상환 가능',
    CAUTION: '주의 필요',
    DANGER: '위험',
    GOOD: '좋음',
    POSSIBLE: '검토 가능',
    PROHIBITED: '현금 우선',
    RECOMMENDED: '상환 추천',
    RISKY: '위험',
    WARNING: '주의',
  }

  return labels[normalized] ?? '확인 필요'
}

function getDecisionMessage(data: DashboardResponse) {
  const decision = data.earlyRepaymentDecision.toUpperCase()

  if (['GOOD', 'AVAILABLE', 'RECOMMENDED'].includes(decision)) {
    return '지금은 일부 조기상환을 검토해도 괜찮은 상태입니다.'
  }

  if (decision === 'PROHIBITED') {
    return '현재는 조기상환보다 현금 확보가 우선입니다.'
  }

  if (['DANGER', 'RISKY'].includes(decision)) {
    return '현재는 조기상환보다 현금 확보가 우선입니다.'
  }

  if (['CAUTION', 'POSSIBLE'].includes(decision)) {
    return '조기상환은 가능하지만 생활 현금 흐름을 먼저 확인하세요.'
  }

  return '아직은 무리한 상환보다 현금 여력을 지키는 편이 좋습니다.'
}

function buildTrendData(data: DashboardResponse) {
  return [
    {
      month: '현재',
      loanBalance: data.totalLoanBalance,
      netWorth: data.netWorth,
    },
    {
      month: '+1M',
      loanBalance: Math.max(data.totalLoanBalance - data.monthlyLoanPayment, 0),
      netWorth: data.netWorth + Math.max(data.liquidCash - data.monthlyFixedExpense, 0) * 0.2,
    },
    {
      month: '+2M',
      loanBalance: Math.max(data.totalLoanBalance - data.monthlyLoanPayment * 2, 0),
      netWorth: data.netWorth + Math.max(data.liquidCash - data.monthlyFixedExpense, 0) * 0.35,
    },
    {
      month: '2027.01',
      loanBalance: Math.max(data.totalLoanBalance - data.monthlyLoanPayment * 8, 0),
      netWorth: data.netWorth + Math.max(data.liquidCash - data.monthlyFixedExpense, 0) * 0.7,
    },
  ]
}

const budgetStatusLabels: Record<BudgetStatus, string> = {
  CAUTION: '주의',
  DANGER: '위험',
  EMERGENCY: '비상상태',
  GOOD: '여유',
  STABLE: '안정',
}

const budgetStatusTones: Record<BudgetStatus, BadgeTone> = {
  CAUTION: 'warning',
  DANGER: 'danger',
  EMERGENCY: 'danger',
  GOOD: 'success',
  STABLE: 'info',
}

function getBudgetStatus(budget: MonthlyBudgetResponse): BudgetStatus {
  if (budget.dailyAvailableAmount <= 15000) {
    return 'EMERGENCY'
  }

  return budget.status
}

export function DashboardPage() {
  const { data, isError, isLoading } = useDashboard()
  const currentMonth = getCurrentMonth()
  const monthlyBudgetQuery = useMonthlyBudget(currentMonth)

  if (isLoading) {
    return <LoadingState title="데이터를 불러오는 중입니다" />
  }

  if (isError || !data) {
    return (
      <div className="grid gap-6">
        <HeroSkeleton />
        <EmptyState
          title="데이터를 불러오지 못했어요"
          description="재무 정보를 불러오는 중 문제가 발생했어요."
        />
      </div>
    )
  }

  const decisionTone = getDecisionTone(data.earlyRepaymentDecision)
  const decisionLabel = getDecisionLabel(data.earlyRepaymentDecision)
  const trendData = buildTrendData(data)
  const availableAmount = Math.max(
    data.liquidCash - data.monthlyFixedExpense - data.monthlyLoanPayment,
    0,
  )
  const stats = [
    {
      description: '이번 달 바로 쓸 수 있는 돈',
      label: '유동 현금',
      tone: 'primary' as const,
      value: data.liquidCash,
    },
    {
      description: '비상 상황을 버틸 안전자금',
      label: '비상금',
      tone: 'success' as const,
      value: data.emergencyBalance,
    },
    {
      description: '앞으로 갚아야 할 총 잔액',
      label: '대출 잔액',
      tone: 'danger' as const,
      value: data.totalLoanBalance,
    },
    {
      description: '자산에서 대출을 뺀 금액',
      label: '순자산',
      tone: 'neutral' as const,
      value: data.netWorth,
    },
    {
      description: '매달 고정으로 나가는 돈',
      label: '월 고정지출',
      tone: 'warning' as const,
      value: data.monthlyFixedExpense,
    },
    {
      description: '고정지출과 대출 납입 후 여력',
      label: '사용 가능 금액',
      tone: 'primary' as const,
      value: availableAmount,
    },
  ]

  return (
    <div className="grid gap-7">
      <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Card className="overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-sky-400 p-8 text-white dark:from-blue-500 dark:via-blue-600 dark:to-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-blue-100">유동 현금</p>
              <h2 className="mt-3 text-5xl font-black tracking-tight sm:text-6xl">
                {formatCurrency(data.liquidCash)}
              </h2>
            </div>
            <Badge tone={decisionTone}>{decisionLabel}</Badge>
          </div>
          <p className="mt-6 max-w-2xl text-lg font-semibold leading-8 text-blue-50">
            이번 달 사용 가능 금액은 {formatCurrency(availableAmount)}입니다.
          </p>
        </Card>

        <Card className="flex flex-col justify-between bg-white/90 dark:bg-slate-900/90">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">2027년 1월 목표 점검</p>
          <strong className="mt-4 block text-3xl font-black text-slate-950 dark:text-slate-50">
            {data.netWorth >= 0 ? '목표 추적 중' : '현금흐름 점검 필요'}
          </strong>
          <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
            대출 납입과 고정지출 이후 남는 현금 여력을 기준으로 목표 달성 가능성을 확인하세요.
          </p>
        </Card>
      </section>

      <Card className="p-8">
        <div className="flex flex-wrap items-center gap-3">
          <Badge tone={decisionTone}>{decisionLabel}</Badge>
          <span className="text-sm font-semibold text-slate-400 dark:text-slate-500">오늘의 판단</span>
        </div>
        <p className="mt-5 max-w-4xl text-3xl font-black leading-tight text-slate-950 dark:text-slate-50 sm:text-4xl">
          {getDecisionMessage(data)}
        </p>
      </Card>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            description={stat.description}
            label={stat.label}
            tone={stat.tone}
            value={formatCurrency(stat.value)}
          />
        ))}
      </section>

      <BudgetStrategySummary budget={monthlyBudgetQuery.data} isLoading={monthlyBudgetQuery.isLoading} />

      <section className="grid gap-5 xl:grid-cols-2">
        <Card>
          <SectionHeader
            title="대출 잔액 추이"
            description="월 납입액 기준으로 줄어드는 흐름을 가볍게 확인합니다."
          />
          <div className="h-72">
            <ResponsiveContainer>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="loanGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#fb7185" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#fb7185" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `${Math.round(Number(value) / 10000)}만`} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Area
                  dataKey="loanBalance"
                  fill="url(#loanGradient)"
                  name="대출 잔액"
                  stroke="#e11d48"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <SectionHeader
            title="순자산 변화"
            description="현금 여력과 대출 상환을 반영한 예상 흐름입니다."
          />
          <div className="h-72">
            <ResponsiveContainer>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `${Math.round(Number(value) / 10000)}만`} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Line
                  dataKey="netWorth"
                  dot={{ r: 4 }}
                  name="순자산"
                  stroke="#16a34a"
                  strokeWidth={3}
                  type="monotone"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>
    </div>
  )
}

function BudgetStrategySummary({
  budget,
  isLoading,
}: {
  budget?: MonthlyBudgetResponse
  isLoading: boolean
}) {
  if (isLoading) {
    return (
      <Card>
        <LoadingState title="생활비 전략을 불러오는 중입니다." />
      </Card>
    )
  }

  if (!budget) {
    return (
      <Card>
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <EmptyState title="이번 달 생활비 예산을 먼저 설정해주세요." />
          <Link
            className="inline-flex min-h-10 items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus-visible:ring-offset-slate-950"
            to="/budget-strategy"
          >
            생활비 전략 설정하기
          </Link>
        </div>
      </Card>
    )
  }

  const status = getBudgetStatus(budget)

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <SectionHeader
          title="생활비 전략"
          description="이번 달 남은 생활비로 오늘과 이번 주에 쓸 수 있는 금액입니다."
        />
        <Badge tone={budgetStatusTones[status]}>{budgetStatusLabels[status]}</Badge>
      </div>
      <section className="mt-5 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="오늘 쓸 수 있는 돈"
          value={formatCurrency(budget.dailyAvailableAmount)}
          description="하루 사용 가능 금액"
          tone={status === 'EMERGENCY' || status === 'DANGER' ? 'danger' : 'primary'}
        />
        <StatCard
          label="이번 주 사용 가능 금액"
          value={formatCurrency(budget.weeklyAvailableAmount)}
          description="7일 기준 생활비 여력"
          tone="success"
        />
        <StatCard
          label="남은 생활비"
          value={formatCurrency(budget.remainingAmount)}
          description={`${budget.remainingDays}일 동안 사용할 돈`}
          tone="neutral"
        />
      </section>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-slate-50 p-5 dark:bg-slate-950">
        <p className="text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">
          {budget.strategyMessage || '이번 달 소비 흐름을 확인해보세요.'}
        </p>
        <Link
          className="inline-flex min-h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 dark:focus-visible:ring-offset-slate-950"
          to="/budget-strategy"
        >
          자세히 보기
        </Link>
      </div>
    </Card>
  )
}

function HeroSkeleton() {
  return (
    <Card className="bg-gradient-to-br from-blue-600 to-sky-400 p-8 text-white">
      <p className="text-sm font-semibold text-blue-100">유동 현금</p>
      <h2 className="mt-3 text-5xl font-black tracking-tight">데이터 없음</h2>
      <p className="mt-6 max-w-2xl text-lg font-semibold leading-8 text-blue-50">
        재무 정보를 불러오는 중 문제가 발생했어요.
      </p>
    </Card>
  )
}
