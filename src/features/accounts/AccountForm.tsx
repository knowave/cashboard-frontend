import { useState, type FormEvent } from 'react'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { CurrencyInput } from '../../components/common/CurrencyInput'
import { Input } from '../../components/common/Input'
import { Select } from '../../components/common/Select'
import type { AccountFormValues, AccountResponse } from '../../types/account'

type AccountFormState = Omit<AccountFormValues, 'balance'> & {
  balance: number | ''
}

const initialValues: AccountFormState = {
  name: '',
  type: 'LIQUID',
  balance: 0,
}

type AccountFormProps = {
  initialAccount?: AccountResponse | null
  isSubmitting?: boolean
  onCancel?: () => void
  onSubmit: (values: AccountFormValues) => void
}

export function AccountForm({ initialAccount, isSubmitting, onCancel, onSubmit }: AccountFormProps) {
  const [values, setValues] = useState<AccountFormState>(() =>
      initialAccount
        ? {
            name: initialAccount.name,
            type: initialAccount.type,
            balance: initialAccount.balance,
          }
        : initialValues,
  )

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit({ ...values, balance: Number(values.balance || 0) })
    if (!initialAccount) {
      setValues(initialValues)
    }
  }

  return (
    <Card as="div">
      <form onSubmit={handleSubmit}>
      <h2 className="mb-4 text-lg font-bold text-slate-950 dark:text-slate-50">
        {initialAccount ? '계좌 수정' : '계좌 생성'}
      </h2>
      <div className="grid gap-4">
        <Input
          label="이름"
          required
          value={values.name}
          onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))}
        />
        <Select
          label="유형"
          value={values.type}
          options={[
            { label: '유동 현금', value: 'LIQUID' },
            { label: '비상금', value: 'EMERGENCY' },
            { label: '저축', value: 'SAVINGS' },
            { label: '투자', value: 'INVESTMENT' },
          ]}
          onChange={(event) => setValues((current) => ({ ...current, type: event.target.value }))}
        />
        <CurrencyInput
          label="잔액"
          required
          value={values.balance}
          onBlur={() =>
            setValues((current) => ({
              ...current,
              balance: current.balance === '' ? 0 : current.balance,
            }))
          }
          onChange={(value) =>
            setValues((current) => ({
              ...current,
              balance: value,
            }))
          }
          onFocus={() =>
            setValues((current) => ({
              ...current,
              balance: current.balance === 0 ? '' : current.balance,
            }))
          }
        />
      </div>
      <div className="mt-5 flex gap-2">
        <Button disabled={isSubmitting} type="submit">
          {initialAccount ? '수정' : '생성'}
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
