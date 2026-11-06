import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
    X,
    CheckCircle2,
    ShieldCheck,
    Building2,
    CreditCard,
    Banknote,
    Smartphone,
    ArrowRight,
    ArrowLeft,
    Check,
    Lock,
    Layers,
    ChevronRight
} from 'lucide-react';
import {
    ConcertsAppIcon,
    StrangerMeetsAppIcon,
    TripPoolAppIcon,
    CarpoolingAppIcon
} from '../icons/ModuleAppIcons';
import type { VendorUser } from '../../types/auth';
import { vendorAuthService } from '../../services/vendorAuthService';
import { mockVendorProfile } from '../../data/mockVendorData';

export interface BusinessModule {
    id: string;
    name: string;
    tagline: string;
    category: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: 'purple' | 'teal' | 'amber' | 'indigo';
    monthlyPrice: number;
    annualPrice: number;
    path: string;
    features: string[];
}

export const PLATFORM_MODULES: BusinessModule[] = [
    {
        id: 'concerts',
        name: 'Concerts & Events',
        tagline: 'Live Arena Tours & Gate Ticketing Engine',
        category: 'Live Entertainment',
        description: 'Create stadium concerts, manage tiered capacities, issue counter tickets via Box Office POS, and scan attendee passes in real time.',
        icon: ConcertsAppIcon,
        accentColor: 'purple',
        monthlyPrice: 4999,
        annualPrice: 49990,
        path: '/concerts',
        features: [
            'Concert scheduling & artist lineups',
            'Multi-tier pricing & quota controls',
            'Box Office counter POS ticketing',
            'Gate scanner telemetry & check-in'
        ]
    },
    {
        id: 'stranger-meets',
        name: 'Stranger Meets',
        tagline: 'Curated Social Mixers & Community Hub',
        category: 'Community & Social',
        description: 'Host curated stranger mixers, manage buddy rosters, verify attendee sign-ups, and build engaged local community networks.',
        icon: StrangerMeetsAppIcon,
        accentColor: 'teal',
        monthlyPrice: 3499,
        annualPrice: 34990,
        path: '/stranger-meets',
        features: [
            'Community mixer planning & hosts',
            'Stranger buddy roster & verification',
            'Attendee check-in & verification badges',
            'Local venue partnering & analytics'
        ]
    },
    {
        id: 'trips',
        name: 'Trip Pool (Trip Planner)',
        tagline: 'Expedition Logistics & Group Ride Pooling',
        category: 'Travel & Expeditions',
        description: 'Plan multi-day travel itineraries, coordinate passenger companion pooling, allocate seats, and manage group travel expenses.',
        icon: TripPoolAppIcon,
        accentColor: 'amber',
        monthlyPrice: 3999,
        annualPrice: 39990,
        path: '/trips',
        features: [
            'Day-by-day travel itinerary builder',
            'Travel companion seat pooling',
            'Pickup stop & route scheduling',
            'Expedition logistics & communications'
        ]
    },
    {
        id: 'carpooling',
        name: 'Carpooling & Fleet',
        tagline: 'Corporate Commute & Intercity Fleet Network',
        category: 'Fleet & Mobility',
        description: 'Manage intercity commuter pools, vehicle fleet schedules, driver allocations, and corporate ride credits.',
        icon: CarpoolingAppIcon,
        accentColor: 'indigo',
        monthlyPrice: 2999,
        annualPrice: 29990,
        path: '/overview',
        features: [
            'Intercity route matching & schedules',
            'Fleet vehicle & driver rosters',
            'Corporate travel credits & billing',
            'Live ride telemetry tracking'
        ]
    }
];

export interface ModuleAccessDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    currentVendor?: VendorUser | null;
    onShowToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

type DrawerView = 'list' | 'confirm-account' | 'payment' | 'success';

