import './App.css'
import { Header } from './Header.tsx'

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
            <div className="field">
              <label className="field__label" htmlFor="name">
                Dein Name
              </label>
              <input
                className="field__input"
                id="name"
                name="name"
                type="text"
                defaultValue="Janik"
                placeholder="z. B. Janik"
                autoComplete="nickname"
                aria-describedby="name-hint name-error"
              />
              <span className="field__hint label" id="name-hint">
                Wird in diesem Browser gespeichert
              </span>
              <span className="field__error" id="name-error" role="alert">
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
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4M12 16h.01" />
                </svg>
                Bitte gib einen Namen ein.
              </span>
            </div>

            <div className="divider"></div>

            <a className="btn btn--primary btn--block" href="pokertisch.html">
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
            </a>
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
              <button
                className="icon-btn"
                type="button"
                aria-label="Liste aktualisieren"
              >
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
              </button>
            </div>

            <ul className="sessions__list">
              <li className="session">
                <a
                  className="session__link"
                  href="pokertisch.html"
                  aria-label="Session SKR-4821 beitreten, 5 Teilnehmende"
                >
                  <span className="session__tile">1·2·3</span>
                  <span className="session__info">
                    <span className="session__id">SKR-4821</span>
                    <span className="label">Fibonacci</span>
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
                    5
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
                <button
                  className="icon-btn"
                  type="button"
                  aria-label="Session SKR-4821 löschen"
                >
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
                </button>
              </li>

              <li className="session">
                <a
                  className="session__link"
                  href="pokertisch.html"
                  aria-label="Session MZQ-1093 beitreten, 3 Teilnehmende"
                >
                  <span className="session__tile session__tile--shirt">
                    S·M
                  </span>
                  <span className="session__info">
                    <span className="session__id">MZQ-1093</span>
                    <span className="label">T-Shirt</span>
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
                    3
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
                <button
                  className="icon-btn"
                  type="button"
                  aria-label="Session MZQ-1093 löschen"
                >
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
                </button>
              </li>

              <li className="session">
                <a
                  className="session__link"
                  href="pokertisch.html"
                  aria-label="Session PLN-7734 beitreten, 1 Teilnehmende Person"
                >
                  <span className="session__tile">1·2·3</span>
                  <span className="session__info">
                    <span className="session__id">PLN-7734</span>
                    <span className="label">Fibonacci</span>
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
                    1
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
                <button
                  className="icon-btn"
                  type="button"
                  aria-label="Session PLN-7734 löschen"
                >
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
                </button>
              </li>
            </ul>

            <div className="empty">
              <div className="empty__icon">…Icon…</div>
              <p className="empty__title">Noch keine offenen Sessions</p>
              <p className="empty__text">
                Erstelle die erste Session und lade dein Team ein.
              </p>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
