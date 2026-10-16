import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-neutral-800 bg-neutral-950 text-neutral-400 py-8 px-4 sm:px-6 mt-16 font-mono text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="text-neutral-200 font-semibold mb-1">
            KINETIQ Data Platform
          </div>
          <p className="text-neutral-400 max-w-xl">
            An original, production-grade data engineering system designed around genuine e-commerce records 
            from the Brazilian E-Commerce Public Dataset by Olist (MIT License). No synthetic production records fabricated.
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end space-y-1 text-neutral-400">
          <div>DuckDB OLAP Engine • SQLite Metadata • FastAPI REST</div>
          <div>Strict Monochrome Visual Architecture</div>
          <div className="text-neutral-400">Dataset Date Span: 2016-09-04 to 2018-10-17</div>
        </div>
      </div>
    </footer>
  );
};
