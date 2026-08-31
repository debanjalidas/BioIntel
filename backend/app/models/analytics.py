from datetime import datetime
from typing import Optional, Dict, Any, TYPE_CHECKING
from sqlalchemy import (
    String,
    Text,
    Float,
    Integer,
    DateTime,
    ForeignKey,
    JSON,
    Enum as SQLEnum,
    CheckConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base, TimestampMixin
from app.models.enums import AlertSeverity, AlertStatus, RiskLevel

if TYPE_CHECKING:
    from app.models.spatial import MonitoringSite, Zone
    from app.models.user import User


class HabitatMetric(Base, TimestampMixin):
    """Remote sensing (Sentinel/Landsat) and local environmental sensor metrics."""
    __tablename__ = "habitat_metrics"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True, index=True)
    site_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("monitoring_sites.id", ondelete="CASCADE"), nullable=False, index=True
    )
    zone_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("zones.id", ondelete="SET NULL"), nullable=True, index=True
    )
    recorded_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, index=True
    )
    
    # Vegetation & Water indices
    ndvi: Mapped[Optional[float]] = mapped_column(Float, nullable=True)  # Range -1.0 to 1.0
    ndwi: Mapped[Optional[float]] = mapped_column(Float, nullable=True)  # Range -1.0 to 1.0
    evi: Mapped[Optional[float]] = mapped_column(Float, nullable=True)   # Enhanced Vegetation Index
    canopy_cover_pct: Mapped[Optional[float]] = mapped_column(Float, nullable=True)  # 0.0 to 100.0%
    surface_temp_c: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    precipitation_mm: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    data_source: Mapped[Optional[str]] = mapped_column(
        String(100), nullable=True
    )  # e.g. Sentinel-2, Landsat-9, ERA5, IoT Weather
    raw_metrics: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSON, nullable=True)

    # Relationships
    site: Mapped["MonitoringSite"] = relationship("MonitoringSite", back_populates="habitat_metrics")
    zone: Mapped[Optional["Zone"]] = relationship("Zone", back_populates="habitat_metrics")

    def __repr__(self) -> str:
        return f"<HabitatMetric id={self.id} site_id={self.site_id} ndvi={self.ndvi} date='{self.recorded_at}'>"


class BiodiversityScore(Base, TimestampMixin):
    """Ecological biodiversity metrics calculated periodically per site or zone."""
    __tablename__ = "biodiversity_scores"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True, index=True)
    site_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("monitoring_sites.id", ondelete="CASCADE"), nullable=False, index=True
    )
    zone_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("zones.id", ondelete="SET NULL"), nullable=True, index=True
    )
    calculated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, index=True
    )

    species_richness: Mapped[int] = mapped_column(Integer, nullable=False)  # Total distinct species count
    shannon_index: Mapped[float] = mapped_column(Float, nullable=False)     # H'
    simpson_index: Mapped[float] = mapped_column(Float, nullable=False)     # 1 - D
    evenness_score: Mapped[float] = mapped_column(Float, nullable=False)    # Pielou's J (0.0 to 1.0)
    overall_bio_score: Mapped[float] = mapped_column(
        Float, nullable=False, index=True
    )  # Normalized 0.0 - 100.0 score
    taxa_breakdown: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSON, nullable=True)

    __table_args__ = (
        CheckConstraint("overall_bio_score >= 0.0 AND overall_bio_score <= 100.0", name="chk_overall_bio_score"),
        CheckConstraint("species_richness >= 0", name="chk_species_richness_non_negative"),
    )

    # Relationships
    site: Mapped["MonitoringSite"] = relationship("MonitoringSite", back_populates="biodiversity_scores")
    zone: Mapped[Optional["Zone"]] = relationship("Zone", back_populates="biodiversity_scores")

    def __repr__(self) -> str:
        return f"<BiodiversityScore id={self.id} site_id={self.site_id} score={self.overall_bio_score:.1f}>"


class RiskScore(Base, TimestampMixin):
    """Predictive environmental and ecological threat risk evaluation."""
    __tablename__ = "risk_scores"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True, index=True)
    site_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("monitoring_sites.id", ondelete="CASCADE"), nullable=False, index=True
    )
    zone_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("zones.id", ondelete="SET NULL"), nullable=True, index=True
    )
    calculated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, index=True
    )

    # Threat Components (normalized 0.0 to 1.0)
    habitat_degradation_risk: Mapped[float] = mapped_column(Float, nullable=False)
    poaching_threat_risk: Mapped[float] = mapped_column(Float, nullable=False)
    climate_stress_risk: Mapped[float] = mapped_column(Float, nullable=False)
    invasive_species_risk: Mapped[float] = mapped_column(Float, nullable=False)
    
    # Composite Risk Score (0.0 to 100.0)
    overall_risk_score: Mapped[float] = mapped_column(Float, nullable=False, index=True)
    risk_level: Mapped[RiskLevel] = mapped_column(
        SQLEnum(RiskLevel, name="analytics_risk_level_enum"),
        default=RiskLevel.LOW,
        nullable=False,
        index=True,
    )
    factors: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSON, nullable=True)

    __table_args__ = (
        CheckConstraint("overall_risk_score >= 0.0 AND overall_risk_score <= 100.0", name="chk_overall_risk_score"),
    )

    # Relationships
    site: Mapped["MonitoringSite"] = relationship("MonitoringSite", back_populates="risk_scores")
    zone: Mapped[Optional["Zone"]] = relationship("Zone", back_populates="risk_scores")

    def __repr__(self) -> str:
        return f"<RiskScore id={self.id} site_id={self.site_id} score={self.overall_risk_score:.1f} level='{self.risk_level.value}'>"


class Alert(Base, TimestampMixin):
    """Real-time early warning system alerts triggered by acoustic, eDNA, or remote sensing anomalies."""
    __tablename__ = "alerts"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True, index=True)
    site_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("monitoring_sites.id", ondelete="CASCADE"), nullable=False, index=True
    )
    zone_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("zones.id", ondelete="SET NULL"), nullable=True, index=True
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    alert_type: Mapped[str] = mapped_column(
        String(100), nullable=False, index=True
    )  # e.g., DEFORESTATION_ANOMALY, POACHING_GUNSHOT_DETECTED, INVASIVE_SPECIES_SURGE, CRITICAL_HABITAT_LOSS
    severity: Mapped[AlertSeverity] = mapped_column(
        SQLEnum(AlertSeverity, name="alert_severity_enum"),
        default=AlertSeverity.MEDIUM,
        nullable=False,
        index=True,
    )
    status: Mapped[AlertStatus] = mapped_column(
        SQLEnum(AlertStatus, name="alert_status_enum"),
        default=AlertStatus.ACTIVE,
        nullable=False,
        index=True,
    )
    triggered_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, index=True
    )
    acknowledged_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    resolved_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    resolved_by_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    metadata_info: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSON, nullable=True)

    # Relationships
    site: Mapped["MonitoringSite"] = relationship("MonitoringSite", back_populates="alerts")
    zone: Mapped[Optional["Zone"]] = relationship("Zone", back_populates="alerts")
    resolved_by: Mapped[Optional["User"]] = relationship("User", back_populates="resolved_alerts")

    def __repr__(self) -> str:
        return f"<Alert id={self.id} type='{self.alert_type}' severity='{self.severity.value}' status='{self.status.value}'>"
