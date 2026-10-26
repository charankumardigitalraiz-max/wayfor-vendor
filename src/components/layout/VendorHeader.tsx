import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  Plus,
  Radio,
  CheckCircle2,
  Calendar,
  Clock,
  Sparkles,
  Ticket,
  ChevronDown,
  User,
  Settings,
  CreditCard,
  Building2,
  ShieldCheck,
  LogOut,
  Scan
} from 'lucide-react';
import type { NavigationTab } from '../../types';
import { mockVendorProfile } from '../../data/mockVendorData';

interface VendorHeaderProps {
  activeTab: NavigationTab;
  onOpenCreateConcert: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const VendorHeader: React.FC<VendorHeaderProps> = ({
  activeTab: _activeTab,
  onOpenCreateConcert,
  searchQuery,
  onSearchChange
}) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isLiveEventMode, setIsLiveEventMode] = useState(true);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (profileRef.current && !profileRef.current.contains(target)) {
        setShowProfileModal(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const istDate = currentTime.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const istTime = currentTime.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  const notifications = [
    {
      id: 1,
      title: 'Phase 2 Standing Sold Out!',
      desc: 'Neon Odyssey (Jio World Garden) Phase 2 standing tickets hit 100% capacity.',
      time: '12m ago',
      icon: Ticket
    },
    {
      id: 2,
      title: 'Advance Payout Approved',
      desc: '₹8.45 Cr advance settlement for Coldplay Narendra Modi Stadium is currently processing.',
      time: '1h ago',
      icon: CheckCircle2
    },
    {
      id: 3,
      title: 'Acoustic Sound Check Complete',
      desc: 'FOH Sound engineer signed off on L-Acoustics K1 calibration.',
      time: '3h ago',
      icon: Sparkles
    }
  ];

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-slate-200/90 bg-white/95 px-6 backdrop-blur-md">
      {/* Date & Time (IST) */}
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-100/80 shrink-0">
          <Clock className="h-4 w-4" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold tracking-tight text-slate-900 tabular-nums">
              {istTime}
            </span>
            {/* <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200/70">
              IST
            </span> */}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Calendar className="h-3 w-3 text-slate-400" />
            <span>{istDate}</span>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">

        {/* <div className="relative hidden md:block w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search concerts, tickets, venues..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none transition-all"
          />
        </div>


        <button
          type="button"
          onClick={() => setIsLiveEventMode(!isLiveEventMode)}
          className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs font-medium transition-all cursor-pointer ${isLiveEventMode
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
            : 'bg-slate-50 text-slate-600 border-slate-200'
            }`}
          title="Click to toggle live event telemetry mode"
        >
          <Radio
            className={`h-3.5 w-3.5 ${isLiveEventMode ? 'text-emerald-500 animate-pulse' : 'text-slate-400'
              }`}
          />
          <span>{isLiveEventMode ? 'Gate Live Mode ON' : 'Event Standby'}</span>
        </button> */}


        <button
          type="button"
          onClick={onOpenCreateConcert}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold bg-purple-600 text-white hover:bg-purple-700 shadow-sm shadow-purple-200 transition-all cursor-pointer shrink-0"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Concert</span>
        </button>

        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <button
            type="button"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileModal(false);
            }}
            className="relative h-9 w-9 rounded-md border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-purple-600 text-[10px] font-bold text-white ring-2 ring-white">
              3
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl z-40 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 px-2">
                <span className="text-xs font-semibold text-slate-900">
                  Live Notifications
                </span>
                <span className="text-[10px] text-purple-600 font-medium cursor-pointer hover:underline">
                  Mark read
                </span>
              </div>
              <div className="mt-2 space-y-1.5">
                {notifications.map((n) => {
                  const Icon = n.icon;
                  return (
                    <div
                      key={n.id}
                      className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <div className="h-7 w-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 truncate">
                          {n.title}
                        </p>
                        <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">
                          {n.desc}
                        </p>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          {n.time}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Vendor Avatar & Smart Moving Modal */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => {
              setShowProfileModal(!showProfileModal);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 pl-2.5 pr-2 py-1.5 rounded-lg border-l border-slate-200 hover:bg-slate-50 transition-all cursor-pointer group"
          >
            <div className="relative">
              <img
                src={mockVendorProfile.avatar}
                alt={mockVendorProfile.name}
                className="h-8 w-8 rounded-lg object-cover ring-1 ring-slate-200 group-hover:ring-purple-300 transition-all"
              />
              <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-semibold text-slate-800 leading-tight group-hover:text-purple-700 transition-colors">
                {mockVendorProfile.name.split(' ')[0]}
              </p>
              <p className="text-[10px] text-slate-400">Head of Touring</p>
            </div>
            <ChevronDown
              className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${
                showProfileModal ? 'rotate-180 text-purple-600' : 'group-hover:text-slate-600'
              }`}
            />
          </button>

          {/* Smart Moving Profile Modal */}
          {showProfileModal && (
            <div className="absolute right-0 mt-2.5 w-80 sm:w-88 rounded-xl border border-slate-200/90 bg-white shadow-xl z-50 overflow-hidden transform transition-all duration-200 origin-top-right animate-in fade-in slide-in-from-top-2">
              {/* Profile Card Header */}
              <div className="p-4 bg-gradient-to-br from-slate-50 via-white to-purple-50/40 border-b border-slate-100">
                <div className="flex items-start gap-3">
                  <div className="relative shrink-0">
                    <img
                      src={mockVendorProfile.avatar}
                      alt={mockVendorProfile.name}
                      className="h-12 w-12 rounded-xl object-cover ring-2 ring-purple-100 shadow-2xs"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-slate-900 truncate">
                        {mockVendorProfile.name}
                      </h4>
                      <span title="Verified Vendor" className="inline-flex shrink-0">
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {mockVendorProfile.email}
                    </p>
                    <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200/60">
                        Zenith Live
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        GST: {mockVendorProfile.gstNumber.slice(0, 8)}...
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Studio Stats */}
                <div className="mt-3.5 grid grid-cols-3 gap-2 p-2 rounded-lg bg-white/80 border border-slate-100 text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Tours</span>
                    <span className="text-xs font-bold text-slate-900">{mockVendorProfile.totalConcertsHosted}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Tickets</span>
                    <span className="text-xs font-bold text-slate-900">{(mockVendorProfile.totalTicketsSold / 1000).toFixed(0)}k+</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Rating</span>
                    <span className="text-xs font-bold text-amber-600">★ {mockVendorProfile.rating}</span>
                  </div>
                </div>
              </div>

              {/* Navigation & Actions */}
              <div className="p-2 space-y-0.5 text-xs text-slate-700">
                <button
                  type="button"
                  onClick={() => {
                    navigate('/concerts');
                    setShowProfileModal(false);
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 hover:text-purple-700 transition-colors cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-md bg-purple-50 text-purple-600 flex items-center justify-center">
                      <Ticket className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <span className="font-semibold block text-slate-800 group-hover:text-purple-700">Concert Roster</span>
                      <span className="text-[10px] text-slate-400 block">Manage tours and ticket inventory</span>
                    </div>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-300 -rotate-90 group-hover:text-purple-600 transition-all" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    navigate('/payouts');
                    setShowProfileModal(false);
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 hover:text-purple-700 transition-colors cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <CreditCard className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <span className="font-semibold block text-slate-800 group-hover:text-purple-700">Earnings & Payouts</span>
                      <span className="text-[10px] text-slate-400 block">Bank withdrawals and sales ledger</span>
                    </div>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-300 -rotate-90 group-hover:text-purple-600 transition-all" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    navigate('/gate-scanner');
                    setShowProfileModal(false);
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 hover:text-purple-700 transition-colors cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Scan className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <span className="font-semibold block text-slate-800 group-hover:text-purple-700">Live Turnstile Scanner</span>
                      <span className="text-[10px] text-slate-400 block">Gate entry barcode validation</span>
                    </div>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-300 -rotate-90 group-hover:text-purple-600 transition-all" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    navigate('/settings');
                    setShowProfileModal(false);
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 hover:text-purple-700 transition-colors cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-md bg-slate-100 text-slate-600 flex items-center justify-center">
                      <Settings className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <span className="font-semibold block text-slate-800 group-hover:text-purple-700">Studio Settings</span>
                      <span className="text-[10px] text-slate-400 block">Bank credentials and GST info</span>
                    </div>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-300 -rotate-90 group-hover:text-purple-600 transition-all" />
                </button>
              </div>

              {/* Footer: Sign Out / Account Switch */}
              <div className="p-2 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 pl-2">
                  Vendor ID: {mockVendorProfile.id}
                </span>
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
