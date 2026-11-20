import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { BlogCategoryKey, BlogPost, BlogSection } from '../types';
import { getBlogData } from '../data/blogPostsEn';
import type { Language } from './LanguageContext';

const STORAGE_KEY = 'tu_custom_blog_posts_v1';
const DELETED_IDS_STORAGE_KEY = 'tu_deleted_blog_ids_v1';

export interface BlogPostInput {
  title: string;
  slug?: string;
  spot: string;
  categoryKey: BlogCategoryKey;
  tags: string[];
  coverTheme: BlogPost['coverTheme'];
  coverImage?: string;
  coverImageMeta?: BlogPost['coverImageMeta'];
  readingTime?: string;
  bodyText: string;
}

interface BlogContextValue {
  customPosts: BlogPost[];
  deletedBaseIds: string[];
  isLoading: boolean;
  getPosts: (lang: Language) => BlogPost[];
  isBuiltInPost: (id: string) => boolean;
  isModifiedBuiltInPost: (id: string) => boolean;
  addPost: (input: BlogPostInput, passcode: string) => Promise<BlogPost>;
  updatePost: (id: string, input: BlogPostInput, passcode: string) => Promise<BlogPost>;
  deletePost: (id: string, passcode: string) => Promise<void>;
  resetBuiltInPost: (id: string, passcode: string) => Promise<void>;
}

const BlogContext = createContext<BlogContextValue>({
  customPosts: [],
  deletedBaseIds: [],
  isLoading: false,
  getPosts: (lang) => getBlogData(lang).posts,
  isBuiltInPost: () => false,
  isModifiedBuiltInPost: () => false,
  addPost: async () => {
    throw new Error('BlogProvider not mounted');
  },
  updatePost: async () => {
    throw new Error('BlogProvider not mounted');
  },
  deletePost: async () => {},
  resetBuiltInPost: async () => {},
});

const CATEGORY_LABELS_TR: Record<BlogCategoryKey, string> = {
  'dijital-donusum': 'Dijital Dönüşüm',
  insurtech: 'Insurtech ve Dijital Sigortacılık',
  'yapay-zeka': 'Yapay Zekâ ve Teknoloji',
  'dijital-pazarlama': 'Dijital Pazarlama ve Büyüme',
  'strateji-yonetim': 'Strateji ve Yönetim',
};

const BUILT_IN_TR_POSTS = getBlogData('tr').posts;
const BUILT_IN_POST_IDS = new Set(BUILT_IN_TR_POSTS.map((p) => p.id));

