# PlusOne

Find your concert buddy. Discover concerts, share your vibe with a personality survey, and get matched with people who share your concert style.

## Features

- **Discover Concerts** – Browse curated concerts (mock data from online sources)
- **Mark Interest** – Tap "Interested" or "I have tickets" on any show
- **Personality Survey** – 10-question quiz to capture your concert vibe
- **Smart Matching** – Get matched with people based on personality similarity and shared concerts

## Tech Stack

- **Backend**: Node.js, Express
- **Frontend**: React, Vite, React Router
- **Design**: Beli-inspired modern UI with dark theme, gradients, and smooth animations

## Setup

```bash
# Install all dependencies (root + client)
npm run install:all

# Start both server and client
npm run dev
```

- **API**: http://localhost:3001
- **App**: http://localhost:5173

## Project Structure

```
PlusOne/
├── server/
│   └── index.js       # Express API with mock data
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.jsx
│   └── ...
├── package.json
└── README.md
```

## Routes

| Path | Description |
|------|-------------|
| `/` | Home with feature overview |
| `/concerts` | Browse and mark concerts |
| `/my-concerts` | Your saved concerts |
| `/survey` | Personality quiz |
| `/matches` | Matched users |

## API Endpoints

- `GET /api/concerts` – List all concerts
- `GET /api/survey` – Get survey questions
- `POST /api/user/concerts` – Save user's concert interests
- `POST /api/user/survey` – Submit survey answers
- `GET /api/matches` – Get personality-matched users
