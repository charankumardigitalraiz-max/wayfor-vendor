import { apiClient } from './apiClient';
import type { VendorUser, LoginVendorPayload, RegisterVendorPayload } from '../types/auth';
import { mockVendorProfile } from '../data/mockVendorData';

export const VENDOR_TOKEN_KEY = 'wayfor_vendor_token';
export const VENDOR_USER_KEY = 'wayfor_vendor_user';

export const PRESET_VENDOR_ACCOUNTS: { label: string; email: string; role: string; profile: VendorUser }[] = [
  {
    label: 'Primary Concert Promoter',
    email: 'vikram@zenithentertainment.in',
    role: 'Managing Director & Promoter',
    profile: {
      ...mockVendorProfile,
      role: 'Promoter & Managing Director'
    }
  },
  {
    label: 'Arena Production Partner',
    email: 'production@genesystour.com',
    role: 'Technical Touring Director',
    profile: {
      id: 'vnd-802',
      name: 'Rohan Deshmukh',
      companyName: 'Genesys Global Touring Infrastructure',
      email: 'production@genesystour.com',
      phone: '+91 98200 44109',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      gstNumber: '27AABCG9104K1ZT',
      bankName: 'Kotak Mahindra Bank - Corporate',
      bankAccountNumber: '941200481920',
      ifscCode: 'KKBK0000421',
      isVerified: true,
      rating: 4.85,
      totalConcertsHosted: 14,
      totalTicketsSold: 92400,
      role: 'Technical Touring Director'
    }
  },
  {
    label: 'Festival Stage Curator',
    email: 'ananya@sunshinelive.in',
    role: 'Music Festival Curator',
    profile: {
      id: 'vnd-803',
      name: 'Ananya Mehra',
      companyName: 'Sunwave Live & Festival Co.',
      email: 'ananya@sunshinelive.in',
      phone: '+91 97110 58231',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      gstNumber: '07AAACS4192L1Z4',
      bankName: 'ICICI Bank Ltd - Bandra',
      bankAccountNumber: '001205018932',
      ifscCode: 'ICIC0000012',
      isVerified: true,
      rating: 4.95,
      totalConcertsHosted: 21,
      totalTicketsSold: 142000,
      role: 'Music Festival Curator'
    }
  }
];

class VendorAuthService {
  getToken(): string | null {
    try {
      return localStorage.getItem(VENDOR_TOKEN_KEY);
    } catch {
      return null;
    }
  }

  setToken(token: string): void {
    try {
      localStorage.setItem(VENDOR_TOKEN_KEY, token);
    } catch (e) {
      console.warn('Failed to save vendor token in localStorage', e);
    }
  }

  getCurrentVendor(): VendorUser | null {
    try {
      const data = localStorage.getItem(VENDOR_USER_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Failed to read vendor profile from localStorage', e);
    }
    // Default fallback to first preset for instant preview if token exists
    return null;
  }

  setCurrentVendor(user: VendorUser): void {
    try {
      localStorage.setItem(VENDOR_USER_KEY, JSON.stringify(user));
      window.dispatchEvent(new CustomEvent('vendor:auth-changed', { detail: { user } }));
    } catch (e) {
      console.warn('Failed to save vendor profile in localStorage', e);
    }
  }

  clearAuth(): void {
    try {
      localStorage.removeItem(VENDOR_TOKEN_KEY);
      localStorage.removeItem(VENDOR_USER_KEY);
      window.dispatchEvent(new CustomEvent('vendor:auth-changed', { detail: { user: null } }));
    } catch (e) {
      console.warn('Failed to clear vendor auth in localStorage', e);
    }
  }

  async login(payload: LoginVendorPayload): Promise<{ user: VendorUser; token: string }> {
    const emailNorm = payload.email.trim().toLowerCase();

    try {
      const res = await apiClient.post<{ user?: VendorUser; token?: string }>(
        '/vendor/auth/login',
        { email: emailNorm, password: payload.password }
      );
      if (res?.token && res?.user) {
        this.setToken(res.token);
        this.setCurrentVendor(res.user);
        return { user: res.user, token: res.token };
      }
    } catch {
      // Backend not running or endpoint not ready — use local fallback
    }

    // Match existing preset or generate user profile from email
    const match = PRESET_VENDOR_ACCOUNTS.find(p => p.email.toLowerCase() === emailNorm);
    const token = `vtok_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const user: VendorUser = match
      ? { ...match.profile, token }
      : {
          id: `vnd-${Date.now().toString().slice(-4)}`,
          name: emailNorm.split('@')[0].replace('.', ' ').replace(/^./, str => str.toUpperCase()),
          companyName: `${emailNorm.split('@')[0].toUpperCase()} Entertainment Touring`,
          email: emailNorm,
          phone: '+91 98000 12345',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
          gstNumber: '27AABCE1234F1Z8',
          bankName: 'HDFC Bank Ltd',
          bankAccountNumber: '50200084918231',
          ifscCode: 'HDFC0000240',
          isVerified: true,
          rating: 5.0,
          totalConcertsHosted: 1,
          totalTicketsSold: 1200,
          token
        };

    this.setToken(token);
    this.setCurrentVendor(user);
    return { user, token };
  }

  async register(payload: RegisterVendorPayload): Promise<{ user: VendorUser; token: string }> {
    const emailNorm = payload.email.trim().toLowerCase();

    try {
      const res = await apiClient.post<{ user?: VendorUser; token?: string }>(
        '/vendor/auth/register',
        payload
      );
      if (res?.token && res?.user) {
        this.setToken(res.token);
        this.setCurrentVendor(res.user);
        return { user: res.user, token: res.token };
      }
    } catch {
      // Backend fallback
    }

    const token = `vtok_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const user: VendorUser = {
      id: `vnd-${Date.now().toString().slice(-4)}`,
      name: payload.name.trim(),
      companyName: payload.companyName.trim() || `${payload.name}'s Events & Touring`,
      email: emailNorm,
      phone: payload.phone.trim(),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      gstNumber: payload.gstNumber?.trim() || 'Unregistered Promoter',
      bankName: payload.bankName?.trim() || 'HDFC Bank Ltd',
      bankAccountNumber: payload.bankAccountNumber?.trim() || '50200084918231',
      ifscCode: payload.ifscCode?.trim() || 'HDFC0000240',
      isVerified: false,
      rating: 5.0,
      totalConcertsHosted: 0,
      totalTicketsSold: 0,
      createdAt: new Date().toISOString(),
      token
    };

    this.setToken(token);
    this.setCurrentVendor(user);
    return { user, token };
  }

  logout(): void {
    this.clearAuth();
  }
}

export const vendorAuthService = new VendorAuthService();
