# Installation

Get started with Crosswind by installing it via your package manager or using pre-built binaries.

## Package Managers

Install Crosswind as a development dependency in your project:

::: code-group

```sh [bun]
bun add --dev crosswind
# or
bun install --dev crosswind
```

```sh [npm]
npm install --save-dev crosswind
# or
npm i -D crosswind
```

```sh [pnpm]
pnpm add --save-dev crosswind
# or
pnpm add -D crosswind
```

```sh [yarn]
yarn add --dev crosswind
```

:::

### Global Installation

For global installation (to use the CLI anywhere):

::: code-group

```sh [bun]
bun add --global crosswind
```

```sh [npm]
npm install --global crosswind
# or
npm i -g crosswind
```

```sh [pnpm]
pnpm add --global crosswind
```

```sh [yarn]
yarn global add crosswind
```

:::

## Quick Start

After installation, initialize a new Crosswind project:

```bash
# Create configuration file
crosswind init

# Build your CSS
crosswind build

# Or use watch mode for development
crosswind watch
```

## Configuration

The `crosswind init` command creates a basic `crosswind.config.ts` file:

```typescript
import type { CrosswindOptions } from 'crosswind'

const config = {
  content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
  output: './dist/crosswind.css',
} satisfies CrosswindOptions

export default config
```

Customize this configuration to match your project structure. See the [Configuration Guide](./config.md) for all available options.

## Framework Integration

### React / Next.js

```bash
# Install Crosswind
bun add --dev crosswind

# Create config
crosswind init
```

Update your `crosswind.config.ts`:

```typescript
import type { CrosswindOptions } from 'crosswind'

const config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  output: './styles/crosswind.css',
} satisfies CrosswindOptions

export default config
```

Import the generated CSS in your app:

```typescript
// app/layout.tsx or pages/_app.tsx
import './styles/crosswind.css'
```

Add build scripts to `package.json`:

```json
{
  "scripts": {
    "dev": "crosswind watch & next dev",
    "build": "crosswind build && next build"
  }
}
```

### Vue / Nuxt

```bash
# Install Crosswind
bun add --dev crosswind

# Create config
crosswind init
```

Update your `crosswind.config.ts`:

```typescript
import type { CrosswindOptions } from 'crosswind'

const config = {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue',
  ],
  output: './assets/css/crosswind.css',
} satisfies CrosswindOptions

export default config
```

Import in your `app.vue` or main layout:

```vue
<style>
@import './assets/css/crosswind.css';
</style>
```

### Svelte / SvelteKit

```bash
# Install Crosswind
bun add --dev crosswind

# Create config
crosswind init
```

Update your `crosswind.config.ts`:

```typescript
import type { CrosswindOptions } from 'crosswind'

const config = {
  content: [
    './src/**/*.{html,js,svelte,ts}',
  ],
  output: './static/crosswind.css',
} satisfies CrosswindOptions

export default config
```

Import in your root layout:

```html
<!-- src/routes/+layout.svelte -->
<script>
  import '/static/crosswind.css'
</script>
```

### Astro

```bash
# Install Crosswind
bun add --dev crosswind

# Create config
crosswind init
```

Update your `crosswind.config.ts`:

```typescript
import type { CrosswindOptions } from 'crosswind'

const config = {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
  ],
  output: './public/crosswind.css',
} satisfies CrosswindOptions

export default config
```

Import in your base layout:

```astro
---
// src/layouts/Layout.astro
import '/crosswind.css'
---
```

### Plain HTML

```bash
# Install Crosswind globally
bun add --global crosswind

# Create config
crosswind init
```

Update your `crosswind.config.ts`:

```typescript
import type { CrosswindOptions } from 'crosswind'

const config = {
  content: ['./src/**/*.html'],
  output: './dist/crosswind.css',
} satisfies CrosswindOptions

export default config
```

Link the CSS in your HTML:

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="/dist/crosswind.css">
</head>
<body>
  <div class="flex items-center justify-center h-screen">
    <h1 class="text-4xl font-bold text-blue-500">Hello Crosswind!</h1>
  </div>
