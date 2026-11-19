import {
  ExpertiseArea,
  ExperienceItem,
  ProjectItem,
  FaqCategory,
  LinkedInPost,
} from '../types';

export const BRAND_PROFILE = {
  name: 'Tuğçe Utku',
  positioning: 'Dijital Dönüşüm · Teknoloji · Strateji',
  shortTagline:
    'Dijital dönüşüm, teknoloji ve strateji üzerine profesyonel görüşler ve çalışmalar.',
  portraitUrl: '/assets/aistudio/tugce-utku_2f46d5a0.jpg',
  logoUrl: '/assets/aistudio/Gemini_Generated_Image_u0c53tu0c53tu0c5_9f641ea2.jpg',
  email: 'iletisim@tugceutku.com',
  phone: '+90 546 825 35 97',
  whatsappNumber: '905468253597',
  linkedin: 'https://www.linkedin.com/in/tugceutku/',
  linkedinActivityUrl: 'https://www.linkedin.com/in/tugceutku/recent-activity/all/',
};

export const EXPERTISE_AREAS: ExpertiseArea[] = [
  {
    id: 'dijital-pazarlama-ve-buyume',
    number: '01',
    title: 'Dijital Pazarlama ve Büyüme',
    homeSummary:
      'SEO, performans pazarlaması, dijital reklam yönetimi, dönüşüm optimizasyonu, müşteri kazanımı ve dijital marka stratejileri.',
    pageIntro:
      'Dijital kanalları yalnızca görünürlük sağlayan araçlar olarak değil, müşteri kazanımı ve ticari büyümenin önemli bileşenleri olarak değerlendiriyorum.',
    bullets: [
      'SEO ve organik büyüme stratejileri',
      'Google Ads ve performans pazarlaması',
      'Meta Ads ve potansiyel müşteri kazanımı',
      'Dönüşüm optimizasyonu',
      'GA4 ve performans analizi',
      'İçerik ve marka iletişimi',
      'Dijital pazarlama performans yönetimi',
    ],
  },
  {
    id: 'urun-ve-buyume-stratejisi',
    number: '02',
    title: 'Ürün ve Büyüme Stratejisi',
    homeSummary:
      'Ürün konumlandırması, ürün pazarlaması, SaaS büyüme modelleri, pazara giriş stratejileri ve self-servis satış süreçleri.',
    pageIntro:
      'Dijital ürünlerin hedef kitlesiyle doğru noktada buluşması, sürdürülebilir büyüme açısından kritik öneme sahip.',
    bullets: [
      'Ürün konumlandırması',
      'Ürün pazarlama stratejisi',
      'Pazara giriş planlaması',
      'SaaS iş modelleri',
      'Self-servis satış modelleri',
      'Kullanıcı kazanımı ve aktivasyonu',
      'Landing page ve satış hunisi optimizasyonu',
    ],
  },
  {
    id: 'sigortacilik-teknolojileri-ve-yapay-zeka',
    number: '03',
    title: 'Sigortacılık Teknolojileri ve Yapay Zekâ',
    homeSummary:
      'Dijital sigortacılık, Insurtech, sigorta CRM sistemleri, online satış platformları, yapay zekâ uygulamaları ve sektörel dijital dönüşüm.',
    pageIntro:
      'Sigorta sektörünün teknolojiyle dönüşümünü, operasyonel süreçlerden müşteri deneyimine kadar bütünsel bir perspektifle ele alıyorum.',
    bullets: [
      'Dijital sigortacılık',
      'Sigorta CRM sistemleri',
      'Online sigorta satış platformları',
      'Sigorta acentelerinin ve brokerların dijitalleşmesi',
      'Bankasürans teknolojileri',
      'API ve entegrasyon ekosistemi',
      'Yapay zekâ destekli sigortacılık uygulamaları',
      'Sigortacılıkta veri analitiği ve otomasyon',
    ],
  },
  {
    id: 'stratejik-yonetim-ve-is-gelistirme',
    number: '04',
    title: 'Stratejik Yönetim ve İş Geliştirme',
    homeSummary:
      'Ajans yönetimi, ekip koordinasyonu, B2B pazarlama, satış stratejileri, iş ortaklıkları ve operasyonel süreç yönetimi.',
    pageIntro:
      'Dijital projelerin başarıya ulaşmasında ekip, süreç ve hedef yönetiminin birlikte ele alınması gerektiğine inanıyorum.',
    bullets: [
      'Ajans ve operasyon yönetimi',
      'Ekip koordinasyonu',
      'B2B pazarlama ve satış stratejileri',
      'İş geliştirme',
      'Proje yönetimi',
      'İş ortaklıkları',
      'KPI ve performans yönetimi',
    ],
  },
];

