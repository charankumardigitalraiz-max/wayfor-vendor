import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  Music,
  Users,
  Phone,
  Plus,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import type { Venue } from '../../types';
import { AddVenueModal } from '../common/AddVenueModal';

interface VenuesViewProps {
  venues: Venue[];
  onAddVenue: (venue: Venue) => void;
  onShowToast: (msg: string) => void;
}

export const VenuesView: React.FC<VenuesViewProps> = ({
  venues,
  onAddVenue,
  onShowToast
}) => {
  const [isAddOpen, setIsAddOpen] = useState(false);

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="rounded-lg border border-slate-200/90 bg-white p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">
            Venues & Stages
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Partner concert arenas, stadium capacities, audio setups, and venue coordinators.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-md text-xs font-semibold bg-purple-600 text-white hover:bg-purple-700 shadow-xs shadow-purple-200 transition-all cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Add Venue</span>
        </button>
      </div>

      {/* Venues Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {venues.map((venue) => (
          <div
            key={venue.id}
            className="rounded-lg border border-slate-200/90 bg-white p-4.5 sm:p-5 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between gap-4"
          >
            <div>
              {venue.image && (
                <div className="h-32 -mx-4.5 -mt-4.5 sm:-mx-5 sm:-mt-5 mb-3.5 rounded-t-lg overflow-hidden border-b border-slate-100 relative group">
                  <img
                    src={venue.image}
                    alt={venue.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute bottom-2 left-2 rounded-md bg-slate-900/75 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5">
                    {venue.type}
                  </span>
                </div>
              )}

              {/* Header: Venue Icon, Name, City/Type & Status */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="h-9 w-9 rounded-lg bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Building2 className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-slate-900 truncate" title={venue.name}>
                      {venue.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                      {venue.city} <span className="text-slate-300">•</span> <span className="text-purple-600 font-medium">{venue.type}</span>
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80 shrink-0">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Ready
                </span>
              </div>

              {/* Specs: Clean 2-column key metrics */}
              <div className="mt-4 grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-slate-50/80 border border-slate-100">
                <div>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 block">
                    Capacity
                  </span>
                  <span className="text-xs font-semibold text-slate-900 mt-0.5 block">
                    {venue.capacity.toLocaleString()} seats
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 block">
                    Audio Setup
                  </span>
                  <span className="text-xs font-semibold text-slate-800 mt-0.5 block truncate" title={venue.soundSystem}>
                    {venue.soundSystem.split(' with ')[0].split(' & ')[0]}
                  </span>
                </div>
              </div>

              {/* Address */}
              <div className="mt-3 flex items-start gap-1.5 text-xs text-slate-500">
                <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span className="text-[11px] text-slate-500 truncate" title={venue.address}>
                  {venue.address}
                </span>
              </div>
            </div>

            {/* Footer: Contact Person */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-1.5 min-w-0">
                <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span className="text-[11px] text-slate-600 truncate">{venue.contactPerson}</span>
              </div>
              <span className="text-[11px] font-medium text-purple-600 shrink-0">
                Active Partner
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Global Add Venue Modal */}
      <AddVenueModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAddVenue={onAddVenue}
        onShowToast={onShowToast}
      />
    </div>
  );
};