</body>
</html>
```

## Binaries

Pre-built binaries are available for different platforms. Download the binary that matches your platform and architecture:

::: code-group

```sh [macOS (arm64)]
# Download the binary
curl -L https://github.com/stacksjs/crosswind/releases/latest/download/crosswind-darwin-arm64 -o crosswind

# Make it executable
chmod +x crosswind

# Move it to your PATH
sudo mv crosswind /usr/local/bin/crosswind
```

```sh [macOS (x64)]
# Download the binary
curl -L https://github.com/stacksjs/crosswind/releases/latest/download/crosswind-darwin-x64 -o crosswind

# Make it executable
chmod +x crosswind

# Move it to your PATH
sudo mv crosswind /usr/local/bin/crosswind
```

```sh [Linux (arm64)]
# Download the binary
curl -L https://github.com/stacksjs/crosswind/releases/latest/download/crosswind-linux-arm64 -o crosswind

# Make it executable
chmod +x crosswind

# Move it to your PATH
sudo mv crosswind /usr/local/bin/crosswind
```

```sh [Linux (x64)]
# Download the binary
curl -L https://github.com/stacksjs/crosswind/releases/latest/download/crosswind-linux-x64 -o crosswind

# Make it executable
chmod +x crosswind

# Move it to your PATH
sudo mv crosswind /usr/local/bin/crosswind
```

```sh [Windows (x64)]
# Download the binary
curl -L https://github.com/stacksjs/crosswind/releases/latest/download/crosswind-windows-x64.exe -o crosswind.exe

# Move it to your PATH (adjust the path as needed)
move crosswind.exe C:\Windows\System32\crosswind.exe
```

:::

::: tip
You can also find Crosswind binaries in [GitHub releases](https://github.com/stacksjs/crosswind/releases).
:::

## Verify Installation

Verify that Crosswind is installed correctly:

```bash
crosswind --version
```

You should see the installed version number.

## Development Workflow

### Watch Mode

During development, use watch mode to automatically rebuild CSS when files change:

```bash
crosswind watch
```

This will:

- Watch all files matching your content patterns
- Automatically rebuild CSS on changes
- Show build statistics in the terminal

### Build for Production

When building for production:

```bash
crosswind build --minify
```

Or configure minification in your `crosswind.config.ts`:

```typescript
const config = {
  content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
  output: './dist/crosswind.css',
  minify: process.env.NODE_ENV === 'production',
} satisfies CrosswindOptions
```

## Next Steps

- [Configuration Guide](./config.md) - Learn about all configuration options
- [Usage Guide](./usage.md) - Start using utility classes
- [CLI Reference](./features/cli.md) - Explore all CLI commands
- [Compile Class Transformer](./features/compile-class.md) - Optimize your HTML

## Troubleshooting

### Bun Not Found

If you get a "bun: command not found" error, install Bun:

```bash
curl -fsSL https://bun.sh/install | bash
```

### Permission Denied

If you get permission errors when installing globally:

```bash
# Use sudo on macOS/Linux
sudo bun add --global crosswind

# Or install locally and use npx
bun add --dev crosswind
bunx crosswind build
```

### TypeScript Errors

If you encounter TypeScript errors in your config file:

1. Ensure you have TypeScript installed:

   ```bash
   bun add --dev typescript
   ```

2. Use the `satisfies` keyword for type checking:

   ```typescript
   import type { CrosswindOptions } from 'crosswind'

   const config = {
     content: ['./src/**/*.tsx'],
     output: './dist/crosswind.css',
   } satisfies CrosswindOptions
   ```

### Build Errors

If the build fails:

1. Check that your content patterns are correct
2. Ensure the output directory exists or can be created
3. Run with `--verbose` for detailed error information:

   ```bash
   crosswind build --verbose
   ```

## Support

- [GitHub Issues](https://github.com/stacksjs/crosswind/issues)
- [Documentation](https://crosswind.sh)
- [Discord Community](https://discord.gg/stacksjs)
