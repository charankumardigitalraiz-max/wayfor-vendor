import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Ticket,
  MapPin,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  CreditCard,
  Banknote,
  Smartphone,
  CheckCircle2,
  Printer,
  Sparkles,
  RotateCcw,
  Zap,
  Crown,
  Users,
  ChevronDown,
  Search,
  X,
  ArrowLeft,
  ShieldCheck,
  Check,
  Plus
} from 'lucide-react';
import type { ConcertEvent, TicketTier, AttendeeBooking } from '../../types';
import { AppImage } from '../common/AppImage';
import { vendorConcertService } from '../../services/vendorConcertService';
import { formatUtcDate } from '../../utils/dateUtils';

export interface BookTicketScreenProps {
  concerts?: ConcertEvent[];
  onAddBooking?: (booking: AttendeeBooking) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const BookTicketScreen: React.FC<BookTicketScreenProps> = ({
  concerts: propConcerts,
  onAddBooking,
  onShowToast
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlConcertId = searchParams.get('concertId');

  // Fallback to concerts from service if not passed via props
  const [concertsList, setConcertsList] = useState<ConcertEvent[]>(() => {
    if (propConcerts && propConcerts.length > 0) return propConcerts;
    return vendorConcertService.getStoredConcerts();
  });

  useEffect(() => {
    if (propConcerts && propConcerts.length > 0) {
      setConcertsList(propConcerts);
    }
  }, [propConcerts]);

  // Selected Concert
  const initialConcertId = useMemo(() => {
    if (urlConcertId && concertsList.some((c) => c.id === urlConcertId)) {
      return urlConcertId;
    }
    return concertsList[0]?.id || '';
  }, [urlConcertId, concertsList]);

  const [selectedConcertId, setSelectedConcertId] = useState<string>(initialConcertId);

  useEffect(() => {
    if (urlConcertId && concertsList.some((c) => c.id === urlConcertId)) {
      setSelectedConcertId(urlConcertId);
    }
  }, [urlConcertId, concertsList]);

  const activeConcert = useMemo(() => {
    return concertsList.find((c) => c.id === selectedConcertId) || concertsList[0] || null;
  }, [concertsList, selectedConcertId]);

  // Selected Tier
  const [selectedTierId, setSelectedTierId] = useState<string>('');

  useEffect(() => {
    if (activeConcert?.ticketTiers && activeConcert.ticketTiers.length > 0) {
      const firstAvailable =
        activeConcert.ticketTiers.find((t) => t.available > 0) || activeConcert.ticketTiers[0];
      setSelectedTierId(firstAvailable.id);
    }
  }, [activeConcert]);

  const selectedTier: TicketTier = useMemo(() => {
    if (!activeConcert || !activeConcert.ticketTiers || activeConcert.ticketTiers.length === 0) {
      return { id: 't-default', name: 'General Admission', price: 1999, available: 100, total: 500 };
    }
    return (
      activeConcert.ticketTiers.find((t) => t.id === selectedTierId) ||
      activeConcert.ticketTiers[0]
    );
  }, [activeConcert, selectedTierId]);

  // Number of seats selection (1 to 10)
  const [selectedSeats, setSelectedSeats] = useState<number>(2);

  // Customer Details
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customGate, setCustomGate] = useState('');

  // Payment Options
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Cash' | 'Card'>('UPI');
  const [cashTendered, setCashTendered] = useState<string>('');

  // Form Validation & Submitting state
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Success Confirmation State (Shows dedicated issued ticket slip)
  const [issuedBooking, setIssuedBooking] = useState<AttendeeBooking | null>(null);

  // Searchable Event Dropdown State
  const [isEventDropdownOpen, setIsEventDropdownOpen] = useState(false);
  const [eventSearchQuery, setEventSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsEventDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredConcerts = useMemo(() => {
    return concertsList.filter((c) => {
      const query = eventSearchQuery.toLowerCase();
      const matchesQuery =
        !query ||
        c.title.toLowerCase().includes(query) ||
        c.venueName?.toLowerCase().includes(query) ||
        c.city?.toLowerCase().includes(query) ||
        c.artist?.toLowerCase().includes(query);

      const concertDate = c.date || (c as any).startDate || '';
      const matchesDate = !dateFilter || concertDate.startsWith(dateFilter);
      return matchesQuery && matchesDate;
    });
  }, [concertsList, eventSearchQuery, dateFilter]);

  // Calculations
  const ticketSubtotal = (selectedTier?.price || 0) * selectedSeats;
  const bookingFee = 150;
  const totalPayable = ticketSubtotal + bookingFee;

  const tenderedAmount = Number(cashTendered) || 0;
  const changeDue =
    paymentMethod === 'Cash' && tenderedAmount > totalPayable ? tenderedAmount - totalPayable : 0;

  // Tier Theme Helper (Neat & Professional Accent Badges)
  const getTierIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('pit') || lower.includes('front')) return Zap;
    if (lower.includes('vip') || lower.includes('royal') || lower.includes('vvip')) return Crown;
    if (lower.includes('gold') || lower.includes('early')) return Sparkles;
    return Users;
  };

