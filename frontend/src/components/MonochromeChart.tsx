import React, { useState } from 'react';

interface BarDataPoint {
  label: string;
  value: number;
  sublabel?: string;
}

interface LineDataPoint {
  x: string;
  y: number;
}

interface MonochromeBarChartProps {
  data: BarDataPoint[];
  height?: number;
  valuePrefix?: string;
  valueSuffix?: string;
}

export const MonochromeBarChart: React.FC<MonochromeBarChartProps> = ({
  data,
  height = 240,
  valuePrefix = '',
  valueSuffix = ''
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div 
        className="flex items-center justify-center border border-dashed border-neutral-800 text-neutral-500 font-mono text-xs rounded"
        style={{ height }}
      >
        No chart records available
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value), 1);
  const barWidth = 100 / data.length;

  return (
    <div className="relative w-full" style={{ height }}>
      {/* Gridlines */}
      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
        <div className="border-b border-neutral-700 w-full" />
        <div className="border-b border-neutral-700 w-full" />
        <div className="border-b border-neutral-700 w-full" />
        <div className="border-b border-neutral-700 w-full" />
      </div>

      {/* SVG Bars */}
      <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
        {data.map((d, i) => {
          const barHeightPct = (d.value / maxValue) * 85;
          const isHovered = hoveredIdx === i;
          return (
            <g key={i} onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)}>
              {/* Neutral / Monochrome Bar */}
              <rect
                x={`${i * barWidth + barWidth * 0.15}%`}
                y={`${100 - barHeightPct}%`}
                width={`${barWidth * 0.7}%`}
                height={`${barHeightPct}%`}
                className={`transition-all duration-150 cursor-pointer ${
                  isHovered ? 'fill-white stroke-neutral-300' : 'fill-neutral-400 stroke-neutral-600'
                }`}
                strokeWidth="1"
              />
            </g>
          );
        })}
      </svg>

      {/* Tooltip on hover */}
      {hoveredIdx !== null && (
        <div
          className="absolute z-20 pointer-events-none bg-neutral-900 border border-neutral-600 px-3 py-1.5 rounded shadow-lg text-xs font-mono text-neutral-100"
          style={{
            left: `${Math.min(85, Math.max(10, hoveredIdx * barWidth + barWidth / 2))}%`,
            top: '10%',
            transform: 'translateX(-50%)'
          }}
        >
          <div className="text-neutral-400 text-[10px] uppercase tracking-wider">{data[hoveredIdx].label}</div>
          <div className="font-semibold text-white">
            {valuePrefix}{data[hoveredIdx].value.toLocaleString()}{valueSuffix}
          </div>
          {data[hoveredIdx].sublabel && (
            <div className="text-neutral-400 text-[10px]">{data[hoveredIdx].sublabel}</div>
          )}
        </div>
      )}

      {/* X-axis labels */}
      <div className="flex justify-between items-center text-[10px] text-neutral-400 font-mono mt-2 truncate">
        {data.length <= 15 ? (
          data.map((d, i) => (
            <span key={i} className="truncate text-center" style={{ width: `${barWidth}%` }}>
              {d.label.slice(0, 10)}
            </span>
          ))
        ) : (
          <>
            <span>{data[0]?.label}</span>
            <span>{data[Math.floor(data.length / 2)]?.label}</span>
            <span>{data[data.length - 1]?.label}</span>
          </>
        )}
      </div>
    </div>
  );
};

interface MonochromeLineChartProps {
  data: LineDataPoint[];
  height?: number;
  valuePrefix?: string;
  valueSuffix?: string;
}

export const MonochromeLineChart: React.FC<MonochromeLineChartProps> = ({
  data,
  height = 240,
  valuePrefix = '',
  valueSuffix = ''
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div 
        className="flex items-center justify-center border border-dashed border-neutral-800 text-neutral-500 font-mono text-xs rounded"
        style={{ height }}
      >
        No time-series data available
      </div>
    );
  }

  const maxY = Math.max(...data.map(d => d.y), 1);
  const minY = Math.min(...data.map(d => d.y), 0);
  const rangeY = maxY - minY || 1;

  // Compute SVG polyline points
  const points = data.map((d, i) => {
    const xPct = (i / (data.length - 1 || 1)) * 100;
    const yPct = 100 - ((d.y - minY) / rangeY) * 85 - 5;
    return `${xPct},${yPct}`;
  }).join(' ');

  return (
    <div className="relative w-full" style={{ height }}>
      {/* Grid */}
      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
        <div className="border-b border-neutral-700 w-full" />
        <div className="border-b border-neutral-700 w-full" />
        <div className="border-b border-neutral-700 w-full" />
        <div className="border-b border-neutral-700 w-full" />
      </div>

      <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Fill area below line */}
        <polygon
          points={`0,100 ${points} 100,100`}
          className="fill-neutral-900/60"
        />

        {/* Primary Line */}
        <polyline
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.2"
          points={points}
        />

        {/* Hover interaction overlay points */}
        {data.map((d, i) => {
          const xPct = (i / (data.length - 1 || 1)) * 100;
          const yPct = 100 - ((d.y - minY) / rangeY) * 85 - 5;
          const isHovered = hoveredIdx === i;
          return (
            <circle
              key={i}
              cx={xPct}
              cy={yPct}
              r={isHovered ? 3.5 : 1.5}
              className={`transition-all cursor-pointer ${
                isHovered ? 'fill-white stroke-neutral-900 stroke-2' : 'fill-neutral-400'
              }`}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            />
          );
        })}
      </svg>

      {/* Tooltip */}
      {hoveredIdx !== null && (
        <div
          className="absolute z-20 pointer-events-none bg-neutral-950 border border-neutral-700 px-3 py-1.5 rounded shadow-xl text-xs font-mono text-neutral-100"
          style={{
            left: `${Math.min(85, Math.max(15, (hoveredIdx / (data.length - 1 || 1)) * 100))}%`,
            top: '5%',
            transform: 'translateX(-50%)'
          }}
        >
          <div className="text-neutral-400 text-[10px]">{data[hoveredIdx].x}</div>
          <div className="font-semibold text-white">
            {valuePrefix}{data[hoveredIdx].y.toLocaleString()}{valueSuffix}
          </div>
        </div>
      )}

      {/* Date labels */}
      <div className="flex justify-between items-center text-[10px] text-neutral-400 font-mono mt-2">
        <span>{data[0]?.x}</span>
        <span>{data[Math.floor(data.length / 2)]?.x}</span>
        <span>{data[data.length - 1]?.x}</span>
      </div>
    </div>
  );
};
