import React from 'react';
import { 
  Layers, 
  Database, 
  Activity, 
  ShieldCheck, 
  BarChart3, 
  Radio, 
  Cpu, 
  FileText, 
  GitBranch, 
  Box,
  Briefcase,
  Terminal,
  FileCheck
} from 'lucide-react';

export type PageId = 
  | 'overview' 
  | 'sources' 
  | 'documents'
  | 'reports'
  | 'pipelines' 
  | 'quality' 
  | 'warehouse' 
  | 'analytics' 
  | 'streaming' 
  | 'observability' 
  | 'benchmarks' 
  | 'documentation'
  | 'kinetiq';

export type PersonaMode = 'business' | 'engineering';

interface HeaderProps {
  currentPage: PageId;
  onSelectPage: (page: PageId) => void;
  personaMode: PersonaMode;
  onTogglePersona: (mode: PersonaMode) => void;
  isOnline: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onSelectPage,
  personaMode,
  onTogglePersona,
  isOnline
}) => {
  const navItems: Array<{ id: PageId; label: string; icon: React.ReactNode }> = [
    { id: 'kinetiq', label: 'Platform Home', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'overview', label: 'Overview', icon: <Activity className="w-3.5 h-3.5" /> },
    { id: 'sources', label: 'Data Sources', icon: <Database className="w-3.5 h-3.5" /> },
    { id: 'reports', label: 'Report Center', icon: <FileCheck className="w-3.5 h-3.5" /> },
    { id: 'documents', label: 'PDF Explorer', icon: <FileText className="w-3.5 h-3.5" /> },
    { id: 'pipelines', label: 'Pipelines', icon: <GitBranch className="w-3.5 h-3.5" /> },
    { id: 'quality', label: 'Data Quality', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
    { id: 'warehouse', label: 'Warehouse', icon: <Box className="w-3.5 h-3.5" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { id: 'streaming', label: 'Streaming & Replay', icon: <Radio className="w-3.5 h-3.5" /> },
    { id: 'observability', label: 'Observability', icon: <Activity className="w-3.5 h-3.5" /> },
    { id: 'benchmarks', label: 'Benchmarks', icon: <Cpu className="w-3.5 h-3.5" /> },
    { id: 'documentation', label: 'Docs', icon: <FileText className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="border-b border-neutral-800 bg-neutral-950/80 backdrop-blur sticky top-0 z-50">
      {/* Top Banner: Brand, Dual-Mode Persona Switch, System Status */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        <button 
          onClick={() => onSelectPage('kinetiq')} 
          className="flex items-center space-x-3 text-left group focus:outline-none"
          title="Go to Kinetiq Platform Home"
        >
          <div className="w-7 h-7 border-2 border-white bg-black flex items-center justify-center font-mono font-bold text-sm text-white group-hover:bg-white group-hover:text-black transition-colors">
            KQ
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-base tracking-widest text-white uppercase font-mono">
                KINETIQ
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 border border-neutral-700 rounded text-neutral-300">
                PROD-GRADE
              </span>
            </div>
            <div className="text-xs text-neutral-400">
              Enterprise Quick-Commerce & Data Platform • Olist Dataset
            </div>
          </div>
        </button>

        {/* Dual Mode Switcher */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center border border-neutral-800 bg-neutral-900 rounded p-1">
            <button
              onClick={() => onTogglePersona('business')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded text-sm font-medium transition-all ${
                personaMode === 'business'
                  ? 'bg-white text-black font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Business Overview</span>
            </button>
            <button
              onClick={() => onTogglePersona('engineering')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded text-sm font-medium transition-all ${
                personaMode === 'engineering'
                  ? 'bg-white text-black font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>Engineering Console</span>
            </button>
          </div>

          {/* Quick launch to Kinetiq Home */}
          <button
            onClick={() => onSelectPage('kinetiq')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded text-sm font-mono transition-all border ${
              currentPage === 'kinetiq'
                ? 'bg-white text-black border-white font-semibold'
                : 'border-neutral-800 bg-black text-neutral-300 hover:text-white hover:border-neutral-700'
            }`}
          >
            <span>HOME</span>
          </button>

          {/* Connection status indicator */}
          <div className="flex items-center space-x-2 text-xs sm:text-sm font-mono border border-neutral-800 px-3 py-1.5 rounded bg-black">
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-white' : 'bg-neutral-600 animate-pulse'}`} />
            <span className="text-neutral-300">{isOnline ? 'CONNECTED' : 'DISCONNECTED'}</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-bar */}
      <div className="border-t border-neutral-900 bg-black overflow-x-auto">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex space-x-1.5 py-2">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectPage(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded text-sm font-mono transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-neutral-800 text-white font-medium border border-neutral-700'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
