import { ArrowRight } from 'lucide-react';
import { SIMPLE_SERVICES } from '../data/consultingContent';

interface ServicesSectionProps {
  onOpenBookingWithService: (serviceName: string) => void;
}

export default function ServicesSection({
  onOpenBookingWithService,
}: ServicesSectionProps) {
  return (
    <section
      id="hizmetler"
      className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200/80"
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 space-y-12">
        {/* Section Header */}
        <div className="max-w-2xl space-y-3">
          <p className="text-sm font-medium text-blue-700">Hizmetler</p>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 [text-wrap:balance]">
            Acente ve brokerlar için sade, uygulanabilir destek
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Karmaşık terimler ve uzun projeler yerine; acente ve brokerların günlük işini kolaylaştıran, satış ve müşteri takibini güçlendiren dört temel alanda çalışıyoruz.
          </p>
        </div>

        {/* 4 Clean Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SIMPLE_SERVICES.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 flex flex-col justify-between gap-6"
            >
              <div className="space-y-4">
                <p className="text-sm font-semibold text-blue-700 tabular-nums">
                  {service.number}
                </p>

                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-slate-900 tracking-tight">
                    {service.title}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    {service.summary}
                  </p>
                </div>

                <ul className="space-y-2 pt-3 border-t border-slate-100 text-sm text-slate-700">
                  {service.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span
                        aria-hidden="true"
                        className="text-blue-700 font-semibold leading-6"
                      >
                        —
                      </span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onOpenBookingWithService(service.title)}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-800 cursor-pointer transition-colors"
                >
                  <span>Bu konuda görüşelim</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
