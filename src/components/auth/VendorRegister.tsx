import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  ChevronDown,
  Music,
  Car,
  MapPin,
  Check,
  ArrowLeft,
  ArrowRight,
  Save,
  Trash2,
  Clock,
  Upload,
  FileText,
  Image as ImageIcon,
  X,
  FileCheck
} from 'lucide-react';
import { vendorAuthService } from '../../services/vendorAuthService';
import type { VendorUser } from '../../types/auth';

export interface ServiceModuleOption {
  id: string;
  name: string;
  category: string;
  badge: string;
  description: string;
  icon: React.ElementType;
}

export const ADMIN_SERVICE_MODULES: ServiceModuleOption[] = [
  {
    id: 'concerts',
    name: 'Concerts & Live Events',
    category: 'Live Entertainment',
    badge: 'Concerts & Events',
    description: 'Promote arena shows, manage stadium venues, curate artist lineups & sell box office passes.',
    icon: Music
  },
  // {
  //   id: 'carpooling',
  //   name: 'Carpooling & Rides',
  //   category: 'Mobility & Fleet',
  //   badge: 'Carpooling',
  //   description: 'Manage intercity carpooling, corporate commute lines, passenger bookings & fleet operations.',
  //   icon: Car
  // },
  {
    id: 'trips',
    name: 'Trip Planner & Group Travel',
    category: 'Tours & Packages',
    badge: 'Trip Planner',
    description: 'Design multi-day group itineraries, travel companion expeditions & adventure packages.',
    icon: MapPin
  },
  {
    id: 'stranger-meets',
    name: 'Stranger Meets & Socials',
    category: 'Community Experiences',
    badge: 'Stranger Meets',
    description: 'Host verified community icebreakers, weekend mixers, networking sessions & social gatherings.',
    icon: Sparkles
  }
];

