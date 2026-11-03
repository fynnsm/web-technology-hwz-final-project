# Scrum Poker – Projektvorlage

Startpunkt für den Leistungsnachweis «Web Technology» (HWZ). Enthält ein leeres React-Projekt mit TypeScript, gebaut mit Vite.

## Voraussetzungen

- Node.js 24 (LTS)
- pnpm 12

Installation siehe Installationsanleitung zum Kurs.

## VS Code Extensions

```bash
code --install-extension oxc.oxc-vscode
code --install-extension esbenp.prettier-vscode
```

| Extension    | Nutzen                                                                                                                                     |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **Oxc**      | Zeigt Lint-Fehler von oxlint direkt beim Tippen im Editor an (z. B. fehlende Dependencies im `useEffect`). Gleiche Regeln wie `pnpm lint`. |
| **Prettier** | Formatiert den Code einheitlich. In den VS Code Settings _Format On Save_ aktivieren und Prettier als Standardformatierer wählen.          |

## Start

```bash
pnpm install
pnpm dev
```

Die App läuft danach unter <http://localhost:5173>.

## Scripts

| Befehl              | Zweck                                                    |
| ------------------- | -------------------------------------------------------- |
| `pnpm dev`          | Entwicklungs-Server mit Hot Reload                       |
| `pnpm build`        | Typecheck (`tsc`) und Produktions-Build nach `dist/`     |
| `pnpm preview`      | Lokale Vorschau des Builds                               |
| `pnpm lint`         | Code mit oxlint prüfen                                   |
| `pnpm format`       | Code mit Prettier formatieren                            |
| `pnpm format:check` | Prüfen, ob alles formatiert ist (ohne Dateien zu ändern) |

## Struktur

```
src/
├─ main.tsx       Einstiegspunkt, rendert <App />
├─ index.css      Globale Styles
├─ components/    React-Komponenten
│  ├─ App.tsx     Wurzelkomponente
│  └─ App.css     Styles der Wurzelkomponente
├─ hooks/         Eigene Hooks
└─ types/         Types und Interfaces
```

Die Ordner sind ein Vorschlag. Leere `.gitkeep`-Dateien können gelöscht werden, sobald ein Ordner Dateien enthält.

## Backend-Anbindung

Der Entwicklungs-Server leitet alle Requests auf `/api` an `http://localhost:3000` weiter (siehe `vite.config.ts`). Im Client daher immer relativ fetchen:

```ts
const response = await fetch('/api/sessions')
```

Solange kein Backend läuft, beantwortet Vite solche Requests mit einem Fehler – genau der Fall, den die Applikation später sauber behandeln muss.
