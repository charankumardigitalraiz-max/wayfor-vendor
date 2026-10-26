import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Download,
  CheckCircle2,
  Clock,
  Ticket,
  Filter,
  DollarSign,
  ChevronDown
} from 'lucide-react';
import type { AttendeeBooking, ConcertEvent } from '../../types';
import { Table, type Column } from '../common/Table';
import { MetricCard } from '../common/MetricCard';
import { Pagination } from '../common/Pagination';

interface AttendeeManifestViewProps {
  attendees: AttendeeBooking[];
  concerts: ConcertEvent[];
  onToggleCheckIn: (bookingId: string) => void;
  onShowToast: (msg: string) => void;
}

export const AttendeeManifestView: React.FC<AttendeeManifestViewProps> = ({
  attendees,
  concerts,
  onToggleCheckIn,
  onShowToast
}) => {
  const [search, setSearch] = useState('');
  const [selectedConcert, setSelectedConcert] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'checkedIn' | 'pending'>('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredAttendees = useMemo(() => {
    return attendees.filter((item) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.customerName.toLowerCase().includes(q) ||
        item.customerEmail.toLowerCase().includes(q) ||
        item.ticketCode.toLowerCase().includes(q) ||
        item.orderNumber.toLowerCase().includes(q) ||
        item.ticketTier.toLowerCase().includes(q);

      if (!matchesSearch) return false;
      if (selectedConcert !== 'all' && item.concertId !== selectedConcert && item.concertTitle !== selectedConcert) return false;
      if (statusFilter === 'checkedIn' && !item.checkedIn) return false;
      if (statusFilter === 'pending' && item.checkedIn) return false;

      return true;
    });
  }, [attendees, search, selectedConcert, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredAttendees.length / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const startIdx = (safePage - 1) * pageSize;
  const paginatedAttendees = filteredAttendees.slice(startIdx, startIdx + pageSize);

  const checkedInCount = attendees.filter(a => a.checkedIn).length;
  const totalRevenue = attendees.reduce((acc, a) => acc + a.totalPaid, 0);

  const handleExportCSV = () => {
    const headers = ['Order Number', 'Ticket Code', 'Concert Title', 'Customer Name', 'Email', 'Phone', 'Ticket Tier', 'Seats', 'Total Paid (INR)', 'Checked In', 'Checked In At'];
    const rows = filteredAttendees.map(a => [
      a.orderNumber,
      a.ticketCode,
      `"${a.concertTitle}"`,
      `"${a.customerName}"`,
      a.customerEmail,
      a.customerPhone,
      `"${a.ticketTier}"`,
      a.seatsCount,
      a.totalPaid,
      a.checkedIn ? 'Yes' : 'No',
      a.checkedInAt || 'N/A'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DigitalRaiz_Attendee_Manifest_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast('Attendee manifest CSV downloaded successfully!');
  };

  const columns: Column<AttendeeBooking>[] = [
    {
      key: 'ticketCode',
      header: 'Ticket Code',
      render: (item) => (
        <span className="font-mono text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
          {item.ticketCode}
        </span>
      )
    },
    {
      key: 'customerName',
      header: 'Attendee & Contact',
      render: (item) => (
        <div>
          <span className="font-semibold text-slate-900 block">{item.customerName}</span>
          <span className="text-[11px] text-slate-500 font-normal">{item.customerEmail} • {item.customerPhone}</span>
        </div>
      )
    },
    {
      key: 'concertTitle',
      header: 'Concert Event',
      render: (item) => (
        <span className="font-medium text-slate-800 line-clamp-1 max-w-xs">
          {item.concertTitle}
        </span>
      )
    },
    {
      key: 'tier',
      header: 'Category & Seats',
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
            <span className={`font-semibold block ${tierColor}`}>{item.ticketTier}</span>
            <span className="text-[11px] text-slate-500 font-medium">{item.seatsCount} admission(s) • ₹{item.totalPaid.toLocaleString()}</span>
          </div>
        );
      }
    },
    {
      key: 'status',
      header: 'Gate Status',
      render: (item) => (
        item.checkedIn ? (
          <div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Admitted
            </span>
            {item.checkedInAt && (
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {new Date(item.checkedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
            <Clock className="h-3.5 w-3.5 text-amber-600" /> Pending Entry
          </span>
        )
      )
    },
    {
      key: 'action',
      header: 'Check-In Override',
      align: 'right',
      render: (item) => (
        <button
          type="button"
          onClick={() => {
            onToggleCheckIn(item.id);
            onShowToast(item.checkedIn ? `Entry reverted for ${item.customerName}` : `Admitted ${item.customerName}!`);
          }}
          className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${item.checkedIn
            ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
            }`}
        >
          {item.checkedIn ? 'Revert' : 'Admit Now'}
        </button>
      )
    }
  ];

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="rounded-lg border border-slate-200/90 bg-white p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">
            Attendee List
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            View ticket holders, verify contact details, and track gate check-ins.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 rounded-md text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white shadow-xs shadow-purple-200 transition-all cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Download className="h-4 w-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Bookings"
          value={attendees.length}
          isPositive={true}
          // change="All Roster"
          icon={Users}
          accentColor="purple"
        />

        <MetricCard
          label="Admitted to Venue"
          value={checkedInCount}
          isPositive={true}
          // change={`${Math.round((checkedInCount / (attendees.length || 1)) * 100)}% Admitted`}
          icon={CheckCircle2}
          accentColor="emerald"
        />

        <MetricCard
          label="Pending Gate Arrival"
          value={attendees.length - checkedInCount}
          isPositive={true}
          // change="Expected Tonight"
          icon={Clock}
          accentColor="amber"
        />

        <MetricCard
          label="Total Manifest Revenue"
          value={`₹${(totalRevenue / 100000).toFixed(1)} L`}
          isPositive={true}
          // change="Paid via UPI / Cards"
          icon={DollarSign}
          accentColor="cyan"
        />
      </div>

      {/* Unified Search, Filters, and Table Card */}
      <div className="rounded-lg border border-slate-200/90 bg-white shadow-2xs overflow-hidden">
        {/* Search & Filter Toolbar Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200/80 bg-white flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by attendee, email, order, or ticket code..."
              className="w-full h-10 rounded-lg border border-slate-200 bg-slate-50/70 pl-9.5 pr-9 py-2 text-xs sm:text-[13px] text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Concert Filter Dropdown */}
            <div className="relative">
              <select
                value={selectedConcert}
                onChange={(e) => {
                  setSelectedConcert(e.target.value);
                  setPage(1);
                }}
                className="appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-8 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-purple-500 cursor-pointer shadow-2xs transition-all hover:border-slate-300 min-w-[130px] max-w-[200px] truncate"
              >
                <option value="all">All Concerts</option>
                {concerts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>

            {/* Status Filter Dropdown */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as 'all' | 'checkedIn' | 'pending');
                  setPage(1);
                }}
                className="appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-8 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-purple-500 cursor-pointer shadow-2xs transition-all hover:border-slate-300 min-w-[125px]"
              >
                <option value="all">All Statuses</option>
                <option value="checkedIn">Admitted</option>
                <option value="pending">Pending Entry</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Table with Attached Pagination */}
        <Table
          columns={columns}
          data={paginatedAttendees}
          keyExtractor={(a) => a.id}
          showPagination={false}
          containerClassName="border-0 rounded-none shadow-none bg-transparent"
          emptyMessage="No attendees found matching filter."
          footer={
            filteredAttendees.length > 0 ? (
              <Pagination
                variant="attached"
                currentPage={safePage}
                totalItems={filteredAttendees.length}
                pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
                pageSizeOptions={[5, 10, 15, 20]}
                itemName="attendees"
              />
            ) : null
          }
        />
      </div>
    </div>
  );
};
