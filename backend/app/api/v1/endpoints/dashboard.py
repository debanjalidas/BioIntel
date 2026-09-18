from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.species import Species
from app.models.observation import Observation
from app.models.risk_alert import RiskAlert
from app.analytics.health_score import health_score_engine
from app.analytics.trend_anomaly import trend_anomaly_engine
from app.analytics.digital_twin_engine import digital_twin_engine
from app.ai.insight_engine import insight_engine

router = APIRouter()


@router.get("")
def get_dashboard_data(db: Session = Depends(get_db)):
    """Primary aggregate endpoint powering the BioIntel main dashboard."""
    total_species = db.query(Species).count()
    total_observations = db.query(Observation).count()
    native_count = db.query(Species).filter(Species.native_status == "native").count()
    native_ratio = round((native_count / max(1, total_species)) * 100.0, 1)

    # Health score
    health_report = health_score_engine.calculate(db)

    # Active alerts
    alerts_query = (
        db.query(RiskAlert)
        .filter(RiskAlert.status == "ACTIVE")
        .order_by(RiskAlert.created_at.desc())
        .limit(5)
        .all()
    )
    active_alerts = [
        {
            "id": a.id,
            "type": a.type,
            "severity": a.severity.value,
            "location": a.location,
            "description": a.description,
            "evidence": a.evidence,
            "confidence": a.confidence,
            "created_at": a.created_at.isoformat() if a.created_at else None,
        }
        for a in alerts_query
    ]

    # Recent observations
    obs_query = (
        db.query(Observation)
        .order_by(Observation.observed_at.desc())
        .limit(6)
        .all()
    )
    recent_observations = [
        {
            "id": o.id,
            "species_name": o.species.common_name if o.species else "Unknown Species",
            "scientific_name": o.species.scientific_name if o.species else "",
            "category": o.species.category if o.species else "other",
            "image_url": o.image_url or (o.species.image_url if o.species else None),
            "location_name": o.location_name,
            "habitat": o.habitat,
            "latitude": o.latitude,
            "longitude": o.longitude,
            "ai_confidence": round(o.ai_confidence * 100.0, 1) if o.ai_confidence <= 1.0 else round(o.ai_confidence, 1),
            "verification_status": o.verification_status.value,
            "observed_at": o.observed_at.isoformat() if o.observed_at else None,
            "notes": o.notes,
        }
        for o in obs_query
    ]

    # Trends and Digital Twin
    trends = trend_anomaly_engine.analyze_trends(db)
    zones = digital_twin_engine.get_zones()
    insights = insight_engine.generate_live_insights(db)
    top_insight = insights[0].dict() if insights else None

    return {
        "project": "BioIntel",
        "tagline": "Observe → Understand → Protect",
        "sdg_target": "UN SDG 15 — Life on Land",
        "metrics": {
            "total_species": total_species,
            "total_observations": total_observations,
            "native_species_count": native_count,
            "native_species_ratio_pct": native_ratio,
            "active_alerts_count": len(active_alerts),
            "health_score": health_report.to_dict(),
        },
        "recent_observations": recent_observations,
        "active_alerts": active_alerts,
        "trends": trends,
        "campus_zones": zones,
        "ai_insight": top_insight,
    }
