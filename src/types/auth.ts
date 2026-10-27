import type { VendorProfile } from './index';

export interface VendorUser extends VendorProfile {
  token?: string;
  role?: string;
  createdAt?: string;
}

export interface LoginVendorPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterVendorPayload {
  name: string;
  companyName: string;
  email: string;
  phone: string;
  password: string;
  gstNumber?: string;
  bankName?: string;
  bankAccountNumber?: string;
  ifscCode?: string;
}

export interface AuthResponse {
  success?: boolean;
  message?: string;
  token?: string;
  refreshToken?: string;
  user?: VendorUser;
}
