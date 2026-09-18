"""BioIntel Domain Models and Database Entities."""

from app.models.enums import (
    UserRole,
    VerificationStatus,
    ObservationSource,
    ConservationStatus,
    NativeStatus,
    AlertSeverity,
    AlertStatus,
    RiskLevel,
    SiteStatus,
)
from app.models.user import User
from app.models.spatial import Zone, MonitoringSite
from app.models.species import Species
from app.models.observation import Observation
from app.models.environmental_data import EnvironmentalData
from app.models.biodiversity_metric import BiodiversityMetric
from app.models.risk_alert import RiskAlert
from app.models.ai_insight import AIInsight
from app.models.knowledge_document import KnowledgeDocument
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
    "NativeStatus",
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
    "EnvironmentalData",
    "BiodiversityMetric",
    "RiskAlert",
    "AIInsight",
    "KnowledgeDocument",
    "AcousticRecording",
    "AcousticDetection",
    "EdnaSample",
    "EdnaDetection",
    "HabitatMetric",
    "BiodiversityScore",
    "RiskScore",
    "Alert",
]
