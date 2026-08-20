# Schwarzes Brett

A containerized full-stack web application built with **Next.js 16**, **MongoDB**, and **Docker**. Features a chalkboard UI where users can post messages in different chalk colors — entries are persisted in MongoDB and displayed on the board.

**Live:** [simple-bulletin-board.onrender.com](https://simple-bulletin-board.onrender.com)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend & API | Next.js 16 (App Router) |
| Database | MongoDB via Mongoose |
| Containerization | Docker, Docker Compose |
| Cloud Deployment | Render (Docker-native) |
| Managed Database | MongoDB Atlas |

---

## Features

- Post messages with your name to the chalkboard
- Choose from 5 chalk colors (white, yellow, blue, pink, green)
- Entries displayed as slightly rotated chalk-style cards
- "wischen" button per entry to erase it with a fade-out animation
- "Tafel wischen" to erase all entries at once (with confirmation)
- Character limit (200) with live counter; Cmd/Ctrl + Enter to submit
- Rate limiting: max 5 POST requests per IP per minute

---

## Architecture

```
┌─────────────────────────────────┐
│         Docker Compose          │
│                                 │
│  ┌──────────┐   ┌────────────┐  │
│  │ Next.js  │──▶│  MongoDB   │  │
│  │  :3000   │   │   :27017   │  │
│  └──────────┘   └────────────┘  │
└─────────────────────────────────┘
```

The Dockerfile uses a **3-stage multi-stage build** to keep the production image lean:

1. **deps** — installs npm packages
2. **builder** — compiles the Next.js app
3. **runner** — minimal Alpine image with only the compiled output; runs as a non-root user

---

## Local Development (Docker)

Prerequisites: [Docker Desktop](https://www.docker.com/products/docker-desktop/)

```bash
git clone https://github.com/uxbyweng/simple-bulletin-board.git
cd simple-bulletin-board
docker compose up --build
```

Open [http://localhost:3000](http://localhost:3000)

```bash
docker compose down        # stop containers
docker compose down -v     # stop and delete database volume
```

---

## Local Development (without Docker)

```bash
npm install
cp .env.example .env.local  # then set MONGODB_URI
npm run dev
```

---

## Deployment (Render)

The app is deployed as a Docker container on [Render](https://render.com).

1. Push to GitHub — Render detects the `Dockerfile` automatically
2. Set the `MONGODB_URI` environment variable in Render (pointing to MongoDB Atlas)
3. Render builds the image and assigns a public HTTPS URL

Live URL: [https://simple-bulletin-board.onrender.com](https://simple-bulletin-board.onrender.com)

---

## Project Structure

```
app/
  api/entries/route.ts       — GET (list) + POST (create, with rate limiting)
  api/entries/[id]/route.ts  — DELETE (erase single entry)
  page.tsx                   — chalkboard UI (Client Component)
  layout.tsx                 — fonts, global CSS animations
lib/
  db.ts                      — Mongoose connection with caching
models/
  Entry.ts                   — Mongoose schema (name, message, chalk)
Dockerfile                   — 3-stage multi-stage build
docker-compose.yml           — local orchestration (app + mongo)
.env.example                 — required environment variables
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string (Atlas or local) |

See `.env.example` for reference.
