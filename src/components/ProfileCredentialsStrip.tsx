import { Briefcase, GraduationCap, Layers, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { StaggerGroup, StaggerItem } from './MotionPrimitives';

interface CredentialItem {
  id: string;
  labelTr: string;
  labelEn: string;
  valueTr: string;
  valueEn: string;
  icon: 'shield' | 'briefcase' | 'education' | 'layers';
}

const CREDENTIAL_ITEMS: CredentialItem[] = [
  {
    id: 'sector-expertise',
    labelTr: 'Sektörel Uzmanlık',
    labelEn: 'Sector Expertise',
    valueTr: 'Sigortacılık · Sigorta Teknolojileri · Dijital Sigortacılık',
    valueEn: 'Insurance · Insurance Technologies · Digital Insurance',
    icon: 'shield',
  },
  {
    id: 'experience',
    labelTr: 'Deneyim',
    labelEn: 'Experience',
    valueTr: '10+ yıl sektör deneyimi',
    valueEn: '10+ years of industry experience',
    icon: 'briefcase',
  },
  {
    id: 'education',
    labelTr: 'Eğitim',
    labelEn: 'Education',
    valueTr: 'Marmara Üniversitesi – Sigortacılık Lisans',
    valueEn: 'Marmara University – B.A. in Insurance',
    icon: 'education',
  },
  {
    id: 'competencies',
    labelTr: 'Tamamlayıcı Yetkinlikler',
    labelEn: 'Complementary Competencies',
    valueTr: 'Dijital Ürün Stratejisi · SaaS · Dijital Pazarlama · İş Geliştirme',
    valueEn: 'Digital Product Strategy · SaaS · Digital Marketing · Business Development',
    icon: 'layers',
  },
];

function CredentialIcon({ icon }: { icon: CredentialItem['icon'] }) {
  const iconClass = 'w-5 h-5 text-brand-teal';
  switch (icon) {
    case 'shield':
      return <ShieldCheck className={iconClass} />;
    case 'briefcase':
      return <Briefcase className={iconClass} />;
    case 'education':
      return <GraduationCap className={iconClass} />;
    case 'layers':
      return <Layers className={iconClass} />;
  }
}

interface ProfileCredentialsStripProps {
  className?: string;
}

export default function ProfileCredentialsStrip({
  className = '',
}: ProfileCredentialsStripProps) {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  return (
    <StaggerGroup
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`.trim()}
    >
      {CREDENTIAL_ITEMS.map((item) => (
        <StaggerItem
          key={item.id}
          className="h-full bg-white/75 backdrop-blur-md rounded-2xl border border-[#012253]/8 p-5 sm:p-6 flex flex-col items-center sm:items-start text-center sm:text-left gap-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/95 hover:border-brand-teal/25 hover:shadow-[0_14px_28px_-16px_rgba(1,34,83,0.14)]"
        >
          <div className="w-10 h-10 rounded-xl bg-brand-teal-light/90 border border-brand-teal-soft flex items-center justify-center shrink-0">
            <CredentialIcon icon={item.icon} />
          </div>
          <div className="space-y-1.5">
            <p className="text-xs font-semibold tracking-wide text-brand-teal">
              {isEn ? item.labelEn : item.labelTr}
            </p>
            <p className="text-sm font-semibold text-slate-900 leading-relaxed">
              {isEn ? item.valueEn : item.valueTr}
            </p>
          </div>
        </StaggerItem>
      ))}
    </StaggerGroup>
  );
}
