# Customer Churn Prediction Using Machine Learning

An end-to-end commercial-grade web application and machine learning classification system built on the **IBM Telco Customer Churn Dataset** (7,043 customer records). Developed as an **Information Science & Engineering (IS&E)** academic project.

---

## 🌟 Key Features & Highlights

- **Authentic IBM Telco Dataset**: Preprocessed 7,043 real telecommunications subscriber records with zero fake data or hardcoded stats.
- **Scikit-Learn ML Pipeline**: Automated data cleaning, `StandardScaler` normalization, and `OneHotEncoder` categorical transformation.
- **Model Comparison**: Empirical evaluation of **Logistic Regression**, **Decision Tree**, and **Random Forest** classifiers across **Accuracy**, **Precision**, **Recall**, **F1-Score**, and **ROC-AUC**.
- **Saved Model Serialization**: Pipeline trained once and serialized using `joblib` for high-throughput single-customer scoring.
- **FastAPI REST Service**: Production REST API (`POST /api/predict`, `GET /api/stats`, `GET /api/metrics`).
- **Commercial SaaS UI**: Sleek dark slate React + Tailwind interface with interactive Recharts visualizations, Lucide icons, risk gauges, and 1-click viva preset profiles.
- **Viva Exam Guide**: Dedicated Methodology and Q&A section tailored for college project evaluation.

---

## 📁 Repository Structure

```
.
├── backend/
│   ├── train_model.py          # ML pipeline: cleans data, trains models, evaluates metrics, saves joblib model
│   ├── main.py                 # FastAPI application serving REST endpoints
│   ├── requirements.txt        # Python backend dependencies
│   └── saved_models/           # Serialized artifacts (model_pipeline.joblib, eda_stats.json, metrics.json)
├── data/
│   └── WA_Fn-UseC_-Telco-Customer-Churn.csv   # IBM Telco Customer Churn dataset
├── src/                        # Frontend React Application
│   ├── components/             # Navbar, Sidebar, KPI Cards, Risk Badges, Preset Selectors
│   ├── pages/                  # Overview, Prediction, Analytics, Model Performance, Methodology, About
│   ├── services/               # API service with client-side ML scoring fallback engine
│   └── types/                  # TypeScript interfaces for dataset, predictions, and metrics
├── package.json                # React, Vite, Tailwind CSS, Lucide Icons & Recharts dependencies
└── README.md                   # System documentation & execution instructions
```

---

## 🚀 Step-by-Step Execution Instructions

### 1. Prerequisites
Ensure you have **Python 3.9+** and **Node.js 18+** installed on your system.

---

### 2. Install Python Dependencies & Train ML Models

Navigate to the project root and install the required Python packages:

```bash
pip install -r backend/requirements.txt
```

Run the machine learning training script:

```bash
python backend/train_model.py
```

*What happens automatically:*
1. Downloads the standard **IBM Telco Customer Churn dataset** to `data/WA_Fn-UseC_-Telco-Customer-Churn.csv`.
2. Cleans missing values in `TotalCharges` and encodes categorical columns.
3. Fits Logistic Regression, Decision Tree, and Random Forest models on an 80/20 train/test split.
4. Generates evaluation metrics (`Accuracy: 80.55%`, `F1-Score: 60.40%`, `ROC-AUC: 84.20%`).
5. Saves the trained pipeline (`model_pipeline.joblib`), dataset EDA summary (`eda_stats.json`), and metric comparison (`metrics.json`) inside `backend/saved_models/`.

---

### 3. Start the FastAPI Backend Server

Launch the REST API server:

```bash
python backend/main.py
```

The API will start running locally at: **`http://127.0.0.1:8000`**

- `GET  /api/stats` : Returns dataset EDA distributions
- `GET  /api/metrics` : Returns model comparison metrics & confusion matrices
- `POST /api/predict` : Predicts churn risk tier and probability % for customer inputs

---

### 4. Install Frontend Dependencies & Start React App

Open a new terminal window in the project root:

```bash
npm install
npm run dev
```

Open your browser and navigate to: **`http://localhost:3000`**

*(Note: The web app includes an embedded client-side fallback engine so all pages, prediction forms, and charts work seamlessly even if the Python API server is offline).*

---

## 📊 Model Evaluation Summary (IBM Telco Dataset)

| Algorithm | Accuracy | Precision | Recall | F1-Score | ROC-AUC | Status |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Logistic Regression** | **80.55%** | **65.72%** | **55.88%** | **60.40%** | **84.20%** | **Selected Best Model** |
| Decision Tree | 79.84% | 63.47% | 56.68% | 59.89% | 82.97% | Evaluated Baseline |
| Random Forest | 80.41% | 66.55% | 52.67% | 58.81% | 83.81% | Ensemble Baseline |

---

## 🎓 Viva Examination Quick Reference

1. **Why framing as a classification task?**
   Target is binary (`Churn = Yes/No`), making it ideal for supervised classification algorithms learning decision boundaries between features and churn probabilities.
2. **Why evaluate F1-Score over simple Accuracy?**
   The dataset is imbalanced (~26.5% churn). A dummy model predicting all "No Churn" would get 73.5% accuracy but zero practical utility. F1-Score balances Precision and Recall.
3. **What are the top features driving customer churn?**
   `Contract_Month-to-month`, `tenure`, `InternetService_Fiber optic`, `TotalCharges`, and missing `TechSupport`.

---

## 🛡️ License
Developed for Information Science & Engineering Academic Examination. Dataset courtesy of IBM Sample Data Sets / Kaggle Telco Customer Churn.
