from datetime import datetime
from typing import Optional, TYPE_CHECKING
from sqlalchemy import String, Text, Float, Integer, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base, TimestampMixin
from app.models.enums import AlertSeverity, AlertStatus

if TYPE_CHECKING:
    from app.models.species import Species


class RiskAlert(Base, TimestampMixin):
    """Early threat and ecological risk detection alert entity."""
    __tablename__ = "risk_alerts"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True, index=True)
    type: Mapped[str] = mapped_column(String(100), nullable=False, index=True)  # ANOMALY, INVASIVE, HABITAT_DISTURBANCE, etc.
    severity: Mapped[AlertSeverity] = mapped_column(
        SQLEnum(AlertSeverity, name="alert_severity_enum", native_enum=False),
        default=AlertSeverity.MEDIUM,
        nullable=False,
        index=True,
    )
    species_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("species.id", ondelete="SET NULL"), nullable=True, index=True
    )
    location: Mapped[str] = mapped_column(String(255), nullable=False, default="Campus Area")
    description: Mapped[str] = mapped_column(Text, nullable=False)
    evidence: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    confidence: Mapped[float] = mapped_column(Float, default=0.85, nullable=False)
    status: Mapped[AlertStatus] = mapped_column(
        SQLEnum(AlertStatus, name="alert_status_enum", native_enum=False),
        default=AlertStatus.ACTIVE,
        nullable=False,
        index=True,
    )

    # Relationships
    species: Mapped[Optional["Species"]] = relationship("Species")

    def __repr__(self) -> str:
        return f"<RiskAlert id={self.id} type='{self.type}' severity='{self.severity.value}' status='{self.status.value}'>"
