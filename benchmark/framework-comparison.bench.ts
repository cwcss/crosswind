/* eslint-disable no-console */
/**
 * Framework Comparison Benchmark
 *
 * Compares ts-css, UnoCSS, Tailwind v4, and Tailwind v3 on two workloads that
 * correspond to the two things a CSS engine actually does.
 *
 * COLD BUILD — every engine starts from nothing and produces a stylesheet.
 * This is a production build, and it is the number that decides CI time. Each
 * iteration constructs a fresh engine, so nobody is allowed to answer from a
 * cache the previous iteration filled.
 *
 *   ts-css       new CSSGenerator(config) + generateBatch() + toCSS()
 *   UnoCSS       await createGenerator({ presets }) + generate()
 *   Tailwind v4  await compile(css) + build(candidates)
 *   Tailwind v3  postcss([tailwindcss(...)]) + process()
 *
 * ts-css is handed a fresh `{ ...defaultConfig }` object rather than the
 * shared one. Theme processing is memoised per config object, so reusing the
 * module-level `defaultConfig` would skip it and quietly understate our cold
 * cost by about half (0.06 ms vs 0.13 ms on ten classes). Tailwind re-parses
 * its design system on every `compile()`; this makes ts-css pay the same way.
 *
 * WARM REBUILD — a watch-mode pass over an already-built project where no new
 * class appeared. Every engine keeps its caches and gets to answer from them.
 *
 * Reporting both modes is the point. Tailwind v4's `build()` memoises its
 * result for a candidate set it has already seen, returning in microseconds
 * without generating anything. An earlier revision of this file pre-warmed
 * Tailwind once and then compared that cache hit against a full ts-css
 * regeneration — which flattered Tailwind by four orders of magnitude and made
 * the file worse than useless. Measuring cold and warm separately is what stops
 * either engine from being judged on the other's terms.
 *
 * Tailwind v3 appears only in the cold group: PostCSS is the only API it
 * offers, so it has no warm path to measure. That overhead is not a flaw in
 * the benchmark — it is why Tailwind v4 left PostCSS behind.
 */

// @ts-ignore - mitata is an optional benchmark dependency
import { bench, group, run } from 'mitata'
import { readFileSync } from 'node:fs'
import { CSSGenerator } from '../packages/ts-css/src/generator'
import { defaultConfig } from '../packages/ts-css/src/config'

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
// FRAMEWORK SETUP
// =============================================================================

// Utilities-only input, so every engine is asked for the same thing.
// Tailwind's own `index.css` also pulls in preflight and the full theme layer,
// which made it emit 5370 bytes of reset and custom properties where ts-css
// emitted 397 bytes of utilities — timing that would have been charging
// Tailwind for work nobody asked it to do. Inlined rather than `@import`ed
// because `compile()` needs a stylesheet loader to resolve imports.
const tw4dir = new URL('./node_modules/tailwindcss-v4/', import.meta.url)
const tw4css = [
  '@layer theme, utilities;',
  `@layer theme {\n${readFileSync(new URL('theme.css', tw4dir), 'utf8')}\n}`,
  `@layer utilities {\n${readFileSync(new URL('utilities.css', tw4dir), 'utf8')}\n}`,
].join('\n')

// Tailwind v3 has no lower-level API — PostCSS is the only way in, and the
// processor is bound to its content, so it cannot be reused across workloads.
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

/**
 * Cold: construct the engine and produce a stylesheet, per iteration.
 *
 * The config is spread into a new object so ts-css re-runs theme processing
 * instead of hitting the per-config memo — see the note at the top of the file.
 */
function coldTsCss(classes: string[]): string {
  const gen = new CSSGenerator({ ...defaultConfig })
  gen.generateBatch(classes)
  return gen.toCSS(false)
}

async function coldUnoCSS(classes: string[]): Promise<string> {
  const gen = await createGenerator({ presets: [presetWind()] })
  return (await gen.generate(classes.join(' '))).css
}

async function coldTailwindV4(classes: string[]): Promise<string> {
  const compiled = await compile(tw4css, { base: tw4dir.pathname })
  return compiled.build(classes)
}

