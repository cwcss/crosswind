<p align="center"><img src=".github/art/cover.jpg" alt="Social Card of this repo"></p>

[![npm version][npm-version-src]][npm-version-href]
[![GitHub Actions][github-actions-src]][github-actions-href]
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
<!-- [![npm downloads][npm-downloads-src]][npm-downloads-href] -->
<!-- [![Codecov][codecov-src]][codecov-href] -->

# crosswind

A blazingly fast, utility-first CSS framework built with Bun. Crosswind generates only the CSS you need by scanning your files for utility classes, providing Tailwind CSS-compatible utilities with exceptional performance.

## Features

- **Blazingly Fast** - Built with Bun for exceptional performance (1000+ utilities in <10ms)
- **On-Demand Generation** - Only generates CSS for utilities you actually use
- **Tailwind-Compatible** - Familiar utility classes and syntax
- **Fully Typed** - Complete TypeScript support with type-safe configuration
- **Highly Configurable** - Customize theme, colors, spacing, variants, and more
- **Zero Runtime Dependencies** - Minimal footprint, maximum performance
- **Hot Reload** - Watch mode for instant rebuilds during development
- **Variant Support** - Responsive, state, dark/light mode, has:, aria-*, data-*, supports:, and more
- **Modern CSS Features** - Grid, Flexbox, animations with @keyframes, transforms, filters, backdrop-filter with vendor prefixes
- **Class Compilation** - Optimize HTML by compiling utility groups into single class names
- **Thoroughly Tested** - 1470+ tests including comprehensive performance benchmarks
- **Production Ready** - Minification, preflight CSS, and optimized builds
- **CLI & API** - Use via command line or programmatic API

## Get Started

### Installation

```bash
bun add @cwcss/crosswind
```

### Quick Start

1. **Initialize Crosswind**:

```bash
bunx crosswind init
```

This creates a `crosswind.config.ts` file:

```typescript
import type { CrosswindOptions } from '@cwcss/crosswind'

const config = {
  content: ['./src/**/*.{html,js,ts,jsx,tsx,stx}'],
  output: './dist/crosswind.css',
  minify: false,
  watch: false,
} satisfies CrosswindOptions

export default config
```

2. **Add utility classes to your HTML**:

```html
<div class="flex items-center justify-between p-4 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600">
  <h1 class="text-2xl font-bold">Hello Crosswind!</h1>
</div>
```

3. **Build your CSS**:

```bash
# Build once
bunx crosswind build

# Build and watch for changes
bunx crosswind watch

# Build with options
bunx crosswind build --output ./dist/styles.css --minify
```

### Programmatic API

```typescript
import { CSSGenerator, defaultConfig } from '@cwcss/crosswind'

const gen = new CSSGenerator(defaultConfig)
gen.generate('flex')
gen.generate('items-center')
gen.generate('p-4')
gen.generate('bg-blue-500')
gen.generate('text-white')
gen.generate('hover:bg-blue-600')

const css = gen.toCSS(true) // true = include preflight
```

Or use the build API:

```typescript
import { build } from '@cwcss/crosswind'

const result = await build({
  content: ['./src/**/*.html'],
  output: './dist/styles.css',
  minify: true,
})

console.log(`Generated ${result.classes.size} classes in ${result.duration}ms`)
```

## CLI Commands

```bash
crosswind build            # Build CSS once
crosswind watch            # Build and watch for changes
crosswind init             # Create config file
crosswind analyze          # Analyze utility class usage
crosswind clean            # Remove output CSS file
crosswind preflight        # Generate preflight CSS only
crosswind --version        # Show version
crosswind --help           # Show help
```

## Configuration

```typescript
import type { CrosswindOptions } from '@cwcss/crosswind'

export default {
  content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
  output: './dist/styles.css',
  minify: false,

  theme: {
    extend: {
      colors: {
        brand: { 500: '#3b82f6', 900: '#1e3a5a' },
      },
      spacing: { '18': '4.5rem' },
    },
  },

  shortcuts: {
    btn: 'px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600',
    card: 'p-6 bg-white rounded-lg shadow-md',
  },

  safelist: ['bg-red-500', 'text-green-500'],
  blocklist: ['debug-*'],
} satisfies CrosswindOptions
```

For full configuration reference, see [packages/crosswind/README.md](packages/crosswind/README.md).

## Available Utilities

Crosswind provides a comprehensive set of Tailwind CSS-compatible utilities:

- **Layout** - display, position, overflow, z-index, columns, aspect-ratio, isolation
- **Flexbox & Grid** - flex, grid, gap, align, justify, place, order
- **Spacing** - margin, padding, space-between (including logical properties: ps, pe, ms, me)
- **Sizing** - width, height, size, min/max sizes (including fractions)
- **Typography** - font, text, tracking, leading, line-clamp, hyphens, text-wrap
- **Colors** - bg, text, border, ring, divide, accent, caret, fill, stroke (all with opacity modifiers: `bg-white/50`, `text-black/[0.87]`)
- **Backgrounds** - linear, radial, and conic gradients with from/via/to stops
- **Borders** - width, color, radius, style, outline, ring, divide (including logical: border-s, border-e, rounded-s, rounded-e)
- **Effects** - shadow, opacity, blend modes, filters, backdrop-filter (with -webkit- vendor prefix)
- **Transforms** - translate, rotate, scale, skew, perspective, 3D transforms
- **Transitions & Animations** - transitions, durations, timing functions, built-in animations with @keyframes (spin, ping, pulse, bounce)
- **Interactivity** - cursor, pointer-events, scroll-snap, touch-action, will-change, scrollbar
- **Content** - content-none, content-empty, content-['text'], content-[attr(data-*)]
- **SVG** - fill, stroke, stroke-width (all with color + opacity support)

