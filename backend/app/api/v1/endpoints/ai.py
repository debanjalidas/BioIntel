from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.core.database import get_db
from app.rag.rag_service import rag_service
from app.ai.insight_engine import insight_engine
from app.ai.vision_service import get_vision_service

router = APIRouter()


class ChatQuerySchema(BaseModel):
    query: str


@router.post("/chat")
def ask_ai_assistant(
    payload: ChatQuerySchema,
    db: Session = Depends(get_db),
):
    """Conversational RAG assistant grounded in campus ecological knowledge."""
    answer = rag_service.ask(db, payload.query)
    return answer.to_dict()


@router.get("/insights")
def get_ecological_insights(db: Session = Depends(get_db)):
    """Returns structured, explainable AI insights."""
    insights = insight_engine.generate_live_insights(db)
    return {
        "total": len(insights),
        "insights": [i.dict() for i in insights],
    }


@router.post("/identify")
def identify_image_ai(
    filename: Optional[str] = Query(None),
    category_hint: Optional[str] = Query(None),
):
    """Vision model identification returning top candidates with confidence."""
    vision_service = get_vision_service()
    result = vision_service.identify_image(filename=filename, hint_category=category_hint)
    return result.dict()
