# BioIntel

AI-Powered Biodiversity Intelligence & Ecological Monitoring Platform.

## Directory Structure

```
BioIntel/
├── frontend/             # React + Vite application
├── backend/
│   ├── app/              # FastAPI application code
│   │   ├── api/          # Route handlers
│   │   ├── models/       # SQLAlchemy ORM models
│   │   ├── schemas/      # Pydantic schemas
│   │   ├── services/     # Business logic & ML integration
│   │   └── core/         # Config, DB setup, Auth
│   ├── requirements.txt
│   └── main.py
├── data/                 # Local data storage
│   ├── demo/             # Seed files (eDNA CSVs, etc.)
│   ├── audio/            # Uploaded acoustic files
│   └── satellite/        # GeoTIFFs / metric CSVs
└── README.md
```

## Quickstart

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```
