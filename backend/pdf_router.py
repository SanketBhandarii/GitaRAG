from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import os
import uuid
import tempfile

from database import get_db
from models import User, PDFUpload, ChatSession
from chat_router import get_current_user
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_mistralai import MistralAIEmbeddings
from langchain_pinecone import PineconeVectorStore
from pinecone import Pinecone

router = APIRouter(prefix="/api/chat", tags=["Dynamic PDF"])

@router.post("/upload-pdf")
async def upload_pdf(
    session_id: str = Form(...),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    six_hours_ago = datetime.utcnow() - timedelta(hours=6)
    recent_uploads = db.query(PDFUpload).filter(
        PDFUpload.user_id == current_user.id,
        PDFUpload.created_at >= six_hours_ago
    ).count()

    if recent_uploads >= 5:
        raise HTTPException(status_code=429, detail="Limit reached: You can only upload 5 PDFs every 6 hours.")

    session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
    if not session or session.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Invalid session")

    existing_pdf = db.query(PDFUpload).filter(
        PDFUpload.session_id == session_id,
        PDFUpload.filename == file.filename
    ).first()
    if existing_pdf:
        raise HTTPException(status_code=400, detail="This exact PDF is already active in the current session.")

    namespace = f"user_{current_user.id}_{uuid.uuid4().hex[:8]}"

    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        content = await file.read()
        tmp.write(content)
        tmp_path = tmp.name

    try:
        loader = PyPDFLoader(tmp_path)
        documents = loader.load()
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000, chunk_overlap=100, separators=["\n\n", "\n", " ", ""]
        )
        texts = text_splitter.split_documents(documents)

        pc = Pinecone(api_key=os.environ.get("PINECONE_API_KEY"))
        index = pc.Index("gita")
        embeddings = MistralAIEmbeddings(model="mistral-embed")
        vector_store = PineconeVectorStore(index=index, embedding=embeddings)

        batch_size = 100
        for i in range(0, len(texts), batch_size):
            batch = texts[i : i + batch_size]
            batch_uuids = [str(uuid.uuid4()) for _ in range(len(batch))]
            vector_store.add_documents(documents=batch, ids=batch_uuids, namespace=namespace)

        new_pdf = PDFUpload(
            user_id=current_user.id,
            session_id=session_id,
            filename=file.filename,
            namespace=namespace
        )
        db.add(new_pdf)
        db.commit()

        return {"message": "PDF processed successfully", "filename": file.filename}

    except Exception as e:
        print("Upload Error:", e)
        raise HTTPException(status_code=500, detail="Failed to process PDF")
    finally:
        os.remove(tmp_path)


@router.get("/sessions/{session_id}/pdfs")
def get_session_pdfs(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
    if not session or session.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Invalid session")

    pdfs = db.query(PDFUpload).filter(PDFUpload.session_id == session_id).all()
    return [{"id": p.id, "filename": p.filename} for p in pdfs]

@router.delete("/pdfs/{pdf_id}")
def delete_pdf(
    pdf_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    pdf = db.query(PDFUpload).filter(PDFUpload.id == pdf_id).first()
    if not pdf or pdf.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    try:
        pc = Pinecone(api_key=os.environ.get("PINECONE_API_KEY"))
        index = pc.Index("gita")
        index.delete(delete_all=True, namespace=pdf.namespace)
    except Exception as e:
        print(f"Failed to delete pinecone namespace: {e}")

    db.delete(pdf)
    db.commit()
    return {"message": "PDF deleted"}
