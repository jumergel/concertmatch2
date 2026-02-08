
import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import { useNavigate } from 'react-router-dom'

export default function ProfilePage() {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // Mock settings state
    const [settings, setSettings] = useState({
        notifications: true,
        showMatch: true,
        darkMode: true,
        visible: true
    })

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                navigate('/')
            } else {
                setUser(session.user)
                setLoading(false)
            }
        })
    }, [navigate])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate('/')
    }

    const toggleSetting = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }))
    }

    if (loading) return <div style={{ background: '#0a0a0a', minHeight: '100vh' }}></div>

    return (
        <div className="profile-page">
            <div className="pp-header">
                <button className="pp-back" onClick={() => navigate('/dashboard')}>←</button>
                <div className="pp-title">Profile</div>
                <div style={{ width: 32 }}></div> {/* spacer */}
            </div>

            <div className="pp-user-section">
                <div className="pp-avatar">
                    {user?.email ? user.email[0].toUpperCase() : 'U'}
                </div>
                <h1 className="pp-name">Placeholder</h1>
                <div className="pp-meta">UT Austin • Member since Jan '26</div>
            </div>

            <div className="pp-section">
                <h3 className="pp-section-title">VIBE TYPE</h3>
                <div className="pp-card-vibe-empty">
                    <div className="pp-vibe-icon-placeholder">??</div>
                    <div className="pp-vibe-text">
                        <strong>Not yet taken</strong>
                        <span>Take the Vibe Check to discover your concert personality</span>
                    </div>
                </div>
                {/* For now, this button just navigates to dashboard where the survey lives, 
                    or we could make it open the survey if we moved the survey logic. 
                    Let's just make it a placeholder or navigate to dashboard with intent. */}
                <button className="btn-hero btn-full" onClick={() => navigate('/dashboard')}>Take the Vibe Check</button>
            </div>

            <div className="pp-section">
                <h3 className="pp-section-title">FAVORITE GENRES</h3>
                <div className="pp-tags">
                    <span className="pp-tag">Indie Rock</span>
                    <span className="pp-tag">Hip Hop</span>
                    <span className="pp-tag">R&B</span>
                    <button className="pp-tag-add">+ Add</button>
                </div>
            </div>

            <div className="pp-section">
                <h3 className="pp-section-title">ABOUT ME</h3>
                <textarea
                    className="pp-bio-input"
                    placeholder="Tap to edit your bio..."
                ></textarea>
            </div>

            <div className="pp-section">
                <h3 className="pp-section-title">CONCERT STATS</h3>
                <div className="pp-stats-grid">
                    <div className="pp-stat-card">
                        <div className="pp-stat-val">4</div>
                        <div className="pp-stat-label">SHOWS</div>
                    </div>
                    <div className="pp-stat-card">
                        <div className="pp-stat-val">3</div>
                        <div className="pp-stat-label">BUDDIES</div>
                    </div>
                    <div className="pp-stat-card">
                        <div className="pp-stat-val text-green">86%</div>
                        <div className="pp-stat-label">AVG MATCH</div>
                    </div>
                    <div className="pp-stat-card">
                        <div className="pp-stat-val text-green">5</div>
                        <div className="pp-stat-label">GENRES</div>
                    </div>
                </div>
            </div>

            <div className="pp-section">
                <h3 className="pp-section-title">SETTINGS</h3>
                <div className="pp-settings-list">
                    <div className="pp-setting-item">
                        <span>Notifications</span>
                        <div className={`toggle-switch ${settings.notifications ? 'active' : ''}`} onClick={() => toggleSetting('notifications')}>
                            <div className="toggle-thumb"></div>
                        </div>
                    </div>
                    <div className="pp-setting-item">
                        <span>Show Match %</span>
                        <div className={`toggle-switch ${settings.showMatch ? 'active' : ''}`} onClick={() => toggleSetting('showMatch')}>
                            <div className="toggle-thumb"></div>
                        </div>
                    </div>
                    <div className="pp-setting-item">
                        <span>Dark Mode</span>
                        <div className={`toggle-switch ${settings.darkMode ? 'active' : ''}`} onClick={() => toggleSetting('darkMode')}>
                            <div className="toggle-thumb"></div>
                        </div>
                    </div>
                    <div className="pp-setting-item">
                        <span>Visible to others</span>
                        <div className={`toggle-switch ${settings.visible ? 'active' : ''}`} onClick={() => toggleSetting('visible')}>
                            <div className="toggle-thumb"></div>
                        </div>
                    </div>
                </div>
            </div>

            <button className="btn-logout" onClick={handleLogout}>Log Out</button>

            <div style={{ height: 40 }}></div>
        </div>
    )
}
