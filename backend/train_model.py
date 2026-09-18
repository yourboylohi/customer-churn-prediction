import os
import json
import urllib.request
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix
import joblib

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
SAVED_MODELS_DIR = os.path.join(os.path.dirname(__file__), "saved_models")
DATASET_PATH = os.path.join(DATA_DIR, "WA_Fn-UseC_-Telco-Customer-Churn.csv")

DATASET_URLS = [
    "https://raw.githubusercontent.com/treselle-systems/customer_churn_analysis/master/WA_Fn-UseC_-Telco-Customer-Churn.csv",
    "https://raw.githubusercontent.com/IBM/telco-customer-churn-on-icp-for-data/master/data/Telco-Customer-Churn.csv"
]

def ensure_dataset_exists():
    os.makedirs(DATA_DIR, exist_ok=True)
    if not os.path.exists(DATASET_PATH):
        print("Downloading IBM Telco Customer Churn dataset...")
        download_success = False
        for url in DATASET_URLS:
            try:
                urllib.request.urlretrieve(url, DATASET_PATH)
                print(f"Successfully downloaded dataset from {url}")
                download_success = True
                break
            except Exception as e:
                print(f"Failed to download from {url}: {e}")
        
        if not download_success:
            raise RuntimeError("Could not download Telco Customer Churn dataset. Please check network connectivity.")
    else:
        print(f"Dataset already exists at {DATASET_PATH}")

def load_and_clean_data():
    ensure_dataset_exists()
    df = pd.read_csv(DATASET_PATH)
    
    # 1. Clean TotalCharges (spaces to NaN and cast to float)
    df['TotalCharges'] = pd.to_numeric(df['TotalCharges'].astype(str).str.strip(), errors='coerce')
    # Fill missing TotalCharges (which happen when tenure == 0) with 0.0
    df['TotalCharges'] = df['TotalCharges'].fillna(0.0)
    
    # 2. SeniorCitizen cast to int
    df['SeniorCitizen'] = df['SeniorCitizen'].astype(int)
    
    # Target variable Churn string to 1/0
    df['Churn_Numeric'] = df['Churn'].apply(lambda x: 1 if str(x).strip().lower() == 'yes' else 0)
    
    return df

