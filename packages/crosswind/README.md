# @cwcss/crosswind

A performant Utility-First CSS framework, similar to Tailwind or UnoCSS. Built with TypeScript and optimized for Bun.

## Installation

```bash
bun add @cwcss/crosswind
```

```bash
npm install @cwcss/crosswind
```

## Usage

```typescript
import { build, scan, generate } from '@cwcss/crosswind'

// Build CSS from your content files
const result = await build({
  content: ['./src/**/*.html', './src/**/*.tsx'],
  output: './dist/styles.css',
  minify: true,
})
```

### CLI

```bash
# Run the crosswind CLI
crosswind build
crosswind build --watch
crosswind build --minify
```

## Features

- On-demand utility CSS generation
- Tailwind-compatible utility classes
- Built-in CSS minification
- File watching for development
- Configurable theme (colors, spacing, typography, etc.)
- Variant support (hover, focus, dark mode, responsive, and more)
- Custom rules and shortcuts
- Preset system for extensibility
- Bun plugin support
- Cross-platform CLI binaries (Linux, macOS, Windows)

## License

MIT
