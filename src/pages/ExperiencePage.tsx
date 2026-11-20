import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react';
import { getSiteContent } from '../data/siteContentEn';
import { useRouter } from '../context/RouterContext';
import { useLanguage } from '../context/LanguageContext';
import { EXECUTIVE_EASE, Reveal } from '../components/MotionPrimitives';

export default function ExperiencePage() {
  const { navigate } = useRouter();
  const { lang } = useLanguage();
  const isEn = lang === 'en';
  const prefersReduced = useReducedMotion();
  const { experienceList } = getSiteContent(lang);

  const timelineRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 75%', 'end 60%'],
  });
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <div>
      {/* Header */}
      <section className="py-14 sm:py-20 bg-white/45 backdrop-blur-[2px] border-b border-[#012253]/8">
        <Reveal immediate className="max-w-4xl mx-auto px-5 sm:px-8 space-y-4 text-center sm:text-left">
          <p className="text-sm font-medium text-brand-teal">
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
        </Reveal>
      </section>

      {/* Experience Blocks with Scroll-Drawn Career Timeline */}
      <section className="py-14 sm:py-20 border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <div ref={timelineRef} className="relative sm:pl-12 space-y-8">
            {/* Static Background Rail */}
            <div
              aria-hidden="true"
              className="hidden sm:block absolute left-4 top-6 bottom-6 w-[2px] bg-slate-200 rounded-full"
            />
            {/* Scroll-Animated Active Progress Rail */}
            <motion.div
              aria-hidden="true"
              style={
                prefersReduced
                  ? { transformOrigin: '50% 0%' }
                  : { scaleY, transformOrigin: '50% 0%' }
              }
              className="hidden sm:block absolute left-4 top-6 bottom-6 w-[2px] bg-gradient-to-b from-brand-navy via-[#01526C] to-brand-teal-mid rounded-full"
            />

            {experienceList.map((exp, idx) => (
              <motion.div
                key={exp.id}
                initial={prefersReduced ? false : { opacity: 0, x: 28, y: 18 }}
                animate={idx === 0 ? { opacity: 1, x: 0, y: 0 } : undefined}
                whileInView={idx > 0 ? { opacity: 1, x: 0, y: 0 } : undefined}
                viewport={idx > 0 ? { once: true, amount: 0.14 } : undefined}
                transition={{
                  duration: 0.62,
                  delay: idx === 0 ? 0.16 : 0.05,
                  ease: EXECUTIVE_EASE,
                }}
                className="relative"
              >
                {/* Timeline Milestone Marker */}
                <span
                  aria-hidden="true"
                  className="hidden sm:flex absolute -left-12 top-8 w-8 h-8 rounded-full bg-white border-2 border-brand-navy text-[11px] font-bold text-brand-navy items-center justify-center tabular-nums shadow-xs z-10"
                >
                  0{idx + 1}
                </span>

                <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-9 space-y-5 text-center sm:text-left transition-all duration-200 hover:border-slate-300 hover:shadow-[0_12px_28px_-14px_rgba(15,23,42,0.12)]">
                  <div className="space-y-1.5 pb-5 border-b border-slate-100">
                    <p className="text-xs font-semibold text-brand-teal tabular-nums sm:hidden">
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
                            className="hidden sm:inline text-brand-teal font-semibold"
                          >
                            —
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Link */}
      <section className="py-14 sm:py-18 bg-white/45 backdrop-blur-[2px]">
        <Reveal className="max-w-4xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
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
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-navy hover:bg-brand-navy-hover text-white text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-[#012253]/15 cursor-pointer whitespace-nowrap shrink-0"
          >
            <span>{isEn ? 'Explore Projects' : 'Projeleri İnceleyin'}</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </Reveal>
      </section>
    </div>
  );
}
