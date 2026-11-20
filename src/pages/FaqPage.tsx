import { useEffect, useState } from 'react';
import {
  ArrowRight,
  ChevronDown,
  Compass,
  Cpu,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';
import { getSiteContent } from '../data/siteContentEn';
import { FaqCategory } from '../types';
import { useRouter } from '../context/RouterContext';
import { useLanguage } from '../context/LanguageContext';
import {
  AccordionBody,
  Reveal,
  StaggerGroup,
  StaggerItem,
} from '../components/MotionPrimitives';

function CategoryIcon({ icon }: { icon: FaqCategory['icon'] }) {
  const iconClass = 'w-5 h-5 text-brand-teal';
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
    <div>
      {/* Page Header */}
      <section className="border-b border-[#012253]/8 bg-transparent">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 pt-12 pb-12 sm:pt-16 sm:pb-14">
          <Reveal immediate className="max-w-3xl mx-auto sm:mx-0 text-center sm:text-left space-y-4">
            <p className="text-sm font-medium text-brand-teal">
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
          </Reveal>

          {/* Quick Category Navigation */}
          <StaggerGroup
            immediate
            delayChildren={0.16}
            staggerDelay={0.07}
            className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
          >
            {faqCategories.map((category) => (
              <StaggerItem key={category.id} distance={24}>
                <button
                  type="button"
                  onClick={() => handleQuickJumpCategory(category.id)}
                  className="w-full min-h-[56px] p-3.5 rounded-xl border border-slate-200 hover:border-brand-teal-soft bg-slate-50 hover:bg-brand-teal-light/60 transition-colors flex items-center gap-3 text-left cursor-pointer"
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
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Category-Based Accordions */}
      <section className="py-12 sm:py-16 bg-white/45 backdrop-blur-[2px] border-b border-[#012253]/8">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 space-y-6">
          {faqCategories.map((category, idx) => {
            const isCategoryOpen = openCategories.includes(category.id);
            return (
              <Reveal
                key={category.id}
                immediate={idx === 0}
                delay={idx === 0 ? 0.22 : 0.04}
                distance={32}
              >
                <div
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
                    <div className="w-11 h-11 rounded-xl bg-brand-teal-light border border-brand-teal-soft flex items-center justify-center shrink-0">
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
                        isCategoryOpen ? 'rotate-180 text-brand-teal' : ''
                      }`}
                    />
                  </div>
                </button>

                <AccordionBody
                  isOpen={isCategoryOpen}
                  className="border-t border-slate-200/80 divide-y divide-slate-200/80"
                >
                    {category.questions.map((item) => {
                      const isQuestionOpen = openQuestions.includes(item.id);
                      return (
                        <div key={item.id} id={item.id} className="scroll-mt-28 bg-white">
                          <button
                            type="button"
                            onClick={() => toggleQuestion(item.id)}
                            aria-expanded={isQuestionOpen}
                            aria-controls={`${item.id}-answer`}
                            className="w-full min-h-[56px] px-5 sm:px-6 py-4 flex items-center justify-between gap-4 text-left hover:bg-slate-50/60 transition-colors cursor-pointer"
                          >
                            <span className="flex items-baseline gap-3 text-sm sm:text-base font-semibold text-slate-900 leading-snug">
                              <span className="text-xs font-semibold text-brand-teal shrink-0">
                                {String(item.number).padStart(2, '0')}
                              </span>
                              <span>{item.question}</span>
                            </span>
                            <ChevronDown
                              className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                                isQuestionOpen ? 'rotate-180 text-brand-teal' : ''
                              }`}
                            />
                          </button>

                          <AccordionBody
                            isOpen={isQuestionOpen}
                            id={`${item.id}-answer`}
                            className="px-5 sm:px-6 pb-5 pt-1 pl-11 sm:pl-13"
                          >
                            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                              {item.answer}
                            </p>
                          </AccordionBody>
                        </div>
                      );
                    })}
                </AccordionBody>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* End-of-Page Contact CTA */}
      <section className="py-16 sm:py-20 bg-transparent">
        <Reveal className="max-w-4xl mx-auto px-5 sm:px-8 text-center space-y-5">
          <p className="text-sm font-medium text-brand-teal">
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
              className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm sm:text-base font-semibold text-white bg-brand-navy hover:bg-brand-navy-hover rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-[#012253]/15 cursor-pointer"
            >
              <span>{isEn ? 'Get in Touch' : 'İletişime Geçin'}</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