export const APPROACH_PILLARS = [
  {
    title: 'Strateji',
    description: 'Doğru hedefleri ve öncelikleri belirlemek.',
  },
  {
    title: 'Teknoloji',
    description: 'İş süreçlerini geliştiren çözümleri değerlendirmek.',
  },
  {
    title: 'Ölçüm',
    description: 'Gerçek performansı veriler üzerinden analiz etmek.',
  },
];

export const ABOUT_PRINCIPLES = [
  {
    title: 'Veri Odaklı Düşünme',
    description:
      'Kararları ölçülebilir göstergeler, kullanıcı davranışları ve performans verileri üzerinden değerlendirmek.',
  },
  {
    title: 'Stratejik Bakış',
    description:
      'Kısa vadeli kazanımların yanında uzun vadeli değer üretimine odaklanmak.',
  },
  {
    title: 'Teknoloji ve İnovasyon',
    description:
      'Yeni teknolojileri iş süreçleri ve müşteri deneyimi açısından değerlendirmek.',
  },
  {
    title: 'Bütünsel Pazarlama',
    description:
      'Ürün, pazarlama, satış ve müşteri deneyimini ortak bir büyüme yaklaşımında birleştirmek.',
  },
];

export const EXPERIENCE_LIST: ExperienceItem[] = [
  {
    id: 'acerpro',
    organization: 'AcerPro',
    roleArea: 'Teknoloji ve Dijital Çözümler',
    summary:
      'Dijital teknoloji ve sigortacılık ekosistemine yönelik projelerde ajans yönetimi, dijital pazarlama, müşteri süreçleri ve proje koordinasyonu alanlarında sorumluluk aldım.',
    listTitle: 'Öne çıkan sorumluluk alanları',
    responsibilities: [
      'Dijital pazarlama stratejilerinin oluşturulması',
      'Ajans operasyonlarının ve ekip süreçlerinin yönetimi',
      'Marka ve müşteri iletişimi',
      'Dijital projelerin koordinasyonu',
      'Performans ve iş süreçlerinin takibi',
    ],
  },
  {
    id: 'acercrea',
    organization: 'AcerCrea',
    roleArea: 'Dijital Sigortacılık Ajansı',
    summary:
      'Sigorta sektörüne yönelik dijital pazarlama ve dijital çözümler kapsamında ajans yönetimi ve müşteri operasyonları süreçlerinde sorumluluk üstlendim.',
    listTitle: 'Öne çıkan sorumluluk alanları',
    responsibilities: [
      'Dijital pazarlama hizmetlerinin yönetimi',
      'SEO ve reklam stratejileri',
      'Müşteri ve proje yönetimi',
      'Sosyal medya ve içerik stratejileri',
      'Ekip koordinasyonu',
    ],
  },
  {
    id: 'insurup',
    organization: 'InsurUp',
    roleArea: 'Sigortacılık Teknolojileri',
    summary:
      'Sigorta sektörüne yönelik SaaS ve dijital satış çözümlerinin pazarlama, konumlandırma ve büyüme süreçlerinde çalışmalar yürüttüm.',
    listTitle: 'Öne çıkan çalışma alanları',
    responsibilities: [
      'Ürün pazarlaması',
      'Dijital müşteri kazanımı',
      'Self-servis satış stratejileri',
      'B2B pazarlama ve satış desteği',
      'Dijital ürün konumlandırması',
    ],
  },
];

