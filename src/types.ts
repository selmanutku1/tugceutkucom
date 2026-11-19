export interface ExpertiseArea {
  id: string;
  number: string;
  title: string;
  homeSummary: string;
  pageIntro: string;
  bullets: string[];
}

export interface ExperienceItem {
  id: string;
  organization: string;
  roleArea: string;
  summary: string;
  listTitle: string;
  responsibilities: string[];
}

export interface ProjectItem {
  id: string;
  number: string;
  topicTitle: string;
  tagline: string;
  homeSummary: string;
  detailDescription: string;
  focusAreas: string[];
}

export type BlogCategoryKey =
  | 'dijital-donusum'
  | 'insurtech'
  | 'yapay-zeka'
  | 'dijital-pazarlama'
  | 'strateji-yonetim';

export interface BlogSection {
  id: string;
  heading: string;
  paragraphs: string[];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  spot: string;
  categoryKey: BlogCategoryKey;
  categoryLabel: string;
  tags: string[];
  publishedAt: string;
  publishedIso: string;
  readingTime: string;
  coverTheme: 'photo' | 'transformation' | 'insurtech' | 'ai' | 'growth' | 'strategy';
  featured?: boolean;
  sections: BlogSection[];
}

export interface FaqQuestion {
  id: string;
  number: number;
  question: string;
  answer: string;
}

export interface FaqCategory {
  id: string;
  title: string;
  description: string;
  icon: 'compass' | 'shield' | 'cpu' | 'message';
  questions: FaqQuestion[];
}

export interface LinkedInPost {
  id: string;
  title: string;
  excerpt: string;
  fullText: string;
  publishedAt?: string;
  publishedIso?: string;
  postUrl: string;
  imageUrl?: string;
  embedUrl?: string;
}

export interface LinkedInFeedResponse {
  mode: 'posts' | 'embeds' | 'widget' | 'unconfigured';
  source?: 'feed' | 'api' | 'embeds' | 'widget';
  oauthConfigured: boolean;
  profileUrl: string;
  activityUrl: string;
  widgetUrl?: string;
  posts: LinkedInPost[];
  syncedAt?: string;
}

