import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Ticket,
  Eye,
  Edit3,
  Sliders,
  DollarSign
} from 'lucide-react';
import type { ConcertEvent } from '../../types';
import { Badge } from '../common/Badge';
import { AppImage } from '../common/AppImage';
import { formatUtcDate } from '../../utils/dateUtils';

interface VendorConcertCardProps {
  concert: ConcertEvent;
  onSelect: (concert: ConcertEvent) => void;
  onStatusChange?: (id: string, status: ConcertEvent['status']) => void;
}

export const VendorConcertCard: React.FC<VendorConcertCardProps> = ({
  concert,
  onSelect
}) => {
  const navigate = useNavigate();
  const soldPercent = Math.round((concert.ticketsSold / concert.totalCapacity) * 100);

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs transition-all duration-200 hover:border-purple-300 hover:shadow-md flex flex-col justify-between">
      {/* Visual Header */}
      <div className="relative h-44 w-full overflow-hidden bg-slate-100">
        <AppImage
          src={concert.image}
          alt={concert.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          {/* <span className="rounded-full bg-white/95 backdrop-blur-md px-2.5 py-0.5 text-[11px] font-semibold text-slate-800 shadow-xs">
            {concert.genre}
          </span> */}
          {/* <span
            className={`rounded-full backdrop-blur-md px-2 py-0.5 text-[10px] font-bold shadow-xs border ${soldPercent >= 55
              ? 'bg-emerald-500/90 text-white border-emerald-400'
              : soldPercent < 45
                ? 'bg-rose-500/90 text-white border-rose-400'
                : 'bg-amber-500/90 text-white border-amber-400'
              }`}
          >
            {soldPercent >= 55 ? 'Profit' : soldPercent < 45 ? 'Loss' : 'Break-Even'}
          </span> */}
        </div>

        <div className="absolute top-3 right-3">
          <Badge status={concert.status} />
        </div>

        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h3 className="text-sm font-semibold tracking-tight truncate drop-shadow-xs">
            {concert.title}
          </h3>
          <p className="text-xs text-purple-200 font-medium truncate">
            {concert.artist}
          </p>
        </div>
      </div>

      {/* Body Details */}
      <div className="p-4 space-y-3.5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Date & Time */}
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Calendar className="h-3.5 w-3.5 text-purple-600 shrink-0" />
            <span>
              {formatUtcDate(concert.date)} • Doors {concert.doorsOpen}
            </span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">
              {concert.venueName}, {concert.city}
            </span>
          </div>

          {/* Ticket Inventory / Tier Badge */}
          <div className="flex items-center justify-between text-xs text-purple-700 bg-purple-50 rounded-lg px-2.5 py-1.5 border border-purple-100">
            <div className="flex items-center gap-1.5">
              <Ticket className="h-3.5 w-3.5 text-purple-600 shrink-0" />
              <span className="font-medium">
                {concert.ticketTiers.length} Ticket Tier{concert.ticketTiers.length !== 1 ? 's' : ''} on Sale
              </span>
            </div>
            <span className="text-[11px] font-semibold text-purple-800">
              {(concert.totalCapacity - concert.ticketsSold).toLocaleString()} left
            </span>
          </div>
        </div>

        {/* Capacity Bar & Price */}
        <div className="border-t border-slate-100 pt-3 space-y-2">
          {(() => {
            const color =
              soldPercent >= 90
                ? { text: 'text-emerald-700', bar: 'bg-emerald-500' }
                : soldPercent >= 65
                  ? { text: 'text-blue-700', bar: 'bg-blue-600' }
                  : soldPercent >= 40
                    ? { text: 'text-amber-700', bar: 'bg-amber-500' }
                    : { text: 'text-rose-600', bar: 'bg-rose-500' };

            return (
              <>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Capacity Allocation</span>
                  <span className={`${color.text} font-semibold`}>
                    {soldPercent}% ({concert.ticketsSold.toLocaleString()} / {concert.totalCapacity.toLocaleString()})
                  </span>
                </div>

                <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${color.bar} transition-all duration-300`}
                    style={{ width: `${Math.min(100, soldPercent)}%` }}
                  />
                </div>
              </>
            );
          })()}

          <div className="flex items-center justify-between pt-1">
            <div className="text-xs font-semibold text-slate-900">
              {concert.isFree || (concert.minPrice === 0 && concert.maxPrice === 0) ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Free Admission
                </span>
              ) : (
                `₹${concert.minPrice.toLocaleString()} - ₹${concert.maxPrice.toLocaleString()}`
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/concerts/${concert.id}/edit`);
                }}
                className="p-1.5 rounded-md bg-slate-50 text-slate-600 hover:bg-purple-50 hover:text-purple-700 border border-slate-200/80 hover:border-purple-200 transition-all cursor-pointer shadow-2xs"
                title="Edit Concert"
              >
                <Edit3 className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onSelect(concert)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-purple-600 text-white hover:bg-purple-700 transition-colors cursor-pointer shadow-2xs"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Manage Event</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
