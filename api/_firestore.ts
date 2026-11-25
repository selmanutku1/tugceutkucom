import fs from 'node:fs/promises';
import path from 'node:path';

export interface PublicFirestoreBlogPost {
  id: string;
  slug: string;
  title: string;
  h1Title?: string;
  spot: string;
  categoryKey: string;
  categoryLabel: string;
  tags: string[];
  publishedAt: string;
  publishedIso: string;
  readingTime: string;
  coverTheme: string;
  coverImage?: string;
  coverImageMeta?: {
    width: number;
    height: number;
    format: 'JPEG' | 'PNG';
    sizeKb: number;
  };
  featured?: boolean;
  scheduled?: boolean;
  trashed?: boolean;
  trashedAt?: string;
  sections: { id: string; heading: string; paragraphs: string[] }[];
}

export function getTodayIsoUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

export function isPubliclyVisibleFirestorePost(
  post: Pick<PublicFirestoreBlogPost, 'trashed' | 'scheduled' | 'publishedIso'>,
  deletedSet?: Set<string>,
  postId?: string
): boolean {
  if (postId && deletedSet?.has(postId)) return false;
  if (post.trashed) return false;
  if (post.scheduled && post.publishedIso > getTodayIsoUtc()) return false;
  return true;
}

interface FirestoreConfig {
  projectId: string;
  apiKey: string;
  firestoreDatabaseId: string;
}

const FALLBACK_CONFIG: FirestoreConfig = {
  projectId: 'modern-cycling-512506-u8',
  apiKey: 'AIzaSyByEgwfICl8aRaI1TD53kB7I3bL3B79ouM',
  firestoreDatabaseId:
    'ai-studio-tueutkudijitalsi-088dab3b-edc8-46e9-9a1e-be585c357fa5',
};

let cachedConfig: FirestoreConfig | null = null;

async function getFirestoreConfig(): Promise<FirestoreConfig> {
  if (cachedConfig) return cachedConfig;
  try {
    const raw = await fs.readFile(
      path.resolve(process.cwd(), 'firebase-applet-config.json'),
      'utf8'
    );
    const parsed = JSON.parse(raw) as Partial<FirestoreConfig>;
    if (parsed.projectId && parsed.apiKey && parsed.firestoreDatabaseId) {
      cachedConfig = {
        projectId: parsed.projectId,
        apiKey: parsed.apiKey,
        firestoreDatabaseId: parsed.firestoreDatabaseId,
      };
      return cachedConfig;
    }
  } catch {
    // Use fallback config if not bundled in serverless runtime
  }
  cachedConfig = FALLBACK_CONFIG;
  return cachedConfig;
}

type FirestoreValue =
  | { stringValue: string }
  | { integerValue: string }
  | { doubleValue: number }
  | { booleanValue: boolean }
  | { timestampValue: string }
  | { nullValue: null }
  | { arrayValue: { values?: FirestoreValue[] } }
  | { mapValue: { fields?: Record<string, FirestoreValue> } };

function decodeFirestoreValue(val: FirestoreValue | undefined): unknown {
  if (!val || typeof val !== 'object') return undefined;
  if ('stringValue' in val) return val.stringValue;
  if ('booleanValue' in val) return val.booleanValue;
  if ('integerValue' in val) return Number(val.integerValue);
  if ('doubleValue' in val) return Number(val.doubleValue);
  if ('timestampValue' in val) return val.timestampValue;
  if ('nullValue' in val) return null;
  if ('arrayValue' in val) {
    return (val.arrayValue.values || []).map((item) => decodeFirestoreValue(item));
  }
  if ('mapValue' in val) {
    const out: Record<string, unknown> = {};
    const fields = val.mapValue.fields || {};
    for (const [k, v] of Object.entries(fields)) {
      out[k] = decodeFirestoreValue(v);
    }
    return out;
  }
  return undefined;
}

interface FirestoreDocument {
  name?: string;
  fields?: Record<string, FirestoreValue>;
}

