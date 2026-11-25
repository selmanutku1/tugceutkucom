import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { BlogCategoryKey, BlogPost, BlogSection } from '../types';
import { getBlogData } from '../data/blogPostsEn';
import type { Language } from './LanguageContext';
import {
  db,
  handleFirestoreError,
  OperationType,
} from '../firebase';
import { ensureUniqueSlug, slugifyTurkish } from '../utils/slug';
import { parseBodyToSections, sectionsToBodyText } from '../utils/blogSections';
import { stripMarkdownForStats } from '../components/RichArticleContent';

export { ensureUniqueSlug, parseBodyToSections, sectionsToBodyText, slugifyTurkish };

const STORAGE_KEY = 'tu_custom_blog_posts_v1';
const DELETED_IDS_STORAGE_KEY = 'tu_deleted_blog_ids_v1';
const FEATURED_STORAGE_KEY = 'tu_featured_blog_id_v1';

export interface BlogPostInput {
  title: string;
  h1Title?: string;
  slug?: string;
  spot: string;
  categoryKey: BlogCategoryKey;
  tags: string[];
  coverTheme: BlogPost['coverTheme'];
  coverImage?: string;
  coverImageMeta?: BlogPost['coverImageMeta'];
  publishedIso?: string;
  scheduled?: boolean;
  featured?: boolean;
  readingTime?: string;
  bodyText: string;
}

interface GetPostsOptions {
  includeScheduled?: boolean;
}

interface BlogContextValue {
  customPosts: BlogPost[];
  deletedBaseIds: string[];
  featuredPostId: string | null;
  isLoading: boolean;
  isAdmin: boolean;
  unsyncedLocalCount: number;
  verifyAdminPasscode: (passcode: string) => boolean;
  signOutAdmin: () => void;
  syncPendingLocalPosts: () => Promise<number>;
  getPosts: (lang: Language, options?: GetPostsOptions) => BlogPost[];
  getTrashedPosts: (lang: Language) => BlogPost[];
  getFeaturedPost: (lang: Language) => BlogPost | undefined;
  isBuiltInPost: (id: string) => boolean;
  isModifiedBuiltInPost: (id: string) => boolean;
  addPost: (input: BlogPostInput, passcode?: string) => Promise<BlogPost>;
  updatePost: (id: string, input: BlogPostInput, passcode?: string) => Promise<BlogPost>;
  deletePost: (id: string, passcode?: string) => Promise<void>;
  restorePost: (id: string) => Promise<void>;
  permanentlyDeletePost: (id: string) => Promise<void>;
  resetBuiltInPost: (id: string, passcode?: string) => Promise<void>;
  setFeaturedPost: (postId: string | null) => Promise<void>;
}

const BlogContext = createContext<BlogContextValue>({
  customPosts: [],
  deletedBaseIds: [],
  featuredPostId: null,
  isLoading: false,
  isAdmin: false,
  unsyncedLocalCount: 0,
  verifyAdminPasscode: () => false,
  signOutAdmin: () => {},
  syncPendingLocalPosts: async () => 0,
  getPosts: (lang) => getBlogData(lang).posts,
  getTrashedPosts: () => [],
  getFeaturedPost: (lang) => {
    const posts = getBlogData(lang).posts;
    return posts.find((p) => p.featured) || posts[0];
  },
  isBuiltInPost: () => false,
  isModifiedBuiltInPost: () => false,
  addPost: async () => {
    throw new Error('BlogProvider not mounted');
  },
  updatePost: async () => {
    throw new Error('BlogProvider not mounted');
  },
  deletePost: async () => {},
  restorePost: async () => {},
  permanentlyDeletePost: async () => {},
  resetBuiltInPost: async () => {},
  setFeaturedPost: async () => {},
});

const CATEGORY_LABELS_TR: Record<BlogCategoryKey, string> = {
  'dijital-donusum': 'Dijital Dönüşüm',
  insurtech: 'Insurtech ve Dijital Sigortacılık',
  'yapay-zeka': 'Yapay Zekâ ve Teknoloji',
  'dijital-pazarlama': 'Dijital Büyüme ve Performans Pazarlaması',
  'strateji-yonetim': 'Strateji ve Yönetim',
};

