import { useMemo, useState, type FormEvent } from 'react'
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Badge } from '../components/common/Badge'
import { Button } from '../components/common/Button'
import { Card } from '../components/common/Card'
import { CurrencyInput } from '../components/common/CurrencyInput'
import { EmptyState } from '../components/common/EmptyState'
import { ErrorState } from '../components/common/ErrorState'
import { LoadingState } from '../components/common/LoadingState'
import { MonthPicker } from '../components/common/MonthPicker'
import { SectionHeader } from '../components/common/SectionHeader'
import { Select } from '../components/common/Select'
import { StatCard } from '../components/common/StatCard'
import { useLoans } from '../features/loans/hooks/useLoans'
import { useEarlyRepaymentSimulation } from '../features/simulations/hooks/useEarlyRepaymentSimulation'
import { useMonthlySimulation } from '../features/simulations/hooks/useMonthlySimulation'
import type { MonthlySimulationParams } from '../types/simulation'
import { formatCurrency, formatMonth } from '../utils/format'

function currentMonth() {
  return new Date().toISOString().slice(0, 7)
}

function getEarlyRepaymentDecisionLabel(decision: string) {
  const normalized = decision.toUpperCase()

  const labels: Record<string, string> = {
    AVAILABLE: '상환 가능',
    CAUTION: '주의 필요',
    DANGER: '위험',
    GOOD: '좋음',
    POSSIBLE: '검토 가능',
    PROHIBITED: '상환 보류',
    RECOMMENDED: '상환 추천',
    RISKY: '위험',
    WARNING: '주의',
  }

  return labels[normalized] ?? '확인 필요'
}

function getEarlyRepaymentDecisionMessage(decision: string, fallback: string) {
  const normalized = decision.toUpperCase()

  if (normalized === 'PROHIBITED') {
    return '현재 유동 현금으로는 희망 금액을 모두 상환하기 어렵습니다. 최소 현금을 남긴 뒤 가능한 금액만 상환하세요.'
  }

  if (['AVAILABLE', 'GOOD', 'RECOMMENDED'].includes(normalized)) {
    return '최소 현금을 남긴 뒤에도 상환 여력이 있습니다. 실행 가능 금액을 기준으로 조기상환을 검토하세요.'
  }

  if (['CAUTION', 'POSSIBLE', 'WARNING'].includes(normalized)) {
    return '조기상환은 검토할 수 있지만, 상환 후 남는 현금이 충분한지 먼저 확인하세요.'
  }

  if (['DANGER', 'RISKY'].includes(normalized)) {
    return '지금은 조기상환보다 현금 유동성 확보가 우선입니다.'
  }

  return fallback
}

const defaultParams: MonthlySimulationParams = {
  from: currentMonth(),
  to: '2027-01',
  monthlySalary: undefined,
  emergencyFund: undefined,
  savings: undefined,
}

