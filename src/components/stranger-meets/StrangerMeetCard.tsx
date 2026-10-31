import React from 'react';
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  ShieldCheck,
  Star,
  Trash2,
  Eye,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import type { StrangerMeet } from '../../types';
import { Badge } from '../common/Badge';

interface StrangerMeetCardProps {
  meet: StrangerMeet;
  onSelect: (meet: StrangerMeet) => void;
  onDelete?: (id: string) => void;
}

export const StrangerMeetCard: React.FC<StrangerMeetCardProps> = ({
  meet,
  onSelect,
  onDelete
}) => {
  const spotsLeft = meet.maxParticipants - meet.participants.length;

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Coffee & Chill':
        return 'bg-amber-50 text-amber-700 border-amber-200/80';
      case 'Weekend Roadtrip':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200/80';
      case 'Trek & Adventure':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      case 'Music & Nightlife':
        return 'bg-purple-50 text-purple-700 border-purple-200/80';
      case 'City Walk & Food':
        return 'bg-teal-50 text-teal-700 border-teal-200/80';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200/80';
    }
  };

  return (
    <div
      onClick={() => onSelect(meet)}
      className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs hover:border-teal-300 hover:shadow-md transition-all cursor-pointer"
    >
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${getCategoryColor(
              meet.category
            )}`}
          >
            {meet.category}
          </span>
          <Badge status={meet.status} size="sm" />
        </div>

        {/* Title & Description */}
        <h3 className="text-sm font-semibold text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-1">
          {meet.title}
        </h3>
        <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
          {meet.description}
        </p>

        {/* Location & Time info */}
        <div className="mt-3.5 space-y-1.5 border-t border-slate-100 pt-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-teal-600 shrink-0" />
            <span className="truncate">
              <strong className="text-slate-800 font-medium">{meet.city}</strong> • {meet.meetingPoint}
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span>{meet.meetDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              <span>{meet.meetTime}</span>
            </div>
          </div>
        </div>

        {/* Vibe Tags */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {meet.vibeTags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="rounded-md bg-teal-50 px-2 py-0.5 text-[10px] text-teal-700 font-medium border border-teal-100"
            >
              #{tag}
            </span>
          ))}
          {meet.vibeTags.length > 3 && (
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] text-slate-400">
              +{meet.vibeTags.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Footer Info & Actions */}
      <div className="mt-4 border-t border-slate-100 pt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src={meet.hostAvatar}
            alt={meet.hostName}
            className="h-6 w-6 rounded-full object-cover ring-1 ring-slate-200"
          />
          <div className="text-[11px] text-slate-600">
            <span className="font-medium text-slate-800">{meet.hostName}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <span className="text-xs font-semibold text-teal-700">
              {meet.pricePerPerson ? `₹${meet.pricePerPerson}` : 'Free RSVP'}
            </span>
          </div>

          <div className="flex items-center gap-1 pl-2 border-l border-slate-100">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(meet);
              }}
              className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              title="Inspect Details"
            >
              <Eye className="h-3.5 w-3.5" />
            </button>
            {onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(meet.id);
                }}
                className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                title="Archive Meet"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
