const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string) ||
  (import.meta.env.VITE_API_BASE_URL as string) ||
  'http://192.168.0.161:5001/api';

const VENDOR_TOKEN_KEY = 'wayfor_vendor_token';

export interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
  params?: Record<string, string | number | boolean | undefined | null>;
}

const buildUrl = (endpoint: string, params?: RequestOptions['params']): string => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const base = API_BASE_URL.replace(/\/+$/, '');
  const url = new URL(`${base}${cleanEndpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        url.searchParams.append(key, String(val));
      }
    });
  }

  return url.toString();
};

const buildHeaders = (options?: RequestOptions, isFormData = false): HeadersInit => {
  const headers: Record<string, string> = {};

  // For FormData, the browser must set Content-Type with multipart boundary automatically
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  if (!options?.skipAuth) {
    try {
      const token = localStorage.getItem(VENDOR_TOKEN_KEY);
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    } catch {
      // Ignore
    }
  }

  return {
    ...headers,
    ...((options?.headers as Record<string, string>) || {}),
  };
};

const handleResponse = async <T>(res: Response): Promise<T> => {
  if (!res.ok) {
    let errorMessage = `HTTP ${res.status}: ${res.statusText}`;
    try {
      const errorBody = await res.json();
      if (errorBody && typeof errorBody === 'object') {
        errorMessage = errorBody.message || errorBody.error || errorMessage;
      }
    } catch {
      // Non-JSON response fallback
    }
    throw new Error(errorMessage);
  }

  if (res.status === 204) {
    return {} as T;
  }

  return res.json();
};

export const apiClient = {
  baseUrl: API_BASE_URL,

  get: async <T>(endpoint: string, options?: RequestOptions): Promise<T> => {
    const url = buildUrl(endpoint, options?.params);
    const res = await fetch(url, {
      method: 'GET',
      headers: buildHeaders(options, false),
      ...options,
    });
    return handleResponse<T>(res);
  },

  post: async <T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> => {
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
    const url = buildUrl(endpoint, options?.params);
    const res = await fetch(url, {
      method: 'POST',
      headers: buildHeaders(options, isFormData),
      body: isFormData ? (data as FormData) : data !== undefined ? JSON.stringify(data) : undefined,
      ...options,
    });
    return handleResponse<T>(res);
  },

  patch: async <T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> => {
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
    const url = buildUrl(endpoint, options?.params);
    const res = await fetch(url, {
      method: 'PATCH',
      headers: buildHeaders(options, isFormData),
      body: isFormData ? (data as FormData) : data !== undefined ? JSON.stringify(data) : undefined,
      ...options,
    });
    return handleResponse<T>(res);
  },

  put: async <T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> => {
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
    const url = buildUrl(endpoint, options?.params);
    const res = await fetch(url, {
      method: 'PUT',
      headers: buildHeaders(options, isFormData),
      body: isFormData ? (data as FormData) : data !== undefined ? JSON.stringify(data) : undefined,
      ...options,
    });
    return handleResponse<T>(res);
  },

  delete: async <T>(endpoint: string, options?: RequestOptions): Promise<T> => {
    const url = buildUrl(endpoint, options?.params);
    const res = await fetch(url, {
      method: 'DELETE',
      headers: buildHeaders(options, false),
      ...options,
    });
    return handleResponse<T>(res);
  },
};
