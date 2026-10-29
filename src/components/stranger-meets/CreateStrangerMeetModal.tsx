import React, { useState } from 'react';
import { Plus, Trash2, MapPin, Calendar, Clock, DollarSign, Users, Tag } from 'lucide-react';
import type { StrangerMeet } from '../../types';
import { Modal } from '../common/Modal';

interface CreateStrangerMeetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMeet: (meet: StrangerMeet) => void;
  currentVendorName?: string;
}

export const CreateStrangerMeetModal: React.FC<CreateStrangerMeetModalProps> = ({
  isOpen,
  onClose,
  onAddMeet,
  currentVendorName = 'Promoter Community Club'
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>('Music & Nightlife');
  const [city, setCity] = useState('Mumbai');
  const [meetingPoint, setMeetingPoint] = useState('');
  const [meetDate, setMeetDate] = useState('2026-11-20');
  const [meetTime, setMeetTime] = useState('18:00 - 21:00');
  const [maxParticipants, setMaxParticipants] = useState(16);
  const [pricePerPerson, setPricePerPerson] = useState(399);
  const [vibeTagsInput, setVibeTagsInput] = useState('Acoustic, Networking, Sunset');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !meetingPoint) return;

    const tags = vibeTagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const newMeet: StrangerMeet = {
      id: `meet-${Date.now().toString().slice(-4)}`,
      title: title.trim(),
      description: description.trim() || 'Curated community meetup hosted by verified promoter agency.',
      hostName: currentVendorName,
      hostAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      hostRating: 4.95,
      hostVerified: true,
      category,
      city: city.trim(),
      meetingPoint: meetingPoint.trim(),
      meetDate,
      meetTime,
      maxParticipants: Number(maxParticipants),
      participants: [],
      safetyGuidelines: [
        'Government photo ID check mandatory at entry',
        'Alcohol-free safe networking zone',
        'Zero harassment strict community moderation'
      ],
      status: 'active',
      vibeTags: tags.length > 0 ? tags : ['Community', 'Mixer'],
      pricePerPerson: Number(pricePerPerson),
      currency: 'INR'
    };

    onAddMeet(newMeet);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Host New Stranger Meet & Mixer"
      subtitle="Organize verified group social gatherings, acoustic sessions, or city networking."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-medium text-slate-700 block mb-1">
            Meetup Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Sunset Terrace Indie Music & Chai Mixer"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-slate-700 block mb-1">
            Description & Agenda
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What should guests expect? What are the themes or activities?"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-slate-700 block mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
            >
              <option value="Music & Nightlife">Music & Nightlife</option>
              <option value="Coffee & Chill">Coffee & Chill</option>
              <option value="Weekend Roadtrip">Weekend Roadtrip</option>
              <option value="Trek & Adventure">Trek & Adventure</option>
              <option value="City Walk & Food">City Walk & Food</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700 block mb-1">
              City
            </label>
            <input
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-700 block mb-1">
            Meeting Point & Address *
          </label>
          <input
            type="text"
            required
            value={meetingPoint}
            onChange={(e) => setMeetingPoint(e.target.value)}
            placeholder="e.g. Bandra Carter Road Amphitheater or Studio Lounge"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-slate-700 block mb-1">
              Date
            </label>
            <input
              type="date"
              value={meetDate}
              onChange={(e) => setMeetDate(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700 block mb-1">
              Time Slot
            </label>
            <input
              type="text"
              value={meetTime}
              onChange={(e) => setMeetTime(e.target.value)}
              placeholder="e.g. 18:00 - 21:00"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-slate-700 block mb-1">
              Max Guests Limit
            </label>
            <input
              type="number"
              min={2}
              max={100}
              value={maxParticipants}
              onChange={(e) => setMaxParticipants(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700 block mb-1">
              Ticket Pass Price (₹)
            </label>
            <input
              type="number"
              min={0}
              step={50}
              value={pricePerPerson}
              onChange={(e) => setPricePerPerson(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-700 block mb-1">
            Vibe Tags (comma separated)
          </label>
          <input
            type="text"
            value={vibeTagsInput}
            onChange={(e) => setVibeTagsInput(e.target.value)}
            placeholder="Acoustic, Chai, Photography, Indie"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
          />
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
            className="px-5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs cursor-pointer"
          >
            Publish Community Mixer
          </button>
        </div>
      </form>
    </Modal>
  );
};
