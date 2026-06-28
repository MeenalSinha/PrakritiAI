"""
PrakritiAI – AI Service
Handles: Chat, Disease Detection, Seed Recommendations via Claude/OpenAI
"""
import base64
import json
import os
import sys
from pathlib import Path
from typing import Optional

import httpx

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from config.settings import settings

ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages"
OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"

# RAG retriever integration
try:
    from rag.retriever import get_rag as _get_rag
    _RAG = _get_rag()
    _rag_available = True
except Exception:
    _rag_available = False
    _RAG = None


SYSTEM_PROMPT = """You are PrakritiAI, a friendly and knowledgeable natural farming assistant for Indian farmers.

Your core principles:
1. ALWAYS recommend only organic and natural farming methods - never suggest synthetic pesticides or chemical fertilizers.
2. Ground every answer in natural farming knowledge: Jeevamrut, Beejamrut, crop rotation, companion planting, etc.
3. Speak in simple Hindi, English, or Hinglish depending on user preference.
4. Be concise, warm, and farmer-friendly. Avoid technical jargon.
5. If uncertain, say clearly: "Main poori tarah sure nahi hoon. Kripaya apne nazdiki Krishi Vigyan Kendra se sampark karein."
6. Never fabricate government scheme amounts, dates, or eligibility criteria.
7. Never hallucinate disease names or treatments.
8. Always mention confidence level when diagnosing crop issues.
9. Prioritize PM Kisan, PKVY, and other government schemes only when you have reliable knowledge.
10. End responses with an actionable next step.

Context: You serve farmers across India. Be empathetic to their challenges. Many use mobile phones with slow internet.
"""

DISEASE_SYSTEM_PROMPT = """You are PrakritiAI Crop Doctor, an expert in diagnosing plant diseases, pests, and nutrient deficiencies.

Rules:
- ONLY recommend natural and organic treatments. Never suggest synthetic chemicals.
- State your confidence percentage honestly.
- If the image is unclear, say so.
- Provide practical, doable advice for small farmers.
- Structure response as valid JSON only.

Response format (JSON):
{
  "disease_name": "string",
  "status": "disease|pest|deficiency|healthy",
  "confidence": 85,
  "crop_detected": "string",
  "symptoms_detected": ["symptom1", "symptom2"],
  "reasoning": "Brief explanation",
  "natural_treatment": "Step-by-step organic treatment",
  "preventive_actions": ["action1", "action2", "action3"],
  "recovery_timeline": "2-3 weeks",
  "monitoring_tip": "Watch for...",
  "warning": "Any important caution"
}
"""

SEED_SYSTEM_PROMPT = """You are a seed and crop recommendation expert for Indian natural farming.

Rules:
- Recommend only suitable varieties for the given state, season, soil, and water conditions.
- Focus on traditional and open-pollinated varieties when possible.
- Include organic farming practices.
- Structure response as valid JSON only.

Response format (JSON):
{
  "recommended_crops": [
    {
      "crop": "string",
      "variety": "string",
      "suitability_score": 90,
      "expected_yield_per_acre": "string",
      "water_requirement": "Low|Medium|High",
      "investment_per_acre": "string",
      "difficulty": "Easy|Medium|Hard",
      "notes": "string"
    }
  ],
  "intercropping_suggestions": ["suggestion1", "suggestion2"],
  "crop_rotation_advice": "string",
  "organic_practices": ["practice1", "practice2"],
  "seed_quantity_per_acre": "string",
  "best_sowing_time": "string",
  "soil_preparation": "string"
}
"""


async def _call_anthropic(messages: list, system: str = SYSTEM_PROMPT, max_tokens: int = 1024) -> str:
    """Call Anthropic Claude API."""
    if not settings.ANTHROPIC_API_KEY:
        return _fallback_response(messages[-1].get("content", ""))
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        resp = await client.post(
            ANTHROPIC_API_URL,
            headers={
                "x-api-key": settings.ANTHROPIC_API_KEY,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json"
            },
            json={
                "model": "claude-sonnet-4-6",
                "max_tokens": max_tokens,
                "system": system,
                "messages": messages
            }
        )
        resp.raise_for_status()
        return resp.json()["content"][0]["text"]


