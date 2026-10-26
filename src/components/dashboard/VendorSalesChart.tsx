import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  BarChart3,
  Calendar,
  ArrowUpRight,
  Ticket,
  Sparkles
} from 'lucide-react';
import type { ConcertEvent } from '../../types';

export type Timeframe = '7D' | '30D' | '90D' | '12M';

interface VendorSalesChartProps {
  concerts: ConcertEvent[];
  timeframe: Timeframe;
  onTimeframeChange: (tf: Timeframe) => void;
  formatCurrency: (val: number) => string;
}

export const VendorSalesChart: React.FC<VendorSalesChartProps> = ({
  concerts: _concerts,
  timeframe,
  onTimeframeChange,
  formatCurrency
}) => {
  const [hoveredRevIndex, setHoveredRevIndex] = useState<number | null>(null);
  const [hoveredTixIndex, setHoveredTixIndex] = useState<number | null>(null);

  const seriesData = useMemo(() => {
    switch (timeframe) {
      case '7D':
        return [
          { label: 'Mon', revenue: 1450000, tickets: 480, note: 'General admission launch' },
          { label: 'Tue', revenue: 2100000, tickets: 690, note: 'Early bird tier release' },
          { label: 'Wed', revenue: 3800000, tickets: 1250, note: 'Midweek demand surge' },
          { label: 'Thu', revenue: 4900000, tickets: 1600, note: 'VIP lounge allocation' },
          { label: 'Fri', revenue: 8200000, tickets: 2750, note: 'Weekend presale spike' },
          { label: 'Sat', revenue: 12500000, tickets: 4100, note: 'Peak stadium rush' },
          { label: 'Sun', revenue: 9800000, tickets: 3200, note: 'Grandstand tickets closed' }
        ];
      case '30D':
        return [
          { label: 'Week 1', revenue: 28500000, tickets: 9400, note: 'National tour dates drop' },
          { label: 'Week 2', revenue: 42000000, tickets: 14100, note: 'Phase 1 standing sellout' },
          { label: 'Week 3', revenue: 68500000, tickets: 22800, note: 'Ad campaign expansion' },
          { label: 'Week 4', revenue: 95400000, tickets: 31200, note: 'Multi-city stadium peak' }
        ];
      case '90D':
        return [
          { label: 'Month 1', revenue: 110000000, tickets: 38000, note: 'Q1 Arena tour rollout' },
          { label: 'Month 2', revenue: 185000000, tickets: 62000, note: 'Coldplay Ahmedabad surge' },
          { label: 'Month 3', revenue: 245000000, tickets: 82000, note: 'Diljit & Dua Lipa manifests' }
        ];
      case '12M':
        return [
          { label: 'Q1', revenue: 120000000, tickets: 42000, note: 'Winter stadium season' },
          { label: 'Q2', revenue: 195000000, tickets: 68000, note: 'Spring tour release series' },
          { label: 'Q3', revenue: 290000000, tickets: 95000, note: 'Monsoon acoustic stops' },
          { label: 'Q4', revenue: 410000000, tickets: 135000, note: 'Mega year-end arenas' }
        ];
    }
  }, [timeframe]);

  // Totals & Peaks
  const totalRevenue = useMemo(
    () => seriesData.reduce((acc, d) => acc + d.revenue, 0),
    [seriesData]
  );
  const totalTickets = useMemo(
    () => seriesData.reduce((acc, d) => acc + d.tickets, 0),
    [seriesData]
  );

  const peakRevItem = useMemo(() => {
    return [...seriesData].sort((a, b) => b.revenue - a.revenue)[0];
  }, [seriesData]);

  const peakTixItem = useMemo(() => {
    return [...seriesData].sort((a, b) => b.tickets - a.tickets)[0];
  }, [seriesData]);

  const maxRevenue = Math.max(...seriesData.map((d) => d.revenue), 1) * 1.15;
  const maxTickets = Math.max(...seriesData.map((d) => d.tickets), 1) * 1.15;

  const revTicks = [1.0, 0.75, 0.5, 0.25, 0].map((ratio) => maxRevenue * ratio);
  const tixTicks = [1.0, 0.75, 0.5, 0.25, 0].map((ratio) => maxTickets * ratio);

  // Short formatters
  const formatShortRev = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(0)}L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(0)}k`;
    return `₹${Math.round(val)}`;
  };

  const formatShortTix = (val: number) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${(val / 1000).toFixed(1)}k`;
    return Math.round(val).toString();
  };

  return (
    <div className="flex flex-col xl:flex-row gap-5 w-full">
      {/* ============================================================ */}
      {/* CHART 1: Box Office Revenue Velocity                          */}
      {/* ============================================================ */}
      <div className="flex-1 min-w-0 rounded-xl border border-slate-200/90 bg-white p-5 shadow-2xs space-y-4 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100/80">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold tracking-tight text-slate-900">
                  Box Office Revenue Velocity
                </h3>
                <p className="text-[11px] text-slate-500">
                  Gross ticketing revenue inflow across intervals
                </p>
              </div>
            </div>

            {/* Timeframe selector */}
            <div className="flex items-center p-0.5 bg-slate-100/90 rounded-lg text-xs font-medium text-slate-600 border border-slate-200/60 shrink-0">
              {(['7D', '30D', '90D', '12M'] as Timeframe[]).map((tf) => (
                <button
                  key={tf}
                  type="button"
                  onClick={() => onTimeframeChange(tf)}
                  className={`px-2 py-0.5 rounded-md transition-all cursor-pointer text-[11px] ${timeframe === tf
                    ? 'bg-white text-purple-700 font-bold shadow-2xs'
                    : 'hover:text-slate-900'
                    }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Stat Pill */}
          {/* <div className="flex items-center justify-between mt-3 px-3 py-2 rounded-lg bg-purple-50/50 border border-purple-100/70 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-500 font-medium">Total Gross:</span>
              <span className="font-bold text-slate-900">{formatCurrency(totalRevenue)}</span>
              <span className="inline-flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200/60">
                <ArrowUpRight className="h-2.5 w-2.5" />
                +18.4%
              </span>
            </div>
            <div className="text-[11px] text-slate-500">
              Peak: <strong className="text-purple-700 font-semibold">{peakRevItem?.label} ({formatShortRev(peakRevItem?.revenue || 0)})</strong>
            </div>
          </div> */}
        </div>

        {/* Plot Area with Dedicated HTML Y-Axis and Columns */}
        <div className="relative pt-2">
          <div className="relative h-[210px] flex">
            {/* Y-Axis Column (Fixed, never overlapped) */}
            <div className="flex flex-col justify-between h-full pr-3 text-right select-none w-14 shrink-0">
              {revTicks.map((val, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-medium text-slate-400 leading-none tabular-nums"
                >
                  {formatShortRev(val)}
                </span>
              ))}
            </div>

            {/* Plot Surface */}
            <div className="relative flex-1 h-full border-b border-slate-200">
              {/* Horizontal Gridlines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {revTicks.map((_, idx) => (
                  <div key={idx} className="w-full border-b border-dashed border-slate-100" />
                ))}
              </div>

              {/* Data Columns */}
              <div className="absolute inset-0 flex items-end justify-around px-2">
                {seriesData.map((d, i) => {
                  const isHovered = hoveredRevIndex === i;
                  const pct = Math.min(100, Math.max(6, Math.round((d.revenue / maxRevenue) * 100)));

                  return (
                    <div
                      key={i}
                      onMouseEnter={() => setHoveredRevIndex(i)}
                      onMouseLeave={() => setHoveredRevIndex(null)}
                      className="relative flex flex-col items-center h-full justify-end group cursor-pointer"
                      style={{ width: `${100 / (seriesData.length + 1)}%`, maxWidth: '44px' }}
                    >
                      {/* Floating Tooltip */}
                      {isHovered && (
                        <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 z-40 whitespace-nowrap rounded-xl bg-slate-900/95 text-white px-3 py-2 shadow-xl backdrop-blur-sm border border-slate-800">
                          <div className="text-[11px] font-bold text-white flex items-center gap-1.5">
                            <span>{d.label}</span>
                            <span className="text-[9px] font-medium text-purple-300 uppercase tracking-wide">
                              • {d.note}
                            </span>
                          </div>
                          <div className="text-xs font-extrabold text-purple-400 mt-0.5 tabular-nums">
                            {formatCurrency(d.revenue)}
                          </div>
                          <div className="text-[10px] text-slate-300 tabular-nums">
                            {d.tickets.toLocaleString()} passes confirmed
                          </div>
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                        </div>
                      )}

                      {/* Value atop bar */}
                      <span
                        className={`text-[10px] font-semibold mb-1 transition-all tabular-nums ${isHovered ? 'text-purple-700 font-bold scale-105' : 'text-slate-500'
                          }`}
                      >
                        {formatShortRev(d.revenue)}
                      </span>

                      {/* Column Bar with Track */}
                      <div className="w-full h-[155px] flex flex-col justify-end rounded-t-lg bg-slate-100/90 overflow-hidden relative shadow-inner">
                        <div
                          className={`w-full rounded-t-lg transition-all duration-300 bg-gradient-to-t ${isHovered
                            ? 'from-purple-700 via-purple-600 to-indigo-600 shadow-sm ring-1 ring-purple-300'
                            : 'from-purple-600 via-purple-500 to-indigo-500'
                            }`}
                          style={{ height: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* X-Axis Labels */}
          <div className="flex justify-around pl-14 pt-2">
            {seriesData.map((d, i) => (
              <span
                key={i}
                className={`text-[11px] font-medium transition-colors text-center ${hoveredRevIndex === i ? 'text-purple-700 font-bold' : 'text-slate-500'
                  }`}
                style={{ width: `${100 / (seriesData.length + 1)}%`, maxWidth: '44px' }}
              >
                {d.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* CHART 2: Tickets & Admissions Volume                         */}
      {/* ============================================================ */}
      <div className="flex-1 min-w-0 rounded-xl border border-slate-200/90 bg-white p-5 shadow-2xs space-y-4 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100/80">
                <BarChart3 className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold tracking-tight text-slate-900">
                  Tickets & Admissions Volume
                </h3>
                <p className="text-[11px] text-slate-500">
                  Passes cleared & gate ticket checkout volume
                </p>
              </div>
            </div>

            {/* Timeframe selector */}
            <div className="flex items-center p-0.5 bg-slate-100/90 rounded-lg text-xs font-medium text-slate-600 border border-slate-200/60 shrink-0">
              {(['7D', '30D', '90D', '12M'] as Timeframe[]).map((tf) => (
                <button
                  key={tf}
                  type="button"
                  onClick={() => onTimeframeChange(tf)}
                  className={`px-2 py-0.5 rounded-md transition-all cursor-pointer text-[11px] ${timeframe === tf
                    ? 'bg-white text-indigo-700 font-bold shadow-2xs'
                    : 'hover:text-slate-900'
                    }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Stat Pill */}
          {/* <div className="flex items-center justify-between mt-3 px-3 py-2 rounded-lg bg-indigo-50/50 border border-indigo-100/70 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-500 font-medium">Total Passes:</span>
              <span className="font-bold text-slate-900">{totalTickets.toLocaleString()}</span>
              <span className="inline-flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200/60">
                <ArrowUpRight className="h-2.5 w-2.5" />
                +22.8%
              </span>
            </div>
            <div className="text-[11px] text-slate-500">
              Peak: <strong className="text-indigo-700 font-semibold">{peakTixItem?.label} ({(peakTixItem?.tickets || 0).toLocaleString()} tix)</strong>
            </div>
          </div> */}
        </div>

        {/* Plot Area with Dedicated HTML Y-Axis and Columns */}
        <div className="relative pt-2">
          <div className="relative h-[210px] flex">
            {/* Y-Axis Column (Fixed, never overlapped) */}
            <div className="flex flex-col justify-between h-full pr-3 text-right select-none w-14 shrink-0">
              {tixTicks.map((val, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-medium text-slate-400 leading-none tabular-nums"
                >
                  {formatShortTix(val)}
                </span>
              ))}
            </div>

            {/* Plot Surface */}
            <div className="relative flex-1 h-full border-b border-slate-200">
              {/* Horizontal Gridlines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {tixTicks.map((_, idx) => (
                  <div key={idx} className="w-full border-b border-dashed border-slate-100" />
                ))}
              </div>

              {/* Data Columns */}
              <div className="absolute inset-0 flex items-end justify-around px-2">
                {seriesData.map((d, i) => {
                  const isHovered = hoveredTixIndex === i;
                  const pct = Math.min(100, Math.max(6, Math.round((d.tickets / maxTickets) * 100)));

                  return (
                    <div
                      key={i}
                      onMouseEnter={() => setHoveredTixIndex(i)}
                      onMouseLeave={() => setHoveredTixIndex(null)}
                      className="relative flex flex-col items-center h-full justify-end group cursor-pointer"
                      style={{ width: `${100 / (seriesData.length + 1)}%`, maxWidth: '44px' }}
                    >
                      {/* Floating Tooltip */}
                      {isHovered && (
                        <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 z-40 whitespace-nowrap rounded-xl bg-slate-900/95 text-white px-3 py-2 shadow-xl backdrop-blur-sm border border-slate-800">
                          <div className="text-[11px] font-bold text-white flex items-center gap-1.5">
                            <span>{d.label}</span>
                            <span className="text-[9px] font-medium text-indigo-300 uppercase tracking-wide">
                              • {d.note}
                            </span>
                          </div>
                          <div className="text-xs font-extrabold text-indigo-400 mt-0.5 tabular-nums">
                            {d.tickets.toLocaleString()} passes
                          </div>
                          <div className="text-[10px] text-slate-300 tabular-nums">
                            Gross: {formatCurrency(d.revenue)}
                          </div>
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                        </div>
                      )}

                      {/* Value atop bar */}
                      <span
                        className={`text-[10px] font-semibold mb-1 transition-all tabular-nums ${isHovered ? 'text-indigo-700 font-bold scale-105' : 'text-slate-500'
                          }`}
                      >
                        {formatShortTix(d.tickets)}
                      </span>

                      {/* Column Bar with Track */}
                      <div className="w-full h-[155px] flex flex-col justify-end rounded-t-lg bg-slate-100/90 overflow-hidden relative shadow-inner">
                        <div
                          className={`w-full rounded-t-lg transition-all duration-300 bg-gradient-to-t ${isHovered
                            ? 'from-indigo-700 via-indigo-600 to-sky-600 shadow-sm ring-1 ring-indigo-300'
                            : 'from-indigo-600 via-indigo-500 to-sky-500'
                            }`}
                          style={{ height: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* X-Axis Labels */}
          <div className="flex justify-around pl-14 pt-2">
            {seriesData.map((d, i) => (
              <span
                key={i}
                className={`text-[11px] font-medium transition-colors text-center ${hoveredTixIndex === i ? 'text-indigo-700 font-bold' : 'text-slate-500'
                  }`}
                style={{ width: `${100 / (seriesData.length + 1)}%`, maxWidth: '44px' }}
              >
                {d.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
