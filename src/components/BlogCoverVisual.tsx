import { useEffect, useState } from 'react';
import transformationCover from '../assets/images/blog_cover_transformation_1795277561057.jpg';
import aiInsuranceCover from '../assets/images/blog_cover_ai_insurance_1795277562127.jpg';
import insurtechCrmCover from '../assets/images/blog_cover_insurtech_crm_1795277564004.jpg';
import growthCleanCover from '../assets/images/blog_cover_growth_clean_1795277581886.jpg';
import strategyCleanCover from '../assets/images/blog_cover_strategy_clean_1795277583363.jpg';
import cxDigitalCover from '../assets/images/blog_cover_cx_digital_1795277584069.jpg';
import processRedesignCover from '../assets/images/blog_cover_process_redesign_1795278310290.jpg';
import hybridTrustCover from '../assets/images/blog_cover_hybrid_trust_1795278309838.jpg';
import digitalAgencyCover from '../assets/images/blog_cover_digital_agency_1795278311004.jpg';
import decisionEngineCover from '../assets/images/blog_cover_decision_engine_1795278310251.jpg';
import saasFunnelCover from '../assets/images/blog_cover_saas_funnel_1795278310588.jpg';
import productPositioningCover from '../assets/images/blog_cover_product_positioning_1795278311179.jpg';
import { BlogPost } from '../types';

interface BlogCoverVisualProps {
  theme: BlogPost['coverTheme'];
  coverImage?: string;
  title: string;
  categoryLabel: string;
  slug?: string;
  variant?: 'card' | 'featured' | 'hero';
  className?: string;
}

const SLUG_ARTWORK_MAP: Record<string, string> = {
  'dijital-donusumun-merkezinde-teknoloji-ve-dogru-strateji-var': transformationCover,
  'yapay-zeka-sigortacilik-sektorunu-nasil-donusturuyor': aiInsuranceCover,
  'sigorta-sektorunde-crm-teknolojilerinin-stratejik-onemi': insurtechCrmCover,
  'dijitallesmek-ile-gercekten-donusmek-arasindaki-fark': processRedesignCover,
  'sigortacilikta-dijital-donusum-teknolojiden-daha-fazlasi': hybridTrustCover,
  'sigorta-acenteleri-icin-dijitallesmenin-yeni-donemi': digitalAgencyCover,
  'sigortacilikta-yapay-zeka-otomasyondan-akilli-karar-sistemlerine': decisionEngineCover,
  'yapay-zeka-caginda-musteri-deneyimi-nasil-degisiyor': cxDigitalCover,
  'b2b-pazarlamada-lead-sayisindan-daha-onemli-olan-nedir': growthCleanCover,
  'saas-urunlerinde-self-servis-satis-modeli-nasil-kurgulanir': saasFunnelCover,
  'pazarlama-ve-satis-ekipleri-neden-ayni-hedefe-odaklanmali': strategyCleanCover,
  'teknoloji-sirketlerinde-urun-pazarlamasinin-stratejik-rolu': productPositioningCover,
};

const THEME_ARTWORK_POOLS: Record<BlogPost['coverTheme'], string[]> = {
  photo: [transformationCover, cxDigitalCover, processRedesignCover],
  transformation: [processRedesignCover, transformationCover, productPositioningCover],
  insurtech: [insurtechCrmCover, hybridTrustCover, digitalAgencyCover],
  ai: [aiInsuranceCover, decisionEngineCover, cxDigitalCover],
  growth: [growthCleanCover, saasFunnelCover, productPositioningCover],
  strategy: [strategyCleanCover, productPositioningCover, transformationCover],
};

function hashText(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function resolveTopicArtwork(
  theme: BlogPost['coverTheme'],
  title: string,
  slug?: string
): string {
  if (slug && SLUG_ARTWORK_MAP[slug]) {
    return SLUG_ARTWORK_MAP[slug];
  }

  const lowerTitle = title.toLocaleLowerCase('tr');
  if (lowerTitle.includes('crm')) return insurtechCrmCover;
  if (lowerTitle.includes('acente') || lowerTitle.includes('agenc')) return digitalAgencyCover;
  if (lowerTitle.includes('karar') || lowerTitle.includes('decision')) return decisionEngineCover;
  if (lowerTitle.includes('saas') || lowerTitle.includes('self-servis') || lowerTitle.includes('self-service')) {
    return saasFunnelCover;
  }
  if (lowerTitle.includes('müşteri deneyimi') || lowerTitle.includes('customer experience')) {
    return cxDigitalCover;
  }
  if (lowerTitle.includes('ürün pazarlama') || lowerTitle.includes('product marketing')) {
    return productPositioningCover;
  }

  const pool = THEME_ARTWORK_POOLS[theme];
  const index = hashText(slug || title) % pool.length;
  return pool[index];
}

export default function BlogCoverVisual({
  theme,
  coverImage,
  title,
  categoryLabel,
  slug,
  variant = 'card',
  className = '',
}: BlogCoverVisualProps) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [coverImage, theme, slug]);

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

  const artworkSrc = resolveTopicArtwork(theme, title, slug);

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

  const logoHeightClass =
    variant === 'hero'
      ? 'h-7 sm:h-9'
      : variant === 'featured'
        ? 'h-6 sm:h-7'
        : 'h-5 sm:h-6';

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
        <img
          src="/assets/aistudio/IMG_8969_35f4cedb.png"
          alt="TU — Tuğçe Utku"
          className={`${logoHeightClass} w-auto object-contain brightness-0 invert opacity-90 shrink-0`}
        />
      </div>
    </div>
  );
}
