import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Award,
  Star,
  CreditCard,
  Lock,
  Edit3,
  Save,
  X,
  ExternalLink,
  FileText,
  Music,
  Ticket,
  Globe2,
  Sparkles,
  Camera,
  Share2,
  SlidersHorizontal,
  Smartphone,
  Laptop
} from 'lucide-react';
import { mockVendorProfile } from '../../data/mockVendorData';
import type { VendorProfile } from '../../types';
import { MetricCard } from '../common/MetricCard';

interface VendorProfileViewProps {
  currentVendor?: any;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const VendorProfileView: React.FC<VendorProfileViewProps> = ({
  currentVendor,
  onShowToast
}) => {
  const navigate = useNavigate();
  const profile: VendorProfile = currentVendor || mockVendorProfile;

  const [activeTab, setActiveTab] = useState<'overview' | 'company' | 'production' | 'security'>('overview');
  const [isEditing, setIsEditing] = useState(false);

  // Editable fields state
  const [formData, setFormData] = useState({
    name: profile.name,
    title: 'Head of Global Touring & Live Operations',
    companyName: profile.companyName,
    email: profile.email,
    phone: profile.phone,
    location: 'Mumbai, Maharashtra, India',
    bio: 'Overseeing stadium tours, arena manifests, artist rider acoustics, and ticketing infrastructure across South Asia and international circuits. Over 12 years of executive promoter experience.',
    website: 'https://zenithentertainment.in',
    foundedYear: '2014',
    teamSize: '45+ Core Crew Members'
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    onShowToast('Profile information updated successfully!');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      onShowToast('Promoter profile link copied to clipboard!', 'info');
    }
  };

  return (
    <div className="space-y-4 max-w-6xl">
      {/* Hero Banner Card */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs">
        {/* Banner Artwork */}
        <div className="relative h-36 sm:h-44 w-full bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.35),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.25),transparent_50%)]" />

          {/* Top Right Action */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer shadow-2xs"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Share Card</span>
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white text-slate-800 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
            >
              <Edit3 className="h-3.5 w-3.5 text-purple-600" />
              <span>{isEditing ? 'Cancel Editing' : 'Edit Profile'}</span>
            </button>
          </div>
        </div>

        {/* Profile Identity Row */}
        <div className="px-5 sm:px-6 pb-5 pt-0">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-14 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-end gap-3.5">
              {/* Avatar with Status Ring */}
              <div className="relative shrink-0">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="h-24 w-24 rounded-2xl object-cover ring-4 ring-white shadow-md bg-slate-100"
                />
                <span
                  className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-emerald-500 ring-2 ring-white"
                  title="Active Live Promoter"
                />
              </div>

              {/* Title & Organization */}
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-lg sm:text-xl font-semibold text-slate-900 tracking-tight">
                    {formData.name}
                  </h1>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Verified Promoter</span>
                  </span>
                </div>

                <p className="text-xs text-slate-500 mt-0.5 font-normal">
                  {formData.title} •{' '}
                  <span className="font-medium text-slate-700">
                    {formData.companyName}
                  </span>
                </p>

                {/* Quick Info Chips */}
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    <span>{formData.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                    <span>{formData.email}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                    <span>{formData.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Link */}
            <button
              type="button"
              onClick={() => navigate('/settings')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200/80 transition-colors cursor-pointer self-start sm:self-auto shrink-0"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Studio Settings</span>
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-t border-slate-100 pt-3 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0 ${activeTab === 'overview'
                ? 'bg-purple-50 text-purple-700 border border-purple-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
            >
              Promoter Overview
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('company')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0 ${activeTab === 'company'
                ? 'bg-purple-50 text-purple-700 border border-purple-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
            >
              Company & Statutory
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('production')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0 ${activeTab === 'production'
                ? 'bg-purple-50 text-purple-700 border border-purple-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
            >
              Production Capabilities
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('security')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0 ${activeTab === 'security'
                ? 'bg-purple-50 text-purple-700 border border-purple-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
            >
              Security & Active Sessions
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard
          label="Concerts Hosted"
          value={profile.totalConcertsHosted || 28}
          subtext="Stadium and arena runs"
          icon={Music}
          accentColor="purple"
        />
        <MetricCard
          label="Total Tickets Issued"
          value={((profile.totalTicketsSold || 184500) / 1000).toFixed(1) + 'k'}
          subtext="Verified fan admissions"
          icon={Ticket}
          accentColor="emerald"
        />
        <MetricCard
          label="Promoter Trust Score"
          value={profile.rating ? `${profile.rating} ★` : '4.9 ★'}
          subtext="Audited vendor rating"
          icon={Star}
          accentColor="amber"
        />
        <MetricCard
          label="Settlement Standing"
          value="T+2 Verified"
          subtext="Escrow cleared directly"
          icon={CreditCard}
          accentColor="cyan"
        />
      </div>

      {/* Tab Content */}
      {isEditing ? (
        /* Edit Mode Form Card */
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Edit Promoter Profile
              </h3>
              <p className="text-xs text-slate-500">
                Update your publicly visible touring credentials and agency contacts.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-9 rounded-lg border border-slate-200 px-3 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">
                  Touring Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full h-9 rounded-lg border border-slate-200 px-3 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">
                  Company / Promoter Studio
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full h-9 rounded-lg border border-slate-200 px-3 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">
                  Official Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full h-9 rounded-lg border border-slate-200 px-3 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">
                  Direct Phone
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full h-9 rounded-lg border border-slate-200 px-3 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">
                  Operating Hub / Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full h-9 rounded-lg border border-slate-200 px-3 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">
                Executive Bio & Track Record
              </label>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full rounded-lg border border-slate-200 p-3 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-purple-600 text-white hover:bg-purple-700 transition-colors cursor-pointer shadow-xs"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </div>
      ) : activeTab === 'overview' ? (
        /* Overview Grid */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column: About & Agency Info */}
          <div className="lg:col-span-2 space-y-4">
            {/* About Card */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
              <h3 className="text-sm font-semibold text-slate-900 mb-2">
                About the Promoter & Studio
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {formData.bio}
              </p>

              <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-[11px] text-slate-400 block font-normal">Agency Website</span>
                  <a
                    href={formData.website}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-purple-700 hover:underline flex items-center gap-1 mt-0.5"
                  >
                    <span>{formData.website.replace('https://', '')}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-normal">Established</span>
                  <span className="font-semibold text-slate-800 block mt-0.5">{formData.foundedYear} (10+ Yrs)</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-normal">Core Production Crew</span>
                  <span className="font-semibold text-slate-800 block mt-0.5">{formData.teamSize}</span>
                </div>
              </div>
            </div>

            {/* Managed Music Genres */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
              <h3 className="text-sm font-semibold text-slate-900 mb-2">
                Specialized Live Genres
              </h3>
              <p className="text-xs text-slate-500 mb-3">
                Key festival and concert domains where Zenith Touring exercises direct staging rights:
              </p>

              <div className="flex flex-wrap gap-2">
                {['EDM & Electronic', 'Stadium Bollywood', 'Arena Rock', 'Punjabi Wave', 'International Pop', 'Acoustic Symphony'].map((g, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-md text-xs font-medium text-purple-700 bg-purple-50 border border-purple-200/80"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Direct Contact & Verification */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs space-y-3.5">
              <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2.5">
                Official Touring Desk
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[11px] text-slate-400 block">Direct Line</span>
                  <span className="font-medium text-slate-800">{formData.phone}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">Booking Dispatch Email</span>
                  <span className="font-medium text-slate-800">{formData.email}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">Headquarters</span>
                  <span className="font-medium text-slate-800">{formData.location}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">Vendor ID Reference</span>
                  <span className="font-mono text-slate-600">{profile.id}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-semibold text-emerald-800 block">
                      KYC Clearance Active
                    </span>
                    <span className="text-[11px] text-emerald-700 leading-tight block mt-0.5">
                      Statutory identity verified. Direct gate scanner authorization active.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === 'company' ? (
        /* Company & Statutory Card */
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xs space-y-5">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Company Registration & Statutory GST
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Legal promoter corporate entity and tax clearance for live public ticketing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-1">
              <span className="text-[11px] text-slate-400 block font-normal">Registered Entity</span>
              <span className="font-semibold text-slate-900 block">{formData.companyName}</span>
              <span className="text-[10px] text-slate-500 block">Private Limited Promoter Company</span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-1">
              <span className="text-[11px] text-slate-400 block font-normal">GST Identification Number</span>
              <span className="font-mono font-semibold text-purple-700 block">{profile.gstNumber || '36AAACZ8912P1ZV'}</span>
              <span className="text-[10px] text-emerald-600 block">● Active Tax Clearance</span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-1">
              <span className="text-[11px] text-slate-400 block font-normal">Settlement Bank</span>
              <span className="font-semibold text-slate-900 block">{profile.bankName || 'HDFC Bank Ltd - Corporate Banking'}</span>
              <span className="text-[10px] text-slate-500 block">A/C: {profile.bankAccountNumber ? `•••• ${profile.bankAccountNumber.slice(-4)}` : '•••• 8231'}</span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-1">
              <span className="text-[11px] text-slate-400 block font-normal">Settlement Window</span>
              <span className="font-semibold text-slate-900 block">T+2 Days Post-Concert</span>
              <span className="text-[10px] text-slate-500 block">Automated direct RTGS / NEFT payout ledger</span>
            </div>
          </div>
        </div>
      ) : activeTab === 'production' ? (
        /* Production Capabilities Card */
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xs space-y-5">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Tour Production & Technical Capabilities
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Production scale, certified acoustic hardware, and live staging compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50">
              <span className="font-semibold text-slate-900 block">Audience Scale</span>
              <p className="text-[11px] text-slate-500 mt-1">
                Up to 50,000 capacity stadium events with multi-tier barricades and dual control stations.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50">
              <span className="font-semibold text-slate-900 block">Sound Rigs & PA</span>
              <p className="text-[11px] text-slate-500 mt-1">
                Meyer Sound PANTHER line array, L-Acoustics K1/K2 certified sound technicians.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50">
              <span className="font-semibold text-slate-900 block">Safety & Medical</span>
              <p className="text-[11px] text-slate-500 mt-1">
                On-site trauma ambulances, rapid response fire safety, and licensed bouncers.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Security & Active Sessions Card */
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xs space-y-5">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Security & Active Vendor Sessions
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Session logins and credential authentication for this promoter studio account.
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Laptop className="h-5 w-5 text-purple-600" />
                <div>
                  <span className="text-xs font-semibold text-slate-900 block">
                    Current Web Console Session
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    Chrome on Windows • Active Now • Mumbai, India
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200">
                This Device
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-slate-400" />
                <div>
                  <span className="text-xs font-semibold text-slate-900 block">
                    Gate Turnstile Mobile Scanner App
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    iOS Handheld Scanner #04 • Last active 3h ago
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium text-slate-600 bg-slate-100 border border-slate-200">
                Turnstile Terminal
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
