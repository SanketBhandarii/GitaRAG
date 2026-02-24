import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc
from database import get_db
from models import ChatSession, ChatMessage, User
from auth_router import oauth2_scheme
from jose import jwt, JWTError
from auth_utils import SECRET_KEY, ALGORITHM
from typing import List, Optional
from pydantic import BaseModel
import json

router = APIRouter(prefix="/api/chat", tags=["Chat History"])


def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if not username:
            raise HTTPException(status_code=401)
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


class ChatSessionCreate(BaseModel):
    scripture_id: str
    religion_id: str
    title: str = "New Chat"


class ChatSessionResponse(BaseModel):
    id: str
    scripture_id: str
    religion_id: str
    title: str
    created_at: str

    class Config:
        orm_mode = True


class ChatMessageResponse(BaseModel):
    id: int
    session_id: str
    role: str
    content: str
    verses_json: Optional[str] = None
    sentiment: Optional[str] = None
    created_at: str

    class Config:
        orm_mode = True


@router.post("/sessions")
def create_session(
    data: ChatSessionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    session_id = str(uuid.uuid4())
    new_session = ChatSession(
        id=session_id,
        user_id=current_user.id,
        scripture_id=data.scripture_id,
        religion_id=data.religion_id,
        title=data.title,
    )
    db.add(new_session)
    db.commit()
    db.refresh(new_session)
    return {
        "id": new_session.id,
        "scripture_id": new_session.scripture_id,
        "religion_id": new_session.religion_id,
        "title": new_session.title,
        "created_at": new_session.created_at.isoformat(),
    }


@router.get("/sessions/{scripture_id}")
def get_sessions(
    scripture_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    sessions = (
        db.query(ChatSession)
        .filter(
            ChatSession.user_id == current_user.id,
            ChatSession.scripture_id == scripture_id,
        )
        .order_by(desc(ChatSession.created_at))
        .all()
    )

    return [
        {
            "id": s.id,
            "scripture_id": s.scripture_id,
            "religion_id": s.religion_id,
            "title": s.title,
            "created_at": s.created_at.isoformat(),
        }
        for s in sessions
    ]


@router.get("/messages/{session_id}")
def get_messages(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Verify ownership
    session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    if session.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    messages = (
        db.query(ChatMessage)
        .filter(ChatMessage.session_id == session_id)
        .order_by(ChatMessage.created_at)
        .all()
    )
    return [
        {
            "id": m.id,
            "session_id": m.session_id,
            "role": m.role,
            "content": m.content,
            "verses": json.loads(m.verses_json) if m.verses_json else None,
            "sentiment": m.sentiment,
            "created_at": m.created_at.isoformat(),
        }
        for m in messages
    ]


@router.delete("/sessions/{session_id}")
def delete_session(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Verify ownership
    session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    if session.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    # Delete associated messages
    db.query(ChatMessage).filter(ChatMessage.session_id == session_id).delete()

    # Delete session
    db.delete(session)
    db.commit()

    return {"message": "Session deleted successfully"}
