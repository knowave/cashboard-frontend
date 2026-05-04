import { useState, type FormEvent } from 'react'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { CurrencyInput } from '../../components/common/CurrencyInput'
import { Input } from '../../components/common/Input'
import { MonthPicker } from '../../components/common/MonthPicker'
import type { FixedExpenseFormValues, FixedExpenseResponse } from '../../types/fixedExpense'

type FixedExpenseFormState = Omit<FixedExpenseFormValues, 'amount'> & {
  amount: number | ''
}

const initialValues: FixedExpenseFormState = {
  name: '',
  amount: 0,
  category: '',
  startMonth: '',
  endMonth: '',
}

type FixedExpenseFormProps = {
  initialExpense?: FixedExpenseResponse | null
  isSubmitting?: boolean
  onCancel?: () => void
  onSubmit: (values: FixedExpenseFormValues) => void
}

export function FixedExpenseForm({
  initialExpense,
  isSubmitting,
  onCancel,
  onSubmit,
}: FixedExpenseFormProps) {
  const [values, setValues] = useState<FixedExpenseFormState>(() =>
      initialExpense
        ? {
            name: initialExpense.name,
            amount: initialExpense.amount,
            category: initialExpense.category,
            startMonth: initialExpense.startMonth,
            endMonth: initialExpense.endMonth ?? '',
          }
        : initialValues,
  )

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit({ ...values, amount: Number(values.amount || 0), endMonth: values.endMonth || null })
    if (!initialExpense) {
      setValues(initialValues)
    }
  }

  return (
    <Card as="div">
      <form onSubmit={handleSubmit}>
      <h2 className="mb-4 text-lg font-bold text-slate-950 dark:text-slate-50">
        {initialExpense ? '고정지출 수정' : '고정지출 생성'}
      </h2>
      <div className="grid gap-4">
        <Input
          label="이름"
          required
          value={values.name}
          onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))}
        />
        <CurrencyInput
          label="금액"
          required
          value={values.amount}
          onBlur={() =>
            setValues((current) => ({
              ...current,
              amount: current.amount === '' ? 0 : current.amount,
            }))
          }
          onChange={(value) =>
            setValues((current) => ({
              ...current,
              amount: value,
            }))
          }
          onFocus={() =>
            setValues((current) => ({
              ...current,
              amount: current.amount === 0 ? '' : current.amount,
            }))
          }
        />
        <Input
          label="카테고리"
          required
          value={values.category}
          onChange={(event) => setValues((current) => ({ ...current, category: event.target.value }))}
        />
        <div className="grid grid-cols-2 gap-3">
          <MonthPicker
            label="시작 월"
            required
            value={values.startMonth}
            onChange={(value) => setValues((current) => ({ ...current, startMonth: value }))}
          />
          <MonthPicker
            label="종료 월"
            value={values.endMonth ?? ''}
            onChange={(value) => setValues((current) => ({ ...current, endMonth: value }))}
          />
        </div>
      </div>
      <div className="mt-5 flex gap-2">
        <Button disabled={isSubmitting} type="submit">
          {initialExpense ? '수정' : '생성'}
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
