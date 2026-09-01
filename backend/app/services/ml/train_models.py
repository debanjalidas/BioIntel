"""
BioIntel ML Model Training Engine
Trains 3 specialized Machine Learning models on project datasets:
1. Acoustic PAM Vocalization Classifier (Random Forest Classifier)
2. eDNA Metagenomic Richness & Invasive Threat Engine (Gradient Boosting Regressor & Classifier)
3. Satellite Deforestation Early Warning Predictor (Random Forest / Anomaly Regressor)

Serializes trained models and encoders into artifacts/ for zero-latency live inference.
"""

import os
import sys
import json
import logging
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, GradientBoostingRegressor, RandomForestRegressor
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, mean_squared_error, r2_score

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
ARTIFACTS_DIR = os.path.join(CURRENT_DIR, "artifacts")
os.makedirs(ARTIFACTS_DIR, exist_ok=True)

# Datasets Root
BASE_DIR = os.path.abspath(os.path.join(CURRENT_DIR, "..", "..", "..", ".."))
DATA_DIR = os.path.join(BASE_DIR, "data")
DEMO_DIR = os.path.join(DATA_DIR, "demo")
AUDIO_DIR = os.path.join(DATA_DIR, "audio")
SATELLITE_DIR = os.path.join(DATA_DIR, "satellite")


