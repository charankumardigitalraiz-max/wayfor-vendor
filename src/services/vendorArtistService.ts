import { apiClient } from './apiClient';
import type { Artist } from '../types';
import { mockArtists } from '../data/mockVendorData';
import { getImageUrl, DEFAULT_AVATAR_IMAGE } from '../utils/imageUtils';

export const ARTISTS_STORAGE_KEY = 'digitalraiz_vendor_artists';

export interface ArtistQueryParams {
  page?: number;
  limit?: number;
  genre?: string;
  search?: string;
}

export interface CreateArtistPayload {
  name: string;
  email?: string;
  phone?: string;
  avatar?: string | File;
  aboutus?: string;
  genre?: string;
  stageName?: string;
  city?: string;
  country?: string;
  status?: Artist['status'];
}

export interface UpdateArtistPayload {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string | File;
  aboutus?: string;
  bio?: string;
  genre?: string;
  stageName?: string;
  city?: string;
  country?: string;
  status?: Artist['status'];
  isFeatured?: boolean;
  bookingRatePerShow?: number;
}

export interface BackendArtistResponse {
  status?: string;
  message?: string;
  data?: any;
  artists?: any[];
}

export class VendorArtistService {
  /**
   * Helper to normalize any artist record from the backend into the application's Artist interface.
   */
  public normalizeArtist(raw: any): Artist {
    const id = String(raw.id || raw._id || `art-${Date.now()}`);
    const rawAvatar = raw.avatar || raw.image || raw.photo || '';
    const avatar = getImageUrl(rawAvatar, DEFAULT_AVATAR_IMAGE);

    const bio =
      raw.aboutus ||
      raw.bio ||
      raw.description ||
      (raw.name ? `${raw.name} is a concert performer.` : 'Artist profile.');

    const genre = raw.genre || 'General Music';
    const subGenres = Array.isArray(raw.subGenres) && raw.subGenres.length > 0
      ? raw.subGenres
      : [genre, 'Live Performance'];

    const statusVal = raw.status ? String(raw.status).toLowerCase() : 'active';
    const validStatuses: Artist['status'][] = ['touring', 'active', 'available', 'on-break'];
    const status: Artist['status'] = validStatuses.includes(statusVal as Artist['status'])
      ? (statusVal as Artist['status'])
      : 'active';

    const management = {
      managerName: raw.managerName || raw.management?.managerName || undefined,
      agency: raw.agency || raw.management?.agency || (raw.companyName || undefined),
      email: raw.email || raw.management?.email || undefined,
      phone: raw.phone || raw.management?.phone || undefined,
    };

    return {
      id,
      name: raw.name || 'Unnamed Artist',
      stageName: raw.stageName || raw.name || '',
      genre,
      subGenres,
      avatar,
      bannerImage: raw.bannerImage ? getImageUrl(raw.bannerImage) : undefined,
      bio,
      country: raw.country || 'India',
      city: raw.city || 'Mumbai',
      monthlyListeners: raw.monthlyListeners || raw.listeners || undefined,
      status,
      verified: raw.verified ?? raw.isFeatured ?? true,
      totalConcerts: raw.totalConcerts ?? 0,
      upcomingConcerts: raw.upcomingConcerts ?? 0,
      socialLinks: raw.socialLinks || {},
      management,
      rider: raw.rider || {},
    };
  }

  /**
   * Extracts an array of raw artist items from common backend response structures.
   */
  private extractArtists(res: any): any[] {
    if (!res) return [];
    if (Array.isArray(res)) return res;
    if (Array.isArray(res.data)) return res.data;
    if (res.data && Array.isArray(res.data.artists)) return res.data.artists;
    if (res.data && Array.isArray(res.data.items)) return res.data.items;
    if (Array.isArray(res.artists)) return res.artists;
    if (Array.isArray(res.items)) return res.items;
    return [];
  }

  /**
   * Read stored artists from local cache (fallback).
   */
  public getStoredArtists(): Artist[] {
    try {
      const raw = localStorage.getItem(ARTISTS_STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(ARTISTS_STORAGE_KEY, JSON.stringify(mockArtists));
        return mockArtists;
      }
      return JSON.parse(raw);
    } catch {
      return mockArtists;
    }
  }

  /**
   * Write artists to local cache.
   */
  public saveArtists(artists: Artist[]): void {
    try {
      localStorage.setItem(ARTISTS_STORAGE_KEY, JSON.stringify(artists));
    } catch (e) {
      console.warn('Failed to save artists to localStorage:', e);
    }
  }

