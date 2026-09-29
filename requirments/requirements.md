# Leistungsnachweis: Web Technology (Scrum Poker App)

**Hochschule für Wirtschaft Zürich (HWZ)**
**Modul:** Kurs «Web Technology»
**Studiengänge:** Bachelor Digital Business & AI (BDA-A25) und Bachelor Wirtschaftsinformatik (BWI-A24)
**Dozent:** Tobias Büchel
**Form:** Gruppenarbeit (2-3 Personen)
**Gewichtung:** 100% Modulnote

## 1. Projektbeschrieb

Im Rahmen des Kurses «Web Technology» entwickeln Sie im Team eine kollaborative "Scrum Poker App" (Planning Poker) als Full-Stack Web-Applikation mit **React und TypeScript**. Das Projekt begleitet den Unterrichtsverlauf: von den HTML/CSS- und TypeScript-Grundlagen über den komponentenbasierten Aufbau des Pokertischs und die Navigation zwischen Ansichten bis hin zur serverseitigen Anbindung und der asynchronen Datenverarbeitung.

Sie bauen die Applikation blockweise parallel zum Unterricht auf. Jeder Block liefert einen Baustein, der am Ende Teil der Abgabe ist.

## 2. Funktionale Anforderungen

- **Einstieg & Session-Verwaltung (Home):** Benutzer geben ihren Namen ein und erstellen entweder eine neue Schätzrunde oder treten einer bestehenden Runde aus der Session-Übersicht bei. Details siehe Abschnitt 2.1.
- **Navigation & teilbarer Link:** Die Applikation besteht aus mindestens zwei Ansichten, die über eigene URLs erreichbar sind. Die Session-ID ist Teil der URL, sodass der Link an die anderen Teilnehmer weitergegeben werden kann und ein Reload auf derselben Seite landet.
- **Pokertisch (Poker Table):** Übersichtliche Ansicht aller aktuell verbundenen Teilnehmer einer Session. Beitreten und Verlassen siehe Abschnitt 2.2.
- **Karten-Decks / Einheiten:** Die Applikation muss mindestens 2 Schätzskalen anbieten (Empfohlen: Fibonacci-Reihe und T-Shirt-Sizes z. B. XS, S, M, L, XL), zwischen denen gewechselt werden kann. **Jeder Teilnehmer** darf die Skala umschalten; das aktive Deck gehört zum Session-Zustand auf dem Server und wird für alle Teilnehmer synchronisiert - es ist also kein rein lokaler UI-Zustand.
- **Kollaboration & Verdeckung:** Sobald ein Mitspieler eine Karte auswählt, wird dies den anderen Clients signalisiert (die Karte bleibt am Pokertisch verdeckt).
- **Aufdecken & Reset:** Zentraler Befehl zum zeitgleichen Aufdecken aller Karten für alle Teilnehmer sowie Zurücksetzen der Runde für den nächsten Schätzvorgang. Das Aufdecken kann explizit erfolgen oder auch automatisch geschehen, wenn alle Teilnehmer abgestimmt haben. Beim Aufdecken wird zusätzlich der **Durchschnitt der abgegebenen Schätzungen** angezeigt. Sind sich alle Teilnehmer einig (alle haben denselben Wert gewählt), wird dies besonders hervorgehoben - mit einem entsprechenden Hinweistext und/oder einer eigenen visuellen Darstellung. Für nicht-numerische Skalen (z. B. T-Shirt-Sizes) legen Sie selbst fest, wie der Durchschnitt gebildet oder sinnvoll ersetzt wird (z. B. über hinterlegte Zahlenwerte oder den häufigsten Wert); die gewählte Variante wird in der Dokumentation kurz begründet.
- **Persistenz im Browser:** Der eingegebene Benutzername wird im Browser gespeichert, sodass ein Seiten-Reload den Benutzer nicht aus der Runde wirft.
- **Lade- und Fehlerzustände:** Jede Server-Anfrage besitzt einen sichtbaren Ladezustand und einen behandelten Fehlerfall (Server nicht erreichbar, unbekannte Session-ID, ungültige Eingabe). Die Applikation darf in keinem dieser Fälle in einen weissen Bildschirm oder eine JavaScript-Exception laufen.

