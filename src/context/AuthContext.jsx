import { useState } from 'react'
import { devTinderApi } from '../api'
import { AuthContext } from './auth'

function readSession() {
  try {
    const saved = sessionStorage.getItem('devtinder-session')
    return saved ? JSON.parse(saved) : null
  } catch { return null }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession)
  const user = session?.user || null

  const saveSession = (nextSession) => {
    sessionStorage.setItem('devtinder-session', JSON.stringify(nextSession))
    setSession(nextSession)
  }

  const login = (nextUser) => saveSession({ user: nextUser })

  const updateProfile = (profile) => {
    setSession((current) => {
      const nextSession = { ...current, user: { ...current.user, ...profile } }
      sessionStorage.setItem('devtinder-session', JSON.stringify(nextSession))
      return nextSession
    })
  }

  const logout = async () => {
    try { await devTinderApi.logout() } catch { /* End the local session even if the API is unavailable. */ }
    sessionStorage.removeItem('devtinder-session')
    setSession(null)
  }

  return <AuthContext.Provider value={{ user, login, logout, updateProfile }}>{children}</AuthContext.Provider>
}

