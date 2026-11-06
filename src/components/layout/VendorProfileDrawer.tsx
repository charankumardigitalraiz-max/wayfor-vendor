import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
  X,
  User,
  Settings,
  LogOut,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import type { VendorUser } from '../../types/auth';
import { mockVendorProfile } from '../../data/mockVendorData';

export interface VendorProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentVendor?: VendorUser | null;
  onLogout?: () => void;
}

export const VendorProfileDrawer: React.FC<VendorProfileDrawerProps> = ({
  isOpen,
  onClose,
  currentVendor,
  onLogout
}) => {
  const navigate = useNavigate();
  const profile = currentVendor || mockVendorProfile;

  // Close on Escape & Lock body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const companyName = profile.companyName || profile.name || 'DigitalRaiz Live Private Limited';
  const email = profile.email || 'partner@digitalraiz.com';

  const handleNavigate = (path: string) => {
    onClose();
    navigate(path);
  };

  const handleSignOut = () => {
    onClose();
    if (onLogout) {
      onLogout();
    }
  };

  const drawerContent = (
    <div className="fixed inset-0 z-[9999] overflow-hidden" role="dialog" aria-modal="true">
      {/* Full Viewport Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in cursor-pointer"
        onClick={onClose}
      />

      {/* Slide-over Right Drawer Container */}
      <div className="fixed inset-y-0 right-0 z-[10000] flex max-w-full pl-4 sm:pl-6">
        {/* Ultra-Compact Drawer (max-w-xs = 320px) */}
        <div className="w-screen max-w-xs bg-white shadow-2xl border-l border-slate-200 flex flex-col h-screen transform transition-all ease-in-out duration-300 animate-in slide-in-from-right font-sans antialiased text-slate-800">
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3.5 bg-white shrink-0 sticky top-0 z-20">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-purple-50 text-purple-700 border border-purple-200/80 flex items-center justify-center shrink-0">
                <User className="h-4 w-4" />
              </div>
              <h2 className="text-sm font-semibold text-slate-900">
                Account & Profile
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
              title="Close Drawer (Esc)"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Scrollable Drawer Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* User Identity Hero Card */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
              <div className="relative shrink-0">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="h-11 w-11 rounded-full object-cover border border-slate-200 shadow-2xs"
                />
                <span
                  className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white"
                  title="Online"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-semibold tracking-tight text-slate-900 truncate">
                    {profile.name}
                  </h3>
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                </div>
                <p className="text-xs text-slate-500 font-normal truncate mt-0.5">
                  {email}
                </p>
              </div>
            </div>

            {/* Quick Actions Navigation List */}
            <div className="space-y-1.5 pt-1">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block px-1 mb-1">
                Promoter Management
              </span>

              <button
                type="button"
                onClick={() => handleNavigate('/profile')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 border border-purple-200/80 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="text-sm font-medium tracking-tight text-slate-900 group-hover:text-purple-700 transition-colors block">
                      My Profile
                    </span>
                    <span className="text-xs text-slate-400 block mt-0.5">
                      Organizer details & credentials
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                type="button"
                onClick={() => handleNavigate('/settings')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-700 border border-slate-200/80 flex items-center justify-center shrink-0">
                    <Settings className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="text-sm font-medium tracking-tight text-slate-900 group-hover:text-purple-700 transition-colors block">
                      Studio Settings
                    </span>
                    <span className="text-xs text-slate-400 block mt-0.5">
                      POS, bank accounts & security
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>
          </div>

          {/* Sticky Drawer Footer */}
          <div className="p-4 border-t border-slate-100 bg-white shrink-0 space-y-2">
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-50 text-rose-700 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(drawerContent, document.body)
    : drawerContent;
};

export default VendorProfileDrawer;

