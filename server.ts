import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import fs from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createServer as createViteServer } from 'vite';

const execFileAsync = promisify(execFile);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';

const DEFAULT_PROFILE_URL =
  process.env.LINKEDIN_PROFILE_URL || 'https://www.linkedin.com/in/tugceutku/';
const DEFAULT_ACTIVITY_URL = DEFAULT_PROFILE_URL.endsWith('/')
  ? `${DEFAULT_PROFILE_URL}recent-activity/all/`
  : `${DEFAULT_PROFILE_URL}/recent-activity/all/`;

const DEFAULT_CONTACT_RECIPIENTS = [
  'tugce.utku@insurup.com',
  'tugce.utku@acerpro.com.tr',
];

const DASHBOARD_PASSCODE = process.env.DASHBOARD_PASSCODE || '2027';
const CUSTOM_POSTS_FILE = path.resolve(__dirname, 'data', 'custom-blog-posts.json');
const DELETED_BLOG_IDS_FILE = path.resolve(__dirname, 'data', 'deleted-blog-ids.json');

async function readCustomPostsFile(): Promise<unknown[]> {
  try {
    const raw = await fs.readFile(CUSTOM_POSTS_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeCustomPostsFile(posts: unknown[]): Promise<void> {
  await fs.mkdir(path.dirname(CUSTOM_POSTS_FILE), { recursive: true });
  await fs.writeFile(CUSTOM_POSTS_FILE, JSON.stringify(posts, null, 2), 'utf8');
}

async function readDeletedBlogIdsFile(): Promise<string[]> {
  try {
    const raw = await fs.readFile(DELETED_BLOG_IDS_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

async function writeDeletedBlogIdsFile(ids: string[]): Promise<void> {
  await fs.mkdir(path.dirname(DELETED_BLOG_IDS_FILE), { recursive: true });
  await fs.writeFile(DELETED_BLOG_IDS_FILE, JSON.stringify(ids, null, 2), 'utf8');
}

function getContactRecipients(): string[] {
  const configured = process.env.CONTACT_TO_EMAILS?.trim();
  if (!configured) return DEFAULT_CONTACT_RECIPIENTS;
  const list = configured
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  return list.length > 0 ? list : DEFAULT_CONTACT_RECIPIENTS;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

interface ContactFormPayload {
  name: string;
  company?: string;
  email: string;
  topic: string;
  message: string;
  lang?: 'tr' | 'en';
}

async function sendContactEmail(payload: ContactFormPayload): Promise<string[]> {
  const recipients = getContactRecipients();
  const subject = `[tugceutku.com] ${payload.topic} — ${payload.name}`;

  const textLines = [
    'Web sitenizdeki iletişim formundan yeni bir mesaj geldi:',
    '',
    `Ad Soyad: ${payload.name}`,
    `Şirket / Kurum: ${payload.company || '-'}`,
    `E-posta: ${payload.email}`,
    `İletişim Konusu: ${payload.topic}`,
    '',
    'Mesaj:',
    payload.message,
  ];
  const textBody = textLines.join('\n');

  const htmlBody = `
    <div style="font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; color: #0f172a; line-height: 1.6;">
      <div style="padding: 20px 24px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px;">
        <p style="margin: 0 0 6px; font-size: 12px; font-weight: 600; color: #1d4ed8; text-transform: uppercase; letter-spacing: 0.04em;">
          Yeni İletişim Formu Mesajı
        </p>
        <h2 style="margin: 0 0 18px; font-size: 20px; color: #0f172a;">
          ${escapeHtml(payload.topic)}
        </h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 18px;">
          <tr>
            <td style="padding: 6px 0; color: #64748b; width: 140px;">Ad Soyad:</td>
            <td style="padding: 6px 0; font-weight: 600; color: #0f172a;">${escapeHtml(payload.name)}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Şirket / Kurum:</td>
            <td style="padding: 6px 0; color: #0f172a;">${escapeHtml(payload.company || '-')}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">E-posta:</td>
            <td style="padding: 6px 0;"><a href="mailto:${escapeHtml(payload.email)}" style="color: #1d4ed8;">${escapeHtml(payload.email)}</a></td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Konu:</td>
            <td style="padding: 6px 0; color: #0f172a;">${escapeHtml(payload.topic)}</td>
          </tr>
        </table>
        <div style="padding: 14px 16px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px; color: #334155; white-space: pre-wrap;">${escapeHtml(payload.message)}</div>
      </div>
    </div>
  `;

  // Option A: Resend API
  const resendApiKey = process.env.RESEND_API_KEY?.trim();
  if (resendApiKey) {
    const from = process.env.CONTACT_FROM_EMAIL?.trim() || 'Tuğçe Utku Web <onboarding@resend.dev>';
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: recipients,
        reply_to: payload.email,
        subject,
        text: textBody,
        html: htmlBody,
      }),
      signal: AbortSignal.timeout(12000),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(`Resend error (${response.status}): ${errorText}`);
    }

    return recipients;
  }

  // Option B: SMTP (Google Workspace, Microsoft 365, corporate mail server)
  const smtpHost = process.env.SMTP_HOST?.trim();
  const smtpUser = process.env.SMTP_USER?.trim();
  const smtpPass = process.env.SMTP_PASS?.trim();
  if (smtpHost && smtpUser && smtpPass) {
    const smtpPort = Number(process.env.SMTP_PORT || 587);
    const smtpSecure =
      process.env.SMTP_SECURE === 'true' || smtpPort === 465;
    const from = process.env.CONTACT_FROM_EMAIL?.trim() || smtpUser;

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from,
      to: recipients,
      replyTo: payload.email,
      subject,
      text: textBody,
      html: htmlBody,
    });

    return recipients;
  }

  const err = new Error('MAIL_NOT_CONFIGURED');
  err.name = 'MAIL_NOT_CONFIGURED';
  throw err;
}

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
  app.use(express.json({ limit: '15mb' }));

  // Contact Form Email Endpoint -> delivers to both tugce.utku@insurup.com & tugce.utku@acerpro.com.tr
  app.post('/api/contact', async (req: Request, res: Response) => {
    try {
      const body = (req.body || {}) as Partial<ContactFormPayload> & {
        website?: string;
      };

      // Silent honeypot check against bots
      if (body.website && body.website.trim() !== '') {
        res.json({ ok: true, recipients: getContactRecipients() });
        return;
      }

      const name = String(body.name || '').trim();
      const company = String(body.company || '').trim();
      const email = String(body.email || '').trim();
      const topic = String(body.topic || 'İletişim').trim();
      const message = String(body.message || '').trim();

      if (!name || !email || !message) {
        res.status(400).json({
          ok: false,
          code: 'VALIDATION_ERROR',
          error: 'Lütfen ad soyad, e-posta ve mesaj alanlarını doldurun.',
        });
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        res.status(400).json({
          ok: false,
          code: 'INVALID_EMAIL',
          error: 'Lütfen geçerli bir e-posta adresi girin.',
        });
        return;
      }

      const recipients = await sendContactEmail({
        name,
        company,
        email,
        topic,
        message,
        lang: body.lang === 'en' ? 'en' : 'tr',
      });

      res.json({ ok: true, recipients });
    } catch (error) {
      if (error instanceof Error && error.name === 'MAIL_NOT_CONFIGURED') {
        res.status(503).json({
          ok: false,
          code: 'MAIL_NOT_CONFIGURED',
          recipients: getContactRecipients(),
          error: 'E-posta gönderim servisi henüz yapılandırılmadı.',
        });
        return;
      }

      console.error('Contact form delivery error:', error);
      res.status(502).json({
        ok: false,
        code: 'DELIVERY_FAILED',
        recipients: getContactRecipients(),
        error: 'Mesaj gönderilirken geçici bir hata oluştu.',
      });
    }
  });

  const { BLOG_POSTS } = await import('./src/data/blogPosts.ts');
  const { BLOG_POSTS_EN } = await import('./src/data/blogPostsEn.ts');
  const builtInPostIds = new Set(BLOG_POSTS.map((p) => p.id));

  // Blog Posts API (supports both newly added posts and edits/deletions of built-in posts)
  app.get('/api/blog-posts', async (_req: Request, res: Response) => {
    const [posts, deletedIds] = await Promise.all([
      readCustomPostsFile(),
      readDeletedBlogIdsFile(),
    ]);
    res.json({ posts, deletedIds });
  });

  app.post('/api/blog-posts', async (req: Request, res: Response) => {
    const passcode = String(req.headers['x-dashboard-passcode'] || '');
    if (passcode !== DASHBOARD_PASSCODE) {
      res.status(401).json({ ok: false, error: 'Geçersiz geçiş kodu.' });
      return;
    }
    const post = (req.body as { post?: Record<string, unknown> })?.post;
    if (!post || typeof post.id !== 'string' || typeof post.title !== 'string') {
      res.status(400).json({ ok: false, error: 'Geçersiz yazı verisi.' });
      return;
    }
    try {
      const existing = await readCustomPostsFile();
      const updated = [post, ...existing.filter((p) => (p as { id?: string })?.id !== post.id)];
      await writeCustomPostsFile(updated);

      const deletedIds = await readDeletedBlogIdsFile();
      if (deletedIds.includes(post.id)) {
        await writeDeletedBlogIdsFile(deletedIds.filter((item) => item !== post.id));
      }

      res.json({ ok: true, post });
    } catch (error) {
      console.error('Failed to persist custom blog post:', error);
      res.status(500).json({ ok: false, error: 'Yazı kaydedilemedi.' });
    }
  });

  app.put('/api/blog-posts/:id', async (req: Request, res: Response) => {
    const passcode = String(req.headers['x-dashboard-passcode'] || '');
    if (passcode !== DASHBOARD_PASSCODE) {
      res.status(401).json({ ok: false, error: 'Geçersiz geçiş kodu.' });
      return;
    }
    const post = (req.body as { post?: Record<string, unknown> })?.post;
    const { id } = req.params;
    if (!post) {
      res.status(400).json({ ok: false, error: 'Geçersiz yazı verisi.' });
      return;
    }
    try {
      const existing = await readCustomPostsFile();
      const existsInFile = existing.some((p) => (p as { id?: string })?.id === id);
      const updated = existsInFile
        ? existing.map((p) => ((p as { id?: string })?.id === id ? post : p))
        : [post, ...existing];
      await writeCustomPostsFile(updated);

      const deletedIds = await readDeletedBlogIdsFile();
      if (deletedIds.includes(id)) {
        await writeDeletedBlogIdsFile(deletedIds.filter((item) => item !== id));
      }

      res.json({ ok: true, post });
    } catch (error) {
      console.error('Failed to update blog post:', error);
      res.status(500).json({ ok: false, error: 'Yazı güncellenemedi.' });
    }
  });

  app.delete('/api/blog-posts/:id', async (req: Request, res: Response) => {
    const passcode = String(req.headers['x-dashboard-passcode'] || '');
    if (passcode !== DASHBOARD_PASSCODE) {
      res.status(401).json({ ok: false, error: 'Geçersiz geçiş kodu.' });
      return;
    }
    const { id } = req.params;
    const mode = String(req.query.mode || '');
    try {
      const existing = await readCustomPostsFile();
      const updated = existing.filter((p) => (p as { id?: string })?.id !== id);
      await writeCustomPostsFile(updated);

      const deletedIds = await readDeletedBlogIdsFile();
      if (mode === 'reset' || mode === 'restore') {
        if (deletedIds.includes(id)) {
          await writeDeletedBlogIdsFile(deletedIds.filter((item) => item !== id));
        }
      } else if (builtInPostIds.has(id) && !deletedIds.includes(id)) {
        await writeDeletedBlogIdsFile([...deletedIds, id]);
      }

      res.json({ ok: true });
    } catch (error) {
      console.error('Failed to delete blog post:', error);
      res.status(500).json({ ok: false, error: 'Yazı silinemedi.' });
    }
  });

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

  // SEO & GEO Endpoints (dynamically include custom blog posts alongside static catalog)
  const resolvePublicFile = (filename: string) =>
    path.resolve(__dirname, IS_PROD ? 'dist' : 'public', filename);

  const resolveBaseUrl = (req: Request) => {
    const rawHost = String(req.headers['x-forwarded-host'] || req.get('host') || '')
      .split(',')[0]
      .trim();
    const rawProto = String(req.headers['x-forwarded-proto'] || req.protocol || 'https')
      .split(',')[0]
      .trim();
    const proto = rawProto === 'http' || rawProto === 'https' ? rawProto : 'https';

    if (
      rawHost &&
      !/^(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?$/i.test(rawHost)
    ) {
      return `${proto}://${rawHost}`;
    }

    const envUrl = process.env.APP_URL?.trim();
    if (envUrl) return envUrl.replace(/\/+$/, '');
    return rawHost ? `${proto}://${rawHost}` : 'https://www.tugceutku.com';
  };

  interface CustomPostRecord {
    slug?: string;
    title?: string;
    spot?: string;
    categoryLabel?: string;
    publishedIso?: string;
  }

  app.get('/robots.txt', async (req: Request, res: Response) => {
    try {
      const baseUrl = resolveBaseUrl(req);
      const raw = await fs.readFile(resolvePublicFile('robots.txt'), 'utf8');
      res.type('text/plain; charset=utf-8').send(
        raw.replace(/https:\/\/www\.tugceutku\.com/g, baseUrl)
      );
    } catch {
      res.type('text/plain; charset=utf-8').send('User-agent: *\nAllow: /\n');
    }
  });

  app.get('/sitemap.xml', async (req: Request, res: Response) => {
    try {
      const baseUrl = resolveBaseUrl(req);
      let xml = await fs.readFile(resolvePublicFile('sitemap.xml'), 'utf8');
      xml = xml.replace(/https:\/\/www\.tugceutku\.com/g, baseUrl);

      const customPosts = (await readCustomPostsFile()) as CustomPostRecord[];
      const extraEntries = customPosts
        .filter((p) => p.slug && !xml.includes(`/blog/${p.slug}`))
        .map(
          (p) =>
            `  <url>\n    <loc>${escapeHtml(`${baseUrl}/blog/${p.slug}`)}</loc>\n    <lastmod>${escapeHtml(p.publishedIso || new Date().toISOString().slice(0, 10))}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>`
        )
        .join('\n');

      if (extraEntries) {
        xml = xml.replace('</urlset>', `${extraEntries}\n</urlset>`);
      }

      res.type('application/xml; charset=utf-8').send(xml);
    } catch {
      res.status(404).end();
    }
  });

  app.get('/llms.txt', async (req: Request, res: Response) => {
    try {
      const baseUrl = resolveBaseUrl(req);
      let txt = await fs.readFile(resolvePublicFile('llms.txt'), 'utf8');
      txt = txt.replace(/https:\/\/www\.tugceutku\.com/g, baseUrl);

      const customPosts = (await readCustomPostsFile()) as CustomPostRecord[];
      const extraLines = customPosts
        .filter((p) => p.slug && p.title && !txt.includes(`/blog/${p.slug}`))
        .map((p) => `- [${p.title}](${baseUrl}/blog/${p.slug}): ${p.spot || ''}`)
        .join('\n');

      if (extraLines) {
        txt = txt.replace(
          '## İlgili Beslemeler (Feeds)',
          `${extraLines}\n\n## İlgili Beslemeler (Feeds)`
        );
      }

      res.type('text/plain; charset=utf-8').send(txt);
    } catch {
      res.status(404).end();
    }
  });

  app.get('/rss.xml', async (req: Request, res: Response) => {
    try {
      const baseUrl = resolveBaseUrl(req);
      let rss = await fs.readFile(resolvePublicFile('rss.xml'), 'utf8');
      rss = rss.replace(/https:\/\/www\.tugceutku\.com/g, baseUrl);

      const customPosts = (await readCustomPostsFile()) as CustomPostRecord[];
      const extraItems = customPosts
        .filter((p) => p.slug && p.title && !rss.includes(`/blog/${p.slug}`))
        .map((p) => {
          const link = `${baseUrl}/blog/${p.slug}`;
          const pubDate = p.publishedIso
            ? new Date(p.publishedIso).toUTCString()
            : new Date().toUTCString();
          return `    <item>\n      <title>${escapeHtml(p.title || '')}</title>\n      <link>${escapeHtml(link)}</link>\n      <guid>${escapeHtml(link)}</guid>\n      <pubDate>${escapeHtml(pubDate)}</pubDate>\n      <category>${escapeHtml(p.categoryLabel || 'Blog')}</category>\n      <description>${escapeHtml(p.spot || '')}</description>\n    </item>`;
        })
        .join('\n');

      if (extraItems) {
        rss = rss.replace('<item>', `${extraItems}\n    <item>`);
      }

      res.type('application/rss+xml; charset=utf-8').send(rss);
    } catch {
      res.status(404).end();
    }
  });

  app.get(['/auth/linkedin/callback', '/auth/linkedin/callback/'], oauthCallbackHandler);

  // Serve real binary JPEG/PNG blog cover image for custom & built-in posts (for LinkedIn/WhatsApp OG previews)
  interface StoredCustomBlog {
    id?: string;
    slug?: string;
    title?: string;
    spot?: string;
    categoryLabel?: string;
    publishedIso?: string;
    coverTheme?: string;
    coverImage?: string;
    isOverriddenOrCustom?: boolean;
  }

  const SLUG_ARTWORK_FILE: Record<string, string> = {
    'dijital-donusumun-merkezinde-teknoloji-ve-dogru-strateji-var':
      'src/assets/images/blog_cover_transformation_1795277561057.jpg',
    'yapay-zeka-sigortacilik-sektorunu-nasil-donusturuyor':
      'src/assets/images/blog_cover_ai_insurance_1795277562127.jpg',
    'sigorta-sektorunde-crm-teknolojilerinin-stratejik-onemi':
      'src/assets/images/blog_cover_insurtech_crm_1795277564004.jpg',
    'dijitallesmek-ile-gercekten-donusmek-arasindaki-fark':
      'src/assets/images/blog_cover_process_redesign_1795278310290.jpg',
    'sigortacilikta-dijital-donusum-teknolojiden-daha-fazlasi':
      'src/assets/images/blog_cover_hybrid_trust_1795278309838.jpg',
    'sigorta-acenteleri-icin-dijitallesmenin-yeni-donemi':
      'src/assets/images/blog_cover_digital_agency_1795278311004.jpg',
    'sigortacilikta-yapay-zeka-otomasyondan-akilli-karar-sistemlerine':
      'src/assets/images/blog_cover_decision_engine_1795278310251.jpg',
    'yapay-zeka-caginda-musteri-deneyimi-nasil-degisiyor':
      'src/assets/images/blog_cover_cx_digital_1795277584069.jpg',
    'b2b-pazarlamada-lead-sayisindan-daha-onemli-olan-nedir':
      'src/assets/images/blog_cover_growth_clean_1795277581886.jpg',
    'saas-urunlerinde-self-servis-satis-modeli-nasil-kurgulanir':
      'src/assets/images/blog_cover_saas_funnel_1795278310588.jpg',
    'pazarlama-ve-satis-ekipleri-neden-ayni-hedefe-odaklanmali':
      'src/assets/images/blog_cover_strategy_clean_1795277583363.jpg',
    'teknoloji-sirketlerinde-urun-pazarlamasinin-stratejik-rolu':
      'src/assets/images/blog_cover_product_positioning_1795278311179.jpg',
  };

  const THEME_ARTWORK_FILE: Record<string, string> = {
    photo: 'src/assets/images/blog_cover_transformation_1795277561057.jpg',
    transformation: 'src/assets/images/blog_cover_process_redesign_1795278310290.jpg',
    insurtech: 'src/assets/images/blog_cover_insurtech_crm_1795277564004.jpg',
    ai: 'src/assets/images/blog_cover_ai_insurance_1795277562127.jpg',
    growth: 'src/assets/images/blog_cover_growth_clean_1795277581886.jpg',
    strategy: 'src/assets/images/blog_cover_strategy_clean_1795277583363.jpg',
  };

  const OG_CACHE_DIR = '/tmp/tugce-og-cache';

  async function renderDynamicBlogCoverJpg(
    post: StoredCustomBlog
  ): Promise<Buffer | null> {
    const title = (post.title || '').trim();
    if (!title) return null;

    const categoryLabel = (post.categoryLabel || 'Blog').trim();
    const slugKey = (post.slug || '').toLowerCase();
    const themeKey = (post.coverTheme || 'transformation').toLowerCase();
    const bgRel =
      SLUG_ARTWORK_FILE[slugKey] ||
      THEME_ARTWORK_FILE[themeKey] ||
      THEME_ARTWORK_FILE.transformation;
    const bgPath = path.resolve(__dirname, bgRel);
    const logoPath = resolvePublicFile('assets/aistudio/IMG_8969_35f4cedb.png');
    const fontBold = '/usr/share/fonts/truetype/noto/NotoSans-Bold.ttf';

    const cacheKey = crypto
      .createHash('sha1')
      .update(`${slugKey}|${title}|${categoryLabel}|${themeKey}`)
      .digest('hex')
      .slice(0, 16);
    const cacheFile = path.join(OG_CACHE_DIR, `${cacheKey}.jpg`);

    try {
      return await fs.readFile(cacheFile);
    } catch {
      // Cache miss -> render below
    }

    try {
      await fs.mkdir(OG_CACHE_DIR, { recursive: true });
      const pt = title.length > 62 ? 40 : title.length > 48 ? 44 : 48;
      await execFileAsync('convert', [
        bgPath,
        '-resize',
        '1200x630^',
        '-gravity',
        'center',
        '-extent',
        '1200x630',
        '(',
        '-size',
        '630x1200',
        'gradient:#01122EEB-#01153618',
        '-rotate',
        '-90',
        ')',
        '-gravity',
        'NorthWest',
        '-compose',
        'over',
        '-composite',
        '-fill',
        '#6EE0E8',
        '-draw',
        'circle 76,72 82,72',
        '-stroke',
        'rgba(255,255,255,0.18)',
        '-strokewidth',
        '1',
        '-draw',
        'line 72,534 1128,534',
        '-stroke',
        'none',
        '-background',
        'none',
        '-fill',
        '#8EE6EC',
        '-font',
        fontBold,
        '-pointsize',
        '20',
        '-gravity',
        'NorthWest',
        '-annotate',
        '+96+58',
        categoryLabel,
        '(',
        '-size',
        '760x',
        '-background',
        'none',
        '-fill',
        '#FFFFFF',
        '-font',
        fontBold,
        '-pointsize',
        String(pt),
        '-interline-spacing',
        '8',
        '-gravity',
        'West',
        `caption:${title}`,
        ')',
        '-gravity',
        'West',
        '-geometry',
        '+72-12',
        '-compose',
        'over',
        '-composite',
        '-fill',
        'rgba(255,255,255,0.82)',
        '-font',
        fontBold,
        '-pointsize',
        '17',
        '-gravity',
        'SouthWest',
        '-annotate',
        '+72+40',
        'T U Ğ Ç E   U T K U',
        '(',
        logoPath,
        '-resize',
        'x42',
        '-channel',
        'RGB',
        '-evaluate',
        'set',
        '100%',
        '+channel',
        ')',
        '-gravity',
        'SouthEast',
        '-geometry',
        '+72+30',
        '-compose',
        'over',
        '-composite',
        '-strip',
        '-sampling-factor',
        '4:2:0',
        '-quality',
        '86',
        cacheFile,
      ]);
      return await fs.readFile(cacheFile);
    } catch (err) {
      console.error('Dynamic OG cover render failed:', err);
      return null;
    }
  }

  async function findBlogMetaBySlug(
    rawSlug: string,
    lang: 'tr' | 'en' = 'tr'
  ): Promise<StoredCustomBlog | undefined> {
    let decoded = rawSlug;
    try {
      decoded = decodeURIComponent(rawSlug);
    } catch {
      decoded = rawSlug;
    }
    const clean = decoded.replace(/^\/+|\/+$/g, '').toLowerCase();
    const [customPosts, deletedIds] = await Promise.all([
      readCustomPostsFile() as Promise<StoredCustomBlog[]>,
      readDeletedBlogIdsFile(),
    ]);
    const deletedSet = new Set(deletedIds);
    const customHit = customPosts.find(
      (p) => !deletedSet.has(p.id || '') && (p.slug || '').toLowerCase() === clean
    );
    if (customHit) {
      return { ...customHit, isOverriddenOrCustom: true };
    }
    const overriddenIds = new Set(customPosts.map((p) => p.id || ''));
    const baseList = lang === 'en' ? BLOG_POSTS_EN : BLOG_POSTS;
    const baseHit = baseList.find(
      (p) =>
        !deletedSet.has(p.id) &&
        !overriddenIds.has(p.id) &&
        p.slug.toLowerCase() === clean
    );
    return baseHit ? { ...baseHit, isOverriddenOrCustom: false } : undefined;
  }

  app.get('/api/blog-cover/:slug', async (req: Request, res: Response) => {
    const slug = String(req.params.slug || '').replace(/^\/+|\/+$/g, '');
    const lang = req.query.lang === 'en' ? 'en' : 'tr';
    const post = await findBlogMetaBySlug(slug, lang);

    if (post?.coverImage && post.coverImage.startsWith('data:image/')) {
      const match = post.coverImage.match(/^data:(image\/(?:jpeg|jpg|png));base64,(.+)$/i);
      if (match) {
        const mime = match[1].toLowerCase() === 'image/jpg' ? 'image/jpeg' : match[1].toLowerCase();
        const buffer = Buffer.from(match[2], 'base64');
        res.setHeader('Content-Type', mime);
        res.setHeader('Content-Length', String(buffer.length));
        res.setHeader('Cache-Control', 'public, max-age=86400');
        res.send(buffer);
        return;
      }
    }

    if (post && (post.isOverriddenOrCustom || lang === 'en')) {
      const rendered = await renderDynamicBlogCoverJpg(post);
      if (rendered) {
        res.setHeader('Content-Type', 'image/jpeg');
        res.setHeader('Content-Length', String(rendered.length));
        res.setHeader('Cache-Control', 'public, max-age=86400');
        res.send(rendered);
        return;
      }
    }

    const candidates = [
      resolvePublicFile(path.join('og-covers', `${post?.slug || slug}.jpg`)),
      resolvePublicFile(path.join('og-covers', `theme-${post?.coverTheme || 'transformation'}.jpg`)),
    ];

    for (const filePath of candidates) {
      try {
        const fileBuf = await fs.readFile(filePath);
        res.setHeader('Content-Type', 'image/jpeg');
        res.setHeader('Content-Length', String(fileBuf.length));
        res.setHeader('Cache-Control', 'public, max-age=86400');
        res.send(fileBuf);
        return;
      } catch {
        // Try next candidate
      }
    }

    res.status(404).end();
  });

  // Backwards-compatible fallback if any external platform requests an old .png og-cover path
  app.get('/og-covers/:name.png', async (req: Request, res: Response) => {
    const cleanName = String(req.params.name || '').replace(/[^a-z0-9-]/gi, '');
    const jpgPath = resolvePublicFile(path.join('og-covers', `${cleanName}.jpg`));
    try {
      const fileBuf = await fs.readFile(jpgPath);
      res.setHeader('Content-Type', 'image/jpeg');
      res.setHeader('Content-Length', String(fileBuf.length));
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.send(fileBuf);
    } catch {
      res.status(404).end();
    }
  });

  function injectBlogOgTags(
    html: string,
    baseUrl: string,
    slug: string,
    post?: StoredCustomBlog,
    lang: 'tr' | 'en' = 'tr'
  ): string {
    if (!post || !post.title) return html;
    const title = `${post.title} | Tuğçe Utku`;
    const description =
      post.spot ||
      (lang === 'en'
        ? 'Insights and analyses on digital transformation, insurance technologies, artificial intelligence, and strategy.'
        : 'Dijital dönüşüm, sigortacılık teknolojileri, yapay zekâ ve strateji üzerine analizler ve içgörüler.');
    const resolvedSlug = post.slug || slug;
    const canonicalUrl = `${baseUrl}/blog/${encodeURIComponent(resolvedSlug)}${lang === 'en' ? '?lang=en' : ''}`;
    const hasCustomUploadedImage = Boolean(
      post.coverImage && post.coverImage.startsWith('data:image/')
    );
    const needsDynamicCover =
      hasCustomUploadedImage || Boolean(post.isOverriddenOrCustom) || lang === 'en';
    const coverHash = crypto
      .createHash('sha1')
      .update(`${resolvedSlug}|${post.title}|${post.coverTheme || ''}|${post.coverImage?.length || 0}`)
      .digest('hex')
      .slice(0, 8);
    const imageUrl = needsDynamicCover
      ? `${baseUrl}/api/blog-cover/${encodeURIComponent(resolvedSlug)}?v=${coverHash}${lang === 'en' ? '&lang=en' : ''}`
      : `${baseUrl}/og-covers/${encodeURIComponent(resolvedSlug)}.jpg`;
    const imageType =
      hasCustomUploadedImage && post.coverImage?.startsWith('data:image/png')
        ? 'image/png'
        : 'image/jpeg';

    const eTitle = escapeHtml(title);
    const eDesc = escapeHtml(description);
    const eCanonical = escapeHtml(canonicalUrl);
    const eImage = escapeHtml(imageUrl);
    const eAlt = escapeHtml(post.title);

    const stripped = html
      .replace(/<title>[\s\S]*?<\/title>/i, `<title>${eTitle}</title>`)
      .replace(/<link\b[^>]*\brel=["']canonical["'][^>]*>\s*/gi, '')
      .replace(
        /<meta\b[^>]*\b(?:property=["'](?:og:|article:)[^"']*["']|name=["'](?:description|twitter:[^"']*)["'])[^>]*>\s*/gi,
        ''
      );

    const metaBlock = `
    <meta name="description" content="${eDesc}" />
    <link rel="canonical" href="${eCanonical}" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="Tuğçe Utku" />
    <meta property="og:locale" content="${lang === 'en' ? 'en_US' : 'tr_TR'}" />
    <meta property="og:url" content="${eCanonical}" />
    <meta property="og:title" content="${eTitle}" />
    <meta property="og:description" content="${eDesc}" />
    <meta property="og:image" content="${eImage}" />
    <meta property="og:image:secure_url" content="${eImage}" />
    <meta property="og:image:type" content="${imageType}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${eAlt}" />
    <meta property="article:published_time" content="${escapeHtml(post.publishedIso || '')}" />
    <meta property="article:section" content="${escapeHtml(post.categoryLabel || 'Blog')}" />
    <meta property="article:author" content="Tuğçe Utku" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${eTitle}" />
    <meta name="twitter:description" content="${eDesc}" />
    <meta name="twitter:image" content="${eImage}" />
    <meta name="twitter:image:alt" content="${eAlt}" />
`;

    return stripped.replace(/<\/title>/i, `</title>${metaBlock}`);
  }

  if (!IS_PROD) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });

    app.get(['/blog/:slug', '/blog/:slug/'], async (req: Request, res: Response, next) => {
      try {
        const slug = String(req.params.slug || '');
        const lang = req.query.lang === 'en' ? 'en' : 'tr';
        const post = await findBlogMetaBySlug(slug, lang);
        const rawHtml = await fs.readFile(path.resolve(__dirname, 'index.html'), 'utf8');
        const transformed = await vite.transformIndexHtml(req.originalUrl, rawHtml);
        const finalHtml = injectBlogOgTags(transformed, resolveBaseUrl(req), slug, post, lang);
        res.status(200).setHeader('Content-Type', 'text/html; charset=utf-8').send(finalHtml);
      } catch (err) {
        next(err);
      }
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));

    app.get(['/blog/:slug', '/blog/:slug/'], async (req: Request, res: Response) => {
      const slug = String(req.params.slug || '');
      const lang = req.query.lang === 'en' ? 'en' : 'tr';
      const post = await findBlogMetaBySlug(slug, lang);
      const rawHtml = await fs.readFile(path.join(distPath, 'index.html'), 'utf8');
      const finalHtml = injectBlogOgTags(rawHtml, resolveBaseUrl(req), slug, post, lang);
      res.status(200).setHeader('Content-Type', 'text/html; charset=utf-8').send(finalHtml);
    });

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
