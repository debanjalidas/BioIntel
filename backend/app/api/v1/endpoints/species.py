from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from pydantic import BaseModel
from app.core.database import get_db
from app.models.species import Species
from app.models.observation import Observation

router = APIRouter()


class SpeciesCreateSchema(BaseModel):
    common_name: str
    scientific_name: str
    category: str = "birds"
    habitat: Optional[str] = "Garden"
    native_status: str = "native"
    conservation_status: str = "LC"
    description: Optional[str] = None
    image_url: Optional[str] = None
    source: Optional[str] = "Campus Biodiversity Register"


@router.get("")
def get_all_species(
    category: Optional[str] = Query(None, description="Category filter (birds, mammals, insects, plants, reptiles, amphibians, butterflies)"),
    status: Optional[str] = Query(None, description="IUCN Status (CR, EN, VU, NT, LC)"),
    search: Optional[str] = Query(None, description="Search by common or scientific name"),
    native_status: Optional[str] = Query(None, description="Filter by native / invasive status"),
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    """Retrieve catalog of monitored flora and fauna species from the database."""
    query = db.query(Species)

    if category and category.lower() != "all":
        query = query.filter(
            or_(
                Species.category == category.lower(),
                Species.taxonomic_group.ilike(f"%{category}%")
            )
        )
    if status:
        query = query.filter(Species.conservation_status == status.upper())
    if native_status:
        query = query.filter(Species.native_status == native_status.lower())
    if search:
        s = f"%{search.lower()}%"
        query = query.filter(
            or_(
                Species.common_name.ilike(s),
                Species.scientific_name.ilike(s),
                Species.category.ilike(s),
            )
        )

    total = query.count()
    items = query.order_by(Species.common_name.asc()).offset(offset).limit(limit).all()

    species_data = []
    for sp in items:
        obs_count = db.query(Observation).filter(Observation.species_id == sp.id).count()
        last_obs = (
            db.query(Observation)
            .filter(Observation.species_id == sp.id)
            .order_by(Observation.observed_at.desc())
            .first()
        )
        species_data.append({
            "id": sp.id,
            "common_name": sp.common_name,
            "scientific_name": sp.scientific_name,
            "category": sp.category,
            "taxonomic_group": sp.taxonomic_group,
            "habitat": sp.habitat or "Campus Greenspace",
            "native_status": sp.native_status,
            "conservation_status": sp.conservation_status.value if hasattr(sp.conservation_status, "value") else str(sp.conservation_status),
            "is_invasive": sp.is_invasive,
            "is_indicator_species": sp.is_indicator_species,
            "description": sp.description,
            "image_url": sp.image_url,
            "image": sp.image_url,
            "source": sp.source,
            "observation_count": obs_count,
            "last_observed": last_obs.observed_at.isoformat() if last_obs and last_obs.observed_at else "Recently",
            "confidence": "94%",
        })

    return {"total": total, "items": species_data}


@router.get("/{species_id}")
def get_species_by_id(species_id: int, db: Session = Depends(get_db)):
    """Fetch detailed metadata for a single species."""
    sp = db.query(Species).filter(Species.id == species_id).first()
    if not sp:
        raise HTTPException(status_code=404, detail="Species not found")
    
    obs_count = db.query(Observation).filter(Observation.species_id == sp.id).count()
    last_obs = (
        db.query(Observation)
        .filter(Observation.species_id == sp.id)
        .order_by(Observation.observed_at.desc())
        .first()
    )

    return {
        "id": sp.id,
        "common_name": sp.common_name,
        "scientific_name": sp.scientific_name,
        "category": sp.category,
        "taxonomic_group": sp.taxonomic_group,
        "habitat": sp.habitat,
        "native_status": sp.native_status,
        "conservation_status": sp.conservation_status.value if hasattr(sp.conservation_status, "value") else str(sp.conservation_status),
        "is_invasive": sp.is_invasive,
        "is_indicator_species": sp.is_indicator_species,
        "description": sp.description,
        "image_url": sp.image_url,
        "source": sp.source,
        "observation_count": obs_count,
        "last_observed": last_obs.observed_at.isoformat() if last_obs and last_obs.observed_at else "Recently",
    }


@router.post("")
def add_species(payload: SpeciesCreateSchema, db: Session = Depends(get_db)):
    """Admin endpoint to register a new species into the catalog."""
    new_sp = Species(
        common_name=payload.common_name,
        scientific_name=payload.scientific_name,
        category=payload.category,
        habitat=payload.habitat,
        native_status=payload.native_status,
        conservation_status=payload.conservation_status,
        is_invasive=payload.native_status in ["invasive", "potential_invasive"],
        description=payload.description,
        image_url=payload.image_url,
        source=payload.source,
    )
    db.add(new_sp)
    db.commit()
    db.refresh(new_sp)
    return {"message": "Species added successfully", "species": {"id": new_sp.id, "common_name": new_sp.common_name}}
