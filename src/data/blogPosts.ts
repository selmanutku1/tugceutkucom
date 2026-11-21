import { BlogCategoryKey, BlogPost } from '../types';

export const BLOG_FILTERS: { key: 'all' | BlogCategoryKey; label: string }[] = [
  { key: 'all', label: 'Tüm Yazılar' },
  { key: 'dijital-donusum', label: 'Dijital Dönüşüm' },
  { key: 'insurtech', label: 'Insurtech' },
  { key: 'yapay-zeka', label: 'Yapay Zekâ' },
  { key: 'dijital-pazarlama', label: 'Dijital Pazarlama' },
  { key: 'strateji-yonetim', label: 'Strateji ve Yönetim' },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'b1',
    slug: 'dijital-donusumun-merkezinde-teknoloji-ve-dogru-strateji-var',
    title: 'Dijital Dönüşümün Merkezinde Teknoloji ve Doğru Strateji Var',
    spot: 'Teknoloji yatırımları tek başına dönüşüm yaratmaz; kalıcı etki için iş hedefleri, müşteri deneyimi ve ölçülebilir stratejinin aynı eksende buluşması gerekir.',
    categoryKey: 'dijital-donusum',
    categoryLabel: 'Dijital Dönüşüm',
    tags: ['Dijital Dönüşüm', 'Strateji', 'Teknoloji', 'Kurumsal Büyüme'],
    publishedAt: '14 Kasım 2026',
    publishedIso: '2026-11-14',
    readingTime: '5 dk okuma',
    coverTheme: 'photo',
    featured: true,
    sections: [
      {
        id: 'neden-strateji',
        heading: 'Teknoloji neden tek başına yeterli değildir?',
        paragraphs: [
          'Kurumların dijital dönüşüm yolculuğunda en sık karşılaşılan yanılgı, yeni yazılımlar veya araçlar satın alındığında dönüşümün tamamlandığını düşünmektir. Oysa teknoloji yalnızca bir kaldıraçtır; yönü belirleyen unsur iş stratejisidir.',
          'Açık bir iş hedefi ve süreç sahipliği tanımlanmadığında, en gelişmiş dijital sistemler bile günlük operasyonun bir parçası haline gelemez.',
        ],
      },
      {
        id: 'uc-temel-bilesen',
        heading: 'Sürdürülebilir dönüşümün üç temel bileşeni',
        paragraphs: [
          'Başarılı dijital dönüşüm projelerinde strateji, teknoloji ve ölçüm birbirini tamamlayan bir döngü içinde çalışır. Öncelikle hangi iş probleminin çözüleceği netleştirilir; ardından bu probleme en uygun sade teknoloji mimarisi seçilir.',
          'Son aşamada ise veriye dayalı performans göstergeleriyle sürecin ticari katkısı düzenli olarak takip edilir.',
        ],
      },
      {
        id: 'yoneticiler-icin-yol-haritasi',
        heading: 'Karar vericiler için başlangıç noktası',
        paragraphs: [
          'Dönüşüme büyük ve karmaşık projelerle değil, müşteri deneyimine veya operasyonel verimliliğe doğrudan etki eden öncelikli adımlarla başlamak ekip adaptasyonunu hızlandırır ve yatırım getirisini görünür kılar.',
        ],
      },
    ],
  },
  {
    id: 'b2',
    slug: 'yapay-zeka-sigortacilik-sektorunu-nasil-donusturuyor',
    title: 'Yapay Zekâ Sigortacılık Sektörünü Nasıl Dönüştürüyor?',
    spot: 'Müşteri iletişiminden hasar ve belge analizine kadar yapay zekâ uygulamaları, sigortacılıkta hız, doğruluk ve karar kalitesini yeniden şekillendiriyor.',
    categoryKey: 'yapay-zeka',
    categoryLabel: 'Yapay Zekâ ve Teknoloji',
    tags: ['Yapay Zekâ', 'Sigortacılık', 'Otomasyon', 'Veri Analitiği'],
    publishedAt: '9 Kasım 2026',
    publishedIso: '2026-11-09',
    readingTime: '6 dk okuma',
    coverTheme: 'ai',
    sections: [
      {
        id: 'sigortacilikta-yeni-donem',
        heading: 'Sigortacılıkta yeni bir verimlilik dönemi',
        paragraphs: [
          'Sigorta sektörü doğası gereği yüksek veri hacmi, belge yönetimi ve risk değerlendirmesi üzerine kuruludur. Yapay zekâ uygulamaları tam da bu noktalarda operasyonel yükü azaltarak ekiplerin daha stratejik işlere odaklanmasını sağlıyor.',
        ],
      },
      {
        id: 'somut-kullanim-alanlari',
        heading: 'En güçlü kullanım alanları nelerdir?',
        paragraphs: [
          'Müşteri sorularına hızlı yanıt veren dijital asistanlar, poliçe ve hasar belgelerinin incelenmesi, yenileme eğilimlerinin analizi ve kişiselleştirilmiş ürün önerileri yapay zekânın kısa vadede değer ürettiği başlıca alanlar arasında yer alıyor.',
        ],
      },
      {
        id: 'veri-altyapisi-onemi',
        heading: 'Veri kalitesi olmadan yapay zekâ stratejisi kurulamaz',
        paragraphs: [
          'Yapay zekâ yatırımlarından gerçek sonuç alabilmek için öncelikle temiz, düzenli ve erişilebilir bir müşteri ve poliçe veri altyapısı oluşturmak gerekir. Bu nedenle CRM disiplini, yapay zekâ dönüşümünün temel ön koşuludur.',
        ],
      },
    ],
  },
  {
    id: 'b3',
    slug: 'sigorta-sektorunde-crm-teknolojilerinin-stratejik-onemi',
    title: 'Sigorta Sektöründe CRM Teknolojilerinin Stratejik Önemi',
    spot: 'Sigorta acenteleri ve brokerlar için CRM yalnızca bir kayıt defteri değil; portföy koruma, yenileme başarısı ve çapraz satışın merkezidir.',
    categoryKey: 'insurtech',
    categoryLabel: 'Insurtech ve Dijital Sigortacılık',
    tags: ['Sigorta CRM', 'Acente', 'Broker', 'Portföy Yönetimi'],
    publishedAt: '3 Kasım 2026',
    publishedIso: '2026-11-03',
    readingTime: '5 dk okuma',
    coverTheme: 'insurtech',
    sections: [
      {
        id: 'daginik-veriden-butunsel-gorunume',
        heading: 'Dağınık tablolardan bütünsel portföy yönetimine',
        paragraphs: [
          'Geleneksel yöntemlerle yönetilen müşteri kayıtları, ekip büyüdükçe kontrol edilmesi zor bir yapıya dönüşür. Yaklaşan poliçe vadelerinin takip edilememesi ve geçmiş iletişim kayıtlarının kaybolması doğrudan portföy kaybına yol açar.',
        ],
      },
      {
        id: 'yenileme-ve-capraz-satis',
        heading: 'Yenileme ve çapraz satışta düzenli sistemin gücü',
        paragraphs: [
          'Sigorta sektörüne özel kurgulanmış CRM altyapıları, müşterinin tüm poliçe geçmişini tek ekranda sunarak doğru zamanda doğru ürün önerisi geliştirilmesini kolaylaştırır.',
        ],
      },
      {
        id: 'ekip-verimliligi',
        heading: 'Ekip koordinasyonu ve ölçülebilir yönetim',
        paragraphs: [
          'Yöneticiler için anlık üretim, teklif dönüşüm oranı ve danışman performansını görebilmek, sezgi yerine veriye dayalı karar almayı mümkün kılar.',
        ],
      },
    ],
  },
  {
    id: 'b4',
    slug: 'dijitallesmek-ile-gercekten-donusmek-arasindaki-fark',
    title: 'Dijitalleşmek ile Gerçekten Dönüşmek Arasındaki Fark',
    spot: 'Süreçleri yalnızca dijital ortama taşımak hız kazandırır; gerçek dönüşüm ise iş modelini, kültürü ve müşteri değerini yeniden tasarlamakla gerçekleşir.',
    categoryKey: 'dijital-donusum',
    categoryLabel: 'Dijital Dönüşüm',
    tags: ['Dijital Dönüşüm', 'İş Modeli', 'Süreç Tasarımı'],
    publishedAt: '28 Ekim 2026',
    publishedIso: '2026-10-28',
    readingTime: '4 dk okuma',
    coverTheme: 'transformation',
    sections: [
      {
        id: 'kagit-yerine-ekran',
        heading: 'Kağıt yerine ekran kullanmak dönüşüm müdür?',
        paragraphs: [
          'Pek çok kurum mevcut alışkanlıklarını değiştirmeden yalnızca yeni yazılımlar kullanarak dijitalleştiğini varsayar. Ancak verimsiz bir süreç dijitalleştirildiğinde, yalnızca daha hızlı çalışan verimsiz bir süreç elde edilir.',
        ],
      },
      {
        id: 'is-modeli-perspektifi',
        heading: 'Müşteri odaklı yeniden tasarım',
        paragraphs: [
          'Gerçek dönüşüm, müşterinin hizmete ulaşma biçimini sadeleştirmek, karar mekanizmalarını veriyle beslemek ve ekipler arası duvarları kaldırmakla başlar.',
        ],
      },
    ],
  },
  {
    id: 'b5',
    slug: 'sigortacilikta-dijital-donusum-teknolojiden-daha-fazlasi',
    title: 'Sigortacılıkta Dijital Dönüşüm: Teknolojiden Daha Fazlası',
    spot: 'Sigorta şirketlerinden acente ve brokerlara kadar tüm ekosistemde rekabet avantajı, teknolojiyi güven ve danışmanlık deneyimiyle birleştirmekten geçiyor.',
    categoryKey: 'insurtech',
    categoryLabel: 'Insurtech ve Dijital Sigortacılık',
    tags: ['Insurtech', 'Dijital Sigortacılık', 'Müşteri Deneyimi'],
    publishedAt: '21 Ekim 2026',
    publishedIso: '2026-10-21',
    readingTime: '5 dk okuma',
    coverTheme: 'insurtech',
    sections: [
      {
        id: 'guven-ve-hiz-dengesi',
        heading: 'Sigortacılıkta güven ve hız dengesi',
        paragraphs: [
          'Sigorta müşterileri bir yandan saniyeler içinde şeffaf teklif görmek isterken, diğer yandan hasar veya karar anında güven duyabilecekleri bir uzmanla iletişim kurmayı bekliyor.',
        ],
      },
      {
        id: 'hibrit-deneyim',
        heading: 'Hibrit müşteri deneyiminin yükselişi',
        paragraphs: [
          'Dijital self-servis kolaylığı ile insan uzmanlığını dengeli biçimde birleştiren kurumlar, yalnızca fiyat rekabetine sıkışmadan kalıcı müşteri bağlılığı oluşturuyor.',
        ],
      },
    ],
  },
  {
    id: 'b6',
    slug: 'sigorta-acenteleri-icin-dijitallesmenin-yeni-donemi',
    title: 'Sigorta Acenteleri İçin Dijitalleşmenin Yeni Dönemi',
    spot: 'Yeni nesil müşteri beklentileri, acente ve brokerların dijital görünürlükten online teklif süreçlerine kadar çalışma biçimlerini yeniden kurgulamasını gerektiriyor.',
    categoryKey: 'insurtech',
    categoryLabel: 'Insurtech ve Dijital Sigortacılık',
    tags: ['Acente', 'Broker', 'Online Satış', 'Sigorta CRM'],
    publishedAt: '15 Ekim 2026',
    publishedIso: '2026-10-15',
    readingTime: '5 dk okuma',
    coverTheme: 'insurtech',
    sections: [
      {
        id: 'musteri-davranislari',
        heading: 'Değişen sigorta müşterisi profili',
        paragraphs: [
          'Artık pek çok sigortalı ilk araştırmasını arama motorları ve dijital kanallar üzerinden yapıyor. Mesai saatleri dışında da erişilebilir olan acenteler ve brokerlar önemli bir avantaj yakalıyor.',
        ],
      },
      {
        id: 'pratik-adimlar',
        heading: 'Acente ve brokerlar için öncelikli dijital adımlar',
        paragraphs: [
          'Güven veren bir web sitesi, düzenli CRM kullanımı, otomatik yenileme takibi ve hedefli dijital iletişim; karmaşık yatırımlar gerektirmeden ölçülebilir büyüme sağlayan temel adımlardır.',
        ],
      },
    ],
  },
  {
    id: 'b7',
    slug: 'sigortacilikta-yapay-zeka-otomasyondan-akilli-karar-sistemlerine',
    title: 'Sigortacılıkta Yapay Zekâ: Otomasyondan Akıllı Karar Sistemlerine',
    spot: 'Rutin süreçlerin otomasyonu yalnızca başlangıç; asıl değer, yapay zekânın risk, fiyatlandırma ve portföy kararlarını destekleyen stratejik bir katmana dönüşmesiyle ortaya çıkıyor.',
    categoryKey: 'yapay-zeka',
    categoryLabel: 'Yapay Zekâ ve Teknoloji',
    tags: ['Yapay Zekâ', 'Karar Sistemleri', 'Risk Analizi', 'Insurtech'],
    publishedAt: '8 Ekim 2026',
    publishedIso: '2026-10-08',
    readingTime: '6 dk okuma',
    coverTheme: 'ai',
    sections: [
      {
        id: 'otomasyonun-otesi',
        heading: 'Operasyonel otomasyonun ötesine geçmek',
        paragraphs: [
          'İlk dalga dijitalleşme çalışmaları tekrar eden işleri hızlandırmaya odaklandı. Bugün ise yapay zekâ, büyük veri kümelerinden anlamlı örüntüler çıkararak karar kalitesini yükseltiyor.',
        ],
      },
      {
        id: 'kurumsal-hazirlik',
        heading: 'Kurum içi adaptasyon ve yönetişim',
        paragraphs: [
          'Başarılı uygulamalar, teknoloji ekiplerinin yanı sıra iş birimlerinin de sürece dahil olduğu, şeffaf ve ölçülebilir pilot projelerle hayata geçiriliyor.',
        ],
      },
    ],
  },
  {
    id: 'b8',
    slug: 'yapay-zeka-caginda-musteri-deneyimi-nasil-degisiyor',
    title: 'Yapay Zekâ Çağında Müşteri Deneyimi Nasıl Değişiyor?',
    spot: 'Hızlı yanıt ve kişiselleştirme artık bir ayrıcalık değil standart beklenti haline gelirken, markalar için fark yaratan unsur anlamlı ve tutarlı iletişim kurabilmek oluyor.',
    categoryKey: 'yapay-zeka',
    categoryLabel: 'Yapay Zekâ ve Teknoloji',
    tags: ['Yapay Zekâ', 'Müşteri Deneyimi', 'Kişiselleştirme'],
    publishedAt: '1 Ekim 2026',
    publishedIso: '2026-10-01',
    readingTime: '4 dk okuma',
    coverTheme: 'photo',
    sections: [
      {
        id: 'kisisellestirme-standardi',
        heading: 'Beklentiler neden bu kadar hızlı yükseldi?',
        paragraphs: [
          'Kullanıcılar günlük hayatlarında kullandıkları modern dijital ürünlerin hızını ve sezgisel deneyimini artık finans ve sigorta kurumlarından da bekliyor.',
        ],
      },
      {
        id: 'insan-ve-teknoloji',
        heading: 'Teknoloji destekli insan dokunuşu',
        paragraphs: [
          'En güçlü müşteri deneyimi, yapay zekânın hızı ile uzman ekiplerin empati ve danışmanlık gücünün doğru noktalarda birleştiği modellerde ortaya çıkıyor.',
        ],
      },
    ],
  },
  {
    id: 'b9',
    slug: 'b2b-pazarlamada-lead-sayisindan-daha-onemli-olan-nedir',
    title: 'B2B Pazarlamada Lead Sayısından Daha Önemli Olan Nedir?',
    spot: 'Yüksek talep hacmi her zaman sağlıklı büyüme anlamına gelmez; doğru hedef kitle, nitelikli talep kalitesi ve satışa dönüşüm oranı gerçek performansı belirler.',
    categoryKey: 'dijital-pazarlama',
    categoryLabel: 'Dijital Büyüme ve Performans Pazarlaması',
    tags: ['B2B Pazarlama', 'Lead Kalitesi', 'Performans', 'Büyüme'],
    publishedAt: '24 Eylül 2026',
    publishedIso: '2026-09-24',
    readingTime: '5 dk okuma',
    coverTheme: 'growth',
    sections: [
      {
        id: 'hacim-tuzagi',
        heading: 'Yalnızca form sayısına odaklanmanın riski',
        paragraphs: [
          'B2B pazarlamada yalnızca düşük maliyetli talep toplamak, satış ekiplerinin verimsiz görüşmelerle zaman kaybetmesine neden olabilir. Önemli olan ideal müşteri profiline uygun talepleri üretmektir.',
        ],
      },
      {
        id: 'ticari-metrikler',
        heading: 'Pazarlamayı ticari sonuçlarla ölçmek',
        paragraphs: [
          'Nitelikli görüşme oranı, satış döngüsü süresi ve müşteri yaşam boyu değeri birlikte izlendiğinde pazarlama bütçesi gerçek bir büyüme yatırımına dönüşür.',
        ],
      },
    ],
  },
  {
    id: 'b10',
    slug: 'saas-urunlerinde-self-servis-satis-modeli-nasil-kurgulanir',
    title: 'SaaS Ürünlerinde Self-Servis Satış Modeli Nasıl Kurgulanır?',
    spot: 'Kullanıcının ürünü hızla anlayıp deneyimleyebildiği self-servis satış kurgusu, ölçeklenebilir SaaS büyümesinin en güçlü kaldıraçlarından biridir.',
    categoryKey: 'dijital-pazarlama',
    categoryLabel: 'Ürün ve İş Stratejisi',
    tags: ['SaaS', 'Self-Servis Satış', 'Dönüşüm', 'Ürün Stratejisi'],
    publishedAt: '16 Eylül 2026',
    publishedIso: '2026-09-16',
    readingTime: '6 dk okuma',
    coverTheme: 'growth',
    sections: [
      {
        id: 'deger-anina-hizli-erisim',
        heading: 'İlk değer anına giden yolu kısaltmak',
        paragraphs: [
          'Self-servis modellerde kullanıcının ürünün sağladığı faydayı dakikalar içinde görebilmesi kritik önem taşır. Sade bir karşılama akışı ve net değer önerisi dönüşümü doğrudan artırır.',
        ],
      },
      {
        id: 'urun-ve-pazarlama-uyumu',
        heading: 'Landing page, aktivasyon ve fiyatlandırma uyumu',
        paragraphs: [
          'Pazarlama mesajı ile ürün içi deneyim tutarlı olduğunda kullanıcı güvenle karar verir ve destek ekibine bağımlılık azalır.',
        ],
      },
    ],
  },
  {
    id: 'b11',
    slug: 'pazarlama-ve-satis-ekipleri-neden-ayni-hedefe-odaklanmali',
    title: 'Pazarlama ve Satış Ekipleri Neden Aynı Hedefe Odaklanmalı?',
    spot: 'Pazarlama ve satış ayrı hedeflerle çalıştığında büyüme yavaşlar; ortak veri, ortak dil ve ortak gelir hedefi ise tüm organizasyonu hızlandırır.',
    categoryKey: 'strateji-yonetim',
    categoryLabel: 'Yönetim ve Liderlik',
    tags: ['Pazarlama', 'Satış', 'Ekip Yönetimi', 'Strateji'],
    publishedAt: '8 Eylül 2026',
    publishedIso: '2026-09-08',
    readingTime: '4 dk okuma',
    coverTheme: 'strategy',
    sections: [
      {
        id: 'ortak-dil-eksikligi',
        heading: 'Ayrı metriklerin yarattığı kopukluk',
        paragraphs: [
          'Pazarlamanın yalnızca tıklama ve form sayısına, satışın ise yalnızca kapanan anlaşmalara odaklandığı yapılarda değerli müşteri geri bildirimleri kaybolur.',
        ],
      },
      {
        id: 'ortak-buyume-kulturu',
        heading: 'Ortak büyüme kültürü nasıl kurulur?',
        paragraphs: [
          'Düzenli geri bildirim toplantıları, paylaşılan CRM verileri ve ortak dönüşüm hedefleri sayesinde iki ekip birbirini besleyen tek bir gelir motoruna dönüşür.',
        ],
      },
    ],
  },
  {
    id: 'b12',
    slug: 'teknoloji-sirketlerinde-urun-pazarlamasinin-stratejik-rolu',
    title: 'Teknoloji Şirketlerinde Ürün Pazarlamasının Stratejik Rolü',
    spot: 'Güçlü bir teknoloji geliştirmek tek başına pazar başarısı getirmez; ürün pazarlaması, ürünün değerini müşterinin diline çeviren stratejik köprüdür.',
    categoryKey: 'strateji-yonetim',
    categoryLabel: 'Ürün ve İş Stratejisi',
    tags: ['Ürün Pazarlaması', 'Konumlandırma', 'Go-to-Market', 'SaaS'],
    publishedAt: '1 Eylül 2026',
    publishedIso: '2026-09-01',
    readingTime: '5 dk okuma',
    coverTheme: 'strategy',
    sections: [
      {
        id: 'konumlandirma-gucu',
        heading: 'Doğru konumlandırma neden her şeyi değiştirir?',
        paragraphs: [
          'Müşteriler teknik özellik listelerini değil, kendi iş problemlerinin nasıl çözüldüğünü satın alır. Ürün pazarlaması, ürün ekibi ile pazar arasındaki en kritik stratejik bağlantıdır.',
        ],
      },
      {
        id: 'pazara-giris-disiplini',
        heading: 'Pazara giriş ve sürdürülebilir büyüme',
        paragraphs: [
          'Hedef kitle segmentasyonu, net değer önerisi ve satış ekiplerini güçlendiren mesaj mimarisiyle ürünün pazardaki benimsenme hızı belirgin biçimde artar.',
        ],
      },
    ],
  },
];
