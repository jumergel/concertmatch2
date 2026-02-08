
import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [concerts, setConcerts] = useState([])
    const [concertsLoading, setConcertsLoading] = useState(true)
    const [selectedPerson, setSelectedPerson] = useState(null)

    const [hasVibeResult, setHasVibeResult] = useState(!!localStorage.getItem('vibe_data'))
    const [avatar, setAvatar] = useState(localStorage.getItem('profile_pic'))
    const [sidebarOpen, setSidebarOpen] = useState(false)

    useEffect(() => {
        const checkStorage = () => {
            setHasVibeResult(!!localStorage.getItem('vibe_data'))
            setAvatar(localStorage.getItem('profile_pic'))
        }
        window.addEventListener('storage', checkStorage)
        return () => window.removeEventListener('storage', checkStorage)
    }, [])


    const [showSurvey, setShowSurvey] = useState(false)
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [answers, setAnswers] = useState({})
    const [showResult, setShowResult] = useState(false)
    const [resultData, setResultData] = useState(null)

    const surveyQuestions = [
        {
            id: 1,
            question: "It's Friday night. What's your move?",
            options: [
                { label: 'A', text: 'Cozy night in with headphones' },
                { label: 'B', text: 'Wherever the crowd is going' },
                { label: 'C', text: 'Small get-together with close friends' },
                { label: 'D', text: 'Something spontaneous — surprise me' }
            ]
        },
        {
            id: 2,
            question: "Pick a concert setting:",
            options: [
                { label: 'A', text: 'Stadium tour — go big or go home' },
                { label: 'B', text: 'Music festival — all weekend long' },
                { label: 'C', text: 'Intimate venue — feel every note' },
                { label: 'D', text: 'House show — underground vibes' }
            ]
        },
        {
            id: 3,
            question: "Your go-to genre when nobody's judging?",
            options: [
                { label: 'A', text: 'Rock / Indie / Alternative' },
                { label: 'B', text: 'Hip-Hop / R&B' },
                { label: 'C', text: 'Pop / Electronic / Dance' },
                { label: 'D', text: 'Jazz / Soul / Classical' }
            ]
        },
        {
            id: 4,
            question: "At a concert, you're the person who…",
            options: [
                { label: 'A', text: 'Records everything for the gram' },
                { label: 'B', text: 'Dances like nobody\'s watching' },
                { label: 'C', text: 'Closes eyes and absorbs the music' },
                { label: 'D', text: 'Sings every word at full volume' }
            ]
        },
        {
            id: 5,
            question: "How do you discover new music?",
            options: [
                { label: 'A', text: 'Algorithm playlists — Spotify knows me' },
                { label: 'B', text: 'Friends always put me on' },
                { label: 'C', text: 'Deep dives on my own — rabbit holes' },
                { label: 'D', text: 'Radio, blogs, music publications' }
            ]
        },
        {
            id: 6,
            question: "What matters most in a concert buddy?",
            options: [
                { label: 'A', text: 'Same energy level — match my vibe' },
                { label: 'B', text: 'Similar music taste — no skips' },
                { label: 'C', text: 'Good convo — the hangout matters too' },
                { label: 'D', text: 'Down for anything — flexible and chill' }
            ]
        },
        {
            id: 7,
            question: "Your Spotify Wrapped top genre would be:",
            options: [
                { label: 'A', text: 'Chill / Lo-fi / Acoustic' },
                { label: 'B', text: 'Hype / Trap / EDM' },
                { label: 'C', text: 'Emo / Sad songs / Ballads' },
                { label: 'D', text: 'World / Latin / Afrobeats' }
            ]
        },
        {
            id: 8,
            question: "How early do you show up to a concert?",
            options: [
                { label: 'A', text: 'Gates open — I want the rail' },
                { label: 'B', text: 'Opening act — full experience' },
                { label: 'C', text: 'Headliner only — efficient' },
                { label: 'D', text: 'Whenever I get there tbh' }
            ]
        },
        {
            id: 9,
            question: "Post-concert ritual?",
            options: [
                { label: 'A', text: 'Late-night food run with the squad' },
                { label: 'B', text: 'Rate the setlist and post a review' },
                { label: 'C', text: 'Straight home — social battery drained' },
                { label: 'D', text: 'Replay the songs on the drive home' }
            ]
        },
        {
            id: 10,
            question: "Tell us about yourself",
            type: 'text',
            placeholder: "Junior studying Film. I go to way too many shows at Mohawk and Emo's..."
        }
    ]

    const handleAnswer = (answer, label) => {
        setAnswers(prev => ({ ...prev, [currentQuestion]: { answer, label } }))
        // Delay slightly for visual feedback then move next
        setTimeout(() => {
            if (currentQuestion < surveyQuestions.length - 1) {
                setCurrentQuestion(prev => prev + 1)
            } else {
                handleSurveySubmit()
            }
        }, 200)
    }

    const handleSurveySubmit = async () => {
        console.log("Survey Answers:", answers)

        // Calculate result logic (Simple majority)
        const counts = { A: 0, B: 0, C: 0, D: 0 }
        Object.values(answers).forEach(ans => {
            if (ans.label && counts[ans.label] !== undefined) counts[ans.label]++
        })

        let maxLabel = 'A'
        let maxCount = 0
        Object.entries(counts).forEach(([label, count]) => {
            if (count > maxCount) {
                maxLabel = label
                maxCount = count
            }
        })

        // Determine Vibe Type
        let result = {}
        if (maxLabel === 'A') {
            result = {
                title: 'The Indie Explorer',
                desc: "You thrive on discovering new sounds and love intimate venues. You're there for the music, not just the scene.",
                tags: ['Indie Rock', 'Intimate Venues', 'Vinyl Collector'],
                icon: 'IE',
                color: '#e91e63'
            }
        } else if (maxLabel === 'B') {
            result = {
                title: 'The Hype Beast',
                desc: "You bring the energy. Front row, mosh pit, or shouting every lyric — you live for the moment.",
                tags: ['Hip Hop', 'Front Row', 'High Energy'],
                icon: 'HB',
                color: '#f43f5e'
            }
        } else if (maxLabel === 'C') {
            result = {
                title: 'The Soul Searcher',
                desc: "You feel the music deeply. Whether it's a ballad or a beat drop, you're emotionally connected.",
                tags: ['R&B', 'Deep Cuts', 'Chill Vibes'],
                icon: 'SS',
                color: '#3b82f6'
            }
        } else {
            result = {
                title: 'The Groove Master',
                desc: "You feel music in your body first. If there's a beat, you're moving. You go where the rhythm takes you.",
                tags: ['Dancer', 'Feel-Good', 'Spontaneous'],
                icon: 'GM',
                color: '#10b981'
            }
        }

        localStorage.setItem('vibe_data', JSON.stringify(result))
        setResultData(result)
        setShowSurvey(false)
        setShowResult(true)
        setHasVibeResult(true)
    }

    useEffect(() => {
        // Get current user session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
        })

        // Fetch concerts from backend
        const fetchConcerts = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/concerts?city=Austin,TX')
                const data = await res.json()

                if (data.events) {
                    const formattedEvents = data.events.map(event => {
                        // Parse date
                        const dateObj = new Date(event.date?.start_date || Date.now())
                        const month = dateObj.toLocaleString('default', { month: 'short' }).toUpperCase()
                        const day = dateObj.getDate()

                        return {
                            name: event.title,
                            place: event.venue?.name || (event.address ? event.address[0] : 'Austin, TX'),
                            dateFull: event.date?.when || dateObj.toLocaleDateString(),
                            month,
                            day,
                            tags: ['Concert'], // Default tag
                            price: event.ticket_info?.[0]?.price || 'Tickets',
                            looking: Math.floor(Math.random() * 50) + 12, // Mock "looking" count
                            image: event.thumbnail
                        }
                    })
                    setConcerts(formattedEvents)
                }
            } catch (err) {
                console.error("Failed to fetch concerts:", err)
            } finally {
                setConcertsLoading(false)
            }
        }

        fetchConcerts()
    }, [])



    const handleLogout = async () => {
        await supabase.auth.signOut()
        window.location.href = '/'
    }

    // Enhanced mock data for people
    const people = [
        {
            name: 'Alex H.',
            vibe: 94,
            tags: ['Indie Rock', 'Night Owl', 'Vinyl Collector', 'Intimate Venues'],
            color: 'purple',
            about: "Junior studying Film. I go to way too many shows at Mohawk and Emo's. Always looking for someone to split an Uber to the venue with.",
            vibeType: { title: 'The Indie Explorer', desc: 'Thrives on discovering new sounds and loves intimate venues where you can feel the music.', icon: 'IE', color: '#e91e63' },
            interested: [
                { artist: 'Tame Impala', place: 'Moody Center', date: '2026-03-15', img: 'https://i.scdn.co/image/ab6761610000e5ebc112521e10228d447f52479e' }, // Placeholder or real
                { artist: 'Tyler, the Creator', place: 'Germania Amphitheater', date: '2026-04-05', img: 'https://i.scdn.co/image/ab6761610000e5eb817c134803923c8a98075677' }
            ]
        },
        {
            name: 'Jordan K.',
            vibe: 89,
            tags: ['Hip Hop', 'Extrovert', 'front-row energy', 'Afterparty'],
            color: 'pink',
            about: "Always in the pit. If you're not sweating, you're doing it wrong. Let's rage.",
            vibeType: { title: 'The Hype Beast', desc: 'Brings maximum energy to every show. Knows every lyric and is always ready to jump.', icon: 'HB', color: '#f43f5e' },
            interested: [
                { artist: 'Kendrick Lamar', place: 'COTA', date: '2026-04-20', img: 'https://i.scdn.co/image/ab6761610000e5eb437b9e2a82505b3d93ff1022' },
                { artist: 'Tyler, the Creator', place: 'Germania Amphitheater', date: '2026-04-05', img: 'https://i.scdn.co/image/ab6761610000e5eb817c134803923c8a98075677' }
            ]
        },
        {
            name: 'Sam T.',
            vibe: 86,
            tags: ['R&B', 'Chill Vibes', 'Soul', 'Slow Jams'],
            color: 'blue',
            about: "Just looking for good vibes and good music. Not into the mosh pit life, prefer to chill and appreciate the vocals.",
            vibeType: { title: 'The Soul Searcher', desc: 'Connects deeply with lyrics and melodies. Prefers a relaxed atmosphere to soak it all in.', icon: 'SS', color: '#3b82f6' },
            interested: [
                { artist: 'SZA', place: 'ACL Live', date: '2026-03-22', img: 'https://i.scdn.co/image/ab6761610000e5eb7038dd188c037e89cb72a39d' },
                { artist: 'Doja Cat', place: 'ACL Live', date: '2026-05-03', img: 'https://i.scdn.co/image/ab6761610000e5ebb23667c2f6d289194911d382' }
            ]
        },
        {
            name: 'Riley P.',
            vibe: 82,
            tags: ['Pop', 'Adventurous', 'Sing-along', 'Festival'],
            color: 'green',
            about: "I love everything from top 40s to obscure indie pop. Festivals are my happy place.",
            vibeType: { title: 'The Festival Goer', desc: 'Thrives in crowds and open-air venues. Lives for the collective experience of live music.', icon: 'FG', color: '#10b981' },
            interested: [
                { artist: 'Billie Eilish', place: 'Moody Center', date: '2026-04-12', img: 'https://i.scdn.co/image/ab6761610000e5eb745b59a685931221b0dc3d4e' }
            ]
        },
        {
            name: 'Casey M.',
            vibe: 79,
            tags: ['Electronic', 'Introvert', 'Bass', 'Visuals'],
            color: 'orange',
            about: "Here for the lasers and the bass drops. I usually hang back and enjoy the light show.",
            vibeType: { title: 'The Bass Head', desc: 'Feels the music physically. specific about sound quality and visual production.', icon: 'BH', color: '#f97316' },
            interested: [
                { artist: 'Tame Impala', place: 'Moody Center', date: '2026-03-15', img: 'https://i.scdn.co/image/ab6761610000e5ebc112521e10228d447f52479e' }
            ]
        },
    ]

    return (
        <div className="dashboard-container">
            {sidebarOpen && (
                <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}>
                    <div className="sidebar-menu" onClick={e => e.stopPropagation()}>
                        <div className="sidebar-header">
                            <div className="sh-avatar" style={avatar ? { backgroundImage: `url(${avatar})`, backgroundSize: 'cover', color: 'transparent', width: 48, height: 48, borderRadius: '50%' } : { width: 48, height: 48, borderRadius: '50%', background: 'var(--green)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>
                                {(!avatar && user?.email) ? user.email[0].toUpperCase() : ''}
                            </div>
                            <div className="sh-info">
                                <h4 style={{ color: 'white', margin: 0 }}>Placeholder</h4>
                                <span style={{ color: '#aaa', fontSize: '12px' }}>UT Austin</span>
                            </div>
                        </div>

                        <div className="sidebar-item active" onClick={() => { navigate('/dashboard'); setSidebarOpen(false) }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '12px' }}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                            Home
                        </div>
                        <div className="sidebar-item" onClick={() => { navigate('/community'); setSidebarOpen(false) }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '12px' }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                            Community
                            <span className="sidebar-badge">3</span>
                        </div>
                        <div className="sidebar-item" onClick={() => { navigate('/events'); setSidebarOpen(false) }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '12px' }}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                            My Events
                        </div>
                        <div className="sidebar-item" onClick={() => { navigate('/profile'); setSidebarOpen(false) }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '12px' }}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            Profile
                        </div>
                    </div>
                </div>
            )}
            {/* NAV HEADER */}
            <div className="db-nav">
                <div className="db-logo" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button className="menu-btn" onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', padding: 0, marginRight: 4, cursor: 'pointer' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '24px' }}>
                            <span style={{ display: 'block', height: '2px', background: 'white', borderRadius: '2px', width: '100%' }}></span>
                            <span style={{ display: 'block', height: '2px', background: 'white', borderRadius: '2px', width: '100%' }}></span>
                            <span style={{ display: 'block', height: '2px', background: 'white', borderRadius: '2px', width: '100%' }}></span>
                        </div>
                    </button>

                    {/* LOGO MATCHING SCREENSHOT */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                            width: 32,
                            height: 32,
                            background: '#10b981',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'black'
                        }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
                        </div>
                        <span style={{ fontWeight: 800, fontSize: '20px', letterSpacing: '-0.5px' }}>PlusOne</span>
                    </div>
                </div>
                <div className="db-user-actions" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div className="uni-badge" style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--green)', padding: '6px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        ● Stanford
                    </div>
                    <div
                        className="avatar-sm clickable"
                        onClick={() => navigate('/profile')}
                        style={{ cursor: 'pointer', background: avatar ? `url(${avatar}) center/cover` : 'var(--pink)', color: avatar ? 'transparent' : 'white', fontWeight: 'bold', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        {(!avatar && user?.email) ? user.email[0].toUpperCase() : ''}
                    </div>
                </div>
            </div>

            {/* HERO SECTION */}
            <div className="db-hero-section">
                <div className="hero-badge">● LIVE MATCHING</div>
                <h1>Don't have a +1?<br />We'll find you one.</h1>
                <p>Take a quick personality quiz and get matched with people at your campus who vibe the same way. Because music's better together.</p>
                {!hasVibeResult && (
                    <button className="btn-hero" onClick={() => setShowSurvey(true)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 8 }}><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>
                        Take the Vibe Check
                    </button>
                )}
            </div>



            {/* PEOPLE SECTION */}
            <div className="section-header">
                <h2>People looking for a +1</h2>
                <a href="#">See all →</a>
            </div>
            <div className="people-grid">
                {people.map((p, i) => (
                    <div key={i} className="per-card" onClick={() => setSelectedPerson(p)} style={{ cursor: 'pointer' }}>
                        <div className={`avatar avatar-${p.color}`}>{p.name[0]}</div>
                        <div className="pc-name">{p.name}</div>
                        <div className="pc-sub">UT Austin</div>
                        <div className="pc-tags">
                            {p.tags.slice(0, 2).map(t => <span key={t}>{t}</span>)}
                        </div>
                        <div className="vibe-match">
                            <span className="vm-score">{p.vibe}%</span>
                            <span className="vm-label">VIBE MATCH</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* CONCERTS SECTION */}
            <div className="section-header margin-top">
                <h2>Upcoming concerts</h2>
                <a href="#">Browse all →</a>
            </div>

            {concertsLoading ? (
                <div style={{ color: 'var(--muted)', textAlign: 'center', padding: '40px' }}>Loading concerts...</div>
            ) : (
                <div className="concerts-grid">
                    {concerts.map((c, i) => (
                        <div key={i} className="concert-card">
                            <div className="cc-header">
                                <div className="cc-date-badge">
                                    <span className="cc-month">{c.month}</span>
                                    <span className="cc-day">{c.day}</span>
                                </div>
                                <div className="cc-looking-badge">{c.looking} LOOKING</div>
                            </div>

                            {/* Use real image if available, else placeholder */}
                            <div className="cc-ph-image" style={c.image ? {
                                backgroundImage: `url(${c.image})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            } : {}}></div>

                            <div className="cc-body">
                                <div className="cc-artist">{c.name}</div>
                                <div className="cc-venue">📍 {c.place}</div>
                                <div className="cc-meta">📅 {c.dateFull}</div>
                                <div className="cc-footer">
                                    <div className="cc-price">{c.price}</div>
                                    <button className="btn-outline-sm">Find a +1</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* MODAL */}
            {selectedPerson && (
                <div className="modal-overlay" onClick={() => setSelectedPerson(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setSelectedPerson(null)}>×</button>

                        <div className="modal-header">
                            <div className={`avatar-lg avatar-${selectedPerson.color}`}>{selectedPerson.name[0]}</div>
                            <h2 className="mh-name">{selectedPerson.name}</h2>
                            <div className="mh-uni">UT Austin</div>
                            <div className="mh-vibe-badge">{selectedPerson.vibe}% VIBE MATCH</div>
                        </div>

                        <div className="modal-section">
                            <h4 className="ms-title">MUSIC TASTE</h4>
                            <div className="ms-tags">
                                {selectedPerson.tags.map(t => <span key={t} className="ms-tag">{t}</span>)}
                            </div>
                        </div>

                        <div className="modal-section">
                            <h4 className="ms-title">VIBE TYPE</h4>
                            <div className="vibe-card">
                                <div className="vc-icon" style={{ backgroundColor: selectedPerson.vibeType.color }}>{selectedPerson.vibeType.icon}</div>
                                <div className="vc-info">
                                    <div className="vc-title">{selectedPerson.vibeType.title}</div>
                                    <div className="vc-desc">{selectedPerson.vibeType.desc}</div>
                                </div>
                            </div>
                        </div>

                        <div className="modal-section">
                            <h4 className="ms-title">LOOKING FOR A +1 TO</h4>
                            <div className="looking-list">
                                {selectedPerson.interested.map((evt, i) => (
                                    <div key={i} className="looking-item">
                                        <div className="li-img" style={{ backgroundImage: `url(${evt.img})` }}></div>
                                        <div className="li-info">
                                            <div className="li-artist">{evt.artist}</div>
                                            <div className="li-place">{evt.place} &middot; {evt.date}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="modal-section">
                            <h4 className="ms-title">ABOUT</h4>
                            <div className="ms-text">{selectedPerson.about}</div>
                        </div>

                    </div>
                </div>
            )}
            {/* SURVEY MODAL */}
            {showSurvey && (
                <div className="modal-overlay">
                    <div className="survey-modal-content">
                        <button className="modal-close" onClick={() => setShowSurvey(false)}>×</button>

                        {/* Progress Bar */}
                        <div className="survey-progress-container">
                            <div className="survey-progress-bar" style={{ width: `${((currentQuestion + 1) / surveyQuestions.length) * 100}%` }}></div>
                        </div>
                        <div className="survey-step-indicator">{currentQuestion + 1} / {surveyQuestions.length}</div>

                        <div className="survey-body">
                            <h2 className="survey-question">{surveyQuestions[currentQuestion].question}</h2>

                            {surveyQuestions[currentQuestion].type === 'text' ? (
                                <div className="survey-text-input-container">
                                    <textarea
                                        className="survey-textarea"
                                        placeholder={surveyQuestions[currentQuestion].placeholder}
                                        value={answers[currentQuestion]?.answer || ''}
                                        onChange={(e) => setAnswers(prev => ({ ...prev, [currentQuestion]: { answer: e.target.value } }))}
                                    ></textarea>
                                    <button className="btn-primary-lg" onClick={handleSurveySubmit}>Complete Profile</button>
                                </div>
                            ) : (
                                <div className="survey-options-grid">
                                    {surveyQuestions[currentQuestion].options.map((opt, i) => (
                                        <button
                                            key={i}
                                            className={`survey-option ${answers[currentQuestion]?.label === opt.label ? 'selected' : ''}`}
                                            onClick={() => handleAnswer(opt.text, opt.label)}
                                        >
                                            <span className="survey-opt-label">{opt.label}</span>
                                            <span className="survey-opt-text">{opt.text}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {/* RESULT MODAL */}
            {showResult && resultData && (
                <div className="modal-overlay">
                    <div className="result-modal-content">
                        <button className="modal-close" onClick={() => setShowResult(false)}>×</button>

                        <div className="result-header">
                            <div className="result-icon-lg" style={{ background: `linear-gradient(135deg, ${resultData.color}, #888)` }}>
                                {resultData.icon}
                            </div>
                            <h2 className="result-title">{resultData.title}</h2>
                            <p className="result-desc">{resultData.desc}</p>
                        </div>

                        <div className="result-tags">
                            {resultData.tags.map(t => (
                                <span key={t} className="result-tag" style={{ borderColor: resultData.color, color: resultData.color }}>{t}</span>
                            ))}
                        </div>

                        <div className="result-stats-card">
                            <div className="stat-col">
                                <div className="stat-val" style={{ color: resultData.color }}>28</div>
                                <div className="stat-label">POTENTIAL MATCHES</div>
                            </div>
                            <div className="stat-col">
                                <div className="stat-val" style={{ color: resultData.color }}>88%</div>
                                <div className="stat-label">AVG COMPATIBILITY</div>
                            </div>
                        </div>

                        <button className="btn-primary-lg" style={{ background: resultData.color, color: 'white' }} onClick={() => setShowResult(false)}>Find my +1 →</button>
                    </div>
                </div>
            )}
        </div>
    )
}