def generate_eda_stats(df):
    total_customers = int(len(df))
    churned_customers = int(df['Churn_Numeric'].sum())
    non_churned_customers = total_customers - churned_customers
    overall_churn_rate = round((churned_customers / total_customers) * 100, 2)
    
    # Churn vs Non-Churn
    churn_vs_non_churn = [
        {"name": "Retained", "value": non_churned_customers, "percentage": round(100 - overall_churn_rate, 2)},
        {"name": "Churned", "value": churned_customers, "percentage": overall_churn_rate}
    ]
    
    # Helper to calculate churn by group
    def get_group_stats(group_col):
        stats = []
        grouped = df.groupby(group_col)
        for name, group in grouped:
            total = len(group)
            churned = int(group['Churn_Numeric'].sum())
            retained = total - churned
            rate = round((churned / total) * 100, 2)
            stats.append({
                "category": str(name),
                "total": total,
                "retained": retained,
                "churned": churned,
                "churn_rate": rate
            })
        return stats

    # Contract
    churn_by_contract = get_group_stats('Contract')
    
    # Tenure buckets
    def get_tenure_group(t):
        if t <= 12: return "0-12 months"
        elif t <= 24: return "13-24 months"
        elif t <= 48: return "25-48 months"
        else: return "49-72 months"
    
    df['tenure_group'] = df['tenure'].apply(get_tenure_group)
    tenure_order = ["0-12 months", "13-24 months", "25-48 months", "49-72 months"]
    churn_by_tenure_raw = get_group_stats('tenure_group')
    churn_by_tenure = sorted(churn_by_tenure_raw, key=lambda x: tenure_order.index(x['category']) if x['category'] in tenure_order else 99)
    
    # Monthly charges buckets
    def get_monthly_group(m):
        if m <= 30: return "$0 - $30"
        elif m <= 60: return "$30 - $60"
        elif m <= 90: return "$60 - $90"
        else: return "$90+"
    
    df['monthly_group'] = df['MonthlyCharges'].apply(get_monthly_group)
    monthly_order = ["$0 - $30", "$30 - $60", "$60 - $90", "$90+"]
    churn_by_monthly_raw = get_group_stats('monthly_group')
    churn_by_monthly_charges = sorted(churn_by_monthly_raw, key=lambda x: monthly_order.index(x['category']) if x['category'] in monthly_order else 99)

    # Payment Method
    churn_by_payment_method = get_group_stats('PaymentMethod')

    # Internet Service
    churn_by_internet_service = get_group_stats('InternetService')

    # Senior Citizen
    df['SeniorCitizen_Label'] = df['SeniorCitizen'].apply(lambda x: "Senior Citizen" if x == 1 else "Non-Senior")
    churn_by_senior_citizen = get_group_stats('SeniorCitizen_Label')

    # Paperless Billing
    churn_by_paperless = get_group_stats('PaperlessBilling')

    # Summary numerical stats
    numerical_summary = {
        "tenure": {
            "mean": round(float(df['tenure'].mean()), 2),
            "median": float(df['tenure'].median()),
            "min": int(df['tenure'].min()),
            "max": int(df['tenure'].max())
        },
        "MonthlyCharges": {
            "mean": round(float(df['MonthlyCharges'].mean()), 2),
            "median": float(df['MonthlyCharges'].median()),
            "min": round(float(df['MonthlyCharges'].min()), 2),
            "max": round(float(df['MonthlyCharges'].max()), 2)
        },
        "TotalCharges": {
            "mean": round(float(df['TotalCharges'].mean()), 2),
            "median": float(df['TotalCharges'].median()),
            "min": round(float(df['TotalCharges'].min()), 2),
            "max": round(float(df['TotalCharges'].max()), 2)
        }
    }

    return {
        "total_customers": total_customers,
        "churned_customers": churned_customers,
        "non_churned_customers": non_churned_customers,
        "overall_churn_rate": overall_churn_rate,
        "churn_vs_non_churn": churn_vs_non_churn,
        "churn_by_contract": churn_by_contract,
        "churn_by_tenure": churn_by_tenure,
        "churn_by_monthly_charges": churn_by_monthly_charges,
        "churn_by_payment_method": churn_by_payment_method,
        "churn_by_internet_service": churn_by_internet_service,
        "churn_by_senior_citizen": churn_by_senior_citizen,
        "churn_by_paperless": churn_by_paperless,
        "numerical_summary": numerical_summary
    }

