export interface SimpleService {
  id: string;
  number: string;
  title: string;
  summary: string;
  highlights: string[];
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

export interface ImpactHighlight {
  value: string;
  label: string;
  context: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface LinkedInPost {
  id: string;
  topic: string;
  title: string;
  excerpt: string;
  fullText: string;
  postUrl: string;
  embedUrl?: string;
}
