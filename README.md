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
- 📦 **Zero Runtime Dependencies** - Minimal footprint, maximum performance
- 🔥 **Hot Reload** - Watch mode for instant rebuilds during development
- 🎭 **Variant Support** - Responsive, state (hover, focus, etc.), dark mode, and custom variants
- ✨ **Modern CSS Features** - Grid, Flexbox, animations, transforms, filters, and more
- 🔨 **Class Compilation** - Optimize HTML by compiling utility groups into single class names
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

1. **Initialize Headwind**:

```bash
# Create a config file
bunx headwind init
```

This creates a `headwind.config.ts` file:

```typescript
import type { HeadwindOptions } from 'headwind'

export default {
  content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
  output: './dist/headwind.css',
  minify: false,
} satisfies HeadwindOptions
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

## CLI Commands

Headwind provides a comprehensive CLI:

```bash
headwind build            # Build CSS once
headwind watch            # Build and watch for changes
headwind init             # Create config file
headwind analyze          # Analyze utility class usage
headwind clean            # Remove output CSS file
headwind preflight        # Generate preflight CSS only
headwind --version        # Show version
headwind --help           # Show help
```

## Configuration

Headwind supports extensive configuration options:

```typescript
import type { HeadwindOptions } from 'headwind'

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
} satisfies HeadwindOptions
```

For more configuration options, see the [Configuration Guide](https://headwind.stacksjs.org/config).

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

### Compile Class (HTML Optimization)

Optimize your HTML by compiling utility groups into single class names:

```html
<!-- Before -->
<div class=":hw: flex items-center justify-between px-4 py-2 bg-white rounded-lg shadow-md">
  Content
</div>

<!-- After build -->
<div class="hw-2k9d3a">
  Content
</div>
```

This reduces HTML file size by up to 60%. Learn more in the [Compile Class documentation](https://headwind.stacksjs.org/features/compile-class).

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

Headwind is designed for speed. We've benchmarked against other popular utility-first CSS frameworks to demonstrate our performance advantages.

### Benchmark Results

Our comprehensive benchmark suite compares Headwind with other popular utility-first CSS frameworks.

| Scenario | Headwind | UnoCSS | Tailwind v3 | Tailwind v4 | Performance |
|----------|----------|---------|-------------|-------------|-------------|
| **Simple Utilities** (10 classes) | **9.35µs** | 20.52µs | 9.51ms | 26.89ms | **Headwind: 2.2x faster than UnoCSS, 1,017x faster than v3, 2,876x faster than v4** ⚡ |
| **Complex Utilities** (11 classes) | **13.17µs** | 26.86µs | 8.79ms | 28.46ms | **Headwind: 2.0x faster than UnoCSS, 668x faster than v3, 2,161x faster than v4** ⚡ |
| **Arbitrary Values** (7 classes) | **5.66µs** | 28.05µs | 9.16ms | 27.86ms | **Headwind: 5.0x faster than UnoCSS, 1,619x faster than v3, 4,923x faster than v4** ⚡ |
| **Real-world Components** (6 strings) | **11.39µs** | 108.71µs | 168.74ms | 154.19ms | **Headwind: 9.5x faster than UnoCSS, 14,813x faster than v3, 13,538x faster than v4** ⚡ |
| **Large Scale** (1000 utilities) | **290.64µs** | 404.72µs | 9.02ms | 25.18ms | **Headwind: 1.4x faster than UnoCSS, 31x faster than v3, 87x faster than v4** ⚡ |
| **CSS Output** (1000 rules) | **825.36µs** | 82.36ms | 10.04ms | 27.22ms | **Headwind: 100x faster than UnoCSS, 12x faster than v3, 33x faster than v4** ⚡ |
| **Color Utilities** (240 classes) | **287.58µs** | 307.74µs | 9.47ms | 26.07ms | **Headwind: 1.1x faster than UnoCSS, 33x faster than v3, 91x faster than v4** ⚡ |
| **Responsive** (1000 classes) | **489.90µs** | 572.71µs | 9.24ms | 25.72ms | **Headwind: 1.2x faster than UnoCSS, 19x faster than v3, 52x faster than v4** ⚡ |
| **Interactive States** (550 classes) | **227.04µs** | 785.77µs | 9.30ms | 24.89ms | **Headwind: 3.5x faster than UnoCSS, 41x faster than v3, 110x faster than v4** ⚡ |
| **Duplicate Handling** (6000 items) | **36.33µs** | 1.56ms | 12.49ms | 29.61ms | **Headwind: 43x faster than UnoCSS, 344x faster than v3, 815x faster than v4** ⚡ |

**Key Takeaways:**

- **Headwind wins 10/10 categories vs UnoCSS, Tailwind v3, AND Tailwind v4**
- **Real-world components**: Up to 14,813x faster than Tailwind v3 - Dominant performance for actual usage
- **Duplicate handling**: 815x faster than Tailwind v4, 344x faster than v3, 43x faster than UnoCSS
- **Arbitrary values**: 4,923x faster than Tailwind v4, 1,619x faster than v3, 5x faster than UnoCSS
- **CSS output generation**: 100x faster than UnoCSS, 33x faster than Tailwind v4, 12x faster than v3
- **Consistently faster**: Beats all frameworks across all 10 benchmark categories
- **Production-ready performance**: Optimized for real-world applications with complex component patterns

### Running Benchmarks

You can run the benchmarks yourself to see the performance on your hardware:

```bash
# Run the comprehensive benchmark suite
bun run benchmark

# Or run from the packages/headwind directory
cd packages/headwind
bun run benchmark
```

All benchmarks use [Mitata](https://github.com/evanwashere/mitata) for accurate measurements and run on Bun runtime. Results may vary based on your hardware.

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

## Documentation

For comprehensive documentation, visit [headwind.stacksjs.org](https://headwind.stacksjs.org)

- [Installation Guide](https://headwind.stacksjs.org/install)
- [Usage Guide](https://headwind.stacksjs.org/usage)
- [Configuration](https://headwind.stacksjs.org/config)
- [CLI Reference](https://headwind.stacksjs.org/features/cli)
- [API Reference](https://headwind.stacksjs.org/api-reference)

## Changelog

Please see our [releases](https://github.com/stacksjs/headwind/releases) page for more information on what has changed recently.

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
