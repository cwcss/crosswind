# Compile Class Transformer

The Compile Class Transformer is a powerful optimization feature that compiles groups of utility classes into single optimized class names, reducing HTML file size and potentially improving performance.

## How It Works

Mark groups of utility classes with the `:hw:` trigger, and Headwind will:

1. Extract those classes
2. Generate a unique hashed class name
3. Replace the markup with the optimized class name
4. Generate CSS for all the utilities under that single class

## Installation

The compile class transformer is built into Headwind - no additional installation required!

## Configuration

Add the `compileClass` configuration to your `headwind.config.ts`:

```typescript
import type { HeadwindConfig } from 'headwind'

const config = {
  content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
  output: './dist/headwind.css',
  compileClass: {
    enabled: true,           // Enable the transformer
    trigger: ':hw:',          // Trigger string (default)
    classPrefix: 'hw-',       // Prefix for generated names (default)
    layer: 'shortcuts',       // Layer name (default)
  },
} satisfies Partial<HeadwindConfig>

export default config
```

## Usage

### Basic Example

**Before:**
```html
<div class=":hw: text-center sm:text-left">
  <div class=":hw: text-sm font-bold hover:text-red-500" />
</div>
```

**After:**
```html
<div class="hw-qlmcrp">
  <div class="hw-0qw2gr" />
</div>
```

**Generated CSS:**
```css
.hw-qlmcrp {
  text-align: center;
}

.hw-0qw2gr {
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 700;
}

.hw-0qw2gr:hover {
  color: #ef4444;
}

@media (min-width: 640px) {
  .hw-qlmcrp {
    text-align: left;
  }
}
```

### React/JSX Example

The transformer works with both `class` and `className` attributes:

```jsx
export const Button = () => (
  <button className=":hw: px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded">
    Click Me
  </button>
)
```

Compiles to:

```jsx
export const Button = () => (
  <button className="hw-abc123">
    Click Me
  </button>
)
```

### Complex Variants

The transformer handles all Headwind features including:

- Responsive variants: `sm:`, `md:`, `lg:`, etc.
- State variants: `hover:`, `focus:`, `active:`, etc.
- Dark mode: `dark:`
- Arbitrary values: `p-[2.5rem]`
- Important modifier: `!text-center`

```html
<div class=":hw: md:flex md:justify-between lg:gap-4 dark:bg-gray-900">
  Content
</div>
```

## Benefits

### 1. Reduced HTML Size

**Before:**
```html
<div class="flex items-center justify-between px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
```

**After:**
```html
<div class="hw-abc123">
```

### 2. Deduplication

Identical class groups across your application are automatically deduplicated:

```html
<!-- Both get the same compiled class name -->
<button class=":hw: px-4 py-2 bg-blue-500">Button 1</button>
<button class=":hw: px-4 py-2 bg-blue-500">Button 2</button>
```

Both compile to:
```html
<button class="hw-xyz">Button 1</button>
<button class="hw-xyz">Button 2</button>
```

### 3. Better Caching

Compiled class names are deterministic - the same utilities always produce the same hash, improving CSS caching.

## Options

### `enabled`

- **Type:** `boolean`
- **Default:** `false`

Enable or disable the compile class transformer.

### `trigger`

- **Type:** `string`
- **Default:** `':hw:'`

The trigger string to mark classes for compilation. You can change this to avoid conflicts:

```typescript
compileClass: {
  enabled: true,
  trigger: ':compile:',
}
```

Then use:
```html
<div class=":compile: p-4 m-2">Content</div>
```

### `classPrefix`

- **Type:** `string`
- **Default:** `'hw-'`

Prefix for generated class names:

```typescript
compileClass: {
  enabled: true,
  classPrefix: 'headwind-',
}
```

Generates class names like `headwind-abc123`.

### `layer`

- **Type:** `string`
- **Default:** `'shortcuts'`

