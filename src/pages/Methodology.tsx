import React from 'react';
import { GitBranch, Database, Sparkles, Filter, Code, Cpu, Target, FileCheck, Layers, HelpCircle } from 'lucide-react';

export const Methodology: React.FC = () => {
  const pipelineSteps = [
    {
      num: "01",
      title: "Dataset Acquisition",
      icon: Database,
      desc: "Download IBM Telco Customer Churn dataset containing 7,043 customer records and 21 raw columns.",
    },
    {
      num: "02",
      title: "Data Cleaning",
      icon: Filter,
      desc: "Convert TotalCharges from string to numeric. Handle 11 blank space missing values by imputing zero for 0-month tenure.",
    },
    {
      num: "03",
      title: "Feature Encoding",
      icon: Code,
      desc: "Apply One-Hot Encoding to 16 categorical columns (Contract, InternetService, TechSupport, etc.) using scikit-learn OneHotEncoder.",
    },
    {
      num: "04",
      title: "Feature Scaling",
      icon: Sparkles,
      desc: "Normalize numeric variables (tenure, MonthlyCharges, TotalCharges) using StandardScaler to eliminate scale distortion.",
    },
    {
      num: "05",
      title: "Train / Test Split",
      icon: Layers,
      desc: "Partition dataset into 80% Training Set (5,634 rows) and 20% Holdout Testing Set (1,409 rows) using stratified sampling.",
    },
    {
      num: "06",
      title: "Model Training",
      icon: Cpu,
      desc: "Fit 3 machine learning algorithms: Logistic Regression, Decision Tree Classifier, and Random Forest Ensemble.",
    },
    {
      num: "07",
      title: "Model Evaluation",
      icon: Target,
      desc: "Compute Accuracy, Precision, Recall, F1-Score, ROC-AUC, and Confusion Matrix across all models on unseen test data.",
    },
    {
      num: "08",
      title: "Serialization & API",
      icon: FileCheck,
      desc: "Serialize best model pipeline with Joblib. Expose POST /api/predict via FastAPI for single customer scoring.",
    },
  ];

  const vivaQuestions = [
    {
      q: "What is Customer Churn and why is predicting it valuable?",
      a: "Customer Churn refers to when a subscriber cancels their contract or service. Predicting churn allows businesses to proactively identify at-risk customers and deploy targeted retention incentives before cancellation occurs, which is significantly cheaper than acquiring new customers.",
    },
    {
      q: "Why is this problem framed as a Supervised Classification task?",
      a: "The target variable 'Churn' has discrete categorical outcomes ('Yes' or 'No'). Because ground-truth historical labels exist, supervised binary classification algorithms learn optimal decision boundaries between feature vectors and churn outcome probability.",
    },
    {
      q: "What data preprocessing steps were necessary for the IBM Telco dataset?",
      a: "First, string spaces in TotalCharges were coerced to float, filling nulls where tenure was zero. Second, categorical strings were encoded into binary dummy columns using One-Hot Encoding. Third, numerical features (tenure, charges) were scaled using StandardScaler.",
    },
    {
      q: "Why were Logistic Regression, Decision Trees, and Random Forests chosen?",
      a: "Logistic Regression provides an interpretable baseline using log-odds ratios. Decision Trees capture non-linear feature interactions without assumption of normality. Random Forest combines multiple de-correlated decision trees to reduce variance and improve generalization.",
    },
    {
      q: "Why is F1-Score and ROC-AUC prioritized over simple Accuracy?",
      a: "Customer churn datasets are class-imbalanced (~26.5% churn rate). A naive model predicting 'No Churn' for everyone would achieve 73.5% accuracy but zero utility. F1-Score and ROC-AUC measure true predictive power by balancing precision and recall.",
    },
    {
      q: "How does the saved model pipeline score new customer inputs in real-time?",
      a: "The trained scikit-learn ColumnTransformer and Logistic Regression model are pickled into a single Joblib pipeline artifact. When the frontend submits customer data, the pipeline automatically executes one-hot encoding, scaling, and calculates sigmoid output probability in milliseconds.",
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
          <GitBranch className="w-6 h-6 text-brand-400" />
          Academic Machine Learning Methodology
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Complete machine learning workflow, data processing pipeline architecture, and Information Science & Engineering viva examination guide.
        </p>
      </div>

      {/* Visual Pipeline Flow */}
      <div className="saas-card p-6 space-y-6">
        <h3 className="text-base font-semibold text-slate-200 uppercase tracking-wider text-center border-b border-slate-800 pb-3">
          End-to-End Machine Learning Pipeline Architecture
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pipelineSteps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 hover:border-brand-500/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-brand-400">{step.num}</span>
                  <div className="p-1.5 rounded-lg bg-slate-900 text-slate-300">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <h4 className="text-sm font-semibold text-slate-100">{step.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Viva Defense Questions & Answers */}
      <div className="saas-card p-6 space-y-6">
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
          <HelpCircle className="w-5 h-5 text-brand-400" />
          <h3 className="text-base font-semibold text-slate-100">
            Information Science & Engineering Viva Examination Questions
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vivaQuestions.map((qa, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-mono font-bold text-brand-400 uppercase tracking-wider block mb-1">
                  Viva Question #{idx + 1}
                </span>
                <h4 className="text-sm font-semibold text-slate-200 mb-2">
                  {qa.q}
                </h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed pt-2 border-t border-slate-900">
                {qa.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
