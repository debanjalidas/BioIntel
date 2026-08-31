from typing import List, Optional, TYPE_CHECKING
from sqlalchemy import String, Text, Float, Integer, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from geoalchemy2 import Geometry
from app.core.database import Base, TimestampMixin
from app.models.enums import RiskLevel, SiteStatus

if TYPE_CHECKING:
    from app.models.observation import Observation
    from app.models.acoustic import AcousticRecording
    from app.models.edna import EdnaSample
    from app.models.analytics import HabitatMetric, BiodiversityScore, RiskScore, Alert


class Zone(Base, TimestampMixin):
    """Conservation zone or protected area defined by a polygon geometry."""
    __tablename__ = "zones"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    code: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Polygon boundary in WGS84 (SRID 4326)
    boundary: Mapped[Geometry] = mapped_column(
        Geometry(geometry_type="POLYGON", srid=4326, spatial_index=True),
        nullable=False,
    )
    area_hectares: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    risk_level: Mapped[RiskLevel] = mapped_column(
        SQLEnum(RiskLevel, name="risk_level_enum"),
        default=RiskLevel.LOW,
        nullable=False,
    )

    # Relationships
    monitoring_sites: Mapped[List["MonitoringSite"]] = relationship(
        "MonitoringSite",
        back_populates="zone",
        cascade="all, delete-orphan",
    )
    observations: Mapped[List["Observation"]] = relationship(
        "Observation",
        back_populates="zone",
    )
    habitat_metrics: Mapped[List["HabitatMetric"]] = relationship(
        "HabitatMetric",
        back_populates="zone",
    )
    biodiversity_scores: Mapped[List["BiodiversityScore"]] = relationship(
        "BiodiversityScore",
        back_populates="zone",
    )
    risk_scores: Mapped[List["RiskScore"]] = relationship(
        "RiskScore",
        back_populates="zone",
    )
    alerts: Mapped[List["Alert"]] = relationship(
        "Alert",
        back_populates="zone",
    )

    def __repr__(self) -> str:
        return f"<Zone id={self.id} code='{self.code}' name='{self.name}'>"


class MonitoringSite(Base, TimestampMixin):
    """Specific point location for sensors, field visits, cameras, and sample gathering."""
    __tablename__ = "monitoring_sites"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    code: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Point location in WGS84 (SRID 4326)
    location: Mapped[Geometry] = mapped_column(
        Geometry(geometry_type="POINT", srid=4326, spatial_index=True),
        nullable=False,
    )
    zone_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("zones.id", ondelete="SET NULL"), nullable=True, index=True
    )
    elevation_meters: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    habitat_type: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    status: Mapped[SiteStatus] = mapped_column(
        SQLEnum(SiteStatus, name="site_status_enum"),
        default=SiteStatus.ACTIVE,
        nullable=False,
    )

    # Relationships
    zone: Mapped[Optional["Zone"]] = relationship("Zone", back_populates="monitoring_sites")
    observations: Mapped[List["Observation"]] = relationship(
        "Observation",
        back_populates="site",
        cascade="all, delete-orphan",
    )
    acoustic_recordings: Mapped[List["AcousticRecording"]] = relationship(
        "AcousticRecording",
        back_populates="site",
        cascade="all, delete-orphan",
    )
    edna_samples: Mapped[List["EdnaSample"]] = relationship(
        "EdnaSample",
        back_populates="site",
        cascade="all, delete-orphan",
    )
    habitat_metrics: Mapped[List["HabitatMetric"]] = relationship(
        "HabitatMetric",
        back_populates="site",
        cascade="all, delete-orphan",
    )
    biodiversity_scores: Mapped[List["BiodiversityScore"]] = relationship(
        "BiodiversityScore",
        back_populates="site",
        cascade="all, delete-orphan",
    )
    risk_scores: Mapped[List["RiskScore"]] = relationship(
        "RiskScore",
        back_populates="site",
        cascade="all, delete-orphan",
    )
    alerts: Mapped[List["Alert"]] = relationship(
        "Alert",
        back_populates="site",
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        return f"<MonitoringSite id={self.id} code='{self.code}' name='{self.name}'>"
