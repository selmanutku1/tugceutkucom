import { useEffect, useState } from 'react';
import transformationCover from '../assets/images/blog_cover_transformation_1795277561057.jpg';
import aiInsuranceCover from '../assets/images/blog_cover_ai_insurance_1795277562127.jpg';
import insurtechCrmCover from '../assets/images/blog_cover_insurtech_crm_1795277564004.jpg';
import growthCleanCover from '../assets/images/blog_cover_growth_clean_1795277581886.jpg';
import strategyCleanCover from '../assets/images/blog_cover_strategy_clean_1795277583363.jpg';
import cxDigitalCover from '../assets/images/blog_cover_cx_digital_1795277584069.jpg';
import { BlogPost } from '../types';

interface BlogCoverVisualProps {
  theme: BlogPost['coverTheme'];
  coverImage?: string;
  title: string;
  categoryLabel: string;
  variant?: 'card' | 'featured' | 'hero';
  className?: string;
}

function resolveTopicArtwork(
  theme: BlogPost['coverTheme'],
  title: string
): string {
  const lowerTitle = title.toLocaleLowerCase('tr');

  if (theme === 'photo') {
    if (
      lowerTitle.includes('müşteri deneyimi') ||
      lowerTitle.includes('customer experience')
    ) {
      return cxDigitalCover;
    }
    return transformationCover;
  }

  switch (theme) {
    case 'transformation':
      return transformationCover;
    case 'ai':
      return aiInsuranceCover;
    case 'insurtech':
      return insurtechCrmCover;
    case 'growth':
      return growthCleanCover;
    case 'strategy':
      return strategyCleanCover;
  }
}

export default function BlogCoverVisual({
  theme,
  coverImage,
  title,
  categoryLabel,
  variant = 'card',
  className = '',
}: BlogCoverVisualProps) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [coverImage, theme]);

  if (coverImage && !imgError) {
    return (
      <div
        className={`relative overflow-hidden bg-slate-900 aspect-[16/9] ${className}`}
      >
        <img
          src={coverImage}
          alt={title}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
    );
  }

  const artworkSrc = resolveTopicArtwork(theme, title);

  const paddingClass =
    variant === 'hero'
      ? 'p-5 sm:p-8 lg:p-10'
      : variant === 'featured'
        ? 'p-5 sm:p-7'
        : 'p-4 sm:p-5';

  const titleClass =
    variant === 'hero'
      ? 'text-lg sm:text-3xl lg:text-[34px] leading-[1.18] max-w-[78%]'
      : variant === 'featured'
        ? 'text-lg sm:text-2xl leading-[1.22] max-w-[78%] line-clamp-4'
        : 'text-[15px] sm:text-[17px] leading-[1.28] max-w-[76%] line-clamp-3';

  return (
    <div
      className={`relative overflow-hidden aspect-[16/9] bg-[#011536] ${paddingClass} flex flex-col justify-between ${className}`}
    >
      <img
        src={artworkSrc}
        alt={title}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
      />

      {/* Directional Deep Navy scrim for crisp typography contrast over topic artwork */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-[#01122E]/95 via-[#011536]/75 to-[#011536]/15"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-[#01122E]/80 via-transparent to-[#01122E]/30"
      />

      {/* Category Header */}
      <div className="relative z-10 flex items-center gap-2 max-w-[82%]">
        <span
          aria-hidden="true"
          className="w-1.5 h-1.5 rounded-full bg-[#6EE0E8] shrink-0"
        />
        <span className="text-[11px] sm:text-xs font-semibold tracking-wide text-[#8EE6EC] truncate">
          {categoryLabel}
        </span>
      </div>

      {/* Article Title Overlay */}
      <div className="relative z-10 my-auto py-2">
        <p
          className={`font-bold text-white tracking-tight [text-wrap:balance] drop-shadow-[0_2px_10px_rgba(1,18,46,0.65)] ${titleClass}`}
        >
          {title}
        </p>
      </div>

      {/* Subtle Brand Footer */}
      <div className="relative z-10 flex items-center justify-between gap-3 w-full pt-2 border-t border-white/15">
        <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.16em] text-white/80 uppercase">
          Tuğçe Utku
        </span>
        <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-[#8EE6EC]/85">
          TU
        </span>
      </div>
    </div>
  );
}
