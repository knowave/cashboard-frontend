import { useState, type InputHTMLAttributes } from 'react'
import { formatPercentInput } from '../../utils/format'

type PercentInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'type' | 'value'
> & {
  label: string
  onChange: (value: number | '') => void
  value: number | ''
}

export function PercentInput({ label, className = '', onBlur, onChange, onFocus, value, ...props }: PercentInputProps) {
  const [rawText, setRawText] = useState<string | null>(null)

  return (
    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
      {label}
      <input
        className={`mt-1.5 w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:ring-blue-950 ${className}`}
        inputMode="decimal"
        type="text"
        value={rawText ?? formatPercentInput(value)}
        onFocus={(e) => {
          setRawText(value === '' ? '' : String(value))
          onFocus?.(e)
        }}
        onBlur={(e) => {
          setRawText(null)
          onBlur?.(e)
        }}
        onChange={(e) => {
          const cleaned = e.target.value.replace(/[^\d.]/g, '')
          setRawText(cleaned)
          const num = Number(cleaned)
          onChange(cleaned === '' || Number.isNaN(num) ? '' : num)
        }}
        {...props}
      />
    </label>
  )
}
