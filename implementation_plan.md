# Implementation Plan — BioIntel: AI-Powered Biodiversity Monitoring & Ecosystem Health Insights

Build a production-quality, end-to-end working prototype of **BioIntel** for the **AI for Sustainability Virtual Internship (1M1B in collaboration with IBM SkillsBuild & AICTE)**, aligning with **UN SDG 15 (Life on Land)** under the tagline **"Observe → Understand → Protect"**.

---

## User Review Required

> [!IMPORTANT]
> **Project Branding & Scope**:
> - The project is confirmed as **BioIntel** with tagline *"Observe → Understand → Protect"*.
> - Focus: **College Campus Biodiversity Monitoring** across 5 distinct zones (*Zone A — Garden*, *Zone B — Pond*, *Zone C — Lawn*, *Zone D — Woodland*, *Zone E — Academic Area*), architected for expansion to urban parks, wetlands, and forests.
> - **Zero-friction Demo Mode**: The application will run immediately out-of-the-box using SQLite fallback (with automatic PostgreSQL/PostGIS support if available), pre-seeded with 60+ species, 350+ campus observations, historical trends, alerts, and RAG knowledge documents.

> [!NOTE]
> **Preserving and Elevating Existing Code**:
> The existing codebase contains useful foundations (React Vite frontend, FastAPI backend, acoustic ML predictor, and initial schemas). We will refactor and elevate it into the complete, professional BioIntel platform specified in the Master Build Prompt without losing existing functionality.

---

## Proposed Changes

### Backend (`backend/app/`)

#### [MODIFY] [`backend/app/core/config.py`](file:///c:/My_Project/BioIntel/backend/app/core/config.py)
- Support `MODE` (`demo` vs `production`), `AI_PROVIDER` (`mock`, `ibm_granite`, `huggingface`), `LLM_PROVIDER` (`mock`, `granite`), `WEATHER_PROVIDER` (`mock`, `openweather`).
- Add intelligent database URL fallback: if PostgreSQL fails or SQLite is configured, default to `sqlite:///./biointel.db`.

#### [MODIFY] [`backend/app/core/database.py`](file:///c:/My_Project/BioIntel/backend/app/core/database.py)
- Ensure engine handles SQLite connection arguments (e.g. `check_same_thread=False`) and graceful fallback when PostGIS is not present.

