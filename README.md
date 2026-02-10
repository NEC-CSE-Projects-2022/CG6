<<<<<<< HEAD
=======

>>>>>>> c93a40bb (final)
# CG6 – AgriCastNet: A Unified Deep Forecasting Framework for Smart Greenhouse Microclimates
## Team Info
- 22471A05K1 — **Syed Tasneem Banu** ( [LinkedIn](https://linkedin.com/in/xxxxxxxxxx) )
_Work Done: xxxxxxxxxx_

- 22471A05E7 — **B. Sailaja** ( [LinkedIn](https://linkedin.com/in/xxxxxxxxxx) )
_Work Done: xxxxxxxxxx_

- 22471A05J2 — **Sk. Nazeera** ( [LinkedIn](https://linkedin.com/in/xxxxxxxxxx) )
_Work Done: xxxxxxxxxx_

---

## Abstract
Greenhouse climate control is becoming increasingly important as climate variability increases, especially in various agro-climatic zones. However, fault tolerance is often a problem, especially in current models that tend to fail because they are sensitive to sensor failure, lack generalization ability, and have extremely high computing requirements. This study proposed a forecasting framework to improve fault tolerance and adaptive learning capabilities by incorporating Climatic Influence Indicators (CII), incorporated with more complex deep learning models, to accurately and rapidly forecast the greenhouse micro-climate. We utilized a multivariate greenhouse dataset, which consisted of temperature, humidity, CO₂ levels, radiation, and water uptake. The CII layer uses embedded temporal importance from input signals in order to improve the reliability of the model in the event of a sensor failure. A review of literature saw research performed on LSTM, GRU models; however, very few papers approached the dual problems of fault tolerance and ease of deployment. Results suggest some mildly successful outcomes, including TCN: 98.89%, PLSTM: 94.86%, XGBoost: 99.59% TFT: 98.16% and CNN + BiLSTM: 99.67%.

---

## Paper Reference (Inspiration)
<<<<<<< HEAD
👉 **Deep Learning Innovations for Greenhouse Climate Prediction: Insights from a Spanish Case Study –
Salma Ait Oussous et al. IEEE Access, 2025((https://ieeexplore.ieee.org/document/10960464))**


## Our Improvement Over Existing Paper
Introduced Climatic Influence Indicators (CII) for sensor fault tolerance

Extended evaluation from a single climatic zone to multiple agro-climatic zones

Compared multiple deep learning and ensemble models

Applied 5-Fold Cross Validation for realistic generalization

Designed a deployment-ready framework for real greenhouse environments

## About the Project
What it does:
Predicts greenhouse microclimate parameters such as temperature, humidity, CO₂ concentration, and solar radiation.

Why it is useful:
Enables reliable climate control, reduces crop loss due to faulty sensors, and supports smart agriculture automation.

Project workflow:
Sensor Data → Preprocessing → CII Layer → Deep Learning Models → Climate Forecast Output

## Dataset Used
👉 **Spanish & Mexican Greenhouse Climate Dataset
(https://zenodo.org/records/6697044)**

**Dataset Details:**
Internal and external temperature

Internal and external humidity

CO₂ concentration

Solar radiation

Dew point (derived when missing)

Multivariate time-series greenhouse data

## Dependencies Used
Python, NumPy, Pandas, Matplotlib, Seaborn, Scikit-learn, TensorFlow, Keras, XGBoost, Google Colab
## EDA & Preprocessing
Missing value handling using temporal interpolation

Dew point calculation using atmospheric equations

Feature normalization

Correlation heatmap analysis

Dropout and regularization to prevent overfitting
## Model Training Info
Train-Test Split: 80:20

Cross-Validation: 5-Fold

Epochs: 30

Batch Size: 16–64

Optimizer: Adam

Bayesian hyperparameter tuning

## Model Testing / Evaluation
Models: CNN-BiLSTM, TCN, TFT, PLSTM, XGBoost

Metrics: Accuracy, R², RMSE, MAE

Evaluation using predicted vs actual plots

## Results
Model	                 Accuracy
CNN-BiLSTM	            99.67%
XGBoost	                99.59%
TCN	                    98.89%
TFT	                    98.16%
PLSTM	                  94.86%
## Limitations & Future Work
High computational cost for edge deployment

No real-time IoT integration

Future enhancements include ensemble learning, explainable AI, and lightweight IoT deployment.

## Deployment Info
Development Environment: Windows

Training Platform: Google Colab

Target Deployment: Smart Greenhouse IoT Systems
=======
👉 **[Paper Title xxxxxxxxxx
  – Author Names xxxxxxxxxx
 ](Paper URL here)**
Original conference/IEEE paper used as inspiration for the model.

---

## Our Improvement Over Existing Paper
xxxxxxxxxx

---

## About the Project
Give a simple explanation of:
- What your project does
- Why it is useful
- General project workflow (input → processing → model → output)

---

## Dataset Used
👉 **[Dataset Name](Dataset URL)**

**Dataset Details:**
xxxxxxxxxx

---

## Dependencies Used
xxxxxxxxxx, xxxxxxxxxx, xxxxxxxxxx ...

---

## EDA & Preprocessing
xxxxxxxxxx

---

## Model Training Info
xxxxxxxxxx

---

## Model Testing / Evaluation
xxxxxxxxxx

---

## Results
xxxxxxxxxx

---

## Limitations & Future Work
xxxxxxxxxx

---

## Deployment Info
>>>>>>> c93a40bb (final)
xxxxxxxxxx

---
