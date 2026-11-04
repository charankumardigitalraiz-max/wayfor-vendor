import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Sparkles,
  Lock,
  Mail,
  Eye,
  EyeOff,
  User,
  Building2,
  MapPin,
  AlertCircle
} from 'lucide-react';
import { vendorAuthService } from '../../services/vendorAuthService';
import type { VendorUser } from '../../types/auth';
import { PhoneInputWithCountry } from '../common/PhoneInputWithCountry';

interface VendorRegisterProps {
  onRegister: (user: VendorUser) => void;
  onShowToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const VendorRegister: React.FC<VendorRegisterProps> = ({ onRegister, onShowToast }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as {
    identifier?: string;
    isEmail?: boolean;
    isPhone?: boolean;
  } | undefined;

  // Form State
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState(() => (locationState?.isEmail ? locationState.identifier || '' : ''));
  const [phone, setPhone] = useState(() => (locationState?.isPhone ? locationState.identifier || '+91 ' : '+91 '));
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const validate = () => {
    setErrorMessage('');
    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return false;
    }
    if (!businessName.trim()) {
      setErrorMessage('Please enter your business name.');
      return false;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid work email address.');
      return false;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setErrorMessage('Please enter a valid contact phone number.');
      return false;
    }
    if (!address.trim()) {
      setErrorMessage('Please enter your address.');
      return false;
    }
    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return false;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validate()) return;

    setIsLoading(true);
    try {
      const { user } = await vendorAuthService.register({
        name: name.trim(),
        companyName: businessName.trim(),
        businessName: businessName.trim(),
        serviceModule: 'concerts',
        serviceModules: ['concerts'],
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim(),
        password
      });

      if (onShowToast) {
        onShowToast(`Welcome to Wayfor, ${user.name}!`, 'success');
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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 text-slate-800 font-sans">
      {/* Main Card */}
      <div className="w-full max-w-[620px]">
        <div className="bg-white py-8 px-6 sm:px-9 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          {/* Header Inside Card */}
          <div className="text-center pb-1">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600 text-white shadow-sm mb-3">
              <Sparkles className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
              Create an Account
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 font-normal">
              Enter your details to register as an organizer
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-in fade-in duration-150">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4.5">
            {/* Full Name & Business Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full name"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 placeholder:text-xs focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-colors"
                    autoFocus
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  Business Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Company or agency name"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 placeholder:text-xs focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  Email <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 placeholder:text-xs focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <PhoneInputWithCountry
                  value={phone}
                  onChange={(val) => setPhone(val)}
                  required
                  placeholder="98450 82910"
                />
              </div>
            </div>


            {/* Password & Confirm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full pl-9 pr-9 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 placeholder:text-xs focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-colors"
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

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  Confirm Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 placeholder:text-xs focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xs mt-3"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </form>

          {/* Switch to Login */}
          <div className="pt-3 text-center border-t border-slate-100">
            <p className="text-xs sm:text-sm text-slate-500 font-normal">
              Already have an organizer account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="font-semibold text-purple-600 hover:text-purple-700 hover:underline cursor-pointer"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-slate-400 font-normal">
          &copy; 2026 Wayfor Entertainment Touring Ltd. All rights reserved.
        </p>
      </div>
    </div>
  );
};
