import os
import pandas as pd
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query

router = APIRouter()

DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "..", "..", "data"))
OCCURRENCES_CSV = os.path.join(DATA_DIR, "demo", "gbif_species_occurrences.csv")


def load_occurrences():
    if os.path.exists(OCCURRENCES_CSV):
        return pd.read_csv(OCCURRENCES_CSV).fillna("")
    return pd.DataFrame()


@router.get("/")
def get_ground_surveys(
    site_code: Optional[str] = Query(None),
    method: Optional[str] = Query(None),
    threat_only: bool = Query(False),
    search: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0)
):
    """Retrieve geolocated ground surveys and wildlife occurrences."""
    df = load_occurrences()
    if df.empty:
        return {"total": 0, "items": []}

    if site_code:
        df = df[df["site_code"] == site_code]
    if method:
        df = df[df["observation_method"].str.upper() == method.upper()]
    if threat_only:
        df = df[df["is_threat_alert"] == True]
    if search:
        s = search.lower()
        df = df[df["common_name"].str.lower().str.contains(s) | df["scientific_name"].str.lower().str.contains(s) | df["site_name"].str.lower().str.contains(s)]

    total = len(df)
    items = df.iloc[offset: offset + limit].to_dict(orient="records")
    return {"total": total, "items": items}


@router.get("/summary/stats")
def get_survey_summary():
    """Summary breakdown of ground surveys by method and observer."""
    df = load_occurrences()
    if df.empty:
        return {}

    return {
        "total_observations": len(df),
        "total_individuals_counted": int(df["individual_count"].sum()),
        "threat_alerts_count": len(df[df["is_threat_alert"] == True]),
        "methods_breakdown": df["observation_method"].value_counts().to_dict(),
        "observers_breakdown": df["observer"].value_counts().to_dict()
    }
