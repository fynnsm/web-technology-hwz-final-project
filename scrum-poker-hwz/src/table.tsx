import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Table } from './components/Table.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Table />
  </StrictMode>,
)