  /**
   * 2. GET ALL ARTISTS
   * curl -X GET "http://192.168.0.161:5001/api/vendor/concerts/artists?page=1&limit=20&genre=EDM"
   */
  public async getArtists(params?: ArtistQueryParams): Promise<Artist[]> {
    try {
      const queryParams: Record<string, string | number | boolean | undefined> = {};
      if (params?.page) queryParams.page = params.page;
      if (params?.limit) queryParams.limit = params.limit;
      if (params?.genre && params.genre !== 'All Genres') queryParams.genre = params.genre;
      if (params?.search) queryParams.search = params.search;

      const res = await apiClient.get<BackendArtistResponse | any[]>('/vendor/concerts/artists', {
        params: queryParams,
      });

      const rawItems = this.extractArtists(res);
      if (rawItems && rawItems.length > 0) {
        const normalized = rawItems.map((item) => this.normalizeArtist(item));
        this.saveArtists(normalized);
        return normalized;
      }

      // If backend returned empty list but succeeded, return empty list
      if (Array.isArray(res) || (res && res.status === 'success')) {
        return [];
      }
    } catch (err) {
      console.warn('Failed to fetch artists from API; using cached roster:', err);
    }

    return this.getStoredArtists();
  }

  /**
   * 3. GET ARTIST BY ID
   * curl -X GET "http://192.168.0.161:5001/api/vendor/concerts/artists/:id"
   */
  public async getArtistById(id: string): Promise<Artist | undefined> {
    try {
      const res = await apiClient.get<any>(`/vendor/concerts/artists/${encodeURIComponent(id)}`);
      const rawArtist = res?.data?.artist || res?.data || res?.artist || res;
      if (rawArtist && (rawArtist.name || rawArtist.id || rawArtist._id)) {
        return this.normalizeArtist(rawArtist);
      }
    } catch (err) {
      console.warn(`Failed to fetch artist ${id} from API; searching local cache:`, err);
    }

    const cached = this.getStoredArtists();
    return cached.find((a) => a.id === id);
  }

  /**
   * 1. CREATE ARTIST
   * Supports Option A: Multipart/Form-Data File Upload (name*, email, phone, avatar file, aboutus)
   * Supports Option B: JSON payload with direct image URL
   */
  public async createArtist(
    payload: CreateArtistPayload | Omit<Artist, 'id'>,
    avatarFile?: File | null
  ): Promise<Artist> {
    const name = payload.name.trim();
    if (!name) {
      throw new Error('Artist name is required.');
    }

    const email =
      (payload as CreateArtistPayload).email?.trim() ||
      (payload as any).management?.email?.trim() ||
      '';
    const phone =
      (payload as CreateArtistPayload).phone?.trim() ||
      (payload as any).management?.phone?.trim() ||
      '';
    const aboutus =
      (payload as CreateArtistPayload).aboutus?.trim() ||
      (payload as any).bio?.trim() ||
      '';
    const genre = (payload as any).genre || 'General Music';
    const status = (payload as any).status || 'active';

    try {
      let createdRaw: any = null;

      // Option A: If a physical image file is provided, use multipart/form-data
      if (avatarFile instanceof File) {
        const formData = new FormData();
        formData.append('name', name);
        if (email) formData.append('email', email);
        if (phone) formData.append('phone', phone);
        formData.append('avatar', avatarFile);
        if (aboutus) formData.append('aboutus', aboutus);
        if (genre) formData.append('genre', genre);
        if (status) formData.append('status', status);

        const res = await apiClient.post<any>('/vendor/concerts/artists', formData);
        createdRaw = res?.data?.artist || res?.data || res?.artist || res;
      } else {
        // Option B: JSON payload with avatar URL or string
        const avatarUrl =
          typeof payload.avatar === 'string' && payload.avatar.trim()
            ? payload.avatar.trim()
            : undefined;

        const body: Record<string, any> = {
          name,
          email: email || undefined,
          phone: phone || undefined,
          avatar: avatarUrl,
          aboutus: aboutus || undefined,
          genre,
          status,
        };

        const res = await apiClient.post<any>('/vendor/concerts/artists', body);
        createdRaw = res?.data?.artist || res?.data || res?.artist || res;
      }

      if (createdRaw && (createdRaw.name || createdRaw.id || createdRaw._id)) {
        const newArtist = this.normalizeArtist(createdRaw);
        const cached = this.getStoredArtists();
        this.saveArtists([newArtist, ...cached]);
        return newArtist;
      }
    } catch (err) {
      // If server returned an application error message (e.g., validation), re-throw so UI displays it
      if (
        err instanceof Error &&
        !err.message.includes('Failed to fetch') &&
        !err.message.includes('NetworkError')
      ) {
        throw err;
      }
      console.warn('API create artist failed or offline, saving to local cache:', err);
    }

    // Fallback: create in local storage
    const newArtist: Artist = {
      ...(payload as Omit<Artist, 'id'>),
      id: `art-${Date.now().toString().slice(-4)}`,
      name,
      stageName: (payload as any).stageName || name,
      genre,
      subGenres: (payload as any).subGenres || [genre, 'Live Performance'],
      avatar:
        typeof payload.avatar === 'string' && payload.avatar
          ? payload.avatar
          : DEFAULT_AVATAR_IMAGE,
      bio: aboutus || (payload as any).bio || `${name} profile.`,
      country: (payload as any).country || 'India',
      city: (payload as any).city || 'Mumbai',
      status,
      verified: true,
      totalConcerts: 0,
      upcomingConcerts: 0,
      management: {
        email: email || undefined,
        phone: phone || undefined,
      },
      rider: (payload as any).rider || {},
    };

    const cached = this.getStoredArtists();
    this.saveArtists([newArtist, ...cached]);
    return newArtist;
  }

