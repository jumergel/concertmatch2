
import { useState } from 'react'
import { supabase } from './supabase'

export default function AuthPage() {
    const [step, setStep] = useState(1)
    const [college, setCollege] = useState('')
    const [collegeName, setCollegeName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    const [isSignUpSuccess, setIsSignUpSuccess] = useState(false)

    const handleCollegeChange = (e) => {
        const option = e.target.selectedOptions[0]
        setCollege(e.target.value)
        setCollegeName(option.dataset.name)
    }

    const handleLogin = async () => {
        setLoading(true)
        setMessage('')

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })

        if (error) {
            setMessage(`Error: ${error.message}`)
            setLoading(false)
        } else {
            // App.jsx will handle redirect based on session change
        }
    }

    const handleSignUp = async () => {
        setLoading(true)
        setMessage('')

        // Use current window location (port 3000, 3001, etc) for redirect
        // This solves the issue of port mismatches
        const redirectUrl = window.location.origin

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: redirectUrl,
                data: {
                    college: collegeName,
                    college_id: college
                }
            }
        })

        if (error) {
            if (error.message.includes('rate limit')) {
                setMessage("Too many attempts! Please wait a minute before trying again.")
            } else {
                setMessage(`Error: ${error.message}`)
            }
        } else {
            setMessage('Success! Check your email for verification.')
            setIsSignUpSuccess(true)
        }
        setLoading(false)
    }

    return (
        <div className="auth-wrapper">
            <div className="left">
                <div className="left-content">
                    <div className="logo-big">
                        <svg viewBox="0 0 24 24"><path d="M9 18V5l12-2v13M9 18c0 1.66-1.34 3-3 3S3 19.66 3 18s1.34-3 3-3 3 1.34 3 3zm12-2c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3z" /></svg>
                    </div>
                    <div className="brand-name">PlusOne</div>
                    <div className="brand-tagline">Never go to a concert alone again.</div>
                </div>
            </div>

            <div className="right">
                <div className="card">
                    <div className="photo-grid">
                        <div className="circle-photo cp1"><span className="emoji">A</span></div>
                        <div className="circle-photo cp2"><span className="emoji">B</span></div>
                        <div className="circle-photo cp3"><span className="emoji">C</span></div>
                        <div className="circle-photo cp4"><span className="emoji">D</span></div>
                        <div className="circle-photo cp5"><span className="emoji">E</span></div>
                        <div className="circle-photo cp6"><span className="emoji">F</span></div>
                        <div className="circle-photo cp7"><span className="emoji">G</span></div>
                        <div className="circle-photo cp8"><span className="emoji">H</span></div>
                        <div className="circle-photo cp11"><span className="emoji">L</span></div>
                        <div className="circle-photo cp12"><span className="emoji">M</span></div>
                        <div className="circle-photo cp15"><span className="emoji">R</span></div>
                    </div>

                    <div className="card-body">
                        <div className="card-logo">
                            <div className="card-logo-icon">
                                <svg viewBox="0 0 24 24"><path d="M9 18V5l12-2v13M9 18c0 1.66-1.34 3-3 3S3 19.66 3 18s1.34-3 3-3 3 1.34 3 3zm12-2c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3z" /></svg>
                            </div>
                            <div className="card-headline">
                                {step === 1 ? <>Find your +1.<br />Never miss a show.</> : <>Join {collegeName}'s<br />music scene.</>}
                            </div>
                            <div className="card-sub">
                                Get matched with concert buddies at your campus based on your vibe.
                            </div>
                        </div>

                        <div className="progress">
                            <div className={`pip ${step >= 1 ? 'active' : ''} ${step > 1 ? 'done' : ''}`}></div>
                            <div className={`pip ${step >= 2 ? 'active' : ''}`}></div>
                        </div>

                        {/* STEP 1: University */}
                        <div className={`step ${step === 1 ? 'active' : ''}`}>
                            <div className="step-label">University</div>
                            <div className="select-wrap">
                                <select onChange={handleCollegeChange} value={college}>
                                    <option value="" disabled>Choose your university...</option>
                                    <option value="ut" data-name="UT Austin">University of Texas at Austin</option>
                                    <option value="stanford" data-name="Stanford">Stanford University</option>
                                    <option value="mit" data-name="MIT">Massachusetts Institute of Technology</option>
                                    <option value="cmu" data-name="Carnegie Mellon">Carnegie Mellon University</option>
                                    <option value="berkeley" data-name="UC Berkeley">UC Berkeley</option>
                                    <option value="gatech" data-name="Georgia Tech">Georgia Institute of Technology</option>
                                    <option value="umich" data-name="UMich">University of Michigan</option>
                                    <option value="columbia" data-name="Columbia">Columbia University</option>
                                    <option value="ucla" data-name="UCLA">UCLA</option>
                                    <option value="nyu" data-name="NYU">New York University</option>
                                </select>
                            </div>
                            <button
                                className="btn-green"
                                disabled={!college}
                                onClick={() => setStep(2)}
                            >
                                Continue
                            </button>
                        </div>

                        {/* STEP 2: Sign Up */}
                        <div className={`step ${step === 2 ? 'active' : ''}`}>
                            <div className="college-chip">
                                <div className="chip-dot"></div>
                                <span>{collegeName}</span>
                            </div>

                            <div className="input-group">
                                <div className="step-label">Email</div>
                                <input
                                    type="email"
                                    placeholder="you@university.edu"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="input-group">
                                <div className="step-label">Password</div>
                                <input
                                    type="password"
                                    placeholder="Create a password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            {message && (
                                <div style={{
                                    marginBottom: '16px',
                                    fontSize: '13px',
                                    color: message.startsWith('Success') ? '#1ed760' : '#f43f5e',
                                    textAlign: 'center'
                                }}>
                                    {message}
                                </div>
                            )}

                            <button
                                className="btn-green"
                                onClick={isSignUpSuccess ? handleLogin : handleSignUp}
                                disabled={loading || !email || !password}
                            >
                                {loading ? (isSignUpSuccess ? 'Logging In...' : 'Creating Account...') : 'Continue'}
                            </button>

                            <button className="btn-text" onClick={() => setStep(1)}>
                                ← Change university
                            </button>
                        </div>

                        <div className="card-footer">
                            <p>PlusOne &copy; 2026 &middot; <a href="#">Privacy</a> &middot; <a href="#">Terms</a></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
