import os
import pandas as pd
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query

router = APIRouter()

DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "..", "..", "data"))
SPECIES_CSV = os.path.join(DATA_DIR, "demo", "species_catalog.csv")


def load_species_df():
    if os.path.exists(SPECIES_CSV):
        return pd.read_csv(SPECIES_CSV).fillna("")
    return pd.DataFrame()


@router.get("/")
def get_all_species(
    group: Optional[str] = Query(None, description="Taxonomic Group (Mammalia, Aves, Plantae, etc.)"),
    status: Optional[str] = Query(None, description="IUCN Status (CR, EN, VU, NT, LC)"),
    search: Optional[str] = Query(None, description="Search by common or scientific name"),
    invasive_only: bool = Query(False, description="Filter for invasive species only"),
    indicator_only: bool = Query(False, description="Filter for bio-indicator species only"),
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0)
):
    """Retrieve catalog of monitored flora and fauna species."""
    df = load_species_df()
    if df.empty:
        return {"total": 0, "items": []}

    if group:
        df = df[df["taxonomic_group"].str.lower() == group.lower()]
    if status:
        df = df[df["conservation_status"].str.upper() == status.upper()]
    if invasive_only:
        df = df[df["is_invasive"] == True]
    if indicator_only:
        df = df[df["is_indicator_species"] == True]
    if search:
        s = search.lower()
        df = df[df["common_name"].str.lower().str.contains(s) | df["scientific_name"].str.lower().str.contains(s)]

    total = len(df)
    items = df.iloc[offset: offset + limit].to_dict(orient="records")
    return {"total": total, "items": items}


@router.get("/{species_id}")
def get_species_by_id(species_id: int):
    """Fetch detailed metadata for a single species."""
    df = load_species_df()
    if df.empty:
        raise HTTPException(status_code=404, detail="Species not found")
    
    match = df[df["id"] == species_id]
    if match.empty:
        raise HTTPException(status_code=404, detail="Species not found")
    return match.iloc[0].to_dict()


@router.get("/summary/stats")
def get_species_summary():
    """Summary counts by IUCN status and taxonomic group."""
    df = load_species_df()
    if df.empty:
        return {}
    
    by_status = df["conservation_status"].value_counts().to_dict()
    by_group = df["taxonomic_group"].value_counts().to_dict()
    threatened = len(df[df["conservation_status"].isin(["CR", "EN", "VU"])])
    invasives = len(df[df["is_invasive"] == True])
    indicators = len(df[df["is_indicator_species"] == True])

    return {
        "total_species": len(df),
        "threatened_count": threatened,
        "invasive_count": invasives,
        "indicator_count": indicators,
        "by_status": by_status,
        "by_group": by_group
    }
