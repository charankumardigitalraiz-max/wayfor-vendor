import React from 'react';
import {
  Calendar,
  MapPin,
  Users,
  Compass,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import type { TripPlan } from '../../types';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';

interface TripDetailModalProps {
  trip: TripPlan | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TripDetailModal: React.FC<TripDetailModalProps> = ({
  trip,
  isOpen,
  onClose
}) => {
  if (!trip) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Trip Itinerary Blueprint"
      subtitle={`Trip ID: ${trip.id} • ${trip.origin} to ${trip.destination}`}
      maxWidth="xl"
    >
      <div className="space-y-5">
        {/* Header Summary */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-3">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-xs text-amber-700 font-medium">
                {trip.category}
              </span>
              <Badge status={trip.status} />
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400">Budget per traveler:</span>
              <div className="text-base font-bold text-amber-600">
                ₹{trip.estimatedBudget.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span>{trip.startDate} to {trip.endDate} ({trip.totalDays} Days)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-slate-400" />
              <span>{trip.joinedTravelers.length} of {trip.maxTravelers} buddies joined</span>
            </div>
          </div>
        </div>

        {/* Organizer & Route */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
              Curating Promoter Desk
            </div>
            <div className="flex items-center gap-3">
              <img
                src={trip.creatorAvatar}
                alt={trip.creatorName}
                className="h-10 w-10 rounded-xl object-cover ring-1 ring-slate-200"
              />
              <div>
                <div className="text-xs font-semibold text-slate-900">{trip.creatorName}</div>
                <div className="text-[11px] text-slate-500 font-normal line-clamp-1">{trip.creatorBio}</div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
              Route & Hub Stops
            </div>
            <div className="text-xs font-medium text-slate-800 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-amber-600" />
              <span>{trip.origin} → {trip.destination}</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {trip.waypoints.map((w, idx) => (
                <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                  {w}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Day-by-day Itinerary */}
        <div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
            Day-by-Day Expedition Itinerary
          </h4>
          <div className="space-y-3">
            {trip.itinerary && trip.itinerary.length > 0 ? (
              trip.itinerary.map((day) => (
                <div key={day.dayNumber} className="rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-2xs">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
                      Day {day.dayNumber}: {day.title}
                    </span>
                    <span className="text-[11px] text-slate-500">{day.destination}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{day.description}</p>
                  {day.highlights && day.highlights.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {day.highlights.map((h, i) => (
                        <span key={i} className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200/60">
                          ✓ {h}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic">No structured days added yet.</p>
            )}
          </div>
        </div>

        {/* Joined Travel Buddies */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Joined Travel Companions ({trip.joinedTravelers.length} / {trip.maxTravelers})
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {trip.joinedTravelers.map((t) => (
              <div key={t.id} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-white">
                <div className="flex items-center gap-2.5">
                  <img src={t.avatar} alt={t.name} className="h-8 w-8 rounded-lg object-cover" />
                  <div>
                    <span className="text-xs font-medium text-slate-900 block">{t.name}</span>
                    <span className="text-[10px] text-slate-400">Joined {t.joinedAt}</span>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Confirmed
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};
