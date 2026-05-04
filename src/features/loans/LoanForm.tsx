import { useState, type FormEvent } from 'react'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { CurrencyInput } from '../../components/common/CurrencyInput'
import { MonthPicker } from '../../components/common/MonthPicker'
import { PercentInput } from '../../components/common/PercentInput'
import type { LoanFormValues, LoanResponse } from '../../types/loan'

type LoanFormState = {
  principal: number | ''
  annualInterestRate: number | ''
  monthlyPayment: number | ''
  currentBalance: number | ''
  startMonth: string
  maturityMonth: string
}

const initialValues: LoanFormState = {
  principal: 0,
  annualInterestRate: 0,
  monthlyPayment: 0,
  currentBalance: 0,
  startMonth: '',
  maturityMonth: '',
}

type LoanFormProps = {
  initialLoan?: LoanResponse | null
  isSubmitting?: boolean
  onCancel?: () => void
  onSubmit: (values: LoanFormValues) => void
}

type LoanNumberKey = keyof Omit<LoanFormState, 'startMonth' | 'maturityMonth'>

function getRepaymentMonths(startMonth: string, maturityMonth: string) {
  if (!startMonth || !maturityMonth) {
    return null
  }

  const [startYear, startMonthNumber] = startMonth.split('-').map(Number)
  const [endYear, endMonthNumber] = maturityMonth.split('-').map(Number)

  if (!startYear || !startMonthNumber || !endYear || !endMonthNumber) {
    return null
  }

  const monthDiff = (endYear - startYear) * 12 + (endMonthNumber - startMonthNumber)

  return monthDiff > 0 ? monthDiff : 1
}

function calculateMonthlyPayment(state: LoanFormState) {
  const principal = Number(state.principal || 0)
  const annualInterestRate = Number(state.annualInterestRate || 0)
  const repaymentMonths = getRepaymentMonths(state.startMonth, state.maturityMonth)

  if (principal <= 0 || !repaymentMonths) {
    return null
  }

  if (annualInterestRate <= 0) {
    return Math.round(principal / repaymentMonths)
  }

  const monthlyInterestRate = annualInterestRate / 100 / 12
  const multiplier = (1 + monthlyInterestRate) ** repaymentMonths

  return Math.round((principal * monthlyInterestRate * multiplier) / (multiplier - 1))
}

function withCalculatedMonthlyPayment(state: LoanFormState) {
  const monthlyPayment = calculateMonthlyPayment(state)

  return monthlyPayment === null ? state : { ...state, monthlyPayment }
}

export function LoanForm({ initialLoan, isSubmitting, onCancel, onSubmit }: LoanFormProps) {
  const [values, setValues] = useState<LoanFormState>(() =>
      initialLoan
        ? {
            principal: initialLoan.principal,
            annualInterestRate: initialLoan.annualInterestRate,
            monthlyPayment: initialLoan.monthlyPayment,
            currentBalance: initialLoan.currentBalance,
            startMonth: initialLoan.startMonth,
            maturityMonth: initialLoan.maturityMonth,
          }
        : initialValues,
  )

  const updateCurrency = (
    key: 'principal' | 'monthlyPayment' | 'currentBalance',
    value: number | '',
  ) =>
    setValues((current) => {
      const nextState = { ...current, [key]: value }

      return key === 'principal' ? withCalculatedMonthlyPayment(nextState) : nextState
    })

  const clearZero = (key: LoanNumberKey) =>
    setValues((current) => ({ ...current, [key]: current[key] === 0 ? '' : current[key] }))

  const restoreZero = (key: LoanNumberKey) =>
    setValues((current) => ({ ...current, [key]: current[key] === '' ? 0 : current[key] }))

  const normalizeInterestRate = () =>
    setValues((current) => {
      const rate = current.annualInterestRate

      if (rate === '') {
        return withCalculatedMonthlyPayment({ ...current, annualInterestRate: 0 })
      }

      if (rate >= 1000) {
        return withCalculatedMonthlyPayment({
          ...current,
          annualInterestRate: Number((rate / 1000).toFixed(3)),
        })
      }

      if (rate >= 100) {
        return withCalculatedMonthlyPayment({
          ...current,
          annualInterestRate: Number((rate / 100).toFixed(3)),
        })
      }

      return withCalculatedMonthlyPayment(current)
    })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit({
      principal: Number(values.principal || 0),
      annualInterestRate: Number(values.annualInterestRate || 0),
      monthlyPayment: Number(values.monthlyPayment || 0),
      currentBalance: Number(values.currentBalance || 0),
      startMonth: values.startMonth,
      maturityMonth: values.maturityMonth,
    })
    if (!initialLoan) {
      setValues(initialValues)
    }
  }

  return (
    <Card as="div">
      <form onSubmit={handleSubmit}>
      <h2 className="mb-4 text-lg font-bold text-slate-950 dark:text-slate-50">{initialLoan ? '대출 수정' : '대출 생성'}</h2>
      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-3">
          <CurrencyInput
            label="원금"
            required
            value={values.principal}
            onBlur={() => restoreZero('principal')}
            onChange={(value) => updateCurrency('principal', value)}
            onFocus={() => clearZero('principal')}
          />
          <CurrencyInput
            label="현재 잔액"
            required
            value={values.currentBalance}
            onBlur={() => restoreZero('currentBalance')}
            onChange={(value) => updateCurrency('currentBalance', value)}
            onFocus={() => clearZero('currentBalance')}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <PercentInput
            label="연 이자율"
            required
            value={values.annualInterestRate}
            onBlur={normalizeInterestRate}
            onChange={(value) => setValues((current) => ({ ...current, annualInterestRate: value }))}
            onFocus={() => clearZero('annualInterestRate')}
          />
          <CurrencyInput
            label="월 납입액"
            required
            value={values.monthlyPayment}
            onBlur={() => restoreZero('monthlyPayment')}
            onChange={(value) => updateCurrency('monthlyPayment', value)}
            onFocus={() => clearZero('monthlyPayment')}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <MonthPicker
            label="시작 월"
            required
            value={values.startMonth}
            onChange={(value) =>
              setValues((current) => withCalculatedMonthlyPayment({ ...current, startMonth: value }))
            }
          />
          <MonthPicker
            label="만기 월"
            required
            value={values.maturityMonth}
            onChange={(value) =>
              setValues((current) => withCalculatedMonthlyPayment({ ...current, maturityMonth: value }))
            }
          />
        </div>
      </div>
      <div className="mt-5 flex gap-2">
        <Button disabled={isSubmitting} type="submit">
          {initialLoan ? '수정' : '생성'}
        </Button>
        {onCancel ? (
          <Button type="button" variant="secondary" onClick={onCancel}>
            취소
          </Button>
        ) : null}
      </div>
      </form>
    </Card>
  )
}
