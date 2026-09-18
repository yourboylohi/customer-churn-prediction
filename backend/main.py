import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import pandas as pd
import joblib

app = FastAPI(
    title="Customer Churn Prediction API",
    description="Machine Learning API for IBM Telco Customer Churn Prediction",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SAVED_MODELS_DIR = os.path.join(os.path.dirname(__file__), "saved_models")
MODEL_PATH = os.path.join(SAVED_MODELS_DIR, "model_pipeline.joblib")
STATS_PATH = os.path.join(SAVED_MODELS_DIR, "eda_stats.json")
METRICS_PATH = os.path.join(SAVED_MODELS_DIR, "metrics.json")

# Load model pipeline and statistics at startup
model_pipeline = None
eda_stats = {}
model_metrics = {}

@app.on_event("startup")
def load_artifacts():
    global model_pipeline, eda_stats, model_metrics
    if os.path.exists(MODEL_PATH):
        model_pipeline = joblib.load(MODEL_PATH)
        print("Loaded trained model pipeline successfully.")
    else:
        print("Warning: Trained model pipeline not found. Run train_model.py first.")
        
    if os.path.exists(STATS_PATH):
        with open(STATS_PATH, "r") as f:
            eda_stats = json.load(f)
            
    if os.path.exists(METRICS_PATH):
        with open(METRICS_PATH, "r") as f:
            model_metrics = json.load(f)

class CustomerInput(BaseModel):
    gender: str = Field(..., example="Female")
    SeniorCitizen: int = Field(..., example=0)
    Partner: str = Field(..., example="Yes")
    Dependents: str = Field(..., example="No")
    tenure: int = Field(..., example=12)
    PhoneService: str = Field(..., example="Yes")
    MultipleLines: str = Field(..., example="No")
    InternetService: str = Field(..., example="Fiber optic")
    OnlineSecurity: str = Field(..., example="No")
    OnlineBackup: str = Field(..., example="Yes")
    DeviceProtection: str = Field(..., example="No")
    TechSupport: str = Field(..., example="No")
    StreamingTV: str = Field(..., example="No")
    StreamingMovies: str = Field(..., example="No")
    Contract: str = Field(..., example="Month-to-month")
    PaperlessBilling: str = Field(..., example="Yes")
    PaymentMethod: str = Field(..., example="Electronic check")
    MonthlyCharges: float = Field(..., example=70.35)
    TotalCharges: float = Field(..., example=844.20)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "Customer Churn Prediction API",
        "dataset": "IBM Telco Customer Churn",
        "best_model": model_metrics.get("best_model", "Logistic Regression")
    }

@app.get("/api/stats")
def get_stats():
    if not eda_stats:
        raise HTTPException(status_code=500, detail="EDA statistics not loaded. Run train_model.py.")
    return eda_stats

@app.get("/api/metrics")
def get_metrics():
    if not model_metrics:
        raise HTTPException(status_code=500, detail="Model metrics not loaded. Run train_model.py.")
    return model_metrics

@app.post("/api/predict")
def predict_churn(customer: CustomerInput):
    if model_pipeline is None:
        raise HTTPException(status_code=500, detail="Model pipeline not initialized.")
    
    # Convert Pydantic object to pandas DataFrame (1 row)
    input_data = customer.dict()
    df_input = pd.DataFrame([input_data])
    
    # Compute prediction and probabilities
    churn_proba = float(model_pipeline.predict_proba(df_input)[0, 1])
    churn_proba_pct = round(churn_proba * 100, 1)
    prediction_label = "Churn" if churn_proba >= 0.5 else "No Churn"
    
    # Classify Risk Level
    if churn_proba < 0.35:
        risk_level = "LOW RISK"
        risk_color = "emerald"
    elif churn_proba < 0.65:
        risk_level = "MEDIUM RISK"
        risk_color = "amber"
    else:
        risk_level = "HIGH RISK"
        risk_color = "rose"
        
    # Analyze Risk Factors
    factors = []
    if input_data["Contract"] == "Month-to-month":
        factors.append("Month-to-month contract structure (High attrition rate)")
    if input_data["InternetService"] == "Fiber optic" and input_data["TechSupport"] == "No":
        factors.append("Fiber optic subscription lacking dedicated Tech Support")
    if input_data["tenure"] <= 12:
        factors.append(f"Short tenure ({input_data['tenure']} months) - critical early customer lifecycle window")
    if input_data["PaymentMethod"] == "Electronic check":
        factors.append("Electronic check payment method associated with higher churn")
    if input_data["OnlineSecurity"] == "No":
        factors.append("Missing Online Security feature")
    if input_data["MonthlyCharges"] > 70.0:
        factors.append(f"High monthly recurring fee (${input_data['MonthlyCharges']:.2f}/mo)")
        
    if not factors:
        factors.append("Favorable long-term customer agreement and service usage patterns")

    return {
        "prediction": prediction_label,
        "churn_probability": churn_proba_pct,
        "risk_level": risk_level,
        "risk_color": risk_color,
        "contributing_factors": factors,
        "disclaimer": "This prediction is based on patterns learned from historical customer data and is not a guarantee that the customer will churn."
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
