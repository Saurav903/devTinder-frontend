// Both local Vite and the deployed Nginx host expose the Node API under /api.
// Keeping this same-origin avoids CORS and lets the auth cookie work normally.
const API_BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '')

function getMessage(payload) {
  if (typeof payload === 'string') return payload
  return payload?.message || 'Something went wrong. Please try again.'
}

export async function api(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method || 'GET',
    credentials: 'include',
    headers: {
      Accept: 'application/json, text/plain, */*',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  const contentType = response.headers.get('content-type') || ''
  const payload = contentType.includes('application/json') ? await response.json() : await response.text()

  if (!response.ok) throw new Error(getMessage(payload))
  return payload
}

export const devTinderApi = {
  signup: (data) => api('/signup', { method: 'POST', body: data }),
  login: (data) => api('/login', { method: 'POST', body: data }),
  logout: () => api('/logout', { method: 'POST' }),
  getProfile: () => api('/profile/view'),
  updateProfile: (data) => api('/profile/edit', { method: 'PATCH', body: data }),
  getFeed: ({ page = 1, limit = 10 } = {}) => api(`/feed?page=${page}&limit=${limit}`),
  sendRequest: ({ status, userId }) => api(`/request/send/${encodeURIComponent(status)}/${encodeURIComponent(userId)}`, { method: 'POST' }),
  getReceivedRequests: () => api('/user/request/received'),
  reviewRequest: ({ status, requestId }) => api(`/request/review/${encodeURIComponent(status)}/${encodeURIComponent(requestId)}`, { method: 'POST' }),
  getConnections: () => api('/user/connections'),
}
