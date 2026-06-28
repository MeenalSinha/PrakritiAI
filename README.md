# PrakritiAI - Voice-Powered Natural Farming Assistant

**Tagline:** Your Voice-Powered Natural Farming Companion

PrakritiAI is a full-stack, production-quality AI assistant built for Indian farmers to transition toward Natural Farming. It combines voice interaction, image-based crop disease diagnosis, government scheme discovery, market intelligence, and a comprehensive natural farming learning center.

---

## Features

### Core

| Feature | Description |
|---|---|
| Voice Assistant | Multilingual voice input (Hindi/English/Hinglish) with Web Speech API and TTS response |
| Crop Doctor | AI-powered image analysis for disease, pest, and nutrient deficiency detection |
| Seed Advisor | Personalized crop recommendations based on state, soil, season, water, and budget |
| Government Schemes | Searchable database of PM-KISAN, PKVY, NMNF, KCC, PMFBY, and Soil Health Card |
| Learning Center | In-depth guides on Jeevamrut, Beejamrut, Crop Rotation, and more |
| Weather Intelligence | Real-time weather with contextual farming advice |
| Market Prices | Mandi prices, 30-day trends, and best selling time advice |
| Chat History | Persistent conversation history with favorite and export features |
| Authentication | JWT-based login, registration, and guest mode |

### Technical

- FastAPI backend with full REST API
- React 18 + Vite frontend
- SQLite database with SQLAlchemy ORM
- Claude (Anthropic) / OpenAI GPT-4 Vision AI
- FAISS vector store for RAG (extensible)
- JWT authentication with bcrypt password hashing
- Responsive design with mobile-first layout

---

## Architecture

```
User (Voice/Image/Text)
        |
   React Frontend (Vite)
        |
   FastAPI Backend
        |
   ┌────────────────────────────────┐
   │  Services                      │
   │  - AI Service (Claude/GPT-4)   │
   │  - Weather Service (OWM)       │
   │  - Market Service              │
   │  - Schemes Service             │
   │  - Learning Service            │
   └────────────────────────────────┘
        |
   SQLite Database (SQLAlchemy)
```

---

## Tech Stack

**Frontend**
- React 18, Vite, React Router v6
- Recharts (price graphs)
- Lucide React (icons)
- React Hot Toast

**Backend**
- Python 3.11, FastAPI, Uvicorn
- SQLAlchemy + SQLite
- python-jose (JWT), passlib (bcrypt)
- httpx (async HTTP client)

**AI**
- Anthropic Claude (primary) or OpenAI GPT-4o (fallback)
- Web Speech API for voice input
- Browser SpeechSynthesis for TTS
- FAISS (vector database, extensible)

**Infrastructure**
- Docker + Docker Compose
- Nginx (frontend serving)

---

## Installation

### Prerequisites

- Python 3.9+
- Node.js 18+
- npm or yarn

### Quick Start

```bash
# 1. Clone or extract the project
cd prakriti-ai

# 2. Copy and configure environment
cp .env.example .env
# Edit .env and add your API keys (optional - works in demo mode without)

# 3. Run everything
bash scripts/start.sh
```

This starts:
- Backend: http://localhost:8000
- Frontend: http://localhost:3000
- API Docs: http://localhost:8000/api/docs

### Manual Setup

```bash
# Backend
pip install -r requirements.txt
uvicorn backend.main:app --reload --port 8000

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

---

## Environment Variables

```env
# AI (at least one recommended)
ANTHROPIC_API_KEY=your_claude_key
OPENAI_API_KEY=your_openai_key

# Weather (optional - demo data used without)
OPENWEATHER_API_KEY=your_owm_key

# App Security
SECRET_KEY=your-secret-key-min-32-characters
```

The app works fully in **demo mode** without any API keys. Sample responses will be returned for all AI features.

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| POST | /api/v1/auth/register | Register new user |
| POST | /api/v1/auth/login | User login |
| POST | /api/v1/auth/guest | Guest session |
| GET | /api/v1/auth/me | Current user |
| POST | /api/v1/chat/message | Send chat message |
| GET | /api/v1/chat/history/{id} | Get conversation |
| POST | /api/v1/disease/diagnose | Analyze crop image |
| POST | /api/v1/seeds/recommend | Get seed recommendations |
| GET | /api/v1/weather/current | Weather data |
| GET | /api/v1/market/prices | Mandi prices |
| GET | /api/v1/schemes/ | List government schemes |
| GET | /api/v1/learning/lessons | Learning content |
| GET | /api/v1/dashboard/ | Farm dashboard |

Full interactive docs: http://localhost:8000/api/docs

---

## Prompt Design

### Guardrails
- Never recommend synthetic pesticides or chemicals
- Never fabricate government scheme amounts or dates
- Always state confidence percentage for diagnoses
- Explicitly mention uncertainty with referral to KVK

### Languages
- Hindi: Default for rural farmers
- English: For educated users
- Hinglish: Mixed language support

---

## Folder Structure

```
prakriti-ai/
├── backend/
│   ├── api/
│   │   └── routes/
│   │       ├── auth.py          # JWT authentication
│   │       ├── chat.py          # Conversation management
│   │       └── features.py      # Disease, seeds, weather, market, schemes, learning
│   ├── core/
│   │   └── auth.py              # Auth utilities
│   ├── database/
│   │   └── models.py            # SQLAlchemy models
│   ├── services/
│   │   ├── ai_service.py        # Claude/GPT-4 integration
│   │   ├── weather_service.py   # OpenWeatherMap
│   │   ├── market_service.py    # Mandi price data
│   │   ├── schemes_service.py   # Government schemes
│   │   └── learning_service.py  # Learning content
│   └── main.py                  # FastAPI application
├── frontend/
│   └── src/
│       ├── components/          # Reusable components
│       ├── context/             # Auth context
│       ├── pages/               # All page components
│       ├── styles/              # Global CSS
│       ├── utils/               # API client
│       └── App.jsx              # Router setup
├── config/
│   └── settings.py              # Pydantic settings
├── rag/                         # RAG knowledge base (extensible)
├── scripts/
│   └── start.sh                 # Quick start script
├── .env.example
├── requirements.txt
├── docker-compose.yml
└── README.md
```

---

## Deployment

### Docker (Recommended)

```bash
cp .env.example .env
# Edit .env with your keys
docker-compose up -d
```

### Manual Production

```bash
# Backend
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --workers 4

# Frontend
cd frontend && npm run build
# Serve dist/ with nginx or any static server
```

---

## Future Improvements

- WhatsApp integration for feature phone users
- Offline PWA support with service workers
- Real mandi API integration (eNAM API)
- Multilingual TTS with regional Indian languages
- Soil health monitoring with IoT sensor integration
- Farmer community forum
- Organic certification tracking
- AI-powered crop calendar and planting schedules

---

## License

MIT License. Built for Connecting Dreams Foundation Round 2 Technical Assignment.

## Acknowledgements

- ICAR (Indian Council of Agricultural Research)
- Subhash Palekar - Zero Budget Natural Farming
- Krishi Vigyan Kendra Network
- PM-KISAN and Government of India agriculture schemes