export const ModuleAccessDrawer: React.FC<ModuleAccessDrawerProps> = ({
    isOpen,
    onClose,
    currentVendor,
    onShowToast
}) => {
    const navigate = useNavigate();
    const profile = currentVendor || mockVendorProfile;

    const [view, setView] = useState<DrawerView>('list');
    const [selectedModule, setSelectedModule] = useState<BusinessModule | null>(null);
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
    const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'NetBanking'>('UPI');
    const [upiId, setUpiId] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardHolder, setCardHolder] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvv, setCardCvv] = useState('');
    const [selectedBank, setSelectedBank] = useState('HDFC Bank');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isConfirmedOrg, setIsConfirmedOrg] = useState(true);

    // Close on Escape & Lock body scroll
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleCloseDrawer();
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
    }, [isOpen]);

    if (!isOpen) return null;

    const assignedModules: string[] =
        profile.serviceModules && profile.serviceModules.length > 0
            ? profile.serviceModules
            : [profile.serviceModule || 'concerts'];

    const companyName = profile.companyName || profile.name || 'DigitalRaiz Live Private Limited';
    const adminEmail = profile.email || 'partner@digitalraiz.com';
    const gstin = profile.gstNumber || '27AABCU9603R1ZM';
    const address = typeof profile.address === 'object' && profile.address !== null
        ? `${(profile.address as any).street || ''}, ${(profile.address as any).city || ''}, ${(profile.address as any).state || ''} ${(profile.address as any).postalCode || ''}`.replace(/^[\s,]+|[\s,]+$/g, '')
        : (typeof profile.address === 'string' ? profile.address : 'BKC Express Towers, Bandra Kurla Complex, Mumbai, Maharashtra 400051');

    const handleStartSubscription = (mod: BusinessModule) => {
        setSelectedModule(mod);
        setIsConfirmedOrg(true);
        setView('confirm-account');
    };

    const handleConfirmAccount = () => {
        if (!isConfirmedOrg) {
            if (onShowToast) onShowToast('Please confirm the organization account to proceed.', 'error');
            return;
        }
        setView('payment');
    };

    const handleProcessPayment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedModule) return;

        setIsProcessing(true);

        setTimeout(() => {
            // 1. Activate module in vendorAuthService and update localStorage
            vendorAuthService.addServiceModule(selectedModule.id);

            setIsProcessing(false);
            setView('success');

            if (onShowToast) {
                onShowToast(
                    `Module "${selectedModule.name}" successfully unlocked for ${companyName}!`,
                    'success'
                );
            }
        }, 1000);
    };

    const handleLaunchModule = (path: string) => {
        handleCloseDrawer();
        navigate(path);
    };

    const handleCloseDrawer = () => {
        setView('list');
        setSelectedModule(null);
        onClose();
    };

    // Pricing calculations
    const basePrice = selectedModule
        ? billingCycle === 'monthly'
            ? selectedModule.monthlyPrice
            : selectedModule.annualPrice
        : 0;
    const gstAmount = Math.round(basePrice * 0.18);
    const totalAmount = basePrice + gstAmount;

    const drawerContent = (
        <div className="fixed inset-0 z-[9999] overflow-hidden" role="dialog" aria-modal="true">
            {/* Full Viewport Backdrop */}
            <div
                className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in cursor-pointer"
                onClick={handleCloseDrawer}
            />

            {/* Slide-over Right Drawer Container */}
            <div className="fixed inset-y-0 right-0 z-[10000] flex max-w-full pl-4 sm:pl-6">
                {/* Ultra-Compact Drawer (max-w-xs = 320px) */}
                <div className="w-screen max-w-xs bg-white shadow-2xl border-l border-slate-200 flex flex-col h-screen transform transition-all ease-in-out duration-300 animate-in slide-in-from-right font-sans antialiased text-slate-800">
                    {/* Compact Drawer Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 px-3.5 py-3 bg-white shrink-0 sticky top-0 z-20">
                        <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-lg bg-purple-50 text-purple-700 border border-purple-200/80 flex items-center justify-center shrink-0">
                                <Layers className="h-3.5 w-3.5" />
                            </div>
                            <h2 className="text-sm font-semibold text-slate-900">
                                Modules
                            </h2>
                        </div>

                        <button
                            type="button"
                            onClick={handleCloseDrawer}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
                            title="Close Drawer (Esc)"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Scrollable Drawer Body */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-white">
                        {/* ========================================================= */}
                        {/* VIEW 1: MODULES VERTICAL COLUMN CARD DESIGN              */}
                        {/* ========================================================= */}
                        {view === 'list' && (
                            <div className="flex flex-col space-y-2 py-0.5">
                                {PLATFORM_MODULES.map((mod) => {
                                    const isSubscribed = assignedModules.includes(mod.id);
                                    const IconComp = mod.icon;

                                    return (
                                        <div
                                            key={mod.id}
                                            onClick={() => {
                                                if (isSubscribed) {
                                                    handleLaunchModule(mod.path);
                                                } else {
                                                    handleStartSubscription(mod);
                                                }
                                            }}
                                            className="group flex items-center justify-between p-2.5 rounded-xl bg-slate-100/80 hover:bg-slate-200/60 active:bg-slate-200/80 transition-all cursor-pointer select-none"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                {/* Professional App Icon */}
                                                <div className="shrink-0 transition-transform duration-200 group-hover:scale-105">
                                                    <IconComp className="w-10 h-10" />
                                                </div>

                                                <div className="flex flex-col min-w-0">
                                                    {/* Module Name */}
                                                    <span className="text-[13px] font-medium tracking-tight text-slate-900 group-hover:text-purple-700 transition-colors truncate">
                                                        {mod.name}
                                                    </span>

                                                    {/* Subscribed Status or Category Subtitle */}
                                                    {isSubscribed ? (
                                                        <div className="flex items-center gap-1.5 mt-0.5">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ring-2 ring-emerald-200/80 shrink-0" />
                                                            <span className="text-xs font-medium text-emerald-700">Subscribed</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-slate-400 truncate mt-0.5">
                                                            {mod.category}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Action Chevron */}
                                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* ========================================================= */}
                        {/* VIEW 2: ACCOUNT / ORGANIZATION CONFIRMATION               */}
                        {/* ========================================================= */}
                        {view === 'confirm-account' && selectedModule && (
                            <div className="space-y-3.5">
                                <button
                                    type="button"
                                    onClick={() => setView('list')}
                                    className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                                >
                                    <ArrowLeft className="w-3.5 h-3.5" />
                                    <span>Back to Modules</span>
                                </button>

                                <div className="rounded-xl border border-purple-200/90 bg-purple-50/40 p-3">
                                    <h3 className="text-sm font-semibold tracking-tight text-slate-900 mb-0.5">
                                        Confirm Organization Account
                                    </h3>
                                    <p className="text-xs text-slate-600">
                                        Subscribe to <span className="font-semibold text-purple-700">{selectedModule.name}</span> under this organization account?
                                    </p>
                                </div>

                                {/* Organization Snapshot Card */}
                                <div className="rounded-xl border border-slate-200/90 bg-white p-3 space-y-2.5 shadow-2xs text-xs">
                                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                                        <div className="flex items-center gap-1.5">
                                            <Building2 className="w-3.5 h-3.5 text-purple-600" />
                                            <span className="font-semibold text-slate-900 text-xs">Organization Profile</span>
                                        </div>
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                            <ShieldCheck className="w-3 h-3" /> Verified
                                        </span>
                                    </div>

                                    <div className="space-y-2 text-slate-600 text-xs">
                                        <div>
                                            <span className="text-xs text-slate-400 font-medium block">Legal Organization Name</span>
                                            <span className="font-medium text-slate-900 block mt-0.5 truncate">{companyName}</span>
                                        </div>
                                        <div>
                                            <span className="text-xs text-slate-400 font-medium block">GSTIN / Tax ID</span>
                                            <span className="font-mono font-medium text-slate-900 block mt-0.5">{gstin}</span>
                                        </div>
                                        <div>
                                            <span className="text-xs text-slate-400 font-medium block">Authorized Signer</span>
                                            <span className="font-medium text-slate-900 block mt-0.5 truncate">{profile.name} ({adminEmail})</span>
                                        </div>
                                    </div>

                                    <div className="pt-2 border-t border-slate-100 text-xs text-slate-500">
                                        <span>Billing Address: </span>
                                        <span className="text-slate-700 line-clamp-2">{address}</span>
                                    </div>
                                </div>

                                {/* Target Module Preview */}
                                <div className="rounded-xl border border-slate-200/90 bg-slate-50/70 p-3 flex items-center justify-between gap-2.5">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <div className="shrink-0">
                                            {React.createElement(selectedModule.icon, { className: 'w-10 h-10' })}
                                        </div>
                                        <div className="min-w-0">
                                            <span className="text-xs font-medium text-purple-700 uppercase tracking-wider block">
                                                Selected Module
                                            </span>
                                            <h4 className="text-sm font-semibold tracking-tight text-slate-900 truncate">{selectedModule.name}</h4>
                                        </div>
                                    </div>

                                    <div className="text-right shrink-0">
                                        <span className="text-sm font-semibold text-slate-900 block">
                                            ₹{selectedModule.monthlyPrice.toLocaleString()}/mo
                                        </span>
                                        <span className="text-xs text-slate-400 block">+18% GST</span>
                                    </div>
                                </div>

                                {/* Confirmation Checkbox */}
                                <label className="flex items-start gap-2 p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={isConfirmedOrg}
                                        onChange={(e) => setIsConfirmedOrg(e.target.checked)}
                                        className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                                    />
                                    <span className="text-xs text-slate-700 leading-relaxed">
                                        I confirm that I am authorized for <span className="font-semibold text-slate-900">{companyName}</span> to bill this module license to our account.
                                    </span>
                                </label>

                                {/* Action Buttons */}
                                <div className="flex items-center justify-end gap-2 pt-1">
                                    <button
                                        type="button"
                                        onClick={() => setView('list')}
                                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleConfirmAccount}
                                        disabled={!isConfirmedOrg}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-medium shadow-sm shadow-purple-200 transition-all cursor-pointer"
                                    >
                                        <span>Proceed to Payment</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ========================================================= */}
                        {/* VIEW 3: STREAMLINED PAYMENT DETAILS FORM                 */}
                        {/* ========================================================= */}
                        {view === 'payment' && selectedModule && (
                            <form onSubmit={handleProcessPayment} className="space-y-3.5">
                                <button
                                    type="button"
                                    onClick={() => setView('confirm-account')}
                                    className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                                >
                                    <ArrowLeft className="w-3.5 h-3.5" />
                                    <span>Back</span>
                                </button>

                                {/* Plan Term Selector (Monthly vs Annual) */}
                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                                        Select Billing Term
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setBillingCycle('monthly')}
                                            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${billingCycle === 'monthly'
                                                ? 'border-purple-600 bg-purple-50/50 shadow-2xs ring-1 ring-purple-500/20'
                                                : 'border-slate-200/90 bg-white hover:bg-slate-50'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between mb-0.5">
                                                <span className="text-xs font-semibold text-slate-900">Monthly</span>
                                                {billingCycle === 'monthly' && (
                                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                                                )}
                                            </div>
                                            <span className="text-sm font-semibold text-slate-900">
                                                ₹{selectedModule.monthlyPrice.toLocaleString()}
                                            </span>
                                            <span className="text-xs text-slate-400 block mt-0.5">30 days</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setBillingCycle('annual')}
                                            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${billingCycle === 'annual'
                                                ? 'border-purple-600 bg-purple-50/50 shadow-2xs ring-1 ring-purple-500/20'
                                                : 'border-slate-200/90 bg-white hover:bg-slate-50'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between mb-0.5">
                                                <span className="text-xs font-semibold text-slate-900">Annual</span>
                                                <span className="text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded">
                                                    Save 17%
                                                </span>
                                            </div>
                                            <span className="text-sm font-semibold text-slate-900">
                                                ₹{selectedModule.annualPrice.toLocaleString()}
                                            </span>
                                            <span className="text-xs text-slate-400 block mt-0.5">1 year</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Payment Channel Tabs */}
                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                                        Payment Method
                                    </label>
                                    <div className="grid grid-cols-3 gap-1.5">
                                        {[
                                            { id: 'UPI', label: 'UPI', icon: Smartphone },
                                            { id: 'Card', label: 'Card', icon: CreditCard },
                                            { id: 'NetBanking', label: 'NetBank', icon: Banknote }
                                        ].map((mode) => {
                                            const ModeIcon = mode.icon;
                                            const isSelected = paymentMethod === mode.id;

                                            return (
                                                <button
                                                    key={mode.id}
                                                    type="button"
                                                    onClick={() => setPaymentMethod(mode.id as any)}
                                                    className={`p-2 rounded-lg border text-xs font-medium flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${isSelected
                                                        ? 'border-purple-600 bg-purple-50/70 text-purple-700 shadow-2xs font-semibold ring-1 ring-purple-500/20'
                                                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                                                        }`}
                                                >
                                                    <ModeIcon className="w-3.5 h-3.5" />
                                                    <span>{mode.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Streamlined Payment Inputs */}
                                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2.5">
                                    {paymentMethod === 'UPI' && (
                                        <div>
                                            <label className="block text-xs font-medium text-slate-700 mb-1">
                                                Virtual Payment Address (UPI ID) *
                                            </label>
                                            <div className="relative">
                                                <Smartphone className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    type="text"
                                                    required
                                                    value={upiId}
                                                    onChange={(e) => setUpiId(e.target.value)}
                                                    placeholder="digitalraiz@okhdfcbank"
                                                    className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white placeholder-slate-400 text-slate-800 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
                                                />
                                            </div>
                                            <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                                                {['@okhdfcbank', '@okicici', '@paytm'].map((suffix) => (
                                                    <button
                                                        key={suffix}
                                                        type="button"
                                                        onClick={() => setUpiId((prev) => (prev.split('@')[0] || 'business') + suffix)}
                                                        className="px-2 py-0.5 rounded text-xs font-medium bg-white border border-slate-200 text-slate-600 hover:border-purple-400 cursor-pointer"
                                                    >
                                                        {suffix}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {paymentMethod === 'Card' && (
                                        <div className="space-y-2">
                                            <div>
                                                <label className="block text-xs font-medium text-slate-700 mb-0.5">
                                                    Cardholder Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={cardHolder}
                                                    onChange={(e) => setCardHolder(e.target.value)}
                                                    placeholder="Name on card"
                                                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white placeholder-slate-400 text-slate-800 focus:outline-none focus:border-purple-600"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-medium text-slate-700 mb-0.5">
                                                    16-Digit Card Number *
                                                </label>
                                                <div className="relative">
                                                    <CreditCard className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                                    <input
                                                        type="text"
                                                        required
                                                        maxLength={19}
                                                        value={cardNumber}
                                                        onChange={(e) => {
                                                            const val = e.target.value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
                                                            setCardNumber(val);
                                                        }}
                                                        placeholder="4532 8912 3456 7890"
                                                        className="w-full pl-8 pr-2.5 py-1.5 text-xs font-mono rounded-lg border border-slate-200 bg-white placeholder-slate-400 text-slate-800 focus:outline-none focus:border-purple-600"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <label className="block text-xs font-medium text-slate-700 mb-0.5">
                                                        Expiry (MM/YY) *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        required
                                                        maxLength={5}
                                                        value={cardExpiry}
                                                        onChange={(e) => setCardExpiry(e.target.value)}
                                                        placeholder="12/28"
                                                        className="w-full px-2.5 py-1.5 text-xs font-mono rounded-lg border border-slate-200 bg-white placeholder-slate-400 text-slate-800 focus:outline-none focus:border-purple-600"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-slate-700 mb-0.5">
                                                        CVV *
                                                    </label>
                                                    <input
                                                        type="password"
                                                        required
                                                        maxLength={4}
                                                        value={cardCvv}
                                                        onChange={(e) => setCardCvv(e.target.value)}
                                                        placeholder="•••"
                                                        className="w-full px-2.5 py-1.5 text-xs font-mono rounded-lg border border-slate-200 bg-white placeholder-slate-400 text-slate-800 focus:outline-none focus:border-purple-600"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {paymentMethod === 'NetBanking' && (
                                        <div>
                                            <label className="block text-xs font-medium text-slate-700 mb-1">
                                                Select Corporate Bank *
                                            </label>
                                            <select
                                                value={selectedBank}
                                                onChange={(e) => setSelectedBank(e.target.value)}
                                                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-purple-600 cursor-pointer"
                                            >
                                                <option value="HDFC Bank">HDFC Bank Corporate</option>
                                                <option value="ICICI Bank">ICICI Corporate</option>
                                                <option value="State Bank of India">SBI Corporate</option>
                                                <option value="Axis Bank">Axis Bank Ltd</option>
                                                <option value="Kotak Mahindra Bank">Kotak Mahindra</option>
                                            </select>
                                        </div>
                                    )}
                                </div>

                                {/* Transparent Bill Breakdown Card */}
                                <div className="bg-slate-50/90 p-3 rounded-xl border border-slate-200/90 space-y-1.5 text-xs">
                                    <div className="flex justify-between text-slate-600">
                                        <span>{selectedModule.name}:</span>
                                        <span className="font-medium text-slate-900">₹{basePrice.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-500">
                                        <span>GST (18% ITC Eligible):</span>
                                        <span>₹{gstAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-xs font-semibold text-slate-900">
                                        <span>Total Due:</span>
                                        <span className="text-purple-700 font-semibold text-sm">
                                            ₹{totalAmount.toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-between gap-2 pt-1">
                                    <div className="flex items-center gap-1 text-xs text-slate-500">
                                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                        <span>256-Bit SSL</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setView('confirm-account')}
                                            className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isProcessing}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-medium shadow-sm shadow-purple-200 transition-all cursor-pointer"
                                        >
                                            <Lock className="w-3 h-3" />
                                            <span>
                                                {isProcessing ? 'Activating...' : `Pay ₹${totalAmount.toLocaleString()}`}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}

                        {/* ========================================================= */}
                        {/* VIEW 4: SUCCESS CONFIRMATION & ACCESS GRANTED             */}
                        {/* ========================================================= */}
                        {view === 'success' && selectedModule && (
                            <div className="text-center space-y-3.5 py-3">
                                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>

                                <div>
                                    <span className="text-xs uppercase font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                        Access Granted
                                    </span>
                                    <h3 className="text-base font-semibold tracking-tight text-slate-900 mt-1.5">
                                        {selectedModule.name} Activated!
                                    </h3>
                                    <p className="text-xs text-slate-500 max-w-xs mx-auto mt-0.5">
                                        Module privileges are now active for <span className="font-semibold text-slate-800">{companyName}</span>.
                                    </p>
                                </div>

                                {/* Quick Unlocked Feature Badges */}
                                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-left text-xs space-y-1.5">
                                    <span className="text-xs font-semibold text-slate-700 block">
                                        Unlocked Capabilities:
                                    </span>
                                    <div className="space-y-1 text-slate-600 text-xs">
                                        {selectedModule.features.map((f, i) => (
                                            <div key={i} className="flex items-center gap-1.5">
                                                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                                <span className="truncate">{f}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-2 pt-1">
                                    <button
                                        type="button"
                                        onClick={() => handleLaunchModule(selectedModule.path)}
                                        className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium shadow-sm shadow-purple-200 transition-all cursor-pointer"
                                    >
                                        <span>Launch {selectedModule.name}</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setView('list')}
                                        className="w-full px-4 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                                    >
                                        View Modules
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    return typeof document !== 'undefined'
        ? createPortal(drawerContent, document.body)
        : drawerContent;
};

export default ModuleAccessDrawer;
