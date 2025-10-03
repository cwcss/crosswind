# CLI Commands

Headwind provides a powerful command-line interface for building, watching, and analyzing your CSS.

## Installation

Install Headwind globally or locally:

```bash
# Global (use anywhere)
bun add --global headwind

# Local (project-specific)
bun add --dev headwind
```

## Commands

### `build`

Build CSS from your content files.

```bash
headwind build [options]
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
headwind build

# Build with custom output
headwind build --output ./dist/styles.css

# Build and minify
headwind build --minify

# Build with specific content
headwind build --content "./src/**/*.tsx"

# Build with custom config
headwind build --config ./custom.config.ts

# Build with verbose output
headwind build --verbose

# Build without preflight CSS
headwind build --no-preflight
```

**Output:**
```bash
🚀 Building CSS...
✅ Built 1243 classes in 8.45ms
📝 Output: ./dist/headwind.css
📦 File size: 24.35 KB
```

### `watch`

Build and watch for changes (equivalent to `build --watch`).

```bash
headwind watch [options]
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
headwind watch

# Watch with custom output
headwind watch --output ./dist/styles.css

# Watch with minification
headwind watch --minify

# Watch with verbose output
headwind watch --verbose
```

**Output:**
```bash
🚀 Building CSS...
✅ Built 1243 classes in 8.45ms
📝 Output: ./dist/headwind.css
📦 File size: 24.35 KB
👀 Watching for changes...

👀 Watching: ./src, ./components

📝 src/App.tsx changed, rebuilding...
✅ Built 1245 classes in 7.23ms
```

### `init`

Create a `headwind.config.ts` configuration file.

```bash
headwind init [options]
```

**Options:**
- `--force` - Overwrite existing config file

**Examples:**

```bash
# Create config
headwind init

# Force overwrite
headwind init --force
```

**Output:**
```bash
✅ Created headwind.config.ts

Next steps:
  1. Update the content paths in headwind.config.ts
  2. Run: headwind build
```

**Generated file:**
```typescript
import type { HeadwindConfig } from 'headwind'

const config = {
  content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
  output: './dist/headwind.css',
  minify: false,
  watch: false,
} satisfies Partial<HeadwindConfig>

export default config
```

### `analyze`

Analyze utility class usage and show statistics.

```bash
headwind analyze [options]
```

**Options:**
- `--config <path>` - Path to config file
- `--verbose` - Show detailed output
- `--json` - Output as JSON
- `--top <n>` - Show top N most used classes (default: 10)

**Examples:**

```bash
# Basic analysis
headwind analyze

# Show top 20 utilities
headwind analyze --top 20

# JSON output
headwind analyze --json

# Detailed analysis
headwind analyze --verbose
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
headwind clean [options]
```

**Options:**
- `--config <path>` - Path to config file

**Examples:**

```bash
# Clean output
headwind clean

# Clean with custom config
headwind clean --config ./custom.config.ts
```

**Output:**
```bash
✅ Removed ./dist/headwind.css
```

### `preflight`

Generate only the preflight (reset) CSS.

```bash
headwind preflight [options]
```

**Options:**
- `--output <path>` - Output CSS file path (default: `./preflight.css`)

**Examples:**

```bash
# Generate preflight CSS
headwind preflight

# Custom output path
headwind preflight --output ./reset.css
```

**Output:**
```bash
✅ Generated preflight CSS
📝 Output: ./preflight.css
📦 File size: 3.21 KB
```

### `version`

Show the Headwind version.

```bash
headwind version
# or
headwind --version
```

**Output:**
```bash
1.0.0
```

### `help`

Show help information.

```bash
headwind --help
# or
headwind [command] --help
```

## Global Options

These options work with all commands:

- `--config <path>` - Path to custom config file
- `--verbose` - Show detailed output

## Configuration Priority

CLI options override configuration file settings:

```bash
# Config file specifies: output: './dist/styles.css'
headwind build --output ./public/app.css

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
bunx headwind build

# Run scripts
bun run build
```

### npm

```bash
# Run locally installed
npx headwind build

# Run scripts
npm run build
```