def train_acoustic_classifier() -> dict:
    """Train Random Forest classifier to identify vocalizing species from acoustic frequencies & duration."""
    logger.info("--> [1/3] Training Bioacoustic PAM Classifier...")
    csv_path = os.path.join(AUDIO_DIR, "pam_acoustic_detections.csv")
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Acoustic dataset not found: {csv_path}")

    df = pd.read_csv(csv_path)
    logger.info("Loaded %d acoustic detection samples.", len(df))

    # Features: min_frequency_hz, max_frequency_hz, bandwidth, duration_seconds, model_confidence
    df["bandwidth_hz"] = df["max_frequency_hz"] - df["min_frequency_hz"]
    features = ["min_frequency_hz", "max_frequency_hz", "bandwidth_hz", "duration_seconds"]
    
    X = df[features]
    y_raw = df["common_name"]

    label_encoder = LabelEncoder()
    y = label_encoder.fit_transform(y_raw)

    # Train Random Forest
    clf = RandomForestClassifier(n_estimators=100, max_depth=8, random_state=42)
    clf.fit(X, y)

    y_pred = clf.predict(X)
    acc = accuracy_score(y, y_pred)
    logger.info("Acoustic Model Training Accuracy: %.2f%%", acc * 100)

    # Save artifacts
    model_path = os.path.join(ARTIFACTS_DIR, "acoustic_classifier.joblib")
    encoder_path = os.path.join(ARTIFACTS_DIR, "acoustic_encoder.joblib")
    joblib.dump(clf, model_path)
    joblib.dump(label_encoder, encoder_path)

    metadata = {
        "model": "RandomForestClassifier",
        "features": features,
        "classes": list(label_encoder.classes_),
        "training_samples": len(df),
        "accuracy": round(float(acc), 4),
        "trained_at": pd.Timestamp.now().isoformat()
    }
    with open(os.path.join(ARTIFACTS_DIR, "acoustic_meta.json"), "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)

    return metadata


def train_edna_ecosystem_models() -> dict:
    """Train Gradient Boosting model to predict species richness & invasive risk from water physicochemical metrics."""
    logger.info("--> [2/3] Training eDNA Biodiversity & Richness Engine...")
    samples_path = os.path.join(DEMO_DIR, "edna_metabarcoding_samples.csv")
    det_path = os.path.join(DEMO_DIR, "edna_taxonomic_detections.csv")

    if not os.path.exists(samples_path) or not os.path.exists(det_path):
        raise FileNotFoundError("eDNA datasets not found in data/demo/")

    df_samples = pd.read_csv(samples_path)
    df_det = pd.read_csv(det_path)

    # Map invasive presence per sample
    invasive_samples = set(df_det[df_det["is_invasive"] == True]["sample_code"])
    df_samples["has_invasive_detected"] = df_samples["sample_code"].apply(lambda code: 1 if code in invasive_samples else 0)

    feature_cols = [
        "depth_meters",
        "water_temperature_c",
        "ph_level",
        "dissolved_oxygen_mg_l",
        "turbidity_ntu",
        "filtration_volume_ml"
    ]

    X = df_samples[feature_cols]
    y_richness = df_samples["species_richness_detected"]
    y_invasive = df_samples["has_invasive_detected"]

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # 1. Richness Regressor
    regressor = GradientBoostingRegressor(n_estimators=80, learning_rate=0.08, max_depth=4, random_state=42)
    regressor.fit(X_scaled, y_richness)
    r2 = r2_score(y_richness, regressor.predict(X_scaled))

    # 2. Invasive Risk Classifier
    inv_clf = RandomForestClassifier(n_estimators=50, max_depth=5, random_state=42)
    inv_clf.fit(X_scaled, y_invasive)
    inv_acc = accuracy_score(y_invasive, inv_clf.predict(X_scaled))

    logger.info("eDNA Richness Model R2 Score: %.3f | Invasive Detector Acc: %.2f%%", r2, inv_acc * 100)

    # Save artifacts
    joblib.dump(regressor, os.path.join(ARTIFACTS_DIR, "edna_richness_model.joblib"))
    joblib.dump(inv_clf, os.path.join(ARTIFACTS_DIR, "edna_invasive_model.joblib"))
    joblib.dump(scaler, os.path.join(ARTIFACTS_DIR, "edna_scaler.joblib"))

    metadata = {
        "regressor": "GradientBoostingRegressor",
        "classifier": "RandomForestClassifier",
        "features": feature_cols,
        "r2_score": round(float(r2), 4),
        "invasive_accuracy": round(float(inv_acc), 4),
        "training_samples": len(df_samples),
        "trained_at": pd.Timestamp.now().isoformat()
    }
    with open(os.path.join(ARTIFACTS_DIR, "edna_meta.json"), "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)

    return metadata


def train_satellite_deforestation_model() -> dict:
    """Train Satellite Deforestation Risk & Degradation Forecasting Model."""
    logger.info("--> [3/3] Training Satellite Forest Degradation Early Warning Model...")
    csv_path = os.path.join(SATELLITE_DIR, "vegetation_canopy_timeseries.csv")
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Satellite dataset not found: {csv_path}")

    df = pd.read_csv(csv_path)

    # Engineered Features
    df["vegetation_density_ratio"] = df["evi_mean"] / (df["ndvi_mean"] + 1e-5)
    df["canopy_stress_index"] = (100.0 - df["canopy_cover_percent"]) * (df["surface_temperature_c"] / 30.0)

    features = [
        "ndvi_mean",
        "evi_mean",
        "ndre_mean",
        "canopy_cover_percent",
        "surface_temperature_c",
        "monthly_precipitation_mm",
        "vegetation_density_ratio",
        "canopy_stress_index"
    ]

    X = df[features]
    y_alerts = df["deforestation_alert_count"]

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    model = RandomForestRegressor(n_estimators=100, max_depth=6, random_state=42)
    model.fit(X_scaled, y_alerts)

    y_pred = model.predict(X_scaled)
    r2 = r2_score(y_alerts, y_pred)
    mse = mean_squared_error(y_alerts, y_pred)

    logger.info("Satellite Deforestation Risk Model R2: %.3f, MSE: %.3f", r2, mse)

    # Save artifacts
    joblib.dump(model, os.path.join(ARTIFACTS_DIR, "satellite_risk_model.joblib"))
    joblib.dump(scaler, os.path.join(ARTIFACTS_DIR, "satellite_scaler.joblib"))

    metadata = {
        "model": "RandomForestRegressor",
        "features": features,
        "r2_score": round(float(r2), 4),
        "mse": round(float(mse), 4),
        "training_samples": len(df),
        "trained_at": pd.Timestamp.now().isoformat()
    }
    with open(os.path.join(ARTIFACTS_DIR, "satellite_meta.json"), "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)

    return metadata


def train_all_models():
    """Execute all model training pipelines."""
    print("=" * 60)
    print("BIOINTEL MULTI-MODAL ML TRAINING PIPELINE")
    print(f"Artifacts Destination: {ARTIFACTS_DIR}")
    print("=" * 60)

    results = {}
    results["acoustic"] = train_acoustic_classifier()
    results["edna"] = train_edna_ecosystem_models()
    results["satellite"] = train_satellite_deforestation_model()

    print("\n" + "=" * 60)
    print("ALL ML MODELS TRAINED & SERIALIZED SUCCESSFULLY!")
    print("=" * 60)
    return results


if __name__ == "__main__":
    train_all_models()
