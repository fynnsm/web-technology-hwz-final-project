import { Link } from 'react-router'
import { Avatar } from './Avatar.tsx'
import './Header.css'

type HeaderProps = {
  userName?: string // ohne Namen wird kein Benutzer angezeigt
  onLeave?: () => void // ohne Handler wird kein Verlassen-Button angezeigt
}

// "Fynn Merki" -> "FM", "Janik" -> "JA"
function getInitials(name: string): string {
  const words = name.trim().split(/\s+/)
  const letters =
    words.length > 1 ? words[0][0] + words[1][0] : name.trim().slice(0, 2)
  return letters.toUpperCase()
}

export function Header({ userName, onLeave }: HeaderProps) {
  return (
    <header className="header">
      <nav className="nav" aria-label="Hauptnavigation">
        <Link
          className="nav__item nav__brand"
          to="/"
          aria-label="Scrum Poker – zur Startseite"
        >
          <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
            <rect
              x="5"
              y="6"
              width="14"
              height="20"
              rx="3.5"
              fill="#9BB08A"
              transform="rotate(-14 12 16)"
            />
            <rect
              x="13"
              y="6"
              width="14"
              height="20"
              rx="3.5"
              fill="#F6C86B"
              stroke="#3B3F3A"
              strokeWidth="2"
              transform="rotate(10 20 16)"
            />
            <path
              d="M20 12.6 23 16l-3 3.4-3-3.4Z"
              fill="#3B3F3A"
              transform="rotate(10 20 16)"
            />
          </svg>
        </Link>
        {userName && (
          <span className="nav__item nav__user">
            <Avatar initials={getInitials(userName)} color="saffron" small />
            {userName}
          </span>
        )}
        {onLeave && (
          <button
            className="nav__pill"
            type="button"
            onClick={onLeave}
            aria-label="Session verlassen"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <path d="m16 17 5-5-5-5M21 12H9" />
            </svg>
            <span className="hide-sm">Verlassen</span>
          </button>
        )}
      </nav>
    </header>
  )
}
