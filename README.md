<p align="center"><img src=".github/art/cover.jpg" alt="Social Card of this repo"></p>

[![npm version][npm-version-src]][npm-version-href]
[![GitHub Actions][github-actions-src]][github-actions-href]
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
<!-- [![npm downloads][npm-downloads-src]][npm-downloads-href] -->
<!-- [![Codecov][codecov-src]][codecov-href] -->

# headwind

A blazingly fast, utility-first CSS framework built with Bun. Headwind generates only the CSS you need by scanning your files for utility classes, providing Tailwind CSS-compatible utilities with exceptional performance.

## Features

- ⚡️ **Blazingly Fast** - Built with Bun for exceptional performance (1000+ utilities in <10ms)
- 🎯 **On-Demand Generation** - Only generates CSS for utilities you actually use
- 🎨 **Tailwind-Compatible** - Familiar utility classes and syntax
- 💪 **Fully Typed** - Complete TypeScript support with type-safe configuration
- 🔧 **Highly Configurable** - Customize theme, colors, spacing, variants, and more
- 📦 **Zero Dependencies** - Minimal footprint, maximum performance
- 🔥 **Hot Reload** - Watch mode for instant rebuilds during development
- 🎭 **Variant Support** - Responsive, state (hover, focus, etc.), dark mode, and custom variants
- ✨ **Modern CSS Features** - Grid, Flexbox, animations, transforms, filters, and more
- 🧪 **Thoroughly Tested** - 860+ tests including comprehensive performance benchmarks
- 🚀 **Production Ready** - Minification, preflight CSS, and optimized builds
- ⌨️ **CLI & API** - Use via command line or programmatic API

## Get Started

### Installation

```bash
bun add headwind
# or
npm install headwind
```

### Quick Start

1. **Create a configuration file** (`headwind.config.ts`):

```typescript
import type { HeadwindConfig } from 'headwind'

export default {
  content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
  output: './dist/styles.css',
  minify: true,
} satisfies Partial<HeadwindConfig>
```

2. **Add utility classes to your HTML**:

```html
<div class="flex items-center justify-between p-4 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600">
  <h1 class="text-2xl font-bold">Hello Headwind!</h1>
</div>
```

3. **Build your CSS**:

```bash
# Build once
bunx headwind build

# Build and watch for changes
bunx headwind watch

# Build with options
bunx headwind build --output ./dist/styles.css --minify
```

### Programmatic API

You can also use Headwind programmatically:

```typescript
import { build } from 'headwind'

const result = await build({
  content: ['./src/**/*.html'],
  output: './dist/styles.css',
  minify: true,
})

console.log(`Generated ${result.classes.size} classes in ${result.duration}ms`)
```

## Configuration

Headwind supports extensive configuration options:

```typescript
import type { HeadwindConfig } from 'headwind'

export default {
  // Content sources to scan for utility classes
  content: ['./src/**/*.{html,js,ts,jsx,tsx}'],

  // Output CSS file path
  output: './dist/styles.css',

  // Minify output CSS
  minify: false,

  // Enable watch mode
  watch: false,

  // Enable verbose logging
  verbose: false,

  // Theme customization
  theme: {
    colors: {
      primary: '#3b82f6',
      secondary: '#10b981',
      // ... extend or override default colors
    },
    spacing: {
      // ... customize spacing scale
    },
    fontSize: {
      // ... customize font sizes
    },
    // ... and more
  },

  // Shortcuts (utility aliases)
  shortcuts: {
    btn: 'px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600',
    card: 'p-6 bg-white rounded-lg shadow-md',
  },

  // Custom variants
  variants: {
    // ... configure breakpoints, states, etc.
  },

  // Safelist (always include these classes)
  safelist: ['bg-red-500', 'text-green-500'],

  // Blocklist (never include these classes)
  blocklist: ['debug-*'],

  // Custom rules
  rules: [],

  // Preflight CSS (normalize/reset styles)
  preflights: [],

  // Presets
  presets: [],
} satisfies Partial<HeadwindConfig>
```

## Available Utilities

Headwind provides a comprehensive set of utility classes compatible with Tailwind CSS:

