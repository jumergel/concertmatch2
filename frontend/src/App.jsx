import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './supabase'
import AuthPage from './AuthPage'
import Dashboard from './Dashboard'
import ProfilePage from './ProfilePage'
import CommunityPage from './CommunityPage'
import MyEventsPage from './MyEventsPage'
import MatchesPage from './MatchesPage'

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
        <Route path="/community" element={session ? <CommunityPage /> : <Navigate to="/" replace />} />
        <Route path="/events" element={session ? <MyEventsPage /> : <Navigate to="/" replace />} />
        <Route path="/matches" element={session ? <MatchesPage /> : <Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App