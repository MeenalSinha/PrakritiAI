from .auth import router as auth_router
from .chat import router as chat_router
from .features import (
    disease_router, seed_router, weather_router,
    market_router, schemes_router, learning_router,
    tips_router, dashboard_router, kvk_router, rag_router
)

__all__ = [
    "auth_router", "chat_router", "disease_router", "seed_router",
    "weather_router", "market_router", "schemes_router", "learning_router",
    "tips_router", "dashboard_router", "kvk_router", "rag_router"
]
