# Date Night ❤️

A romantic date invitation application built with React and Java Spring Boot.

## Project Idea

This application allows me to invite my wife on a date and let her choose her favorite location from a list of options.

## Features

- A romantic invitation page with optional birthday greeting, personal message and confetti
- A list of date locations with an interactive map
- Private invite link — she picks a restaurant and accepts or declines
- "Our dates" page showing her answer and chosen restaurant
- Admin pages protected by a secret key

## Tech Stack

- Frontend: React 19 + Vite (deployed on Vercel)
- Backend: Java 25 + Spring Boot 4 (Docker, deployed on Render)
- Database: H2 locally, PostgreSQL (Neon) in production

## Run locally

```bash
# backend (H2 file DB, no admin key)
cd backend && ./mvnw spring-boot:run

# frontend
cd frontend && cp .env.example .env && npm install && npm run dev
```

## Deploy

### 1. Database — Neon (free)
Create a project at neon.tech and note host, database, user and password.

### 2. Backend — Render (free, Docker)
New **Web Service** → this repo → **Root directory** `backend` → **Runtime** Docker.

| Env var | Example |
|---|---|
| `DB_URL` | `jdbc:postgresql://<neon-host>/<db>?sslmode=require` |
| `DB_USERNAME` | Neon user |
| `DB_PASSWORD` | Neon password |
| `ADMIN_KEY` | a long secret only you know |
| `APP_CORS_ORIGINS` | `https://<your-app>.vercel.app` (comma-separated for several) |

### 3. Frontend — Vercel (free)
Import this repo → **Root directory** `frontend` → framework Vite.

| Env var | Example |
|---|---|
| `VITE_API_URL` | `https://<render-app>.onrender.com/api/date-night/invitations` |

`frontend/vercel.json` makes deep links like `/invite/<token>` work.

> Render's free plan sleeps after 15 minutes of inactivity; the first request then takes ~50 s.
> Open the invite link yourself shortly before sending it.
