import React from 'react';
import { LayoutDashboard, UserCheck, BarChart3, Target, GitBranch, Info } from 'lucide-react';

export type NavTab = 'overview' | 'predict' | 'analytics' | 'performance' | 'methodology' | 'about';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, description: 'Dashboard & Key Metrics' },
    { id: 'predict', label: 'Customer Prediction', icon: UserCheck, description: 'Single Customer ML Scoring' },
    { id: 'analytics', label: 'Customer Analytics', icon: BarChart3, description: 'Dataset EDA & Trends' },
    { id: 'performance', label: 'Model Performance', icon: Target, description: 'Classifier Comparisons' },
    { id: 'methodology', label: 'Methodology', icon: GitBranch, description: 'Pipeline & Academic Flow' },
    { id: 'about', label: 'About Project', icon: Info, description: 'IS&E Academic Documentation' },
  ] as const;

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between min-h-[calc(100vh-57px)]">
      <div className="p-4 space-y-1.5">
        <p className="px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Navigation
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as NavTab)}
              className={`w-full text-left px-3.5 py-3 rounded-lg flex items-start space-x-3 transition-all duration-150 ${
                isActive
                  ? 'bg-brand-500/10 border border-brand-500/30 text-brand-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850 border border-transparent'
              }`}
            >
              <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${isActive ? 'text-brand-400' : 'text-slate-400'}`} />
              <div className="flex-1 min-w-0">
                <span className={`block text-sm font-medium leading-none mb-1 ${isActive ? 'text-slate-100 font-semibold' : ''}`}>
                  {item.label}
                </span>
                <span className="block text-[11px] text-slate-500 truncate">
                  {item.description}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-800/80 m-4 rounded-xl bg-slate-950/60 border border-slate-800">
        <div className="flex items-center space-x-2.5 mb-2">
          <span className="w-2 h-2 rounded-full bg-brand-400 animate-ping" />
          <span className="text-xs font-semibold text-slate-200">scikit-learn Engine</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Trained on 7,043 customer records with 19 feature columns using standard machine learning pipeline.
        </p>
      </div>
    </aside>
  );
};