### 2.1 Home-Seite (Detail)

Die Home-Seite (`/`) ist der Einstiegspunkt der Applikation und erfüllt mindestens:

- **Namenseingabe:** Ein Eingabefeld für den Benutzernamen. Ist im Browser-Storage bereits ein Name vorhanden, ist das Feld damit vorbelegt. Der Name kann jederzeit geändert werden - auch dann, wenn der Benutzer vom Pokertisch auf die Home-Seite zurückkehrt. Eine Änderung wird sofort im Storage nachgeführt.
- **Validierung:** Leere Eingaben oder Eingaben, die nur aus Leerzeichen bestehen, werden abgefangen und dem Benutzer sichtbar gemeldet. Ohne gültigen Namen wird weder eine Session erstellt noch einer beigetreten.
- **Session erstellen:** Ein Button erstellt über das Backend eine neue Session (die Session-ID wird serverseitig generiert) und navigiert anschliessend programmatisch auf `/sessions/<id>`.
- **Session-Übersicht & Beitreten:** Die Home-Seite listet die auf dem Server offenen Sessions mit ID und Teilnehmerzahl auf. Ein Klick auf einen Eintrag tritt der Session bei - ein separates Eingabefeld für die Session-ID braucht es dadurch nicht. Beachten Sie, dass diese Liste laufend ändert - sie muss also ebenfalls nachgeladen werden (Polling oder Refresh beim Betreten der Home-Seite). Wird eine Session über einen geteilten Link direkt geöffnet, muss der Beitritt ebenfalls funktionieren; eine unbekannte ID führt zu einem sichtbaren Fehlerzustand und nicht zu einem Absturz oder einem leeren Pokertisch.
- **Session löschen:** Sessions können aus der Übersicht jederzeit gelöscht werden - auch dann, wenn noch Teilnehmer darin sind. Clients, die sich in einer gelöschten Session befinden, dürfen dabei nicht abstürzen: Sie laufen in denselben Fehlerzustand wie bei einer unbekannten Session-ID (sichtbare Meldung und/oder Rückkehr auf die Home-Seite).

### 2.2 Beitreten und Verlassen einer Session

- **Beitreten:** Beim Betreten des Pokertischs meldet sich der Client mit dem Benutzernamen am Server an und erscheint bei allen anderen Teilnehmern am Tisch.
- **Verlassen:** Die Pokertisch-Seite besitzt einen **Leave-Button**, der den Teilnehmer serverseitig aus der Session entfernt und zurück auf die Home-Seite navigiert. Zusätzlich wird der Teilnehmer entfernt, wenn die Pokertisch-Komponente unmountet (Cleanup im `useEffect`) - also z. B. beim Navigieren zurück auf die Home-Seite.
- **Teilnehmerzahl:** Die Session-Übersicht auf der Home-Seite zeigt die Anzahl der aktuell verbundenen Teilnehmer. Diese Zahl muss durch Beitreten und Verlassen wieder korrekt sinken.

**Offene Frage - von Ihnen zu lösen:** Ein Teilnehmer, der einfach den Browser-Tab schliesst oder dessen Netzwerk wegfällt, löst weder den Leave-Button noch zuverlässig ein Unmount aus. Solche "Karteileichen" bleiben sonst für immer am Tisch sitzen. Überlegen Sie sich eine Strategie und begründen Sie diese in der Dokumentation. Mögliche Ansätze:

