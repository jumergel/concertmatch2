import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from './supabase'

export default function CommunityPage() {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [activeChat, setActiveChat] = useState(null)
    const [messageInput, setMessageInput] = useState('')

    // Mock initial chat history matching the screenshot
    const [chats, setChats] = useState({
        1: [
            { id: 101, sender: 'Riley P.', text: "Hey! I saw you're going to Billie Eilish too!", time: '10:30 AM', isMe: false },
            { id: 102, sender: 'Me', text: "Yeah! I can't wait, her new album is so good", time: '10:32 AM', isMe: true },
            { id: 103, sender: 'Riley P.', text: "Right?? BIRDS OF A FEATHER has been on repeat for me", time: '10:33 AM', isMe: false },
            { id: 104, sender: 'Me', text: "Same, that and LUNCH", time: '10:35 AM', isMe: true },
            { id: 105, sender: 'Riley P.', text: "Do you know what time doors open?", time: '10:40 AM', isMe: false },
            { id: 106, sender: 'Me', text: "I think 7pm, show starts at 8", time: '10:41 AM', isMe: true },
        ],
        2: [
            { id: 201, sender: 'Morgan D.', text: 'That Radiohead setlist is going to be insane.', time: '1h', isMe: false }
        ],
        3: [
            { id: 301, sender: 'Casey W.', text: 'Local Natives was so good, we definitely need to go to another show soon.', time: '3d', isMe: false }
        ]
    })

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                navigate('/')
            } else {
                setUser(session.user)
            }
        })
    }, [navigate])

    const incomingRequests = [
        { id: 1, name: 'Alex M.', avatarColor: '#9333ea', event: 'Tame Impala', date: 'Mar 15 • Moody Center' },
        { id: 2, name: 'Sam T.', avatarColor: '#3b82f6', event: 'SZA', date: 'Mar 22 • ACL Live' }
    ]

    const sentRequests = [
        { id: 3, name: 'Jordan K.', avatarColor: '#ec4899', event: 'Kendrick Lamar', date: 'Apr 20 • Circuit of the Americas', status: 'PENDING' }
    ]

    const messages = [
        { id: 1, name: 'Riley P.', avatarColor: '#10b981', lastMsg: 'Hey! So excited for Billie Eilish, have you seen the setlist yet?', time: '2m', online: true },
        { id: 2, name: 'Morgan D.', avatarColor: '#d8b4fe', lastMsg: 'That Radiohead setlist is going to be insane.', time: '1h', online: false },
        { id: 3, name: 'Casey W.', avatarColor: '#f97316', lastMsg: 'Local Natives was so good, we definitely need to go to another show soon.', time: '3d', online: false }
    ]

    const generateResponse = (msg) => {
        const lower = msg.toLowerCase()
        if (lower.includes('meet') || lower.includes('where')) return "The main entrance sounds good! Maybe by the merch table?"
        if (lower.includes('time') || lower.includes('when')) return "I think doors match the ticket time, usually an hour before."
        if (lower.includes('ticket') || lower.includes('seat')) return "I'm in section 102, what about you?"
        if (lower.includes('excited') || lower.includes('wait')) return "Me too!! It's going to be such a good show."
        if (lower.includes('setlist') || lower.includes('song')) return "I really hope they play everything from the new album."
        return "Totally! Btw do you want to grab a drink before?"
    }

    const handleSendMessage = (e) => {
        e.preventDefault()
        if (!messageInput.trim()) return

        const newMsg = {
            id: Date.now(),
            sender: 'Me',
            text: messageInput,
            time: 'Just now',
            isMe: true
        }

        const chatId = activeChat.id
        setChats(prev => ({
            ...prev,
            [chatId]: [...(prev[chatId] || []), newMsg]
        }))
        setMessageInput('')

        // Simulate context-aware response
        setTimeout(() => {
            const replyText = generateResponse(newMsg.text)
            const replyMsg = {
                id: Date.now() + 1,
                sender: activeChat.name,
                text: replyText,
                time: 'Just now',
                isMe: false
            }
            setChats(prev => ({
                ...prev,
                [chatId]: [...(prev[chatId] || []), replyMsg]
            }))
        }, 1500)
    }

    return (
        <div className="page-container" style={{ background: '#0a0a0a', minHeight: '100vh', color: 'white', padding: '40px 20px' }}>
            <div className="pp-header" style={{ marginBottom: 20, display: 'flex', alignItems: 'center' }}>
                <button
                    className="pp-back"
                    onClick={() => activeChat ? setActiveChat(null) : navigate('/dashboard')}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                        padding: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        transition: 'background 0.2s',
                        marginRight: 16
                    }}
                    onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                >
                    {activeChat ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    ) : (
                        <span style={{ fontSize: '24px' }}>←</span>
                    )}
                </button>

                {activeChat ? (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: 40, height: 40, borderRadius: '50%', background: activeChat.avatarColor, display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', color: 'black' }}>
                                {activeChat.name[0]}
                            </div>
                            <div>
                                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{activeChat.name}</div>
                                <div style={{ fontSize: '12px', color: '#888' }}>Billie Eilish +1</div>
                            </div>
                        </div>
                        <div style={{ color: '#22c55e', fontWeight: '800', fontSize: '14px' }}>82%</div>
                    </div>
                ) : (
                    <div className="pp-title" style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold' }}>
                        Community
                    </div>
                )}
            </div>

            {activeChat ? (
                /* CHAT INTERFACE */
                <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
                    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingBottom: '20px' }}>
                        {(chats[activeChat.id] || []).map((msg, idx) => (
                            <div key={msg.id} style={{ display: 'flex', flexDirection: 'column' }}>
                                {idx === 6 && <div style={{ textAlign: 'center', color: '#444', fontSize: '10px', fontWeight: '700', margin: '20px 0', letterSpacing: '1px' }}>TODAY</div>}
                                <div style={{
                                    alignSelf: msg.isMe ? 'flex-end' : 'flex-start',
                                    maxWidth: '75%',
                                    background: msg.isMe ? '#22c55e' : '#222',
                                    color: msg.isMe ? 'black' : 'white',
                                    padding: '12px 16px',
                                    borderRadius: '20px',
                                    borderBottomRightRadius: msg.isMe ? '4px' : '20px',
                                    borderBottomLeftRadius: msg.isMe ? '20px' : '4px',
                                    fontWeight: '500',
                                    fontSize: '15px'
                                }}>
                                    <div>{msg.text}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '10px', marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid #222' }}>
                        <input
                            type="text"
                            value={messageInput}
                            onChange={e => setMessageInput(e.target.value)}
                            placeholder="Type a message..."
                            style={{
                                flex: 1,
                                background: '#111',
                                border: '1px solid #333',
                                borderRadius: '24px',
                                padding: '12px 20px',
                                color: 'white',
                                outline: 'none'
                            }}
                        />
                        <button type="submit" style={{
                            background: '#22c55e',
                            color: 'black',
                            border: 'none',
                            borderRadius: '50%',
                            width: '44px',
                            height: '44px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                        </button>
                    </form>
                </div>
            ) : (
                /* COMMUNITY LIST VIEW */
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div style={{ marginBottom: '40px' }}>
                        <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>Community</h1>
                        <p style={{ color: '#888' }}>Your +1 requests and conversations</p>
                    </div>

                    {/* INCOMING REQUESTS */}
                    <div style={{ marginBottom: '32px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                            <h3 style={{ fontSize: '12px', fontWeight: '700', color: '#666', letterSpacing: '1px' }}>INCOMING REQUESTS</h3>
                            <span style={{ background: '#333', color: 'white', fontSize: '10px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '10px' }}>2</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {incomingRequests.map(req => (
                                <div key={req.id} style={{ background: '#111', border: '1px solid #222', borderRadius: '16px', padding: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: req.avatarColor, display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '20px', color: 'white' }}>
                                        {req.name[0]}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>
                                            {req.name} <span style={{ fontWeight: '400', color: '#ccc' }}>wants to be your +1</span>
                                        </div>
                                        <div style={{ fontSize: '13px', color: '#666' }}>
                                            {req.event} · {req.date}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button style={{ background: '#10b981', color: 'black', fontWeight: '700', border: 'none', padding: '8px 20px', borderRadius: '20px', cursor: 'pointer', fontSize: '13px' }}>Accept</button>
                                        <button style={{ background: '#222', color: '#666', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>✕</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* SENT REQUESTS */}
                    <div style={{ marginBottom: '32px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                            <h3 style={{ fontSize: '12px', fontWeight: '700', color: '#666', letterSpacing: '1px' }}>SENT REQUESTS</h3>
                            <span style={{ background: '#333', color: 'white', fontSize: '10px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '10px' }}>1</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {sentRequests.map(req => (
                                <div key={req.id} style={{ background: '#111', border: '1px solid #222', borderRadius: '16px', padding: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: req.avatarColor, display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '20px', color: 'white' }}>
                                        {req.name[0]}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>
                                            {req.name}
                                        </div>
                                        <div style={{ fontSize: '13px', color: '#666' }}>
                                            {req.event} · {req.date}
                                        </div>
                                    </div>
                                    <div>
                                        <span style={{ fontSize: '10px', fontWeight: '700', color: '#666', letterSpacing: '0.5px' }}>PENDING</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* MESSAGES */}
                    <div style={{ marginBottom: '32px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                            <h3 style={{ fontSize: '12px', fontWeight: '700', color: '#666', letterSpacing: '1px' }}>MESSAGES</h3>
                            <span style={{ background: '#333', color: 'white', fontSize: '10px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '10px' }}>2</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {messages.map(msg => (
                                <div key={msg.id} onClick={() => setActiveChat(msg)} style={{ background: '#111', border: '1px solid #222', borderRadius: '16px', padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', transition: 'background 0.2s' }}>
                                    <div style={{ position: 'relative' }}>
                                        <div style={{ width: 48, height: 48, borderRadius: '50%', background: msg.avatarColor, display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '20px', color: 'white' }}>
                                            {msg.name[0]}
                                        </div>
                                        {msg.online && <div style={{ position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, background: '#10b981', borderRadius: '50%', border: '2px solid #111' }}></div>}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                            <div style={{ fontSize: '16px', fontWeight: '700' }}>{msg.name}</div>
                                            <div style={{ fontSize: '12px', color: '#666' }}>{msg.time}</div>
                                        </div>
                                        <div style={{ fontSize: '13px', color: '#888', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '300px' }}>
                                            {chats[msg.id] ? (chats[msg.id][chats[msg.id].length - 1].text) : msg.lastMsg}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            )}
        </div>
    )
}
