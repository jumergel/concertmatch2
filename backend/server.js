
const fs = require('fs');
const path = require('path');
// Check if .env is relative (running from root) or absolute
const envPath = fs.existsSync(path.resolve(__dirname, '.env')) ? path.resolve(__dirname, '.env') : path.resolve(process.cwd(), 'backend', '.env');
require("dotenv").config({ path: envPath });
const express = require("express");
const cors = require("cors");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// Limit to 5 per page as requested
const PAGE_SIZE = 5;

app.get("/api/concerts", async (req, res) => {
    try {
        const city = req.query.city || "Austin, TX";
        // For pagination, SerpAPI uses the 'start' parameter (0, 10, 20...)
        // Since Google usually returns ~10 results per page, we will try to calculate offset
        const page = parseInt(req.query.page || "1", 10);
        const start = (Math.max(page, 1) - 1) * PAGE_SIZE;

        const apiKey = process.env.SERPAPI_KEY;
        if (!apiKey) return res.status(500).json({ error: "Missing SERPAPI_KEY in .env" });

        // SerpAPI Google Events parameters
        const params = new URLSearchParams({
            engine: "google_events",
            q: `concerts in ${city}`,
            hl: "en",
            gl: "us",
            start: String(start), // Pagination offset
            api_key: apiKey,
        });

        console.log(`Fetching concerts for ${city}, start=${start}...`);

        const url = `https://serpapi.com/search.json?${params.toString()}`;
        const resp = await fetch(url);

        if (!resp.ok) {
            const text = await resp.text();
            console.error("SerpAPI Error:", text);
            return res.status(resp.status).send(text);
        }

        const data = await resp.json();

        if (data.error) {
            console.error("SerpAPI returned error object:", data.error);
            return res.status(500).json({ error: data.error });
        }

        const allEvents = data.events_results || [];

        // We only want PAGE_SIZE (5) items to render
        const displayEvents = allEvents.slice(0, PAGE_SIZE);

        console.log(`Found ${allEvents.length} events, returning ${displayEvents.length}`);

        res.json({
            page,
            results_per_page: PAGE_SIZE,
            events: displayEvents,
            has_more: allEvents.length > PAGE_SIZE, // Primitive check if we got more than we needed
            serpapi_pagination: data.serpapi_pagination
        });

    } catch (err) {
        console.error("Server Error:", err);
        res.status(500).json({ error: err?.message || "Server error" });
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