async def _call_anthropic_stream(messages: list, system: str = SYSTEM_PROMPT, max_tokens: int = 1024):
    if not settings.ANTHROPIC_API_KEY:
        fallback = _fallback_response(messages[-1].get("content", ""))
        for chunk in fallback.split(" "):
            yield chunk + " "
        return

    async with httpx.AsyncClient(timeout=30.0) as client:
        async with client.stream(
            "POST",
            ANTHROPIC_API_URL,
            headers={
                "x-api-key": settings.ANTHROPIC_API_KEY,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json"
            },
            json={
                "model": "claude-sonnet-4-6",
                "max_tokens": max_tokens,
                "system": system,
                "messages": messages,
                "stream": True
            }
        ) as response:
            response.raise_for_status()
            async for line in response.aiter_lines():
                if line.startswith("data: "):
                    data = line[6:]
                    if data == "[DONE]":
                        break
                    try:
                        parsed = json.loads(data)
                        if parsed.get("type") == "content_block_delta":
                            yield parsed["delta"]["text"]
                    except json.JSONDecodeError:
                        continue


async def _call_openai(messages: list, system: str = SYSTEM_PROMPT, max_tokens: int = 1024) -> str:
    """Call OpenAI API as fallback."""
    if not settings.OPENAI_API_KEY:
        return _fallback_response(messages[-1].get("content", ""))
    
    full_messages = [{"role": "system", "content": system}] + messages
    async with httpx.AsyncClient(timeout=30.0) as client:
        resp = await client.post(
            OPENAI_API_URL,
            headers={
                "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "gpt-4o",
                "max_tokens": max_tokens,
                "messages": full_messages
            }
        )
        resp.raise_for_status()
        return resp.json()["choices"][0]["message"]["content"]


async def _call_openai_stream(messages: list, system: str = SYSTEM_PROMPT, max_tokens: int = 1024):
    if not settings.OPENAI_API_KEY:
        fallback = _fallback_response(messages[-1].get("content", ""))
        for chunk in fallback.split(" "):
            yield chunk + " "
        return

    full_messages = [{"role": "system", "content": system}] + messages
    async with httpx.AsyncClient(timeout=30.0) as client:
        async with client.stream(
            "POST",
            OPENAI_API_URL,
            headers={
                "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "gpt-4o",
                "max_tokens": max_tokens,
                "messages": full_messages,
                "stream": True
            }
        ) as response:
            response.raise_for_status()
            async for line in response.aiter_lines():
                if line.startswith("data: "):
                    data = line[6:]
                    if data == "[DONE]":
                        break
                    try:
                        parsed = json.loads(data)
                        delta = parsed["choices"][0]["delta"]
                        if "content" in delta:
                            yield delta["content"]
                    except (json.JSONDecodeError, KeyError, IndexError):
                        continue


def _fallback_response(query: str) -> str:
    """Demo fallback when no API key is configured."""
    query_lower = query.lower()
    if "jeevamrut" in query_lower:
        return ("Jeevamrut ek shaktivardhak jevik khad hai jo mitti ke jeevaanu ko badhata hai.\n\n"
                "Banane ki vidhi:\n"
                "- 200 litre paani\n"
                "- 10 kg desi gaay ka gobar\n"
                "- 10 litre gomutr\n"
                "- 2 kg gud\n"
                "- 2 kg kisi bhi dal ka aata\n"
                "- Ek mutthi zameen ki maati\n\n"
                "Sabhi cheezon ko milaayein aur 48 ghante ke liye rakh dein. Din mein do baar hilaayein. "
                "Taiyaar Jeevamrut ko paani ke saath 1:10 anupat mein milakar chhidkaav karein.\n\n"
                "Sabse achha fal: Subah sawere chhidkaav karein.")
    elif "beejamrut" in query_lower:
        return ("Beejamrut bijaiyon ko mitti se hone wali bimaariyon se bachata hai.\n\n"
                "Banane ki vidhi:\n"
                "- 20 litre paani\n"
                "- 5 kg desi gaay ka taza gobar\n"
                "- 5 litre gomutr\n"
                "- 50 gram nimbu ka ras\n"
                "- Ek mutthi kali zameen ki maati\n\n"
                "Sabhi milaayein aur 48 ghante baad chaan lein. Bijaiyon ko bowane se pehle 30 minute tak isme bigo dein. "
                "Chhaya mein sukha kar turant boing karein.")
    elif "tomato" in query_lower or "tamatar" in query_lower:
        return ("Tamatar ki patti peeli hone ke kaarana:\n\n"
                "1. Naitrojan ki kami - Jeevamrut ka chhidkaav karein\n"
                "2. Pani ki kami - Niyamit sinchai karein\n"
                "3. Fungal infection - Neem oil + pani ka chhidkaav (2ml/litre)\n"
                "4. Mitti ki pH thik nahi - pH test karwaayein\n\n"
                "Turant karen: Neem oil (2ml) + Jeevamrut (100ml) ko 1 litre paani mein milakar chhidkaav karein. "
                "Ek hafte mein asar dikhega.")
    elif "pm kisan" in query_lower or "pm-kisan" in query_lower:
        return ("PM-KISAN Yojana:\n\n"
                "Labh: Rs. 6,000 per saal (3 kisht mein - Rs. 2,000 har 4 mahine)\n\n"
                "Patrata:\n"
                "- Sab chhote aur seemant kisaan\n"
                "- 2 hectare tak zameen\n\n"
                "Aawaasyparak dastaavez:\n"
                "- Aadhar Card\n"
                "- Bank Passbook\n"
                "- Zameen ke kagzaat\n\n"
                "Panjikaran: pmkisan.gov.in par ya nazdiki Common Service Centre par jaayein.\n\n"
                "Note: Exact jankari ke liye apne block agriculture office se sampark karein.")
    else:
        return ("Namaste! Main PrakritiAI hoon, aapka prakritik kheti sahayak.\n\n"
                "Main aapki madad kar sakta hoon:\n"
                "- Fasal rogon ki pehchaan\n"
                "- Jeevamrut aur Beejamrut banane ka tarika\n"
                "- Sarkari yojanayen jaise PM-KISAN, PKVY\n"
                "- Mausam ke anusar kheti ki salaah\n"
                "- Beej aur fasal chunne mein\n\n"
                "Kripaya apna sawaal poochhein.")


