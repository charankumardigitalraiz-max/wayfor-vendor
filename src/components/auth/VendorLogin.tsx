import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Lock,
  Mail,
  Phone,
  Eye,
  EyeOff,
  AlertCircle,
  KeyRound,
  CheckCircle2,
  Zap,
  ArrowRight,
  ArrowLeft,
  RotateCw,
  ShieldCheck
} from 'lucide-react';
import { vendorAuthService, PRESET_VENDOR_ACCOUNTS } from '../../services/vendorAuthService';
import type { VendorUser } from '../../types/auth';
import { Modal } from '../common/Modal';

interface VendorLoginProps {
  onLogin: (user: VendorUser) => void;
  onShowToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

type LoginMode = 'otp' | 'password';
type OtpStep = 'enter_identifier' | 'verify_otp';

export const VendorLogin: React.FC<VendorLoginProps> = ({ onLogin, onShowToast }) => {
  const navigate = useNavigate();

  // Mode and Step State
  const [loginMode, setLoginMode] = useState<LoginMode>('otp');
  const [otpStep, setOtpStep] = useState<OtpStep>('enter_identifier');

  // Unified Identifier: Mobile or Email (defaults to Vikram's email for instant convenience)
  const [identifier, setIdentifier] = useState('vikram@zenithentertainment.in');

  // OTP Digits State (6 boxes)
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer & Resend State
  const [resendTimer, setResendTimer] = useState<number>(30);
  const [canResend, setCanResend] = useState<boolean>(false);

  // Password Login State (fallback/alternative)
  const [password, setPassword] = useState('Promoter@Wayfor2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Status & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Forgot Password Modal State
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Auto-detect whether user is typing a phone number or email
  const isEmailInput = identifier.includes('@') || /[a-zA-Z]/.test(identifier);

  // Resend Countdown Timer effect
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (otpStep === 'verify_otp' && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [otpStep, resendTimer]);

  // Focus the first OTP box when transitioning to OTP step
  useEffect(() => {
    if (otpStep === 'verify_otp') {
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 150);
    }
  }, [otpStep]);

  // Preset demo account selection
  const handlePresetSelect = (presetVal: string, isPhone = false) => {
    setIdentifier(presetVal);
    setPassword('Promoter@Wayfor2026');
    setErrorMessage('');
    if (otpStep === 'verify_otp') {
      setOtpStep('enter_identifier');
      setOtpDigits(['', '', '', '', '', '']);
    }
    if (onShowToast) {
      onShowToast(`Filled ${isPhone ? 'demo phone' : 'demo account'}: ${presetVal}`, 'info');
    }
  };

  // Step 1: Send OTP for Mobile or Email
  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const clean = identifier.trim();
    if (!clean) {
      setErrorMessage('Please enter your mobile number or work email.');
      return;
    }

    if (isEmailInput) {
      if (!clean.includes('@') || !clean.includes('.')) {
        setErrorMessage('Please enter a valid work email address.');
        return;
      }
    } else {
      const digitsOnly = clean.replace(/\D/g, '');
      if (digitsOnly.length < 10) {
        setErrorMessage('Please enter a valid 10-digit mobile number.');
        return;
      }
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOtpStep('verify_otp');
      setResendTimer(30);
      setCanResend(false);
      setOtpDigits(['', '', '', '', '', '']);
      if (onShowToast) {
        onShowToast(`6-digit verification code sent to ${clean}`, 'success');
      }
    }, 450);
  };

  // OTP Input Individual Box Change Handler
  const handleOtpDigitChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste of whole code
      const pastedDigits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newDigits = [...otpDigits];
      pastedDigits.forEach((char, i) => {
        if (i < 6) newDigits[i] = char;
      });
      setOtpDigits(newDigits);
      const focusIndex = Math.min(pastedDigits.length, 5);
      otpInputRefs.current[focusIndex]?.focus();
      return;
    }

    const cleanChar = value.replace(/\D/g, '');
    const newDigits = [...otpDigits];
    newDigits[index] = cleanChar;
    setOtpDigits(newDigits);

    // Auto-advance to next input
    if (cleanChar && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  // Handle Backspace and Navigation across OTP boxes
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otpDigits[index] && index > 0) {
        otpInputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  // Quick autofill demo OTP
  const handleAutoFillDemoOtp = () => {
    setOtpDigits(['1', '2', '3', '4', '5', '6']);
    setErrorMessage('');
    setTimeout(() => {
      otpInputRefs.current[5]?.focus();
    }, 50);
  };

  // Resend OTP
  const handleResendOtp = () => {
    if (!canResend) return;
    setCanResend(false);
    setResendTimer(30);
    setOtpDigits(['', '', '', '', '', '']);
    setErrorMessage('');
    if (onShowToast) {
      onShowToast(`New verification code sent to ${identifier.trim()}`, 'info');
    }
    otpInputRefs.current[0]?.focus();
  };

  // Step 2: Verify OTP and determine registered vs unregistered
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const otpCode = otpDigits.join('');
    if (otpCode.length < 6) {
      setErrorMessage('Please enter the complete 6-digit verification code.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await vendorAuthService.verifyOtpAndLogin(identifier.trim(), otpCode);

      if (result.isRegistered && result.user) {
        // User is ALREADY REGISTERED -> Go to Dashboard
        if (onShowToast) {
          onShowToast(`Welcome back, ${result.user.name}!`, 'success');
        }
        onLogin(result.user);
        navigate('/overview', { replace: true });
      } else {
        // User is NOT REGISTERED -> Redirect to Registration page and auto-resume where they stopped
        if (onShowToast) {
          onShowToast('Identity verified! Redirecting to complete your organizer registration.', 'info');
        }
        navigate('/register', {
          replace: true,
          state: {
            identifier: identifier.trim(),
            isEmail: isEmailInput,
            isPhone: !isEmailInput,
            autoResume: true
          }
        });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to verify code. Please try again.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Traditional Password Login Handler
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!identifier.trim() || !password) {
      setErrorMessage('Please enter both email/mobile and password.');
      return;
    }

    setIsLoading(true);
    try {
      const { user } = await vendorAuthService.login({
        email: identifier.trim(),
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

  // Forgot password submit
  const handleSendReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSent(true);
    try {
      const res = await vendorAuthService.forgotPassword({ email: forgotEmail.trim() });
      if (onShowToast) {
        onShowToast(res.message || `Reset instructions sent to ${forgotEmail}`, 'info');
      }
    } catch {
      if (onShowToast) {
        onShowToast(`Reset instructions sent to ${forgotEmail}`, 'info');
      }
    } finally {
      setTimeout(() => {
        setForgotSent(false);
        setIsForgotModalOpen(false);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 text-slate-800 font-sans">
      {/* Main Card with Entire Design Inside */}
      <div className="w-full max-w-md">
        <div className="bg-white py-8 px-6 sm:px-8 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          {/* Header Inside Card */}
          <div className="text-center pb-1">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-purple-600 text-white shadow-sm mb-3">
              <Sparkles className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
              {loginMode === 'otp' && otpStep === 'verify_otp'
                ? 'Verify OTP'
                : 'Sign in to Wayfor Studio'}
            </h1>
            <p className="mt-1 text-xs text-slate-500 font-normal">
              {loginMode === 'otp' && otpStep === 'verify_otp'
                ? `Enter the 6-digit code sent to your ${isEmailInput ? 'email' : 'phone'}`
                : 'Concert Organizer & Promoter Console'}
            </p>
          </div>

          {/* Quick Demo Accounts Selection */}
          {loginMode === 'otp' && otpStep === 'enter_identifier' && (
            <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-normal">
                <span className="flex items-center gap-1 text-slate-700 font-medium">
                  <Zap className="h-3 w-3 text-amber-500 fill-amber-500" />
                  Quick Fill Demo
                </span>
                <span className="text-[10px] text-slate-400">Registered & New test</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => handlePresetSelect('vikram@zenithentertainment.in')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium text-center truncate transition-colors border cursor-pointer ${
                    identifier === 'vikram@zenithentertainment.in'
                      ? 'bg-purple-50 text-purple-700 border-purple-300'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                  title="Vikram - Registered Email"
                >
                  Vikram (Email)
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetSelect('+91 98450 82910', true)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium text-center truncate transition-colors border cursor-pointer ${
                    identifier.includes('98450')
                      ? 'bg-purple-50 text-purple-700 border-purple-300'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                  title="Vikram - Registered Mobile"
                >
                  +91 98450 (Phone)
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetSelect('+91 98765 43210', true)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium text-center truncate transition-colors border cursor-pointer ${
                    identifier.includes('98765')
                      ? 'bg-purple-50 text-purple-700 border-purple-300'
                      : 'bg-white text-emerald-700 border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50'
                  }`}
                  title="Unregistered Mobile -> Tests Register & Resume Draft"
                >
                  New Partner
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-in fade-in duration-150">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ================= PRIMARY FLOW: OTP BASED LOGIN ================= */}
          {loginMode === 'otp' ? (
            <>
              {/* STEP 1: ENTER MOBILE NUMBER OR WORK EMAIL */}
              {otpStep === 'enter_identifier' && (
                <form onSubmit={handleRequestOtp} className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-slate-700 block">
                        Mobile Number or Work Email <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-[11px] text-slate-400">
                        {isEmailInput ? 'Email mode' : 'Mobile mode'}
                      </span>
                    </div>

                    <div className="relative">
                      {isEmailInput ? (
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-600 pointer-events-none transition-colors" />
                      ) : (
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-600 pointer-events-none transition-colors" />
                      )}
                      <input
                        type="text"
                        required
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="e.g. +91 98450 82910 or promoter@zenith.in"
                        className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-colors"
                        autoFocus
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 leading-normal">
                      We'll send a 6-digit one-time password (OTP) to verify your identity.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading || !identifier.trim()}
                    className="w-full py-2.5 px-4 rounded-lg text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xs"
                  >
                    {isLoading ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Sending OTP...</span>
                      </>
                    ) : (
                      <>
                        <span>Get Verification Code</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* STEP 2: VERIFY 6-DIGIT OTP */}
              {otpStep === 'verify_otp' && (
                <form onSubmit={handleVerifyOtp} className="space-y-4 animate-in fade-in duration-200">
                  {/* Identifier Summary Card with Edit Option */}
                  <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-200/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="h-7 w-7 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0">
                        {isEmailInput ? <Mail className="h-3.5 w-3.5" /> : <Phone className="h-3.5 w-3.5" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] text-purple-700 font-medium">OTP sent to</p>
                        <p className="text-xs font-semibold text-purple-950 truncate">{identifier}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setOtpStep('enter_identifier');
                        setErrorMessage('');
                      }}
                      className="text-xs font-semibold text-purple-700 hover:text-purple-900 hover:underline px-2 py-1 rounded cursor-pointer"
                    >
                      Change
                    </button>
                  </div>

                  {/* 6 Individual Digit Input Boxes */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700 block text-center">
                      Enter 6-Digit OTP Code
                    </label>

                    <div className="flex items-center justify-center gap-2 sm:gap-2.5">
                      {otpDigits.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => {
                            otpInputRefs.current[index] = el;
                          }}
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          value={digit}
                          onChange={(e) => handleOtpDigitChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          className={`w-11 h-12 text-center text-lg font-mono font-bold rounded-lg border outline-none transition-all ${
                            digit
                              ? 'border-purple-600 bg-purple-50/30 text-purple-950 ring-2 ring-purple-100'
                              : 'border-slate-300 bg-white text-slate-900 focus:border-purple-600 focus:ring-2 focus:ring-purple-100'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Demo auto-fill convenience button */}
                    <div className="flex items-center justify-between pt-1 text-[11px]">
                      <button
                        type="button"
                        onClick={handleAutoFillDemoOtp}
                        className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-700 font-medium cursor-pointer"
                      >
                        <Zap className="h-3 w-3 text-amber-500 fill-amber-500" />
                        <span>Auto-fill code 123456</span>
                      </button>

                      {/* Resend Timer / Button */}
                      {canResend ? (
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-800 font-medium cursor-pointer"
                        >
                          <RotateCw className="h-3 w-3" />
                          <span>Resend OTP</span>
                        </button>
                      ) : (
                        <span className="text-slate-400">
                          Resend in <span className="font-mono font-medium text-slate-600">{resendTimer}s</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Verify & Proceed Button */}
                  <button
                    type="submit"
                    disabled={isLoading || otpDigits.join('').length < 6}
                    className="w-full py-2.5 px-4 rounded-lg text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xs"
                  >
                    {isLoading ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Verifying & Resolving Account...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="h-4 w-4" />
                        <span>Verify & Continue</span>
                      </>
                    )}
                  </button>

                  {/* Back to change number link */}
                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => setOtpStep('enter_identifier')}
                      className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 cursor-pointer"
                    >
                      <ArrowLeft className="h-3 w-3" />
                      <span>Use a different mobile or email</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Alternative Option: Password Login Toggle */}
              {otpStep === 'enter_identifier' && (
                <div className="pt-2 text-center border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginMode('password');
                      setErrorMessage('');
                    }}
                    className="inline-flex items-center gap-1.5 text-xs text-purple-600 hover:text-purple-700 font-medium cursor-pointer"
                  >
                    <KeyRound className="h-3.5 w-3.5" />
                    <span>Sign in with password instead</span>
                  </button>
                </div>
              )}
            </>
          ) : (
            /* ================= ALTERNATIVE: PASSWORD LOGIN ================= */
            <form onSubmit={handlePasswordLogin} className="space-y-4 animate-in fade-in duration-200">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 block">
                  Work Email or Mobile
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="promoter@zenithentertainment.in"
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-700">Password</label>
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

              <div className="pt-2 text-center border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setLoginMode('otp');
                    setOtpStep('enter_identifier');
                    setErrorMessage('');
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-purple-600 hover:text-purple-700 font-medium cursor-pointer"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span>Sign in with Mobile OTP instead</span>
                </button>
              </div>
            </form>
          )}

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
