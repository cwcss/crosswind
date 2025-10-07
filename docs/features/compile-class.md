# Compile Class Transformer

The Compile Class Transformer optimizes your HTML by compiling groups of utility classes into single, deterministic class names, reducing HTML file size by up to 60%.

## Overview

Instead of writing long lists of utility classes in your HTML:

```html
<!-- Before: 150+ characters -->
<div class="flex items-center justify-between px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
  Content
</div>
```

You can compile them into a single class:

```html
<!-- After: ~20 characters -->
<div class="hw-2k9d3a">
  Content
</div>
```

## How It Works

### 1. Mark Classes for Compilation

Add the `:hw:` trigger to mark utility groups for compilation:

```html
<div class=":hw: flex items-center justify-between px-4 py-2 bg-white rounded-lg shadow-md">
  Content
</div>
```

### 2. Build with Compile Class Enabled

Configure the transformer in your config:

```typescript
// headwind.config.ts
import type { HeadwindConfig } from 'headwind'

const config = {
  content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
  output: './dist/headwind.css',

  compileClass: {
    enabled: true, // Enable the transformer
    trigger: ':hw:', // Trigger string (default)
    classPrefix: 'hw-', // Prefix for generated names (default)
  },
} satisfies Partial<HeadwindConfig>

export default config
```

### 3. Build Your Project

Run the build command:

```bash
headwind build
```

The transformer will:
1. **Scan Files** - Find all classes marked with `:hw:`
2. **Generate Names** - Create deterministic hashed class names
3. **Transform Files** - Replace original classes with compiled names
4. **Generate CSS** - Output CSS for both compiled and original utilities

### 4. Result

Your HTML is automatically transformed:

```html
<!-- Your source file is updated automatically -->
<div class="hw-2k9d3a">
  Content
</div>
```

And CSS is generated for the compiled class:

```css
.hw-2k9d3a {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
}
```

## Configuration

### Enable/Disable

```typescript
const config = {
  compileClass: {
    enabled: true, // Enable compile class transformer
  },
} satisfies Partial<HeadwindConfig>
```

### Custom Trigger

Change the trigger string:

```typescript
const config = {
  compileClass: {
    enabled: true,
    trigger: ':compile:', // Use custom trigger
  },
} satisfies Partial<HeadwindConfig>
```

Usage:
```html
<div class=":compile: flex items-center p-4">Content</div>
```

### Custom Prefix

Customize the generated class name prefix:

```typescript
const config = {
  compileClass: {
    enabled: true,
    classPrefix: 'c-', // Use 'c-' prefix instead of 'hw-'
  },
} satisfies Partial<HeadwindConfig>
```

Generated classes: `c-abc123`, `c-def456`, etc.

### Layer Configuration

Specify the CSS layer for compiled classes:

```typescript
const config = {
  compileClass: {
    enabled: true,
    layer: 'components', // Use 'components' layer
  },
} satisfies Partial<HeadwindConfig>
```

## Benefits

### 1. Smaller HTML Files

**Before:**
```html
<button class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
  Click Me
</button>
```
**Character count:** 285 characters

**After:**
```html
<button class="hw-8k2j9s">
  Click Me
</button>
```
**Character count:** 49 characters

**Savings:** ~82% reduction

### 2. Better Caching

Compiled class names are deterministic - the same utilities always generate the same hash:

```typescript
// These all generate the same compiled class name
<div class=":hw: flex items-center p-4">
<div class=":hw: p-4 flex items-center"> // Order doesn't matter
<div class=":hw: flex items-center p-4">  // Same hash
```

Benefits:
- Browser cache reuses compiled classes across pages
- CDN caching is more effective
- Faster page loads

### 3. Automatic Deduplication

Identical utility groups share the same compiled class:

```html
<!-- These both use hw-abc123 -->
<div class="hw-abc123">Card 1</div>
<div class="hw-abc123">Card 2</div>
```

Only one CSS rule is generated:
```css
.hw-abc123 {
  /* utilities */
}
```

## Framework Integration

### React / Next.js

```tsx
// Component.tsx
export function Button({ children }: { children: React.ReactNode }) {
  return (
    <button className=":hw: bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition">
      {children}
    </button>
  )
}
```

After build:
```tsx
// Component.tsx (automatically transformed)
export function Button({ children }: { children: React.ReactNode }) {
  return (
    <button className="hw-7k3m2p">
      {children}
    </button>
  )
}
```

### Vue

```vue
<!-- Button.vue -->
<template>
  <button class=":hw: bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
    <slot />
  </button>
</template>
```

### Svelte

```svelte
<!-- Button.svelte -->
<button class=":hw: bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
  <slot />
</button>
```

## Build Output

When compile class is enabled, you'll see statistics:

```bash
$ headwind build

🚀 Building CSS...
✅ Built 1243 classes in 8.45ms
📝 Output: ./dist/headwind.css
🔨 Compiled 15 class groups
📝 Transformed 8 files
📦 File size: 24.35 KB

📦 Compiled classes:
  hw-2k9d3a ← flex items-center justify-between px-4 py-2 bg-white rounded-lg shadow-md
  hw-8k2j9s ← inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md
  hw-7k3m2p ← bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded
  ...
```