// Konu bazlı proje anlatımı (özel ürün adı yerine çalışma odağı öne çıkarılır)
export const PROJECT_ITEMS: ProjectItem[] = [
  {
    id: 'sigorta-crm-ve-dijital-satis',
    number: '01',
    topicTitle: 'Sigorta CRM ve Dijital Satış Platformları',
    tagline: 'Dijital sigortacılık için yeni nesil teknoloji ve büyüme kurgusu.',
    homeSummary:
      'Sigorta sektörüne yönelik CRM, dijital satış platformları ve teknoloji çözümleri üzerine ürün pazarlaması ve büyüme çalışmaları.',
    detailDescription:
      'Sigorta acentelerinin ve brokerların dijital operasyonlarını ve online satış süreçlerini destekleyen CRM, karşılaştırmalı teklif ve entegrasyon çözümleri kapsamında ürün konumlandırma, self-servis satış yaklaşımı ve dijital büyüme çalışmaları.',
    focusAreas: [
      'Ürün pazarlaması ve konumlandırma',
      'Dijital büyüme stratejisi',
      'Self-servis satış yaklaşımı',
      'Potansiyel müşteri kazanımı',
      'Dijital iletişim ve pazarlama süreçleri',
    ],
  },
  {
    id: 'teknoloji-ve-dijital-operasyon',
    number: '02',
    topicTitle: 'Teknoloji ve Dijital Çözüm Operasyonları',
    tagline: 'Teknoloji ve dijital pazarlama için bütünsel operasyon yönetimi.',
    homeSummary:
      'Dijital teknoloji, sigortacılık çözümleri, ajans operasyonları ve dijital pazarlama projeleri.',
    detailDescription:
      'Teknoloji, dijital pazarlama ve sektörel çözümleri bir araya getiren kurumsal projelerde ajans yönetimi, marka iletişimi, müşteri deneyimi ve çok disiplinli dijital operasyon süreçlerinin uçtan uca koordinasyonu.',
    focusAreas: [
      'Dijital pazarlama',
      'Marka yönetimi',
      'Proje koordinasyonu',
      'Müşteri deneyimi',
      'Dijital hizmet süreçleri',
    ],
  },
  {
    id: 'bankasurans-ve-sektorel-ekosistem',
    number: '03',
    topicTitle: 'Bankasürans ve Sektörel Ekosistem İletişimi',
    tagline: 'Bankacılık ve sigortacılık ekosisteminde sektörel etkileşim.',
    homeSummary:
      'Bankacılık ve sigortacılık ekosistemine yönelik sektörel iletişim, içerik ve organizasyon çalışmaları.',
    detailDescription:
      'Bankacılık ve sigortacılık sektörünün dönüşümüne odaklanan zirve ve sektörel buluşmalar kapsamında içerik stratejisi, dijital tanıtım, etkinlik iletişimi ve üst düzey sektör görünürlüğü çalışmaları.',
    focusAreas: [
      'Etkinlik iletişimi',
      'Dijital tanıtım',
      'İçerik stratejisi',
      'Sektörel görünürlük',
    ],
  },
  {
    id: 'yapay-zeka-ve-sigortacilik',
    number: '04',
    topicTitle: 'Yapay Zekâ ve Sigortacılık',
    tagline: 'Sigortacılığın geleceğinde yapay zekânın stratejik rolü.',
    homeSummary:
      'Yapay zekânın sigorta sektöründeki kullanım alanları, dijital müşteri deneyimi ve teknolojik dönüşüm üzerine araştırma, analiz ve içerik çalışmaları.',
    detailDescription:
      'Yapay zekânın sigorta sektöründeki uygulama alanları, veri analitiği, operasyonel otomasyon, akıllı karar destek sistemleri ve dijital müşteri deneyimi üzerine sektörel araştırma, analiz ve içgörü çalışmaları.',
    focusAreas: [
      'Yapay zekâ uygulamalarının sektörel analizi',
      'Sigortacılıkta otomasyon',
      'Dijital müşteri deneyimi',
      'Teknoloji ve iş süreçlerinin dönüşümü',
      'Sektörel içgörü ve analiz üretimi',
    ],
  },
];

