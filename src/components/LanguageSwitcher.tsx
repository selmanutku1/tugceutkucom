import { useLanguage } from '../context/LanguageContext';

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

interface LanguageSwitcherProps {
  compact?: boolean;
}

export default function LanguageSwitcher({ compact = false }: LanguageSwitcherProps) {
  const { lang, setLang } = useLanguage();

  return (
    <div
      role="group"
      aria-label={lang === 'tr' ? 'Dil seçimi' : 'Language selector'}
      className="inline-flex items-center p-0.5 rounded-lg border border-slate-200 bg-slate-50 shrink-0"
    >
      <button
        type="button"
        onClick={() => setLang('tr')}
        aria-pressed={lang === 'tr'}
        title="Türkçe"
        className={`inline-flex items-center gap-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
          compact ? 'px-2 py-1 text-[11px]' : 'px-2.5 py-1.5 text-xs'
        } ${
          lang === 'tr'
            ? 'bg-white text-slate-900 shadow-xs'
            : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <TurkeyFlag />
        <span>TR</span>
      </button>

      <button
        type="button"
        onClick={() => setLang('en')}
        aria-pressed={lang === 'en'}
        title="English"
        className={`inline-flex items-center gap-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
          compact ? 'px-2 py-1 text-[11px]' : 'px-2.5 py-1.5 text-xs'
        } ${
          lang === 'en'
            ? 'bg-white text-slate-900 shadow-xs'
            : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <UKFlag />
        <span>EN</span>
      </button>
    </div>
  );
}
