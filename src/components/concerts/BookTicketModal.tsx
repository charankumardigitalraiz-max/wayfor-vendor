import React, { useState, useEffect } from 'react';
import {
  Ticket,
  User,
  Mail,
  Phone,
  DoorOpen,
  CheckCircle2,
  Calendar,
  MapPin,
  AlertCircle,
} from 'lucide-react';
import type { ConcertEvent, AttendeeBooking } from '../../types';
import { Modal } from '../common/Modal';
import { AppImage } from '../common/AppImage';
import { vendorConcertService } from '../../services/vendorConcertService';
import { formatUtcDate } from '../../utils/dateUtils';

export interface BookTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  concert: ConcertEvent;
  onAddBooking?: (booking: AttendeeBooking) => void;
  onShowToast: (msg: string) => void;
}

export const BookTicketModal: React.FC<BookTicketModalProps> = ({
  isOpen,
  onClose,
  concert,
  onAddBooking,
  onShowToast
}) => {
  const [selectedTierName, setSelectedTierName] = useState<string>('');
  const [bookingQuantity, setBookingQuantity] = useState<number>(1);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customGate, setCustomGate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset and pre-select available tier on open
  useEffect(() => {
    if (isOpen && concert) {
      const firstAvailable =
        concert.ticketTiers.find((t) => t.available > 0) || concert.ticketTiers[0];
      if (firstAvailable) {
        setSelectedTierName(firstAvailable.name);
      }
      setBookingQuantity(1);
      setCustomerName('');
      setCustomerEmail('');
      setCustomerPhone('');
      setCustomGate('');
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen, concert]);

  const selectedBookingTier =
    concert.ticketTiers.find((t) => t.name === selectedTierName) ||
    concert.ticketTiers[0];

  const maxTierAvailable = selectedBookingTier ? selectedBookingTier.available : 0;
  const isSelectedTierSoldOut = maxTierAvailable <= 0;
  const bookingTotalAmount = selectedBookingTier
    ? selectedBookingTier.price * bookingQuantity
    : 0;

  const defaultGate = selectedBookingTier?.name.toLowerCase().includes('vip')
    ? 'Gate 1 (VIP Fastrack)'
    : 'Gate 2 (General West)';

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!customerName.trim()) {
      errs.customerName = 'Full name is required';
    }
    if (!customerEmail.trim()) {
      errs.customerEmail = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.trim())) {
      errs.customerEmail = 'Enter a valid email address';
    }
    if (!customerPhone.trim()) {
      errs.customerPhone = 'Contact phone number is required';
    }
    if (!selectedBookingTier || isSelectedTierSoldOut) {
      errs.tier = 'Selected tier is sold out. Please choose another tier.';
    }
    if (bookingQuantity < 1) {
      errs.quantity = 'Quantity must be at least 1';
    } else if (bookingQuantity > maxTierAvailable) {
      errs.quantity = `Only ${maxTierAvailable} ticket(s) remaining in this tier`;
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      onShowToast('Please fill in all required customer details accurately.');
      return;
    }

    setIsSubmitting(true);
    const randomTicketCode = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
    const randomOrderNumber = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const gateToAssign = customGate.trim() || defaultGate;

    const newBooking: AttendeeBooking = {
      id: `booking-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      orderNumber: randomOrderNumber,
      concertId: concert.id,
      concertTitle: concert.title,
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim(),
      customerPhone: customerPhone.trim(),
      ticketTier: selectedBookingTier.name,
      seatsCount: bookingQuantity,
      totalPaid: bookingTotalAmount,
      currency: concert.currency || 'INR',
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

      onShowToast(`Ticket ${randomTicketCode} issued successfully to ${customerName.trim()}!`);
      onClose();
    } catch (err) {
      console.error('Failed to issue ticket:', err);
      onShowToast('Failed to issue ticket. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Book Concert Ticket"
      subtitle={`Manual pass booking and gate allocation for ${concert.title}`}
      maxWidth="lg"
    >
      <form onSubmit={handleConfirmBooking} className="space-y-4">
        {/* Event Summary Mini-Banner */}
        <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-11 w-11 rounded-lg overflow-hidden bg-purple-100 shrink-0 border border-purple-200">
              <AppImage
                src={concert.image}
                alt={concert.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                {concert.title}
              </h4>
              <p className="text-[11px] text-purple-700 font-medium truncate mt-0.5">
                {formatUtcDate(concert.date)} · Doors {concert.doorsOpen} · {concert.venueName}, {concert.city}
              </p>
            </div>
          </div>

        </div>

        {/* Ticket Tier Selection */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700">
              Select Ticket Tier <span className="text-purple-600">*</span>
            </label>
            <span className="text-[11px] text-slate-500 font-normal">
              {concert.ticketTiers.length} categories available
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {concert.ticketTiers.map((tier) => {
              const isSelected = selectedBookingTier?.name === tier.name;
              const isSoldOut = tier.available <= 0;

              return (
                <button
                  key={tier.id || tier.name}
                  type="button"
                  disabled={isSoldOut}
                  onClick={() => {
                    setSelectedTierName(tier.name);
                    if (bookingQuantity > tier.available && tier.available > 0) {
                      setBookingQuantity(tier.available);
                    }
                    if (errors.tier) {
                      setErrors((prev) => ({ ...prev, tier: '' }));
                    }
                  }}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${isSoldOut
                    ? 'border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed'
                    : isSelected
                      ? 'border-purple-600 bg-purple-50/60 ring-2 ring-purple-600/20 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-slate-900 block truncate">
                        {tier.name}
                      </span>
                      <span className="text-xs font-semibold text-purple-700 block mt-0.5">
                        ₹{tier.price.toLocaleString()}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${isSoldOut
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : tier.available <= 10
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                    >
                      {isSoldOut ? 'Sold Out' : `${tier.available} left`}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
          {errors.tier && (
            <p className="text-[11px] text-rose-500 flex items-center gap-1 mt-1">
              <AlertCircle className="h-3 w-3" />
              {errors.tier}
            </p>
          )}
        </div>

        {/* Quantity Stepper & Gate Assignment */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 flex items-center justify-between gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-800 block">
                Passes / Quantity <span className="text-purple-600">*</span>
              </label>
              <span className="text-[10px] text-slate-500 font-normal">
                Max {Math.min(10, maxTierAvailable || 1)} per booking
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={bookingQuantity <= 1 || isSelectedTierSoldOut}
                onClick={() => setBookingQuantity(Math.max(1, bookingQuantity - 1))}
                className="h-8 w-8 rounded-lg border border-slate-300 bg-white text-slate-700 font-bold hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
              >
                -
              </button>
              <span className="w-8 text-center text-xs font-bold text-slate-900">
                {bookingQuantity}
              </span>
              <button
                type="button"
                disabled={
                  bookingQuantity >= Math.min(10, maxTierAvailable) || isSelectedTierSoldOut
                }
                onClick={() =>
                  setBookingQuantity(
                    Math.min(Math.min(10, maxTierAvailable), bookingQuantity + 1)
                  )
                }
                className="h-8 w-8 rounded-lg border border-slate-300 bg-white text-slate-700 font-bold hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
              >
                +
              </button>
            </div>
          </div>

          {/* <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col justify-center">
            <label className="text-xs font-semibold text-slate-800 block mb-1">
              Gate Assignment
            </label>
            <div className="relative">
              <DoorOpen className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={customGate}
                onChange={(e) => setCustomGate(e.target.value)}
                placeholder={defaultGate}
                className="w-full h-8 pl-8 pr-2.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none transition-colors"
              />
            </div>
          </div> */}
        </div>

        {/* Customer Information */}
        <div className="space-y-3 pt-1">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-purple-600" />
            <span>Customer & Attendee Details</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Full Name <span className="text-purple-600">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => {
                    setCustomerName(e.target.value);
                    if (errors.customerName)
                      setErrors((prev) => ({ ...prev, customerName: '' }));
                  }}
                  placeholder="e.g. Rahul Sharma"
                  className={`w-full h-9 pl-9 pr-3 rounded-lg border bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none transition-colors ${errors.customerName ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                    }`}
                />
              </div>
              {errors.customerName && (
                <p className="text-[10px] text-rose-500">{errors.customerName}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Email Address <span className="text-purple-600">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => {
                    setCustomerEmail(e.target.value);
                    if (errors.customerEmail)
                      setErrors((prev) => ({ ...prev, customerEmail: '' }));
                  }}
                  placeholder="e.g. rahul@example.com"
                  className={`w-full h-9 pl-9 pr-3 rounded-lg border bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none transition-colors ${errors.customerEmail ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                    }`}
                />
              </div>
              {errors.customerEmail && (
                <p className="text-[10px] text-rose-500">{errors.customerEmail}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Phone Number <span className="text-purple-600">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => {
                    setCustomerPhone(e.target.value);
                    if (errors.customerPhone)
                      setErrors((prev) => ({ ...prev, customerPhone: '' }));
                  }}
                  placeholder="e.g. +91 98765 43210"
                  className={`w-full h-9 pl-9 pr-3 rounded-lg border bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none transition-colors ${errors.customerPhone ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                    }`}
                />
              </div>
              {errors.customerPhone && (
                <p className="text-[10px] text-rose-500">{errors.customerPhone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Order Price & Code Summary */}
        <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span>Pass Category:</span>
            <span className="font-semibold text-slate-900">
              {bookingQuantity} × {selectedBookingTier?.name || 'Pass'} (₹
              {selectedBookingTier?.price.toLocaleString()})
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span>Gate Allocation:</span>
            <span className="font-semibold text-purple-700">
              {customGate.trim() || defaultGate}
            </span>
          </div>
          <div className="border-t border-slate-200/80 pt-2 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-900 block">Total Amount</span>
              <span className="text-[10px] text-slate-500">Includes arena admission & taxes</span>
            </div>
            <span className="text-base font-extrabold text-purple-700">
              ₹{bookingTotalAmount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isSelectedTierSoldOut}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-xs shadow-purple-200 transition-all cursor-pointer"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>{isSubmitting ? 'Issuing Ticket...' : 'Confirm & Issue Ticket'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
