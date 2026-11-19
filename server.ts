import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';

const DEFAULT_PROFILE_URL =
  process.env.LINKEDIN_PROFILE_URL || 'https://www.linkedin.com/in/tugceutku/';
const DEFAULT_ACTIVITY_URL = DEFAULT_PROFILE_URL.endsWith('/')
  ? `${DEFAULT_PROFILE_URL}recent-activity/all/`
  : `${DEFAULT_PROFILE_URL}/recent-activity/all/`;

interface LiveLinkedInPost {
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

interface LinkedInFeedPayload {
  mode: 'posts' | 'embeds' | 'widget' | 'unconfigured';
  source?: 'feed' | 'api' | 'embeds' | 'widget';
  oauthConfigured: boolean;
  profileUrl: string;
  activityUrl: string;
  widgetUrl?: string;
  posts: LiveLinkedInPost[];
  syncedAt?: string;
}

// In-memory cache for automatic feed sync (10 minutes TTL)
let cachedFeed: { data: LinkedInFeedPayload; expiresAt: number } | null = null;
const CACHE_TTL_MS = 10 * 60 * 1000;

// In-memory OAuth session tokens (if owner connects via LinkedIn OAuth)
let runtimeLinkedInToken: string | null = process.env.LINKEDIN_ACCESS_TOKEN || null;
let runtimeAuthorUrn: string | null = process.env.LINKEDIN_AUTHOR_URN || null;

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

function formatTurkishDate(rawDate?: string | number | null): {
  publishedAt?: string;
  publishedIso?: string;
} {
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

function buildTitleAndExcerpt(rawTitle: string, rawBody: string): {
  title: string;
  excerpt: string;
  fullText: string;
} {
  const cleanBody = stripHtml(rawBody || rawTitle || '');
  const cleanTitle = stripHtml(rawTitle || '');

  const lines = cleanBody
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  let title = cleanTitle;
  if (!title || title.length > 110 || title.toLowerCase().startsWith('http')) {
    const firstLine = lines[0] || cleanBody;
    title =
      firstLine.length > 92 ? `${firstLine.slice(0, 89).trimEnd()}...` : firstLine;
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

function extractImageFromBlock(block: string, htmlContent: string): string | undefined {
  const mediaMatch = block.match(
    /<(?:media:content|media:thumbnail|enclosure)[^>]+url=["']([^"']+)["']/i
  );
  if (mediaMatch && /^https?:\/\//i.test(mediaMatch[1])) {
    return decodeHtmlEntities(mediaMatch[1]);
  }
  const imgMatch = htmlContent.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgMatch && /^https?:\/\//i.test(imgMatch[1])) {
    return decodeHtmlEntities(imgMatch[1]);
  }
  return undefined;
}

function parseRssOrAtom(xml: string): LiveLinkedInPost[] {
  const itemMatches = xml.match(/<item\b[\s\S]*?<\/item>/gi) || [];
  const entryMatches =
    itemMatches.length === 0 ? xml.match(/<entry\b[\s\S]*?<\/entry>/gi) || [] : [];
  const blocks = itemMatches.length > 0 ? itemMatches : entryMatches;

  return blocks
    .slice(0, 6)
    .map((block, index) => {
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
        extractXmlTag(block, 'updated') ||
        extractXmlTag(block, 'dc:date');

      const { title, excerpt, fullText } = buildTitleAndExcerpt(rawTitle, rawDesc);
      const { publishedAt, publishedIso } = formatTurkishDate(rawDate);
      const imageUrl = extractImageFromBlock(block, decodeHtmlEntities(rawDesc));

      return {
        id: `feed-${index}-${Buffer.from(link).toString('base64').slice(0, 10)}`,
        title,
        excerpt,
        fullText,
        publishedAt,
        publishedIso,
        postUrl: link,
        imageUrl,
      };
    })
    .filter((post) => Boolean(post.fullText));
}

function parseJsonFeed(payload: unknown): LiveLinkedInPost[] {
  const rawList: unknown[] = Array.isArray(payload)
    ? payload
    : typeof payload === 'object' && payload !== null
      ? ((payload as Record<string, unknown>).items as unknown[]) ||
        ((payload as Record<string, unknown>).posts as unknown[]) ||
        ((payload as Record<string, unknown>).data as unknown[]) ||
        ((payload as Record<string, unknown>).elements as unknown[]) ||
        []
      : [];

  return rawList
    .slice(0, 6)
    .map((entry, index) => {
      const item = (entry || {}) as Record<string, unknown>;
      const rawBody = String(
        item.content_text ||
          item.content_html ||
          item.text ||
          item.commentary ||
          item.description ||
          item.summary ||
          item.message ||
          ''
      );
      const rawTitle = String(item.title || item.headline || '');
      const postUrl = String(
        item.url || item.link || item.permalink || item.postUrl || DEFAULT_ACTIVITY_URL
      );
      const rawDate = (item.date_published ||
        item.publishedAt ||
        item.pubDate ||
        item.createdAt ||
        item.created_time ||
        item.timestamp) as string | number | undefined;
      const imageUrl =
        typeof item.image === 'string'
          ? item.image
          : typeof item.imageUrl === 'string'
            ? item.imageUrl
            : typeof item.thumbnail === 'string'
              ? item.thumbnail
              : undefined;

      const { title, excerpt, fullText } = buildTitleAndExcerpt(rawTitle, rawBody);
      const { publishedAt, publishedIso } = formatTurkishDate(rawDate);

      return {
        id: String(item.id || `json-post-${index}`),
        title,
        excerpt,
        fullText,
        publishedAt,
        publishedIso,
        postUrl,
        imageUrl,
      };
    })
    .filter((post) => Boolean(post.fullText));
}

async function fetchFromFeedUrl(feedUrl: string): Promise<LiveLinkedInPost[]> {
  const response = await fetch(feedUrl, {
    headers: {
      Accept: 'application/json, application/rss+xml, application/xml, text/xml',
      'User-Agent': 'TugceUtkuPersonalSite/1.0',
    },
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    throw new Error(`Feed responded with status ${response.status}`);
  }

  const contentType = (response.headers.get('content-type') || '').toLowerCase();
  const bodyText = await response.text();
  const trimmed = bodyText.trim();

  if (contentType.includes('json') || trimmed.startsWith('{') || trimmed.startsWith('[')) {
    const parsed = JSON.parse(trimmed);
    return parseJsonFeed(parsed);
  }

  return parseRssOrAtom(trimmed);
}

async function fetchFromLinkedInApi(
  accessToken: string,
  authorUrn: string
): Promise<LiveLinkedInPost[]> {
  const apiUrl = `https://api.linkedin.com/rest/posts?author=${encodeURIComponent(
    authorUrn
  )}&q=author&count=6&sortBy=LAST_MODIFIED`;

  const response = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'LinkedIn-Version': '202501',
      'X-Restli-Protocol-Version': '2.0.0',
      Accept: 'application/json',
    },
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    throw new Error(`LinkedIn API responded with status ${response.status}`);
  }

  const data = (await response.json()) as {
    elements?: Array<{
      id?: string;
      commentary?: string;
      createdAt?: number;
      lastModifiedAt?: number;
    }>;
  };

  const elements = data.elements || [];
  return elements
    .map((el, idx) => {
      const commentary = el.commentary || '';
      const { title, excerpt, fullText } = buildTitleAndExcerpt('', commentary);
      const { publishedAt, publishedIso } = formatTurkishDate(
        el.createdAt || el.lastModifiedAt
      );
      const urn = el.id || '';
      const postUrl = urn
        ? `https://www.linkedin.com/feed/update/${encodeURIComponent(urn)}/`
        : DEFAULT_ACTIVITY_URL;

      return {
        id: urn || `li-api-${idx}`,
        title,
        excerpt,
        fullText,
        publishedAt,
        publishedIso,
        postUrl,
      };
    })
    .filter((post) => Boolean(post.fullText));
}

function getOAuthRedirectUri(): string {
  const base = (process.env.APP_URL || `http://localhost:${PORT}`).replace(/\/+$/, '');
  return `${base}/auth/linkedin/callback`;
}

async function resolveLinkedInFeed(forceRefresh = false): Promise<LinkedInFeedPayload> {
  const now = Date.now();
  if (!forceRefresh && cachedFeed && cachedFeed.expiresAt > now) {
    return cachedFeed.data;
  }

  const oauthConfigured = Boolean(
    process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET
  );

  // 1. Auto-syncing external LinkedIn RSS / JSON Feed URL (RSS.app, SociableKIT, Apify, Make, etc.)
  const feedUrl = process.env.LINKEDIN_FEED_URL?.trim();
  if (feedUrl) {
    try {
      const posts = await fetchFromFeedUrl(feedUrl);
      if (posts.length > 0) {
        const result: LinkedInFeedPayload = {
          mode: 'posts',
          source: 'feed',
          oauthConfigured,
          profileUrl: DEFAULT_PROFILE_URL,
          activityUrl: DEFAULT_ACTIVITY_URL,
          posts: posts.slice(0, 3),
          syncedAt: new Date().toISOString(),
        };
        cachedFeed = { data: result, expiresAt: now + CACHE_TTL_MS };
        return result;
      }
    } catch (error) {
      console.error('LINKEDIN_FEED_URL fetch failed:', error);
    }
  }

  // 2. Official LinkedIn REST API (Access Token + Author URN)
  if (runtimeLinkedInToken && runtimeAuthorUrn) {
    try {
      const posts = await fetchFromLinkedInApi(runtimeLinkedInToken, runtimeAuthorUrn);
      if (posts.length > 0) {
        const result: LinkedInFeedPayload = {
          mode: 'posts',
          source: 'api',
          oauthConfigured,
          profileUrl: DEFAULT_PROFILE_URL,
          activityUrl: DEFAULT_ACTIVITY_URL,
          posts: posts.slice(0, 3),
          syncedAt: new Date().toISOString(),
        };
        cachedFeed = { data: result, expiresAt: now + CACHE_TTL_MS };
        return result;
      }
    } catch (error) {
      console.error('LinkedIn API fetch failed:', error);
    }
  }

  // 3. Auto-updating LinkedIn Widget Iframe URL (SociableKIT, Elfsight, RSS.app Widget, Taggbox)
  const widgetUrl = process.env.LINKEDIN_WIDGET_EMBED_URL?.trim();
  if (widgetUrl && /^https:\/\//i.test(widgetUrl)) {
    const result: LinkedInFeedPayload = {
      mode: 'widget',
      source: 'widget',
      oauthConfigured,
      profileUrl: DEFAULT_PROFILE_URL,
      activityUrl: DEFAULT_ACTIVITY_URL,
      widgetUrl,
      posts: [],
      syncedAt: new Date().toISOString(),
    };
    cachedFeed = { data: result, expiresAt: now + CACHE_TTL_MS };
    return result;
  }

  // 4. Official LinkedIn Post Embed URLs (comma-separated)
  const embedUrlsRaw = process.env.LINKEDIN_EMBED_URLS?.trim();
  if (embedUrlsRaw) {
    const embedUrls = embedUrlsRaw
      .split(',')
      .map((u) => u.trim())
      .filter((u) => /^https:\/\/(www\.)?linkedin\.com\/embed\/feed\/update\//i.test(u))
      .slice(0, 3);

    if (embedUrls.length > 0) {
      const result: LinkedInFeedPayload = {
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
      };
      cachedFeed = { data: result, expiresAt: now + CACHE_TTL_MS };
      return result;
    }
  }

  // 5. No live source configured yet -> never return fabricated/mock posts
  return {
    mode: 'unconfigured',
    oauthConfigured,
    profileUrl: DEFAULT_PROFILE_URL,
    activityUrl: DEFAULT_ACTIVITY_URL,
    posts: [],
  };
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Live LinkedIn Posts API endpoint
  app.get('/api/linkedin-posts', async (req: Request, res: Response) => {
    try {
      const forceRefresh = req.query.refresh === '1';
      const payload = await resolveLinkedInFeed(forceRefresh);
      res.setHeader('Cache-Control', 'public, max-age=300');
      res.json(payload);
    } catch (error) {
      console.error('Error in /api/linkedin-posts:', error);
      res.status(200).json({
        mode: 'unconfigured',
        oauthConfigured: Boolean(
          process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET
        ),
        profileUrl: DEFAULT_PROFILE_URL,
        activityUrl: DEFAULT_ACTIVITY_URL,
        posts: [],
      } satisfies LinkedInFeedPayload);
    }
  });

  // LinkedIn OAuth 2.0: Construct authorization URL for popup flow
  app.get('/api/linkedin/auth/url', (_req: Request, res: Response) => {
    const clientId = process.env.LINKEDIN_CLIENT_ID;
    if (!clientId) {
      res.status(400).json({ error: 'LinkedIn OAuth yapılandırılmadı.' });
      return;
    }

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      redirect_uri: getOAuthRedirectUri(),
      scope: process.env.LINKEDIN_OAUTH_SCOPE || 'openid profile r_member_social',
      state: `li_${Date.now()}`,
    });

    res.json({
      url: `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`,
    });
  });

  // LinkedIn OAuth 2.0 Callback (handles both with and without trailing slash)
  const oauthCallbackHandler = async (req: Request, res: Response) => {
    const code = typeof req.query.code === 'string' ? req.query.code : '';
    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;

    if (!code || !clientId || !clientSecret) {
      res.status(400).send('<p>LinkedIn yetkilendirmesi tamamlanamadı.</p>');
      return;
    }

    try {
      const tokenResponse = await fetch(
        'https://www.linkedin.com/oauth/v2/accessToken',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: getOAuthRedirectUri(),
            client_id: clientId,
            client_secret: clientSecret,
          }),
        }
      );

