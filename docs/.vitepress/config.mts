import { defineConfig } from 'vitepress';

export default defineConfig({
  base: '/rxjs-operator-renaming/',
  title: 'RxJS Operator Renaming',
  description:
    'Keep the root, fix the suffix — a user-friendly RxJS operator vocabulary built from curried roots and boundary combinators.',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Vocabulary', link: '/vocabulary' },
      { text: 'Algebra', link: '/rxjs-operator-naming-algebra' },
      { text: 'Matrix', link: '/operator-algebra-matrix.html', target: '_self' },
      { text: 'Migration', link: '/migration' },
      { text: 'netxpert.ch', link: 'https://netxpert.ch/' },
    ],
    sidebar: [
      { text: 'The Renaming Plan', link: '/' },
      { text: 'Operator Vocabulary', link: '/vocabulary' },
      { text: 'The Operator Algebra', link: '/rxjs-operator-naming-algebra' },
      { text: 'Root × Boundary Matrix', link: '/operator-algebra-matrix.html', target: '_self' },
      { text: 'Migration Tables', link: '/migration' },
    ],
    search: { provider: 'local' },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/hansschenker/rxjs-operator-renaming' },
    ],
    outline: 'deep',
  },
});
