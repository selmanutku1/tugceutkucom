import { useState } from 'react';
import { FAQ_LIST } from '../data/consultingContent';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FaqSection() {
  const [openId, setOpenId] = useState<string | null>('f1');

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="sss" className="py-12 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5 sm:space-y-3 pb-8 sm:pb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Merak Edilenler
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Sıkça Sorulan Sorular
          </h2>
          <p className="text-xs sm:text-base text-slate-600">
            Dijital sigortacılık danışmanlığı, teknoloji mimarisi ve bağımsız çalışma prensipleri hakkında merak ettikleriniz.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-2.5 sm:space-y-3">
          {FAQ_LIST.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 overflow-hidden transition-all shadow-2xs"
              >
                <button
                  onClick={() => toggle(faq.id)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 sm:gap-4 cursor-pointer hover:bg-slate-50/80 active:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 shrink-0" />
                    <span className="text-xs sm:text-base font-bold text-slate-900 leading-snug">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 sm:w-5 sm:h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/40">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
