from datetime import datetime, date
from typing import Optional
from sqlalchemy import Float, Integer, String, Date, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base, TimestampMixin


class BiodiversityMetric(Base, TimestampMixin):
    """Historical and aggregated ecosystem health indicators per monitoring area/zone."""
    __tablename__ = "biodiversity_metrics"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True, index=True)
    area: Mapped[str] = mapped_column(String(255), nullable=False, index=True)  # e.g. Campus Overall, Zone A, etc.
    date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    
    species_richness: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    native_species_ratio: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)  # 0.0 to 1.0 (or %)
    habitat_score: Mapped[float] = mapped_column(Float, nullable=False, default=70.0)         # 0.0 to 100.0
    population_stability: Mapped[float] = mapped_column(Float, nullable=False, default=75.0)  # 0.0 to 100.0
    risk_score: Mapped[float] = mapped_column(Float, nullable=False, default=20.0)            # 0.0 to 100.0
    health_score: Mapped[float] = mapped_column(Float, nullable=False, default=78.0)          # 0.0 to 100.0

    def __repr__(self) -> str:
        return f"<BiodiversityMetric area='{self.area}' date='{self.date}' health={self.health_score}>"
