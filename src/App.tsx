import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar, NavTab } from './components/Sidebar';
import { OverviewDashboard } from './pages/OverviewDashboard';
import { CustomerPrediction } from './pages/CustomerPrediction';
import { CustomerAnalytics } from './pages/CustomerAnalytics';
import { ModelPerformance } from './pages/ModelPerformance';
import { Methodology } from './pages/Methodology';
import { AboutProject } from './pages/AboutProject';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('overview');

  const renderActivePage = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewDashboard />;
      case 'predict':
        return <CustomerPrediction />;
      case 'analytics':
        return <CustomerAnalytics />;
      case 'performance':
        return <ModelPerformance />;
      case 'methodology':
        return <Methodology />;
      case 'about':
        return <AboutProject />;
      default:
        return <OverviewDashboard />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl">
          {renderActivePage()}
        </main>
      </div>
    </div>
  );
};

export default App;
