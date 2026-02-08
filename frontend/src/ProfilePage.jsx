
import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import { useNavigate } from 'react-router-dom'

export default function ProfilePage() {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [avatar, setAvatar] = useState(localStorage.getItem('profile_pic') || null)
    const [vibeResult, setVibeResult] = useState(JSON.parse(localStorage.getItem('vibe_data')) || null)

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

        const checkStorage = () => {
            setVibeResult(JSON.parse(localStorage.getItem('vibe_data')) || null)
            setAvatar(localStorage.getItem('profile_pic') || null)
        }
        window.addEventListener('storage', checkStorage)
        return () => window.removeEventListener('storage', checkStorage)
    }, [navigate])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate('/')
    }

    const toggleSetting = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }))
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                const base64 = reader.result
                setAvatar(base64)
                localStorage.setItem('profile_pic', base64)
            }
            reader.readAsDataURL(file)
        }
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
                <div className="pp-avatar-wrapper">
                    <label htmlFor="avatar-upload" className="pp-avatar" style={avatar ? { backgroundImage: `url(${avatar})`, backgroundSize: 'cover', backgroundPosition: 'center', color: 'transparent', cursor: 'pointer' } : { cursor: 'pointer' }}>
                        {(!avatar && user?.email) ? user.email[0].toUpperCase() : ''}
                        <div className="pp-avatar-overlay" style={{ position: 'absolute', bottom: 0, right: 0, background: '#333', borderRadius: '50%', padding: '4px', fontSize: '12px' }}>✏️</div>
                    </label>
                    <input id="avatar-upload" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                </div>
                <h1 className="pp-name">Placeholder</h1>
                <div className="pp-meta">UT Austin • Member since Jan '26</div>
            </div>

            <div className="pp-section">
                <h3 className="pp-section-title">VIBE TYPE</h3>
                {vibeResult ? (
                    <div className="pp-card-vibe-filled" style={{ background: '#1a1a1a', border: `1px solid ${vibeResult.color}`, borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div className="pp-vibe-icon-filled" style={{ background: `linear-gradient(135deg, ${vibeResult.color}, #666)`, width: '48px', height: '48px', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: '800', color: 'white', fontSize: '18px' }}>{vibeResult.icon}</div>
                        <div className="pp-vibe-text">
                            <strong style={{ color: vibeResult.color, fontSize: '18px', display: 'block', marginBottom: '4px' }}>{vibeResult.title}</strong>
                            <span style={{ color: '#ccc', fontSize: '12px' }}>{vibeResult.desc}</span>
                        </div>
                    </div>
                ) : (
                    <div className="pp-card-vibe-empty">
                        <div className="pp-vibe-icon-placeholder">??</div>
                        <div className="pp-vibe-text">
                            <strong>Not yet taken</strong>
                            <span>Take the Vibe Check to discover your concert personality</span>
                        </div>
                    </div>
                )}

                {!vibeResult && (
                    <button className="btn-hero btn-full" onClick={() => navigate('/dashboard')}>Take the Vibe Check</button>
                )}
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