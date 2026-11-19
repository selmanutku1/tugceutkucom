import {
  SimpleService,
  ProcessStep,
  ImpactHighlight,
  FaqItem,
  LinkedInPost,
} from '../types';

export const TUĞÇE_PROFILE = {
  name: 'Tuğçe Utku',
  role: 'Dijital Sigortacılık ve Sigorta CRM Danışmanı',
  email: 'iletisim@tugceutku.com',
  phone: '+90 546 825 35 97',
  whatsappNumber: '905468253597',
  linkedin: 'https://www.linkedin.com/in/tugceutku/',
  linkedinActivityUrl: 'https://www.linkedin.com/in/tugceutku/recent-activity/all/',
  location: 'İstanbul · Online & Yüz Yüze',
  bio: '8 yılı aşkın sigorta teknolojileri ve dijital büyüme deneyimimle, sigorta acentelerinin ve brokerların günlük iş yükünü azaltmasına, müşteri takibini düzenli hale getirmesine ve dijital kanallardan sürdürülebilir şekilde büyümesine eşlik ediyorum. Karmaşık teknik süreçleri sizin yerinize sadeleştiriyor, ekibinizin ilk günden kolayca kullanabileceği pratik sistemler kuruyorum.',
  focusAreas: [
    'Sigorta CRM kurulumu ve portföy düzeni',
    'Acente ve brokerlar için dijitalleşme ve online teklif süreçleri',
    'Müşteri takibi, yenileme hatırlatmaları ve ekip eğitimi',
  ],
};

export const SIMPLE_SERVICES: SimpleService[] = [
  {
    id: 'sigorta-crm',
    number: '01',
    title: 'Sigorta CRM Kurulumu ve Düzeni',
    summary:
      'Müşteri kayıtlarını, poliçe geçmişini ve yaklaşan yenilemeleri tek bir düzenli ekranda toplayarak dağınık tablolardan kurtulun.',
    highlights: [
      'Mevcut müşteri ve poliçe kayıtlarının güvenle aktarılması',
      'Her cihazdan kolayca erişilebilen düzenli çalışma alanı',
      'Ekibinizin hızla alışacağı sade kullanım ve birebir eğitim',
    ],
  },
  {
    id: 'acente-broker-dijitallesme',
    number: '02',
    title: 'Acente & Broker Dijitalleşmesi',
    summary:
      'Acente ve brokerlık yapınızı mesai saatleriyle sınırlı kalmayan, web sitesi ve WhatsApp üzerinden düzenli teklif toplayan modern bir düzene kavuşturun.',
    highlights: [
      'Güven veren, mobil uyumlu kurumsal acente ve broker web sitesi',
      'Müşterilerin kolayca ulaşabileceği hızlı teklif formları',
      'WhatsApp üzerinden düzenli teklif ve bilgilendirme akışı',
    ],
  },
  {
    id: 'yenileme-musteri-takibi',
    number: '03',
    title: 'Yenileme ve Müşteri Takibi',
    summary:
      'Poliçe vadesi yaklaşan müşterilerinizi zamanında hatırlatın; mevcut portföyünüzü korurken yeni fırsatları kaçırmayın.',
    highlights: [
      'Vade öncesi düzenli hatırlatma ve takip planı',
      'Mevcut müşterilere uygun ek sigorta önerileri',
      'Hasar ve talep süreçlerinde şeffaf müşteri iletişimi',
    ],
  },
  {
    id: 'dijital-buyume-egitim',
    number: '04',
    title: 'Dijital Büyüme ve Danışmanlık',
    summary:
      'Dijital kanallardan doğru müşterilere ulaşmanız için sade, ölçülebilir bir büyüme planı hazırlıyor ve süreç boyunca yanınızda oluyoruz.',
    highlights: [
      'Google ve sosyal medya üzerinden nitelikli müşteri kazanımı',
      'Aylık performans değerlendirmesi ve yol haritası',
      'Kurulum sonrası ekibinize düzenli destek ve danışmanlık',
    ],
  },
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: '01',
    title: 'Tanışma ve İhtiyaç Dinleme',
    description:
      '30 dakikalık ücretsiz ön görüşmede acente veya brokerlığınızın bugünkü çalışma düzenini, beklentilerini ve önceliklerini birlikte netleştiriyoruz.',
  },
  {
    step: '02',
    title: 'Sade ve Size Özel Plan',
    description:
      'Gereksiz karmaşadan uzak, yalnızca kurumunuza gerçekten fayda sağlayacak CRM ve dijitalleşme adımlarını belirliyoruz.',
  },
  {
    step: '03',
    title: 'Kurulum ve Birebir Eğitim',
    description:
      'Tüm kurulumları anahtar teslim tamamlıyor, ekibinizin sistemi rahatlıkla kullanabilmesi için birebir eğitim ve destek sunuyoruz.',
  },
];

