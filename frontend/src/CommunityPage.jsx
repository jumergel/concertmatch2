import React from 'react';
import './CommunityPage.css';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function CommunityPage() {
    const navigate = useNavigate();

    return (
        <div className="page-container">
            <div className="content-wrapper">
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
                    <Sidebar />
                    <div style={{ width: '24px' }}></div>
                    <div className="db-logo-container" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            background: '#22c55e',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'black'
                        }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"></path></svg>
                        </div>
                        <span style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '-1px', fontFamily: 'Inter, sans-serif' }}>PlusOne</span>
                    </div>
                </div>
                <h1 className="page-title">Community</h1>
                <p className="page-subtitle">Your +1 requests and conversations</p>

                {/* INCOMING REQUESTS */}
                <div className="section-group">
                    <div className="group-header">
                        <span className="group-title">INCOMING REQUESTS</span>
                        <span className="group-badge">2</span>
                    </div>

                    <div className="request-card">
                        <div className="req-avatar avatar-purple">A</div>
                        <div className="req-info">
                            <div className="req-main-text">
                                <span className="req-name">Alex M.</span> wants to be your +1
                            </div>
                            <div className="req-sub-text">Tame Impala · Mar 15 · Moody Center</div>
                        </div>
                        <div className="req-actions">
                            <button className="btn-accept">Accept</button>
                            <button className="btn-reject">✕</button>
                        </div>
                    </div>

                    <div className="request-card">
                        <div className="req-avatar avatar-blue">S</div>
                        <div className="req-info">
                            <div className="req-main-text">
                                <span className="req-name">Sam T.</span> wants to be your +1
                            </div>
                            <div className="req-sub-text">SZA · Mar 22 · ACL Live</div>
                        </div>
                        <div className="req-actions">
                            <button className="btn-accept">Accept</button>
                            <button className="btn-reject">✕</button>
                        </div>
                    </div>
                </div>

                {/* SENT REQUESTS */}
                <div className="section-group">
                    <div className="group-header">
                        <span className="group-title">SENT REQUESTS</span>
                        <span className="group-badge">1</span>
                    </div>

                    <div className="request-card">
                        <div className="req-avatar avatar-pink">J</div>
                        <div className="req-info">
                            <div className="req-main-text">
                                <span className="req-name">Jordan K.</span>
                            </div>
                            <div className="req-sub-text">Kendrick Lamar · Apr 20 · Circuit of the Americas</div>
                        </div>
                        <div className="req-status">PENDING</div>
                    </div>
                </div>

                {/* MESSAGES */}
                <div className="section-group">
                    <div className="group-header">
                        <span className="group-title">MESSAGES</span>
                        <span className="group-badge">2</span>
                    </div>

                    <div className="message-card">
                        <div className="msg-avatar-wrapper">
                            <div className="req-avatar avatar-green">R</div>
                            <div className="status-dot online"></div>
                        </div>
                        <div className="msg-info">
                            <div className="msg-name">Riley P.</div>
                            <div className="msg-preview">Hey! So excited for Billie Eilish, ...</div>
                        </div>
                        <div className="msg-time">2m</div>
                    </div>

                    <div className="message-card">
                        <div className="msg-avatar-wrapper">
                            <div className="req-avatar avatar-purple">M</div>
                        </div>
                        <div className="msg-info">
                            <div className="msg-name">Morgan D.</div>
                            <div className="msg-preview">That Radiohead setlist is goin...</div>
                        </div>
                        <div className="msg-time">1h</div>
                    </div>

                    <div className="message-card">
                        <div className="msg-avatar-wrapper">
                            <div className="req-avatar avatar-orange">C</div>
                        </div>
                        <div className="msg-info">
                            <div className="msg-name">Casey W.</div>
                            <div className="msg-preview">Local Natives was so good, we ...</div>
                        </div>
                        <div className="msg-time">3d</div>
                    </div>
                </div>

            </div>
        </div>
    );
}