export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: 'danismanlik-ve-strateji',
    title: 'Danışmanlık ve Strateji',
    description:
      'Dijital büyüme, pazarlama stratejisi, ürün konumlandırması ve çalışma modelleri hakkında sorular.',
    icon: 'compass',
    questions: [
      {
        id: 'soru-1',
        number: 1,
        question: 'Hangi alanlarda danışmanlık desteği sunuyorsunuz?',
        answer:
          'Dijital pazarlama stratejisi, dijital büyüme, ürün pazarlaması, Insurtech, sigortacılıkta dijital dönüşüm ve iş geliştirme alanlarında stratejik değerlendirme ve danışmanlık desteği sunuyorum. Çalışmanın kapsamı, kurumun ihtiyaçlarına ve hedeflerine göre belirleniyor.',
      },
      {
        id: 'soru-2',
        number: 2,
        question: 'Dijital pazarlama danışmanlığı kapsamında hangi konular ele alınıyor?',
        answer:
          'Dijital pazarlama hedeflerinin belirlenmesi, SEO ve performans pazarlaması, reklam stratejileri, müşteri kazanımı, dönüşüm optimizasyonu ve performans ölçümleme süreçleri değerlendiriliyor. Amaç, dijital kanalların ticari hedeflerle uyumlu çalışmasını sağlamak.',
      },
      {
        id: 'soru-3',
        number: 3,
        question: 'Şirketlere dijital dönüşüm konusunda nasıl destek sağlıyorsunuz?',
        answer:
          'Öncelikle mevcut dijital süreçler, iş hedefleri ve gelişim alanları değerlendiriliyor. Ardından teknoloji kullanımı, dijital kanallar, müşteri deneyimi ve operasyonel süreçler açısından stratejik öneriler oluşturuluyor.',
      },
      {
        id: 'soru-4',
        number: 4,
        question: 'Ürün pazarlaması danışmanlığı hangi konuları kapsıyor?',
        answer:
          'Ürün konumlandırması, hedef kitle analizi, değer önerisi, pazara giriş stratejisi, ürün iletişimi, kullanıcı kazanımı ve büyüme modellerini kapsıyor. Özellikle dijital ürünler ve SaaS iş modelleri üzerine odaklanıyorum.',
      },
      {
        id: 'soru-5',
        number: 5,
        question: 'İşletmem için dijital büyüme stratejisi oluşturabilir misiniz?',
        answer:
          'Evet. İşletmenin mevcut durumu, hedef kitlesi, rekabet ortamı ve büyüme hedefleri değerlendirilerek dijital kanallar, müşteri kazanımı ve performans ölçümüne dayalı bir strateji çerçevesi oluşturulabilir.',
      },
      {
        id: 'soru-6',
        number: 6,
        question: 'Danışmanlık süreci nasıl ilerliyor?',
        answer:
          'Süreç ön görüşmeyle başlıyor. İhtiyaçlar ve beklentiler netleştirildikten sonra çalışma kapsamı belirleniyor. Kapsama göre analiz, strateji geliştirme, yol haritası oluşturma ve değerlendirme aşamaları yürütülüyor.',
      },
      {
        id: 'soru-7',
        number: 7,
        question: 'Danışmanlık çalışmaları uzaktan gerçekleştirilebilir mi?',
        answer:
          'Evet. İhtiyaca ve projenin kapsamına bağlı olarak çevrim içi toplantılar ve dijital çalışma yöntemleriyle süreç yürütülebilir.',
      },
      {
        id: 'soru-8',
        number: 8,
        question: 'Danışmanlık çalışmaları proje bazlı mı, sürekli mi ilerliyor?',
        answer:
          'Her iki model de değerlendirilebilir. Tek seferlik stratejik analiz, belirli bir proje için danışmanlık veya dönemsel stratejik destek seçenekleri çalışmanın kapsamına göre belirlenir.',
      },
    ],
  },
  {
    id: 'sigortacilik-ve-insurtech',
    title: 'Sigortacılık ve Insurtech',
    description:
      'Sigorta acenteleri, brokerlar, CRM teknolojileri ve sigortacılıkta yapay zekâ uygulamaları.',
    icon: 'shield',
    questions: [
      {
        id: 'soru-9',
        number: 9,
        question: 'Sigorta sektöründe hangi konularda danışmanlık sağlıyorsunuz?',
        answer:
          'Dijital sigortacılık, sigorta acentelerinin ve brokerların dijitalleşmesi, CRM teknolojileri, online satış süreçleri, dijital müşteri deneyimi ve sigortacılıkta pazarlama stratejileri üzerine çalışıyorum.',
      },
      {
        id: 'soru-10',
        number: 10,
        question: 'Sigorta acenteleri ve brokerlar için dijital büyüme stratejisi oluşturulabilir mi?',
        answer:
          'Evet. Kurumun mevcut dijital varlığı, hedef müşteri kitlesi, ürün portföyü, online satış altyapısı ve pazarlama süreçleri değerlendirilerek gelişim alanları belirlenebilir.',
      },
      {
        id: 'soru-11',
        number: 11,
        question: 'Sigortacılıkta yapay zekâ hangi alanlarda kullanılabilir?',
        answer:
          'Yapay zekâ; müşteri iletişimi, belge işleme, risk değerlendirmesi, teklif süreçleri, veri analizi ve operasyonel otomasyon gibi alanlarda kullanılabilir. Uygulamanın değeri, kurumun ihtiyaçlarına ve veri altyapısına bağlıdır.',
      },
      {
        id: 'soru-12',
        number: 12,
        question: 'Sigorta şirketleri ve teknoloji şirketleriyle iş birlikleri yapıyor musunuz?',
        answer:
          'Sigortacılık, teknoloji ve dijital büyüme alanlarında profesyonel iş birlikleri değerlendirilebilir. Her çalışma için tarafların hedefleri, sorumlulukları ve proje kapsamı ayrıca belirlenir.',
      },
    ],
  },
  {
    id: 'urun-ve-teknoloji',
    title: 'Ürün ve Teknoloji',
    description:
      'SaaS büyüme modelleri, pazara giriş stratejileri ve dijital performans ölçümleme süreçleri.',
    icon: 'cpu',
    questions: [
      {
        id: 'soru-13',
        number: 13,
        question: 'SaaS ürünlerinin pazarlama ve büyüme süreçlerinde destek sağlıyor musunuz?',
        answer:
          'Evet. SaaS ürünlerinde konumlandırma, hedef kitle belirleme, ürün pazarlaması, müşteri kazanımı, self-servis satış modelleri ve dönüşüm optimizasyonu üzerine stratejik çalışmalar yürütülebilir.',
      },
      {
        id: 'soru-14',
        number: 14,
        question: 'Yeni bir dijital ürün için pazara giriş stratejisi hazırlanabilir mi?',
        answer:
          'Ürünün değer önerisi, hedef kitlesi, rekabet ortamı, fiyatlandırma yaklaşımı ve pazarlama kanalları değerlendirilerek pazara giriş yol haritası oluşturulabilir.',
      },
      {
        id: 'soru-15',
        number: 15,
        question: 'Dijital pazarlama performansı nasıl değerlendiriliyor?',
        answer:
          'Trafik, potansiyel müşteri, dönüşüm oranı, müşteri edinme maliyeti, reklam getirisi ve satış performansı gibi göstergeler birlikte ele alınıyor. Ölçümleme, yalnızca kanal performansına değil, ticari sonuçlara da odaklanıyor.',
      },
    ],
  },
  {
    id: 'iletisim-ve-is-birligi',
    title: 'İletişim ve İş Birliği',
    description:
      'Profesyonel iş birlikleri, konuşmacılık davetleri ve doğrudan iletişim kanalları.',
    icon: 'message',
    questions: [
      {
        id: 'soru-16',
        number: 16,
        question: 'Danışmanlık veya iş birliği talebi için nasıl iletişime geçebilirim?',
        answer:
          'Web sitesindeki iletişim formunu kullanabilir veya LinkedIn üzerinden bağlantı kurabilirsiniz. Talebinizin konusu ve hedefi hakkında kısa bilgi paylaşmanız, görüşmenin daha verimli ilerlemesini sağlar.',
      },
    ],
  },
];

