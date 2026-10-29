import React from 'react';
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  ShieldCheck,
  Star,
  CheckCircle2,
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import type { StrangerMeet } from '../../types';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';

interface StrangerMeetDetailModalProps {
  meet: StrangerMeet | null;
  isOpen: boolean;
  onClose: () => void;
}

export const StrangerMeetDetailModal: React.FC<StrangerMeetDetailModalProps> = ({
  meet,
  isOpen,
  onClose
}) => {
  if (!meet) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Community Mixer Manifest"
      subtitle={`Meet ID: ${meet.id} • ${meet.category} • ${meet.city}`}
      maxWidth="xl"
    >
      <div className="space-y-5">
        {/* Header Summary */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-3">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-teal-50 border border-teal-200 px-2.5 py-0.5 text-xs text-teal-800 font-semibold">
                {meet.category}
              </span>
              <Badge status={meet.status} />
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400">Entry Ticket Pass:</span>
              <div className="text-base font-bold text-teal-700">
                {meet.pricePerPerson ? `₹${meet.pricePerPerson}` : 'Free'}
              </div>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span>{meet.meetDate} • {meet.meetTime}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-slate-400" />
              <span>{meet.participants.length} of {meet.maxParticipants} participants confirmed</span>
            </div>
          </div>
        </div>

        {/* Host & Meeting Point */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
              Community Host Desk
            </div>
            <div className="flex items-center gap-3">
              <img
                src={meet.hostAvatar}
                alt={meet.hostName}
                className="h-10 w-10 rounded-xl object-cover ring-1 ring-slate-200"
              />
              <div>
                <div className="text-xs font-semibold text-slate-900 flex items-center gap-1">
                  {meet.hostName}
                  {meet.hostVerified && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />}
                </div>
                <div className="text-[11px] text-slate-500 font-normal">Rating: {meet.hostRating} ★ • Verified Promoter</div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
              Venue / Meeting Point
            </div>
            <div className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-teal-600" />
              <span>{meet.city}</span>
            </div>
            <p className="text-xs text-slate-600 mt-1">{meet.meetingPoint}</p>
          </div>
        </div>

        {/* Description & Vibe Tags */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-2xs">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
            Experience Description
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">{meet.description}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {meet.vibeTags.map((tag, i) => (
              <span key={i} className="text-[11px] font-medium text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200/70">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Safety Guidelines */}
        <div className="rounded-xl border border-slate-200/90 bg-emerald-50/40 p-4">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-emerald-900 uppercase tracking-wider">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>WayFor Community Safety Guidelines</span>
          </div>
          <ul className="space-y-1 text-xs text-emerald-800 list-disc list-inside">
            {meet.safetyGuidelines.map((sg, idx) => (
              <li key={idx}>{sg}</li>
            ))}
          </ul>
        </div>

        {/* Confirmed Attendees List */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Confirmed Attendees ({meet.participants.length} / {meet.maxParticipants})
            </h4>
          </div>

          {meet.participants.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No participants registered yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {meet.participants.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white shadow-2xs">
                  <div className="flex items-center gap-2.5">
                    <img src={p.avatar} alt={p.name} className="h-9 w-9 rounded-xl object-cover ring-1 ring-slate-200" />
                    <div>
                      <span className="text-xs font-semibold text-slate-900 flex items-center gap-1">
                        {p.name}
                        {p.verifiedKYC && <CheckCircle2 className="h-3 w-3 text-emerald-600" />}
                      </span>
                      <span className="text-[10px] text-slate-400 block">{p.city} • Social Score {p.socialScore}%</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    KYC Cleared
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
