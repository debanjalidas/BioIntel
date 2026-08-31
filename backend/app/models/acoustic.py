from datetime import datetime
from typing import List, Optional, TYPE_CHECKING
from sqlalchemy import (
    String,
    Text,
    Float,
    Integer,
    Boolean,
    DateTime,
    ForeignKey,
    Enum as SQLEnum,
    CheckConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.core.database import Base, TimestampMixin
from backend.app.models.enums import VerificationStatus

if TYPE_CHECKING:
    from backend.app.models.spatial import MonitoringSite
    from backend.app.models.species import Species
    from backend.app.models.user import User


class AcousticRecording(Base, TimestampMixin):
    """Raw passive acoustic monitoring (PAM) audio file metadata."""
    __tablename__ = "acoustic_recordings"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True, index=True)
    site_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("monitoring_sites.id", ondelete="CASCADE"), nullable=False, index=True
    )
    file_name: Mapped[str] = mapped_column(String(255), nullable=False)
    file_path: Mapped[str] = mapped_column(String(1024), nullable=False)
    duration_seconds: Mapped[float] = mapped_column(Float, nullable=False)
    sample_rate_hz: Mapped[int] = mapped_column(Integer, default=44100, nullable=False)
    channels: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    device_model: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    recorded_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, index=True
    )
    is_processed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False, index=True)
    spectrogram_url: Mapped[Optional[str]] = mapped_column(String(1024), nullable=True)

    # Relationships
    site: Mapped["MonitoringSite"] = relationship("MonitoringSite", back_populates="acoustic_recordings")
    detections: Mapped[List["AcousticDetection"]] = relationship(
        "AcousticDetection",
        back_populates="recording",
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        return f"<AcousticRecording id={self.id} file='{self.file_name}' duration={self.duration_seconds}s>"


class AcousticDetection(Base, TimestampMixin):
    """Bioacoustic species vocalization detection result from ML models (e.g. BirdNET, Perch)."""
    __tablename__ = "acoustic_detections"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True, index=True)
    recording_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("acoustic_recordings.id", ondelete="CASCADE"), nullable=False, index=True
    )
    species_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("species.id", ondelete="RESTRICT"), nullable=False, index=True
    )
    start_time_seconds: Mapped[float] = mapped_column(Float, nullable=False)
    end_time_seconds: Mapped[float] = mapped_column(Float, nullable=False)
    min_frequency_hz: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    max_frequency_hz: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    confidence: Mapped[float] = mapped_column(Float, nullable=False, index=True)
    verification_status: Mapped[VerificationStatus] = mapped_column(
        SQLEnum(VerificationStatus, name="acoustic_verification_status_enum"),
        default=VerificationStatus.VERIFIED_AI,
        nullable=False,
        index=True,
    )
    verified_by_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    __table_args__ = (
        CheckConstraint("confidence >= 0.0 AND confidence <= 1.0", name="chk_acoustic_confidence_range"),
        CheckConstraint("end_time_seconds >= start_time_seconds", name="chk_acoustic_time_interval"),
    )

    # Relationships
    recording: Mapped["AcousticRecording"] = relationship("AcousticRecording", back_populates="detections")
    species: Mapped["Species"] = relationship("Species", back_populates="acoustic_detections")
    verified_by: Mapped[Optional["User"]] = relationship(
        "User", back_populates="verified_acoustic_detections", foreign_keys=[verified_by_id]
    )

    def __repr__(self) -> str:
        return (
            f"<AcousticDetection id={self.id} species_id={self.species_id} "
            f"time={self.start_time_seconds:.1f}-{self.end_time_seconds:.1f}s conf={self.confidence:.2f}>"
        )
