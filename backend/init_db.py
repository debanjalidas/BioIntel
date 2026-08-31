"""Database initialization script.
Enables PostGIS extension and creates all database tables.
"""

import sys
import logging
from sqlalchemy import text
from backend.app.core.config import settings
from backend.app.core.database import engine, Base
# Import all models to ensure metadata registration
import backend.app.models  # noqa: F401

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)


def init_database() -> None:
    logger.info("Connecting to database: %s", settings.SQLALCHEMY_DATABASE_URI.split("@")[-1])
    
    with engine.connect() as conn:
        # Enable PostGIS spatial extension
        logger.info("Ensuring PostGIS spatial extension is enabled...")
        conn.execute(text("CREATE EXTENSION IF NOT EXISTS postgis;"))
        conn.commit()
        logger.info("PostGIS extension check complete.")

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
