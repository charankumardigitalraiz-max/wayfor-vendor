import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Music,
  Ticket,
  TrendingUp,
  MapPin,
  Plus,
  ArrowRight,
  Radio,
  DollarSign,
  Scan,
  Users,
  Mic2,
  Calendar,
  Sparkles,
  Building2
} from 'lucide-react';
import type { ConcertEvent } from '../../types';
import { MetricCard } from '../common/MetricCard';
import { Badge } from '../common/Badge';
import {
  ModuleTrendLineChart,
  FunnelChart,
  ConcertTourColumnChart,
  ConcertPerformanceBarChart,
  type Timeframe
} from '../charts';

interface ConcertsOverviewProps {
  concerts: ConcertEvent[];
  onOpenCreateConcert: () => void;
  onSelectConcert: (concert: ConcertEvent) => void;
}

export const ConcertsOverview: React.FC<ConcertsOverviewProps> = ({
  concerts,
  onOpenCreateConcert,
  onSelectConcert
}) => {
  const navigate = useNavigate();
  const [timeframe, setTimeframe] = useState<Timeframe>('30D');

  // Computed metrics
  const activeEvents = useMemo(() => concerts.filter(c => c.status === 'active'), [concerts]);
  const upcomingEvents = useMemo(() => concerts.filter(c => c.status === 'upcoming'), [concerts]);
  const totalCapacity = useMemo(() => concerts.reduce((sum, c) => sum + c.totalCapacity, 0), [concerts]);
  const totalTicketsSold = useMemo(() => concerts.reduce((sum, c) => sum + c.ticketsSold, 0), [concerts]);

  const totalGMV = useMemo(() => {
    return concerts.reduce((acc, c) => {
      const avgPrice = (c.minPrice + c.maxPrice) / 2;
      return acc + (c.ticketsSold * avgPrice);
    }, 0);
  }, [concerts]);

  const netPayoutEstimate = Math.round(totalGMV * 0.95);
  const overallOccupancy = totalCapacity > 0 ? Math.round((totalTicketsSold / totalCapacity) * 100) : 0;

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    }
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)} Lakh`;
    }
    return `₹${amount.toLocaleString()}`;
  };

  // Priority / Trending Concert Stops
  const priorityConcerts = useMemo(() => {
    return [...concerts]
      .sort((a, b) => (b.ticketsSold / (b.totalCapacity || 1)) - (a.ticketsSold / (a.totalCapacity || 1)))
      .slice(0, 3);
  }, [concerts]);

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="rounded-lg border border-slate-200/90 bg-white p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-md bg-purple-100 text-purple-700 flex items-center justify-center">
              <Music className="h-4 w-4" />
            </div>
            <div>
              <h1 className="PageTitle">
                Concerts Overview
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Real-time ticketing velocity, arena occupancy, and gate access metrics across active tour stops.
              </p>
            </div>
          </div>

        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          {/* <button
            type="button"
            onClick={() => navigate('/gate-scanner')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all cursor-pointer"
          >
            <Scan className="h-3.5 w-3.5 text-purple-600" />
            <span>Gate Scanner</span>
          </button> */}
          <button
            type="button"
            onClick={onOpenCreateConcert}
            className="flex items-center gap-2 px-4 py-2 rounded-md text-xs font-semibold bg-purple-600 text-white hover:bg-purple-700 shadow-xs shadow-purple-200 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>New Concert Stop</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Gross Box Office (GMV)"
          value={formatCurrency(totalGMV)}
          isPositive={true}
          icon={TrendingUp}
          accentColor="purple"
        />

        <MetricCard
          label="Confirmed Admissions"
          value={totalTicketsSold.toLocaleString()}
          isPositive={true}
          icon={Ticket}
          accentColor="emerald"
        />

        <MetricCard
          label="Net Settlement Payable"
          value={formatCurrency(netPayoutEstimate)}
          isPositive={true}
          icon={DollarSign}
          accentColor="cyan"
        />

        <MetricCard
          label="Active Arena Tours"
          value={`${activeEvents.length} Live`}
          isPositive={true}
          icon={Music}
          accentColor="amber"
        />
      </div>

      {/* Concert Admissions & Tour Ranking Suite (Non-Pie) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <FunnelChart
          title="Ticket Admissions Funnel"
          subtitle="Tour page discovery through confirmed stadium admissions"
          unit="tickets"
          tiers={[
            {
              id: 'reach',
              label: 'Tour Page Visitors',
              value: Math.max(12000, totalTicketsSold * 8),
              badgeText: '100%'
            },
            {
              id: 'seats',
              label: 'Selected Arena Seats',
              value: Math.max(4800, Math.round(totalTicketsSold * 3.4)),
              badgeText: '42.5%'
            },
            {
              id: 'checkout',
              label: 'Added to Checkout Cart',
              value: Math.max(1800, Math.round(totalTicketsSold * 1.4)),
              badgeText: '17.5%'
            },
            {
              id: 'confirmed',
              label: 'Confirmed Admissions',
              value: totalTicketsSold,
              badgeText: `${((totalTicketsSold / Math.max(12000, totalTicketsSold * 8)) * 100).toFixed(1)}%`
            }
          ]}
        />

        <ConcertTourColumnChart
          concerts={concerts}
          formatCurrency={formatCurrency}
        />
      </div>

      {/* Sales Velocity & Performance Suite (Non-Pie) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ModuleTrendLineChart
          title="Box Office Sales Velocity"
          accentColor="purple"
          totalAmount={totalGMV}
          totalVolume={totalTicketsSold}
          unit="tickets"
          timeframe={timeframe}
          onTimeframeChange={setTimeframe}
          formatCurrency={formatCurrency}
          subtext={concerts.map(c => c.artist || c.title).slice(0, 3).join(' • ')}
        />

        <ConcertPerformanceBarChart
          concerts={concerts}
          formatCurrency={formatCurrency}
        />
      </div>

      {/* Priority Concert Tours & Quick Operations */}
      {/* <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-slate-900">
              Live Arena Stops & Ticketing Velocity
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live capacity fill rate and inventory status for high-demand concert dates.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/concerts')}
            className="flex items-center gap-1.5 text-xs font-semibold text-purple-700 hover:text-purple-800 cursor-pointer"
          >
            <span>View All Concerts</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {priorityConcerts.map((concert) => {
            const pct = Math.round((concert.ticketsSold / (concert.totalCapacity || 1)) * 100);
            return (
              <div
                key={concert.id}
                onClick={() => onSelectConcert(concert)}
                className="group rounded-xl border border-slate-200/90 bg-white p-4 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-32 w-full rounded-lg overflow-hidden bg-slate-100 mb-3">
                    <img
                      src={concert.image}
                      alt={concert.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="rounded-full bg-slate-900/80 backdrop-blur-md px-2 py-0.5 text-[10px] font-semibold text-white">
                        {concert.genre}
                      </span>
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge status={concert.status} />
                    </div>
                  </div>

                  <h4 className="text-xs font-semibold text-slate-900 group-hover:text-purple-700 transition-colors truncate">
                    {concert.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5 flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                    <span>{concert.venueName}, {concert.city}</span>
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Admissions Fill</span>
                    <span className="font-semibold text-purple-700">
                      {pct}% ({concert.ticketsSold.toLocaleString()} / {concert.totalCapacity.toLocaleString()})
                    </span>
                  </div>

                  <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-purple-600 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-slate-700 font-semibold">
                      ₹{concert.minPrice.toLocaleString()} - ₹{concert.maxPrice.toLocaleString()}
                    </span>
                    <span className="text-purple-700 font-semibold group-hover:underline inline-flex items-center gap-1">
                      Manage Stop <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div> */}

      {/* Quick Access Operational Modules Bar */}
      {/* <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => navigate('/concerts')}
          className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 bg-white hover:border-purple-300 hover:bg-purple-50/30 transition-all text-left cursor-pointer"
        >
          <div className="h-9 w-9 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
            <Music className="h-4 w-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-900">All Concerts</div>
            <div className="text-[11px] text-slate-500">{concerts.length} stops scheduled</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => navigate('/artists')}
          className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 bg-white hover:border-purple-300 hover:bg-purple-50/30 transition-all text-left cursor-pointer"
        >
          <div className="h-9 w-9 rounded-lg bg-pink-50 text-pink-700 flex items-center justify-center shrink-0">
            <Mic2 className="h-4 w-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-900">Artists & Lineup</div>
            <div className="text-[11px] text-slate-500">Headliners & riders</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => navigate('/venues')}
          className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 bg-white hover:border-purple-300 hover:bg-purple-50/30 transition-all text-left cursor-pointer"
        >
          <div className="h-9 w-9 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
            <Building2 className="h-4 w-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-900">Venues & Stages</div>
            <div className="text-[11px] text-slate-500">Layouts & seating</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => navigate('/gate-scanner')}
          className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 bg-white hover:border-purple-300 hover:bg-purple-50/30 transition-all text-left cursor-pointer"
        >
          <div className="h-9 w-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Scan className="h-4 w-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-900">Live Turnstiles</div>
            <div className="text-[11px] text-slate-500">QR barcode scanner</div>
          </div>
        </button>
      </div> */}
    </div>
  );
};
