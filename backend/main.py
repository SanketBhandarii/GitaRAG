from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
import os
import re
import json
from database import engine, get_db
import models
from auth_router import router as auth_router
from chat_router import router as chat_router
from pdf_router import router as pdf_router
from insights_router import router as insights_router
from query import get_ai_reply

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="SecularAI API")

frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
allowed_origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:8080",
    "https://gitarag.vercel.app",
    "https://gitarag.vercel.app/",
    "https://gita-rag.vercel.app",
    "https://gita-rag.vercel.app/",
    "https://secularai.vercel.app",
    "https://secularai.vercel.app/",
    frontend_url,
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def log_cors_details(request: Request, call_next):
    origin = request.headers.get("origin")
    method = request.method
    path = request.url.path
    if origin:
        print(f"DEBUG: Incoming {method} request to {path} from Origin: {origin}")

    response = await call_next(request)
    return response


app.include_router(auth_router)
app.include_router(chat_router)
app.include_router(pdf_router)
app.include_router(insights_router)


class QueryRequest(BaseModel):
    user_query: str
    religion: str = "hinduism"
    scripture: str = "gita"
    session_id: str


@app.post("/query")
def query_scripture(request: QueryRequest, db: Session = Depends(get_db)):
    session = (
        db.query(models.ChatSession)
        .filter(models.ChatSession.id == request.session_id)
        .first()
    )
    if not session:
        return {"error": "Session not found"}

    past_messages = (
        db.query(models.ChatMessage)
        .filter(models.ChatMessage.session_id == request.session_id)
        .order_by(models.ChatMessage.created_at)
        .all()
    )

    history_text = ""
    for msg in past_messages[-14:]:
        role = "User" if msg.role == "user" else "Guide"
        history_text += f"{role}: {msg.content}\n"

    user_msg = models.ChatMessage(
        session_id=request.session_id, role="user", content=request.user_query
    )
    db.add(user_msg)
    db.commit()

    pdfs = db.query(models.PDFUpload).filter(models.PDFUpload.session_id == request.session_id).all()
    pdf_namespaces = [pdf.namespace for pdf in pdfs]

    reply = get_ai_reply(
        request.user_query,
        history_text,
        religion=request.religion,
        scripture=request.scripture,
        pdf_namespaces=pdf_namespaces,
    )

    verses_data = []

    def extract_verses(match):
        verses_data.append(
            {"reference": match.group(1), "text": match.group(2).strip()}
        )
        return ""

    clean_text = re.sub(
        r'\[VERSE title="(.+?)"\]([\s\S]*?)\[\/VERSE\]', extract_verses, reply
    ).strip()

    ai_msg = models.ChatMessage(
        session_id=request.session_id,
        role="ai",
        content=reply,
        verses_json=json.dumps(verses_data) if verses_data else None,
    )
    db.add(ai_msg)
    db.commit()

    return {"answer": reply}