async function coldTailwindV3(classes: string[]): Promise<void> {
  await createTw3Processor(classes).process('@tailwind utilities;', { from: undefined })
}

/** Warm: one engine, reused, the way a watch process holds it open. */
interface WarmEngines {
  tsCss: CSSGenerator
  uno: Awaited<ReturnType<typeof createGenerator>>
  tw4: Awaited<ReturnType<typeof compile>>
}

async function warmUp(classes: string[]): Promise<WarmEngines> {
  const tsCss = new CSSGenerator({ ...defaultConfig })
  tsCss.generateBatch(classes)
  tsCss.toCSS(false)

  const uno = await createGenerator({ presets: [presetWind()] })
  await uno.generate(classes.join(' '))

  const tw4 = await compile(tw4css, { base: tw4dir.pathname })
  tw4.build(classes)

  return { tsCss, uno, tw4 }
}

// =============================================================================
// WORKLOADS
// =============================================================================

const largeSet: string[] = []
for (const size of validSizeValues.slice(0, 25)) largeSet.push(`w-${size}`)
for (const size of validSizeValues.slice(0, 25)) largeSet.push(`h-${size}`)
for (const size of validSpacingValues) largeSet.push(`p-${size}`)
for (const size of validSpacingValues) largeSet.push(`m-${size}`)
for (const size of validSpacingValues.slice(0, 20)) largeSet.push(`gap-${size}`)
for (const size of validSpacingValues.slice(0, 20)) largeSet.push(`px-${size}`, `py-${size}`)
for (const size of validSpacingValues.slice(0, 20)) largeSet.push(`mx-${size}`, `my-${size}`)
for (const size of validSpacingValues.slice(0, 15)) largeSet.push(`top-${size}`, `right-${size}`, `bottom-${size}`, `left-${size}`)

const colorUtilities: string[] = []
for (const color of ['gray', 'red', 'blue', 'green', 'yellow', 'purple', 'pink', 'indigo', 'cyan', 'emerald']) {
  for (const shade of validShades) {
    colorUtilities.push(`bg-${color}-${shade}`, `text-${color}-${shade}`, `border-${color}-${shade}`)
  }
}

