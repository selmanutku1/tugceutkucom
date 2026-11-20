import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useLanguage, type Language } from '../context/LanguageContext';
import { EXECUTIVE_EASE } from './MotionPrimitives';

function TurkeyFlag() {
  return (
    <svg
      viewBox="0 0 24 16"
      className="w-4 h-[11px] rounded-[2px] shrink-0 shadow-[0_0_0_0.5px_rgba(15,23,42,0.12)]"
      aria-hidden="true"
    >
      <rect width="24" height="16" fill="#E30A17" />
      <circle cx="9.6" cy="8" r="4" fill="#FFFFFF" />
      <circle cx="10.7" cy="8" r="3.2" fill="#E30A17" />
      <polygon
        fill="#FFFFFF"
        points="14.2,8 15.9,8.55 14.85,7.1 14.85,8.9 15.9,7.45"
        transform="rotate(-18 15 8)"
      />
    </svg>
  );
}

function UKFlag() {
  return (
    <svg
      viewBox="0 0 24 16"
      className="w-4 h-[11px] rounded-[2px] shrink-0 shadow-[0_0_0_0.5px_rgba(15,23,42,0.12)]"
      aria-hidden="true"
    >
      <rect width="24" height="16" fill="#012169" />
      <path d="M0,0 L24,16 M24,0 L0,16" stroke="#FFFFFF" strokeWidth="3.2" />
      <path d="M0,0 L24,16 M24,0 L0,16" stroke="#C8102E" strokeWidth="1.6" />
      <path d="M12,0 V16 M0,8 H24" stroke="#FFFFFF" strokeWidth="5.2" />
      <path d="M12,0 V16 M0,8 H24" stroke="#C8102E" strokeWidth="3" />
    </svg>
  );
}

const LANGUAGE_OPTIONS: { code: Language; short: string; label: string }[] = [
  { code: 'tr', short: 'TR', label: 'Türkçe' },
  { code: 'en', short: 'EN', label: 'English' },
];

interface LanguageSwitcherProps {
  compact?: boolean;
}

export default function LanguageSwitcher({ compact = false }: LanguageSwitcherProps) {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const currentOption =
    LANGUAGE_OPTIONS.find((item) => item.code === lang) || LANGUAGE_OPTIONS[0];

  useEffect(() => {
    if (!open) return;

    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const handleSelect = (code: Language) => {
    setLang(code);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={lang === 'tr' ? 'Dil seçimi' : 'Language selector'}
        className={`inline-flex items-center gap-1.5 rounded-lg border border-slate-200/90 bg-white/80 hover:bg-white hover:border-brand-teal/40 text-slate-800 font-semibold transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-brand-teal focus-visible:outline-offset-2 ${
          compact ? 'px-2.5 py-1.5 text-xs min-h-[36px]' : 'px-3 py-2 text-xs min-h-[38px]'
        }`}
      >
        {currentOption.code === 'tr' ? <TurkeyFlag /> : <UKFlag />}
        <span>{currentOption.short}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${
            open ? 'rotate-180 text-brand-teal' : ''
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            aria-label={lang === 'tr' ? 'Diller' : 'Languages'}
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.16, ease: EXECUTIVE_EASE }}
            className="absolute right-0 mt-2 w-40 rounded-xl border border-slate-200/90 bg-white/95 backdrop-blur-xl shadow-[0_16px_36px_-12px_rgba(1,34,83,0.18)] p-1.5 z-50"
          >
            {LANGUAGE_OPTIONS.map((option) => {
              const selected = option.code === lang;
              return (
                <button
                  key={option.code}
                  type="button"
                  role="menuitemradio"
                  aria-checked={selected}
                  onClick={() => handleSelect(option.code)}
                  className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    selected
                      ? 'bg-brand-teal-light/90 text-brand-navy font-semibold'
                      : 'text-slate-700 hover:bg-slate-100/80 hover:text-brand-navy'
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    {option.code === 'tr' ? <TurkeyFlag /> : <UKFlag />}
                    <span>{option.label}</span>
                  </span>
                  {selected && (
                    <Check className="w-3.5 h-3.5 text-brand-teal shrink-0" />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
