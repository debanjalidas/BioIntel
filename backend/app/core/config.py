import os
from typing import List, Union, Optional
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "BioIntel"
    PROJECT_TAGLINE: str = "Observe → Understand → Protect"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "biointel_super_secret_jwt_key_change_in_production_987654321"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    ALGORITHM: str = "HS256"

    # Operating Mode & Providers
    MODE: str = "demo"  # "demo" or "production"
    AI_PROVIDER: str = "mock"  # "mock", "ibm_granite", "huggingface"
    LLM_PROVIDER: str = "mock"  # "mock", "granite", "openai"
    WEATHER_PROVIDER: str = "mock"  # "mock", "openweather"
    MAP_PROVIDER: str = "openstreetmap"

    # Database Configuration (PostgreSQL with automatic SQLite fallback)
    USE_SQLITE: bool = True  # Default to SQLite for zero-config seamless demo
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "biointel_db"
    DATABASE_URL: Optional[str] = None

    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, list):
            return v
        return []

    @property
    def SQLALCHEMY_DATABASE_URI(self) -> str:
        if self.DATABASE_URL:
            return self.DATABASE_URL
        if self.USE_SQLITE or self.MODE == "demo":
            # Store SQLite database in backend directory
            db_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
            sqlite_path = os.path.join(db_dir, "biointel.db")
            return f"sqlite:///{sqlite_path}"
        return (
            f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()
