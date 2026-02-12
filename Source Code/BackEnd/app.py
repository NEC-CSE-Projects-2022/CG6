import numpy as np
import pandas as pd
import tensorflow as tf
import os
from io import BytesIO

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from sklearn.preprocessing import StandardScaler

# PDF
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4

# -----------------------------------
# Flask Setup
# -----------------------------------
app = Flask(__name__)
CORS(app)

# -----------------------------------
# Constants
# -----------------------------------
FEATURE_COLS = ["Cppm", "Wind", "HR", "Rad", "Temp"]
SEQUENCE_LENGTH = 10

# -----------------------------------
# Load Scaler
# -----------------------------------
df_train = pd.read_csv("ds.csv")
scaler = StandardScaler()
scaler.fit(df_train[FEATURE_COLS])
print("✅ Scaler loaded")

# -----------------------------------
# Load Model
# -----------------------------------
model_path = os.path.join("models", "model.keras")
model = tf.keras.models.load_model(model_path)
print("✅ Model loaded")

# -----------------------------------
# Helpers
# -----------------------------------
def calculate_trend(values):
    if len(values) < 2:
        return "stable"
    return "increasing" if values[-1] > values[0] else "decreasing" if values[-1] < values[0] else "stable"

def evaluate_greenhouse(temp, humidity, co2, soil):
    risk = 0
    tips = []

    if temp < 18 or temp > 32:
        risk += 25
        tips.append("Adjust greenhouse temperature")

    if humidity < 45 or humidity > 75:
        risk += 20
        tips.append("Maintain optimal humidity")

    if co2 < 400:
        risk += 15
        tips.append("Increase CO₂ enrichment")
    elif co2 > 1500:
        risk += 20
        tips.append("Improve ventilation")

    if soil < 30:
        risk += 20
        tips.append("Irrigation required")
    elif soil > 70:
        risk += 15
        tips.append("Overwatering risk")

    risk = min(risk, 100)
    label = "Low" if risk < 25 else "Moderate" if risk < 60 else "High"
    return risk, label, tips

def predict_sequence(sequence, soil_input, future_steps=24):
    sequence = sequence[-SEQUENCE_LENGTH:]
    predictions = []
    current_seq = sequence.copy()

    for step in range(future_steps):
        df_seq = pd.DataFrame(current_seq, columns=FEATURE_COLS)
        scaled_seq = scaler.transform(df_seq)
        scaled_seq = scaled_seq.reshape(1, SEQUENCE_LENGTH, len(FEATURE_COLS))

        pred_scaled = model.predict(scaled_seq, verbose=0)

        # Inverse transform to real-world values
        pred_unscaled = scaler.inverse_transform(pred_scaled)[0]
        raw_row = pred_unscaled.copy()

        # Safe clipping
        predicted_co2 = float(np.clip(raw_row[0], 350, 2000))
        predicted_wind = float(np.clip(raw_row[1], 0, 20))
        predicted_humidity = float(np.clip(raw_row[2], 30, 90))
        predicted_rad = float(np.clip(raw_row[3], 0, 1200))
        predicted_temp = float(np.clip(raw_row[4], 5, 40))
        predicted_soil = float(np.clip(soil_input, 0, 100))

        predictions.append({
            "hour": step + 1,
            "temperature": round(predicted_temp, 2),
            "humidity": round(predicted_humidity, 2),
            "co2": round(predicted_co2, 2),
            "soil_moisture": round(predicted_soil, 2)
        })

        # Update sequence for next prediction
        current_seq = np.vstack([current_seq[1:], raw_row])

    # -------- Error Metrics (basic internal evaluation) --------
    from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

    true_vals = sequence[:, 0]  # using CO2 column
    pred_vals = np.array([p["co2"] for p in predictions[:len(true_vals)]])

    mae = float(mean_absolute_error(true_vals, pred_vals))
    mse = float(mean_squared_error(true_vals, pred_vals))
    rmse = float(np.sqrt(mse))
    r2 = float(r2_score(true_vals, pred_vals))

    error_metrics = {
        "mae": round(mae, 3),
        "rmse": round(rmse, 3),
        "mse": round(mse, 3),
        "r2": round(r2, 3)
    }

    # -------- Metrics Summary --------
    temps = [p["temperature"] for p in predictions]
    hums = [p["humidity"] for p in predictions]
    co2s = [p["co2"] for p in predictions]
    soils = [p["soil_moisture"] for p in predictions]

    metrics = {
        "temperature": {"min": min(temps), "max": max(temps), "avg": float(np.mean(temps)), "trend": calculate_trend(temps)},
        "humidity": {"min": min(hums), "max": max(hums), "avg": float(np.mean(hums)), "trend": calculate_trend(hums)},
        "co2": {"min": min(co2s), "max": max(co2s), "avg": float(np.mean(co2s)), "trend": calculate_trend(co2s)},
        "soil_moisture": {"min": min(soils), "max": max(soils), "avg": float(np.mean(soils)), "trend": calculate_trend(soils)}
    }

    risk, label, tips = evaluate_greenhouse(
        metrics["temperature"]["avg"],
        metrics["humidity"]["avg"],
        metrics["co2"]["avg"],
        soil_input
    )

    confidence = max(0, 100 - risk)

    return {
        "success": True,
        "predictions": predictions,
        "metrics": metrics,
        "error_metrics": error_metrics,
        "risk_score": int(risk),
        "risk_label": label,
        "confidence": int(confidence),
        "greenhouse_suitable": risk < 50,
        "recommendations": tips
    }

