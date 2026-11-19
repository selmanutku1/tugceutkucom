import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQ_LIST } from '../data/consultingContent';

export default function FaqSection() {
  const [openId, setOpenId] = useState<string | null>('f1');

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section
      id="sss"
      className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200/80"
    >
      <div className="max-w-3xl mx-auto px-5 sm:px-8 space-y-10">
        <div className="space-y-3">
          <p className="text-sm font-medium text-blue-700">Sık Sorulanlar</p>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Merak edilen sorular
          </h2>
        </div>

        <div className="divide-y divide-slate-200 border-t border-b border-slate-200">
          {FAQ_LIST.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div key={faq.id}>
                <button
                  type="button"
                  onClick={() => toggle(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full py-5 text-left flex items-center justify-between gap-4 cursor-pointer group"
                >
                  <span className="text-base font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-blue-700' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="pb-5 pr-8 text-sm sm:text-base text-slate-600 leading-relaxed">
                    {faq.answer}
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
