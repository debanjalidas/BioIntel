from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.analytics.recommendation_engine import recommendation_engine

router = APIRouter()


@router.get("")
def get_recommendations(db: Session = Depends(get_db)):
    """Returns rule and AI generated conservation recommendations."""
    recs = recommendation_engine.get_recommendations(db)
    return {
        "total": len(recs),
        "recommendations": recs,
    }
