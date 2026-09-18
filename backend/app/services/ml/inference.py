"""
BioIntel ML Live Inference Service
Provides high-performance inference handlers for:
1. Bioacoustic PAM vocalization identification & confidence scoring
2. eDNA water/soil species richness and invasive contamination risk
3. Satellite multi-spectral canopy degradation & deforestation alert forecasting
"""

import os
import json
import logging
from typing import Dict, Any, List
try:
    import joblib
except ImportError:
    joblib = None
import numpy as np

logger = logging.getLogger(__name__)

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
ARTIFACTS_DIR = os.path.join(CURRENT_DIR, "artifacts")


class BioIntelMLEngine:
    def __init__(self):
        self.acoustic_clf = None
        self.acoustic_encoder = None
        self.edna_richness_model = None
        self.edna_invasive_model = None
        self.edna_scaler = None
        self.satellite_model = None
        self.satellite_scaler = None
        self.loaded = False
        self._load_models()

    def _load_models(self):
        try:
            # 1. Acoustic
            ac_model_path = os.path.join(ARTIFACTS_DIR, "acoustic_classifier.joblib")
            ac_enc_path = os.path.join(ARTIFACTS_DIR, "acoustic_encoder.joblib")
            if os.path.exists(ac_model_path) and os.path.exists(ac_enc_path):
                self.acoustic_clf = joblib.load(ac_model_path)
                self.acoustic_encoder = joblib.load(ac_enc_path)

            # 2. eDNA
            ed_r_path = os.path.join(ARTIFACTS_DIR, "edna_richness_model.joblib")
            ed_i_path = os.path.join(ARTIFACTS_DIR, "edna_invasive_model.joblib")
            ed_s_path = os.path.join(ARTIFACTS_DIR, "edna_scaler.joblib")
            if os.path.exists(ed_r_path) and os.path.exists(ed_s_path):
                self.edna_richness_model = joblib.load(ed_r_path)
                self.edna_invasive_model = joblib.load(ed_i_path)
                self.edna_scaler = joblib.load(ed_s_path)

            # 3. Satellite
            sat_m_path = os.path.join(ARTIFACTS_DIR, "satellite_risk_model.joblib")
            sat_s_path = os.path.join(ARTIFACTS_DIR, "satellite_scaler.joblib")
            if os.path.exists(sat_m_path) and os.path.exists(sat_s_path):
                self.satellite_model = joblib.load(sat_m_path)
                self.satellite_scaler = joblib.load(sat_s_path)

            self.loaded = True
            logger.info("BioIntel ML models successfully loaded into memory.")
        except Exception as e:
            logger.warning(f"ML models could not be loaded on startup ({e}). Retrain using train_all_models().")
            self.loaded = False

    def predict_acoustic(self, min_freq_hz: float, max_freq_hz: float, duration_seconds: float) -> Dict[str, Any]:
        """Classify vocalizing species and confidence from audio bounds."""
        if not self.acoustic_clf:
            # Fallback heuristic if models not loaded
            return {
                "predicted_species": "Great Hornbill",
                "confidence": 0.88,
                "status": "fallback"
            }
        
        bandwidth = max_freq_hz - min_freq_hz
        X = np.array([[min_freq_hz, max_freq_hz, bandwidth, duration_seconds]])
        probs = self.acoustic_clf.predict_proba(X)[0]
        best_idx = np.argmax(probs)
        species = self.acoustic_encoder.classes_[best_idx]
        conf = float(probs[best_idx])
        
        return {
            "predicted_species": str(species),
            "confidence": round(conf, 4),
            "top_candidates": [
                {"species": str(self.acoustic_encoder.classes_[i]), "prob": round(float(probs[i]), 3)}
                for i in np.argsort(probs)[::-1][:3]
            ],
            "status": "ml_inferred"
        }

    def predict_edna(
        self,
        depth_meters: float,
        water_temperature_c: float,
        ph_level: float,
        dissolved_oxygen_mg_l: float,
        turbidity_ntu: float,
        filtration_volume_ml: float = 2500.0
    ) -> Dict[str, Any]:
        """Predict expected species richness and invasive species risk from environmental parameters."""
        if not self.edna_richness_model or not self.edna_scaler:
            return {
                "predicted_species_richness": 45,
                "invasive_species_risk": "LOW",
                "invasive_risk_score": 0.15,
                "water_quality_index": 82.5,
                "status": "fallback"
            }

        X = np.array([[depth_meters, water_temperature_c, ph_level, dissolved_oxygen_mg_l, turbidity_ntu, filtration_volume_ml]])
        X_scaled = self.edna_scaler.transform(X)

        richness = float(self.edna_richness_model.predict(X_scaled)[0])
        inv_probs = self.edna_invasive_model.predict_proba(X_scaled)[0]
        inv_risk_prob = float(inv_probs[1]) if len(inv_probs) > 1 else 0.1

        # Water quality calculation
        # Optimal pH 7.2-7.8, DO > 7.0, Turbidity < 10
        do_score = min(dissolved_oxygen_mg_l / 10.0, 1.0) * 40.0
        ph_score = max(0, 30.0 - abs(ph_level - 7.5) * 15.0)
        turb_score = max(0, 30.0 - (turbidity_ntu / 30.0) * 30.0)
        wqi = round(do_score + ph_score + turb_score, 1)

        return {
            "predicted_species_richness": max(5, int(round(richness))),
            "invasive_species_risk": "HIGH" if inv_risk_prob > 0.6 else ("MEDIUM" if inv_risk_prob > 0.3 else "LOW"),
            "invasive_risk_probability": round(inv_risk_prob, 3),
            "water_quality_index": min(100.0, max(10.0, wqi)),
            "status": "ml_inferred"
        }

    def predict_satellite_risk(
        self,
        ndvi_mean: float,
        evi_mean: float,
        ndre_mean: float,
        canopy_cover_percent: float,
        surface_temperature_c: float,
        monthly_precipitation_mm: float
    ) -> Dict[str, Any]:
        """Forecast deforestation alerts & canopy degradation risk."""
        if not self.satellite_model or not self.satellite_scaler:
            return {
                "predicted_deforestation_alerts": 1,
                "canopy_stress_level": "MODERATE",
                "ecological_stability_score": 75.0,
                "status": "fallback"
            }

        veg_ratio = evi_mean / (ndvi_mean + 1e-5)
        stress_idx = (100.0 - canopy_cover_percent) * (surface_temperature_c / 30.0)

        X = np.array([[
            ndvi_mean, evi_mean, ndre_mean, canopy_cover_percent,
            surface_temperature_c, monthly_precipitation_mm,
            veg_ratio, stress_idx
        ]])
        X_scaled = self.satellite_scaler.transform(X)

        predicted_alerts = float(self.satellite_model.predict(X_scaled)[0])
        stability = round(max(10.0, min(100.0, (ndvi_mean * 50.0) + (canopy_cover_percent * 0.5) - (predicted_alerts * 4.0))), 1)

        return {
            "predicted_deforestation_alerts": max(0, int(round(predicted_alerts))),
            "canopy_stress_level": "CRITICAL" if predicted_alerts >= 4 else ("HIGH" if predicted_alerts >= 2 else ("MODERATE" if predicted_alerts >= 1 else "LOW")),
            "ecological_stability_score": stability,
            "status": "ml_inferred"
        }


ml_engine = BioIntelMLEngine()
