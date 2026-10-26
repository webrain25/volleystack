import { useState, useRef, useEffect } from 'react';
import { Clock, Check, X } from 'lucide-react';

interface TimePickerProps {
  value?: string; // Format: "HH:mm"
  onChange?: (time: string) => void;
  name?: string;
  defaultValue?: string;
  className?: string;
  disabled?: boolean;
}

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];
const QUICK_PRESETS = ['18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'];

export function TimePicker({
  value,
  onChange,
  name,
  defaultValue = '20:00',
  className = '',
  disabled = false,
}: TimePickerProps) {
  const [internalTime, setInternalTime] = useState(value || defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hoursColRef = useRef<HTMLDivElement>(null);
  const minutesColRef = useRef<HTMLDivElement>(null);

  // Sync with controlled value if provided
  useEffect(() => {
    if (value !== undefined) {
      setInternalTime(value);
    }
  }, [value]);

  // Handle outside click to close
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  // Current selected hour & minute
  const [selectedHour, selectedMinute] = (internalTime || '20:00').split(':');

  const handleSelectTime = (newHour: string, newMinute: string, shouldClose = true) => {
    const formatted = `${newHour.padStart(2, '0')}:${newMinute.padStart(2, '0')}`;
    setInternalTime(formatted);
    onChange?.(formatted);
    if (shouldClose) {
      setIsOpen(false);
    }
  };

  const handleHourClick = (h: string) => {
    // Keep current minute, set new hour
    const formatted = `${h}:${selectedMinute || '00'}`;
    setInternalTime(formatted);
    onChange?.(formatted);
  };

  const handleMinuteClick = (m: string) => {
    // Set minute AND close automatically ("scompare subito dopo aver cliccato i minuti")
    handleSelectTime(selectedHour || '20', m, true);
  };

  const handlePresetClick = (preset: string) => {
    setInternalTime(preset);
    onChange?.(preset);
    setIsOpen(false); // Closes immediately on preset selection
  };

  return (
    <div ref={containerRef} className="relative inline-block w-full">
      {/* Hidden input for standard HTML form submissions */}
      {name && <input type="hidden" name={name} value={internalTime} />}

      {/* Visible input trigger */}
      <div
        onClick={() => {
          if (!disabled) setIsOpen(!isOpen);
        }}
        className={`saas-input flex items-center justify-between cursor-pointer select-none ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        } ${className}`}
      >
        <span className="font-medium text-text-primary">
          {internalTime || 'Seleziona ora'}
        </span>
        <Clock className="h-4 w-4 text-text-tertiary ml-2 shrink-0" />
      </div>

      {/* Floating Time Picker Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 w-72 bg-white dark:bg-[#18181b] border border-border dark:border-[#27272a] rounded-2xl shadow-2xl p-4 animate-in fade-in zoom-in-95">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-border/50 dark:border-white/10 mb-3">
            <span className="text-xs font-bold text-text-secondary dark:text-text-tertiary uppercase tracking-wider flex items-center">
              <Clock className="h-3.5 w-3.5 mr-1.5 text-brand-blue" /> Orario
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 text-text-tertiary hover:text-text-primary rounded-lg transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Quick Presets for Volley Trainings/Matches */}
          <div className="mb-3">
            <div className="text-[11px] font-semibold text-text-tertiary mb-1.5">Orari frequenti:</div>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handlePresetClick(preset)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
                    internalTime === preset
                      ? 'bg-brand-blue text-white shadow-sm'
                      : 'bg-surface hover:bg-surface-hover text-text-secondary hover:text-text-primary border border-border/40 dark:border-white/5'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Hours and Minutes Columns */}
          <div className="grid grid-cols-2 gap-2 text-center">
            {/* Hours Column */}
            <div>
              <div className="text-[11px] font-semibold text-text-tertiary uppercase mb-1">Ore</div>
              <div
                ref={hoursColRef}
                className="max-h-44 overflow-y-auto space-y-1 p-1 bg-surface/50 dark:bg-[#121214] rounded-xl border border-border/40 dark:border-white/5 scrollbar-thin"
              >
                {HOURS.map((h) => {
                  const isSelected = selectedHour === h;
                  return (
                    <button
                      key={h}
                      type="button"
                      onClick={() => handleHourClick(h)}
                      className={`w-full py-1.5 rounded-lg text-sm font-semibold transition-all ${
                        isSelected
                          ? 'bg-brand-blue text-white shadow-sm'
                          : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                      }`}
                    >
                      {h}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Minutes Column */}
            <div>
              <div className="text-[11px] font-semibold text-text-tertiary uppercase mb-1">Minuti</div>
              <div
                ref={minutesColRef}
                className="max-h-44 overflow-y-auto space-y-1 p-1 bg-surface/50 dark:bg-[#121214] rounded-xl border border-border/40 dark:border-white/5 scrollbar-thin"
              >
                {MINUTES.map((m) => {
                  const isSelected = selectedMinute === m;
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => handleMinuteClick(m)}
                      className={`w-full py-1.5 rounded-lg text-sm font-semibold transition-all ${
                        isSelected
                          ? 'bg-brand-blue text-white shadow-sm'
                          : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                      }`}
                    >
                      {m}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="flex items-center justify-between pt-3 mt-3 border-t border-border/50 dark:border-white/10">
            <span className="text-xs text-text-tertiary">
              Selezionato: <strong className="text-brand-blue dark:text-brand-blue-bright">{internalTime}</strong>
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="saas-btn-primary py-1 px-3 text-xs flex items-center shadow-none"
            >
              <Check className="h-3.5 w-3.5 mr-1" /> Fatto
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
