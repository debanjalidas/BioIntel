from typing import List, TYPE_CHECKING
from sqlalchemy import String, Boolean, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.core.database import Base, TimestampMixin
from backend.app.models.enums import UserRole

if TYPE_CHECKING:
    from backend.app.models.observation import Observation
    from backend.app.models.edna import EdnaSample
    from backend.app.models.acoustic import AcousticDetection
    from backend.app.models.analytics import Alert


class User(Base, TimestampMixin):
    """User account model with role-based access controls."""
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=True)
    role: Mapped[UserRole] = mapped_column(
        SQLEnum(UserRole, name="user_role_enum"),
        default=UserRole.FIELD_AGENT,
        nullable=False,
    )
    organization: Mapped[str] = mapped_column(String(255), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_superuser: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    # Relationships
    observations: Mapped[List["Observation"]] = relationship(
        "Observation",
        back_populates="observer",
        foreign_keys="Observation.observer_id",
        cascade="all, delete-orphan",
    )
    verified_observations: Mapped[List["Observation"]] = relationship(
        "Observation",
        back_populates="verified_by",
        foreign_keys="Observation.verified_by_id",
    )
    edna_samples: Mapped[List["EdnaSample"]] = relationship(
        "EdnaSample",
        back_populates="collector",
        foreign_keys="EdnaSample.collector_id",
    )
    verified_acoustic_detections: Mapped[List["AcousticDetection"]] = relationship(
        "AcousticDetection",
        back_populates="verified_by",
        foreign_keys="AcousticDetection.verified_by_id",
    )
    resolved_alerts: Mapped[List["Alert"]] = relationship(
        "Alert",
        back_populates="resolved_by",
        foreign_keys="Alert.resolved_by_id",
    )

    def __repr__(self) -> str:
        return f"<User id={self.id} email='{self.email}' role='{self.role.value}'>"
