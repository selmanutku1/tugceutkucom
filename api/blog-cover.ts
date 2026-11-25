import type { IncomingMessage, ServerResponse } from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  fetchPublicFirestoreBlogData,
  isPubliclyVisibleFirestorePost,
} from './_firestore.js';

const VALID_THEMES = new Set([
  'photo',
  'transformation',
  'insurtech',
  'ai',
  'growth',
  'strategy',
]);

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

async function readStaticCoverBytes(
  origin: string,
  candidateNames: string[]
): Promise<Buffer | null> {
  const baseDirs = [
    path.resolve(process.cwd(), 'public', 'og-covers'),
    path.resolve(process.cwd(), 'dist', 'og-covers'),
  ];

  for (const name of candidateNames) {
    const cleanFile = path.basename(name);
    for (const dir of baseDirs) {
      const candidatePath = path.resolve(dir, cleanFile);
      if (!candidatePath.startsWith(dir + path.sep)) continue;
      try {
        return await fs.readFile(candidatePath);
      } catch {
        // Try next directory
      }
    }

    try {
      const cdnRes = await fetch(`${origin}/og-covers/${encodeURIComponent(cleanFile)}`, {
        signal: AbortSignal.timeout(3500),
      });
      if (cdnRes.ok) {
        const arr = await cdnRes.arrayBuffer();
        return Buffer.from(arr);
      }
    } catch {
      // Try next fallback name
    }
  }

  return null;
}

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse
) {
  const origin = getOrigin(req);
  const parsedUrl = new URL(req.url || '/', origin);
  const querySlug = parsedUrl.searchParams.get('slug') || '';
  const pathSlug = parsedUrl.pathname.startsWith('/api/blog-cover/')
    ? parsedUrl.pathname.slice('/api/blog-cover/'.length)
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

  const hit = firestorePosts.find(
    (item) =>
      isPubliclyVisibleFirestorePost(item, deletedSet, item.id) &&
      item.slug.toLowerCase() === cleanSlug
  );

  // 1. Uploaded base64 JPEG / PNG / WebP cover image stored in Firestore
  if (hit?.coverImage && hit.coverImage.startsWith('data:image/')) {
    const match = hit.coverImage.match(
      /^data:(image\/(?:jpeg|jpg|png|webp));base64,(.+)$/i
    );
    if (match) {
      const mime =
        match[1].toLowerCase() === 'image/jpg'
          ? 'image/jpeg'
          : match[1].toLowerCase();
      const buffer = Buffer.from(match[2], 'base64');
      res.statusCode = 200;
      res.setHeader('Content-Type', mime);
      res.setHeader('Content-Length', String(buffer.length));
      res.setHeader(
        'Cache-Control',
        'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800'
      );
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.end(buffer);
      return;
    }
  }

  // 2. HTTPS remote cover URL (safe redirect)
  if (hit?.coverImage && /^https:\/\//i.test(hit.coverImage)) {
    res.statusCode = 302;
    res.setHeader('Location', hit.coverImage);
    res.end();
    return;
  }

  // 3. Static slug or theme cover fallback
  const safeTheme =
    hit?.coverTheme && VALID_THEMES.has(hit.coverTheme)
      ? hit.coverTheme
      : 'transformation';
  const safeSlugFile = cleanSlug.replace(/[^a-z0-9-]/g, '');
  const candidates = [
    ...(safeSlugFile ? [`${safeSlugFile}.jpg`] : []),
    `theme-${safeTheme}.jpg`,
    'theme-transformation.jpg',
  ];

  const fallbackBytes = await readStaticCoverBytes(origin, candidates);
  if (fallbackBytes) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Content-Length', String(fallbackBytes.length));
    res.setHeader(
      'Cache-Control',
      'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800'
    );
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.end(fallbackBytes);
    return;
  }

  res.statusCode = 404;
  res.end();
}