### Variants

- **Responsive** - `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
- **State** - `hover:`, `focus:`, `active:`, `disabled:`, `visited:`, `checked:`, `focus-within:`, `focus-visible:`
- **Pseudo-elements** - `before:`, `after:`, `marker:`, `placeholder:`, `selection:`, `file:`
- **Positional** - `first:`, `last:`, `odd:`, `even:`, `only:`
- **Negation** - `not-first:`, `not-last:`, `not-disabled:`, `not-empty:`, `not-checked:`
- **Group/Peer** - `group-hover:`, `peer-focus:`, `group-has-[:checked]:`, `peer-has-focus:`
- **Named Group/Peer** - `group/sidebar:`, `peer/input:`
- **Dark & Light** - `dark:`, `light:`
- **Dynamic** - `has-[:focus]:`, `aria-disabled:`, `aria-[sort=ascending]:`, `data-loading:`, `data-[state=active]:`
- **Media** - `landscape:`, `portrait:`, `motion-safe:`, `motion-reduce:`, `contrast-more:`, `forced-colors:`, `print:`
- **Supports** - `supports-[display:grid]:`, `supports-[backdrop-filter:blur(0)]:`
- **Container** - `@sm:`, `@md:`, `@lg:`, `@xl:`
- **Direction** - `rtl:`, `ltr:`
- **Important** - `!` prefix (e.g., `!text-red-500`)

Media variants stack: `lg:landscape:flex-row` generates `@media (min-width: 1024px) and (orientation: landscape)`.

### Arbitrary Values

```html
<div class="w-[500px] h-[calc(100vh-4rem)] bg-[#1da1f2] text-[clamp(1rem,5vw,3rem)]">
<div class="grid-cols-[120px_1fr_200px]">  <!-- underscores become spaces -->
<div class="[mask-type:luminance]">         <!-- arbitrary properties -->
```

### Class Compilation

Optimize your HTML by compiling utility groups into single class names:

```html
<!-- Before -->
<div class=":cw: flex items-center justify-between px-4 py-2 bg-white rounded-lg shadow-md">

<!-- After build -->
<div class="cw-2k9d3a">
```

## Performance

Crosswind is designed for speed:

| Scenario | Crosswind | UnoCSS | Tailwind v3 | Tailwind v4 |
|----------|----------|--------|-------------|-------------|
| **Simple Utilities** (10 classes) | **2.75us** | 31.58us | 14.32ms | 46.47ms |
| **Real-world Components** (~60 classes) | **25.26us** | 97.71us | 16.12ms | 45.07ms |
| **Large Scale** (500 classes) | **94.89us** | 201.30us | 14.51ms | 40.06ms |
| **Full Project** (~800 classes) | **649.87us** | 1.38ms | 14.41ms | - |

Crosswind wins all 20 benchmarks across all competitors.

## Testing

```bash
bun test                            # Run all 1470+ tests
bun test packages/crosswind/        # Run crosswind tests only
bun test --watch                    # Watch mode
bun run benchmark                   # Run performance benchmarks
```

## Development

```bash
git clone https://github.com/cwcss/crosswind.git
cd crosswind
bun install
bun test
bun run build
```

## Documentation

For comprehensive documentation, visit [crosswind.stacksjs.org](https://crosswind.stacksjs.org).

## Changelog

Please see our [releases](https://github.com/cwcss/crosswind/releases) page for more information on what has changed recently.

## Contributing

Please see [CONTRIBUTING](.github/CONTRIBUTING.md) for details.

## Community

For help, discussion about best practices, or any other conversation that would benefit from being searchable:

[Discussions on GitHub](https://github.com/cwcss/crosswind/discussions)

For casual chit-chat with others using this package:

[Join the Stacks Discord Server](https://discord.gg/stacksjs)

## Postcardware

"Software that is free, but hopes for a postcard." We love receiving postcards from around the world showing where Stacks is being used! We showcase them on our website too.

Our address: Stacks.js, 12665 Village Ln #2306, Playa Vista, CA 90094, United States

## Sponsors

We would like to extend our thanks to the following sponsors for funding Stacks development. If you are interested in becoming a sponsor, please reach out to us.

- [JetBrains](https://www.jetbrains.com/)
- [The Solana Foundation](https://solana.com/)

## License

The MIT License (MIT). Please see [LICENSE](LICENSE.md) for more information.

Made with 💙

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@cwcss/crosswind?style=flat-square
[npm-version-href]: https://npmjs.com/package/@cwcss/crosswind
[github-actions-src]: https://img.shields.io/github/actions/workflow/status/cwcss/crosswind/ci.yml?style=flat-square&branch=main
[github-actions-href]: https://github.com/cwcss/crosswind/actions?query=workflow%3Aci

<!-- [codecov-src]: https://img.shields.io/codecov/c/gh/cwcss/crosswind/main?style=flat-square
[codecov-href]: https://codecov.io/gh/cwcss/crosswind -->
