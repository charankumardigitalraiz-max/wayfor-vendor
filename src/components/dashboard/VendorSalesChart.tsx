import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  BarChart3,
  PieChart,
  MapPin
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
  concerts,
  timeframe,
  onTimeframeChange,
  formatCurrency
}) => {
  const [hoveredRevIndex, setHoveredRevIndex] = useState<number | null>(null);
  const [hoveredTixIndex, setHoveredTixIndex] = useState<number | null>(null);
  const [hoveredTierIndex, setHoveredTierIndex] = useState<number | null>(null);

  // Timeframe series data
  const seriesData = useMemo(() => {
    switch (timeframe) {
      case '7D':
        return [
          { label: 'Mon', revenue: 1450000, tickets: 480 },
          { label: 'Tue', revenue: 2100000, tickets: 690 },
          { label: 'Wed', revenue: 3800000, tickets: 1250 },
          { label: 'Thu', revenue: 4900000, tickets: 1600 },
          { label: 'Fri', revenue: 8200000, tickets: 2750 },
          { label: 'Sat', revenue: 12500000, tickets: 4100 },
          { label: 'Sun', revenue: 9800000, tickets: 3200 }
        ];
      case '30D':
        return [
          { label: 'Week 1', revenue: 28500000, tickets: 9400 },
          { label: 'Week 2', revenue: 42000000, tickets: 14100 },
          { label: 'Week 3', revenue: 68500000, tickets: 22800 },
          { label: 'Week 4', revenue: 95400000, tickets: 31200 }
        ];
      case '90D':
        return [
          { label: 'Month 1', revenue: 110000000, tickets: 38000 },
          { label: 'Month 2', revenue: 185000000, tickets: 62000 },
          { label: 'Month 3', revenue: 245000000, tickets: 82000 }
        ];
      case '12M':
        return [
          { label: 'Q1', revenue: 120000000, tickets: 42000 },
          { label: 'Q2', revenue: 195000000, tickets: 68000 },
          { label: 'Q3', revenue: 290000000, tickets: 95000 },
          { label: 'Q4', revenue: 410000000, tickets: 135000 }
        ];
    }
  }, [timeframe]);

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

  // Ticket Tier breakdown data
  const tierData = useMemo(() => {
    return [
      { name: 'Early Bird GA', percentage: 24, price: 1999, sold: 42000, color: '#8b5cf6' },
      { name: 'Phase 2 Standing', percentage: 44, price: 2999, sold: 76000, color: '#6366f1' },
      { name: 'VIP Front Pit', percentage: 22, price: 5499, sold: 38500, color: '#10b981' },
      { name: 'VVIP Lounge', percentage: 10, price: 8999, sold: 18000, color: '#f59e0b' }
    ];
  }, []);

  const donutRadius = 65;
  const donutCircumference = 2 * Math.PI * donutRadius;

  // Stadium venue capacity ranking
  const venueRankings = useMemo(() => {
    return concerts.slice(0, 4).map((c) => {
      const fillPct = Math.min(100, Math.round((c.ticketsSold / c.totalCapacity) * 100));
      return {
        id: c.id,
        name: c.venueName,
        city: c.city,
        fillPct,
        sold: c.ticketsSold,
        capacity: c.totalCapacity
      };
    });
  }, [concerts]);

  return (
    <div className="space-y-5 w-full">
      {/* ---------------------------------------------------------------- */}
      {/* ROW 1: Revenue Velocity & Ticket Admissions                      */}
      {/* ---------------------------------------------------------------- */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 w-full">
        {/* Chart 1: Box Office Revenue */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold tracking-tight text-slate-900">
                  Box Office Revenue Velocity
                </h3>
                <p className="text-[11px] text-slate-500">Gross ticketing revenue inflow</p>
              </div>
            </div>

            {/* Timeframe selector */}
            <div className="flex items-center p-0.5 bg-slate-100 rounded-lg text-xs font-semibold text-slate-600 border border-slate-200/60">
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

          {/* Plot Area */}
          <div className="relative pt-2">
            <div className="relative h-[200px] flex">
              {/* Y-Axis */}
              <div className="flex flex-col justify-between h-full pr-3 text-right select-none w-14 shrink-0">
                {revTicks.map((val, idx) => (
                  <span key={idx} className="text-[10px] font-medium text-slate-400 leading-none tabular-nums">
                    {formatShortRev(val)}
                  </span>
                ))}
              </div>

              {/* Surface */}
              <div className="relative flex-1 h-full border-b border-slate-200">
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  {revTicks.map((_, idx) => (
                    <div key={idx} className="w-full border-b border-dashed border-slate-100" />
                  ))}
                </div>

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
                        {isHovered && (
                          <div className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 z-40 whitespace-nowrap rounded-lg bg-slate-900 text-white px-2.5 py-1.5 shadow-lg text-center">
                            <div className="text-[10px] font-bold text-purple-300">{d.label}</div>
                            <div className="text-xs font-extrabold text-white">{formatCurrency(d.revenue)}</div>
                          </div>
                        )}

                        <span className={`text-[10px] font-semibold mb-1 tabular-nums ${isHovered ? 'text-purple-700 font-bold' : 'text-slate-400'}`}>
                          {formatShortRev(d.revenue)}
                        </span>

                        <div className="w-full h-[145px] flex flex-col justify-end rounded-t-lg bg-slate-100 overflow-hidden">
                          <div
                            className={`w-full rounded-t-lg transition-all duration-300 bg-gradient-to-t ${isHovered
                              ? 'from-purple-700 to-indigo-600'
                              : 'from-purple-600 to-indigo-500'
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

            {/* X-Axis */}
            <div className="flex justify-around pl-14 pt-2">
              {seriesData.map((d, i) => (
                <span
                  key={i}
                  className={`text-[11px] font-medium text-center ${hoveredRevIndex === i ? 'text-purple-700 font-bold' : 'text-slate-500'}`}
                  style={{ width: `${100 / (seriesData.length + 1)}%`, maxWidth: '44px' }}
                >
                  {d.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Chart 2: Tickets Admissions Volume */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
                <BarChart3 className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold tracking-tight text-slate-900">
                  Tickets & Admissions Volume
                </h3>
                <p className="text-[11px] text-slate-500">Confirmed concert attendee admissions</p>
              </div>
            </div>

            {/* Timeframe selector */}
            <div className="flex items-center p-0.5 bg-slate-100 rounded-lg text-xs font-semibold text-slate-600 border border-slate-200/60">
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

          {/* Plot Area */}
          <div className="relative pt-2">
            <div className="relative h-[200px] flex">
              {/* Y-Axis */}
              <div className="flex flex-col justify-between h-full pr-3 text-right select-none w-14 shrink-0">
                {tixTicks.map((val, idx) => (
                  <span key={idx} className="text-[10px] font-medium text-slate-400 leading-none tabular-nums">
                    {formatShortTix(val)}
                  </span>
                ))}
              </div>

              {/* Surface */}
              <div className="relative flex-1 h-full border-b border-slate-200">
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  {tixTicks.map((_, idx) => (
                    <div key={idx} className="w-full border-b border-dashed border-slate-100" />
                  ))}
                </div>

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
                        {isHovered && (
                          <div className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 z-40 whitespace-nowrap rounded-lg bg-slate-900 text-white px-2.5 py-1.5 shadow-lg text-center">
                            <div className="text-[10px] font-bold text-indigo-300">{d.label}</div>
                            <div className="text-xs font-extrabold text-white">{d.tickets.toLocaleString()} passes</div>
                          </div>
                        )}

                        <span className={`text-[10px] font-semibold mb-1 tabular-nums ${isHovered ? 'text-indigo-700 font-bold' : 'text-slate-400'}`}>
                          {formatShortTix(d.tickets)}
                        </span>

                        <div className="w-full h-[145px] flex flex-col justify-end rounded-t-lg bg-slate-100 overflow-hidden">
                          <div
                            className={`w-full rounded-t-lg transition-all duration-300 bg-gradient-to-t ${isHovered
                              ? 'from-indigo-700 to-sky-600'
                              : 'from-indigo-600 to-sky-500'
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

            {/* X-Axis */}
            <div className="flex justify-around pl-14 pt-2">
              {seriesData.map((d, i) => (
                <span
                  key={i}
                  className={`text-[11px] font-medium text-center ${hoveredTixIndex === i ? 'text-indigo-700 font-bold' : 'text-slate-500'}`}
                  style={{ width: `${100 / (seriesData.length + 1)}%`, maxWidth: '44px' }}
                >
                  {d.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* ROW 2: Ticket Tier Donut & Stadium Capacity Fill                */}
      {/* ---------------------------------------------------------------- */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 w-full">
        {/* Chart 3: Ticket Tier Distribution Donut */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
                <PieChart className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold tracking-tight text-slate-900">
                  Ticket Tier Absorption
                </h3>
                <p className="text-[11px] text-slate-500">Pass volume distribution by tier category</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200/70">
              4 Categories
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 pt-2">
            {/* SVG Donut */}
            <div className="relative shrink-0 flex items-center justify-center">
              <svg className="w-38 h-38 -rotate-90" viewBox="0 0 170 170">
                <circle cx="85" cy="85" r={donutRadius} fill="none" stroke="#f1f5f9" strokeWidth="18" />
                {(() => {
                  let offset = 0;
                  return tierData.map((tier, idx) => {
                    const len = (tier.percentage / 100) * donutCircumference;
                    const curOffset = offset;
                    offset += len;
                    const isHovered = hoveredTierIndex === idx;

                    return (
                      <circle
                        key={tier.name}
                        cx="85"
                        cy="85"
                        r={donutRadius}
                        fill="none"
                        stroke={tier.color}
                        strokeWidth={isHovered ? 22 : 18}
                        strokeDasharray={`${len} ${donutCircumference - len}`}
                        strokeDashoffset={-curOffset}
                        className="transition-all duration-200 cursor-pointer"
                        onMouseEnter={() => setHoveredTierIndex(idx)}
                        onMouseLeave={() => setHoveredTierIndex(null)}
                      />
                    );
                  });
                })()}
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                {hoveredTierIndex !== null ? (
                  <>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase">
                      {tierData[hoveredTierIndex].name.split(' ')[0]}
                    </span>
                    <span className="text-base font-extrabold text-slate-900">
                      {tierData[hoveredTierIndex].percentage}%
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase">Total</span>
                    <span className="text-base font-extrabold text-slate-900">100%</span>
                  </>
                )}
              </div>
            </div>

            {/* Legend List */}
            <div className="flex-1 space-y-2 w-full">
              {tierData.map((tier, idx) => {
                const isHovered = hoveredTierIndex === idx;
                return (
                  <div
                    key={tier.name}
                    onMouseEnter={() => setHoveredTierIndex(idx)}
                    onMouseLeave={() => setHoveredTierIndex(null)}
                    className={`flex items-center justify-between p-2 rounded-lg border text-xs transition-colors cursor-pointer ${isHovered ? 'bg-purple-50/60 border-purple-200' : 'bg-slate-50/50 border-slate-100'
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: tier.color }} />
                      <span className="font-semibold text-slate-800">{tier.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400 font-mono">₹{tier.price.toLocaleString()}</span>
                      <span className="font-bold text-slate-900">{tier.percentage}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Chart 4: Stadium Tour Capacity Saturation */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                <MapPin className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold tracking-tight text-slate-900">
                  Arena & Stadium Fill Saturation
                </h3>
                <p className="text-[11px] text-slate-500">Live occupancy across tour stops</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/70">
              Live Tours
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {venueRankings.slice(0, 2).map((v) => (
              <div key={v.id} className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/40 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900 truncate max-w-[180px]">{v.name}</span>
                    <span className="text-[10px] text-slate-400">({v.city})</span>
                  </div>
                  <span className="font-extrabold text-slate-900">{v.fillPct}%</span>
                </div>

                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-purple-600 to-indigo-600"
                    style={{ width: `${v.fillPct}%` }}
                  />
                </div>

                <div className="flex justify-between font-semibold text-[10px] text-slate-700">
                  <span>{v.sold.toLocaleString()} passes sold</span>
                  <span>{v.capacity.toLocaleString()} arena capacity</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
