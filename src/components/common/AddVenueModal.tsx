import React, { useState } from 'react';
import { Building, MapPin, Phone, Radio, Users, Plus } from 'lucide-react';
import { Modal } from './Modal';
import type { Venue } from '../../types';

export interface AddVenueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddVenue: (venue: Venue) => void;
  onShowToast?: (message: string) => void;
}

export const AddVenueModal: React.FC<AddVenueModalProps> = ({
  isOpen,
  onClose,
  onAddVenue,
  onShowToast
}) => {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [capacity, setCapacity] = useState(30000);
  const [address, setAddress] = useState('');
  const [soundSystem, setSoundSystem] = useState('L-Acoustics K1 Stadium Array');
  const [type, setType] = useState<Venue['type']>('Stadium');
  const [contactPerson, setContactPerson] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !city.trim() || !address.trim()) return;

    const newVenue: Venue = {
      id: `ven-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      city: city.trim(),
      capacity: Number(capacity) || 10000,
      address: address.trim(),
      soundSystem: soundSystem.trim() || 'L-Acoustics Stadium Rig',
      type,
      contactPerson: contactPerson.trim() || 'Venue Operations Desk',
      status: 'active'
    };

    onAddVenue(newVenue);

    // Reset form
    setName('');
    setCity('');
    setCapacity(30000);
    setAddress('');
    setContactPerson('');
    setSoundSystem('L-Acoustics K1 Stadium Array');
    setType('Stadium');

    if (onShowToast) {
      onShowToast(`Partner venue "${newVenue.name}" registered successfully!`);
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Partner Concert Arena / Stadium"
      subtitle="Register stage specifications, audio delay rigs, and security turnstiles"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Arena / Stadium Name */}
        <div className="space-y-1.5">
          <label className="font-semibold text-slate-700 flex items-center justify-between">
            <span>Arena / Stadium Name <span className="text-rose-500">*</span></span>
            <span className="text-[11px] text-slate-400 font-normal">Official venue title</span>
          </label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. DY Patil Stadium"
              className="w-full h-10 rounded-md border border-slate-200 bg-slate-50/60 pl-9 pr-3.5 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-purple-500 shadow-2xs transition-all"
            />
          </div>
        </div>

        {/* City & Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-purple-600" />
              <span>City <span className="text-rose-500">*</span></span>
            </label>
            <input
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Navi Mumbai"
              className="w-full h-10 rounded-md border border-slate-200 bg-slate-50/60 px-3.5 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-purple-500 shadow-2xs transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">Arena Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as Venue['type'])}
              className="w-full h-10 rounded-md border border-slate-200 bg-slate-50/60 px-3 text-xs text-slate-800 font-medium focus:bg-white focus:outline-none focus:border-purple-500 shadow-2xs transition-all cursor-pointer"
            >
              <option value="Stadium">Stadium</option>
              <option value="Arena">Arena</option>
              <option value="Open Grounds">Open Grounds</option>
              <option value="Auditorium">Auditorium</option>
              <option value="Club">Club / Amphitheatre</option>
            </select>
          </div>
        </div>

        {/* Max Capacity & Contact Person */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-purple-600" />
              <span>Max Capacity</span>
            </label>
            <input
              type="number"
              min="100"
              max="200000"
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              placeholder="e.g. 35000"
              className="w-full h-10 rounded-md border border-slate-200 bg-slate-50/60 px-3.5 text-xs text-slate-800 font-semibold focus:bg-white focus:outline-none focus:border-purple-500 shadow-2xs transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-purple-600" />
              <span>Contact Person / Desk</span>
            </label>
            <input
              type="text"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              placeholder="Manager (+91 ...)"
              className="w-full h-10 rounded-md border border-slate-200 bg-slate-50/60 px-3.5 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-purple-500 shadow-2xs transition-all"
            />
          </div>
        </div>

        {/* Full Address */}
        <div className="space-y-1.5">
          <label className="font-semibold text-slate-700 flex items-center justify-between">
            <span>Full Address <span className="text-rose-500">*</span></span>
            <span className="text-[11px] text-slate-400 font-normal">Sector, Landmark, Pin code...</span>
          </label>
          <input
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Sector, Landmark, Pin code..."
            className="w-full h-10 rounded-md border border-slate-200 bg-slate-50/60 px-3.5 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-purple-500 shadow-2xs transition-all"
          />
        </div>

        {/* Audio / Sound System */}
        <div className="space-y-1.5">
          <label className="font-semibold text-slate-700 flex items-center gap-1.5">
            <Radio className="h-3.5 w-3.5 text-purple-600" />
            <span>Audio / Sound System Rig</span>
          </label>
          <input
            type="text"
            value={soundSystem}
            onChange={(e) => setSoundSystem(e.target.value)}
            placeholder="e.g. L-Acoustics K1 / d&b audiotechnik"
            className="w-full h-10 rounded-md border border-slate-200 bg-slate-50/60 px-3.5 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-purple-500 shadow-2xs transition-all"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200/80"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-md text-xs font-semibold bg-purple-600 text-white hover:bg-purple-700 shadow-sm shadow-purple-200 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>Save Arena</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
