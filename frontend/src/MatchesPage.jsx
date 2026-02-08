import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './MatchesPage.css';

export default function MatchesPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const resultData = location.state?.resultData;

    // Fallback if accessed directly without quiz
    useEffect(() => {
        if (!resultData) {
            // navigate('/dashboard'); 
            // Commented out for dev/testing so we can see the page even if state is lost
        }
    }, [resultData, navigate]);

    // Mock "Matches" data - filtered to look like good matches
    const matches = [
        {
            name: "Alex H.",
            major: "Film Studies",
            uni: "UT Austin",
            matchScore: 96,
            color: "purple",
            bio: "Junior studying Film. I go to way too many shows at Mohawk and Emo's. Looking for a concert buddy who appreciates the cinematography of live performances.",
            tags: ["Indie Rock", "Vinyl Collector", "A24 Fan"],
            sharedConcerts: [
                { artist: "Tame Impala", place: "Moody Center", img: "/pictures/tame.jpg" }
            ]
        },
        {
            name: "Jordan K.",
            major: "Computer Science",
            uni: "UT Austin",
            matchScore: 92,
            color: "pink",
            bio: "Always in the pit. If you're not sweating, you're doing it wrong. Let's rage at the next Tyler show.",
            tags: ["Hip Hop", "High Energy", "Mosh Pit"],
            sharedConcerts: [
                { artist: "Tyler, the Creator", place: "Germania Amphitheater", img: "/pictures/tyler.jpg" }
            ]
        },
        {
            name: "Sam T.",
            major: "Psychology",
            uni: "UT Austin",
            matchScore: 88,
            color: "blue",
            bio: "Just looking for good vibes and good music. Not into the mosh pit life, prefer to chill and appreciate the vocals.",
            tags: ["R&B", "Chill Vibes", "Foodie"],
            sharedConcerts: [
                { artist: "SZA", place: "ACL Live", img: "/pictures/sza.jpg" }
            ]
        },
        {
            name: "Riley P.",
            major: "Communications",
            uni: "UT Austin",
            matchScore: 85,
            color: "green",
            bio: "I love everything from top 40s to obscure indie pop. Festivals are my happy place. Let's go!",
            tags: ["Pop", "Festival", "Photography"],
            sharedConcerts: [
                { artist: "Billie Eilish", place: "Moody Center", img: "/pictures/billie.jpg" }
            ]
        }
    ];

    return (
        <div className="matches-container">
            <div className="matches-header">
                <button className="matches-back-btn" onClick={() => navigate('/dashboard')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                    Back to Dashboard
                </button>

                <h1 className="matches-title">Your Top Matches</h1>

                {resultData && (
                    <div className="match-reason-badge">
                        ✨ Based on your "{resultData.title}" Vibe
                    </div>
                )}

                <p className="matches-subtitle">
                    We found these people who share your music taste and energy level.
                    They're also looking for a +1 to upcoming concerts in Austin!
                </p>
            </div>

            <div className="matches-grid">
                {matches.map((match, i) => (
                    <div key={i} className="match-card">
                        <div className="match-header">
                            <div className={`match-avatar-lg avatar-${match.color}`}>
                                {match.name[0]}
                            </div>
                            <div className="match-info">
                                <h3>{match.name}</h3>
                                <div className="match-uni">{match.major} • {match.uni}</div>
                            </div>

                            <div className="match-similarity-badge" style={{ color: resultData?.color || '#10b981' }}>
                                <div className="ms-score">{match.matchScore}%</div>
                                <div className="ms-label">Match</div>
                            </div>
                        </div>

                        <div className="match-body">
                            <div className="match-bio">"{match.bio}"</div>
                            <div className="match-tags">
                                {match.tags.map(t => (
                                    <span key={t} className="match-tag">{t}</span>
                                ))}
                            </div>

                            {match.sharedConcerts.length > 0 && (
                                <div className="shared-interests-section">
                                    <div className="shared-label">Going to</div>
                                    {match.sharedConcerts.map((c, idx) => (
                                        <div key={idx} className="shared-concert">
                                            <div className="sc-thumb-lg" style={{ backgroundImage: `url(${c.img})` }}></div>
                                            <div className="sc-info">
                                                <div className="sc-artist">{c.artist}</div>
                                                <div className="sc-place">{c.place}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="match-actions">
                            <button className="btn-connect">Connect +</button>
                            <button className="btn-ignore">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}