"""Database initialization script.
Enables PostGIS extension (on PostgreSQL) and creates all database tables.
"""

import os
import sys
import logging

# Ensure backend root is always in sys.path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

from sqlalchemy import text
from app.core.config import settings
from app.core.database import engine, Base
# Import all models to ensure metadata registration
import app.models  # noqa: F401

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)


def init_database() -> None:
    db_target = settings.SQLALCHEMY_DATABASE_URI.split("@")[-1] if "@" in settings.SQLALCHEMY_DATABASE_URI else "local"
    logger.info("Connecting to database: %s", db_target)
    
    if engine.dialect.name == "postgresql":
        with engine.connect() as conn:
            logger.info("Ensuring PostGIS spatial extension is enabled on PostgreSQL...")
            try:
                conn.execute(text("CREATE EXTENSION IF NOT EXISTS postgis;"))
                conn.commit()
                logger.info("PostGIS extension check complete.")
            except Exception as e:
                logger.warning("Could not enable PostGIS extension (may require superuser): %s", e)
    else:
        logger.info("Using SQLite dialect with native GeoJSON compatibility layer.")

    logger.info("Creating all database tables...")
    Base.metadata.create_all(bind=engine)
    logger.info("All tables created successfully.")
    
    # List created tables
    from sqlalchemy import inspect
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    logger.info("Discovered tables in database (%d): %s", len(tables), ", ".join(tables))


if __name__ == "__main__":
    try:
        init_database()
        print("\nDatabase initialization completed successfully!")
    except Exception as e:
        logger.error("Failed to initialize database: %s", e)
        sys.exit(1)
