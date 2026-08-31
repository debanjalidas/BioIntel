"""BioIntel Domain Models and Database Entities."""

from app.models.enums import (
    UserRole,
    VerificationStatus,
    ObservationSource,
    ConservationStatus,
    AlertSeverity,
    AlertStatus,
    RiskLevel,
    SiteStatus,
)
from app.models.user import User
from app.models.spatial import Zone, MonitoringSite
from app.models.species import Species
from app.models.observation import Observation
from app.models.acoustic import AcousticRecording, AcousticDetection
from app.models.edna import EdnaSample, EdnaDetection
from app.models.analytics import (
    HabitatMetric,
    BiodiversityScore,
    RiskScore,
    Alert,
)

__all__ = [
    # Enums
    "UserRole",
    "VerificationStatus",
    "ObservationSource",
    "ConservationStatus",
    "AlertSeverity",
    "AlertStatus",
    "RiskLevel",
    "SiteStatus",
    # Models
    "User",
    "Zone",
    "MonitoringSite",
    "Species",
    "Observation",
    "AcousticRecording",
    "AcousticDetection",
    "EdnaSample",
    "EdnaDetection",
    "HabitatMetric",
    "BiodiversityScore",
    "RiskScore",
    "Alert",
]
