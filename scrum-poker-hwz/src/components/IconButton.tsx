import type { ReactNode } from 'react'
import './IconButton.css'

type IconButtonProps = {
  label: string // Text für Screenreader (aria-label)
  children: ReactNode // das Icon (svg)
  className?: string // zusätzliche Klasse, z. B. "kick"
}

export function IconButton({ label, children, className }: IconButtonProps) {
  return (
    <button
      className={className ? `icon-btn ${className}` : 'icon-btn'}
      type="button"
      aria-label={label}
    >
      {children}
    </button>
  )
}
