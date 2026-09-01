import os
import json
import pandas as pd
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query

router = APIRouter()

DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "..", "..", "data"))
SATELLITE_DIR = os.path.join(DATA_DIR, "satellite")
SATELLITE_CSV = os.path.join(SATELLITE_DIR, "vegetation_canopy_timeseries.csv")
SITES_GEOJSON = os.path.join(SATELLITE_DIR, "monitoring_sites.geojson")


def load_satellite_timeseries():
    if os.path.exists(SATELLITE_CSV):
        return pd.read_csv(SATELLITE_CSV).fillna("")
    return pd.DataFrame()


@router.get("/timeseries")
def get_satellite_timeseries(
    site_name: Optional[str] = Query(None),
    site_id: Optional[int] = Query(None),
    limit: int = Query(60, ge=1, le=200)
):
    """Retrieve monthly remote sensing NDVI, EVI, canopy cover and temperature timeseries."""
    df = load_satellite_timeseries()
    if df.empty:
        return {"total": 0, "items": []}

    if site_id:
        df = df[df["site_id"] == site_id]
    if site_name:
        df = df[df["site_name"].str.contains(site_name, case=False)]

    df = df.sort_values(by="observation_date", ascending=True)
    return {"total": len(df), "items": df.head(limit).to_dict(orient="records")}


@router.get("/sites")
def get_monitoring_sites_geojson():
    """Retrieve GeoJSON protected areas with bounding polygons, coordinates, and telemetry metadata."""
    if os.path.exists(SITES_GEOJSON):
        with open(SITES_GEOJSON, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"type": "FeatureCollection", "features": []}


@router.get("/summary/stats")
def get_satellite_summary():
    """Remote sensing aggregate statistics across all monitored ecosystems."""
    df = load_satellite_timeseries()
    if df.empty:
        return {}

    return {
        "monitored_sites_count": df["site_id"].nunique(),
        "mean_ndvi": round(float(df["ndvi_mean"].mean()), 3),
        "mean_evi": round(float(df["evi_mean"].mean()), 3),
        "mean_canopy_cover": round(float(df["canopy_cover_percent"].mean()), 1),
        "total_deforestation_alerts": int(df["deforestation_alert_count"].sum()),
        "sensor": "Sentinel-2 MSI (Level-2A BOA)"
    }
