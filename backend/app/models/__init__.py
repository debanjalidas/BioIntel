"""BioIntel Domain Models and Database Entities."""

from backend.app.models.enums import (
    UserRole,
    VerificationStatus,
    ObservationSource,
    ConservationStatus,
    AlertSeverity,
    AlertStatus,
    RiskLevel,
    SiteStatus,
)
from backend.app.models.user import User
from backend.app.models.spatial import Zone, MonitoringSite
from backend.app.models.species import Species
from backend.app.models.observation import Observation
from backend.app.models.acoustic import AcousticRecording, AcousticDetection
from backend.app.models.edna import EdnaSample, EdnaDetection
from backend.app.models.analytics import (
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
