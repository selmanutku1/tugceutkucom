import { ArrowRight } from 'lucide-react';
import { TUĞÇE_PROFILE, IMPACT_HIGHLIGHTS } from '../data/consultingContent';
import ExecutivePortrait from './ExecutivePortrait';

interface HeroProps {
  onOpenBooking: () => void;
  onScrollTo: (id: string) => void;
}

export default function Hero({ onOpenBooking, onScrollTo }: HeroProps) {
  return (
    <section className="bg-white border-b border-slate-200/80">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-12 pb-16 sm:pt-16 sm:pb-20">
        {/* Main 2-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Headline, Plain Value Prop & Single Primary CTA */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-[1.15] [text-wrap:balance]">
              Dijital Sigortacılık ve <br className="hidden sm:inline" />
              <span className="text-blue-700">
                Sigorta CRM Teknolojileri Danışmanlığı
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              Sigorta acentelerinin ve brokerların müşteri takibini düzenlemesine, teklif ve yenileme süreçlerini hızlandırmasına ve dijital kanallardan güvenle büyümesine sade, anlaşılır çözümlerle destek oluyorum.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onOpenBooking}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm sm:text-base font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>Ücretsiz Ön Görüşme Planla</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onScrollTo('hizmetler')}
                className="inline-flex items-center justify-center px-6 py-3 text-sm sm:text-base font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
              >
                Hizmetleri İncele
              </button>
            </div>
          </div>

          {/* Right Column: Compact Executive Card */}
          <div className="lg:col-span-5">
            <div className="bg-slate-50 rounded-2xl p-6 sm:p-7 border border-slate-200/90 space-y-6">
              <div className="flex items-center gap-4">
                <ExecutivePortrait size="md" />
                <div className="min-w-0 space-y-1">
                  <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
                    {TUĞÇE_PROFILE.name}
                  </h2>
                  <p className="text-sm text-slate-600 leading-snug">
                    Sigorta CRM &amp; Dijital Büyüme Danışmanı
                  </p>
                  <a
                    href={TUĞÇE_PROFILE.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block text-xs font-semibold text-blue-700 hover:text-blue-800 hover:underline pt-0.5"
                  >
                    LinkedIn Profili →
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-5 border-t border-slate-200/80">
                {IMPACT_HIGHLIGHTS.map((item) => (
                  <div key={item.label} className="space-y-0.5">
                    <p className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
                      {item.value}
                    </p>
                    <p className="text-xs font-medium text-slate-500">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
