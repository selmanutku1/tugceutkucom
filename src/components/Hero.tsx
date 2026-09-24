import { ArrowRight, CheckCircle2, Lock, Cpu, Sliders, Linkedin, GraduationCap, Building2, Bot } from 'lucide-react';
import { TUĞÇE_PROFILE } from '../data/consultingContent';
import ExecutivePortrait from './ExecutivePortrait';

interface HeroProps {
  onOpenBooking: () => void;
  onScrollTo: (id: string) => void;
}

export default function Hero({ onOpenBooking, onScrollTo }: HeroProps) {
  return (
    <section className="relative overflow-hidden pt-6 pb-12 sm:pt-12 sm:pb-20 lg:pt-14 lg:pb-24 bg-gradient-to-b from-white via-slate-50 to-slate-100 border-b border-slate-200">
      {/* Subtle tech background grid */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none" 
        style={{
          backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }} 
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Value Prop & CTAs */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-center sm:text-left">
            
            {/* Top Pill badge - Clear positioning */}
            <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-[11px] sm:text-xs font-semibold shadow-xs max-w-full">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse shrink-0"></span>
              <span className="truncate">B2B Stratejik Danışmanlık • AI, Teknoloji & InsurTech Mimarisi</span>
            </div>

            {/* Main Headline & Subtitle */}
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.2]">
                Dijital Sigortacılığın Geleceğini{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 block sm:inline">
                  Birlikte Tasarlıyoruz.
                </span>
              </h1>
              
              <p className="text-sm sm:text-lg text-slate-700 font-medium leading-relaxed max-w-2xl mx-auto sm:mx-0">
                Sigorta şirketleri, acenteler, brokerlar ve InsurTech girişimleri için dijital dönüşüm, yapay zekâ, teknoloji ve yeni nesil sigorta çözümleri.
              </p>
            </div>

            {/* 4 Core Value Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-1 text-left">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Sigorta süreçlerinde AI & Doküman Otomasyonu</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>“Acentenizi Dijitalleştirin” Uçtan Uca Çözüm</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>InsurTech, API & Gömülü Sigorta Mimarisi</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Yönetim Dashboard’u & Churn Analitiği</span>
              </div>
            </div>

            {/* CTAs (Mobile-First Layout: Stacked Full-Width on Mobile, Inline on Tablet/Desktop) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 pt-2">
              <button
                onClick={() => onScrollTo('acente-paketi')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm sm:text-base font-bold text-white bg-blue-700 hover:bg-blue-800 active:bg-blue-900 rounded-xl shadow-lg shadow-blue-700/25 transition-all cursor-pointer group"
              >
                <span>Acentenizi Dijitalleştirin</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onScrollTo('ana-hizmetler')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm sm:text-base font-semibold text-slate-800 bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-300 rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <span>6 Ana Hizmeti İncele</span>
              </button>

              <button
                onClick={onOpenBooking}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm sm:text-base font-semibold text-indigo-900 bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 border border-indigo-200 rounded-xl transition-all cursor-pointer"
              >
                <span>30 Dk Keşif Randevusu</span>
              </button>
            </div>

            {/* Footer Trust strip */}
            <div className="pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-center sm:justify-start gap-y-2 gap-x-4 sm:gap-x-6 text-[11px] sm:text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Kurumsal Bilgi Güvenliği & NDA</span>
              </div>
              <div className="flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Marmara Sigortacılık '18</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>AcerPro & InsurUp Ekosistemi</span>
              </div>
            </div>
          </div>

          {/* Right Column: Executive Card & Live Dashboard Preview */}
          <div className="lg:col-span-5">
            <div className="relative bg-white rounded-2xl p-5 sm:p-7 shadow-xl shadow-slate-200/80 border border-slate-200">
              
              {/* Executive Header with grounded Photo */}
              <div className="flex items-start justify-between gap-3 pb-4 sm:pb-5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <ExecutivePortrait size="md" showBadge={true} />
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                      {TUĞÇE_PROFILE.name}
                    </h3>
                    <p className="text-xs font-semibold text-blue-700">
                      {TUĞÇE_PROFILE.title}
                    </p>
                    <div className="flex flex-wrap items-center gap-1.5 mt-1.5 text-[10px] sm:text-[11px] text-slate-600">
                      <span className="flex items-center gap-1 text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        <GraduationCap className="w-3 h-3 text-blue-600" />
                        Marmara Sigortacılık
                      </span>
                      <span className="flex items-center gap-1 text-slate-700 font-medium bg-slate-100 px-2 py-0.5 rounded">
                        <Building2 className="w-3 h-3 text-slate-500" />
                        AcerPro & InsurUp
                      </span>
                    </div>
                  </div>
                </div>

                <a
                  href={TUĞÇE_PROFILE.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold flex items-center gap-1 transition-colors"
                  title="LinkedIn Profilini Görüntüle"
                >
                  <Linkedin className="w-4 h-4 text-blue-600" />
                  <span className="hidden sm:inline">LinkedIn</span>
                </a>
              </div>

              {/* Core Impact Metrics */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 py-4 sm:py-5 border-b border-slate-100">
                <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-lg sm:text-xl font-black text-slate-900">{TUĞÇE_PROFILE.digitalTransformationCount}</p>
                  <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 mt-0.5">Tamamlanan Dönüşüm</p>
                </div>
                <div className="p-2.5 sm:p-3 rounded-xl bg-blue-50/50 border border-blue-100">
                  <p className="text-lg sm:text-xl font-black text-blue-700">{TUĞÇE_PROFILE.aiUseCasesCount}</p>
                  <p className="text-[10px] sm:text-[11px] font-medium text-blue-800 mt-0.5">Sigorta AI Senaryosu</p>
                </div>
                <div className="p-2.5 sm:p-3 rounded-xl bg-indigo-50/50 border border-indigo-100">
                  <p className="text-lg sm:text-xl font-black text-indigo-700">{TUĞÇE_PROFILE.operationalEfficiencyGain}</p>
                  <p className="text-[10px] sm:text-[11px] font-medium text-indigo-800 mt-0.5">Operasyonel Hızlanma</p>
                </div>
                <div className="p-2.5 sm:p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
                  <p className="text-lg sm:text-xl font-black text-emerald-700">8+ Yıl</p>
                  <p className="text-[10px] sm:text-[11px] font-medium text-emerald-800 mt-0.5">InsurTech Deneyimi</p>
                </div>
              </div>

              {/* Live Interactive AI & Transformation Snapshot */}
              <div className="pt-3.5 sm:pt-4 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                  <span className="flex items-center gap-1.5">
                    <Bot className="w-3.5 h-3.5 text-indigo-600" />
                    Sigorta AI & Dijitalleşme Radarı
                  </span>
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-semibold border border-emerald-200">
                    Aktif Danışmanlık
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 text-slate-300 text-xs space-y-2 font-mono">
                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span className="truncate pr-2">// AI Hasar Evrakı OCR/NLP</span>
                    <span className="text-emerald-400 shrink-0">8x Hızlı</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span className="truncate pr-2">// Acente WhatsApp Yenileme</span>
                    <span className="text-blue-400 shrink-0">%93 Başarı</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span className="truncate pr-2">// Açık Sigortacılık (API)</span>
                    <span className="text-indigo-400 shrink-0">Aktif</span>
                  </div>
                </div>

                <button
                  onClick={() => onScrollTo('risk-analizi')}
                  className="w-full py-2.5 px-3 text-xs font-bold text-center text-blue-700 bg-blue-50 hover:bg-blue-100 active:bg-blue-200 rounded-lg transition-colors border border-blue-200 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Sliders className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Dijital Olgunluk Skorunu Hesaplayın →</span>
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
