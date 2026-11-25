import type { IncomingMessage, ServerResponse } from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  fetchPublicFirestoreBlogData,
  isPubliclyVisibleFirestorePost,
} from './_firestore.js';

interface BlogMetaEntry {
  id?: string;
  slug: string;
  title: string;
  h1Title?: string;
  spot: string;
  categoryLabel: string;
  publishedIso: string;
  coverTheme: string;
  coverImage?: string;
  coverImageMeta?: {
    width: number;
    height: number;
    format: 'JPEG' | 'PNG';
    sizeKb: number;
  };
  isCustom?: boolean;
}

const BLOG_META_LIST: BlogMetaEntry[] = [
  {
    id: 'b1',
    slug: 'dijital-donusumun-merkezinde-teknoloji-ve-dogru-strateji-var',
    title: 'Dijital Dönüşümün Merkezinde Teknoloji ve Doğru Strateji Var',
    spot: 'Teknoloji yatırımları tek başına dönüşüm yaratmaz; kalıcı etki için iş hedefleri, müşteri deneyimi ve ölçülebilir stratejinin aynı eksende buluşması gerekir.',
    categoryLabel: 'Dijital Dönüşüm',
    publishedIso: '2026-11-14',
    coverTheme: 'photo',
  },
  {
    id: 'b2',
    slug: 'yapay-zeka-sigortacilik-sektorunu-nasil-donusturuyor',
    title: 'Yapay Zekâ Sigortacılık Sektörünü Nasıl Dönüştürüyor?',
    spot: 'Müşteri iletişiminden hasar ve belge analizine kadar yapay zekâ uygulamaları, sigortacılıkta hız, doğruluk ve karar kalitesini yeniden şekillendiriyor.',
    categoryLabel: 'Yapay Zekâ ve Teknoloji',
    publishedIso: '2026-11-09',
    coverTheme: 'ai',
  },
  {
    id: 'b3',
    slug: 'sigorta-sektorunde-crm-teknolojilerinin-stratejik-onemi',
    title: 'Sigorta Sektöründe CRM Teknolojilerinin Stratejik Önemi',
    spot: 'Sigorta acenteleri ve brokerlar için CRM yalnızca bir kayıt defteri değil; portföy koruma, yenileme başarısı ve çapraz satışın merkezidir.',
    categoryLabel: 'Insurtech ve Dijital Sigortacılık',
    publishedIso: '2026-11-03',
    coverTheme: 'insurtech',
  },
  {
    id: 'b4',
    slug: 'dijitallesmek-ile-gercekten-donusmek-arasindaki-fark',
    title: 'Dijitalleşmek ile Gerçekten Dönüşmek Arasındaki Fark',
    spot: 'Süreçleri yalnızca dijital ortama taşımak hız kazandırır; gerçek dönüşüm ise iş modelini, kültürü ve müşteri değerini yeniden tasarlamakla gerçekleşir.',
    categoryLabel: 'Dijital Dönüşüm',
    publishedIso: '2026-10-28',
    coverTheme: 'transformation',
  },
  {
    id: 'b5',
    slug: 'sigortacilikta-dijital-donusum-teknolojiden-daha-fazlasi',
    title: 'Sigortacılıkta Dijital Dönüşüm: Teknolojiden Daha Fazlası',
    spot: 'Sigorta şirketlerinden acente ve brokerlara kadar tüm ekosistemde rekabet avantajı, teknolojiyi güven ve danışmanlık deneyimiyle birleştirmekten geçiyor.',
    categoryLabel: 'Insurtech ve Dijital Sigortacılık',
    publishedIso: '2026-10-21',
    coverTheme: 'insurtech',
  },
  {
    id: 'b6',
    slug: 'sigorta-acenteleri-icin-dijitallesmenin-yeni-donemi',
    title: 'Sigorta Acenteleri İçin Dijitalleşmenin Yeni Dönemi',
    spot: 'Yeni nesil müşteri beklentileri, acente ve brokerların dijital görünürlükten online teklif süreçlerine kadar çalışma biçimlerini yeniden kurgulamasını gerektiriyor.',
    categoryLabel: 'Insurtech ve Dijital Sigortacılık',
    publishedIso: '2026-10-15',
    coverTheme: 'insurtech',
  },
  {
    id: 'b7',
    slug: 'sigortacilikta-yapay-zeka-otomasyondan-akilli-karar-sistemlerine',
    title: 'Sigortacılıkta Yapay Zekâ: Otomasyondan Akıllı Karar Sistemlerine',
    spot: 'Rutin süreçlerin otomasyonu yalnızca başlangıç; asıl değer, yapay zekânın risk, fiyatlandırma ve portföy kararlarını destekleyen stratejik bir katmana dönüşmesiyle ortaya çıkıyor.',
    categoryLabel: 'Yapay Zekâ ve Teknoloji',
    publishedIso: '2026-10-08',
    coverTheme: 'ai',
  },
  {
    id: 'b8',
    slug: 'yapay-zeka-caginda-musteri-deneyimi-nasil-degisiyor',
    title: 'Yapay Zekâ Çağında Müşteri Deneyimi Nasıl Değişiyor?',
    spot: 'Hızlı yanıt ve kişiselleştirme artık bir ayrıcalık değil standart beklenti haline gelirken, markalar için fark yaratan unsur anlamlı ve tutarlı iletişim kurabilmek oluyor.',
    categoryLabel: 'Yapay Zekâ ve Teknoloji',
    publishedIso: '2026-10-01',
    coverTheme: 'photo',
  },
  {
    id: 'b9',
    slug: 'b2b-pazarlamada-lead-sayisindan-daha-onemli-olan-nedir',
    title: 'B2B Pazarlamada Lead Sayısından Daha Önemli Olan Nedir?',
    spot: 'Yüksek talep hacmi her zaman sağlıklı büyüme anlamına gelmez; doğru hedef kitle, nitelikli talep kalitesi ve satışa dönüşüm oranı gerçek performansı belirler.',
    categoryLabel: 'Dijital Pazarlama ve Büyüme',
    publishedIso: '2026-09-24',
    coverTheme: 'growth',
  },
  {
    id: 'b10',
    slug: 'saas-urunlerinde-self-servis-satis-modeli-nasil-kurgulanir',
    title: 'SaaS Ürünlerinde Self-Servis Satış Modeli Nasıl Kurgulanır?',
    spot: 'Kullanıcının ürünü hızla anlayıp deneyimleyebildiği self-servis satış kurgusu, ölçeklenebilir SaaS büyümesinin en güçlü kaldıraçlarından biridir.',
    categoryLabel: 'Ürün ve İş Stratejisi',
    publishedIso: '2026-09-16',
    coverTheme: 'growth',
  },
  {
    id: 'b11',
    slug: 'pazarlama-ve-satis-ekipleri-neden-ayni-hedefe-odaklanmali',
    title: 'Pazarlama ve Satış Ekipleri Neden Aynı Hedefe Odaklanmalı?',
    spot: 'Pazarlama ve satış ayrı hedeflerle çalıştığında büyüme yavaşlar; ortak veri, ortak dil ve ortak gelir hedefi ise tüm organizasyonu hızlandırır.',
    categoryLabel: 'Yönetim ve Liderlik',
    publishedIso: '2026-09-08',
    coverTheme: 'strategy',
  },
  {
    id: 'b12',
    slug: 'teknoloji-sirketlerinde-urun-pazarlamasinin-stratejik-rolu',
    title: 'Teknoloji Şirketlerinde Ürün Pazarlamasının Stratejik Rolü',
    spot: 'Güçlü bir teknoloji geliştirmek tek başına pazar başarısı getirmez; ürün pazarlaması, ürünün değerini müşterinin diline çeviren stratejik köprüdür.',
    categoryLabel: 'Ürün ve İş Stratejisi',
    publishedIso: '2026-09-01',
    coverTheme: 'strategy',
  },
];

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getOrigin(req: IncomingMessage): string {
  const protoHeader = req.headers['x-forwarded-proto'];
  const proto =
    typeof protoHeader === 'string' && protoHeader.trim()
      ? protoHeader.split(',')[0].trim()
      : 'https';
  const hostHeader = req.headers['x-forwarded-host'] || req.headers.host;
  const host =
    typeof hostHeader === 'string' && hostHeader.trim()
      ? hostHeader.split(',')[0].trim()
      : 'www.tugceutku.com';
  return `${proto}://${host}`;
}

