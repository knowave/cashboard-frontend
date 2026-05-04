import type { InputHTMLAttributes } from 'react'
import { formatWonInput, parseWonInput } from '../../utils/format'

type CurrencyInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'type' | 'value'
> & {
  label: string
  onChange: (value: number | '') => void
  value: number | ''
}

export function CurrencyInput({ label, className = '', onChange, value, ...props }: CurrencyInputProps) {
  return (
    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
      {label}
      <input
        className={`mt-1.5 w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:ring-blue-950 ${className}`}
        inputMode="numeric"
        type="text"
        value={formatWonInput(value)}
        onChange={(event) => onChange(parseWonInput(event.target.value))}
        {...props}
      />
    </label>
  )
}
