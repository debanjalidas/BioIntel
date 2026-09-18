from fastapi import APIRouter
from pydantic import BaseModel
from app.analytics.digital_twin_engine import digital_twin_engine

router = APIRouter()


class SimulationRequestSchema(BaseModel):
    native_vegetation_increase_pct: float = 20.0
    pesticide_reduction_pct: float = 50.0
    invasive_removal_pct: float = 50.0


@router.get("/zones")
def get_campus_zones():
    """Returns real-time telemetry and health status across all 5 campus zones."""
    zones = digital_twin_engine.get_zones()
    return {
        "campus_name": "Delhi Central University Biosphere Campus",
        "total_zones": len(zones),
        "zones": zones,
    }


@router.post("/simulate")
def run_scenario_simulation(payload: SimulationRequestSchema):
    """Simulates hypothetical ecological interventions on campus pollinator and health indicators."""
    result = digital_twin_engine.simulate_scenario(
        native_vegetation_delta_pct=payload.native_vegetation_increase_pct,
        pesticide_reduction_pct=payload.pesticide_reduction_pct,
        invasive_removal_pct=payload.invasive_removal_pct,
    )
    return result
