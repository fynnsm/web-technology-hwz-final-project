import './Avatar.css'

type AvatarProps = {
  initials: string
  color?: 'butter' | 'saffron' | 'sage'
  small?: boolean
}

export function Avatar({
  initials,
  color = 'butter',
  small = false,
}: AvatarProps) {
  let className = 'avatar'
  if (small) className += ' avatar--sm'
  if (color !== 'butter') className += ` avatar--${color}`

  return <span className={className}>{initials}</span>
}
