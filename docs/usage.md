# Usage

Learn how to use Crosswind's utility classes to build beautiful user interfaces.

## Utility Classes

Crosswind provides a comprehensive set of utility classes that you can compose to build any design directly in your HTML.

### Layout

Control the display and positioning of elements:

```html
<!-- Display -->
<div class="block">Block element</div>
<div class="inline-block">Inline block</div>
<div class="inline">Inline element</div>
<div class="flex">Flex container</div>
<div class="grid">Grid container</div>
<div class="hidden">Hidden element</div>

<!-- Position -->
<div class="relative">Relative positioning</div>
<div class="absolute">Absolute positioning</div>
<div class="fixed">Fixed positioning</div>
<div class="sticky">Sticky positioning</div>

<!-- Overflow -->
<div class="overflow-auto">Auto overflow</div>
<div class="overflow-hidden">Hidden overflow</div>
<div class="overflow-scroll">Scrollable overflow</div>

<!-- Z-index -->
<div class="z-0">Z-index 0</div>
<div class="z-10">Z-index 10</div>
<div class="z-50">Z-index 50</div>
```

### Flexbox

Build flexible layouts with flexbox utilities:

```html
<!-- Flex Container -->
<div class="flex">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<!-- Flex Direction -->
<div class="flex flex-row">Horizontal</div>
<div class="flex flex-col">Vertical</div>
<div class="flex flex-row-reverse">Reverse horizontal</div>

<!-- Align Items -->
<div class="flex items-start">Align start</div>
<div class="flex items-center">Align center</div>
<div class="flex items-end">Align end</div>
<div class="flex items-stretch">Align stretch</div>

<!-- Justify Content -->
<div class="flex justify-start">Justify start</div>
<div class="flex justify-center">Justify center</div>
<div class="flex justify-end">Justify end</div>
<div class="flex justify-between">Justify between</div>
<div class="flex justify-around">Justify around</div>

<!-- Gap -->
<div class="flex gap-2">Gap 0.5rem</div>
<div class="flex gap-4">Gap 1rem</div>
<div class="flex gap-x-4 gap-y-2">Different horizontal and vertical gaps</div>

<!-- Flex Wrap -->
<div class="flex flex-wrap">Wrap</div>
<div class="flex flex-nowrap">No wrap</div>

<!-- Flex Grow/Shrink -->
<div class="flex">
  <div class="flex-1">Grow equally</div>
  <div class="flex-none">Don't grow</div>
  <div class="flex-auto">Auto</div>
</div>
```

### Grid

Create grid layouts:

```html
<!-- Grid Container -->
<div class="grid">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>

<!-- Grid Columns -->
<div class="grid grid-cols-1">1 column</div>
<div class="grid grid-cols-2">2 columns</div>
<div class="grid grid-cols-3">3 columns</div>
<div class="grid grid-cols-4">4 columns</div>
<div class="grid grid-cols-12">12 columns</div>

<!-- Grid Rows -->
<div class="grid grid-rows-2">2 rows</div>
<div class="grid grid-rows-3">3 rows</div>

<!-- Gap -->
<div class="grid gap-4">Gap 1rem</div>
<div class="grid gap-x-4 gap-y-2">Different gaps</div>

<!-- Column Span -->
<div class="grid grid-cols-3">
  <div class="col-span-1">1 column</div>
  <div class="col-span-2">2 columns</div>
</div>

<!-- Row Span -->
<div class="grid grid-rows-3">
  <div class="row-span-1">1 row</div>
  <div class="row-span-2">2 rows</div>
</div>
```

### Spacing

Control margin and padding:

```html
<!-- Padding -->
<div class="p-4">Padding 1rem (all sides)</div>
<div class="px-4">Padding 1rem (horizontal)</div>
<div class="py-4">Padding 1rem (vertical)</div>
<div class="pt-4">Padding top 1rem</div>
<div class="pr-4">Padding right 1rem</div>
<div class="pb-4">Padding bottom 1rem</div>
<div class="pl-4">Padding left 1rem</div>

<!-- Margin -->
<div class="m-4">Margin 1rem (all sides)</div>
<div class="mx-auto">Center horizontally</div>
<div class="my-4">Margin 1rem (vertical)</div>
<div class="mt-4">Margin top 1rem</div>
<div class="mr-4">Margin right 1rem</div>
<div class="mb-4">Margin bottom 1rem</div>
<div class="ml-4">Margin left 1rem</div>

<!-- Space Between -->
<div class="flex flex-col space-y-4">
  <div>Item with vertical spacing</div>
  <div>Item with vertical spacing</div>
</div>

<div class="flex space-x-4">
  <div>Item with horizontal spacing</div>
  <div>Item with horizontal spacing</div>
</div>
```