export const IMPACT_HIGHLIGHTS: ImpactHighlight[] = [
  {
    value: '8+ Yıl',
    label: 'Sektör Deneyimi',
    context: 'Sigorta teknolojileri, acente ve broker danışmanlığı',
  },
  {
    value: '65+',
    label: 'Acente & Broker Dönüşümü',
    context: 'Başarıyla tamamlanan CRM ve dijitalleşme süreci',
  },
  {
    value: '%93',
    label: 'Yenileme Başarısı',
    context: 'Düzenli takip sistemine geçen acente ve broker ortalaması',
  },
  {
    value: '3–4 Hafta',
    label: 'Hızlı Geçiş',
    context: 'Planlamadan canlı kullanıma ve ekip eğitimine',
  },
];

export const FAQ_LIST: FaqItem[] = [
  {
    id: 'f1',
    question: 'Danışmanlık süreci nasıl başlıyor?',
    answer:
      'İlk adım olarak 30 dakikalık ücretsiz bir online tanışma görüşmesi yapıyoruz. Bu görüşmede acente veya brokerlığınızın ihtiyaçlarını dinliyor ve sizin için en uygun yol haritasını paylaşıyoruz.',
  },
  {
    id: 'f2',
    question: 'Sigorta CRM sistemine geçiş zor mu? Mevcut kayıtlarımız ne olur?',
    answer:
      'Hayır, geçiş sürecini sizin adınıza adım adım yönetiyoruz. Mevcut müşteri ve poliçe kayıtlarınız düzenli şekilde yeni sisteme aktarılır ve ekibinize birebir kullanım eğitimi verilir.',
  },
  {
    id: 'f3',
    question: 'Kurulum ne kadar sürer?',
    answer:
      'Acente veya brokerlığınızın kapsamına göre değişmekle birlikte, CRM kurulumu, dijital düzenlemeler ve ekip eğitimleri genellikle 3 ila 4 hafta içinde tamamlanır.',
  },
  {
    id: 'f4',
    question: 'Kurulum bittikten sonra destek almaya devam edebilir miyiz?',
    answer:
      'Evet. Kurulum sonrasında da ekibinizin soruları, yeni ihtiyaçları ve dijital büyüme hedefleriniz için düzenli danışmanlık desteği sağlamaya devam ediyoruz.',
  },
];

// Resmi LinkedIn embed linki (https://www.linkedin.com/embed/feed/update/urn:li:activity:...)
// eklendiğinde kart otomatik olarak canlı LinkedIn gönderisini gömer.
export const LINKEDIN_POSTS: LinkedInPost[] = [
  {
    id: 'li-1',
    topic: 'Sigorta CRM & Portföy Düzeni',
    title: 'Acente ve brokerlar için düzenli müşteri takibi neden ilk adım olmalı?',
    excerpt:
      'Yeni müşteri kazanmak kadar, mevcut portföyü kaybetmemek de büyümenin temelidir. Dağınık listeler yerine tek bir düzenli ekranda çalışmak her gün saatler kazandırır.',
    fullText:
      'Yeni müşteri kazanmak kadar, mevcut portföyü kaybetmemek de büyümenin temelidir. Dağınık listeler yerine tek bir düzenli ekranda çalışmak her gün saatler kazandırır. Düzenli bir CRM yapısına geçen acente ve brokerlarda ekip içi koordinasyon güçlenir, yaklaşan yenilemeler zamanında takip edilir ve müşteri memnuniyeti kalıcı olarak artar.',
    postUrl: 'https://www.linkedin.com/in/tugceutku/recent-activity/all/',
  },
  {
    id: 'li-2',
    topic: 'Acente & Broker Dijitalleşmesi',
    title: 'Mesai saatleri dışında gelen teklif taleplerini kaçırmamak',
    excerpt:
      'Sigorta müşterileri artık akşam saatlerinde ve hafta sonu da araştırma yapıyor. Sade bir web sitesi ve hızlı WhatsApp akışı ile 7/24 ulaşılabilir olmak büyük fark yaratıyor.',
    fullText:
      'Sigorta müşterileri artık akşam saatlerinde ve hafta sonu da araştırma yapıyor. Sade bir web sitesi ve hızlı WhatsApp akışı ile 7/24 ulaşılabilir olmak büyük fark yaratıyor. Müşteriye ilk dönüş yapan acente veya broker olmak, yalnızca satış oranını değil kuruma duyulan güveni de doğrudan yukarı taşır.',
    postUrl: 'https://www.linkedin.com/in/tugceutku/recent-activity/all/',
  },
  {
    id: 'li-3',
    topic: 'Yenileme ve Müşteri İletişimi',
    title: 'Poliçe yenileme zamanını müşteriden önce hatırlamak',
    excerpt:
      'Müşteriyle yalnızca poliçe kesilirken değil, yenileme öncesinde ve ihtiyaç anında temas kurmak uzun vadeli portföy bağlılığının en güçlü yoludur.',
    fullText:
      'Müşteriyle yalnızca poliçe kesilirken değil, yenileme öncesinde ve ihtiyaç anında temas kurmak uzun vadeli portföy bağlılığının en güçlü yoludur. Vade öncesi düzenli bilgilendirme ve doğru ek teminat önerileriyle hem yenileme oranları yükselir hem de mevcut müşterilerden gelen referanslar artar.',
    postUrl: 'https://www.linkedin.com/in/tugceutku/recent-activity/all/',
  },
];
