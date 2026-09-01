import os
import pandas as pd
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query

router = APIRouter()

DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "..", "..", "data"))
AUDIO_DIR = os.path.join(DATA_DIR, "audio")
PAM_CSV = os.path.join(AUDIO_DIR, "pam_acoustic_detections.csv")


def load_pam_detections():
    if os.path.exists(PAM_CSV):
        return pd.read_csv(PAM_CSV).fillna("")
    return pd.DataFrame()


@router.get("/detections")
def get_acoustic_detections(
    site_name: Optional[str] = Query(None),
    species: Optional[str] = Query(None),
    min_confidence: Optional[float] = Query(None, ge=0.0, le=1.0),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0)
):
    """Retrieve passive acoustic vocalization detections with audio frequencies and confidence."""
    df = load_pam_detections()
    if df.empty:
        return {"total": 0, "items": []}

    if site_name:
        df = df[df["site_name"].str.contains(site_name, case=False)]
    if species:
        df = df[df["common_name"].str.contains(species, case=False) | df["scientific_name"].str.contains(species, case=False)]
    if min_confidence:
        df = df[df["model_confidence"] >= min_confidence]

    total = len(df)
    items = df.iloc[offset: offset + limit].to_dict(orient="records")
    return {"total": total, "items": items}


@router.get("/recordings")
def list_audio_files():
    """List available audio files in data/audio for waveform playback and model inspection."""
    files = []
    if os.path.exists(AUDIO_DIR):
        for f in os.listdir(AUDIO_DIR):
            if f.endswith(".wav") or f.endswith(".mp3"):
                size = os.path.getsize(os.path.join(AUDIO_DIR, f))
                files.append({
                    "file_name": f,
                    "file_url": f"/audio_files/{f}",
                    "size_bytes": size,
                    "format": f.split(".")[-1].upper()
                })
    return {"total": len(files), "recordings": files}


@router.get("/summary/stats")
def get_acoustic_summary():
    """Summary of acoustic telemetry detections."""
    df = load_pam_detections()
    if df.empty:
        return {}

    return {
        "total_detections": len(df),
        "avg_confidence": round(float(df["model_confidence"].mean()), 3),
        "vocalizing_species_count": df["scientific_name"].nunique(),
        "species_breakdown": df["common_name"].value_counts().head(10).to_dict(),
        "verification_breakdown": df["verification_status"].value_counts().to_dict()
    }
