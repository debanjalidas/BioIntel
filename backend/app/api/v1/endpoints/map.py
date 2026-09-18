import random
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.observation import Observation
from app.models.species import Species
from app.models.enums import ConservationStatus
from app.analytics.digital_twin_engine import digital_twin_engine

router = APIRouter()


@router.get("/observations")
def get_map_observations(
    category: Optional[str] = None,
    is_authorized: bool = Query(False, description="Whether caller is authorized researcher to view exact coordinates"),
    db: Session = Depends(get_db),
):
    """Returns geospatial observation points with privacy protection for endangered species."""
    query = db.query(Observation).join(Species)
    if category and category.lower() != "all":
        query = query.filter(Species.category == category.lower())

    observations = query.limit(250).all()
    points = []

    for obs in observations:
        sp = obs.species
        is_sensitive = sp.conservation_status in [ConservationStatus.CR, ConservationStatus.EN] if sp else False
        
        lat = obs.latitude
        lng = obs.longitude
        obfuscated = False

        if is_sensitive and not is_authorized:
            # Add subtle obfuscation (approximate location within ~400m)
            # Deterministic offset based on ID so marker stays consistent
            offset_lat = ((obs.id % 7) - 3) * 0.002
            offset_lng = ((obs.id % 5) - 2) * 0.002
            lat += offset_lat
            lng += offset_lng
            obfuscated = True

        points.append({
            "id": obs.id,
            "species_id": obs.species_id,
            "common_name": sp.common_name if sp else "Unknown",
            "scientific_name": sp.scientific_name if sp else "",
            "category": sp.category if sp else "other",
            "conservation_status": sp.conservation_status.value if sp else "LC",
            "native_status": sp.native_status if sp else "native",
            "latitude": round(lat, 5),
            "longitude": round(lng, 5),
            "location_name": obs.location_name,
            "habitat": obs.habitat,
            "ai_confidence": round(obs.ai_confidence * 100.0, 1) if obs.ai_confidence <= 1.0 else round(obs.ai_confidence, 1),
            "verification_status": obs.verification_status.value,
            "observed_at": obs.observed_at.isoformat() if obs.observed_at else None,
            "image_url": obs.image_url or (sp.image_url if sp else None),
            "is_sensitive": is_sensitive,
            "is_location_obfuscated": obfuscated,
            "privacy_notice": (
                "Location fuzzed for endangered species protection" if obfuscated else "Precise location"
            ),
        })

    zones = digital_twin_engine.get_zones()

    return {
        "total_points": len(points),
        "is_authorized_view": is_authorized,
        "points": points,
        "campus_zones": zones,
    }
