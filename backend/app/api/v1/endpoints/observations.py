from datetime import datetime
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.core.database import get_db
from app.models.observation import Observation
from app.models.species import Species
from app.models.enums import VerificationStatus, ObservationSource
from app.ai.vision_service import get_vision_service, SpeciesIdentificationResult

router = APIRouter()


class ObservationCreateSchema(BaseModel):
    species_id: int
    location_name: str = "Campus Central Reserve"
    habitat: Optional[str] = "Garden"
    latitude: float = 28.5450
    longitude: float = 77.1926
    notes: Optional[str] = None
    image_url: Optional[str] = None
    ai_confidence: float = 0.94


@router.get("")
def list_observations(
    species_id: Optional[int] = None,
    category: Optional[str] = None,
    verification_status: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db),
):
    """Retrieve filtered list of biodiversity observations."""
    query = db.query(Observation).join(Species)

    if species_id:
        query = query.filter(Observation.species_id == species_id)
    if category and category.lower() != "all":
        query = query.filter(Species.category == category.lower())
    if verification_status:
        query = query.filter(Observation.verification_status == verification_status)

    total = query.count()
    items = query.order_by(Observation.observed_at.desc()).offset(offset).limit(limit).all()

    return {
        "total": total,
        "items": [
            {
                "id": o.id,
                "species_id": o.species_id,
                "common_name": o.species.common_name if o.species else "Unknown",
                "scientific_name": o.species.scientific_name if o.species else "",
                "category": o.species.category if o.species else "other",
                "image_url": o.image_url or (o.species.image_url if o.species else None),
                "latitude": o.latitude,
                "longitude": o.longitude,
                "location_name": o.location_name,
                "habitat": o.habitat,
                "ai_confidence": round(o.ai_confidence * 100.0, 1) if o.ai_confidence <= 1.0 else round(o.ai_confidence, 1),
                "verification_status": o.verification_status.value,
                "observed_at": o.observed_at.isoformat() if o.observed_at else None,
                "notes": o.notes,
            }
            for o in items
        ],
    }


@router.get("/{id}")
def get_observation(id: int, db: Session = Depends(get_db)):
    obs = db.query(Observation).filter(Observation.id == id).first()
    if not obs:
        raise HTTPException(status_code=404, detail="Observation not found")
    return {
        "id": obs.id,
        "species_id": obs.species_id,
        "common_name": obs.species.common_name if obs.species else "Unknown",
        "scientific_name": obs.species.scientific_name if obs.species else "",
        "category": obs.species.category if obs.species else "other",
        "image_url": obs.image_url or (obs.species.image_url if obs.species else None),
        "latitude": obs.latitude,
        "longitude": obs.longitude,
        "location_name": obs.location_name,
        "habitat": obs.habitat,
        "ai_confidence": round(obs.ai_confidence * 100.0, 1) if obs.ai_confidence <= 1.0 else round(obs.ai_confidence, 1),
        "verification_status": obs.verification_status.value,
        "observed_at": obs.observed_at.isoformat() if obs.observed_at else None,
        "notes": obs.notes,
    }


@router.post("/identify")
def identify_observation_image(
    filename: Optional[str] = Query(None),
    category_hint: Optional[str] = Query(None),
):
    """Triggers AI vision identification returning top species candidates and confidence."""
    vision_service = get_vision_service()
    result: SpeciesIdentificationResult = vision_service.identify_image(
        filename=filename, hint_category=category_hint
    )
    return result.dict()


@router.post("")
def create_observation(
    payload: ObservationCreateSchema,
    db: Session = Depends(get_db),
):
    """Records a new biodiversity observation into the database."""
    species = db.query(Species).filter(Species.id == payload.species_id).first()
    if not species:
        # Fallback to first available species
        species = db.query(Species).first()
        if not species:
            raise HTTPException(status_code=400, detail="No species records found")

    new_obs = Observation(
        species_id=species.id,
        location_name=payload.location_name,
        habitat=payload.habitat or species.habitat or "Garden",
        latitude=payload.latitude,
        longitude=payload.longitude,
        notes=payload.notes,
        image_url=payload.image_url or species.image_url,
        ai_confidence=payload.ai_confidence,
        verification_status=VerificationStatus.UNVERIFIED,
        source=ObservationSource.COMMUNITY,
        observed_at=datetime.utcnow(),
    )
    db.add(new_obs)
    db.commit()
    db.refresh(new_obs)

    return {
        "message": "Observation recorded successfully. Pending expert verification.",
        "observation": {
            "id": new_obs.id,
            "species_id": new_obs.species_id,
            "common_name": species.common_name,
            "scientific_name": species.scientific_name,
            "latitude": new_obs.latitude,
            "longitude": new_obs.longitude,
            "location_name": new_obs.location_name,
            "ai_confidence": round(new_obs.ai_confidence * 100.0, 1) if new_obs.ai_confidence <= 1.0 else round(new_obs.ai_confidence, 1),
            "verification_status": new_obs.verification_status.value,
        },
    }


@router.post("/{id}/verify")
def verify_observation(
    id: int,
    action: str = Query("verify", enum=["verify", "reject"]),
    db: Session = Depends(get_db),
):
    """Admin/Expert verification of an observation record."""
    obs = db.query(Observation).filter(Observation.id == id).first()
    if not obs:
        raise HTTPException(status_code=404, detail="Observation not found")

    if action == "verify":
        obs.verification_status = VerificationStatus.VERIFIED
    else:
        obs.verification_status = VerificationStatus.REJECTED
    obs.verified_at = datetime.utcnow()
    db.commit()

    return {
        "id": obs.id,
        "verification_status": obs.verification_status.value,
        "verified_at": obs.verified_at.isoformat(),
        "message": f"Observation marked as {obs.verification_status.value}",
    }
