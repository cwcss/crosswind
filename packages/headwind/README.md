# headwind

The core CSS engine powering the Crosswind framework. Headwind handles parsing, rule generation, scanning, and CSS output for utility-first CSS classes.

## Installation

```bash
bun add headwind
```

```bash
npm install headwind
```

## Usage

```typescript
import { build, buildAndWrite } from 'headwind'
import { config } from 'headwind'

// Build CSS from content patterns
const result = await buildAndWrite({
  ...config,
  content: ['./src/**/*.html'],
  output: './dist/styles.css',
  minify: true,
})

console.log(`Generated ${result.classes.size} classes in ${result.duration}ms`)
```

### Using as a Bun Plugin

```typescript
import { plugin } from 'headwind'

await Bun.build({
  entrypoints: ['./src/index.ts'],
  outdir: './dist',
  plugins: [plugin()],
})
```

## Features

- Utility class parsing and CSS generation
- Configurable theme (colors, spacing, fonts, breakpoints, etc.)
- Variant support (responsive, hover, focus, dark mode, and many more)
- Preflight / CSS reset styles
- Custom rules and shortcuts
- Preset system
- Compile class transformer
- Attributify mode
- Bracket syntax support
- File scanning and transformation
- Bun plugin integration

## License

MIT
