import React, { useEffect, useState } from 'react';
import { fetchEDAStats } from '../services/api';
import { EDAStats } from '../types/churn';
import { BarChart3, PieChart as PieIcon, TrendingUp, CreditCard, Wifi, ShieldAlert, Activity } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

export const CustomerAnalytics: React.FC = () => {
  const [stats, setStats] = useState<EDAStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEDAStats().then((data) => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  if (loading || !stats) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-3 text-slate-400">
          <Activity className="w-5 h-5 animate-spin text-brand-400" />
          <span className="text-sm font-medium">Loading IBM Dataset Analytics...</span>
        </div>
      </div>
    );
  }

  const PIE_COLORS = ['#10b981', '#f43f5e'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-brand-400" />
          Customer Analytics & Exploratory Data Analysis (EDA)
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Detailed exploratory analysis of 7,043 telecommunications subscribers from the IBM Telco Customer Churn dataset.
        </p>
      </div>

      {/* Dataset Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="saas-card p-4 space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Tenure Statistics (Months)
          </span>
          <div className="flex items-baseline space-x-3">
            <span className="text-2xl font-bold font-mono text-slate-100">{stats.numerical_summary.tenure.mean} mos</span>
            <span className="text-xs text-slate-400">Avg</span>
          </div>
          <div className="flex justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
            <span>Median: <strong className="text-slate-200">{stats.numerical_summary.tenure.median} mos</strong></span>
            <span>Range: <strong className="text-slate-200">{stats.numerical_summary.tenure.min} - {stats.numerical_summary.tenure.max} mos</strong></span>
          </div>
        </div>

        <div className="saas-card p-4 space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Monthly Charges ($)
          </span>
          <div className="flex items-baseline space-x-3">
            <span className="text-2xl font-bold font-mono text-slate-100">${stats.numerical_summary.MonthlyCharges.mean}</span>
            <span className="text-xs text-slate-400">Avg / Month</span>
          </div>
          <div className="flex justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
            <span>Median: <strong className="text-slate-200">${stats.numerical_summary.MonthlyCharges.median}</strong></span>
            <span>Range: <strong className="text-slate-200">${stats.numerical_summary.MonthlyCharges.min} - ${stats.numerical_summary.MonthlyCharges.max}</strong></span>
          </div>
        </div>

        <div className="saas-card p-4 space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Total Lifetime Charges ($)
          </span>
          <div className="flex items-baseline space-x-3">
            <span className="text-2xl font-bold font-mono text-slate-100">${stats.numerical_summary.TotalCharges.mean.toLocaleString()}</span>
            <span className="text-xs text-slate-400">Avg Lifetime</span>
          </div>
          <div className="flex justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
            <span>Median: <strong className="text-slate-200">${stats.numerical_summary.TotalCharges.median.toLocaleString()}</strong></span>
            <span>Max: <strong className="text-slate-200">${stats.numerical_summary.TotalCharges.max.toLocaleString()}</strong></span>
          </div>
        </div>
      </div>

      {/* Row 1: Distribution & Internet Service */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Overall Distribution */}
        <div className="saas-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <PieIcon className="w-4 h-4 text-brand-400" />
              <h3 className="text-base font-semibold text-slate-200">Overall Churn Ratio</h3>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
              26.54% Churn
            </span>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.churn_vs_non_churn}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, value, percentage }) => `${name}: ${value.toLocaleString()} (${percentage}%)`}
                >
                  {stats.churn_vs_non_churn.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Churn by Internet Service */}
        <div className="saas-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Wifi className="w-4 h-4 text-brand-400" />
              <h3 className="text-base font-semibold text-slate-200">Churn by Internet Service Type</h3>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Fiber Optic (41.9% Churn)
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.churn_by_internet_service}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="category" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                <Legend />
                <Bar dataKey="retained" name="Retained" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="churned" name="Churned" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Payment Method & Senior Citizen */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Payment Method */}
        <div className="saas-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-brand-400" />
              <h3 className="text-base font-semibold text-slate-200">Churn by Payment Method</h3>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.churn_by_payment_method} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#94a3b8" fontSize={12} />
                <YAxis dataKey="category" type="category" stroke="#94a3b8" fontSize={11} width={130} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                <Legend />
                <Bar dataKey="retained" name="Retained" fill="#10b981" radius={[0, 4, 4, 0]} />
                <Bar dataKey="churned" name="Churned" fill="#f43f5e" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Senior Citizen vs Non-Senior */}
        <div className="saas-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-brand-400" />
              <h3 className="text-base font-semibold text-slate-200">Senior Citizen Churn Comparison</h3>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
              Senior Churn: 41.7%
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.churn_by_senior_citizen}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="category" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} unit="%" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                <Bar dataKey="churn_rate" name="Churn Rate (%)" fill="#0c8de9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
