export interface CustomerFormData {
  gender: string;
  SeniorCitizen: number;
  Partner: string;
  Dependents: string;
  tenure: number;
  PhoneService: string;
  MultipleLines: string;
  InternetService: string;
  OnlineSecurity: string;
  OnlineBackup: string;
  DeviceProtection: string;
  TechSupport: string;
  StreamingTV: string;
  StreamingMovies: string;
  Contract: string;
  PaperlessBilling: string;
  PaymentMethod: string;
  MonthlyCharges: number;
  TotalCharges: number;
}

export interface PredictionResult {
  prediction: string; // "Churn" | "No Churn"
  churn_probability: number; // percentage e.g. 78.4
  risk_level: "LOW RISK" | "MEDIUM RISK" | "HIGH RISK";
  risk_color: "emerald" | "amber" | "rose";
  contributing_factors: string[];
  disclaimer: string;
}

export interface GroupStat {
  category: string;
  total: number;
  retained: number;
  churned: number;
  churn_rate: number;
}

export interface ChurnVsNonChurn {
  name: string;
  value: number;
  percentage: number;
}

export interface EDAStats {
  total_customers: number;
  churned_customers: number;
  non_churned_customers: number;
  overall_churn_rate: number;
  churn_vs_non_churn: ChurnVsNonChurn[];
  churn_by_contract: GroupStat[];
  churn_by_tenure: GroupStat[];
  churn_by_monthly_charges: GroupStat[];
  churn_by_payment_method: GroupStat[];
  churn_by_internet_service: GroupStat[];
  churn_by_senior_citizen: GroupStat[];
  churn_by_paperless: GroupStat[];
  numerical_summary: {
    tenure: { mean: number; median: number; min: number; max: number };
    MonthlyCharges: { mean: number; median: number; min: number; max: number };
    TotalCharges: { mean: number; median: number; min: number; max: number };
  };
}

export interface ConfusionMatrixData {
  tn: number;
  fp: number;
  fn: number;
  tp: number;
  matrix: number[][];
}

export interface ModelMetric {
  name: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  roc_auc: number;
  confusion_matrix: ConfusionMatrixData;
}

export interface FeatureImportance {
  feature: string;
  importance: number;
}

export interface ModelMetricsSummary {
  best_model: string;
  feature_cols: string[];
  models: ModelMetric[];
  feature_importances: FeatureImportance[];
}