export const CONTACT_CATEGORIES = [
  'Danışmanlık talepleri',
  'Dijital büyüme ve strateji',
  'Ürün ve teknoloji projeleri',
  'Sigortacılık ve Insurtech',
  'Etkinlik ve konuşmacılık davetleri',
  'Röportaj ve yayın talepleri',
  'Profesyonel iş birlikleri',
];

export const LINKEDIN_POSTS: LinkedInPost[] = [
  {
    id: 'li-1',
    topic: 'Dijital Dönüşüm · Strateji',
    title: 'Dijitalleşmek ile gerçekten dönüşmek arasındaki temel fark',
    excerpt:
      'Yeni bir yazılım kullanmaya başlamak dijitalleşmenin yalnızca ilk adımıdır. Gerçek dönüşüm; karar alma kültürünü, müşteri deneyimini ve iş hedeflerini ortak bir stratejide buluşturmakla başlar.',
    fullText:
      'Yeni bir yazılım kullanmaya başlamak dijitalleşmenin yalnızca ilk adımıdır. Gerçek dönüşüm; karar alma kültürünü, müşteri deneyimini ve iş hedeflerini ortak bir stratejide buluşturmakla başlar. Teknoloji doğru stratejiyle desteklenmediğinde araçlar değişir ama iş sonuçları aynı kalır.',
    postUrl: 'https://www.linkedin.com/in/tugceutku/recent-activity/all/',
  },
  {
    id: 'li-2',
    topic: 'Insurtech · Sigorta CRM',
    title: 'Sigorta acenteleri ve brokerlar için CRM neden artık bir büyüme altyapısıdır?',
    excerpt:
      'Sigorta aracılarında sürdürülebilir büyüme yalnızca yeni teklif üretmekle değil, mevcut portföyü verilerle okumak ve doğru zamanda temas kurmakla mümkün oluyor.',
    fullText:
      'Sigorta aracılarında sürdürülebilir büyüme yalnızca yeni teklif üretmekle değil, mevcut portföyü verilerle okumak ve doğru zamanda temas kurmakla mümkün oluyor. Düzenli bir CRM yaklaşımı hem yenileme performansını korur hem de çapraz satış fırsatlarını görünür kılar.',
    postUrl: 'https://www.linkedin.com/in/tugceutku/recent-activity/all/',
  },
  {
    id: 'li-3',
    topic: 'Yapay Zekâ · Müşteri Deneyimi',
    title: 'Sigortacılıkta yapay zekâ: Otomasyondan akıllı karar sistemlerine',
    excerpt:
      'Yapay zekâ sigortacılıkta yalnızca operasyonel hız kazandırmıyor; risk analizinden müşteri deneyimine kadar karar kalitesini yeniden tanımlıyor.',
    fullText:
      'Yapay zekâ sigortacılıkta yalnızca operasyonel hız kazandırmıyor; risk analizinden müşteri deneyimine kadar karar kalitesini yeniden tanımlıyor. Önemli olan teknolojiyi tek başına konuşmak değil, hangi iş probleminde ölçülebilir değer ürettiğini netleştirmektir.',
    postUrl: 'https://www.linkedin.com/in/tugceutku/recent-activity/all/',
  },
];
