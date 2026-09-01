import os
import pandas as pd
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query

router = APIRouter()

DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "..", "..", "data"))
SAMPLES_CSV = os.path.join(DATA_DIR, "demo", "edna_metabarcoding_samples.csv")
DETECTIONS_CSV = os.path.join(DATA_DIR, "demo", "edna_taxonomic_detections.csv")


def load_edna_samples():
    if os.path.exists(SAMPLES_CSV):
        return pd.read_csv(SAMPLES_CSV).fillna("")
    return pd.DataFrame()


def load_edna_detections():
    if os.path.exists(DETECTIONS_CSV):
        return pd.read_csv(DETECTIONS_CSV).fillna("")
    return pd.DataFrame()


@router.get("/samples")
def get_edna_samples(
    site_code: Optional[str] = Query(None),
    platform: Optional[str] = Query(None),
    min_richness: Optional[int] = Query(None),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0)
):
    """Retrieve environmental DNA sampling collection records."""
    df = load_edna_samples()
    if df.empty:
        return {"total": 0, "items": []}

    if site_code:
        df = df[df["site_code"] == site_code]
    if platform:
        df = df[df["sequencing_platform"].str.contains(platform, case=False)]
    if min_richness:
        df = df[df["species_richness_detected"] >= min_richness]

    total = len(df)
    items = df.iloc[offset: offset + limit].to_dict(orient="records")
    return {"total": total, "items": items}


@router.get("/detections")
def get_edna_detections(
    sample_code: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    invasive_only: bool = Query(False),
    primer: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0)
):
    """Retrieve OTU / ASV metagenomic taxonomic detection records."""
    df = load_edna_detections()
    if df.empty:
        return {"total": 0, "items": []}

    if sample_code:
        df = df[df["sample_code"] == sample_code]
    if status:
        df = df[df["conservation_status"] == status]
    if invasive_only:
        df = df[df["is_invasive"] == True]
    if primer:
        df = df[df["primer_target"].str.contains(primer, case=False)]

    total = len(df)
    items = df.iloc[offset: offset + limit].to_dict(orient="records")
    return {"total": total, "items": items}


@router.get("/summary/metrics")
def get_edna_summary():
    """Summary metrics of eDNA surveys across all monitoring stations."""
    df_s = load_edna_samples()
    df_d = load_edna_detections()
    if df_s.empty:
        return {}

    total_reads = int(df_s["total_metabarcode_reads"].sum())
    avg_richness = round(float(df_s["species_richness_detected"].mean()), 1)
    unique_taxa = df_d["scientific_name"].nunique() if not df_d.empty else 0
    invasive_detections = len(df_d[df_d["is_invasive"] == True]) if not df_d.empty else 0

    return {
        "total_samples": len(df_s),
        "total_detections": len(df_d),
        "total_sequencing_reads": total_reads,
        "avg_species_richness": avg_richness,
        "unique_taxa_identified": unique_taxa,
        "invasive_detections_count": invasive_detections,
        "platforms_breakdown": df_s["sequencing_platform"].value_counts().to_dict()
    }
