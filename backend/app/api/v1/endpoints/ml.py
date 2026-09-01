from typing import Optional
from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from app.services.ml.inference import ml_engine
from app.services.ml.train_models import train_all_models

router = APIRouter()


class AcousticPredictSchema(BaseModel):
    min_frequency_hz: float = 650.0
    max_frequency_hz: float = 2400.0
    duration_seconds: float = 4.2


class EdnaPredictSchema(BaseModel):
    depth_meters: float = 2.5
    water_temperature_c: float = 22.4
    ph_level: float = 7.4
    dissolved_oxygen_mg_l: float = 8.2
    turbidity_ntu: float = 8.5
    filtration_volume_ml: float = 2500.0


class SatellitePredictSchema(BaseModel):
    ndvi_mean: float = 0.82
    evi_mean: float = 0.58
    ndre_mean: float = 0.44
    canopy_cover_percent: float = 85.0
    surface_temperature_c: float = 24.5
    monthly_precipitation_mm: float = 140.0


@router.post("/predict/acoustic")
def predict_acoustic_species(payload: AcousticPredictSchema):
    """Classify species from acoustic frequency range & vocalization duration."""
    return ml_engine.predict_acoustic(
        min_freq_hz=payload.min_frequency_hz,
        max_freq_hz=payload.max_frequency_hz,
        duration_seconds=payload.duration_seconds
    )


@router.post("/predict/edna")
def predict_edna_biodiversity(payload: EdnaPredictSchema):
    """Predict ecosystem species richness and invasive outbreak risk from water/soil metrics."""
    return ml_engine.predict_edna(
        depth_meters=payload.depth_meters,
        water_temperature_c=payload.water_temperature_c,
        ph_level=payload.ph_level,
        dissolved_oxygen_mg_l=payload.dissolved_oxygen_mg_l,
        turbidity_ntu=payload.turbidity_ntu,
        filtration_volume_ml=payload.filtration_volume_ml
    )


@router.post("/predict/canopy")
def predict_canopy_deforestation(payload: SatellitePredictSchema):
    """Predict deforestation threat alerts and canopy stress level from multi-spectral indices."""
    return ml_engine.predict_satellite_risk(
        ndvi_mean=payload.ndvi_mean,
        evi_mean=payload.evi_mean,
        ndre_mean=payload.ndre_mean,
        canopy_cover_percent=payload.canopy_cover_percent,
        surface_temperature_c=payload.surface_temperature_c,
        monthly_precipitation_mm=payload.monthly_precipitation_mm
    )


@router.post("/train")
def trigger_model_retraining(background_tasks: BackgroundTasks):
    """Trigger retraining of all 3 Machine Learning models across active datasets."""
    try:
        results = train_all_models()
        # Reload models into inference engine
        ml_engine._load_models()
        return {
            "status": "success",
            "message": "All ML models retrained & loaded into memory successfully.",
            "metrics": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Training pipeline error: {str(e)}")
