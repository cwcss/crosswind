/* eslint-disable no-console */
import { bench, group, run } from 'mitata'
import { CSSGenerator } from '../src/generator'
import { defaultConfig } from '../src/config'

// UnoCSS setup
import { createGenerator } from '@unocss/core'
import presetWind from '@unocss/preset-wind'

// Tailwind CSS v3 setup
import postcss from 'postcss'
import tailwindcss from 'tailwindcss'

// Tailwind CSS v4 setup
import tailwindcssV4 from '@tailwindcss/postcss'

// Initialize UnoCSS generator
const unoGen = await createGenerator({
  presets: [presetWind()],
})

// Initialize Tailwind CSS v3 processor
const tailwindV3Processor = postcss([
  tailwindcss({
    content: [{ raw: '', extension: 'html' }],
    corePlugins: { preflight: false },
  }),
])

// Initialize Tailwind CSS v4 processor
const tailwindV4Processor = postcss([tailwindcssV4()])

// =============================================================================
// VALID UTILITY CLASS SETS
// All classes below are valid Tailwind CSS classes
// =============================================================================

// Simple utilities - basic layout, spacing, colors
const simpleUtilities = [
  'w-4', 'h-4', 'p-4', 'm-4', 'text-lg', 'bg-blue-500',
  'flex', 'items-center', 'justify-between', 'rounded-lg',
]

// Complex utilities with responsive and state variants
const complexUtilities = [
  'sm:w-full', 'md:w-1/2', 'lg:w-1/3', 'xl:w-1/4',
  'hover:bg-blue-600', 'focus:ring-2', 'active:scale-95',
  'dark:bg-gray-800', 'dark:text-white',
  'sm:hover:bg-blue-500', 'md:dark:text-gray-200',
]

// Arbitrary values - bracket notation
const arbitraryValues = [
  'w-[123px]', 'h-[456px]', 'text-[#ff0000]', 'p-[2rem]',
  'bg-[#1a1a1a]', 'm-[10%]', 'shadow-[0_4px_6px_rgba(0,0,0,0.1)]',
  'top-[50%]', 'left-[calc(100%-2rem)]', 'grid-cols-[1fr_2fr_1fr]',
]

