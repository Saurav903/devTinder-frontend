export function EmptyState({ title, body, action }) {
  return <div className="empty-state"><span className="empty-icon">✦</span><h3>{title}</h3><p>{body}</p>{action}</div>
}
