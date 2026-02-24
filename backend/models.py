from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.sql import func
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=True)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class PendingUser(Base):
    __tablename__ = "pending_users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String)
    email = Column(String, index=True)
    full_name = Column(String, nullable=True)
    hashed_password = Column(String)
    otp_code = Column(String)
    expires_at = Column(DateTime)


class PasswordReset(Base):
    __tablename__ = "password_resets"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, index=True)
    otp_code = Column(String)
    expires_at = Column(DateTime)


class ChatSession(Base):
    """Stores individual chat threads."""

    __tablename__ = "chat_sessions"

    id = Column(String, primary_key=True, index=True)  # Will use UUID string
    user_id = Column(Integer, index=True, nullable=False)
    scripture_id = Column(String, index=True, nullable=False)  # e.g. "gita"
    religion_id = Column(String, nullable=False)  # e.g. "hinduism"
    title = Column(String, nullable=False, default="New Chat")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ChatMessage(Base):
    """Stores individual messages within a chat session."""

    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, index=True, nullable=False)  # FK to chat_sessions.id
    role = Column(String, nullable=False)  # "user" or "ai"
    content = Column(Text, nullable=False)
    verses_json = Column(Text, nullable=True)  # Store JSON string of verses if any
    sentiment = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