def train_and_evaluate_models(df):
    feature_cols = [
        'gender', 'SeniorCitizen', 'Partner', 'Dependents', 'tenure',
        'PhoneService', 'MultipleLines', 'InternetService', 'OnlineSecurity',
        'OnlineBackup', 'DeviceProtection', 'TechSupport', 'StreamingTV',
        'StreamingMovies', 'Contract', 'PaperlessBilling', 'PaymentMethod',
        'MonthlyCharges', 'TotalCharges'
    ]
    
    X = df[feature_cols].copy()
    y = df['Churn_Numeric'].values
    
    num_features = ['tenure', 'MonthlyCharges', 'TotalCharges']
    cat_features = [
        'gender', 'SeniorCitizen', 'Partner', 'Dependents', 'PhoneService',
        'MultipleLines', 'InternetService', 'OnlineSecurity', 'OnlineBackup',
        'DeviceProtection', 'TechSupport', 'StreamingTV', 'StreamingMovies',
        'Contract', 'PaperlessBilling', 'PaymentMethod'
    ]
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), num_features),
            ('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), cat_features)
        ]
    )
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    models = {
        "Logistic Regression": LogisticRegression(max_iter=1000, random_state=42),
        "Decision Tree": DecisionTreeClassifier(max_depth=5, random_state=42),
        "Random Forest": RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
    }
    
    evaluated_models = {}
    fitted_pipelines = {}
    
    best_model_name = None
    best_f1 = -1.0
    
    for name, clf in models.items():
        pipeline = Pipeline([
            ('preprocessor', preprocessor),
            ('classifier', clf)
        ])
        
        pipeline.fit(X_train, y_train)
        fitted_pipelines[name] = pipeline
        
        y_pred = pipeline.predict(X_test)
        y_proba = pipeline.predict_proba(X_test)[:, 1] if hasattr(pipeline, "predict_proba") else y_pred
        
        acc = float(accuracy_score(y_test, y_pred))
        prec = float(precision_score(y_test, y_pred))
        rec = float(recall_score(y_test, y_pred))
        f1 = float(f1_score(y_test, y_pred))
        auc = float(roc_auc_score(y_test, y_proba))
        
        cm = confusion_matrix(y_test, y_pred).tolist()
        tn, fp, fn, tp = int(cm[0][0]), int(cm[0][1]), int(cm[1][0]), int(cm[1][1])
        
        evaluated_models[name] = {
            "name": name,
            "accuracy": round(acc, 4),
            "precision": round(prec, 4),
            "recall": round(rec, 4),
            "f1_score": round(f1, 4),
            "roc_auc": round(auc, 4),
            "confusion_matrix": {
                "tn": tn,
                "fp": fp,
                "fn": fn,
                "tp": tp,
                "matrix": cm
            }
        }
        
        if f1 > best_f1:
            best_f1 = f1
            best_model_name = name

    # Feature Importance for Random Forest
    rf_pipeline = fitted_pipelines["Random Forest"]
    rf_clf = rf_pipeline.named_steps['classifier']
    prep = rf_pipeline.named_steps['preprocessor']
    
    cat_feature_names = prep.named_transformers_['cat'].get_feature_names_out(cat_features).tolist()
    all_feature_names = num_features + cat_feature_names
    
    importances = rf_clf.feature_importances_.tolist()
    feat_imp = sorted([
        {"feature": name, "importance": round(imp, 4)}
        for name, imp in zip(all_feature_names, importances)
    ], key=lambda x: x["importance"], reverse=True)[:15]

    # Save best model pipeline
    os.makedirs(SAVED_MODELS_DIR, exist_ok=True)
    best_pipeline = fitted_pipelines[best_model_name]
    joblib.dump(best_pipeline, os.path.join(SAVED_MODELS_DIR, "model_pipeline.joblib"))
    
    metrics_summary = {
        "best_model": best_model_name,
        "feature_cols": feature_cols,
        "models": list(evaluated_models.values()),
        "feature_importances": feat_imp
    }
    
    return fitted_pipelines, evaluated_models, metrics_summary

def main():
    print("--- TELCO CUSTOMER CHURN ML PIPELINE ---")
    df = load_and_clean_data()
    print(f"Loaded {len(df)} records from dataset.")
    
    print("Calculating EDA statistics...")
    eda_stats = generate_eda_stats(df)
    
    print("Training classification models (Logistic Regression, Decision Tree, Random Forest)...")
    fitted_pipelines, evaluated_models, metrics_summary = train_and_evaluate_models(df)
    
    print("\nMODEL EVALUATION SUMMARY:")
    for m in metrics_summary["models"]:
        print(f"Model: {m['name']:<20} | Accuracy: {m['accuracy']:.4f} | Precision: {m['precision']:.4f} | Recall: {m['recall']:.4f} | F1: {m['f1_score']:.4f} | ROC-AUC: {m['roc_auc']:.4f}")
    
    print(f"\nBest Selected Model: {metrics_summary['best_model']}")
    
    # Save stats & metrics JSON
    with open(os.path.join(SAVED_MODELS_DIR, "eda_stats.json"), "w") as f:
        json.dump(eda_stats, f, indent=2)
        
    with open(os.path.join(SAVED_MODELS_DIR, "metrics.json"), "w") as f:
        json.dump(metrics_summary, f, indent=2)
        
    print(f"Artifacts saved successfully in {SAVED_MODELS_DIR}")

if __name__ == "__main__":
    main()
