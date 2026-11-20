import { ArrowRight } from 'lucide-react';
import { getSiteContent } from '../data/siteContentEn';
import { useRouter } from '../context/RouterContext';
import { useLanguage } from '../context/LanguageContext';
import { Reveal } from '../components/MotionPrimitives';

export default function ProjectsPage() {
  const { navigate } = useRouter();
  const { lang } = useLanguage();
  const isEn = lang === 'en';
  const { projectItems } = getSiteContent(lang);

  return (
    <div>
      {/* Header */}
      <section className="py-14 sm:py-20 bg-white/45 backdrop-blur-[2px] border-b border-[#012253]/8">
        <Reveal immediate className="max-w-5xl mx-auto px-5 sm:px-8 space-y-4 text-center sm:text-left">
          <p className="text-sm font-medium text-brand-teal">
            {isEn ? 'Projects' : 'Projeler'}
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-[1.15] [text-wrap:balance]">
            {isEn
              ? 'Projects where ideas, strategy, and technology converge.'
              : 'Fikirlerin, stratejilerin ve teknolojinin buluştuğu projeler.'}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto sm:mx-0">
            {isEn
              ? 'Topic-based initiatives across sectors and disciplines turn the relationship between technology and marketing into tangible business value.'
              : 'Farklı sektörlerde ve disiplinlerde yürütülen konu bazlı çalışmalar, teknoloji ve pazarlama arasındaki ilişkinin somut değer üretmesine katkı sağlıyor.'}
          </p>
        </Reveal>
      </section>

      {/* Topic-Based Projects List */}
      <section className="py-14 sm:py-20 border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 space-y-8">
          {projectItems.map((project, idx) => (
            <Reveal
              key={project.id}
              immediate={idx === 0}
              delay={idx === 0 ? 0.14 : 0.05}
              direction={idx % 2 === 0 ? 'left' : 'right'}
              distance={32}
            >
              <article className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 text-center sm:text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_12px_28px_-14px_rgba(15,23,42,0.12)]">
                <div className="lg:col-span-6 space-y-3">
                  <p className="text-xs font-semibold text-brand-teal tabular-nums">
                    {isEn ? `Focus Area ${project.number}` : `Çalışma Alanı ${project.number}`}
                  </p>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    {project.topicTitle}
                  </h2>
                  <p className="text-sm font-medium text-slate-500">{project.tagline}</p>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed pt-1">
                    {project.detailDescription}
                  </p>
                </div>

                <div className="lg:col-span-6 lg:border-l lg:border-slate-100 lg:pl-10 flex flex-col justify-between gap-6">
                  <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      {isEn ? 'Key focus areas' : 'Öne çıkan çalışma alanları'}
                    </p>
                    <ul className="space-y-2 text-sm sm:text-base text-slate-700">
                      {project.focusAreas.map((item) => (
                        <li
                          key={item}
                          className="flex items-start justify-center sm:justify-start gap-2.5"
                        >
                          <span
                            aria-hidden="true"
                            className="hidden sm:inline text-brand-teal font-semibold"
                          >
                            —
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => navigate('/iletisim')}
                      className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand-teal hover:text-brand-teal-hover cursor-pointer"
                    >
                      <span>
                        {isEn
                          ? 'Discuss a similar initiative'
                          : 'Benzer bir proje üzerine görüşelim'}
                      </span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
