import { Header } from './Header.tsx'
import { ProgressBar } from './ProgressBar.tsx'
import { Button } from './Button.tsx'
import { SegmentedControl } from './SegmentedControl.tsx'
import { PokerCard } from './PokerCard.tsx'
import { Participant } from './Participant.tsx'
import './Table.css'
import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router'
import { joinSession, leaveSession } from '../api/sessions.ts'
import { NAME_KEY } from '../storage.ts'

export function Table() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const [name] = useState(() => (localStorage.getItem(NAME_KEY) ?? '').trim())
  const [joinFailed, setJoinFailed] = useState(false)
  // Ref statt State: Die Cleanup-Funktion braucht den aktuellen Wert,
  // und die ID ändert nichts an der Anzeige.
  const participantIdRef = useRef<string | null>(null)

  // Beim Betreten am Server anmelden, beim Unmount wieder abmelden.
  useEffect(() => {
    if (!sessionId || name === '') {
      return
    }
    const id = sessionId
    let ignore = false

    async function join() {
      try {
        const participant = await joinSession(id, name)
        if (!ignore) {
          participantIdRef.current = participant.id
        }
      } catch {
        if (!ignore) {
          setJoinFailed(true)
        }
      }
    }
    void join()

    return () => {
      ignore = true
      const participantId = participantIdRef.current
      if (participantId) {
        participantIdRef.current = null
        void leaveSession(id, participantId).catch(() => {})
      }
    }
  }, [sessionId, name])

  async function handleLeave() {
    const participantId = participantIdRef.current
    if (sessionId && participantId) {
      // Auf null setzen, damit die Cleanup-Funktion nicht nochmals abmeldet
      participantIdRef.current = null
      try {
        await leaveSession(sessionId, participantId)
      } catch {
        // Verlassen soll auch klappen, wenn der Server nicht antwortet
      }
    }
    navigate('/')
  }

  // Ohne Namen kann man nicht beitreten: zurück zur Namenseingabe
  if (name === '') {
    return <Navigate to="/" replace />
  }

  if (joinFailed) {
    return (
      <>
        <Header userName={name} />
        <main className="container">
          <h1>Session nicht gefunden</h1>
          <p>
            Diese Session gibt es nicht (mehr), oder der Server antwortet nicht.
          </p>
          <Link to="/">Zurück zur Startseite</Link>
        </main>
      </>
    )
  }

  return (
    <>
      <Header userName={name} onLeave={handleLeave} />
      <main className="container table">
        <section className="table__main">
          {/* Abstimmungsstatus (vor dem Aufdecken) */}
          <div className="panel round">
            <div className="round__progress">
              <span className="round__count">4 von 5 haben abgestimmt</span>
              <ProgressBar value={4} max={5} label="Abgegebene Stimmen" />
              <span className="label">
                Deckt automatisch auf, wenn alle abgestimmt haben
              </span>
            </div>
            <Button>Karten aufdecken</Button>
          </div>

          <section className="deck" aria-labelledby="deck-title">
            <div className="deck__head">
              <div className="deck__title">
                <h1 id="deck-title">Deine Karte</h1>
                <span className="label">Story Points</span>
              </div>
              <SegmentedControl
                label="Schätzskala"
                options={['Fibonacci', 'T-Shirt']}
                selected="Fibonacci"
              />
            </div>

            <div className="cards">
              <PokerCard label="0 Punkte">0</PokerCard>
              <PokerCard label="1 Punkt">1</PokerCard>
              <PokerCard label="2 Punkte">2</PokerCard>
              <PokerCard label="3 Punkte">3</PokerCard>
              <PokerCard label="5 Punkte" selected>
                5
              </PokerCard>
              <PokerCard label="8 Punkte">8</PokerCard>
              <PokerCard label="13 Punkte">13</PokerCard>
              <PokerCard label="21 Punkte">21</PokerCard>
              <PokerCard label="Unsicher">?</PokerCard>
              <PokerCard label="Pause">
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M17 8h1a4 4 0 0 1 0 8h-1" />
                  <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
                  <path d="M6 2v2M10 2v2M14 2v2" />
                </svg>
              </PokerCard>
            </div>
          </section>
        </section>

        <aside
          className="panel participants"
          aria-labelledby="participants-title"
        >
          <div className="participants__head">
            <h2 id="participants-title">Teilnehmende</h2>
            <span className="label">5 am Tisch</span>
          </div>

          <ul>
            <Participant
              name="Janik"
              initials="JK"
              avatarColor="saffron"
              voted
              isYou
            />
            <Participant name="Lea" initials="LM" voted />
            <Participant name="Marco" initials="MR" avatarColor="sage" voted />
            <Participant name="Sara" initials="SK" voted />
            <Participant
              name="Nico"
              initials="NB"
              avatarColor="sage"
              voted={false}
            />
          </ul>
        </aside>
      </main>
    </>
  )
}