  const handleResetForm = () => {
    setSelectedSeats(2);
    setCustomerName('');
    setCustomerEmail('');
    setCustomerPhone('');
    setCustomGate('');
    setCashTendered('');
    setFormErrors({});
    if (activeConcert?.ticketTiers?.[0]) {
      setSelectedTierId(activeConcert.ticketTiers[0].id);
    }
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!customerName.trim()) {
      errors.customerName = 'Attendee full name is required';
    }
    if (!customerEmail.trim()) {
      errors.customerEmail = 'Customer email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.trim())) {
      errors.customerEmail = 'Please enter a valid email address';
    }
    if (!customerPhone.trim()) {
      errors.customerPhone = 'Mobile contact number is required';
    } else if (customerPhone.replace(/\D/g, '').length < 10) {
      errors.customerPhone = 'Enter a valid 10-digit phone number';
    }

    if (selectedTier.available !== undefined && selectedSeats > selectedTier.available) {
      errors.seats = `Only ${selectedTier.available} seats available in ${selectedTier.name}`;
    }

    if (paymentMethod === 'Cash' && cashTendered && tenderedAmount < totalPayable) {
      errors.cash = `Cash tendered (₹${tenderedAmount}) is less than total payable (₹${totalPayable})`;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();

    if (!activeConcert) {
      onShowToast('Please select a valid concert to book.', 'error');
      return;
    }

    if (!validate()) {
      onShowToast('Please fix the errors in the booking form.', 'error');
      return;
    }

    setIsSubmitting(true);

    const randomTicketCode = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
    const randomOrderNumber = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const defaultGate = selectedTier.name.toLowerCase().includes('vip')
      ? 'Gate 1 (VIP Fastrack)'
      : 'Gate 2 (General Entry)';
    const gateToAssign = customGate.trim() || defaultGate;

    const newBooking: AttendeeBooking = {
      id: `bk-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      orderNumber: randomOrderNumber,
      concertId: activeConcert.id,
      concertTitle: activeConcert.title,
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim(),
      customerPhone: customerPhone.trim(),
      ticketTier: selectedTier.name,
      seatsCount: selectedSeats,
      totalPaid: totalPayable,
      currency: activeConcert.currency || 'INR',
      purchaseDate: new Date().toISOString(),
      ticketCode: randomTicketCode,
      checkedIn: false,
      gateNumber: gateToAssign
    };

    try {
      if (onAddBooking) {
        onAddBooking(newBooking);
      } else {
        const current = vendorConcertService.getAttendees();
        const updated = [newBooking, ...current];
        vendorConcertService.saveAttendees(updated);
      }

      setIssuedBooking(newBooking);
      onShowToast(`Ticket ${randomTicketCode} issued successfully to ${customerName.trim()}!`, 'success');
      handleResetForm();
    } catch (err) {
      console.error('Failed to issue ticket booking:', err);
      onShowToast('Failed to issue ticket. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If a booking was just issued, render the receipt view
  if (issuedBooking) {
    return (
      <div className="space-y-5 font-sans antialiased text-slate-800 max-w-5xl mx-auto py-2">
        {/* Top Breadcrumb & Action bar */}
        <div className="flex items-center justify-between gap-3 bg-white px-5 py-3.5 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/attendees')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-purple-700 bg-slate-50 hover:bg-purple-50 px-3 py-1.5 rounded-lg border border-slate-200/90 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Bookings</span>
            </button>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Booking Confirmed
              </span>
              <span className="font-mono text-xs font-medium text-slate-700">
                {issuedBooking.ticketCode}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 cursor-pointer shadow-2xs transition-all"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print Pass</span>
            </button>

            <button
              type="button"
              onClick={() => setIssuedBooking(null)}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium cursor-pointer shadow-sm shadow-purple-200 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Book Another Ticket</span>
            </button>
          </div>
        </div>

        {/* Digital Ticket Pass Card */}
        <div className="bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white rounded-2xl border border-purple-800/40 shadow-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

          {/* Ticket Header */}
          <div className="p-6 sm:p-8 border-b border-white/10 relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-medium tracking-wider uppercase bg-purple-500/20 text-purple-300 border border-purple-400/30">
                  OFFICIAL ADMISSION PASS
                </span>
                <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  CONFIRMED & PAID
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
                {issuedBooking.concertTitle}
              </h2>
              <p className="text-xs text-purple-200/80 mt-1 flex items-center gap-1.5">
                <span>Order Ref: <span className="font-mono font-medium text-white">{issuedBooking.orderNumber}</span></span>
                <span>•</span>
                <span>Issued at Box Office POS Counter</span>
              </p>
            </div>

            <div className="text-left sm:text-right shrink-0">
              <span className="text-[10px] uppercase font-medium text-white/50 block">Ticket Code</span>
              <span className="font-mono text-xl sm:text-2xl font-semibold text-purple-300 tracking-wider">
                {issuedBooking.ticketCode}
              </span>
            </div>
          </div>

          {/* Ticket Details Grid */}
          <div className="p-6 sm:p-8 grid grid-cols-2 sm:grid-cols-4 gap-6 border-b border-white/10 relative z-10 text-xs">
            <div>
              <span className="text-[10px] uppercase font-medium text-white/50 block mb-1">
                Attendee
              </span>
              <span className="text-sm font-medium text-white block">
                {issuedBooking.customerName}
              </span>
              <span className="text-[11px] text-purple-200/80 block mt-0.5 font-mono">
                {issuedBooking.customerPhone}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-medium text-white/50 block mb-1">
                Tier & Seats
              </span>
              <span className="text-sm font-medium text-white block">
                {issuedBooking.ticketTier}
              </span>
              <span className="text-[11px] text-emerald-300 font-medium block mt-0.5">
                {issuedBooking.seatsCount} {issuedBooking.seatsCount > 1 ? 'Admissions' : 'Admission'}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-medium text-white/50 block mb-1">
                Assigned Gate
              </span>
              <span className="text-sm font-medium text-white block">
                {issuedBooking.gateNumber || 'Gate 2 (General Entry)'}
              </span>
              <span className="text-[11px] text-white/60 block mt-0.5">
                Fastrack Verification
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-medium text-white/50 block mb-1">
                Total Paid
              </span>
              <span className="text-lg font-semibold text-emerald-400 block leading-tight">
                ₹{issuedBooking.totalPaid.toLocaleString()}
              </span>
              <span className="text-[10px] text-white/60 block mt-0.5">
                All fees included
              </span>
            </div>
          </div>

          {/* Barcode Mock & Audit Footer */}
          <div className="p-6 sm:p-8 bg-black/20 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-lg p-1.5 flex items-center justify-center shrink-0">
                <Ticket className="w-8 h-8 text-purple-900" />
              </div>
              <div>
                <p className="text-xs font-medium text-white">Present pass at the venue arena gate</p>
                <p className="text-[11px] text-white/60">
                  Issued on {formatUtcDate(issuedBooking.purchaseDate)} • Valid for single scan admission
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/attendees')}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors cursor-pointer"
              >
                View in All Bookings
              </button>
              <button
                type="button"
                onClick={() => setIssuedBooking(null)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium transition-colors cursor-pointer shadow-md"
              >
                Issue Next Ticket
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!activeConcert) {
    return (
      <div className="rounded-xl border border-slate-200/90 bg-white p-8 text-center space-y-4 max-w-xl mx-auto mt-10 shadow-2xs">
        <Ticket className="w-12 h-12 text-slate-300 mx-auto" />
        <div>
          <h2 className="text-base font-semibold text-slate-900">No Concerts Available</h2>
          <p className="text-xs text-slate-500 mt-1">
            Please create an active concert first before issuing counter tickets.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/concerts')}
          className="px-4 py-2 bg-purple-600 text-white text-xs font-medium rounded-lg hover:bg-purple-700 transition-colors"
        >
          Go to My Concerts
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5 font-sans antialiased text-slate-800 max-w-7xl mx-auto">
      {/* Top Header & Event Switcher */}
      <div className="bg-white px-5 py-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/attendees')}
            title="Back to Ticket Bookings"
            className="w-10 h-10 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 flex items-center justify-center border border-purple-200/70 transition-colors cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="PageTitle">Box Office Ticket Booking</h1>
              <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Ready for Sale
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Select an arena event, choose your tier class, and assign seat quantities.
            </p>
          </div>
        </div>

        {/* Searchable Concert Selector Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl border border-slate-200/90 shadow-2xs">
            <span className="text-xs font-medium text-slate-500 pl-2 shrink-0 hidden sm:inline">
              Selected Event:
            </span>
            <button
              type="button"
              onClick={() => setIsEventDropdownOpen(!isEventDropdownOpen)}
              className="px-3 py-1.5 text-xs font-medium bg-white border border-slate-200 rounded-lg text-slate-900 hover:border-purple-400 focus:outline-none transition-all flex items-center justify-between gap-2 shadow-2xs min-w-[240px] max-w-sm cursor-pointer"
            >
              <div className="flex items-center gap-2 truncate text-left">
                <Calendar className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span className="truncate">{activeConcert.title}</span>
                <span className="text-[10px] font-mono text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded shrink-0 font-medium">
                  {activeConcert.date || (activeConcert as any).startDate || 'Live'}
                </span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isEventDropdownOpen ? 'rotate-180 text-purple-600' : ''
                  }`}
              />
            </button>
          </div>

          {/* Floating Searchable Menu Panel */}
          {isEventDropdownOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-80 sm:w-96 bg-white rounded-xl border border-slate-200 shadow-xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              {/* Filter Controls: Search Input + Date Picker */}
              <div className="space-y-2 mb-2 pb-2 border-b border-slate-100">
                {/* Search Text Input */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    autoFocus
                    value={eventSearchQuery}
                    onChange={(e) => setEventSearchQuery(e.target.value)}
                    placeholder="Search by title, artist, or venue..."
                    className="w-full pl-8 pr-7 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600 font-normal"
                  />
                  {eventSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setEventSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Date Picker Input */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Calendar className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="date"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="w-full pl-8 pr-2.5 py-1 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white text-slate-800 focus:outline-none focus:border-purple-600 cursor-pointer font-normal"
                    />
                  </div>
                  {dateFilter && (
                    <button
                      type="button"
                      onClick={() => setDateFilter('')}
                      className="px-2 py-1 text-[11px] font-medium text-rose-600 hover:bg-rose-50 rounded border border-rose-200 cursor-pointer"
                    >
                      Clear Date
                    </button>
                  )}
                </div>
              </div>

              {/* Event Items List */}
              <div className="max-h-60 overflow-y-auto space-y-1 pr-0.5 divide-y divide-slate-50">
                {filteredConcerts.length === 0 ? (
                  <div className="text-center py-4 text-xs text-slate-400">
                    No concerts found matching the selected filters.
                  </div>
                ) : (
                  filteredConcerts.map((c) => {
                    const isSelected = c.id === selectedConcertId;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setSelectedConcertId(c.id);
                          if (c.ticketTiers?.[0]) {
                            setSelectedTierId(c.ticketTiers[0].id);
                          }
                          setIsEventDropdownOpen(false);
                          setEventSearchQuery('');
                          setDateFilter('');
                        }}
                        className={`w-full p-2.5 rounded-lg text-left transition-all flex items-center justify-between gap-2.5 cursor-pointer ${isSelected
                            ? 'bg-purple-50/80 text-purple-900 border border-purple-200/60'
                            : 'hover:bg-slate-50 text-slate-800'
                          }`}
                      >
                        <div className="min-w-0">
                          <h5 className="font-medium text-xs truncate leading-tight block">
                            {c.title}
                          </h5>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                            <span className="flex items-center gap-1 font-mono text-purple-600 font-medium">
                              <Calendar className="w-3 h-3 text-purple-600" />
                              {c.date || (c as any).startDate}
                            </span>
                            <span>•</span>
                            <span className="truncate">{c.venueName || c.city || 'Arena'}</span>
                          </div>
                        </div>

                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-purple-600 shrink-0" />
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main 2-Column POS Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ========================================================= */}
        {/* LEFT COLUMN: TIER SELECTION & NUMBER OF SEATS (7-8 COLS)  */}
        {/* ========================================================= */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          {/* Active Concert Card Banner */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/80">
                <AppImage
                  src={activeConcert.image}
                  alt={activeConcert.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded border border-purple-200/70">
                    {activeConcert.genre || 'Live Concert'}
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs font-medium text-slate-600">
                    {activeConcert.artist}
                  </span>
                </div>
                <h2 className="text-base font-semibold text-slate-900 leading-snug mt-1">
                  {activeConcert.title}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-slate-500 text-xs mt-1.5">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    {activeConcert.venueName || activeConcert.venue || activeConcert.city}
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-purple-600" />
                    {formatUtcDate(activeConcert.date || (activeConcert as any).startDate)}
                  </span>
                  {activeConcert.doorsOpen && (
                    <>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        Doors: {activeConcert.doorsOpen}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="shrink-0 text-left sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
              <span className="text-[10px] text-slate-400 font-medium block uppercase tracking-wider">
                Network Sales
              </span>
              <span className="text-sm font-semibold text-slate-900 block mt-0.5">
                {(activeConcert.ticketsSold || 0).toLocaleString()} / {(activeConcert.totalCapacity || 1000).toLocaleString()}
              </span>
              <span className="text-[11px] text-emerald-600 font-medium block">
                {Math.round(((activeConcert.ticketsSold || 0) / (activeConcert.totalCapacity || 1000)) * 100)}% Capacity Sold
              </span>
            </div>
          </div>

          {/* Step 1: Click on Tier to Select */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-purple-600 text-white font-medium text-[11px] flex items-center justify-center">
                  1
                </span>
                <h3 className="font-semibold text-slate-900 text-xs uppercase tracking-wider">
                  Select Seating Tier
                </h3>
              </div>
              <span className="text-xs text-slate-500">
                Selected Tier: <span className="font-medium text-purple-700">{selectedTier.name}</span>
              </span>
            </div>

            {/* Clean Compact Tier Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {(activeConcert.ticketTiers || []).map((tier) => {
                const isSelected = tier.id === selectedTierId;
                const isSoldOut = tier.available !== undefined && tier.available <= 0;
                const IconComp = getTierIcon(tier.name);

                return (
                  <div
                    key={tier.id}
                    onClick={() => {
                      if (!isSoldOut) {
                        setSelectedTierId(tier.id);
                      }
                    }}
                    className={`px-4 py-3.5 rounded-xl border-2 transition-all cursor-pointer relative flex items-center justify-between gap-3 ${isSoldOut
                        ? 'opacity-60 bg-slate-50 border-slate-200 cursor-not-allowed'
                        : isSelected
                          ? 'border-purple-600 bg-purple-50/50 shadow-xs ring-1 ring-purple-500/20'
                          : 'border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${isSelected
                            ? 'bg-purple-600 text-white shadow-2xs'
                            : 'bg-purple-50 text-purple-700 border border-purple-200/70'
                          }`}
                      >
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-medium text-slate-900 text-xs sm:text-sm leading-tight truncate">
                            {tier.name}
                          </h4>
                          {isSelected && (
                            <span className="w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0 text-[10px]">
                              ✓
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {isSoldOut ? (
                            <span className="text-[10px] font-medium text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded">
                              Sold Out
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-500 font-mono block">
                              {tier.available !== undefined ? `${tier.available} available` : 'In Stock'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-sm sm:text-base font-semibold text-slate-900 block">
                        ₹{tier.price.toLocaleString()}
                      </span>
                      <span className="text-[10px] font-medium text-slate-400 block">
                        per seat
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            {formErrors.seats && (
              <p className="text-xs text-rose-600 font-medium">{formErrors.seats}</p>
            )}
          </div>

          {/* Step 2: Number of Seats Selection */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-purple-600 text-white font-medium text-[11px] flex items-center justify-center">
                  2
                </span>
                <h3 className="font-semibold text-slate-900 text-xs uppercase tracking-wider">
                  Select Number of Seats
                </h3>
              </div>
              <span className="text-xs font-medium text-slate-600">
                {selectedSeats} {selectedSeats > 1 ? 'Seats Selected' : 'Seat Selected'}
              </span>
            </div>

            {/* Seat Pills Buttons */}
            <div className="pt-1">
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((seatNum) => {
                  const isSeatSelected = selectedSeats === seatNum;
                  const isExceeding =
                    selectedTier.available !== undefined && seatNum > selectedTier.available;

                  return (
                    <button
                      key={seatNum}
                      type="button"
                      disabled={isExceeding}
                      onClick={() => setSelectedSeats(seatNum)}
                      className={`h-11 rounded-xl text-xs font-medium transition-all duration-150 flex flex-col items-center justify-center select-none border cursor-pointer ${isExceeding
                          ? 'opacity-40 bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                          : isSeatSelected
                            ? 'bg-purple-600 text-white border-purple-600 shadow-sm shadow-purple-500/25 ring-2 ring-purple-500/20 scale-[1.03]'
                            : 'bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700 border-slate-200/90 shadow-2xs active:scale-95'
                        }`}
                    >
                      <span className="text-sm font-medium leading-none">{seatNum}</span>
                      <span
                        className={`text-[9px] uppercase font-medium mt-0.5 tracking-tight ${isSeatSelected ? 'text-purple-100' : 'text-slate-400'
                          }`}
                      >
                        {seatNum === 1 ? 'Seat' : 'Seats'}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-slate-500 bg-slate-50 px-3.5 py-2 rounded-lg border border-slate-100">
                <span>Selected Tier Subtotal:</span>
                <span className="font-medium text-slate-900">
                  ₹{selectedTier.price.toLocaleString()} × {selectedSeats} ={' '}
                  <span className="text-purple-700 font-semibold">₹{ticketSubtotal.toLocaleString()}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: ATTENDEE DETAILS & INSTANT CHECKOUT (4-5 COLS)*/}
        {/* ========================================================= */}
        <div className="lg:col-span-5 xl:col-span-4 bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-4 sticky top-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-purple-600 text-white font-medium text-[11px] flex items-center justify-center">
                3
              </span>
              <h3 className="font-semibold text-slate-900 text-sm">Attendee & Checkout</h3>
            </div>
            <button
              type="button"
              onClick={handleResetForm}
              className="text-[11px] font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 px-2 py-1 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          <form onSubmit={handleCheckout} className="space-y-3.5">
            {/* Customer Name */}
            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">
                Attendee Full Name *
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => {
                    setCustomerName(e.target.value);
                    if (formErrors.customerName) {
                      setFormErrors((prev) => ({ ...prev, customerName: '' }));
                    }
                  }}
                  placeholder="Enter customer full name"
                  className={`w-full pl-9 pr-3 py-2 text-xs rounded-lg border bg-white placeholder-slate-400 text-slate-800 focus:outline-none transition-all ${formErrors.customerName
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                      : 'border-slate-200 focus:border-purple-600 focus:ring-1 focus:ring-purple-600'
                    }`}
                />
              </div>
              {formErrors.customerName && (
                <p className="text-[10px] text-rose-600 font-medium mt-1">
                  {formErrors.customerName}
                </p>
              )}
            </div>

            {/* Customer Email */}
            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">
                Email Address (for e-Tickets) *
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => {
                    setCustomerEmail(e.target.value);
                    if (formErrors.customerEmail) {
                      setFormErrors((prev) => ({ ...prev, customerEmail: '' }));
                    }
                  }}
                  placeholder="customer@example.com"
                  className={`w-full pl-9 pr-3 py-2 text-xs rounded-lg border bg-white placeholder-slate-400 text-slate-800 focus:outline-none transition-all ${formErrors.customerEmail
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                      : 'border-slate-200 focus:border-purple-600 focus:ring-1 focus:ring-purple-600'
                    }`}
                />
              </div>
              {formErrors.customerEmail && (
                <p className="text-[10px] text-rose-600 font-medium mt-1">
                  {formErrors.customerEmail}
                </p>
              )}
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">
                Mobile Number (for SMS Passes) *
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => {
                    setCustomerPhone(e.target.value);
                    if (formErrors.customerPhone) {
                      setFormErrors((prev) => ({ ...prev, customerPhone: '' }));
                    }
                  }}
                  placeholder="+91 98765 43210"
                  className={`w-full pl-9 pr-3 py-2 text-xs rounded-lg border bg-white placeholder-slate-400 text-slate-800 focus:outline-none transition-all ${formErrors.customerPhone
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                      : 'border-slate-200 focus:border-purple-600 focus:ring-1 focus:ring-purple-600'
                    }`}
                />
              </div>
              {formErrors.customerPhone && (
                <p className="text-[10px] text-rose-600 font-medium mt-1">
                  {formErrors.customerPhone}
                </p>
              )}
            </div>

            {/* Gate Number / Entry Point */}
            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">
                Gate Entrance
              </label>
              <input
                type="text"
                value={customGate}
                onChange={(e) => setCustomGate(e.target.value)}
                placeholder={
                  selectedTier.name.toLowerCase().includes('vip')
                    ? 'Gate 1 (VIP Fastrack)'
                    : 'Gate 2 (General Entry)'
                }
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white placeholder-slate-400 text-slate-800 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
              />
            </div>

            {/* Payment Method Selector */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-[11px] font-medium text-slate-700 mb-1.5">
                Payment Channel
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'UPI', label: 'UPI / QR', icon: Smartphone },
                  { id: 'Cash', label: 'Cash', icon: Banknote },
                  { id: 'Card', label: 'Card Swipe', icon: CreditCard }
                ].map((mode) => {
                  const ModeIcon = mode.icon;
                  const isSelected = paymentMethod === mode.id;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setPaymentMethod(mode.id as any)}
                      className={`p-2.5 rounded-xl border text-xs font-medium flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${isSelected
                          ? 'bg-purple-50/80 border-purple-600 text-purple-700 shadow-2xs ring-1 ring-purple-500/20 scale-[1.02]'
                          : 'bg-white border-slate-200/90 hover:bg-slate-50 hover:border-slate-300 text-slate-700 shadow-2xs active:scale-95'
                        }`}
                    >
                      <ModeIcon
                        className={`w-4 h-4 ${isSelected ? 'text-purple-600' : 'text-slate-400'}`}
                      />
                      <span>{mode.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Cash Tender Input */}
              {paymentMethod === 'Cash' && (
                <div className="mt-2.5 p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-medium text-slate-500 block">
                      Cash Received:
                    </span>
                    <input
                      type="number"
                      value={cashTendered}
                      onChange={(e) => setCashTendered(e.target.value)}
                      placeholder="₹ Tendered"
                      className="w-28 px-2 py-1 bg-white border border-slate-200 rounded text-xs font-medium font-mono text-slate-900 mt-0.5"
                    />
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-medium text-slate-500 block">
                      Change to Return:
                    </span>
                    <span className="font-semibold text-sm text-emerald-600 block mt-0.5">
                      ₹{changeDue.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
              {formErrors.cash && (
                <p className="text-[10px] text-rose-600 font-medium mt-1">
                  {formErrors.cash}
                </p>
              )}
            </div>

            {/* Bill Summary Calculation */}
            <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>
                  {selectedTier.name} (×{selectedSeats}):
                </span>
                <span className="font-medium text-slate-900">
                  ₹{ticketSubtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>Lanyard & Box Office Fee:</span>
                <span>₹{bookingFee}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-semibold text-slate-900">
                <span>Total Amount Due:</span>
                <span className="text-purple-700 text-base font-semibold">
                  ₹{totalPayable.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Action Trigger */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 active:scale-[0.99] disabled:opacity-50 text-white rounded-xl text-xs font-medium shadow-md shadow-purple-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Issuing Pass...' : 'Confirm & Issue Admission Pass'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookTicketScreen;

