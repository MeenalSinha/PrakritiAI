"""
PrakritiAI – Market Intelligence Service
Provides mandi prices, trends, and market advice.
"""
import random
from datetime import datetime, timedelta

# Realistic base prices per quintal (INR) for major crops
BASE_PRICES = {
    "Wheat": {"price": 2125, "unit": "Quintal", "trend": "up"},
    "Mustard": {"price": 5450, "unit": "Quintal", "trend": "down"},
    "Cotton": {"price": 6320, "unit": "Quintal", "trend": "up"},
    "Moong": {"price": 7860, "unit": "Quintal", "trend": "up"},
    "Chana": {"price": 5200, "unit": "Quintal", "trend": "stable"},
    "Urad": {"price": 6800, "unit": "Quintal", "trend": "up"},
    "Paddy": {"price": 2183, "unit": "Quintal", "trend": "stable"},
    "Maize": {"price": 1950, "unit": "Quintal", "trend": "up"},
    "Soybean": {"price": 4200, "unit": "Quintal", "trend": "down"},
    "Groundnut": {"price": 5600, "unit": "Quintal", "trend": "up"},
    "Sunflower": {"price": 5800, "unit": "Quintal", "trend": "stable"},
    "Turmeric": {"price": 12000, "unit": "Quintal", "trend": "up"},
    "Onion": {"price": 1800, "unit": "Quintal", "trend": "down"},
    "Tomato": {"price": 2400, "unit": "Quintal", "trend": "up"},
    "Potato": {"price": 1200, "unit": "Quintal", "trend": "stable"},
    "Garlic": {"price": 9000, "unit": "Quintal", "trend": "up"},
}

STATE_MANDIS = {
    "Haryana": ["Hisar Mandi", "Karnal Mandi", "Rohtak Mandi"],
    "Punjab": ["Ludhiana Mandi", "Amritsar Mandi", "Patiala Mandi"],
    "Maharashtra": ["Nagpur Mandi", "Pune Mandi", "Nashik Mandi"],
    "Uttar Pradesh": ["Lucknow Mandi", "Agra Mandi", "Varanasi Mandi"],
    "Madhya Pradesh": ["Indore Mandi", "Bhopal Mandi", "Gwalior Mandi"],
    "Gujarat": ["Ahmedabad Mandi", "Surat Mandi", "Rajkot Mandi"],
    "Rajasthan": ["Jaipur Mandi", "Jodhpur Mandi", "Kota Mandi"],
    "Bihar": ["Patna Mandi", "Gaya Mandi", "Muzaffarpur Mandi"],
    "default": ["Local Mandi", "District Mandi", "State Mandi"]
}


def _price_with_variation(base: int) -> int:
    """Add small realistic variation to price."""
    variation = random.randint(-50, 50)
    return base + variation


def _change_percent(trend: str) -> float:
    """Generate realistic price change percentage."""
    if trend == "up":
        return round(random.uniform(0.3, 3.5), 1)
    elif trend == "down":
        return round(random.uniform(-3.5, -0.3), 1)
    else:
        return round(random.uniform(-0.5, 0.5), 1)


def get_market_prices(state: str = "Haryana", district: str = "Hisar") -> dict:
    """Get mandi prices for a region."""
    mandis = STATE_MANDIS.get(state, STATE_MANDIS["default"])
    mandi_name = f"{district} Mandi" if district else mandis[0]
    
    prices = []
    for crop, info in BASE_PRICES.items():
        change = _change_percent(info["trend"])
        current_price = _price_with_variation(info["price"])
        prices.append({
            "crop": crop,
            "price": current_price,
            "unit": info["unit"],
            "change_percent": change,
            "trend": info["trend"],
            "min_price": current_price - random.randint(50, 150),
            "max_price": current_price + random.randint(50, 200),
            "modal_price": current_price,
            "demand": random.choice(["High", "Medium", "High", "Low", "Medium"]),
        })
    
    # Sort by demand then price
    prices.sort(key=lambda x: (x["demand"] == "High", x["price"]), reverse=True)
    
    # Generate price history for chart (last 7 days)
    def price_history(base_price: int) -> list:
        history = []
        p = base_price - random.randint(100, 300)
        for i in range(7):
            p += random.randint(-80, 120)
            history.append({"day": (datetime.now() - timedelta(days=6 - i)).strftime("%d %b"), "price": max(p, base_price - 500)})
        return history
    
    trending = prices[:5]
    for item in trending:
        item["price_history"] = price_history(item["price"])
    
    return {
        "success": True,
        "mandi": mandi_name,
        "state": state,
        "district": district,
        "last_updated": datetime.now().strftime("%d %b %Y, %I:%M %p"),
        "prices": prices,
        "trending_crops": [p["crop"] for p in prices[:3]],
        "best_selling_advice": _best_selling_advice(prices),
        "nearby_mandis": mandis[:3],
        "source": "demo"
    }


def _best_selling_advice(prices: list) -> str:
    """Generate contextual market advice."""
    rising = [p["crop"] for p in prices if p["trend"] == "up"][:3]
    falling = [p["crop"] for p in prices if p["trend"] == "down"][:2]
    
    advice = []
    if rising:
        advice.append(f"{', '.join(rising)} ke daam badh rahe hain - abhi bechna achha rahega.")
    if falling:
        advice.append(f"{', '.join(falling)} ke daam gir rahe hain - thodi der intazaar karein.")
    
    return " ".join(advice) if advice else "Mandis mein daam stable hain. Local mandi check karein."


def get_crop_price_detail(crop: str) -> dict:
    """Get detailed price info for a specific crop."""
    info = BASE_PRICES.get(crop, {"price": 3000, "unit": "Quintal", "trend": "stable"})
    current = _price_with_variation(info["price"])
    
    history = []
    p = current - 200
    for i in range(30):
        p += random.randint(-60, 80)
        history.append({
            "date": (datetime.now() - timedelta(days=29 - i)).strftime("%d %b"),
            "price": max(p, current - 500)
        })
    
    return {
        "crop": crop,
        "current_price": current,
        "unit": info["unit"],
        "trend": info["trend"],
        "price_history_30d": history,
        "best_time_to_sell": "Agle 2-3 hafton mein" if info["trend"] == "up" else "Abhi bechein",
        "demand_forecast": "High" if info["trend"] == "up" else "Medium",
    }
