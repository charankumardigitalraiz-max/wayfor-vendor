import React, { useState, useEffect, useMemo } from 'react';
import {
  TrendingUp,
  LineChart as LineIcon,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import type { ConcertEvent, TripPlan, StrangerMeet } from '../../types';

export type Timeframe = '7D' | '30D' | '90D' | '12M';
export type MetricMode = 'revenue' | 'volume';
export type ChartStyle = 'stacked' | 'lines';
export type ModuleFilter = 'all' | 'concerts' | 'trips' | 'stranger-meets';

export interface MultiModuleTrendChartProps {
  concerts?: ConcertEvent[];
  trips?: TripPlan[];
  strangerMeets?: StrangerMeet[];
  assignedModules?: string[];
  timeframe?: Timeframe;
  onTimeframeChange?: (tf: Timeframe) => void;
  formatCurrency?: (val: number) => string;
}

export const MultiModuleTrendChart: React.FC<MultiModuleTrendChartProps> = ({
  concerts = [],
  trips = [],
  strangerMeets = [],
  assignedModules = ['concerts', 'trips', 'stranger-meets'],
  timeframe: controlledTimeframe,
  onTimeframeChange,
  formatCurrency: customFormatCurrency
}) => {
  const [internalTimeframe, setInternalTimeframe] = useState<Timeframe>('30D');
  const [metricMode, setMetricMode] = useState<MetricMode>('revenue');
  const [chartStyle, setChartStyle] = useState<ChartStyle>('stacked');
  const [activeFilter, setActiveFilter] = useState<ModuleFilter>('all');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [animProgress, setAnimProgress] = useState(0);

  useEffect(() => {
    setAnimProgress(0);
    const timer = setTimeout(() => setAnimProgress(1), 60);
    return () => clearTimeout(timer);
  }, [controlledTimeframe, internalTimeframe, metricMode, activeFilter, chartStyle]);

  const timeframe = controlledTimeframe || internalTimeframe;
  const handleTimeframeChange = (tf: Timeframe) => {
    if (onTimeframeChange) onTimeframeChange(tf);
    else setInternalTimeframe(tf);
  };

  const formatCurrency = customFormatCurrency || ((val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)} Lakh`;
    return `₹${val.toLocaleString()}`;
  });

  const hasConcerts = assignedModules.includes('concerts');
  const hasTrips = assignedModules.includes('trips');
  const hasMeets = assignedModules.includes('stranger-meets');

  // 1. Calculate Real Totals directly from incoming props
  const realConcertsRev = useMemo(() => {
    return concerts.reduce((acc, c) => acc + (c.ticketsSold * ((c.minPrice + c.maxPrice) / 2)), 0);
  }, [concerts]);

  const realTripsRev = useMemo(() => {
    return trips.reduce((acc, t) => acc + ((t.joinedTravelers?.length || 0) * (t.estimatedBudget || 0)), 0);
  }, [trips]);

  const realMeetsRev = useMemo(() => {
    return strangerMeets.reduce((acc, m) => acc + ((m.participants?.length || 0) * (m.pricePerPerson || 0)), 0);
  }, [strangerMeets]);

  const realConcertsVol = useMemo(() => {
    return concerts.reduce((acc, c) => acc + (c.ticketsSold || 0), 0);
  }, [concerts]);

  const realTripsVol = useMemo(() => {
    return trips.reduce((acc, t) => acc + (t.joinedTravelers?.length || 0), 0);
  }, [trips]);

  const realMeetsVol = useMemo(() => {
    return strangerMeets.reduce((acc, m) => acc + (m.participants?.length || 0), 0);
  }, [strangerMeets]);

  // Dynamic Subtitles directly from data items
  const concertsSubtext = useMemo(() => {
    const list = concerts.map(c => c.artist || c.title).filter(Boolean);
    return list.slice(0, 3).join(' • ') || `${concerts.length} live events`;
  }, [concerts]);

  const tripsSubtext = useMemo(() => {
    const list = trips.map(t => `${t.origin} ➔ ${t.destination}`).filter(Boolean);
    return list.slice(0, 2).join(' • ') || `${trips.length} travel packages`;
  }, [trips]);

  const meetsSubtext = useMemo(() => {
    const list = strangerMeets.map(m => `${m.title} (${m.city})`).filter(Boolean);
    return list.slice(0, 2).join(' • ') || `${strangerMeets.length} social meets`;
  }, [strangerMeets]);

  // Normalized weight curves to distribute actual totals across timeline periods
  const seriesData = useMemo(() => {
    const activeConcertsTotal = metricMode === 'revenue' ? realConcertsRev : realConcertsVol;
    const activeTripsTotal = metricMode === 'revenue' ? realTripsRev : realTripsVol;
    const activeMeetsTotal = metricMode === 'revenue' ? realMeetsRev : realMeetsVol;

    let periods: { label: string; fullDate: string; cWeight: number; tWeight: number; mWeight: number }[] = [];

    switch (timeframe) {
      case '7D': {
        const rawWeights = [
          { label: 'Mon', fullDate: 'Oct 23', c: 0.08, t: 0.07, m: 0.06 },
          { label: 'Tue', fullDate: 'Oct 24', c: 0.10, t: 0.09, m: 0.09 },
          { label: 'Wed', fullDate: 'Oct 25', c: 0.12, t: 0.11, m: 0.12 },
          { label: 'Thu', fullDate: 'Oct 26', c: 0.15, t: 0.16, m: 0.15 },
          { label: 'Fri', fullDate: 'Oct 27 (Peak)', c: 0.24, t: 0.25, m: 0.28 },
          { label: 'Sat', fullDate: 'Oct 28 (Weekend)', c: 0.20, t: 0.21, m: 0.20 },
          { label: 'Sun', fullDate: 'Oct 29 (Today)', c: 0.11, t: 0.11, m: 0.10 }
        ];
        periods = rawWeights.map(w => ({ label: w.label, fullDate: w.fullDate, cWeight: w.c, tWeight: w.t, mWeight: w.m }));
        break;
      }
      case '90D': {
        const rawWeights = [
          { label: 'Aug W1', fullDate: 'Aug 1-7', c: 0.08, t: 0.08, m: 0.07 },
          { label: 'Aug W3', fullDate: 'Aug 15-21', c: 0.09, t: 0.09, m: 0.09 },
          { label: 'Sep W1', fullDate: 'Sep 1-7', c: 0.10, t: 0.10, m: 0.10 },
          { label: 'Sep W3', fullDate: 'Sep 15-21', c: 0.12, t: 0.13, m: 0.12 },
          { label: 'Sep W4', fullDate: 'Sep 22-28', c: 0.14, t: 0.14, m: 0.15 },
          { label: 'Oct W1', fullDate: 'Oct 1-7', c: 0.14, t: 0.15, m: 0.14 },
          { label: 'Oct W2', fullDate: 'Oct 8-14', c: 0.16, t: 0.15, m: 0.16 },
          { label: 'Oct W4', fullDate: 'Oct 22-29', c: 0.17, t: 0.16, m: 0.17 }
        ];
        periods = rawWeights.map(w => ({ label: w.label, fullDate: w.fullDate, cWeight: w.c, tWeight: w.t, mWeight: w.m }));
        break;
      }
      case '12M': {
        const rawWeights = [
          { label: 'Nov', fullDate: 'Nov 2025', c: 0.05, t: 0.05, m: 0.05 },
          { label: 'Dec', fullDate: 'Dec 2025', c: 0.06, t: 0.06, m: 0.06 },
          { label: 'Jan', fullDate: 'Jan 2026', c: 0.06, t: 0.06, m: 0.06 },
          { label: 'Feb', fullDate: 'Feb 2026', c: 0.07, t: 0.07, m: 0.07 },
          { label: 'Mar', fullDate: 'Mar 2026', c: 0.08, t: 0.08, m: 0.08 },
          { label: 'Apr', fullDate: 'Apr 2026', c: 0.08, t: 0.08, m: 0.08 },
          { label: 'May', fullDate: 'May 2026', c: 0.09, t: 0.09, m: 0.09 },
          { label: 'Jun', fullDate: 'Jun 2026', c: 0.09, t: 0.09, m: 0.09 },
          { label: 'Jul', fullDate: 'Jul 2026', c: 0.10, t: 0.10, m: 0.10 },
          { label: 'Aug', fullDate: 'Aug 2026', c: 0.10, t: 0.10, m: 0.10 },
          { label: 'Sep', fullDate: 'Sep 2026', c: 0.11, t: 0.11, m: 0.11 },
          { label: 'Oct', fullDate: 'Oct 2026', c: 0.11, t: 0.11, m: 0.11 }
        ];
        periods = rawWeights.map(w => ({ label: w.label, fullDate: w.fullDate, cWeight: w.c, tWeight: w.t, mWeight: w.m }));
        break;
      }
      case '30D':
      default: {
        const rawWeights = [
          { label: 'Oct 1', fullDate: 'Oct 1, 2026', c: 0.08, t: 0.08, m: 0.08 },
          { label: 'Oct 5', fullDate: 'Oct 5, 2026', c: 0.10, t: 0.10, m: 0.10 },
          { label: 'Oct 9', fullDate: 'Oct 9, 2026', c: 0.09, t: 0.09, m: 0.09 },
          { label: 'Oct 13', fullDate: 'Oct 13, 2026', c: 0.12, t: 0.12, m: 0.13 },
          { label: 'Oct 17', fullDate: 'Oct 17, 2026', c: 0.15, t: 0.16, m: 0.15 },
          { label: 'Oct 21', fullDate: 'Oct 21, 2026', c: 0.13, t: 0.14, m: 0.13 },
          { label: 'Oct 25', fullDate: 'Oct 25, 2026', c: 0.16, t: 0.15, m: 0.16 },
          { label: 'Oct 29', fullDate: 'Oct 29, 2026', c: 0.17, t: 0.16, m: 0.16 }
        ];
        periods = rawWeights.map(w => ({ label: w.label, fullDate: w.fullDate, cWeight: w.c, tWeight: w.t, mWeight: w.m }));
        break;
      }
    }

    return periods.map(p => {
      const c = hasConcerts ? Math.round(activeConcertsTotal * p.cWeight) : 0;
      const t = hasTrips ? Math.round(activeTripsTotal * p.tWeight) : 0;
      const m = hasMeets ? Math.round(activeMeetsTotal * p.mWeight) : 0;
      return {
        label: p.label,
        fullDate: p.fullDate,
        concerts: c,
        trips: t,
        meets: m,
        total: c + t + m
      };
    });
  }, [timeframe, metricMode, realConcertsRev, realTripsRev, realMeetsRev, realConcertsVol, realTripsVol, realMeetsVol, hasConcerts, hasTrips, hasMeets]);

  // Aggregated totals strictly calculated from series
  const aggregates = useMemo(() => {
    const cTot = seriesData.reduce((acc, d) => acc + d.concerts, 0);
    const tTot = seriesData.reduce((acc, d) => acc + d.trips, 0);
    const mTot = seriesData.reduce((acc, d) => acc + d.meets, 0);
    const tot = seriesData.reduce((acc, d) => acc + d.total, 0);

    return {
      concerts: cTot,
      trips: tTot,
      meets: mTot,
      total: tot
    };
  }, [seriesData]);

  // Active displayed headline stat
  const headlineStat = useMemo(() => {
    if (activeFilter === 'concerts') {
      return {
        label: 'Concerts & Arena Tours',
        value: metricMode === 'revenue' ? formatCurrency(aggregates.concerts) : `${aggregates.concerts.toLocaleString()} tickets`,
        subtext: concertsSubtext,
        colorClass: 'text-purple-600'
      };
    }
    if (activeFilter === 'trips') {
      return {
        label: 'Trip Planner & Expeditions',
        value: metricMode === 'revenue' ? formatCurrency(aggregates.trips) : `${aggregates.trips.toLocaleString()} travelers`,
        subtext: tripsSubtext,
        colorClass: 'text-amber-600'
      };
    }
    if (activeFilter === 'stranger-meets') {
      return {
        label: 'Stranger Meets & Socials',
        value: metricMode === 'revenue' ? formatCurrency(aggregates.meets) : `${aggregates.meets.toLocaleString()} buddies`,
        subtext: meetsSubtext,
        colorClass: 'text-teal-600'
      };
    }
    return {
      label: 'All Authorized Verticals Combined',
      value: metricMode === 'revenue' ? formatCurrency(aggregates.total) : `${aggregates.total.toLocaleString()} total admissions`,
      subtext: `${assignedModules.length} operational lines synchronized`,
      colorClass: 'text-slate-900'
    };
  }, [activeFilter, metricMode, aggregates, formatCurrency, concertsSubtext, tripsSubtext, meetsSubtext, assignedModules.length]);

  // SVG Geometry
  const chartWidth = 900;
  const chartHeight = 250;
  const paddingLeft = 68;
  const paddingRight = 24;
  const paddingTop = 24;
  const paddingBottom = 34;

  const innerWidth = chartWidth - paddingLeft - paddingRight;
  const innerHeight = chartHeight - paddingTop - paddingBottom;

  const maxScale = useMemo(() => {
    let max = 0;
    seriesData.forEach((d) => {
      if (activeFilter !== 'all') {
        const val = activeFilter === 'concerts' ? d.concerts : activeFilter === 'trips' ? d.trips : d.meets;
        max = Math.max(max, val);
      } else if (chartStyle === 'stacked') {
        max = Math.max(max, d.total);
      } else {
        max = Math.max(max, d.concerts, d.trips, d.meets);
      }
    });
    return Math.max(max * 1.15, 100);
  }, [seriesData, chartStyle, activeFilter]);

  // Y-Axis Gridlines
  const gridSteps = 4;
  const gridLines = useMemo(() => {
    return Array.from({ length: gridSteps + 1 }).map((_, i) => {
      const ratio = i / gridSteps;
      const y = paddingTop + innerHeight - ratio * innerHeight;
      const val = ratio * maxScale;
      let label = '';
      if (metricMode === 'revenue') {
        if (val >= 10000000) label = `₹${(val / 10000000).toFixed(1)}Cr`;
        else if (val >= 100000) label = `₹${(val / 100000).toFixed(0)}L`;
        else if (val >= 1000) label = `₹${(val / 1000).toFixed(0)}k`;
        else label = `₹${Math.round(val)}`;
      } else {
        if (val >= 1000) label = `${(val / 1000).toFixed(1)}k`;
        else label = `${Math.round(val)}`;
      }
      return { y, label };
    });
  }, [maxScale, innerHeight, metricMode]);

  // Spline helper
  const createSpline = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return '';
    let path = `M ${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
    }
    return path;
  };

  const createStackedArea = (
    topPts: { x: number; y: number }[],
    botPts: { x: number; y: number }[]
  ) => {
    const topPath = createSpline(topPts);
    let botPath = '';
    for (let i = botPts.length - 1; i >= 0; i--) {
      botPath += ` L ${botPts[i].x.toFixed(1)},${botPts[i].y.toFixed(1)}`;
    }
    return `${topPath} ${botPath} Z`;
  };

  const chartGeometry = useMemo(() => {
    const len = seriesData.length;
    const getY = (val: number) => {
      const clamped = Math.min(Math.max(val / maxScale, 0), 1);
      const animatedRatio = clamped * animProgress;
      return paddingTop + innerHeight - animatedRatio * innerHeight;
    };

    const basePts = seriesData.map((_, i) => ({
      x: paddingLeft + (i / (len - 1)) * innerWidth,
      y: paddingTop + innerHeight
    }));

    if (chartStyle === 'stacked' && activeFilter === 'all') {
      const cPts = seriesData.map((d, i) => ({
        x: paddingLeft + (i / (len - 1)) * innerWidth,
        y: getY(d.concerts),
        val: d.concerts
      }));

      const tPts = seriesData.map((d, i) => ({
        x: paddingLeft + (i / (len - 1)) * innerWidth,
        y: getY(d.concerts + d.trips),
        val: d.trips
      }));

      const mPts = seriesData.map((d, i) => ({
        x: paddingLeft + (i / (len - 1)) * innerWidth,
        y: getY(d.total),
        val: d.meets
      }));

      return {
        isStacked: true,
        concertsPts: cPts,
        tripsPts: tPts,
        meetsPts: mPts,
        concertsArea: createStackedArea(cPts, basePts),
        tripsArea: createStackedArea(tPts, cPts),
        meetsArea: createStackedArea(mPts, tPts),
        topLine: createSpline(mPts)
      };
    } else {
      const cPts = seriesData.map((d, i) => ({
        x: paddingLeft + (i / (len - 1)) * innerWidth,
        y: getY(d.concerts),
        val: d.concerts
      }));

      const tPts = seriesData.map((d, i) => ({
        x: paddingLeft + (i / (len - 1)) * innerWidth,
        y: getY(d.trips),
        val: d.trips
      }));

      const mPts = seriesData.map((d, i) => ({
        x: paddingLeft + (i / (len - 1)) * innerWidth,
        y: getY(d.meets),
        val: d.meets
      }));

      const totPts = seriesData.map((d, i) => ({
        x: paddingLeft + (i / (len - 1)) * innerWidth,
        y: getY(d.total),
        val: d.total
      }));

      const makeArea = (pts: { x: number; y: number }[]) => {
        return `${createSpline(pts)} L ${pts[pts.length - 1].x},${paddingTop + innerHeight} L ${pts[0].x},${paddingTop + innerHeight} Z`;
      };

      return {
        isStacked: false,
        concertsPts: cPts,
        tripsPts: tPts,
        meetsPts: mPts,
        totPts,
        concertsPath: createSpline(cPts),
        tripsPath: createSpline(tPts),
        meetsPath: createSpline(mPts),
        totPath: createSpline(totPts),
        concertsArea: makeArea(cPts),
        tripsArea: makeArea(tPts),
        meetsArea: makeArea(mPts),
        totArea: makeArea(totPts)
      };
    }
  }, [seriesData, maxScale, chartStyle, activeFilter, innerWidth, innerHeight, animProgress]);

  const activePoint = hoveredIndex !== null ? seriesData[hoveredIndex] : null;

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-2xs space-y-4">
      {/* 1. Executive Headline & Global Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            {headlineStat.label}
          </span>
          <div className="flex items-baseline gap-3 mt-0.5">
            <h2 className={`text-2xl font-semibold tracking-tight transition-colors duration-200 ${headlineStat.colorClass}`}>
              {headlineStat.value}
            </h2>
          </div>
          {/* <p className="text-xs text-slate-500 mt-0.5 truncate max-w-xl">
            {headlineStat.subtext}
          </p> */}
        </div>

        {/* Right Action Switchers */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Revenue vs Volume Switcher */}
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
            <button
              type="button"
              onClick={() => setMetricMode('revenue')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${metricMode === 'revenue'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
                }`}
            >
              Revenue (₹)
            </button>
            <button
              type="button"
              onClick={() => setMetricMode('volume')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${metricMode === 'volume'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
                }`}
            >
              Admissions
            </button>
          </div>

          {/* Chart Style Switcher */}
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
            <button
              type="button"
              onClick={() => setChartStyle('stacked')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${chartStyle === 'stacked'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
                }`}
              title="Stacked Layer Wave showing total cumulative contribution"
            >
              <Layers className="h-3 w-3" />
              <span>Stacked Wave</span>
            </button>
            <button
              type="button"
              onClick={() => setChartStyle('lines')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${chartStyle === 'lines'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
                }`}
              title="Overlapping Comparative Trajectories"
            >
              <LineIcon className="h-3 w-3" />
              <span>Lines</span>
            </button>
          </div>

          {/* Timeframe Selector */}
          {/* <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
            {(['7D', '30D', '90D', '12M'] as Timeframe[]).map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => handleTimeframeChange(tf)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${timeframe === tf
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                  }`}
              >
                {tf}
              </button>
            ))}
          </div> */}
        </div>
      </div>

      {/* 2. Interactive Module Legend & Filter Chips */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${activeFilter === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
          >
            All Assigned Lines
          </button>

          {hasConcerts && (
            <button
              type="button"
              onClick={() => setActiveFilter('concerts')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${activeFilter === 'concerts'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
                }`}
            >
              <span className="h-2 w-2 rounded-full bg-purple-600" />
              <span>Concerts & Events ({concerts.length})</span>
            </button>
          )}

          {hasTrips && (
            <button
              type="button"
              onClick={() => setActiveFilter('trips')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${activeFilter === 'trips'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                }`}
            >
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <span>Trip Planner ({trips.length})</span>
            </button>
          )}

          {hasMeets && (
            <button
              type="button"
              onClick={() => setActiveFilter('stranger-meets')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${activeFilter === 'stranger-meets'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200'
                }`}
            >
              <span className="h-2 w-2 rounded-full bg-teal-500" />
              <span>Stranger Meets ({strangerMeets.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. SVG High-Fidelity Canvas */}
      <div className="relative w-full overflow-hidden pt-2">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto overflow-visible select-none"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <defs>
            <linearGradient id="multiConcertGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="multiTripGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="multiMeetGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="multiTotalGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366F1" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#6366F1" stopOpacity="0.02" />
            </linearGradient>
            <filter id="waveDotGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#4F46E5" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Horizontal Gridlines */}
          {gridLines.map((line, i) => (
            <g key={i}>
              <line
                x1={paddingLeft}
                y1={line.y}
                x2={chartWidth - paddingRight}
                y2={line.y}
                stroke="#F1F5F9"
                strokeDasharray={i === 0 ? undefined : '3 3'}
                strokeWidth="1"
              />
              <text
                x={paddingLeft - 10}
                y={line.y + 3.5}
                textAnchor="end"
                fontSize="10.5"
                fill="#94A3B8"
                fontWeight="500"
                fontFamily="Inter, sans-serif"
              >
                {line.label}
              </text>
            </g>
          ))}

          {/* Chart Curves */}
          {chartGeometry.isStacked ? (
            <>
              {hasConcerts && (
                <path
                  d={chartGeometry.concertsArea}
                  fill="url(#multiConcertGrad)"
                  stroke="#8B5CF6"
                  strokeWidth="2.5"
                  className="transition-all duration-300"
                />
              )}
              {hasTrips && (
                <path
                  d={chartGeometry.tripsArea}
                  fill="url(#multiTripGrad)"
                  stroke="#F59E0B"
                  strokeWidth="2"
                  className="transition-all duration-300"
                />
              )}
              {hasMeets && (
                <path
                  d={chartGeometry.meetsArea}
                  fill="url(#multiMeetGrad)"
                  stroke="#10B981"
                  strokeWidth="2"
                  className="transition-all duration-300"
                />
              )}
            </>
          ) : (
            <>
              {activeFilter === 'all' && (
                <path
                  d={chartGeometry.totPath}
                  fill="none"
                  stroke="#6366F1"
                  strokeWidth="3"
                  strokeDasharray="4 4"
                />
              )}
              {(activeFilter === 'all' || activeFilter === 'concerts') && hasConcerts && (
                <>
                  <path d={chartGeometry.concertsArea} fill="url(#multiConcertGrad)" opacity="0.3" />
                  <path d={chartGeometry.concertsPath} fill="none" stroke="#8B5CF6" strokeWidth="2.5" />
                </>
              )}
              {(activeFilter === 'all' || activeFilter === 'trips') && hasTrips && (
                <>
                  <path d={chartGeometry.tripsArea} fill="url(#multiTripGrad)" opacity="0.3" />
                  <path d={chartGeometry.tripsPath} fill="none" stroke="#F59E0B" strokeWidth="2.5" />
                </>
              )}
              {(activeFilter === 'all' || activeFilter === 'stranger-meets') && hasMeets && (
                <>
                  <path d={chartGeometry.meetsArea} fill="url(#multiMeetGrad)" opacity="0.3" />
                  <path d={chartGeometry.meetsPath} fill="none" stroke="#10B981" strokeWidth="2.5" />
                </>
              )}
            </>
          )}

          {/* Interactive Vertical Cursor Tracking */}
          {seriesData.map((d, i) => {
            const x = paddingLeft + (i / (seriesData.length - 1)) * innerWidth;
            const isHovered = hoveredIndex === i;

            let dotY = paddingTop + innerHeight;
            if (activeFilter === 'concerts') {
              dotY = paddingTop + innerHeight - (d.concerts / maxScale) * innerHeight * animProgress;
            } else if (activeFilter === 'trips') {
              dotY = paddingTop + innerHeight - (d.trips / maxScale) * innerHeight * animProgress;
            } else if (activeFilter === 'stranger-meets') {
              dotY = paddingTop + innerHeight - (d.meets / maxScale) * innerHeight * animProgress;
            } else {
              dotY = paddingTop + innerHeight - (d.total / maxScale) * innerHeight * animProgress;
            }

            return (
              <g key={i}>
                {isHovered && (
                  <line
                    x1={x}
                    y1={paddingTop}
                    x2={x}
                    y2={paddingTop + innerHeight}
                    stroke="#64748B"
                    strokeDasharray="3 3"
                    strokeWidth="1.25"
                  />
                )}

                <circle
                  cx={x}
                  cy={dotY}
                  r={isHovered ? 6 : 4}
                  fill="#6366F1"
                  stroke="#FFFFFF"
                  strokeWidth={isHovered ? 3 : 2}
                  filter="url(#waveDotGlow)"
                  className="transition-all duration-150"
                />

                <rect
                  x={x - innerWidth / (seriesData.length * 2)}
                  y={paddingTop}
                  width={innerWidth / seriesData.length}
                  height={innerHeight}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(i)}
                />

                <text
                  x={x}
                  y={chartHeight - 8}
                  textAnchor="middle"
                  fontSize="11"
                  fill={isHovered ? '#0F172A' : '#64748B'}
                  fontWeight={isHovered ? '700' : '500'}
                  fontFamily="Inter, sans-serif"
                >
                  {d.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip */}
        {activePoint !== null && hoveredIndex !== null && (
          <div
            className="absolute z-20 pointer-events-none rounded-xl border border-slate-200/90 bg-white/95 backdrop-blur-md p-3.5 shadow-xl text-xs space-y-2.5 min-w-60"
            style={{
              left: `${Math.min(Math.max(((hoveredIndex + 0.5) / seriesData.length) * 100, 16), 84)}%`,
              top: '12px',
              transform: 'translateX(-50%)'
            }}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
              <span className="font-bold text-slate-900">{activePoint.fullDate}</span>
              <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                {metricMode === 'revenue' ? 'Gross Volume' : 'Admissions'}
              </span>
            </div>

            <div className="space-y-1.5 text-[11px]">
              {hasConcerts && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-purple-700">
                    <span className="h-2 w-2 rounded-full bg-purple-600" />
                    <span className="font-medium">Concerts:</span>
                  </div>
                  <span className="font-bold text-slate-900">
                    {metricMode === 'revenue' ? formatCurrency(activePoint.concerts) : `${activePoint.concerts.toLocaleString()} tickets`}
                  </span>
                </div>
              )}

              {hasTrips && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-amber-700">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    <span className="font-medium">Trips:</span>
                  </div>
                  <span className="font-bold text-slate-900">
                    {metricMode === 'revenue' ? formatCurrency(activePoint.trips) : `${activePoint.trips.toLocaleString()} travelers`}
                  </span>
                </div>
              )}

              {hasMeets && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-teal-700">
                    <span className="h-2 w-2 rounded-full bg-teal-500" />
                    <span className="font-medium">Meets:</span>
                  </div>
                  <span className="font-bold text-slate-900">
                    {metricMode === 'revenue' ? formatCurrency(activePoint.meets) : `${activePoint.meets.toLocaleString()} buddies`}
                  </span>
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between font-semibold">
                <span className="text-slate-600">Combined Period Total:</span>
                <span className="text-indigo-700 font-bold">
                  {metricMode === 'revenue' ? formatCurrency(activePoint.total) : `${activePoint.total.toLocaleString()} units`}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
