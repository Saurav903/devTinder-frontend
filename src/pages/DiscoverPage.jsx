import { useCallback, useEffect, useState } from 'react'
import { devTinderApi } from '../api'
import { Avatar } from '../components/Avatar'
import { EmptyState } from '../components/EmptyState'
import { Notice } from '../components/Notice'

function DeveloperCard({ developer, onAction, pending }) {
  const skills = developer.skills?.slice(0, 4) || []
  return <article className="developer-card"><div className="card-photo-wrap"><Avatar user={developer} size="card" /><span className="availability"><i /> Available to connect</span></div><div className="developer-card__body"><div className="developer-card__headline"><div><h3>{developer.firstName} {developer.lastName}</h3>{developer.age && <span>{developer.age} years old</span>}</div>{developer.gender && <span className="gender-pill">{developer.gender}</span>}</div><p className="developer-about">{developer.about || 'Developer looking for their next great build partner.'}</p><div className="skill-list">{skills.length ? skills.map((skill) => <span key={skill}>{skill}</span>) : <span>curious builder</span>}</div><div className="card-actions"><button className="button button--ghost" type="button" disabled={pending} onClick={() => onAction(developer, 'ignore')}>Skip</button><button className="button button--primary" type="button" disabled={pending} onClick={() => onAction(developer, 'interested')}>{pending ? 'Sending…' : 'Connect'} <span>↗</span></button></div></div></article>
}

export function DiscoverPage() {
  const [developers, setDevelopers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pendingId, setPendingId] = useState(null)
  const [notice, setNotice] = useState(null)

  const loadFeed = useCallback(async () => { setLoading(true); setError(''); try { const response = await devTinderApi.getFeed({ limit: 12 }); setDevelopers(response.data || []) } catch (requestError) { setError(requestError.message) } finally { setLoading(false) } }, [])
  useEffect(() => { const timer = window.setTimeout(loadFeed, 0); return () => window.clearTimeout(timer) }, [loadFeed])
  const handleAction = async (developer, status) => { setPendingId(developer._id); try { await devTinderApi.sendRequest({ status, userId: developer._id }); setDevelopers((current) => current.filter((item) => item._id !== developer._id)); setNotice({ type: 'success', message: status === 'interested' ? `Connection request sent to ${developer.firstName}.` : `${developer.firstName} won’t appear in your feed again.` }) } catch (requestError) { setNotice({ type: 'error', message: requestError.message }) } finally { setPendingId(null) } }

  return <><Notice notice={notice} onDismiss={() => setNotice(null)} /><section className="content-section"><div className="section-heading"><div><p className="eyebrow">Your discovery queue</p><h1>Developers worth meeting</h1><p>Browse the people who are open to a new connection.</p></div><button className="refresh-button" type="button" onClick={loadFeed} disabled={loading}>↻ Refresh</button></div>{loading && <div className="loading-grid">{[1, 2, 3].map((item) => <div className="skeleton-card" key={item} />)}</div>}{!loading && error && <EmptyState title="Couldn’t load your feed" body={error} action={<button className="button button--primary" onClick={loadFeed}>Try again</button>} />}{!loading && !error && !developers.length && <EmptyState title="You’re all caught up" body="There are no new developers in your discovery queue right now." action={<button className="button button--primary" onClick={loadFeed}>Refresh feed</button>} />}{!loading && !error && developers.length > 0 && <div className="developer-grid">{developers.map((developer) => <DeveloperCard key={developer._id} developer={developer} onAction={handleAction} pending={pendingId === developer._id} />)}</div>}</section></>
}