  /**
   * 4. UPDATE ARTIST
   * curl -X PATCH "http://192.168.0.161:5001/api/vendor/concerts/artists/:id"
   */
  public async updateArtist(
    id: string,
    updates: UpdateArtistPayload | Partial<Artist>,
    avatarFile?: File | null
  ): Promise<Artist> {
    try {
      let updatedRaw: any = null;

      if (avatarFile instanceof File) {
        const formData = new FormData();
        formData.append('avatar', avatarFile);
        if (updates.name) formData.append('name', updates.name);
        if (updates.status) formData.append('status', updates.status);
        if ((updates as any).isFeatured !== undefined) {
          formData.append('isFeatured', String((updates as any).isFeatured));
        }
        if ((updates as any).aboutus || (updates as any).bio) {
          formData.append('aboutus', (updates as any).aboutus || (updates as any).bio);
        }
        if (updates.genre) formData.append('genre', updates.genre);

        const res = await apiClient.patch<any>(
          `/vendor/concerts/artists/${encodeURIComponent(id)}`,
          formData
        );
        updatedRaw = res?.data?.artist || res?.data || res?.artist || res;
      } else {
        const body: Record<string, any> = { ...updates };
        if ((updates as any).bio && !body.aboutus) {
          body.aboutus = (updates as any).bio;
        }

        const res = await apiClient.patch<any>(
          `/vendor/concerts/artists/${encodeURIComponent(id)}`,
          body
        );
        updatedRaw = res?.data?.artist || res?.data || res?.artist || res;
      }

      if (updatedRaw && (updatedRaw.name || updatedRaw.id || updatedRaw._id)) {
        const updatedArtist = this.normalizeArtist(updatedRaw);
        const cached = this.getStoredArtists();
        const next = cached.map((a) => (a.id === id ? updatedArtist : a));
        this.saveArtists(next);
        return updatedArtist;
      }
    } catch (err) {
      if (
        err instanceof Error &&
        !err.message.includes('Failed to fetch') &&
        !err.message.includes('NetworkError')
      ) {
        throw err;
      }
      console.warn(`API update artist ${id} failed, applying to local cache:`, err);
    }

    // Fallback: update in local cache
    const cached = this.getStoredArtists();
    const index = cached.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new Error('Artist not found in roster.');
    }

    const updatedArtist: Artist = {
      ...cached[index],
      ...(updates as Partial<Artist>),
      bio: (updates as any).aboutus || (updates as any).bio || cached[index].bio,
    };

    cached[index] = updatedArtist;
    this.saveArtists(cached);
    return updatedArtist;
  }

  /**
   * 5. DELETE ARTIST
   * curl -X DELETE "http://192.168.0.161:5001/api/vendor/concerts/artists/:id"
   */
  public async deleteArtist(id: string): Promise<boolean> {
    try {
      await apiClient.delete<any>(`/vendor/concerts/artists/${encodeURIComponent(id)}`);
    } catch (err) {
      if (
        err instanceof Error &&
        !err.message.includes('Failed to fetch') &&
        !err.message.includes('NetworkError')
      ) {
        throw err;
      }
      console.warn(`API delete artist ${id} failed, removing from local cache:`, err);
    }

    const cached = this.getStoredArtists();
    const filtered = cached.filter((a) => a.id !== id);
    this.saveArtists(filtered);
    return true;
  }
}

export const vendorArtistService = new VendorArtistService();
