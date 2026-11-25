import { BlogSection } from '../types';
import { slugifyTurkish } from './slug';

export function parseBodyToSections(bodyText: string, fallbackHeading: string): BlogSection[] {
  const lines = bodyText.split('\n');
  const sections: BlogSection[] = [];
  let currentHeading = '';
  let currentLines: string[] = [];

  const flush = () => {
    const cleanedBlocks: string[] = [];
    let listOrQuoteBuffer: string[] = [];
    let bufferMode: 'ul' | 'ol' | 'quote' | null = null;

    const flushBuffer = () => {
      if (listOrQuoteBuffer.length > 0) {
        cleanedBlocks.push(listOrQuoteBuffer.join('\n'));
        listOrQuoteBuffer = [];
      }
      bufferMode = null;
    };

    for (const raw of currentLines) {
      const line = raw.trim();
      if (!line) {
        flushBuffer();
        continue;
      }

      if (/^[-*]\s+/.test(line)) {
        if (bufferMode !== 'ul') flushBuffer();
        bufferMode = 'ul';
        listOrQuoteBuffer.push(line);
      } else if (/^\d+\.\s+/.test(line)) {
        if (bufferMode !== 'ol') flushBuffer();
        bufferMode = 'ol';
        listOrQuoteBuffer.push(line);
      } else if (line.startsWith('>')) {
        if (bufferMode !== 'quote') flushBuffer();
        bufferMode = 'quote';
        listOrQuoteBuffer.push(line);
      } else {
        flushBuffer();
        cleanedBlocks.push(line);
      }
    }
    flushBuffer();

    if (cleanedBlocks.length > 0 || currentHeading) {
      const heading = currentHeading || fallbackHeading;
      sections.push({
        id: slugifyTurkish(heading) || `bolum-${sections.length + 1}`,
        heading,
        paragraphs: cleanedBlocks.length > 0 ? cleanedBlocks : [''],
      });
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (line.startsWith('## ')) {
      if (currentHeading || currentLines.length > 0) {
        flush();
      }
      currentHeading = line.replace(/^##\s+/, '').trim();
      currentLines = [];
    } else {
      currentLines.push(rawLine);
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

  return sections.slice(0, 50);
}

export function sectionsToBodyText(sections: BlogSection[]): string {
  return sections
    .map((section) => `## ${section.heading}\n\n${section.paragraphs.join('\n\n')}`)
    .join('\n\n');
}
