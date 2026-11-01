export function Notice({ notice, onDismiss }) {
  if (!notice) return null
  return <div className={`notice notice--${notice.type || 'info'}`} role="status"><span>{notice.message}</span><button type="button" onClick={onDismiss} aria-label="Dismiss message">×</button></div>
}
