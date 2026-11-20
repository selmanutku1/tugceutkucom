import { ArrowRight } from 'lucide-react';
import { getSiteContent } from '../data/siteContentEn';
import { useRouter } from '../context/RouterContext';
import { useLanguage } from '../context/LanguageContext';
import { Reveal } from '../components/MotionPrimitives';

export default function ExpertisePage() {
  const { navigate } = useRouter();
  const { lang } = useLanguage();
  const isEn = lang === 'en';
  const { expertiseAreas } = getSiteContent(lang);

  return (
    <div>
      {/* Header */}
      <section className="py-14 sm:py-20 bg-white/45 backdrop-blur-[2px] border-b border-[#012253]/8">
        <Reveal immediate className="max-w-5xl mx-auto px-5 sm:px-8 space-y-4 text-center sm:text-left">
          <p className="text-sm font-medium text-brand-teal">
            {isEn ? 'Strategy · Technology · Growth' : 'Strateji · Teknoloji · Büyüme'}
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900">
            {isEn ? 'Areas of Expertise' : 'Uzmanlık Alanlarım'}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto sm:mx-0">
            {isEn
              ? 'Digital growth, technology, and strategic thinking sit at the center of my expertise. By bringing multiple disciplines together, I approach the growth of digital products and business models holistically.'
              : 'Uzmanlık alanlarımın merkezinde dijital büyüme, teknoloji ve stratejik düşünce yer alıyor. Farklı disiplinleri bir araya getirerek dijital ürünlerin ve iş modellerinin gelişimine bütünsel bir perspektifle yaklaşıyorum.'}
          </p>
        </Reveal>
      </section>

      {/* 4 Domains Detailed */}
      <section className="py-14 sm:py-20 border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 space-y-8">
          {expertiseAreas.map((area, idx) => (
            <Reveal
              key={area.id}
              immediate={idx === 0}
              delay={idx === 0 ? 0.14 : 0.05}
              direction={idx % 2 === 0 ? 'left' : 'right'}
              distance={32}
            >
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 text-center sm:text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_12px_28px_-14px_rgba(15,23,42,0.12)]">
                <div className="lg:col-span-5 space-y-3">
                  <p className="text-sm font-semibold text-brand-teal tabular-nums">
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
                    {isEn ? 'Focus areas' : 'Çalışma alanları'}
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-sm sm:text-base text-slate-700">
                    {area.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex items-start justify-center sm:justify-start gap-2.5"
                      >
                        <span
                          aria-hidden="true"
                          className="hidden sm:inline text-brand-teal font-semibold"
                        >
                          —
                        </span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 sm:py-18 bg-white/45 backdrop-blur-[2px]">
        <Reveal className="max-w-4xl mx-auto px-5 sm:px-8 text-center space-y-5">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            {isEn
              ? "Let's evaluate your organization's priorities together"
              : 'Kurumunuzun önceliklerini birlikte değerlendirelim'}
          </h2>
          <p className="text-base text-slate-600 max-w-xl mx-auto">
            {isEn
              ? 'Reach out to discuss consulting or collaboration on digital growth, product marketing, or insurance technologies.'
              : 'Dijital büyüme, ürün pazarlaması veya sigortacılık teknolojileri üzerine iş birliği ve danışmanlık görüşmesi için ulaşabilirsiniz.'}
          </p>
          <button
            type="button"
            onClick={() => navigate('/iletisim')}
            className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-navy hover:bg-brand-navy-hover text-white text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-[#012253]/15 cursor-pointer"
          >
            <span>{isEn ? 'Get in Touch' : 'İletişime Geçin'}</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </Reveal>
      </section>
    </div>
  );
}
