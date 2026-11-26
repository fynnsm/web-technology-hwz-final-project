import { Avatar } from './Avatar.tsx'
import './Header.css'

export function Header() {
  return (
    <header className="header">
      <nav className="nav" aria-label="Hauptnavigation">
        <a
          className="nav__item nav__brand"
          href="index.html"
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
        </a>
        <span className="nav__item nav__user">
          <Avatar initials="JK" color="saffron" small />
          Janik
        </span>
        <a
          className="nav__pill"
          href="index.html"
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
        </a>
      </nav>
    </header>
  )
}
