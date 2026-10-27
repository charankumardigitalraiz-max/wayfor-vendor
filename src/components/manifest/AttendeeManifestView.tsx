import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Download,
  CheckCircle2,
  Clock,
  Ticket,
  DollarSign,
  ChevronDown,
  Eye,
  X,
  MapPin,
  User,
  Mail,
  Phone,
  ShieldCheck,
  Building2,
  Printer,
  Calendar
} from 'lucide-react';
import type { AttendeeBooking, ConcertEvent } from '../../types';
import { Table, type Column } from '../common/Table';
import { MetricCard } from '../common/MetricCard';
import { Pagination } from '../common/Pagination';
import { Modal } from '../common/Modal';
import {
  formatUtcDate,
  formatUtcTime,
  formatUtcDateTime
} from '../../utils/dateUtils';

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
  const [selectedAttendee, setSelectedAttendee] = useState<AttendeeBooking | null>(null);

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

  // Sync selected attendee with live list
  const activeAttendee = selectedAttendee
    ? attendees.find((a) => a.id === selectedAttendee.id) || selectedAttendee
    : null;

  const handleExportCSV = () => {
    const headers = [
      'Order Number',
      'Ticket Code',
      'Concert Title',
      'Customer Name',
      'Email',
      'Phone',
      'Ticket Tier',
      'Seats',
      'Total Paid (INR)',
      'Checked In',
      'Gate Number',
      'Checked In At',
      'Gate Staff'
    ];
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
      `"${a.gateNumber || 'N/A'}"`,
      a.checkedInAt || 'N/A',
      `"${a.gateStaff || 'N/A'}"`
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
      width: 'min-w-[140px]',
      render: (item) => (
        <div>
          <span className="font-mono text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
            {item.ticketCode}
          </span>
          <span className="text-[10px] text-slate-400 font-mono block mt-1">
            #{item.orderNumber}
          </span>
        </div>
      )
    },
    {
      key: 'customerName',
      header: 'Attendee & Contact',
      render: (item) => {
        const initials = item.customerName
          .split(' ')
          .map(n => n[0])
          .slice(0, 2)
          .join('')
          .toUpperCase();

        return (
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 text-slate-600 font-medium text-xs flex items-center justify-center shrink-0">
              {initials}
            </div>
            <div>
              <span className="font-medium text-slate-900 block">{item.customerName}</span>
              <span className="text-[11px] text-slate-500 font-normal">
                {item.customerEmail} • {item.customerPhone}
              </span>
            </div>
          </div>
        );
      }
    },
    {
      key: 'concertTitle',
      header: 'Concert Event',
      width: 'min-w-[190px]',
      render: (item) => (
        <div>
          <span className="font-normal text-slate-800 line-clamp-1 max-w-xs block">
            {item.concertTitle}
          </span>
          <span className="text-[10px] text-slate-400 font-normal block mt-0.5">
            Purchased {formatUtcDate(item.purchaseDate)}
          </span>
        </div>
      )
    },
    {
      key: 'tier',
      header: 'Category & Seats',
      width: 'min-w-[190px]',
      render: (item) => {
        const lower = item.ticketTier.toLowerCase();
        const tierColor = lower.includes('vvip')
          ? 'text-amber-700 bg-amber-50 border-amber-200'
          : lower.includes('vip')
            ? 'text-purple-700 bg-purple-50 border-purple-200'
            : lower.includes('standing') || lower.includes('phase')
              ? 'text-blue-700 bg-blue-50 border-blue-200'
              : 'text-emerald-700 bg-emerald-50 border-emerald-200';

        return (
          <div>
            <span className={`inline-block font-medium text-xs px-2 py-0.5 rounded border ${tierColor}`}>
              {item.ticketTier}
            </span>
            <span className="text-[11px] text-slate-500 font-normal block mt-1">
              {item.seatsCount} admission(s) • ₹{item.totalPaid.toLocaleString()}
            </span>
          </div>
        );
      }
    },
    {
      key: 'status',
      header: 'Gate & Status',
      width: 'min-w-[190px]',
      render: (item) => {
        const isVip = item.ticketTier.toLowerCase().includes('vip');
        const gate = item.gateNumber || (isVip ? 'Gate 1 (VIP Fastrack)' : 'Gate 2 (General West)');

        return (
          <div className="space-y-1.5 min-w-[170px]">
            <div>
              {item.checkedIn ? (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 whitespace-nowrap">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Admitted
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 whitespace-nowrap">
                  <Clock className="h-3.5 w-3.5 text-amber-600" /> Pending Entry
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-600">
              <span className="font-mono text-[11px] font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 whitespace-nowrap">
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
      width: 'min-w-[190px]',
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
            <div className="flex flex-col gap-0.5 text-[11px] text-slate-500 font-normal pl-5">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-slate-400 shrink-0" />
                <span>{formatUtcTime(item.checkedInAt)}</span>
              </div>
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
      header: 'Actions',
      align: 'right',
      render: (item) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            title="View attendee pass and gate details"
            onClick={() => setSelectedAttendee(item)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200/90 hover:border-purple-300 transition-colors cursor-pointer shadow-2xs"
          >
            <Eye className="h-3.5 w-3.5 text-purple-600" />
            {/* <span className="hidden sm:inline">Details</span> */}
          </button>

          <button
            type="button"
            onClick={() => {
              onToggleCheckIn(item.id);
              onShowToast(
                item.checkedIn
                  ? `Entry reverted for ${item.customerName}`
                  : `Admitted ${item.customerName}!`
              );
            }}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer shadow-2xs ${item.checkedIn
              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
              }`}
          >
            {item.checkedIn ? 'Revert' : 'Admit Now'}
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="rounded-lg border border-slate-200/90 bg-white p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">
            Attendee List & Manifest
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            View ticket holders, verify gate turnstile entry, check-in timestamps, and inspect pass details.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 rounded-md text-xs font-medium bg-purple-600 hover:bg-purple-700 text-white shadow-xs shadow-purple-200 transition-all cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Download className="h-4 w-4" />
          <span>Export Manifest CSV</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Bookings"
          value={attendees.length}
          isPositive={true}
          icon={Users}
          accentColor="purple"
        />

        <MetricCard
          label="Admitted to Venue"
          value={checkedInCount}
          isPositive={true}
          icon={CheckCircle2}
          accentColor="emerald"
        />

        <MetricCard
          label="Pending Gate Arrival"
          value={attendees.length - checkedInCount}
          isPositive={true}
          icon={Clock}
          accentColor="amber"
        />

        <MetricCard
          label="Total Manifest Revenue"
          value={`₹${(totalRevenue / 100000).toFixed(1)} L`}
          isPositive={true}
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
                className="appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-8 py-2 text-xs font-medium text-slate-700 outline-none focus:border-purple-500 cursor-pointer shadow-2xs transition-all hover:border-slate-300 min-w-[130px] max-w-[200px] truncate"
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
                className="appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-8 py-2 text-xs font-medium text-slate-700 outline-none focus:border-purple-500 cursor-pointer shadow-2xs transition-all hover:border-slate-300 min-w-[125px]"
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
          // onRowClick={(item) => setSelectedAttendee(item)}
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

      {/* Attendee Pass & Gate Admission Details Modal */}
      {activeAttendee && (
        <Modal
          isOpen={!!activeAttendee}
          onClose={() => setSelectedAttendee(null)}
          title="Attendee Pass & Admission Details"
          subtitle={`Order #${activeAttendee.orderNumber} • ${activeAttendee.ticketCode} • Booked on ${formatUtcDate(activeAttendee.purchaseDate)}`}
          maxWidth="xl"
        >
          <div className="space-y-5">
            {/* Admission Status Banner */}
            <div
              className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 ${activeAttendee.checkedIn
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                : 'bg-amber-50/80 border-amber-200 text-amber-900'
                }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${activeAttendee.checkedIn
                    ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-200'
                    : 'bg-amber-500 text-white shadow-xs shadow-amber-200'
                    }`}
                >
                  {activeAttendee.checkedIn ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <Clock className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {activeAttendee.checkedIn ? 'Admitted into Venue' : 'Pending Gate Admission'}
                    </span>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${activeAttendee.checkedIn
                        ? 'bg-emerald-200/80 text-emerald-800'
                        : 'bg-amber-200/80 text-amber-800'
                        }`}
                    >
                      {activeAttendee.checkedIn ? 'Verified' : 'Unscanned'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-normal mt-0.5">
                    {activeAttendee.checkedIn
                      ? `Scanned at ${activeAttendee.gateNumber || 'Gate 1'} by ${activeAttendee.gateStaff || 'Gate Terminal'}`
                      : `Assigned to ${activeAttendee.gateNumber || 'Designated Gate'} • Awaiting turnstile entry`}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onToggleCheckIn(activeAttendee.id);
                  onShowToast(
                    activeAttendee.checkedIn
                      ? `Entry status reverted for ${activeAttendee.customerName}`
                      : `Successfully admitted ${activeAttendee.customerName}!`
                  );
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer shrink-0 transition-colors shadow-2xs ${activeAttendee.checkedIn
                  ? 'bg-white hover:bg-rose-50 text-rose-700 border border-rose-200'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
              >
                {activeAttendee.checkedIn ? 'Revert Check-In' : 'Admit Attendee Now'}
              </button>
            </div>

            {/* Gate Entry & Turnstile Verification Audit */}
            <div className="rounded-xl border border-slate-200/90 bg-white p-4.5 shadow-2xs space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-purple-600" />
                  <h3 className="text-xs font-medium text-slate-700 tracking-wider uppercase">
                    Gate Entry & Turnstile Verification
                  </h3>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Anti-Fraud Validated
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-slate-50/80 border border-slate-100 space-y-1">
                  <span className="text-xs text-slate-500 font-normal block">
                    Turnstile Gate
                  </span>
                  <span className="text-sm font-medium text-slate-800 block">
                    {activeAttendee.gateNumber || (activeAttendee.ticketTier.toLowerCase().includes('vip') ? 'Gate 1 (VIP Fastrack)' : 'Gate 2 (General West)')}
                  </span>
                  <span className="text-xs text-slate-400 font-normal block">
                    {activeAttendee.checkedIn ? 'Physical turnstile logged' : 'Designated check-in gate'}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50/80 border border-slate-100 space-y-1">
                  <span className="text-xs text-slate-500 font-normal block">
                    When Entered (Timestamp)
                  </span>
                  <span className="text-sm font-medium text-slate-800 block">
                    {activeAttendee.checkedIn && activeAttendee.checkedInAt
                      ? formatUtcDateTime(activeAttendee.checkedInAt, { second: '2-digit' })
                      : 'Not yet admitted'}
                  </span>
                  <span className="text-xs text-slate-400 font-normal block">
                    {activeAttendee.checkedIn ? 'Exact scan log time' : 'Awaiting turnstile scan'}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50/80 border border-slate-100 space-y-1">
                  <span className="text-xs text-slate-500 font-normal block">
                    Staff / Scanner Terminal
                  </span>
                  <span className="text-sm font-medium text-slate-800 block truncate">
                    {activeAttendee.gateStaff || (activeAttendee.checkedIn ? 'Box Office Terminal' : 'Awaiting Scanner')}
                  </span>
                  <span className="text-xs text-slate-400 font-normal block">
                    Authorized operator
                  </span>
                </div>
              </div>
            </div>

            {/* Ticket & Event Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Event & Tier Info */}
              <div className="rounded-xl border border-slate-200/90 bg-white p-4.5 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <Building2 className="h-4 w-4 text-purple-600" />
                  <h3 className="text-xs font-medium text-slate-700 tracking-wider uppercase">
                    Event & Tier Details
                  </h3>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-slate-500 text-xs font-normal block">Concert Show</span>
                    <span className="text-sm font-medium text-slate-900 block mt-0.5">{activeAttendee.concertTitle}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-slate-500 text-xs font-normal block">Ticket Tier</span>
                      <span className="font-medium text-xs text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 inline-block mt-0.5">
                        {activeAttendee.ticketTier}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-500 text-xs font-normal block">Seats / Admissions</span>
                      <span className="text-sm font-medium text-slate-900 mt-0.5 block">{activeAttendee.seatsCount} Person(s)</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2.5 border-t border-slate-100">
                    <div>
                      <span className="text-slate-500 text-xs font-normal block">Total Amount Paid</span>
                      <span className="text-base font-semibold text-slate-900">₹{activeAttendee.totalPaid.toLocaleString()}</span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Paid & Settled
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer Contact Details */}
              <div className="rounded-xl border border-slate-200/90 bg-white p-4.5 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <User className="h-4 w-4 text-purple-600" />
                  <h3 className="text-xs font-medium text-slate-700 tracking-wider uppercase">
                    Attendee Contact Identity
                  </h3>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white font-medium flex items-center justify-center text-sm shadow-2xs shrink-0">
                      {activeAttendee.customerName
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')}
                    </div>
                    <div className="min-w-0">
                      <span className="text-sm font-medium text-slate-900 block truncate">{activeAttendee.customerName}</span>
                      <span className="text-xs text-slate-500 font-normal">Primary Ticket Holder</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-1 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-slate-600 font-normal">
                      <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <a href={`mailto:${activeAttendee.customerEmail}`} className="hover:text-purple-700 hover:underline truncate">
                        {activeAttendee.customerEmail}
                      </a>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600 font-normal">
                      <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <a href={`tel:${activeAttendee.customerPhone}`} className="hover:text-purple-700 hover:underline">
                        {activeAttendee.customerPhone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Barcode & Security Strip */}
            <div className="rounded-xl border border-slate-200/90 bg-gradient-to-r from-slate-50 via-white to-slate-50 p-4 space-y-3 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div>
                  <span className="text-xs text-slate-500 font-normal block">
                    Digital Admission Pass Token
                  </span>
                  <span className="font-mono text-xs sm:text-sm font-medium text-slate-800 tracking-wider">
                    {activeAttendee.ticketCode}-SECURE-{activeAttendee.id.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Real-time Gate Sync Active</span>
                </div>
              </div>

              {/* Simulated Barcode Pattern Lines */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1 overflow-hidden opacity-75">
                {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 3, 1, 2, 3, 4, 1, 2, 1, 3, 2, 4, 1, 3, 2, 1, 4, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2].map(
                  (w, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-900 rounded-xs h-8 shrink-0"
                      style={{ width: `${w * 1.5}px` }}
                    />
                  )
                )}
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-normal text-slate-500">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Audited for gate admission control</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => {
                    window.print();
                  }}
                  className="px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  <Printer className="h-3.5 w-3.5 text-slate-600" />
                  <span>Print Slip</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedAttendee(null)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium transition-colors cursor-pointer shadow-2xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

