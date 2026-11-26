import type { MouseEvent } from 'react'
import { Link } from 'react-router'
import type { DeckId } from '../types/sessions.ts'
import { IconButton } from './IconButton.tsx'
import './SessionItem.css'

type SessionItemProps = {
  id: string
  name: string
  deck: DeckId
  participantCount: number
  // Wird vor dem Navigieren aufgerufen; kann es mit preventDefault() verhindern
  onJoin: (event: MouseEvent<HTMLAnchorElement>) => void
  onDelete: () => void
}

const DECK_LABELS: Record<DeckId, string> = {
  fibonacci: 'Fibonacci',
  tshirt: 'T-Shirt',
}

export function SessionItem({
  id,
  name,
  deck,
  participantCount,
  onJoin,
  onDelete,
}: SessionItemProps) {
  const participantText =
    participantCount === 1
      ? '1 Teilnehmende Person'
      : `${participantCount} Teilnehmende`
  // Die volle ID (UUID) steht in der URL; in der Liste reicht der Anfang
  const shortId = id.slice(0, 8)

  return (
    <li className="session">
      <Link
        className="session__link"
        to={`/sessions/${id}`}
        onClick={onJoin}
        aria-label={`Session ${name} beitreten, ${participantText}`}
      >
        {deck === 'tshirt' ? (
          <span className="session__tile session__tile--shirt">S·M</span>
        ) : (
          <span className="session__tile">1·2·3</span>
        )}
        <span className="session__info">
          <span className="session__name">{name}</span>
          <span className="label">
            {DECK_LABELS[deck]} · ID {shortId}
          </span>
        </span>
        <span className="session__count">
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
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          {participantCount}
        </span>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#5F635C"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </Link>
      <IconButton label={`Session ${name} löschen`} onClick={onDelete}>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 6h18" />
          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        </svg>
      </IconButton>
    </li>
  )
}
