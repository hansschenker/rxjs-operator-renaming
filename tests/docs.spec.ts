import { describe, expect, it } from 'vitest';
import { catalog } from '../src/catalog';
import { renderDocsPages, renderVocabularySidebar } from '../src/docs';

describe('vitepress docs rendering', () => {
  const pages = renderDocsPages();
  const allContent = pages.map((p) => p.content).join('\n');

  it('renders the overview with the suffix grammar', () => {
    const index = pages.find((p) => p.path === 'vocabulary/index.md');
    expect(index).toBeDefined();
    expect(index?.content).toContain('## The suffix grammar');
    expect(index?.content).toContain('| `OnComplete` |');
  });

  it('every operator entry appears on exactly one page', () => {
    const operators = catalog.filter((e) => e.kind !== 'excluded' && e.kind !== 'boundary');
    for (const entry of operators) {
      const marker = `name="${entry.friendly}"`;
      const hits = pages.filter((p) => p.content.includes(marker));
      expect(hits, `${entry.friendly} should be on exactly one page`).toHaveLength(1);
    }
  });

  it('operator cards carry the 8-policy story table', () => {
    const bufferPage = pages.find((p) => p.path === 'vocabulary/buffer-window.md');
    expect(bufferPage?.content).toContain('name="bufferOn"');
    expect(bufferPage?.content).toContain('| **Cancellation** |');
  });

  it('excluded operators get the deprecation page, not cards', () => {
    const excludedPage = pages.find((p) => p.path === 'vocabulary/excluded.md');
    expect(excludedPage?.content).toContain('`retryWhen`');
    expect(allContent).not.toContain('name="retryWhen"');
  });

  it('sidebar JSON parses and links every page', () => {
    const sidebar: unknown = JSON.parse(renderVocabularySidebar());
    expect(Array.isArray(sidebar)).toBe(true);
    const group = (sidebar as { items: { link: string }[] }[])[0];
    expect(group).toBeDefined();
    const links = (group?.items ?? []).map((i) => i.link);
    for (const page of pages) {
      const link = `/${page.path.replace(/index\.md$/, '').replace(/\.md$/, '')}`;
      expect(links, `sidebar missing ${link}`).toContain(link);
    }
  });
});