      if (!tokenResponse.ok) {
        throw new Error(`Token exchange failed: ${tokenResponse.status}`);
      }

      const tokenData = (await tokenResponse.json()) as { access_token?: string };
      if (tokenData.access_token) {
        runtimeLinkedInToken = tokenData.access_token;

        // Resolve member sub URN via OpenID userinfo
        const meRes = await fetch('https://api.linkedin.com/v2/userinfo', {
          headers: { Authorization: `Bearer ${runtimeLinkedInToken}` },
        });
        if (meRes.ok) {
          const meData = (await meRes.json()) as { sub?: string };
          if (meData.sub) {
            runtimeAuthorUrn = `urn:li:person:${meData.sub}`;
          }
        }
        cachedFeed = null;
      }

      res.send(`<!doctype html>
<html lang="tr">
  <body style="font-family: Inter, sans-serif; padding: 24px; text-align: center;">
    <script>
      if (window.opener) {
        window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS', provider: 'linkedin' }, '*');
        window.close();
      } else {
        window.location.href = '/';
      }
    </script>
    <p>LinkedIn bağlantısı tamamlandı. Bu pencere otomatik olarak kapanacaktır.</p>
  </body>
</html>`);
    } catch (error) {
      console.error('LinkedIn OAuth callback error:', error);
      res.status(500).send('<p>LinkedIn bağlantısı sırasında bir hata oluştu.</p>');
    }
  };

  app.get(['/auth/linkedin/callback', '/auth/linkedin/callback/'], oauthCallbackHandler);

  if (!IS_PROD) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
