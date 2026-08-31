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
from geoalchemy2 import Geometry
from app.core.database import Base, TimestampMixin
from app.models.enums import ObservationSource, VerificationStatus

if TYPE_CHECKING:
    from app.models.spatial import MonitoringSite, Zone
    from app.models.species import Species
    from app.models.user import User


class Observation(Base, TimestampMixin):
    """Core multi-modal observation record with spatial point coordinates and verification state."""
    __tablename__ = "observations"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True, index=True)
    
    # Foreign Keys
    site_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("monitoring_sites.id", ondelete="CASCADE"), nullable=False, index=True
    )
    zone_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("zones.id", ondelete="SET NULL"), nullable=True, index=True
    )
    species_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("species.id", ondelete="RESTRICT"), nullable=False, index=True
    )
    observer_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True
    )
    verified_by_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True
    )

    # Spatial Point Geometry (WGS84)
    location: Mapped[Geometry] = mapped_column(
        Geometry(geometry_type="POINT", srid=4326, spatial_index=True),
        nullable=False,
    )

    # Observation details
    observed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, index=True
    )
    confidence: Mapped[float] = mapped_column(
        Float, default=1.0, nullable=False
    )
    source: Mapped[ObservationSource] = mapped_column(
        SQLEnum(ObservationSource, name="observation_source_enum"),
        default=ObservationSource.FIELD_MANUAL,
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
    media_url: Mapped[Optional[str]] = mapped_column(String(1024), nullable=True)
    raw_metadata: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSON, nullable=True)

    # Constraints
    __table_args__ = (
        CheckConstraint("confidence >= 0.0 AND confidence <= 1.0", name="chk_observation_confidence_range"),
        CheckConstraint("count >= 1", name="chk_observation_count_positive"),
    )

    # Relationships
    site: Mapped["MonitoringSite"] = relationship("MonitoringSite", back_populates="observations")
    zone: Mapped[Optional["Zone"]] = relationship("Zone", back_populates="observations")
    species: Mapped["Species"] = relationship("Species", back_populates="observations")
    observer: Mapped[Optional["User"]] = relationship(
        "User", back_populates="observations", foreign_keys=[observer_id]
    )
    verified_by: Mapped[Optional["User"]] = relationship(
        "User", back_populates="verified_observations", foreign_keys=[verified_by_id]
    )

    def __repr__(self) -> str:
        return (
            f"<Observation id={self.id} species_id={self.species_id} "
            f"confidence={self.confidence:.2f} status='{self.verification_status.value}'>"
        )
