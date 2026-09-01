from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

router = APIRouter()

# In-memory dynamic alerts repository initialized with realistic events
alerts_store = [
    {
        "id": "ALT-2026-001",
        "title": "Acoustic Detection: High-Risk Chainsaw Signal",
        "severity": "CRITICAL",
        "severity_color": "bg-rose-100 text-rose-700 border-rose-200",
        "location": "Western Ghats Corridor - Sector 4",
        "site_code": "SITE-WGH-003",
        "time": "12 mins ago",
        "description": "Continuous acoustic frequency harmonics (800-1400Hz) matching mechanical motorized timber cutting.",
        "status": "ACTIVE",
        "source": "PAM Acoustic Sensor #14"
    },
    {
        "id": "ALT-2026-002",
        "title": "Invasive Macrophyte Outbreak via eDNA Assay",
        "severity": "WARNING",
        "severity_color": "bg-amber-100 text-amber-700 border-amber-200",
        "location": "Sundarbans Northern Channel",
        "site_code": "SITE-SND-001",
        "time": "45 mins ago",
        "description": "High relative abundance (>7.3%) of Eichhornia crassipes detected in station EDNA-SND-001.",
        "status": "ACTIVE",
        "source": "Illumina NovaSeq eDNA Metabarcode"
    },
    {
        "id": "ALT-2026-003",
        "title": "Rapid Canopy Loss & Thermal Hotspot",
        "severity": "CRITICAL",
        "severity_color": "bg-rose-100 text-rose-700 border-rose-200",
        "location": "Kaziranga Buffer Zone B-2",
        "site_code": "SITE-KZR-002",
        "time": "2 hours ago",
        "description": "Sentinel-2 MSI recorded 8.4% NDVI degradation and elevated surface temperature (+4.2C).",
        "status": "INVESTIGATING",
        "source": "Sentinel-2 Multi-Spectral Feed"
    },
    {
        "id": "ALT-2026-004",
        "title": "Critically Endangered Nesting Site Activity",
        "severity": "INFO",
        "severity_color": "bg-blue-100 text-blue-700 border-blue-200",
        "location": "Namdapha Alpine Basin",
        "site_code": "SITE-NAM-008",
        "time": "4 hours ago",
        "description": "White-bellied Heron (Ardea insignis) breeding pair documented by field camera trap.",
        "status": "RESOLVED",
        "source": "Camera Trap Array #07"
    }
]


class AlertCreateSchema(BaseModel):
    title: str
    severity: str = "WARNING"
    location: str
    site_code: Optional[str] = "SITE-WGH-003"
    description: str
    source: Optional[str] = "Manual Dispatch"


@router.get("/")
def get_alerts(
    severity: Optional[str] = Query(None),
    status: Optional[str] = Query(None)
):
    """Retrieve active and historical early warning threat intelligence alerts."""
    results = alerts_store
    if severity:
        results = [a for a in results if a["severity"].upper() == severity.upper()]
    if status:
        results = [a for a in results if a["status"].upper() == status.upper()]
    return {"total": len(results), "items": results}


@router.post("/")
def create_alert(payload: AlertCreateSchema):
    """Dispatch a new environmental or perimeter threat alert."""
    new_id = f"ALT-2026-{len(alerts_store) + 1:03d}"
    sev = payload.severity.upper()
    color = "bg-rose-100 text-rose-700 border-rose-200" if sev == "CRITICAL" else (
        "bg-amber-100 text-amber-700 border-amber-200" if sev == "WARNING" else "bg-blue-100 text-blue-700 border-blue-200"
    )

    alert_obj = {
        "id": new_id,
        "title": payload.title,
        "severity": sev,
        "severity_color": color,
        "location": payload.location,
        "site_code": payload.site_code or "SITE-WGH-003",
        "time": "Just now",
        "description": payload.description,
        "status": "ACTIVE",
        "source": payload.source or "Manual Dispatch"
    }
    alerts_store.insert(0, alert_obj)
    return {"status": "created", "alert": alert_obj}


@router.patch("/{alert_id}/resolve")
def resolve_alert(alert_id: str):
    """Mark an active alert as resolved."""
    for a in alerts_store:
        if a["id"] == alert_id:
            a["status"] = "RESOLVED"
            return {"status": "updated", "alert": a}
    raise HTTPException(status_code=404, detail="Alert not found")