### pnpm

```bash
# Run locally installed
pnpm dlx headwind build

# Run scripts
pnpm build
```

### Yarn

```bash
# Run locally installed
yarn headwind build

# Run scripts
yarn build
```

## npm Scripts

Add Headwind commands to your `package.json`:

```json
{
  "scripts": {
    "dev": "headwind watch & vite dev",
    "build": "headwind build --minify && vite build",
    "css:build": "headwind build",
    "css:watch": "headwind watch",
    "css:analyze": "headwind analyze --verbose",
    "css:clean": "headwind clean"
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
        run: bun run headwind build --minify

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
    - bun run headwind build --minify
  artifacts:
    paths:
      - dist/headwind.css
```

### Vercel

```json
{
  "buildCommand": "headwind build --minify && next build",
  "outputDirectory": ".next"
}
```

### Netlify

```toml
[build]
  command = "headwind build --minify && npm run build"
  publish = "dist"
```

## Advanced Usage

### Custom Configuration Files

Specify different configs for different environments:

```bash
# Development
headwind build --config ./headwind.dev.config.ts

# Production
headwind build --config ./headwind.prod.config.ts --minify

# Testing
headwind build --config ./headwind.test.config.ts
```

### Programmatic Usage

While the CLI is convenient, you can also use Headwind programmatically:

```typescript
import { build, buildAndWrite } from 'headwind'

// Build only (get result)
const result = await build({
  content: ['./src/**/*.tsx'],
  output: './dist/headwind.css',
  minify: true,
})

console.log(`Built ${result.classes.size} classes in ${result.duration}ms`)

// Build and write to file
await buildAndWrite({
  content: ['./src/**/*.tsx'],
  output: './dist/headwind.css',
  minify: true,
})
```

### Combine Multiple Commands

```bash
# Clean, build, and analyze
headwind clean && headwind build --minify && headwind analyze

# Watch in one terminal, dev server in another
headwind watch &
npm run dev
```

### Environment Variables

Use environment variables for dynamic configuration:

```bash
# Set environment
export NODE_ENV=production

# Build with env-specific config
headwind build --minify
```

```typescript
// headwind.config.ts
const isProd = process.env.NODE_ENV === 'production'

const config = {
  output: isProd ? './dist/headwind.min.css' : './dist/headwind.css',
  minify: isProd,
}
```

## Troubleshooting

### Command Not Found

**Problem:** `command not found: headwind`

**Solutions:**

1. Install globally:
   ```bash
   bun add --global headwind
   ```

2. Or use with package runner:
   ```bash
   bunx headwind build
   # or
   npx headwind build
   ```

3. Or use npm scripts:
   ```json
   {
     "scripts": {
       "build": "headwind build"
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
   headwind build --config ./headwind.config.ts --verbose
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
   headwind build --verbose
   ```

2. Check content patterns:
   ```bash
   # Test if files exist
   ls -la ./src/**/*.tsx
   ```

3. Validate config:
   ```typescript
   // Use type checking
   import type { HeadwindConfig } from 'headwind'

   const config = {
     content: ['./src/**/*.tsx'],
     output: './dist/headwind.css',
   } satisfies Partial<HeadwindConfig>  // Type error will show if invalid
   ```

## Performance Tips

1. **Use specific content patterns:**
   ```bash
   # ❌ Slow
   headwind build --content "./**/*.tsx"

   # ✅ Fast
   headwind build --content "./src/**/*.tsx"
   ```

2. **Exclude unnecessary files:**
   ```typescript
   content: [
     './src/**/*.tsx',
     '!./src/**/*.test.tsx',  // Exclude tests
   ]
   ```

3. **Use watch mode in development:**
   ```bash
   # Faster than rebuilding manually
   headwind watch
   ```

4. **Enable minify only in production:**
   ```bash
   # Development (fast)
   headwind build

   # Production (optimized)
   headwind build --minify
   ```

## Related

- [Configuration](../config.md) - Configuration options
- [Watch Mode](./watch-mode.md) - Automatic rebuilding
- [Programmatic API](../api-reference.md) - Use Headwind in code
