import { Link } from 'react-router-dom'
import { useAuth } from '../context/auth'

export function NotFoundPage() {
  const { user } = useAuth()
  return <main className="auth-card-wrap not-found"><div className="empty-state"><span className="empty-icon">?</span><h3>That page doesn’t exist.</h3><p>The route may have changed, or the link is incomplete.</p><Link className="button button--primary" to={user ? '/discover' : '/sign-in'}>Go back</Link></div></main>
}
