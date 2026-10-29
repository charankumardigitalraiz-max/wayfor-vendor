import React, { useState } from 'react';
import { Plus, Trash2, MapPin, Calendar, DollarSign, Users } from 'lucide-react';
import type { TripPlan } from '../../types';
import { Modal } from '../common/Modal';

interface CreateTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTrip: (trip: TripPlan) => void;
  currentVendorName?: string;
}

export const CreateTripModal: React.FC<CreateTripModalProps> = ({
  isOpen,
  onClose,
  onAddTrip,
  currentVendorName = 'Promoter Expeditions Desk'
}) => {
  const [title, setTitle] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('2026-11-20');
  const [endDate, setEndDate] = useState('2026-11-25');
  const [estimatedBudget, setEstimatedBudget] = useState(8500);
  const [category, setCategory] = useState<string>('Music Tour');
  const [maxTravelers, setMaxTravelers] = useState(10);
  const [waypointInputs, setWaypointInputs] = useState<string[]>(['', '']);

  const handleWaypointChange = (index: number, val: string) => {
    const updated = [...waypointInputs];
    updated[index] = val;
    setWaypointInputs(updated);
  };

  const addWaypoint = () => {
    setWaypointInputs([...waypointInputs, '']);
  };

  const removeWaypoint = (index: number) => {
    setWaypointInputs(waypointInputs.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !origin || !destination) return;

    const validWaypoints = waypointInputs.filter((w) => w.trim() !== '');

    const newTrip: TripPlan = {
      id: `trip-${Date.now().toString().slice(-4)}`,
      title: title.trim(),
      creatorName: currentVendorName,
      creatorBio: 'Verified WayFor Travel & Event Partner',
      creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      origin: origin.trim(),
      destination: destination.trim(),
      startDate,
      endDate,
      totalDays: 5,
      estimatedBudget: Number(estimatedBudget),
      currency: 'INR',
      category,
      maxTravelers: Number(maxTravelers),
      joinedTravelers: [
        {
          id: 'usr-vendor-lead',
          name: currentVendorName,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
          joinedAt: 'Lead Host'
        }
      ],
      waypoints: validWaypoints.length > 0 ? validWaypoints : [origin, destination],
      status: 'active',
      itinerary: [
        {
          dayNumber: 1,
          title: `Departure & Escort to ${origin}`,
          destination: origin,
          description: `Group rendezvous at ${origin}, security & vehicle orientation, first scenic transit.`,
          highlights: ['Departure check-in', 'Welcome kit']
        },
        {
          dayNumber: 2,
          title: `Transit to ${destination} & Event Access`,
          destination: destination,
          description: `Arrival in ${destination}, campsite/hotel check-in, sunset session.`,
          highlights: ['Scenic drive', 'Exclusive admission']
        }
      ]
    };

    onAddTrip(newTrip);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Curated Group Expedition"
      subtitle="Launch a multi-day tour package with companion bookings for fans and travelers."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-medium text-slate-700 block mb-1">
            Trip Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Goa Sunset Acoustic & Coastal Roadtrip"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-slate-700 block mb-1">
              Origin City / Hub *
            </label>
            <input
              type="text"
              required
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="e.g. Mumbai (BKC)"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700 block mb-1">
              Destination *
            </label>
            <input
              type="text"
              required
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. North Goa (Vagator)"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-medium text-slate-700 block mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700 block mb-1">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700 block mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
            >
              <option value="Music Tour">Music Tour</option>
              <option value="Roadtrip">Roadtrip</option>
              <option value="Nature & Trek">Nature & Trek</option>
              <option value="City Hopping">City Hopping</option>
              <option value="Weekend Escape">Weekend Escape</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-slate-700 block mb-1">
              Package Price per Traveler (₹)
            </label>
            <input
              type="number"
              min={500}
              step={100}
              value={estimatedBudget}
              onChange={(e) => setEstimatedBudget(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700 block mb-1">
              Max Travelers Capacity
            </label>
            <input
              type="number"
              min={2}
              max={50}
              value={maxTravelers}
              onChange={(e) => setMaxTravelers(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Waypoints */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-slate-700">
              Intermediate Scenic Stops & Waypoints
            </label>
            <button
              type="button"
              onClick={addWaypoint}
              className="text-[11px] text-amber-700 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="h-3 w-3" /> Add Stop
            </button>
          </div>

          <div className="space-y-2">
            {waypointInputs.map((wp, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder={`Stop ${index + 1} (e.g. Kolhapur Palace Stop)`}
                  value={wp}
                  onChange={(e) => handleWaypointChange(index, e.target.value)}
                  className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                />
                {waypointInputs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeWaypoint(index)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs cursor-pointer"
          >
            Publish Expedition
          </button>
        </div>
      </form>
    </Modal>
  );
};