async function listCollectionDocuments(
  collectionName: string
): Promise<FirestoreDocument[]> {
  const cfg = await getFirestoreConfig();
  const base = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(
    cfg.projectId
  )}/databases/${encodeURIComponent(cfg.firestoreDatabaseId)}/documents/${encodeURIComponent(
    collectionName
  )}?pageSize=200&key=${encodeURIComponent(cfg.apiKey)}`;

  const res = await fetch(base, {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(3000),
  });
  if (!res.ok) return [];
  const json = (await res.json()) as { documents?: FirestoreDocument[] };
  return Array.isArray(json.documents) ? json.documents : [];
}

export async function fetchPublicFirestoreBlogData(): Promise<{
  posts: PublicFirestoreBlogPost[];
  deletedIds: string[];
}> {
  try {
    const [postDocs, deletedDocs] = await Promise.all([
      listCollectionDocuments('blogPosts'),
      listCollectionDocuments('deletedBlogIds'),
    ]);

    const posts: PublicFirestoreBlogPost[] = [];
    for (const docItem of postDocs) {
      const fields = docItem.fields || {};
      const docId = docItem.name?.split('/').pop() || '';
      const decoded: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(fields)) {
        decoded[k] = decodeFirestoreValue(v);
      }
      if (typeof decoded.title === 'string' && typeof decoded.slug === 'string') {
        posts.push({
          id: typeof decoded.id === 'string' && decoded.id ? decoded.id : docId,
          slug: decoded.slug,
          title: decoded.title,
          h1Title:
            typeof decoded.h1Title === 'string' && decoded.h1Title.trim()
              ? decoded.h1Title
              : undefined,
          spot: typeof decoded.spot === 'string' ? decoded.spot : '',
          categoryKey:
            typeof decoded.categoryKey === 'string'
              ? decoded.categoryKey
              : 'dijital-donusum',
          categoryLabel:
            typeof decoded.categoryLabel === 'string'
              ? decoded.categoryLabel
              : 'Dijital Dönüşüm',
          tags: Array.isArray(decoded.tags)
            ? decoded.tags.map((item) => String(item))
            : [],
          publishedAt:
            typeof decoded.publishedAt === 'string' ? decoded.publishedAt : '',
          publishedIso:
            typeof decoded.publishedIso === 'string'
              ? decoded.publishedIso
              : getTodayIsoUtc(),
          readingTime:
            typeof decoded.readingTime === 'string'
              ? decoded.readingTime
              : '3 dk okuma',
          coverTheme:
            typeof decoded.coverTheme === 'string'
              ? decoded.coverTheme
              : 'transformation',
          coverImage:
            typeof decoded.coverImage === 'string' && decoded.coverImage
              ? decoded.coverImage
              : undefined,
          coverImageMeta:
            decoded.coverImage &&
            decoded.coverImageMeta &&
            typeof decoded.coverImageMeta === 'object'
              ? (decoded.coverImageMeta as PublicFirestoreBlogPost['coverImageMeta'])
              : undefined,
          featured:
            typeof decoded.featured === 'boolean' ? decoded.featured : undefined,
          scheduled:
            typeof decoded.scheduled === 'boolean' ? decoded.scheduled : undefined,
          trashed:
            typeof decoded.trashed === 'boolean' ? decoded.trashed : undefined,
          trashedAt:
            typeof decoded.trashedAt === 'string' ? decoded.trashedAt : undefined,
          sections: Array.isArray(decoded.sections)
            ? (decoded.sections as PublicFirestoreBlogPost['sections'])
            : [],
        });
      }
    }

    posts.sort((a, b) => b.publishedIso.localeCompare(a.publishedIso));

    const deletedIds = deletedDocs
      .map((docItem) => {
        const postIdVal = decodeFirestoreValue(docItem.fields?.postId);
        return typeof postIdVal === 'string' && postIdVal
          ? postIdVal
          : docItem.name?.split('/').pop() || '';
      })
      .filter(Boolean);

    return { posts, deletedIds };
  } catch {
    return { posts: [], deletedIds: [] };
  }
}
