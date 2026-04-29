type ProgressBarProps = {
  value: number
  max: number
}

export function ProgressBar({ value, max }: ProgressBarProps) {
  const width = Math.min(Math.round((value / max) * 100), 100)

  return (
    <div className="progress" aria-label={`${width}% used`}>
      <span style={{ width: `${width}%` }} />
    </div>
  )
}
