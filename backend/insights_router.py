from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import json
from groq import Groq
import os

from database import get_db
from models import User, ChatSession, ChatMessage, UserInsight
from chat_router import get_current_user

router = APIRouter(prefix="/api/insights", tags=["Soul Snapshot"])

groq_client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

SYSTEM_PROMPT = (
    'You are observant. Analyze these questions and output ONLY valid JSON: '
    '{"archetype":"2-3 words","raw_take":"2 sentences. Plain English. '
    'What these questions actually reveal about this person\'s current mindset. '
    'Specific, not generic. No metaphors, no dramatic phrasing.","tags":["#Tag1","#Tag2","#Tag3"]}'
)


@router.get("/me")
def get_my_insight(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    insight = db.query(UserInsight).filter(UserInsight.user_id == current_user.id).first()
    if not insight:
        return {"insight": None}

    return {
        "insight": {
            "archetype": insight.archetype,
            "raw_take": insight.raw_take,
            "tags": json.loads(insight.tags_json),
            "generated_at": insight.generated_at.isoformat(),
            "can_regenerate": datetime.utcnow() > insight.generated_at.replace(tzinfo=None) + timedelta(hours=24)
        }
    }


@router.post("/generate")
def generate_insight(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check 24-hour rate limit
    existing = db.query(UserInsight).filter(UserInsight.user_id == current_user.id).first()
    if existing:
        time_since = datetime.utcnow() - existing.generated_at.replace(tzinfo=None)
        if time_since < timedelta(hours=24):
            hours_left = int((timedelta(hours=24) - time_since).seconds / 3600) + 1
            raise HTTPException(
                status_code=429,
                detail=f"You can generate your snapshot once a day. Try again in ~{hours_left} hour(s)."
            )

    # Collect all user messages across all sessions
    user_sessions = db.query(ChatSession).filter(ChatSession.user_id == current_user.id).all()
    session_ids = [s.id for s in user_sessions]

    if not session_ids:
        raise HTTPException(status_code=400, detail="no_messages")

    user_messages = (
        db.query(ChatMessage)
        .filter(
            ChatMessage.session_id.in_(session_ids),
            ChatMessage.role == "user"
        )
        .order_by(ChatMessage.created_at)
        .all()
    )

    if len(user_messages) < 5:
        raise HTTPException(status_code=400, detail="no_messages")

    # Build minimal token-efficient question list (max 30, trimmed to 100 chars each)
    questions = [m.content[:100].strip() for m in user_messages[-30:]]
    questions_str = "; ".join(questions)

    # Call Groq with minimal prompt
    try:
        response = groq_client.chat.completions.create(
            model="llama-3.1-8b-instant",  # smallest fast model to save tokens
            temperature=0.5,
            max_tokens=160,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"Questions: {questions_str}"}
            ]
        )
        raw = response.choices[0].message.content.strip()
        # Strip markdown code fences if present
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        data = json.loads(raw)
    except Exception as e:
        print("Insight generation error:", e)
        raise HTTPException(status_code=500, detail="Failed to generate insight. Please try again.")

    # Validate expected fields
    archetype = data.get("archetype", "The Seeker")
    raw_take = data.get("raw_take", "")
    tags = data.get("tags", [])

    # Upsert (update if exists, create if not)
    if existing:
        existing.archetype = archetype
        existing.raw_take = raw_take
        existing.tags_json = json.dumps(tags)
        existing.generated_at = datetime.utcnow()
        db.commit()
        db.refresh(existing)
    else:
        new_insight = UserInsight(
            user_id=current_user.id,
            archetype=archetype,
            raw_take=raw_take,
            tags_json=json.dumps(tags),
            generated_at=datetime.utcnow()
        )
        db.add(new_insight)
        db.commit()
        db.refresh(new_insight)

    return {
        "insight": {
            "archetype": archetype,
            "raw_take": raw_take,
            "tags": tags,
            "generated_at": datetime.utcnow().isoformat(),
            "can_regenerate": False
        }
    }
