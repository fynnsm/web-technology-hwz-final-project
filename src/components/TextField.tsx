import './TextField.css'

type TextFieldProps = {
  id: string
  label: string
  hint: string
  error: string
  placeholder?: string
  defaultValue?: string
  autoComplete?: string
}

// Fehlerzustand: Klasse "field--error" am .field setzen
export function TextField({
  id,
  label,
  hint,
  error,
  placeholder,
  defaultValue,
  autoComplete,
}: TextFieldProps) {
  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      <input
        className="field__input"
        id={id}
        name={id}
        type="text"
        defaultValue={defaultValue}
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
