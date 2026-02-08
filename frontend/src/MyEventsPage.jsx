import React from 'react';
import Sidebar from './Sidebar';
import './MyEventsPage.css';

export default function MyEventsPage() {
    return (
        <div className="page-container">
            <div className="content-wrapper">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                    <Sidebar />
                    <h1 className="page-title" style={{ margin: 0 }}>My Events</h1>
                </div>
                <p className="page-subtitle">Your upcoming shows and concert history</p>

                {/* UPCOMING */}
                <div className="section-group">
                    <div className="group-header">
                        <span className="group-title">UPCOMING</span>
                        <span className="group-badge">3</span>
                    </div>

                    <div className="event-row">
                        <div className="er-thumb" style={{ backgroundImage: 'url(/pictures/tame.jpg)' }}></div>
                        <div className="er-info">
                            <div className="er-meta">Mar 15 · Psychedelic Rock</div>
                            <div className="er-artist">Tame Impala</div>
                            <div className="er-place">Moody Center · Austin, TX</div>
                            <div className="er-status going">Going with: Alex M.</div>
                        </div>
                        <div className="er-price">$45+</div>
                    </div>

                    <div className="event-row">
                        <div className="er-thumb" style={{ backgroundImage: 'url(/pictures/billie.jpg)' }}></div>
                        <div className="er-info">
                            <div className="er-meta">Apr 12 · Pop</div>
                            <div className="er-artist">Billie Eilish</div>
                            <div className="er-place">Moody Center · Austin, TX</div>
                            <div className="er-status going">Going with: Riley P.</div>
                        </div>
                        <div className="er-price">$70+</div>
                    </div>

                    <div className="event-row">
                        <div className="er-thumb" style={{ backgroundImage: 'url(https://i.scdn.co/image/ab6761610000e5eb437b9e2a82505b3d93ff1022)' }}></div>
                        <div className="er-info">
                            <div className="er-meta">Apr 20 · Hip Hop</div>
                            <div className="er-artist">Kendrick Lamar</div>
                            <div className="er-place">Circuit of the Americas · Austin, TX</div>
                            <div className="er-status looking">Still looking for a +1 · 89 others looking</div>
                        </div>
                        <div className="er-price">$85+</div>
                    </div>
                </div>

                {/* PAST SHOWS */}
                <div className="section-group">
                    <div className="group-header">
                        <span className="group-title">PAST SHOWS</span>
                        <span className="group-badge">1</span>
                    </div>

                    <div className="event-row dimmed">
                        <div className="er-thumb" style={{ backgroundImage: 'url(/pictures/natives.jpg)' }}></div>
                        <div className="er-info">
                            <div className="er-meta">Feb 14 · Indie</div>
                            <div className="er-artist">Local Natives</div>
                            <div className="er-place">Emo's · Austin, TX</div>
                            <div className="er-status went">Went with: Casey W.</div>
                        </div>
                        <div className="er-price">$25+</div>
                    </div>
                </div>

                {/* STATS */}
                <div className="section-group">
                    <div className="group-header">
                        <span className="group-title">STATS</span>
                    </div>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-value">4</div>
                            <div className="stat-label">SHOWS</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value">3</div>
                            <div className="stat-label">BUDDIES</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value">$225</div>
                            <div className="stat-label">SPENT</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value">5</div>
                            <div className="stat-label">GENRES</div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
