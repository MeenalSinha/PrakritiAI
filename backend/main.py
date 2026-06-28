"""
PrakritiAI – Main FastAPI Application
Voice-Powered Natural Farming Assistant
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from loguru import logger

from config.settings import settings
from backend.database import create_tables
from backend.api.routes import (
    auth_router, chat_router, disease_router, seed_router,
    weather_router, market_router, schemes_router, learning_router,
    tips_router, dashboard_router, kvk_router, rag_router
)

# ─── Rate Limiter ─────────────────────────────────────

limiter = Limiter(key_func=get_remote_address, default_limits=[settings.RATE_LIMIT_DEFAULT])

# ─── Lifespan (replaces on_event) ────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    create_tables()
    logger.info(f"PrakritiAI API started · Mode: {settings.APP_ENV}")
    logger.info(f"AI configured: {settings.ai_configured}")
    logger.info("API Docs: http://localhost:8000/api/docs")

    # Auto-build RAG index if missing
    try:
        from rag.retriever import get_rag
        rag = get_rag()
        stats = rag.get_corpus_stats()
        if stats.get("total_documents", 0) > 0:
            logger.info(f"RAG: {stats['total_documents']} documents loaded")
            if not os.path.exists(settings.FAISS_INDEX_PATH + ".faiss"):
                logger.info("RAG: Building FAISS index...")
                ok, msg = rag.build_faiss_index()
                logger.info(f"RAG index build: {msg}")
        else:
            logger.warning("RAG: Knowledge base is empty. Add documents to rag/knowledge/")
    except Exception as e:
        logger.warning(f"RAG initialization skipped: {e}")

    yield  # App runs

    # Shutdown
    logger.info("PrakritiAI shutting down...")


# ─── Application ─────────────────────────────────────

app = FastAPI(
    title="PrakritiAI API",
    description="Voice-Powered Natural Farming Assistant for Indian Farmers",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    lifespan=lifespan
)

# ─── Rate Limiting ────────────────────────────────────

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ─── CORS ────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routes ──────────────────────────────────────────

API_PREFIX = "/api/v1"

app.include_router(auth_router, prefix=API_PREFIX)
app.include_router(chat_router, prefix=API_PREFIX)
app.include_router(disease_router, prefix=API_PREFIX)
app.include_router(seed_router, prefix=API_PREFIX)
app.include_router(weather_router, prefix=API_PREFIX)
app.include_router(market_router, prefix=API_PREFIX)
app.include_router(schemes_router, prefix=API_PREFIX)
app.include_router(learning_router, prefix=API_PREFIX)
app.include_router(tips_router, prefix=API_PREFIX)
app.include_router(dashboard_router, prefix=API_PREFIX)
app.include_router(kvk_router, prefix=API_PREFIX)
app.include_router(rag_router, prefix=API_PREFIX)

# ─── Health Check ────────────────────────────────────

@app.get("/api/health")
async def health():
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": "1.0.0",
        "mode": settings.APP_ENV,
        "features": {
            "ai": settings.ai_configured,
            "weather": bool(settings.OPENWEATHER_API_KEY),
            "database": True,
            "rag": os.path.exists(settings.FAISS_INDEX_PATH + ".faiss")
        }
    }

# ─── Static Files ────────────────────────────────────

try:
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")
except Exception:
    logger.warning("Could not mount /uploads directory (expected on Vercel)")

frontend_dist = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "frontend", "dist")
if os.path.exists(frontend_dist):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist, "assets")), name="assets")

    @app.get("/{full_path:path}", include_in_schema=False)
    async def serve_frontend(full_path: str):
        index_path = os.path.join(frontend_dist, "index.html")
        if os.path.exists(index_path):
            return FileResponse(index_path)
        return {"message": "Frontend not built. Run 'npm run build' in frontend/"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