interface VendorRegisterProps {
  onRegister: (user: VendorUser) => void;
  onShowToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const VendorRegister: React.FC<VendorRegisterProps> = ({ onRegister, onShowToast }) => {
  const navigate = useNavigate();

  // Wizard Step State
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Step 1: Personal Details
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Step 2: Business Details
  const [companyName, setCompanyName] = useState('');
  const [serviceModules, setServiceModules] = useState<string[]>(['concerts']);
  const [isModuleDropdownOpen, setIsModuleDropdownOpen] = useState(false);
  const moduleDropdownRef = React.useRef<HTMLDivElement>(null);
  const [gstNumber, setGstNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [panPhoto, setPanPhoto] = useState<string | null>(null);
  const [panPhotoName, setPanPhotoName] = useState<string | null>(null);
  const [isPanPhotoModalOpen, setIsPanPhotoModalOpen] = useState(false);
  const [isDraggingPan, setIsDraggingPan] = useState(false);
  const panFileInputRef = React.useRef<HTMLInputElement>(null);

  // Step 3: Bank Details & Agreement
  const [bankName, setBankName] = useState('HDFC Bank Ltd');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(true);

  // Status
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Draft Management State
  const DRAFT_KEY = 'wayfor_vendor_registration_draft';
  const [hasPendingDraft, setHasPendingDraft] = useState(false);
  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null);
  const [justSavedNotice, setJustSavedNotice] = useState<string | null>(null);

  const location = useLocation();
  const locationState = location.state as {
    identifier?: string;
    isEmail?: boolean;
    isPhone?: boolean;
    autoResume?: boolean;
  } | undefined;

  const hasInitializedRef = React.useRef(false);

  React.useEffect(() => {
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;

    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && (parsed.name || parsed.companyName || parsed.email || parsed.phone)) {
          // If autoResume is true (coming from OTP verification login flow)
          if (locationState?.autoResume) {
            if (parsed.name !== undefined) setName(parsed.name);
            if (parsed.email !== undefined) setEmail(parsed.email);
            if (parsed.phone !== undefined) setPhone(parsed.phone);
            if (parsed.companyName !== undefined) setCompanyName(parsed.companyName);
            if (parsed.serviceModules && Array.isArray(parsed.serviceModules)) {
              setServiceModules(parsed.serviceModules);
            } else if (parsed.serviceModule) {
              setServiceModules([parsed.serviceModule]);
            }
            if (parsed.gstNumber !== undefined) setGstNumber(parsed.gstNumber);
            if (parsed.panNumber !== undefined) setPanNumber(parsed.panNumber);
            if (parsed.panPhoto !== undefined) setPanPhoto(parsed.panPhoto);
            if (parsed.panPhotoName !== undefined) setPanPhotoName(parsed.panPhotoName);
            if (parsed.bankName !== undefined) setBankName(parsed.bankName);
            if (parsed.bankAccountNumber !== undefined) setBankAccountNumber(parsed.bankAccountNumber);
            if (parsed.ifscCode !== undefined) setIfscCode(parsed.ifscCode);
            if (parsed.currentStep) setCurrentStep(parsed.currentStep);
            setHasPendingDraft(false);

            // Fill verified contact if draft field was blank
            if (locationState.identifier) {
              if (locationState.isEmail && (!parsed.email || !parsed.email.includes('@'))) {
                setEmail(locationState.identifier);
              }
              if (locationState.isPhone && (!parsed.phone || parsed.phone === '+91 ')) {
                setPhone(locationState.identifier);
              }
            }

            onShowToast?.(
              `Resumed registration from Step ${parsed.currentStep || 1} where you stopped.`,
              'info'
            );
            return;
          }

          setHasPendingDraft(true);
          setDraftSavedAt(parsed.savedAt || 'earlier session');
        }
      }

      // No draft found, but arrived with verified identifier from login
      if (locationState?.identifier) {
        if (locationState.isEmail) setEmail(locationState.identifier);
        if (locationState.isPhone) setPhone(locationState.identifier);
        onShowToast?.('Phone/email verified! Please complete registration.', 'info');
      }
    } catch {
      // Ignore
    }
  }, []);

  const handleSaveDraft = (silent = false) => {
    try {
      const now = new Date();
      const formatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' +
        now.toLocaleDateString([], { month: 'short', day: 'numeric' });

      const payload = {
        isRegistered: false,
        currentStep,
        name,
        email,
        phone,
        companyName,
        serviceModule: serviceModules[0] || 'concerts',
        serviceModules,
        gstNumber,
        panNumber,
        panPhoto,
        panPhotoName,
        bankName,
        bankAccountNumber,
        ifscCode,
        savedAt: formatted
      };

      localStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
      setDraftSavedAt(formatted);
      setJustSavedNotice(`Saved at ${formatted}`);
      setTimeout(() => setJustSavedNotice(null), 3500);

      if (!silent && onShowToast) {
        onShowToast(`Draft saved successfully (${formatted})`, 'success');
      }
    } catch {
      if (!silent && onShowToast) {
        onShowToast('Could not save draft.', 'error');
      }
    }
  };

  const handleResumeDraft = () => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.name !== undefined) setName(parsed.name);
        if (parsed.email !== undefined) setEmail(parsed.email);
        if (parsed.phone !== undefined) setPhone(parsed.phone);
        if (parsed.companyName !== undefined) setCompanyName(parsed.companyName);
        if (parsed.serviceModules && Array.isArray(parsed.serviceModules)) {
          setServiceModules(parsed.serviceModules);
        } else if (parsed.serviceModule) {
          setServiceModules([parsed.serviceModule]);
        }
        if (parsed.gstNumber !== undefined) setGstNumber(parsed.gstNumber);
        if (parsed.panNumber !== undefined) setPanNumber(parsed.panNumber);
        if (parsed.panPhoto !== undefined) setPanPhoto(parsed.panPhoto);
        if (parsed.panPhotoName !== undefined) setPanPhotoName(parsed.panPhotoName);
        if (parsed.bankName !== undefined) setBankName(parsed.bankName);
        if (parsed.bankAccountNumber !== undefined) setBankAccountNumber(parsed.bankAccountNumber);
        if (parsed.ifscCode !== undefined) setIfscCode(parsed.ifscCode);
        if (parsed.currentStep) setCurrentStep(parsed.currentStep);
        setHasPendingDraft(false);
        if (onShowToast) onShowToast('Resumed saved registration draft.', 'info');
      }
    } catch {
      // Ignore
    }
  };

  const handleDiscardDraft = () => {
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      // Ignore
    }
    setHasPendingDraft(false);
    setDraftSavedAt(null);
    setName('');
    setEmail('');
    setPhone('+91 ');
    setPassword('');
    setConfirmPassword('');
    setCompanyName('');
    setServiceModules(['concerts']);
    setGstNumber('');
    setPanNumber('');
    setPanPhoto(null);
    setPanPhotoName(null);
    setBankName('HDFC Bank Ltd');
    setBankAccountNumber('');
    setIfscCode('');
    setCurrentStep(1);
    if (onShowToast) onShowToast('Registration draft discarded.', 'info');
  };

  const handleGstChange = (val: string) => {
    const upper = val.toUpperCase().trim();
    setGstNumber(upper);
    // Auto-extract PAN if user enters a valid 15-character GSTIN and PAN is empty
    if (upper.length >= 12 && !panNumber) {
      const potentialPan = upper.slice(2, 12);
      if (/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(potentialPan)) {
        setPanNumber(potentialPan);
      }
    }
  };

  const handlePanPhotoUpload = (file?: File | null) => {
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      setErrorMessage('PAN Card document must be under 8MB.');
      return;
    }

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 1200;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
            setPanPhoto(dataUrl);
            setPanPhotoName(file.name);
            setErrorMessage('');
            if (onShowToast) onShowToast('PAN Card photo uploaded successfully.', 'success');
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        setPanPhoto(reader.result as string);
        setPanPhotoName(file.name);
        setErrorMessage('');
        if (onShowToast) onShowToast('PAN Card document uploaded successfully.', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePanPhoto = () => {
    setPanPhoto(null);
    setPanPhotoName(null);
    if (panFileInputRef.current) {
      panFileInputRef.current.value = '';
    }
  };

  const validateStep1 = () => {
    setErrorMessage('');
    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
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

  const validateStep2 = () => {
    setErrorMessage('');
    if (!companyName.trim()) {
      setErrorMessage('Please enter your company or organization name.');
      return false;
    }
    if (!serviceModules || serviceModules.length === 0) {
      setErrorMessage('Please select at least one platform service vertical.');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (validateStep1()) setCurrentStep(2);
    } else if (currentStep === 2) {
      if (validateStep2()) setCurrentStep(3);
    }
  };

  const handleBack = () => {
    setErrorMessage('');
    if (currentStep === 2) setCurrentStep(1);
    if (currentStep === 3) setCurrentStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (currentStep === 1) {
      if (validateStep1()) setCurrentStep(2);
      return;
    }
    if (currentStep === 2) {
      if (validateStep2()) setCurrentStep(3);
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
        serviceModule: serviceModules[0] || 'concerts',
        serviceModules: serviceModules,
        email: email.trim(),
        phone: phone.trim(),
        password,
        gstNumber: gstNumber.trim() || undefined,
        panNumber: panNumber.trim().toUpperCase() || undefined,
        panPhoto: panPhoto || undefined,
        panPhotoName: panPhotoName || undefined,
        bankName: bankName.trim() || undefined,
        bankAccountNumber: bankAccountNumber.trim() || undefined,
        ifscCode: ifscCode.trim() || undefined
      });

      if (onShowToast) {
        onShowToast(`Welcome to Wayfor Studio, ${user.name}!`, 'success');
      }

      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch {
        // Ignore
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

  // Close dropdown on click outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moduleDropdownRef.current && !moduleDropdownRef.current.contains(e.target as Node)) {
        setIsModuleDropdownOpen(false);
      }
    };
    if (isModuleDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModuleDropdownOpen]);

  const toggleModule = (modId: string) => {
    if (serviceModules.includes(modId)) {
      if (serviceModules.length <= 1) {
        onShowToast?.('At least one operating service vertical must be selected', 'info');
        return;
      }
      setServiceModules(serviceModules.filter((m) => m !== modId));
    } else {
      setServiceModules([...serviceModules, modId]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center py-10 px-4 sm:px-6 lg:px-8 text-slate-800 font-sans">

      {/* Main Card */}
      <div className="w-full max-w-3xl">
        <div className="bg-white py-7 px-6 sm:px-8 rounded-xl border border-slate-200 shadow-xs space-y-5">

          {/* Header Inside Card */}
          <div className="text-center pb-1">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-purple-600 text-white shadow-sm mb-3">
              <Sparkles className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
              Create Studio Account
            </h1>
            <p className="mt-1 text-xs text-slate-500 font-normal">
              {currentStep === 1 && 'Step 1 of 3: Enter your personal contact & credentials'}
              {currentStep === 2 && 'Step 2 of 3: Specify your agency & select your service module'}
              {currentStep === 3 && 'Step 3 of 3: Settlement banking details & policy agreement'}
            </p>
          </div>

          {/* Stepper Navigation Pills */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            {[
              { step: 1, label: 'Personal', icon: User },
              { step: 2, label: 'Business', icon: Building2 },
              { step: 3, label: 'Bank Details', icon: CreditCard }
            ].map((item, idx) => {
              const isCompleted = currentStep > item.step;
              const isCurrent = currentStep === item.step;

              return (
                <React.Fragment key={item.step}>
                  <div
                    className={`flex items-center gap-2 transition-colors ${isCurrent
                      ? 'text-purple-700'
                      : isCompleted
                        ? 'text-emerald-700 cursor-pointer'
                        : 'text-slate-400'
                      }`}
                    onClick={() => {
                      if (isCompleted) setCurrentStep(item.step as 1 | 2 | 3);
                    }}
                  >
                    <div
                      className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-medium transition-all ${isCurrent
                        ? 'bg-purple-600 text-white shadow-xs shadow-purple-200'
                        : isCompleted
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                    >
                      {isCompleted ? <Check className="h-3.5 w-3.5 stroke-[2.5]" /> : item.step}
                    </div>
                    <span className="text-xs font-medium hidden sm:inline">{item.label}</span>
                  </div>
                  {idx < 2 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 rounded-full transition-colors ${currentStep > idx + 1 ? 'bg-emerald-400' : 'bg-slate-200'
                        }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Draft Notification Banner */}
          {hasPendingDraft && (
            <div className="p-3 rounded-xl bg-purple-50/90 border border-purple-200 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-600 shrink-0" />
                <span className="text-purple-950 font-normal">
                  Unsaved draft from <span className="font-medium">{draftSavedAt}</span>
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={handleDiscardDraft}
                  className="px-2 py-1 rounded-md text-[11px] text-slate-600 hover:bg-white border border-slate-200 cursor-pointer font-medium"
                >
                  Discard
                </button>
                <button
                  type="button"
                  onClick={handleResumeDraft}
                  className="px-2.5 py-1 rounded-md text-[11px] text-white bg-purple-600 hover:bg-purple-700 font-medium cursor-pointer shadow-2xs"
                >
                  Resume Draft
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

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* ================= STEP 1: PERSONAL DETAILS ================= */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-in fade-in duration-150">
                {/* Full Name */}
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

                {/* Step 1 Actions */}
                <div className="pt-2 flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleSaveDraft(false)}
                    className="py-2.5 px-3 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    title="Save current progress as draft"
                  >
                    <Save className="h-4 w-4 text-slate-500" />
                    <span>Save Draft</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="ml-auto py-2.5 px-6 rounded-lg text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-2xs min-w-[160px]"
                  >
                    <span>Continue to Business Details</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ================= STEP 2: BUSINESS DETAILS ================= */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-in fade-in duration-150">
                {/* Row 1: Company Name & Operating Service Verticals */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Company Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700 block">
                      Company / Organization Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Zenith Entertainment & Touring Ltd."
                        className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Service Vertical Multiple Selection */}
                  <div className="space-y-1.5 relative" ref={moduleDropdownRef}>
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-slate-700 block">
                        Operating Service Verticals <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-[11px] text-purple-700 font-medium bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                        {serviceModules.length} selected
                      </span>
                    </div>

                    {/* Multi-Select Trigger Button */}
                    <button
                      type="button"
                      onClick={() => setIsModuleDropdownOpen(!isModuleDropdownOpen)}
                      className="w-full min-h-[38px] px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 flex items-center justify-between gap-2 text-left cursor-pointer transition-all shadow-2xs"
                    >
                      <div className="flex items-center flex-wrap gap-1 max-w-[calc(100%-20px)]">
                        {serviceModules.map((modId) => {
                          const item = ADMIN_SERVICE_MODULES.find((m) => m.id === modId);
                          const Icon = item?.icon || Sparkles;
                          return (
                            <span
                              key={modId}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 text-[11px] font-medium animate-in zoom-in-95 duration-100"
                            >
                              <Icon className="h-3 w-3 text-purple-600 shrink-0" />
                              <span>{item?.name.split('&')[0].trim() || modId}</span>
                              {serviceModules.length > 1 && (
                                <span
                                  role="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleModule(modId);
                                  }}
                                  className="hover:text-rose-600 cursor-pointer ml-0.5 text-xs font-bold leading-none"
                                  title="Remove vertical"
                                >
                                  &times;
                                </span>
                              )}
                            </span>
                          );
                        })}
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                          isModuleDropdownOpen ? 'rotate-180 text-purple-600' : ''
                        }`}
                      />
                    </button>

                    {/* Dropdown Menu */}
                    {isModuleDropdownOpen && (
                      <div className="absolute left-0 right-0 top-full mt-1.5 z-30 bg-white rounded-xl border border-slate-200 shadow-xl p-2 animate-in fade-in slide-in-from-top-1 duration-150">
                        <div className="space-y-1 max-h-56 overflow-y-auto">
                          {ADMIN_SERVICE_MODULES.map((mod) => {
                            const Icon = mod.icon;
                            const isSelected = serviceModules.includes(mod.id);
                            const isPrimary = serviceModules[0] === mod.id;

                            return (
                              <div
                                key={mod.id}
                                onClick={() => toggleModule(mod.id)}
                                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                                  isSelected
                                    ? 'bg-purple-50/70 text-purple-950 font-medium'
                                    : 'hover:bg-slate-50 text-slate-700'
                                }`}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <div
                                    className={`h-6 w-6 rounded-md flex items-center justify-center shrink-0 ${
                                      isSelected
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-slate-100 text-slate-500'
                                    }`}
                                  >
                                    <Icon className="h-3 w-3" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-xs truncate font-medium">{mod.name}</p>
                                    <p className="text-[10px] text-slate-400 truncate">{mod.category}</p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                                  {isPrimary && (
                                    <span className="text-[10px] font-semibold text-purple-600 bg-purple-100 px-1 py-0.5 rounded">
                                      Primary
                                    </span>
                                  )}
                                  <div
                                    className={`h-4 w-4 rounded border flex items-center justify-center transition-colors ${
                                      isSelected
                                        ? 'bg-purple-600 border-purple-600 text-white'
                                        : 'border-slate-300 bg-white'
                                    }`}
                                  >
                                    {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 px-1">
                          <span>Select all that apply</span>
                          <button
                            type="button"
                            onClick={() => setIsModuleDropdownOpen(false)}
                            className="text-purple-600 font-semibold hover:text-purple-700 cursor-pointer"
                          >
                            Done
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Row 2: GSTIN Number & PAN Card Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* GST Number (Optional) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-slate-700 block">
                        GSTIN Number
                      </label>
                      <span className="text-[11px] text-slate-400 font-normal">Optional</span>
                    </div>
                    <div className="relative">
                      <FileCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        value={gstNumber}
                        onChange={(e) => handleGstChange(e.target.value)}
                        placeholder="36AAACZ8912P1ZV"
                        maxLength={15}
                        className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-xs font-mono uppercase text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-colors"
                      />
                    </div>
                  </div>

                  {/* PAN Card Number */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-slate-700 block">
                        PAN Card Number
                      </label>
                      <span className="text-[11px] text-slate-400 font-normal">Optional</span>
                    </div>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        value={panNumber}
                        onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                        placeholder="ABCDE1234F"
                        maxLength={10}
                        className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-xs font-mono uppercase text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 3: PAN Card Document Photo & Verification Guidelines */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Left: PAN Card Document Photo Upload */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <FileText className="h-4 w-4 text-purple-600" />
                        <label className="text-xs font-medium text-slate-700 block">
                          PAN Card Document Photo
                        </label>
                      </div>
                      <span className="text-[11px] text-slate-400 font-normal">Optional / KYC</span>
                    </div>

                    <input
                      type="file"
                      ref={panFileInputRef}
                      accept="image/*,.pdf"
                      onChange={(e) => handlePanPhotoUpload(e.target.files?.[0])}
                      className="hidden"
                    />

                    {!panPhoto ? (
                      /* Upload Dropzone */
                      <div
                        onClick={() => panFileInputRef.current?.click()}
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDraggingPan(true);
                        }}
                        onDragLeave={(e) => {
                          e.preventDefault();
                          setIsDraggingPan(false);
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDraggingPan(false);
                          const file = e.dataTransfer.files?.[0];
                          if (file) handlePanPhotoUpload(file);
                        }}
                        className={`h-[110px] group border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 ${
                          isDraggingPan
                            ? 'border-purple-500 bg-purple-50/70 scale-[0.99]'
                            : 'border-slate-300 bg-white hover:border-purple-400 hover:bg-purple-50/20'
                        }`}
                      >
                        <div className="h-8 w-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xs">
                          <Upload className="h-4 w-4" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-xs font-medium text-slate-800">
                            <span className="text-purple-600 font-semibold hover:underline">Click to upload photo</span> or drop
                          </p>
                          <p className="text-[10px] text-slate-400">
                            JPG, PNG, WebP or PDF (Max 8MB)
                          </p>
                        </div>
                      </div>
                    ) : (
                      /* Uploaded Photo Preview Card */
                      <div className="h-[110px] p-3 bg-white border border-purple-200 rounded-xl flex items-center justify-between gap-2.5 shadow-2xs">
                        <div className="flex items-center gap-2.5 min-w-0">
                          {panPhoto.startsWith('data:image/') ? (
                            <img
                              src={panPhoto}
                              alt="PAN Card"
                              onClick={() => setIsPanPhotoModalOpen(true)}
                              className="h-14 w-16 object-cover rounded-lg border border-slate-200 cursor-pointer hover:opacity-90 transition-opacity shrink-0"
                              title="Click to view full image"
                            />
                          ) : (
                            <div className="h-14 w-14 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                              <FileText className="h-6 w-6" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-slate-900 truncate max-w-[130px]">
                              {panPhotoName || 'PAN_Card_Photo.jpg'}
                            </p>
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0 mt-1">
                              <Check className="h-2.5 w-2.5 stroke-[3]" /> Photo Attached
                            </span>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              Ready for KYC review
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1 shrink-0">
                          {panPhoto.startsWith('data:image/') && (
                            <button
                              type="button"
                              onClick={() => setIsPanPhotoModalOpen(true)}
                              className="px-2 py-1 rounded text-[11px] font-medium text-slate-600 hover:text-purple-600 hover:bg-purple-50 transition-colors cursor-pointer flex items-center gap-1 border border-slate-200"
                              title="Preview PAN Card"
                            >
                              <Eye className="h-3 w-3" />
                              <span>View</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => panFileInputRef.current?.click()}
                            className="px-2 py-1 rounded text-[11px] font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200"
                          >
                            Change
                          </button>
                          <button
                            type="button"
                            onClick={handleRemovePanPhoto}
                            className="px-2 py-1 rounded text-[11px] font-medium text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer flex items-center gap-1 border border-slate-200"
                            title="Remove photo"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right: Verification Guidelines */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-slate-700 block">
                        KYC & Verification Standards
                      </label>
                      <span className="text-[11px] text-purple-700 font-medium bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                        Fast Approval
                      </span>
                    </div>

                    <div className="h-[110px] p-3 rounded-xl border border-slate-200 bg-slate-50/70 text-xs text-slate-600 flex flex-col justify-center space-y-1.5">
                      <div className="flex items-center gap-2 text-slate-700 text-[11px]">
                        <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span>Entity / Owner name matches official PAN records</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-700 text-[11px]">
                        <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span>Clear front photo copy with no glare or clipped edges</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-700 text-[11px]">
                        <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span>Enables instant bank payouts & live event ticketing</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 2 Actions */}
                <div className="flex items-center gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="py-2.5 px-3.5 rounded-lg text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSaveDraft(false)}
                    className="py-2.5 px-3 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    title="Save current progress as draft"
                  >
                    <Save className="h-4 w-4 text-slate-500" />
                    <span className="hidden sm:inline">Save Draft</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="ml-auto py-2.5 px-6 rounded-lg text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs min-w-[140px]"
                  >
                    <span>Continue</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ================= STEP 3: BANK DETAILS ================= */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="p-3 rounded-lg border border-purple-100 bg-purple-50/50 flex items-center gap-2.5 text-xs text-purple-900">
                  <CreditCard className="h-4 w-4 text-purple-600 shrink-0" />
                  <span className="font-normal">
                    Direct payout settlement account for ticket sales & revenue disbursements.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700 block">Bank Name</label>
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="HDFC Bank Ltd"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700 block">IFSC Code</label>
                    <input
                      type="text"
                      value={ifscCode}
                      onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                      placeholder="HDFC0000240"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-mono uppercase text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700 block">Corporate Account Number</label>
                  <input
                    type="text"
                    value={bankAccountNumber}
                    onChange={(e) => setBankAccountNumber(e.target.value)}
                    placeholder="50200084918231"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
                  />
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
                      I agree to the <span className="text-purple-600 underline font-medium">Terms of Service</span> and partner organizer policies.
                    </span>
                  </label>
                </div>

                {/* Step 3 Actions */}
                <div className="flex items-center gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="py-2.5 px-3.5 rounded-lg text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSaveDraft(false)}
                    className="py-2.5 px-3 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    title="Save current progress as draft"
                  >
                    <Save className="h-4 w-4 text-slate-500" />
                    <span className="hidden sm:inline">Save Draft</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="ml-auto py-2.5 px-6 rounded-lg text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-2xs min-w-[170px]"
                  >
                    {isLoading ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Creating Studio...</span>
                      </>
                    ) : (
                      <span>Complete Registration</span>
                    )}
                  </button>
                </div>
              </div>
            )}
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

      {/* PAN Card Photo Full Preview Modal */}
      {isPanPhotoModalOpen && panPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setIsPanPhotoModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/70">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-semibold text-slate-800">
                  PAN Card Document Photo
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsPanPhotoModalOpen(false)}
                className="h-7 w-7 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-4 bg-slate-900/5 flex items-center justify-center max-h-[75vh] overflow-auto">
              <img
                src={panPhoto}
                alt="PAN Card Full View"
                className="max-h-[70vh] w-auto max-w-full rounded-lg shadow-md object-contain border border-slate-200 bg-white"
              />
            </div>
            <div className="px-4 py-3 bg-white border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="truncate max-w-[280px]">{panPhotoName || 'PAN_Card.jpg'}</span>
              <button
                type="button"
                onClick={() => setIsPanPhotoModalOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-purple-600 text-white font-medium text-xs hover:bg-purple-700 transition-colors cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
