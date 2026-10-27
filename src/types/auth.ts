import type { VendorProfile } from './index';

export interface VendorUser extends VendorProfile {
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  role?: string;
  status?: string;
  commissionRate?: number;
  totalOrders?: number;
  totalRevenue?: number;
  createdAt?: string;
  address?: BackendAddress;
}

export interface LoginVendorPayload {
  email?: string;
  phone?: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterVendorPayload {
  name: string;
  companyName: string;
  businessName?: string;
  email: string;
  phone: string;
  password: string;
  serviceModule?: string;
  serviceModules?: string[];
  gstNumber?: string;
  panNumber?: string;
  panPhoto?: string;
  panPhotoName?: string;
  bankName?: string;
  bankAccountNumber?: string;
  ifscCode?: string;
  address?: BackendAddress;
}

export interface BackendAddress {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface BackendBankDetails {
  accountHolderName?: string;
  accountNumber?: string;
  ifscCode?: string;
  bankName?: string;
}

export interface BackendDocuments {
  panNumber?: string;
  gstNumber?: string;
  panPhoto?: string;
  panPhotoName?: string;
}

export interface BackendVendor {
  id: string | number;
  name: string;
  businessName?: string;
  companyName?: string;
  email: string;
  phone: string;
  role?: string;
  status?: string;
  isVerified?: boolean;
  isRegistered?: boolean;
  avatar?: string;
  address?: BackendAddress;
  bankDetails?: BackendBankDetails;
  documents?: BackendDocuments;
  commissionRate?: number;
  rating?: number;
  totalOrders?: number;
  totalRevenue?: number;
  serviceModule?: string;
  serviceModules?: string[];
}

export interface BackendAuthResponse {
  status?: 'success' | 'error';
  message?: string;
  data?: {
    vendor?: BackendVendor;
    token?: string;
    accessToken?: string;
    refreshToken?: string;
    expiresIn?: string;
  };
  // Fallbacks if top-level structure is returned
  user?: VendorUser;
  token?: string;
}

export interface AuthResponse {
  success?: boolean;
  message?: string;
  token?: string;
  refreshToken?: string;
  user?: VendorUser;
}

export interface UpdateVendorProfilePayload {
  businessName?: string;
  name?: string;
  phone?: string;
  address?: BackendAddress;
  bankDetails?: BackendBankDetails;
  documents?: BackendDocuments;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}
