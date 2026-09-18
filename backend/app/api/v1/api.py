from fastapi import APIRouter
from app.api.v1.endpoints import (
    dashboard,
    species,
    observations,
    map as map_endpoint,
    ai,
    rag,
    digital_twin,
    recommendations,
    admin,
    alerts,
    analytics,
    edna,
    acoustics,
    satellite,
    surveys,
    ml,
    reports,
)

api_router = APIRouter()

# Core BioIntel Ecosystem Intelligence Routers
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
api_router.include_router(species.router, prefix="/species", tags=["Species Catalog"])
api_router.include_router(observations.router, prefix="/observations", tags=["Observations Workflow"])
api_router.include_router(map_endpoint.router, prefix="/map", tags=["Biodiversity GIS Map"])
api_router.include_router(ai.router, prefix="/ai", tags=["AI & RAG Assistant"])
api_router.include_router(rag.router, prefix="/rag", tags=["RAG Knowledge Base"])
api_router.include_router(digital_twin.router, prefix="/digital-twin", tags=["Digital Twin & What-If Simulator"])
api_router.include_router(recommendations.router, prefix="/recommendations", tags=["Conservation Recommendations"])
api_router.include_router(admin.router, prefix="/admin", tags=["Admin & Verification Queue"])
api_router.include_router(alerts.router, prefix="/alerts", tags=["Threat Alerts"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["Platform Analytics"])
api_router.include_router(reports.router, prefix="/reports", tags=["Executive Reports"])

# Multi-Modal Subsystems
api_router.include_router(acoustics.router, prefix="/acoustics", tags=["Bioacoustics & PAM"])
api_router.include_router(edna.router, prefix="/edna", tags=["eDNA Metabarcoding"])
api_router.include_router(satellite.router, prefix="/satellite", tags=["Remote Sensing"])
api_router.include_router(surveys.router, prefix="/surveys", tags=["Ground Surveys"])
api_router.include_router(ml.router, prefix="/ml", tags=["Machine Learning"])
