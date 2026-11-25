import { Fragment, type ReactNode } from 'react';
import { ExternalLink } from 'lucide-react';
import { BlogSection } from '../types';
import { slugifyTurkish } from '../utils/slug';

export interface ArticleHeadingItem {
  id: string;
  level: 2 | 3 | 4;
  text: string;
}

export function isSafeHref(rawUrl: string): boolean {
  const trimmed = rawUrl.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith('/') || trimmed.startsWith('#')) {
    return !trimmed.startsWith('//');
  }
  try {
    const parsed = new URL(trimmed);
    return (
      parsed.protocol === 'https:' ||
      parsed.protocol === 'http:' ||
      parsed.protocol === 'mailto:'
    );
  } catch {
    return false;
  }
}

export function isSafeImageSrc(rawSrc: string): boolean {
  const trimmed = rawSrc.trim();
  if (!trimmed) return false;
  if (/^data:image\/(?:jpeg|jpg|png|webp|gif);base64,[a-z0-9+/=\s]+$/i.test(trimmed)) {
    return true;
  }
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return true;
  }
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

export function stripMarkdownForStats(input: string): string {
  return input
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, ' $1 ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<\/?u>/gi, '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/^([-*]|\d+\.)\s+/gm, '')
    .replace(/(\*\*|~~|\*|`)/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function extractOutlineFromSections(sections: BlogSection[]): ArticleHeadingItem[] {
  const items: ArticleHeadingItem[] = [];
  const usedIds = new Set<string>();

  const uniqueId = (base: string) => {
    const clean = slugifyTurkish(base) || `baslik-${items.length + 1}`;
    if (!usedIds.has(clean)) {
      usedIds.add(clean);
      return clean;
    }
    let idx = 2;
    while (usedIds.has(`${clean}-${idx}`)) idx += 1;
    const next = `${clean}-${idx}`;
    usedIds.add(next);
    return next;
  };

  for (const section of sections) {
    if (section.heading.trim()) {
      const id = section.id || uniqueId(section.heading);
      usedIds.add(id);
      items.push({ id, level: 2, text: section.heading.trim() });
    }
    for (const block of section.paragraphs) {
      const trimmed = block.trim();
      const h3Match = trimmed.match(/^###\s+(.+)$/);
      if (h3Match) {
        const text = h3Match[1].trim();
        items.push({ id: uniqueId(text), level: 3, text });
        continue;
      }
      const h4Match = trimmed.match(/^####\s+(.+)$/);
      if (h4Match) {
        const text = h4Match[1].trim();
        items.push({ id: uniqueId(text), level: 4, text });
      }
    }
  }

  return items;
}

function renderInlineNodes(
  text: string,
  onNavigate?: (path: string) => void
): ReactNode[] {
  // Tokenize links, underline <u>...</u>, bold **...**, italic *...*, strike ~~...~~, code `...`
  const tokenRegex =
    /(\[([^\]]+)\]\(([^)\s]+)\)|<u>([\s\S]*?)<\/u>|\*\*([^*]+)\*\*|\*([^*]+)\*|~~([^~]+)~~|`([^`]+)`)/g;

  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let keyCounter = 0;

  while ((match = tokenRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    const key = `inline-${keyCounter++}`;
    if (match[2] !== undefined && match[3] !== undefined) {
      const label = match[2];
      const href = match[3].trim();
      if (isSafeHref(href)) {
        const isInternal = href.startsWith('/') || href.startsWith('#');
        nodes.push(
          <a
            key={key}
            href={href}
            target={isInternal ? undefined : '_blank'}
            rel={isInternal ? undefined : 'noopener noreferrer'}
            onClick={
              isInternal && onNavigate && href.startsWith('/')
                ? (e) => {
                    e.preventDefault();
                    onNavigate(href);
                  }
                : undefined
            }
            className="inline-flex items-baseline gap-1 font-medium text-brand-teal underline underline-offset-4 decoration-brand-teal/50 hover:text-brand-teal-hover hover:decoration-brand-teal transition-colors"
          >
            <span>{renderInlineNodes(label, onNavigate)}</span>
            {!isInternal && <ExternalLink className="w-3 h-3 inline self-center shrink-0 opacity-75" />}
          </a>
        );
      } else {
        nodes.push(label);
      }
    } else if (match[4] !== undefined) {
      nodes.push(
        <span key={key} className="underline underline-offset-4 decoration-brand-teal/60">
          {renderInlineNodes(match[4], onNavigate)}
        </span>
      );
    } else if (match[5] !== undefined) {
      nodes.push(
        <strong key={key} className="font-semibold text-slate-900">
          {renderInlineNodes(match[5], onNavigate)}
        </strong>
      );
    } else if (match[6] !== undefined) {
      nodes.push(
        <em key={key} className="italic text-slate-800">
          {renderInlineNodes(match[6], onNavigate)}
        </em>
      );
    } else if (match[7] !== undefined) {
      nodes.push(
        <del key={key} className="line-through text-slate-400">
          {renderInlineNodes(match[7], onNavigate)}
        </del>
      );
    } else if (match[8] !== undefined) {
      nodes.push(
        <code
          key={key}
          className="px-1.5 py-0.5 rounded bg-slate-100 text-[0.9em] font-mono text-brand-navy"
        >
          {match[8]}
        </code>
      );
    }

    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes.map((node, i) => <Fragment key={i}>{node}</Fragment>);
}

type BlockNode =
  | { type: 'h3'; id: string; text: string }
  | { type: 'h4'; id: string; text: string }
  | { type: 'hr' }
  | { type: 'quote'; lines: string[] }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'image'; alt: string; src: string; caption?: string }
  | { type: 'paragraph'; text: string };

function parseParagraphsToBlocks(paragraphs: string[]): BlockNode[] {
  const rawLines = paragraphs.flatMap((p) => p.split('\n'));
  const blocks: BlockNode[] = [];
  let i = 0;

  while (i < rawLines.length) {
    const line = rawLines[i].trim();
    if (!line) {
      i += 1;
      continue;
    }

    if (/^(---|\*\*\*)$/.test(line)) {
      blocks.push({ type: 'hr' });
      i += 1;
      continue;
    }

    const h4Match = line.match(/^####\s+(.+)$/);
    if (h4Match) {
      const text = h4Match[1].trim();
      blocks.push({ type: 'h4', id: slugifyTurkish(text) || `alt-baslik-${i}`, text });
      i += 1;
      continue;
    }

    const h3Match = line.match(/^###\s+(.+)$/);
    if (h3Match) {
      const text = h3Match[1].trim();
      blocks.push({ type: 'h3', id: slugifyTurkish(text) || `alt-baslik-${i}`, text });
      i += 1;
      continue;
    }

    const imgMatch = line.match(/^!\[([^\]]*)\]\(([^\s)]+)(?:\s+"([^"]*)")?\)$/);
    if (imgMatch) {
      blocks.push({
        type: 'image',
        alt: imgMatch[1].trim(),
        src: imgMatch[2].trim(),
        caption: imgMatch[3]?.trim() || undefined,
      });
      i += 1;
      continue;
    }

    if (line.startsWith('>')) {
      const quoteLines: string[] = [];
      while (i < rawLines.length && rawLines[i].trim().startsWith('>')) {
        quoteLines.push(rawLines[i].trim().replace(/^>\s?/, ''));
        i += 1;
      }
      blocks.push({ type: 'quote', lines: quoteLines });
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < rawLines.length && /^[-*]\s+/.test(rawLines[i].trim())) {
        items.push(rawLines[i].trim().replace(/^[-*]\s+/, ''));
        i += 1;
      }
      blocks.push({ type: 'ul', items });
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < rawLines.length && /^\d+\.\s+/.test(rawLines[i].trim())) {
        items.push(rawLines[i].trim().replace(/^\d+\.\s+/, ''));
        i += 1;
      }
      blocks.push({ type: 'ol', items });
      continue;
    }

    blocks.push({ type: 'paragraph', text: line });
    i += 1;
  }

  return blocks;
}

interface RichArticleContentProps {
  paragraphs: string[];
  onNavigate?: (path: string) => void;
  resolveMediaUrl?: (src: string) => string;
}

export default function RichArticleContent({
  paragraphs,
  onNavigate,
  resolveMediaUrl,
}: RichArticleContentProps) {
  const blocks = parseParagraphsToBlocks(paragraphs);

  return (
    <div className="space-y-4 text-base sm:text-[17px] text-slate-700 leading-[1.8]">
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'h3':
            return (
              <h3
                key={idx}
                id={block.id}
                className="scroll-mt-24 pt-2 text-lg sm:text-xl font-bold tracking-tight text-slate-900"
              >
                {renderInlineNodes(block.text, onNavigate)}
              </h3>
            );
          case 'h4':
            return (
              <h4
                key={idx}
                id={block.id}
                className="scroll-mt-24 pt-1 text-base sm:text-lg font-semibold tracking-tight text-brand-navy"
              >
                {renderInlineNodes(block.text, onNavigate)}
              </h4>
            );
          case 'hr':
            return <hr key={idx} className="my-6 border-slate-200" />;
          case 'quote':
            return (
              <blockquote
                key={idx}
                className="my-5 rounded-r-xl border-l-4 border-brand-teal bg-brand-teal-light/35 px-5 py-4 text-slate-800 italic space-y-2"
              >
                {block.lines.map((line, lIdx) => (
                  <p key={lIdx}>{renderInlineNodes(line, onNavigate)}</p>
                ))}
              </blockquote>
            );
          case 'ul':
            return (
              <ul
                key={idx}
                className="my-3 list-disc pl-6 space-y-2 marker:text-brand-teal"
              >
                {block.items.map((item, iIdx) => (
                  <li key={iIdx}>{renderInlineNodes(item, onNavigate)}</li>
                ))}
              </ul>
            );
          case 'ol':
            return (
              <ol
                key={idx}
                className="my-3 list-decimal pl-6 space-y-2 marker:font-semibold marker:text-brand-teal"
              >
                {block.items.map((item, iIdx) => (
                  <li key={iIdx}>{renderInlineNodes(item, onNavigate)}</li>
                ))}
              </ol>
            );
          case 'image': {
            const resolvedSrc = resolveMediaUrl ? resolveMediaUrl(block.src) : block.src;
            if (!isSafeImageSrc(resolvedSrc)) {
              return null;
            }
            return (
              <figure key={idx} className="my-6 space-y-2">
                <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-xs">
                  <img
                    src={resolvedSrc}
                    alt={block.alt || 'Blog içerik görseli'}
                    loading="lazy"
                    className="w-full max-h-[540px] object-contain mx-auto bg-slate-50"
                  />
                </div>
                {(block.caption || block.alt) && (
                  <figcaption className="text-center text-xs text-slate-500">
                    {block.caption || block.alt}
                  </figcaption>
                )}
              </figure>
            );
          }
          case 'paragraph':
          default:
            return <p key={idx}>{renderInlineNodes(block.text, onNavigate)}</p>;
        }
      })}
    </div>
  );
}