function injectBlogMeta(
  html: string,
  origin: string,
  slug: string,
  post?: BlogMetaEntry
): string {
  const headline = post?.h1Title?.trim() || post?.title;
  const title = post
    ? `${post.title} | Tuğçe Utku`
    : 'Blog ve İçgörüler | Tuğçe Utku';
  const description = post
    ? post.spot
    : 'Dijital dönüşüm, sigortacılık teknolojileri, yapay zekâ ve strateji üzerine analizler ve profesyonel içgörüler.';
  const canonicalUrl = `${origin}/blog/${encodeURIComponent(slug)}`;
  const validThemes = new Set([
    'photo',
    'transformation',
    'insurtech',
    'ai',
    'growth',
    'strategy',
  ]);
  const safeTheme =
    post?.coverTheme && validThemes.has(post.coverTheme)
      ? post.coverTheme
      : 'transformation';

  const hasUploadedDataCover = Boolean(
    post?.coverImage && post.coverImage.startsWith('data:image/')
  );
  const hasHttpsCover = Boolean(
    post?.coverImage && /^https:\/\//i.test(post.coverImage)
  );
  const imageUrl = hasUploadedDataCover
    ? `${origin}/api/blog-cover/${encodeURIComponent(post!.slug)}?v=${post!.coverImage!.length}`
    : hasHttpsCover && post?.coverImage
      ? post.coverImage
      : post
        ? post.isCustom
          ? `${origin}/og-covers/theme-${safeTheme}.jpg`
          : `${origin}/og-covers/${encodeURIComponent(post.slug)}.jpg`
        : `${origin}/og-covers/theme-transformation.jpg`;

  const imageType =
    hasUploadedDataCover && post?.coverImage?.startsWith('data:image/png')
      ? 'image/png'
      : hasUploadedDataCover && post?.coverImage?.startsWith('data:image/webp')
        ? 'image/webp'
        : 'image/jpeg';

  const imgWidth = String(post?.coverImageMeta?.width || 1200);
  const imgHeight = String(post?.coverImageMeta?.height || 630);

  const eTitle = escapeHtml(title);
  const eDesc = escapeHtml(description);
  const eCanonical = escapeHtml(canonicalUrl);
  const eImage = escapeHtml(imageUrl);
  const eAlt = escapeHtml(headline || 'Tuğçe Utku Blog');

  // Remove homepage meta tags we are overriding so crawlers read only one clean set
  const out = html
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${eTitle}</title>`)
    .replace(/<meta\s+name="description"[^>]*>\s*/gi, '')
    .replace(/<link\s+rel="canonical"[^>]*>\s*/gi, '')
    .replace(/<meta\s+property="og:[^"]+"[^>]*>\s*/gi, '')
    .replace(/<meta\s+property="article:[^"]+"[^>]*>\s*/gi, '')
    .replace(/<meta\s+name="twitter:[^"]+"[^>]*>\s*/gi, '');

  const metaBlock = `
    <meta name="description" content="${eDesc}" />
    <link rel="canonical" href="${eCanonical}" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="Tuğçe Utku" />
    <meta property="og:locale" content="tr_TR" />
    <meta property="og:url" content="${eCanonical}" />
    <meta property="og:title" content="${eTitle}" />
    <meta property="og:description" content="${eDesc}" />
    <meta property="og:image" content="${eImage}" />
    <meta property="og:image:secure_url" content="${eImage}" />
    <meta property="og:image:type" content="${imageType}" />
    <meta property="og:image:width" content="${imgWidth}" />
    <meta property="og:image:height" content="${imgHeight}" />
    <meta property="og:image:alt" content="${eAlt}" />${
      post
        ? `
    <meta property="article:published_time" content="${escapeHtml(post.publishedIso)}" />
    <meta property="article:section" content="${escapeHtml(post.categoryLabel)}" />
    <meta property="article:author" content="Tuğçe Utku" />`
        : ''
    }
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${eTitle}" />
    <meta name="twitter:description" content="${eDesc}" />
    <meta name="twitter:image" content="${eImage}" />
    <meta name="twitter:image:alt" content="${eAlt}" />
`;

  return out.replace(/<\/title>/i, `</title>${metaBlock}`);
}

async function loadSpaHtml(origin: string): Promise<string> {
  try {
    const builtPath = path.resolve(process.cwd(), 'dist', 'index.html');
    const html = await fs.readFile(builtPath, 'utf8');
    if (html.includes('<div id="root">') && !html.includes('/src/main.tsx')) {
      return html;
    }
  } catch {
    // Fall through to CDN fetch
  }

  try {
    const res = await fetch(`${origin}/index.html`, {
      headers: { Accept: 'text/html' },
      signal: AbortSignal.timeout(4000),
    });
    if (res.ok) {
      const html = await res.text();
      if (html.includes('<head>')) return html;
    }
  } catch {
    // Fall through to minimal HTML shell
  }

  return `<!doctype html><html lang="tr"><head><meta charset="UTF-8" /><title>Tuğçe Utku</title></head><body><div id="root"></div></body></html>`;
}

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse
) {
  const origin = getOrigin(req);
  const parsedUrl = new URL(req.url || '/', origin);
  const querySlug = parsedUrl.searchParams.get('slug') || '';
  const pathSlug = parsedUrl.pathname.startsWith('/blog/')
    ? parsedUrl.pathname.slice('/blog/'.length)
    : '';

  const rawSlug = (querySlug || pathSlug).replace(/^\/+|\/+$/g, '');
  let slug = rawSlug;
  try {
    slug = decodeURIComponent(rawSlug);
  } catch {
    slug = rawSlug;
  }

  const cleanSlug = slug.toLowerCase();
  const { posts: firestorePosts, deletedIds } = await fetchPublicFirestoreBlogData();
  const deletedSet = new Set(deletedIds);

  const firestoreHit = firestorePosts.find(
    (item) =>
      isPubliclyVisibleFirestorePost(item, deletedSet, item.id) &&
      item.slug.toLowerCase() === cleanSlug
  );
  const overriddenIds = new Set(firestorePosts.map((p) => p.id));
  const builtInHit = !firestoreHit
    ? BLOG_META_LIST.find(
        (item) =>
          (!item.id || (!deletedSet.has(item.id) && !overriddenIds.has(item.id))) &&
          item.slug.toLowerCase() === cleanSlug
      )
    : undefined;
  const post: BlogMetaEntry | undefined = firestoreHit
    ? {
        id: firestoreHit.id,
        slug: firestoreHit.slug,
        title: firestoreHit.title,
        h1Title: firestoreHit.h1Title,
        spot: firestoreHit.spot,
        categoryLabel: firestoreHit.categoryLabel,
        publishedIso: firestoreHit.publishedIso,
        coverTheme: firestoreHit.coverTheme,
        coverImage: firestoreHit.coverImage,
        coverImageMeta: firestoreHit.coverImageMeta,
        isCustom: !BLOG_META_LIST.some((b) => b.id === firestoreHit.id),
      }
    : builtInHit;

  const baseHtml = await loadSpaHtml(origin);
  const html = injectBlogMeta(baseHtml, origin, slug, post);

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=86400');
  res.end(html);
}
