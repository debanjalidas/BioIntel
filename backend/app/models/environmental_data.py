from datetime import datetime
from typing import Optional, TYPE_CHECKING
from sqlalchemy import Float, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base, TimestampMixin

if TYPE_CHECKING:
    from app.models.observation import Observation


class EnvironmentalData(Base, TimestampMixin):
    """Environmental context readings associated with observations or sensor intervals."""
    __tablename__ = "environmental_data"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True, index=True)
    observation_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("observations.id", ondelete="CASCADE"), nullable=True, index=True
    )
    temperature: Mapped[Optional[float]] = mapped_column(Float, nullable=True)  # in Celsius
    humidity: Mapped[Optional[float]] = mapped_column(Float, nullable=True)     # in %
    rainfall: Mapped[Optional[float]] = mapped_column(Float, nullable=True)     # in mm
    weather_condition: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)  # Sunny, Rainy, Overcast, etc.
    vegetation_indicator: Mapped[Optional[float]] = mapped_column(Float, nullable=True)   # NDVI (0.0 to 1.0)

    # Relationships
    observation: Mapped[Optional["Observation"]] = relationship(
        "Observation", back_populates="environmental_data"
    )

    def __repr__(self) -> str:
        return f"<EnvironmentalData id={self.id} temp={self.temperature}°C hum={self.humidity}% rain={self.rainfall}mm>"
