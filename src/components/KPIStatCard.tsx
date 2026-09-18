import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KPIStatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  badge?: {
    text: string;
    type?: 'positive' | 'negative' | 'neutral';
  };
}

export const KPIStatCard: React.FC<KPIStatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-brand-400',
  badge,
}) => {
  return (
    <div className="saas-card saas-card-hover p-5 flex flex-col justify-between">
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1">
            {title}
          </span>
          <h3 className="text-2xl font-bold text-slate-100 tracking-tight font-mono">
            {value}
          </h3>
        </div>
        <div className={`p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/50 ${iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {subtitle && (
        <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
          <span className="text-slate-400">{subtitle}</span>
          {badge && (
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                badge.type === 'positive'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : badge.type === 'negative'
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  : 'bg-brand-500/10 text-brand-400 border border-brand-500/20'
              }`}
            >
              {badge.text}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
