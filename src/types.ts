export interface FlagshipService {
  id: string;
  title: string;
  summary: string;
  icon: string;
  badge?: string;
  keyBullets: string[];
}

export interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'dijital-donusum' | 'yapay-zeka' | 'insurtech' | 'dijital-urunler' | 'operasyon' | 'veri-analitik' | 'pazarlama' | 'acente';
  icon: string;
  summary: string;
  deliverables: string[];
  subCapabilities: string[];
  benefits: string[];
  targetAudience: string;
  timeline: string;
}

export interface WebsiteSectionPlan {
  id: string;
  title: string;
  purpose: string;
  mustHaveElements: string[];
  recommendedCopyPrompt: string;
  trustFactor: string;
}

export interface ConsultingPackage {
  id: string;
  name: string;
  tagline: string;
  badge?: string;
  priceNote: string;
  features: string[];
  notIncluded?: string[];
  suitableFor: string;
  popular?: boolean;
}

export interface CaseStudy {
  id: string;
  clientType: string;
  title: string;
  challenge: string;
  solution: string;
  results: {
    label: string;
    value: string;
  }[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface AssessmentAnswer {
  category: 'bireysel' | 'kobi' | 'acente';
  currentCoverage: string;
  digitalPainPoint: string;
  cyberExposure: string;
  budgetOrScale: string;
}

export interface AssessmentResult {
  score: number;
  grade: 'Kritik Risk' | 'Gelişime Açık' | 'Yarı Dijital' | 'İleri Seviye';
  title: string;
  analysis: string;
  identifiedGaps: string[];
  recommendedSteps: string[];
  suggestedPackage: string;
}
