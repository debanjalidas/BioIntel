# BioIntel

> **AI-Powered Biodiversity Intelligence & Ecological Monitoring Platform**

BioIntel fuses satellite remote sensing, passive acoustic monitoring (PAM), environmental DNA (eDNA) metabarcoding, and field survey observations into a unified real-time spatial digital twin.

📖 **For full architecture, workflows, problem breakdown, and solutions, see [PROJECT_DOCUMENTATION.md](file:///c:/My_Project/BioIntel/PROJECT_DOCUMENTATION.md).**

---

## 🌲 Core Capabilities

- **Multi-Modal Data Fusion**: Standardizes Sentinel-2 satellite indices (NDVI/EVI/NDRE), PAM audio spectrograms, eDNA OTU sequencing tables, and GPS field surveys.
- **AI-Powered Audio & Genomic Classifiers**: Instant species call classification and confidence scoring.
- **Real-Time Ecosystem Health Accounting**: Continuous Shannon-Wiener Diversity ($H'$) and quantitative Ecosystem Health Index ($0 - 100$).
- **Early Threat Detection & Dispatch**: Automated alert generation for poaching acoustics, chainsaw noise, deforestation events, and invasive outbreaks.
- **Interactive 3D Digital Twin & GIS Map Explorer**: Visualizes reserve boundaries, sensor nodes, and live environmental telemetry.

---

## 📂 Directory Structure

```
BioIntel/
├── frontend/             # React 18 + Vite + Tailwind CSS application
│   ├── src/
│   │   ├── components/   # UI components (Map, 3D Twin, Charts, StatCards)
│   │   │   └── views/    # Sub-views for all 14 navigation tabs
│   │   └── services/     # bioApi Axios HTTP client
├── backend/
│   ├── app/              # FastAPI application code
│   │   ├── api/v1/       # REST endpoints (species, acoustics, satellite, edna, alerts)
│   │   ├── models/       # SQLAlchemy ORM models
│   │   ├── schemas/      # Pydantic validation schemas
│   │   └── services/     # ML inference and data analytics
│   ├── requirements.txt
│   └── main.py
├── data/                 # Demonstration datasets & spatial assets
│   ├── demo/             # Species catalog, eDNA samples, occurrences
│   ├── audio/            # Bioacoustic PAM recordings
│   └── satellite/        # Vegetation canopy time-series & reserve GeoJSON
├── PROJECT_DOCUMENTATION.md # Detailed architecture and workflow documentation
└── README.md
```

---

## 🚀 Quickstart

### 1. Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows: venv\Scripts\activate | Unix: source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
Backend API will be accessible at: `http://localhost:8000` (Swagger UI: `http://localhost:8000/docs`)

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend UI will be accessible at: `http://localhost:5173`
