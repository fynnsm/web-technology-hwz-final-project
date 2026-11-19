import { Header } from './Header.tsx'
import { TextField } from './TextField.tsx'
import { Button } from './Button.tsx'
import { IconButton } from './IconButton.tsx'
import { SessionItem } from './SessionItem.tsx'
import { EmptyState } from './EmptyState.tsx'
import './App.css'

export function App() {
  return (
    <>
      <Header />
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
              defaultValue="Janik"
              placeholder="z. B. Janik"
              autoComplete="nickname"
              hint="Wird in diesem Browser gespeichert"
              error="Bitte gib einen Namen ein."
            />

            <div className="divider"></div>

            <Button href="pokertisch.html" block>
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
              Neue Session erstellen
            </Button>
          </section>

          <section
            className="panel sessions"
            id="sessions"
            aria-labelledby="sessions-title"
          >
            <div className="sessions__head">
              <div className="sessions__title">
                <h2 id="sessions-title">Offene Sessions</h2>
                <span className="label">3 offen</span>
              </div>
              <IconButton label="Liste aktualisieren">
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

            <ul className="sessions__list">
              <SessionItem id="SKR-4821" scale="Fibonacci" participants={5} />
              <SessionItem id="MZQ-1093" scale="T-Shirt" participants={3} />
              <SessionItem id="PLN-7734" scale="Fibonacci" participants={1} />
            </ul>

            <EmptyState
              title="Noch keine offenen Sessions"
              text="Erstelle die erste Session und lade dein Team ein."
            />
          </section>
        </div>
      </main>
    </>
  )
}