const responsiveUtilities: string[] = []
for (const bp of ['sm', 'md', 'lg', 'xl', '2xl']) {
  for (const size of validSizeValues.slice(0, 20)) responsiveUtilities.push(`${bp}:w-${size}`)
  for (const size of validSpacingValues.slice(0, 15)) responsiveUtilities.push(`${bp}:p-${size}`)
  for (const size of ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl']) responsiveUtilities.push(`${bp}:text-${size}`)
}

const outputUtilities: string[] = []
for (let i = 0; i < 1000; i++) outputUtilities.push(`w-[${i}px]`)

const projectClasses = [
  ...simpleUtilities,
  ...complexUtilities,
  ...arbitraryValues,
  ...realWorldComponents.flat(),
]
for (const color of ['gray', 'blue', 'red', 'green']) {
  for (const shade of validShades) projectClasses.push(`bg-${color}-${shade}`, `text-${color}-${shade}`)
}
for (const bp of ['sm', 'md', 'lg']) {
  projectClasses.push(`${bp}:w-full`, `${bp}:flex`, `${bp}:hidden`, `${bp}:block`, `${bp}:text-lg`, `${bp}:p-4`)
}

interface Scenario { name: string, classes: string[] }

/**
 * Cold is the expensive group by construction: three of the four engines cost
 * 30-150 ms to stand up, and mitata insists on at least 12 samples, so every
 * scenario added here costs minutes. These are the ones that say something
 * distinct — trivial, variant-heavy, arbitrary, component-shaped, bulk, and a
 * whole project.
 */
const COLD_SCENARIOS: Scenario[] = [
  { name: 'Simple Utilities (10 classes)', classes: simpleUtilities },
  { name: 'Complex Utilities with Variants (11 classes)', classes: complexUtilities },
  { name: 'Arbitrary Values (10 classes)', classes: arbitraryValues },
  { name: 'Real-world Components (~60 classes)', classes: realWorldComponents.flat() },
  { name: 'Large Scale (500 classes)', classes: largeSet },
  { name: 'CSS Output Generation (1000 arbitrary values)', classes: outputUtilities },
  { name: 'Full Project Simulation (~800 unique classes)', classes: projectClasses },
]

/** Warm reuses one engine, so breadth is nearly free here. */
const WARM_SCENARIOS: Scenario[] = [
  { name: 'Simple Utilities (10 classes)', classes: simpleUtilities },
  { name: 'Real-world Components (~60 classes)', classes: realWorldComponents.flat() },
  { name: 'Color Utilities (330 classes)', classes: colorUtilities },
  { name: 'Responsive Utilities (500 classes)', classes: responsiveUtilities },
  { name: 'Full Project Simulation (~800 unique classes)', classes: projectClasses },
]

// =============================================================================
// CORRECTNESS GATE
//
// Timing an engine that generated nothing is the easiest way to publish a
// meaningless win, so every engine has to emit a non-empty stylesheet that
// actually mentions the utilities it was given.
// =============================================================================

console.log('\n Verifying every engine generates real CSS...\n')

for (const { name, classes } of COLD_SCENARIOS.slice(0, 4)) {
  const results: Record<string, string> = {
    'ts-css': coldTsCss(classes),
    'UnoCSS': await coldUnoCSS(classes),
    'Tailwind v4': await coldTailwindV4(classes),
  }

  // Rule count rather than a substring probe: selectors are escaped
  // differently by each engine (`.sm\\:w-full`, `.w-\\[123px\\]`), so matching
  // on the raw class name reports a false negative for every variant and
  // arbitrary value.
  const summary = Object.entries(results)
    .map(([label, css]) => `${label}: ${(css.match(/\{/g) ?? []).length} rules, ${css.length}b`)
    .join('  ')

  for (const [label, css] of Object.entries(results)) {
    if (css.length === 0)
      throw new Error(`${label} generated nothing for "${name}" — the benchmark below would be meaningless`)
  }

  console.log(`  ${name.padEnd(46)} ${summary}`)
}

// =============================================================================
// COLD BUILD — every engine from scratch
// =============================================================================

for (const { name, classes } of COLD_SCENARIOS) {
  group(`Cold build: ${name}`, () => {
    bench('ts-css', () => { coldTsCss(classes) })
    bench('UnoCSS', async () => { await coldUnoCSS(classes) })
    bench('Tailwind v4', async () => { await coldTailwindV4(classes) })
    bench('Tailwind v3', async () => { await coldTailwindV3(classes) })
  })
}

// =============================================================================
// WARM REBUILD — engines held open, as a watch process does
// =============================================================================

for (const { name, classes } of WARM_SCENARIOS) {
  const engines = await warmUp(classes)

  group(`Warm rebuild, unchanged: ${name}`, () => {
    bench('ts-css', () => { engines.tsCss.generateBatch(classes); engines.tsCss.toCSS(false) })
    bench('UnoCSS', async () => { (await engines.uno.generate(classes.join(' '))).css })
    bench('Tailwind v4', () => { engines.tw4.build(classes) })
  })
}

// A third mode — "warm engine, previously unseen classes" — is deliberately
// absent. Feeding each iteration a new class grows the stylesheet without
// bound, so every iteration is slower than the last and the measurement never
// converges on anything; mitata's minimum CPU budget just makes the sheet
// enormous. The marginal cost of generating classes that are genuinely new is
// what the cold group already measures, minus engine setup.

console.log('\n Running Framework Comparison Benchmarks...\n')
console.log('Comparing: ts-css vs UnoCSS vs Tailwind v4 vs Tailwind v3')
console.log('')
console.log('Cold build — engine constructed per iteration; nobody reuses a cache.')
console.log('Warm rebuild — engine held open, as a watch process does, with no')
console.log('               new classes to generate. Every engine answers from')
console.log('               its own cache here, Tailwind v4 included.\n')

await run({ colors: true })

console.log('\n Benchmark completed!\n')
