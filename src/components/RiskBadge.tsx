import React from 'react';
import { AlertTriangle, ShieldCheck, AlertCircle } from 'lucide-react';

interface RiskBadgeProps {
  riskLevel: 'LOW RISK' | 'MEDIUM RISK' | 'HIGH RISK';
  probability: number;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ riskLevel, probability }) => {
  if (riskLevel === 'HIGH RISK') {
    return (
      <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center space-x-3.5">
        <div className="p-2.5 rounded-lg bg-rose-500/20 text-rose-400">
          <AlertTriangle className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded border border-rose-500/30">
              HIGH RISK
            </span>
            <span className="text-sm font-mono font-bold text-rose-200">
              {probability}% Churn Probability
            </span>
          </div>
          <p className="text-xs text-rose-300/80 mt-1">
            Customer exhibits strong historical patterns correlated with service termination.
          </p>
        </div>
      </div>
    );
  }

  if (riskLevel === 'MEDIUM RISK') {
    return (
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center space-x-3.5">
        <div className="p-2.5 rounded-lg bg-amber-500/20 text-amber-400">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
              MEDIUM RISK
            </span>
            <span className="text-sm font-mono font-bold text-amber-200">
              {probability}% Churn Probability
            </span>
          </div>
          <p className="text-xs text-amber-300/80 mt-1">
            Customer presents moderate risk factors. Targeted retention outreach recommended.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center space-x-3.5">
      <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-400">
        <ShieldCheck className="w-6 h-6" />
      </div>
      <div>
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
            LOW RISK
          </span>
          <span className="text-sm font-mono font-bold text-emerald-200">
            {probability}% Churn Probability
          </span>
        </div>
        <p className="text-xs text-emerald-300/80 mt-1">
          Customer demonstrates high account stability and low attrition probability.
        </p>
      </div>
    </div>
  );
};
