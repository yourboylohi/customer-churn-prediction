import React, { useEffect, useState } from 'react';
import { ShieldAlert, Database, Server, Cpu } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [apiOnline, setApiOnline] = useState<boolean>(false);

  useEffect(() => {
    fetch('/api/')
      .then((res) => setApiOnline(res.ok))
      .catch(() => setApiOnline(false));
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-6 py-3.5 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-brand-500/10 border border-brand-500/20 rounded-lg text-brand-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-slate-100 tracking-tight flex items-center gap-2">
              Customer Churn Analytics
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
                IS&E Project
              </span>
            </h1>
            <p className="text-xs text-slate-400">Predictive Classification & Intelligence System</p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <div className="hidden md:flex items-center space-x-2 bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-lg text-xs text-slate-300">
          <Database className="w-3.5 h-3.5 text-brand-400" />
          <span className="text-slate-400">Dataset:</span>
          <span className="font-mono text-slate-200">IBM Telco (7,043 rows)</span>
        </div>

        <div className="flex items-center space-x-2 bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-lg text-xs">
          <Cpu className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-400">Model:</span>
          <span className="font-mono text-slate-200 font-medium">Logistic Reg (80.5%)</span>
        </div>

        <div className="flex items-center space-x-2 bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-lg text-xs">
          <Server className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400">API:</span>
          <span className="flex items-center space-x-1.5">
            <span className={`w-2 h-2 rounded-full ${apiOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span className={apiOnline ? 'text-emerald-400 font-medium' : 'text-amber-400 font-medium'}>
              {apiOnline ? 'Connected' : 'Standalone Fallback'}
            </span>
          </span>
        </div>
      </div>
    </header>
  );
};
