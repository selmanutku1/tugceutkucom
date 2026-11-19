import {
  ExpertiseArea,
  ExperienceItem,
  ProjectItem,
  FaqCategory,
} from '../types';
import {
  BRAND_PROFILE,
  EXPERTISE_AREAS,
  APPROACH_PILLARS,
  ABOUT_PRINCIPLES,
  EXPERIENCE_LIST,
  PROJECT_ITEMS,
  FAQ_CATEGORIES,
  CONTACT_CATEGORIES,
} from './siteContent';
import type { Language } from '../context/LanguageContext';

export const BRAND_PROFILE_EN = {
  ...BRAND_PROFILE,
  positioning: 'Digital Transformation · Technology · Strategy',
  shortTagline:
    'Professional perspectives and work on digital transformation, technology, and strategy.',
};

export const EXPERTISE_AREAS_EN: ExpertiseArea[] = [
  {
    id: 'dijital-pazarlama-ve-buyume',
    number: '01',
    title: 'Digital Marketing & Growth',
    homeSummary:
      'SEO, performance marketing, digital advertising management, conversion optimization, customer acquisition, and digital brand strategy.',
    pageIntro:
      'I view digital channels not merely as visibility tools, but as core drivers of customer acquisition and commercial growth.',
    bullets: [
      'SEO and organic growth strategies',
      'Google Ads and performance marketing',
      'Meta Ads and lead generation',
      'Conversion rate optimization',
      'GA4 and performance analytics',
      'Content and brand communication',
      'Digital marketing performance management',
    ],
  },
  {
    id: 'urun-ve-buyume-stratejisi',
    number: '02',
    title: 'Product & Growth Strategy',
    homeSummary:
      'Product positioning, product marketing, SaaS growth models, go-to-market strategies, and self-service sales journeys.',
    pageIntro:
      'Connecting digital products with the right audience at the right moment is critical for sustainable growth.',
    bullets: [
      'Product positioning',
      'Product marketing strategy',
      'Go-to-market planning',
      'SaaS business models',
      'Self-service sales models',
      'User acquisition and activation',
      'Landing page and funnel optimization',
    ],
  },
  {
    id: 'sigortacilik-teknolojileri-ve-yapay-zeka',
    number: '03',
    title: 'Insurance Technologies & AI',
    homeSummary:
      'Digital insurance, Insurtech, insurance CRM systems, online sales platforms, AI applications, and sector-wide digital transformation.',
    pageIntro:
      'I approach the technological transformation of the insurance sector holistically, from operational workflows to customer experience.',
    bullets: [
      'Digital insurance',
      'Insurance CRM systems',
      'Online insurance sales platforms',
      'Digitalization of insurance agencies and brokers',
      'Bancassurance technologies',
      'API and integration ecosystem',
      'AI-powered insurance applications',
      'Data analytics and automation in insurance',
    ],
  },
  {
    id: 'stratejik-yonetim-ve-is-gelistirme',
    number: '04',
    title: 'Strategic Management & Business Development',
    homeSummary:
      'Agency management, team coordination, B2B marketing, sales strategies, strategic partnerships, and operational process management.',
    pageIntro:
      'I believe successful digital initiatives depend on aligning teams, processes, and commercial objectives together.',
    bullets: [
      'Agency and operations management',
      'Team coordination',
      'B2B marketing and sales strategies',
      'Business development',
      'Project management',
      'Strategic partnerships',
      'KPI and performance management',
    ],
  },
];

export const APPROACH_PILLARS_EN = [
  {
    title: 'Strategy',
    description: 'Defining the right goals, priorities, and commercial direction.',
  },
  {
    title: 'Technology',
    description: 'Evaluating solutions that genuinely elevate business workflows.',
  },
  {
    title: 'Measurement',
    description: 'Analyzing real performance through actionable data.',
  },
];