### Sizing

Control width and height:

```html
<!-- Width -->
<div class="w-full">Full width</div>
<div class="w-1/2">50% width</div>
<div class="w-1/3">33.33% width</div>
<div class="w-64">16rem width</div>
<div class="w-screen">100vw width</div>

<!-- Min/Max Width -->
<div class="min-w-0">Min width 0</div>
<div class="max-w-md">Max width medium</div>
<div class="max-w-screen-xl">Max width XL screen</div>

<!-- Height -->
<div class="h-full">Full height</div>
<div class="h-screen">100vh height</div>
<div class="h-64">16rem height</div>

<!-- Min/Max Height -->
<div class="min-h-screen">Min height 100vh</div>
<div class="max-h-64">Max height 16rem</div>
```

### Typography

Style text:

```html
<!-- Font Family -->
<div class="font-sans">Sans-serif font</div>
<div class="font-serif">Serif font</div>
<div class="font-mono">Monospace font</div>

<!-- Font Size -->
<div class="text-xs">Extra small text</div>
<div class="text-sm">Small text</div>
<div class="text-base">Base text</div>
<div class="text-lg">Large text</div>
<div class="text-xl">Extra large text</div>
<div class="text-2xl">2X large text</div>
<div class="text-4xl">4X large text</div>

<!-- Font Weight -->
<div class="font-thin">Thin</div>
<div class="font-light">Light</div>
<div class="font-normal">Normal</div>
<div class="font-medium">Medium</div>
<div class="font-semibold">Semibold</div>
<div class="font-bold">Bold</div>

<!-- Text Alignment -->
<div class="text-left">Left aligned</div>
<div class="text-center">Center aligned</div>
<div class="text-right">Right aligned</div>
<div class="text-justify">Justified</div>

<!-- Text Color -->
<div class="text-black">Black text</div>
<div class="text-white">White text</div>
<div class="text-gray-500">Gray text</div>
<div class="text-blue-500">Blue text</div>
<div class="text-red-500">Red text</div>

<!-- Text Decoration -->
<div class="underline">Underlined text</div>
<div class="line-through">Strikethrough text</div>
<div class="no-underline">No underline</div>

<!-- Text Transform -->
<div class="uppercase">UPPERCASE TEXT</div>
<div class="lowercase">lowercase text</div>
<div class="capitalize">Capitalized Text</div>

<!-- Line Height -->
<div class="leading-none">Leading none</div>
<div class="leading-tight">Leading tight</div>
<div class="leading-normal">Leading normal</div>
<div class="leading-loose">Leading loose</div>

<!-- Letter Spacing -->
<div class="tracking-tighter">Tighter tracking</div>
<div class="tracking-tight">Tight tracking</div>
<div class="tracking-normal">Normal tracking</div>
<div class="tracking-wide">Wide tracking</div>
```

### Colors

Apply colors to backgrounds, text, and borders:

```html
<!-- Background Colors -->
<div class="bg-white">White background</div>
<div class="bg-black">Black background</div>
<div class="bg-gray-100">Light gray background</div>
<div class="bg-blue-500">Blue background</div>
<div class="bg-red-500">Red background</div>
<div class="bg-green-500">Green background</div>

<!-- Text Colors -->
<div class="text-white">White text</div>
<div class="text-gray-900">Dark gray text</div>
<div class="text-blue-600">Blue text</div>

<!-- Border Colors -->
<div class="border border-gray-300">Gray border</div>
<div class="border-2 border-blue-500">Blue border</div>
```

### Borders

Control border width, radius, and style:

