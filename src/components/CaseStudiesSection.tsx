import { CASE_STUDIES } from '../data/consultingContent';

export default function CaseStudiesSection() {
  return (
    <section id="vakalar" className="py-12 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2.5 sm:space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
            Kanıtlanmış Başarılar
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Rakamlarla Gerçek Vaka Analizleri
          </h2>
          <p className="text-xs sm:text-base text-slate-600">
            Tuğçe Utku'nun bağımsız danışmanlığıyla hayata geçen somut dijital dönüşümler, operasyonel hızlanmalar ve büyüme metrikleri.
          </p>
        </div>

        {/* Case Studies Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 pt-8 sm:pt-14">
          {CASE_STUDIES.map((cs) => (
            <div
              key={cs.id}
              className="bg-slate-50 rounded-2xl border border-slate-200 p-5 sm:p-6 flex flex-col justify-between hover:shadow-md hover:bg-white transition-all"
            >
              <div className="space-y-3.5 sm:space-y-4">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200/50 inline-block">
                  {cs.clientType}
                </span>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {cs.title}
                </h3>

                <div className="space-y-2 text-xs text-slate-600">
                  <div>
                    <strong className="text-slate-800 block mb-0.5">Karşılaşılan Zorluk:</strong>
                    <p className="leading-relaxed">{cs.challenge}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-200/60">
                    <strong className="text-blue-800 block mb-0.5">Uygulanan Çözüm:</strong>
                    <p className="leading-relaxed">{cs.solution}</p>
                  </div>
                </div>
              </div>

              {/* Metrics highlight */}
              <div className="pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-slate-200">
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                  {cs.results.map((res, idx) => (
                    <div key={idx} className="p-2 sm:p-2.5 rounded-xl bg-white border border-slate-200 text-center">
                      <p className="text-xs sm:text-sm font-black text-blue-700">
                        {res.value}
                      </p>
                      <p className="text-[9px] sm:text-[10px] text-slate-500 font-medium mt-0.5 leading-tight">
                        {res.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
