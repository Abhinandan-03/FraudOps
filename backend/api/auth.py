from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import datetime, timezone
import secrets
import hashlib
import uuid
import re

from ..database import database
from ..database import models as database_models

router = APIRouter(prefix="/auth", tags=["auth"])

# --- Security & Hashing Helpers ---

def hash_password(password: str) -> str:
    """Hash a password using PBKDF2-HMAC-SHA256 with a unique cryptographic salt."""
    salt = secrets.token_hex(16)
    key = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000)
    return f"{salt}${key.hex()}"

def verify_password(stored_hash: str, password: str) -> bool:
    """Verify a plain password against the stored salt$hash."""
    try:
        salt, key_hex = stored_hash.split('$')
        computed_key = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000)
        return secrets.compare_digest(computed_key.hex(), key_hex)
    except Exception:
        return False

# --- Request / Response Schemas ---

class DirectResetPasswordRequest(BaseModel):
    email: str
    new_password: str

class AuthCredentials(BaseModel):
    email: str
    password: str

# --- Endpoints ---

@router.post("/reset-password")
def reset_password(req: DirectResetPasswordRequest, db: Session = Depends(database.get_db)):
    email_clean = req.email.strip().lower()

    if not email_clean:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="OPERATIVE ID OR EMAIL IS REQUIRED"
        )

    if not req.new_password or len(req.new_password.strip()) < 4:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="PASSWORD MUST BE AT LEAST 4 CHARACTERS"
        )

    now = datetime.now(timezone.utc).isoformat()
    user = db.query(database_models.User).filter(
        database_models.User.email == email_clean
    ).first()

    hashed_pw = hash_password(req.new_password)

    if user:
        user.password_hash = hashed_pw
        user.updated_at = now
    else:
        # Create user with new hashed credentials
        user = database_models.User(
            id=str(uuid.uuid4()),
            email=email_clean,
            password_hash=hashed_pw,
            created_at=now,
            updated_at=now
        )
        db.add(user)

    db.commit()

    return {
        "status": "success",
        "message": "PASSWORD UPDATED SUCCESSFULLY",
        "email": email_clean
    }

@router.post("/register")
def register(creds: AuthCredentials, db: Session = Depends(database.get_db)):
    email_clean = creds.email.strip().lower()
    existing = db.query(database_models.User).filter(database_models.User.email == email_clean).first()
    if existing:
        raise HTTPException(status_code=400, detail="OPERATIVE ID ALREADY REGISTERED")

    now = datetime.now(timezone.utc).isoformat()
    new_user = database_models.User(
        id=str(uuid.uuid4()),
        email=email_clean,
        password_hash=hash_password(creds.password),
        created_at=now,
        updated_at=now
    )
    db.add(new_user)
    db.commit()
    return {"status": "success", "message": "ACCOUNT CREATED"}

@router.post("/login")
def login(creds: AuthCredentials, db: Session = Depends(database.get_db)):
    email_clean = creds.email.strip().lower()
    user = db.query(database_models.User).filter(database_models.User.email == email_clean).first()
    
    if not user or not verify_password(user.password_hash, creds.password):
        raise HTTPException(status_code=401, detail="INVALID ACCESS KEY OR OPERATIVE ID")

    return {"status": "success", "email": user.email}
