# Scrum Poker

Leistungsnachweis «Web Technology» an der HWZ. Eine Scrum-Poker-App in React mit TypeScript, gebaut mit Vite.

Team: Janik Kranner, Fynn Merki, Sandra Petkovic

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
| `pnpm typecheck`    | Code mit dem TypeScript-Compiler prüfen                  |
| `pnpm lint`         | Code mit oxlint prüfen, Warnungen gelten als Fehler      |
| `pnpm test`         | Tests mit Vitest ausführen                               |
| `pnpm format`       | Code mit Prettier formatieren                            |
| `pnpm format:check` | Prüfen, ob alles formatiert ist (ohne Dateien zu ändern) |

Vor jedem Push dieselben Prüfungen wie in der CI ausführen:

```bash
pnpm typecheck && pnpm lint && pnpm format:check && pnpm test && pnpm build
```

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

Daneben liegen im Repo:

- `html_prototype/` statischer HTML/CSS-Prototyp aus der Designphase
- `documents/` Designnotizen und Unterrichtsnotizen
- `requirments/` Anforderungen und No-Gos

## Tests

Testdateien enden auf `.test.ts` oder `.test.tsx` und liegen neben dem Code, den sie prüfen. Vitest findet sie automatisch. `describe`, `it` und `expect` werden aus `vitest` importiert. Für Komponententests mit DOM-Zugriff muss eine Browser-Umgebung wie `happy-dom` ergänzt werden.

## Backend-Anbindung

Der Entwicklungs-Server leitet alle Requests auf `/api` an `http://localhost:3000` weiter (siehe `vite.config.ts`). Im Client daher immer relativ fetchen:

```ts
const response = await fetch('/api/sessions')
```

Solange kein Backend läuft, beantwortet Vite solche Requests mit einem Fehler – genau der Fall, den die Applikation später sauber behandeln muss.

## Qualitätssicherung und Abhängigkeiten

Das Projekt nutzt drei zusammenspielende Mechanismen von GitHub, damit nur funktionierender Code auf `main` landet und die Abhängigkeiten aktuell bleiben.

### CI-Pipeline

In `.github/workflows/ci.yaml` ist eine GitHub-Actions-Pipeline definiert. Sie startet automatisch bei jedem Push auf `main` und bei jedem Pull Request gegen `main`. Auf einem frischen Ubuntu-Runner mit Node 24 und pnpm 12 führt sie folgende Schritte aus:

1. `pnpm install --frozen-lockfile` installiert die Abhängigkeiten exakt nach `pnpm-lock.yaml`.
2. `pnpm typecheck` prüft den gesamten Code mit dem TypeScript-Compiler.
3. `pnpm lint` prüft den Code mit oxlint. Warnungen brechen den Lauf.
4. `pnpm format:check` prüft, ob alle Dateien nach Prettier formatiert sind.
5. `pnpm test` führt alle Vitest-Tests aus.
6. `pnpm build` erstellt den Produktions-Build.

Schlägt ein Schritt fehl, bricht der Lauf ab und der Commit wird auf GitHub rot markiert. Da der Runner bei jedem Lauf neu aufgesetzt wird, ist das Ergebnis unabhängig vom lokalen Rechner und zeigt, ob der Code reproduzierbar baut.

### Branch Protection

Der Branch `main` ist geschützt. Direkte Pushes sind nicht erlaubt, auch nicht für Administratoren. Änderungen laufen über Feature-Branches und Pull Requests. GitHub gibt den Merge erst frei, wenn der CI-Job `build-and-test` erfolgreich war und der Branch auf dem aktuellen Stand von `main` ist. Force-Pushes und das Löschen von `main` sind gesperrt.

Damit wird die CI vom reinen Hinweisgeber zur verbindlichen Schranke: Code, der nicht kompiliert, Tests bricht oder nicht baut, kann technisch nicht auf `main` gelangen.

Der typische Ablauf für eine Änderung:

```bash
git switch -c feature/mein-thema
# Code schreiben und committen
git push -u origin feature/mein-thema
gh pr create --fill
# CI abwarten, dann mergen
gh pr merge --squash --delete-branch
```

### Dependabot

Über `.github/dependabot.yml` überwacht Dependabot wöchentlich die npm-Abhängigkeiten des Projekts sowie die Versionen der verwendeten GitHub Actions. Findet es eine neuere Version, eröffnet es automatisch einen Pull Request mit dem Update und einer Zusammenfassung der Änderungen.

Dependabot aktualisiert nichts eigenständig. Jeder Update-PR durchläuft dieselbe CI-Pipeline und dieselbe Branch Protection wie manueller Code. Ein Update, das Typecheck, Tests oder Build bricht, bleibt im PR sichtbar hängen und kann nicht gemergt werden. Updates, die durchlaufen, werden nach kurzer Prüfung manuell gemergt.

### Zusammenspiel

Die drei Mechanismen ergänzen sich: Die CI prüft, die Branch Protection erzwingt das Prüfergebnis, und Dependabot speist regelmässig Updates in genau diesen Prüfprozess ein. Der Stand auf `main` ist dadurch zu jedem Zeitpunkt ein Stand, der kompiliert, getestet ist und baut.
