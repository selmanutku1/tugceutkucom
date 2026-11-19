import { TUĞÇE_PROFILE } from '../data/consultingContent';
import ExecutivePortrait from './ExecutivePortrait';

export default function AboutSection() {
  return (
    <section
      id="hakkimda"
      className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200/80"
    >
      <div className="max-w-4xl mx-auto px-5 sm:px-8">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-10 space-y-6">
          {/* Header with Compact Portrait */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 pb-6 border-b border-slate-100">
            <ExecutivePortrait size="lg" />
            <div className="space-y-1.5">
              <p className="text-sm font-medium text-blue-700">Hakkımda</p>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                {TUĞÇE_PROFILE.name}
              </h2>
              <p className="text-sm sm:text-base font-medium text-slate-500">
                {TUĞÇE_PROFILE.role}
              </p>
            </div>
          </div>

          {/* Bio */}
          <p className="text-base text-slate-600 leading-relaxed">
            {TUĞÇE_PROFILE.bio}
          </p>

          <ul className="space-y-2 text-sm sm:text-base text-slate-700">
            {TUĞÇE_PROFILE.focusAreas.map((area) => (
              <li key={area} className="flex items-start gap-2.5">
                <span
                  aria-hidden="true"
                  className="text-blue-700 font-semibold"
                >
                  —
                </span>
                <span>{area}</span>
              </li>
            ))}
          </ul>

          {/* Quiet Unboxed Contact Row */}
          <div className="pt-5 border-t border-slate-100 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600">
            <a
              href={`mailto:${TUĞÇE_PROFILE.email}`}
              className="hover:text-slate-900 transition-colors"
            >
              {TUĞÇE_PROFILE.email}
            </a>
            <span aria-hidden="true" className="text-slate-300">
              ·
            </span>
            <a
              href={`https://wa.me/${TUĞÇE_PROFILE.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-900 transition-colors"
            >
              {TUĞÇE_PROFILE.phone}
            </a>
            <span aria-hidden="true" className="text-slate-300">
              ·
            </span>
            <a
              href={TUĞÇE_PROFILE.linkedin}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-blue-700 hover:text-blue-800 hover:underline"
            >
              LinkedIn Profili
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
