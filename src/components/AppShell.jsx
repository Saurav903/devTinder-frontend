import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/auth'
import { Avatar } from './Avatar'

const navItems = [
  { to: '/discover', label: 'Discover', icon: '✦' },
  { to: '/requests', label: 'Requests', icon: '↙' },
  { to: '/connections', label: 'Connections', icon: '◎' },
  { to: '/profile', label: 'My profile', icon: '◒' },
]

export function AppShell() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const signOut = async () => { await logout(); navigate('/sign-in', { replace: true }) }

  return <div className="app-shell">
    <aside className="sidebar">
      <NavLink className="brand" to="/discover" aria-label="DevTinder home"><span className="brand-mark">&lt;/&gt;</span><span>devtinder</span></NavLink>
      <nav aria-label="Main navigation">{navItems.map((item) => <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-item ${isActive ? 'nav-item--active' : ''}`}><span>{item.icon}</span>{item.label}</NavLink>)}</nav>
      <div className="sidebar-footer"><div className="signed-in"><Avatar user={user} size="small" /><div><strong>{user.firstName}</strong><span>Online</span></div></div><button className="signout" type="button" onClick={signOut}>Sign out</button></div>
    </aside>
    <main className="main-panel">
      <header className="topbar"><div className="topbar__crumb"><span>devtinder</span><span className="topbar__slash">/</span><strong>Developer network</strong></div><div className="topbar__right"><span className="online-dot" /> You’re visible</div></header>
      <Outlet />
    </main>
  </div>
}
