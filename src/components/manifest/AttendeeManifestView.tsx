import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Search,
  Download,
  Ticket,
  DollarSign,
  ChevronDown,
  Eye,
  X,
  User,
  Printer,
  Calendar,
  Building2,
  CheckCircle2,
  Plus
} from 'lucide-react';
import type { AttendeeBooking, ConcertEvent } from '../../types';
import { Table, type Column } from '../common/Table';
import { MetricCard } from '../common/MetricCard';
import { Pagination } from '../common/Pagination';
import { Modal } from '../common/Modal';
import { formatUtcDate } from '../../utils/dateUtils';

interface AttendeeManifestViewProps {
  attendees: AttendeeBooking[];
  concerts: ConcertEvent[];
  onToggleCheckIn?: (bookingId: string) => void;
  onAddBooking?: (booking: AttendeeBooking) => void;
  onShowToast: (msg: string) => void;
}

export const AttendeeManifestView: React.FC<AttendeeManifestViewProps> = ({
  attendees,
  concerts,
  onAddBooking,
  onShowToast
}) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedConcert, setSelectedConcert] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedAttendee, setSelectedAttendee] = useState<AttendeeBooking | null>(null);

  // Extract unique ticket categories
  const categoriesList = useMemo(() => {
    const set = new Set<string>();
    attendees.forEach((a) => {
      if (a.ticketTier) set.add(a.ticketTier);
    });
    return Array.from(set).sort();
  }, [attendees]);

  const filteredAttendees = useMemo(() => {
    return attendees.filter((item) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.ticketCode.toLowerCase().includes(q) ||
        item.concertTitle.toLowerCase().includes(q) ||
        item.ticketTier.toLowerCase().includes(q) ||
        item.orderNumber.toLowerCase().includes(q) ||
        item.customerName.toLowerCase().includes(q);

      if (!matchesSearch) return false;
      if (
        selectedConcert !== 'all' &&
        item.concertId !== selectedConcert &&
        item.concertTitle !== selectedConcert
      ) {
        return false;
      }
      if (selectedCategory !== 'all' && item.ticketTier !== selectedCategory) {
        return false;
      }

      return true;
    });
  }, [attendees, search, selectedConcert, selectedCategory]);

  const totalPages = Math.max(1, Math.ceil(filteredAttendees.length / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const startIdx = (safePage - 1) * pageSize;
  const paginatedAttendees = filteredAttendees.slice(startIdx, startIdx + pageSize);

  const totalTicketsCount = attendees.reduce((acc, a) => acc + (a.seatsCount || 1), 0);
  const totalRevenue = attendees.reduce((acc, a) => acc + a.totalPaid, 0);

  const activeAttendee = selectedAttendee
    ? attendees.find((a) => a.id === selectedAttendee.id) || selectedAttendee
    : null;

  const handleExportCSV = () => {
    const headers = [
      'Ticket ID',
      'Order Number',
      'Event Name',
      'Total Tickets',
      'Ticket Price (INR)',
      'Ticket Category',
      'Date',
      'Customer Name',
      'Customer Email',
      'Customer Phone'
    ];
    const rows = filteredAttendees.map((a) => [
      a.ticketCode,
      a.orderNumber,
      `"${a.concertTitle}"`,
      a.seatsCount,
      a.totalPaid,
      `"${a.ticketTier}"`,
      a.purchaseDate,
      `"${a.customerName}"`,
      a.customerEmail,
      a.customerPhone
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Ticket_Bookings_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast('Ticket bookings CSV exported successfully!');
  };

  const columns: Column<AttendeeBooking>[] = [
    {
      key: 'ticketCode',
      header: 'Ticket ID',
      width: 'min-w-[140px]',
      render: (item) => (
        <span className="font-mono text-xs font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200/80 whitespace-nowrap">
          {item.ticketCode}
        </span>
      )
    },
    {
      key: 'concertTitle',
      header: 'Event / Concert Name',
      render: (item) => (
        <span className="font-semibold text-slate-900 block truncate max-w-sm">
          {item.concertTitle}
        </span>
      )
    },
    {
      key: 'seatsCount',
      header: 'Total Tickets',
      render: (item) => (
        <span className="font-medium text-slate-800 whitespace-nowrap text-xs">
          {item.seatsCount} {item.seatsCount === 1 ? 'ticket' : 'tickets'}
        </span>
      )
    },
    {
      key: 'totalPaid',
      header: 'Ticket Price',
      render: (item) => (
        <span className="font-semibold text-slate-900 whitespace-nowrap text-xs">
          ₹{item.totalPaid.toLocaleString()}
        </span>
      )
    },
    {
      key: 'ticketTier',
      header: 'Ticket Category',
      render: (item) => {
        const lower = item.ticketTier.toLowerCase();
        const tierStyle = lower.includes('vvip')
          ? 'text-amber-700 bg-amber-50 border-amber-200'
          : lower.includes('vip')
            ? 'text-purple-700 bg-purple-50 border-purple-200'
            : lower.includes('standing') || lower.includes('phase')
              ? 'text-blue-700 bg-blue-50 border-blue-200'
              : 'text-emerald-700 bg-emerald-50 border-emerald-200';

        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${tierStyle} whitespace-nowrap`}
          >
            {item.ticketTier}
          </span>
        );
      }
    },
    {
      key: 'purchaseDate',
      header: 'Date',
      render: (item) => (
        <span className="text-slate-600 whitespace-nowrap text-xs font-normal">
          {formatUtcDate(item.purchaseDate)}
        </span>
      )
    },
    {
      key: 'action',
      header: 'Action',
      align: 'right',
      render: (item) => (
        <div className="flex items-center justify-end" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            title="View Ticket Details"
            onClick={() => setSelectedAttendee(item)}
            className="p-1.5 rounded-md bg-purple-50 text-purple-600 hover:bg-purple-100 hover:text-purple-700 border border-purple-200/80 transition-all cursor-pointer shadow-2xs"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  const hasActiveFilters =
    search.trim() !== '' || selectedConcert !== 'all' || selectedCategory !== 'all';

  const handleResetFilters = () => {
    setSearch('');
    setSelectedConcert('all');
    setSelectedCategory('all');
    setPage(1);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="rounded-lg border border-slate-200/90 bg-white p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="PageTitle">
            Ticket Bookings
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Confirmed ticket reservations, ticket categories, seats booked, and total order amounts.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0 flex-wrap">
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold bg-white border border-slate-200/90 text-slate-700 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
          >
            <Download className="h-4 w-4 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/concerts/booking')}
            className="flex items-center gap-2 px-4 py-2 rounded-md text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-200 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Book Ticket</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Bookings"
          value={attendees.length}
          isPositive={true}
          icon={Ticket}
          accentColor="purple"
        />

        <MetricCard
          label="Total Tickets Sold"
          value={totalTicketsCount}
          isPositive={true}
          icon={Users}
          accentColor="emerald"
        />

        <MetricCard
          label="Total Revenue"
          value={`₹${(totalRevenue / 100000).toFixed(1)} L`}
          isPositive={true}
          icon={DollarSign}
          accentColor="cyan"
        />

        <MetricCard
          label="Avg. Booking Amount"
          value={`₹${
            attendees.length > 0 ? Math.round(totalRevenue / attendees.length).toLocaleString() : 0
          }`}
          isPositive={true}
          icon={Calendar}
          accentColor="amber"
        />
      </div>

      {/* Unified Search, Filters, and Table Card */}
      <div className="rounded-2xl border border-slate-200/90 bg-white shadow-2xs overflow-hidden">
        {/* Search & Filter Toolbar Header */}
        <div className="p-4 border-b border-slate-100 bg-white flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="relative flex-1 sm:max-w-xs md:max-w-sm group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-purple-600 transition-colors pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by ticket ID, concert, or category..."
              className="w-full h-10 rounded-md border border-slate-200/90 bg-white hover:bg-slate-50 focus:bg-white pl-10 pr-9 py-2 text-xs sm:text-[13px] text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
                title="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
            {/* Concert Filter Dropdown */}
            <div className="relative inline-flex items-center group">
              <select
                value={selectedConcert}
                onChange={(e) => {
                  setSelectedConcert(e.target.value);
                  setPage(1);
                }}
                className={`appearance-none h-10 rounded-md border pl-3.5 pr-8 py-2 text-xs sm:text-[13px] font-medium outline-none transition-all cursor-pointer shadow-2xs ${
                  selectedConcert !== 'all'
                    ? 'bg-purple-50/80 text-purple-900 border-purple-200'
                    : 'bg-white hover:bg-white border-slate-200/90 text-slate-700'
                }`}
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

            {/* Category Filter Dropdown */}
            <div className="relative inline-flex items-center group">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setPage(1);
                }}
                className={`appearance-none h-10 rounded-md border pl-3.5 pr-8 py-2 text-xs sm:text-[13px] font-medium outline-none transition-all cursor-pointer shadow-2xs ${
                  selectedCategory !== 'all'
                    ? 'bg-purple-50/80 text-purple-900 border-purple-200'
                    : 'bg-white hover:bg-white border-slate-200/90 text-slate-700'
                }`}
              >
                <option value="all">All Categories</option>
                {categoriesList.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>

            {/* Reset Filters button */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="h-10 px-3 rounded-md border border-rose-200/80 bg-rose-50/70 text-rose-700 hover:bg-rose-100 hover:border-rose-300 text-xs font-semibold transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-2xs shrink-0"
                title="Reset all filters"
              >
                <X className="h-3.5 w-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Table with Attached Pagination */}
        <Table
          columns={columns}
          data={paginatedAttendees}
          keyExtractor={(a) => a.id}
          showPagination={false}
          containerClassName="border-0 rounded-none shadow-none bg-transparent"
          emptyMessage="No ticket bookings found matching filter."
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
                itemName="bookings"
              />
            ) : null
          }
        />
      </div>

      {/* Ticket Booking Details Modal */}
      {activeAttendee && (
        <Modal
          isOpen={!!activeAttendee}
          onClose={() => setSelectedAttendee(null)}
          title="Ticket Booking Details"
          subtitle={`Ticket ID: ${activeAttendee.ticketCode} • Order #${activeAttendee.orderNumber}`}
          maxWidth="lg"
        >
          <div className="space-y-4">
            {/* Booking Summary Box */}
            <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/60 flex items-center justify-between">
              <div>
                <span className="text-xs text-purple-600 font-medium block">Total Paid</span>
                <span className="text-xl font-bold text-slate-900 tracking-tight">
                  ₹{activeAttendee.totalPaid.toLocaleString()}
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Booked on {formatUtcDate(activeAttendee.purchaseDate)}
                </span>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Confirmed
              </span>
            </div>

            {/* Event & Category Grid */}
            <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <Building2 className="h-4 w-4 text-purple-600" />
                <h3 className="text-xs font-semibold text-slate-700 tracking-wider uppercase">
                  Event & Ticket Details
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 font-normal block">Event / Concert</span>
                  <span className="font-semibold text-slate-900 block mt-0.5">
                    {activeAttendee.concertTitle}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 font-normal block">Ticket Category</span>
                  <span className="font-semibold text-purple-700 block mt-0.5">
                    {activeAttendee.ticketTier}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 font-normal block">Total Tickets / Seats</span>
                  <span className="font-semibold text-slate-900 block mt-0.5">
                    {activeAttendee.seatsCount} {activeAttendee.seatsCount === 1 ? 'Seat' : 'Seats'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 font-normal block">Booking Date</span>
                  <span className="font-semibold text-slate-900 block mt-0.5">
                    {formatUtcDate(activeAttendee.purchaseDate)}
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Details */}
            <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <User className="h-4 w-4 text-purple-600" />
                <h3 className="text-xs font-semibold text-slate-700 tracking-wider uppercase">
                  Customer Information
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 font-normal block">Customer Name</span>
                  <span className="font-semibold text-slate-900 block mt-0.5">
                    {activeAttendee.customerName}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 font-normal block">Email Address</span>
                  <span className="font-medium text-slate-800 block mt-0.5 truncate">
                    {activeAttendee.customerEmail}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 font-normal block">Phone Number</span>
                  <span className="font-medium text-slate-800 block mt-0.5">
                    {activeAttendee.customerPhone}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-3.5 py-2 rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                <Printer className="h-3.5 w-3.5 text-slate-600" />
                <span>Print Receipt</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedAttendee(null)}
                className="px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AttendeeManifestView;
