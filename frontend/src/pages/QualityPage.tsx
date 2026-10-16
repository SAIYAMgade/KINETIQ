import React, { useState } from 'react';
import { QualityRule, QuarantineRecordItem } from '../types';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Search, 
  FileCode,
  Archive,
  Info
} from 'lucide-react';

interface QualityPageProps {
  rules: QualityRule[];
  quarantine: QuarantineRecordItem[];
  loading: boolean;
  onRefresh: () => void;
}

export const QualityPage: React.FC<QualityPageProps> = ({
  rules,
  quarantine,
  loading,
  onRefresh
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [selectedQuarantine, setSelectedQuarantine] = useState<QuarantineRecordItem | null>(null);

  const categories = ['ALL', 'UNIQUENESS', 'COMPLETENESS', 'VALIDITY', 'INTEGRITY', 'RECONCILIATION'];

  const filteredRules = rules.filter(r => 
    filterCategory === 'ALL' ? true : r.rule_category === filterCategory
  );

  const passedCount = rules.filter(r => r.status === 'PASSED').length;
  const failedCount = rules.filter(r => r.status === 'FAILED').length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-neutral-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 mb-1">
            Data Governance & Quality Guardrails
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
            Data Quality & Quarantine Engine
          </h1>
          <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
            10 automated checks evaluated on every pipeline run. Defective records are isolated into 
            quarantine for traceability rather than deleted.
          </p>
        </div>

        <div className="flex items-center space-x-3 font-mono text-xs">
          <div className="border border-neutral-800 bg-neutral-950 px-3 py-1.5 rounded flex items-center space-x-2">
            <span className="text-neutral-400">PASSED:</span>
            <span className="text-white font-bold">{passedCount}</span>
          </div>
          <div className="border border-neutral-800 bg-neutral-950 px-3 py-1.5 rounded flex items-center space-x-2">
            <span className="text-neutral-400">FAILED:</span>
            <span className="text-white font-bold">{failedCount}</span>
          </div>
          <div className="border border-neutral-800 bg-neutral-950 px-3 py-1.5 rounded flex items-center space-x-2">
            <span className="text-neutral-400">QUARANTINED:</span>
            <span className="text-white font-bold">{quarantine.length}</span>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-neutral-800 pb-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
              filterCategory === cat
                ? 'bg-white text-black font-semibold'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Rules Scorecard */}
      <div className="border border-neutral-800 rounded bg-neutral-950 overflow-hidden">
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-white" />
            <span className="font-mono text-xs font-semibold text-white uppercase tracking-wider">
              Quality Rules Scorecard ({filteredRules.length})
            </span>
          </div>
        </div>

        <div className="divide-y divide-neutral-900">
          {filteredRules.map((rule) => {
            const isPassed = rule.status === 'PASSED';
            return (
              <div key={rule.rule_id} className="p-4 hover:bg-neutral-900/30 transition-colors space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-3">
                    <span className={`p-1 rounded ${isPassed ? 'text-white' : 'text-neutral-400'}`}>
                      {isPassed ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    </span>
                    <div>
                      <span className="font-mono text-xs text-neutral-400 mr-2">{rule.rule_id}</span>
                      <span className="font-semibold text-white text-sm">{rule.rule_name}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-xs font-mono">
                    <span className="border border-neutral-800 px-2 py-0.5 rounded text-neutral-400">
                      {rule.rule_category}
                    </span>
                    <span className="border border-neutral-800 px-2 py-0.5 rounded text-neutral-300">
                      Target: {rule.target_entity}
                    </span>
                    <span className={`px-2 py-0.5 rounded border text-[11px] font-bold ${
                      isPassed ? 'border-neutral-700 bg-neutral-900 text-neutral-100' : 'border-white bg-black text-white'
                    }`}>
                      {rule.status} ({rule.records_failed} failed)
                    </span>
                  </div>
                </div>

                <div className="text-xs text-neutral-400 font-sans pl-7">
                  <span className="font-semibold text-neutral-300">Rationale: </span>
                  {rule.rationale}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quarantine Inspector */}
      <div className="border border-neutral-800 rounded bg-neutral-950 overflow-hidden">
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Archive className="w-4 h-4 text-white" />
            <span className="font-mono text-xs font-semibold text-white uppercase tracking-wider">
              Quarantine Storage Inspector ({quarantine.length} records)
            </span>
          </div>
          <div className="text-[11px] font-mono text-neutral-400">
            Defective Records Policy: Isolated & Audit Preserved
          </div>
        </div>

        {quarantine.length === 0 ? (
          <div className="p-8 text-center text-xs font-mono text-neutral-400">
            No defective records currently quarantined. Pipeline data passed all strict integrity gates.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs text-neutral-300">
              <thead className="bg-neutral-900/80 border-b border-neutral-800 text-[11px] text-neutral-400 uppercase">
                <tr>
                  <th className="py-3 px-4">Entity</th>
                  <th className="py-3 px-4">Record Identifier</th>
                  <th className="py-3 px-4">Violated Rule</th>
                  <th className="py-3 px-4">Reason</th>
                  <th className="py-3 px-4 text-right">Raw Payload</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900">
                {quarantine.map((q) => (
                  <tr key={q.id} className="hover:bg-neutral-900/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-white">{q.entity_name}</td>
                    <td className="py-3 px-4 text-neutral-300">{q.record_identifier}</td>
                    <td className="py-3 px-4 text-neutral-400">{q.violated_rule}</td>
                    <td className="py-3 px-4 text-neutral-300">{q.reason}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedQuarantine(q)}
                        className="text-neutral-400 hover:text-white inline-flex items-center space-x-1"
                      >
                        <FileCode className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Raw Payload Modal */}
      {selectedQuarantine && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-950 border border-neutral-700 p-6 rounded max-w-lg w-full space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="font-mono text-sm font-bold text-white">
                Quarantined Payload: {selectedQuarantine.record_identifier}
              </div>
              <button 
                onClick={() => setSelectedQuarantine(null)} 
                className="text-neutral-400 hover:text-white text-xs font-mono"
              >
                ✕ Close
              </button>
            </div>
            <div className="text-xs text-neutral-400 font-mono">
              <div>Rule: {selectedQuarantine.violated_rule}</div>
              <div>Reason: {selectedQuarantine.reason}</div>
            </div>
            <pre className="p-4 border border-neutral-800 bg-black rounded text-xs font-mono text-neutral-200 overflow-x-auto max-h-60">
              {JSON.stringify(selectedQuarantine.raw_payload, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
