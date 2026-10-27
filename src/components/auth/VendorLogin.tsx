import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  KeyRound,
  X,
  CheckCircle2,
  Zap
} from 'lucide-react';
import { vendorAuthService, PRESET_VENDOR_ACCOUNTS } from '../../services/vendorAuthService';
import type { VendorUser } from '../../types/auth';
import { Modal } from '../common/Modal';

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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 text-slate-800 font-sans">

      {/* Main Card with Entire Design Inside */}
      <div className="w-full max-w-md">
        <div className="bg-white py-8 px-6 sm:px-8 rounded-xl border border-slate-200 shadow-xs space-y-5">

          {/* Header Inside Card */}
          <div className="text-center pb-1">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-purple-600 text-white shadow-sm mb-3">
              <Sparkles className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
              Sign in to Wayfor Studio
            </h1>
            <p className="mt-1 text-sm text-slate-500 font-normal">
              Concert Organizer & Promoter Console
            </p>
          </div>

          {/* Quick Demo Accounts */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-500 font-normal">
              <span className="flex items-center gap-1 text-slate-600 font-medium">
                <Zap className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                Demo Accounts
              </span>
              <span>Click to auto-fill</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {PRESET_VENDOR_ACCOUNTS.map((preset) => {
                const isSelected = email.toLowerCase() === preset.email.toLowerCase();
                return (
                  <button
                    key={preset.email}
                    type="button"
                    onClick={() => handlePresetSelect(preset.email)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium text-center truncate transition-colors border cursor-pointer ${isSelected
                        ? 'bg-purple-50 text-purple-700 border-purple-300'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-800'
                      }`}
                    title={preset.profile.companyName}
                  >
                    {preset.profile.name.split(' ')[0]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700 block">
                Work Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="promoter@entertainment.in"
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(true)}
                  className="text-xs text-purple-600 hover:text-purple-700 hover:underline font-medium cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-9 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center text-xs">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-purple-600 focus:ring-purple-500/20 h-4 w-4 cursor-pointer"
                />
                <span className="font-normal">Remember me for 30 days</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-lg text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign in</span>
              )}
            </button>
          </form>

          {/* Switch to Register */}
          <div className="pt-3 text-center border-t border-slate-100">
            <p className="text-xs text-slate-500 font-normal">
              Don't have an organizer studio?{' '}
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="font-medium text-purple-600 hover:text-purple-700 hover:underline cursor-pointer"
              >
                Register here
              </button>
            </p>
          </div>

        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-slate-400 font-normal">
          &copy; 2026 Wayfor Entertainment Touring Ltd. All rights reserved.
        </p>
      </div>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <Modal
          isOpen={isForgotModalOpen}
          onClose={() => setIsForgotModalOpen(false)}
          title="Reset Password"
          subtitle="Enter your work email address to receive password reset instructions"
          maxWidth="sm"
        >
          <div className="space-y-4">
            {forgotSent ? (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Reset link sent! Please check your email inbox.</span>
              </div>
            ) : (
              <form onSubmit={handleSendReset} className="space-y-3">
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="promoter@entertainment.in"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
                  autoFocus
                />
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(false)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white cursor-pointer shadow-2xs transition-colors"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </Modal>
      )}

    </div>
  );
};