export const ABOUT_PRINCIPLES_EN = [
  {
    title: 'Data-Driven Thinking',
    description:
      'Evaluating decisions through measurable indicators, user behavior, and real performance metrics.',
  },
  {
    title: 'Strategic Perspective',
    description:
      'Focusing on long-term value creation alongside short-term operational wins.',
  },
  {
    title: 'Technology & Innovation',
    description:
      'Assessing emerging technologies through the lens of business workflows and customer experience.',
  },
  {
    title: 'Holistic Marketing',
    description:
      'Uniting product, marketing, sales, and customer experience under a shared growth approach.',
  },
];

export const EXPERIENCE_LIST_EN: ExperienceItem[] = [
  {
    id: 'acerpro',
    organization: 'AcerPro',
    roleArea: 'Technology & Digital Solutions',
    summary:
      'Held responsibilities in agency management, digital marketing, client operations, and project coordination across technology and insurance ecosystem initiatives.',
    listTitle: 'Key Responsibilities',
    responsibilities: [
      'Developing digital marketing strategies',
      'Managing agency operations and team workflows',
      'Brand and client communications',
      'Coordinating digital transformation projects',
      'Tracking operational and business performance',
    ],
  },
  {
    id: 'acercrea',
    organization: 'AcerCrea',
    roleArea: 'Digital Insurance Agency',
    summary:
      'Led agency operations and client management for digital marketing and digital growth solutions tailored to the insurance industry.',
    listTitle: 'Key Responsibilities',
    responsibilities: [
      'Managing digital marketing services',
      'SEO and digital advertising strategies',
      'Client and project management',
      'Social media and content strategy',
      'Cross-functional team coordination',
    ],
  },
  {
    id: 'insurup',
    organization: 'InsurUp',
    roleArea: 'Insurance Technologies',
    summary:
      'Led marketing, positioning, and growth initiatives for SaaS and digital sales platforms built for the insurance ecosystem.',
    listTitle: 'Core Focus Areas',
    responsibilities: [
      'Product marketing',
      'Digital customer acquisition',
      'Self-service sales strategies',
      'B2B marketing and sales enablement',
      'Digital product positioning',
    ],
  },
];

export const PROJECT_ITEMS_EN: ProjectItem[] = [
  {
    id: 'sigorta-crm-ve-dijital-satis',
    number: '01',
    topicTitle: 'Insurance CRM & Digital Sales Platforms',
    tagline: 'Next-generation technology and growth architecture for digital insurance.',
    homeSummary:
      'Product marketing and growth initiatives across insurance CRM, digital sales platforms, and sector-specific technology solutions.',
    detailDescription:
      'Product positioning, self-service sales design, and digital growth execution for CRM, comparative quoting, and integration platforms empowering insurance agencies and brokers.',
    focusAreas: [
      'Product marketing and positioning',
      'Digital growth strategy',
      'Self-service sales architecture',
      'Lead acquisition',
      'Digital communication and marketing workflows',
    ],
  },
  {
    id: 'teknoloji-ve-dijital-operasyon',
    number: '02',
    topicTitle: 'Technology & Digital Solution Operations',
    tagline: 'Holistic operations management for technology and digital marketing.',
    homeSummary:
      'Digital technology, insurance solutions, agency operations, and multidisciplinary digital marketing initiatives.',
    detailDescription:
      'End-to-end coordination of agency management, brand communications, customer experience, and multidisciplinary digital service operations across enterprise technology engagements.',
    focusAreas: [
      'Digital marketing',
      'Brand management',
      'Project coordination',
      'Customer experience',
      'Digital service operations',
    ],
  },
  {
    id: 'bankasurans-ve-sektorel-ekosistem',
    number: '03',
    topicTitle: 'Bancassurance & Industry Ecosystem Communications',
    tagline: 'Executive engagement across the banking and insurance ecosystem.',
    homeSummary:
      'Industry communications, editorial content, and event strategy for the banking and insurance ecosystem.',
    detailDescription:
      'Content strategy, digital promotion, event communications, and executive visibility initiatives for summits and forums shaping the future of banking and insurance.',
    focusAreas: [
      'Event communications',
      'Digital promotion',
      'Content strategy',
      'Industry visibility',
    ],
  },
  {
    id: 'yapay-zeka-ve-sigortacilik',
    number: '04',
    topicTitle: 'Artificial Intelligence & Insurance',
    tagline: 'The strategic role of AI in shaping the future of insurance.',
    homeSummary:
      'Research, analysis, and editorial insights on AI use cases, digital customer experience, and technological transformation in insurance.',
    detailDescription:
      'Industry research, analysis, and strategic insights covering AI applications, data analytics, operational automation, intelligent decision support, and digital customer experience in insurance.',
    focusAreas: [
      'Sectoral analysis of AI use cases',
      'Automation in insurance operations',
      'Digital customer experience',
      'Technology-led process transformation',
      'Industry insights and analytical content',
    ],
  },
];

