import { useCallback, useEffect, useState } from 'react'
import { devTinderApi } from '../api'
import { Avatar } from '../components/Avatar'
import { EmptyState } from '../components/EmptyState'
import { Notice } from '../components/Notice'

export function RequestsPage() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pendingId, setPendingId] = useState(null)
  const [notice, setNotice] = useState(null)
  const loadRequests = useCallback(async () => { setLoading(true); setError(''); try { const response = await devTinderApi.getReceivedRequests(); setRequests(response.data || []) } catch (requestError) { setError(requestError.message) } finally { setLoading(false) } }, [])
  useEffect(() => { const timer = window.setTimeout(loadRequests, 0); return () => window.clearTimeout(timer) }, [loadRequests])
  const review = async (request, status) => { setPendingId(request._id); try { await devTinderApi.reviewRequest({ status, requestId: request._id }); setRequests((current) => current.filter((item) => item._id !== request._id)); setNotice({ type: 'success', message: status === 'accepted' ? `You and ${request.fromUserId.firstName} are now connected.` : 'Request declined.' }) } catch (requestError) { setNotice({ type: 'error', message: requestError.message }) } finally { setPendingId(null) } }

  return <><Notice notice={notice} onDismiss={() => setNotice(null)} /><section className="content-section content-section--narrow"><div className="section-heading"><div><p className="eyebrow">Connection requests</p><h1>Someone wants to build with you.</h1><p>Review incoming requests and grow your dev circle.</p></div></div>{loading && <div className="list-skeleton" />}{!loading && error && <EmptyState title="Couldn’t load requests" body={error} action={<button className="button button--primary" onClick={loadRequests}>Try again</button>} />}{!loading && !error && !requests.length && <EmptyState title="No requests right now" body="When someone is interested in connecting, they’ll show up here." />}{!loading && !error && requests.length > 0 && <div className="request-list">{requests.map((request) => { const developer = request.fromUserId; return <article className="request-row" key={request._id}><Avatar user={developer} size="large" /><div className="request-row__details"><h3>{developer.firstName} {developer.lastName}</h3><p>{developer.about || 'Wants to add you to their dev circle.'}</p><div className="skill-list">{developer.skills?.slice(0, 3).map((skill) => <span key={skill}>{skill}</span>)}</div></div><div className="request-row__actions"><button type="button" className="button button--ghost" disabled={pendingId === request._id} onClick={() => review(request, 'rejected')}>Pass</button><button type="button" className="button button--primary" disabled={pendingId === request._id} onClick={() => review(request, 'accepted')}>{pendingId === request._id ? 'Saving…' : 'Accept'}</button></div></article> })}</div>}</section></>
}