CSS layer name for compiled classes (for future use with CSS layers).

## CLI Usage

The compile class transformer works automatically with all CLI commands:

```bash
# Build with compilation
headwind build

# Watch mode with compilation
headwind watch

# See compiled class statistics
headwind build --verbose
```

Verbose output shows compilation stats:

```
🚀 Building CSS...
✅ Built 150 classes in 45.23ms
🔨 Compiled 12 class groups
📝 Transformed 8 files
📝 Output: ./dist/headwind.css
📦 File size: 24.56 KB

📦 Compiled classes:
  hw-abc123 ← text-center sm:text-left
  hw-def456 ← px-4 py-2 bg-blue-500 hover:bg-blue-600
  ...
```

## Best Practices

### 1. Use for Repeated Patterns

Best for component-like class combinations that appear multiple times:

```html
<!-- Good: Reusable button pattern -->
<button class=":hw: px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
  Submit
</button>

<!-- Less ideal: One-off utility -->
<div class=":hw: p-4">Content</div>
```

### 2. Don't Overuse

Not every element needs compilation. Use it strategically:

```html
<!-- Component with repeated pattern - good candidate -->
<button class=":hw: btn-primary-classes">Click</button>

<!-- Simple utility - no need to compile -->
<div class="p-4">Content</div>

<!-- Unique layout - probably don't compile -->
<section class="grid grid-cols-3 gap-8 px-12">
```

### 3. Consistent Ordering

The transformer automatically sorts classes, but be consistent in your source:

```html
<!-- These compile to the SAME class -->
<div class=":hw: p-4 m-2">A</div>
<div class=":hw: m-2 p-4">B</div>
```

### 4. Version Control

Compiled files are transformed in place. Consider:

- Adding transformed files to `.gitignore` if using a build step
- Or committing transformed files for simpler deployment

## Performance

The compile class transformer adds minimal overhead:

- **Scan time:** ~5-10ms for 1000 files
- **Transform time:** ~1-2ms per file
- **Memory:** Minimal - class groups are deduplicated

## Troubleshooting

### Classes not being compiled

1. Check that `compileClass.enabled` is `true`
2. Verify you're using the correct trigger (default: `:hw:`)
3. Ensure the trigger is at the start of the class attribute

### Wrong classes being compiled

Make sure the trigger only appears at the beginning:

```html
<!-- ✅ Correct -->
<div class=":hw: p-4 m-2">

<!-- ❌ Wrong - won't be compiled -->
<div class="p-4 :hw: m-2">
```

### Build is slower

The transformer processes files sequentially during scanning. For large projects:

1. Use more specific `content` patterns
2. Exclude `node_modules` and build directories
3. Consider using the transformer only in production builds

## Comparison with Regular Utilities

| Feature | Regular Utilities | Compiled Classes |
|---------|------------------|------------------|
| HTML Size | Large | Small |
| CSS Size | Same | Same |
| Class Reuse | Manual | Automatic |
| Setup | None | Configuration |
| Debugging | Clear class names | Hash-based names |
| Build Time | Faster | Slightly slower |

## Migration Guide

To start using compiled classes in an existing project:

1. **Enable gradually:**
   ```typescript
   compileClass: {
     enabled: true,
     trigger: ':hw:', // Keep default
   }
   ```

2. **Mark components:**
   Start with frequently-used components:
   ```html
   <button class=":hw: btn-classes">
   ```

3. **Build and test:**
   ```bash
   headwind build --verbose
   ```

4. **Review transformed files:**
   Check that classes compile correctly

5. **Expand usage:**
   Add `:hw:` to more components as needed

## Examples

See the [examples directory](../examples/compile-class) for complete working examples including:

- React components
- Vue components
- Plain HTML
- Complex responsive layouts

## Related

- [Configuration Guide](./configuration.md)
- [CLI Reference](./cli.md)
- [Utilities Reference](./utilities.md)