async def chat_with_ai(
    messages: list,
    language: str = "hi",
    context: str = ""
) -> dict:
    """Main chat function supporting conversation history."""
    system = SYSTEM_PROMPT
    if language == "hi":
        system += "\n\nHindi mein jawaab dein jab tak user English mein na poochhe."
    elif language == "en":
        system += "\n\nRespond in English."
    
    if context:
        system += f"\n\nFarmer Context: {context}"

    # RAG: retrieve relevant knowledge for the query
    rag_sources = []
    if _rag_available and _RAG and messages:
        last_msg = messages[-1].get("content", "")
        if isinstance(last_msg, list):
            last_msg = " ".join([p.get("text","") for p in last_msg if isinstance(p, dict)])
        rag_context = _RAG.format_context(last_msg)
        rag_results = _RAG.retrieve(last_msg, top_k=3)
        rag_sources = [r.get("source","") for r in rag_results if r.get("score",0) > 0]
        if rag_context:
            system += f"\n\n{rag_context}"

    try:
        if settings.ANTHROPIC_API_KEY and settings.ANTHROPIC_API_KEY not in ("", "your-anthropic-api-key"):
            response_text = await _call_anthropic(messages, system)
        elif settings.OPENAI_API_KEY and settings.OPENAI_API_KEY not in ("", "your-openai-api-key"):
            response_text = await _call_openai(messages, system)
        else:
            last_msg = messages[-1].get("content", "")
            if isinstance(last_msg, list):
                last_msg = " ".join([p.get("text", "") for p in last_msg if isinstance(p, dict)])
            response_text = _fallback_response(last_msg)
        
        return {"success": True, "response": response_text, "sources": rag_sources}
    except Exception as e:
        return {
            "success": False,
            "response": f"Maafi chahta hoon, abhi kuch problem aa rahi hai. Kripaya thodi der baad dobara try karein. Error: {str(e)[:100]}",
            "sources": []
        }

async def chat_with_ai_stream(
    messages: list,
    language: str = "hi",
    context: str = ""
):
    system = SYSTEM_PROMPT
    if language == "hi":
        system += "\n\nHindi mein jawaab dein jab tak user English mein na poochhe."
    elif language == "en":
        system += "\n\nRespond in English."
    
    if context:
        system += f"\n\nFarmer Context: {context}"

    rag_sources = []
    if _rag_available and _RAG and messages:
        last_msg = messages[-1].get("content", "")
        if isinstance(last_msg, list):
            last_msg = " ".join([p.get("text","") for p in last_msg if isinstance(p, dict)])
        rag_context = _RAG.format_context(last_msg)
        rag_results = _RAG.retrieve(last_msg, top_k=3)
        rag_sources = [r.get("source","") for r in rag_results if r.get("score",0) > 0]
        if rag_context:
            system += f"\n\n{rag_context}"

    # Yield sources first as a special event
    yield f"data: {json.dumps({'type': 'sources', 'data': rag_sources})}\n\n"

    try:
        if settings.ANTHROPIC_API_KEY and settings.ANTHROPIC_API_KEY not in ("", "your-anthropic-api-key"):
            async for chunk in _call_anthropic_stream(messages, system):
                yield f"data: {json.dumps({'type': 'content', 'data': chunk})}\n\n"
        elif settings.OPENAI_API_KEY and settings.OPENAI_API_KEY not in ("", "your-openai-api-key"):
            async for chunk in _call_openai_stream(messages, system):
                yield f"data: {json.dumps({'type': 'content', 'data': chunk})}\n\n"
        else:
            last_msg = messages[-1].get("content", "")
            if isinstance(last_msg, list):
                last_msg = " ".join([p.get("text", "") for p in last_msg if isinstance(p, dict)])
            fallback = _fallback_response(last_msg)
            for chunk in fallback.split(" "):
                yield f"data: {json.dumps({'type': 'content', 'data': chunk + ' '})}\n\n"
        
        yield "data: [DONE]\n\n"
    except Exception as e:
        yield f"data: {json.dumps({'type': 'error', 'data': str(e)})}\n\n"


