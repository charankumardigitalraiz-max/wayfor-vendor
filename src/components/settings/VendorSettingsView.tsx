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
  Globe2
} from 'lucide-react';
import { mockVendorProfile } from '../../data/mockVendorData';

interface VendorSettingsViewProps {
  onShowToast: (msg: string) => void;
}

export const VendorSettingsView: React.FC<VendorSettingsViewProps> = ({
  onShowToast
}) => {
  const [companyName, setCompanyName] = useState(mockVendorProfile.companyName);
  const [contactName, setContactName] = useState(mockVendorProfile.name);
  const [email, setEmail] = useState(mockVendorProfile.email);
  const [phone, setPhone] = useState(mockVendorProfile.phone);
  const [gstNumber, setGstNumber] = useState(mockVendorProfile.gstNumber);
  const [bankName, setBankName] = useState(mockVendorProfile.bankName);
  const [bankAccount, setBankAccount] = useState(mockVendorProfile.bankAccountNumber);
  const [ifsc, setIfsc] = useState(mockVendorProfile.ifscCode);

  const [notifyOnSellout, setNotifyOnSellout] = useState(true);
  const [notifyOnGateMilestone, setNotifyOnGateMilestone] = useState(true);
  const [notifyOnPayout, setNotifyOnPayout] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onShowToast('Studio profile and banking settings updated successfully!');
  };

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Top Banner */}
      <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-2xs">
        <h1 className="text-xl font-semibold tracking-tight text-slate-900">
          Organizer Profile & Studio Settings
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage your live touring agency credentials, statutory GST registration, and settlement bank accounts.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Profile Card */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Globe2 className="h-4 w-4 text-purple-600" />
            <h3 className="text-sm font-semibold text-slate-900">
              Tour Promoter Agency Details
            </h3>
          </div>

          <div className="flex items-center gap-4">
            <img
              src={mockVendorProfile.avatar}
              alt={contactName}
              className="h-16 w-16 rounded-2xl object-cover ring-2 ring-purple-500/30"
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Company / Agency Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Authorized Officer Name</label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Official Contact Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Direct Helpline Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="font-semibold text-slate-700">Statutory GSTIN Number</label>
              <input
                type="text"
                value={gstNumber}
                onChange={(e) => setGstNumber(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 font-mono focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Banking Details Card */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Building className="h-4 w-4 text-purple-600" />
            <h3 className="text-sm font-semibold text-slate-900">
              Corporate Bank Settlement Account
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Bank Name</label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Account Number</label>
              <input
                type="text"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 font-mono focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">IFSC Code</label>
              <input
                type="text"
                value={ifsc}
                onChange={(e) => setIfsc(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 font-mono focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Live Gate Scanner Tokens */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Key className="h-4 w-4 text-purple-600" />
            <h3 className="text-sm font-semibold text-slate-900">
              Gate Scanner Device Tokens
            </h3>
          </div>

          <p className="text-xs text-slate-500">
            Use this secure token on Android / iOS handheld barcode scanners at stadium turnstiles.
          </p>

          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value="dgtz_vtok_live_891204812401824912048912"
              className="flex-1 rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2 text-xs text-slate-600 font-mono"
            />
            <button
              type="button"
              onClick={() => onShowToast('Scanner device token copied to clipboard!')}
              className="px-4 py-2 rounded-md text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Copy Token
            </button>
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-md text-xs font-semibold bg-purple-600 text-white hover:bg-purple-700 shadow-md shadow-purple-200 transition-all cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>Save Studio Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
