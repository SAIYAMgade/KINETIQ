import React from "react";
import { 
  Database, 
  GitBranch, 
  ShieldCheck, 
  Box, 
  BarChart3, 
  Radio, 
  Activity, 
  FileCheck, 
  FileText, 
  ArrowRight, 
  Layers, 
  Terminal, 
  Briefcase,
  CheckCircle2,
  Server,
  Zap,
  Cpu
} from "lucide-react";
import { PageId, PersonaMode } from "../components/Header";

interface KinetiqPageProps {
  onEnterPlatform: (page?: PageId) => void;
  personaMode?: PersonaMode;
  onTogglePersona?: (mode: PersonaMode) => void;
  isOnline?: boolean;
}

export const KinetiqPage: React.FC<KinetiqPageProps> = ({ 
  onEnterPlatform,
  personaMode = 'business',
  onTogglePersona,
  isOnline = true
}) => {
  return (
    <div className="min-h-screen bg-[#070708] text-neutral-100 font-sans selection:bg-neutral-800 selection:text-white flex flex-col justify-between">
      {/* ── 1. Top Navigation Bar ────────────────────────────────────────── */}
      <header className="border-b border-neutral-800/80 bg-black/90 backdrop-blur sticky top-0 z-50 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-8 h-8 border-2 border-white bg-black flex items-center justify-center font-mono font-bold text-sm text-white">
              KQ
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <span className="font-bold text-base tracking-widest text-white uppercase font-mono">
                  KINETIQ
                </span>
                <span className="text-xs font-mono px-2 py-0.5 border border-neutral-700 rounded text-neutral-300">
                  PROD-GRADE
                </span>
              </div>
              <div className="text-xs text-neutral-400 hidden sm:block">
                Enterprise Quick-Commerce & Data Engineering Platform
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3.5">
            {onTogglePersona && (
              <div className="hidden md:flex items-center border border-neutral-800 bg-neutral-900 rounded p-1">
                <button
                  onClick={() => onTogglePersona('business')}
                  className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded text-sm font-medium transition-all ${
                    personaMode === 'business'
                      ? 'bg-white text-black font-semibold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Business</span>
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
                  <span>Engineering</span>
                </button>
              </div>
            )}

            {/* Connection status */}
            <div className="flex items-center space-x-2 text-xs sm:text-sm font-mono border border-neutral-800 px-3 py-1.5 rounded bg-black">
              <div className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-white' : 'bg-neutral-600 animate-pulse'}`} />
              <span className="text-neutral-300">{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
            </div>

            {/* Enter Platform CTA Button */}
            <button
              onClick={() => onEnterPlatform('overview')}
              className="flex items-center space-x-2 px-4.5 py-2 rounded bg-white text-black hover:bg-neutral-200 transition-all font-semibold text-xs sm:text-sm font-mono tracking-wide"
            >
              <span>ENTER PLATFORM</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ── 2. Hero Section ──────────────────────────────────────────────── */}
      <section className="relative px-4 sm:px-8 pt-20 pb-24 max-w-6xl mx-auto w-full text-center">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center space-x-2.5 border border-neutral-800 bg-neutral-900/80 px-4 py-1.5 rounded-full text-xs sm:text-sm font-mono tracking-wider text-neutral-200 mb-8">
          <span className="w-2.5 h-2.5 rounded-full bg-white" />
          <span>ENTERPRISE QUICK-COMMERCE DATA SYSTEM</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-white mb-6 leading-[1.08]">
          KINETIQ
          <span className="block text-2xl sm:text-4xl md:text-5xl font-light text-neutral-300 mt-3">
            Data Engineering &amp; Intelligence Platform
          </span>
        </h1>

        {/* Accurate Project Description */}
        <p className="max-w-4xl mx-auto text-neutral-300 text-lg sm:text-xl md:text-2xl mb-12 leading-relaxed font-normal">
          An original, production-grade lakehouse and streaming intelligence system built around 
          <strong> 100,000+ real commercial transactions</strong>. Engineered with DuckDB OLAP processing, 
          automated Medallion ETL pipelines, deterministic data quality reconciliation, real-time order streaming, 
          and verifiable multi-page PDF document intelligence.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => onEnterPlatform('overview')}
            className="flex items-center space-x-2.5 px-8 py-4 rounded bg-white text-black hover:bg-neutral-200 transition-all font-bold text-base font-mono tracking-wider shadow-lg"
          >
            <span>LAUNCH DATA PLATFORM</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onEnterPlatform('reports')}
            className="flex items-center space-x-2.5 px-8 py-4 rounded border border-neutral-700 bg-neutral-900/80 hover:bg-neutral-800 text-white transition-all font-semibold text-base font-mono tracking-wider"
          >
            <FileCheck className="w-4 h-4 text-neutral-400" />
            <span>REPORT CENTER</span>
          </button>

          <button
            onClick={() => onEnterPlatform('documentation')}
            className="flex items-center space-x-2.5 px-8 py-4 rounded border border-neutral-800 bg-black/60 hover:border-neutral-700 text-neutral-300 hover:text-white transition-all font-semibold text-base font-mono tracking-wider"
          >
            <FileText className="w-4 h-4 text-neutral-400" />
            <span>ARCHITECTURE DOCS</span>
          </button>
        </div>

        {/* Key Verification Proofs Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-20 text-left">
          <div className="border border-neutral-800 bg-black/70 p-5 rounded-lg">
            <div className="text-xs sm:text-sm font-mono text-neutral-400 mb-1.5">TRANSACTION DATASET</div>
            <div className="text-2xl sm:text-3xl font-bold text-white font-mono">100,000+</div>
            <div className="text-xs sm:text-sm text-neutral-400 mt-1.5">Real Brazilian Olist records (No fake data)</div>
          </div>
          <div className="border border-neutral-800 bg-black/70 p-5 rounded-lg">
            <div className="text-xs sm:text-sm font-mono text-neutral-400 mb-1.5">OLAP QUERY ENGINE</div>
            <div className="text-2xl sm:text-3xl font-bold text-white font-mono">DuckDB Vectorized</div>
            <div className="text-xs sm:text-sm text-neutral-400 mt-1.5">Sub-10ms analytical aggregations</div>
          </div>
          <div className="border border-neutral-800 bg-black/70 p-5 rounded-lg">
            <div className="text-xs sm:text-sm font-mono text-neutral-400 mb-1.5">QUALITY INTEGRITY</div>
            <div className="text-2xl sm:text-3xl font-bold text-white font-mono">10+ Validation Rules</div>
            <div className="text-xs sm:text-sm text-neutral-400 mt-1.5">Strict automated quarantine routing</div>
          </div>
          <div className="border border-neutral-800 bg-black/70 p-5 rounded-lg">
            <div className="text-xs sm:text-sm font-mono text-neutral-400 mb-1.5">DOCUMENT INTELLIGENCE</div>
            <div className="text-2xl sm:text-3xl font-bold text-white font-mono">ReportLab Multi-Page</div>
            <div className="text-xs sm:text-sm text-neutral-400 mt-1.5">Full-text search &amp; SHA-256 provenance</div>
          </div>
        </div>
      </section>

      {/* ── 3. Platform Pillars Section ──────────────────────────────────── */}
      <section className="border-t border-neutral-800/80 bg-neutral-950/60 px-4 sm:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <span className="text-sm font-mono text-neutral-400 uppercase tracking-widest">
              SYSTEM CAPABILITIES
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white mt-1.5">
              End-to-End Quick-Commerce Engineering Stack
            </h2>
            <p className="text-base sm:text-lg text-neutral-300 mt-2.5 max-w-3xl">
              Every component is genuinely implemented with real backend execution, real SQL tables, 
              verifiable metrics, and zero simulated mock states.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {/* Pillar 1 */}
            <div className="border border-neutral-800 bg-black p-7 rounded-xl hover:border-neutral-700 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-3.5 mb-4">
                  <div className="p-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white">
                    <GitBranch className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-white text-lg sm:text-xl">Medallion Lakehouse Engine</h3>
                </div>
                <p className="text-sm sm:text-base text-neutral-300 leading-relaxed mb-5">
                  Multi-tier data lakehouse (Bronze Raw, Silver Cleaned, Gold Star-Schema). 
                  Supports idempotent incremental loads, partition-aware updates, and transaction replay.
                </p>
              </div>
              <button 
                onClick={() => onEnterPlatform('pipelines')}
                className="text-sm font-mono text-white flex items-center space-x-1.5 hover:underline pt-4 border-t border-neutral-900"
              >
                <span>Inspect Pipelines</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Pillar 2 */}
            <div className="border border-neutral-800 bg-black p-7 rounded-xl hover:border-neutral-700 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-3.5 mb-4">
                  <div className="p-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-white text-lg sm:text-xl">Automated Data Quality</h3>
                </div>
                <p className="text-sm sm:text-base text-neutral-300 leading-relaxed mb-5">
                  10+ deterministic rule checks verifying primary keys, status transition states, 
                  delivery timestamps, and non-negative amounts. Failed rows are isolated into quarantine tables.
                </p>
              </div>
              <button 
                onClick={() => onEnterPlatform('quality')}
                className="text-sm font-mono text-white flex items-center space-x-1.5 hover:underline pt-4 border-t border-neutral-900"
              >
                <span>View Quality Rules</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Pillar 3 */}
            <div className="border border-neutral-800 bg-black p-7 rounded-xl hover:border-neutral-700 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-3.5 mb-4">
                  <div className="p-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white">
                    <Radio className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-white text-lg sm:text-xl">Real-Time Event Streaming</h3>
                </div>
                <p className="text-sm sm:text-base text-neutral-300 leading-relaxed mb-5">
                  In-memory event bus simulating high-frequency quick-commerce transactions, rider telematics, 
                  and delivery updates with consumer lag metrics and historical replay capability.
                </p>
              </div>
              <button 
                onClick={() => onEnterPlatform('streaming')}
                className="text-sm font-mono text-white flex items-center space-x-1.5 hover:underline pt-4 border-t border-neutral-900"
              >
                <span>Live Event Stream</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Pillar 4 */}
            <div className="border border-neutral-800 bg-black p-7 rounded-xl hover:border-neutral-700 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-3.5 mb-4">
                  <div className="p-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-white text-lg sm:text-xl">Document Intelligence</h3>
                </div>
                <p className="text-sm sm:text-base text-neutral-300 leading-relaxed mb-5">
                  Production-grade multi-page PDF reporting generated via ReportLab. Features executive summaries, 
                  lineage proofs, and interactive in-browser PDF viewing with full-text search and page navigation.
                </p>
              </div>
              <button 
                onClick={() => onEnterPlatform('reports')}
                className="text-sm font-mono text-white flex items-center space-x-1.5 hover:underline pt-4 border-t border-neutral-900"
              >
                <span>Open Report Center</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Pillar 5 */}
            <div className="border border-neutral-800 bg-black p-7 rounded-xl hover:border-neutral-700 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-3.5 mb-4">
                  <div className="p-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white">
                    <Box className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-white text-lg sm:text-xl">DuckDB Warehousing</h3>
                </div>
                <p className="text-sm sm:text-base text-neutral-300 leading-relaxed mb-5">
                  Embedded columnar database executing analytical queries across orders, customer demographics, 
                  delivery SLAs, and seller performance with zero cloud latency.
                </p>
              </div>
              <button 
                onClick={() => onEnterPlatform('warehouse')}
                className="text-sm font-mono text-white flex items-center space-x-1.5 hover:underline pt-4 border-t border-neutral-900"
              >
                <span>Browse Tables &amp; SQL</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Pillar 6 */}
            <div className="border border-neutral-800 bg-black p-7 rounded-xl hover:border-neutral-700 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-3.5 mb-4">
                  <div className="p-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white">
                    <Activity className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-white text-lg sm:text-xl">Observability &amp; Self-Healing</h3>
                </div>
                <p className="text-sm sm:text-base text-neutral-300 leading-relaxed mb-5">
                  Real-time pipeline monitoring, failure injection testing, automated retry recovery, 
                  and 4-minute continuous keep-alive heartbeats ensuring high availability on Render.
                </p>
              </div>
              <button 
                onClick={() => onEnterPlatform('observability')}
                className="text-sm font-mono text-white flex items-center space-x-1.5 hover:underline pt-4 border-t border-neutral-900"
              >
                <span>Observability Center</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Quick Module Launcher ─────────────────────────────────────── */}
      <section className="px-4 sm:px-8 py-20 max-w-7xl mx-auto w-full">
        <div className="border border-neutral-800 bg-neutral-950 p-10 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2.5">
              Ready to explore Kinetiq?
            </h3>
            <p className="text-base sm:text-lg text-neutral-300 max-w-2xl leading-relaxed">
              Switch between Business Executive view (revenue, SLAs, customer retention) 
              and Engineering Console view (DuckDB SQL, quarantine tables, DAG execution).
            </p>
          </div>
          <button
            onClick={() => onEnterPlatform('overview')}
            className="px-8 py-4 rounded-lg bg-white text-black hover:bg-neutral-200 transition-all font-mono font-bold text-sm tracking-wider flex items-center space-x-2.5 shrink-0 shadow-lg"
          >
            <span>LAUNCH CONSOLE</span>
            <ArrowRight className="w-4.5 h-4.5" />
          </button>
        </div>
      </section>

      {/* ── 5. Minimal Monochrome Footer ─────────────────────────────────── */}
      <footer className="border-t border-neutral-800/80 bg-black py-10 px-4 sm:px-8 text-neutral-400 text-sm font-mono">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="text-white font-semibold text-base mb-1">KINETIQ Platform</div>
            <div>Production-Grade Data Engineering • Real Brazilian E-Commerce Records</div>
          </div>
          <div className="text-neutral-400 text-left md:text-right">
            <div>DuckDB OLAP • SQLite Metadata • FastAPI REST • React 19</div>
            <div>Strict Monochrome System • Keep-Alive Heartbeat Enabled</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default KinetiqPage;
