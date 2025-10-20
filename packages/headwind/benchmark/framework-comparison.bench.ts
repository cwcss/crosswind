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

// Sample utility classes for testing
const simpleUtilities = [
  'w-4', 'h-4', 'p-4', 'm-4', 'text-lg', 'bg-blue-500',
  'flex', 'items-center', 'justify-between', 'rounded-lg',
]

const complexUtilities = [
  'sm:w-full', 'md:w-1/2', 'lg:w-1/3', 'xl:w-1/4',
  'hover:bg-blue-600', 'focus:ring-2', 'active:scale-95',
  'dark:bg-gray-800', 'dark:text-white',
  'sm:hover:bg-blue-500', 'md:dark:text-gray-200',
]

const arbitraryValues = [
  'w-[123px]', 'h-[456px]', 'text-[#ff0000]', 'p-[2rem]',
  'bg-[#1a1a1a]', 'm-[10%]', 'shadow-[0_4px_6px_rgba(0,0,0,0.1)]',
]

const realWorldClasses = [
  'flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md',
  'w-full max-w-md mx-auto space-y-4 sm:space-y-6',
  'text-lg font-semibold text-gray-900 dark:text-white',
  'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
  'hover:bg-blue-50 hover:dark:bg-blue-900 transition-colors duration-200',
  'border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500',
]

// Benchmark helpers
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
  // Generate CSS selectors for each class
  const selectors = classes.map(cls =>
    `.${cls.replace(/:/g, '\\:').replace(/\[/g, '\\[').replace(/]/g, '\\]')}`
  ).join(',\n')

  const css = `
@tailwind utilities;

${selectors} {
  /* Trigger utility generation */
}
  `
  await tailwindV4Processor.process(css, { from: undefined })
}

function benchmarkHeadwind(classes: string[]): void {
  const gen = new CSSGenerator(defaultConfig)
  for (const cls of classes) {
    gen.generate(cls)
  }
}

// Simple utilities benchmark
group('Simple Utilities (10 classes)', () => {
  bench('Headwind', () => {
    benchmarkHeadwind(simpleUtilities)
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

// Complex utilities benchmark
group('Complex Utilities with Variants (11 classes)', () => {
  bench('Headwind', () => {
    benchmarkHeadwind(complexUtilities)
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

// Arbitrary values benchmark
group('Arbitrary Values (7 classes)', () => {
  bench('Headwind', () => {
    benchmarkHeadwind(arbitraryValues)
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

// Real-world component benchmark
group('Real-world Component Classes (6 class strings)', () => {
  bench('Headwind', () => {
    const gen = new CSSGenerator(defaultConfig)
    for (const classes of realWorldClasses) {
      gen.generate(classes)
    }
  })

  bench('UnoCSS', async () => {
    for (const classes of realWorldClasses) {
      await benchmarkUnoCSS([classes])
    }
  })

  bench('Tailwind CSS v3', async () => {
    for (const classes of realWorldClasses) {
      await benchmarkTailwindV3([classes])
    }
  })

  bench('Tailwind CSS v4', async () => {
    for (const classes of realWorldClasses) {
      await benchmarkTailwindV4([classes])
    }
  })

})

// Large-scale generation benchmark
group('Large Scale: 1000 Utilities', () => {
  const largeSet: string[] = []
  for (let i = 0; i < 250; i++) {
    largeSet.push(`w-${i}`, `h-${i}`, `p-${i}`, `m-${i}`)
  }

  bench('Headwind', () => {
    benchmarkHeadwind(largeSet)
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

// CSS output generation benchmark
group('CSS Output Generation (1000 rules)', () => {
  const utilities: string[] = []
  for (let i = 0; i < 1000; i++) {
    utilities.push(`w-[${i}px]`)
  }

  bench('Headwind', () => {
    const gen = new CSSGenerator(defaultConfig)
    for (const cls of utilities) {
      gen.generate(cls)
    }
    gen.toCSS(false)
  })

  bench('UnoCSS', async () => {
    const result = await unoGen.generate(utilities.join(' '))
    result.css // Access the CSS output
  })

  bench('Tailwind CSS v3', async () => {
    await benchmarkTailwindV3(utilities)
  })

  bench('Tailwind CSS v4', async () => {
    await benchmarkTailwindV4(utilities)
  })

})

// Color utilities benchmark
group('Color Utilities (240 classes)', () => {
  const colors = ['blue', 'red', 'green', 'yellow', 'purple', 'pink', 'indigo', 'gray']
  const shades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900']
  const colorUtilities: string[] = []

  for (const color of colors) {
    for (const shade of shades) {
      colorUtilities.push(`bg-${color}-${shade}`)
      colorUtilities.push(`text-${color}-${shade}`)
      colorUtilities.push(`border-${color}-${shade}`)
    }
  }

  bench('Headwind', () => {
    benchmarkHeadwind(colorUtilities)
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

// Responsive utilities benchmark
group('Responsive Utilities (1000 classes)', () => {
  const breakpoints = ['sm', 'md', 'lg', 'xl', '2xl']
  const responsiveUtilities: string[] = []

  for (const bp of breakpoints) {
    for (let i = 0; i < 200; i++) {
      responsiveUtilities.push(`${bp}:w-${i}`)
    }
  }

  bench('Headwind', () => {
    benchmarkHeadwind(responsiveUtilities)
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

// Interactive states benchmark
group('Interactive States (550 classes)', () => {
  const states = ['hover', 'focus', 'active', 'disabled', 'group-hover', 'peer-focus', 'first', 'last', 'odd', 'even', 'dark']
  const stateUtilities: string[] = []

  for (const state of states) {
    for (let i = 0; i < 50; i++) {
      stateUtilities.push(`${state}:bg-blue-${i}`)
    }
  }

  bench('Headwind', () => {
    benchmarkHeadwind(stateUtilities)
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

// Duplicate handling benchmark
group('Duplicate Handling (6 classes × 1000 times)', () => {
  const duplicates = ['w-4', 'h-4', 'p-4', 'm-4', 'text-lg', 'bg-blue-500']
  const manyDuplicates: string[] = []
  for (let i = 0; i < 1000; i++) {
    manyDuplicates.push(...duplicates)
  }

  bench('Headwind', () => {
    benchmarkHeadwind(manyDuplicates)
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

console.log('\n🚀 Running Framework Comparison Benchmarks...\n')
console.log('Comparing: Headwind vs UnoCSS vs Tailwind CSS v3 vs Tailwind CSS v4\n')

await run({
  colors: true, // Use colors
})

console.log('\n✨ Benchmark completed!\n')
