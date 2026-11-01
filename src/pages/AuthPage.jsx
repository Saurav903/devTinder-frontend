import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { devTinderApi } from '../api'
import { useAuth } from '../context/auth'

export function AuthPage({ mode }) {
  const location = useLocation()
  const [form, setForm] = useState(() => ({ firstName: '', lastName: '', email: location.state?.profile?.email || '', password: '' }))
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const isSignup = mode === 'signup'
  const from = location.state?.from?.pathname || '/discover'

  if (user) return <Navigate to="/discover" replace />

  const submit = async (event) => {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      if (isSignup) {
        await devTinderApi.signup(form)
        navigate('/sign-in', { replace: true, state: { registered: true, profile: { firstName: form.firstName, lastName: form.lastName, email: form.email } } })
        return
      }
      await devTinderApi.login({ email: form.email, password: form.password })
      const registered = location.state?.profile
      login({ firstName: registered?.firstName || form.email.split('@')[0] || 'Developer', lastName: registered?.lastName || '', email: form.email })
      navigate(from, { replace: true })
    } catch (requestError) { setError(requestError.message) } finally { setBusy(false) }
  }

  return <main className="auth-shell">
    <section className="auth-intro"><Link className="brand brand--large" to="/sign-in" aria-label="DevTinder home"><span className="brand-mark">&lt;/&gt;</span><span>devtinder</span></Link><p className="eyebrow">Build your dev circle</p><h1>Find people you’ll love building with.</h1><p className="intro-copy">Meet developers, swap ideas, and turn mutual interest into a real connection.</p><div className="stat-row"><div><strong>01</strong><span>One tap to connect</span></div><div><strong>∞</strong><span>Possibilities to build</span></div></div></section>
    <section className="auth-card-wrap"><div className="auth-card"><p className="auth-kicker">{isSignup ? 'Join the network' : 'Welcome back'}</p><h2>{isSignup ? 'Start meeting your people.' : 'Pick up where you left off.'}</h2><p className="auth-subtitle">{isSignup ? 'Create your DevTinder account in a minute.' : 'Sign in to browse your next great collaboration.'}</p>
      <form onSubmit={submit} className="auth-form">
        {isSignup && <div className="field-row"><label>First name<input required minLength="4" value={form.firstName} onChange={(event) => setForm({ ...form, firstName: event.target.value })} placeholder="Ada" /></label><label>Last name<input required value={form.lastName} onChange={(event) => setForm({ ...form, lastName: event.target.value })} placeholder="Lovelace" /></label></div>}
        <label>Email address<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" /></label><label>Password<input required type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="••••••••" /></label>
        {location.state?.registered && !error && <p className="form-success">Account created. Sign in to start connecting.</p>}{error && <p className="form-error" role="alert">{error}</p>}
        <button className="button button--primary button--wide" disabled={busy} type="submit">{busy ? 'Please wait…' : isSignup ? 'Create account' : 'Sign in'} <span>→</span></button>
      </form>
      <p className="auth-switch">{isSignup ? 'Already have an account?' : 'New around here?'}<Link to={isSignup ? '/sign-in' : '/sign-up'}>{isSignup ? 'Sign in' : 'Create an account'}</Link></p>
    </div></section>
  </main>
}
