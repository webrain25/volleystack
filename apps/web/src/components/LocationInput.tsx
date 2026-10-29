import { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2 } from 'lucide-react';

interface LocationInputProps {
  value: string;
  onChange?: (val: string) => void;
  placeholder?: string;
  className?: string;
  name?: string;
}

export function LocationInput({ value, onChange, placeholder = "Es. Palestra Via Roma", className, name }: LocationInputProps) {
  const [query, setQuery] = useState(value || '');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const skipSearchRef = useRef<boolean>(false);

  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query.length > 2 && !skipSearchRef.current) {
        setIsLoading(true);
        try {
          const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5&lat=41.9&lon=12.5`);
          const data = await res.json();
          if (data && data.features) {
            setSuggestions(data.features);
            setShowDropdown(true);
          }
        } catch (error) {
          console.error("Error fetching locations", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
      skipSearchRef.current = false;
    }, 400);

    return () => clearTimeout(searchTimeout);
  }, [query, value]);

  const formatSuggestion = (props: any) => {
    const parts = [];
    if (props.name) parts.push(props.name);
    if (props.street) {
      let street = props.street;
      if (props.housenumber) street += ` ${props.housenumber}`;
      parts.push(street);
    }
    if (props.city) parts.push(props.city);
    return parts.length > 0 ? parts.join(', ') : (props.name || props.city || query);
  };

  const handleSelect = (suggestion: any) => {
    const displayName = formatSuggestion(suggestion.properties);
    skipSearchRef.current = true;
    setQuery(displayName);
    if (onChange) onChange(displayName);
    setShowDropdown(false);
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div className="relative">
        <input
          type="text"
          name={name}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (onChange) onChange(e.target.value);
          }}
          onFocus={() => { if (suggestions.length > 0) setShowDropdown(true); }}
          placeholder={placeholder}
          className={className || "saas-input w-full"}
          autoComplete="off"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        )}
      </div>

      {showDropdown && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-surface border border-border/50 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto">
          {suggestions.map((s, idx) => (
            <div 
              key={idx} 
              onClick={() => handleSelect(s)}
              className="p-3 hover:bg-surface-hover cursor-pointer border-b border-border/20 last:border-0 flex items-start transition-colors"
            >
              <MapPin className="h-4 w-4 text-[#38BDF8] mt-0.5 shrink-0 mr-2" />
              <span className="text-xs text-text-primary line-clamp-2 leading-relaxed">
                {s.properties.name && <span className="font-semibold">{s.properties.name}</span>}
                {s.properties.name && (s.properties.street || s.properties.city) && ', '}
                {s.properties.street && <span>{s.properties.street} {s.properties.housenumber || ''}</span>}
                {s.properties.street && s.properties.city && ', '}
                {s.properties.city && <span>{s.properties.city}</span>}
                {!s.properties.name && !s.properties.street && !s.properties.city && s.properties.state}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
