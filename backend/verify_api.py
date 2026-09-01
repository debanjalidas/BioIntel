"""Verification test script for BioIntel API endpoints and live ML inference."""
import urllib.request
import json

BASE_URL = "http://127.0.0.1:8000"

def test_endpoint(name, url, method="GET", data=None):
    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(data).encode("utf-8") if data else None,
            headers={"Content-Type": "application/json"}
        )
        with urllib.request.urlopen(req, timeout=10) as res:
            res_data = json.loads(res.read().decode("utf-8"))
            print(f"[PASS] {name} ({res.status})")
            return res_data
    except Exception as e:
        print(f"[FAIL] {name}: {e}")
        return None

print("=" * 60)
print("RUNNING BIOINTEL BACKEND & ML VERIFICATION TEST")
print("=" * 60)

test_endpoint("Health Check", f"{BASE_URL}/health")
test_endpoint("Species Catalog", f"{BASE_URL}/api/v1/species?limit=5")
test_endpoint("eDNA Samples", f"{BASE_URL}/api/v1/edna/samples?limit=5")
test_endpoint("Acoustic Detections", f"{BASE_URL}/api/v1/acoustics/detections?limit=5")
test_endpoint("Satellite Timeseries", f"{BASE_URL}/api/v1/satellite/timeseries?limit=5")
test_endpoint("Ground Surveys", f"{BASE_URL}/api/v1/surveys?limit=5")
test_endpoint("Threat Alerts", f"{BASE_URL}/api/v1/alerts")
test_endpoint("Analytics Dashboard", f"{BASE_URL}/api/v1/analytics/dashboard-stats")

# Test Live ML Inference Endpoints
test_endpoint(
    "Live ML Acoustic Inference",
    f"{BASE_URL}/api/v1/ml/predict/acoustic",
    method="POST",
    data={"min_frequency_hz": 650.0, "max_frequency_hz": 2400.0, "duration_seconds": 4.5}
)

test_endpoint(
    "Live ML eDNA Richness Inference",
    f"{BASE_URL}/api/v1/ml/predict/edna",
    method="POST",
    data={"depth_meters": 2.5, "water_temperature_c": 22.0, "ph_level": 7.4, "dissolved_oxygen_mg_l": 8.5, "turbidity_ntu": 5.0}
)

test_endpoint(
    "Live ML Canopy Deforestation Inference",
    f"{BASE_URL}/api/v1/ml/predict/canopy",
    method="POST",
    data={"ndvi_mean": 0.78, "evi_mean": 0.52, "ndre_mean": 0.41, "canopy_cover_percent": 82.0, "surface_temperature_c": 26.5, "monthly_precipitation_mm": 120.0}
)

print("=" * 60)
print("VERIFICATION TEST RUN COMPLETE")
print("=" * 60)