#### [MODIFY] Models Layer (`backend/app/models/`)
- Implement all required entities from Master Prompt:
  - [`user.py`](file:///c:/My_Project/BioIntel/backend/app/models/user.py): `User` (id, name, email, role [Admin, Researcher, Observer], created_at).
  - [`species.py`](file:///c:/My_Project/BioIntel/backend/app/models/species.py): `Species` (id, common_name, scientific_name, category [birds, mammals, insects, plants, reptiles, amphibians, butterflies, other], habitat, native_status [native, introduced, invasive], conservation_status [CR, EN, VU, NT, LC], description, image, source).
  - [`observation.py`](file:///c:/My_Project/BioIntel/backend/app/models/observation.py): `Observation` (id, species_id, observer_id, image_url, latitude, longitude, location_name, habitat, observed_at, ai_confidence, verification_status [UNVERIFIED, VERIFIED, REJECTED], notes, created_at). Compatible with both SQLite (Float lat/lng) and PostgreSQL.
  - [NEW] [`environmental_data.py`](file:///c:/My_Project/BioIntel/backend/app/models/environmental_data.py): `EnvironmentalData` (id, observation_id, temperature, humidity, rainfall, weather_condition, vegetation_indicator, created_at).
  - [NEW] [`biodiversity_metric.py`](file:///c:/My_Project/BioIntel/backend/app/models/biodiversity_metric.py): `BiodiversityMetric` (id, area, date, species_richness, native_species_ratio, habitat_score, population_stability, risk_score, health_score).
  - [NEW] [`risk_alert.py`](file:///c:/My_Project/BioIntel/backend/app/models/risk_alert.py): `RiskAlert` (id, type, severity, species_id, location, description, evidence, confidence, status, created_at).
  - [NEW] [`ai_insight.py`](file:///c:/My_Project/BioIntel/backend/app/models/ai_insight.py): `AIInsight` (id, type, title, description, evidence, confidence, recommendations, created_at).
  - [NEW] [`knowledge_document.py`](file:///c:/My_Project/BioIntel/backend/app/models/knowledge_document.py): `KnowledgeDocument` (id, title, content, source, category, embedding_reference, created_at).

#### [NEW] AI & RAG Subsystem (`backend/app/ai/` & `backend/app/rag/`)
- [NEW] [`vision_service.py`](file:///c:/My_Project/BioIntel/backend/app/ai/vision_service.py): `SpeciesIdentificationService` interface with `MockVisionProvider` (realistic multi-candidate classification, top-3 candidates, confidence scoring, "Likely species" phrasing, low-confidence warning for blurry images) and external provider stubs.
- [NEW] [`rag_service.py`](file:///c:/My_Project/BioIntel/backend/app/rag/rag_service.py): RAG pipeline with document chunking, TF-IDF / vector retrieval, prompt grounding with citations, strictly distinguishing between **[Observed fact]**, **[Inference]**, and **[Unknown / Insufficient evidence]**.
- [NEW] [`insight_engine.py`](file:///c:/My_Project/BioIntel/backend/app/ai/insight_engine.py): Generates structured ecological insights (*Title, What we observed, Evidence, What it may mean, Confidence, What we cannot conclude, Recommended next step*).

#### [NEW] Analytics Engine (`backend/app/analytics/`)
- [NEW] [`health_score.py`](file:///c:/My_Project/BioIntel/backend/app/analytics/health_score.py): Calculates the BioIntel Ecosystem Health Score:
  $$\text{Health Score} = 0.30 \times \text{Diversity} + 0.20 \times \text{Native Ratio} + 0.20 \times \text{Habitat} + 0.15 \times \text{Stability} + 0.15 \times \text{Risk}$$
  Clearly labeled as **BioIntel Ecosystem Health Score — Prototype Indicator**.
- [NEW] [`trend_anomaly.py`](file:///c:/My_Project/BioIntel/backend/app/analytics/trend_anomaly.py): Historical trend calculation (improving, stable, declining, insufficient data) and anomaly detection with observation effort bias check.
- [NEW] [`data_quality.py`](file:///c:/My_Project/BioIntel/backend/app/analytics/data_quality.py): Evidence quality scoring across image clarity, AI confidence, observation counts, and verification status.
- [NEW] [`recommendation_engine.py`](file:///c:/My_Project/BioIntel/backend/app/analytics/recommendation_engine.py): Rule + AI conservation recommendations for pollinators, invasive species, and habitat restoration.
- [NEW] [`digital_twin_engine.py`](file:///c:/My_Project/BioIntel/backend/app/analytics/digital_twin_engine.py): Zone metrics for 5 campus zones + "What-if" scenario simulation.

#### [NEW & MODIFY] REST API Endpoints (`backend/app/api/v1/endpoints/`)
- [`dashboard.py`](file:///c:/My_Project/BioIntel/backend/app/api/v1/endpoints/dashboard.py): Aggregate metrics, recent observations, live alerts, health score, AI insights.
- [`species.py`](file:///c:/My_Project/BioIntel/backend/app/api/v1/endpoints/species.py): CRUD, taxonomic filters, search, IUCN status filtering.
- [`observations.py`](file:///c:/My_Project/BioIntel/backend/app/api/v1/endpoints/observations.py): File upload, AI identification trigger, manual verification by admin, filtering.
- [`map.py`](file:///c:/My_Project/BioIntel/backend/app/api/v1/endpoints/map.py): Campus zones GeoJSON + observation points with sensitive species coordinate obfuscation for public vs precise for researchers.
- [`analytics.py`](file:///c:/My_Project/BioIntel/backend/app/api/v1/endpoints/analytics.py): Richness, category distribution, native ratio, trends, health score breakdown, environmental correlation.
- [`ai.py`](file:///c:/My_Project/BioIntel/backend/app/api/v1/endpoints/ai.py): Image identification endpoint, conversational RAG chat endpoint (`/api/v1/ai/chat`), structured insight generation.
- [`alerts.py`](file:///c:/My_Project/BioIntel/backend/app/api/v1/endpoints/alerts.py): Risk alert listing, dispatching, and resolution.
- [`digital_twin.py`](file:///c:/My_Project/BioIntel/backend/app/api/v1/endpoints/digital_twin.py): Zone telemetry and "What-if" scenario simulator.
- [`reports.py`](file:///c:/My_Project/BioIntel/backend/app/api/v1/endpoints/reports.py): Comprehensive audit report generation with PDF/print data and disclaimers.
- [`admin.py`](file:///c:/My_Project/BioIntel/backend/app/api/v1/endpoints/admin.py): Observation verification queue, knowledge doc upload, AI review.

#### [NEW] Seed Script (`backend/seed.py`)
- Comprehensive seed data:
  - 60+ species across birds, mammals, insects, plants, reptiles, amphibians, butterflies (with biological images, native/invasive status, IUCN status).
  - 350+ observations distributed across 5 College Campus Zones (Garden, Pond, Lawn, Woodland, Academic Area) across 6 months.
  - Environmental sensor readings (temperature, humidity, precipitation, NDVI).
  - 10+ risk alerts (invasive species outbreaks, low bird sightings, water quality fluctuation).
  - 15+ curated knowledge documents for RAG grounding (campus ecology, invasive weeds, pollinator conservation, SDG 15 principles, responsible citizen science).

---

### Frontend (`frontend/src/`)

#### [MODIFY] App Shell & Navigation
- [`App.jsx`](file:///c:/My_Project/BioIntel/frontend/src/App.jsx): Master application shell with state management, active tab routing, global search, notification center, and role switcher (Admin / Researcher / Observer).
- [`Sidebar.jsx`](file:///c:/My_Project/BioIntel/frontend/src/components/Sidebar.jsx): 12 curated, elegant navigation tabs:
  1. **Dashboard** (`dashboard`)
  2. **Observe** (`observe` - New Observation Workflow)
  3. **Species Explorer** (`species`)
  4. **Biodiversity Map** (`map`)
  5. **Analytics & Trends** (`analytics`)
  6. **Health Score & Insights** (`insights`)
  7. **Digital Twin (Campus Zones)** (`digital_twin`)
  8. **Alerts & Risks** (`alerts`)
  9. **BioIntel AI Assistant** (`ai_chat`)
  10. **Responsible AI** (`responsible_ai`)
  11. **Reports Generator** (`reports`)
  12. **Admin & Verification** (`admin`)
- [`Header.jsx`](file:///c:/My_Project/BioIntel/frontend/src/components/Header.jsx): Logo, SDG 15 badge, real-time search with autocomplete dropdown, notification center bell with unread count, role switcher badge.

#### [NEW & ENHANCED] Page Views (`frontend/src/components/views/`)
- [NEW] [`ObserveView.jsx`](file:///c:/My_Project/BioIntel/frontend/src/components/views/ObserveView.jsx): Complete observation submission flow:
  - Drag & drop image upload / camera capture.
  - Instant AI Species Identification trigger.
  - Candidate results card: top 3 candidates, confidence percentages (e.g. 94% Common Myna, 4% Bank Myna, 2% Jungle Myna), *"Likely species"* phrasing, human verification recommendation tag.
  - Ambiguous / low-confidence warning (*"Low confidence: Image is insufficient for reliable identification"*).
  - Zone / Location selector (Campus Zones A-E) and habitat selector.
  - Notes and submission button with live feedback.
- [NEW] [`SpeciesExplorerView.jsx`](file:///c:/My_Project/BioIntel/frontend/src/components/views/SpeciesExplorerView.jsx): Full species catalog with category filter tabs (All, Birds, Mammals, Insects, Plants, Reptiles, Amphibians, Butterflies), search input, IUCN Red List badges, native/invasive tags, observation counts, and modal details.
- [MODIFY] [`EcosystemMap.jsx`](file:///c:/My_Project/BioIntel/frontend/src/components/EcosystemMap.jsx): Interactive Leaflet map with 5 Campus Zones, observation markers with clustering, habitat layers, risk hotspot overlay, and sensitive species location privacy toggle.
- [NEW] [`HealthScoreView.jsx`](file:///c:/My_Project/BioIntel/frontend/src/components/views/HealthScoreView.jsx): Detailed Ecosystem Health Score breakdown (Diversity 30%, Native Ratio 20%, Habitat 20%, Stability 15%, Risk 15%), "How is this calculated?" guide, and AI Insight Engine cards with structured scientific reporting format.
- [NEW] [`AiAssistantView.jsx`](file:///c:/My_Project/BioIntel/frontend/src/components/views/AiAssistantView.jsx): Interactive RAG conversational chatbot:
  - Grounded in knowledge documents.
  - Explicit distinction between **[Observed Fact]**, **[Inference]**, and **[Unknown]**.
  - Clickable citation references.
  - Prompt suggestion chips (e.g. *"Why is biodiversity changing?"*, *"Which species should we monitor?"*).
- [NEW] [`ResponsibleAiView.jsx`](file:///c:/My_Project/BioIntel/frontend/src/components/views/ResponsibleAiView.jsx): Dedicated module highlighting:
  - Explainability & model confidence transparency.
  - Human-in-the-loop verification pipeline.
  - Sensitive species geo-fencing / location obfuscation demo.
  - Data quality score visualizer (82% evidence rating).
  - Bias disclaimers and hallucination prevention through RAG grounding.
- [NEW] [`DigitalTwinView.jsx`](file:///c:/My_Project/BioIntel/frontend/src/components/views/DigitalTwinView.jsx): Interactive Campus Zones overview with live sensors and "What-if Scenario" simulator (e.g. adjust native vegetation slider $\to$ preview simulated impact on pollinator habitat and health score).
- [MODIFY] [`ReportsView.jsx`](file:///c:/My_Project/BioIntel/frontend/src/components/views/ReportsView.jsx): Exportable PDF/print view with executive summary, health scores, trend charts, risk log, and compliance disclaimers.
- [NEW] [`AdminVerificationView.jsx`](file:///c:/My_Project/BioIntel/frontend/src/components/views/AdminVerificationView.jsx): Community observation verification queue, AI prediction review, alert management, knowledge doc uploader.

#### [MODIFY] API Client (`frontend/src/services/api.js`)
- Update `bioApi` with all new endpoints: `/api/v1/observations`, `/api/v1/ai/identify`, `/api/v1/ai/chat`, `/api/v1/analytics/health-score`, `/api/v1/digital-twin/simulate`, `/api/v1/admin/verify`, `/api/v1/reports`, etc., with clean mock fallback if backend is offline.

---

### Verification Plan

### Automated Tests
1. Backend Unit/API Tests (`backend/tests/test_api.py`):
   - Health check endpoint verification (`/health`).
   - Species catalog search and filtering.
   - Observation creation with AI identification.
   - Health score calculation logic and normalization.
   - RAG search and AI conversational response generation.
   - Run via: `.\venv\Scripts\python.exe -m pytest tests/` or custom runner script `python verify_api.py`.

2. Frontend Build Verification:
   - Run `npm run build` in `frontend/` to verify zero TypeScript/JSX errors, clean bundle compilation, and no broken imports.

### Manual & Interactive Verification
1. **The 5-Minute Master Demo Flow**:
   - **Step 1 (0:00 - 0:30)**: Dashboard overview — explain BioIntel's mission, UN SDG 15 alignment, ecosystem health score ($78/100$), and 5 Campus Zones.
   - **Step 2 (0:30 - 1:30)**: Observe page — upload a bird image (e.g. Common Myna), observe AI identification return top candidates with $94\%$ confidence and "Likely species" phrasing, submit observation.
   - **Step 3 (1:30 - 2:15)**: Map Explorer — verify observation appears in Zone A (Garden), inspect sensitive species location toggle.
   - **Step 4 (2:15 - 3:00)**: Analytics & Health Score — view Shannon index, native species ratio, trend detection with effort bias warning, and component breakdown.
   - **Step 5 (3:00 - 3:45)**: Digital Twin & Scenario Simulation — test "What-if native vegetation increases by 20%" slider.
   - **Step 6 (3:45 - 4:30)**: AI Assistant — ask *"Why is biodiversity changing?"* and verify RAG answer with [Observed Fact], [Inference], and [Unknown] distinction with citations.
   - **Step 7 (4:30 - 5:00)**: Responsible AI & Admin verification — view human verification queue, explainability cards, and download audit report.
