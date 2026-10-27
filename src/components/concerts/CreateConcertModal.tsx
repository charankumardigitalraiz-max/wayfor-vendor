import React, { useState, useRef } from 'react';
import { Plus, Trash2, Calendar, MapPin, Music, DollarSign, Image as ImageIcon, Upload, X } from 'lucide-react';
import type { ConcertEvent, TicketTier } from '../../types';
import { Modal } from '../common/Modal';
import { mockVenues } from '../../data/mockVendorData';

interface CreateConcertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddConcert: (concert: Omit<ConcertEvent, 'id' | 'ticketsSold' | 'connectedRidesCount'>) => void;
}

export const CreateConcertModal: React.FC<CreateConcertModalProps> = ({
  isOpen,
  onClose,
  onAddConcert
}) => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [supportingActs, setSupportingActs] = useState('');
  const [genre, setGenre] = useState<ConcertEvent['genre']>('EDM');
  const [selectedVenue, setSelectedVenue] = useState(mockVenues[0].name);
  const [city, setCity] = useState(mockVenues[0].city);
  const [date, setDate] = useState('2026-12-20');
  const [doorsOpen, setDoorsOpen] = useState('17:00');
  const [showTime, setShowTime] = useState('19:30');
  const [totalCapacity, setTotalCapacity] = useState(25000);
  const [imageUrl, setImageUrl] = useState('');
  const [soundSystem, setSoundSystem] = useState('L-Acoustics K1 Stadium Array');
  const [ageRestriction, setAgeRestriction] = useState('16+ (Valid ID Required)');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Ticket tiers
  const [tiers, setTiers] = useState<TicketTier[]>([
    {
      id: 'tier-1',
      name: 'General Admission',
      price: 1999,
      total: 15000,
      available: 15000,
      description: 'Lawn standing zone',
      perks: ['Standard festival arena access']
    },
    {
      id: 'tier-2',
      name: 'VIP Front Stage Pit',
      price: 4999,
      total: 8000,
      available: 8000,
      description: 'Direct stagefront enclosure',
      perks: ['Closest visual vantage', 'Express Gate 2 entry']
    },
    {
      id: 'tier-3',
      name: 'VVIP Hospitality Lounge',
      price: 12999,
      total: 2000,
      available: 2000,
      description: 'Elevated AC deck with gourmet buffet',
      perks: ['Elevated view', 'Complimentary dining', 'Valet pass']
    }
  ]);

  const handleVenueChange = (venueName: string) => {
    setSelectedVenue(venueName);
    const v = mockVenues.find(item => item.name === venueName);
    if (v) {
      setCity(v.city);
      setTotalCapacity(v.capacity);
      setSoundSystem(v.soundSystem);
    }
  };

  const handleAddTier = () => {
    const newTier: TicketTier = {
      id: `tier-${Date.now().toString().slice(-4)}`,
      name: 'New Custom Tier',
      price: 2499,
      total: 1000,
      available: 1000,
      description: 'Special access zone',
      perks: ['Arena entry']
    };
    setTiers([...tiers, newTier]);
  };

  const handleRemoveTier = (id: string) => {
    if (tiers.length <= 1) return;
    setTiers(tiers.filter(t => t.id !== id));
  };

  const handleTierChange = (index: number, field: keyof TicketTier, value: unknown) => {
    const updated = [...tiers];
    updated[index] = { ...updated[index], [field]: value };
    setTiers(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !artist || !city) return;

    const prices = tiers.map(t => Number(t.price));
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    onAddConcert({
      title,
      artist,
      supportingActs: supportingActs ? supportingActs.split(',').map(s => s.trim()) : [],
      tourName: `${title} Run`,
      genre,
      venueName: selectedVenue,
      city,
      country: 'India',
      date,
      doorsOpen,
      showTime,
      totalCapacity: Number(totalCapacity),
      minPrice,
      maxPrice,
      currency: 'INR',
      image: imageUrl || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=900&auto=format&fit=crop&q=80',
      status: 'active',
      organizer: 'Zenith Live Touring & Entertainment',
      soundSystem,
      ageRestriction,
      ticketTiers: tiers
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Publish New Concert Tour Stop"
      subtitle="Configure event details, ticket tier pricing, arena capacity, and stage rider"
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Title & Artist */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Tour / Concert Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Echoes in Eternity World Tour"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 focus:border-purple-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Headlining Artist / Band *</label>
            <input
              type="text"
              required
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              placeholder="e.g. Martin Garrix"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 focus:border-purple-500 focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        {/* Supporting Acts & Genre */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Supporting Acts (Comma separated)</label>
            <input
              type="text"
              value={supportingActs}
              onChange={(e) => setSupportingActs(e.target.value)}
              placeholder="e.g. Justin Mylo, Brooks, Julian Jordan"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 focus:border-purple-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Music Genre</label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value as ConcertEvent['genre'])}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 focus:border-purple-500 focus:bg-white focus:outline-none"
            >
              <option value="EDM">EDM / Electronic</option>
              <option value="Rock">Rock / Alternative</option>
              <option value="Pop">Pop / Mainstream</option>
              <option value="Hip-Hop">Hip-Hop / Rap</option>
              <option value="Indie">Indie / Acoustic</option>
              <option value="Classical">Classical / Symphony</option>
              <option value="Jazz">Jazz / Fusion</option>
            </select>
          </div>
        </div>

        {/* Venue, City & Arena Capacity */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Host Venue Arena</label>
            <select
              value={selectedVenue}
              onChange={(e) => handleVenueChange(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 focus:border-purple-500 focus:bg-white focus:outline-none"
            >
              {mockVenues.map((v) => (
                <option key={v.id} value={v.name}>{v.name} ({v.city})</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Host City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 focus:border-purple-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Total Arena Capacity</label>
            <input
              type="number"
              value={totalCapacity}
              onChange={(e) => setTotalCapacity(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 focus:border-purple-500 focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        {/* Date, Doors & Show Times */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Event Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 focus:border-purple-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Doors Open Time</label>
            <input
              type="time"
              value={doorsOpen}
              onChange={(e) => setDoorsOpen(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 focus:border-purple-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Show Starts</label>
            <input
              type="time"
              value={showTime}
              onChange={(e) => setShowTime(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 focus:border-purple-500 focus:bg-white focus:outline-none"
            />
          </div>
        </div>



        {/* Ticket Tiers Section */}
        <div className="pt-2 border-t border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-slate-900">Ticket Tiers & Pricing Configuration</h4>
              <p className="text-[11px] text-slate-400">Define ticket categories, seat allocations, and INR prices.</p>
            </div>
            <button
              type="button"
              onClick={handleAddTier}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Tier</span>
            </button>
          </div>

          <div className="space-y-2">
            {tiers.map((tier, idx) => (
              <div
                key={tier.id}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center gap-2.5"
              >
                <input
                  type="text"
                  value={tier.name}
                  onChange={(e) => handleTierChange(idx, 'name', e.target.value)}
                  placeholder="Tier Name"
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 flex-1 focus:outline-none focus:border-purple-500"
                />

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400 text-xs">₹</span>
                    <input
                      type="number"
                      value={tier.price}
                      onChange={(e) => handleTierChange(idx, 'price', Number(e.target.value))}
                      placeholder="Price"
                      className="w-24 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="text-slate-400 text-[10px]">Seats</span>
                    <input
                      type="number"
                      value={tier.total}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        handleTierChange(idx, 'total', val);
                        handleTierChange(idx, 'available', val);
                      }}
                      placeholder="Seats"
                      className="w-24 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  {tiers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTier(tier.id)}
                      className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>



          {/* Banner Artwork Image File Upload */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 block text-xs">
              Banner Artwork Image (File Upload)
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <input
                ref={fileInputRef}
                id="concert-banner-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 file:cursor-pointer border border-slate-200 rounded-xl bg-slate-50 p-1.5 focus:outline-none focus:border-purple-500 cursor-pointer"
              />
              {imageUrl && (
                <div className="relative h-14 w-24 shrink-0 rounded-lg overflow-hidden border border-slate-200 shadow-2xs group">
                  <img
                    src={imageUrl}
                    alt="Banner preview"
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-1 right-1 h-4 w-4 rounded-full bg-slate-900/80 text-white flex items-center justify-center hover:bg-rose-600 transition-colors cursor-pointer"
                    title="Remove image"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </div>
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              Upload JPG, PNG, or WEBP file for stage and portal display.
            </p>
          </div>
        </div>

        {/* Submit / Cancel Footer */}
        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-md text-xs font-semibold bg-purple-600 text-white hover:bg-purple-700 shadow-sm shadow-purple-200 transition-all cursor-pointer"
          >
            Publish Concert Event
          </button>
        </div>
      </form>
    </Modal>
  );
};
