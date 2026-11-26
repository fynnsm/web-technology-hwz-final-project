import { Header } from './Header.tsx'
import { TextField } from './TextField.tsx'
import { Button } from './Button.tsx'
import { IconButton } from './IconButton.tsx'
import { SessionItem } from './SessionItem.tsx'
import { EmptyState } from './EmptyState.tsx'
import './App.css'
import { useEffect, useState } from 'react'
import type { MouseEvent } from 'react'
import { useNavigate } from 'react-router'
import { createSession, deleteSession, listSessions } from '../api/sessions.ts'
import type { SessionSummary } from '../types/sessions.ts'
import { NAME_KEY } from '../storage.ts'

// So oft wird die Session-Liste neu geladen (Polling)
const POLL_INTERVAL_MS = 3000

export function App() {
  const navigate = useNavigate()
  const [name, setName] = useState(() => localStorage.getItem(NAME_KEY) ?? '')
  const [nameInvalid, setNameInvalid] = useState(false)
  const [sessionName, setSessionName] = useState('')
  const [sessionNameInvalid, setSessionNameInvalid] = useState(false)
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  // null = noch nie geladen (Ladezustand)
  const [sessions, setSessions] = useState<SessionSummary[] | null>(null)
  const [listFailed, setListFailed] = useState(false)

  // Hochzählen lädt die Liste sofort neu (Aktualisieren-Button, nach dem Löschen)
  const [reloadCount, setReloadCount] = useState(0)

  // Beim Betreten laden und danach regelmässig nachladen (Polling).
  // Die Cleanup-Funktion stoppt das Intervall beim Verlassen der Seite.
  useEffect(() => {
    let ignore = false

    async function loadSessions() {
      try {
        const loaded = await listSessions()
        if (!ignore) {
          setSessions(loaded)
          setListFailed(false)
        }
      } catch {
        if (!ignore) {
          setListFailed(true)
        }
      }
    }

    void loadSessions()
    const intervalId = setInterval(() => void loadSessions(), POLL_INTERVAL_MS)
    return () => {
      ignore = true
      clearInterval(intervalId)
    }
  }, [reloadCount])

  function reloadSessions() {
    setReloadCount((count) => count + 1)
  }

  function handleNameChange(value: string) {
    setName(value)
    setNameInvalid(false)
    localStorage.setItem(NAME_KEY, value)
  }

  function handleSessionNameChange(value: string) {
    setSessionName(value)
    setSessionNameInvalid(false)
  }

  async function handleCreate() {
    // Beide Felder prüfen, damit beide Fehler gleichzeitig sichtbar werden
    const nameMissing = name.trim() === ''
    const sessionNameMissing = sessionName.trim() === ''
    setNameInvalid(nameMissing)
    setSessionNameInvalid(sessionNameMissing)
    if (nameMissing || sessionNameMissing) {
      return
    }
    setCreating(true)
    setCreateError(null)
    try {
      const session = await createSession(sessionName.trim())
      navigate(`/sessions/${session.id}`)
    } catch {
      setCreateError('Session konnte nicht erstellt werden. Läuft der Server?')
      setCreating(false)
    }
  }

  // Ohne gültigen Namen nicht beitreten: Der Link navigiert dann nicht.
  function handleJoin(event: MouseEvent<HTMLAnchorElement>) {
    if (name.trim() === '') {
      event.preventDefault()
      setNameInvalid(true)
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteSession(id)
    } catch {
      // Schon gelöscht oder Server nicht erreichbar:
      // Das Nachladen unten zeigt den aktuellen Stand bzw. den Fehler.
    }
    reloadSessions()
  }

  return (
    <>
      <Header userName={name.trim()} />
      <main className="container home">
        <section className="hero">
          <h1 className="hero__title">Gemeinsam schätzen.</h1>
          <p className="hero__text">
            Gib deinen Namen ein und erstelle eine neue Session oder tritt einer
            offenen bei.
          </p>
        </section>

        <div className="home__grid">
          <section
            className="panel start"
            id="start"
            aria-label="Session starten"
          >
            <TextField
              id="name"
              label="Dein Name"
              value={name}
              placeholder="z. B. Janik"
              autoComplete="nickname"
              hint="Wird in diesem Browser gespeichert"
              error="Bitte gib einen Namen ein."
              onChange={handleNameChange}
              invalid={nameInvalid}
            />

            <div className="divider"></div>

            <TextField
              id="session-name"
              label="Name der Session"
              value={sessionName}
              placeholder="z. B. Sprint 12"
              autoComplete="off"
              hint="So erscheint die Session in der Liste"
              error="Bitte gib der Session einen Namen."
              onChange={handleSessionNameChange}
              invalid={sessionNameInvalid}
            />

            <Button block onClick={handleCreate} disabled={creating}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              {creating ? 'Wird erstellt …' : 'Neue Session erstellen'}
            </Button>
            {createError && (
              <p className="start__error" role="alert">
                {createError}
              </p>
            )}
          </section>

          <section
            className="panel sessions"
            id="sessions"
            aria-labelledby="sessions-title"
          >
            <div className="sessions__head">
              <div className="sessions__title">
                <h2 id="sessions-title">Offene Sessions</h2>
                {sessions && !listFailed && (
                  <span className="label">{sessions.length} offen</span>
                )}
              </div>
              <IconButton label="Liste aktualisieren" onClick={reloadSessions}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 12a9 9 0 1 1-2.64-6.36L21 8" />
                  <path d="M21 3v5h-5" />
                </svg>
              </IconButton>
            </div>

            {listFailed ? (
              <EmptyState
                title="Sessions konnten nicht geladen werden"
                text="Läuft der Server? Die Liste versucht es automatisch erneut."
              />
            ) : sessions === null ? (
              <EmptyState
                title="Sessions werden geladen …"
                text="Einen Moment bitte."
              />
            ) : sessions.length === 0 ? (
              <EmptyState
                title="Noch keine offenen Sessions"
                text="Erstelle die erste Session und lade dein Team ein."
              />
            ) : (
              <ul className="sessions__list">
                {sessions.map((session) => (
                  <SessionItem
                    key={session.id}
                    id={session.id}
                    name={session.name}
                    deck={session.deck}
                    participantCount={session.participantCount}
                    onJoin={handleJoin}
                    onDelete={() => handleDelete(session.id)}
                  />
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
    </>
  )
}
