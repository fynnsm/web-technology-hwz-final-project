import type { ReactNode } from 'react'
import './Button.css'

type ButtonProps = {
  children: ReactNode
  href?: string // mit href wird ein Link (<a>) gerendert, sonst ein <button>
  block?: boolean // volle Breite
}

export function Button({ children, href, block = false }: ButtonProps) {
  const className = block ? 'btn btn--primary btn--block' : 'btn btn--primary'

  if (href) {
    return (
      <a className={className} href={href}>
        {children}
      </a>
    )
  }

  return (
    <button className={className} type="button">
      {children}
    </button>
  )
}
