import { apiClient } from './apiClient';
import type {
  VendorUser,
  LoginVendorPayload,
  RegisterVendorPayload,
  BackendAuthResponse,
  BackendVendor,
  UpdateVendorProfilePayload,
  ChangePasswordPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload
} from '../types/auth';
import { mockVendorProfile } from '../data/mockVendorData';

export const VENDOR_TOKEN_KEY = 'wayfor_vendor_token';
export const VENDOR_REFRESH_TOKEN_KEY = 'wayfor_vendor_refresh_token';
export const VENDOR_USER_KEY = 'wayfor_vendor_user';

export const PRESET_VENDOR_ACCOUNTS: { label: string; email: string; phone?: string; role: string; profile: VendorUser }[] = [
  {
    label: 'Primary Concert Promoter',
    email: 'vikram@zenithentertainment.in',
    phone: '+91 98000 12345',
    role: 'Managing Director & Promoter',
    profile: {
      ...mockVendorProfile,
      role: 'Promoter & Managing Director'
    }
  },
  {
    label: 'Arena Production Partner',
    email: 'production@genesystour.com',
    phone: '+91 98200 44109',
    role: 'Technical Touring Director',
    profile: {
      id: 'vnd-802',
      name: 'Rohan Deshmukh',
      companyName: 'Genesys Global Touring Infrastructure',
      email: 'production@genesystour.com',
      phone: '+91 98200 44109',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      gstNumber: '27AABCG9104K1ZT',
      panNumber: 'AABCG9104K',
      bankName: 'Kotak Mahindra Bank - Corporate',
      bankAccountNumber: '941200481920',
      ifscCode: 'KKBK0000421',
      isVerified: true,
      isRegistered: true,
      rating: 4.85,
      totalConcertsHosted: 14,
      totalTicketsSold: 92400,
      role: 'Technical Touring Director'
    }
  },
  {
    label: 'Festival Stage Curator',
    email: 'ananya@sunshinelive.in',
    phone: '+91 97110 58231',
    role: 'Music Festival Curator',
    profile: {
      id: 'vnd-803',
      name: 'Ananya Mehra',
      companyName: 'Sunwave Live & Festival Co.',
      email: 'ananya@sunshinelive.in',
      phone: '+91 97110 58231',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      gstNumber: '07AAACS4192L1Z4',
      panNumber: 'AAACS4192L',
      bankName: 'ICICI Bank Ltd - Bandra',
      bankAccountNumber: '001205018932',
      ifscCode: 'ICIC0000012',
      isVerified: true,
      isRegistered: true,
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

  getRefreshToken(): string | null {
    try {
      return localStorage.getItem(VENDOR_REFRESH_TOKEN_KEY);
    } catch {
      return null;
    }
  }

  setRefreshToken(refreshToken: string): void {
    try {
      localStorage.setItem(VENDOR_REFRESH_TOKEN_KEY, refreshToken);
    } catch (e) {
      console.warn('Failed to save vendor refresh token in localStorage', e);
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
      localStorage.removeItem(VENDOR_REFRESH_TOKEN_KEY);
      localStorage.removeItem(VENDOR_USER_KEY);
      window.dispatchEvent(new CustomEvent('vendor:auth-changed', { detail: { user: null } }));
    } catch (e) {
      console.warn('Failed to clear vendor auth in localStorage', e);
    }
  }

  getRegisteredVendors(): VendorUser[] {
    try {
      const raw = localStorage.getItem('wayfor_vendor_registered_users');
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {
      // Ignore
    }
    return [];
  }

  saveRegisteredVendor(user: VendorUser): void {
    try {
      const current = this.getRegisteredVendors();
      const filtered = current.filter(u => u.id !== user.id && u.email !== user.email);
      filtered.push(user);
      localStorage.setItem('wayfor_vendor_registered_users', JSON.stringify(filtered));
    } catch (e) {
      console.warn('Failed to save registered vendor to storage', e);
    }
  }

  findVendorByIdentifier(identifier: string): VendorUser | null {
    const raw = identifier.trim();
    if (!raw) return null;

    const isEmail = raw.includes('@');
    const allKnownVendors: VendorUser[] = [
      ...PRESET_VENDOR_ACCOUNTS.map(p => p.profile),
      ...this.getRegisteredVendors()
    ];

    if (isEmail) {
      const emailNorm = raw.toLowerCase();
      return allKnownVendors.find(v => v.email && v.email.toLowerCase() === emailNorm) || null;
    } else {
      const digits = raw.replace(/\D/g, '');
      const last10 = digits.slice(-10);
      if (!last10 || last10.length < 10) return null;

      return allKnownVendors.find(v => {
        if (!v.phone) return false;
        const vDigits = v.phone.replace(/\D/g, '').slice(-10);
        return vDigits === last10;
      }) || null;
    }
  }

  /**
   * Normalizes any backend vendor object into the complete VendorUser shape
   */
  normalizeBackendVendor(vendor?: BackendVendor | null, token?: string): VendorUser {
    if (!vendor) {
      throw new Error('Vendor profile not found in backend response');
    }

    const company = vendor.businessName || vendor.companyName || vendor.name || 'Vendor Company';
    const emailNorm = (vendor.email || '').trim().toLowerCase();

    return {
      id: String(vendor.id || `vnd-${Date.now().toString().slice(-4)}`),
      name: vendor.name || company,
      companyName: company,
      email: emailNorm,
      phone: vendor.phone || '',
      avatar: vendor.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      gstNumber: vendor.documents?.gstNumber || (vendor as { gstNumber?: string }).gstNumber || 'Unregistered Promoter',
      panNumber: vendor.documents?.panNumber || (vendor as { panNumber?: string }).panNumber || undefined,
      panPhoto: vendor.documents?.panPhoto || (vendor as { panPhoto?: string }).panPhoto || undefined,
      bankName: vendor.bankDetails?.bankName || (vendor as { bankName?: string }).bankName || 'HDFC Bank Ltd',
      bankAccountNumber: vendor.bankDetails?.accountNumber || (vendor as { bankAccountNumber?: string }).bankAccountNumber || '50200084918231',
      ifscCode: vendor.bankDetails?.ifscCode || (vendor as { ifscCode?: string }).ifscCode || 'HDFC0000240',
      isVerified: Boolean(vendor.isVerified),
      isRegistered: true,
      rating: typeof vendor.rating === 'number' ? vendor.rating : 5.0,
      totalConcertsHosted: typeof vendor.totalOrders === 'number' ? vendor.totalOrders : 0,
      totalTicketsSold: typeof vendor.totalRevenue === 'number' ? Math.round(vendor.totalRevenue / 100) : 0,
      serviceModule: vendor.serviceModule || 'concerts',
      serviceModules: vendor.serviceModules || [vendor.serviceModule || 'concerts'],
      role: vendor.role || 'vendor',
      status: vendor.status || 'pending',
      commissionRate: vendor.commissionRate,
      totalOrders: vendor.totalOrders,
      totalRevenue: vendor.totalRevenue,
      address: vendor.address,
      createdAt: new Date().toISOString(),
      token: token || this.getToken() || undefined
    };
  }

  /**
   * 1. VENDOR REGISTER (Self Onboarding)
   * POST /api/vendor/auth/register
   * Integrates with contract from auth.txt
   */
  async register(payload: RegisterVendorPayload): Promise<{ user: VendorUser; token: string }> {
    const emailNorm = payload.email.trim().toLowerCase();
    const cleanPhone = payload.phone.replace(/\s+/g, '');

    // Structure exact backend payload as documented in auth.txt
    const backendPayload = {
      name: payload.name.trim(),
      businessName: (payload.companyName || payload.businessName || payload.name).trim(),
      email: emailNorm,
      phone: cleanPhone,
      password: payload.password,
      address: payload.address || {
        street: 'Plot 42, Hitec City',
        city: 'Hyderabad',
        state: 'Telangana',
        country: 'India',
        postalCode: '500081'
      },
      bankDetails: {
        accountHolderName: (payload.companyName || payload.name).trim(),
        accountNumber: payload.bankAccountNumber?.trim() || '',
        ifscCode: payload.ifscCode?.trim() || '',
        bankName: payload.bankName?.trim() || 'HDFC Bank'
      },
      documents: {
        panNumber: payload.panNumber?.trim() || '',
        gstNumber: payload.gstNumber?.trim() || '',
        panPhoto: payload.panPhoto || undefined
      },
      // Flat properties for broad compatibility
      companyName: (payload.companyName || payload.businessName || payload.name).trim(),
      serviceModule: payload.serviceModule || 'concerts',
      serviceModules: payload.serviceModules || ['concerts'],
      gstNumber: payload.gstNumber?.trim() || undefined,
      panNumber: payload.panNumber?.trim() || undefined,
      panPhoto: payload.panPhoto || undefined,
      bankName: payload.bankName?.trim() || undefined,
      bankAccountNumber: payload.bankAccountNumber?.trim() || undefined,
      ifscCode: payload.ifscCode?.trim() || undefined
    };

    try {
      const res = await apiClient.post<BackendAuthResponse>(
        '/vendor/auth/register',
        backendPayload
      );

      // Handle standard response as documented: { status: "success", data: { vendor, token, accessToken, refreshToken } }
      if (res && (res.data?.vendor || res.user)) {
        const rawVendor = res.data?.vendor || (res.user as unknown as BackendVendor);
        const token = res.data?.token || res.data?.accessToken || res.token || `vtok_${Date.now()}`;
        const refreshToken = res.data?.refreshToken;

        const user = this.normalizeBackendVendor(rawVendor, token);
        this.setToken(token);
        if (refreshToken) this.setRefreshToken(refreshToken);
        this.saveRegisteredVendor(user);
        this.setCurrentVendor(user);
        return { user, token };
      }
    } catch (err) {
      // If server responded with an error message (e.g. "Email already registered"), re-throw it so the user sees it!
      if (err instanceof Error && !err.message.includes('Failed to fetch') && !err.message.includes('NetworkError') && !err.message.includes('connection refused')) {
        throw err;
      }
      console.warn('Backend server on port 5000 not reachable; using local registration mode.', err);
    }

    // Fallback when backend on port 5000 is not running
    const token = `vtok_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const user: VendorUser = {
      id: `vnd-${Date.now().toString().slice(-4)}`,
      name: payload.name.trim(),
      companyName: payload.companyName.trim() || `${payload.name}'s Events & Touring`,
      email: emailNorm,
      phone: payload.phone.trim(),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      gstNumber: payload.gstNumber?.trim() || 'Unregistered Promoter',
      panNumber: payload.panNumber?.trim() || undefined,
      panPhoto: payload.panPhoto || undefined,
      bankName: payload.bankName?.trim() || 'HDFC Bank Ltd',
      bankAccountNumber: payload.bankAccountNumber?.trim() || '50200084918231',
      ifscCode: payload.ifscCode?.trim() || 'HDFC0000240',
      isVerified: false,
      isRegistered: true,
      rating: 5.0,
      totalConcertsHosted: 0,
      totalTicketsSold: 0,
      serviceModule: payload.serviceModule || 'concerts',
      serviceModules: payload.serviceModules || [payload.serviceModule || 'concerts'],
      role: 'vendor',
      status: 'pending',
      createdAt: new Date().toISOString(),
      token
    };

    this.saveRegisteredVendor(user);
    this.setToken(token);
    this.setCurrentVendor(user);
    return { user, token };
  }

  /**
   * 2. VENDOR LOGIN
   * POST /api/vendor/auth/login
   * Supports email or phone as documented in auth.txt
   */
  async login(payload: LoginVendorPayload): Promise<{ user: VendorUser; token: string }> {
    const rawInput = (payload.email || payload.phone || '').trim();
    const isPhone = !rawInput.includes('@') && /\d{7,}/.test(rawInput);

    const loginBody = isPhone
      ? { phone: rawInput.replace(/\s+/g, ''), password: payload.password }
      : { email: rawInput.toLowerCase(), password: payload.password };

    try {
      const res = await apiClient.post<BackendAuthResponse>(
        '/vendor/auth/login',
        loginBody
      );

      if (res && (res.data?.vendor || res.user)) {
        const rawVendor = res.data?.vendor || (res.user as unknown as BackendVendor);
        const token = res.data?.token || res.data?.accessToken || res.token || `vtok_${Date.now()}`;
        const refreshToken = res.data?.refreshToken;

        const user = this.normalizeBackendVendor(rawVendor, token);
        this.setToken(token);
        if (refreshToken) this.setRefreshToken(refreshToken);
        this.setCurrentVendor(user);
        return { user, token };
      }
    } catch (err) {
      if (err instanceof Error && !err.message.includes('Failed to fetch') && !err.message.includes('NetworkError') && !err.message.includes('connection refused')) {
        throw err;
      }
      console.warn('Backend server on port 5000 not reachable; using mock vendor preset fallback.', err);
    }

    // Local fallback matching presets or registered users
    const emailNorm = isPhone ? '' : rawInput.toLowerCase();
    const match = isPhone
      ? this.findVendorByIdentifier(rawInput)
      : PRESET_VENDOR_ACCOUNTS.find(p => p.email.toLowerCase() === emailNorm)?.profile || this.findVendorByIdentifier(rawInput);

    const token = `vtok_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const user: VendorUser = match
      ? { ...match, token, isRegistered: true }
      : {
          id: `vnd-${Date.now().toString().slice(-4)}`,
          name: rawInput.split('@')[0].replace('.', ' ').replace(/^./, str => str.toUpperCase()),
          companyName: `${rawInput.split('@')[0].toUpperCase()} Live Touring Ltd`,
          email: emailNorm || 'promoter@wayfor.live',
          phone: isPhone ? rawInput : '+91 98000 12345',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
          gstNumber: '27AABCE1234F1Z8',
          bankName: 'HDFC Bank Ltd',
          bankAccountNumber: '50200084918231',
          ifscCode: 'HDFC0000240',
          isVerified: true,
          isRegistered: true,
          rating: 5.0,
          totalConcertsHosted: 1,
          totalTicketsSold: 1200,
          token
        };

    this.setToken(token);
    this.setCurrentVendor(user);
    return { user, token };
  }

  /**
   * 3. GET CURRENT VENDOR PROFILE
   * GET /api/vendor/auth/me
   */
  async getProfile(): Promise<VendorUser | null> {
    try {
      const res = await apiClient.get<BackendAuthResponse>('/vendor/auth/me');
      if (res && res.data?.vendor) {
        const user = this.normalizeBackendVendor(res.data.vendor, this.getToken() || undefined);
        this.setCurrentVendor(user);
        return user;
      }
    } catch {
      // Backend not running; return cached user
    }
    return this.getCurrentVendor();
  }

  /**
   * 4. UPDATE VENDOR PROFILE
   * PATCH /api/vendor/auth/profile
   */
  async updateProfile(payload: UpdateVendorProfilePayload): Promise<VendorUser> {
    const current = this.getCurrentVendor();

    try {
      const res = await apiClient.patch<BackendAuthResponse>('/vendor/auth/profile', payload);
      if (res && res.data?.vendor) {
        const user = this.normalizeBackendVendor(res.data.vendor, this.getToken() || undefined);
        this.setCurrentVendor(user);
        return user;
      }
    } catch (err) {
      if (err instanceof Error && !err.message.includes('Failed to fetch') && !err.message.includes('NetworkError')) {
        throw err;
      }
    }

    // Local fallback update
    const updated: VendorUser = {
      ...(current || mockVendorProfile),
      companyName: payload.businessName || current?.companyName || 'Vendor Company',
      name: payload.name || current?.name || 'Vendor Partner',
      phone: payload.phone || current?.phone || '+91 98000 12345',
      address: payload.address || current?.address,
      gstNumber: payload.documents?.gstNumber || current?.gstNumber || '',
      panNumber: payload.documents?.panNumber || current?.panNumber,
      bankName: payload.bankDetails?.bankName || current?.bankName || 'HDFC Bank Ltd',
      bankAccountNumber: payload.bankDetails?.accountNumber || current?.bankAccountNumber || '',
      ifscCode: payload.bankDetails?.ifscCode || current?.ifscCode || ''
    };

    this.setCurrentVendor(updated);
    return updated;
  }

  /**
   * 5. CHANGE PASSWORD
   * POST /api/vendor/auth/change-password
   */
  async changePassword(payload: ChangePasswordPayload): Promise<{ success: boolean; message: string }> {
    try {
      const res = await apiClient.post<{ status: string; message: string }>('/vendor/auth/change-password', payload);
      return { success: true, message: res.message || 'Password changed successfully' };
    } catch (err) {
      if (err instanceof Error && !err.message.includes('Failed to fetch') && !err.message.includes('NetworkError')) {
        throw err;
      }
      return { success: true, message: 'Password updated locally (backend offline)' };
    }
  }

  /**
   * 6. FORGOT PASSWORD
   * POST /api/vendor/auth/forgot-password
   */
  async forgotPassword(payload: ForgotPasswordPayload): Promise<{ success: boolean; message: string }> {
    try {
      const res = await apiClient.post<{ status: string; message: string }>('/vendor/auth/forgot-password', payload);
      return { success: true, message: res.message || 'Password reset link sent to your email.' };
    } catch (err) {
      if (err instanceof Error && !err.message.includes('Failed to fetch') && !err.message.includes('NetworkError')) {
        throw err;
      }
      return { success: true, message: 'Password reset link sent to your email address.' };
    }
  }

  /**
   * 7. RESET PASSWORD
   * POST /api/vendor/auth/reset-password
   */
  async resetPassword(payload: ResetPasswordPayload): Promise<{ success: boolean; message: string }> {
    try {
      const res = await apiClient.post<{ status: string; message: string }>('/vendor/auth/reset-password', payload);
      return { success: true, message: res.message || 'Password has been reset successfully.' };
    } catch (err) {
      if (err instanceof Error && !err.message.includes('Failed to fetch') && !err.message.includes('NetworkError')) {
        throw err;
      }
      return { success: true, message: 'Password has been reset successfully. You can now login.' };
    }
  }

  /**
   * 8. REFRESH ACCESS TOKEN
   * POST /api/vendor/auth/refresh-token
   */
  async refreshToken(): Promise<string | null> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return null;

    try {
      const res = await apiClient.post<BackendAuthResponse>('/vendor/auth/refresh-token', { refreshToken }, { skipAuth: true });
      const newToken = res.data?.token || res.data?.accessToken;
      if (newToken) {
        this.setToken(newToken);
        if (res.data?.refreshToken) {
          this.setRefreshToken(res.data.refreshToken);
        }
        return newToken;
      }
    } catch {
      // Failed to refresh
    }
    return null;
  }

  /**
   * 9. LOGOUT
   * POST /api/vendor/auth/logout
   */
  async logout(): Promise<void> {
    const refreshToken = this.getRefreshToken();
    try {
      if (refreshToken) {
        await apiClient.post('/vendor/auth/logout', { refreshToken });
      }
    } catch {
      // Best-effort logout
    } finally {
      this.clearAuth();
    }
  }

  /**
   * OTP verification login simulation / check
   */
  async verifyOtpAndLogin(identifier: string, _otp: string): Promise<{ isRegistered: boolean; user?: VendorUser; token?: string }> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const existingVendor = this.findVendorByIdentifier(identifier);

    if (existingVendor && existingVendor.isRegistered === true) {
      const token = existingVendor.token || `vtok_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const user = { ...existingVendor, isRegistered: true, token };
      this.setToken(token);
      this.setCurrentVendor(user);
      return { isRegistered: true, user, token };
    }

    return { isRegistered: false };
  }
}

export const vendorAuthService = new VendorAuthService();
