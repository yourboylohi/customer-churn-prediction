import React from 'react';
import { CustomerFormData } from '../types/churn';
import { Sparkles, UserX, UserCheck, User } from 'lucide-react';

interface PresetSelectorProps {
  onSelectPreset: (preset: CustomerFormData) => void;
}

export const PRESET_PROFILES: { label: string; icon: any; color: string; data: CustomerFormData; desc: string }[] = [
  {
    label: 'High Risk Preset',
    icon: UserX,
    color: 'hover:border-rose-500/50 hover:bg-rose-500/5 text-rose-400',
    desc: 'Month-to-month, Fiber optic, No Tech Support, Short tenure (2 mos)',
    data: {
      gender: 'Female',
      SeniorCitizen: 0,
      Partner: 'No',
      Dependents: 'No',
      tenure: 2,
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
      MonthlyCharges: 70.70,
      TotalCharges: 141.40,
    },
  },
  {
    label: 'Low Risk Preset',
    icon: UserCheck,
    color: 'hover:border-emerald-500/50 hover:bg-emerald-500/5 text-emerald-400',
    desc: 'Two year contract, DSL, Tech Support, Long tenure (60 mos)',
    data: {
      gender: 'Male',
      SeniorCitizen: 0,
      Partner: 'Yes',
      Dependents: 'Yes',
      tenure: 60,
      PhoneService: 'Yes',
      MultipleLines: 'Yes',
      InternetService: 'DSL',
      OnlineSecurity: 'Yes',
      OnlineBackup: 'Yes',
      DeviceProtection: 'Yes',
      TechSupport: 'Yes',
      StreamingTV: 'Yes',
      StreamingMovies: 'Yes',
      Contract: 'Two year',
      PaperlessBilling: 'No',
      PaymentMethod: 'Credit card (automatic)',
      MonthlyCharges: 64.80,
      TotalCharges: 3888.00,
    },
  },
  {
    label: 'Average Customer',
    icon: User,
    color: 'hover:border-brand-500/50 hover:bg-brand-500/5 text-brand-400',
    desc: 'One year contract, Fiber optic, Medium tenure (24 mos)',
    data: {
      gender: 'Male',
      SeniorCitizen: 0,
      Partner: 'Yes',
      Dependents: 'No',
      tenure: 24,
      PhoneService: 'Yes',
      MultipleLines: 'No',
      InternetService: 'Fiber optic',
      OnlineSecurity: 'Yes',
      OnlineBackup: 'No',
      DeviceProtection: 'Yes',
      TechSupport: 'No',
      StreamingTV: 'Yes',
      StreamingMovies: 'No',
      Contract: 'One year',
      PaperlessBilling: 'Yes',
      PaymentMethod: 'Bank transfer (automatic)',
      MonthlyCharges: 85.00,
      TotalCharges: 2040.00,
    },
  },
];

export const PresetSelector: React.FC<PresetSelectorProps> = ({ onSelectPreset }) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 mb-6">
      <div className="flex items-center space-x-2 mb-3">
        <Sparkles className="w-4 h-4 text-brand-400" />
        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
          Quick-Fill Test Profiles (1-Click Viva Demo)
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {PRESET_PROFILES.map((preset, idx) => {
          const Icon = preset.icon;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectPreset(preset.data)}
              className={`text-left p-3 rounded-lg bg-slate-950 border border-slate-800 transition-all duration-150 group ${preset.color}`}
            >
              <div className="flex items-center space-x-2 mb-1">
                <Icon className="w-4 h-4" />
                <span className="text-xs font-semibold text-slate-200 group-hover:text-white">
                  {preset.label}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                {preset.desc}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
