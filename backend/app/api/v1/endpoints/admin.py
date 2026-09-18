from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.observation import Observation
from app.models.species import Species
from app.models.risk_alert import RiskAlert
from app.models.knowledge_document import KnowledgeDocument
from app.models.enums import VerificationStatus

router = APIRouter()


@router.get("/verification-queue")
def get_verification_queue(db: Session = Depends(get_db)):
    """Fetches unverified observations pending human review."""
    pending = (
        db.query(Observation)
        .filter(Observation.verification_status == VerificationStatus.UNVERIFIED)
        .order_by(Observation.observed_at.desc())
        .limit(50)
        .all()
    )

    return {
        "pending_count": len(pending),
        "items": [
            {
                "id": o.id,
                "species_id": o.species_id,
                "common_name": o.species.common_name if o.species else "Unknown",
                "scientific_name": o.species.scientific_name if o.species else "",
                "category": o.species.category if o.species else "other",
                "ai_confidence": round(o.ai_confidence * 100.0, 1) if o.ai_confidence <= 1.0 else round(o.ai_confidence, 1),
                "image_url": o.image_url or (o.species.image_url if o.species else None),
                "location_name": o.location_name,
                "habitat": o.habitat,
                "observed_at": o.observed_at.isoformat() if o.observed_at else None,
                "notes": o.notes,
            }
            for o in pending
        ],
    }


@router.post("/verify/{id}")
def verify_observation(id: int, db: Session = Depends(get_db)):
    obs = db.query(Observation).filter(Observation.id == id).first()
    if not obs:
        raise HTTPException(status_code=404, detail="Observation not found")
    obs.verification_status = VerificationStatus.VERIFIED
    obs.verified_at = datetime.utcnow()
    db.commit()
    return {"message": "Observation verified successfully", "id": obs.id, "status": "VERIFIED"}


@router.post("/reject/{id}")
def reject_observation(id: int, db: Session = Depends(get_db)):
    obs = db.query(Observation).filter(Observation.id == id).first()
    if not obs:
        raise HTTPException(status_code=404, detail="Observation not found")
    obs.verification_status = VerificationStatus.REJECTED
    obs.verified_at = datetime.utcnow()
    db.commit()
    return {"message": "Observation rejected", "id": obs.id, "status": "REJECTED"}


@router.get("/stats")
def get_admin_stats(db: Session = Depends(get_db)):
    total_obs = db.query(Observation).count()
    verified_obs = db.query(Observation).filter(Observation.verification_status == VerificationStatus.VERIFIED).count()
    unverified_obs = db.query(Observation).filter(Observation.verification_status == VerificationStatus.UNVERIFIED).count()
    rejected_obs = db.query(Observation).filter(Observation.verification_status == VerificationStatus.REJECTED).count()
    total_docs = db.query(KnowledgeDocument).count()
    total_species = db.query(Species).count()

    return {
        "total_observations": total_obs,
        "verified_observations": verified_obs,
        "pending_observations": unverified_obs,
        "rejected_observations": rejected_obs,
        "human_verification_rate_pct": round((verified_obs / max(1, total_obs)) * 100.0, 1),
        "total_knowledge_docs": total_docs,
        "total_species_catalog": total_species,
    }