async def diagnose_crop_disease(image_bytes: bytes, image_mime: str = "image/jpeg") -> dict:
    """Analyze crop image for disease, pest, or deficiency."""
    image_b64 = base64.standard_b64encode(image_bytes).decode("utf-8")
    
    try:
        if settings.ANTHROPIC_API_KEY and settings.ANTHROPIC_API_KEY not in ("", "your-anthropic-api-key"):
            messages = [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": image_mime,
                                "data": image_b64
                            }
                        },
                        {
                            "type": "text",
                            "text": "Analyze this crop image. Identify any disease, pest, or nutrient deficiency. Return ONLY valid JSON as specified."
                        }
                    ]
                }
            ]
            raw = await _call_anthropic(messages, DISEASE_SYSTEM_PROMPT, 800)
        elif settings.OPENAI_API_KEY and settings.OPENAI_API_KEY not in ("", "your-openai-api-key"):
            messages = [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image_url",
                            "image_url": {"url": f"data:{image_mime};base64,{image_b64}"}
                        },
                        {"type": "text", "text": "Analyze this crop image. Return ONLY valid JSON."}
                    ]
                }
            ]
            raw = await _call_openai(messages, DISEASE_SYSTEM_PROMPT, 800)
        else:
            # Demo fallback
            return {
                "success": True,
                "result": {
                    "disease_name": "Early Blight (Alternaria solani)",
                    "status": "disease",
                    "confidence": 87,
                    "crop_detected": "Tomato",
                    "symptoms_detected": [
                        "Dark brown concentric ring spots on lower leaves",
                        "Yellow halo around spots",
                        "Premature leaf drop"
                    ],
                    "reasoning": "The image shows characteristic early blight symptoms with target-board-like concentric rings, typically caused by Alternaria solani fungus in warm, humid conditions.",
                    "natural_treatment": (
                        "1. Remove and destroy all infected leaves immediately.\n"
                        "2. Spray Neem oil solution: 5ml neem oil + 1ml liquid soap per litre of water. Apply every 7 days.\n"
                        "3. Prepare Dashparni Ark and spray diluted 1:10 weekly.\n"
                        "4. Apply Trichoderma-enriched Jeevamrut at soil level.\n"
                        "5. Avoid overhead irrigation; use drip if possible."
                    ),
                    "preventive_actions": [
                        "Maintain proper plant spacing for air circulation",
                        "Rotate crops every season - avoid planting Solanaceae crops in same field",
                        "Apply Beejamrut before sowing next season",
                        "Mulch around base to reduce soil splash"
                    ],
                    "recovery_timeline": "2-3 weeks with consistent treatment",
                    "monitoring_tip": "Check plants every 3 days. If spots spread despite treatment, consult KVK.",
                    "warning": "This is a demo analysis. For accurate diagnosis, please configure an AI API key."
                }
            }
        
        # Parse JSON from response
        clean = raw.strip()
        if "```json" in clean:
            clean = clean.split("```json")[1].split("```")[0].strip()
        elif "```" in clean:
            clean = clean.split("```")[1].split("```")[0].strip()
        
        result = json.loads(clean)
        return {"success": True, "result": result}
    
    except json.JSONDecodeError:
        return {
            "success": True,
            "result": {
                "disease_name": "Analysis complete",
                "status": "disease",
                "confidence": 75,
                "crop_detected": "Unknown",
                "symptoms_detected": ["Image analyzed"],
                "reasoning": raw if 'raw' in dir() else "Image processed",
                "natural_treatment": "Consult your nearest KVK for detailed treatment.",
                "preventive_actions": ["Maintain field hygiene", "Use organic sprays"],
                "recovery_timeline": "Consult local agriculture expert",
                "monitoring_tip": "Monitor regularly",
                "warning": None
            }
        }
    except Exception as e:
        return {"success": False, "error": str(e)}


