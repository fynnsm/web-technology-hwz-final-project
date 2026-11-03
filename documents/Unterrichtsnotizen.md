# Unterrichtsnotizen

Notizen aus dem Unterricht zum Modulprojekt (Scrum Poker).

## 2026-11-03

### Projektstruktur im React-Code

- Die Ordnerstruktur in `scrum-poker-hwz/src` muss sinnvoll aufgebaut sein.
- Nicht einfach alles in `components/` ablegen.
- Code nach Zweck aufteilen, z. B.:
  - `components/` – wiederverwendbare UI-Bausteine (Button, Card, ...)
  - `pages/` – ganze Seiten / Views
  - `hooks/` – eigene React-Hooks
  - `services/` oder `api/` – Datenzugriff, Backend-Aufrufe
  - `types/` – TypeScript-Typen
  - `utils/` – Hilfsfunktionen

### Hooks

- Mit Hooks kann man sich in React "einklinken" (engl. *hook into*).
- Damit nutzt man React-Funktionen wie State oder Lifecycle direkt in Funktionskomponenten, z. B. `useState`, `useEffect`.

### Gross- und Kleinschreibung in JSX

- Alles, was mit einem kleinen Buchstaben beginnt, sind HTML5-Elemente (z. B. `<div>`, `<button>`).
- Alles, was wir gross schreiben, sind unsere eigenen React Components (z. B. `<Button>`).
