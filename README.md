# CareSphere AI 🏥

AI-powered healthcare platform with symptom checking, doctor discovery, appointment booking, and medical document analysis.

## Tech Stack

- **Frontend**: React 19 + TypeScript, Vite, Tailwind CSS v4, Three.js (3D landing), Axios, React Router
- **Backend**: FastAPI (async), Motor (async MongoDB), Redis, JWT auth, SlowAPI rate limiting, Gemini AI
- **Database**: MongoDB + Redis (`docker-compose.yml` included)

## Quick Start

### 1. Start databases

```bash
docker-compose up -d
```

### 2. Backend

```bash
cd Backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env          # add your GEMINI_API_KEY
python init_db.py             # creates collections + sample doctors
uvicorn main:app --reload     # runs on http://localhost:8000
```

### 3. Frontend

```bash
cd Frontend
npm install
npm run dev                   # runs on http://localhost:5173
```

Visit **http://localhost:5173**

## Configuration

All secrets load from environment files — see `Backend/.env.example` and `Frontend/.env.example`.

| Variable | Purpose |
|---|---|
| `GEMINI_API_KEY` | Google Gemini API key for symptom/document analysis |
| `MONGODB_URL` | MongoDB connection string |
| `REDIS_URL` | Redis connection string |
| `SECRET_KEY` | JWT signing secret (change in production) |
| `VITE_API_BASE_URL` | Backend base URL for the frontend |

## Features

- 🔐 JWT auth — register/login with bcrypt-hashed passwords, 30-min token expiry
- 🩺 AI symptom checker — severity, possible conditions, specialists, emergency signs
- 🔍 Doctor search — filter by specialty & location, live availability
- 📅 Appointment booking — per-user appointment history
- 📄 Medical document analysis — upload reports for plain-language AI explanations
- 🚦 Rate limiting — per-endpoint limits (5–100 req/min) returning HTTP 429
- 🌐 3D animated landing page with Three.js

## API Endpoints

| Method | Path | Auth | Rate limit |
|---|---|---|---|
| POST | `/auth/register` | — | 5/min |
| POST | `/auth/login` | — | 10/min |
| GET | `/users/profile` | ✅ | 100/min |
| POST | `/symptoms/analyze` | ✅ | 20/min |
| POST | `/documents/analyze` | ✅ | 10/min |
| GET | `/doctors/search` | — | 50/min |
| POST | `/appointments/book` | ✅ | 10/min |
| GET | `/appointments/list` | ✅ | 50/min |
| GET | `/health` | — | — |

> ⚠️ **Disclaimer**: CareSphere AI provides informational insights only and is not a substitute for professional medical advice, diagnosis, or treatment.
