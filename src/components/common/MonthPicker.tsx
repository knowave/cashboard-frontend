import { useMemo, useState } from 'react'
import { formatMonth } from '../../utils/format'

type MonthPickerProps = {
  label: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  value: string
}

const monthLabels = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']

function getCurrentMonthValue() {
  return new Date().toISOString().slice(0, 7)
}

function parseYear(value: string) {
  const currentYear = new Date().getFullYear()
  const year = Number(value.slice(0, 4))

  return Number.isFinite(year) && year > 0 ? year : currentYear
}

export function MonthPicker({
  label,
  onChange,
  placeholder = '월 선택',
  required,
  value,
}: MonthPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [visibleYear, setVisibleYear] = useState(() => parseYear(value))
  const currentMonthValue = getCurrentMonthValue()

  const months = useMemo(
    () =>
      monthLabels.map((monthLabel, index) => {
        const month = `${index + 1}`.padStart(2, '0')

        return {
          label: monthLabel,
          value: `${visibleYear}-${month}`,
        }
      }),
    [visibleYear],
  )

  return (
    <div className="relative">
      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
        {label}
        <button
          type="button"
          aria-expanded={isOpen}
          className="mt-1.5 flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-left text-sm font-semibold text-slate-950 outline-none transition hover:bg-slate-50 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900 dark:focus:border-blue-400 dark:focus:ring-blue-950"
          onClick={() => setIsOpen((current) => !current)}
        >
          <span className={value ? undefined : 'text-slate-400'}>{value ? formatMonth(value) : placeholder}</span>
          <CalendarIcon />
        </button>
      </label>
      {required ? <input className="sr-only" required tabIndex={-1} value={value} onChange={() => undefined} /> : null}

      {isOpen ? (
        <div className="absolute left-0 top-full z-40 mt-2 w-[320px] rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-900/15 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <button
              type="button"
              className="grid size-9 place-items-center rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              onClick={() => setVisibleYear((year) => year - 1)}
            >
              ‹
            </button>
            <strong className="text-lg text-slate-950 dark:text-slate-50">{visibleYear}</strong>
            <button
              type="button"
              className="grid size-9 place-items-center rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              onClick={() => setVisibleYear((year) => year + 1)}
            >
              ›
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {months.map((month) => {
              const isSelected = month.value === value
              const isCurrent = month.value === currentMonthValue

              return (
                <button
                  key={month.value}
                  type="button"
                  className={`rounded-2xl px-3 py-3 text-sm font-semibold transition ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:bg-blue-500 dark:shadow-none'
                      : 'text-slate-700 hover:bg-blue-50 hover:text-blue-700 dark:text-slate-200 dark:hover:bg-blue-950/40 dark:hover:text-blue-300'
                  }`}
                  onClick={() => {
                    onChange(month.value)
                    setIsOpen(false)
                  }}
                >
                  {month.label}
                  {isCurrent ? <span className="mt-1 block text-[10px] opacity-70">이번 달</span> : null}
                </button>
              )
            })}
          </div>

          <div className="mt-4 flex justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
            <button
              type="button"
              className="rounded-full px-3 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              onClick={() => {
                onChange('')
                setIsOpen(false)
              }}
            >
              지우기
            </button>
            <button
              type="button"
              className="rounded-full px-3 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-blue-950/40"
              onClick={() => {
                const current = getCurrentMonthValue()
                onChange(current)
                setVisibleYear(parseYear(current))
                setIsOpen(false)
              }}
            >
              이번 달
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function CalendarIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-5 text-slate-400"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="4" />
      <path d="M3 10h18" />
    </svg>
  )
}
