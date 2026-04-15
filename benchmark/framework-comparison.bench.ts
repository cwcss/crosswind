/* eslint-disable no-console */
/**
 * Fair Framework Comparison Benchmark
 *
 * Compares Crosswind, UnoCSS, Tailwind v4, and Tailwind v3.
 *
 * Methodology:
 * - Crosswind: new CSSGenerator() + generate() per class + toCSS()
 * - UnoCSS: createGenerator() pre-warmed + generate() with joined string
 * - Tailwind v4: compile() pre-warmed + build() with candidates array
 * - Tailwind v3: PostCSS processor pre-warmed + process() (no lower-level API available)
 *
 * Note: Tailwind v3 uses PostCSS which adds inherent overhead. This is not a flaw
 * in the benchmark — it's how the framework works. Tailwind v4 moved away from
 * PostCSS for exactly this reason.
 */

// @ts-ignore - mitata is an optional benchmark dependency
import { bench, group, run } from 'mitata'
import { readFileSync } from 'node:fs'
import { CSSGenerator } from '../packages/crosswind/src/generator'
import { defaultConfig } from '../packages/crosswind/src/config'

// UnoCSS setup
import { createGenerator } from '@unocss/core'
import presetWind from '@unocss/preset-wind'

// Tailwind v4 setup (uses compile + build API — no PostCSS)
// @ts-ignore
import { compile } from '@tailwindcss/node'

// Tailwind v3 setup (PostCSS-based — only available API)
import postcss from 'postcss'
// @ts-ignore
import tailwindcss from 'tailwindcss'

// =============================================================================
// INITIALIZE ALL FRAMEWORKS (pre-warm for fair comparison)
// =============================================================================

// UnoCSS: pre-warmed generator
const unoGen = await createGenerator({
  presets: [presetWind()],
})

// Tailwind v4: pre-compiled design system
const tw4css = readFileSync(
  new URL('./node_modules/tailwindcss-v4/index.css', import.meta.url),
  'utf8',
)
const tw4compiled = await compile(tw4css, { base: process.cwd() })

// Tailwind v3: pre-warmed PostCSS processor
// Note: v3 has no lower-level API — PostCSS is the only way to use it
function createTw3Processor(classes: string[]) {
  const html = `<div class="${classes.join(' ')}"></div>`
  return postcss([
    tailwindcss({
      content: [{ raw: html, extension: 'html' }],
      corePlugins: { preflight: false },
    }),
  ])
}

// =============================================================================
// VALID UTILITY CLASS SETS
// =============================================================================

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
  'top-[50%]', 'left-[calc(100%-2rem)]', 'grid-cols-[1fr_2fr_1fr]',
]

