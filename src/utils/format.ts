export function formatCurrency(value: number | null | undefined): string {
  const safeValue = value ?? 0

  return `${new Intl.NumberFormat('ko-KR', {
    maximumFractionDigits: 0,
  }).format(safeValue)}원`
}

export function formatWonInput(value: number | ''): string {
  if (value === '') {
    return ''
  }

  return `${new Intl.NumberFormat('ko-KR').format(value)}원`
}

export function parseWonInput(value: string): number | '' {
  const numericValue = value.replace(/[^\d]/g, '')

  return numericValue ? Number(numericValue) : ''
}

export function formatPercentInput(value: number | ''): string {
  if (value === '') {
    return ''
  }

  return `${new Intl.NumberFormat('ko-KR', {
    maximumFractionDigits: 3,
  }).format(value)}%`
}

export function parsePercentInput(value: string): number | '' {
  const numericValue = value.replace(/[^\d.]/g, '')

  return numericValue ? Number(numericValue) : ''
}

export function formatMonth(value: string): string {
  if (!value) {
    return '-'
  }

  const [year, month] = value.split('-')

  return year && month ? `${year}.${month}` : value
}
