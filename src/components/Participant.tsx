import { Avatar } from './Avatar.tsx'
import { IconButton } from './IconButton.tsx'
// eigenes CSS nach den Komponenten importieren, damit .kick die Styles von .icon-btn überschreibt
import './Participant.css'

type ParticipantProps = {
  name: string
  initials: string
  avatarColor?: 'butter' | 'saffron' | 'sage'
  voted: boolean
  isYou?: boolean // eigene Person: kein "Entfernen"-Button
}

export function Participant({
  name,
  initials,
  avatarColor,
  voted,
  isYou = false,
}: ParticipantProps) {
  return (
    <li className="participant">
      <Avatar initials={initials} color={avatarColor} />
      <span className="participant__info">
        <span className="participant__name">
          {isYou ? `${name} (du)` : name}
        </span>
        <span className="label">{voted ? 'Abgestimmt' : 'Wartet'}</span>
      </span>

      {voted ? (
        <span className="vote vote--hidden" aria-label="Verdeckt abgestimmt">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#2A2D29"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
      ) : (
        <span className="vote vote--waiting" aria-label="Wartet">
          …
        </span>
      )}

      {isYou ? (
        <span className="kick" aria-hidden="true"></span>
      ) : (
        <IconButton className="kick" label={`${name} vom Tisch entfernen`}>
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
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </IconButton>
      )}
    </li>
  )
}
