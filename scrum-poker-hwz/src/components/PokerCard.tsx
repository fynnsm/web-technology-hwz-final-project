import type { ReactNode } from 'react'
import './PokerCard.css'

type PokerCardProps = {
  label: string // Text für Screenreader (aria-label)
  children: ReactNode // Wert auf der Karte, z. B. "5" oder ein Icon
  selected?: boolean
}

export function PokerCard({
  label,
  children,
  selected = false,
}: PokerCardProps) {
  return (
    <button
      className="poker-card"
      type="button"
      aria-pressed={selected}
      aria-label={label}
    >
      {children}
    </button>
  )
}