- **Layout**: display, position, overflow, z-index, etc.
- **Flexbox & Grid**: flex, grid, gap, align, justify, etc.
- **Spacing**: margin, padding with full scale support
- **Sizing**: width, height, min/max sizes
- **Typography**: font family, size, weight, line height, text alignment, etc.
- **Backgrounds**: colors, gradients, images, position, size
- **Borders**: width, color, radius, style
- **Effects**: shadow, opacity, blend modes, filters
- **Transforms**: translate, rotate, scale, skew
- **Transitions & Animations**: duration, timing, delay
- **Interactivity**: cursor, pointer events, user select, scroll behavior
- **Advanced**: mask utilities, backdrop filters, ring utilities

### Variants

- **Responsive**: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
- **State**: `hover:`, `focus:`, `active:`, `disabled:`, `visited:`, `checked:`
- **Pseudo-elements**: `before:`, `after:`, `placeholder:`, `selection:`
- **Group/Peer**: `group-hover:`, `peer-focus:`
- **Dark mode**: `dark:`
- **Positional**: `first:`, `last:`, `odd:`, `even:`
- **Important**: `!` prefix (e.g., `!text-red-500`)

### Arbitrary Values

Headwind supports arbitrary values for maximum flexibility:

```html
<div class="w-[500px] h-[calc(100vh-4rem)] bg-[#1da1f2] text-[clamp(1rem,5vw,3rem)]">
  Custom values!
</div>
```

## Testing

Headwind includes a comprehensive test suite with 860+ tests:

```bash
# Run all tests
bun test

# Run specific test files
bun test test/performance.test.ts

# Run tests in watch mode
bun test --watch
```

### Test Coverage

- **Core Functionality**: Parser, generator, scanner, builder
- **Utilities**: Layout, typography, colors, spacing, grid, flexbox
- **Variants**: Responsive, state, pseudo-elements, combinations
- **Advanced Features**: Shortcuts, custom rules, arbitrary values
- **Performance**: Benchmarks for generation speed and memory efficiency
- **Edge Cases**: Invalid inputs, complex nesting, duplicate handling

## Performance

Headwind is designed for speed. Here are some benchmarks from our test suite:

- **Simple utilities**: ~7ms for 1,000 utilities
- **Complex utilities** (with variants): ~9ms for 1,000 utilities
- **Arbitrary values**: ~3ms for 1,000 utilities
- **CSS output**: ~1ms for 1,000 rules

All benchmarks run on Bun runtime. Your results may vary based on hardware.

## Development

To contribute to Headwind development:

```bash
# Clone the repository
git clone https://github.com/stacksjs/headwind.git
cd headwind

# Install dependencies
bun install

# Run tests
bun test

# Run tests in watch mode
bun test --watch

# Run performance benchmarks
bun test test/performance.test.ts

# Type check
bun run typecheck

# Build the package
bun run build
```

## Changelog

Please see our [releases](https://github.com/stackjs/headwind/releases) page for more information on what has changed recently.

## Contributing

Please see [CONTRIBUTING](.github/CONTRIBUTING.md) for details.

We welcome contributions! Whether it's:

- 🐛 Bug reports and fixes
- ✨ New utility classes or features
- 📝 Documentation improvements
- ⚡️ Performance optimizations
- 🧪 Additional test coverage

## Community

For help, discussion about best practices, or any other conversation that would benefit from being searchable:

[Discussions on GitHub](https://github.com/stacksjs/headwind/discussions)

For casual chit-chat with others using this package:

[Join the Stacks Discord Server](https://discord.gg/stacksjs)

## Postcardware

“Software that is free, but hopes for a postcard.” We love receiving postcards from around the world showing where Stacks is being used! We showcase them on our website too.

Our address: Stacks.js, 12665 Village Ln #2306, Playa Vista, CA 90094, United States 🌎

## Sponsors

We would like to extend our thanks to the following sponsors for funding Stacks development. If you are interested in becoming a sponsor, please reach out to us.

- [JetBrains](https://www.jetbrains.com/)
- [The Solana Foundation](https://solana.com/)

## License

The MIT License (MIT). Please see [LICENSE](LICENSE.md) for more information.

Made with 💙

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/headwind?style=flat-square
[npm-version-href]: https://npmjs.com/package/headwind
[github-actions-src]: https://img.shields.io/github/actions/workflow/status/stacksjs/headwind/ci.yml?style=flat-square&branch=main
[github-actions-href]: https://github.com/stacksjs/headwind/actions?query=workflow%3Aci

<!-- [codecov-src]: https://img.shields.io/codecov/c/gh/stacksjs/headwind/main?style=flat-square
[codecov-href]: https://codecov.io/gh/stacksjs/headwind -->
