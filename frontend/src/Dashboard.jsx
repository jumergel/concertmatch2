// Dashboard.jsx
import { useEffect, useMemo, useState } from "react";
import { supabase } from "./supabase";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [concerts, setConcerts] = useState([]);
  const [concertsLoading, setConcertsLoading] = useState(true);
  const [concertsError, setConcertsError] = useState("");

  // ===== Carousel pagination (✅ 5 visible at a time) =====
  const VISIBLE_COUNT = 5;
  const [concertIndex, setConcertIndex] = useState(0);

  const [selectedPerson, setSelectedPerson] = useState(null);

  const [showSurvey, setShowSurvey] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState(() => {
    const saved = localStorage.getItem("vibe_data");
    return saved ? JSON.parse(saved) : null;
  });

  const [surveySearchQuery, setSurveySearchQuery] = useState("");
  const [surveySearchResults, setSurveySearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // ===========================
  // API config
  // ===========================
  // If your frontend uses Vite proxy, prefer RELATIVE fetches: "/api/..."
  // If you *must* hit a separate server port, set USE_API_BASE = true.
  const API_BASE = useMemo(() => "http://localhost:5001", []);
  const USE_API_BASE = false; // ✅ set true only if you are NOT using a proxy

  const apiUrl = (path) => (USE_API_BASE ? `${API_BASE}${path}` : path);

  // ✅ Fixed load size:
  // Example: 10 pages * ~10 events/page ≈ 100 max, but we will slice to TOTAL_TO_KEEP.
  const PAGES_TO_FETCH = 6;     // <— set number of pages to fetch
  const TOTAL_TO_KEEP = 50;     // <— set max total events stored/displayed

  const surveyQuestions = [
    {
      id: 1,
      question: "It's Friday night. What's your move?",
      options: [
        { label: "A", text: "Cozy night in with headphones" },
        { label: "B", text: "Wherever the crowd is going" },
        { label: "C", text: "Small get-together with close friends" },
        { label: "D", text: "Something spontaneous — surprise me" },
      ],
    },
    {
      id: 2,
      question: "Pick a concert setting:",
      options: [
        { label: "A", text: "Stadium tour — go big or go home" },
        { label: "B", text: "Music festival — all weekend long" },
        { label: "C", text: "Intimate venue — feel every note" },
        { label: "D", text: "House show — underground vibes" },
      ],
    },
    {
      id: 3,
      question: "Your go-to genre when nobody's judging?",
      options: [
        { label: "A", text: "Rock / Indie / Alternative" },
        { label: "B", text: "Hip-Hop / R&B" },
        { label: "C", text: "Pop / Electronic / Dance" },
        { label: "D", text: "Jazz / Soul / Classical" },
      ],
    },
    {
      id: 4,
      question: "At a concert, you're the person who…",
      options: [
        { label: "A", text: "Records everything for the gram" },
        { label: "B", text: "Dances like nobody's watching" },
        { label: "C", text: "Closes eyes and absorbs the music" },
        { label: "D", text: "Sings every word at full volume" },
      ],
    },
    {
      id: 5,
      question: "How do you discover new music?",
      options: [
        { label: "A", text: "Algorithm playlists — Spotify knows me" },
        { label: "B", text: "Friends always put me on" },
        { label: "C", text: "Deep dives on my own — rabbit holes" },
        { label: "D", text: "Radio, blogs, music publications" },
      ],
    },
    {
      id: 6,
      question: "What matters most in a concert buddy?",
      options: [
        { label: "A", text: "Same energy level — match my vibe" },
        { label: "B", text: "Similar music taste — no skips" },
        { label: "C", text: "Good convo — the hangout matters too" },
        { label: "D", text: "Down for anything — flexible and chill" },
      ],
    },
    {
      id: 7,
      question: "Your Spotify Wrapped top genre would be:",
      options: [
        { label: "A", text: "Chill / Lo-fi / Acoustic" },
        { label: "B", text: "Hype / Trap / EDM" },
        { label: "C", text: "Emo / Sad songs / Ballads" },
        { label: "D", text: "World / Latin / Afrobeats" },
      ],
    },
    {
      id: 8,
      question: "How early do you show up to a concert?",
      options: [
        { label: "A", text: "Gates open — I want the rail" },
        { label: "B", text: "Opening act — full experience" },
        { label: "C", text: "Headliner only — efficient" },
        { label: "D", text: "Whenever I get there tbh" },
      ],
    },
    {
      id: 9,
      question: "Post-concert ritual?",
      options: [
        { label: "A", text: "Late-night food run with the squad" },
        { label: "B", text: "Rate the setlist and post a review" },
        { label: "C", text: "Straight home — social battery drained" },
        { label: "D", text: "Replay the songs on the drive home" },
      ],
    },
    {
      id: 10,
      question: "Which concerts are you planning to attend? (Search and select)",
      type: "concert-search",
      placeholder: "Search for artists, venues, or genres...",
    },
    {
      id: 11,
      question: "Tell us about yourself",
      type: "text",
      placeholder:
        "Junior studying Film. I go to way too many shows at Mohawk and Emo's...",
    },
  ];

  const handleAnswer = (answer, label) => {
    if (label) {
      setAnswers((prev) => ({ ...prev, [currentQuestion]: { answer, label } }));

      setTimeout(() => {
        if (currentQuestion < surveyQuestions.length - 1) {
          setCurrentQuestion((prev) => prev + 1);
        } else {
          handleSurveySubmit();
        }
      }, 200);
    } else {
      setAnswers((prev) => ({ ...prev, [currentQuestion]: { answer } }));
    }
  };

  // Effect for survey concert search
  useEffect(() => {
    const isConcertSearch =
      showSurvey && surveyQuestions[currentQuestion]?.type === "concert-search";

    if (isConcertSearch && surveySearchQuery.length > 2) {
      const delayDebounceFn = setTimeout(() => {
        const fetchConcertSearch = async () => {
          setIsSearching(true);
          try {
            const res = await fetch(
              apiUrl(`/api/concerts?q=${encodeURIComponent(surveySearchQuery)}`),
              { headers: { Accept: "application/json" } }
            );
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();

            // Support either shape: { events: [...] } or { concerts: [...] }
            const raw = Array.isArray(data?.events)
              ? data.events
              : Array.isArray(data?.concerts)
              ? data.concerts
              : [];

            const results = raw.map((c) => ({
              name: c.title || c.name || "Untitled",
              artist: c.artist || c.title || c.name || "Unknown",
              place: c?.venue?.name || c.place || "Austin, TX",
              image: c.image || c.thumbnail || "",
              date: c?.date?.start_date || c.dateFull || c?.date?.when || "TBD",
            }));

            setSurveySearchResults(results);
          } catch (err) {
            console.error("Search error:", err);
            setSurveySearchResults([]);
          } finally {
            setIsSearching(false);
          }
        };

        fetchConcertSearch();
      }, 300);

      return () => clearTimeout(delayDebounceFn);
    } else {
      setSurveySearchResults([]);
    }
  }, [surveySearchQuery, currentQuestion, showSurvey]);

  const handleSurveySubmit = async () => {
    const counts = { A: 0, B: 0, C: 0, D: 0 };

    Object.values(answers).forEach((ans) => {
      if (ans?.label && counts[ans.label] !== undefined) counts[ans.label]++;
    });

    let maxLabel = "A";
    let maxCount = -1;
    Object.entries(counts).forEach(([label, count]) => {
      if (count > maxCount) {
        maxLabel = label;
        maxCount = count;
      }
    });

    // Collect selected concerts
    const selectedConcerts = [];
    surveyQuestions.forEach((q, idx) => {
      if (q.type === "concert-search" && answers[idx]?.selected) {
        selectedConcerts.push(...answers[idx].selected);
      }
    });

    let result = {};
    if (maxLabel === "A") {
      result = {
        title: "The Indie Explorer",
        desc: "You thrive on discovering new sounds and love intimate venues. You're there for the music, not just the scene.",
        tags: ["Indie Rock", "Intimate Venues", "Vinyl Collector"],
        icon: "IE",
        color: "#e91e63",
      };
    } else if (maxLabel === "B") {
      result = {
        title: "The Hype Beast",
        desc: "You bring the energy. Front row, mosh pit, or shouting every lyric — you live for the moment.",
        tags: ["Hip Hop", "Front Row", "High Energy"],
        icon: "HB",
        color: "#f43f5e",
      };
    } else if (maxLabel === "C") {
      result = {
        title: "The Soul Searcher",
        desc: "You feel the music deeply. Whether it's a ballad or a beat drop, you're emotionally connected.",
        tags: ["R&B", "Deep Cuts", "Chill Vibes"],
        icon: "SS",
        color: "#3b82f6",
      };
    } else {
      result = {
        title: "The Groove Master",
        desc: "You feel music in your body first. If there's a beat, you're moving. You go where the rhythm takes you.",
        tags: ["Dancer", "Feel-Good", "Spontaneous"],
        icon: "GM",
        color: "#10b981",
      };
    }

    result.interestedConcerts = selectedConcerts;

    setResultData(result);
    localStorage.setItem("vibe_data", JSON.stringify(result));
    setShowSurvey(false);
    setShowResult(true);
  };

  // ✅ parse month/day robustly
  const parseMonthDay = (startStr) => {
    if (!startStr) return { month: "TBD", day: "" };

    const dateObj = new Date(startStr);
    if (!isNaN(dateObj.getTime())) {
      return {
        month: dateObj
          .toLocaleString("default", { month: "short" })
          .toUpperCase(),
        day: dateObj.getDate(),
      };
    }

    if (typeof startStr === "string") {
      const parts = startStr.trim().split(/\s+/);
      if (parts.length >= 2) {
        return {
          month: (parts[0] || "TBD").toUpperCase(),
          day: parts[1] || "",
        };
      }
    }

    return { month: "TBD", day: "" };
  };

  // ===========================
  // ✅ FETCH EVENTS (morning behavior)
  // - fixed number of pages
  // - keeps only TOTAL_TO_KEEP
  // - expects { events: [...] }
  // ===========================
  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) return;
      setUser(session?.user ?? null);
    });

    const fetchConcerts = async () => {
      try {
        if (!isMounted) return;

        setConcertsLoading(true);
        setConcertsError("");

        const allEvents = [];

        for (let page = 1; page <= PAGES_TO_FETCH; page++) {
          const url = apiUrl(`/api/concerts?city=Austin,TX&page=${page}`);

          const res = await fetch(url, {
            method: "GET",
            headers: { Accept: "application/json" },
          });

          if (!res.ok) {
            const text = await res.text();
            throw new Error(`Concert API failed (${res.status}): ${text}`);
          }

          const data = await res.json();

          const events = Array.isArray(data?.events)
            ? data.events
            : Array.isArray(data?.concerts)
            ? data.concerts
            : [];

          // stop early if the backend returns nothing
          if (events.length === 0) break;

          allEvents.push(...events);

          if (allEvents.length >= TOTAL_TO_KEEP) break;
        }

        const formattedEvents = allEvents.slice(0, TOTAL_TO_KEEP).map((event) => {
          const startStr = event?.date?.start_date || "";
          const whenStr = event?.date?.when || startStr || "TBD";
          const { month, day } = parseMonthDay(startStr);

          const venueName = event?.venue?.name;
          const addr0 = Array.isArray(event?.address) ? event.address[0] : "";
          const place = venueName || addr0 || "Austin, TX";

          const link =
            event?.link ||
            (Array.isArray(event?.ticket_info) ? event.ticket_info?.[0]?.link : "") ||
            "";

          return {
            name: event?.title || "Untitled",
            place,
            dateFull: whenStr,
            month,
            day,
            price: event?.ticket_info?.[0]?.price || "Tickets",
            looking: Math.floor(Math.random() * 50) + 12,
            image: event?.image || event?.thumbnail || "",
            link,
          };
        });

        if (!isMounted) return;
        setConcerts(formattedEvents);
        setConcertIndex(0);
      } catch (err) {
        console.error("Failed to fetch concerts:", err);
        if (!isMounted) return;
        setConcerts([]);
        setConcertsError(err?.message || "Failed to load concerts");
      } finally {
        if (!isMounted) return;
        setConcertsLoading(false);
      }
    };

    fetchConcerts();

    return () => {
      isMounted = false;
    };
  }, [API_BASE]); // ok to keep; apiUrl uses it only if USE_API_BASE=true

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  // Enhanced mock data for people
  const people = [
    {
      name: "Alex H.",
      vibe: 94,
      tags: ["Indie Rock", "Night Owl", "Vinyl Collector", "Intimate Venues"],
      color: "purple",
      about:
        "Junior studying Film. I go to way too many shows at Mohawk and Emo's. Always looking for someone to split an Uber to the venue with.",
      vibeType: {
        title: "The Indie Explorer",
        desc: "Thrives on discovering new sounds and loves intimate venues where you can feel the music.",
        icon: "IE",
        color: "#e91e63",
      },
      interested: [
        { artist: "Tame Impala", place: "Moody Center", date: "2026-03-15", img: "/pictures/tame.jpg" },
        { artist: "Tyler, the Creator", place: "Germania Amphitheater", date: "2026-04-05", img: "/pictures/tyler.jpg" },
      ],
    },
    {
      name: "Jordan K.",
      vibe: 89,
      tags: ["Hip Hop", "Extrovert", "front-row energy", "Afterparty"],
      color: "pink",
      about: "Always in the pit. If you're not sweating, you're doing it wrong. Let's rage.",
      vibeType: {
        title: "The Hype Beast",
        desc: "Brings maximum energy to every show. Knows every lyric and is always ready to jump.",
        icon: "HB",
        color: "#f43f5e",
      },
      interested: [
        { artist: "Kendrick Lamar", place: "COTA", date: "2026-04-20", img: "https://i.scdn.co/image/ab6761610000e5eb437b9e2a82505b3d93ff1022" },
        { artist: "Tyler, the Creator", place: "Germania Amphitheater", date: "2026-04-05", img: "/pictures/tyler.jpg" },
      ],
    },
    {
      name: "Sam T.",
      vibe: 86,
      tags: ["R&B", "Chill Vibes", "Soul", "Slow Jams"],
      color: "blue",
      about:
        "Just looking for good vibes and good music. Not into the mosh pit life, prefer to chill and appreciate the vocals.",
      vibeType: {
        title: "The Soul Searcher",
        desc: "Connects deeply with lyrics and melodies. Prefers a relaxed atmosphere to soak it all in.",
        icon: "SS",
        color: "#3b82f6",
      },
      interested: [
        { artist: "SZA", place: "ACL Live", date: "2026-03-22", img: "/pictures/sza.jpg" },
        { artist: "Doja Cat", place: "ACL Live", date: "2026-05-03", img: "/pictures/doja.jpg" },
      ],
    },
    {
      name: "Riley P.",
      vibe: 82,
      tags: ["Pop", "Adventurous", "Sing-along", "Festival"],
      color: "green",
      about: "I love everything from top 40s to obscure indie pop. Festivals are my happy place.",
      vibeType: {
        title: "The Festival Goer",
        desc: "Thrives in crowds and open-air venues. Lives for the collective experience of live music.",
        icon: "FG",
        color: "#10b981",
      },
      interested: [
        { artist: "Billie Eilish", place: "Moody Center", date: "2026-04-12", img: "/pictures/billie.jpg" },
      ],
    },
    {
      name: "Casey M.",
      vibe: 79,
      tags: ["Electronic", "Introvert", "Bass", "Visuals"],
      color: "orange",
      about: "Here for the lasers and the bass drops. I usually hang back and enjoy the light show.",
      vibeType: {
        title: "The Bass Head",
        desc: "Feels the music physically. specific about sound quality and visual production.",
        icon: "BH",
        color: "#f97316",
      },
      interested: [{ artist: "Tame Impala", place: "Moody Center", date: "2026-03-15", img: "/pictures/tame.jpg" }],
    },
  ];

  // ===== Carousel computed values =====
  const canGoLeft = concertIndex > 0;
  const canGoRight = concertIndex + VISIBLE_COUNT < concerts.length;

  const handleLeft = () => {
    if (!canGoLeft) return;
    setConcertIndex((prev) => Math.max(0, prev - VISIBLE_COUNT));
  };

  const handleRight = () => {
    if (!canGoRight) return;
    setConcertIndex((prev) =>
      Math.min(Math.max(0, concerts.length - VISIBLE_COUNT), prev + VISIBLE_COUNT)
    );
  };

  const visibleConcerts = concerts.slice(concertIndex, concertIndex + VISIBLE_COUNT);

  return (
    <div className="dashboard-container">
      {/* NAV HEADER */}
      <div className="db-nav">
        <div style={{ display: "flex", alignItems: "center" }}>
          <Sidebar />
          <div style={{ width: "24px" }}></div>
          <div className="db-logo-container" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                background: "#22c55e",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "black",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 18V5l12-2v13"></path>
                <circle cx="6" cy="18" r="3"></circle>
                <circle cx="18" cy="16" r="3"></circle>
              </svg>
            </div>
            <span style={{ fontSize: "24px", fontWeight: "900", letterSpacing: "-1px", fontFamily: "Inter, sans-serif" }}>
              PlusOne
            </span>
          </div>
        </div>

        <div className="db-user-info">
          <div
            className="avatar-sm clickable"
            onClick={() => navigate("/profile")}
            style={{
              cursor: "pointer",
              background: "var(--green)",
              color: "black",
              fontWeight: "bold",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {user?.email ? user.email[0].toUpperCase() : "D"}
          </div>
        </div>
      </div>

      {/* HERO SECTION */}
      <div className="db-hero-section">
        <div className="hero-badge">● LIVE MATCHING</div>
        <h1>
          Don't have a +1?
          <br />
          We'll find you one.
        </h1>
        <p>
          Take a quick personality quiz and get matched with people at your campus who vibe the same way. Because music's better together.
        </p>
        <button className="btn-hero" onClick={() => setShowSurvey(true)}>
          Take the Vibe Check
        </button>
      </div>

      {/* PEOPLE SECTION */}
      <div className="section-header">
        <h2>People looking for a +1</h2>
        <a href="#">See all →</a>
      </div>
      <div className="people-grid">
        {people.map((p, i) => (
          <div key={i} className="per-card" onClick={() => setSelectedPerson(p)} style={{ cursor: "pointer" }}>
            <div className={`avatar avatar-${p.color}`}>{p.name[0]}</div>
            <div className="pc-name">{p.name}</div>
            <div className="pc-sub">UT Austin</div>
            <div className="pc-tags">
              {p.tags.slice(0, 2).map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
            <div className="vibe-match">
              <span className="vm-score">{resultData ? `${p.vibe}%` : "??%"}</span>
              <span className="vm-label">VIBE MATCH</span>
            </div>
          </div>
        ))}
      </div>

      {/* CONCERTS SECTION */}
      <div className="section-header margin-top">
        <h2>Upcoming concerts</h2>

        <div className="concerts-actions">
          <button className={`arrow-btn ${!canGoLeft ? "disabled" : ""}`} onClick={handleLeft} disabled={!canGoLeft} aria-label="Previous concerts" type="button">
            ‹
          </button>

          <button className={`arrow-btn ${!canGoRight ? "disabled" : ""}`} onClick={handleRight} disabled={!canGoRight} aria-label="Next concerts" type="button">
            ›
          </button>

          <a href="#" className="browse-all-link">
            Browse all →
          </a>
        </div>
      </div>

      {concertsLoading ? (
        <div style={{ color: "var(--muted)", textAlign: "center", padding: "40px" }}>Loading concerts...</div>
      ) : concertsError ? (
        <div style={{ color: "var(--muted)", textAlign: "center", padding: "20px" }}>
          <div style={{ marginBottom: 8 }}>Couldn’t load concerts.</div>
          <div style={{ fontSize: 12, opacity: 0.85 }}>{concertsError}</div>
        </div>
      ) : concerts.length === 0 ? (
        <div style={{ color: "var(--muted)", textAlign: "center", padding: "20px" }}>No concerts found.</div>
      ) : (
        <div className="concerts-grid">
          {visibleConcerts.map((c, i) => (
            <div
              key={i}
              className="concert-card"
              onClick={() => c.link && window.open(c.link, "_blank")}
              style={{ cursor: c.link ? "pointer" : "default" }}
            >
              <div className="cc-header">
                <div className="cc-date-badge">
                  <span className="cc-month">{c.month}</span>
                  <span className="cc-day">{c.day}</span>
                </div>
                <div className="cc-looking-badge">{c.looking} LOOKING</div>
              </div>

              <div className="cc-ph-image">
                {c.image ? (
                  <img src={c.image} alt={c.name} loading="lazy" referrerPolicy="no-referrer" />
                ) : null}
              </div>

              <div className="cc-body">
                <div className="cc-artist">{c.name}</div>
                <div className="cc-venue">📍 {c.place}</div>

                <div className="cc-meta">
                  <div className="cc-date-line">📅 {String(c.dateFull).split(",")[0]}</div>
                  <div className="cc-time-line">
                    {String(c.dateFull).includes(",") ? String(c.dateFull).split(",").slice(1).join(",").trim() : ""}
                  </div>
                </div>

                <div className="cc-footer">
                  <div className="cc-price">{c.price}</div>
                  <button
                    className="btn-outline-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    Find a +1
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {selectedPerson && (
        <div className="modal-overlay" onClick={() => setSelectedPerson(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedPerson(null)}>
              ×
            </button>

            <div className="modal-header">
              <div className={`avatar-lg avatar-${selectedPerson.color}`}>{selectedPerson.name[0]}</div>
              <h2 className="mh-name">{selectedPerson.name}</h2>
              <div className="mh-uni">UT Austin</div>
              <div className="mh-vibe-badge">{resultData ? `${selectedPerson.vibe}%` : "??%"} VIBE MATCH</div>
            </div>

            <div className="modal-section">
              <h4 className="ms-title">MUSIC TASTE</h4>
              <div className="ms-tags">
                {selectedPerson.tags.map((t) => (
                  <span key={t} className="ms-tag">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="modal-section">
              <h4 className="ms-title">VIBE TYPE</h4>
              <div className="vibe-card">
                <div className="vc-icon" style={{ backgroundColor: selectedPerson.vibeType.color }}>
                  {selectedPerson.vibeType.icon}
                </div>
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
                      <div className="li-place">
                        {evt.place} &middot; {evt.date}
                      </div>
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
            <button className="modal-close" onClick={() => setShowSurvey(false)}>
              ×
            </button>

            <div className="survey-progress-container">
              <div
                className="survey-progress-bar"
                style={{ width: `${((currentQuestion + 1) / surveyQuestions.length) * 100}%` }}
              ></div>
            </div>

            <div className="survey-step-indicator">
              {currentQuestion + 1} / {surveyQuestions.length}
            </div>

            <div className="survey-body">
              <h2 className="survey-question">{surveyQuestions[currentQuestion].question}</h2>

              {surveyQuestions[currentQuestion].type === "text" ? (
                <div className="survey-text-input-container">
                  <textarea
                    className="survey-textarea"
                    placeholder={surveyQuestions[currentQuestion].placeholder}
                    value={answers[currentQuestion]?.answer || ""}
                    onChange={(e) =>
                      setAnswers((prev) => ({
                        ...prev,
                        [currentQuestion]: { answer: e.target.value },
                      }))
                    }
                  ></textarea>
                  <button
                    className="btn-primary-lg"
                    onClick={() => {
                      if (currentQuestion < surveyQuestions.length - 1) {
                        setCurrentQuestion((prev) => prev + 1);
                      } else {
                        handleSurveySubmit();
                      }
                    }}
                  >
                    Next
                  </button>
                </div>
              ) : surveyQuestions[currentQuestion].type === "concert-search" ? (
                <div className="survey-search-container">
                  <div className="search-input-wrapper">
                    <input
                      type="text"
                      className="survey-search-input"
                      placeholder={surveyQuestions[currentQuestion].placeholder}
                      value={surveySearchQuery}
                      onChange={(e) => setSurveySearchQuery(e.target.value)}
                    />
                    {isSearching && <div className="search-loader-mini"></div>}
                  </div>

                  <div className="selected-concerts-tags">
                    {(answers[currentQuestion]?.selected || []).map((c, idx) => (
                      <div key={idx} className="selected-tag">
                        {c.name}
                        <span
                          className="remove-tag"
                          onClick={() => {
                            const current = answers[currentQuestion]?.selected || [];
                            setAnswers((prev) => ({
                              ...prev,
                              [currentQuestion]: {
                                ...prev[currentQuestion],
                                selected: current.filter((_, i) => i !== idx),
                              },
                            }));
                          }}
                        >
                          ×
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="survey-search-results">
                    {surveySearchResults.map((res, i) => (
                      <div
                        key={i}
                        className="survey-search-item"
                        onClick={() => {
                          const current = answers[currentQuestion]?.selected || [];
                          if (!current.find((c) => c.name === res.name)) {
                            setAnswers((prev) => ({
                              ...prev,
                              [currentQuestion]: {
                                ...prev[currentQuestion],
                                selected: [...current, res],
                              },
                            }));
                          }
                        }}
                      >
                        <div className="ssi-img" style={{ backgroundImage: `url(${res.image})` }}></div>
                        <div className="ssi-info">
                          <div className="ssi-name">{res.name}</div>
                          <div className="ssi-place">
                            {res.place} &middot; {res.date}
                          </div>
                        </div>
                        <div className="ssi-add">+</div>
                      </div>
                    ))}

                    {surveySearchQuery.length > 2 && surveySearchResults.length === 0 && !isSearching && (
                      <div className="no-results-survey">No concerts found for "{surveySearchQuery}"</div>
                    )}
                  </div>

                  <button className="btn-primary-lg" style={{ marginTop: "20px" }} onClick={() => setCurrentQuestion(currentQuestion + 1)}>
                    Next
                  </button>
                </div>
              ) : (
                <div className="survey-options-grid">
                  {surveyQuestions[currentQuestion].options.map((opt, i) => (
                    <button
                      key={i}
                      className={`survey-option ${answers[currentQuestion]?.label === opt.label ? "selected" : ""}`}
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
            <button className="modal-close" onClick={() => setShowResult(false)}>
              ×
            </button>

            <div className="result-header">
              <div className="result-icon-lg" style={{ background: `linear-gradient(135deg, ${resultData.color}, #888)` }}>
                {resultData.icon}
              </div>
              <h2 className="result-title">{resultData.title}</h2>
              <p className="result-desc">{resultData.desc}</p>
            </div>

            <div className="result-tags">
              {resultData.tags.map((t) => (
                <span key={t} className="result-tag" style={{ borderColor: resultData.color, color: resultData.color }}>
                  {t}
                </span>
              ))}
            </div>

            <div className="result-stats-card">
              <div className="stat-col">
                <div className="stat-val" style={{ color: resultData.color }}>
                  28
                </div>
                <div className="stat-label">POTENTIAL MATCHES</div>
              </div>
              <div className="stat-col">
                <div className="stat-val" style={{ color: resultData.color }}>
                  88%
                </div>
                <div className="stat-label">AVG COMPATIBILITY</div>
              </div>
            </div>

            <button
              className="btn-primary-lg"
              style={{ background: resultData.color, color: "white" }}
              onClick={() => {
                setShowResult(false);
                navigate("/matches", { state: { resultData } });
              }}
            >
              Find my +1 →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
