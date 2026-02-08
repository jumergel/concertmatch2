// dotenv.config();

// const fs = require('fs');
// const path = require('path');
// // Check if .env is relative (running from root) or absolute
// const envPath = fs.existsSync(path.resolve(__dirname, '.env')) ? path.resolve(__dirname, '.env') : path.resolve(process.cwd(), 'backend', '.env');
// require("dotenv").config({ path: envPath });
// const express = require("express");
// const cors = require("cors");
// const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(cors());

require('dotenv').config();

const express = require("express");
const cors = require("cors");
const path = require('path');
// Note: If you are on Node 18+, you don't need 'node-fetch' at all. 
// You can use the built-in global fetch().

const app = express();
app.use(cors());

// Diagnostic: Run this once to verify your key is actually loading
console.log("SerpAPI Key Loaded:", process.env.SERPAPI_KEY ? "Yes" : "No");

const PORT = process.env.PORT || 5001;

// Limit to 5 per page as requested
// Limit to 9 per page to match the 3x3 grid design
const PAGE_SIZE = 9;

// Mock data for development when API key is missing
const MOCK_EVENTS = [
    {
        title: "Tame Impala",
        date: { start_date: "2026-03-15", when: "Sun, Mar 15, 7:00 PM" },
        venue: { name: "Moody Center" },
        thumbnail: "/pictures/tame.jpg",
        ticket_info: [{ price: "$45+" }],
        address: ["Austin, TX"],
        tags: ["Psychedelic Rock"],
        looking_count: 23
    },
    {
        title: "SZA",
        date: { start_date: "2026-03-22", when: "Sun, Mar 22, 8:00 PM" },
        venue: { name: "ACL Live" },
        thumbnail: "/pictures/sza.jpg",
        ticket_info: [{ price: "$55+" }],
        address: ["Austin, TX"],
        tags: ["R&B"],
        looking_count: 47
    },
    {
        title: "Tyler, the Creator",
        date: { start_date: "2026-04-05", when: "Sun, Apr 5, 7:00 PM" },
        venue: { name: "Germania Insurance Amphitheater" },
        thumbnail: "/pictures/tyler.jpg",
        ticket_info: [{ price: "$60+" }],
        address: ["Austin, TX"],
        tags: ["Hip Hop"],
        looking_count: 38
    },
    {
        title: "Billie Eilish",
        date: { start_date: "2026-04-12", when: "Sun, Apr 12, 7:30 PM" },
        venue: { name: "Moody Center" },
        thumbnail: "/pictures/billie.jpg",
        ticket_info: [{ price: "$70+" }],
        address: ["Austin, TX"],
        tags: ["Pop"],
        looking_count: 62
    },
    {
        title: "Kendrick Lamar",
        date: { start_date: "2026-04-20", when: "Mon, Apr 20, 8:00 PM" },
        venue: { name: "Circuit of the Americas" },
        thumbnail: "https://i.scdn.co/image/ab6761610000e5eb437b9e2a82505b3d93ff1022",
        ticket_info: [{ price: "$85+" }],
        address: ["Austin, TX"],
        tags: ["Hip Hop"],
        looking_count: 89
    },
    {
        title: "Doja Cat",
        date: { start_date: "2026-05-03", when: "Sun, May 3, 8:00 PM" },
        venue: { name: "ACL Live" },
        thumbnail: "/pictures/doja.jpg",
        ticket_info: [{ price: "$50+" }],
        address: ["Austin, TX"],
        tags: ["Pop/Rap"],
        looking_count: 34
    }
];

app.get("/api/concerts", async (req, res) => {
    try {
        const page = parseInt(req.query.page || "1", 10);
        const start = (Math.max(page, 1) - 1) * PAGE_SIZE;

        console.log(`Returning mock concerts page ${page}, start=${start}`);

        // Always return mock data
        await new Promise(resolve => setTimeout(resolve, 300)); // Slight delay for realism

        const mockSlice = MOCK_EVENTS.slice(start, start + PAGE_SIZE);

        return res.json({
            page,
            results_per_page: PAGE_SIZE,
            events: mockSlice,
            has_more: (start + PAGE_SIZE) < MOCK_EVENTS.length,
            serpapi_pagination: {}
        });

    } catch (err) {
        console.error("Server Error:", err);
        res.status(500).json({ error: "Server Error" });
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));