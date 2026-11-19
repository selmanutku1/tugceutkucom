import { ArrowRight } from 'lucide-react';
import { getSiteContent } from '../data/siteContentEn';
import { useRouter } from '../context/RouterContext';
import { useLanguage } from '../context/LanguageContext';

export default function ExperiencePage() {
  const { navigate } = useRouter();
  const { lang } = useLanguage();
  const isEn = lang === 'en';
  const { experienceList } = getSiteContent(lang);

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="py-14 sm:py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 space-y-4 text-center sm:text-left">
          <p className="text-sm font-medium text-blue-700">
            {isEn ? 'Experience' : 'Deneyim'}
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-[1.15] [text-wrap:balance]">
            {isEn
              ? 'Experience gained across disciplines, united into a holistic leadership perspective.'
              : 'Farklı disiplinlerde kazanılan deneyim, bütünsel bir yönetim perspektifi.'}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto sm:mx-0">
            {isEn
              ? 'My professional experience has been shaped at the intersection of digital marketing, technology, product development, and business strategy.'
              : 'Profesyonel deneyimimi dijital pazarlama, teknoloji, ürün geliştirme süreçleri ve iş stratejilerinin kesişiminde şekillendirdim.'}
          </p>
        </div>
      </section>

      {/* Experience Blocks */}
      <section className="py-14 sm:py-20 border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 space-y-8">
          {experienceList.map((exp, idx) => (
            <div
              key={exp.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-9 space-y-5 text-center sm:text-left"
            >
              <div className="space-y-1.5 pb-5 border-b border-slate-100">
                <p className="text-xs font-semibold text-blue-700 tabular-nums">
                  0{idx + 1}
                </p>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {exp.organization}{' '}
                  <span className="text-slate-300 font-normal">|</span>{' '}
                  <span className="text-slate-700 font-semibold">{exp.roleArea}</span>
                </h2>
              </div>

              <p className="text-base text-slate-600 leading-relaxed">{exp.summary}</p>

              <div className="space-y-3 pt-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {exp.listTitle}
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm sm:text-base text-slate-700">
                  {exp.responsibilities.map((item) => (
                    <li
                      key={item}
                      className="flex items-start justify-center sm:justify-start gap-2.5"
                    >
                      <span
                        aria-hidden="true"
                        className="hidden sm:inline text-blue-700 font-semibold"
                      >
                        —
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Link */}
      <section className="py-14 sm:py-18 bg-slate-50">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              {isEn
                ? 'Initiatives where strategy turns into execution'
                : 'Stratejinin uygulamaya dönüştüğü çalışmalar'}
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              {isEn
                ? 'Explore topic-based initiatives and core scopes of work.'
                : 'Konu bazlı yürütülen projeleri ve çalışma kapsamlarını inceleyebilirsiniz.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/projeler')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <span>{isEn ? 'Explore Projects' : 'Projeleri İnceleyin'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
