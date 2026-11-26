# web-technology-hwz-final

participants: Janik Kranner, Fynn Merki, Sandra Petkovic
final project for web dev project

---

## Qualitätssicherung und Abhängigkeiten

Das Projekt nutzt drei zusammenspielende Mechanismen von GitHub, damit nur funktionierender Code auf `main` landet und die Abhängigkeiten aktuell bleiben.

### CI-Pipeline

In `.github/workflows/ci.yaml` ist eine GitHub-Actions-Pipeline definiert. Sie startet automatisch bei jedem Push auf `main` und bei jedem Pull Request gegen `main`. Auf einem frischen Ubuntu-Runner mit Node 22 führt sie folgende Schritte aus:

1. `npm ci` installiert die Abhängigkeiten exakt nach `package-lock.json`.
2. `npm run typecheck` prüft den gesamten Code mit dem TypeScript-Compiler.
3. `npm run lint` prüft den Code mit oxlint. Warnungen brechen den Lauf.
4. `npm run format:check` prüft, ob alle Dateien nach Prettier formatiert sind.
5. `npm test` führt alle Vitest-Tests aus.
6. `npm run build` erstellt den Produktions-Build.

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

## Lokal entwickeln

```bash
npm install
npm run dev
```

Vor jedem Push dieselben Prüfungen wie in der CI ausführen:

```bash
npm run typecheck && npm run lint && npm run format:check && npm test && npm run build
```

`npm run format` formatiert alle Dateien automatisch.
