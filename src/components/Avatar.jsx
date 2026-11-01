function getInitials(name = '') {
  return name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'DT'
}

export function Avatar({ user, size = 'medium' }) {
  const label = `${user?.firstName || ''} ${user?.lastName || ''}`.trim()
  if (user?.photoUrl) return <img className={`avatar avatar--${size}`} src={user.photoUrl} alt={label ? `${label}'s profile` : ''} />
  return <span className={`avatar avatar--${size} avatar--fallback`} aria-label={label || 'DevTinder user'}>{getInitials(label)}</span>
}
