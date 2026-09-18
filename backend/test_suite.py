"""BioIntel API Test Suite."""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

endpoints = [
    ("GET", "/health"),
    ("GET", "/api/v1/dashboard"),
    ("GET", "/api/v1/species?limit=5"),
    ("GET", "/api/v1/observations?limit=5"),
    ("GET", "/api/v1/map/observations"),
    ("GET", "/api/v1/analytics/overview"),
    ("GET", "/api/v1/analytics/trends"),
    ("GET", "/api/v1/analytics/health-score"),
    ("GET", "/api/v1/analytics/environmental"),
    ("GET", "/api/v1/alerts"),
    ("GET", "/api/v1/ai/insights"),
    ("GET", "/api/v1/digital-twin/zones"),
    ("GET", "/api/v1/recommendations"),
    ("GET", "/api/v1/reports"),
    ("GET", "/api/v1/admin/verification-queue"),
    ("GET", "/api/v1/rag/documents"),
]

def run_tests():
    print("=== TESTING BIOINTEL REST ENDPOINTS ===")
    failed = 0
    for method, url in endpoints:
        res = client.get(url) if method == "GET" else client.post(url)
        status = "PASS" if res.status_code == 200 else "FAIL"
        print(f"[{res.status_code}] {method} {url} -> {status}")
        if res.status_code != 200:
            failed += 1
            print("   Error:", res.text[:200])

    # Test AI Chat
    chat_res = client.post("/api/v1/ai/chat", json={"query": "Why is biodiversity changing?"})
    print(f"[{chat_res.status_code}] POST /api/v1/ai/chat -> {'PASS' if chat_res.status_code == 200 else 'FAIL'}")
    if chat_res.status_code == 200:
        data = chat_res.json()
        print("   Observed facts:", len(data.get("observed_facts", [])))
        print("   Inferences:", len(data.get("inferences", [])))
        print("   Unknowns:", len(data.get("unknowns", [])))
        print("   Citations:", len(data.get("citations", [])))
    else:
        failed += 1

    # Test AI Vision Identify
    vis_res = client.post("/api/v1/ai/identify?filename=common_myna.jpg")
    print(f"[{vis_res.status_code}] POST /api/v1/ai/identify -> {'PASS' if vis_res.status_code == 200 else 'FAIL'}")
    if vis_res.status_code == 200:
        data = vis_res.json()
        print(f"   Likely Species: {data.get('likely_species')} ({data.get('confidence') * 100:.0f}%)")
        print(f"   Candidates: {len(data.get('candidates', []))}")
    else:
        failed += 1

    # Test Digital Twin Simulate
    sim_res = client.post("/api/v1/digital-twin/simulate", json={"native_vegetation_increase_pct": 20.0})
    print(f"[{sim_res.status_code}] POST /api/v1/digital-twin/simulate -> {'PASS' if sim_res.status_code == 200 else 'FAIL'}")
    if sim_res.status_code != 200:
        failed += 1

    # Test Create Observation
    obs_res = client.post("/api/v1/observations", json={
        "species_id": 1,
        "location_name": "Zone A — Botanical Garden",
        "habitat": "Medicinal Bed",
        "latitude": 28.5462,
        "longitude": 77.1930,
        "notes": "Verified sighting of Common Myna perched on flowering bush.",
        "ai_confidence": 0.94
    })
    print(f"[{obs_res.status_code}] POST /api/v1/observations -> {'PASS' if obs_res.status_code == 200 else 'FAIL'}")
    if obs_res.status_code != 200:
        failed += 1

    print("========================================")
    if failed == 0:
        print("ALL ENDPOINT TESTS PASSED SUCCESSFULLY! (0 Failures)")
    else:
        print(f"TESTS FINISHED WITH {failed} FAILURES")

if __name__ == "__main__":
    run_tests()
