import { 
  Users, 
  Sliders, 
  TrendingUp, 
  BellRing, 
  ShieldAlert, 
  FileSpreadsheet, 
  Layers, 
  BarChart3, 
  Calendar, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Laptop 
} from 'lucide-react';
import { INSURUP_ECOSYSTEM } from '../data/consultingContent';

interface InsurupEcosystemSectionProps {
  onOpenBookingWithTopic: (topic: string) => void;
}

export default function InsurupEcosystemSection({ onOpenBookingWithTopic }: InsurupEcosystemSectionProps) {
  const getModuleIcon = (iconName: string) => {
    switch (iconName) {
      case 'Users':
        return <Users className="w-5 h-5 text-blue-600" />;
      case 'Sliders':
        return <Sliders className="w-5 h-5 text-indigo-600" />;
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5 text-emerald-600" />;
      case 'BellRing':
        return <BellRing className="w-5 h-5 text-amber-600" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-5 h-5 text-rose-600" />;
      case 'FileSpreadsheet':
        return <FileSpreadsheet className="w-5 h-5 text-teal-600" />;
      case 'Layers':
        return <Layers className="w-5 h-5 text-purple-600" />;
      case 'BarChart3':
        return <BarChart3 className="w-5 h-5 text-sky-600" />;
      default:
        return <Laptop className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <section id="insurup-teknolojisi" className="py-12 sm:py-20 bg-slate-900 text-white relative overflow-hidden border-b border-slate-800">
      
      {/* Background glow effects */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-blue-900/60 border border-blue-500/40 text-blue-300 text-[11px] sm:text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span>{INSURUP_ECOSYSTEM.badge}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Bulut Sigorta CRM & <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">
              Yeni Nesil Dijital Büyüme Stratejisi
            </span>
          </h2>

          <p className="text-xs sm:text-base text-slate-300 leading-relaxed font-normal">
            Türkiye'nin öncü bulut tabanlı <strong>Sigorta CRM ve Online Satış Platformu</strong>nu; acentenize özel dijital pazarlama, yapay zekâ ve büyüme stratejisiyle birleştiriyoruz.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs">
            <button
              onClick={() => onOpenBookingWithTopic('Bulut Sigorta CRM & Online Satış Demosu')}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/30 transition-all cursor-pointer text-xs sm:text-sm"
            >
              <Calendar className="w-4 h-4" />
              <span>Öncelikli CRM Demosu Talep Et</span>
            </button>
          </div>
        </div>

        {/* 3 Pillars of Synergy */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {INSURUP_ECOSYSTEM.synergyPillars.map((pillar, idx) => (
            <div 
              key={idx}
              className="p-5 sm:p-6 rounded-2xl bg-slate-800/60 border border-slate-700/70 space-y-2 hover:border-slate-600 transition-all"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-950/80 border border-blue-800/50 flex items-center justify-center text-blue-400 font-bold text-xs">
                0{idx + 1}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white pt-1">
                {pillar.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>

        {/* CRM 8 Core Modules Grid */}
        <div className="space-y-6 sm:space-y-8 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Bulut Tabanlı Modüler Altyapı
              </span>
              <h3 className="text-xl sm:text-3xl font-extrabold text-white mt-1">
                Sigorta CRM Platformunun 8 Temel Modülü
              </h3>
            </div>
            <p className="text-xs text-slate-400 max-w-sm">
              Kurulum gerektirmeyen, herhangi bir cihazdan anında erişilen ve sigortacılığa %100 özel geliştirilmiş modüller.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {INSURUP_ECOSYSTEM.coreModules.map((mod) => (
              <div
                key={mod.id}
                className="bg-slate-800/40 rounded-2xl p-5 border border-slate-700/60 hover:border-blue-500/80 hover:bg-slate-800/80 transition-all duration-200 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-slate-900/90 border border-slate-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                      {getModuleIcon(mod.icon)}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-800/60">
                      {mod.badge}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-blue-300 transition-colors leading-snug">
                      {mod.title}
                    </h4>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed font-normal">
                      {mod.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-700/50 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">CRM Modülü</span>
                  <button
                    onClick={() => onOpenBookingWithTopic(`Sigorta CRM: ${mod.title}`)}
                    className="text-xs font-bold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>Bilgi Al</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CRM Fast Demo Callout */}
        <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-blue-900/70 via-indigo-900/60 to-slate-900 p-6 sm:p-10 border border-blue-700/40 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-700/60">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Acentenizi Dijitalleştirin</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Sigorta CRM ve Online Satış Altyapısını Canlı İnceleyin
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Acentenizin portföy yapısına özel Bulut CRM demosunu ve dijital büyüme yol haritasını birlikte planlayın.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
            <button
              onClick={() => onOpenBookingWithTopic('Sigorta CRM & Online Teklif Demo Talebi')}
              className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all text-center"
            >
              <Calendar className="w-4 h-4" />
              <span>30 Dk Ücretsiz Demo & Strateji</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
