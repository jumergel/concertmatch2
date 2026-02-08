import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleNav = (path) => {
        navigate(path);
        setIsOpen(false);
    };

    return (
        <>
            {/* Hamburger Button */}
            <button className="hamburger-btn" onClick={() => setIsOpen(true)}>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
            </button>

            {/* Sidebar Overlay */}
            <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(false)}>
                {/* Sidebar Menu */}
                <div className={`sidebar-menu ${isOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>

                    {/* User Profile Header */}
                    <div className="sidebar-header">
                        <div className="sh-avatar">D</div>
                        <div className="sh-info">
                            <h4>Dedeepya</h4>
                            <span>UT Austin</span>
                        </div>
                    </div>

                    <div className="sidebar-divider"></div>

                    {/* Navigation Items */}
                    <div
                        className={`sidebar-item ${location.pathname === '/dashboard' ? 'active' : ''}`}
                        onClick={() => handleNav('/dashboard')}
                    >
                        <span className="sidebar-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                        </span>
                        <span className="sidebar-label">Home</span>
                    </div>

                    <div
                        className={`sidebar-item ${location.pathname === '/community' ? 'active' : ''}`}
                        onClick={() => handleNav('/community')}
                    >
                        <span className="sidebar-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                        </span>
                        <span className="sidebar-label">Community</span>
                        <span className="sidebar-badge">3</span>
                    </div>

                    <div
                        className={`sidebar-item ${location.pathname === '/events' ? 'active' : ''}`}
                        onClick={() => handleNav('/events')}
                    >
                        <span className="sidebar-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        </span>
                        <span className="sidebar-label">My Events</span>
                    </div>



                    <div
                        className={`sidebar-item ${location.pathname === '/profile' ? 'active' : ''}`}
                        onClick={() => handleNav('/profile')}
                    >
                        <span className="sidebar-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        </span>
                        <span className="sidebar-label">Profile</span>
                    </div>

                </div>
            </div>
        </>
    );
}