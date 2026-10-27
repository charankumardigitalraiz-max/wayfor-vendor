import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Building2,
  User,
  Phone,
  CreditCard,
  AlertCircle,
  ChevronDown
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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 text-slate-800 font-sans">
      
      {/* Main Card with Entire Design Inside */}
      <div className="w-full max-w-lg">
        <div className="bg-white py-8 px-6 sm:px-8 rounded-xl border border-slate-200 shadow-xs space-y-5">
          
          {/* Header Inside Card */}
          <div className="text-center pb-1">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-purple-600 text-white shadow-sm mb-3">
              <Sparkles className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
              Create Studio Account
            </h1>
            <p className="mt-1 text-sm text-slate-500 font-normal">
              Register your organizer agency to publish arena tour dates & box office tickets
            </p>
          </div>
          
          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name & Company Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 block">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Vikram Singhania"
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 block">
                  Company / Organization <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Zenith Entertainment Ltd."
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 block">
                  Work Email <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.in"
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 block">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98450 82910"
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Password & Confirm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 block">
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

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 block">
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
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Optional Collapsible Banking Section */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowBankDetails(!showBankDetails)}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-slate-100 text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2 text-xs">
                  <CreditCard className="h-4 w-4 text-purple-600" />
                  <span className="font-medium text-slate-700">Bank Settlement & GST (Optional during signup)</span>
                </div>
                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${showBankDetails ? 'rotate-180' : ''}`} />
              </button>

              {showBankDetails && (
                <div className="p-3.5 mt-2 rounded-lg border border-slate-200 bg-slate-50/50 space-y-3 animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-600">GST Registration Number</label>
                      <input
                        type="text"
                        value={gstNumber}
                        onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                        placeholder="36AAACZ8912P1ZV"
                        className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs font-mono uppercase focus:outline-none focus:border-purple-600"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-600">Bank Name</label>
                      <input
                        type="text"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        placeholder="HDFC Bank"
                        className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs focus:outline-none focus:border-purple-600"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-600">Corporate Account Number</label>
                      <input
                        type="text"
                        value={bankAccountNumber}
                        onChange={(e) => setBankAccountNumber(e.target.value)}
                        placeholder="50200084918231"
                        className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs font-mono focus:outline-none focus:border-purple-600"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-600">IFSC Code</label>
                      <input
                        type="text"
                        value={ifscCode}
                        onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                        placeholder="HDFC0000240"
                        className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs font-mono uppercase focus:outline-none focus:border-purple-600"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Terms checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2 text-xs text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  required
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="rounded border-slate-300 text-purple-600 focus:ring-purple-500/20 h-4 w-4 mt-0.5 cursor-pointer"
                />
                <span className="font-normal">
                  I agree to the <span className="text-purple-600 underline font-medium">Terms of Service</span> and event promoter policies.
                </span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-lg text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating Studio...</span>
                </>
              ) : (
                <span>Create Studio Account</span>
              )}
            </button>
          </form>

          {/* Switch to Login */}
          <div className="pt-3 text-center border-t border-slate-100">
            <p className="text-xs text-slate-500 font-normal">
              Already have an organizer account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="font-medium text-purple-600 hover:text-purple-700 hover:underline cursor-pointer"
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
