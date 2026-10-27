import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Music,
  Calendar,
  Ticket,
  TrendingUp,
  MapPin,
  Building2,
  Plus,
  ArrowRight,
  Eye,
  CheckCircle2,
  Clock,
  Car,
  AlertTriangle,
  Radio,
  Sliders,
  DollarSign
} from 'lucide-react';
import type { ConcertEvent } from '../../types';
import { MetricCard } from '../common/MetricCard';
import { Badge } from '../common/Badge';
import { VendorSalesChart, type Timeframe } from './VendorSalesChart';
import { mockVendorProfile } from '../../data/mockVendorData';

interface VendorOverviewProps {
  concerts: ConcertEvent[];
  onOpenCreateConcert: () => void;
  onSelectConcert: (concert: ConcertEvent) => void;
}

export const VendorOverview: React.FC<VendorOverviewProps> = ({
  concerts,
  onOpenCreateConcert,
  onSelectConcert
}) => {
  const navigate = useNavigate();
  const [timeframe, setTimeframe] = useState<Timeframe>('30D');

  // Calculations
  const activeEvents = useMemo(() => concerts.filter(c => c.status === 'active'), [concerts]);
  const totalCapacity = useMemo(() => concerts.reduce((sum, c) => sum + c.totalCapacity, 0), [concerts]);
  const totalTicketsSold = useMemo(() => concerts.reduce((sum, c) => sum + c.ticketsSold, 0), [concerts]);

  const totalGMV = useMemo(() => {
    return concerts.reduce((acc, c) => {
      const avgPrice = (c.minPrice + c.maxPrice) / 2;
      return acc + (c.ticketsSold * avgPrice);
    }, 0);
  }, [concerts]);

  const netPayoutEstimate = Math.round(totalGMV * 0.95); // 5% DigitalRaiz platform fee
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

  // Top 3 priority concerts
  const priorityConcerts = useMemo(() => {
    return [...concerts]
      .sort((a, b) => (b.ticketsSold / b.totalCapacity) - (a.ticketsSold / a.totalCapacity))
      .slice(0, 3);
  }, [concerts]);

  return (
    <div className="space-y-5">
      {/* Top Banner Card */}
      {/* <div className="rounded-2xl border border-purple-100/90 bg-gradient-to-r from-purple-50/90 via-indigo-50/40 to-white p-6 shadow-2xs relative overflow-hidden">
  
        <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-purple-200/40 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-indigo-200/30 blur-3xl pointer-events-none" />

        <div className="relative z-1 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-purple-100/80 border border-purple-200/70 text-purple-800 text-xs font-semibold">
              <Radio className="h-3 w-3 text-emerald-600 animate-pulse" />
              <span>Vendor Touring Command Center</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900">
              Welcome back, {mockVendorProfile.name.split(' ')[0]}
            </h1>
            <p className="text-xs sm:text-sm font-normal text-slate-600 leading-relaxed">
              Managing <span className="font-semibold text-slate-900">{activeEvents.length} active live arena tours</span> with over{' '}
              <span className="font-semibold text-slate-900">{totalTicketsSold.toLocaleString()} admissions confirmed</span> across India.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={() => navigate('/gate-scanner')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-md text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-2xs transition-all cursor-pointer"
            >
              <span>Gate Check-in Mode</span>
              <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
            </button>

            <button
              type="button"
              onClick={onOpenCreateConcert}
              className="flex items-center gap-2 px-4 py-2.5 rounded-md text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-200 transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Create New Tour Event</span>
            </button>
          </div>
        </div>
      </div> */}

      {/* Top 4 Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Gross Box Office (GMV)"
          value={formatCurrency(totalGMV)}
          isPositive={true}
          // change="+18.4% vs last mo"
          // subtext="Total ticket gross across all active tours"
          icon={TrendingUp}
          accentColor="purple"
        />

        <MetricCard
          label="Confirmed Admissions"
          value={totalTicketsSold.toLocaleString()}
          isPositive={true}
          // change={`${overallOccupancy}% capacity`}
          // subtext={`Out of ${totalCapacity.toLocaleString()} arena capacity`}
          icon={Ticket}
          accentColor="emerald"
        />

        <MetricCard
          label="Net Settlement Payable"
          value={formatCurrency(netPayoutEstimate)}
          isPositive={true}
          // change="95% Net (5% fee)"
          // subtext="Ready for direct RTGS bank withdrawal"
          icon={DollarSign}
          accentColor="cyan"
        />

        <MetricCard
          label="Active Arena Tours"
          value={`${activeEvents.length} Live`}
          isPositive={true}
          // change={`${concerts.length} total events`}
          // subtext="All stadium acoustic manifests signed"
          icon={Music}
          accentColor="amber"
        />
      </div>

      {/* Two Flex Charts: Revenue Spline & Ticket Volume */}
      <VendorSalesChart
        concerts={concerts}
        timeframe={timeframe}
        onTimeframeChange={setTimeframe}
        formatCurrency={formatCurrency}
      />

      {/* Top Performing Concert Tours */}
      {/* <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-slate-900">
              Live Arena Tours & Ticket Velocity
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Current fill rate and ticketing inventory breakdown by tour stop.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/concerts')}
            className="flex items-center gap-1.5 text-xs font-semibold text-purple-700 hover:text-purple-800 cursor-pointer"
          >
            <span>View All Tours</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {priorityConcerts.map((concert) => {
            const pct = Math.round((concert.ticketsSold / concert.totalCapacity) * 100);
            return (
              <div
                key={concert.id}
                onClick={() => onSelectConcert(concert)}
                className="group rounded-xl border border-slate-200/80 bg-white p-4 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
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
                  <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                    {concert.artist} • {concert.city}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Tickets Sold</span>
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
                      Details <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div> */}
    </div>
  );
};
