# CLI Commands

Crosswind provides a powerful command-line interface for building, watching, and analyzing your CSS.

## Installation

Install Crosswind globally or locally:

```bash
# Global (use anywhere)
bun add --global crosswind

# Local (project-specific)
bun add --dev crosswind
```

## Commands

### `build`

Build CSS from your content files.

```bash
crosswind build [options]
```

**Options:**

- `--output <path>` - Output CSS file path
- `--minify` - Minify CSS output
- `--watch` - Watch for file changes
- `--content <pattern>` - Content file pattern
- `--config <path>` - Path to config file
- `--verbose` - Show detailed output
- `--no-preflight` - Skip preflight CSS

**Examples:**

```bash
# Basic build
crosswind build

# Build with custom output
crosswind build --output ./dist/styles.css

# Build and minify
crosswind build --minify

# Build with specific content
crosswind build --content "./src/**/*.tsx"

# Build with custom config
crosswind build --config ./custom.config.ts

# Build with verbose output
crosswind build --verbose

# Build without preflight CSS
crosswind build --no-preflight
```

**Output:**

```bash
🚀 Building CSS...
✅ Built 1243 classes in 8.45ms
📝 Output: ./dist/crosswind.css
📦 File size: 24.35 KB
```

### `watch`

Build and watch for changes (equivalent to `build --watch`).

```bash
crosswind watch [options]
```

**Options:**

- `--output <path>` - Output CSS file path
- `--minify` - Minify CSS output
- `--content <pattern>` - Content file pattern
- `--config <path>` - Path to config file
- `--verbose` - Show detailed output

**Examples:**

```bash
# Basic watch mode
crosswind watch

# Watch with custom output
crosswind watch --output ./dist/styles.css

# Watch with minification
crosswind watch --minify

# Watch with verbose output
crosswind watch --verbose
```

**Output:**

```bash
🚀 Building CSS...
✅ Built 1243 classes in 8.45ms
📝 Output: ./dist/crosswind.css
📦 File size: 24.35 KB
👀 Watching for changes...

👀 Watching: ./src, ./components

📝 src/App.tsx changed, rebuilding...
✅ Built 1245 classes in 7.23ms
```

### `init`

Create a `crosswind.config.ts` configuration file.

```bash
crosswind init [options]
```

**Options:**

- `--force` - Overwrite existing config file

**Examples:**

```bash
# Create config
crosswind init

# Force overwrite
crosswind init --force
```

**Output:**

```bash
✅ Created crosswind.config.ts

Next steps:
  1. Update the content paths in crosswind.config.ts
  2. Run: crosswind build
```

**Generated file:**

```typescript
import type { CrosswindOptions } from 'crosswind'

const config = {
  content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
  output: './dist/crosswind.css',
  minify: false,
  watch: false,
} satisfies CrosswindOptions

export default config
```

### `analyze`

Analyze utility class usage and show statistics.

```bash
crosswind analyze [options]
```

**Options:**

- `--config <path>` - Path to config file
- `--verbose` - Show detailed output
- `--json` - Output as JSON
- `--top <n>` - Show top N most used classes (default: 10)

**Examples:**

```bash
# Basic analysis
crosswind analyze

# Show top 20 utilities
crosswind analyze --top 20

# JSON output
crosswind analyze --json

# Detailed analysis
crosswind analyze --verbose
```

**Output:**

```bash
🔍 Analyzing utility classes...

📊 Total classes: 1243
⏱️  Build time: 8.45ms
📦 Output size: 24.35 KB

🏷️  Utility groups (top 10):
  flex                 156 classes
  text                 142 classes
  bg                   98 classes
  p                    87 classes
  m                    76 classes
  w                    54 classes
  h                    43 classes
  border               38 classes
  rounded              32 classes
  shadow               28 classes
```

**JSON output** (`--json`):

```json
{
  "totalClasses": 1243,
  "buildTime": 8.45,
  "outputSize": 24932,
  "utilityGroups": {
    "flex": 156,
    "text": 142,
    "bg": 98
  },
  "topClasses": [
    "flex",
    "items-center",
    "justify-between"
  ]
}
```

### `clean`

Remove the output CSS file.

```bash
crosswind clean [options]
```

**Options:**

- `--config <path>` - Path to config file

**Examples:**

```bash
# Clean output
crosswind clean

# Clean with custom config
crosswind clean --config ./custom.config.ts
```

**Output:**

```bash
✅ Removed ./dist/crosswind.css
```

### `preflight`

Generate only the preflight (reset) CSS.

```bash
crosswind preflight [options]
```

**Options:**

- `--output <path>` - Output CSS file path (default: `./preflight.css`)

**Examples:**

```bash
# Generate preflight CSS
crosswind preflight

# Custom output path
crosswind preflight --output ./reset.css
```

**Output:**

```bash
✅ Generated preflight CSS
📝 Output: ./preflight.css
📦 File size: 3.21 KB
```

### `version`

Show the Crosswind version.

```bash
crosswind version
# or
crosswind --version
```

**Output:**

```bash
1.0.0
```

### `help`

Show help information.

```bash
crosswind --help
# or
crosswind [command] --help
```

## Global Options

These options work with all commands:

- `--config <path>` - Path to custom config file
- `--verbose` - Show detailed output

## Configuration Priority

CLI options override configuration file settings:

```bash
# Config file specifies: output: './dist/styles.css'
crosswind build --output ./public/app.css

# Actual output: ./public/app.css (CLI option wins)
```

Priority order (highest to lowest):

