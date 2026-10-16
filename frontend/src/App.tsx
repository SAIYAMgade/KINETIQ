import React, { useState, useEffect } from 'react';
import { Header, PageId, PersonaMode } from './components/Header';
import { Footer } from './components/Footer';
import { OverviewPage } from './pages/OverviewPage';
import { SourcesPage } from './pages/SourcesPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { ReportCenterPage } from './pages/ReportCenterPage';
import { PipelinesPage } from './pages/PipelinesPage';
import { QualityPage } from './pages/QualityPage';
import { WarehousePage } from './pages/WarehousePage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { StreamingPage } from './pages/StreamingPage';
import { ObservabilityPage } from './pages/ObservabilityPage';
import { BenchmarksPage } from './pages/BenchmarksPage';
import { DocumentationPage } from './pages/DocumentationPage';
import { KinetiqPage } from './pages/KinetiqPage';
import { PdfViewerModal } from './components/PdfViewerModal';
import { api } from './services/api';
import { 
  OverviewData, 
  SourceItem, 
  PipelineRunItem, 
  QualityRule, 
  QuarantineRecordItem, 
  WarehouseTable 
} from './types';

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageId>('kinetiq');
  const [personaMode, setPersonaMode] = useState<PersonaMode>('business');
  const [isOnline, setIsOnline] = useState<boolean>(true);

  // PDF Viewer Modal State
  const [activePdfDocId, setActivePdfDocId] = useState<string | null>(null);
  const [activePdfPage, setActivePdfPage] = useState<number>(1);

  const openPdf = (docId: string, page: number = 1) => {
    setActivePdfDocId(docId);
    setActivePdfPage(page);
  };

  const closePdf = () => {
    setActivePdfDocId(null);
  };

  // Core state
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [sources, setSources] = useState<SourceItem[]>([]);
  const [runs, setRuns] = useState<PipelineRunItem[]>([]);
  const [rules, setRules] = useState<QualityRule[]>([]);
  const [quarantine, setQuarantine] = useState<QuarantineRecordItem[]>([]);
  const [tables, setTables] = useState<WarehouseTable[]>([]);
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [ovRes, srcRes, pipeRes, qRulesRes, qRecRes, whRes] = await Promise.all([
        api.getOverview().catch(() => null),
        api.getSources().catch(() => []),
        api.getPipelines().catch(() => []),
        api.getQualityRules().catch(() => []),
        api.getQuarantineRecords().catch(() => []),
        api.getWarehouseTables().catch(() => [])
      ]);

      if (ovRes) {
        setOverview(ovRes);
        setIsOnline(true);
      } else {
        setIsOnline(false);
      }

      setSources(srcRes);
      setRuns(pipeRes);
      setRules(qRulesRes);
      setQuarantine(qRecRes);
      setTables(whRes);
    } catch (err: any) {
      console.error('Failed to load application data:', err);
      setError(err.message);
      setIsOnline(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000); // Polling every 10s
    return () => clearInterval(interval);
  }, []);

  // Dedicated Keep-Alive Heartbeat: sends a request every 4 minutes
  // to ensure continuous connection and prevent the server from idling/sleeping
  useEffect(() => {
    const sendHeartbeat = () => {
      fetch('/health')
        .then((r) => r.json())
        .then(() => setIsOnline(true))
        .catch(() => setIsOnline(false));
    };
    const heartbeatTimer = setInterval(sendHeartbeat, 4 * 60 * 1000); // 4 minutes
    return () => clearInterval(heartbeatTimer);
  }, []);

  if (currentPage === 'kinetiq') {
    return (
      <>
        <KinetiqPage 
          onEnterPlatform={(page) => setCurrentPage(page || 'overview')} 
          personaMode={personaMode}
          onTogglePersona={setPersonaMode}
          isOnline={isOnline}
        />
        {activePdfDocId && (
          <PdfViewerModal
            docId={activePdfDocId}
            initialPage={activePdfPage}
            onClose={closePdf}
          />
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-black text-neutral-100 flex flex-col font-sans selection:bg-neutral-800 selection:text-white">
      {/* Navigation Header */}
      <Header
        currentPage={currentPage}
        onSelectPage={setCurrentPage}
        personaMode={personaMode}
        onTogglePersona={setPersonaMode}
        isOnline={isOnline}
      />

      {/* Main Page Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {currentPage === 'overview' && (
          <OverviewPage
            data={overview}
            loading={loading}
            error={error}
            personaMode={personaMode}
            onNavigate={setCurrentPage}
            onOpenPdf={openPdf}
          />
        )}

        {currentPage === 'sources' && (
          <SourcesPage
            sources={sources}
            loading={loading}
            onRefresh={loadData}
            onOpenPdf={openPdf}
          />
        )}

        {currentPage === 'documents' && (
          <DocumentsPage
            onOpenPdf={openPdf}
          />
        )}

        {currentPage === 'reports' && (
          <ReportCenterPage
            onOpenPdf={openPdf}
          />
        )}

        {currentPage === 'pipelines' && (
          <PipelinesPage
            runs={runs}
            loading={loading}
            onRefresh={loadData}
          />
        )}

        {currentPage === 'quality' && (
          <QualityPage
            rules={rules}
            quarantine={quarantine}
            loading={loading}
            onRefresh={loadData}
          />
        )}

        {currentPage === 'warehouse' && (
          <WarehousePage
            tables={tables}
            loading={loading}
            onRefresh={loadData}
          />
        )}

        {currentPage === 'analytics' && (
          <AnalyticsPage />
        )}

        {currentPage === 'streaming' && (
          <StreamingPage />
        )}

        {currentPage === 'observability' && (
          <ObservabilityPage />
        )}

        {currentPage === 'benchmarks' && (
          <BenchmarksPage />
        )}

        {currentPage === 'documentation' && (
          <DocumentationPage />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Integrated PDF Viewer Modal */}
      {activePdfDocId && (
        <PdfViewerModal
          docId={activePdfDocId}
          initialPage={activePdfPage}
          onClose={closePdf}
        />
      )}
    </div>
  );
};
