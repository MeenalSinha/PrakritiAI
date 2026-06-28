# 🌿 PrakritiAI — प्राकृतिक खेती का साथी

**Your Voice-Powered Natural Farming Companion for Indian Farmers**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-prakriti--ai--kappa.vercel.app-brightgreen?style=for-the-badge&logo=vercel)](https://prakriti-ai-kappa.vercel.app)
[![Tech Stack](https://img.shields.io/badge/Stack-React%20%2B%20FastAPI%20%2B%20Claude-blue?style=for-the-badge)](https://prakriti-ai-kappa.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

---

PrakritiAI is a full-stack, production-deployed AI assistant built to help Indian farmers transition toward **Natural (Prakritik) Farming**. It combines multilingual voice interaction, AI-powered crop disease diagnosis, government scheme discovery, real-time market intelligence, and a comprehensive natural farming knowledge base.

> 🏆 Built for **Connecting Dreams Foundation — Round 2 Technical Assignment**

---

## ✨ Features

### 🤖 AI Assistant
- Multilingual conversational AI (Hindi / English / Hinglish)
- Voice input via Web Speech API and Text-to-Speech output
- Context-aware responses grounded in Subhash Palekar's ZBNF principles
- RAG (Retrieval-Augmented Generation) knowledge base with 8 curated natural farming guides
- Powered by **Anthropic Claude** (primary) with **OpenAI GPT-4o** as fallback

### 🔬 Crop Doctor
- Upload or capture leaf/plant images for AI-powered diagnosis
- Detects diseases, pest infestations, and nutrient deficiencies
- Returns confidence score, treatment plan, and natural remedy advice
- Maintains diagnosis history per user

### 🌱 Seed Advisor
- Personalized crop recommendations based on state, soil type, season, water availability, and budget
- Suggests seeds compatible with organic and natural farming practices

### 🏛️ Government Schemes
- Searchable database covering **PM-KISAN, PKVY, NMNF, KCC, PMFBY, Soil Health Card**
- Filter by eligibility, benefit amount, and application status

### 📚 Learning Center
- In-depth guides on **Jeevamrut, Beejamrut, Crop Rotation, Multilevel Farming** and more
- Reading-time estimates and topic-based browsing

### 🌦️ Weather Intelligence
- Real-time weather with 5-day forecast via OpenWeatherMap
- Contextual farming advice based on current conditions

### 📈 Market Prices
- Live mandi (wholesale market) prices for major crops
- 30-day price trend charts and optimal selling time suggestions

### 📅 Farm Calendar & Glossary
- Season-aware farming task calendar
- Glossary of natural farming terms in Hindi and English

### 🔐 Authentication
- JWT-based login, registration, and guest mode
- Persistent chat history with favorite and export features

---

## 🏗️ Architecture

```
Browser (Voice / Image / Text)
        │
   React 19 + Vite (SPA)  ──────────────► Vercel CDN (Static Hosting)
        │                                     (frontend/dist)
        │ /api/*
        ▼
   FastAPI Backend ──────────────────────► Vercel Serverless (api/index.py)
        │
   ┌────┴─────────────────────────────────────────┐
   │  Services                                     │
   │  ├── AI Service      (Claude / GPT-4o)        │
   │  ├── RAG Retriever   (FAISS + 8 guides)       │
   │  ├── Weather Service (OpenWeatherMap API)      │
   │  ├── Market Service  (Mandi price engine)      │
   │  ├── Schemes Service (Govt scheme database)    │
   │  └── Learning Service (Content management)    │
   └────────────────────────────────────────────────┘
        │
   SQLAlchemy ORM ──────────────────────► PostgreSQL (Supabase) / SQLite (local)
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite 8, React Router v7, Recharts, Lucide React, React Hot Toast |
| **Backend** | Python 3.11, FastAPI 0.111, Uvicorn, SQLAlchemy 2.0 |
| **Database** | PostgreSQL (Supabase, production) / SQLite (local dev) |
| **AI / LLM** | Anthropic Claude (primary), OpenAI GPT-4o (fallback) |
| **Voice** | Web Speech API (input), Browser SpeechSynthesis (TTS) |
| **RAG** | FAISS vector store + custom retriever over 8 knowledge files |
| **Auth** | JWT (python-jose), bcrypt (passlib) |
| **Deployment** | Vercel (frontend + serverless API) |
| **Dev Tooling** | Docker, Docker Compose, pytest |

---

## 📁 Project Structure

```
prakriti-ai/
├── api/
│   └── index.py                 # Vercel serverless entry point (wraps FastAPI)
├── backend/
│   ├── api/routes/              # FastAPI route handlers
│   │   ├── auth.py              # JWT authentication
│   │   ├── chat.py              # Conversation & history
│   │   └── features.py          # Disease, seeds, weather, market, schemes, learning
│   ├── core/
│   │   └── auth.py              # Auth utilities & dependencies
│   ├── database/
│   │   └── models.py            # SQLAlchemy models
│   ├── services/
│   │   ├── ai_service.py        # Claude / GPT-4o integration
│   │   ├── learning_service.py  # Learning content management
│   │   ├── market_service.py    # Mandi price engine
│   │   ├── schemes_service.py   # Govt schemes database
│   │   └── weather_service.py   # OpenWeatherMap integration
│   └── main.py                  # FastAPI app factory
├── config/
│   └── settings.py              # Pydantic settings (env vars)
├── frontend/
│   └── src/
│       ├── assets/images/       # Bundled images (processed by Vite)
│       ├── components/          # Reusable UI components
│       ├── context/             # AuthContext (global state)
│       ├── pages/               # Page components (12 pages)
│       │   ├── HomePage.jsx
│       │   ├── AssistantPage.jsx
│       │   ├── DiseasePage.jsx
│       │   ├── SeedsPage.jsx
│       │   ├── WeatherPage.jsx
│       │   ├── MarketPage.jsx
│       │   ├── SchemesPage.jsx
│       │   ├── LearnPage.jsx
│       │   ├── CalendarAndGlossary.jsx
│       │   ├── HistoryAndSettings.jsx
│       │   ├── AboutPage.jsx
│       │   └── AuthPages.jsx
│       ├── styles/              # Global CSS design system
│       ├── utils/               # API client, i18n helper
│       └── App.jsx              # Router & layout
├── rag/
│   ├── knowledge/               # 8 natural farming knowledge files
│   │   ├── jeevamrut_guide.txt
│   │   ├── beejamrut_seed_treatment.txt
│   │   ├── disease_management.txt
│   │   ├── pest_management_natural.txt
│   │   ├── soil_health_guide.txt
│   │   ├── government_schemes.txt
│   │   ├── kharif_crop_guide.txt
│   │   └── rabi_crop_guide.txt
│   └── retriever.py             # FAISS-based RAG retriever
├── scripts/
│   └── start.sh                 # Quick local start script
├── tests/                       # pytest test suite
├── .env.example                 # Environment variable template
├── requirements.txt             # Python dependencies
├── vercel.json                  # Vercel deployment configuration
├── docker-compose.yml           # Docker Compose setup
└── Dockerfile                   # Container definition
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.9+
- Node.js 18+
- npm

### Quick Start (Local)

```bash
# 1. Clone the repository
git clone https://github.com/MeenalSinha/PrakritiAI.git
cd prakriti-ai

# 2. Set up environment
cp .env.example .env
# Edit .env and add your API keys (see Environment Variables below)

# 3. Start everything at once
bash scripts/start.sh
```

This starts:
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:8000
- **API Docs:** http://localhost:8000/api/docs

### Manual Setup

```bash
# Backend
pip install -r requirements.txt
uvicorn backend.main:app --reload --port 8000

# Frontend (in a new terminal)
cd frontend
npm install
npm run dev
```

### Docker

```bash
cp .env.example .env
# Edit .env with your keys
docker-compose up -d
```

---

## 🔑 Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```env
# App
SECRET_KEY=your-secret-key-min-32-characters

# AI (at least one recommended; falls back to demo mode if missing)
ANTHROPIC_API_KEY=your_claude_key
OPENAI_API_KEY=your_openai_key

# Weather (optional — demo data used if missing)
OPENWEATHER_API_KEY=your_owm_key

# Database (SQLite by default; use PostgreSQL in production)
DATABASE_URL=sqlite:///./prakriti.db
# DATABASE_URL=postgresql://user:password@host:5432/dbname

# Storage
UPLOAD_DIR=uploads
MAX_UPLOAD_SIZE_MB=10
```

> 💡 The app works fully in **demo mode** without any API keys. Realistic mock data is returned for all AI, weather, and market features.

---

## 📡 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/auth/register` | Register a new user |
| `POST` | `/api/v1/auth/login` | User login → returns JWT |
| `POST` | `/api/v1/auth/guest` | Create a guest session |
| `GET` | `/api/v1/auth/me` | Get current user profile |
| `POST` | `/api/v1/chat/message` | Send a chat message to AI |
| `GET` | `/api/v1/chat/history/{id}` | Retrieve conversation history |
| `POST` | `/api/v1/disease/diagnose` | Upload image for crop diagnosis |
| `GET` | `/api/v1/disease/history` | Get past diagnoses |
| `POST` | `/api/v1/seeds/recommend` | Get personalized seed recommendations |
| `GET` | `/api/v1/weather/current` | Current weather + farming advice |
| `GET` | `/api/v1/market/prices` | Live mandi prices |
| `GET` | `/api/v1/schemes/` | List all government schemes |
| `GET` | `/api/v1/learning/lessons` | Get learning content |
| `GET` | `/api/v1/dashboard/` | Farm dashboard summary |
| `GET` | `/api/v1/kvk/nearby` | Nearby Krishi Vigyan Kendra |
| `GET` | `/api/v1/tips/daily` | Daily farming tip |

> Full interactive documentation: **http://localhost:8000/api/docs**

---

## 🌐 Deployment (Vercel)

The project is deployed on **Vercel** as a monorepo with:
- The **React SPA** built to `frontend/dist/` and served from the CDN edge.
- The **FastAPI backend** served as a Python serverless function via `api/index.py`.

```bash
# 1. Push to the main branch — Vercel auto-deploys on every push
git push origin main

# 2. Set these environment variables in your Vercel project settings:
#    ANTHROPIC_API_KEY, OPENAI_API_KEY, OPENWEATHER_API_KEY,
#    SECRET_KEY, DATABASE_URL
```

The `vercel.json` routes `/api/*` traffic to the FastAPI serverless function and all other paths to `index.html` (for client-side routing).

---

## 🛡️ AI Guardrails

The AI assistant is explicitly instructed to:

- ✅ Only recommend **natural and organic** treatments — never synthetic pesticides
- ✅ Always cite a **confidence percentage** for disease diagnoses
- ✅ Acknowledge uncertainty and refer farmers to the **local KVK**
- ✅ Never fabricate government scheme **amounts, dates, or eligibility criteria**
- ✅ Respond in the **same language** the farmer uses (Hindi / English / Hinglish)

---

## 🔮 Roadmap

- [ ] **WhatsApp Bot** — reach farmers on feature phones via WhatsApp Business API
- [ ] **PWA / Offline Mode** — service worker for offline access in low-connectivity areas
- [ ] **eNAM Integration** — real mandi prices via Government of India's eNAM API
- [ ] **Regional TTS** — voice output in Marathi, Punjabi, Telugu, and more
- [ ] **IoT Soil Sensors** — real-time soil health monitoring integration
- [ ] **Farmer Community Forum** — peer-to-peer knowledge sharing
- [ ] **Organic Certification Tracker** — guide farmers through certification process
- [ ] **AI Crop Calendar** — personalized planting schedules based on location and crop

---

## 🙏 Acknowledgements

- **Subhash Palekar** — Zero Budget Natural Farming (ZBNF) framework
- **ICAR** — Indian Council of Agricultural Research knowledge base
- **Krishi Vigyan Kendra (KVK) Network** — grassroots farmer support
- **Government of India** — PM-KISAN, PKVY, NMNF, and all farmer welfare schemes

---

## 📄 License

MIT License © 2024 Meenal Sinha. Built for Connecting Dreams Foundation.