```html
<!-- Border Width -->
<div class="border">1px border</div>
<div class="border-2">2px border</div>
<div class="border-4">4px border</div>
<div class="border-t">Top border only</div>
<div class="border-r">Right border only</div>
<div class="border-b">Bottom border only</div>
<div class="border-l">Left border only</div>

<!-- Border Radius -->
<div class="rounded">0.25rem border radius</div>
<div class="rounded-sm">Small border radius</div>
<div class="rounded-md">Medium border radius</div>
<div class="rounded-lg">Large border radius</div>
<div class="rounded-xl">XL border radius</div>
<div class="rounded-full">Full border radius (circle)</div>

<!-- Border Style -->
<div class="border border-solid">Solid border</div>
<div class="border border-dashed">Dashed border</div>
<div class="border border-dotted">Dotted border</div>
```

### Effects

Add shadows, opacity, and other effects:

```html
<!-- Box Shadow -->
<div class="shadow-sm">Small shadow</div>
<div class="shadow">Default shadow</div>
<div class="shadow-md">Medium shadow</div>
<div class="shadow-lg">Large shadow</div>
<div class="shadow-xl">XL shadow</div>
<div class="shadow-none">No shadow</div>

<!-- Opacity -->
<div class="opacity-0">Fully transparent</div>
<div class="opacity-25">25% opacity</div>
<div class="opacity-50">50% opacity</div>
<div class="opacity-75">75% opacity</div>
<div class="opacity-100">Fully opaque</div>
```

### Transforms

Apply transformations:

```html
<!-- Scale -->
<div class="scale-50">50% scale</div>
<div class="scale-100">100% scale</div>
<div class="scale-150">150% scale</div>

<!-- Rotate -->
<div class="rotate-45">Rotate 45 degrees</div>
<div class="rotate-90">Rotate 90 degrees</div>
<div class="-rotate-45">Rotate -45 degrees</div>

<!-- Translate -->
<div class="translate-x-4">Translate X by 1rem</div>
<div class="translate-y-4">Translate Y by 1rem</div>
<div class="-translate-x-4">Translate X by -1rem</div>
```

### Transitions

Add smooth transitions:

```html
<!-- Transition Property -->
<div class="transition">Transition all properties</div>
<div class="transition-colors">Transition colors only</div>
<div class="transition-transform">Transition transform only</div>

<!-- Transition Duration -->
<div class="transition duration-75">75ms duration</div>
<div class="transition duration-150">150ms duration</div>
<div class="transition duration-300">300ms duration</div>
<div class="transition duration-500">500ms duration</div>

<!-- Example: Hover transition -->
<button class="bg-blue-500 hover:bg-blue-600 transition duration-300">
  Hover me
</button>
```

## Responsive Design

Use responsive variants to build adaptive layouts:

```html
<!-- Responsive Grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <div>Item 4</div>
</div>

<!-- Responsive Typography -->
<h1 class="text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
  Responsive heading
</h1>

<!-- Responsive Spacing -->
<div class="p-2 md:p-4 lg:p-6 xl:p-8">
  Responsive padding
</div>

<!-- Show/Hide at breakpoints -->
<div class="hidden md:block">
  Visible on medium screens and up
</div>

<div class="block md:hidden">
  Visible only on small screens
</div>
```

### Breakpoints

| Breakpoint | Min Width | CSS |
|------------|-----------|-----|
| `sm:` | 640px | `@media (min-width: 640px)` |
| `md:` | 768px | `@media (min-width: 768px)` |
| `lg:` | 1024px | `@media (min-width: 1024px)` |
| `xl:` | 1280px | `@media (min-width: 1280px)` |
| `2xl:` | 1536px | `@media (min-width: 1536px)` |

## State Variants

Style elements based on their state:

```html
<!-- Hover -->
<button class="bg-blue-500 hover:bg-blue-600">
  Hover me
</button>

<!-- Focus -->
<input class="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500" />

<!-- Active -->
<button class="bg-blue-500 active:bg-blue-700">
  Click me
</button>

<!-- Disabled -->
<button class="bg-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed" disabled>
  Disabled button
</button>

<!-- Combined states -->
<button class="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 disabled:bg-gray-300 transition">
  Interactive button
</button>
```

## Dark Mode

Build dark mode interfaces:

