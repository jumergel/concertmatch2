
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from './supabase'

export default function MyEventsPage() {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                navigate('/')
            } else {
                setUser(session.user)
            }
        })
    }, [navigate])

    const upcomingEvents = [
        { id: 1, artist: 'Tame Impala', img: 'https://i.scdn.co/image/ab6761610000e5ebc112521e10228d447f52479e', date: 'Mar 15', genre: 'Psychedelic Rock', venue: 'Moody Center · Austin, TX', status: 'Going with: Alex M.', statusColor: 'var(--green)', price: '$45+' },
        { id: 2, artist: 'Billie Eilish', img: 'https://i.scdn.co/image/ab6761610000e5eb745b59a685931221b0dc3d4e', date: 'Apr 12', genre: 'Pop', venue: 'Moody Center · Austin, TX', status: 'Going with: Riley P.', statusColor: 'var(--green)', price: '$70+' },
        { id: 3, artist: 'Kendrick Lamar', img: 'https://i.scdn.co/image/ab6761610000e5eb437b9e2a82505b3d93ff1022', date: 'Apr 20', genre: 'Hip Hop', venue: 'Circuit of the Americas · Austin, TX', status: 'Still looking for a +1 · 89 others looking', statusColor: '#ccc', price: '$85+' }
    ]

    const pastEvents = [
        { id: 4, artist: 'Local Natives', img: 'https://i.scdn.co/image/ab6761610000e5ebb19af0ea736c6228d6eb539c', date: 'Feb 14', genre: 'Indie', venue: 'Emo\'s · Austin, TX', status: 'Went with: Casey W.', statusColor: 'var(--green)', price: '$25+' }
    ]

    return (
        <div style={{ background: '#0a0a0a', minHeight: '100vh', color: 'white', padding: '40px 20px', fontFamily: '"Inter", sans-serif' }}>
            <div className="pp-header">
                <button className="pp-back" onClick={() => navigate('/dashboard')}>←</button>
                <div style={{ width: 32 }}></div>
            </div>

            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>My Events</h1>
                    <p style={{ color: '#888' }}>Your upcoming shows and concert history</p>
                </div>

                {/* UPCOMING */}
                <div style={{ marginBottom: '40px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <h3 style={{ fontSize: '12px', fontWeight: '700', color: '#666', letterSpacing: '1px' }}>UPCOMING</h3>
                        <span style={{ background: '#333', color: 'white', fontSize: '10px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '10px' }}>3</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {upcomingEvents.map(evt => (
                            <div key={evt.id} style={{ background: '#111', border: '1px solid #222', borderRadius: '16px', padding: '16px', display: 'flex', alignItems: 'center', gap: '20px', transition: 'transform 0.2s' }}>
                                <div style={{ width: 80, height: 80, borderRadius: '12px', background: `url(${evt.img}) center/cover`, flexShrink: 0 }}></div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>{evt.date} · {evt.genre}</div>
                                    <div style={{ fontSize: '20px', fontWeight: '800', marginBottom: '4px' }}>{evt.artist}</div>
                                    <div style={{ fontSize: '13px', color: '#ccc', marginBottom: '4px' }}>{evt.venue}</div>
                                    <div style={{ fontSize: '13px', color: evt.statusColor, fontWeight: '600' }}>{evt.status}</div>
                                </div>
                                <div style={{ fontSize: '16px', fontWeight: '700', color: '#10b981' }}>{evt.price}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* PAST SHOWS */}
                <div style={{ marginBottom: '40px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <h3 style={{ fontSize: '12px', fontWeight: '700', color: '#666', letterSpacing: '1px' }}>PAST SHOWS</h3>
                        <span style={{ background: '#333', color: 'white', fontSize: '10px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '10px' }}>1</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {pastEvents.map(evt => (
                            <div key={evt.id} style={{ background: '#111', border: '1px solid #222', borderRadius: '16px', padding: '16px', display: 'flex', alignItems: 'center', gap: '20px', opacity: 0.7 }}>
                                <div style={{ width: 60, height: 60, borderRadius: '12px', background: `url(${evt.img}) center/cover`, flexShrink: 0, filter: 'grayscale(100%)' }}></div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>{evt.date} · {evt.genre}</div>
                                    <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px', color: '#ccc' }}>{evt.artist}</div>
                                    <div style={{ fontSize: '13px', color: '#666', marginBottom: '4px' }}>{evt.venue}</div>
                                    <div style={{ fontSize: '13px', color: evt.statusColor, fontWeight: '600' }}>{evt.status}</div>
                                </div>
                                <div style={{ fontSize: '16px', fontWeight: '700', color: '#666' }}>{evt.price}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* STATS */}
                <div>
                    <h3 style={{ fontSize: '12px', fontWeight: '700', color: '#666', letterSpacing: '1px', marginBottom: '16px' }}>STATS</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                        <div style={{ background: '#161616', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                            <div style={{ fontSize: '24px', fontWeight: '800', color: '#10b981', marginBottom: '4px' }}>4</div>
                            <div style={{ fontSize: '10px', fontWeight: '700', color: '#666', letterSpacing: '1px' }}>SHOWS</div>
                        </div>
                        <div style={{ background: '#161616', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                            <div style={{ fontSize: '24px', fontWeight: '800', color: '#10b981', marginBottom: '4px' }}>3</div>
                            <div style={{ fontSize: '10px', fontWeight: '700', color: '#666', letterSpacing: '1px' }}>BUDDIES</div>
                        </div>
                        <div style={{ background: '#161616', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                            <div style={{ fontSize: '24px', fontWeight: '800', color: '#10b981', marginBottom: '4px' }}>$225</div>
                            <div style={{ fontSize: '10px', fontWeight: '700', color: '#666', letterSpacing: '1px' }}>SPENT</div>
                        </div>
                        <div style={{ background: '#161616', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                            <div style={{ fontSize: '24px', fontWeight: '800', color: '#10b981', marginBottom: '4px' }}>5</div>
                            <div style={{ fontSize: '10px', fontWeight: '700', color: '#666', letterSpacing: '1px' }}>GENRES</div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
