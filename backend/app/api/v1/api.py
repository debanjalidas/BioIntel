from fastapi import APIRouter
from app.api.v1.endpoints import (
    species,
    edna,
    acoustics,
    satellite,
    surveys,
    alerts,
    analytics,
    ml,
    reports
)

api_router = APIRouter()

api_router.include_router(species.router, prefix="/species", tags=["Species Catalog"])
api_router.include_router(edna.router, prefix="/edna", tags=["eDNA Metabarcoding"])
api_router.include_router(acoustics.router, prefix="/acoustics", tags=["Bioacoustics & PAM"])
api_router.include_router(satellite.router, prefix="/satellite", tags=["Remote Sensing"])
api_router.include_router(surveys.router, prefix="/surveys", tags=["Ground Surveys"])
api_router.include_router(alerts.router, prefix="/alerts", tags=["Threat Alerts"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["Platform Analytics"])
api_router.include_router(ml.router, prefix="/ml", tags=["Machine Learning"])
api_router.include_router(reports.router, prefix="/reports", tags=["Executive Reports"])
