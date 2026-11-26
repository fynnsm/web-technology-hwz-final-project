import { Header } from './Header.tsx'
import { ProgressBar } from './ProgressBar.tsx'
import { Button } from './Button.tsx'
import { SegmentedControl } from './SegmentedControl.tsx'
import { PokerCard } from './PokerCard.tsx'
import { Participant } from './Participant.tsx'
import './Table.css'

export function Table() {
  return (
    <>
      <Header />
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
