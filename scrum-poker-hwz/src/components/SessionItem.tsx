import { IconButton } from './IconButton.tsx'
import './SessionItem.css'

type SessionItemProps = {
  id: string
  scale: 'Fibonacci' | 'T-Shirt'
  participants: number
}

export function SessionItem({ id, scale, participants }: SessionItemProps) {
  const participantText =
    participants === 1
      ? '1 Teilnehmende Person'
      : `${participants} Teilnehmende`

  return (
    <li className="session">
      <a
        className="session__link"
        href="pokertisch.html"
        aria-label={`Session ${id} beitreten, ${participantText}`}
      >
        {scale === 'T-Shirt' ? (
          <span className="session__tile session__tile--shirt">S·M</span>
        ) : (
          <span className="session__tile">1·2·3</span>
        )}
        <span className="session__info">
          <span className="session__id">{id}</span>
          <span className="label">{scale}</span>
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
          {participants}
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
      </a>
      <IconButton label={`Session ${id} löschen`}>
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
