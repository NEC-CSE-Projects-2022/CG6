import numpy as np
import pandas as pd
import tensorflow as tf
from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.preprocessing import StandardScaler
import os

# -------------------------
# Flask setup
# -------------------------
app = Flask(__name__)
CORS(app)

# -------------------------
# Load dataset & scaler
# -------------------------
scaler = StandardScaler()

try:
    df = pd.read_csv("ds.csv")
    FEATURE_COLS = ["Cppm", "Wind", "HR", "Rad", "Temp"]
    scaler.fit(df[FEATURE_COLS])
    print("✅ Dataset loaded")
    print("✅ Scaler fitted on:", FEATURE_COLS)
except Exception as e:
    print("❌ Dataset/Scaler error:", e)

# -------------------------
# Load CNN + BiLSTM model
# -------------------------
try:
    model_path = os.path.join("models", "model.keras")
    model = tf.keras.models.load_model(model_path)
    print("✅ CNN + BiLSTM model loaded")
except Exception as e:
    print("❌ Model load error:", e)

# -------------------------
# Greenhouse evaluation
# -------------------------
def evaluate_greenhouse(temp, humidity, co2, soil):
    risk = 0
    tips = []

    if temp < 18 or temp > 32:
        risk += 25
        tips.append("🌡️ Regulate greenhouse temperature")

    if humidity < 45 or humidity > 75:
        risk += 20
        tips.append("💧 Adjust humidity levels")

    if co2 < 400:
        risk += 15
        tips.append("🌬️ Increase CO₂ enrichment")
    elif co2 > 1500:
        risk += 20
        tips.append("🌬️ Improve ventilation")

    if soil < 30:
        risk += 20
        tips.append("🌱 Irrigation required")
    elif soil > 70:
        risk += 15
        tips.append("🌱 Overwatering risk")

    risk = min(risk, 100)
    label = "Low" if risk < 25 else "Moderate" if risk < 60 else "High"
    return risk, label, tips

# -------------------------
# Helper: process sequence and predict
# -------------------------
def predict_sequence(sequence: np.ndarray):
    # Take last 10 rows
    if sequence.shape[0] < 10:
        raise ValueError("Sequence must contain at least 10 rows")
    sequence = sequence[-10:]

    # Scale
    seq_df = pd.DataFrame(sequence, columns=["Cppm", "Wind", "HR", "Rad", "Temp"])
    scaled_seq = scaler.transform(seq_df)
    scaled_seq = scaled_seq.reshape(1, 10, 5)

    # Predict
    pred_scaled = model.predict(scaled_seq, verbose=0)
    inv_input = np.zeros((1, 5))
    inv_input[0] = sequence[-1]  # last known values
    inv_input[0, :] = pred_scaled[0]
    inv = scaler.inverse_transform(inv_input)[0]

    predicted_co2 = float(np.clip(inv[0], 350, 2000))
    predicted_wind = float(np.clip(inv[1], 0, 20))
    predicted_humidity = float(np.clip(inv[2], 30, 90))
    predicted_rad = float(np.clip(inv[3], 0, 1200))
    predicted_temp = float(np.clip(inv[4], 5, 40))
    predicted_temp = 0.7 * predicted_temp + 0.3 * sequence[-1, 4]  # smooth temp
    predicted_soil = float(np.clip(sequence[-1, 2], 0, 100))

    risk, label, tips = evaluate_greenhouse(predicted_temp, predicted_humidity, predicted_co2, predicted_soil)
    confidence = max(0, 100 - risk)

    auto_action = "Stable"
    if predicted_temp > 32:
        auto_action = "Turn ON cooling fan"
    elif predicted_temp < 18:
        auto_action = "Turn ON heater"
    elif predicted_humidity > 75:
        auto_action = "Activate dehumidifier"
    elif predicted_humidity < 45:
        auto_action = "Activate humidifier"

    anomaly = (
        predicted_temp < -5 or predicted_temp > 45 or
        predicted_humidity < 20 or predicted_humidity > 95 or
        predicted_co2 < 200 or predicted_co2 > 2500
    )

    return {
        "success": True,
        "predicted_temperature": round(predicted_temp, 2),
        "predicted_humidity": round(predicted_humidity, 2),
        "predicted_co2": round(predicted_co2, 2),
        "predicted_radiation": round(predicted_rad, 2),
        "predicted_wind": round(predicted_wind, 2),
        "predicted_soil": round(predicted_soil, 2),
        "risk_score": int(risk),
        "risk_label": label,
        "confidence": int(confidence),
        "auto_action": auto_action,
        "anomaly": bool(anomaly),
        "recommendations": tips,
        "greenhouse_suitable": label != "High"
    }

# -------------------------
# Manual input endpoint
# -------------------------
@app.route("/api/predict", methods=["POST"])
def predict_manual():
    try:
        data = request.get_json()
        if not data or "sequence" not in data:
            return jsonify({"success": False, "error": "Missing 'sequence' in request"}), 400

        sequence = np.array(data["sequence"], dtype=np.float32)
        if sequence.ndim != 2 or sequence.shape[1] != 5:
            return jsonify({"success": False, "error": "Sequence must be 2D with 5 features"}), 400

        result = predict_sequence(sequence)
        return jsonify(result)

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# -------------------------
# CSV input endpoint
# -------------------------
# -------------------------
# CSV input endpoint
# -------------------------
from difflib import get_close_matches

@app.route("/api/predict_csv", methods=["POST"])
def predict_csv():
    try:
        if "file" not in request.files:
            return jsonify({"success": False, "error": "No CSV file provided"}), 400

        file = request.files["file"]
        df = pd.read_csv(file)

        # Normalize column names
        df.columns = [c.strip().lower() for c in df.columns]

        # Direct mapping based on your CSV
        # temp -> temperature
        # hr -> humidity AND soil_moisture (model expects both)
        # cppm -> co2
        required_cols = ["temp", "hr", "cppm"]
        for col in required_cols:
            if col not in df.columns:
                return jsonify({"success": False, "error": f"Missing column in CSV: {col}"}), 400

        # Build sequence for model
        sequence_rows = []
        for _, row in df.iterrows():
            sequence_rows.append([
                row["cppm"],   # co2
                0,             # wind (not in CSV)
                row["hr"],     # soil moisture placeholder
                0,             # radiation (not in CSV)
                row["temp"]    # temperature
            ])

        sequence = np.array(sequence_rows, dtype=np.float32)
        result = predict_sequence(sequence)
        return jsonify(result)

    except Exception as e:
        print("❌ CSV processing error:", e)
        return jsonify({"success": False, "error": str(e)}), 500
-----------
# Run server
# -------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
