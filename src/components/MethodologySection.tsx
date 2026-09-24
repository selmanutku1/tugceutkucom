import { METHODOLOGY_STEPS } from '../data/consultingContent';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function MethodologySection() {
  return (
    <section id="metodoloji" className="py-12 sm:py-20 bg-slate-100/70 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2.5 sm:space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Çalışma Prensipleri
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            4 Aşamalı Bağımsız Danışmanlık Metodolojisi
          </h2>
          <p className="text-xs sm:text-base text-slate-600">
            Dijital olgunluk analizinden AI entegrasyonuna, API mimarisinden büyüme kurgularına kadar tüm süreç şeffaf, ölçülebilir ve sonuç odaklı adımlarla yürütülür.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-8 sm:pt-14">
          {METHODOLOGY_STEPS.map((step, idx) => (
            <div
              key={step.step}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm relative flex flex-col justify-between hover:border-blue-300 transition-all group"
            >
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 group-hover:text-blue-700 transition-colors">
                    {step.step}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {step.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {idx < METHODOLOGY_STEPS.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                  <div className="w-6 h-6 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-xs">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
