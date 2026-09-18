from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.core.database import get_db
from app.models.knowledge_document import KnowledgeDocument
from app.rag.rag_service import rag_service

router = APIRouter()


class DocumentCreateSchema(BaseModel):
    title: str
    content: str
    source: str = "Campus Biodiversity Committee"
    category: str = "conservation_guidance"


@router.get("/search")
def search_knowledge_documents(
    q: str = Query(..., description="Search query string"),
    category: Optional[str] = None,
    limit: int = 5,
    db: Session = Depends(get_db),
):
    """Searches knowledge documents for RAG grounding."""
    matches = rag_service.search_documents(db, q, top_k=limit, category=category)
    return {
        "query": q,
        "results": [m.to_dict() for m in matches],
    }


@router.get("/documents")
def list_knowledge_documents(
    category: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """Lists available documents in the RAG knowledge corpus."""
    query = db.query(KnowledgeDocument)
    if category:
        query = query.filter(KnowledgeDocument.category == category)
    docs = query.all()

    return {
        "total": len(docs),
        "documents": [
            {
                "id": d.id,
                "title": d.title,
                "source": d.source,
                "category": d.category,
                "snippet": d.content[:200] + "..." if len(d.content) > 200 else d.content,
            }
            for d in docs
        ],
    }


@router.post("/documents")
def add_knowledge_document(payload: DocumentCreateSchema, db: Session = Depends(get_db)):
    """Admin endpoint to add a new conservation document to the RAG knowledge base."""
    new_doc = KnowledgeDocument(
        title=payload.title,
        content=payload.content,
        source=payload.source,
        category=payload.category,
    )
    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)
    return {"message": "Document added to knowledge base", "id": new_doc.id, "title": new_doc.title}
