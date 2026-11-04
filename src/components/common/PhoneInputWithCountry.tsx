import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Search, Check, Globe } from 'lucide-react';
import { COUNTRIES, type Country } from '../../data/countries';

export { COUNTRIES, type Country };

interface PhoneInputWithCountryProps {
  value: string;
  onChange: (fullNumber: string, country: Country) => void;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
  defaultCountryCode?: string; // e.g. "IN"
}

export const PhoneInputWithCountry: React.FC<PhoneInputWithCountryProps> = ({
  value,
  onChange,
  required = false,
  placeholder = '98450 82910',
  disabled = false,
  id,
  className = '',
  defaultCountryCode = 'IN'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Parse initial country from value or default
  const [selectedCountry, setSelectedCountry] = useState<Country>(() => {
    if (value) {
      const trimmed = value.trim();
      const matched = COUNTRIES.find((c) => trimmed.startsWith(c.dialCode));
      if (matched) return matched;
    }
    const def = COUNTRIES.find((c) => c.code === defaultCountryCode);
    return def || COUNTRIES[0];
  });

  // Extract national phone number without country dial code
  const nationalNumber = useMemo(() => {
    if (!value) return '';
    const trimmed = value.trim();
    if (trimmed.startsWith(selectedCountry.dialCode)) {
      return trimmed.slice(selectedCountry.dialCode.length).trim();
    }
    return trimmed;
  }, [value, selectedCountry]);

  // Sync if value changes externally with a different country code
  useEffect(() => {
    if (value) {
      const trimmed = value.trim();
      const matched = COUNTRIES.find((c) => trimmed.startsWith(c.dialCode));
      if (matched && matched.code !== selectedCountry.code) {
        setSelectedCountry(matched);
      }
    }
  }, [value]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const filteredCountries = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.fullName && c.fullName.toLowerCase().includes(q)) ||
        c.dialCode.includes(q) ||
        c.code.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleSelectCountry = (country: Country) => {
    setSelectedCountry(country);
    setIsOpen(false);
    setSearchQuery('');
    const newFullNumber = nationalNumber ? `${country.dialCode} ${nationalNumber}` : `${country.dialCode} `;
    onChange(newFullNumber, country);
  };

  const handleNationalNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;

    // Check if user pasted a number with a country code (e.g. +1... or +44...)
    if (raw.startsWith('+')) {
      const matched = COUNTRIES.find((c) => raw.startsWith(c.dialCode));
      if (matched) {
        setSelectedCountry(matched);
        const rest = raw.slice(matched.dialCode.length).trim();
        onChange(`${matched.dialCode} ${rest}`, matched);
        return;
      }
    }

    const cleaned = raw.replace(/[^\d\s-]/g, '');
    const newFullNumber = cleaned ? `${selectedCountry.dialCode} ${cleaned}` : `${selectedCountry.dialCode} `;
    onChange(newFullNumber, selectedCountry);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="flex items-center rounded-lg border border-slate-300 bg-white transition-colors focus-within:border-purple-600 focus-within:ring-1 focus-within:ring-purple-600 overflow-visible shadow-2xs">
        {/* Country Selector Button */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className="group inline-flex items-center gap-2 pl-3 pr-2.5 py-2.5 hover:bg-slate-50 transition-colors cursor-pointer rounded-l-lg shrink-0 select-none"
          title={`Country: ${selectedCountry.name} (${selectedCountry.dialCode})`}
        >
          {/* Flag */}
          <span className="w-5 h-3.5 flex items-center justify-center overflow-hidden rounded-[2px] shrink-0 shadow-2xs border border-slate-200/80">
            <img
              src={selectedCountry.flagUrl}
              alt={selectedCountry.name}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = 'none';
                if (target.parentElement) {
                  target.parentElement.innerHTML = selectedCountry.flagEmoji;
                }
              }}
            />
          </span>

          {/* Clean Country Code */}
          <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
            {selectedCountry.dialCode}
          </span>

          <ChevronDown
            className={`h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-purple-600 group-hover:text-purple-600' : ''
            }`}
          />
        </button>

        {/* Subtle Divider */}
        <div className="h-5 w-px bg-slate-200 shrink-0 self-center" />

        {/* National Number Input Field */}
        <div className="relative flex-1">
          <input
            id={id}
            type="tel"
            required={required}
            disabled={disabled}
            value={nationalNumber}
            onChange={handleNationalNumberChange}
            placeholder={placeholder}
            className="w-full py-2.5 px-3 text-sm text-slate-900 placeholder:text-slate-400 placeholder:text-xs focus:outline-none bg-transparent"
          />
        </div>
      </div>

      {/* Floating Country Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-1.5 w-72 sm:w-84 bg-white rounded-xl border border-slate-200 shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Search Header */}
          <div className="p-2.5 border-b border-slate-100 bg-slate-50/70">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search country or code..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-colors"
              />
            </div>
          </div>

          {/* Scrollable List of All 250 Countries */}
          <div className="max-h-60 overflow-y-auto p-1.5 space-y-0.5 divide-y divide-slate-50">
            {filteredCountries.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No country found matching "{searchQuery}"
              </div>
            ) : (
              filteredCountries.map((c) => {
                const isSelected = c.code === selectedCountry.code;
                return (
                  <button
                    key={`${c.code}-${c.dialCode}`}
                    type="button"
                    onClick={() => handleSelectCountry(c)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors cursor-pointer text-left ${isSelected
                      ? 'bg-purple-50 text-purple-900 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                      }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Flag Image */}
                      <span className="w-5 h-3.5 flex items-center justify-center overflow-hidden rounded-[3px] shrink-0 shadow-2xs bg-slate-100 border border-slate-300/70">
                        <img
                          src={c.flagUrl}
                          alt={c.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.style.display = 'none';
                            if (target.parentElement) {
                              target.parentElement.innerHTML = c.flagEmoji;
                            }
                          }}
                        />
                      </span>
                      <span className="truncate" title={c.fullName || c.name}>
                        {c.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-xs font-medium ${isSelected ? 'text-purple-600' : 'text-slate-400'}`}>
                        {c.dialCode}
                      </span>
                      {isSelected && <Check className="h-3.5 w-3.5 text-purple-600 shrink-0" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
