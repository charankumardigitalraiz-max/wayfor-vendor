import React, { useState, useRef } from 'react';
import { Upload, X, User, Mail, Phone, FileText, Sparkles } from 'lucide-react';
import { Modal } from './Modal';
import type { Artist } from '../../types';

export const ARTIST_CATEGORIES = [
  'Singing / Vocalist',
  'Standup Comedy',
  'Comedy & Improv',
  'DJ & Electronic',
  'Live Band / Rock',
  'Bollywood & Playback',
  'Pop Music',
  'Hip-Hop & Rap',
  'Classical & Instrumental',
  'Folk & Fusion',
  'Dance & Performance',
  'Theatre & Drama',
  'Magic & Illusion',
  'EDM',
  'Indie / Acoustic',
  'Other'
];

interface CreateArtistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddArtist: (artist: Omit<Artist, 'id'>, avatarFile?: File | null) => Promise<void> | void;
  onShowToast?: (message: string) => void;
}

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=600';

export const CreateArtistModal: React.FC<CreateArtistModalProps> = ({
  isOpen,
  onClose,
  onAddArtist,
  onShowToast
}) => {
  // Required fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState<string>('Singing / Vocalist');

  // Optional fields: email, phone, avatarFile, aboutus (textarea)
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [aboutUs, setAboutUs] = useState('');
  const [avatar, setAvatar] = useState<string>('');
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatar(result);
        setAvatarPreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setAvatar('');
    setAvatarPreview('');
    setAvatarFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isSubmitting) return;

    const trimmedName = name.trim();
    const finalAvatar = avatar || DEFAULT_AVATAR;

    const newArtistData: Omit<Artist, 'id'> & { aboutus?: string } = {
      name: trimmedName,
      stageName: trimmedName,
      genre: category || 'Singing / Vocalist',
      subGenres: [category || 'Singing / Vocalist', 'Live Performance'],
      bio: aboutUs.trim() || `${trimmedName} is an artist and performer.`,
      aboutus: aboutUs.trim() || `${trimmedName} is an artist and performer.`,
      avatar: finalAvatar,
      country: 'India',
      city: 'Mumbai',
      status: 'active',
      verified: true,
      totalConcerts: 0,
      upcomingConcerts: 0,
      management: {
        email: email.trim() || undefined,
        phone: phone.trim() || undefined
      }
    };

    try {
      setIsSubmitting(true);
      await onAddArtist(newArtistData, avatarFile);

      if (onShowToast) {
        onShowToast(`Artist "${trimmedName}" created successfully!`);
      }

      // Reset fields
      setName('');
      setCategory('Singing / Vocalist');
      setEmail('');
      setPhone('');
      setAboutUs('');
      setAvatar('');
      setAvatarPreview('');
      setAvatarFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      onClose();
    } catch (err) {
      console.error('Failed to submit artist:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Artist"
      subtitle="Add artist profile with category, contact details, photo, and bio"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Name & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-purple-600" />
              <span>Artist Name *</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Zakir Khan, Arijit Singh, Diljit Dosanjh"
              className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-purple-600" />
              <span>Category *</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-900 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-colors cursor-pointer"
            >
              {ARTIST_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Email (Optional) & Phone (Optional) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-purple-600" />
              <span>Email <span className="text-slate-400 font-normal">(Optional)</span></span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="artist@example.com"
              className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-purple-600" />
              <span>Phone <span className="text-slate-400 font-normal">(Optional)</span></span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-colors"
            />
          </div>
        </div>


        {/* About Us / Bio (Textarea) */}
        <div className="space-y-1.5">
          <label className="font-semibold text-slate-700 flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-purple-600" />
            <span>About Us / Bio <span className="text-slate-400 font-normal">(Optional)</span></span>
          </label>
          <textarea
            rows={4}
            value={aboutUs}
            onChange={(e) => setAboutUs(e.target.value)}
            placeholder="Write a brief description about the artist, style, accomplishments, or tour details..."
            className="w-full rounded-lg border border-slate-300 bg-white p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-colors resize-y"
          />
        </div>



        {/* Image Upload (Optional) */}
        <div className="space-y-1.5">
          <label className="font-semibold text-slate-700 flex items-center gap-1.5">
            <Upload className="h-3.5 w-3.5 text-purple-600" />
            <span>Profile Photo / Avatar <span className="text-slate-400 font-normal">(Optional)</span></span>
          </label>

          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />

          {avatarPreview ? (
            <div className="flex items-center gap-3 p-3 rounded-lg border border-purple-200 bg-purple-50/40">
              <img
                src={avatarPreview}
                alt="Artist Preview"
                className="h-16 w-16 rounded-lg object-cover border border-purple-200 shadow-sm"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-800 truncate">Photo selected</p>
                <p className="text-[11px] text-slate-500">Ready to upload with artist profile</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1.5 rounded-md text-xs font-medium text-purple-700 bg-white border border-purple-200 hover:bg-purple-50 transition-colors cursor-pointer"
                >
                  Change
                </button>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="p-1.5 rounded-md text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer"
                  title="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 hover:border-purple-400 bg-slate-50/50 hover:bg-purple-50/30 rounded-xl p-5 text-center cursor-pointer transition-all group"
            >
              <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-purple-100 text-purple-600 mb-2 group-hover:scale-105 transition-transform">
                <Upload className="h-5 w-5" />
              </div>
              <p className="text-xs font-semibold text-slate-700">Click to upload artist photo</p>
              <p className="text-[11px] text-slate-400 mt-0.5">PNG, JPG, WEBP up to 10MB</p>
            </div>
          )}
        </div>



        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 rounded-lg text-xs font-semibold bg-purple-600 text-white hover:bg-purple-700 shadow-sm shadow-purple-200 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            {isSubmitting ? (
              <>
                <span className="inline-block h-3 w-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                <span>Creating Artist...</span>
              </>
            ) : (
              'Create Artist'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
