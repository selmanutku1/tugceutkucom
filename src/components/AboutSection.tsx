import { TUĞÇE_PROFILE } from '../data/consultingContent';
import { Award, Linkedin, Mail, MapPin, ExternalLink, Building2, Sparkles, Laptop } from 'lucide-react';
import ExecutivePortrait from './ExecutivePortrait';

export default function AboutSection() {
  return (
    <section id="hakkimda" className="py-12 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm p-5 sm:p-10 space-y-6 sm:space-y-8">
          
          {/* Header & Portrait */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 pb-5 sm:pb-6 border-b border-slate-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
              <ExecutivePortrait size="lg" showBadge={true} />
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-0.5 rounded-full border border-blue-200/70">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  Sigorta CRM & InsurTech Danışmanı
                </span>
                <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                  {TUĞÇE_PROFILE.name}
                </h2>
                <p className="text-xs sm:text-base font-semibold text-blue-700">
                  {TUĞÇE_PROFILE.title}
                </p>
                <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] sm:text-xs">
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded border border-emerald-200">
                    <Laptop className="w-3.5 h-3.5 text-emerald-700" />
                    Bulut Sigorta CRM Mimarisi
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-blue-800 bg-blue-100/70 px-2 py-0.5 rounded border border-blue-200">
                    <Award className="w-3.5 h-3.5 text-blue-600" />
                    InsurTech & Dijital Büyüme
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Metrics (Mobile-Optimized) */}
            <div className="flex items-center gap-3 sm:gap-4 bg-slate-50 p-3 sm:p-3.5 rounded-2xl border border-slate-200/80 text-center w-full sm:w-auto justify-around sm:justify-start">
              <div>
                <div className="text-base sm:text-lg font-black text-slate-900">Bulut CRM</div>
                <div className="text-[10px] sm:text-[11px] font-medium text-slate-500">Mimarisi</div>
              </div>
              <div className="w-px h-6 sm:h-8 bg-slate-200"></div>
              <div>
                <div className="text-base sm:text-lg font-black text-blue-600">{TUĞÇE_PROFILE.digitalTransformationCount}</div>
                <div className="text-[10px] sm:text-[11px] font-medium text-slate-500">Dönüşüm</div>
              </div>
              <div className="w-px h-6 sm:h-8 bg-slate-200"></div>
              <div>
                <div className="text-base sm:text-lg font-black text-emerald-600">8+ Yıl</div>
                <div className="text-[10px] sm:text-[11px] font-medium text-slate-500">InsurTech</div>
              </div>
            </div>
          </div>

          {/* Bio Text */}
          <div className="space-y-2.5 sm:space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Hakkında & Dijital Büyüme Vizyonu
            </h3>
            <p className="text-xs sm:text-base text-slate-700 leading-relaxed font-normal">
              {TUĞÇE_PROFILE.bio}
            </p>
          </div>

          {/* CRM Platform Synergy Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-blue-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                Bulut Tabanlı Altyapı
              </span>
              <h4 className="text-base font-bold text-white">
                Sigorta CRM & Karşılaştırmalı Teklif Platformu
              </h4>
              <p className="text-xs text-slate-300 max-w-xl">
                Acentelerin tüm teklif, poliçe, hasar, çapraz satış ve mutabakat süreçlerini tek çatı altında toplayan yeni nesil bulut çözümü.
              </p>
            </div>
          </div>

          {/* Certifications and Licences */}
          <div className="space-y-2.5 pt-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Uzmanlık & Kariyer Yetkinlikleri:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
              {TUĞÇE_PROFILE.certifications.map((cert, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5 text-xs text-slate-800 font-medium shadow-2xs hover:bg-blue-50/50 hover:border-blue-200 transition-colors"
                >
                  <Award className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{cert}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Location & Quick Contact */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs text-slate-600 pt-4 sm:pt-6 border-t border-slate-100">
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-1.5 font-medium">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{TUĞÇE_PROFILE.location}</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate">{TUĞÇE_PROFILE.email}</span>
              </div>
            </div>

            <a
              href={TUĞÇE_PROFILE.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-1.5 text-blue-600 hover:text-blue-800 font-bold bg-blue-50 hover:bg-blue-100 active:bg-blue-200 px-3.5 py-2 rounded-xl border border-blue-200/60 transition-colors"
            >
              <Linkedin className="w-4 h-4 text-blue-600" />
              <span>linkedin.com/in/tugceutku</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}