# -----------------------------------
# Routes
# -----------------------------------
@app.route("/api/predict", methods=["POST"])
def predict_manual():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "No data received"}), 400

        required = ["temperature", "humidity", "co2", "soil_moisture"]
        for f in required:
            if f not in data:
                return jsonify({"success": False, "error": f"Missing field: {f}"}), 400

        base_row = [
            float(data["co2"]),
            2,
            float(data["humidity"]),
            200,
            float(data["temperature"])
        ]
        sequence = np.array([base_row] * SEQUENCE_LENGTH)
        result = predict_sequence(sequence, float(data["soil_moisture"]))
        return jsonify(result)

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/api/predict_csv", methods=["POST"])
def predict_csv():
    try:
        file = request.files["file"]
        future_steps = int(request.form.get("forecast_horizon", 24))

        df = pd.read_csv(file)
        df.columns = [c.strip().lower() for c in df.columns]

        required = ["temperature", "humidity", "co2", "soil_moisture"]
        if not all(col in df.columns for col in required):
            return jsonify({"success": False, "error": "Invalid CSV format"}), 400

        seq_rows = []
        for _, row in df.iterrows():
            seq_rows.append([
                row["co2"],
                2,
                row["humidity"],
                200,
                row["temperature"]
            ])

        while len(seq_rows) < SEQUENCE_LENGTH:
            seq_rows.insert(0, seq_rows[0])

        sequence = np.array(seq_rows[-SEQUENCE_LENGTH:])
        soil_value = float(df["soil_moisture"].iloc[-1])

        result = predict_sequence(sequence, soil_value, future_steps)
        return jsonify(result)

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/api/report", methods=["POST"])
def generate_report():
    data = request.get_json()

    # Safety defaults
    risk_score = data.get("risk_score", 0)
    risk_label = data.get("risk_label", "Unknown")
    confidence = data.get("confidence", 0)
    metrics = data.get("metrics", {})

    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)
    elements = []

    styles = getSampleStyleSheet()
    elements.append(Paragraph("<b>AgriCastNet Greenhouse Report</b>", styles["Title"]))
    elements.append(Spacer(1, 20))

    table_data = [
        ["Parameter", "Value"],
        ["Risk Score", str(risk_score)],
        ["Risk Level", risk_label],
        ["Confidence", f"{confidence} %"]
    ]

    table = Table(table_data, colWidths=[150, 150])
    table.setStyle(TableStyle([
        ("GRID", (0,0), (-1,-1), 1, colors.black),
        ("BACKGROUND", (0,0), (-1,0), colors.lightgrey),
        ("ALIGN", (0,0), (-1,-1), "CENTER")
    ]))
    elements.append(table)
    elements.append(Spacer(1,20))

    # Metrics summary
    if metrics:
        elements.append(Paragraph("<b>Metrics Summary:</b>", styles["Heading2"]))
        metrics_table = [["Parameter", "Min", "Max", "Avg", "Trend"]]
        for k, v in metrics.items():
            metrics_table.append([
                k.capitalize(),
                round(v.get("min",0),2),
                round(v.get("max",0),2),
                round(v.get("avg",0),2),
                v.get("trend","-")
            ])
        m_table = Table(metrics_table, colWidths=[120,80,80,80,80])
        m_table.setStyle(TableStyle([
            ("GRID", (0,0), (-1,-1),1, colors.black),
            ("BACKGROUND", (0,0), (-1,0), colors.lightgrey),
            ("ALIGN", (0,0), (-1,-1), "CENTER")
        ]))
        elements.append(m_table)

    doc.build(elements)
    buffer.seek(0)

    return send_file(buffer, as_attachment=True, download_name="Greenhouse_Report.pdf", mimetype="application/pdf")

# -----------------------------------
# Run Server
# -----------------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
