import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// globale Styles zuerst, damit die Komponenten-CSS sie überschreiben können
import './index.css'
import { App } from './components/App.tsx'
import { Table } from './components/Table.tsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/table" element={<Table />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