const VALID_CATEGORY_KEYS = new Set<BlogCategoryKey>([
  'dijital-donusum',
  'insurtech',
  'yapay-zeka',
  'dijital-pazarlama',
  'strateji-yonetim',
]);

const VALID_COVER_THEMES = new Set<BlogPost['coverTheme']>([
  'photo',
  'transformation',
  'insurtech',
  'ai',
  'growth',
  'strategy',
]);

const BUILT_IN_TR_POSTS = getBlogData('tr').posts;
const BUILT_IN_POST_IDS = new Set(BUILT_IN_TR_POSTS.map((p) => p.id));

export function getTodayIso(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function formatTurkishDateFromIso(iso: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  const parsed = new Date(`${iso}T12:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return iso;
  return new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(parsed);
}

function estimateReadingTime(bodyText: string): string {
  const cleanText = stripMarkdownForStats(bodyText);
  const wordCount = cleanText.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 180));
  return `${minutes} dk okuma`;
}

function readStoredPosts(): BlogPost[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as BlogPost[]) : [];
  } catch {
    return [];
  }
}

function writeStoredPosts(posts: BlogPost[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  } catch {
    // Ignore storage quota errors
  }
}

function readStoredDeletedIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(DELETED_IDS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === 'string')
      : [];
  } catch {
    return [];
  }
}

function writeStoredDeletedIds(ids: string[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(DELETED_IDS_STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Ignore storage quota errors
  }
}

function readStoredFeaturedId(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(FEATURED_STORAGE_KEY);
    return raw && raw.trim() ? raw.trim() : null;
  } catch {
    return null;
  }
}

function writeStoredFeaturedId(postId: string | null) {
  if (typeof window === 'undefined') return;
  try {
    if (postId) {
      window.localStorage.setItem(FEATURED_STORAGE_KEY, postId);
    } else {
      window.localStorage.removeItem(FEATURED_STORAGE_KEY);
    }
  } catch {
    // Ignore storage quota errors
  }
}

function sanitizePostPayload(post: BlogPost) {
  const safeId = post.id.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 128) || `custom-${Date.now()}`;
  const safeSlug = (
    slugifyTurkish(post.slug) ||
    slugifyTurkish(post.h1Title || '') ||
    slugifyTurkish(post.title) ||
    `yazi-${Date.now()}`
  ).slice(0, 120);
  const categoryKey: BlogCategoryKey = VALID_CATEGORY_KEYS.has(post.categoryKey)
    ? post.categoryKey
    : 'dijital-donusum';
  const coverTheme: BlogPost['coverTheme'] = VALID_COVER_THEMES.has(post.coverTheme)
    ? post.coverTheme
    : 'transformation';
  const categoryLabel = (post.categoryLabel || CATEGORY_LABELS_TR[categoryKey]).trim().slice(0, 120);
  const rawTags = Array.isArray(post.tags)
    ? post.tags.map((t) => String(t).trim().slice(0, 80)).filter(Boolean).slice(0, 15)
    : [];
  const tags = rawTags.length > 0 ? rawTags : [categoryLabel];
  const title = post.title.trim().slice(0, 240) || 'Başlıksız Yazı';
  const h1Title = post.h1Title?.trim().slice(0, 240);
  const spot = post.spot.trim().slice(0, 1000) || title;
  const publishedIso = /^\d{4}-\d{2}-\d{2}$/.test(post.publishedIso)
    ? post.publishedIso
    : getTodayIso();
  const publishedAt = (post.publishedAt || formatTurkishDateFromIso(publishedIso)).trim().slice(0, 60);
  const readingTime = (post.readingTime || '3 dk okuma').trim().slice(0, 40);
  const sections = (Array.isArray(post.sections) && post.sections.length > 0
    ? post.sections
    : [{ id: 'icerik', heading: h1Title || title, paragraphs: [spot] }]
  ).slice(0, 50);

  if (post.coverImage && post.coverImage.length > 750_000) {
    throw new Error(
      'Kapak görseli boyutu veritabanı sınırını aşıyor. Lütfen daha küçük veya sıkıştırılmış bir görsel yükleyin.'
    );
  }

  const payload: Record<string, unknown> = {
    id: safeId,
    slug: safeSlug,
    title,
    spot,
    categoryKey,
    categoryLabel,
    tags,
    publishedAt,
    publishedIso,
    readingTime,
    coverTheme,
    sections,
  };

  if (h1Title) {
    payload.h1Title = h1Title;
  }

  if (post.coverImage) {
    payload.coverImage = post.coverImage;
    if (
      post.coverImageMeta &&
      Number.isInteger(post.coverImageMeta.width) &&
      Number.isInteger(post.coverImageMeta.height) &&
      (post.coverImageMeta.format === 'JPEG' || post.coverImageMeta.format === 'PNG') &&
      Number.isInteger(post.coverImageMeta.sizeKb)
    ) {
      payload.coverImageMeta = {
        width: Math.max(1, Math.min(10000, post.coverImageMeta.width)),
        height: Math.max(1, Math.min(10000, post.coverImageMeta.height)),
        format: post.coverImageMeta.format,
        sizeKb: Math.max(0, Math.min(10240, post.coverImageMeta.sizeKb)),
      };
    }
  }

  if (typeof post.featured === 'boolean') {
    payload.featured = post.featured;
  }

  if (typeof post.scheduled === 'boolean') {
    payload.scheduled = post.scheduled;
  }

  if (typeof post.trashed === 'boolean') {
    payload.trashed = post.trashed;
  }

  if (post.trashedAt && post.trashedAt.trim().length >= 10) {
    payload.trashedAt = post.trashedAt.trim().slice(0, 40);
  }

  const serializedSize = JSON.stringify(payload).length;
  if (serializedSize > 920_000) {
    throw new Error(
      'Yazı içindeki görseller ve metin toplam boyutu veritabanı sınırını (~920 KB) aşıyor. Lütfen yazı içi görsel sayısını veya boyutunu azaltın.'
    );
  }

  return payload;
}

function normalizeFirestoreDocToBlogPost(raw: Record<string, unknown>, docId: string): BlogPost | null {
  if (typeof raw.title !== 'string' || typeof raw.slug !== 'string') return null;
  const categoryKey: BlogCategoryKey = VALID_CATEGORY_KEYS.has(raw.categoryKey as BlogCategoryKey)
    ? (raw.categoryKey as BlogCategoryKey)
    : 'dijital-donusum';
  const coverTheme: BlogPost['coverTheme'] = VALID_COVER_THEMES.has(
    raw.coverTheme as BlogPost['coverTheme']
  )
    ? (raw.coverTheme as BlogPost['coverTheme'])
    : 'transformation';

  return {
    id: typeof raw.id === 'string' && raw.id ? raw.id : docId,
    slug: raw.slug,
    title: raw.title,
    h1Title: typeof raw.h1Title === 'string' && raw.h1Title.trim() ? raw.h1Title : undefined,
    spot: typeof raw.spot === 'string' ? raw.spot : '',
    categoryKey,
    categoryLabel:
      typeof raw.categoryLabel === 'string' && raw.categoryLabel
        ? raw.categoryLabel
        : CATEGORY_LABELS_TR[categoryKey],
    tags: Array.isArray(raw.tags)
      ? raw.tags.map((item) => String(item))
      : [CATEGORY_LABELS_TR[categoryKey]],
    publishedAt: typeof raw.publishedAt === 'string' ? raw.publishedAt : '',
    publishedIso:
      typeof raw.publishedIso === 'string'
        ? raw.publishedIso
        : getTodayIso(),
    readingTime: typeof raw.readingTime === 'string' ? raw.readingTime : '3 dk okuma',
    coverTheme,
    coverImage: typeof raw.coverImage === 'string' && raw.coverImage ? raw.coverImage : undefined,
    coverImageMeta:
      raw.coverImage && raw.coverImageMeta && typeof raw.coverImageMeta === 'object'
        ? (raw.coverImageMeta as BlogPost['coverImageMeta'])
        : undefined,
    featured: typeof raw.featured === 'boolean' ? raw.featured : undefined,
    scheduled: typeof raw.scheduled === 'boolean' ? raw.scheduled : undefined,
    trashed: typeof raw.trashed === 'boolean' ? raw.trashed : undefined,
    trashedAt: typeof raw.trashedAt === 'string' ? raw.trashedAt : undefined,
    sections: Array.isArray(raw.sections) ? (raw.sections as BlogSection[]) : [],
  };
}

function buildBlogPostFromInput(
  input: BlogPostInput,
  resolvedSlug: string,
  existing?: BlogPost
): BlogPost {
  const id = existing?.id || `custom-${Date.now()}`;
  const requestedIso =
    input.publishedIso && /^\d{4}-\d{2}-\d{2}$/.test(input.publishedIso)
      ? input.publishedIso
      : existing?.publishedIso || getTodayIso();
  const publishedAt = formatTurkishDateFromIso(requestedIso);
  const cleanedTags = input.tags.map((t) => t.trim()).filter(Boolean).slice(0, 15);
  const cleanedTitle = input.title.trim();
  const cleanedH1 = input.h1Title?.trim() || undefined;

  return {
    id,
    slug: resolvedSlug,
    title: cleanedTitle,
    h1Title: cleanedH1,
    spot: input.spot.trim(),
    categoryKey: input.categoryKey,
    categoryLabel: CATEGORY_LABELS_TR[input.categoryKey],
    tags:
      cleanedTags.length > 0
        ? cleanedTags
        : [CATEGORY_LABELS_TR[input.categoryKey]],
    publishedAt,
    publishedIso: requestedIso,
    readingTime: input.readingTime?.trim() || estimateReadingTime(input.bodyText),
    coverTheme: input.coverTheme,
    coverImage: input.coverImage || undefined,
    coverImageMeta: input.coverImage ? input.coverImageMeta : undefined,
    featured: typeof input.featured === 'boolean' ? input.featured : existing?.featured,
    scheduled: Boolean(input.scheduled),
    trashed: false,
    sections: parseBodyToSections(input.bodyText, cleanedH1 || cleanedTitle),
  };
}

export function BlogProvider({ children }: { children: ReactNode }) {
  const initialLocalPostsRef = useRef<BlogPost[]>(readStoredPosts());
  const [customPosts, setCustomPosts] = useState<BlogPost[]>(() => initialLocalPostsRef.current);
  const [deletedBaseIds, setDeletedBaseIds] = useState<string[]>(() =>
    readStoredDeletedIds()
  );
  const [featuredPostId, setFeaturedPostId] = useState<string | null>(() =>
    readStoredFeaturedId()
  );
  const [firestorePostIds, setFirestorePostIds] = useState<Set<string> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem('tu_admin_passcode_verified_v1') === 'true';
  });

  const verifyAdminPasscode = useCallback((passcode: string): boolean => {
    if (passcode.trim() === '1411') {
      setIsAdmin(true);
      sessionStorage.setItem('tu_admin_passcode_verified_v1', 'true');
      return true;
    }
    return false;
  }, []);

  const signOutAdmin = useCallback(() => {
    setIsAdmin(false);
    sessionStorage.removeItem('tu_admin_passcode_verified_v1');
  }, []);

  // Subscribe to persistent Firestore blogPosts, deletedBlogIds, and siteSettings/featuredBlog
  useEffect(() => {
    let resolvedPosts = false;
    let resolvedDeletes = false;
    let resolvedFeatured = false;
    const markLoaded = () => {
      if (resolvedPosts && resolvedDeletes && resolvedFeatured) {
        setIsLoading(false);
      }
    };

    const unsubPosts = onSnapshot(
      collection(db, 'blogPosts'),
      (snapshot) => {
        const remotePosts: BlogPost[] = [];
        const remoteIds = new Set<string>();
        snapshot.forEach((docSnap) => {
          const parsed = normalizeFirestoreDocToBlogPost(
            docSnap.data() as Record<string, unknown>,
            docSnap.id
          );
          if (parsed) {
            remotePosts.push(parsed);
            remoteIds.add(parsed.id);
          }
        });

        remotePosts.sort((a, b) => b.publishedIso.localeCompare(a.publishedIso));
        setFirestorePostIds(remoteIds);

        const unsyncedLocals = initialLocalPostsRef.current.filter(
          (localPost) => !remoteIds.has(localPost.id) && !BUILT_IN_POST_IDS.has(localPost.id)
        );
        const combined = [...unsyncedLocals, ...remotePosts].sort((a, b) =>
          b.publishedIso.localeCompare(a.publishedIso)
        );

        setCustomPosts(combined);
        writeStoredPosts(combined);
        resolvedPosts = true;
        markLoaded();
      },
      (error) => {
        resolvedPosts = true;
        markLoaded();
        handleFirestoreError(error, OperationType.LIST, 'blogPosts');
      }
    );

    const unsubDeletes = onSnapshot(
      collection(db, 'deletedBlogIds'),
      (snapshot) => {
        const ids: string[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as { postId?: string };
          ids.push(typeof data.postId === 'string' && data.postId ? data.postId : docSnap.id);
        });
        setDeletedBaseIds(ids);
        writeStoredDeletedIds(ids);
        resolvedDeletes = true;
        markLoaded();
      },
      (error) => {
        resolvedDeletes = true;
        markLoaded();
        handleFirestoreError(error, OperationType.LIST, 'deletedBlogIds');
      }
    );

    const unsubFeatured = onSnapshot(
      doc(db, 'siteSettings', 'featuredBlog'),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as { featuredPostId?: unknown };
          const id =
            typeof data.featuredPostId === 'string' && data.featuredPostId.trim()
              ? data.featuredPostId.trim()
              : null;
          setFeaturedPostId(id);
          writeStoredFeaturedId(id);
        } else {
          setFeaturedPostId(null);
          writeStoredFeaturedId(null);
        }
        resolvedFeatured = true;
        markLoaded();
      },
      (error) => {
        resolvedFeatured = true;
        markLoaded();
        handleFirestoreError(error, OperationType.GET, 'siteSettings/featuredBlog');
      }
    );

    return () => {
      unsubPosts();
      unsubDeletes();
      unsubFeatured();
    };
  }, []);

  const unsyncedLocalCount = firestorePostIds
    ? initialLocalPostsRef.current.filter(
        (p) => !firestorePostIds.has(p.id) && !BUILT_IN_POST_IDS.has(p.id)
      ).length
    : 0;

  const syncPendingLocalPosts = useCallback(async (): Promise<number> => {
    if (!isAdmin || !firestorePostIds) return 0;

    const toSync = initialLocalPostsRef.current.filter(
      (p) => !firestorePostIds.has(p.id) && !BUILT_IN_POST_IDS.has(p.id)
    );
    if (toSync.length === 0) return 0;

    let synced = 0;
    for (const post of toSync) {
      const path = `blogPosts/${post.id}`;
      try {
        const sanitized = sanitizePostPayload(post);
        await setDoc(doc(db, 'blogPosts', String(sanitized.id)), {
          ...sanitized,
          authorId: 'admin_1411',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        synced += 1;
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, path);
      }
    }

    initialLocalPostsRef.current = initialLocalPostsRef.current.filter(
      (p) => !toSync.some((syncedPost) => syncedPost.id === p.id)
    );
    return synced;
  }, [firestorePostIds, isAdmin]);

  useEffect(() => {
    if (isAdmin && unsyncedLocalCount > 0) {
      void syncPendingLocalPosts().catch((err) => {
        console.warn('Auto-sync of local posts paused:', err);
      });
    }
  }, [isAdmin, syncPendingLocalPosts, unsyncedLocalCount]);

  const isBuiltInPost = useCallback((id: string) => BUILT_IN_POST_IDS.has(id), []);

  const isModifiedBuiltInPost = useCallback(
    (id: string) =>
      BUILT_IN_POST_IDS.has(id) && customPosts.some((p) => p.id === id && !p.trashed),
    [customPosts]
  );

  const getPosts = useCallback(
    (lang: Language, options?: GetPostsOptions) => {
      const basePosts = getBlogData(lang).posts;
      const baseIdSet = new Set(basePosts.map((p) => p.id));
      const deletedSet = new Set(deletedBaseIds);
      const overridesById = new Map<string, BlogPost>();
      const newCustomPosts: BlogPost[] = [];

      for (const post of customPosts) {
        if (post.trashed) continue;
        if (baseIdSet.has(post.id)) {
          overridesById.set(post.id, post);
        } else {
          newCustomPosts.push(post);
        }
      }

      const mergedBasePosts = basePosts
        .filter((p) => !deletedSet.has(p.id))
        .map((p) => overridesById.get(p.id) ?? p);

      const combined = [...newCustomPosts, ...mergedBasePosts];
      const todayIso = getTodayIso();
      const visible = options?.includeScheduled
        ? combined
        : combined.filter((p) => !(p.scheduled && p.publishedIso > todayIso));

      return visible.sort((a, b) => b.publishedIso.localeCompare(a.publishedIso));
    },
    [customPosts, deletedBaseIds]
  );

  const getTrashedPosts = useCallback(
    (lang: Language): BlogPost[] => {
      const basePosts = getBlogData(lang).posts;
      const baseById = new Map(basePosts.map((p) => [p.id, p]));
      const deletedSet = new Set(deletedBaseIds);
      const result: BlogPost[] = [];
      const addedIds = new Set<string>();

      for (const post of customPosts) {
        if (post.trashed || (BUILT_IN_POST_IDS.has(post.id) && deletedSet.has(post.id))) {
          result.push(post);
          addedIds.add(post.id);
        }
      }

      for (const deletedId of deletedBaseIds) {
        if (addedIds.has(deletedId)) continue;
        const base = baseById.get(deletedId);
        if (base) {
          result.push({ ...base, trashed: true });
          addedIds.add(deletedId);
        }
      }

      return result.sort((a, b) =>
        (b.trashedAt || b.publishedIso).localeCompare(a.trashedAt || a.publishedIso)
      );
    },
    [customPosts, deletedBaseIds]
  );

  const getFeaturedPost = useCallback(
    (lang: Language): BlogPost | undefined => {
      const posts = getPosts(lang);
      if (featuredPostId) {
        const chosen = posts.find((p) => p.id === featuredPostId);
        if (chosen) return chosen;
      }
      return posts.find((p) => p.featured) || posts[0];
    },
    [featuredPostId, getPosts]
  );

  const setFeaturedPost = useCallback(async (postId: string | null) => {
    if (!isAdmin) {
      throw new Error('Öne çıkan yazıyı değiştirmek için yönetici geçiş kodu ile giriş yapmalısınız.');
    }

    const docRef = doc(db, 'siteSettings', 'featuredBlog');
    const path = 'siteSettings/featuredBlog';

    if (!postId) {
      try {
        await deleteDoc(docRef);
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, path);
      }
      return;
    }

    const cleanId = postId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 128);
    if (!cleanId) return;

    try {
      const existingSnap = await getDoc(docRef);
      if (existingSnap.exists()) {
        await updateDoc(docRef, {
          featuredPostId: cleanId,
          updatedBy: 'admin_1411',
          updatedAt: serverTimestamp(),
        });
      } else {
        await setDoc(docRef, {
          id: 'featuredBlog',
          featuredPostId: cleanId,
          updatedBy: 'admin_1411',
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  }, [isAdmin]);

  const addPost = useCallback(
    async (input: BlogPostInput): Promise<BlogPost> => {
      if (!isAdmin) {
        throw new Error('Yazı kaydetmek için yönetici geçiş kodu ile giriş yapmalısınız.');
      }

      const deletedSet = new Set(deletedBaseIds);
      const customIdSet = new Set(customPosts.map((p) => p.id));
      const existingSlugs = new Set([
        ...customPosts.filter((p) => !p.trashed).map((p) => p.slug),
        ...BUILT_IN_TR_POSTS.filter(
          (p) => !deletedSet.has(p.id) && !customIdSet.has(p.id)
        ).map((p) => p.slug),
      ]);
      const desiredSlug = input.slug?.trim() || input.h1Title?.trim() || input.title;
      const uniqueSlug = ensureUniqueSlug(desiredSlug, existingSlugs);
      const candidate = buildBlogPostFromInput(input, uniqueSlug);
      const sanitized = sanitizePostPayload(candidate);
      const docId = String(sanitized.id);
      const path = `blogPosts/${docId}`;

      try {
        await setDoc(doc(db, 'blogPosts', docId), {
          ...sanitized,
          authorId: 'admin_1411',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        if (input.featured) {
          await setFeaturedPost(docId);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, path);
      }

      return { ...candidate, id: docId, slug: String(sanitized.slug) };
    },
    [customPosts, deletedBaseIds, isAdmin, setFeaturedPost]
  );

  const updatePost = useCallback(
    async (id: string, input: BlogPostInput): Promise<BlogPost> => {
      if (!isAdmin) {
        throw new Error('Yazı güncellemek için yönetici geçiş kodu ile giriş yapmalısınız.');
      }

      const existing =
        customPosts.find((p) => p.id === id) ||
        BUILT_IN_TR_POSTS.find((p) => p.id === id);

      const deletedSet = new Set(deletedBaseIds);
      const customIdSet = new Set(customPosts.map((p) => p.id));
      const existingSlugs = new Set([
        ...customPosts.filter((p) => p.id !== id && !p.trashed).map((p) => p.slug),
        ...BUILT_IN_TR_POSTS.filter(
          (p) => p.id !== id && !deletedSet.has(p.id) && !customIdSet.has(p.id)
        ).map((p) => p.slug),
      ]);

      const desiredSlug =
        input.slug?.trim() || input.h1Title?.trim() || input.title || existing?.slug || '';
      const uniqueSlug = ensureUniqueSlug(desiredSlug, existingSlugs);
      const updated = buildBlogPostFromInput(input, uniqueSlug, existing);
      const sanitized = sanitizePostPayload(updated);
      const docId = String(sanitized.id);
      const path = `blogPosts/${docId}`;
      const docRef = doc(db, 'blogPosts', docId);

      try {
        const existingSnap = await getDoc(docRef);
        if (!existingSnap.exists()) {
          await setDoc(docRef, {
            ...sanitized,
            authorId: 'admin_1411',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        } else {
          const updateFields: Record<string, unknown> = {
            slug: sanitized.slug,
            title: sanitized.title,
            h1Title: sanitized.h1Title ?? deleteField(),
            spot: sanitized.spot,
            categoryKey: sanitized.categoryKey,
            categoryLabel: sanitized.categoryLabel,
            tags: sanitized.tags,
            publishedAt: sanitized.publishedAt,
            publishedIso: sanitized.publishedIso,
            readingTime: sanitized.readingTime,
            coverTheme: sanitized.coverTheme,
            sections: sanitized.sections,
            coverImage: sanitized.coverImage ?? deleteField(),
            coverImageMeta: sanitized.coverImageMeta ?? deleteField(),
            scheduled: Boolean(sanitized.scheduled),
            trashed: false,
            trashedAt: deleteField(),
            updatedAt: serverTimestamp(),
          };
          if (typeof sanitized.featured === 'boolean') {
            updateFields.featured = sanitized.featured;
          }
          await updateDoc(docRef, updateFields);
        }

        if (input.featured === true) {
          await setFeaturedPost(docId);
        } else if (input.featured === false && featuredPostId === docId) {
          await setFeaturedPost(null);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, path);
      }

      if (deletedBaseIds.includes(id)) {
        const deletedPath = `deletedBlogIds/${id}`;
        try {
          await deleteDoc(doc(db, 'deletedBlogIds', id));
        } catch (error) {
          handleFirestoreError(error, OperationType.DELETE, deletedPath);
        }
      }

      return { ...updated, id: docId, slug: String(sanitized.slug) };
    },
    [customPosts, deletedBaseIds, featuredPostId, isAdmin, setFeaturedPost]
  );

  const deletePost = useCallback(
    async (id: string) => {
      if (!isAdmin) {
        throw new Error('Yazı silmek için yönetici geçiş kodu ile giriş yapmalısınız.');
      }

      const trashedAt = new Date().toISOString();
      const docRef = doc(db, 'blogPosts', id);
      const path = `blogPosts/${id}`;

      try {
        const existingSnap = await getDoc(docRef);
        if (existingSnap.exists()) {
          await updateDoc(docRef, {
            trashed: true,
            trashedAt,
            updatedAt: serverTimestamp(),
          });
        } else if (!BUILT_IN_POST_IDS.has(id)) {
          const localMatch = initialLocalPostsRef.current.find((p) => p.id === id);
          if (localMatch) {
            const sanitized = sanitizePostPayload({ ...localMatch, trashed: true, trashedAt });
            await setDoc(docRef, {
              ...sanitized,
              authorId: 'admin_1411',
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            });
            initialLocalPostsRef.current = initialLocalPostsRef.current.filter((p) => p.id !== id);
          }
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, path);
      }

      if (BUILT_IN_POST_IDS.has(id)) {
        const deletedPath = `deletedBlogIds/${id}`;
        try {
          await setDoc(doc(db, 'deletedBlogIds', id), {
            postId: id,
            deletedBy: 'admin_1411',
            createdAt: serverTimestamp(),
          });
        } catch (error) {
          handleFirestoreError(error, OperationType.CREATE, deletedPath);
        }
      }

      if (featuredPostId === id) {
        await setFeaturedPost(null);
      }
    },
    [featuredPostId, isAdmin, setFeaturedPost]
  );

  const restorePost = useCallback(async (id: string) => {
    if (!isAdmin) {
      throw new Error('Yazıyı geri yüklemek için yönetici geçiş kodu ile giriş yapmalısınız.');
    }

    const docRef = doc(db, 'blogPosts', id);
    const path = `blogPosts/${id}`;
    try {
      const existingSnap = await getDoc(docRef);
      if (existingSnap.exists()) {
        await updateDoc(docRef, {
          trashed: false,
          trashedAt: deleteField(),
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }

    if (BUILT_IN_POST_IDS.has(id)) {
      const deletedPath = `deletedBlogIds/${id}`;
      try {
        await deleteDoc(doc(db, 'deletedBlogIds', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, deletedPath);
      }
    }
  }, [isAdmin]);

  const permanentlyDeletePost = useCallback(async (id: string) => {
    if (!isAdmin) {
      throw new Error('Yazıyı kalıcı olarak silmek için yönetici geçiş kodu ile giriş yapmalısınız.');
    }

    initialLocalPostsRef.current = initialLocalPostsRef.current.filter((p) => p.id !== id);
    const path = `blogPosts/${id}`;
    try {
      await deleteDoc(doc(db, 'blogPosts', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  }, [isAdmin]);

  const resetBuiltInPost = useCallback(async (id: string) => {
    if (!isAdmin) {
      throw new Error('Yazıyı sıfırlamak için yönetici geçiş kodu ile giriş yapmalısınız.');
    }

    const path = `blogPosts/${id}`;
    try {
      await deleteDoc(doc(db, 'blogPosts', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }

    const deletedPath = `deletedBlogIds/${id}`;
    try {
      await deleteDoc(doc(db, 'deletedBlogIds', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, deletedPath);
    }
  }, [isAdmin]);

  return (
    <BlogContext.Provider
      value={{
        customPosts,
        deletedBaseIds,
        featuredPostId,
        isLoading,
        isAdmin,
        unsyncedLocalCount,
        verifyAdminPasscode,
        signOutAdmin,
        syncPendingLocalPosts,
        getPosts,
        getTrashedPosts,
        getFeaturedPost,
        isBuiltInPost,
        isModifiedBuiltInPost,
        addPost,
        updatePost,
        deletePost,
        restorePost,
        permanentlyDeletePost,
        resetBuiltInPost,
        setFeaturedPost,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
}

export function useBlog() {
  return useContext(BlogContext);
}
