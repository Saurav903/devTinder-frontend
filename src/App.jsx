import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AppShell } from './components/AppShell'
import { AuthPage } from './pages/AuthPage'
import { ConnectionsPage } from './pages/ConnectionsPage'
import { DiscoverPage } from './pages/DiscoverPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ProfilePage } from './pages/ProfilePage'
import { RequestsPage } from './pages/RequestsPage'
import './App.css'

function App() {
  return <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/sign-in" element={<AuthPage mode="login" />} />
        <Route path="/sign-up" element={<AuthPage mode="signup" />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route index element={<Navigate to="/discover" replace />} />
            <Route path="/discover" element={<DiscoverPage />} />
            <Route path="/requests" element={<RequestsPage />} />
            <Route path="/connections" element={<ConnectionsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
}

export default App
