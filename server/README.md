# Scrum Poker – Server-Vorlage

Startpunkt für das Backend des Leistungsnachweises «Web Technology» (HWZ). Enthält einen vollständigen Express-Server mit TypeScript. Du musst hier nichts programmieren: Starte den Server und verwende die API aus deinem Frontend. Im Fachgespräch erklärst du, welche Routen du aufrufst, mit welcher HTTP-Methode und welche Status-Codes zurückkommen.

## Voraussetzungen

- Node.js 24 (LTS)
- pnpm 12

Installation siehe Installationsanleitung zum Kurs.

## VS Code Extensions

```bash
code --install-extension oxc.oxc-vscode
code --install-extension esbenp.prettier-vscode
code --install-extension humao.rest-client
```

| Extension       | Nutzen                                                                                                       |
| --------------- | ------------------------------------------------------------------------------------------------------------ |
| **Oxc**         | Zeigt Lint-Fehler von oxlint direkt beim Tippen im Editor an. Gleiche Regeln wie `pnpm lint`.                |
| **Prettier**    | Formatiert den Code einheitlich. In den VS Code Settings _Format On Save_ aktivieren und Prettier wählen.    |
| **REST Client** | Schickt die Requests aus `requests.http` per Klick auf «Send Request». Praktisch, um deine Routen zu testen. |

## Start

```bash
pnpm install
pnpm dev
```

Der Server läuft danach unter <http://localhost:3000>. Das Frontend (`scrum-poker-hwz`) startest du in einem zweiten Terminal. Es erreicht den Server über den Vite-Proxy auf `/api`. Deshalb brauchst du hier kein CORS.

Node führt die TypeScript-Dateien direkt aus. Einen Build-Schritt gibt es nicht. Darum enden die Imports auf `.ts` (z. B. `import { DECKS } from './decks.ts'`).

## Scripts

| Befehl              | Zweck                                                      |
| ------------------- | ---------------------------------------------------------- |
| `pnpm dev`          | Server starten, startet bei jeder Änderung neu (`--watch`) |
| `pnpm start`        | Server ohne Neustart bei Änderungen starten                |
| `pnpm typecheck`    | Types prüfen (`tsc --noEmit`)                              |
| `pnpm lint`         | Code mit oxlint prüfen                                     |
| `pnpm format`       | Code mit Prettier formatieren                              |
| `pnpm format:check` | Prüfen, ob alles formatiert ist (ohne Dateien zu ändern)   |

## Struktur

```
src/
├─ server.ts          Startet den Server, 404- und Fehler-Handler
├─ types.ts           Types für gespeicherte Daten und für Antworten
├─ decks.ts           Die Karten-Decks und isDeckId
├─ store.ts           Speicher (Map) und kleine Helfer-Funktionen
├─ views.ts           Wandelt gespeicherte Daten in Antworten um (Stimmen verdecken)
└─ routes/
   └─ sessions.ts     Alle Routen
requests.http         Beispiel-Requests für alle Routen
```

## Daten sind in-memory

Alle Sessions liegen nur im Arbeitsspeicher. Nach einem Neustart des Servers sind sie weg. Mit `pnpm dev` (`--watch`) passiert das auch nach jedem Speichern. Das ist für den Leistungsnachweis so gewollt.

## API-Übersicht

Alle Pfade beginnen mit `/api`. Fehler kommen immer als `{ "error": "..." }`.

