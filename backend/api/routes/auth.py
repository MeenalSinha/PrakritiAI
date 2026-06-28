"""
PrakritiAI – Auth Routes
"""
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Response
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
import uuid

import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))))

from backend.database import get_db, User, FarmProfile
from backend.core.auth import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["authentication"])


class RegisterRequest(BaseModel):
    name: str
    phone: str
    password: str
    state: str = None
    district: str = None
    preferred_language: str = "hi"


class LoginRequest(BaseModel):
    phone: str
    password: str


class GuestRequest(BaseModel):
    name: str = "Guest Farmer"
    state: str = "Haryana"
    preferred_language: str = "hi"


def _set_auth_cookie(response: Response, token: str):
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        max_age=7 * 24 * 60 * 60,  # 7 days
        samesite="lax",
        secure=False  # Set to True in production with HTTPS
    )

@router.post("/register")
async def register(req: RegisterRequest, response: Response, db: Session = Depends(get_db)):
    if db.query(User).filter(User.phone == req.phone).first():
        raise HTTPException(status_code=400, detail="Phone number already registered")
    
    user = User(
        name=req.name,
        phone=req.phone,
        hashed_password=hash_password(req.password),
        state=req.state,
        district=req.district,
        preferred_language=req.preferred_language
    )
    db.add(user)
    db.flush()
    
    farm = FarmProfile(user_id=user.id, active_crops=[], tasks_today=[])
    db.add(farm)
    db.commit()
    db.refresh(user)
    
    token = create_access_token({"sub": str(user.id)}, timedelta(days=7))
    _set_auth_cookie(response, token)
    
    return {
        "user": {
            "id": user.id,
            "name": user.name,
            "phone": user.phone,
            "state": user.state,
            "district": user.district,
            "preferred_language": user.preferred_language
        }
    }


@router.post("/login")
async def login(req: LoginRequest, response: Response, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.phone == req.phone).first()
    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid phone or password")
    
    token = create_access_token({"sub": str(user.id)}, timedelta(days=7))
    _set_auth_cookie(response, token)
    
    return {
        "user": {
            "id": user.id,
            "name": user.name,
            "phone": user.phone,
            "state": user.state,
            "district": user.district,
            "preferred_language": user.preferred_language
        }
    }


@router.post("/guest")
async def guest_login(req: GuestRequest, response: Response, db: Session = Depends(get_db)):
    guest_phone = f"guest_{uuid.uuid4().hex[:10]}"
    user = User(
        name=req.name,
        phone=guest_phone,
        hashed_password=hash_password("guest123"),
        state=req.state,
        preferred_language=req.preferred_language
    )
    db.add(user)
    db.flush()
    
    farm = FarmProfile(user_id=user.id, active_crops=[], tasks_today=[])
    db.add(farm)
    db.commit()
    db.refresh(user)
    
    token = create_access_token({"sub": str(user.id)}, timedelta(hours=24))
    
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        max_age=24 * 60 * 60,
        samesite="lax",
        secure=False
    )
    
    return {
        "is_guest": True,
        "user": {
            "id": user.id,
            "name": user.name,
            "state": user.state,
            "preferred_language": user.preferred_language
        }
    }


@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie("access_token")
    return {"message": "Logged out successfully"}


@router.get("/me")
async def get_me(current_user: User = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return {
        "id": current_user.id,
        "name": current_user.name,
        "phone": current_user.phone,
        "state": current_user.state,
        "district": current_user.district,
        "preferred_language": current_user.preferred_language,
        "created_at": current_user.created_at.isoformat()
    }
