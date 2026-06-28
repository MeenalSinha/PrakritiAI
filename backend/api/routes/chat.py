"""
PrakritiAI – Chat & Voice Routes
"""
import uuid
import os
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Request, UploadFile, File
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from slowapi import Limiter
from slowapi.util import get_remote_address
from loguru import logger

import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))))

from backend.database import get_db, Conversation, Message, User
from backend.core.auth import get_current_user
from backend.services.ai_service import chat_with_ai
from config.settings import settings

limiter = Limiter(key_func=get_remote_address)

router = APIRouter(prefix="/chat", tags=["chat"])


class MessageRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    session_id: Optional[str] = Field(None, max_length=100)
    language: str = Field(default="hi", pattern="^(hi|en|mr|gu|pa|te|kn|bn)$")
    is_voice: bool = False


class ConversationCreate(BaseModel):
    title: Optional[str] = None
    language: str = "hi"


from fastapi.responses import StreamingResponse
import json
from backend.services.ai_service import chat_with_ai_stream

@router.post("/message")
@limiter.limit(settings.RATE_LIMIT_CHAT)
async def send_message(
    request: Request,
    req: MessageRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    """Send a message and get AI response with rate limiting (30/minute)."""
    # Get or create conversation
    session_id = req.session_id or uuid.uuid4().hex
    
    conv = db.query(Conversation).filter(Conversation.session_id == session_id).first()
    if not conv:
        conv = Conversation(
            user_id=current_user.id if current_user else None,
            session_id=session_id,
            title=req.message[:50] + "..." if len(req.message) > 50 else req.message,
            language=req.language,
            is_voice=req.is_voice
        )
        db.add(conv)
        db.flush()
    
    # Get conversation history for context
    history = db.query(Message).filter(
        Message.conversation_id == conv.id
    ).order_by(Message.created_at).limit(10).all()
    
    # Build messages for AI
    ai_messages = []
    for msg in history[-8:]:  # Last 8 messages for context
        ai_messages.append({"role": msg.role, "content": msg.content})
    ai_messages.append({"role": "user", "content": req.message})
    
    # Add farm context if user is logged in
    context = ""
    if current_user and current_user.state:
        context = f"Farmer is from {current_user.state}, {current_user.district or ''}. Language preference: {req.language}."
    
    # Save user message first
    user_msg = Message(
        conversation_id=conv.id,
        role="user",
        content=req.message,
        intent="chat"
    )
    db.add(user_msg)
    db.commit()
    
    async def event_generator():
        full_response = ""
        sources = []
        
        async for chunk in chat_with_ai_stream(ai_messages, language=req.language, context=context):
            yield chunk
            if chunk.startswith("data: "):
                try:
                    payload_str = chunk[6:].strip()
                    if payload_str == "[DONE]":
                        continue
                    payload = json.loads(payload_str)
                    if payload.get("type") == "content":
                        full_response += payload["data"]
                    elif payload.get("type") == "sources":
                        sources = payload["data"]
                except Exception:
                    pass

        # Save assistant response after streaming completes
        if full_response:
            assistant_msg = Message(
                conversation_id=conv.id,
                role="assistant",
                content=full_response,
                intent="chat",
                sources=sources
            )
            db.add(assistant_msg)
            db.commit()

    return StreamingResponse(event_generator(), media_type="text/event-stream")


@router.get("/history/{session_id}")
async def get_history(session_id: str, db: Session = Depends(get_db)):
    """Get conversation history."""
    conv = db.query(Conversation).filter(Conversation.session_id == session_id).first()
    if not conv:
        return {"messages": [], "session_id": session_id}
    
    messages = db.query(Message).filter(
        Message.conversation_id == conv.id
    ).order_by(Message.created_at).all()
    
    return {
        "session_id": session_id,
        "title": conv.title,
        "language": conv.language,
        "messages": [
            {
                "id": m.id,
                "role": m.role,
                "content": m.content,
                "created_at": m.created_at.isoformat(),
                "sources": m.sources or []
            }
            for m in messages
        ]
    }


@router.get("/conversations")
async def get_conversations(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    """Get all conversations for user."""
    if not current_user:
        return {"conversations": []}
    
    convs = db.query(Conversation).filter(
        Conversation.user_id == current_user.id
    ).order_by(Conversation.updated_at.desc()).limit(20).all()
    
    return {
        "conversations": [
            {
                "id": c.id,
                "session_id": c.session_id,
                "title": c.title,
                "language": c.language,
                "is_voice": c.is_voice,
                "is_favorite": c.is_favorite,
                "created_at": c.created_at.isoformat(),
                "updated_at": c.updated_at.isoformat()
            }
            for c in convs
        ]
    }


@router.post("/conversations/{session_id}/favorite")
async def toggle_favorite(
    session_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    """Toggle conversation favorite status."""
    conv = db.query(Conversation).filter(Conversation.session_id == session_id).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    conv.is_favorite = not conv.is_favorite
    db.commit()
    return {"is_favorite": conv.is_favorite}


@router.delete("/conversations/{session_id}")
async def delete_conversation(
    session_id: str,
    db: Session = Depends(get_db)
):
    """Delete a conversation."""
    conv = db.query(Conversation).filter(Conversation.session_id == session_id).first()
    if conv:
        db.delete(conv)
        db.commit()
    return {"success": True}
