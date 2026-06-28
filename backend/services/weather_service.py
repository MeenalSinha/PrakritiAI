"""
PrakritiAI – Weather Service (OpenWeatherMap + smart farming advice)
"""
import sys, os
from datetime import datetime
import httpx

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from config.settings import settings

OWM_BASE = "https://api.openweathermap.org/data/2.5"


def _farming_advice(weather_data: dict) -> str:
    """Generate contextual farming advice based on weather."""
    try:
        desc = weather_data.get("weather", [{}])[0].get("description", "").lower()
        temp = weather_data.get("main", {}).get("temp", 25)
        humidity = weather_data.get("main", {}).get("humidity", 50)
        rain = weather_data.get("rain", {}).get("1h", 0)
        wind = weather_data.get("wind", {}).get("speed", 0)

        advice = []

        if rain > 5:
            advice.append("Baarish ho rahi hai. Aaj koi chhidkaav na karein - organic sprays beh jaayenge.")
        elif rain > 0:
            advice.append("Halki baarish ho rahi hai. Jeevamrut chhidkaav shaam ko karein.")
        
        if temp > 38:
            advice.append("Zyada garmi hai. Sinchai subah sawere ya shaam ko karein. Mulching karein.")
        elif temp < 10:
            advice.append("Sardi hai. Poudhe ko jhaar se bachaayein. Khelon par dhyan dein.")
        
        if humidity > 80:
            advice.append("Zyada nami se fungal infection ka khatraa hai. Neem oil spray karein.")
        elif humidity < 30:
            advice.append("Hawa sukhi hai. Drip irrigation use karein ya mulching karein.")
        
        if wind > 10:
            advice.append("Tez hawa chal rahi hai. Aaj chhidkaav na karein.")
        
        if not advice:
            advice.append("Mausam kheti ke liye theek hai. Niyamit kaam jaari rakhein.")
        
        return " | ".join(advice)
    except Exception:
        return "Mausam ki jankari ke liye local weather check karein."


def _demo_weather(city: str = "Delhi") -> dict:
    """Return realistic demo weather data."""
    return {
        "success": True,
        "city": city,
        "country": "IN",
        "temperature": 32,
        "feels_like": 35,
        "humidity": 48,
        "description": "Partly Cloudy",
        "icon": "02d",
        "wind_speed": 12,
        "wind_direction": 180,
        "pressure": 1010,
        "visibility": 8000,
        "uv_index": 6,
        "rain_chance": 10,
        "farming_advice": "Mausam kheti ke liye acha hai. Jeevamrut ka chhidkaav subah karein.",
        "forecast": [
            {"day": "Mon", "high": 33, "low": 24, "icon": "02d", "description": "Partly Cloudy"},
            {"day": "Tue", "high": 32, "low": 23, "icon": "02d", "description": "Partly Cloudy"},
            {"day": "Wed", "high": 31, "low": 22, "icon": "10d", "description": "Light Rain"},
            {"day": "Thu", "high": 30, "low": 22, "icon": "10d", "description": "Rain"},
            {"day": "Fri", "high": 31, "low": 23, "icon": "01d", "description": "Sunny"},
        ],
        "source": "demo"
    }


async def get_weather(city: str = "Delhi", lat: float = None, lon: float = None) -> dict:
    """Fetch weather data from OpenWeatherMap."""
    if not settings.OPENWEATHER_API_KEY:
        return _demo_weather(city)
    
    try:
        params = {
            "appid": settings.OPENWEATHER_API_KEY,
            "units": "metric"
        }
        if lat and lon:
            params.update({"lat": lat, "lon": lon})
        else:
            params["q"] = f"{city},IN"
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            # Current weather
            resp = await client.get(f"{OWM_BASE}/weather", params=params)
            resp.raise_for_status()
            data = resp.json()
            
            # Forecast
            forecast_resp = await client.get(f"{OWM_BASE}/forecast", params={**params, "cnt": 40})
            forecast_resp.raise_for_status()
            forecast_data = forecast_resp.json()
        
        # Process forecast - get one reading per day
        forecast = []
        seen_days = set()
        for item in forecast_data.get("list", []):
            dt = datetime.fromtimestamp(item["dt"])
            day_name = dt.strftime("%a")
            if day_name not in seen_days and len(forecast) < 5:
                seen_days.add(day_name)
                forecast.append({
                    "day": day_name,
                    "high": round(item["main"]["temp_max"]),
                    "low": round(item["main"]["temp_min"]),
                    "icon": item["weather"][0]["icon"],
                    "description": item["weather"][0]["description"].title()
                })
        
        return {
            "success": True,
            "city": data.get("name", city),
            "country": data.get("sys", {}).get("country", "IN"),
            "temperature": round(data["main"]["temp"]),
            "feels_like": round(data["main"]["feels_like"]),
            "humidity": data["main"]["humidity"],
            "description": data["weather"][0]["description"].title(),
            "icon": data["weather"][0]["icon"],
            "wind_speed": round(data["wind"]["speed"] * 3.6),  # m/s to km/h
            "wind_direction": data["wind"].get("deg", 0),
            "pressure": data["main"]["pressure"],
            "visibility": data.get("visibility", 10000),
            "uv_index": 0,
            "rain_chance": round(forecast_data["list"][0].get("pop", 0) * 100) if forecast_data.get("list") else 0,
            "farming_advice": _farming_advice(data),
            "forecast": forecast,
            "source": "openweathermap"
        }
    
    except Exception as e:
        demo = _demo_weather(city)
        demo["note"] = "Live data unavailable. Showing sample data."
        return demo
