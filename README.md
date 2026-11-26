# web-technology-hwz-final

participants: Janik Kranner, Fynn Merki, Sandra Petkovic
final project for web dev project

---
                                                                                
  Projekt-Setup

  Das Projekt basiert auf Vite mit TypeScript und wurde aus dem Kurs-Template aufgesetzt. Der Code liegt im
  GitHub-Repository fynnsm/web-technology-hwz-final-project auf dem Branch main.

  Projektstruktur
  
  - src/ enthält den Anwendungscode, public/ statische Assets, index.html ist der Einstiegspunkt.
  - package.json definiert die Skripte dev, build, preview, typecheck und test. 
  - tsconfig.json konfiguriert den TypeScript-Compiler.
  - package-lock.json fixiert die Abhängigkeitsversionen, damit npm ci lokal und in der CI identische Pakete
    installiert.

  Versionskontrolle

  Eine .gitignore sorgt dafür, dass generierte und lokale Dateien nicht im Repository landen. Ausgeschlossen sind unter
  anderem node_modules, der Build-Ordner dist, Log-Dateien, Editor-Einstellungen und .DS_Store. Abhängigkeiten werden
  nicht eingecheckt, sondern bei Bedarf mit npm install aus dem Lockfile wiederhergestellt.

  Continuous Integration

  Unter .github/workflows/ci.yaml ist eine GitHub-Actions-Pipeline definiert. Sie läuft bei jedem Push und jedem Pull
  Request auf main und führt auf einem Ubuntu-Runner mit Node 22 folgende Schritte aus:

  1. npm ci installiert die Abhängigkeiten aus dem Lockfile.
  2. npm run typecheck prüft den Code mit dem TypeScript-Compiler.
  3. npm test führt die Tests mit Vitest aus.
  4. npm run build erstellt den Produktions-Build.

  Schlägt ein Schritt fehl, wird der Lauf rot markiert und ist im Tab "Actions" auf GitHub einsehbar. Der erste Lauf
  nach dem Setup war erfolgreich.

  Dependabot

  Über .github/dependabot.yml prüft Dependabot wöchentlich die npm-Abhängigkeiten und eröffnet bei verfügbaren Updates
  automatisch Pull Requests. Da diese PRs ebenfalls die CI durchlaufen, ist sofort sichtbar, ob ein Update den Build
  oder die Tests bricht.

  Lokal starten
  
  npm install
  npm run dev                                                                   

  ---

