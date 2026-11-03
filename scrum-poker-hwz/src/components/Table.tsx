import './Table.css'
import { Header } from './Header.tsx'

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
              <div
                className="progress"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={5}
                aria-valuenow={4}
                aria-label="Abgegebene Stimmen"
              >
                <div className="progress__bar" style={{ width: '80%' }}></div>
              </div>
              <span className="label">
                Deckt automatisch auf, wenn alle abgestimmt haben
              </span>
            </div>
            <button className="btn btn--primary" type="button">
              Karten aufdecken
            </button>
          </div>

          <section className="deck" aria-labelledby="deck-title">
            <div className="deck__head">
              <div className="deck__title">
                <h1 id="deck-title">Deine Karte</h1>
                <span className="label">Story Points</span>
              </div>
              <div className="segmented" role="group" aria-label="Schätzskala">
                <button
                  className="segmented__option"
                  type="button"
                  aria-pressed="true"
                >
                  Fibonacci
                </button>
                <button
                  className="segmented__option"
                  type="button"
                  aria-pressed="false"
                >
                  T-Shirt
                </button>
              </div>
            </div>

            <div className="cards">
              <button
                className="poker-card"
                type="button"
                aria-pressed="false"
                aria-label="0 Punkte"
              >
                0
              </button>
              <button
                className="poker-card"
                type="button"
                aria-pressed="false"
                aria-label="1 Punkt"
              >
                1
              </button>
              <button
                className="poker-card"
                type="button"
                aria-pressed="false"
                aria-label="2 Punkte"
              >
                2
              </button>
              <button
                className="poker-card"
                type="button"
                aria-pressed="false"
                aria-label="3 Punkte"
              >
                3
              </button>
              <button
                className="poker-card"
                type="button"
                aria-pressed="true"
                aria-label="5 Punkte"
              >
                5
              </button>
              <button
                className="poker-card"
                type="button"
                aria-pressed="false"
                aria-label="8 Punkte"
              >
                8
              </button>
              <button
                className="poker-card"
                type="button"
                aria-pressed="false"
                aria-label="13 Punkte"
              >
                13
              </button>
              <button
                className="poker-card"
                type="button"
                aria-pressed="false"
                aria-label="21 Punkte"
              >
                21
              </button>
              <button
                className="poker-card"
                type="button"
                aria-pressed="false"
                aria-label="Unsicher"
              >
                ?
              </button>
              <button
                className="poker-card"
                type="button"
                aria-pressed="false"
                aria-label="Pause"
              >
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
              </button>
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
            <li className="participant">
              <span className="avatar avatar--saffron">JK</span>
              <span className="participant__info">
                <span className="participant__name">Janik (du)</span>
                <span className="label">Abgestimmt</span>
              </span>
              <span
                className="vote vote--hidden"
                aria-label="Verdeckt abgestimmt"
              >
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
              <span className="kick" aria-hidden="true"></span>
            </li>

            <li className="participant">
              <span className="avatar">LM</span>
              <span className="participant__info">
                <span className="participant__name">Lea</span>
                <span className="label">Abgestimmt</span>
              </span>
              <span
                className="vote vote--hidden"
                aria-label="Verdeckt abgestimmt"
              >
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
              <button
                className="icon-btn kick"
                type="button"
                aria-label="Lea vom Tisch entfernen"
              >
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
              </button>
            </li>

            <li className="participant">
              <span className="avatar avatar--sage">MR</span>
              <span className="participant__info">
                <span className="participant__name">Marco</span>
                <span className="label">Abgestimmt</span>
              </span>
              <span
                className="vote vote--hidden"
                aria-label="Verdeckt abgestimmt"
              >
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
              <button
                className="icon-btn kick"
                type="button"
                aria-label="Marco vom Tisch entfernen"
              >
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
              </button>
            </li>

            <li className="participant">
              <span className="avatar">SK</span>
              <span className="participant__info">
                <span className="participant__name">Sara</span>
                <span className="label">Abgestimmt</span>
              </span>
              <span
                className="vote vote--hidden"
                aria-label="Verdeckt abgestimmt"
              >
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
              <button
                className="icon-btn kick"
                type="button"
                aria-label="Sara vom Tisch entfernen"
              >
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
              </button>
            </li>

            <li className="participant">
              <span className="avatar avatar--sage">NB</span>
              <span className="participant__info">
                <span className="participant__name">Nico</span>
                <span className="label">Wartet</span>
              </span>
              <span className="vote vote--waiting" aria-label="Wartet">
                …
              </span>
              <button
                className="icon-btn kick"
                type="button"
                aria-label="Nico vom Tisch entfernen"
              >
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
              </button>
            </li>
          </ul>
        </aside>
      </main>
    </>
  )
}
