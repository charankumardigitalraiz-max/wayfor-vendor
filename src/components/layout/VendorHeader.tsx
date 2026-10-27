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
  currentVendor?: any;
  onLogout?: () => void;
}

export const VendorHeader: React.FC<VendorHeaderProps> = ({
  activeTab: _activeTab,
  onOpenCreateConcert,
  searchQuery,
  onSearchChange,
  currentVendor,
  onLogout
}) => {
  const activeProfile = currentVendor || mockVendorProfile;
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
            {/* <span className="text-[10px] font-semibold uppercase tracking-wider text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200/70">
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
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-purple-600 text-[10px] font-semibold text-white ring-2 ring-white">
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
                src={activeProfile.avatar}
                alt={activeProfile.name}
                className="h-8 w-8 rounded-lg object-cover ring-1 ring-slate-200 group-hover:ring-purple-300 transition-all"
              />
              <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-semibold text-slate-800 leading-tight group-hover:text-purple-700 transition-colors">
                {activeProfile.name.split(' ')[0]}
              </p>
              <p className="text-[10px] text-slate-400">Head of Touring</p>
            </div>
            <ChevronDown
              className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${showProfileModal ? 'rotate-180 text-purple-600' : 'group-hover:text-slate-600'
                }`}
            />
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileModal && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-200/90 bg-white shadow-xl shadow-slate-900/10 py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
              {/* User Identity */}
              <div
                onClick={() => {
                  setShowProfileModal(false);
                  navigate('/profile');
                }}
                className="px-3.5 py-3 border-b border-slate-100 hover:bg-slate-50/70 transition-colors cursor-pointer"
                title="View Full Promoter Profile"
              >
                <div className="flex items-center gap-2.5">
                  <div className="relative shrink-0">
                    <img
                      src={activeProfile.avatar}
                      alt={activeProfile.name}
                      className="h-9 w-9 rounded-full object-cover border border-slate-200 shadow-2xs"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-semibold text-slate-900 truncate">
                        {activeProfile.name}
                      </span>
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">
                      {activeProfile.email}
                    </p>
                    <p className="text-[10px] text-purple-700 font-medium truncate mt-0.5">
                      {activeProfile.companyName || 'Promoter Studio'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Navigation */}
              <div className="p-1 space-y-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileModal(false);
                    navigate('/profile');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-purple-700 transition-colors cursor-pointer text-left"
                >
                  <User className="h-4 w-4 text-slate-400" />
                  <span>My Profile</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowProfileModal(false);
                    navigate('/settings');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-purple-700 transition-colors cursor-pointer text-left"
                >
                  <Settings className="h-4 w-4 text-slate-400" />
                  <span>Studio Settings</span>
                </button>
              </div>

              {/* Sign Out */}
              <div className="p-1 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileModal(false);
                    if (onLogout) onLogout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left"
                >
                  <LogOut className="h-4 w-4 text-rose-500" />
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
