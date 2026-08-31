from datetime import datetime, timezone
from typing import Generator
from sqlalchemy import create_engine, DateTime, func
from sqlalchemy.orm import declarative_base, sessionmaker, scoped_session, Mapped, mapped_column
from app.core.config import settings

# Engine configuration with connection recycling and health check
engine = create_engine(
    settings.SQLALCHEMY_DATABASE_URI,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
    echo=False,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class TimestampMixin:
    """Standard audit timestamps for all database entities."""
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
        index=True,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )


def get_db() -> Generator:
    """FastAPI dependency for yielding database session with clean closure."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
