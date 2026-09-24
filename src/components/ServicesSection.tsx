import { useState } from 'react';
import { CORE_6_SERVICES, ALL_8_SERVICES } from '../data/consultingContent';
import { ServiceItem } from '../types';
import { 
  Cpu, 
  Sparkles, 
  Layers, 
  LayoutTemplate, 
  BarChart3, 
  Rocket, 
  SlidersHorizontal, 
  Target, 
  CheckCircle2, 
  X,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface ServicesSectionProps {
  onOpenBookingWithService: (serviceName: string) => void;
}

export default function ServicesSection({ onOpenBookingWithService }: ServicesSectionProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'dijital-donusum' | 'yapay-zeka' | 'insurtech' | 'dijital-urunler' | 'operasyon' | 'veri-analitik' | 'pazarlama' | 'acente'>('all');
  const [activeModalService, setActiveModalService] = useState<ServiceItem | null>(null);

  const getCoreIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu':
        return <Cpu className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />;
      case 'Layers':
        return <Layers className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />;
      case 'LayoutTemplate':
        return <LayoutTemplate className="w-5 h-5 sm:w-6 sm:h-6 text-sky-600" />;
      case 'BarChart3':
        return <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />;
      case 'Rocket':
        return <Rocket className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />;
      default:
        return <Cpu className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />;
    }
  };

  const getDetailedIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-blue-600" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-purple-600" />;
      case 'Layers':
        return <Layers className="w-5 h-5 text-indigo-600" />;
      case 'LayoutTemplate':
        return <LayoutTemplate className="w-5 h-5 text-sky-600" />;
      case 'SlidersHorizontal':
        return <SlidersHorizontal className="w-5 h-5 text-teal-600" />;
      case 'BarChart3':
        return <BarChart3 className="w-5 h-5 text-amber-600" />;
      case 'Target':
        return <Target className="w-5 h-5 text-rose-600" />;
      case 'Rocket':
        return <Rocket className="w-5 h-5 text-emerald-600" />;
      default:
        return <ShieldCheck className="w-5 h-5 text-blue-600" />;
    }
  };

  const filteredServices = activeTab === 'all' 
    ? ALL_8_SERVICES 
    : ALL_8_SERVICES.filter(s => s.category === activeTab);

  return (
    <section id="ana-hizmetler" className="py-12 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14 sm:space-y-20">
        
        {/* ========================================================================= */}
        {/* 1. 6 ANA HİZMET ALANI */}
        {/* ========================================================================= */}
        <div className="space-y-8 sm:space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-2.5 sm:space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/70 border border-blue-200 text-blue-900 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
              <span>Stratejik Danışmanlık Çerçevesi</span>
            </div>
            
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              6 Temel Hizmet Alanı
            </h2>
            
            <p className="text-sm sm:text-lg text-slate-600">
              Sigortacılığın geleceğini şekillendiren; teknoloji, yapay zekâ, ürün ve operasyonel verimlilik odaklı temel danışmanlık sütunlarımız.
            </p>
          </div>

          {/* The 6 Core Service Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {CORE_6_SERVICES.map((core) => (
              <div 
                key={core.id}
                className="relative bg-white rounded-2xl p-5 sm:p-7 border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all duration-200 flex flex-col justify-between group"
              >
                <div className="space-y-3.5 sm:space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                      {getCoreIcon(core.icon)}
                    </div>
                    {core.badge && (
                      <span className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md border ${
                        core.id === 'yapay-zeka' 
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : core.id === 'acente-dijitallesmesi'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {core.badge}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                      {core.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1.5 sm:mt-2 leading-relaxed font-normal">
                      {core.summary}
                    </p>
                  </div>

                  {/* Bullet Highlights */}
                  <div className="space-y-1.5 sm:space-y-2 pt-2 border-t border-slate-100">
                    {core.keyBullets.map((bullet, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 sm:pt-6 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      const matched = ALL_8_SERVICES.find(s => s.id.includes(core.id));
                      if (matched) setActiveModalService(matched);
                    }}
                    className="text-xs font-bold text-blue-700 hover:text-blue-900 inline-flex items-center gap-1 cursor-pointer py-1"
                  >
                    <span>Detayları İncele</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onOpenBookingWithService(core.title)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-600 hover:text-white active:bg-blue-700 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Keşif Talebi
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>


        {/* ========================================================================= */}
        {/* 2. TÜM 8 DETAYLI HİZMET & ALT YETKİNLİK KATALOGU */}
        {/* ========================================================================= */}
        <div id="hizmetler" className="space-y-6 sm:space-y-8 pt-8 sm:pt-10 border-t border-slate-200">
          <div className="text-center max-w-3xl mx-auto space-y-2.5 sm:space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              Kapsamlı Danışmanlık Kataloğu
            </span>
            <h3 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              8 Detaylandırılmış Uzmanlık & Süreç Yönetimi
            </h3>
            <p className="text-xs sm:text-base text-slate-600">
              Yapay zekâ senaryolarından doküman analizine, InsurTech pazara çıkış stratejisinden acente CRM kurulumuna kadar kurumunuza özel alt yetkinlikler.
            </p>
          </div>

          {/* Filter Pills (Swipeable on Mobile) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center scrollbar-none">
            {[
              { id: 'all', label: 'Tüm 8 Hizmet' },
              { id: 'yapay-zeka', label: 'Yapay Zekâ (AI)', highlight: true },
              { id: 'acente', label: 'Acente Dijitalleşmesi', highlight: true },
              { id: 'insurtech', label: 'InsurTech & API' },
              { id: 'dijital-donusum', label: 'Dijital Dönüşüm' },
              { id: 'dijital-urunler', label: 'Dijital Ürün & UX' },
              { id: 'operasyon', label: 'Süreç & Operasyon' },
              { id: 'veri-analitik', label: 'Veri & Analitik' },
              { id: 'pazarlama', label: 'Pazarlama & Lead' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : tab.highlight
                    ? 'bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 8 Detailed Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition-all"
              >
                <div className="space-y-3.5 sm:space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                        {getDetailedIcon(service.icon)}
                      </div>
                      <div>
                        <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                          {service.title}
                        </h4>
                        <p className="text-xs font-medium text-blue-700">
                          {service.subtitle}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded shrink-0">
                      {service.timeline}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {service.summary}
                  </p>

                  {/* Sub Capabilities Checklist */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Kapsamdaki Temel Yetkinlikler:
                    </p>
                    <div className="grid grid-cols-1 gap-1.5">
                      {service.subCapabilities.slice(0, 4).map((cap, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="leading-snug">{cap}</span>
                        </div>
                      ))}
                      {service.subCapabilities.length > 4 && (
                        <p className="text-[11px] text-blue-600 font-semibold pl-5">
                          + {service.subCapabilities.length - 4} ilave yetkinlik daha...
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer CTAs */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setActiveModalService(service)}
                    className="text-xs font-bold text-slate-700 hover:text-blue-700 inline-flex items-center gap-1 cursor-pointer py-1"
                  >
                    <span>Tüm Maddeleri Gör</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onOpenBookingWithService(service.title)}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Danışmanlık Al
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Detail Modal for Full Service Scope (Optimized for Mobile) */}
      {activeModalService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-2xl rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-5 sm:space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  {getDetailedIcon(activeModalService.icon)}
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                    {activeModalService.title}
                  </h3>
                  <p className="text-xs text-blue-700 font-medium">
                    {activeModalService.subtitle}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveModalService(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Hizmet Tanımı & Kapsamı
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {activeModalService.summary}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Tüm Alt Yetkinlikler ve Süreç Aşamaları:
                </h4>
                <div className="space-y-2 bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-100">
                  {activeModalService.subCapabilities.map((cap, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-snug">{cap}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
                <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100">
                  <span className="font-bold text-blue-950 block">Tipik Süre:</span>
                  <span className="text-blue-800">{activeModalService.timeline}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-900 block">Hedef Kitle:</span>
                  <span className="text-slate-600">{activeModalService.targetAudience}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer CTAs */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-2.5">
              <button
                onClick={() => setActiveModalService(null)}
                className="w-full sm:w-auto px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl"
              >
                Kapat
              </button>
              <button
                onClick={() => {
                  const title = activeModalService.title;
                  setActiveModalService(null);
                  onOpenBookingWithService(title);
                }}
                className="w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl shadow-md cursor-pointer"
              >
                Bu Hizmet İçin Keşif Randevusu Al
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}
