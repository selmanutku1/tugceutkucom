import { useState } from 'react';
import aiStrategyPhoto from '../assets/images/blog_ai_strategy_1795090718952.jpg';
import { BlogPost } from '../types';

interface BlogCoverVisualProps {
  theme: BlogPost['coverTheme'];
  title: string;
  categoryLabel: string;
  className?: string;
}

export default function BlogCoverVisual({
  theme,
  title,
  categoryLabel,
  className = '',
}: BlogCoverVisualProps) {
  const [imgError, setImgError] = useState(false);

  if (theme === 'photo' && !imgError) {
    return (
      <div
        className={`relative overflow-hidden bg-slate-900 aspect-[16/9] ${className}`}
      >
        <img
          src={aiStrategyPhoto}
          alt={title}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
    );
  }

  const palette = {
    photo: {
      bg: 'from-slate-900 via-slate-800 to-blue-950',
      stroke: '#93c5fd',
      accent: '#3b82f6',
      text: 'text-blue-200',
    },
    transformation: {
      bg: 'from-slate-900 via-blue-950 to-slate-900',
      stroke: '#93c5fd',
      accent: '#60a5fa',
      text: 'text-blue-200',
    },
    insurtech: {
      bg: 'from-slate-900 via-slate-800 to-cyan-950',
      stroke: '#67e8f9',
      accent: '#0e7490',
      text: 'text-cyan-200',
    },
    ai: {
      bg: 'from-slate-950 via-indigo-950 to-slate-900',
      stroke: '#a5b4fc',
      accent: '#4f46e5',
      text: 'text-indigo-200',
    },
    growth: {
      bg: 'from-slate-900 via-slate-800 to-slate-950',
      stroke: '#cbd5e1',
      accent: '#2563eb',
      text: 'text-slate-300',
    },
    strategy: {
      bg: 'from-slate-950 via-slate-900 to-blue-950',
      stroke: '#93c5fd',
      accent: '#1d4ed8',
      text: 'text-blue-200',
    },
  }[theme];

  return (
    <div
      className={`relative overflow-hidden aspect-[16/9] bg-gradient-to-br ${palette.bg} flex items-end p-5 sm:p-6 ${className}`}
    >
      {/* Architectural minimalist geometric pattern */}
      <svg
        viewBox="0 0 640 360"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="absolute inset-0 w-full h-full opacity-35 transition-transform duration-500 group-hover:scale-[1.03]"
      >
        <defs>
          <pattern
            id={`grid-${theme}`}
            width="48"
            height="48"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 48 0 L 0 0 0 48"
              stroke={palette.stroke}
              strokeOpacity="0.22"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="640" height="360" fill={`url(#grid-${theme})`} />
        <circle
          cx="510"
          cy="86"
          r="138"
          stroke={palette.stroke}
          strokeOpacity="0.35"
          strokeWidth="1.25"
        />
        <circle
          cx="510"
          cy="86"
          r="84"
          stroke={palette.accent}
          strokeOpacity="0.55"
          strokeWidth="1.5"
        />
        <path
          d="M 0 265 C 180 185, 340 295, 640 165"
          stroke={palette.stroke}
          strokeOpacity="0.55"
          strokeWidth="1.5"
        />
      </svg>

      <div className="relative z-10 flex items-center justify-between w-full gap-4">
        <span className={`text-xs font-medium tracking-wide ${palette.text}`}>
          {categoryLabel}
        </span>
        <span className="text-[11px] font-semibold tracking-wider text-white/40 uppercase">
          TU
        </span>
      </div>
    </div>
  );
}
