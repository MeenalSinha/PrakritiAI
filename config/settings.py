"""
PrakritiAI – Configuration Management
"""
import os
from pathlib import Path
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # App
    APP_NAME: str = "PrakritiAI"
    APP_ENV: str = "development"
    SECRET_KEY: str = "prakriti-ai-default-secret-key-change-in-production-minimum-32-chars!!"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080  # 7 days

    # AI Keys
    OPENAI_API_KEY: str = ""
    ANTHROPIC_API_KEY: str = ""

    # Weather
    OPENWEATHER_API_KEY: str = ""

    # Database
    DATABASE_URL: str = "sqlite:///./prakriti.db"

    # Storage
    UPLOAD_DIR: str = "uploads"
    MAX_UPLOAD_SIZE_MB: int = 10

    # RAG
    FAISS_INDEX_PATH: str = "rag/embeddings/faiss_index"
    KNOWLEDGE_BASE_PATH: str = "rag/knowledge"

    # CORS – comma-separated list of allowed origins
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://localhost:5173,http://localhost:8000"

    # Rate limiting
    RATE_LIMIT_CHAT: str = "30/minute"
    RATE_LIMIT_DISEASE: str = "15/minute"
    RATE_LIMIT_DEFAULT: str = "60/minute"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"

    @property
    def allowed_origins_list(self) -> list[str]:
        return [o.strip() for o in self.ALLOWED_ORIGINS.split(",")]

    @property
    def is_production(self) -> bool:
        return self.APP_ENV.lower() in ("production", "prod")

    @property
    def ai_configured(self) -> bool:
        return bool(
            (self.ANTHROPIC_API_KEY and self.ANTHROPIC_API_KEY not in ("", "your-anthropic-api-key")) or
            (self.OPENAI_API_KEY and self.OPENAI_API_KEY not in ("", "your-openai-api-key"))
        )


settings = Settings()

# Ensure upload directory exists
Path(settings.UPLOAD_DIR).mkdir(parents=True, exist_ok=True)
