import React from 'react';
import { Info, GraduationCap, Award, Cpu, ShieldCheck, Globe, CheckCircle } from 'lucide-react';

export const AboutProject: React.FC = () => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="saas-card p-6 border-brand-500/30 bg-slate-900/90 space-y-3">
        <div className="flex items-center space-x-2 text-brand-400">
          <GraduationCap className="w-5 h-5" />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Information Science & Engineering Academic Project
          </span>
        </div>
        <h2 className="text-2xl font-bold text-slate-100">
          Customer Churn Prediction Using Machine Learning
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
          An end-to-end practical machine learning platform designed to identify patterns in subscriber behavior, evaluate classification models, and predict customer attrition using authentic telecommunications data.
        </p>
      </div>

      {/* Grid Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Problem Statement & Objectives */}
        <div className="saas-card p-6 space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 text-slate-200">
            <Award className="w-5 h-5 text-brand-400" />
            <h3 className="text-base font-semibold">Problem Statement & Objectives</h3>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <p className="leading-relaxed">
              <strong>Problem:</strong> Telecommunication service providers lose significant recurring revenue when subscribers churn. Acquiring a new customer costs 5x to 25x more than retaining an existing one.
            </p>
            <p className="leading-relaxed">
              <strong>Objective:</strong> Develop an interpretable binary classification pipeline using scikit-learn that ingests customer demographics, account tenure, subscribed services, and billing contracts to accurately predict churn risk.
            </p>
          </div>
        </div>

        {/* Dataset & Scope */}
        <div className="saas-card p-6 space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 text-slate-200">
            <Cpu className="w-5 h-5 text-brand-400" />
            <h3 className="text-base font-semibold">Dataset & Technical Scope</h3>
          </div>

          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-brand-400 shrink-0" />
              <span><strong>Dataset:</strong> IBM Telco Customer Churn dataset (7,043 rows)</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-brand-400 shrink-0" />
              <span><strong>Target Variable:</strong> Churn ("Yes" / "No" binary label)</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-brand-400 shrink-0" />
              <span><strong>Feature Vector:</strong> 19 attributes across demographic, service, and billing fields</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-brand-400 shrink-0" />
              <span><strong>Models:</strong> Logistic Regression, Decision Tree, Random Forest</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Tech Stack & Badges */}
      <div className="saas-card p-6 space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 text-slate-200">
          <Globe className="w-5 h-5 text-brand-400" />
          <h3 className="text-base font-semibold">Technology Stack & Architecture</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="font-bold text-slate-200 block mb-1">Machine Learning</span>
            <span className="text-slate-400 font-mono">Python, scikit-learn, Pandas, NumPy, Joblib</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="font-bold text-slate-200 block mb-1">Backend REST API</span>
            <span className="text-slate-400 font-mono">FastAPI, Uvicorn, Pydantic</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="font-bold text-slate-200 block mb-1">Frontend UI</span>
            <span className="text-slate-400 font-mono">React 18, Vite, TypeScript</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="font-bold text-slate-200 block mb-1">Styling & Charts</span>
            <span className="text-slate-400 font-mono">Tailwind CSS, Recharts, Lucide Icons</span>
          </div>
        </div>
      </div>

      {/* Real-World Industry Application */}
      <div className="saas-card p-6 space-y-3 bg-slate-900/90 border border-emerald-500/20">
        <div className="flex items-center space-x-2 text-emerald-400">
          <ShieldCheck className="w-5 h-5" />
          <h3 className="text-base font-semibold text-slate-100">Real-World Industry Application</h3>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          In commercial SaaS and telecommunication enterprises, predictive churn models are integrated directly into Customer Relationship Management (CRM) workflows. When a high-value subscriber triggers high churn risk flags (e.g., month-to-month transition, absence of tech support, high monthly fees), automated retention playbooks trigger targeted service upgrades, proactive tech support calls, or contract discount offers to preserve revenue.
        </p>
      </div>
    </div>
  );
};
