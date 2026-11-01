import { useCallback, useEffect, useState } from 'react'
import { devTinderApi } from '../api'
import { Avatar } from '../components/Avatar'
import { Notice } from '../components/Notice'
import { useAuth } from '../context/auth'

function profileFields(user = {}) {
  return { age: user.age || '', gender: user.gender || '', about: user.about || '', photoUrl: user.photoUrl || '', skills: Array.isArray(user.skills) ? user.skills.join(', ') : user.skills || '' }
}

export function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const [form, setForm] = useState(() => profileFields(user))
  const [saving, setSaving] = useState(false)
  const [checking, setChecking] = useState(true)
  const [profileStatus, setProfileStatus] = useState('Verifying your DevTinder session…')
  const [notice, setNotice] = useState(null)
  const checkProfileSession = useCallback(async () => { setChecking(true); try { const response = await devTinderApi.getProfile(); if (response && typeof response === 'object' && response.data) { setForm(profileFields(response.data)); updateProfile(response.data) } setProfileStatus('Connected to your DevTinder account') } catch (requestError) { setProfileStatus('Unable to verify your DevTinder account'); setNotice({ type: 'error', message: requestError.message }) } finally { setChecking(false) } }, [updateProfile])
  useEffect(() => { const timer = window.setTimeout(checkProfileSession, 0); return () => window.clearTimeout(timer) }, [checkProfileSession])
  const updateField = (event) => setForm({ ...form, [event.target.name]: event.target.value })
  const save = async (event) => { event.preventDefault(); setSaving(true); const payload = Object.fromEntries(Object.entries(form).filter(([, value]) => value !== '')); if (payload.skills) payload.skills = payload.skills.split(',').map((skill) => skill.trim()).filter(Boolean); if (payload.age) payload.age = Number(payload.age); try { await devTinderApi.updateProfile(payload); updateProfile(payload); setNotice({ type: 'success', message: 'Your profile has been updated.' }) } catch (requestError) { setNotice({ type: 'error', message: requestError.message }) } finally { setSaving(false) } }
  return <><Notice notice={notice} onDismiss={() => setNotice(null)} /><section className="content-section content-section--narrow"><div className="section-heading"><div><p className="eyebrow">Show your best work</p><h1>Shape your profile</h1><p>These fields map directly to your DevTinder backend profile.</p></div><button className="refresh-button" type="button" onClick={checkProfileSession} disabled={checking}>{checking ? 'Checking…' : '↻ Verify API'}</button></div><form className="profile-form" onSubmit={save}><div className="profile-preview"><Avatar user={{ ...user, photoUrl: form.photoUrl }} size="profile" /><div><span>{profileStatus}</span><h3>{user.firstName} {user.lastName}</h3><p>{user.email}</p></div></div><div className="field-row"><label>Age<input name="age" type="number" min="18" max="70" value={form.age} onChange={updateField} placeholder="28" /></label><label>Gender<select name="gender" value={form.gender} onChange={updateField}><option value="">Select an option</option><option value="male">Male</option><option value="female">Female</option><option value="others">Other</option></select></label></div><label>Photo URL<input name="photoUrl" type="url" value={form.photoUrl} onChange={updateField} placeholder="https://images.example.com/you.jpg" /></label><label>About<textarea name="about" rows="5" value={form.about} onChange={updateField} placeholder="What are you building? What kind of people would you like to meet?" /></label><label>Skills <span className="field-hint">Separate each with a comma</span><input name="skills" value={form.skills} onChange={updateField} placeholder="React, Node.js, system design" /></label><button className="button button--primary" disabled={saving} type="submit">{saving ? 'Saving…' : 'Save profile'} <span>→</span></button></form></section></>
}
