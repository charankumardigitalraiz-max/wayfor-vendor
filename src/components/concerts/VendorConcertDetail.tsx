import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Ticket,
  TrendingUp,
  Music,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Share2,
  Trash2,
  Edit3,
  Sliders,
  DollarSign,
  Scan,
  ShieldCheck,
  Building,
  ChevronDown,
  Search,
  Sparkles,
  Crown
} from 'lucide-react';
import type { ConcertEvent, AttendeeBooking } from '../../types';
import { Badge } from '../common/Badge';
import { MetricCard } from '../common/MetricCard';
import { Table, type Column } from '../common/Table';
import { Pagination } from '../common/Pagination';
import { AppImage } from '../common/AppImage';
import { formatUtcDate, formatUtcTime } from '../../utils/dateUtils';
import { vendorConcertService } from '../../services/vendorConcertService';

interface VendorConcertDetailProps {
  concerts: ConcertEvent[];
  attendees: AttendeeBooking[];
  onStatusChange: (id: string, status: ConcertEvent['status']) => void;
  onDeleteConcert: (id: string) => void;
  onToggleCheckIn: (bookingId: string) => void;
  onShowToast: (msg: string) => void;
}

export const VendorConcertDetail: React.FC<VendorConcertDetailProps> = ({
  concerts,
  attendees,
  onStatusChange,
  onDeleteConcert,
  onToggleCheckIn,
  onShowToast
}) => {
  const { concertId } = useParams<{ concertId: string }>();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'tiers' | 'attendees' | 'production'>('tiers');
  const [attendeeSearch, setAttendeeSearch] = useState('');
  const [attendeeFilter, setAttendeeFilter] = useState<'all' | 'checkedIn' | 'pending'>('all');

  const [attendeePage, setAttendeePage] = useState(1);
  const [attendeePageSize, setAttendeePageSize] = useState(5);

  const concert = concerts.find(c => c.id === concertId) || concerts[0];

  if (!concert) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-12 text-center space-y-3">
        <AlertCircle className="h-10 w-10 text-rose-500 mx-auto" />
        <h3 className="text-base font-semibold text-slate-800">Concert Not Found</h3>
        <p className="text-xs text-slate-500">The event could not be located in your vendor roster.</p>
        <button
          onClick={() => navigate('/concerts')}
          className="mt-2 px-4 py-2 rounded-md text-xs font-semibold bg-purple-600 text-white cursor-pointer"
        >
          Return to All Concerts
        </button>
      </div>
    );
  }

  // Filter attendees for this concert
  const eventAttendees = attendees.filter(a => a.concertId === concert.id || a.concertTitle === concert.title);
  const filteredAttendees = eventAttendees.filter(a => {
    const q = attendeeSearch.toLowerCase().trim();
    const matchesSearch =
      !q ||
      a.customerName.toLowerCase().includes(q) ||
      a.ticketCode.toLowerCase().includes(q) ||
      a.orderNumber.toLowerCase().includes(q) ||
      a.ticketTier.toLowerCase().includes(q);

    if (!matchesSearch) return false;
    if (attendeeFilter === 'checkedIn' && !a.checkedIn) return false;
    if (attendeeFilter === 'pending' && a.checkedIn) return false;
    return true;
  });

  const totalAttendeePages = Math.max(1, Math.ceil(filteredAttendees.length / attendeePageSize));
  const safeAttendeePage = Math.min(Math.max(1, attendeePage), totalAttendeePages);
  const startAttendeeIdx = (safeAttendeePage - 1) * attendeePageSize;
  const paginatedAttendees = filteredAttendees.slice(startAttendeeIdx, startAttendeeIdx + attendeePageSize);

  const soldPct = Math.round((concert.ticketsSold / concert.totalCapacity) * 100);
  const avgPrice = (concert.minPrice + concert.maxPrice) / 2;
  const grossEst = concert.ticketsSold * avgPrice;
  const checkedInCount = eventAttendees.filter(a => a.checkedIn).length;
  const totalTierQuota = concert.ticketTiers.reduce((acc, t) => acc + t.total, 0);
  const totalTierAvailable = concert.ticketTiers.reduce((acc, t) => acc + t.available, 0);
  const totalTierSold = totalTierQuota - totalTierAvailable;
  const totalTierRevenue = concert.ticketTiers.reduce((acc, t) => acc + (t.total - t.available) * t.price, 0);
  const totalTierSoldPct = totalTierQuota > 0 ? Math.round((totalTierSold / totalTierQuota) * 100) : 0;
  const tabIndex = activeTab === 'tiers' ? 0 : activeTab === 'attendees' ? 1 : 2;

  const attendeeColumns: Column<AttendeeBooking>[] = [
    {
      key: 'ticketCode',
      header: 'Ticket Code',
      render: (item) => (
        <span className="font-mono text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200/80 shadow-2xs">
          {item.ticketCode}
        </span>
      )
    },
    {
      key: 'customerName',
      header: 'Attendee Name',
      render: (item) => (
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-full bg-purple-100 text-purple-700 border border-purple-200/70 flex items-center justify-center font-medium text-xs shrink-0">
            {item.customerName.charAt(0)}
          </div>
          <div>
            <span className="font-medium text-slate-900 block">{item.customerName}</span>
            <span className="text-[11px] text-slate-500 font-normal">{item.customerEmail}</span>
          </div>
        </div>
      )
    },
    {
      key: 'ticketTier',
      header: 'Tier & Seats',
      render: (item) => {
        const lower = item.ticketTier.toLowerCase();
        const tierColor = lower.includes('vvip')
          ? 'text-amber-700'
          : lower.includes('vip')
            ? 'text-purple-700'
            : lower.includes('standing') || lower.includes('phase')
              ? 'text-blue-700'
              : 'text-emerald-700';

        return (
          <div>
            <span className={`font-medium block ${tierColor}`}>{item.ticketTier}</span>
            <span className="text-[11px] text-slate-500 font-normal">{item.seatsCount} admission(s) • ₹{item.totalPaid.toLocaleString()}</span>
          </div>
        );
      }
    },
    {
      key: 'checkedIn',
      header: 'Gate & Status',
      width: 'min-w-[190px]',
      render: (item) => {
        const isVip = item.ticketTier.toLowerCase().includes('vip');
        const gate = item.gateNumber || (isVip ? 'Gate 1 (VIP Fastrack)' : 'Gate 2 (General West)');

        return (
          <div className="space-y-1.5 min-w-[170px]">
            <div>
              {item.checkedIn ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  Admitted
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 whitespace-nowrap">
                  <Clock className="h-3.5 w-3.5 text-amber-600" />
                  Pending Entry
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <span className="font-mono text-[10px] font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 whitespace-nowrap">
                {gate}
              </span>
            </div>
          </div>
        );
      }
    },
    {
      key: 'checkInDate',
      header: 'Check-In Date & Time',
      render: (item) => {
        if (!item.checkedIn || !item.checkedInAt) {
          return (
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-normal">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
              <span className="italic">Not scanned yet</span>
            </div>
          );
        }

        return (
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-800">
              <Calendar className="h-3.5 w-3.5 text-purple-600 shrink-0" />
              <span>{formatUtcDate(item.checkedInAt)}</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-500 font-normal pl-5">
              <Clock className="h-3 w-3 text-slate-400 shrink-0" />
              <span>{formatUtcTime(item.checkedInAt)}</span>
              {item.gateStaff && (
                <span className="text-slate-400 text-[10px]">({item.gateStaff})</span>
              )}
            </div>
          </div>
        );
      }
    },
    {
      key: 'action',
      header: 'Manual Override',
      align: 'right',
      render: (item) => (
        <button
          type="button"
          onClick={() => {
            onToggleCheckIn(item.id);
            onShowToast(item.checkedIn ? `Entry reverted for ${item.customerName}` : `Admitted ${item.customerName}!`);
          }}
          className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${item.checkedIn
            ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
            }`}
        >
          {item.checkedIn ? 'Revert Entry' : 'Manual Check-in'}
        </button>
      )
    }
  ];

  return (
    <div className="space-y-4">
      {/* Top Breadcrumb Navigation Card */}
      <div className="rounded-lg border border-slate-200/90 bg-white px-4 py-2 sm:px-5 sm:py-3.5 shadow-2xs flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold text-slate-700 hover:text-purple-700 hover:bg-purple-50 border border-slate-200/80 hover:border-purple-200 transition-all cursor-pointer shadow-2xs group"
        >
          <ArrowLeft className="h-3.5 w-3.5 text-slate-400 group-hover:text-purple-600 group-hover:-translate-x-0.5 transition-all" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div
              className={`absolute left-3 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full pointer-events-none ${concert.status === 'active'
                ? 'bg-emerald-500 animate-pulse'
                : concert.status === 'upcoming'
                  ? 'bg-blue-500'
                  : 'bg-purple-500'
                }`}
            />
            <select
              value={concert.status}
              onChange={(e) => onStatusChange(concert.id, e.target.value as ConcertEvent['status'])}
              className="appearance-none w-full h-9 rounded-md border border-slate-200 bg-white pl-7.5 pr-8 text-xs font-semibold text-slate-700 outline-none focus:border-purple-500 cursor-pointer shadow-2xs"
            >
              <option value="active">Active Live</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="draft">Draft</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          </div>

          {/* <button
            type="button"
            onClick={() => navigate('/gate-scanner')}
            className="flex items-center gap-1.5 h-9 px-3.5 rounded-md text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white shadow-xs shadow-purple-200 transition-all cursor-pointer shrink-0"
          >
            <Scan className="h-3.5 w-3.5" />
            <span>Launch Gate Scanner</span>
          </button> */}
        </div>
      </div>

      {/* Main Concert Hero Card: Balanced 3-Column Studio Layout */}
      <div className="rounded-lg border border-slate-200/90 bg-white p-5 lg:p-6 shadow-2xs">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Column 1: Left Poster Artwork Frame */}
          <div className="relative w-full sm:w-60 lg:w-64 aspect-[4/3] shrink-0 rounded-xl overflow-hidden border border-slate-200 shadow-xs bg-slate-100 group">
            <AppImage
              src={concert.image}
              alt={concert.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-50" />

            <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5">
              <span className="rounded-md bg-white/95 backdrop-blur-md px-2 py-0.5 text-[11px] font-semibold text-slate-900 shadow-xs">
                {concert.genre}
              </span>
              {concert.ageRestriction && (
                <span className="rounded-md bg-slate-900/80 backdrop-blur-md px-2 py-0.5 text-[10px] font-medium text-white shadow-xs">
                  {concert.ageRestriction}
                </span>
              )}
            </div>
          </div>

          {/* Column 2: Center Details & Event Metadata */}
          <div className="flex-1 min-w-0 space-y-5 w-full">
            {/* Badges Row */}
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge status={concert.status} />
              <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 border border-purple-200 px-2.5 py-0.5 text-xs font-semibold text-purple-700">
                <Music className="h-3 w-3 text-purple-600" />
                {concert.genre} Tour
              </span>
              <span className="rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                {concert.ticketTiers.length} Active Tiers
              </span>
            </div>

            {/* Concert Title & Lineup */}
            <div className="space-y-3">
              <h1 className="text-2xl sm:text-2xl font-semibold tracking-tight text-slate-900 leading-snug">
                {concert.title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-1 pt-0.5 text-[12px] font-semibold">
                <span className="text-slate-600">
                  Headliner: <span className="font-semibold text-purple-700 text-[13px]">{concert.artist}</span>
                </span>
                {concert.supportingActs && concert.supportingActs.length > 0 && (
                  <span className="text-slate-500 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                    <span>
                      Featuring: <span className="text-slate-800 font-medium">{concert.supportingActs.join(', ')}</span>
                    </span>
                  </span>
                )}
              </div>
            </div>

            {/* Event Highlights Strip */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2  text-xs">
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-50 border border-slate-200/80 text-slate-700">
                <Calendar className="h-4 w-4 text-purple-600 shrink-0" />
                <span className="font-semibold text-slate-900">{formatUtcDate(concert.date)}</span>
                <span className="text-slate-400 font-normal">· Gate {concert.doorsOpen}</span>
              </div>

              <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-50 border border-slate-200/80 text-slate-700">
                <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-slate-900">{concert.venueName}</span>
                <span className="text-slate-400 font-normal">({concert.city})</span>
              </div>

              <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-50 border border-slate-200/80 text-slate-700">
                <Ticket className="h-4 w-4 text-amber-600 shrink-0" />
                <span className="font-semibold text-slate-900">
                  ₹{concert.minPrice.toLocaleString()} - ₹{concert.maxPrice.toLocaleString()}
                </span>
                <span className="text-slate-400 font-normal">· Avg ₹{Math.round(avgPrice).toLocaleString()}</span>
              </div>
            </div>
          </div>


        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Capacity Allocation"
          value={`${soldPct}%`}
          isPositive={true}
          // change={`${concert.ticketsSold.toLocaleString()} sold`}
          // subtext={`Out of ${concert.totalCapacity.toLocaleString()} arena capacity`}
          icon={Ticket}
          accentColor="purple"
        />

        <MetricCard
          label="Est. Gross Box Office"
          value={`₹${(grossEst / 10000000).toFixed(2)} Cr`}
          isPositive={true}
          // change="₹ avg yield"
          // subtext={`From ${concert.ticketTiers.length} tiered categories`}
          icon={TrendingUp}
          accentColor="emerald"
        />

        <MetricCard
          label="Live Gate Admitted"
          value={`${checkedInCount} Scanned`}
          isPositive={true}
          // change="Gate Entry"
          // subtext={`${eventAttendees.length - checkedInCount} pending admission`}
          icon={Scan}
          accentColor="cyan"
        />

        <MetricCard
          label="Remaining Passes"
          value={(concert.totalCapacity - concert.ticketsSold).toLocaleString()}
          isPositive={concert.totalCapacity > concert.ticketsSold}
          // change="Inventory"
          // subtext={`Across ${concert.ticketTiers.length} tiered categories`}
          icon={Users}
          accentColor="amber"
        />
      </div>

      {/* Unified Event Operations Workspace Card */}
      <div className="rounded-lg border border-slate-200/90 bg-white shadow-2xs overflow-hidden">
        {/* Workspace Tab Header */}
        <div className="border-b border-slate-200/80 bg-white px-4 py-3 sm:px-5 flex items-center justify-between gap-4 flex-wrap">
          {/* Segmented Pill Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200/70">
            <button
              type="button"
              onClick={() => setActiveTab('tiers')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${activeTab === 'tiers'
                ? 'bg-white text-purple-700 shadow-2xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 border border-transparent'
                }`}
            >
              <Ticket className="h-3.5 w-3.5" />
              <span>Ticket Tiers & Inventory</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-semibold transition-colors ${activeTab === 'tiers' ? 'bg-purple-100 text-purple-800' : 'bg-slate-200/80 text-slate-600'
                }`}>
                {concert.ticketTiers.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('attendees')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${activeTab === 'attendees'
                ? 'bg-white text-purple-700 shadow-2xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 border border-transparent'
                }`}
            >
              <Users className="h-3.5 w-3.5" />
              <span>Attendee Manifest</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-semibold transition-colors ${activeTab === 'attendees' ? 'bg-purple-100 text-purple-800' : 'bg-slate-200/80 text-slate-600'
                }`}>
                {eventAttendees.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('production')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${activeTab === 'production'
                ? 'bg-white text-purple-700 shadow-2xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 border border-transparent'
                }`}
            >
              <Sliders className="h-3.5 w-3.5" />
              <span>Stage & Production Logistics</span>
            </button>
          </div>

          {/* <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Real-time Gate & Box Office Sync</span>
          </div> */}
        </div>

        {/* Sliding Tab Panes Container */}
        <div className="overflow-hidden w-full relative">
          <div
            className="flex w-full items-start transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${tabIndex * 100}%)` }}
          >
            {/* Tab 1: Ticket Tiers */}
            <div className="w-full shrink-0 min-w-full">
              {/* Header Toolbar */}
              <div className="p-4 sm:p-5 border-b border-slate-200/80 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <Ticket className="h-4 w-4 text-purple-600" />
                    Ticket Tiers & Quota Allocations
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Official box office passes broken down by seating class, quota velocity, and stage visibility.
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {/* <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200 shadow-2xs">
                    {concert.ticketTiers.length} Active Tiers
                  </span> */}
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 shadow-2xs">
                    ₹{totalTierRevenue.toLocaleString()} Gross Inflow
                  </span>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      <th className="py-3.5 px-5">Tier Category</th>
                      <th className="py-3.5 px-4">Price / Pass</th>
                      <th className="py-3.5 px-4 min-w-[180px]">Quota & Sales</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-5 text-right">Gross Inflow</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-normal">
                    {concert.ticketTiers.map((tier, idx) => {
                      const tierSold = tier.total - tier.available;
                      const tierPercent = Math.round((tierSold / (tier.total || 1)) * 100);
                      const tierRevenue = tierSold * tier.price;
                      const isSoldOut = tier.available === 0;
                      const isSellingFast = tierPercent >= 80 && !isSoldOut;

                      const lowerName = tier.name.toLowerCase();
                      const tierBadgeStyle = lowerName.includes('vvip')
                        ? 'bg-amber-100 text-amber-800 border-amber-200'
                        : lowerName.includes('vip')
                          ? 'bg-purple-100 text-purple-800 border-purple-200'
                          : lowerName.includes('standing') || lowerName.includes('floor') || lowerName.includes('mosh')
                            ? 'bg-blue-100 text-blue-800 border-blue-200'
                            : 'bg-emerald-100 text-emerald-800 border-emerald-200';

                      return (
                        <tr
                          key={idx}
                          className="hover:bg-purple-50/30 transition-colors"
                        >
                          <td className="py-3.5 px-5">
                            <div className="flex items-center gap-3">
                              <div className={`h-8 w-8 rounded-lg border flex items-center justify-center font-semibold text-xs shrink-0 shadow-2xs ${tierBadgeStyle}`}>
                                {tier.name.charAt(0)}
                              </div>
                              <div>
                                <div className="font-semibold text-slate-900">{tier.name}</div>
                                <div className="text-[11px] text-slate-500">
                                  <span className="font-medium text-slate-700">{tier.available.toLocaleString()}</span> available of {tier.total.toLocaleString()}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                            ₹{tier.price.toLocaleString()}
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex items-center justify-between text-[11px] mb-1">
                              <span className="font-medium text-slate-700">{tierSold.toLocaleString()} sold</span>
                              <span className="font-semibold text-purple-700">{tierPercent}%</span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${isSoldOut
                                  ? 'bg-rose-500'
                                  : isSellingFast
                                    ? 'bg-amber-500'
                                    : 'bg-purple-600'
                                  }`}
                                style={{ width: `${tierPercent}%` }}
                              />
                            </div>
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {isSoldOut ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs">
                                Sold Out
                              </span>
                            ) : isSellingFast ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 shadow-2xs">
                                Selling Fast
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                                Available
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-5 text-right text-[13px] font-bold text-purple-700 whitespace-nowrap">
                            ₹{tierRevenue.toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="border-t-2 border-slate-200 bg-slate-50/75 text-xs font-semibold text-slate-800">
                    <tr>
                      <td className="py-3.5 px-5">
                        <div className="font-semibold text-slate-900">Total Portfolio Allocation</div>
                        <div className="text-[11px] text-slate-500 font-normal">
                          {totalTierAvailable.toLocaleString()} remaining across {concert.ticketTiers.length} categories
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium whitespace-nowrap">
                        Avg ₹{Math.round(totalTierQuota > 0 ? (concert.ticketTiers.reduce((acc, t) => acc + t.price * t.total, 0) / totalTierQuota) : 0).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="font-semibold text-slate-800">{totalTierSold.toLocaleString()} total sold</span>
                          <span className="font-semibold text-purple-700">{totalTierSoldPct}%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-purple-600 transition-all duration-500"
                            style={{ width: `${totalTierSoldPct}%` }}
                          />
                        </div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-purple-100/80 text-purple-800 border border-purple-200/80 shadow-2xs">
                          {concert.ticketTiers.length} Active Categories
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-right font-extrabold text-sm text-purple-800 whitespace-nowrap">
                        ₹{totalTierRevenue.toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Tab 2: Attendee Manifest */}
            <div className="w-full shrink-0 min-w-full">
              {/* Search & Filter Toolbar */}
              <div className="p-4 sm:p-5 border-b border-slate-200/80 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={attendeeSearch}
                    onChange={(e) => {
                      setAttendeeSearch(e.target.value);
                      setAttendeePage(1);
                    }}
                    placeholder="Search attendee name, ticket code (TKT-9821)..."
                    className="w-full rounded-md border border-slate-200 bg-slate-50/70 pl-9 pr-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-purple-500 focus:bg-white transition-all shadow-2xs"
                  />
                </div>

                <div className="relative">
                  <select
                    value={attendeeFilter}
                    onChange={(e) => {
                      setAttendeeFilter(e.target.value as 'all' | 'checkedIn' | 'pending');
                      setAttendeePage(1);
                    }}
                    className="appearance-none rounded-md border border-slate-200 bg-white px-3 py-2 pr-8 text-xs font-semibold text-slate-700 outline-none focus:border-purple-500 cursor-pointer shadow-2xs transition-all hover:border-slate-300"
                  >
                    <option value="all">All Attendees</option>
                    <option value="checkedIn">Admitted</option>
                    <option value="pending">Pending Entry</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <Table
                columns={attendeeColumns}
                data={paginatedAttendees}
                keyExtractor={(a) => a.id}
                showPagination={false}
                containerClassName="border-0 rounded-none shadow-none bg-transparent"
                emptyMessage="No attendees found matching filter."
                footer={
                  filteredAttendees.length > 0 ? (
                    <Pagination
                      variant="attached"
                      currentPage={safeAttendeePage}
                      totalItems={filteredAttendees.length}
                      pageSize={attendeePageSize}
                      onPageChange={setAttendeePage}
                      onPageSizeChange={setAttendeePageSize}
                      pageSizeOptions={[5, 10, 15, 20]}
                      itemName="attendees"
                    />
                  ) : null
                }
              />
            </div>

            {/* Tab 3: Stage & Production */}
            <div className="w-full shrink-0 min-w-full p-4 sm:p-5 lg:p-6 space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-semibold text-slate-900">
                  Stadium Acoustics & Technical Rider Specifications
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Production guidelines, sound system calibration, and security arrangements.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/70 space-y-2">
                  <h4 className="text-xs font-semibold text-slate-800 flex items-center gap-2">
                    <Music className="h-4 w-4 text-purple-600" />
                    <span>Audio System Rider</span>
                  </h4>
                  <p className="text-xs text-slate-700 font-semibold">
                    {concert.soundSystem || 'L-Acoustics K1 Stadium Array + KS28 Sub Arc'}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    FOH console calibrated to 102dB Leq with digital delay towers mapped across all stadium tiers.
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/70 space-y-2">
                  <h4 className="text-xs font-semibold text-slate-800 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <span>Security & Gate Personnel</span>
                  </h4>
                  <p className="text-xs text-slate-700 font-semibold">
                    {concert.productionChecklist?.securityGuardsCount || 150} Certified Bouncers & Stewards
                  </p>
                  <p className="text-[11px] text-slate-500">
                    DFMD metal detectors stationed at Gates 1 through 6 with dedicated women security lanes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};