export function SimulationsPage() {
  const [draftParams, setDraftParams] = useState<MonthlySimulationParams>(defaultParams)
  const [queryParams, setQueryParams] = useState<MonthlySimulationParams>(defaultParams)
  const [earlyRepaymentForm, setEarlyRepaymentForm] = useState({
    targetLoanId: '',
    emergencyReserveThreshold: 0 as number | '',
    desiredRepaymentAmount: 0 as number | '',
  })
  const monthlyQuery = useMonthlySimulation(queryParams, Boolean(queryParams.from && queryParams.to))
  const earlyRepaymentMutation = useEarlyRepaymentSimulation()
  const loansQuery = useLoans()
  const chartData = useMemo(() => monthlyQuery.data ?? [], [monthlyQuery.data])

  const targetLoanOptions = useMemo(
    () =>
      loansQuery.data?.map((loan) => ({
        label: `${formatCurrency(loan.currentBalance)} / ${formatMonth(loan.maturityMonth)}`,
        value: loan.id,
      })) ?? [],
    [loansQuery.data],
  )

  const summary = useMemo(() => {
    const lastRow = chartData.at(-1)
    const totalNetCashFlow = chartData.reduce((sum, row) => sum + row.netCashFlow, 0)

    return {
      lastLoanBalance: lastRow?.estimatedLoanBalance ?? 0,
      lastAvailableLivingExpense: lastRow?.availableLivingExpense ?? 0,
      totalNetCashFlow,
      targetMonthReached: lastRow ? lastRow.netCashFlow >= 0 : false,
    }
  }, [chartData])

  const handleMonthlySubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setQueryParams(draftParams)
  }

  const handleEarlyRepaymentSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    earlyRepaymentMutation.mutate({
      targetLoanId: earlyRepaymentForm.targetLoanId,
      emergencyReserveThreshold: Number(earlyRepaymentForm.emergencyReserveThreshold || 0),
      desiredRepaymentAmount: Number(earlyRepaymentForm.desiredRepaymentAmount || 0),
    })
  }

  return (
    <div className="grid gap-6">
      <SectionHeader
        title="Simulations"
        description="월급에서 매월 빠져나갈 금액을 기준으로 생활비와 대출 잔액 흐름을 분석합니다."
      />

      <Card>
        <SectionHeader
          title="월별 현금흐름 조건"
          description="비상금과 저축은 현재까지 모은 돈이 아니라, 매월 새로 떼어놓을 계획 금액입니다."
        />
        <div className="mb-5 rounded-3xl bg-blue-50 p-4 text-sm leading-6 text-blue-800 dark:bg-blue-950/30 dark:text-blue-200">
          <strong className="block">계산 방식</strong>
          <span>
            사용 가능 생활비 = 월급 - 고정지출 - 월 비상금 적립액 - 월 저축액, 순현금흐름 = 사용 가능 생활비 - 대출 납입액
          </span>
        </div>
        <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-6" onSubmit={handleMonthlySubmit}>
          <MonthPicker
            label="From"
            required
            value={draftParams.from}
            onChange={(value) => setDraftParams((current) => ({ ...current, from: value }))}
          />
          <MonthPicker
            label="To"
            required
            value={draftParams.to}
            onChange={(value) => setDraftParams((current) => ({ ...current, to: value }))}
          />
          <CurrencyInput
            label="월급"
            placeholder="월 소득"
            value={draftParams.monthlySalary ?? ''}
            onChange={(value) =>
              setDraftParams((current) => ({
                ...current,
                monthlySalary: value === '' ? undefined : value,
              }))
            }
          />
          <CurrencyInput
            label="월 비상금 적립액"
            placeholder="매월 추가 적립"
            value={draftParams.emergencyFund ?? ''}
            onChange={(value) =>
              setDraftParams((current) => ({
                ...current,
                emergencyFund: value === '' ? undefined : value,
              }))
            }
          />
          <CurrencyInput
            label="월 저축액"
            placeholder="매월 저축"
            value={draftParams.savings ?? ''}
            onChange={(value) =>
              setDraftParams((current) => ({
                ...current,
                savings: value === '' ? undefined : value,
              }))
            }
          />
          <Button className="self-end" type="submit">분석하기</Button>
        </form>
      </Card>

      {monthlyQuery.isLoading ? <LoadingState title="월별 시뮬레이션을 불러오는 중입니다" /> : null}
      {monthlyQuery.isError ? (
        <ErrorState title="월별 시뮬레이션 조회 실패" description="조회 조건과 API 서버 상태를 확인해주세요." />
      ) : null}

      {chartData.length > 0 ? (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              description="조회 기간 전체의 월별 순현금흐름 합계"
              label="누적 순현금흐름"
              value={formatCurrency(summary.totalNetCashFlow)}
              tone={summary.totalNetCashFlow >= 0 ? 'success' : 'danger'}
            />
            <StatCard
              description="마지막 월에 생활비로 남는 금액"
              label="마지막 월 사용 가능 생활비"
              value={formatCurrency(summary.lastAvailableLivingExpense)}
              tone="primary"
            />
            <StatCard
              description="마지막 월 기준 예상 대출 잔액"
              label="예상 대출 잔액"
              value={formatCurrency(summary.lastLoanBalance)}
              tone="danger"
            />
            <StatCard
              description="마지막 월 순현금흐름 기준"
              label="목표 월 상태"
              value={summary.targetMonthReached ? '달성 가능' : '점검 필요'}
              tone={summary.targetMonthReached ? 'success' : 'warning'}
            />
          </section>

          <section className="grid gap-6 xl:grid-cols-2">
            <Card>
              <SectionHeader title="월별 대출 잔액 추이" description="대출 잔액이 안정적으로 줄고 있는지 확인합니다." />
              <div className="h-72">
                <ResponsiveContainer>
                  <LineChart data={chartData}>
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `${Math.round(Number(value) / 10000)}만`} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Line dataKey="estimatedLoanBalance" name="예상 대출 잔액" stroke="#e11d48" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
            <Card>
              <SectionHeader title="월별 순현금흐름" description="생활비에서 대출 납입액까지 뺀 뒤 남거나 부족한 금액입니다." />
              <div className="h-72">
                <ResponsiveContainer>
                  <BarChart data={chartData}>
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `${Math.round(Number(value) / 10000)}만`} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Bar dataKey="netCashFlow" name="순현금흐름" fill="#2563eb" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </section>

          <Card>
            <SectionHeader title="월별 상세 데이터" />
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-left text-sm">
                <thead className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  <tr>
                    <th className="px-3 py-3">월</th>
                    <th className="px-3 py-3 text-right">월급</th>
                    <th className="px-3 py-3 text-right">고정지출</th>
                    <th className="px-3 py-3 text-right">월 비상금 적립</th>
                    <th className="px-3 py-3 text-right">월 저축</th>
                    <th className="px-3 py-3 text-right">대출납입</th>
                    <th className="px-3 py-3 text-right">사용 가능 생활비</th>
                    <th className="px-3 py-3 text-right">순현금흐름</th>
                    <th className="px-3 py-3 text-right">예상 대출잔액</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {chartData.map((row) => (
                    <tr key={row.month}>
                      <td className="px-3 py-3 font-semibold text-slate-950 dark:text-slate-50">{formatMonth(row.month)}</td>
                      <td className="px-3 py-3 text-right">{formatCurrency(row.salary)}</td>
                      <td className="px-3 py-3 text-right">{formatCurrency(row.fixedExpense)}</td>
                      <td className="px-3 py-3 text-right">{formatCurrency(row.emergencyFund)}</td>
                      <td className="px-3 py-3 text-right">{formatCurrency(row.savings)}</td>
                      <td className="px-3 py-3 text-right">{formatCurrency(row.loanPayment)}</td>
                      <td className="px-3 py-3 text-right">{formatCurrency(row.availableLivingExpense)}</td>
                      <td className="px-3 py-3 text-right font-semibold">{formatCurrency(row.netCashFlow)}</td>
                      <td className="px-3 py-3 text-right">{formatCurrency(row.estimatedLoanBalance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      ) : !monthlyQuery.isLoading && !monthlyQuery.isError ? (
        <EmptyState title="시뮬레이션 결과가 없습니다" description="기간을 입력한 뒤 분석을 실행하세요." />
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
        <Card as="div">
          <form onSubmit={handleEarlyRepaymentSubmit}>
            <SectionHeader
              title="조기상환 시뮬레이션"
              description="현재 유동 현금에서 최소 현금을 남긴 뒤, 이번에 실제로 갚을 수 있는 금액을 계산합니다."
            />
            <div className="mb-5 rounded-3xl bg-amber-50 p-4 text-sm leading-6 text-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
              <strong className="block">계산 방식</strong>
              <span>
                가능 상환 금액 = 현재 유동 현금 - 상환 후 남길 최소 현금. 희망 상환 금액보다 가능 금액이 작으면 가능한 금액까지만 실행할 수 있습니다.
              </span>
            </div>
            <div className="grid gap-4">
              <Select
                label="대상 대출"
                options={targetLoanOptions}
                placeholder="대출 선택"
                required
                value={earlyRepaymentForm.targetLoanId}
                onChange={(event) =>
                  setEarlyRepaymentForm((current) => ({ ...current, targetLoanId: event.target.value }))
                }
              />
              <CurrencyInput
                label="상환 후 남길 최소 현금"
                required
                value={earlyRepaymentForm.emergencyReserveThreshold}
                onBlur={() =>
                  setEarlyRepaymentForm((current) => ({
                    ...current,
                    emergencyReserveThreshold:
                      current.emergencyReserveThreshold === '' ? 0 : current.emergencyReserveThreshold,
                  }))
                }
                onChange={(value) =>
                  setEarlyRepaymentForm((current) => ({
                    ...current,
                    emergencyReserveThreshold: value,
                  }))
                }
                onFocus={() =>
                  setEarlyRepaymentForm((current) => ({
                    ...current,
                    emergencyReserveThreshold:
                      current.emergencyReserveThreshold === 0 ? '' : current.emergencyReserveThreshold,
                  }))
                }
              />
              <CurrencyInput
                label="이번에 갚고 싶은 금액"
                required
                value={earlyRepaymentForm.desiredRepaymentAmount}
                onBlur={() =>
                  setEarlyRepaymentForm((current) => ({
                    ...current,
                    desiredRepaymentAmount:
                      current.desiredRepaymentAmount === '' ? 0 : current.desiredRepaymentAmount,
                  }))
                }
                onChange={(value) =>
                  setEarlyRepaymentForm((current) => ({
                    ...current,
                    desiredRepaymentAmount: value,
                  }))
                }
                onFocus={() =>
                  setEarlyRepaymentForm((current) => ({
                    ...current,
                    desiredRepaymentAmount:
                      current.desiredRepaymentAmount === 0 ? '' : current.desiredRepaymentAmount,
                  }))
                }
              />
            </div>
            <Button className="mt-5" type="submit">실행하기</Button>
          </form>
        </Card>

        <Card>
          <SectionHeader title="조기상환 결과" />
          {earlyRepaymentMutation.isPending ? <LoadingState title="조기상환 시뮬레이션 실행 중입니다" /> : null}
          {earlyRepaymentMutation.isError ? (
            <ErrorState title="조기상환 시뮬레이션 실패" description="대출 ID와 입력값을 확인해주세요." />
          ) : null}
          {!earlyRepaymentMutation.data && !earlyRepaymentMutation.isPending && !earlyRepaymentMutation.isError ? (
            <EmptyState title="실행 결과가 없습니다" description="왼쪽 입력값으로 시뮬레이션을 실행하세요." />
          ) : null}
          {earlyRepaymentMutation.data ? (
            <div className="grid gap-4">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <StatCard
                  description="유동 현금에서 최소 현금을 남긴 금액"
                  label="가능 상환 금액"
                  value={formatCurrency(earlyRepaymentMutation.data.possibleRepaymentAmount)}
                  tone="primary"
                />
                <StatCard
                  description="이번에 실제로 갚을 수 있는 금액"
                  label="실제 실행 가능 금액"
                  value={formatCurrency(earlyRepaymentMutation.data.executableRepaymentAmount)}
                  tone="success"
                />
                <StatCard
                  description="현재 바로 쓸 수 있는 현금"
                  label="현재 유동 현금"
                  value={formatCurrency(earlyRepaymentMutation.data.liquidCash)}
                />
                <StatCard
                  description="상환 후에도 계좌에 남겨둘 돈"
                  label="상환 후 남길 최소 현금"
                  value={formatCurrency(earlyRepaymentMutation.data.emergencyReserveThreshold)}
                  tone="warning"
                />
                <StatCard
                  description="사용자가 갚고 싶다고 입력한 금액"
                  label="이번에 갚고 싶은 금액"
                  value={formatCurrency(earlyRepaymentMutation.data.desiredRepaymentAmount)}
                />
                <StatCard
                  description="선택한 대출의 현재 잔액"
                  label="대출 잔액"
                  value={formatCurrency(earlyRepaymentMutation.data.targetLoanCurrentBalance)}
                  tone="danger"
                />
              </div>
              <div className="rounded-3xl bg-slate-50 p-5 dark:bg-slate-950">
                <div className="mb-3 flex items-center gap-2">
                  <p className="font-bold text-slate-950 dark:text-slate-50">판단</p>
                  <Badge>{getEarlyRepaymentDecisionLabel(earlyRepaymentMutation.data.decision)}</Badge>
                </div>
                <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {getEarlyRepaymentDecisionMessage(
                    earlyRepaymentMutation.data.decision,
                    earlyRepaymentMutation.data.decisionDescription,
                  )}
                </p>
              </div>
            </div>
          ) : null}
        </Card>
      </section>
    </div>
  )
}
