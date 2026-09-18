import enum


class UserRole(str, enum.Enum):
    ADMIN = "ADMIN"
    RESEARCHER = "RESEARCHER"
    OBSERVER = "OBSERVER"
    FIELD_AGENT = "FIELD_AGENT"
    VIEWER = "VIEWER"


class VerificationStatus(str, enum.Enum):
    UNVERIFIED = "UNVERIFIED"
    VERIFIED = "VERIFIED"
    VERIFIED_AI = "VERIFIED_AI"
    VERIFIED_EXPERT = "VERIFIED_EXPERT"
    REJECTED = "REJECTED"


class ObservationSource(str, enum.Enum):
    FIELD_MANUAL = "FIELD_MANUAL"
    CAMERA_TRAP = "CAMERA_TRAP"
    ACOUSTIC = "ACOUSTIC"
    EDNA = "EDNA"
    SATELLITE = "SATELLITE"
    COMMUNITY = "COMMUNITY"


class ConservationStatus(str, enum.Enum):
    LC = "LC"  # Least Concern
    NT = "NT"  # Near Threatened
    VU = "VU"  # Vulnerable
    EN = "EN"  # Endangered
    CR = "CR"  # Critically Endangered
    EW = "EW"  # Extinct in the Wild
    EX = "EX"  # Extinct
    DD = "DD"  # Data Deficient
    NE = "NE"  # Not Evaluated


class NativeStatus(str, enum.Enum):
    NATIVE = "NATIVE"
    INTRODUCED = "INTRODUCED"
    INVASIVE = "INVASIVE"
    POTENTIAL_INVASIVE = "POTENTIAL_INVASIVE"


class AlertSeverity(str, enum.Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class AlertStatus(str, enum.Enum):
    ACTIVE = "ACTIVE"
    ACKNOWLEDGED = "ACKNOWLEDGED"
    RESOLVED = "RESOLVED"
    DISMISSED = "DISMISSED"


class RiskLevel(str, enum.Enum):
    LOW = "LOW"
    MODERATE = "MODERATE"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class SiteStatus(str, enum.Enum):
    ACTIVE = "ACTIVE"
    INACTIVE = "INACTIVE"
    MAINTENANCE = "MAINTENANCE"
    DECOMMISSIONED = "DECOMMISSIONED"
