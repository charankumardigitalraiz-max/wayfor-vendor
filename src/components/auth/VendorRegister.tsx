import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Building2,
  User,
  Phone,
  CreditCard,
  AlertCircle,
  ChevronDown,
  TrendingUp,
  Lightbulb,
  Check,
  Zap,
  CheckCircle2,
  Radio,
  Activity
} from 'lucide-react';
import { vendorAuthService } from '../../services/vendorAuthService';
import type { VendorUser } from '../../types/auth';

interface VendorRegisterProps {
  onRegister: (user: VendorUser) => void;
  onShowToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const VendorRegister: React.FC<VendorRegisterProps> = ({ onRegister, onShowToast }) => {
  const navigate = useNavigate();

  // Primary Fields
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Optional Banking Fields
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [gstNumber, setGstNumber] = useState('');
  const [bankName, setBankName] = useState('HDFC Bank Ltd');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');

  // Agreement
  const [acceptTerms, setAcceptTerms] = useState(true);

  // Status
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim() || !companyName.trim() || !email.trim() || !phone.trim() || !password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (!acceptTerms) {
      setErrorMessage('Please accept the Terms of Service to continue.');
      return;
    }

    setIsLoading(true);
    try {
      const { user } = await vendorAuthService.register({
        name: name.trim(),
        companyName: companyName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
        gstNumber: gstNumber.trim() || undefined,
        bankName: bankName.trim() || undefined,
        bankAccountNumber: bankAccountNumber.trim() || undefined,
        ifscCode: ifscCode.trim() || undefined
      });

      if (onShowToast) {
        onShowToast(`Welcome to Wayfor Studio, ${user.name}!`, 'success');
      }

      onRegister(user);
      navigate('/overview', { replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen max-h-screen overflow-hidden flex bg-white font-sans selection:bg-purple-100 selection:text-purple-800">

      {/* Left Column: Visual Stage Graphic & Connected Glass Cards (Fits 100% in Screen) */}
      <div className="hidden lg:flex lg:w-[58%] xl:w-[60%] h-full relative flex-col justify-between p-8 lg:p-10 xl:p-12 overflow-hidden text-white bg-slate-950">

        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('/promoter_hero_bg.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-purple-950/25 to-slate-950/45 pointer-events-none" />

        {/* Top Header */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-xl">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-wider text-white block leading-none">WAYFOR</span>
              <span className="text-[9px] tracking-widest text-purple-200/80 uppercase font-medium">Promoter Studio OS</span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-[10px] font-semibold tracking-widest text-white/75 uppercase">
            <span className="hover:text-white transition-colors cursor-default">Tours</span>
            <span className="hover:text-white transition-colors cursor-default">Turnstiles</span>
            <span className="hover:text-white transition-colors cursor-default">Ticketing</span>
            <span className="hover:text-white transition-colors cursor-default">Settlements</span>
          </div>
        </div>

        {/* Centerpiece Content */}
        <div className="relative z-10 my-auto py-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[11px] font-medium mb-3 shadow-xs">
            <Radio className="h-3 w-3 text-purple-300 animate-pulse" />
            <span>Join 120+ Verified Concert Promoters</span>
          </div>

          <h1 className="text-3xl lg:text-4xl xl:text-[44px] font-extrabold tracking-tight leading-[1.12] text-white">
            Scale your arena tours <br />
            with clarity
          </h1>
          <p className="mt-2 text-xs lg:text-sm text-white/85 max-w-lg leading-relaxed">
            Register your organizer studio to publish tour dates, manage live ticket quotas, and automate turnstile entries.
          </p>

          {/* Connected Floating Glassmorphic Nodes */}
          <div className="relative mt-6 w-full max-w-xl h-56">
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-0"
              viewBox="0 0 540 220"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M130 65 C 190 65, 230 110, 270 110"
                stroke="rgba(255, 255, 255, 0.4)"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              <path
                d="M110 160 C 180 160, 220 110, 270 110"
                stroke="rgba(255, 255, 255, 0.4)"
                strokeWidth="2"
              />
              <path
                d="M270 110 C 320 110, 350 160, 420 160"
                stroke="rgba(255, 255, 255, 0.4)"
                strokeWidth="2"
              />
              <path
                d="M270 110 C 330 110, 360 60, 430 60"
                stroke="rgba(255, 255, 255, 0.4)"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
            </svg>

            {/* Node 1: Tiers */}
            <div className="absolute top-1 left-2 z-10 w-44 p-3 rounded-xl bg-white/15 backdrop-blur-md border border-white/25 shadow-xl hover:bg-white/20 transition-all cursor-default">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <div className="h-6 w-6 rounded-md bg-indigo-500/40 flex items-center justify-center text-white">
                    <TrendingUp className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-bold text-white">Tier Quotas</span>
                </div>
                <span className="text-[9px] font-semibold px-1 py-0.2 rounded bg-indigo-500/30 text-indigo-100">Live</span>
              </div>
              <p className="text-[11px] text-white/80 leading-tight">Live seating manifests</p>
              <div className="mt-2 h-1 w-full rounded-full bg-white/20 overflow-hidden">
                <div className="h-full rounded-full bg-emerald-400 w-[95%]" />
              </div>
            </div>

            {/* Node 2: Tour Stops */}
            <div className="absolute bottom-2 left-4 z-10 w-48 p-3 rounded-xl bg-white/15 backdrop-blur-md border border-white/25 shadow-xl hover:bg-white/20 transition-all cursor-default">
              <div className="flex items-center gap-1.5 mb-1">
                <div className="h-6 w-6 rounded-md bg-purple-500/40 flex items-center justify-center text-white">
                  <Lightbulb className="h-3.5 w-3.5" />
                </div>
                <span className="text-xs font-bold text-white">Stadium Tours</span>
              </div>
              <p className="text-[11px] text-white/80 leading-tight">Multi-city arena stops</p>
              <div className="mt-1.5 flex items-center gap-1 text-[10px] text-purple-200">
                <Activity className="h-3 w-3 text-purple-300" />
                <span>Roster synced</span>
              </div>
            </div>

            {/* Center Node */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
              <div className="relative flex items-center justify-center">
                <span className="animate-ping absolute inline-flex h-12 w-12 rounded-full bg-purple-400 opacity-40" />
                <div className="h-11 w-11 rounded-full bg-gradient-to-tr from-purple-500 via-indigo-500 to-pink-500 border-2 border-white shadow-xl shadow-purple-500/90 flex items-center justify-center text-white">
                  <Check className="h-5 w-5 stroke-[3]" />
                </div>
              </div>
            </div>

            {/* Node 3: Box Office */}
            <div className="absolute top-1 right-3 z-10 w-44 p-3 rounded-xl bg-white/15 backdrop-blur-md border border-white/25 shadow-xl hover:bg-white/20 transition-all cursor-default">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <div className="h-6 w-6 rounded-md bg-emerald-500/40 flex items-center justify-center text-white">
                    <Zap className="h-3.5 w-3.5 text-emerald-300" />
                  </div>
                  <span className="text-xs font-bold text-white">Box Office</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-300">T+1 Settle</span>
              </div>
              <p className="text-[11px] text-white/80 leading-tight">Direct bank deposits</p>
              <div className="mt-1.5 h-1 w-20 rounded-full bg-emerald-400/50" />
            </div>

            {/* Node 4: Gate Sync */}
            <div className="absolute bottom-2 right-4 z-10 w-44 p-3 rounded-xl bg-white/15 backdrop-blur-md border border-white/25 shadow-xl hover:bg-white/20 transition-all cursor-default">
              <div className="flex items-center gap-1.5 mb-1">
                <div className="h-6 w-6 rounded-md bg-blue-500/40 flex items-center justify-center text-white">
                  <CheckCircle2 className="h-3.5 w-3.5 text-blue-300" />
                </div>
                <span className="text-xs font-bold text-white">Gate Sync</span>
              </div>
              <p className="text-[11px] text-white/80 leading-tight">38ms RFID tap entry</p>
              <div className="mt-1.5 h-1 w-16 rounded-full bg-blue-400/50" />
            </div>
          </div>
        </div>

        {/* Bottom Tagline */}
        <div className="relative z-10 flex items-center justify-between pt-3 border-t border-white/10 text-white/80">
          <div className="space-y-0.5">
            <div className="h-0.5 w-6 bg-white/70 mb-0.5" />
            <p className="text-[10px] tracking-widest font-bold uppercase text-white">
              Better Live Concerts
            </p>
            <p className="text-[9px] tracking-widest uppercase text-white/60">
              Unforgettable Fan Experiences
            </p>
          </div>

          <div className="text-right text-[10px] text-white/70">
            <span className="font-semibold text-white">120+ Verified Promoters</span> · <span className="text-emerald-400">99.98% Uptime</span>
          </div>
        </div>
      </div>

      {/* Right Column: Tailored Form Section (Fits 100% on Screen with Zero Scroll) */}
      <div className="flex-1 lg:w-[42%] xl:w-[40%] h-full flex flex-col justify-center items-center px-6 sm:px-10 lg:px-12 py-3 bg-white overflow-hidden">
        <div className="w-full max-w-[400px] mx-auto space-y-3.5">

          {/* Mobile Header */}
          <div className="flex lg:hidden items-center justify-center gap-2 mb-1">
            <div className="h-8 w-8 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-md shadow-purple-200">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">WAYFOR</span>
          </div>

          <div className="text-center space-y-1">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Create an account
            </h2>
            <p className="text-xs text-slate-500">
              Register your studio to publish arena tours & box office ticketing
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-in fade-in duration-200">
              <AlertCircle className="h-3.5 w-3.5 shrink-0 text-rose-600" />
              <span className="font-medium text-[11px]">{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-2.5 pt-0.5">
            {/* Row 1: Full Name & Company Name (2 Columns) */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Vikram Singhania"
                    className="w-full pl-8 pr-2.5 py-2 rounded-md border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-500/10 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">Company / Agency</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Zenith Ent."
                    className="w-full pl-8 pr-2.5 py-2 rounded-md border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-500/10 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Work Email & Phone (2 Columns) */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">Work Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.in"
                    className="w-full pl-8 pr-2.5 py-2 rounded-md border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-500/10 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98450 82910"
                    className="w-full pl-8 pr-2.5 py-2 rounded-md border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-500/10 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Row 3: Password & Confirm (2 Columns) */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 chars"
                    className="w-full pl-8 pr-7 py-2 rounded-md border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-500/10 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                  >
                    {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">Confirm</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter"
                    className="w-full pl-8 pr-2.5 py-2 rounded-md border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-500/10 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Optional Collapsible Banking Section */}
            <div className="pt-0.5">
              <button
                type="button"
                onClick={() => setShowBankDetails(!showBankDetails)}
                className="w-full flex items-center justify-between p-2 rounded-md border border-slate-200 bg-slate-50/70 hover:bg-slate-100/70 text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-1.5 text-[11px]">
                  <CreditCard className="h-3.5 w-3.5 text-purple-600" />
                  <span className="font-semibold text-slate-700">Bank Details & GST (Optional)</span>
                </div>
                <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform ${showBankDetails ? 'rotate-180' : ''}`} />
              </button>

              {showBankDetails && (
                <div className="p-2.5 mt-1.5 rounded-md border border-slate-200 bg-slate-50/50 space-y-2 animate-in fade-in duration-150">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-0.5">
                      <label className="text-[10px] font-bold text-slate-600">GST Number</label>
                      <input
                        type="text"
                        value={gstNumber}
                        onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                        placeholder="36AAACZ8912P1ZV"
                        className="w-full px-2 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-mono uppercase focus:outline-none focus:border-purple-600"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[10px] font-bold text-slate-600">Bank Name</label>
                      <input
                        type="text"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        placeholder="HDFC Bank"
                        className="w-full px-2 py-1 rounded-lg bg-white border border-slate-200 text-[11px] focus:outline-none focus:border-purple-600"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[10px] font-bold text-slate-600">Account Number</label>
                      <input
                        type="text"
                        value={bankAccountNumber}
                        onChange={(e) => setBankAccountNumber(e.target.value)}
                        placeholder="50200084918231"
                        className="w-full px-2 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-mono focus:outline-none focus:border-purple-600"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[10px] font-bold text-slate-600">IFSC Code</label>
                      <input
                        type="text"
                        value={ifscCode}
                        onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                        placeholder="HDFC0000240"
                        className="w-full px-2 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-mono uppercase focus:outline-none focus:border-purple-600"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Terms checkbox */}
            <div className="pt-0.5">
              <label className="flex items-start gap-1.5 text-[11px] text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  required
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="rounded border-slate-300 text-purple-600 focus:ring-purple-500/20 h-3.5 w-3.5 mt-0.5 cursor-pointer shrink-0"
                />
                <span>
                  I agree to the <span className="text-purple-600 underline font-medium">Terms of Service</span> and organizer policies.
                </span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-600/20 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1"
            >
              {isLoading ? (
                <>
                  <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating Studio...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch to Login */}
          <div className="pt-1 text-center">
            <p className="text-xs text-slate-500">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="font-bold text-purple-600 hover:text-purple-700 hover:underline cursor-pointer"
              >
                Sign in
              </button>
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
