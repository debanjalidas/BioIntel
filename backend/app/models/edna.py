from datetime import datetime
from typing import List, Optional, TYPE_CHECKING
from sqlalchemy import (
    String,
    Text,
    Float,
    Integer,
    DateTime,
    ForeignKey,
    Enum as SQLEnum,
    CheckConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base, TimestampMixin
from app.models.enums import VerificationStatus

if TYPE_CHECKING:
    from app.models.spatial import MonitoringSite
    from app.models.species import Species
    from app.models.user import User


class EdnaSample(Base, TimestampMixin):
    """Environmental DNA field collection sample record."""
    __tablename__ = "edna_samples"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True, index=True)
    site_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("monitoring_sites.id", ondelete="CASCADE"), nullable=False, index=True
    )
    sample_code: Mapped[str] = mapped_column(
        String(100), unique=True, nullable=False, index=True
    )
    collected_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, index=True
    )
    collector_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    depth_meters: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    water_temperature_c: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    ph_level: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    dissolved_oxygen_mg_l: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    filtration_volume_ml: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    extraction_date: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    sequencing_platform: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    sequencing_run_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Relationships
    site: Mapped["MonitoringSite"] = relationship("MonitoringSite", back_populates="edna_samples")
    collector: Mapped[Optional["User"]] = relationship("User", back_populates="edna_samples")
    detections: Mapped[List["EdnaDetection"]] = relationship(
        "EdnaDetection",
        back_populates="sample",
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        return f"<EdnaSample id={self.id} code='{self.sample_code}' collected='{self.collected_at}'>"


class EdnaDetection(Base, TimestampMixin):
    """eDNA OTU / ASV metabarcoding taxonomic identification detection."""
    __tablename__ = "edna_detections"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True, index=True)
    sample_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("edna_samples.id", ondelete="CASCADE"), nullable=False, index=True
    )
    species_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("species.id", ondelete="RESTRICT"), nullable=False, index=True
    )
    read_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    relative_abundance: Mapped[float] = mapped_column(
        Float, nullable=False
    )  # Fractional abundance within sample (0.0 to 1.0)
    sequence_match_identity: Mapped[float] = mapped_column(
        Float, nullable=False
    )  # e.g., 99.8% match to reference library
    primer_target: Mapped[Optional[str]] = mapped_column(
        String(50), nullable=True
    )  # e.g. 12S, 16S, COI, ITS
    verification_status: Mapped[VerificationStatus] = mapped_column(
        SQLEnum(VerificationStatus, name="edna_verification_status_enum"),
        default=VerificationStatus.VERIFIED_AI,
        nullable=False,
        index=True,
    )

    __table_args__ = (
        CheckConstraint("relative_abundance >= 0.0 AND relative_abundance <= 1.0", name="chk_edna_relative_abundance"),
        CheckConstraint("sequence_match_identity >= 0.0 AND sequence_match_identity <= 100.0", name="chk_edna_match_identity"),
        CheckConstraint("read_count >= 0", name="chk_edna_read_count_positive"),
    )

    # Relationships
    sample: Mapped["EdnaSample"] = relationship("EdnaSample", back_populates="detections")
    species: Mapped["Species"] = relationship("Species", back_populates="edna_detections")

    def __repr__(self) -> str:
        return (
            f"<EdnaDetection id={self.id} species_id={self.species_id} "
            f"reads={self.read_count} identity={self.sequence_match_identity}%>"
        )