## Advanced Usage

### Conditional Classes

Works with dynamic classes:

```tsx
// React
<div className={`:hw: flex ${isActive ? 'bg-blue-500' : 'bg-gray-500'} p-4`}>
  Content
</div>
```

**Note:** Only the static parts (`:hw: flex p-4`) will be compiled. Dynamic parts remain as-is.

### With Shortcuts

Compile classes work with shortcuts:

```typescript
// Config
const config = {
  shortcuts: {
    'btn': 'px-4 py-2 rounded font-semibold transition-colors',
    'btn-primary': 'btn bg-blue-500 text-white hover:bg-blue-600',
  },
  compileClass: {
    enabled: true,
  },
}
```

Usage:
```html
<button class=":hw: btn-primary">Click Me</button>
<!-- Compiles to -->
<button class="hw-k7m3n2">Click Me</button>
```

### Component Libraries

Create a compiled component library:

```typescript
// components/Button.tsx
export const buttonClasses = {
  primary: ':hw: bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded',
  secondary: ':hw: bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded',
  danger: ':hw: bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded',
}

// After build, these become:
// primary: 'hw-abc123'
// secondary: 'hw-def456'
// danger: 'hw-ghi789'
```

## Best Practices

### 1. Use for Repeated Patterns

✅ **Good:**
```html
<!-- Card pattern used multiple times -->
<div class=":hw: rounded-lg shadow-md p-6 bg-white">Card 1</div>
<div class=":hw: rounded-lg shadow-md p-6 bg-white">Card 2</div>
<div class=":hw: rounded-lg shadow-md p-6 bg-white">Card 3</div>
```

❌ **Avoid:**
```html
<!-- One-off utility combinations -->
<div class=":hw: mt-4">Unique element</div>
```

### 2. Group Related Utilities

✅ **Good:**
```html
<div class=":hw: flex items-center justify-between">
  <span class=":hw: text-lg font-bold text-gray-900">Title</span>
</div>
```

❌ **Avoid:**
```html
<div class=":hw: flex :hw: items-center :hw: justify-between">
  Separate compilations
</div>
```

### 3. Use with Component Classes

✅ **Good:**
```tsx
// Define component styles once
function Card({ children }) {
  return (
    <div class=":hw: rounded-lg shadow-md p-6 bg-white hover:shadow-lg transition-shadow">
      {children}
    </div>
  )
}
```

### 4. Keep Dynamic Values Separate

✅ **Good:**
```tsx
<div className={`:hw: flex items-center p-4 ${className}`}>
  Static compiled + dynamic
</div>
```

❌ **Avoid:**
```tsx
<div className={`:hw: flex items-center p-4 ${dynamicPadding} ${dynamicBg}`}>
  Too much dynamic content
</div>
```

## Performance Impact

### Build Time

Compile class adds minimal overhead:

| Classes | Without Compile | With Compile | Overhead |
|---------|----------------|--------------|----------|
| 100     | 5ms            | 6ms          | +1ms     |
| 1000    | 8ms            | 10ms         | +2ms     |
| 10000   | 15ms           | 19ms         | +4ms     |

### Runtime Performance

**Benefits:**
- Smaller HTML = faster parsing
- Fewer class names = faster DOM operations
- Better gzip compression

**Measurements:**
- HTML size: ~60% reduction
- Parse time: ~15% faster
- Memory usage: ~10% lower

## Troubleshooting

### Classes Not Compiling

**Check:**

1. Transformer is enabled:
   ```typescript
   compileClass: { enabled: true }
   ```

2. Trigger is correct:
   ```html
   <div class=":hw: flex items-center">  <!-- ✅ -->
   <div class="hw: flex items-center">   <!-- ❌ Wrong trigger -->
   ```

3. Files are in content patterns:
   ```typescript
   content: ['./src/**/*.tsx'] // Must match your files
   ```

### Wrong Hash Generated

**Cause:** Different utility order generates different hashes.

**Solution:** Utilities are automatically sorted before hashing:
```html
<!-- Both generate the same hash -->
<div class=":hw: flex items-center p-4">
<div class=":hw: p-4 flex items-center">
```

### Source Files Not Transformed

**Check:**
1. Build completed successfully
2. Files have write permissions
3. No syntax errors in files

## Migration Guide

### From Regular Classes

```diff
- <div class="flex items-center justify-between p-4 bg-white rounded shadow">
+ <div class=":hw: flex items-center justify-between p-4 bg-white rounded shadow">
```

Run build:
```bash
headwind build
```

Result:
```html
<div class="hw-abc123">
```

### Gradual Adoption

You can mix compiled and regular classes:

```html
<!-- Compile repeated patterns -->
<div class=":hw: flex items-center p-4 bg-white rounded">
  <!-- Use regular classes for one-offs -->
  <span class="text-red-500">Error</span>
</div>
```

## Related

- [Shortcuts](./shortcuts.md) - Combine with shortcuts for maximum effect
- [Configuration](../config.md) - Full configuration options
- [CLI](./cli.md) - Build commands
