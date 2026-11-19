import { ArrowRight } from 'lucide-react';
import { PROJECT_ITEMS } from '../data/siteContent';
import { useRouter } from '../context/RouterContext';

export default function ProjectsPage() {
  const { navigate } = useRouter();

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="py-14 sm:py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 space-y-4 text-center sm:text-left">
          <p className="text-sm font-medium text-blue-700">Projeler</p>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-[1.15] [text-wrap:balance]">
            Fikirlerin, stratejilerin ve teknolojinin buluştuğu projeler.
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto sm:mx-0">
            Farklı sektörlerde ve disiplinlerde yürütülen konu bazlı çalışmalar, teknoloji ve pazarlama arasındaki ilişkinin somut değer üretmesine katkı sağlıyor.
          </p>
        </div>
      </section>

      {/* Topic-Based Projects List */}
      <section className="py-14 sm:py-20 border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 space-y-8">
          {PROJECT_ITEMS.map((project) => (
            <article
              key={project.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 text-center sm:text-left"
            >
              <div className="lg:col-span-6 space-y-3">
                <p className="text-xs font-semibold text-blue-700 tabular-nums">
                  Çalışma Alanı {project.number}
                </p>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  {project.topicTitle}
                </h2>
                <p className="text-sm font-medium text-slate-500">
                  {project.tagline}
                </p>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed pt-1">
                  {project.detailDescription}
                </p>
              </div>

              <div className="lg:col-span-6 lg:border-l lg:border-slate-100 lg:pl-10 flex flex-col justify-between gap-6">
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Öne çıkan çalışma alanları
                  </p>
                  <ul className="space-y-2 text-sm sm:text-base text-slate-700">
                    {project.focusAreas.map((item) => (
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

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => navigate('/iletisim')}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-800 cursor-pointer"
                  >
                    <span>Benzer bir proje üzerine görüşelim</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
