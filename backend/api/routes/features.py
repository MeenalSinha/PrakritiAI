"""
PrakritiAI – Feature Routes (Disease, Seeds, Weather, Market, Schemes, Learning)
"""
import os
import uuid
import shutil
from typing import Optional, List
from fastapi import APIRouter, Depends, File, UploadFile, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session

import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))))

from backend.database import get_db, Diagnosis, SeedRecommendation, DailyTip, User
from backend.core.auth import get_current_user
from backend.services.ai_service import diagnose_crop_disease, get_seed_recommendations
from backend.services.weather_service import get_weather
from backend.services.market_service import get_market_prices, get_crop_price_detail
from backend.services.schemes_service import get_all_schemes, get_scheme_by_id
from backend.services.learning_service import get_all_lessons, get_lesson_by_id
from config.settings import settings

# ─── Disease Detection ──────────────────────────────────

disease_router = APIRouter(prefix="/disease", tags=["disease"])

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/jpg"}


@disease_router.post("/diagnose")
async def diagnose(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    """Analyze crop image for disease/pest/deficiency."""
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(status_code=400, detail="Only JPG, PNG, and WebP images are allowed")
    
    # Read image bytes
    image_bytes = await file.read()
    # Analyze
    result = await diagnose_crop_disease(image_bytes, file.content_type or "image/jpeg")
    
    if result.get("success") and result.get("result"):
        r = result["result"]
        # Save to database with a dummy image_path (in-memory for Vercel)
        diag = Diagnosis(
            user_id=current_user.id if current_user else None,
            session_id=uuid.uuid4().hex,
            image_path="memory_upload_vercel",
            disease_name=r.get("disease_name"),
            confidence=r.get("confidence"),
            status=r.get("status"),
            symptoms=r.get("symptoms_detected", []),
            treatment=r.get("natural_treatment"),
            preventive_actions=r.get("preventive_actions", []),
            recovery_timeline=r.get("recovery_timeline"),
            full_result=r
        )
        db.add(diag)
        db.commit()
        return {"success": True, "diagnosis_id": diag.id, "result": r, "image_path": "memory_upload_vercel"}
    
    return result


@disease_router.get("/history")
async def diagnosis_history(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    """Get past diagnoses."""
    if not current_user:
        return {"diagnoses": []}
    
    diagnoses = db.query(Diagnosis).filter(
        Diagnosis.user_id == current_user.id
    ).order_by(Diagnosis.created_at.desc()).limit(20).all()
    
    return {
        "diagnoses": [
            {
                "id": d.id,
                "disease_name": d.disease_name,
                "confidence": d.confidence,
                "status": d.status,
                "crop_type": d.crop_type,
                "created_at": d.created_at.isoformat(),
                "image_path": d.image_path
            }
            for d in diagnoses
        ]
    }


# ─── Seed Recommendations ───────────────────────────────

seed_router = APIRouter(prefix="/seeds", tags=["seeds"])


class SeedRequest(BaseModel):
    state: str
    district: Optional[str] = None
    season: str
    soil_type: str
    farm_size: float
    water_availability: str
    budget: str
    preferred_crop: Optional[str] = None


@seed_router.post("/recommend")
async def recommend_seeds(
    req: SeedRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    """Get crop and seed recommendations."""
    result = await get_seed_recommendations(req.model_dump())
    
    if result.get("success"):
        # Save recommendation
        rec = SeedRecommendation(
            user_id=current_user.id if current_user else None,
            session_id=uuid.uuid4().hex,
            state=req.state,
            district=req.district,
            season=req.season,
            soil_type=req.soil_type,
            farm_size=req.farm_size,
            water_availability=req.water_availability,
            budget=req.budget,
            preferred_crop=req.preferred_crop,
            result=result.get("result")
        )
        db.add(rec)
        db.commit()
    
    return result


# ─── Weather ────────────────────────────────────────────

weather_router = APIRouter(prefix="/weather", tags=["weather"])


@weather_router.get("/current")
async def current_weather(
    city: str = Query("Delhi", description="City name"),
    lat: Optional[float] = Query(None),
    lon: Optional[float] = Query(None)
):
    """Get current weather and farming advice."""
    return await get_weather(city, lat, lon)


# ─── Market ─────────────────────────────────────────────

market_router = APIRouter(prefix="/market", tags=["market"])


@market_router.get("/prices")
async def market_prices(
    state: str = Query("Haryana"),
    district: str = Query("Hisar")
):
    """Get mandi prices."""
    return get_market_prices(state, district)


@market_router.get("/prices/{crop}")
async def crop_price_detail(crop: str):
    """Get detailed price history for a crop."""
    return get_crop_price_detail(crop)


# ─── Government Schemes ─────────────────────────────────

schemes_router = APIRouter(prefix="/schemes", tags=["schemes"])


@schemes_router.get("/")
async def list_schemes(
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None)
):
    """Get all government schemes."""
    schemes = get_all_schemes(category=category, search=search)
    return {"success": True, "total": len(schemes), "schemes": schemes}


@schemes_router.get("/{scheme_id}")
async def get_scheme(scheme_id: str):
    """Get a specific scheme."""
    scheme = get_scheme_by_id(scheme_id)
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
    return {"success": True, "scheme": scheme}


# ─── Learning Center ─────────────────────────────────────

learning_router = APIRouter(prefix="/learning", tags=["learning"])


@learning_router.get("/lessons")
async def list_lessons(category: Optional[str] = Query(None)):
    """Get all lessons."""
    lessons = get_all_lessons(category=category)
    return {"success": True, "total": len(lessons), "lessons": lessons}


@learning_router.get("/lessons/{lesson_id}")
async def get_lesson(lesson_id: str):
    """Get a specific lesson."""
    lesson = get_lesson_by_id(lesson_id)
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return {"success": True, "lesson": lesson}


# ─── Daily Tips ─────────────────────────────────────────

tips_router = APIRouter(prefix="/tips", tags=["tips"])


@tips_router.get("/daily")
async def get_daily_tip(db: Session = Depends(get_db)):
    """Get today's farming tip."""
    from datetime import date
    day_of_year = date.today().timetuple().tm_yday
    
    tips = db.query(DailyTip).filter(DailyTip.is_active == True).all()
    if not tips:
        return {"tip": "Jeevamrut ka niyamit prayog karein.", "category": "general"}
    
    tip = tips[day_of_year % len(tips)]
    return {
        "tip": tip.tip_text,
        "tip_hi": tip.tip_text_hi,
        "category": tip.category
    }


# ─── Dashboard ──────────────────────────────────────────

dashboard_router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@dashboard_router.get("/")
async def get_dashboard(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    """Get personalized dashboard data."""
    from backend.database.models import FarmProfile
    
    farm_data = {
        "total_acres": 8.5,
        "active_crops": ["Tomato", "Wheat", "Moong"],
        "tasks_today": 3,
        "tasks_pending": 2,
        "tasks_completed": 1,
        "soil_health_score": 92,
        "soil_health_status": "Good"
    }
    
    if current_user:
        farm = db.query(FarmProfile).filter(FarmProfile.user_id == current_user.id).first()
        if farm:
            farm_data.update({
                "total_acres": farm.total_acres or 8.5,
                "active_crops": farm.active_crops or ["Tomato", "Wheat", "Moong"],
                "soil_health_score": farm.soil_health_score or 92,
            })
    
    # Nearby KVK (demo)
    nearby_kvk = {
        "name": "Krishi Vigyan Kendra, Hisar",
        "address": "HHJ+W4V, Narnaund Road, Hisar, Haryana 125001",
        "distance_km": 12,
        "phone": "01662-234567",
        "specialization": "Natural Farming, Crop Management"
    }
    
    return {
        "success": True,
        "farm": farm_data,
        "nearby_kvk": nearby_kvk,
        "user_name": current_user.name if current_user else "Kisan Ji"
    }


# ─── KVK Locator ─────────────────────────────────────────

kvk_router = APIRouter(prefix="/kvk", tags=["kvk"])

KVK_DATA = [
    {"name": "KVK Hisar", "state": "Haryana", "district": "Hisar", "address": "Narnaund Road, Hisar 125001", "phone": "01662-234567", "lat": 29.1492, "lon": 75.7217},
    {"name": "KVK Karnal", "state": "Haryana", "district": "Karnal", "address": "Karnal 132001", "phone": "0184-2267654", "lat": 29.6857, "lon": 76.9905},
    {"name": "KVK Ludhiana", "state": "Punjab", "district": "Ludhiana", "address": "PAU Campus, Ludhiana", "phone": "0161-2401960", "lat": 30.9010, "lon": 75.8573},
    {"name": "KVK Nagpur", "state": "Maharashtra", "district": "Nagpur", "address": "PDKV Campus, Nagpur", "phone": "0712-2500044", "lat": 21.1458, "lon": 79.0882},
    {"name": "KVK Varanasi", "state": "Uttar Pradesh", "district": "Varanasi", "address": "BHU Campus, Varanasi", "phone": "0542-2575637", "lat": 25.2677, "lon": 82.9913},
]


@kvk_router.get("/nearby")
async def get_nearby_kvk(state: str = Query("Haryana"), district: str = Query("")):
    """Get KVK centers near location."""
    result = [k for k in KVK_DATA if k["state"].lower() == state.lower()]
    if not result:
        result = KVK_DATA[:3]
    return {"success": True, "centers": result}


# ─── RAG / Knowledge Base ────────────────────────────────

rag_router = APIRouter(prefix="/rag", tags=["rag"])


@rag_router.get("/stats")
async def rag_stats():
    """Get RAG knowledge base statistics."""
    try:
        from rag.retriever import get_rag
        rag = get_rag()
        return {"success": True, **rag.get_corpus_stats()}
    except Exception as e:
        return {"success": False, "error": str(e), "total_documents": 0}


@rag_router.get("/search")
async def rag_search(q: str = Query(..., description="Search query")):
    """Search the knowledge base."""
    try:
        from rag.retriever import get_rag
        rag = get_rag()
        results = rag.retrieve(q, top_k=5)
        return {"success": True, "query": q, "results": results}
    except Exception as e:
        return {"success": False, "error": str(e), "results": []}


@rag_router.post("/build-index")
async def build_rag_index():
    """Build or rebuild FAISS index (requires sentence-transformers)."""
    try:
        from rag.retriever import get_rag
        rag = get_rag()
        ok, msg = rag.build_faiss_index()
        return {"success": ok, "message": msg}
    except Exception as e:
        return {"success": False, "message": str(e)}
