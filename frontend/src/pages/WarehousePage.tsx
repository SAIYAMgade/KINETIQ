import React, { useState } from 'react';
import { WarehouseTable } from '../types';
import { api } from '../services/api';
import { 
  Box, 
  Terminal, 
  Play, 
  Table as TableIcon, 
  Layers, 
  Code,
  Clock,
  Sparkles
} from 'lucide-react';

interface WarehousePageProps {
  tables: WarehouseTable[];
  loading: boolean;
  onRefresh: () => void;
}

export const WarehousePage: React.FC<WarehousePageProps> = ({
  tables,
  loading,
  onRefresh
}) => {
  const [selectedLayer, setSelectedLayer] = useState<'ALL' | 'Bronze' | 'Silver' | 'Gold'>('ALL');
  const [activeTable, setActiveTable] = useState<string | null>(null);
  const [sqlQuery, setSqlQuery] = useState<string>(
    'SELECT category_name, COUNT(*) AS items, ROUND(SUM(item_price), 2) AS sales\nFROM fact_order_items i\nJOIN dim_products p ON i.product_id = p.product_id\nGROUP BY category_name\nORDER BY sales DESC\nLIMIT 10;'
  );
  const [queryResults, setQueryResults] = useState<{
    columns: string[];
    rows: any[][];
    execution_time_ms: number;
    returned_rows: number;
  } | null>(null);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [executing, setExecuting] = useState(false);

  const filteredTables = tables.filter(t => 
    selectedLayer === 'ALL' ? true : t.layer === selectedLayer
  );

  const currentTable = tables.find(t => t.table_name === activeTable) || filteredTables[0];

  const handleExecuteSql = async () => {
    try {
      setExecuting(true);
      setQueryError(null);
      const res = await api.executeSqlQuery(sqlQuery);
      setQueryResults(res);
    } catch (e: any) {
      setQueryError(e.message);
    } finally {
      setExecuting(false);
    }
  };

  const sampleQueries = [
    {
      title: 'Top Categories by Sales',
      sql: 'SELECT category_name, COUNT(*) AS items, ROUND(SUM(item_price), 2) AS sales\nFROM fact_order_items i\nJOIN dim_products p ON i.product_id = p.product_id\nGROUP BY category_name\nORDER BY sales DESC\nLIMIT 10;'
    },
    {
      title: 'Delivery Performance by State',
      sql: 'SELECT c.customer_state, COUNT(o.order_id) AS orders, ROUND(AVG(o.delivery_days), 1) AS avg_lead_days\nFROM fact_orders o\nJOIN dim_customers c ON o.customer_id = c.customer_id\nWHERE o.delivery_days IS NOT NULL\nGROUP BY c.customer_state\nORDER BY orders DESC\nLIMIT 10;'
    },
    {
      title: 'Payment Method Aggregation',
      sql: 'SELECT payment_type, COUNT(*) AS transactions, ROUND(SUM(payment_value), 2) AS total_amount\nFROM silver_order_payments\nGROUP BY payment_type\nORDER BY total_amount DESC;'
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-neutral-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 mb-1">
            Storage & Schemas
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
            Analytical Warehouse & Query Sandbox
          </h1>
          <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
            DuckDB-powered columnar engine. Inspect tables, examine schemas, and execute audited, 
            read-only SQL queries against real transformed datasets.
          </p>
        </div>

        {/* Layer Filters */}
        <div className="flex items-center space-x-1.5 border border-neutral-800 bg-neutral-950 p-1 rounded font-mono text-xs">
          {(['ALL', 'Bronze', 'Silver', 'Gold'] as const).map(layer => (
            <button
              key={layer}
              onClick={() => setSelectedLayer(layer)}
              className={`px-3 py-1 rounded transition-colors ${
                selectedLayer === layer
                  ? 'bg-white text-black font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {layer}
            </button>
          ))}
        </div>
      </div>

      {/* Tables & Schema Inspector Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Table Selector List */}
        <div className="border border-neutral-800 rounded bg-neutral-950 p-4 space-y-3">
          <div className="text-xs font-mono uppercase text-neutral-400 font-semibold tracking-wider flex items-center space-x-2">
            <Layers className="w-3.5 h-3.5" />
            <span>Warehouse Tables ({filteredTables.length})</span>
          </div>
          <div className="space-y-1.5 max-h-[360px] overflow-y-auto">
            {filteredTables.map(t => {
              const isActive = (currentTable?.table_name === t.table_name);
              return (
                <button
                  key={t.table_name}
                  onClick={() => setActiveTable(t.table_name)}
                  className={`w-full text-left p-2.5 rounded font-mono text-xs flex items-center justify-between border transition-all ${
                    isActive
                      ? 'border-neutral-600 bg-neutral-800 text-white font-bold'
                      : 'border-transparent hover:border-neutral-800 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <div className="truncate mr-2">{t.table_name}</div>
                  <div className="text-[10px] text-neutral-400">{t.row_count.toLocaleString()} rows</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Table Schema Viewer */}
        <div className="md:col-span-2 border border-neutral-800 rounded bg-neutral-950 p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
            <div>
              <div className="font-mono text-xs text-neutral-400 uppercase tracking-wider">
                {currentTable?.layer} Layer Schema
              </div>
              <div className="font-mono text-base font-bold text-white">
                {currentTable?.table_name} ({currentTable?.row_count.toLocaleString()} rows)
              </div>
            </div>
            <span className="text-[11px] font-mono border border-neutral-700 px-2 py-0.5 rounded text-neutral-300">
              {currentTable?.columns.length} columns
            </span>
          </div>

          <div className="max-h-[300px] overflow-y-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-neutral-900 border-b border-neutral-800 text-neutral-400 text-[10px] uppercase">
                <tr>
                  <th className="py-2 px-3">Column Name</th>
                  <th className="py-2 px-3">Data Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900 text-neutral-300">
                {currentTable?.columns.map(c => (
                  <tr key={c.name} className="hover:bg-neutral-900/30">
                    <td className="py-2 px-3 font-semibold text-white">{c.name}</td>
                    <td className="py-2 px-3 text-neutral-400">{c.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Interactive SQL Query Sandbox */}
      <div className="border border-neutral-800 rounded bg-neutral-950 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-white" />
            <span className="font-mono text-xs font-semibold uppercase text-white tracking-wider">
              Interactive Read-Only SQL Query Sandbox
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {sampleQueries.map((sq, i) => (
              <button
                key={i}
                onClick={() => setSqlQuery(sq.sql)}
                className="text-[11px] font-mono text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-600 px-2 py-1 rounded transition-colors"
              >
                {sq.title}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <textarea
            value={sqlQuery}
            onChange={(e) => setSqlQuery(e.target.value)}
            rows={5}
            className="w-full bg-black border border-neutral-800 rounded p-4 font-mono text-xs text-neutral-100 focus:outline-none focus:border-neutral-500 selection:bg-neutral-800"
            placeholder="SELECT * FROM fact_orders LIMIT 10;"
          />
          <button
            onClick={handleExecuteSql}
            disabled={executing}
            className="absolute bottom-4 right-4 flex items-center space-x-1.5 px-3 py-1.5 bg-white text-black font-mono text-xs font-semibold rounded hover:bg-neutral-200 transition-colors disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{executing ? 'Querying...' : 'Execute SQL'}</span>
          </button>
        </div>

        {queryError && (
          <div className="border border-neutral-700 bg-neutral-900/60 p-3 rounded font-mono text-xs text-neutral-200">
            Query Error: {queryError}
          </div>
        )}

        {/* Query Output Table */}
        {queryResults && (
          <div className="border border-neutral-800 rounded overflow-hidden">
            <div className="bg-neutral-900 p-3 border-b border-neutral-800 flex items-center justify-between font-mono text-xs text-neutral-400">
              <div>
                Returned {queryResults.returned_rows} rows
              </div>
              <div className="flex items-center space-x-1 text-neutral-300">
                <Clock className="w-3.5 h-3.5" />
                <span>Execution: {queryResults.execution_time_ms} ms</span>
              </div>
            </div>

            <div className="overflow-x-auto max-h-60">
              <table className="w-full text-left font-mono text-xs text-neutral-300">
                <thead className="bg-black border-b border-neutral-800 text-[11px] text-neutral-400 uppercase">
                  <tr>
                    {queryResults.columns.map((col, idx) => (
                      <th key={idx} className="py-2.5 px-3 whitespace-nowrap">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900">
                  {queryResults.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-neutral-900/30">
                      {row.map((cell: any, cIdx: number) => (
                        <td key={cIdx} className="py-2 px-3 whitespace-nowrap text-neutral-200">
                          {typeof cell === 'number' ? cell.toLocaleString() : String(cell ?? 'NULL')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