1. CLI options
2. Config file
3. Default values

## Using with Package Managers

### Bun (recommended)

```bash
# Run locally installed
bunx crosswind build

# Run scripts
bun run build
```

### npm

```bash
# Run locally installed
npx crosswind build

# Run scripts
npm run build
```

### pnpm

```bash
# Run locally installed
pnpm dlx crosswind build

# Run scripts
pnpm build
```

### Yarn

```bash
# Run locally installed
yarn crosswind build

# Run scripts
yarn build
```

## npm Scripts

Add Crosswind commands to your `package.json`:

```json
{
  "scripts": {
    "dev": "crosswind watch & vite dev",
    "build": "crosswind build --minify && vite build",
    "css:build": "crosswind build",
    "css:watch": "crosswind watch",
    "css:analyze": "crosswind analyze --verbose",
    "css:clean": "crosswind clean"
  }
}
```

## Continuous Integration

### GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1

      - name: Install dependencies
        run: bun install

      - name: Build CSS
        run: bun run crosswind build --minify

      - name: Run tests
        run: bun test
```

### GitLab CI

```yaml
# .gitlab-ci.yml
build:
  image: oven/bun:latest
  script:
    - bun install
    - bun run crosswind build --minify
  artifacts:
    paths:
      - dist/crosswind.css
```

### Vercel

```json
{
  "buildCommand": "crosswind build --minify && next build",
  "outputDirectory": ".next"
}
```

### Netlify

```toml
[build]
command = "crosswind build --minify && npm run build"
publish = "dist"
```

## Advanced Usage

### Custom Configuration Files

Specify different configs for different environments:

```bash
# Development
crosswind build --config ./crosswind.dev.config.ts

# Production
crosswind build --config ./crosswind.prod.config.ts --minify

# Testing
crosswind build --config ./crosswind.test.config.ts
```

### Programmatic Usage

While the CLI is convenient, you can also use Crosswind programmatically:

```typescript
import { build, buildAndWrite } from 'crosswind'

// Build only (get result)
const result = await build({
  content: ['./src/**/*.tsx'],
  output: './dist/crosswind.css',
  minify: true,
})

console.log(`Built ${result.classes.size} classes in ${result.duration}ms`)

// Build and write to file
await buildAndWrite({
  content: ['./src/**/*.tsx'],
  output: './dist/crosswind.css',
  minify: true,
})
```

### Combine Multiple Commands

```bash
# Clean, build, and analyze
crosswind clean && crosswind build --minify && crosswind analyze

# Watch in one terminal, dev server in another
crosswind watch &
npm run dev
```

### Environment Variables

Use environment variables for dynamic configuration:

```bash
# Set environment
export NODE_ENV=production

# Build with env-specific config
crosswind build --minify
```

```typescript
// crosswind.config.ts
const isProd = process.env.NODE_ENV === 'production'

const config = {
  output: isProd ? './dist/crosswind.min.css' : './dist/crosswind.css',
  minify: isProd,
}
```

## Troubleshooting

### Command Not Found

**Problem:** `command not found: crosswind`

**Solutions:**

1. Install globally:

   ```bash
   bun add --global crosswind
   ```

2. Or use with package runner:

   ```bash
   bunx crosswind build
   # or
   npx crosswind build
   ```

3. Or use npm scripts:

   ```json
   {
     "scripts": {
       "build": "crosswind build"
     }
   }
   ```

### Permission Denied

**Problem:** Permission errors when writing files

**Solutions:**

1. Check output directory permissions:

   ```bash
   ls -la ./dist
   ```

2. Create directory if it doesn't exist:

   ```bash
   mkdir -p ./dist
   ```

3. Fix permissions:

   ```bash
   chmod -R u+w ./dist
   ```

### Config Not Loading

**Problem:** Custom config not being used

**Solutions:**

1. Verify config path:

   ```bash
   crosswind build --config ./crosswind.config.ts --verbose
   ```

2. Check config file syntax:

   ```typescript
   // Must have default export
   export default config
   ```

3. Ensure TypeScript is installed:

   ```bash
   bun add --dev typescript
   ```

### Build Failures

**Problem:** Build fails with errors

**Solutions:**

1. Run with verbose output:

   ```bash
   crosswind build --verbose
   ```

2. Check content patterns:

   ```bash
   # Test if files exist
   ls -la ./src/**/*.tsx
   ```

3. Validate config:

   ```typescript
   // Use type checking
   import type { CrosswindOptions } from 'crosswind'

   const config = {
     content: ['./src/**/*.tsx'],
     output: './dist/crosswind.css',
   } satisfies CrosswindOptions // Type error will show if invalid
   ```

## Performance Tips

1. **Use specific content patterns:**

   ```bash
   # ❌ Slow
   crosswind build --content "./**/*.tsx"

   # ✅ Fast
   crosswind build --content "./src/**/*.tsx"
   ```

2. **Exclude unnecessary files:**

   ```typescript
   content: [
     './src/**/*.tsx',
     '!./src/**/*.test.tsx', // Exclude tests
   ]
   ```

3. **Use watch mode in development:**

   ```bash
   # Faster than rebuilding manually
   crosswind watch
   ```

4. **Enable minify only in production:**

   ```bash
   # Development (fast)
   crosswind build

   # Production (optimized)
   crosswind build --minify
   ```

## Related

- [Configuration](../config.md) - Configuration options
- [Watch Mode](./watch-mode.md) - Automatic rebuilding
- [Programmatic API](../api-reference.md) - Use Crosswind in code