async def get_seed_recommendations(params: dict) -> dict:
    """Get crop and seed recommendations based on farm parameters."""
    prompt = (
        f"Provide seed and crop recommendations for:\n"
        f"State: {params.get('state', 'Maharashtra')}\n"
        f"District: {params.get('district', '')}\n"
        f"Season: {params.get('season', 'Kharif')}\n"
        f"Soil Type: {params.get('soil_type', 'Black Cotton')}\n"
        f"Farm Size: {params.get('farm_size', '2')} acres\n"
        f"Water Availability: {params.get('water_availability', 'Medium')}\n"
        f"Budget: Rs. {params.get('budget', '10000')} per acre\n"
        f"Preferred Crop: {params.get('preferred_crop', 'Any')}\n\n"
        "Return ONLY valid JSON as specified."
    )
    
    try:
        messages = [{"role": "user", "content": prompt}]
        if settings.ANTHROPIC_API_KEY and settings.ANTHROPIC_API_KEY != "your-anthropic-api-key":
            raw = await _call_anthropic(messages, SEED_SYSTEM_PROMPT, 1024)
        elif settings.OPENAI_API_KEY and settings.OPENAI_API_KEY != "your-openai-api-key":
            raw = await _call_openai(messages, SEED_SYSTEM_PROMPT, 1024)
        else:
            # Demo fallback
            return {
                "success": True,
                "result": {
                    "recommended_crops": [
                        {
                            "crop": "Soybean",
                            "variety": "JS 335 (Traditional)",
                            "suitability_score": 95,
                            "expected_yield_per_acre": "8-10 quintals",
                            "water_requirement": "Medium",
                            "investment_per_acre": "Rs. 4,000 - 5,000",
                            "difficulty": "Easy",
                            "notes": "Excellent nitrogen fixer. Ideal for black cotton soil."
                        },
                        {
                            "crop": "Cotton",
                            "variety": "Desi Cotton (Khandwa-2)",
                            "suitability_score": 88,
                            "expected_yield_per_acre": "5-7 quintals",
                            "water_requirement": "Medium",
                            "investment_per_acre": "Rs. 6,000 - 8,000",
                            "difficulty": "Medium",
                            "notes": "Traditional variety resistant to bollworm. Better suited for natural farming."
                        },
                        {
                            "crop": "Tur Dal (Pigeon Pea)",
                            "variety": "ICPL 87119 (Asha)",
                            "suitability_score": 82,
                            "expected_yield_per_acre": "6-8 quintals",
                            "water_requirement": "Low",
                            "investment_per_acre": "Rs. 3,000 - 4,000",
                            "difficulty": "Easy",
                            "notes": "Drought tolerant. Good for intercropping with cotton."
                        }
                    ],
                    "intercropping_suggestions": [
                        "Soybean + Tur Dal (6:2 row ratio) - maximizes land use",
                        "Cotton + Cowpea (as border crop) - natural pest repellent",
                        "Soybean + Jowar - improves biodiversity"
                    ],
                    "crop_rotation_advice": "Follow Soybean → Wheat → Cotton rotation. This breaks pest cycles and improves soil nitrogen naturally.",
                    "organic_practices": [
                        "Apply Jeevamrut at 200 litres per acre before sowing",
                        "Use Beejamrut for seed treatment - 48 hours before sowing",
                        "Apply Dashaparni Ark for pest control every 15 days",
                        "Mulch with crop residue after harvesting"
                    ],
                    "seed_quantity_per_acre": "Soybean: 30-35 kg | Cotton: 1.5-2 kg | Tur Dal: 4-5 kg",
                    "best_sowing_time": "June 15 - July 15 (after first good rain of 75mm+)",
                    "soil_preparation": "Deep plough once, then cultivate 2-3 times. Apply 2 tonnes FYM per acre. No chemical fertilizers needed."
                }
            }
        
        clean = raw.strip()
        if "```json" in clean:
            clean = clean.split("```json")[1].split("```")[0].strip()
        elif "```" in clean:
            clean = clean.split("```")[1].split("```")[0].strip()
        
        result = json.loads(clean)
        return {"success": True, "result": result}
    
    except Exception as e:
        return {"success": False, "error": str(e)}
