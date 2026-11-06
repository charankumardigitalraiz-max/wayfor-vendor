import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  LayoutGrid
} from 'lucide-react';
import type { NavigationTab } from '../../types';
import { mockVendorProfile } from '../../data/mockVendorData';
import { ModuleAccessDrawer } from './ModuleAccessDrawer';
import { VendorProfileDrawer } from './VendorProfileDrawer';

interface VendorHeaderProps {
  activeTab: NavigationTab;
  onOpenCreateConcert: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  currentVendor?: any;
  onLogout?: () => void;
  onShowToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const VendorHeader: React.FC<VendorHeaderProps> = ({
  activeTab: _activeTab,
  onOpenCreateConcert,
  searchQuery,
  onSearchChange,
  currentVendor,
  onLogout,
  onShowToast
}) => {
  const activeProfile = currentVendor || mockVendorProfile;
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);
  const [showModuleDrawer, setShowModuleDrawer] = useState(false);
  const [isLiveEventMode, setIsLiveEventMode] = useState(true);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOpenModuleDrawer = () => setShowModuleDrawer(true);
    window.addEventListener('vendor:open-module-drawer', handleOpenModuleDrawer);
    window.addEventListener('vendor:open-module-modal', handleOpenModuleDrawer);
    return () => {
      window.removeEventListener('vendor:open-module-drawer', handleOpenModuleDrawer);
      window.removeEventListener('vendor:open-module-modal', handleOpenModuleDrawer);
    };
  }, []);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
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


        {location.pathname.startsWith('/trips') ? (
          <button
            type="button"
            onClick={() => {
              const evt = new CustomEvent('vendor:open-create-trip');
              window.dispatchEvent(evt);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold bg-amber-600 text-white hover:bg-amber-700 shadow-sm shadow-amber-200 transition-all cursor-pointer shrink-0"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Expedition</span>
          </button>
        ) : location.pathname.startsWith('/stranger-meets') ? (
          <button
            type="button"
            onClick={() => {
              const evt = new CustomEvent('vendor:open-create-meet');
              window.dispatchEvent(evt);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold bg-teal-600 text-white hover:bg-teal-700 shadow-sm shadow-teal-200 transition-all cursor-pointer shrink-0"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Host Mixer</span>
          </button>
        ) : (
          <>
            {/* <button
              type="button"
              onClick={onOpenCreateConcert}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold bg-purple-600 text-white hover:bg-purple-700 shadow-sm shadow-purple-200 transition-all cursor-pointer shrink-0"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Book a Ticket</span>
            </button> */}

            <button
              type="button"
              onClick={onOpenCreateConcert}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold bg-purple-600 text-white hover:bg-purple-700 shadow-sm shadow-purple-200 transition-all cursor-pointer shrink-0"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>New Concert</span>
            </button>
          </>
        )}

        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <button
            type="button"
            onClick={() => {
              setShowNotifications(!showNotifications);
              // setShowProfileModal(false);
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

        {/* Vendor Avatar Trigger for Profile Drawer */}
        <div>
          <button
            type="button"
            onClick={() => {
              setShowProfileDrawer(true);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 pl-2.5 pr-2 py-1.5 rounded-lg border-l border-slate-200 hover:bg-slate-50 transition-all cursor-pointer group"
            title="Open Account & Profile Drawer"
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
              className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${showProfileDrawer ? 'rotate-180 text-purple-600' : 'group-hover:text-slate-600'
                }`}
            />
          </button>
        </div>

        {/* Module Launcher Icon Button at Right Edge */}
        <button
          type="button"
          onClick={() => setShowModuleDrawer(true)}
          className="relative h-9 w-9 rounded-md border border-slate-200 bg-white hover:bg-purple-50 hover:border-purple-200 text-slate-600 hover:text-purple-700 flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-2xs"
          title="Module Subscriptions & Access"
          aria-label="Module Subscriptions & Access"
        >
          <LayoutGrid className="h-4 w-4" />
        </button>
      </div>

      {/* Smart Module Access & Subscription Slide-over Drawer */}
      <ModuleAccessDrawer
        isOpen={showModuleDrawer}
        onClose={() => setShowModuleDrawer(false)}
        currentVendor={currentVendor}
        onShowToast={onShowToast}
      />

      {/* Profile & Account Slide-over Drawer */}
      <VendorProfileDrawer
        isOpen={showProfileDrawer}
        onClose={() => setShowProfileDrawer(false)}
        currentVendor={currentVendor}
        onLogout={onLogout}
      />
    </header>
  );
};
