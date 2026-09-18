import React, { useEffect, useState } from 'react';
import { fetchEDAStats, fetchModelMetrics } from '../services/api';
import { EDAStats, ModelMetricsSummary } from '../types/churn';
import { KPIStatCard } from '../components/KPIStatCard';
import { Users, UserMinus, UserCheck, Percent, Cpu, Activity } from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area
} from 'recharts';

export const OverviewDashboard: React.FC = () => {
  const [stats, setStats] = useState<EDAStats | null>(null);
  const [metrics, setMetrics] = useState<ModelMetricsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchEDAStats(), fetchModelMetrics()]).then(([s, m]) => {
      setStats(s);
      setMetrics(m);
      setLoading(false);
    });
  }, []);

  if (loading || !stats || !metrics) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-3 text-slate-400">
          <Activity className="w-5 h-5 animate-spin text-brand-400" />
          <span className="text-sm font-medium">Loading IBM Telco Analytics...</span>
        </div>
      </div>
    );
  }

  const PIE_COLORS = ['#10b981', '#f43f5e'];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-100 tracking-tight">Overview Dashboard</h2>
        <p className="text-sm text-slate-400 mt-1">
          Executive summary & actual business key performance indicators from the IBM Telco Customer Churn dataset.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPIStatCard
          title="Total Customers"
          value={stats.total_customers.toLocaleString()}
          subtitle="IBM Telco Dataset"
          icon={Users}
          iconColor="text-brand-400"
          badge={{ text: "7,043 rows", type: "neutral" }}
        />
        <KPIStatCard
          title="Churned Customers"
          value={stats.churned_customers.toLocaleString()}
          subtitle="At-risk accounts"
          icon={UserMinus}
          iconColor="text-rose-400"
          badge={{ text: "Lost", type: "negative" }}
        />
        <KPIStatCard
          title="Retained Customers"
          value={stats.non_churned_customers.toLocaleString()}
          subtitle="Active accounts"
          icon={UserCheck}
          iconColor="text-emerald-400"
          badge={{ text: "Active", type: "positive" }}
        />
        <KPIStatCard
          title="Overall Churn Rate"
          value={`${stats.overall_churn_rate}%`}
          subtitle="Dataset benchmark"
          icon={Percent}
          iconColor="text-amber-400"
          badge={{ text: "Historical", type: "neutral" }}
        />
        <KPIStatCard
          title="Model Accuracy"
          value={`${(metrics.models[0].accuracy * 100).toFixed(1)}%`}
          subtitle={metrics.best_model}
          icon={Cpu}
          iconColor="text-brand-400"
          badge={{ text: "Best Model", type: "positive" }}
        />
      </div>

      {/* Primary Analytics Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Churn vs Non-Churn Pie Chart */}
        <div className="saas-card p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-200 mb-1">Churn Distribution</h3>
            <p className="text-xs text-slate-400 mb-4">Proportion of retained vs churned subscribers</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.churn_vs_non_churn}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                >
                  {stats.churn_vs_non_churn.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                  formatter={(val: number) => [`${val.toLocaleString()} customers`, 'Count']}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Churn by Contract Type */}
        <div className="saas-card p-5 lg:col-span-2 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-200 mb-1">Churn by Contract Type</h3>
            <p className="text-xs text-slate-400 mb-4">Comparison of retained and churned subscribers across contract tiers</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.churn_by_contract} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="category" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }} />
                <Legend />
                <Bar dataKey="retained" name="Retained Customers" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="churned" name="Churned Customers" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Primary Analytics Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Churn by Tenure */}
        <div className="saas-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-slate-200">Churn Rate by Tenure Cohort</h3>
              <p className="text-xs text-slate-400">Churn percentage decreases significantly with customer longevity</p>
            </div>
            <span className="text-xs font-mono font-medium px-2.5 py-1 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
              Tenure Trend
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.churn_by_tenure}>
                <defs>
                  <linearGradient id="tenureGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="category" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} unit="%" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }} />
                <Area type="monotone" dataKey="churn_rate" name="Churn Rate (%)" stroke="#f43f5e" fillOpacity={1} fill="url(#tenureGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Churn by Monthly Charges */}
        <div className="saas-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-slate-200">Churn by Monthly Charge Tier</h3>
              <p className="text-xs text-slate-400">Subscribers paying $60-$90/mo experience peak churn rates</p>
            </div>
            <span className="text-xs font-mono font-medium px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Pricing Impact
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.churn_by_monthly_charges}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="category" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }} />
                <Bar dataKey="churn_rate" name="Churn Rate (%)" fill="#36a9f7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
