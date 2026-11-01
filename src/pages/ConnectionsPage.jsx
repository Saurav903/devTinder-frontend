import { useCallback, useEffect, useState } from 'react'
import { devTinderApi } from '../api'
import { Avatar } from '../components/Avatar'
import { EmptyState } from '../components/EmptyState'

export function ConnectionsPage() {
  const [connections, setConnections] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const loadConnections = useCallback(async () => { setLoading(true); setError(''); try { const response = await devTinderApi.getConnections(); setConnections(response.data || []) } catch (requestError) { setError(requestError.message) } finally { setLoading(false) } }, [])
  useEffect(() => { const timer = window.setTimeout(loadConnections, 0); return () => window.clearTimeout(timer) }, [loadConnections])
  return <section className="content-section"><div className="section-heading"><div><p className="eyebrow">Your people</p><h1>Connections</h1><p>The developers already in your circle.</p></div><button className="refresh-button" type="button" onClick={loadConnections} disabled={loading}>↻ Refresh</button></div>{loading && <div className="loading-grid">{[1, 2, 3].map((item) => <div className="skeleton-card" key={item} />)}</div>}{!loading && error && <EmptyState title="Couldn’t load connections" body={error} action={<button className="button button--primary" onClick={loadConnections}>Try again</button>} />}{!loading && !error && !connections.length && <EmptyState title="Your circle is just getting started" body="Accept a request or connect with someone from Discover to see them here." />}{!loading && !error && connections.length > 0 && <div className="connections-grid">{connections.map((developer) => <article className="connection-card" key={developer._id}><Avatar user={developer} size="large" /><div><h3>{developer.firstName} {developer.lastName}</h3><p>{developer.about || 'Developer in your network.'}</p><div className="skill-list">{developer.skills?.slice(0, 3).map((skill) => <span key={skill}>{skill}</span>)}</div></div></article>)}</div>}</section>
}
