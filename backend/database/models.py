"""
PrakritiAI – Database Models (SQLAlchemy + SQLite)
"""
from datetime import datetime
from sqlalchemy import (
    create_engine, Column, Integer, String, Text, Float,
    DateTime, Boolean, ForeignKey, JSON
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config.settings import settings

from sqlalchemy import event

# Fix SQLAlchemy dialect for psycopg3 (required for Vercel/AWS Lambda compatibility)
db_url = settings.DATABASE_URL.strip()
if db_url.startswith("postgres://") or db_url.startswith("postgresql://"):
    db_url = db_url.replace("postgres://", "postgresql+psycopg://").replace("postgresql://", "postgresql+psycopg://")
    if "?" not in db_url:
        db_url += "?sslmode=require"
    elif "sslmode=" not in db_url:
        db_url += "&sslmode=require"

from sqlalchemy.pool import NullPool

engine_kwargs = {
    "pool_pre_ping": True,
    "connect_args": {"check_same_thread": False} if "sqlite" in db_url else {}
}
if "sqlite" not in db_url:
    engine_kwargs["poolclass"] = NullPool

engine = create_engine(db_url, **engine_kwargs)

if "sqlite" in settings.DATABASE_URL:
    @event.listens_for(engine, "connect")
    def set_sqlite_pragma(dbapi_connection, connection_record):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA journal_mode=WAL")
        cursor.execute("PRAGMA synchronous=NORMAL")
        cursor.close()

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ─────────────────────── Models ───────────────────────

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    phone = Column(String(15), unique=True, index=True)
    email = Column(String(150), unique=True, nullable=True)
    hashed_password = Column(String(255), nullable=False)
    state = Column(String(50), nullable=True)
    district = Column(String(50), nullable=True)
    village = Column(String(100), nullable=True)
    farm_size_acres = Column(Float, nullable=True)
    preferred_language = Column(String(10), default="hi")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    conversations = relationship("Conversation", back_populates="user")
    diagnoses = relationship("Diagnosis", back_populates="user")
    farm_profile = relationship("FarmProfile", back_populates="user", uselist=False)


class FarmProfile(Base):
    __tablename__ = "farm_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    total_acres = Column(Float, default=0.0)
    soil_type = Column(String(50), nullable=True)
    water_source = Column(String(100), nullable=True)
    active_crops = Column(JSON, default=list)
    soil_health_score = Column(Integer, default=0)
    tasks_today = Column(JSON, default=list)
    notes = Column(Text, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="farm_profile")


class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    session_id = Column(String(64), index=True)
    title = Column(String(200), nullable=True)
    language = Column(String(10), default="hi")
    is_voice = Column(Boolean, default=False)
    is_favorite = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="conversations")
    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan")


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id"))
    role = Column(String(20))  # user | assistant
    content = Column(Text, nullable=False)
    audio_path = Column(String(255), nullable=True)
    image_path = Column(String(255), nullable=True)
    intent = Column(String(50), nullable=True)
    confidence = Column(Float, nullable=True)
    sources = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)

    conversation = relationship("Conversation", back_populates="messages")


class Diagnosis(Base):
    __tablename__ = "diagnoses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    session_id = Column(String(64), index=True)
    image_path = Column(String(255), nullable=False)
    crop_type = Column(String(100), nullable=True)
    disease_name = Column(String(200), nullable=True)
    confidence = Column(Float, nullable=True)
    status = Column(String(50), nullable=True)  # disease | pest | deficiency | healthy
    symptoms = Column(JSON, default=list)
    treatment = Column(Text, nullable=True)
    preventive_actions = Column(JSON, default=list)
    recovery_timeline = Column(String(100), nullable=True)
    full_result = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="diagnoses")


class SeedRecommendation(Base):
    __tablename__ = "seed_recommendations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    session_id = Column(String(64), index=True)
    state = Column(String(50))
    district = Column(String(50), nullable=True)
    season = Column(String(30))
    soil_type = Column(String(50))
    farm_size = Column(Float)
    water_availability = Column(String(50))
    budget = Column(String(50))
    preferred_crop = Column(String(100), nullable=True)
    result = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class DailyTip(Base):
    __tablename__ = "daily_tips"

    id = Column(Integer, primary_key=True, index=True)
    tip_text = Column(Text, nullable=False)
    tip_text_hi = Column(Text, nullable=True)
    category = Column(String(50), nullable=True)
    season = Column(String(30), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)


def create_tables():
    Base.metadata.create_all(bind=engine)
    _seed_daily_tips()


def _seed_daily_tips():
    db = SessionLocal()
    try:
        if db.query(DailyTip).count() == 0:
            tips = [
                DailyTip(
                    tip_text="Spray jeevamrut early in the morning for better absorption and soil health.",
                    tip_text_hi="Jeevamrut ka chhidkaav subah sawere karein taaki mitti mein acchi tarah samaye.",
                    category="jeevamrut",
                    season="all"
                ),
                DailyTip(
                    tip_text="Always check soil moisture before irrigation. Overwatering damages root health.",
                    tip_text_hi="Sinchai se pehle mitti ki nami jaanch lein. Zyada paani jad ko nuksan pahuncha sakta hai.",
                    category="irrigation",
                    season="all"
                ),
                DailyTip(
                    tip_text="Apply beejamrut to seeds before sowing to protect from soil-borne diseases.",
                    tip_text_hi="Bijaayi se pehle beejamrut lagaayein taaki mitti se hone wali bimaariyon se suraksha mile.",
                    category="beejamrut",
                    season="all"
                ),
                DailyTip(
                    tip_text="Intercropping with legumes helps fix nitrogen naturally in the soil.",
                    tip_text_hi="Dahanein fasal ke saath sahfasal naitrojan ko prakritik taur par mitti mein theek karta hai.",
                    category="intercropping",
                    season="kharif"
                ),
                DailyTip(
                    tip_text="Mulching with dry leaves conserves moisture and suppresses weed growth.",
                    tip_text_hi="Sukhi pattiyon se mulching nami bachata hai aur kharpatwar ko rokta hai.",
                    category="soil",
                    season="all"
                ),
            ]
            db.add_all(tips)
            db.commit()
    finally:
        db.close()
