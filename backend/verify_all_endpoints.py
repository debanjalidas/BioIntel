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

endpoints = [
    ("Health", f"{BASE_URL}/health", "GET", None),
    ("Dashboard", f"{BASE_URL}/api/v1/dashboard", "GET", None),
    ("Species", f"{BASE_URL}/api/v1/species?limit=5", "GET", None),
    ("Observations", f"{BASE_URL}/api/v1/observations?limit=5", "GET", None),
    ("Map Observations", f"{BASE_URL}/api/v1/map/observations", "GET", None),
    ("Analytics Overview", f"{BASE_URL}/api/v1/analytics/overview", "GET", None),
    ("Analytics Trends", f"{BASE_URL}/api/v1/analytics/trends", "GET", None),
    ("Analytics Health Score", f"{BASE_URL}/api/v1/analytics/health-score", "GET", None),
    ("Analytics Environmental", f"{BASE_URL}/api/v1/analytics/environmental", "GET", None),
    ("Analytics Quality", f"{BASE_URL}/api/v1/analytics/quality", "GET", None),
    ("Analytics Anomalies", f"{BASE_URL}/api/v1/analytics/anomalies", "GET", None),
    ("Alerts", f"{BASE_URL}/api/v1/alerts", "GET", None),
    ("AI Insights", f"{BASE_URL}/api/v1/ai/insights", "GET", None),
    ("AI Chat", f"{BASE_URL}/api/v1/ai/chat", "POST", {"query": "Why is biodiversity declining?"}),
    ("AI Vision Identify", f"{BASE_URL}/api/v1/ai/identify?filename=common_myna.jpg", "POST", None),
    ("Digital Twin Zones", f"{BASE_URL}/api/v1/digital-twin/zones", "GET", None),
    ("Digital Twin Simulate", f"{BASE_URL}/api/v1/digital-twin/simulate", "POST", {"native_vegetation_increase_pct": 20.0}),
    ("Recommendations", f"{BASE_URL}/api/v1/recommendations", "GET", None),
    ("Reports", f"{BASE_URL}/api/v1/reports", "GET", None),
    ("Admin Verification Queue", f"{BASE_URL}/api/v1/admin/verification-queue", "GET", None),
    ("RAG Documents", f"{BASE_URL}/api/v1/rag/documents", "GET", None),
]

print("=" * 60)
print("COMPREHENSIVE ENDPOINT AUDIT")
print("=" * 60)
results = {}
for name, url, method, data in endpoints:
    res = test_endpoint(name, url, method, data)
    results[name] = res is not None

passed = sum(1 for v in results.values() if v)
total = len(results)
print("=" * 60)
print(f"RESULTS: {passed}/{total} Passed")
print("=" * 60)
