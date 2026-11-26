import './TextField.css'

type TextFieldProps = {
  id: string
  label: string
  hint: string
  error: string
  placeholder?: string
  autoComplete?: string
  value: string
  onChange: (value: string) => void
  invalid?: boolean
}

// Fehlerzustand: Klasse "field--error" am .field setzen
export function TextField({
  id,
  label,
  hint,
  error,
  placeholder,
  value,
  onChange,
  autoComplete,
  invalid
}: TextFieldProps) {
  return (
    <div className={`field ${invalid ? 'field--error' : ''}`}>
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      <input
        className="field__input"
        id={id}
        name={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-describedby={`${id}-hint ${id}-error`}
      />
      <span className="field__hint label" id={`${id}-hint`}>
        {hint}
      </span>
      <span className="field__error" id={`${id}-error`} role="alert">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
        {error}
      </span>
    </div>
  )
}
