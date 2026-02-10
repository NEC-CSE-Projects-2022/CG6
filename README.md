CG6 – AgriCastNet: A Unified Deep Forecasting Framework for Smart Greenhouse Microclimates

👩‍💻 Team Information
Roll No	Name	Work Contribution
22471A05K1	Syed Tasneem Banu	Model design & implementation (CNN-BiLSTM, TCN, TFT), data preprocessing, performance evaluation, result analysis, paper drafting
22471A05E7	B. Sailaja	Dataset analysis, PLSTM implementation, comparative study, experimentation support
22471A05J2	Sk. Nazeera	XGBoost modeling, EDA visualization, metrics computation, documentation & validation
🧠 Abstract

Greenhouse climate control has become critical due to increasing climate variability across agro-climatic zones. Existing forecasting models often lack fault tolerance, fail under sensor malfunction, and require heavy computational resources.

AgriCastNet proposes a fault-resilient deep learning framework using Climatic Influence Indicators (CII) integrated with advanced deep learning models to improve robustness, adaptability, and forecasting accuracy.

A multivariate greenhouse dataset containing temperature, humidity, CO₂, radiation, and water uptake is used. The CII layer embeds temporal importance into the input signals, enabling reliable prediction even under sensor failure scenarios.

Extensive experiments across multiple models demonstrate strong performance, with CNN-BiLSTM achieving the highest accuracy of 99.67%, proving AgriCastNet’s effectiveness for smart greenhouse microclimate forecasting.

📄 Paper Reference (Inspiration)

Deep Learning Innovations for Greenhouse Climate Prediction: Insights from a Spanish Case Study
Salma Ait Oussous et al., IEEE Access, 2025
🔗 https://ieeexplore.ieee.org/document/10960464

🚀 Our Improvement Over Existing Paper

Compared to the base paper, AgriCastNet introduces several major advancements:

✅ Climatic Influence Indicators (CII) for sensor fault tolerance

✅ Multi-model comparative framework (CNN-BiLSTM, TCN, TFT, PLSTM, XGBoost)

✅ Cross-agro-climatic generalization instead of a single climate zone

✅ 5-Fold Cross-Validation for realistic performance evaluation

✅ Deployment-oriented design suitable for real-world greenhouse systems

🌿 About the Project
🔹 What the Project Does

AgriCastNet predicts greenhouse microclimate parameters such as:

Temperature

Humidity

CO₂ concentration

Solar radiation

using deep learning models that remain accurate even when sensor data is faulty or missing.

🔹 Why It Is Useful

Helps farmers maintain optimal crop conditions

Reduces losses caused by sensor failure

Supports smart agriculture & automation

Scalable across multiple agro-climatic zones

🔹 Project Workflow
Sensor Data → Preprocessing → CII Layer → Deep Learning Model → Climate Forecast Output

📊 Dataset Used

Spanish & Mexican Greenhouse Climate Dataset
🔗 https://zenodo.org/records/6697044

Dataset Details

Internal & external temperature

Internal & external humidity

CO₂ concentration

Solar radiation

Dew point (computed where missing)

High-resolution multivariate time-series data

🛠️ Dependencies Used

Python

NumPy

Pandas

Matplotlib / Seaborn

Scikit-learn

TensorFlow / Keras

XGBoost

Google Colab

🔍 EDA & Preprocessing

Missing value handling using temporal interpolation

Dew point computation via standard atmospheric equations

Feature normalization for stable training

Correlation heatmap analysis (before & after preprocessing)

Overfitting prevention using dropout & regularization

🧪 Model Training Information

Train/Test Split: 80 : 20

Cross-Validation: 5-Fold

Epochs: 30

Batch Size: 16 – 64

Optimizer: Adam

Hyperparameter tuning via Bayesian Optimization

📈 Model Testing & Evaluation
Models Implemented

CNN-BiLSTM

Temporal Convolutional Network (TCN)

Temporal Fusion Transformer (TFT)

Pyramidal LSTM (PLSTM)

XGBoost

Evaluation Metrics

Accuracy

R² Score

RMSE

MAE

🏆 Results
Model	Accuracy
CNN-BiLSTM	99.67%
XGBoost	99.59%
TCN	98.89%
TFT	98.16%
PLSTM	94.86%

✔ CNN-BiLSTM achieved the best overall performance, demonstrating superior spatio-temporal learning and fault tolerance.

⚠️ Limitations & Future Work
Current Limitations

Computationally intensive for edge devices

No real-time IoT deployment yet

Future Enhancements

🔹 Multi-class risk prediction (Normal / Warning / Alert)

🔹 Model stacking & ensemble voting

🔹 Explainable AI (SHAP / LIME)

🔹 IoT & edge deployment using TensorFlow Lite / ONNX

🌐 Deployment Information

Development Environment: Windows

Training Platform: Google Colab

Future Deployment: IoT-based greenhouse automation systems

📜 License

This project is intended for academic and research purposes.
All rights reserved to the authors.