export function slugifyTurkish(text: string): string {
  const map: Record<string, string> = {
    ç: 'c',
    Ç: 'c',
    ğ: 'g',
    Ğ: 'g',
    ı: 'i',
    İ: 'i',
    I: 'i',
    ö: 'o',
    Ö: 'o',
    ş: 's',
    Ş: 's',
    ü: 'u',
    Ü: 'u',
    â: 'a',
    Â: 'a',
    î: 'i',
    Î: 'i',
    û: 'u',
    Û: 'u',
  };

  return text
    .split('')
    .map((ch) => map[ch] ?? ch)
    .join('')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[’'`"“”]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 90)
    .replace(/^-+|-+$/g, '');
}

export function ensureUniqueSlug(rawSlug: string, existingSlugs: Set<string>): string {
  const cleanBase = slugifyTurkish(rawSlug) || `yazi-${Date.now().toString().slice(-6)}`;
  if (!existingSlugs.has(cleanBase)) {
    return cleanBase;
  }

  let counter = 2;
  let candidate = `${cleanBase}-${counter}`;
  while (existingSlugs.has(candidate)) {
    counter += 1;
    candidate = `${cleanBase}-${counter}`;
  }
  return candidate;
}

export function parseBodyToSections(bodyText: string, fallbackHeading: string): BlogSection[] {
  const lines = bodyText.split('\n');
  const sections: BlogSection[] = [];
  let currentHeading = '';
  let currentParagraphs: string[] = [];

  const flush = () => {
    const cleaned = currentParagraphs.map((p) => p.trim()).filter(Boolean);
    if (cleaned.length > 0 || currentHeading) {
      const heading = currentHeading || fallbackHeading;
      sections.push({
        id: slugifyTurkish(heading) || `bolum-${sections.length + 1}`,
        heading,
        paragraphs: cleaned.length > 0 ? cleaned : [''],
      });
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    if (line.startsWith('## ')) {
      if (currentHeading || currentParagraphs.length > 0) {
        flush();
      }
      currentHeading = line.replace(/^##\s+/, '').trim();
      currentParagraphs = [];
    } else {
      currentParagraphs.push(line);
    }
  }

  flush();

  if (sections.length === 0) {
    return [
      {
        id: 'icerik',
        heading: fallbackHeading,
        paragraphs: [bodyText.trim() || ''],
      },
    ];
  }

  return sections;
}

export function sectionsToBodyText(sections: BlogSection[]): string {
  return sections
    .map((section) => `## ${section.heading}\n\n${section.paragraphs.join('\n\n')}`)
    .join('\n\n');
}

function estimateReadingTime(bodyText: string): string {
  const wordCount = bodyText.trim().split(/\s+/).filter(Boolean).length;
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

function buildBlogPostFromInput(
  input: BlogPostInput,
  resolvedSlug: string,
  existing?: BlogPost
): BlogPost {
  const now = new Date();
  const id = existing?.id || `custom-${Date.now()}`;

  const publishedIso = existing?.publishedIso || now.toISOString().slice(0, 10);
  const publishedAt =
    existing?.publishedAt ||
    new Intl.DateTimeFormat('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(now);

  const cleanedTags = input.tags
    .map((t) => t.trim())
    .filter(Boolean);

  return {
    id,
    slug: resolvedSlug,
    title: input.title.trim(),
    spot: input.spot.trim(),
    categoryKey: input.categoryKey,
    categoryLabel: CATEGORY_LABELS_TR[input.categoryKey],
    tags:
      cleanedTags.length > 0
        ? cleanedTags
        : [CATEGORY_LABELS_TR[input.categoryKey]],
    publishedAt,
    publishedIso,
    readingTime: input.readingTime?.trim() || estimateReadingTime(input.bodyText),
    coverTheme: input.coverTheme,
    coverImage: input.coverImage || undefined,
    coverImageMeta: input.coverImage ? input.coverImageMeta : undefined,
    featured: existing?.featured,
    sections: parseBodyToSections(input.bodyText, input.title.trim()),
  };
}

export function BlogProvider({ children }: { children: ReactNode }) {
  const [customPosts, setCustomPosts] = useState<BlogPost[]>(() => readStoredPosts());
  const [deletedBaseIds, setDeletedBaseIds] = useState<string[]>(() =>
    readStoredDeletedIds()
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const syncFromServer = async () => {
      try {
        const res = await fetch('/api/blog-posts');
        if (!res.ok) return;
        const data = (await res.json()) as {
          posts?: BlogPost[];
          deletedIds?: string[];
        };
        if (active && Array.isArray(data.posts) && data.posts.length > 0) {
          setCustomPosts((localPosts) => {
            const byId = new Map<string, BlogPost>();
            for (const p of data.posts!) byId.set(p.id, p);
            for (const p of localPosts) {
              if (!byId.has(p.id)) byId.set(p.id, p);
            }
            const merged = Array.from(byId.values()).sort((a, b) =>
              b.publishedIso.localeCompare(a.publishedIso)
            );
            writeStoredPosts(merged);
            return merged;
          });
        }
        if (active && Array.isArray(data.deletedIds) && data.deletedIds.length > 0) {
          setDeletedBaseIds((localIds) => {
            const merged = Array.from(new Set([...data.deletedIds!, ...localIds]));
            writeStoredDeletedIds(merged);
            return merged;
          });
        }
      } catch {
        // Offline or static host fallback — localStorage remains active
      } finally {
        if (active) setIsLoading(false);
      }
    };

    syncFromServer();
    return () => {
      active = false;
    };
  }, []);

  const isBuiltInPost = useCallback((id: string) => BUILT_IN_POST_IDS.has(id), []);

  const isModifiedBuiltInPost = useCallback(
    (id: string) =>
      BUILT_IN_POST_IDS.has(id) && customPosts.some((p) => p.id === id),
    [customPosts]
  );

  const getPosts = useCallback(
    (lang: Language) => {
      const basePosts = getBlogData(lang).posts;
      const baseIdSet = new Set(basePosts.map((p) => p.id));
      const deletedSet = new Set(deletedBaseIds);
      const overridesById = new Map<string, BlogPost>();
      const newCustomPosts: BlogPost[] = [];

      for (const post of customPosts) {
        if (baseIdSet.has(post.id)) {
          overridesById.set(post.id, post);
        } else {
          newCustomPosts.push(post);
        }
      }

      const mergedBasePosts = basePosts
        .filter((p) => !deletedSet.has(p.id))
        .map((p) => overridesById.get(p.id) ?? p);

      return [...newCustomPosts, ...mergedBasePosts];
    },
    [customPosts, deletedBaseIds]
  );

  const addPost = useCallback(
    async (input: BlogPostInput, passcode: string): Promise<BlogPost> => {
      const deletedSet = new Set(deletedBaseIds);
      const customIdSet = new Set(customPosts.map((p) => p.id));
      const existingSlugs = new Set([
        ...customPosts.map((p) => p.slug),
        ...BUILT_IN_TR_POSTS.filter(
          (p) => !deletedSet.has(p.id) && !customIdSet.has(p.id)
        ).map((p) => p.slug),
      ]);
      const desiredSlug = input.slug?.trim() || input.title;
      const uniqueSlug = ensureUniqueSlug(desiredSlug, existingSlugs);
      const candidate = buildBlogPostFromInput(input, uniqueSlug);

      setCustomPosts((prev) => {
        const next = [candidate, ...prev];
        writeStoredPosts(next);
        return next;
      });

      try {
        await fetch('/api/blog-posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-dashboard-passcode': passcode,
          },
          body: JSON.stringify({ post: candidate }),
        });
      } catch {
        // Already saved locally
      }

      return candidate;
    },
    [customPosts, deletedBaseIds]
  );

  const updatePost = useCallback(
    async (id: string, input: BlogPostInput, passcode: string): Promise<BlogPost> => {
      const existing =
        customPosts.find((p) => p.id === id) ||
        BUILT_IN_TR_POSTS.find((p) => p.id === id);

      const deletedSet = new Set(deletedBaseIds);
      const customIdSet = new Set(customPosts.map((p) => p.id));
      const existingSlugs = new Set([
        ...customPosts.filter((p) => p.id !== id).map((p) => p.slug),
        ...BUILT_IN_TR_POSTS.filter(
          (p) => p.id !== id && !deletedSet.has(p.id) && !customIdSet.has(p.id)
        ).map((p) => p.slug),
      ]);

      const desiredSlug = input.slug?.trim() || input.title || existing?.slug || '';
      const uniqueSlug = ensureUniqueSlug(desiredSlug, existingSlugs);
      const updated = buildBlogPostFromInput(input, uniqueSlug, existing);

      setCustomPosts((prev) => {
        const hasExisting = prev.some((p) => p.id === id);
        const next = hasExisting
          ? prev.map((p) => (p.id === id ? updated : p))
          : [updated, ...prev];
        writeStoredPosts(next);
        return next;
      });

      if (deletedBaseIds.includes(id)) {
        setDeletedBaseIds((prev) => {
          const next = prev.filter((item) => item !== id);
          writeStoredDeletedIds(next);
          return next;
        });
      }

      try {
        await fetch(`/api/blog-posts/${encodeURIComponent(id)}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-dashboard-passcode': passcode,
          },
          body: JSON.stringify({ post: updated }),
        });
      } catch {
        // Already updated locally
      }

      return updated;
    },
    [customPosts, deletedBaseIds]
  );

  const deletePost = useCallback(async (id: string, passcode: string) => {
    setCustomPosts((prev) => {
      const next = prev.filter((p) => p.id !== id);
      writeStoredPosts(next);
      return next;
    });

    if (BUILT_IN_POST_IDS.has(id)) {
      setDeletedBaseIds((prev) => {
        if (prev.includes(id)) return prev;
        const next = [...prev, id];
        writeStoredDeletedIds(next);
        return next;
      });
    }

    try {
      await fetch(`/api/blog-posts/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: {
          'x-dashboard-passcode': passcode,
        },
      });
    } catch {
      // Already removed locally
    }
  }, []);

  const resetBuiltInPost = useCallback(async (id: string, passcode: string) => {
    setCustomPosts((prev) => {
      const next = prev.filter((p) => p.id !== id);
      writeStoredPosts(next);
      return next;
    });

    setDeletedBaseIds((prev) => {
      if (!prev.includes(id)) return prev;
      const next = prev.filter((item) => item !== id);
      writeStoredDeletedIds(next);
      return next;
    });

    try {
      await fetch(`/api/blog-posts/${encodeURIComponent(id)}?mode=reset`, {
        method: 'DELETE',
        headers: {
          'x-dashboard-passcode': passcode,
        },
      });
    } catch {
      // Already reset locally
    }
  }, []);

  return (
    <BlogContext.Provider
      value={{
        customPosts,
        deletedBaseIds,
        isLoading,
        getPosts,
        isBuiltInPost,
        isModifiedBuiltInPost,
        addPost,
        updatePost,
        deletePost,
        resetBuiltInPost,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
}

export function useBlog() {
  return useContext(BlogContext);
}
