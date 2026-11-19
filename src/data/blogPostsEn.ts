import { BlogCategoryKey, BlogPost } from '../types';
import { BLOG_FILTERS, BLOG_POSTS } from './blogPosts';
import type { Language } from '../context/LanguageContext';

export const BLOG_FILTERS_EN: { key: 'all' | BlogCategoryKey; label: string }[] = [
  { key: 'all', label: 'All Articles' },
  { key: 'dijital-donusum', label: 'Digital Transformation' },
  { key: 'insurtech', label: 'Insurtech' },
  { key: 'yapay-zeka', label: 'Artificial Intelligence' },
  { key: 'dijital-pazarlama', label: 'Digital Marketing' },
  { key: 'strateji-yonetim', label: 'Strategy & Management' },
];

export const BLOG_POSTS_EN: BlogPost[] = [
  {
    id: 'b1',
    slug: 'dijital-donusumun-merkezinde-teknoloji-ve-dogru-strateji-var',
    title: 'Technology and the Right Strategy Sit at the Heart of Digital Transformation',
    spot: 'Technology investments alone do not create transformation; lasting impact requires aligning business goals, customer experience, and measurable strategy.',
    categoryKey: 'dijital-donusum',
    categoryLabel: 'Digital Transformation',
    publishedAt: 'November 14, 2026',
    publishedIso: '2026-11-14',
    readingTime: '5 min read',
    coverTheme: 'photo',
    featured: true,
    sections: [
      {
        id: 'neden-strateji',
        heading: 'Why technology alone is never enough',
        paragraphs: [
          'The most common misconception in corporate digital transformation is assuming that purchasing new software completes the journey. Technology is only a lever; business strategy determines the direction.',
          'Without clear commercial objectives and process ownership, even the most advanced digital platforms fail to become part of daily operations.',
        ],
      },
      {
        id: 'uc-temel-bilesen',
        heading: 'Three pillars of sustainable transformation',
        paragraphs: [
          'In successful digital transformation programs, strategy, technology, and measurement reinforce one another. First, the core business problem is clarified; next, the leanest technology architecture that solves it is selected.',
          'Finally, commercial impact is tracked consistently through data-backed performance indicators.',
        ],
      },
      {
        id: 'yoneticiler-icin-yol-haritasi',
        heading: 'Where decision-makers should begin',
        paragraphs: [
          'Starting with high-impact steps that directly improve customer experience or operational efficiency accelerates team adoption and makes return on investment visible early.',
        ],
      },
    ],
  },
  {
    id: 'b2',
    slug: 'yapay-zeka-sigortacilik-sektorunu-nasil-donusturuyor',
    title: 'How Is Artificial Intelligence Transforming the Insurance Industry?',
    spot: 'From customer communication to claims and document analysis, AI applications are redefining speed, accuracy, and decision quality across insurance.',
    categoryKey: 'yapay-zeka',
    categoryLabel: 'AI & Technology',
    publishedAt: 'November 9, 2026',
    publishedIso: '2026-11-09',
    readingTime: '6 min read',
    coverTheme: 'ai',
    sections: [
      {
        id: 'sigortacilikta-yeni-donem',
        heading: 'A new era of operational efficiency in insurance',
        paragraphs: [
          'Insurance is inherently built on high data volumes, document workflows, and risk assessment. Artificial intelligence removes repetitive friction at these exact touchpoints, allowing teams to focus on advisory and strategy.',
        ],
      },
      {
        id: 'somut-kullanim-alanlari',
        heading: 'Where does AI create the fastest value?',
        paragraphs: [
          'Responsive digital assistants, policy and claims document review, renewal propensity analysis, and tailored product recommendations are among the highest-value near-term applications.',
        ],
      },
      {
        id: 'veri-altyapisi-onemi',
        heading: 'No AI strategy succeeds without clean data foundations',
        paragraphs: [
          'Generating real business outcomes from AI requires structured, reliable customer and policy records. Strong CRM discipline is therefore the essential prerequisite for AI adoption.',
        ],
      },
    ],
  },
  {
    id: 'b3',
    slug: 'sigorta-sektorunde-crm-teknolojilerinin-stratejik-onemi',
    title: 'The Strategic Importance of CRM Technologies in the Insurance Industry',
    spot: 'For insurance agencies and brokers, CRM is far more than a contact directory—it is the engine behind portfolio retention, renewals, and cross-selling.',
    categoryKey: 'insurtech',
    categoryLabel: 'Insurtech & Digital Insurance',
    publishedAt: 'November 3, 2026',
    publishedIso: '2026-11-03',
    readingTime: '5 min read',
    coverTheme: 'insurtech',
    sections: [
      {
        id: 'daginik-veriden-butunsel-gorunume',
        heading: 'Moving from scattered spreadsheets to holistic portfolio visibility',
        paragraphs: [
          'Manual customer tracking quickly breaks down as an agency or brokerage grows. Missed policy renewal dates and fragmented communication history lead directly to avoidable portfolio churn.',
        ],
      },
      {
        id: 'yenileme-ve-capraz-satis',
        heading: 'Structured systems power renewals and cross-sell growth',
        paragraphs: [
          'Insurance-specific CRM platforms surface each client’s complete policy history in a single view, enabling timely outreach and relevant coverage recommendations.',
        ],
      },
      {
        id: 'ekip-verimliligi',
        heading: 'Team coordination and data-backed leadership',
        paragraphs: [
          'Real-time visibility into production, quote conversion rates, and advisor performance replaces guesswork with measurable management.',
        ],
      },
    ],
  },
  {
    id: 'b4',
    slug: 'dijitallesmek-ile-gercekten-donusmek-arasindaki-fark',
    title: 'The Difference Between Digitizing and Truly Transforming',
    spot: 'Moving existing workflows online adds speed, but genuine transformation requires redesigning the business model, culture, and customer value.',
    categoryKey: 'dijital-donusum',
    categoryLabel: 'Digital Transformation',
    publishedAt: 'October 28, 2026',
    publishedIso: '2026-10-28',
    readingTime: '4 min read',
    coverTheme: 'transformation',
    sections: [
      {
        id: 'kagit-yerine-ekran',
        heading: 'Does replacing paper with screens equal transformation?',
        paragraphs: [
          'Many organizations assume adopting software means they have transformed. Yet digitizing an inefficient process only creates a faster inefficient process.',
        ],
      },
      {
        id: 'is-modeli-perspektifi',
        heading: 'Customer-centric redesign',
        paragraphs: [
          'True transformation begins by simplifying how customers access service, informing decisions with real data, and removing silos between teams.',
        ],
      },
    ],
  },
  {
    id: 'b5',
    slug: 'sigortacilikta-dijital-donusum-teknolojiden-daha-fazlasi',
    title: 'Digital Transformation in Insurance: More Than Technology',
    spot: 'Across carriers, agencies, and brokers alike, competitive advantage comes from combining technology with trust and consultative service.',
    categoryKey: 'insurtech',
    categoryLabel: 'Insurtech & Digital Insurance',
    publishedAt: 'October 21, 2026',
    publishedIso: '2026-10-21',
    readingTime: '5 min read',
    coverTheme: 'insurtech',
    sections: [
      {
        id: 'guven-ve-hiz-dengesi',
        heading: 'Balancing trust and speed in insurance',
        paragraphs: [
          'Policyholders expect transparent quotes in seconds, yet at the moment of a claim or major decision they still value reaching an advisor they trust.',
        ],
      },
      {
        id: 'hibrit-deneyim',
        heading: 'The rise of hybrid customer experience',
        paragraphs: [
          'Organizations that blend digital self-service convenience with human expertise build lasting loyalty rather than competing on price alone.',
        ],
      },
    ],
  },
  {
    id: 'b6',
    slug: 'sigorta-acenteleri-icin-dijitallesmenin-yeni-donemi',
    title: 'A New Era of Digitalization for Insurance Agencies & Brokers',
    spot: 'Evolving customer expectations require agencies and brokers to modernize everything from digital discoverability to online quoting workflows.',
    categoryKey: 'insurtech',
    categoryLabel: 'Insurtech & Digital Insurance',
    publishedAt: 'October 15, 2026',
    publishedIso: '2026-10-15',
    readingTime: '5 min read',
    coverTheme: 'insurtech',
    sections: [
      {
        id: 'musteri-davranislari',
        heading: 'The evolving insurance buyer profile',
        paragraphs: [
          'Most policyholders now start their research through search engines and digital channels. Agencies and brokers that remain accessible outside standard office hours gain a decisive edge.',
        ],
      },
      {
        id: 'pratik-adimlar',
        heading: 'Priority digital steps for agencies and brokers',
        paragraphs: [
          'A credible website, disciplined CRM usage, automated renewal reminders, and targeted digital outreach drive measurable growth without overly complex investments.',
        ],
      },
    ],
  },
  {
    id: 'b7',
    slug: 'sigortacilikta-yapay-zeka-otomasyondan-akilli-karar-sistemlerine',
    title: 'AI in Insurance: From Automation to Intelligent Decision Systems',
    spot: 'Automating routine tasks is only the first step; real strategic value emerges when AI strengthens risk, pricing, and portfolio decisions.',
    categoryKey: 'yapay-zeka',
    categoryLabel: 'AI & Technology',
    publishedAt: 'October 8, 2026',
    publishedIso: '2026-10-08',
    readingTime: '6 min read',
    coverTheme: 'ai',
    sections: [
      {
        id: 'otomasyonun-otesi',
        heading: 'Moving beyond operational automation',
        paragraphs: [
          'The first wave of digitalization focused on accelerating repetitive tasks. Today, AI uncovers meaningful patterns across large datasets to improve decision quality.',
        ],
      },
      {
        id: 'kurumsal-hazirlik',
        heading: 'Organizational readiness and governance',
        paragraphs: [
          'Successful implementations begin with transparent, measurable pilot initiatives that involve business units alongside technology teams.',
        ],
      },
    ],
  },
  {
    id: 'b8',
    slug: 'yapay-zeka-caginda-musteri-deneyimi-nasil-degisiyor',
    title: 'How Is Customer Experience Evolving in the Age of AI?',
    spot: 'As rapid response and personalization become baseline expectations, brands stand out through clarity, consistency, and meaningful communication.',
    categoryKey: 'yapay-zeka',
    categoryLabel: 'AI & Technology',
    publishedAt: 'October 1, 2026',
    publishedIso: '2026-10-01',
    readingTime: '4 min read',
    coverTheme: 'photo',
    sections: [
      {
        id: 'kisisellestirme-standardi',
        heading: 'Why customer expectations rose so quickly',
        paragraphs: [
          'Consumers now expect the same intuitive speed from financial and insurance institutions that they experience in everyday consumer digital products.',
        ],
      },
      {
        id: 'insan-ve-teknoloji',
        heading: 'Technology-enabled human touch',
        paragraphs: [
          'The strongest customer experiences emerge where AI-driven speed meets human empathy and advisory judgment at the moments that matter most.',
        ],
      },
    ],
  },
  {
    id: 'b9',
    slug: 'b2b-pazarlamada-lead-sayisindan-daha-onemli-olan-nedir',
    title: 'What Matters More Than Lead Volume in B2B Marketing?',
    spot: 'High inquiry volume does not always translate into healthy growth; ideal customer fit, lead quality, and sales conversion determine true ROI.',
    categoryKey: 'dijital-pazarlama',
    categoryLabel: 'Digital Marketing & Growth',
    publishedAt: 'September 24, 2026',
    publishedIso: '2026-09-24',
    readingTime: '5 min read',
    coverTheme: 'growth',
    sections: [
      {
        id: 'hacim-tuzagi',
        heading: 'The risk of optimizing solely for form fills',
        paragraphs: [
          'Chasing low-cost leads in B2B often overwhelms sales teams with unqualified conversations. The real priority is generating demand aligned with your ideal customer profile.',
        ],
      },
      {
        id: 'ticari-metrikler',
        heading: 'Measuring marketing by commercial outcomes',
        paragraphs: [
          'Tracking qualified meetings, sales cycle velocity, and customer lifetime value transforms marketing spend into a predictable growth investment.',
        ],
      },
    ],
  },
  {
    id: 'b10',
    slug: 'saas-urunlerinde-self-servis-satis-modeli-nasil-kurgulanir',
    title: 'How to Architect a Self-Service Sales Model for SaaS Products',
    spot: 'A frictionless self-service journey that lets users experience product value rapidly is one of the strongest levers for scalable SaaS growth.',
    categoryKey: 'dijital-pazarlama',
    categoryLabel: 'Product & Business Strategy',
    publishedAt: 'September 16, 2026',
    publishedIso: '2026-09-16',
    readingTime: '6 min read',
    coverTheme: 'growth',
    sections: [
      {
        id: 'deger-anina-hizli-erisim',
        heading: 'Shortening time-to-first-value',
        paragraphs: [
          'In self-service models, users need to understand and experience core value within minutes. Clear onboarding and crisp positioning directly elevate conversion.',
        ],
      },
      {
        id: 'urun-ve-pazarlama-uyumu',
        heading: 'Aligning landing pages, activation, and pricing',
        paragraphs: [
          'When marketing messaging matches the in-product experience seamlessly, buyers convert with confidence and require less manual support.',
        ],
      },
    ],
  },
  {
    id: 'b11',
    slug: 'pazarlama-ve-satis-ekipleri-neden-ayni-hedefe-odaklanmali',
    title: 'Why Marketing and Sales Teams Must Align Around a Shared Goal',
    spot: 'When marketing and sales chase separate metrics, growth stalls; shared data, shared language, and shared revenue targets accelerate the entire organization.',
    categoryKey: 'strateji-yonetim',
    categoryLabel: 'Management & Leadership',
    publishedAt: 'September 8, 2026',
    publishedIso: '2026-09-08',
    readingTime: '4 min read',
    coverTheme: 'strategy',
    sections: [
      {
        id: 'ortak-dil-eksikligi',
        heading: 'The disconnect created by siloed KPIs',
        paragraphs: [
          'When marketing focuses strictly on clicks and leads while sales focuses only on closed deals, crucial customer feedback gets lost between the two teams.',
        ],
      },
      {
        id: 'ortak-buyume-kulturu',
        heading: 'Building a unified revenue culture',
        paragraphs: [
          'Regular feedback loops, shared CRM visibility, and joint conversion targets turn marketing and sales into one cohesive growth engine.',
        ],
      },
    ],
  },
  {
    id: 'b12',
    slug: 'teknoloji-sirketlerinde-urun-pazarlamasinin-stratejik-rolu',
    title: 'The Strategic Role of Product Marketing in Technology Companies',
    spot: 'Strong engineering alone rarely guarantees market success; product marketing is the strategic bridge translating capabilities into customer value.',
    categoryKey: 'strateji-yonetim',
    categoryLabel: 'Product & Business Strategy',
    publishedAt: 'September 1, 2026',
    publishedIso: '2026-09-01',
    readingTime: '5 min read',
    coverTheme: 'strategy',
    sections: [
      {
        id: 'konumlandirma-gucu',
        heading: 'Why positioning changes everything',
        paragraphs: [
          'Customers do not buy feature checklists—they buy clear solutions to real business challenges. Product marketing forms the vital strategic link between product teams and the market.',
        ],
      },
      {
        id: 'pazara-giris-disiplini',
        heading: 'Go-to-market discipline and sustainable adoption',
        paragraphs: [
          'Sharp audience segmentation, clear value propositions, and sales-ready messaging architecture accelerate product adoption across target segments.',
        ],
      },
    ],
  },
];

export function getBlogData(lang: Language) {
  return lang === 'en'
    ? { filters: BLOG_FILTERS_EN, posts: BLOG_POSTS_EN }
    : { filters: BLOG_FILTERS, posts: BLOG_POSTS };
}
