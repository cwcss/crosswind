# Installation

Get started with Headwind by installing it via your package manager or using pre-built binaries.

## Package Managers

Install Headwind as a development dependency in your project:

::: code-group

```sh [bun]
bun add --dev headwind
# or
bun install --dev headwind
```

```sh [npm]
npm install --save-dev headwind
# or
npm i -D headwind
```

```sh [pnpm]
pnpm add --save-dev headwind
# or
pnpm add -D headwind
```

```sh [yarn]
yarn add --dev headwind
```

:::

### Global Installation

For global installation (to use the CLI anywhere):

::: code-group

```sh [bun]
bun add --global headwind
```

```sh [npm]
npm install --global headwind
# or
npm i -g headwind
```

```sh [pnpm]
pnpm add --global headwind
```

```sh [yarn]
yarn global add headwind
```

:::

## Quick Start

After installation, initialize a new Headwind project:

```bash
# Create configuration file
headwind init

# Build your CSS
headwind build

# Or use watch mode for development
headwind watch
```

## Configuration

The `headwind init` command creates a basic `headwind.config.ts` file:

```typescript
import type { HeadwindOptions } from 'headwind'

const config = {
  content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
  output: './dist/headwind.css',
} satisfies HeadwindOptions

export default config
```

Customize this configuration to match your project structure. See the [Configuration Guide](./config.md) for all available options.

## Framework Integration

### React / Next.js

```bash
# Install Headwind
bun add --dev headwind

# Create config
headwind init
```

Update your `headwind.config.ts`:

```typescript
import type { HeadwindOptions } from 'headwind'

const config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  output: './styles/headwind.css',
} satisfies HeadwindOptions

export default config
```

Import the generated CSS in your app:

```typescript
// app/layout.tsx or pages/_app.tsx
import './styles/headwind.css'
```

Add build scripts to `package.json`:

```json
{
  "scripts": {
    "dev": "headwind watch & next dev",
    "build": "headwind build && next build"
  }
}
```

### Vue / Nuxt

```bash
# Install Headwind
bun add --dev headwind

# Create config
headwind init
```

Update your `headwind.config.ts`:

```typescript
import type { HeadwindOptions } from 'headwind'

const config = {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue',
  ],
  output: './assets/css/headwind.css',
} satisfies HeadwindOptions

export default config
```

Import in your `app.vue` or main layout:

```vue
<style>
@import './assets/css/headwind.css';
</style>
```

### Svelte / SvelteKit

```bash
# Install Headwind
bun add --dev headwind

# Create config
headwind init
```

Update your `headwind.config.ts`:

```typescript
import type { HeadwindOptions } from 'headwind'

const config = {
  content: [
    './src/**/*.{html,js,svelte,ts}',
  ],
  output: './static/headwind.css',
} satisfies HeadwindOptions

export default config
```

Import in your root layout:

```html
<!-- src/routes/+layout.svelte -->
<script>
  import '/static/headwind.css'
</script>
```

### Astro

```bash
# Install Headwind
bun add --dev headwind

# Create config
headwind init
```

Update your `headwind.config.ts`:

```typescript
import type { HeadwindOptions } from 'headwind'

const config = {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
  ],
  output: './public/headwind.css',
} satisfies HeadwindOptions

export default config
```

Import in your base layout:

```astro
---
// src/layouts/Layout.astro
import '/headwind.css'
---
```

### Plain HTML

```bash
# Install Headwind globally
bun add --global headwind

# Create config
headwind init
```

Update your `headwind.config.ts`:

```typescript
import type { HeadwindOptions } from 'headwind'

const config = {
  content: ['./src/**/*.html'],
  output: './dist/headwind.css',
} satisfies HeadwindOptions

export default config
```

Link the CSS in your HTML:

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="/dist/headwind.css">
</head>
<body>
  <div class="flex items-center justify-center h-screen">
    <h1 class="text-4xl font-bold text-blue-500">Hello Headwind!</h1>
  </div>
</body>
</html>
```

## Binaries

Pre-built binaries are available for different platforms. Download the binary that matches your platform and architecture:

::: code-group

```sh [macOS (arm64)]
# Download the binary
curl -L https://github.com/stacksjs/headwind/releases/latest/download/headwind-darwin-arm64 -o headwind

# Make it executable
chmod +x headwind

# Move it to your PATH
sudo mv headwind /usr/local/bin/headwind
```

```sh [macOS (x64)]
# Download the binary
curl -L https://github.com/stacksjs/headwind/releases/latest/download/headwind-darwin-x64 -o headwind

# Make it executable
chmod +x headwind

# Move it to your PATH
sudo mv headwind /usr/local/bin/headwind
```

```sh [Linux (arm64)]
# Download the binary
curl -L https://github.com/stacksjs/headwind/releases/latest/download/headwind-linux-arm64 -o headwind

# Make it executable
chmod +x headwind

# Move it to your PATH
sudo mv headwind /usr/local/bin/headwind
```

```sh [Linux (x64)]
# Download the binary
curl -L https://github.com/stacksjs/headwind/releases/latest/download/headwind-linux-x64 -o headwind

# Make it executable
chmod +x headwind

# Move it to your PATH
sudo mv headwind /usr/local/bin/headwind
```

```sh [Windows (x64)]
# Download the binary
curl -L https://github.com/stacksjs/headwind/releases/latest/download/headwind-windows-x64.exe -o headwind.exe

# Move it to your PATH (adjust the path as needed)
move headwind.exe C:\Windows\System32\headwind.exe
```

:::

::: tip
You can also find Headwind binaries in [GitHub releases](https://github.com/stacksjs/headwind/releases).
:::

## Verify Installation

Verify that Headwind is installed correctly:

```bash
headwind --version
```

You should see the installed version number.

## Development Workflow

### Watch Mode

During development, use watch mode to automatically rebuild CSS when files change:

```bash
headwind watch
```

This will:

- Watch all files matching your content patterns
- Automatically rebuild CSS on changes
- Show build statistics in the terminal

### Build for Production

When building for production:

```bash
headwind build --minify
```

Or configure minification in your `headwind.config.ts`:

```typescript
const config = {
  content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
  output: './dist/headwind.css',
  minify: process.env.NODE_ENV === 'production',
} satisfies HeadwindOptions
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
sudo bun add --global headwind

# Or install locally and use npx
bun add --dev headwind
bunx headwind build
```

### TypeScript Errors

If you encounter TypeScript errors in your config file:

1. Ensure you have TypeScript installed:

   ```bash
   bun add --dev typescript
   ```

2. Use the `satisfies` keyword for type checking:

   ```typescript
   import type { HeadwindOptions } from 'headwind'

   const config = {
     content: ['./src/**/*.tsx'],
     output: './dist/headwind.css',
   } satisfies HeadwindOptions
   ```

### Build Errors

If the build fails:

1. Check that your content patterns are correct
2. Ensure the output directory exists or can be created
3. Run with `--verbose` for detailed error information:

   ```bash
   headwind build --verbose
   ```

## Support

- [GitHub Issues](https://github.com/stacksjs/headwind/issues)
- [Documentation](https://headwind.sh)
- [Discord Community](https://discord.gg/stacksjs)
