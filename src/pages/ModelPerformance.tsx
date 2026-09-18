import React, { useEffect, useState } from 'react';
import { fetchModelMetrics } from '../services/api';
import { ModelMetricsSummary, ModelMetric } from '../types/churn';
import { Target, CheckCircle2, Trophy, BarChart2, BookOpen, Activity } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export const ModelPerformance: React.FC = () => {
  const [metrics, setMetrics] = useState<ModelMetricsSummary | null>(null);
  const [selectedModelName, setSelectedModelName] = useState<string>("Logistic Regression");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModelMetrics().then((data) => {
      setMetrics(data);
      if (data.best_model) {
        setSelectedModelName(data.best_model);
      }
      setLoading(false);
    });
  }, []);

  if (loading || !metrics) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-3 text-slate-400">
          <Activity className="w-5 h-5 animate-spin text-brand-400" />
          <span className="text-sm font-medium">Loading Evaluation Metrics...</span>
        </div>
      </div>
    );
  }

  const selectedModel = metrics.models.find((m) => m.name === selectedModelName) || metrics.models[0];

  // Chart data for comparing all 3 models
  const comparisonData = metrics.models.map((m) => ({
    name: m.name,
    Accuracy: (m.accuracy * 100).toFixed(1),
    Precision: (m.precision * 100).toFixed(1),
    Recall: (m.recall * 100).toFixed(1),
    F1_Score: (m.f1_score * 100).toFixed(1),
    ROC_AUC: (m.roc_auc * 100).toFixed(1),
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <Target className="w-6 h-6 text-brand-400" />
            Model Evaluation & Performance
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Empirical validation of classification models trained on 80% split and tested on 20% holdout set (1,409 rows).
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-2 rounded-xl text-xs text-emerald-300">
          <Trophy className="w-4 h-4 text-emerald-400 shrink-0" />
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Selected Final Model</span>
            <span className="font-semibold text-slate-100">{metrics.best_model}</span>
          </div>
        </div>
      </div>

      {/* Model Comparison Table */}
      <div className="saas-card overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
            Classification Metrics Comparison Matrix
          </h3>
          <span className="text-xs text-slate-400 font-mono">Test Set: 1,409 rows</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-4">Algorithm Model</th>
                <th className="p-4">Accuracy</th>
                <th className="p-4">Precision</th>
                <th className="p-4">Recall</th>
                <th className="p-4">F1-Score</th>
                <th className="p-4">ROC-AUC</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {metrics.models.map((m: ModelMetric) => {
                const isSelected = m.name === selectedModelName;
                const isBest = m.name === metrics.best_model;
                return (
                  <tr
                    key={m.name}
                    onClick={() => setSelectedModelName(m.name)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-brand-500/10' : 'hover:bg-slate-850'
                    }`}
                  >
                    <td className="p-4 font-sans font-semibold text-slate-100 flex items-center space-x-2">
                      <span>{m.name}</span>
                      {isBest && (
                        <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Selected
                        </span>
                      )}
                    </td>
                    <td className="p-4 font-bold text-slate-100">{(m.accuracy * 100).toFixed(2)}%</td>
                    <td className="p-4 text-slate-200">{(m.precision * 100).toFixed(2)}%</td>
                    <td className="p-4 text-slate-200">{(m.recall * 100).toFixed(2)}%</td>
                    <td className="p-4 font-semibold text-brand-400">{(m.f1_score * 100).toFixed(2)}%</td>
                    <td className="p-4 text-amber-400">{(m.roc_auc * 100).toFixed(2)}%</td>
                    <td className="p-4 font-sans text-xs">
                      {isSelected ? (
                        <span className="text-brand-400 flex items-center space-x-1 font-medium">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Inspecting Matrix</span>
                        </span>
                      ) : (
                        <span className="text-slate-500">Click to View</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Model Performance Comparison Bar Chart */}
      <div className="saas-card p-5">
        <div className="flex items-center space-x-2 mb-4">
          <BarChart2 className="w-5 h-5 text-brand-400" />
          <h3 className="text-base font-semibold text-slate-200">Comparative Performance Across Metrics</h3>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
              <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={12} unit="%" />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
              <Legend />
              <Bar dataKey="Accuracy" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Precision" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Recall" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="F1_Score" fill="#0c8de9" radius={[4, 4, 0, 0]} />
              <Bar dataKey="ROC_AUC" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Confusion Matrix & Feature Importance Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Confusion Matrix */}
        <div className="saas-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-semibold text-slate-200">Confusion Matrix</h3>
              <p className="text-xs text-slate-400">Actual vs Predicted for {selectedModel.name}</p>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
              Holdout Test Set
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 p-2 bg-slate-950 rounded-xl border border-slate-800 font-mono">
            {/* True Negative */}
            <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-center">
              <span className="text-[10px] text-emerald-400 font-sans uppercase font-bold tracking-wider block mb-1">
                True Negative (TN)
              </span>
              <span className="text-2xl font-bold text-slate-100">{selectedModel.confusion_matrix.tn}</span>
              <span className="text-[10px] text-slate-400 font-sans block mt-1">Correctly predicted Retained</span>
            </div>

            {/* False Positive */}
            <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/30 text-center">
              <span className="text-[10px] text-rose-400 font-sans uppercase font-bold tracking-wider block mb-1">
                False Positive (FP)
              </span>
              <span className="text-2xl font-bold text-slate-100">{selectedModel.confusion_matrix.fp}</span>
              <span className="text-[10px] text-slate-400 font-sans block mt-1">False Churn alarm</span>
            </div>

            {/* False Negative */}
            <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/30 text-center">
              <span className="text-[10px] text-rose-400 font-sans uppercase font-bold tracking-wider block mb-1">
                False Negative (FN)
              </span>
              <span className="text-2xl font-bold text-slate-100">{selectedModel.confusion_matrix.fn}</span>
              <span className="text-[10px] text-slate-400 font-sans block mt-1">Missed Churn subscriber</span>
            </div>

            {/* True Positive */}
            <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-center">
              <span className="text-[10px] text-emerald-400 font-sans uppercase font-bold tracking-wider block mb-1">
                True Positive (TP)
              </span>
              <span className="text-2xl font-bold text-slate-100">{selectedModel.confusion_matrix.tp}</span>
              <span className="text-[10px] text-slate-400 font-sans block mt-1">Correctly predicted Churn</span>
            </div>
          </div>
        </div>

        {/* Feature Importances Top 10 */}
        <div className="saas-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-semibold text-slate-200">Top Feature Importances</h3>
              <p className="text-xs text-slate-400">Relative contribution weights driving churn classification</p>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Random Forest Weights
            </span>
          </div>

          <div className="space-y-2.5">
            {metrics.feature_importances.slice(0, 7).map((feat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-mono text-slate-300 font-medium">{feat.feature}</span>
                  <span className="font-mono text-brand-400">{(feat.importance * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-brand-500 rounded-full"
                    style={{ width: `${feat.importance * 400}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Metric Definitions Card for Viva Prep */}
      <div className="saas-card p-6 space-y-4 bg-slate-900/90 border border-brand-500/20">
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
          <BookOpen className="w-5 h-5 text-brand-400" />
          <h3 className="text-base font-semibold text-slate-100">
            Metric Definitions & Viva Examination Guide
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
            <span className="font-bold text-brand-400 block mb-1">Accuracy</span>
            <p className="text-slate-400 leading-relaxed">
              Ratio of correct predictions (TP + TN) over total evaluations. Measures overall correctness across all classes.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
            <span className="font-bold text-emerald-400 block mb-1">Precision</span>
            <p className="text-slate-400 leading-relaxed">
              TP / (TP + FP). Out of all predicted churners, what percentage actually churned. Crucial to minimize false alarms.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
            <span className="font-bold text-amber-400 block mb-1">Recall (Sensitivity)</span>
            <p className="text-slate-400 leading-relaxed">
              TP / (TP + FN). Out of all actual churners, what percentage did the model capture. Critical for retention campaigns.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
            <span className="font-bold text-purple-400 block mb-1">F1-Score</span>
            <p className="text-slate-400 leading-relaxed">
              Harmonic mean of Precision and Recall: 2 * (Prec * Rec) / (Prec + Rec). Balances precision and recall in imbalanced datasets.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
            <span className="font-bold text-indigo-400 block mb-1">ROC-AUC</span>
            <p className="text-slate-400 leading-relaxed">
              Area Under Receiver Operating Characteristic Curve. Evaluates how well the model separates positive and negative classes across threshold values.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
            <span className="font-bold text-rose-400 block mb-1">Confusion Matrix</span>
            <p className="text-slate-400 leading-relaxed">
              2x2 grid displaying True Negatives, False Positives, False Negatives, and True Positives from test dataset scoring.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
