import type { BunPressOptions } from '@stacksjs/bunpress'

export default {
  verbose: false,
  docsDir: './docs',
  outDir: './dist',

  nav: [
    { text: 'Home', link: '/' },
    { text: 'Guide', link: '/intro' },
    { text: 'Usage', link: '/usage' },
    { text: 'Configuration', link: '/config' },
    { text: 'Features', link: '/features/cli' },
    {
      text: 'Ecosystem',
      items: [
        { text: 'STX Templating', link: 'https://stx.sh' },
        { text: 'BunPress Docs', link: 'https://bunpress.sh' },
        { text: 'Clarity Logging', link: 'https://clarity.sh' },
        { text: 'Pantry', link: 'https://pantry.sh' },
        { text: 'Stacks Framework', link: 'https://stacksjs.org' },
      ],
    },
    { text: 'GitHub', link: 'https://github.com/stacksjs/headwind' },
  ],

  markdown: {
    title: 'Headwind - Blazingly Fast Utility-First CSS',
    meta: {
      description: 'A utility-first CSS framework built with Bun for exceptional performance. Generate only the CSS you need.',
      author: 'Stacks.js',
      keywords: 'css, utility-first, tailwind, bun, performance, framework',
    },

    sidebar: {
      '/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/intro' },
            { text: 'Installation', link: '/install' },
            { text: 'Configuration', link: '/config' },
          ],
        },
        {
          text: 'Usage',
          items: [
            { text: 'Basic Usage', link: '/usage' },
            { text: 'API Reference', link: '/api-reference' },
          ],
        },
        {
          text: 'Features',
          items: [
            { text: 'CLI', link: '/features/cli' },
            { text: 'Watch Mode', link: '/features/watch-mode' },
            { text: 'Class Compilation', link: '/features/compile-class' },
            { text: 'Shortcuts', link: '/features/shortcuts' },
            { text: 'TypeScript', link: '/features/typescript' },
          ],
        },
        {
          text: 'Advanced',
          items: [
            { text: 'Custom Rules', link: '/advanced/custom-rules' },
            { text: 'Presets', link: '/advanced/presets' },
            { text: 'Theme Customization', link: '/advanced/theme-customization' },
            { text: 'Framework Integration', link: '/advanced/frameworks' },
          ],
        },
        {
          text: 'Resources',
          items: [
            { text: 'Benchmarks', link: '/benchmarks' },
            { text: 'Showcase', link: '/showcase' },
            { text: 'Team', link: '/team' },
            { text: 'Sponsors', link: '/sponsors' },
          ],
        },
      ],
    },

    toc: {
      enabled: true,
      position: 'sidebar',
      title: 'On this page',
      minDepth: 2,
      maxDepth: 4,
      smoothScroll: true,
      activeHighlight: true,
    },

    syntaxHighlightTheme: 'github-dark',

    features: {
      containers: true,
      githubAlerts: true,
      codeBlocks: {
        lineNumbers: true,
        lineHighlighting: true,
        focus: true,
        diffs: true,
        errorWarningMarkers: true,
      },
      codeGroups: true,
      emoji: true,
      badges: true,
    },
  },

  sitemap: {
    enabled: true,
    baseUrl: 'https://headwind.sh',
    priorityMap: {
      '/': 1.0,
      '/intro': 0.9,
      '/install': 0.9,
      '/usage': 0.8,
      '/config': 0.8,
      '/features/*': 0.7,
      '/advanced/*': 0.6,
    },
  },

  robots: {
    enabled: true,
    rules: [
      {
        userAgent: '*',
        allow: ['/'],
        disallow: ['/draft/'],
      },
    ],
  },

  fathom: {
    enabled: true,
    siteId: 'HEADWIND',
    honorDNT: true,
  },
} satisfies BunPressOptions
