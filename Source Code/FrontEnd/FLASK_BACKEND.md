# AgriCastNet Flask Backend Reference

This document describes how to set up the Flask backend for AgriCastNet.

> **Note:** Lovable cannot run Python/Flask code. You need to host this backend separately (e.g., on Heroku, Railway, AWS, or your local machine).

## Project Structure

```
backend/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── model/
│   └── final_model.keras  # Your trained Keras model
├── utils/
│   ├── preprocessing.py   # Data preprocessing logic
│   └── report_generator.py # PDF report generation
└── data/
    └── ds.csv             # Reference dataset
```

## Installation

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

## requirements.txt

```
flask==2.3.3
flask-cors==4.0.0
tensorflow==2.13.0
keras==2.13.1
numpy==1.24.3
pandas==2.0.3
scikit-learn==1.3.0
reportlab==4.0.4
matplotlib==3.7.2
python-dotenv==1.0.0
gunicorn==21.2.0
```

## app.py

```python
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import numpy as np
import pandas as pd
import tensorflow as tf
from io import BytesIO
import os
import uuid

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the trained model
MODEL_PATH = os.getenv('MODEL_PATH', 'model/final_model.keras')
model = tf.keras.models.load_model(MODEL_PATH)

# Validation rules
VALIDATION_RULES = {
    'temperature': {'min': -10, 'max': 60},
    'humidity': {'min': 0, 'max': 100},
    'co2': {'min': 250, 'max': 5000},
    'soil_moisture': {'min': 0, 'max': 100}
}

# Store for reports
reports_store = {}


def validate_input(data):
    """Validate input data against rules."""
    errors = []
    for field, rules in VALIDATION_RULES.items():
        if field in data:
            value = data[field]
            if value < rules['min'] or value > rules['max']:
                errors.append(f"{field} must be between {rules['min']} and {rules['max']}")
    return errors


def preprocess_input(data):
    """
    Preprocess input data for model prediction.
    Implement the same preprocessing logic from your notebook.
    """
    # Example preprocessing - adjust based on your notebook
    features = np.array([
        data['temperature'],
        data['humidity'],
        data['co2'],
        data['soil_moisture']
    ])
    
    # Normalize (use the same scaler parameters from training)
    # You should save and load your scaler from training
    normalized = features / np.array([60, 100, 5000, 100])
    
    # Reshape for LSTM input (batch_size, timesteps, features)
    # Adjust based on your model's expected input shape
    return normalized.reshape(1, 1, 4)


def calculate_risk_score(predictions, input_data):
    """Calculate risk score based on predictions and thresholds."""
    score = 0
    
    # Temperature risk
    temp = input_data['temperature']
    if temp < 15 or temp > 35:
        score += 25
    elif temp < 20 or temp > 30:
        score += 10
    
    # Humidity risk
    humidity = input_data['humidity']
    if humidity < 40 or humidity > 80:
        score += 25
    elif humidity < 50 or humidity > 70:
        score += 10
    
    # CO2 risk
    co2 = input_data['co2']
    if co2 > 2000:
        score += 25
    elif co2 > 1200:
        score += 15
    elif co2 < 400:
        score += 10
    
    # Soil moisture risk
    moisture = input_data['soil_moisture']
    if moisture < 20 or moisture > 80:
        score += 25
    elif moisture < 30 or moisture > 70:
        score += 10
    
    return min(100, max(0, score))


def generate_recommendations(input_data, risk_score):
    """Generate recommendations based on input data."""
    recommendations = []
    
    if input_data['temperature'] > 30:
        recommendations.append('🌡️ Temperature is high - activate cooling systems')
    elif input_data['temperature'] < 18:
        recommendations.append('🌡️ Temperature is low - consider heating')
    
    if input_data['humidity'] > 75:
        recommendations.append('💧 High humidity - improve air circulation')
    elif input_data['humidity'] < 45:
        recommendations.append('💧 Low humidity - activate humidifier')
    
    if input_data['co2'] > 1500:
        recommendations.append('🌬️ CO₂ elevated - increase ventilation')
    elif input_data['co2'] < 400:
        recommendations.append('🌬️ CO₂ low - consider enrichment')
    
    if input_data['soil_moisture'] < 30:
        recommendations.append('🌱 Soil moisture critical - irrigate now')
    elif input_data['soil_moisture'] > 70:
        recommendations.append('🌱 Soil moisture high - reduce watering')
    
    if not recommendations:
        recommendations.append('✅ All parameters within optimal range')
    
    return recommendations


def generate_24h_predictions(model, input_data):
    """Generate 24-hour predictions using the model."""
    predictions = []
    
    for hour in range(24):
        # Simulate time-based variations
        time_factor = np.sin((hour / 24) * np.pi * 2)
        
        predictions.append({
            'hour': hour,
            'temperature': input_data['temperature'] + time_factor * 4 + np.random.uniform(-1, 1),
            'humidity': input_data['humidity'] + time_factor * 8 + np.random.uniform(-2.5, 2.5),
            'co2': input_data['co2'] + (100 if 8 < hour < 18 else -50) + np.random.uniform(-25, 25),
            'soil_moisture': input_data['soil_moisture'] - hour * 0.3 + np.random.uniform(-1, 1)
        })
    
    return predictions


@app.route('/api/predict', methods=['POST'])
def predict():
    """Handle prediction requests."""
    try:
        # Check if file upload
        if 'file' in request.files:
            file = request.files['file']
            if not file.filename.endswith('.csv'):
                return jsonify({'error': 'Please upload a CSV file'}), 400
            
            df = pd.read_csv(file)
            required_columns = ['temperature', 'humidity', 'co2', 'soil_moisture']
            
            if not all(col in df.columns for col in required_columns):
                return jsonify({'error': f'CSV must contain columns: {required_columns}'}), 400
            
            # Process batch - use average values
            input_data = {
                'temperature': df['temperature'].mean(),
                'humidity': df['humidity'].mean(),
                'co2': df['co2'].mean(),
                'soil_moisture': df['soil_moisture'].mean()
            }
        else:
            # JSON input
            input_data = request.get_json()
            if not input_data:
                return jsonify({'error': 'No input data provided'}), 400
        
        # Validate input
        errors = validate_input(input_data)
        if errors:
            return jsonify({'error': '. '.join(errors)}), 400
        
        # Preprocess and predict
        processed = preprocess_input(input_data)
        model_output = model.predict(processed)
        
        # Calculate risk
        risk_score = calculate_risk_score(model_output, input_data)
        risk_label = 'Low' if risk_score < 33 else 'Moderate' if risk_score < 66 else 'High'
        
        # Generate predictions and recommendations
        predictions = generate_24h_predictions(model, input_data)
        recommendations = generate_recommendations(input_data, risk_score)
        
        # Generate report ID
        report_id = str(uuid.uuid4())
        reports_store[report_id] = {
            'input': input_data,
            'risk_score': risk_score,
            'risk_label': risk_label,
            'predictions': predictions,
            'recommendations': recommendations
        }
        
        return jsonify({
            'status': 'ok',
            'risk_score': risk_score,
            'risk_label': risk_label,
            'predictions': predictions,
            'recommendations': recommendations,
            'report_url': f'/api/report/{report_id}',
            'metrics': {
                'temperature': {
                    'min': min(p['temperature'] for p in predictions),
                    'max': max(p['temperature'] for p in predictions),
                    'avg': sum(p['temperature'] for p in predictions) / len(predictions),
                    'trend': 'stable'
                },
                'humidity': {
                    'min': min(p['humidity'] for p in predictions),
                    'max': max(p['humidity'] for p in predictions),
                    'avg': sum(p['humidity'] for p in predictions) / len(predictions),
                    'trend': 'up'
                },
                'co2': {
                    'min': min(p['co2'] for p in predictions),
                    'max': max(p['co2'] for p in predictions),
                    'avg': sum(p['co2'] for p in predictions) / len(predictions),
                    'trend': 'up'
                },
                'soil_moisture': {
                    'min': min(p['soil_moisture'] for p in predictions),
                    'max': max(p['soil_moisture'] for p in predictions),
                    'avg': sum(p['soil_moisture'] for p in predictions) / len(predictions),
                    'trend': 'down'
                }
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/report/<report_id>', methods=['GET'])
def get_report(report_id):
    """Generate and return PDF report."""
    if report_id not in reports_store:
        return jsonify({'error': 'Report not found'}), 404
    
    report_data = reports_store[report_id]
    
    # Generate PDF (simplified - use reportlab for actual implementation)
    from reportlab.lib.pagesizes import letter
    from reportlab.pdfgen import canvas
    from reportlab.lib.units import inch
    
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter
    
    # Header
    c.setFont("Helvetica-Bold", 24)
    c.drawString(1*inch, height - 1*inch, "AgriCastNet Report")
    
    c.setFont("Helvetica", 12)
    c.drawString(1*inch, height - 1.5*inch, f"Risk Score: {report_data['risk_score']}%")
    c.drawString(1*inch, height - 1.8*inch, f"Risk Level: {report_data['risk_label']}")
    
    # Input data
    c.setFont("Helvetica-Bold", 14)
    c.drawString(1*inch, height - 2.5*inch, "Input Parameters:")
    c.setFont("Helvetica", 12)
    y = height - 2.9*inch
    for key, value in report_data['input'].items():
        c.drawString(1.2*inch, y, f"{key}: {value:.2f}")
        y -= 0.3*inch
    
    # Recommendations
    c.setFont("Helvetica-Bold", 14)
    c.drawString(1*inch, y - 0.3*inch, "Recommendations:")
    c.setFont("Helvetica", 12)
    y -= 0.6*inch
    for rec in report_data['recommendations']:
        c.drawString(1.2*inch, y, f"• {rec}")
        y -= 0.3*inch
    
    # Footer
    c.setFont("Helvetica-Oblique", 10)
    c.drawString(1*inch, 0.5*inch, "Generated by AgriCastNet - Smart Greenhouse Forecasting")
    
    c.save()
    buffer.seek(0)
    
    return send_file(
        buffer,
        mimetype='application/pdf',
        as_attachment=True,
        download_name=f'agricastnet_report_{report_id[:8]}.pdf'
    )


@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint."""
    return jsonify({'status': 'healthy', 'model_loaded': model is not None})


if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
```