```html
<!-- Dark mode colors -->
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  This adapts to dark mode
</div>

<!-- Dark mode layout example -->
<div class="min-h-screen bg-white dark:bg-gray-900">
  <nav class="bg-gray-100 dark:bg-gray-800">
    <a class="text-gray-900 dark:text-white hover:text-blue-500 dark:hover:text-blue-400">
      Link
    </a>
  </nav>

  <main class="p-4">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
      Dark mode heading
    </h1>
    <p class="text-gray-600 dark:text-gray-400">
      Dark mode paragraph
    </p>
  </main>
</div>
```

To enable dark mode, add the `dark` class to your `<html>` or `<body>` element:

```html
<html class="dark">
  <!-- Your content -->
</html>
```

Or toggle it with JavaScript:

```javascript
// Toggle dark mode
document.documentElement.classList.toggle('dark')

// Enable dark mode
document.documentElement.classList.add('dark')

// Disable dark mode
document.documentElement.classList.remove('dark')
```

## Group & Peer Variants

Create parent-child interactions:

```html
<!-- Group Hover -->
<div class="group">
  <img class="group-hover:scale-110 transition" src="image.jpg" />
  <h3 class="group-hover:text-blue-500">Hover the parent to see effect</h3>
</div>

<!-- Peer (sibling) interactions -->
<div>
  <input type="checkbox" class="peer" id="terms" />
  <label class="peer-checked:text-blue-500" for="terms">
    I accept the terms
  </label>
</div>
```

## Pseudo-elements

Style pseudo-elements:

```html
<!-- Before/After -->
<div class="before:content-['→'] before:mr-2">
  Text with arrow before
</div>

<div class="after:content-['*'] after:ml-1 after:text-red-500">
  Required field
</div>

<!-- Placeholder -->
<input
  class="placeholder:text-gray-400 placeholder:italic"
  placeholder="Enter your email"
/>

<!-- Selection (text selection) -->
<p class="selection:bg-blue-200 selection:text-blue-900">
  Select this text to see custom selection colors
</p>
```

## Arbitrary Values

Use arbitrary values for one-off customizations:

```html
<!-- Arbitrary sizes -->
<div class="w-[500px] h-[calc(100vh-4rem)]">
  Custom dimensions
</div>

<!-- Arbitrary colors -->
<div class="bg-[#1da1f2] text-[rgb(255,0,0)]">
  Custom colors
</div>

<!-- Arbitrary spacing -->
<div class="p-[17px] m-[3.5rem]">
  Custom spacing
</div>

<!-- Arbitrary values with CSS functions -->
<div class="text-[clamp(1rem,5vw,3rem)]">
  Responsive text size
</div>

<div class="grid-cols-[200px_minmax(0,1fr)_100px]">
  Custom grid template
</div>
```

## Important Modifier

Override styles with the `!` prefix:

```html
<!-- Force a style to be !important -->
<div class="text-blue-500 !text-red-500">
  This will be red (important override)
</div>

<!-- Useful for overriding third-party styles -->
<div class="some-third-party-class !bg-white !p-4">
  Override third-party styles
</div>
```

## Combining Utilities

Build complex components by combining utilities:

```html
<!-- Card Component -->
<div class="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white">
  <img class="w-full" src="image.jpg" alt="Card image">
  <div class="px-6 py-4">
    <h2 class="font-bold text-xl mb-2">Card Title</h2>
    <p class="text-gray-700 text-base">
      Card description goes here.
    </p>
  </div>
  <div class="px-6 pt-4 pb-2">
    <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
      #tag
    </span>
  </div>
</div>

<!-- Button Component -->
<button class="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-150">
  Click Me
</button>

<!-- Input Component -->
<div class="relative">
  <input
    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    type="text"
    placeholder="Enter text"
  />
</div>

<!-- Modal Component -->
<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
  <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
    <h2 class="text-2xl font-bold mb-4">Modal Title</h2>
    <p class="text-gray-600 mb-6">Modal content goes here.</p>
    <div class="flex justify-end gap-2">
      <button class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition">
        Cancel
      </button>
      <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
        Confirm
      </button>
    </div>
  </div>
</div>
```

## Next Steps

- [Custom Themes](./config.md) - Customize colors, spacing, and more
- [Shortcuts](./features/shortcuts.md) - Create reusable utility combinations
- [Compile Classes](./features/compile-class.md) - Optimize your HTML
- [CLI Commands](./features/cli.md) - Learn all CLI commands
