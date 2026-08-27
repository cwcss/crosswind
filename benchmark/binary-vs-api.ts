#!/usr/bin/env bun
/**
 * Crosswind: Compiled Binary vs JS/TS API Benchmark
 *
 * Compares two execution modes:
 * 1. JS/TS API — import and call CSSGenerator directly from TypeScript
 * 2. Compiled Binary — run the `crosswind build` CLI binary (bun --compile)
 *
 * This measures real-world end-to-end performance including:
 * - File I/O (reading HTML, writing CSS)
 * - Class extraction from HTML content
 * - CSS generation
 * - CSS output/serialization
 */

import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { CSSGenerator } from '../packages/ts-css/src/generator'
import { defaultConfig } from '../packages/ts-css/src/config'
import { extractClasses } from '../packages/ts-css/src/parser'

const BINARY = new URL('../packages/ts-css/bin/crosswind', import.meta.url).pathname
const FIXTURES_DIR = new URL('./fixtures', import.meta.url).pathname

const fixtures = [
  { name: 'Small page (4 lines, ~20 classes)', file: 'small.html' },
  { name: 'Medium page (100 lines, ~200 classes)', file: 'medium.html' },
  { name: 'Large page (500 lines, ~1000 classes)', file: 'large.html' },
]

function cleanup(path: string) {
  if (existsSync(path)) unlinkSync(path)
}

console.log('='.repeat(70))
console.log('Crosswind: Compiled Binary vs JS/TS API Benchmark')
console.log('='.repeat(70))
console.log(`Binary: ${BINARY}`)
console.log(`Runtime: Bun ${Bun.version}`)
console.log('')

// ============================================================================
// BENCHMARK 1: JS/TS API (in-process)
// ============================================================================

console.log('--- JS/TS API (in-process, no file I/O for generation) ---')
console.log('')

for (const fixture of fixtures) {
  const html = readFileSync(`${FIXTURES_DIR}/${fixture.file}`, 'utf8')
  const classes = extractClasses(html)
  const classArray = Array.from(classes)

  // Warm up
  const warmGen = new CSSGenerator(defaultConfig)
  warmGen.generateBatch(classArray)
  warmGen.toCSS(false)

  // Benchmark: fresh generator per run (cold)
  const coldRuns = 100
  const coldStart = performance.now()
  for (let i = 0; i < coldRuns; i++) {
    const gen = new CSSGenerator(defaultConfig)
    gen.generateBatch(classArray)
    gen.toCSS(false)
  }
  const coldAvg = (performance.now() - coldStart) / coldRuns

  // Benchmark: reuse generator (warm)
  const warmRuns = 1000
  const gen = new CSSGenerator(defaultConfig)
  const warmStart = performance.now()
  for (let i = 0; i < warmRuns; i++) {
    gen.reset()
    gen.generateBatch(classArray)
    gen.toCSS(false)
  }
  const warmAvg = (performance.now() - warmStart) / warmRuns

  console.log(`  ${fixture.name}`)
  console.log(`    Classes: ${classArray.length} unique`)
  console.log(`    Cold (new CSSGenerator each):  ${coldAvg.toFixed(3)} ms`)
  console.log(`    Warm (reset + generate):       ${warmAvg.toFixed(3)} ms`)
  console.log('')
}

// ============================================================================
// BENCHMARK 2: Compiled Binary (subprocess)
// ============================================================================

console.log('--- Compiled Binary (subprocess, full E2E with file I/O) ---')
console.log('')

for (const fixture of fixtures) {
  const inputPath = `${FIXTURES_DIR}/${fixture.file}`
  const outputPath = `${FIXTURES_DIR}/_bench_output.css`
  cleanup(outputPath)

  // Write a temp crosswind config
  const configPath = `${FIXTURES_DIR}/_bench_config.ts`
  writeFileSync(configPath, `
export default {
  content: ['${inputPath}'],
  output: '${outputPath}',
  minify: false,
}
`)

  // Warm up the binary (first run may be slower due to OS caching)
  try {
    execSync(`${BINARY} build --config ${configPath} --no-preflight 2>/dev/null`, { stdio: 'pipe' })
  } catch { /* ignore */ }
  cleanup(outputPath)

  // Benchmark binary
  const runs = 10
  const times: number[] = []
  for (let i = 0; i < runs; i++) {
    cleanup(outputPath)
    const start = performance.now()
    try {
      execSync(`${BINARY} build --config ${configPath} --no-preflight 2>/dev/null`, { stdio: 'pipe' })
    } catch { /* ignore errors */ }
    times.push(performance.now() - start)
  }

  const avg = times.reduce((a, b) => a + b, 0) / times.length
  const min = Math.min(...times)
  const max = Math.max(...times)

  // Check output
  const outputExists = existsSync(outputPath)
  const outputSize = outputExists ? readFileSync(outputPath).length : 0

  console.log(`  ${fixture.name}`)
  console.log(`    Avg: ${avg.toFixed(1)} ms  (min: ${min.toFixed(1)} ms, max: ${max.toFixed(1)} ms)`)
  console.log(`    Output: ${outputExists ? `${outputSize} bytes` : 'no output (build may have failed)'}`)
  console.log('')

  cleanup(outputPath)
  cleanup(configPath)
}

// ============================================================================
// BENCHMARK 3: JS/TS API Full E2E (including file read + class extraction)
// ============================================================================

console.log('--- JS/TS API Full E2E (file read + extract + generate + output) ---')
console.log('')

for (const fixture of fixtures) {
  const inputPath = `${FIXTURES_DIR}/${fixture.file}`

  const runs = 100
  const start = performance.now()
  let sink = 0
  for (let i = 0; i < runs; i++) {
    const html = readFileSync(inputPath, 'utf8')
    const classes = extractClasses(html)
    const gen = new CSSGenerator(defaultConfig)
    gen.generateBatch(Array.from(classes))
    const css = gen.toCSS(false)
    sink += css.length
  }
  const avg = (performance.now() - start) / runs

  console.log(`  ${fixture.name}`)
  console.log(`    Full E2E (read + extract + generate + toCSS): ${avg.toFixed(3)} ms`)
  console.log('')
}

console.log('='.repeat(70))
console.log('Summary')
console.log('='.repeat(70))
console.log('')
console.log('JS/TS API:       Best for embedded use (dev servers, plugins, SSR)')
console.log('                 Near-zero startup, sub-millisecond generation')
console.log('')
console.log('Compiled Binary: Best for CI/CD builds and CLI usage')
console.log('                 Includes process startup + file I/O overhead')
console.log('')
