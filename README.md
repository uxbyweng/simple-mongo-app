# Simple Bulletin Board

A containerized full-stack web application built with **Next.js 16**, **MongoDB**, and **Docker**. Users can submit entries via a form; entries are persisted in MongoDB and displayed in real time.

**Live:** [simple-bulletin-board-production.up.railway.app](https://simple-bulletin-board-production.up.railway.app)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend & API | Next.js 16 (App Router) |
| Database | MongoDB via Mongoose |
| Containerization | Docker, Docker Compose |
| Cloud Deployment | Railway (Docker-native) |
| Managed Database | MongoDB Atlas |

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

## Deployment (Railway)

The app is deployed as a Docker container on [Railway](https://railway.app).

1. Push to GitHub — Railway detects the `Dockerfile` automatically
2. Set the `MONGODB_URI` environment variable in Railway (pointing to MongoDB Atlas)
3. Railway builds the image and assigns a public HTTPS URL

Live URL: [https://simple-bulletin-board-production.up.railway.app](https://simple-bulletin-board-production.up.railway.app)

---

## Project Structure

```
app/
  api/entries/route.ts   — GET (list entries) + POST (create entry)
  page.tsx               — form + entry list (Client Component)
  layout.tsx
lib/
  db.ts                  — Mongoose connection with caching
models/
  Entry.ts               — Mongoose schema
Dockerfile               — 3-stage multi-stage build
docker-compose.yml       — local orchestration (app + mongo)
.env.example             — required environment variables
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string (Atlas or local) |

See `.env.example` for reference.