export const FAQ_CATEGORIES_EN: FaqCategory[] = [
  {
    id: 'danismanlik-ve-strateji',
    title: 'Consulting & Strategy',
    description:
      'Questions on digital growth, marketing strategy, product positioning, and engagement models.',
    icon: 'compass',
    questions: [
      {
        id: 'soru-1',
        number: 1,
        question: 'In which areas do you provide consulting support?',
        answer:
          'I provide strategic evaluation and consulting in digital marketing strategy, digital growth, product marketing, Insurtech, digital transformation in insurance, and business development. The scope is tailored to each organization’s goals and needs.',
      },
      {
        id: 'soru-2',
        number: 2,
        question: 'What topics are covered under digital marketing consulting?',
        answer:
          'We address goal setting, SEO and performance marketing, advertising strategy, customer acquisition, conversion optimization, and performance measurement—ensuring digital channels align directly with commercial targets.',
      },
      {
        id: 'soru-3',
        number: 3,
        question: 'How do you support companies with digital transformation?',
        answer:
          'We begin by evaluating current digital workflows, business goals, and key improvement areas. From there, we build a clear strategic roadmap spanning technology adoption, digital channels, customer experience, and operations.',
      },
      {
        id: 'soru-4',
        number: 4,
        question: 'What does product marketing consulting include?',
        answer:
          'It covers product positioning, target audience analysis, value proposition design, go-to-market planning, product messaging, user acquisition, and growth models—with particular focus on digital products and SaaS.',
      },
      {
        id: 'soru-5',
        number: 5,
        question: 'Can you build a digital growth strategy for my business?',
        answer:
          'Yes. By reviewing your current digital footprint, target audience, competitive landscape, and growth objectives, we can establish a structured strategy centered on channel efficiency, customer acquisition, and measurable KPIs.',
      },
      {
        id: 'soru-6',
        number: 6,
        question: 'How does the consulting process work?',
        answer:
          'Every engagement starts with a discovery conversation. Once priorities and expectations are aligned, we define the scope and proceed through discovery analysis, strategy development, roadmap creation, and ongoing evaluation.',
      },
      {
        id: 'soru-7',
        number: 7,
        question: 'Can consulting engagements be conducted remotely?',
        answer:
          'Yes. Depending on the scope and needs of the project, engagements can be managed seamlessly through online sessions and collaborative digital workflows.',
      },
      {
        id: 'soru-8',
        number: 8,
        question: 'Are engagements project-based or ongoing?',
        answer:
          'Both models are available. One-off strategic assessments, project-based advisory, or periodic strategic support can be structured according to organizational needs.',
      },
    ],
  },
  {
    id: 'sigortacilik-ve-insurtech',
    title: 'Insurance & Insurtech',
    description:
      'Insurance agencies, brokers, CRM technologies, and artificial intelligence in insurance.',
    icon: 'shield',
    questions: [
      {
        id: 'soru-9',
        number: 9,
        question: 'Which areas of the insurance sector do you advise on?',
        answer:
          'I focus on digital insurance, agency and broker digitalization, CRM technologies, online sales workflows, digital customer experience, and marketing strategy tailored to the insurance ecosystem.',
      },
      {
        id: 'soru-10',
        number: 10,
        question: 'Can you create a digital growth strategy for insurance agencies and brokers?',
        answer:
          'Yes. By evaluating your existing digital presence, target client segments, product portfolio, online quoting infrastructure, and marketing workflows, we identify high-impact growth opportunities.',
      },
      {
        id: 'soru-11',
        number: 11,
        question: 'Where can artificial intelligence be applied in insurance?',
        answer:
          'AI creates measurable impact across customer communications, document processing, risk evaluation, quoting workflows, data analytics, and operational automation—depending on institutional priorities and data readiness.',
      },
      {
        id: 'soru-12',
        number: 12,
        question: 'Do you collaborate with insurance carriers and technology companies?',
        answer:
          'Yes. Strategic collaborations across insurance, technology, and digital growth are evaluated individually, with clear goals, responsibilities, and deliverables defined for each initiative.',
      },
    ],
  },
  {
    id: 'urun-ve-teknoloji',
    title: 'Product & Technology',
    description:
      'SaaS growth models, go-to-market strategies, and digital performance measurement.',
    icon: 'cpu',
    questions: [
      {
        id: 'soru-13',
        number: 13,
        question: 'Do you support marketing and growth for SaaS products?',
        answer:
          'Yes. I work on positioning, audience segmentation, product marketing, customer acquisition, self-service sales models, and conversion optimization for SaaS products.',
      },
      {
        id: 'soru-14',
        number: 14,
        question: 'Can you prepare a go-to-market strategy for a new digital product?',
        answer:
          'Yes. We build an actionable go-to-market roadmap by aligning value proposition, target segments, competitive positioning, pricing perspective, and acquisition channels.',
      },
      {
        id: 'soru-15',
        number: 15,
        question: 'How is digital marketing performance evaluated?',
        answer:
          'Traffic, qualified leads, conversion rate, customer acquisition cost, return on ad spend, and sales outcomes are evaluated together so measurement reflects commercial impact rather than isolated channel metrics.',
      },
    ],
  },
  {
    id: 'iletisim-ve-is-birligi',
    title: 'Contact & Collaboration',
    description:
      'Professional partnerships, speaking invitations, and direct communication channels.',
    icon: 'message',
    questions: [
      {
        id: 'soru-16',
        number: 16,
        question: 'How can I get in touch for consulting or collaboration?',
        answer:
          'You can use the contact form on this website or connect via LinkedIn. Sharing a brief overview of your topic and objective helps make our initial conversation more productive.',
      },
    ],
  },
];