- **Heartbeat / Timeout:** Jeder Client meldet sich regelmässig beim Server (z. B. über das ohnehin laufende Polling); Teilnehmer, die sich länger als X Sekunden nicht gemeldet haben, werden serverseitig entfernt.
- **Gegenseitiges Entfernen:** Jeder Teilnehmer kann andere Teilnehmer vom Tisch entfernen ("kicken").
- **Inaktivität über Runden:** Wer mehrere Runden hintereinander nicht abstimmt, fliegt raus. (Setzt voraus, dass aufgedeckt werden kann, bevor alle abgestimmt haben.)
- Oder eine eigene, selbst begründete Lösung.

Bewertet wird nicht, welche Variante Sie wählen, sondern dass das Problem erkannt, bewusst gelöst und nachvollziehbar begründet ist.

## 3. Technische Anforderungen & Unterrichtsbezug

Die Lösung muss die im Curriculum behandelten Themenblöcke reflektieren:

- **Tooling:** Scaffolding und Build-Prozess mittels **Vite**, Package-Management über Node/**pnpm**.
- **HTML5 & CSS3:** Semantischer Aufbau der Benutzeroberfläche und Erstellung eines responsiven Pokertischs (Flexbox/Grid) unter konsequenter Anwendung des Box-Modells.
- **TypeScript (Block 2):** Typensichere Umsetzung der Applikationslogik. Eigene Types/Interfaces für Teilnehmer, Karten, Decks und Session-Zustand. `any` ist zu vermeiden.
- **React-Komponenten & Datenfluss:** Modulare Komponentenstruktur in TSX, Datenfluss über Props, deklaratives Rendering von Listen mit stabilen Keys.
- **State & Event-Handling:** Lokales State-Management mit `useState`, Event-Handling der Benutzerinteraktionen, bedingtes Rendering (verdeckt/aufgedeckt), Lifting State Up. State wird nicht direkt mutiert. Wichtig: "Single Source of Truth" beachten: State nicht mehrfach halten, sondern ableiten. Optional kann geteilter State (z. B. der Benutzername) zusätzlich über **Context** bereitgestellt werden - siehe Abschnitt 3.3.
- **Backend & Server-Basics:** Aufbau eines Node.js/Express-Web-Servers zur zentralen Speicherung der Session-Daten und Bereitstellung der API-Routen. Daten müssen nicht persistiert werden; in-memory für Datenhaltung reicht aus.
- **Asynchrone Kommunikation:** Anbindung des Frontends an den Server mit `fetch` und `async/await` innerhalb von `useEffect`. Die Datenübertragung kann entweder via **Polling** oder für Fortgeschrittene mittels **Socket-Anbindung** (WebSockets) gelöst werden. Bei Polling muss das Intervall beim Verlassen der Komponente wieder aufgeräumt werden (Cleanup-Funktion).

### 3.1 Routing (verbindlich)

Die Navigation ist mit **React Router** umzusetzen. Bedingungslose Mindestanforderungen:

- Mindestens zwei fachliche Routen plus eine Fallback-Route:

  ```
  /                      → Einstieg: Name eingeben, Session erstellen oder beitreten
  /sessions/:sessionId   → Pokertisch der jeweiligen Session
  *                      → NotFound-Seite
  ```

- Die Session-ID wird als **Route-Parameter** aus der URL gelesen (`useParams`).
- Nach dem Erstellen bzw. Beitreten einer Session wird **programmatisch navigiert** (`useNavigate`).
- Der Link auf eine Session ist **teilbar und bookmarkbar**: Wird `/sessions/<id>` direkt im Browser geöffnet, lädt die Applikation die entsprechende Session. _Achtung: ungültige Sessions dürfen nicht zum Absturz führen._
- Navigation erfolgt über Router-Mittel (`<Link>` / `useNavigate`), nicht über `window.location` oder `<a href>` auf interne Ziele.

### 3.2 Browser-Storage (verbindlich)

Der Benutzername wird in `localStorage` (oder `sessionStorage`) abgelegt und beim Start der Applikation wieder eingelesen.

### 3.3 Context (optional)

Freiwillige Erweiterung für alle, die über den Pflichtstoff hinausgehen möchten: Der Benutzername wird nicht per Props durch die Komponenten gereicht, sondern in einem **React Context** gehalten (z. B. `UserContext` mit `name` und `setName`).

- Der Provider umschliesst die Applikation (z. B. um den Router herum) und übernimmt auch das Lesen und Schreiben des Browser-Storage.
- Sowohl die **Home-Seite** (Anzeigen und Ändern des Namens) als auch die **Pokertisch-Seite** (Anmelden am Tisch, Anzeigen des eigenen Namens) lesen den Wert aus dem Context.
- Damit entfällt das Durchreichen des Namens über mehrere Komponenten-Ebenen (Prop Drilling).

Im Fachgespräch sollten Sie erklären können, welches Problem Context löst - und in welchen Fällen normale Props die bessere Wahl bleiben.

Korrekte Umsetzung gibt Pluspunkte. Diese sind nicht für das Erreichen der maximalen Punkte notwendig, kann aber fehlende Punkte aus anderen Bereichen kompensieren. _Achtung: Falsche Umsetzung dieses Konzepts kann im schlimmsten Fall zu Abzug führen._

## 4. Abgabe & Formalia

- **Source-Code:** Einreichung der vollständigen Applikation (Client & Server) als komprimiertes Archiv (ZIP) oder Link zu einem Git-Repo. `node_modules` in der ZIP-Datei bitte nicht mitliefern.
- **Projektdokumentation (PDF oder Markdown):**
  - Kurze Beschreibung der Funktionsweise und der Komponentenstruktur.

  - Übersicht der gestalteten API-Schnittstellen
  - Beschreibung, wie Lade- und Fehlerzustände behandelt werden.
  - Ihre Strategie gegen "Karteileichen" gemäss Abschnitt 2.2 - inkl. kurzer Begründung.
  - Schritt-für-Schritt-Anleitung zur lokalen Inbetriebnahme von Server und Client. (Start mittels Entwicklungs-Server reicht i.d.R. aus: `pnpm dev`.)
  - **KI-Deklaration** gemäss Abschnitt 7.

- **Form:** Der Leistungsnachweis wird als Gruppenarbeit durchgeführt. Bitte bilden Sie Gruppen mit 3 Mitgliedern - mit Absprache auch 2er-Gruppen möglich. Alle Gruppenmitglieder müssen aktiv am Leistungsnachweis mitarbeiten.

## 5. Bewertung

Der Leistungsnachweis wird **benotet** und zählt zu **100% als Modulnote**. Die Bewertung erfolgt als **gemeinsame Gruppennote**: Alle Mitglieder einer Gruppe erhalten dieselbe Note. Ausnahme: die individuelle Sanktion gemäss Abschnitt 6.

### 5.1 Bewertungsraster

Beurteilt wird anhand von acht Kriterien.
| # | Kriterium | Was beurteilt wird |
| --- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1 | **Technologieeinsatz** | React und TypeScript korrekt eingesetzt; zentrale React-Konzepte (Komponenten, Props, State) verwendet; HTML und CSS sinnvoll eingesetzt. |
| 2 | **Architektur & Struktur** | Sinnvolle Komponentenstruktur; nachvollziehbar aufgebaute Projektstruktur; saubere Routen-Struktur und Trennung der Ansichten. |
| 3 | **Codequalität & Patterns** | Verständliches Naming; konsistenter Coding Style; keine unnötigen Code-Duplikate; gute Lesbarkeit und Wartbarkeit; keine JavaScript-Errors und keine relevanten Warnings in der Browser-Konsole. |
| 4 | **State-Handling** | State sinnvoll strukturiert und verwaltet; State an geeigneter Stelle gehalten; keine direkte Mutation; korrekte Abgrenzung von URL-Parametern und Komponenten-State. Sauber umgesetzte optionale Erweiterungen (z. B. Context statt Prop Drilling) werden positiv gewertet; sie sind aber keine Voraussetzung für die Bestnote. |
| 5 | **API-Integration** | REST-API korrekt umgesetzt; HTTP-Requests effizient eingesetzt; Lade- und Fehlerfälle sinnvoll behandelt; Cleanup bei Polling. |
| 6 | **TypeScript-Nutzung** | Types sinnvoll definiert; Typensicherheit genutzt; «any» möglichst vermieden. |
| 7 | **Funktionalität und Stabilität** | Implementierte Funktionen arbeiten korrekt; Anwendung verhält sich stabil; Edge Cases (unbekannte Session, Reload, leere Eingabe) sinnvoll behandelt. |
| 8 | **Responsive Design / UI** | Anwendung auf verschiedenen Bildschirmgrössen nutzbar; Layout und Interaktion nachvollziehbar gestaltet; Box-Modell korrekt angewendet. |

## 6. Fachgespräch

Das **Fachgespräch** (mündliche Vertretung) dient der Überprüfung der Eigenleistung und der Plausibilität der eingereichten Arbeit. Die Gruppe vertritt ihre Lösung gemeinsam; **jedes Mitglied wird einzeln zu beliebigen Stellen des Codes befragt** – auch zu Stellen, die es nicht selbst geschrieben hat.

**Ablauf und Dauer**

- **15 Minuten pro Dreiergruppe, 10 Minuten pro Zweiergruppe.**
- Die Gruppe bringt die **lauffähige Applikation** (Server und Client bereits gestartet) sowie den **geöffneten Code** mit. Die Einrichtungszeit zählt nicht zum Zeitfenster – die Applikation muss beim Aufruf laufen.
- Kurze Demo der Applikation durch die Gruppe (max. 3 Minuten), anschliessend Fragen an die einzelnen Mitglieder (ca. 4 Minuten pro Person).

**Vorbereitung – typische Fragen**

- Zeigen Sie mir die Komponente X. Was sind ihre Props und wer rendert sie?
- Warum liegt dieser State genau in dieser Komponente und nicht weiter oben oder weiter unten?
- Welche Routen hat Ihre Applikation? Wie kommt die Session-ID in die Komponente?
- Verfolgen Sie einen Klick auf eine Karte: vom Event über den State und den HTTP-Request bis zur Antwort des Servers und zurück ins UI.
- Welche API-Routen haben Sie definiert und welche HTTP-Methode nutzen sie jeweils – und warum?
- Was passiert, wenn der Server während des Pollings nicht antwortet?
- Warum ist dieser Typ so definiert? Was würde ohne ihn schiefgehen?

**Termine**

- **BWI-A24:** Block 7, 08.12.2026
- **BDA-A25:** Block 8, 02.02.2027

## 7. KI-Einsatz, Deklaration & Eigenleistung

Der Einsatz von KI-Werkzeugen (ChatGPT, Claude, Copilot, Cursor o. ä.) ist **erlaubt, muss aber deklariert werden**. Nicht deklarierter Einsatz gilt als Unredlichkeit.

Die Projektdokumentation enthält dazu einen kurzen Abschnitt «KI-Einsatz» mit:

- Welche Werkzeuge wurden eingesetzt?
- Wofür wurden sie eingesetzt (z. B. Scaffolding, CSS, Debugging, Erklärungen, Refactoring)?
- Welche Teile der Applikation haben Sie von Hand geschrieben?

Entscheidend ist nicht, ob KI eingesetzt wurde, sondern ob Sie den abgegebenen Code **verstehen und vertreten können**. Unredlichkeit oder das Unvermögen, den eigenen Code zu erläutern, führt zur **Note 1.0**.

**Tipp**: Nutzung Sie KI vor allem bei Fragen zu Syntax und einzelnen Ausdrücken. Ganze Komponenten zu generieren hilft i.d.R. nicht für das Verständnis und erhöht die Gefahr, den eigenen Code ungenügend zu erklären können. Der Dozent hilft immer gerne bei Fragen und gibt grosszügige Hinweise, falls man mal nicht weiterkommt.