// Real-world component class combinations (as arrays for proper testing)
const realWorldComponents = [
  // Card component
  ['flex', 'items-center', 'justify-between', 'p-4', 'bg-white', 'dark:bg-gray-800', 'rounded-lg', 'shadow-md'],
  // Container
  ['w-full', 'max-w-md', 'mx-auto', 'space-y-4', 'sm:space-y-6'],
  // Heading
  ['text-lg', 'font-semibold', 'text-gray-900', 'dark:text-white', 'tracking-tight'],
  // Grid layout
  ['grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-4', 'p-6'],
  // Interactive button
  ['px-4', 'py-2', 'bg-blue-500', 'hover:bg-blue-600', 'text-white', 'rounded-md', 'transition-colors', 'duration-200'],
  // Form input
  ['w-full', 'px-3', 'py-2', 'border', 'border-gray-300', 'rounded-md', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent'],
  // Navigation item
  ['flex', 'items-center', 'gap-2', 'px-4', 'py-2', 'text-gray-700', 'hover:text-gray-900', 'hover:bg-gray-100', 'rounded-lg'],
  // Badge
  ['inline-flex', 'items-center', 'px-2', 'py-1', 'text-xs', 'font-medium', 'bg-green-100', 'text-green-800', 'rounded-full'],
]

// Valid spacing values (Tailwind's actual spacing scale)
const validSpacingValues = [
  '0', 'px', '0.5', '1', '1.5', '2', '2.5', '3', '3.5', '4', '5', '6', '7', '8', '9', '10',
  '11', '12', '14', '16', '20', '24', '28', '32', '36', '40', '44', '48', '52', '56', '60',
  '64', '72', '80', '96',
]

// Valid width/height values (includes fractions and special values)
const validSizeValues = [
  ...validSpacingValues,
  'auto', 'full', 'screen', 'min', 'max', 'fit',
  '1/2', '1/3', '2/3', '1/4', '2/4', '3/4',
  '1/5', '2/5', '3/5', '4/5',
  '1/6', '2/6', '3/6', '4/6', '5/6',
]

// Valid color shades
const validShades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950']

// Color names
const colorNames = ['slate', 'gray', 'zinc', 'neutral', 'stone', 'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose']

// Typography utilities
const typographyUtilities = [
  // Font sizes
  'text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl',
  // Font weights
  'font-thin', 'font-light', 'font-normal', 'font-medium', 'font-semibold', 'font-bold', 'font-extrabold',
  // Letter spacing
  'tracking-tighter', 'tracking-tight', 'tracking-normal', 'tracking-wide', 'tracking-wider', 'tracking-widest',
  // Line height
  'leading-none', 'leading-tight', 'leading-snug', 'leading-normal', 'leading-relaxed', 'leading-loose',
  // Text alignment
  'text-left', 'text-center', 'text-right', 'text-justify',
  // Text decoration
  'underline', 'overline', 'line-through', 'no-underline',
  // Text transform
  'uppercase', 'lowercase', 'capitalize', 'normal-case',
  // Whitespace
  'whitespace-normal', 'whitespace-nowrap', 'whitespace-pre', 'whitespace-pre-line', 'whitespace-pre-wrap',
  // Word break
  'break-normal', 'break-words', 'break-all',
]

// Flexbox utilities
const flexboxUtilities = [
  // Display
  'flex', 'inline-flex',
  // Direction
  'flex-row', 'flex-row-reverse', 'flex-col', 'flex-col-reverse',
  // Wrap
  'flex-wrap', 'flex-wrap-reverse', 'flex-nowrap',
  // Flex values
  'flex-1', 'flex-auto', 'flex-initial', 'flex-none',
  // Grow/Shrink
  'grow', 'grow-0', 'shrink', 'shrink-0',
  // Justify content
  'justify-start', 'justify-end', 'justify-center', 'justify-between', 'justify-around', 'justify-evenly',
  // Align items
  'items-start', 'items-end', 'items-center', 'items-baseline', 'items-stretch',
  // Align content
  'content-start', 'content-end', 'content-center', 'content-between', 'content-around', 'content-evenly',
  // Align self
  'self-auto', 'self-start', 'self-end', 'self-center', 'self-stretch',
  // Gap
  'gap-0', 'gap-1', 'gap-2', 'gap-4', 'gap-6', 'gap-8',
  'gap-x-4', 'gap-y-4',
]

// Grid utilities
const gridUtilities = [
  // Display
  'grid', 'inline-grid',
  // Grid template columns
  'grid-cols-1', 'grid-cols-2', 'grid-cols-3', 'grid-cols-4', 'grid-cols-5', 'grid-cols-6',
  'grid-cols-12', 'grid-cols-none',
  // Grid template rows
  'grid-rows-1', 'grid-rows-2', 'grid-rows-3', 'grid-rows-4', 'grid-rows-5', 'grid-rows-6', 'grid-rows-none',
  // Grid column span
  'col-auto', 'col-span-1', 'col-span-2', 'col-span-3', 'col-span-4', 'col-span-6', 'col-span-12', 'col-span-full',
  // Grid row span
  'row-auto', 'row-span-1', 'row-span-2', 'row-span-3', 'row-span-4', 'row-span-6', 'row-span-full',
  // Grid flow
  'grid-flow-row', 'grid-flow-col', 'grid-flow-row-dense', 'grid-flow-col-dense',
  // Auto columns/rows
  'auto-cols-auto', 'auto-cols-min', 'auto-cols-max', 'auto-cols-fr',
  'auto-rows-auto', 'auto-rows-min', 'auto-rows-max', 'auto-rows-fr',
  // Place content/items/self
  'place-content-center', 'place-content-start', 'place-content-end',
  'place-items-center', 'place-items-start', 'place-items-end',
  'place-self-center', 'place-self-start', 'place-self-end',
]

// Stacked/chained variants (multiple variants combined)
const stackedVariants = [
  // Responsive + state
  'sm:hover:bg-blue-500', 'md:hover:bg-blue-600', 'lg:hover:bg-blue-700',
  'sm:focus:ring-2', 'md:focus:ring-4', 'lg:focus:ring-8',
  // Responsive + dark mode
  'sm:dark:bg-gray-800', 'md:dark:bg-gray-900', 'lg:dark:bg-black',
  'sm:dark:text-white', 'md:dark:text-gray-100', 'lg:dark:text-gray-200',
  // Dark mode + state
  'dark:hover:bg-gray-700', 'dark:focus:ring-blue-400', 'dark:active:bg-gray-600',
  // Triple stacked: responsive + dark + state
  'sm:dark:hover:bg-gray-600', 'md:dark:hover:bg-gray-700', 'lg:dark:hover:bg-gray-800',
  'sm:dark:focus:ring-2', 'md:dark:focus:ring-4',
  // Group variants
  'group-hover:opacity-100', 'group-hover:visible', 'group-hover:scale-105',
  'group-focus:ring-2', 'group-focus:border-blue-500',
  // Peer variants
  'peer-focus:ring-2', 'peer-checked:bg-blue-500', 'peer-invalid:border-red-500',
  // First/last/odd/even
  'first:pt-0', 'last:pb-0', 'odd:bg-gray-50', 'even:bg-white',
  'first:rounded-t-lg', 'last:rounded-b-lg',
  // Responsive + first/last
  'sm:first:pt-0', 'md:last:pb-0', 'lg:odd:bg-gray-100',
]

// Transform and transition utilities
const transformUtilities = [
  // Scale
  'scale-0', 'scale-50', 'scale-75', 'scale-90', 'scale-95', 'scale-100', 'scale-105', 'scale-110', 'scale-125', 'scale-150',
  'scale-x-100', 'scale-y-100',
  // Rotate
  'rotate-0', 'rotate-1', 'rotate-2', 'rotate-3', 'rotate-6', 'rotate-12', 'rotate-45', 'rotate-90', 'rotate-180',
  '-rotate-1', '-rotate-2', '-rotate-3', '-rotate-6', '-rotate-12', '-rotate-45', '-rotate-90', '-rotate-180',
  // Translate
  'translate-x-0', 'translate-x-1', 'translate-x-2', 'translate-x-4', 'translate-x-full', '-translate-x-full',
  'translate-y-0', 'translate-y-1', 'translate-y-2', 'translate-y-4', 'translate-y-full', '-translate-y-full',
  // Skew
  'skew-x-0', 'skew-x-1', 'skew-x-2', 'skew-x-3', 'skew-x-6', 'skew-x-12',
  'skew-y-0', 'skew-y-1', 'skew-y-2', 'skew-y-3', 'skew-y-6', 'skew-y-12',
  // Origin
  'origin-center', 'origin-top', 'origin-top-right', 'origin-right', 'origin-bottom-right',
  'origin-bottom', 'origin-bottom-left', 'origin-left', 'origin-top-left',
]

const transitionUtilities = [
  // Transition property
  'transition-none', 'transition-all', 'transition', 'transition-colors', 'transition-opacity', 'transition-shadow', 'transition-transform',
  // Duration
  'duration-75', 'duration-100', 'duration-150', 'duration-200', 'duration-300', 'duration-500', 'duration-700', 'duration-1000',
  // Timing function
  'ease-linear', 'ease-in', 'ease-out', 'ease-in-out',
  // Delay
  'delay-75', 'delay-100', 'delay-150', 'delay-200', 'delay-300', 'delay-500', 'delay-700', 'delay-1000',
  // Animation
  'animate-none', 'animate-spin', 'animate-ping', 'animate-pulse', 'animate-bounce',
]

// Border and ring utilities
const borderUtilities = [
  // Border width
  'border', 'border-0', 'border-2', 'border-4', 'border-8',
  'border-t', 'border-r', 'border-b', 'border-l',
  'border-t-0', 'border-r-0', 'border-b-0', 'border-l-0',
  'border-t-2', 'border-r-2', 'border-b-2', 'border-l-2',
  // Border style
  'border-solid', 'border-dashed', 'border-dotted', 'border-double', 'border-none',
  // Border radius
  'rounded-none', 'rounded-sm', 'rounded', 'rounded-md', 'rounded-lg', 'rounded-xl', 'rounded-2xl', 'rounded-3xl', 'rounded-full',
  'rounded-t-lg', 'rounded-r-lg', 'rounded-b-lg', 'rounded-l-lg',
  'rounded-tl-lg', 'rounded-tr-lg', 'rounded-br-lg', 'rounded-bl-lg',
  // Ring
  'ring-0', 'ring-1', 'ring-2', 'ring-4', 'ring-8', 'ring',
  'ring-inset',
  // Ring offset
  'ring-offset-0', 'ring-offset-1', 'ring-offset-2', 'ring-offset-4', 'ring-offset-8',
]

// Shadow and opacity utilities
const effectUtilities = [
  // Box shadow
  'shadow-sm', 'shadow', 'shadow-md', 'shadow-lg', 'shadow-xl', 'shadow-2xl', 'shadow-inner', 'shadow-none',
  // Opacity
  'opacity-0', 'opacity-5', 'opacity-10', 'opacity-20', 'opacity-25', 'opacity-30', 'opacity-40', 'opacity-50',
  'opacity-60', 'opacity-70', 'opacity-75', 'opacity-80', 'opacity-90', 'opacity-95', 'opacity-100',
  // Mix blend mode
  'mix-blend-normal', 'mix-blend-multiply', 'mix-blend-screen', 'mix-blend-overlay',
  // Background blend mode
  'bg-blend-normal', 'bg-blend-multiply', 'bg-blend-screen', 'bg-blend-overlay',
]

// =============================================================================
// BENCHMARK HELPERS
// =============================================================================

async function benchmarkUnoCSS(classes: string[]): Promise<void> {
  await unoGen.generate(classes.join(' '))
}

async function benchmarkTailwindV3(classes: string[]): Promise<void> {
  const classString = classes.join(' ')
  const css = `
    @tailwind utilities;
    @layer utilities {
      .test { @apply ${classString}; }
    }
  `
  await tailwindV3Processor.process(css, { from: undefined })
}

async function benchmarkTailwindV4(classes: string[]): Promise<void> {
  const selectors = classes.map(cls =>
    `.${cls.replace(/:/g, '\\:').replace(/\[/g, '\\[').replace(/]/g, '\\]').replace(/\//g, '\\/').replace(/\./g, '\\.').replace(/-\\/g, '-\\\\')}`
  ).join(',\n')

  const css = `
@tailwind utilities;

${selectors} {
  /* Trigger utility generation */
}
  `
  await tailwindV4Processor.process(css, { from: undefined })
}

function benchmarkCrosswind(classes: string[]): void {
  const gen = new CSSGenerator(defaultConfig)
  for (const cls of classes) {
    gen.generate(cls)
  }
}

function benchmarkCrosswindWithOutput(classes: string[]): string {
  const gen = new CSSGenerator(defaultConfig)
  for (const cls of classes) {
    gen.generate(cls)
  }
  return gen.toCSS(false)
}

// =============================================================================
// BENCHMARKS
// =============================================================================

// 1. Simple utilities benchmark
group('Simple Utilities (10 classes)', () => {
  bench('Crosswind', () => {
    benchmarkCrosswind(simpleUtilities)
  })

  bench('UnoCSS', async () => {
    await benchmarkUnoCSS(simpleUtilities)
  })

  bench('Tailwind CSS v3', async () => {
    await benchmarkTailwindV3(simpleUtilities)
  })

  bench('Tailwind CSS v4', async () => {
    await benchmarkTailwindV4(simpleUtilities)
  })
})

// 2. Complex utilities with variants benchmark
group('Complex Utilities with Variants (11 classes)', () => {
  bench('Crosswind', () => {
    benchmarkCrosswind(complexUtilities)
  })

  bench('UnoCSS', async () => {
    await benchmarkUnoCSS(complexUtilities)
  })

  bench('Tailwind CSS v3', async () => {
    await benchmarkTailwindV3(complexUtilities)
  })

  bench('Tailwind CSS v4', async () => {
    await benchmarkTailwindV4(complexUtilities)
  })
})

// 3. Arbitrary values benchmark
group('Arbitrary Values (10 classes)', () => {
  bench('Crosswind', () => {
    benchmarkCrosswind(arbitraryValues)
  })

  bench('UnoCSS', async () => {
    await benchmarkUnoCSS(arbitraryValues)
  })

  bench('Tailwind CSS v3', async () => {
    await benchmarkTailwindV3(arbitraryValues)
  })

  bench('Tailwind CSS v4', async () => {
    await benchmarkTailwindV4(arbitraryValues)
  })
})

// 4. Real-world component classes (FIXED: properly splits class strings)
group('Real-world Components (8 components, ~60 classes)', () => {
  const allClasses = realWorldComponents.flat()

  bench('Crosswind', () => {
    const gen = new CSSGenerator(defaultConfig)
    for (const cls of allClasses) {
      gen.generate(cls)
    }
  })

  bench('UnoCSS', async () => {
    await unoGen.generate(allClasses.join(' '))
  })

  bench('Tailwind CSS v3', async () => {
    await benchmarkTailwindV3(allClasses)
  })

  bench('Tailwind CSS v4', async () => {
    await benchmarkTailwindV4(allClasses)
  })
})

// 5. Large scale with VALID classes
group('Large Scale: Valid Utilities (500 classes)', () => {
  const largeSet: string[] = []

  // Width utilities with valid values
  for (const size of validSizeValues.slice(0, 25)) {
    largeSet.push(`w-${size}`)
  }
  // Height utilities with valid values
  for (const size of validSizeValues.slice(0, 25)) {
    largeSet.push(`h-${size}`)
  }
  // Padding utilities with valid values
  for (const size of validSpacingValues) {
    largeSet.push(`p-${size}`)
  }
  // Margin utilities with valid values
  for (const size of validSpacingValues) {
    largeSet.push(`m-${size}`)
  }
  // Gap utilities
  for (const size of validSpacingValues.slice(0, 20)) {
    largeSet.push(`gap-${size}`)
  }
  // Padding x/y
  for (const size of validSpacingValues.slice(0, 20)) {
    largeSet.push(`px-${size}`, `py-${size}`)
  }
  // Margin x/y
  for (const size of validSpacingValues.slice(0, 20)) {
    largeSet.push(`mx-${size}`, `my-${size}`)
  }
  // Top/right/bottom/left
  for (const size of validSpacingValues.slice(0, 15)) {
    largeSet.push(`top-${size}`, `right-${size}`, `bottom-${size}`, `left-${size}`)
  }

  bench('Crosswind', () => {
    benchmarkCrosswind(largeSet)
  })

  bench('UnoCSS', async () => {
    await benchmarkUnoCSS(largeSet)
  })

  bench('Tailwind CSS v3', async () => {
    await benchmarkTailwindV3(largeSet)
  })

  bench('Tailwind CSS v4', async () => {
    await benchmarkTailwindV4(largeSet)
  })
})

// 6. CSS output generation benchmark
group('CSS Output Generation (1000 arbitrary values)', () => {
  const utilities: string[] = []
  for (let i = 0; i < 1000; i++) {
    utilities.push(`w-[${i}px]`)
  }

  bench('Crosswind', () => {
    benchmarkCrosswindWithOutput(utilities)
  })

  bench('UnoCSS', async () => {
    const result = await unoGen.generate(utilities.join(' '))
    result.css
  })

  bench('Tailwind CSS v3', async () => {
    await benchmarkTailwindV3(utilities)
  })

  bench('Tailwind CSS v4', async () => {
    await benchmarkTailwindV4(utilities)
  })
})

// 7. Color utilities benchmark (VALID shades)
group('Color Utilities (330 classes)', () => {
  const colorUtilities: string[] = []

  // Use subset of colors to keep benchmark reasonable
  const colors = ['gray', 'red', 'blue', 'green', 'yellow', 'purple', 'pink', 'indigo', 'cyan', 'emerald']

  for (const color of colors) {
    for (const shade of validShades) {
      colorUtilities.push(`bg-${color}-${shade}`)
      colorUtilities.push(`text-${color}-${shade}`)
      colorUtilities.push(`border-${color}-${shade}`)
    }
  }

  bench('Crosswind', () => {
    benchmarkCrosswind(colorUtilities)
  })

  bench('UnoCSS', async () => {
    await benchmarkUnoCSS(colorUtilities)
  })

  bench('Tailwind CSS v3', async () => {
    await benchmarkTailwindV3(colorUtilities)
  })

  bench('Tailwind CSS v4', async () => {
    await benchmarkTailwindV4(colorUtilities)
  })
})

// 8. Responsive utilities with VALID values
group('Responsive Utilities (500 classes)', () => {
  const breakpoints = ['sm', 'md', 'lg', 'xl', '2xl']
  const responsiveUtilities: string[] = []

  // Valid width values with responsive prefixes
  for (const bp of breakpoints) {
    for (const size of validSizeValues.slice(0, 20)) {
      responsiveUtilities.push(`${bp}:w-${size}`)
    }
  }
  // Valid padding values with responsive prefixes
  for (const bp of breakpoints) {
    for (const size of validSpacingValues.slice(0, 15)) {
      responsiveUtilities.push(`${bp}:p-${size}`)
    }
  }
  // Text sizes with responsive prefixes
  const textSizes = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl']
  for (const bp of breakpoints) {
    for (const size of textSizes) {
      responsiveUtilities.push(`${bp}:text-${size}`)
    }
  }

  bench('Crosswind', () => {
    benchmarkCrosswind(responsiveUtilities)
  })

  bench('UnoCSS', async () => {
    await benchmarkUnoCSS(responsiveUtilities)
  })

  bench('Tailwind CSS v3', async () => {
    await benchmarkTailwindV3(responsiveUtilities)
  })

  bench('Tailwind CSS v4', async () => {
    await benchmarkTailwindV4(responsiveUtilities)
  })
})

// 9. Interactive states with VALID color shades
group('Interactive States (440 classes)', () => {
  const states = ['hover', 'focus', 'active', 'disabled', 'first', 'last', 'odd', 'even', 'dark', 'group-hover', 'peer-focus']
  const stateUtilities: string[] = []

  // Colors with valid shades
  const colors = ['blue', 'gray', 'red', 'green']
  for (const state of states) {
    for (const color of colors) {
      for (const shade of validShades) {
        stateUtilities.push(`${state}:bg-${color}-${shade}`)
      }
    }
  }

  bench('Crosswind', () => {
    benchmarkCrosswind(stateUtilities)
  })

  bench('UnoCSS', async () => {
    await benchmarkUnoCSS(stateUtilities)
  })

  bench('Tailwind CSS v3', async () => {
    await benchmarkTailwindV3(stateUtilities)
  })

  bench('Tailwind CSS v4', async () => {
    await benchmarkTailwindV4(stateUtilities)
  })
})

// 10. Duplicate handling benchmark
group('Duplicate Handling (6 classes x 1000 times)', () => {
  const duplicates = ['w-4', 'h-4', 'p-4', 'm-4', 'text-lg', 'bg-blue-500']
  const manyDuplicates: string[] = []
  for (let i = 0; i < 1000; i++) {
    manyDuplicates.push(...duplicates)
  }

  bench('Crosswind', () => {
    benchmarkCrosswind(manyDuplicates)
  })

  bench('UnoCSS', async () => {
    await benchmarkUnoCSS(manyDuplicates)
  })

  bench('Tailwind CSS v3', async () => {
    await benchmarkTailwindV3(manyDuplicates)
  })

  bench('Tailwind CSS v4', async () => {
    await benchmarkTailwindV4(manyDuplicates)
  })
})

// 11. Typography utilities benchmark (NEW)
group('Typography Utilities (50 classes)', () => {
  bench('Crosswind', () => {
    benchmarkCrosswind(typographyUtilities)
  })

  bench('UnoCSS', async () => {
    await benchmarkUnoCSS(typographyUtilities)
  })

  bench('Tailwind CSS v3', async () => {
    await benchmarkTailwindV3(typographyUtilities)
  })

  bench('Tailwind CSS v4', async () => {
    await benchmarkTailwindV4(typographyUtilities)
  })
})

// 12. Flexbox utilities benchmark (NEW)
group('Flexbox Utilities (50 classes)', () => {
  bench('Crosswind', () => {
    benchmarkCrosswind(flexboxUtilities)
  })

  bench('UnoCSS', async () => {
    await benchmarkUnoCSS(flexboxUtilities)
  })

  bench('Tailwind CSS v3', async () => {
    await benchmarkTailwindV3(flexboxUtilities)
  })

  bench('Tailwind CSS v4', async () => {
    await benchmarkTailwindV4(flexboxUtilities)
  })
})

// 13. Grid utilities benchmark (NEW)
group('Grid Utilities (55 classes)', () => {
  bench('Crosswind', () => {
    benchmarkCrosswind(gridUtilities)
  })

  bench('UnoCSS', async () => {
    await benchmarkUnoCSS(gridUtilities)
  })

  bench('Tailwind CSS v3', async () => {
    await benchmarkTailwindV3(gridUtilities)
  })

  bench('Tailwind CSS v4', async () => {
    await benchmarkTailwindV4(gridUtilities)
  })
})

// 14. Stacked/chained variants benchmark (NEW)
group('Stacked Variants (40 classes)', () => {
  bench('Crosswind', () => {
    benchmarkCrosswind(stackedVariants)
  })

  bench('UnoCSS', async () => {
    await benchmarkUnoCSS(stackedVariants)
  })

  bench('Tailwind CSS v3', async () => {
    await benchmarkTailwindV3(stackedVariants)
  })

  bench('Tailwind CSS v4', async () => {
    await benchmarkTailwindV4(stackedVariants)
  })
})

// 15. Transform utilities benchmark (NEW)
group('Transform Utilities (55 classes)', () => {
  bench('Crosswind', () => {
    benchmarkCrosswind(transformUtilities)
  })

  bench('UnoCSS', async () => {
    await benchmarkUnoCSS(transformUtilities)
  })

  bench('Tailwind CSS v3', async () => {
    await benchmarkTailwindV3(transformUtilities)
  })

  bench('Tailwind CSS v4', async () => {
    await benchmarkTailwindV4(transformUtilities)
  })
})

// 16. Transition utilities benchmark (NEW)
group('Transition & Animation (30 classes)', () => {
  bench('Crosswind', () => {
    benchmarkCrosswind(transitionUtilities)
  })

  bench('UnoCSS', async () => {
    await benchmarkUnoCSS(transitionUtilities)
  })

  bench('Tailwind CSS v3', async () => {
    await benchmarkTailwindV3(transitionUtilities)
  })

  bench('Tailwind CSS v4', async () => {
    await benchmarkTailwindV4(transitionUtilities)
  })
})

// 17. Border utilities benchmark (NEW)
group('Border & Ring Utilities (45 classes)', () => {
  bench('Crosswind', () => {
    benchmarkCrosswind(borderUtilities)
  })

  bench('UnoCSS', async () => {
    await benchmarkUnoCSS(borderUtilities)
  })

  bench('Tailwind CSS v3', async () => {
    await benchmarkTailwindV3(borderUtilities)
  })

  bench('Tailwind CSS v4', async () => {
    await benchmarkTailwindV4(borderUtilities)
  })
})

// 18. Effects utilities benchmark (NEW)
group('Shadow & Effects (35 classes)', () => {
  bench('Crosswind', () => {
    benchmarkCrosswind(effectUtilities)
  })

  bench('UnoCSS', async () => {
    await benchmarkUnoCSS(effectUtilities)
  })

  bench('Tailwind CSS v3', async () => {
    await benchmarkTailwindV3(effectUtilities)
  })

  bench('Tailwind CSS v4', async () => {
    await benchmarkTailwindV4(effectUtilities)
  })
})

// 19. Incremental generation benchmark (NEW - tests caching efficiency)
group('Incremental Generation (add 100 classes to existing 100)', () => {
  const initialClasses = simpleUtilities.concat(complexUtilities).concat(typographyUtilities.slice(0, 30))
  const additionalClasses = flexboxUtilities.concat(gridUtilities.slice(0, 20)).concat(borderUtilities.slice(0, 30))

  bench('Crosswind', () => {
    const gen = new CSSGenerator(defaultConfig)
    // Generate initial classes
    for (const cls of initialClasses) {
      gen.generate(cls)
    }
    // Add more classes (tests incremental efficiency)
    for (const cls of additionalClasses) {
      gen.generate(cls)
    }
  })

  bench('UnoCSS', async () => {
    // UnoCSS handles this in one call
    await unoGen.generate(initialClasses.concat(additionalClasses).join(' '))
  })

  bench('Tailwind CSS v3', async () => {
    await benchmarkTailwindV3(initialClasses.concat(additionalClasses))
  })

  bench('Tailwind CSS v4', async () => {
    await benchmarkTailwindV4(initialClasses.concat(additionalClasses))
  })
})

// 20. Full realistic project simulation (NEW)
group('Full Project Simulation (~800 unique classes)', () => {
  // Simulate a real project with diverse utility usage
  const projectClasses = [
    ...simpleUtilities,
    ...complexUtilities,
    ...arbitraryValues,
    ...realWorldComponents.flat(),
    ...typographyUtilities,
    ...flexboxUtilities,
    ...gridUtilities,
    ...stackedVariants,
    ...transformUtilities.slice(0, 30),
    ...transitionUtilities,
    ...borderUtilities,
    ...effectUtilities,
  ]

  // Add color utilities
  const colors = ['gray', 'blue', 'red', 'green']
  for (const color of colors) {
    for (const shade of validShades) {
      projectClasses.push(`bg-${color}-${shade}`, `text-${color}-${shade}`)
    }
  }

  // Add responsive variants
  const breakpoints = ['sm', 'md', 'lg']
  for (const bp of breakpoints) {
    projectClasses.push(
      `${bp}:w-full`, `${bp}:flex`, `${bp}:hidden`, `${bp}:block`,
      `${bp}:text-lg`, `${bp}:p-4`, `${bp}:grid-cols-2`
    )
  }

  bench('Crosswind', () => {
    benchmarkCrosswindWithOutput(projectClasses)
  })

  bench('UnoCSS', async () => {
    const result = await unoGen.generate(projectClasses.join(' '))
    result.css
  })

  bench('Tailwind CSS v3', async () => {
    await benchmarkTailwindV3(projectClasses)
  })

  bench('Tailwind CSS v4', async () => {
    await benchmarkTailwindV4(projectClasses)
  })
})

console.log('\n🚀 Running Comprehensive Framework Comparison Benchmarks...\n')
console.log('Comparing: Crosswind vs UnoCSS vs Tailwind CSS v3 vs Tailwind CSS v4')
console.log('All benchmarks use VALID Tailwind CSS utility classes\n')

await run({
  colors: true,
})

console.log('\n✨ Benchmark completed!\n')
