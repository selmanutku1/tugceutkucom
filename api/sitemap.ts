import type { IncomingMessage, ServerResponse } from 'node:http';
import {
  fetchPublicFirestoreBlogData,
  isPubliclyVisibleFirestorePost,
} from './_firestore.js';

interface SitemapEntry {
  path: string;
  lastmod: string;
  changefreq: 'daily' | 'weekly' | 'monthly' | 'yearly';
  priority: string;
  builtInId?: string;
}

const CANONICAL_ORIGIN = 'https://www.tugceutku.com';

const STATIC_ENTRIES: SitemapEntry[] = [
  { path: '/', lastmod: '2026-11-19', changefreq: 'weekly', priority: '1.0' },
  { path: '/hakkimda', lastmod: '2026-11-19', changefreq: 'monthly', priority: '0.9' },
  { path: '/uzmanlik-alanlarim', lastmod: '2026-11-19', changefreq: 'monthly', priority: '0.9' },
  { path: '/deneyim', lastmod: '2026-11-19', changefreq: 'monthly', priority: '0.8' },
  { path: '/projeler', lastmod: '2026-11-19', changefreq: 'monthly', priority: '0.8' },
  { path: '/blog', lastmod: '2026-11-19', changefreq: 'weekly', priority: '0.9' },
  { path: '/sss', lastmod: '2026-11-19', changefreq: 'monthly', priority: '0.8' },
  { path: '/iletisim', lastmod: '2026-11-19', changefreq: 'monthly', priority: '0.7' },
  {
    builtInId: 'b1',
    path: '/blog/dijital-donusumun-merkezinde-teknoloji-ve-dogru-strateji-var',
    lastmod: '2026-11-14',
    changefreq: 'monthly',
    priority: '0.8',
  },
  {
    builtInId: 'b2',
    path: '/blog/yapay-zeka-sigortacilik-sektorunu-nasil-donusturuyor',
    lastmod: '2026-11-09',
    changefreq: 'monthly',
    priority: '0.8',
  },
  {
    builtInId: 'b3',
    path: '/blog/sigorta-sektorunde-crm-teknolojilerinin-stratejik-onemi',
    lastmod: '2026-11-03',
    changefreq: 'monthly',
    priority: '0.8',
  },
  {
    builtInId: 'b4',
    path: '/blog/dijitallesmek-ile-gercekten-donusmek-arasindaki-fark',
    lastmod: '2026-10-28',
    changefreq: 'monthly',
    priority: '0.8',
  },
  {
    builtInId: 'b5',
    path: '/blog/sigortacilikta-dijital-donusum-teknolojiden-daha-fazlasi',
    lastmod: '2026-10-21',
    changefreq: 'monthly',
    priority: '0.8',
  },
  {
    builtInId: 'b6',
    path: '/blog/sigorta-acenteleri-icin-dijitallesmenin-yeni-donemi',
    lastmod: '2026-10-15',
    changefreq: 'monthly',
    priority: '0.8',
  },
  {
    builtInId: 'b7',
    path: '/blog/sigortacilikta-yapay-zeka-otomasyondan-akilli-karar-sistemlerine',
    lastmod: '2026-10-08',
    changefreq: 'monthly',
    priority: '0.8',
  },
  {
    builtInId: 'b8',
    path: '/blog/yapay-zeka-caginda-musteri-deneyimi-nasil-degisiyor',
    lastmod: '2026-10-01',
    changefreq: 'monthly',
    priority: '0.8',
  },
  {
    builtInId: 'b9',
    path: '/blog/b2b-pazarlamada-lead-sayisindan-daha-onemli-olan-nedir',
    lastmod: '2026-09-24',
    changefreq: 'monthly',
    priority: '0.8',
  },
  {
    builtInId: 'b10',
    path: '/blog/saas-urunlerinde-self-servis-satis-modeli-nasil-kurgulanir',
    lastmod: '2026-09-16',
    changefreq: 'monthly',
    priority: '0.8',
  },
  {
    builtInId: 'b11',
    path: '/blog/pazarlama-ve-satis-ekipleri-neden-ayni-hedefe-odaklanmali',
    lastmod: '2026-09-08',
    changefreq: 'monthly',
    priority: '0.8',
  },
  {
    builtInId: 'b12',
    path: '/blog/teknoloji-sirketlerinde-urun-pazarlamasinin-stratejik-rolu',
    lastmod: '2026-09-01',
    changefreq: 'monthly',
    priority: '0.8',
  },
];

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function buildSitemapXml(): Promise<string> {
  const { posts: firestorePosts, deletedIds } = await fetchPublicFirestoreBlogData();
  const deletedSet = new Set(deletedIds);
  const overriddenIds = new Set(firestorePosts.map((p) => p.id));

  const mergedEntries: SitemapEntry[] = [];

  for (const post of firestorePosts) {
    if (!isPubliclyVisibleFirestorePost(post, deletedSet, post.id) || !post.slug) continue;
    mergedEntries.push({
      path: `/blog/${encodeURIComponent(post.slug)}`,
      lastmod: post.publishedIso || new Date().toISOString().slice(0, 10),
      changefreq: 'monthly',
      priority: '0.8',
    });
  }

  for (const entry of STATIC_ENTRIES) {
    if (entry.builtInId && (deletedSet.has(entry.builtInId) || overriddenIds.has(entry.builtInId))) {
      continue;
    }
    if (!mergedEntries.some((m) => m.path === entry.path)) {
      mergedEntries.push(entry);
    }
  }

  const urls = mergedEntries
    .map(
      (entry) => `  <url>
    <loc>${escapeXml(`${CANONICAL_ORIGIN}${entry.path}`)}</loc>
    <lastmod>${escapeXml(entry.lastmod)}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse
) {
  const xml = await buildSitemapXml();
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader(
    'Cache-Control',
    'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400'
  );
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.method === 'HEAD') {
    res.setHeader('Content-Length', String(Buffer.byteLength(xml, 'utf8')));
    res.end();
    return;
  }

  res.end(xml);
}