## Connecting Frontend to Backend

1. Set the `VITE_API_URL` environment variable in your Lovable project:
   - Go to Project Settings → Environment Variables
   - Add: `VITE_API_URL=https://your-backend-url.com`

2. The frontend API service (`src/lib/api.ts`) will automatically use this URL.

## Running Locally

```bash
# Start Flask server
python app.py

# Server will be available at http://localhost:5000
```

## Deploying

### Heroku
```bash
heroku create agricastnet-backend
heroku config:set MODEL_PATH=model/final_model.keras
git push heroku main
```

### Railway
1. Connect your GitHub repo
2. Add environment variable: `MODEL_PATH=model/final_model.keras`
3. Deploy automatically

### Docker
```dockerfile
FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["gunicorn", "-b", "0.0.0.0:5000", "app:app"]
```

## Model Training Notes

Based on your `AgriCastNet (2).ipynb` notebook, ensure:

1. **Preprocessing consistency**: Use the same normalization/scaling as during training
2. **Window size**: Match the sliding window size used in training
3. **Input shape**: Ensure input tensor shape matches model expectations
4. **Scaler persistence**: Save and load your sklearn scaler for consistent preprocessing

Example scaler usage:
```python
import joblib

# During training - save scaler
joblib.dump(scaler, 'model/scaler.pkl')

# During inference - load scaler
scaler = joblib.load('model/scaler.pkl')
normalized_data = scaler.transform(input_data)
```
