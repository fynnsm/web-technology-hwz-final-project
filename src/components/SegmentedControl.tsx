import './SegmentedControl.css'

type SegmentedControlProps = {
  label: string
  options: string[]
  selected: string
}

export function SegmentedControl({
  label,
  options,
  selected,
}: SegmentedControlProps) {
  return (
    <div className="segmented" role="group" aria-label={label}>
      {options.map((option) => (
        <button
          key={option}
          className="segmented__option"
          type="button"
          aria-pressed={option === selected}
        >
          {option}
        </button>
      ))}
    </div>
  )
}
