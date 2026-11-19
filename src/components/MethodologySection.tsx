import { PROCESS_STEPS } from '../data/consultingContent';

export default function MethodologySection() {
  return (
    <section
      id="surec"
      className="py-16 sm:py-24 bg-white border-b border-slate-200/80"
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 space-y-12">
        {/* Header */}
        <div className="max-w-2xl space-y-3">
          <p className="text-sm font-medium text-blue-700">Nasıl Çalışırız?</p>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 [text-wrap:balance]">
            Üç adımda düzenli ve ölçülebilir bir geçiş
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Günlük iş akışınızı aksatmadan, her adımı birlikte planlayarak ilerliyoruz.
          </p>
        </div>

        {/* 3 Clean Editorial Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-2">
          {PROCESS_STEPS.map((item) => (
            <div
              key={item.step}
              className="pt-6 border-t border-slate-200 space-y-3"
            >
              <span className="text-sm font-semibold text-blue-700 tabular-nums">
                {item.step}
              </span>
              <h3 className="text-lg font-semibold text-slate-900">
                {item.title}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
