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

  Entwickeln und Testen

  Tests

  Für Tests ist Vitest eingerichtet. Testdateien enden auf .test.ts oder .spec.ts und liegen direkt neben dem Code, den
  sie prüfen, zum Beispiel src/counter.test.ts neben src/counter.ts. Vitest findet diese Dateien automatisch, es ist
  keine weitere Konfiguration nötig.

  Die Testfunktionen describe, it und expect werden explizit aus vitest importiert:
  
  import { describe, it, expect } from 'vitest'

  describe('example', () => {
    it('adds numbers', () => {
      expect(1 + 1).toBe(2)
    })
  })                                                                            

  Aktuell enthält das Projekt noch keine Tests. Das Skript npm test ist mit der Option --passWithNoTests konfiguriert,
  damit die CI auch ohne Testdateien erfolgreich durchläuft. Sobald Tests hinzukommen, werden sie bei jedem Push
  automatisch ausgeführt.

  Tests, die auf das DOM zugreifen, brauchen eine simulierte Browser-Umgebung. Dafür kann happy-dom oder jsdom als
  Dev-Dependency installiert und in einer vitest.config.ts als environment eingetragen werden.

  TypeScript-Regeln

  Die tsconfig.json ist bewusst streng konfiguriert. Der Typecheck in der CI schlägt fehl, wenn eine dieser Regeln
  verletzt wird:

  - Ungenutzte Variablen und Parameter sind nicht erlaubt (noUnusedLocals, noUnusedParameters). Parameter, die bewusst
    ungenutzt bleiben, bekommen einen Unterstrich als Präfix, etwa _event.
  - Typ-Imports müssen als solche gekennzeichnet werden: import type { Foo } from './foo.ts' (verbatimModuleSyntax).
  - Nur löschbare TypeScript-Syntax ist erlaubt (erasableSyntaxOnly). Das heisst keine enum, keine namespace und keine
    Parameter-Properties im Konstruktor. Stattdessen werden Union-Types oder as const-Objekte verwendet.
  - Kein Fallthrough in switch-Blöcken ohne break oder return (noFallthroughCasesInSwitch).
  - Imports dürfen die Dateiendung .ts tragen (allowImportingTsExtensions).

  Diese Regeln sorgen dafür, dass toter Code und mehrdeutige Konstrukte gar nicht erst ins Repository gelangen.

  Lokaler Workflow

  Vor jedem Push werden lokal dieselben Schritte ausgeführt wie in der CI:

  npm run typecheck   # TypeScript-Compiler prüft den Code                      
  npm test            # Vitest führt alle Tests aus
  npm run build       # Produktions-Build wird erstellt

  Oder in einem Befehl:
  
  npm run typecheck && npm test && npm run build
                                                                                
  Laufen diese drei Schritte lokal fehlerfrei durch, ist auch der CI-Lauf auf GitHub grün. Während der Entwicklung
  startet npm run dev den Vite-Dev-Server mit Hot Module Replacement, sodass Änderungen sofort im Browser sichtbar sind.

  ---
