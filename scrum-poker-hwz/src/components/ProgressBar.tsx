import './ProgressBar.css'

type ProgressBarProps = {
  value: number
  max: number
  label: string
}

export function ProgressBar({ value, max, label }: ProgressBarProps) {
  return (
    <div
      className="progress"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-label={label}
    >
      <div
        className="progress__bar"
        style={{ width: `${(value / max) * 100}%` }}
      ></div>
    </div>
  )
}