| Methode | Pfad                                                    | Body                                      | Antwort                         | Fehler                                                                               |
| ------- | ------------------------------------------------------- | ----------------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------ |
| GET     | `/sessions`                                             | –                                         | 200 `SessionSummary[]`          | –                                                                                    |
| POST    | `/sessions`                                             | `{ "name": "…" }`                         | 201 `SessionView`               | 400 Name fehlt, kein Text oder nur Leerzeichen                                       |
| GET     | `/sessions/:sessionId`                                  | –                                         | 200 `SessionView`               | 404 Session unbekannt                                                                |
| DELETE  | `/sessions/:sessionId`                                  | –                                         | 204                             | 404 Session unbekannt                                                                |
| POST    | `/sessions/:sessionId/participants`                     | `{ "name": "…" }`                         | 201 `ParticipantView` (neu)     | 400 Name fehlt, kein Text oder nur Leerzeichen; 404 Session unbekannt                |
|         |                                                         |                                           | 200 `ParticipantView` (bekannt) |                                                                                      |
| DELETE  | `/sessions/:sessionId/participants/:participantId`      | –                                         | 204                             | 404 Session oder Teilnehmer unbekannt                                                |
| PUT     | `/sessions/:sessionId/participants/:participantId/vote` | `{ "vote": "5" }` oder `{ "vote": null }` | 200 `ParticipantView`           | 400 Karte nicht im Deck; 404 Session oder Teilnehmer unbekannt; 409 schon aufgedeckt |
| PUT     | `/sessions/:sessionId/revealed`                         | `{ "revealed": true }`                    | 200 `SessionView`               | 400 kein Boolean; 404 Session unbekannt                                              |
| PUT     | `/sessions/:sessionId/deck`                             | `{ "deck": "tshirt" }`                    | 200 `SessionView`               | 400 Deck unbekannt; 404 Session unbekannt                                            |

Die Types stehen in `src/types.ts`. Kopiere sie ins Frontend oder schreibe eigene, die dazu passen.

### Regeln, die der Server durchsetzt

- **Session erstellen:** Jede Session braucht einen Namen. Leerzeichen am Anfang und Ende werden entfernt. Der Name muss nicht eindeutig sein, eindeutig ist nur die ID.
- **Beitreten ist idempotent:** Der Name ist der Schlüssel. Tritt jemand mit einem Namen bei, der schon am Tisch sitzt, bekommst du denselben Teilnehmer zurück (200 statt 201). Verglichen wird exakt: `Anna` und `anna` sind zwei Personen. Leerzeichen am Anfang und Ende werden entfernt.
- **Abstimmen:** `vote: null` nimmt die Karte zurück. Nach dem Aufdecken ist Abstimmen gesperrt (409), bis eine neue Runde startet.
- **Aufdecken und neue Runde:** `revealed: true` deckt auf. `revealed: false` startet eine neue Runde und löscht alle Stimmen.
- **Deck wechseln:** Jeder Teilnehmer darf das Deck wechseln. Ein Wechsel startet immer eine neue, verdeckte Runde, weil die alten Karten nicht zum neuen Deck passen.

### Stimmen sind verdeckt

Solange eine Runde nicht aufgedeckt ist, schickt der Server die Stimmen **nicht** mit. Sonst könnte jeder die Karten der anderen im DevTools-Tab «Network» lesen. `hasVoted` verrät nur, ob jemand abgestimmt hat. Das macht `src/views.ts` automatisch. Auch deine eigene Karte siehst du erst nach dem Aufdecken. Welche Karte du gewählt hast, merkst du dir im Frontend.

Vor dem Aufdecken:

```json
{
  "id": "5b1c…",
  "name": "Sprint 12",
  "deck": "fibonacci",
  "revealed": false,
  "participants": [
    { "id": "a1…", "name": "Anna", "hasVoted": true, "vote": null },
    { "id": "b2…", "name": "Ben", "hasVoted": false, "vote": null }
  ]
}
```

Nach dem Aufdecken:

```json
{
  "id": "5b1c…",
  "name": "Sprint 12",
  "deck": "fibonacci",
  "revealed": true,
  "participants": [
    { "id": "a1…", "name": "Anna", "hasVoted": true, "vote": "5" },
    { "id": "b2…", "name": "Ben", "hasVoted": true, "vote": "8" }
  ]
}
```

Karten sind immer Texte (`"5"`, `"M"`). Den Durchschnitt und die Einigkeit berechnest du im Frontend.
