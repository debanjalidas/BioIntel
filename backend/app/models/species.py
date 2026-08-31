from typing import List, Optional, TYPE_CHECKING
from sqlalchemy import String, Text, Boolean, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.core.database import Base, TimestampMixin
from backend.app.models.enums import ConservationStatus

if TYPE_CHECKING:
    from backend.app.models.observation import Observation
    from backend.app.models.acoustic import AcousticDetection
    from backend.app.models.edna import EdnaDetection


class Species(Base, TimestampMixin):
    """Taxonomic catalog of flora and fauna species monitored in the platform."""
    __tablename__ = "species"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True, index=True)
    scientific_name: Mapped[str] = mapped_column(
        String(255), unique=True, index=True, nullable=False
    )
    common_name: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    taxonomic_group: Mapped[str] = mapped_column(
        String(100), index=True, nullable=False
    )  # e.g. Mammalia, Aves, Reptilia, Amphibia, Plantae, Insecta
    family: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    genus: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    conservation_status: Mapped[ConservationStatus] = mapped_column(
        SQLEnum(ConservationStatus, name="conservation_status_enum"),
        default=ConservationStatus.LC,
        nullable=False,
        index=True,
    )
    iucn_taxon_id: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    is_invasive: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=False, index=True
    )
    is_indicator_species: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=False, index=True
    )
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    image_url: Mapped[Optional[str]] = mapped_column(String(1024), nullable=True)

    # Relationships
    observations: Mapped[List["Observation"]] = relationship(
        "Observation",
        back_populates="species",
    )
    acoustic_detections: Mapped[List["AcousticDetection"]] = relationship(
        "AcousticDetection",
        back_populates="species",
    )
    edna_detections: Mapped[List["EdnaDetection"]] = relationship(
        "EdnaDetection",
        back_populates="species",
    )

    def __repr__(self) -> str:
        return f"<Species id={self.id} scientific_name='{self.scientific_name}' status='{self.conservation_status.value}'>"
