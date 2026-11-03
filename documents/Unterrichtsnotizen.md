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

- Mit Hooks kann man sich in React "einklinken" (engl. _hook into_).
- Damit nutzt man React-Funktionen wie State oder Lifecycle direkt in Funktionskomponenten, z. B. `useState`, `useEffect`.

### Gross- und Kleinschreibung in JSX

- Alles, was mit einem kleinen Buchstaben beginnt, sind HTML5-Elemente (z. B. `<div>`, `<button>`).
- Alles, was wir gross schreiben, sind unsere eigenen React Components (z. B. `<Button>`).

### useState

```tsx
const [text, setText] = useState("");
```

- `useState` gibt der Komponente ein Gedächtnis für einen Wert.
- `''` ist der Startwert.
- `text` ist der aktuelle Wert, `setText` ändert ihn.
- Nach `setText(...)` zeichnet React die Komponente neu. Mit einer normalen Variable (`let text = ''`) passiert das nicht.
- Wert nie direkt ändern (`text = 'xyz'`), immer über `setText`.
- Man kann `useState` mehrmals verwenden, einmal pro Wert (z. B. `name`, `email`).
- Der Wert kann alles sein: Text (`''`), Zahl (`0`), Ja/Nein (`false`), Liste (`[]`).

### Learning: Wo kann ich State-Werte auslesen?

- Der State ist der Speicher **einer Komponente**. Innerhalb dieser Komponente ist er von überall lesbar:
  - in Funktionen wie `add`
  - im JSX, z. B. `<div>{result}</div>`
- Er ist aber **nicht global**: Andere Komponenten sehen ihn nicht automatisch. Will eine andere Komponente den Wert, muss man ihn weitergeben (über Props, kommt später).
- `useState` gehört deshalb ganz oben in die Komponente, nicht in eine Funktion darin. Sonst ist der Wert nur in dieser Funktion sichtbar.
- Werte aus `<input>` sind immer Text: Vor dem Rechnen mit `Number(...)` umwandeln, sonst ergibt `'2' + '3'` den Text `'23'`.

### Props (zusammen mit State)

- Props sind wie **Parameter für eine Komponente**: Die Eltern-Komponente gibt der Kind-Komponente Werte mit.
- Sie sehen aus wie HTML-Attribute: `<Result value={result} />`
- Mit `type ...Props` legt man fest, welche Props eine Komponente erwartet.

**Nur anzeigen:**

```tsx
type ResultProps = {
  value: number;
};

const Result = ({ value }: ResultProps) => {
  return <div className="result">Ergebnis: {value}</div>;
};
```

**Anzeigen und ändern:** Wert und Änderungsfunktion als Props mitgeben.

```tsx
type NumberInputProps = {
  value: string;
  onChange: (newValue: string) => void;
};

const NumberInput = ({ value, onChange }: NumberInputProps) => {
  return (
    <input
      type="number"
      className="input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};
```

**Verwenden in `App`:**

```tsx
export const App = () => {
  const [numberOne, setNumberOne] = useState("");
  const [numberTwo, setNumberTwo] = useState("");
  const [result, setResult] = useState(0);

  const add = () => {
    setResult(Number(numberOne) + Number(numberTwo));
  };

  return (
    <div className="calculator">
      <NumberInput value={numberOne} onChange={setNumberOne} />
      <span>+</span>
      <NumberInput value={numberTwo} onChange={setNumberTwo} />
      <button className="add-button" onClick={add}>
        Add
      </button>
      <Result value={result} />
    </div>
  );
};
```

```
App  (hat den State: numberOne, numberTwo, result)
 ├── NumberInput  ← bekommt numberOne + setNumberOne
 ├── NumberInput  ← bekommt numberTwo + setNumberTwo
 └── Result       ← bekommt result
```

**Regeln:**

- Der **State lebt oben** (in `App`), die Kinder bekommen ihn über Props.
- Props sind **nur zum Lesen**. Das Kind ändert `value` nie selbst, sondern ruft die mitgegebene Funktion auf.
- Daten fliessen **nach unten** (Props), Änderungen gehen **nach oben** (über Funktionen).

**Variante: Event statt Text weitergeben**

Die Prop muss eine **Funktion** sein, nicht das Event selbst:

```tsx
onNumberChange: ChangeEvent<HTMLInputElement>                  // ❌ das ist das Event-Objekt
onNumberChange: (event: ChangeEvent<HTMLInputElement>) => void // ✅ Funktion, die das Event bekommt
onNumberChange: ChangeEventHandler<HTMLInputElement>           // ✅ dasselbe, nur kürzer
```

`ChangeEventHandler<HTMLInputElement>` ist eine fertige Abkürzung von React für `(event: ChangeEvent<HTMLInputElement>) => void`.

```tsx
import { type ChangeEvent, type ChangeEventHandler, useState } from "react";

type NumberInputProps = {
  value: string;
  onNumberChange: ChangeEventHandler<HTMLInputElement>;
};

const NumberInput = ({ value, onNumberChange }: NumberInputProps) => {
  return (
    <input
      type="number"
      className="input"
      value={value}
      onChange={onNumberChange}
    />
  );
};

// in App:
const updateOne = (event: ChangeEvent<HTMLInputElement>) => {
  setNumberOne(event.target.value);
};

<NumberInput value={numberOne} onNumberChange={updateOne} />;
```

- Prop bekommt **Text**: In `App` reicht `onChange={setNumberOne}`, und `App` muss nichts über `<input>` wissen.
- Prop bekommt **Event**: In `App` braucht es eine Funktion wie `updateOne`, die `event.target.value` ausliest.
- Prop-Namen immer klein und in camelCase: `onNumberChange`, nicht `OnNumberchange`.
