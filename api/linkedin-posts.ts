import type { IncomingMessage, ServerResponse } from 'node:http';

interface VercelResponse extends ServerResponse {
  status?: (code: number) => VercelResponse;
  json?: (data: unknown) => void;
}

const DEFAULT_PROFILE_URL =
  process.env.LINKEDIN_PROFILE_URL || 'https://www.linkedin.com/in/tugceutku/';
const DEFAULT_ACTIVITY_URL = DEFAULT_PROFILE_URL.endsWith('/')
  ? `${DEFAULT_PROFILE_URL}recent-activity/all/`
  : `${DEFAULT_PROFILE_URL}/recent-activity/all/`;

function sendJson(res: VercelResponse, statusCode: number, payload: unknown) {
  res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=300');
  if (typeof res.status === 'function' && typeof res.json === 'function') {
    res.status(statusCode).json(payload);
    return;
  }
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

function decodeHtmlEntities(input: string): string {
  return input
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

function stripHtml(input: string): string {
  return decodeHtmlEntities(input)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function formatTurkishDate(rawDate?: string | number | null) {
  if (!rawDate) return {};
  const parsed = new Date(rawDate);
  if (Number.isNaN(parsed.getTime())) return {};
  return {
    publishedIso: parsed.toISOString(),
    publishedAt: new Intl.DateTimeFormat('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(parsed),
  };
}

function buildTitleAndExcerpt(rawTitle: string, rawBody: string) {
  const cleanBody = stripHtml(rawBody || rawTitle || '');
  const cleanTitle = stripHtml(rawTitle || '');
  const lines = cleanBody
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  let title = cleanTitle;
  if (!title || title.length > 110 || title.toLowerCase().startsWith('http')) {
    const firstLine = lines[0] || cleanBody;
    title = firstLine.length > 92 ? `${firstLine.slice(0, 89).trimEnd()}...` : firstLine;
  }

  const fullText = cleanBody || title;
  const excerpt =
    fullText.length > 220 ? `${fullText.slice(0, 217).trimEnd()}...` : fullText;
  return { title, excerpt, fullText };
}

function extractXmlTag(block: string, tagName: string): string {
  const regex = new RegExp(`<${tagName}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tagName}>`, 'i');
  const match = block.match(regex);
  return match ? match[1].trim() : '';
}

function extractAtomLink(block: string): string {
  const hrefMatch = block.match(/<link[^>]+href=["']([^"']+)["'][^>]*\/?>/i);
  if (hrefMatch) return decodeHtmlEntities(hrefMatch[1]);
  return decodeHtmlEntities(extractXmlTag(block, 'link'));
}

function parseFeed(bodyText: string, contentType: string) {
  const trimmed = bodyText.trim();
  if (contentType.includes('json') || trimmed.startsWith('{') || trimmed.startsWith('[')) {
    const parsed = JSON.parse(trimmed) as unknown;
    const rawList: unknown[] = Array.isArray(parsed)
      ? parsed
      : typeof parsed === 'object' && parsed !== null
        ? ((parsed as Record<string, unknown>).items as unknown[]) ||
          ((parsed as Record<string, unknown>).posts as unknown[]) ||
          ((parsed as Record<string, unknown>).data as unknown[]) ||
          []
        : [];

    return rawList
      .slice(0, 3)
      .map((entry, idx) => {
        const item = (entry || {}) as Record<string, unknown>;
        const rawBody = String(
          item.content_text ||
            item.content_html ||
            item.text ||
            item.commentary ||
            item.description ||
            item.summary ||
            ''
        );
        const { title, excerpt, fullText } = buildTitleAndExcerpt(
          String(item.title || ''),
          rawBody
        );
        const dateInfo = formatTurkishDate(
          (item.date_published || item.publishedAt || item.pubDate || item.createdAt) as
            | string
            | number
            | undefined
        );
        return {
          id: String(item.id || `json-${idx}`),
          title,
          excerpt,
          fullText,
          ...dateInfo,
          postUrl: String(item.url || item.link || DEFAULT_ACTIVITY_URL),
          imageUrl:
            typeof item.image === 'string'
              ? item.image
              : typeof item.imageUrl === 'string'
                ? item.imageUrl
                : undefined,
        };
      })
      .filter((p) => Boolean(p.fullText));
  }

  const items = trimmed.match(/<item\b[\s\S]*?<\/item>/gi) || [];
  const entries =
    items.length === 0 ? trimmed.match(/<entry\b[\s\S]*?<\/entry>/gi) || [] : [];
  const blocks = items.length > 0 ? items : entries;

  return blocks
    .slice(0, 3)
    .map((block, idx) => {
      const rawTitle = extractXmlTag(block, 'title');
      const rawDesc =
        extractXmlTag(block, 'content:encoded') ||
        extractXmlTag(block, 'description') ||
        extractXmlTag(block, 'content') ||
        extractXmlTag(block, 'summary');
      const link = extractAtomLink(block) || DEFAULT_ACTIVITY_URL;
      const rawDate =
        extractXmlTag(block, 'pubDate') ||
        extractXmlTag(block, 'published') ||
        extractXmlTag(block, 'updated');
      const { title, excerpt, fullText } = buildTitleAndExcerpt(rawTitle, rawDesc);
      const dateInfo = formatTurkishDate(rawDate);
      return {
        id: `rss-${idx}`,
        title,
        excerpt,
        fullText,
        ...dateInfo,
        postUrl: link,
      };
    })
    .filter((p) => Boolean(p.fullText));
}

export default async function handler(_req: IncomingMessage, res: VercelResponse) {
  const oauthConfigured = Boolean(
    process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET
  );

  const feedUrl = process.env.LINKEDIN_FEED_URL?.trim();
  if (feedUrl) {
    try {
      const response = await fetch(feedUrl, {
        headers: { Accept: 'application/json, application/rss+xml, application/xml, text/xml' },
        signal: AbortSignal.timeout(10000),
      });
      if (response.ok) {
        const text = await response.text();
        const posts = parseFeed(text, (response.headers.get('content-type') || '').toLowerCase());
        if (posts.length > 0) {
          sendJson(res, 200, {
            mode: 'posts',
            source: 'feed',
            oauthConfigured,
            profileUrl: DEFAULT_PROFILE_URL,
            activityUrl: DEFAULT_ACTIVITY_URL,
            posts,
            syncedAt: new Date().toISOString(),
          });
          return;
        }
      }
    } catch (error) {
      console.error('Vercel LINKEDIN_FEED_URL error:', error);
    }
  }

  const widgetUrl = process.env.LINKEDIN_WIDGET_EMBED_URL?.trim();
  if (widgetUrl && /^https:\/\//i.test(widgetUrl)) {
    sendJson(res, 200, {
      mode: 'widget',
      source: 'widget',
      oauthConfigured,
      profileUrl: DEFAULT_PROFILE_URL,
      activityUrl: DEFAULT_ACTIVITY_URL,
      widgetUrl,
      posts: [],
      syncedAt: new Date().toISOString(),
    });
    return;
  }

  const embedUrlsRaw = process.env.LINKEDIN_EMBED_URLS?.trim();
  if (embedUrlsRaw) {
    const embedUrls = embedUrlsRaw
      .split(',')
      .map((u) => u.trim())
      .filter((u) => /^https:\/\/(www\.)?linkedin\.com\/embed\/feed\/update\//i.test(u))
      .slice(0, 3);
    if (embedUrls.length > 0) {
      sendJson(res, 200, {
        mode: 'embeds',
        source: 'embeds',
        oauthConfigured,
        profileUrl: DEFAULT_PROFILE_URL,
        activityUrl: DEFAULT_ACTIVITY_URL,
        posts: embedUrls.map((embedUrl, idx) => ({
          id: `embed-${idx}`,
          title: `LinkedIn Paylaşımı ${idx + 1}`,
          excerpt: '',
          fullText: '',
          postUrl: DEFAULT_ACTIVITY_URL,
          embedUrl,
        })),
        syncedAt: new Date().toISOString(),
      });
      return;
    }
  }

  sendJson(res, 200, {
    mode: 'unconfigured',
    oauthConfigured,
    profileUrl: DEFAULT_PROFILE_URL,
    activityUrl: DEFAULT_ACTIVITY_URL,
    posts: [],
  });
}
