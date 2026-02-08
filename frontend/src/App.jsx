
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AuthPage from './AuthPage'
import Dashboard from './Dashboard'
import ProfilePage from './ProfilePage'
import { useEffect, useState } from 'react'
import { supabase } from './supabase'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0a0a0a', color: 'white' }}>Loading...</div>
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={!session ? <AuthPage /> : <Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={session ? <Dashboard /> : <Navigate to="/" replace />} />
        <Route path="/profile" element={session ? <ProfilePage /> : <Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
