import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  KeyRound,
  X,
  CheckCircle2,
  TrendingUp,
  Lightbulb,
  Check,
  Zap,
  Radio,
  Activity
} from 'lucide-react';
import { vendorAuthService } from '../../services/vendorAuthService';
import type { VendorUser } from '../../types/auth';

interface VendorLoginProps {
  onLogin: (user: VendorUser) => void;
  onShowToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const VendorLogin: React.FC<VendorLoginProps> = ({ onLogin, onShowToast }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('vikram@zenithentertainment.in');
  const [password, setPassword] = useState('Promoter@Wayfor2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const handlePresetSelect = (presetEmail: string) => {
    setEmail(presetEmail);
    setPassword('Promoter@Wayfor2026');
    setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const { user } = await vendorAuthService.login({
        email: email.trim(),
        password,
        rememberMe
      });
      if (onShowToast) {
        onShowToast(`Welcome back, ${user.name}!`, 'success');
      }
      onLogin(user);
      navigate('/overview', { replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid credentials. Please try again.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSent(true);
    setTimeout(() => {
      setForgotSent(false);
      setIsForgotModalOpen(false);
      if (onShowToast) {
        onShowToast(`Reset instructions sent to ${forgotEmail}`, 'info');
      }
    }, 1800);
  };

  return (
    <div className="h-screen max-h-screen overflow-hidden flex bg-white font-sans selection:bg-purple-100 selection:text-purple-800">

      {/* Left Column: Expanded Visual Showcase (60% to 62% Width, Fits 100% in Viewport) */}
      <div className="hidden lg:flex lg:w-[60%] xl:w-[62%] h-full relative flex-col justify-between p-8 lg:p-10 xl:p-12 overflow-hidden text-white bg-slate-950">

        {/* Background Image with High-Definition Lighting */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700"
          style={{ backgroundImage: `url('/promoter_hero_bg.jpg')` }}
        />
        {/* Cinematic gradient overlay for optimal depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-purple-950/25 to-slate-950/45 pointer-events-none" />

        {/* Top Header: Logo + Nav Items */}
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

          {/* <div className="flex items-center gap-6 text-[10px] font-semibold tracking-widest text-white/75 uppercase">
            <span className="hover:text-white transition-colors cursor-default">Tours</span>
            <span className="hover:text-white transition-colors cursor-default">Turnstiles</span>
            <span className="hover:text-white transition-colors cursor-default">Ticketing</span>
            <span className="hover:text-white transition-colors cursor-default">Settlements</span>
          </div> */}
        </div>

        {/* Centerpiece: Grand Headline & Connected Interactive Node Deck */}
        <div className="relative z-10 my-auto py-2 max-w-2xl">

          {/* <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[11px] font-medium mb-3 shadow-xs">
            <Radio className="h-3 w-3 text-purple-300 animate-pulse" />
            <span>Next-Gen Stadium & Arena Box Office Grid</span>
          </div> */}

          <h1 className="text-3xl lg:text-4xl xl:text-[44px] font-extrabold tracking-tight leading-[1.12] text-white">
            Build your tours <br />
            with confidence
          </h1>
          <p className="mt-2 text-xs lg:text-sm text-white/85 max-w-lg leading-relaxed">
            A smarter way to orchestrate mega arena tours, manage live tier quotas, and automate turnstile gate entries across India.
          </p>

          {/* Connected Floating Glassmorphic Diagram */}
          <div className="relative mt-6 w-full max-w-xl h-56">

            {/* SVG Connecting Flow Lines */}
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

            {/* Node 1 (Top Left): Tiers */}
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
              <p className="text-[11px] text-white/80 leading-tight">84,200 / 85k sold (99%)</p>
              <div className="mt-2 h-1 w-full rounded-full bg-white/20 overflow-hidden">
                <div className="h-full rounded-full bg-emerald-400 w-[99%]" />
              </div>
            </div>

            {/* Node 2 (Bottom Left): Arena Tours */}
            <div className="absolute bottom-2 left-4 z-10 w-48 p-3 rounded-xl bg-white/15 backdrop-blur-md border border-white/25 shadow-xl hover:bg-white/20 transition-all cursor-default">
              <div className="flex items-center gap-1.5 mb-1">
                <div className="h-6 w-6 rounded-md bg-purple-500/40 flex items-center justify-center text-white">
                  <Lightbulb className="h-3.5 w-3.5" />
                </div>
                <span className="text-xs font-bold text-white">Stadium Tours</span>
              </div>
              <p className="text-[11px] text-white/80 leading-tight">DY Patil & Arena Roster</p>
              <div className="mt-1.5 flex items-center gap-1 text-[10px] text-purple-200">
                <Activity className="h-3 w-3 text-purple-300" />
                <span>Roster synced</span>
              </div>
            </div>

            {/* Central Glowing Pulse Orb with Checkmark */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
              <div className="relative flex items-center justify-center">
                <span className="animate-ping absolute inline-flex h-12 w-12 rounded-full bg-purple-400 opacity-40" />
                <div className="h-11 w-11 rounded-full bg-gradient-to-tr from-purple-500 via-indigo-500 to-pink-500 border-2 border-white shadow-xl shadow-purple-500/90 flex items-center justify-center text-white">
                  <Check className="h-5 w-5 stroke-[3]" />
                </div>
              </div>
            </div>

            {/* Node 3 (Top Right): Box Office & Payouts */}
            <div className="absolute top-1 right-3 z-10 w-44 p-3 rounded-xl bg-white/15 backdrop-blur-md border border-white/25 shadow-xl hover:bg-white/20 transition-all cursor-default">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <div className="h-6 w-6 rounded-md bg-emerald-500/40 flex items-center justify-center text-white">
                    <Zap className="h-3.5 w-3.5 text-emerald-300" />
                  </div>
                  <span className="text-xs font-bold text-white">Box Office</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-300">₹18.4 Cr</span>
              </div>
              <p className="text-[11px] text-white/80 leading-tight">Instant T+1 Settle</p>
              <div className="mt-1.5 h-1 w-20 rounded-full bg-emerald-400/50" />
            </div>

            {/* Node 4 (Bottom Right): Gate Turnstiles */}
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

        {/* Bottom Tagline & Metrics Proof */}
        {/* <div className="relative z-10 flex items-center justify-between pt-3 border-t border-white/10 text-white/80">
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
        </div> */}
      </div>

      {/* Right Column: Tailored, Compact Form Section (Zero Page Scroll) */}
      <div className="flex-1 lg:w-[40%] xl:w-[38%] h-full flex flex-col justify-center items-center px-6 sm:px-10 lg:px-12 py-4 bg-white overflow-hidden">
        <div className="w-full max-w-[360px] mx-auto space-y-4">

          {/* Mobile Brand Bar */}
          <div className="flex lg:hidden items-center justify-center gap-2 mb-1">
            <div className="h-8 w-8 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-md shadow-purple-200">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">WAYFOR</span>
          </div>

          {/* Form Heading */}
          <div className="text-center space-y-1">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Welcome back
            </h2>
            <p className="text-xs text-slate-500">
              Sign in to continue to your account
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-in fade-in duration-200">
              <AlertCircle className="h-3.5 w-3.5 shrink-0 text-rose-600" />
              <span className="font-medium text-[11px]">{errorMessage}</span>
            </div>
          )}

          {/* Main Form */}
          <form onSubmit={handleSubmit} className="space-y-3 pt-0.5">
            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-700 block">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-500/10 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-700 block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-500/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                >
                  {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            {/* Options: Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-0.5">
              <label className="flex items-center gap-1.5 text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-purple-600 focus:ring-purple-500/20 h-3.5 w-3.5 cursor-pointer"
                />
                <span className="text-[11px] font-medium">Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => setIsForgotModalOpen(true)}
                className="text-purple-600 hover:text-purple-700 hover:underline text-[11px] font-semibold cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-600/20 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1"
            >
              {isLoading ? (
                <>
                  <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider: or continue with */}
          <div className="relative my-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-[11px]">
              <span className="bg-white px-2.5 text-slate-400">or continue with demo accounts</span>
            </div>
          </div>

          {/* Social-style 2-Column Buttons for Instant Demo Logins */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handlePresetSelect('vikram@zenithentertainment.in')}
              className={`flex items-center justify-center gap-2 py-2 px-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${email === 'vikram@zenithentertainment.in'
                ? 'border-purple-600 bg-purple-50 text-purple-700 ring-2 ring-purple-100'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                }`}
            >
              <div className="h-4.5 w-4.5 rounded-md bg-purple-100 text-purple-700 flex items-center justify-center text-[10px] font-bold">
                Z
              </div>
              <span className="truncate text-[11px]">Zenith Live</span>
            </button>

            <button
              type="button"
              onClick={() => handlePresetSelect('arjun@sunburnarena.com')}
              className={`flex items-center justify-center gap-2 py-2 px-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${email === 'arjun@sunburnarena.com'
                ? 'border-purple-600 bg-purple-50 text-purple-700 ring-2 ring-purple-100'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                }`}
            >
              <div className="h-4.5 w-4.5 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center text-[10px] font-bold">
                S
              </div>
              <span className="truncate text-[11px]">Sunburn Arena</span>
            </button>
          </div>

          {/* Bottom Switch Link: Don't have an account? Sign up */}
          <div className="pt-1 text-center">
            <p className="text-xs text-slate-500">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="font-bold text-purple-600 hover:text-purple-700 hover:underline cursor-pointer"
              >
                Sign up
              </button>
            </p>
          </div>

        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-purple-700">
                <KeyRound className="h-5 w-5 text-purple-600" />
                <h3 className="text-sm font-semibold text-slate-900">Reset Password</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsForgotModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Enter your work email address to receive password reset instructions.
            </p>

            {forgotSent ? (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Reset link sent! Please check your email.</span>
              </div>
            ) : (
              <form onSubmit={handleSendReset} className="space-y-3.5">
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="promoter@entertainment.in"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white"
                  autoFocus
                />
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(false)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white shadow-xs cursor-pointer"
                  >
                    Send Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
