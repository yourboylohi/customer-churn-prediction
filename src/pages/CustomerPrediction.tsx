import React, { useState } from 'react';
import { CustomerFormData, PredictionResult } from '../types/churn';
import { predictCustomerChurn } from '../services/api';
import { PresetSelector } from '../components/PresetSelector';
import { RiskBadge } from '../components/RiskBadge';
import { UserCheck, Play, AlertCircle, RefreshCw, Layers, Shield, FileText } from 'lucide-react';

const INITIAL_FORM_DATA: CustomerFormData = {
  gender: 'Female',
  SeniorCitizen: 0,
  Partner: 'No',
  Dependents: 'No',
  tenure: 1,
  PhoneService: 'Yes',
  MultipleLines: 'No',
  InternetService: 'Fiber optic',
  OnlineSecurity: 'No',
  OnlineBackup: 'No',
  DeviceProtection: 'No',
  TechSupport: 'No',
  StreamingTV: 'No',
  StreamingMovies: 'No',
  Contract: 'Month-to-month',
  PaperlessBilling: 'Yes',
  PaymentMethod: 'Electronic check',
  MonthlyCharges: 70.35,
  TotalCharges: 70.35,
};

export const CustomerPrediction: React.FC = () => {
  const [formData, setFormData] = useState<CustomerFormData>(INITIAL_FORM_DATA);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);

  const handleInputChange = (field: keyof CustomerFormData, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      // Auto compute TotalCharges if tenure changes or monthly charges change
      if (field === 'tenure' || field === 'MonthlyCharges') {
        const tenureVal = field === 'tenure' ? Number(value) : prev.tenure;
        const monthlyVal = field === 'MonthlyCharges' ? Number(value) : prev.MonthlyCharges;
        updated.TotalCharges = Number((tenureVal * monthlyVal).toFixed(2));
      }
      return updated;
    });
  };

  const handlePresetSelect = (preset: CustomerFormData) => {
    setFormData(preset);
    setResult(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPredicting(true);
    try {
      const res = await predictCustomerChurn(formData);
      setResult(res);
    } catch (err) {
      console.error("Prediction failed:", err);
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
          <UserCheck className="w-6 h-6 text-brand-400" />
          Customer Churn Prediction
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Input subscriber attributes into the pre-trained scikit-learn model pipeline to generate real-time churn probability and risk tier classification.
        </p>
      </div>

      {/* Preset Selector */}
      <PresetSelector onSelectPreset={handlePresetSelect} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* SECTION 1: Customer Profile */}
          <div className="saas-card p-5 space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Shield className="w-4 h-4 text-brand-400" />
              <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
                1. Customer Profile
              </h3>
            </div>

            <div>
              <label className="saas-label">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className="saas-input"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </select>
            </div>

            <div>
              <label className="saas-label">Senior Citizen Status</label>
              <select
                value={formData.SeniorCitizen}
                onChange={(e) => handleInputChange('SeniorCitizen', Number(e.target.value))}
                className="saas-input"
              >
                <option value={0}>No (Below 65)</option>
                <option value={1}>Yes (Senior Citizen 65+)</option>
              </select>
            </div>

            <div>
              <label className="saas-label">Has Partner</label>
              <select
                value={formData.Partner}
                onChange={(e) => handleInputChange('Partner', e.target.value)}
                className="saas-input"
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>

            <div>
              <label className="saas-label">Has Dependents</label>
              <select
                value={formData.Dependents}
                onChange={(e) => handleInputChange('Dependents', e.target.value)}
                className="saas-input"
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="saas-label mb-0">Tenure (Months)</label>
                <span className="text-xs font-mono text-brand-400 font-semibold">
                  {formData.tenure} {formData.tenure === 1 ? 'month' : 'months'}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="72"
                value={formData.tenure}
                onChange={(e) => handleInputChange('tenure', Number(e.target.value))}
                className="w-full accent-brand-500 bg-slate-950 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>0 mos</span>
                <span>36 mos</span>
                <span>72 mos</span>
              </div>
            </div>
          </div>

          {/* SECTION 2: Subscribed Services */}
          <div className="saas-card p-5 space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Layers className="w-4 h-4 text-brand-400" />
              <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
                2. Subscribed Services
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="saas-label">Phone Service</label>
                <select
                  value={formData.PhoneService}
                  onChange={(e) => handleInputChange('PhoneService', e.target.value)}
                  className="saas-input"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div>
                <label className="saas-label">Multiple Lines</label>
                <select
                  value={formData.MultipleLines}
                  onChange={(e) => handleInputChange('MultipleLines', e.target.value)}
                  className="saas-input"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                  <option value="No phone service">No phone service</option>
                </select>
              </div>
            </div>

            <div>
              <label className="saas-label">Internet Service</label>
              <select
                value={formData.InternetService}
                onChange={(e) => handleInputChange('InternetService', e.target.value)}
                className="saas-input"
              >
                <option value="Fiber optic">Fiber optic</option>
                <option value="DSL">DSL</option>
                <option value="No">No Internet Service</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="saas-label">Online Security</label>
                <select
                  value={formData.OnlineSecurity}
                  onChange={(e) => handleInputChange('OnlineSecurity', e.target.value)}
                  className="saas-input"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                  <option value="No internet service">No Internet</option>
                </select>
              </div>

              <div>
                <label className="saas-label">Online Backup</label>
                <select
                  value={formData.OnlineBackup}
                  onChange={(e) => handleInputChange('OnlineBackup', e.target.value)}
                  className="saas-input"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                  <option value="No internet service">No Internet</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="saas-label">Device Protection</label>
                <select
                  value={formData.DeviceProtection}
                  onChange={(e) => handleInputChange('DeviceProtection', e.target.value)}
                  className="saas-input"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                  <option value="No internet service">No Internet</option>
                </select>
              </div>

              <div>
                <label className="saas-label">Tech Support</label>
                <select
                  value={formData.TechSupport}
                  onChange={(e) => handleInputChange('TechSupport', e.target.value)}
                  className="saas-input"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                  <option value="No internet service">No Internet</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="saas-label">Streaming TV</label>
                <select
                  value={formData.StreamingTV}
                  onChange={(e) => handleInputChange('StreamingTV', e.target.value)}
                  className="saas-input"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                  <option value="No internet service">No Internet</option>
                </select>
              </div>

              <div>
                <label className="saas-label">Streaming Movies</label>
                <select
                  value={formData.StreamingMovies}
                  onChange={(e) => handleInputChange('StreamingMovies', e.target.value)}
                  className="saas-input"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                  <option value="No internet service">No Internet</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 3: Contract & Billing */}
          <div className="saas-card p-5 space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <FileText className="w-4 h-4 text-brand-400" />
              <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
                3. Contract & Billing
              </h3>
            </div>

            <div>
              <label className="saas-label">Contract Type</label>
              <select
                value={formData.Contract}
                onChange={(e) => handleInputChange('Contract', e.target.value)}
                className="saas-input"
              >
                <option value="Month-to-month">Month-to-month</option>
                <option value="One year">One year</option>
                <option value="Two year">Two year</option>
              </select>
            </div>

            <div>
              <label className="saas-label">Paperless Billing</label>
              <select
                value={formData.PaperlessBilling}
                onChange={(e) => handleInputChange('PaperlessBilling', e.target.value)}
                className="saas-input"
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <div>
              <label className="saas-label">Payment Method</label>
              <select
                value={formData.PaymentMethod}
                onChange={(e) => handleInputChange('PaymentMethod', e.target.value)}
                className="saas-input"
              >
                <option value="Electronic check">Electronic check</option>
                <option value="Mailed check">Mailed check</option>
                <option value="Bank transfer (automatic)">Bank transfer (automatic)</option>
                <option value="Credit card (automatic)">Credit card (automatic)</option>
              </select>
            </div>

            <div>
              <label className="saas-label">Monthly Charges ($)</label>
              <input
                type="number"
                step="0.05"
                min="18.00"
                max="120.00"
                value={formData.MonthlyCharges}
                onChange={(e) => handleInputChange('MonthlyCharges', Number(e.target.value))}
                className="saas-input font-mono"
              />
            </div>

            <div>
              <label className="saas-label">Total Charges ($)</label>
              <input
                type="number"
                step="0.10"
                min="0.00"
                value={formData.TotalCharges}
                onChange={(e) => handleInputChange('TotalCharges', Number(e.target.value))}
                className="saas-input font-mono bg-slate-900/50"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Calculated tenure × monthly charges baseline
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => {
              setFormData(INITIAL_FORM_DATA);
              setResult(null);
            }}
            className="px-4 py-2.5 rounded-lg border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900 text-xs font-medium flex items-center space-x-2 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Fields</span>
          </button>

          <button
            type="submit"
            disabled={isPredicting}
            className="px-8 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm flex items-center space-x-2 shadow-glow-md hover:shadow-glow-md transition-all duration-200 disabled:opacity-50"
          >
            {isPredicting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Processing Model Pipeline...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Predict Churn Probability</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* PREDICTION RESULT CARD */}
      {result && (
        <div className="saas-card p-6 border border-brand-500/30 bg-slate-900/90 shadow-xl space-y-5 animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-400">
                Machine Learning Prediction Output
              </span>
              <h3 className="text-xl font-bold text-slate-100">
                Classification Result: {result.prediction}
              </h3>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 block mb-0.5">Scored Model</span>
              <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700">
                Logistic Regression Pipeline
              </span>
            </div>
          </div>

          {/* Risk Badge */}
          <RiskBadge riskLevel={result.risk_level} probability={result.churn_probability} />

          {/* Probability Gauge Bar */}
          <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">Predicted Probability Score</span>
              <span className="font-mono font-bold text-slate-200 text-sm">
                {result.churn_probability}%
              </span>
            </div>

            <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  result.risk_level === 'HIGH RISK'
                    ? 'bg-rose-500'
                    : result.risk_level === 'MEDIUM RISK'
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${result.churn_probability}%` }}
              />
            </div>

            <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-1">
              <span>0% (Stable Retention)</span>
              <span>35% (Medium Tier)</span>
              <span>65% (High Risk)</span>
              <span>100% (Imminent Churn)</span>
            </div>
          </div>

          {/* Key Contributing Factors */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Primary Model Risk Drivers Identified:
            </h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {result.contributing_factors.map((factor, idx) => (
                <li
                  key={idx}
                  className="text-xs text-slate-300 bg-slate-950/80 border border-slate-800/80 rounded-lg px-3 py-2 flex items-start space-x-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-400 mt-1.5 shrink-0" />
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* MANDATORY DISCLAIMER */}
          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex items-start space-x-2.5 text-xs text-slate-400">
            <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {result.disclaimer}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
