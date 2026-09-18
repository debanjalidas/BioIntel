from datetime import datetime
from typing import Optional, Dict, Any, List, TYPE_CHECKING
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
from app.core.spatial_compat import GeoJSONGeometry
from app.models.enums import ObservationSource, VerificationStatus

if TYPE_CHECKING:
    from app.models.spatial import MonitoringSite, Zone
    from app.models.species import Species
    from app.models.user import User
    from app.models.environmental_data import EnvironmentalData


class Observation(Base, TimestampMixin):
    """Core biodiversity observation record supporting image uploads, AI classification and verification."""
    __tablename__ = "observations"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True, index=True)
    
    # Foreign Keys
    species_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("species.id", ondelete="RESTRICT"), nullable=False, index=True
    )
    observer_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True
    )
    verified_by_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True
    )
    site_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("monitoring_sites.id", ondelete="SET NULL"), nullable=True, index=True
    )
    zone_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("zones.id", ondelete="SET NULL"), nullable=True, index=True
    )

    # Coordinates & Location
    latitude: Mapped[float] = mapped_column(Float, nullable=False, default=28.5450, index=True)
    longitude: Mapped[float] = mapped_column(Float, nullable=False, default=77.1926, index=True)
    location_name: Mapped[str] = mapped_column(String(255), default="Campus Central Reserve", nullable=False)
    habitat: Mapped[Optional[str]] = mapped_column(String(255), default="Garden", nullable=True)
    location_geom: Mapped[Optional[str]] = mapped_column(GeoJSONGeometry, nullable=True)

    # Observation details
    observed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, index=True, default=datetime.utcnow
    )
    ai_confidence: Mapped[float] = mapped_column(
        Float, default=0.90, nullable=False
    )
    source: Mapped[ObservationSource] = mapped_column(
        SQLEnum(ObservationSource, name="observation_source_enum"),
        default=ObservationSource.COMMUNITY,
        nullable=False,
        index=True,
    )
    verification_status: Mapped[VerificationStatus] = mapped_column(
        SQLEnum(VerificationStatus, name="verification_status_enum"),
        default=VerificationStatus.UNVERIFIED,
        nullable=False,
        index=True,
    )
    verified_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    count: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    image_url: Mapped[Optional[str]] = mapped_column(String(1024), nullable=True)
    raw_metadata: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSON, nullable=True)

    @property
    def confidence(self) -> float:
        return self.ai_confidence

    @confidence.setter
    def confidence(self, val: float):
        self.ai_confidence = val

    # Relationships
    species: Mapped["Species"] = relationship("Species", back_populates="observations")
    observer: Mapped[Optional["User"]] = relationship(
        "User", back_populates="observations", foreign_keys=[observer_id]
    )
    verified_by: Mapped[Optional["User"]] = relationship(
        "User", back_populates="verified_observations", foreign_keys=[verified_by_id]
    )
    site: Mapped[Optional["MonitoringSite"]] = relationship("MonitoringSite", back_populates="observations")
    zone: Mapped[Optional["Zone"]] = relationship("Zone", back_populates="observations")
    environmental_data: Mapped[List["EnvironmentalData"]] = relationship(
        "EnvironmentalData", back_populates="observation", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return (
            f"<Observation id={self.id} species_id={self.species_id} "
            f"confidence={self.ai_confidence:.2f} status='{self.verification_status.value}'>"
        )
