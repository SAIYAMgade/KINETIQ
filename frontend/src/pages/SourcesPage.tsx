import React, { useState } from 'react';
import { SourceItem } from '../types';
import { api } from '../services/api';
import { 
  Database, 
  DownloadCloud, 
  Upload, 
  CheckCircle, 
  FileText, 
  ExternalLink,
  ChevronDown,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

interface SourcesPageProps {
  sources: SourceItem[];
  loading: boolean;
  onRefresh: () => void;
  onOpenPdf?: (docId: string, page?: number) => void;
}

export const SourcesPage: React.FC<SourcesPageProps> = ({
  sources,
  loading,
  onRefresh,
  onOpenPdf
}) => {
  const [documents, setDocuments] = useState<any[]>([]);

  React.useEffect(() => {
    api.getDocuments().then(docs => setDocuments(docs)).catch(() => {});
  }, []);
  const [fetching, setFetching] = useState(false);
  const [expandedSourceId, setExpandedSourceId] = useState<number | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const handleFetchAll = async () => {
    try {
      setFetching(true);
      await api.fetchAllSources();
      onRefresh();
    } catch (e: any) {
      alert(`Error fetching sources: ${e.message}`);
    } finally {
      setFetching(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadStatus(`Uploading ${file.name}...`);
      await api.uploadSourceFile(file);
      setUploadStatus(`Uploaded ${file.name} successfully.`);
      onRefresh();
    } catch (err: any) {
      setUploadStatus(`Upload failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-neutral-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 mb-1">
            Bronze Ingestion Catalogs
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
            Data Sources & Provenance Registry
          </h1>
          <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
            Audit and verify source files. Every dataset contains an immutable SHA-256 fingerprint, 
            canonical retrieval URL, and schema definition.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center space-x-2 px-3 py-1.5 border border-neutral-700 bg-neutral-900 text-neutral-200 text-xs font-mono rounded cursor-pointer hover:bg-neutral-800 transition-colors">
            <Upload className="w-3.5 h-3.5" />
            <span>Import CSV</span>
            <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
          </label>

          <button
            onClick={handleFetchAll}
            disabled={fetching}
            className="flex items-center space-x-2 px-3 py-1.5 border border-white bg-white text-black text-xs font-mono font-medium rounded hover:bg-neutral-200 transition-colors disabled:opacity-50"
          >
            <DownloadCloud className="w-3.5 h-3.5" />
            <span>{fetching ? 'Verifying Sources...' : 'Sync Olist Repositories'}</span>
          </button>
        </div>
      </div>

      {uploadStatus && (
        <div className="border border-neutral-700 bg-neutral-900 p-3 rounded text-xs font-mono text-neutral-200">
          {uploadStatus}
        </div>
      )}

      {/* Sources Table */}
      <div className="border border-neutral-800 rounded bg-neutral-950 overflow-hidden">
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-white" />
            <span className="font-mono text-xs font-semibold text-white uppercase tracking-wider">
              Registered Canonical Sources ({sources.length})
            </span>
          </div>
          <div className="text-[11px] font-mono text-neutral-400">
            Official Source: olist/work-at-olist-data (MIT)
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs text-neutral-300">
            <thead className="bg-neutral-900/80 border-b border-neutral-800 text-[11px] text-neutral-400 uppercase">
              <tr>
                <th className="py-3 px-4">Source Name</th>
                <th className="py-3 px-4">Size</th>
                <th className="py-3 px-4">Raw Records</th>
                <th className="py-3 px-4">SHA-256 Fingerprint</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900">
              {sources.map((s) => {
                const isExpanded = expandedSourceId === s.id;
                const sizeMb = (s.file_size_bytes / (1024 * 1024)).toFixed(2);
                return (
                  <React.Fragment key={s.id}>
                    <tr className="hover:bg-neutral-900/40 transition-colors">
                      <td className="py-3 px-4 font-semibold text-white">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-3.5 h-3.5 text-neutral-400" />
                          <span>{s.source_name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-neutral-400">{sizeMb} MB</td>
                      <td className="py-3 px-4 text-neutral-200 font-bold">
                        {s.raw_record_count.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-neutral-400 text-[11px]">
                        {s.file_fingerprint ? `${s.file_fingerprint.slice(0, 16)}...` : 'Pending sync'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono border ${
                          s.file_exists
                            ? 'border-neutral-700 bg-neutral-900 text-neutral-200'
                            : 'border-neutral-800 text-neutral-400'
                        }`}>
                          {s.file_exists ? <CheckCircle className="w-2.5 h-2.5 text-white" /> : <ShieldAlert className="w-2.5 h-2.5" />}
                          <span>{s.ingestion_status}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setExpandedSourceId(isExpanded ? null : s.id)}
                          className="text-neutral-400 hover:text-white inline-flex items-center space-x-1"
                        >
                          <span>{isExpanded ? 'Hide' : 'Schema'}</span>
                          {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                        </button>
                      </td>
                    </tr>

                    {/* Expandable Schema & Metadata Drawer */}
                    {isExpanded && (
                      <tr className="bg-neutral-900/60 border-y border-neutral-800">
                        <td colSpan={6} className="p-4 space-y-3">
                          <div className="flex flex-col md:flex-row md:items-center justify-between text-[11px] text-neutral-400 pb-2 border-b border-neutral-800">
                            <div>
                              <span>Canonical URL: </span>
                              <a 
                                href={s.source_url} 
                                target="_blank" 
                                rel="noreferrer"
                                className="text-white hover:underline inline-flex items-center space-x-1"
                              >
                                <span>{s.source_url}</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            </div>
                            <div>License: {s.license}</div>
                          </div>

                          <div>
                            <div className="text-[11px] uppercase tracking-wider text-neutral-400 mb-1.5">
                              Schema Columns ({s.schema_fields?.length || 0}):
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {s.schema_fields?.map((col, idx) => (
                                <span 
                                  key={idx} 
                                  className="border border-neutral-800 bg-black px-2 py-0.5 rounded text-[11px] text-neutral-300 font-mono"
                                >
                                  {col}
                                </span>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Associated Unstructured PDF Source Documents */}
      {documents.length > 0 && (
        <div className="border border-neutral-800 rounded bg-neutral-950 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-white" />
              <span className="font-mono text-xs font-semibold uppercase text-white tracking-wider">
                Associated Operational PDF Evidence & Ingested Documents ({documents.length})
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {documents.map((doc: any) => (
              <div
                key={doc.doc_id}
                onClick={() => onOpenPdf?.(doc.doc_id)}
                className="border border-neutral-800 hover:border-neutral-600 bg-black p-4 rounded cursor-pointer transition-all hover:bg-neutral-900/40 group flex flex-col justify-between space-y-2"
              >
                <div>
                  <div className="text-[10px] font-mono text-neutral-400 mb-1">
                    {doc.document_category} • {doc.page_count} {doc.page_count === 1 ? 'page' : 'pages'}
                  </div>
                  <div className="font-semibold text-white text-xs font-sans group-hover:underline">
                    {doc.title}
                  </div>
                  <div className="text-[11px] text-neutral-400 font-mono mt-0.5 truncate">
                    {doc.filename}
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-900 flex items-center justify-between text-[11px] font-mono text-neutral-400">
                  <span>{(doc.file_size_bytes / 1024).toFixed(1)} KB</span>
                  <span className="text-white group-hover:underline">Open in PDF Viewer →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