const realWorldComponents = [
  ['flex', 'items-center', 'justify-between', 'p-4', 'bg-white', 'dark:bg-gray-800', 'rounded-lg', 'shadow-md'],
  ['w-full', 'max-w-md', 'mx-auto', 'space-y-4', 'sm:space-y-6'],
  ['text-lg', 'font-semibold', 'text-gray-900', 'dark:text-white', 'tracking-tight'],
  ['grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-4', 'p-6'],
  ['px-4', 'py-2', 'bg-blue-500', 'hover:bg-blue-600', 'text-white', 'rounded-md', 'transition-colors', 'duration-200'],
  ['w-full', 'px-3', 'py-2', 'border', 'border-gray-300', 'rounded-md', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent'],
  ['flex', 'items-center', 'gap-2', 'px-4', 'py-2', 'text-gray-700', 'hover:text-gray-900', 'hover:bg-gray-100', 'rounded-lg'],
  ['inline-flex', 'items-center', 'px-2', 'py-1', 'text-xs', 'font-medium', 'bg-green-100', 'text-green-800', 'rounded-full'],
]

const validSpacingValues = [
  '0', 'px', '0.5', '1', '1.5', '2', '2.5', '3', '3.5', '4', '5', '6', '7', '8', '9', '10',
  '11', '12', '14', '16', '20', '24', '28', '32', '36', '40', '44', '48', '52', '56', '60',
  '64', '72', '80', '96',
]

const validSizeValues = [
  ...validSpacingValues,
  'auto', 'full', 'screen', 'min', 'max', 'fit',
  '1/2', '1/3', '2/3', '1/4', '2/4', '3/4',
]

const validShades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950']

// =============================================================================
// BENCHMARK HELPERS
// =============================================================================

// Pre-warmed Crosswind generator (same pattern as TW4's pre-compiled instance)
const cwGen = new CSSGenerator(defaultConfig)

function benchmarkCrosswind(classes: string[]): void {
  cwGen.reset()
  cwGen.generateBatch(classes)
}

function benchmarkCrosswindWithOutput(classes: string[]): string {
  cwGen.reset()
  cwGen.generateBatch(classes)
  return cwGen.toCSS(false)
}

async function benchmarkUnoCSS(classes: string[]): Promise<void> {
  await unoGen.generate(classes.join(' '))
}

function benchmarkTailwindV4(classes: string[]): void {
  tw4compiled.build(classes)
}

async function benchmarkTailwindV3(classes: string[]): Promise<void> {
  const processor = createTw3Processor(classes)
  await processor.process('@tailwind utilities;', { from: undefined })
}

// =============================================================================
// BENCHMARKS
// =============================================================================

// 1. Simple utilities
group('Simple Utilities (10 classes)', () => {
  bench('Crosswind', () => { benchmarkCrosswind(simpleUtilities) })
  bench('UnoCSS', async () => { await benchmarkUnoCSS(simpleUtilities) })
  bench('Tailwind v4', () => { benchmarkTailwindV4(simpleUtilities) })
  bench('Tailwind v3', async () => { await benchmarkTailwindV3(simpleUtilities) })
})

// 2. Complex utilities with variants
group('Complex Utilities with Variants (11 classes)', () => {
  bench('Crosswind', () => { benchmarkCrosswind(complexUtilities) })
  bench('UnoCSS', async () => { await benchmarkUnoCSS(complexUtilities) })
  bench('Tailwind v4', () => { benchmarkTailwindV4(complexUtilities) })
  bench('Tailwind v3', async () => { await benchmarkTailwindV3(complexUtilities) })
})

// 3. Arbitrary values
group('Arbitrary Values (10 classes)', () => {
  bench('Crosswind', () => { benchmarkCrosswind(arbitraryValues) })
  bench('UnoCSS', async () => { await benchmarkUnoCSS(arbitraryValues) })
  bench('Tailwind v4', () => { benchmarkTailwindV4(arbitraryValues) })
  bench('Tailwind v3', async () => { await benchmarkTailwindV3(arbitraryValues) })
})

// 4. Real-world components
group('Real-world Components (~60 classes)', () => {
  const allClasses = realWorldComponents.flat()

  bench('Crosswind', () => { benchmarkCrosswind(allClasses) })
  bench('UnoCSS', async () => { await unoGen.generate(allClasses.join(' ')) })
  bench('Tailwind v4', () => { benchmarkTailwindV4(allClasses) })
  bench('Tailwind v3', async () => { await benchmarkTailwindV3(allClasses) })
})

// 5. Large scale
group('Large Scale (500 classes)', () => {
  const largeSet: string[] = []
  for (const size of validSizeValues.slice(0, 25)) largeSet.push(`w-${size}`)
  for (const size of validSizeValues.slice(0, 25)) largeSet.push(`h-${size}`)
  for (const size of validSpacingValues) largeSet.push(`p-${size}`)
  for (const size of validSpacingValues) largeSet.push(`m-${size}`)
  for (const size of validSpacingValues.slice(0, 20)) largeSet.push(`gap-${size}`)
  for (const size of validSpacingValues.slice(0, 20)) largeSet.push(`px-${size}`, `py-${size}`)
  for (const size of validSpacingValues.slice(0, 20)) largeSet.push(`mx-${size}`, `my-${size}`)
  for (const size of validSpacingValues.slice(0, 15)) largeSet.push(`top-${size}`, `right-${size}`, `bottom-${size}`, `left-${size}`)

  bench('Crosswind', () => { benchmarkCrosswind(largeSet) })
  bench('UnoCSS', async () => { await benchmarkUnoCSS(largeSet) })
  bench('Tailwind v4', () => { benchmarkTailwindV4(largeSet) })
  bench('Tailwind v3', async () => { await benchmarkTailwindV3(largeSet) })
})

// 6. CSS output generation
group('CSS Output Generation (1000 arbitrary values)', () => {
  const utilities: string[] = []
  for (let i = 0; i < 1000; i++) utilities.push(`w-[${i}px]`)

  bench('Crosswind', () => { benchmarkCrosswindWithOutput(utilities) })
  bench('UnoCSS', async () => { const r = await unoGen.generate(utilities.join(' ')); r.css })
  bench('Tailwind v4', () => { benchmarkTailwindV4(utilities) })
  bench('Tailwind v3', async () => { await benchmarkTailwindV3(utilities) })
})

// 7. Color utilities
group('Color Utilities (330 classes)', () => {
  const colorUtilities: string[] = []
  const colors = ['gray', 'red', 'blue', 'green', 'yellow', 'purple', 'pink', 'indigo', 'cyan', 'emerald']
  for (const color of colors) {
    for (const shade of validShades) {
      colorUtilities.push(`bg-${color}-${shade}`, `text-${color}-${shade}`, `border-${color}-${shade}`)
    }
  }

  bench('Crosswind', () => { benchmarkCrosswind(colorUtilities) })
  bench('UnoCSS', async () => { await benchmarkUnoCSS(colorUtilities) })
  bench('Tailwind v4', () => { benchmarkTailwindV4(colorUtilities) })
  bench('Tailwind v3', async () => { await benchmarkTailwindV3(colorUtilities) })
})

// 8. Responsive utilities
group('Responsive Utilities (500 classes)', () => {
  const breakpoints = ['sm', 'md', 'lg', 'xl', '2xl']
  const responsiveUtilities: string[] = []
  for (const bp of breakpoints) {
    for (const size of validSizeValues.slice(0, 20)) responsiveUtilities.push(`${bp}:w-${size}`)
  }
  for (const bp of breakpoints) {
    for (const size of validSpacingValues.slice(0, 15)) responsiveUtilities.push(`${bp}:p-${size}`)
  }
  for (const bp of breakpoints) {
    for (const size of ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl']) {
      responsiveUtilities.push(`${bp}:text-${size}`)
    }
  }

  bench('Crosswind', () => { benchmarkCrosswind(responsiveUtilities) })
  bench('UnoCSS', async () => { await benchmarkUnoCSS(responsiveUtilities) })
  bench('Tailwind v4', () => { benchmarkTailwindV4(responsiveUtilities) })
  bench('Tailwind v3', async () => { await benchmarkTailwindV3(responsiveUtilities) })
})

// 9. Duplicate handling
group('Duplicate Handling (6 classes x 1000 = 6000)', () => {
  const duplicates = ['w-4', 'h-4', 'p-4', 'm-4', 'text-lg', 'bg-blue-500']
  const manyDuplicates: string[] = []
  for (let i = 0; i < 1000; i++) manyDuplicates.push(...duplicates)

  bench('Crosswind', () => { benchmarkCrosswind(manyDuplicates) })
  bench('UnoCSS', async () => { await benchmarkUnoCSS(manyDuplicates) })
  bench('Tailwind v4', () => { benchmarkTailwindV4(manyDuplicates) })
  bench('Tailwind v3', async () => { await benchmarkTailwindV3(manyDuplicates) })
})

// 10. Full project simulation
group('Full Project Simulation (~800 unique classes)', () => {
  const projectClasses = [
    ...simpleUtilities, ...complexUtilities, ...arbitraryValues,
    ...realWorldComponents.flat(),
  ]
  const colors = ['gray', 'blue', 'red', 'green']
  for (const color of colors) {
    for (const shade of validShades) {
      projectClasses.push(`bg-${color}-${shade}`, `text-${color}-${shade}`)
    }
  }
  for (const bp of ['sm', 'md', 'lg']) {
    projectClasses.push(`${bp}:w-full`, `${bp}:flex`, `${bp}:hidden`, `${bp}:block`, `${bp}:text-lg`, `${bp}:p-4`)
  }

  bench('Crosswind', () => { benchmarkCrosswindWithOutput(projectClasses) })
  bench('UnoCSS', async () => { const r = await unoGen.generate(projectClasses.join(' ')); r.css })
  bench('Tailwind v4', () => { benchmarkTailwindV4(projectClasses) })
  bench('Tailwind v3', async () => { await benchmarkTailwindV3(projectClasses) })
})

console.log('\n Running Framework Comparison Benchmarks...\n')
console.log('Comparing: Crosswind vs UnoCSS vs Tailwind v4 vs Tailwind v3')
console.log('')
console.log('Architecture notes:')
console.log('  Crosswind  — in-memory: new CSSGenerator() + generate() per class')
console.log('  UnoCSS     — in-memory: pre-warmed createGenerator() + generate()')
console.log('  Tailwind v4 — in-memory: pre-compiled compile() + build(candidates)')
console.log('  Tailwind v3 — PostCSS:  processor.process() (no lower-level API)\n')

await run({
  colors: true,
})

console.log('\n Benchmark completed!\n')
console.log('Note: Tailwind v3 numbers include PostCSS overhead because that\'s')
console.log('the only API available. Tailwind v4 uses the new compile/build API')
console.log('which is a direct in-memory operation like Crosswind and UnoCSS.\n')
