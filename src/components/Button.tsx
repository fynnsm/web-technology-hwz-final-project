import type { ReactNode } from 'react'
import './Button.css'

type ButtonProps = {
  children: ReactNode
  block?: boolean // volle Breite
  onClick?: () => void
  disabled?: boolean
}

export function Button({ children, block = false, onClick, disabled = false }: ButtonProps) {
  const className = block ? 'btn btn--primary btn--block' : 'btn btn--primary'


  return (
    <button className={className} type="button" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}
