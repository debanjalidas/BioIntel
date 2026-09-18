"""Cross-engine spatial compatibility layer.
Ensures models work seamlessly on both PostgreSQL (with PostGIS) and SQLite.
"""

from sqlalchemy import TypeDecorator, Text, Float
import json


class GeoJSONGeometry(TypeDecorator):
    """Stores GeoJSON string representation in SQLite / Postgres text,
    providing transparent dict-to-string serialization."""
    impl = Text
    cache_ok = True

    def process_bind_param(self, value, dialect):
        if value is None:
            return None
        if isinstance(value, (dict, list)):
            return json.dumps(value)
        return str(value)

    def process_result_value(self, value, dialect):
        if value is None:
            return None
        try:
            return json.loads(value)
        except Exception:
            return value
