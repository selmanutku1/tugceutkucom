import { ArrowRight } from 'lucide-react';
import { EXPERTISE_AREAS } from '../data/siteContent';
import { useRouter } from '../context/RouterContext';

export default function ExpertisePage() {
  const { navigate } = useRouter();

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="py-14 sm:py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 space-y-4 text-center sm:text-left">
          <p className="text-sm font-medium text-blue-700">
            Strateji · Teknoloji · Büyüme
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900">
            Uzmanlık Alanlarım
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto sm:mx-0">
            Uzmanlık alanlarımın merkezinde dijital büyüme, teknoloji ve stratejik düşünce yer alıyor. Farklı disiplinleri bir araya getirerek dijital ürünlerin ve iş modellerinin gelişimine bütünsel bir perspektifle yaklaşıyorum.
          </p>
        </div>
      </section>

      {/* 4 Domains Detailed */}
      <section className="py-14 sm:py-20 border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 space-y-8">
          {EXPERTISE_AREAS.map((area) => (
            <div
              key={area.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 text-center sm:text-left"
            >
              <div className="lg:col-span-5 space-y-3">
                <p className="text-sm font-semibold text-blue-700 tabular-nums">
                  {area.number}
                </p>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  {area.title}
                </h2>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {area.pageIntro}
                </p>
              </div>

              <div className="lg:col-span-7 lg:border-l lg:border-slate-100 lg:pl-10 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Çalışma alanları
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-sm sm:text-base text-slate-700">
                  {area.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex items-start justify-center sm:justify-start gap-2.5"
                    >
                      <span
                        aria-hidden="true"
                        className="hidden sm:inline text-blue-700 font-semibold"
                      >
                        —
                      </span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 sm:py-18 bg-slate-50">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center space-y-5">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Kurumunuzun önceliklerini birlikte değerlendirelim
          </h2>
          <p className="text-base text-slate-600 max-w-xl mx-auto">
            Dijital büyüme, ürün pazarlaması veya sigortacılık teknolojileri üzerine iş birliği ve danışmanlık görüşmesi için ulaşabilirsiniz.
          </p>
          <button
            type="button"
            onClick={() => navigate('/iletisim')}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold transition-colors cursor-pointer"
          >
            <span>İletişime Geçin</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
