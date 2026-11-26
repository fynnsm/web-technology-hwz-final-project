import './EmptyState.css'

type EmptyStateProps = {
  title: string
  text: string
}

export function EmptyState({ title, text }: EmptyStateProps) {
  return (
    <div className="empty">
      <div className="empty__icon">…Icon…</div>
      <p className="empty__title">{title}</p>
      <p className="empty__text">{text}</p>
    </div>
  )
}
