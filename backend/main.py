import os
import sys

# Ensure backend root is in sys.path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.api.v1.api import api_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="BioIntel API - Biodiversity Intelligence & Early Warning Platform",
    version="0.1.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS if settings.BACKEND_CORS_ORIGINS else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static Audio Files Mount
AUDIO_DIR = os.path.abspath(os.path.join(CURRENT_DIR, "..", "data", "audio"))
if os.path.exists(AUDIO_DIR):
    app.mount("/audio_files", StaticFiles(directory=AUDIO_DIR), name="audio_files")

# Static Species Images Mount
IMAGES_DIR = os.path.abspath(os.path.join(CURRENT_DIR, "..", "frontend", "public", "images"))
if os.path.exists(IMAGES_DIR):
    app.mount("/images", StaticFiles(directory=IMAGES_DIR), name="images")

# Mount API v1 Master Router
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/")
def read_root():
    return {
        "title": settings.PROJECT_NAME,
        "message": "Welcome to BioIntel Multi-Modal AI API",
        "docs": "/docs",
        "api_v1": settings.API_V1_STR,
        "status": "healthy",
    }


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "BioIntel-Core-API"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
