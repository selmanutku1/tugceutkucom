import { useEffect, useState } from 'react';
import {
  ArrowRight,
  Check,
  ChevronDown,
  Compass,
  Cpu,
  Link2,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';
import { getSiteContent } from '../data/siteContentEn';
import { FaqCategory } from '../types';
import { useRouter } from '../context/RouterContext';
import { useLanguage } from '../context/LanguageContext';

function CategoryIcon({ icon }: { icon: FaqCategory['icon'] }) {
  const iconClass = 'w-5 h-5 text-blue-700';
  switch (icon) {
    case 'compass':
      return <Compass className={iconClass} />;
    case 'shield':
      return <ShieldCheck className={iconClass} />;
    case 'cpu':
      return <Cpu className={iconClass} />;
    case 'message':
      return <MessageSquare className={iconClass} />;
  }
}

export default function FaqPage() {
  const { hash, navigate } = useRouter();
  const { lang } = useLanguage();
  const isEn = lang === 'en';
  const { faqCategories } = getSiteContent(lang);

  // First category open by default
  const [openCategories, setOpenCategories] = useState<string[]>([faqCategories[0].id]);
  const [openQuestions, setOpenQuestions] = useState<string[]>([
    faqCategories[0].questions[0].id,
  ]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const origin =
      typeof window !== 'undefined' ? window.location.origin : 'https://tugceutku.com';

    const breadcrumbLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: isEn ? 'Home' : 'Ana Sayfa',
          item: origin,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: isEn ? 'Frequently Asked Questions' : 'Sıkça Sorulan Sorular',
          item: `${origin}/sss`,
        },
      ],
    };

    const existing = document.getElementById('faq-breadcrumb-jsonld');
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'faq-breadcrumb-jsonld';
    script.textContent = JSON.stringify(breadcrumbLd);
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById('faq-breadcrumb-jsonld');
      if (el) el.remove();
    };
  }, [isEn]);

  useEffect(() => {
    if (!hash) return;
    const targetId = hash.replace(/^#/, '');
    if (!targetId) return;

    const matchedCategory = faqCategories.find((cat) => cat.id === targetId);
    if (matchedCategory) {
      setOpenCategories((prev) =>
        prev.includes(matchedCategory.id) ? prev : [...prev, matchedCategory.id]
      );
      window.setTimeout(() => {
        const el = document.getElementById(matchedCategory.id);
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 120);
      return;
    }

    for (const category of faqCategories) {
      const matchedQuestion = category.questions.find((q) => q.id === targetId);
      if (matchedQuestion) {
        setOpenCategories((prev) =>
          prev.includes(category.id) ? prev : [...prev, category.id]
        );
        setOpenQuestions((prev) =>
          prev.includes(matchedQuestion.id) ? prev : [...prev, matchedQuestion.id]
        );
        window.setTimeout(() => {
          const el = document.getElementById(matchedQuestion.id);
          el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 140);
        break;
      }
    }
  }, [hash, faqCategories]);

  const toggleCategory = (categoryId: string) => {
    setOpenCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleQuestion = (questionId: string) => {
    setOpenQuestions((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    );
  };

  const handleCopyQuestionLink = async (questionId: string) => {
    const origin =
      typeof window !== 'undefined' ? window.location.origin : 'https://tugceutku.com';
    const url = `${origin}/sss#${questionId}`;

    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `/sss#${questionId}`);
    }

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      }
    } catch {
      // Clipboard fallback
    }

    setCopiedId(questionId);
    window.setTimeout(() => {
      setCopiedId((current) => (current === questionId ? null : current));
    }, 2200);
  };

  const handleQuickJumpCategory = (categoryId: string) => {
    setOpenCategories((prev) =>
      prev.includes(categoryId) ? prev : [...prev, categoryId]
    );
    window.setTimeout(() => {
      const el = document.getElementById(categoryId);
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  return (
    <div className="bg-white">
      {/* Page Header */}
      <section className="border-b border-slate-200/80 bg-white">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 pt-12 pb-12 sm:pt-16 sm:pb-14">
          <div className="max-w-3xl mx-auto sm:mx-0 text-center sm:text-left space-y-4">
            <p className="text-sm font-medium text-blue-700">
              {isEn ? 'Frequently Asked Questions' : 'Sıkça Sorulan Sorular'}
            </p>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-[1.14] [text-wrap:balance]">
              {isEn ? 'Key Questions' : 'Merak Edilenler'}
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              {isEn
                ? 'Explore answers to frequently asked questions about my focus areas, consulting approach, insurance technologies, and professional collaborations by category.'
                : 'Çalışma alanlarım, danışmanlık yaklaşımım, sigortacılık teknolojileri ve profesyonel iş birlikleri hakkında sıkça sorulan soruların yanıtlarını kategorilere göre inceleyebilirsiniz.'}
            </p>
          </div>

          {/* Quick Category Navigation */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {faqCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => handleQuickJumpCategory(category.id)}
                className="min-h-[56px] p-3.5 rounded-xl border border-slate-200 hover:border-blue-300 bg-slate-50 hover:bg-blue-50/40 transition-colors flex items-center gap-3 text-left cursor-pointer"
              >
                <span className="w-9 h-9 rounded-lg bg-white border border-slate-200/80 flex items-center justify-center shrink-0">
                  <CategoryIcon icon={category.icon} />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {category.title}
                  </p>
                  <p className="text-xs text-slate-500">
                    {category.questions.length} {isEn ? 'questions' : 'soru'}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Category-Based Accordions */}
      <section className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 space-y-6">
          {faqCategories.map((category) => {
            const isCategoryOpen = openCategories.includes(category.id);
            return (
              <div
                key={category.id}
                id={category.id}
                className="scroll-mt-24 bg-white rounded-2xl border border-slate-200 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleCategory(category.id)}
                  aria-expanded={isCategoryOpen}
                  className="w-full min-h-[72px] p-5 sm:p-6 flex items-center justify-between gap-4 text-left hover:bg-slate-50/70 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                      <CategoryIcon icon={category.icon} />
                    </div>
                    <div className="min-w-0 space-y-0.5">
                      <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                        {category.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500 leading-snug">
                        {category.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="hidden sm:inline text-xs font-medium text-slate-500">
                      {category.questions.length} {isEn ? 'questions' : 'soru'}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-500 transition-transform duration-200 ${
                        isCategoryOpen ? 'rotate-180 text-blue-700' : ''
                      }`}
                    />
                  </div>
                </button>

                {isCategoryOpen && (
                  <div className="border-t border-slate-200/80 divide-y divide-slate-200/80">
                    {category.questions.map((item) => {
                      const isQuestionOpen = openQuestions.includes(item.id);
                      const isCopied = copiedId === item.id;
                      return (
                        <div key={item.id} id={item.id} className="scroll-mt-28 bg-white">
                          <div className="flex items-stretch">
                            <button
                              type="button"
                              onClick={() => toggleQuestion(item.id)}
                              aria-expanded={isQuestionOpen}
                              aria-controls={`${item.id}-answer`}
                              className="flex-1 min-h-[56px] px-5 sm:px-6 py-4 flex items-center justify-between gap-4 text-left hover:bg-slate-50/60 transition-colors cursor-pointer"
                            >
                              <span className="flex items-baseline gap-3 text-sm sm:text-base font-semibold text-slate-900 leading-snug">
                                <span className="text-xs font-semibold text-blue-700 shrink-0">
                                  {String(item.number).padStart(2, '0')}
                                </span>
                                <span>{item.question}</span>
                              </span>
                              <ChevronDown
                                className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                                  isQuestionOpen ? 'rotate-180 text-blue-700' : ''
                                }`}
                              />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleCopyQuestionLink(item.id)}
                              title={
                                isEn
                                  ? 'Copy direct link to this question'
                                  : 'Bu sorunun bağlantısını kopyala'
                              }
                              aria-label={
                                isEn
                                  ? `Copy direct link for ${item.question}`
                                  : `${item.question} sorusunun doğrudan bağlantısını kopyala`
                              }
                              className="min-w-[48px] px-3 border-l border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-700 hover:bg-slate-50 transition-colors cursor-pointer shrink-0"
                            >
                              {isCopied ? (
                                <Check className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <Link2 className="w-4 h-4" />
                              )}
                            </button>
                          </div>

                          {isQuestionOpen && (
                            <div
                              id={`${item.id}-answer`}
                              className="px-5 sm:px-6 pb-5 pt-1 pl-11 sm:pl-13 space-y-3"
                            >
                              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                                {item.answer}
                              </p>
                              <div className="flex items-center gap-3 pt-1">
                                <button
                                  type="button"
                                  onClick={() => handleCopyQuestionLink(item.id)}
                                  className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-blue-700 transition-colors cursor-pointer"
                                >
                                  {isCopied ? (
                                    <>
                                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                                      <span className="text-emerald-700">
                                        {isEn
                                          ? `Question link copied (#${item.id})`
                                          : `Soru bağlantısı kopyalandı (#${item.id})`}
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <Link2 className="w-3.5 h-3.5" />
                                      <span>
                                        {isEn
                                          ? 'Copy direct link to question'
                                          : 'Soruya doğrudan bağlantı kopyala'}
                                      </span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* End-of-Page Contact CTA */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center space-y-5">
          <p className="text-sm font-medium text-blue-700">
            {isEn ? 'Contact' : 'İletişim'}
          </p>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 [text-wrap:balance]">
            {isEn
              ? "Didn't find the answer to your question?"
              : 'Sorunuzun yanıtını bulamadınız mı?'}
          </h2>
          <p className="text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            {isEn
              ? 'Feel free to reach out directly for details on consulting scope, digital transformation projects, or professional collaborations.'
              : 'Danışmanlık kapsamı, dijital dönüşüm projeleri veya profesyonel iş birlikleri hakkında detaylı bilgi almak için doğrudan iletişime geçebilirsiniz.'}
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => navigate('/iletisim')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm sm:text-base font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-xl transition-colors cursor-pointer"
            >
              <span>{isEn ? 'Get in Touch' : 'İletişime Geçin'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
