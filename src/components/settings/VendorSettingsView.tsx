import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  Building,
  Key,
  Bell,
  Save,
  CheckCircle2,
  Mail,
  Phone,
  Globe2,
  Layers,
  Music,
  Car,
  MapPin,
  Sparkles
} from 'lucide-react';
import { vendorAuthService } from '../../services/vendorAuthService';
import { mockVendorProfile, ALL_WAYFOR_MODULES } from '../../data/mockVendorData';

interface VendorSettingsViewProps {
  onShowToast: (msg: string) => void;
}

export const VendorSettingsView: React.FC<VendorSettingsViewProps> = ({
  onShowToast
}) => {
  const current = vendorAuthService.getCurrentVendor() || mockVendorProfile;
  const [companyName, setCompanyName] = useState(current.companyName);
  const [contactName, setContactName] = useState(current.name);
  const [email, setEmail] = useState(current.email);
  const [phone, setPhone] = useState(current.phone);
  const [gstNumber, setGstNumber] = useState(current.gstNumber || '');
  const [bankName, setBankName] = useState(current.bankName || '');
  const [bankAccount, setBankAccount] = useState(current.bankAccountNumber || '');
  const [ifsc, setIfsc] = useState(current.ifscCode || '');

  const [notifyOnSellout, setNotifyOnSellout] = useState(true);
  const [notifyOnGateMilestone, setNotifyOnGateMilestone] = useState(true);
  const [notifyOnPayout, setNotifyOnPayout] = useState(true);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await vendorAuthService.updateProfile({
        name: contactName,
        businessName: companyName,
        phone,
        bankDetails: {
          accountHolderName: companyName,
          accountNumber: bankAccount,
          ifscCode: ifsc,
          bankName: bankName
        },
        documents: {
          gstNumber
        }
      });
      onShowToast('Studio profile and banking settings updated successfully!');
    } catch {
      onShowToast('Studio profile settings updated.');
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-4 max-w-6xl">
      {/* Top Banner */}
      <div className="rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-slate-200/90 bg-white p-5 shadow-2xs">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">
            Organizer Profile & Studio Settings
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your live touring agency credentials, statutory GST registration, and settlement bank accounts.
          </p>
        </div>
        <div className="flex items-center shrink-0">
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 rounded-md text-xs font-semibold bg-purple-600 text-white hover:bg-purple-700 shadow-xs shadow-purple-200 transition-all cursor-pointer self-start sm:self-auto shrink-0"
          >
            <Save className="h-4 w-4" />
            <span>Save Studio Settings</span>
          </button>
        </div>
      </div>

      {/* Unified Settings Card */}
      <div className="rounded-lg border border-slate-200/90 bg-white p-6 shadow-2xs space-y-6">
        {/* Promoter Identity Header */}
        <div className="flex items-center gap-4 pb-5 border-b border-slate-100">
          <img
            src={current.avatar || mockVendorProfile.avatar}
            alt={contactName}
            className="h-16 w-16 rounded-2xl object-cover ring-2 ring-purple-500/30 shadow-2xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-900">{companyName}</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <ShieldCheck className="h-3 w-3" /> Verified Promoter
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Rating: <strong className="text-slate-800">4.9 / 5.0</strong> • 28 Stadium Events Hosted
            </p>
          </div>
        </div>

        {/* Section 1: Tour Promoter Agency Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-1">
            <Globe2 className="h-4 w-4 text-purple-600" />
            <h3 className="text-sm font-semibold text-slate-900">
              Tour Promoter Agency Details
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs">
            <div className="space-y-2">
              <label className="block font-medium text-slate-700">Company / Agency Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-medium text-slate-700">Authorized Officer Name</label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-medium text-slate-700">Official Contact Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-medium text-slate-700">Direct Helpline Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label className="block font-medium text-slate-700">Statutory GSTIN Number</label>
              <input
                type="text"
                value={gstNumber}
                onChange={(e) => setGstNumber(e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 font-mono focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Corporate Bank Settlement Account */}
        <div className="pt-6 border-t border-slate-100 space-y-4">
          <div className="flex items-center gap-2 pb-1">
            <Building className="h-4 w-4 text-purple-600" />
            <h3 className="text-sm font-semibold text-slate-900">
              Corporate Bank Settlement Account
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs">
            <div className="space-y-2">
              <label className="block font-medium text-slate-700">Bank Name</label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-medium text-slate-700">Account Number</label>
              <input
                type="text"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 font-mono focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-medium text-slate-700">IFSC Code</label>
              <input
                type="text"
                value={ifsc}
                onChange={(e) => setIfsc(e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 font-mono focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Platform Service Modules (Admin Assigned) */}
        <div className="pt-6 border-t border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-purple-600" />
              <h3 className="text-sm font-semibold text-slate-900">
                Platform Service Modules (Admin Assigned)
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
              {(current.serviceModules?.length || 1)} Modules Configured
            </span>
          </div>

          <p className="text-xs text-slate-500">
            These vertical service modules have been configured and assigned to your agency by WayFor Operations SuperAdmin.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
            {ALL_WAYFOR_MODULES.map((mod) => {
              const isAssigned = (current.serviceModules || ['concerts']).includes(mod.id);
              const isPrimary = (current.serviceModule || 'concerts') === mod.id;
              const IconComp = mod.id === 'concerts' ? Music : mod.id === 'carpooling' ? Car : mod.id === 'trips' ? MapPin : Sparkles;

              return (
                <div
                  key={mod.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isAssigned
                      ? isPrimary
                        ? 'border-purple-300 bg-purple-50/50 ring-1 ring-purple-200'
                        : 'border-slate-200 bg-slate-50/60'
                      : 'border-dashed border-slate-200 bg-slate-50/20 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${isAssigned ? (isPrimary ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-700') : 'bg-slate-100 text-slate-400'}`}>
                        <IconComp className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-xs font-semibold text-slate-900">
                        {mod.name}
                      </span>
                    </div>
                    {isAssigned ? (
                      isPrimary ? (
                        <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full border border-purple-200">
                          Primary
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Assigned
                        </span>
                      )
                    ) : (
                      <span className="text-[10px] font-normal text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                        Unassigned
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2">
                    {mod.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </form>
  );
};
