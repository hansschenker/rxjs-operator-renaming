import { mkdirSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { renderDocsPages, renderVocabularySidebar } from '../src/docs.ts';

const target = process.argv[2] ?? join(homedir(), 'rxjs-vitepress-ds');

for (const page of renderDocsPages()) {
  const file = join(target, page.path);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, page.content);
  console.log('wrote', file);
}

const sidebarFile = join(target, '.vitepress', 'vocabulary-sidebar.json');
writeFileSync(sidebarFile, renderVocabularySidebar());
console.log('wrote', sidebarFile);