export const CONTACT_CATEGORIES_EN = [
  'Consulting inquiries',
  'Digital growth & strategy',
  'Product & technology projects',
  'Insurance & Insurtech',
  'Event & speaking invitations',
  'Interview & publication requests',
  'Professional collaborations',
];

export function getSiteContent(lang: Language) {
  if (lang === 'en') {
    return {
      brand: BRAND_PROFILE_EN,
      expertiseAreas: EXPERTISE_AREAS_EN,
      approachPillars: APPROACH_PILLARS_EN,
      aboutPrinciples: ABOUT_PRINCIPLES_EN,
      experienceList: EXPERIENCE_LIST_EN,
      projectItems: PROJECT_ITEMS_EN,
      faqCategories: FAQ_CATEGORIES_EN,
      contactCategories: CONTACT_CATEGORIES_EN,
    };
  }

  return {
    brand: BRAND_PROFILE,
    expertiseAreas: EXPERTISE_AREAS,
    approachPillars: APPROACH_PILLARS,
    aboutPrinciples: ABOUT_PRINCIPLES,
    experienceList: EXPERIENCE_LIST,
    projectItems: PROJECT_ITEMS,
    faqCategories: FAQ_CATEGORIES,
    contactCategories: CONTACT_CATEGORIES,
  };
}
