import { afterAll, beforeAll, describe, expect, it } from 'bun:test'
import { mkdir, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { Scanner } from '../src/scanner'

const TEST_DIR = join(import.meta.dir, '.scanner-test')

describe('Scanner', () => {
  beforeAll(async () => {
    // Create test directory and files
    await mkdir(TEST_DIR, { recursive: true })

    await writeFile(
      join(TEST_DIR, 'test1.html'),
      '<div class="flex p-4 bg-blue-500"></div>',
    )

    await writeFile(
      join(TEST_DIR, 'test2.tsx'),
      'export const Button = () => <button className="px-4 py-2 rounded">Click</button>',
    )

    await writeFile(
      join(TEST_DIR, 'test3.jsx'),
      // eslint-disable-next-line no-template-curly-in-string
      '<div className={`text-center ${active ? "font-bold" : ""}`}>Text</div>',
    )
  })

  afterAll(async () => {
    // Clean up test directory
    await rm(TEST_DIR, { recursive: true, force: true })
  })

  describe('scanContent', () => {
    it('should scan content string for classes', () => {
      const scanner = new Scanner([])
      const classes = scanner.scanContent('<div class="flex p-4"></div>')
      expect(classes).toEqual(new Set(['flex', 'p-4']))
    })
  })

  describe('scanFile', () => {
    it('should scan a single file', async () => {
      const scanner = new Scanner([])
      const classes = await scanner.scanFile(join(TEST_DIR, 'test1.html'))
      expect(classes).toEqual(new Set(['flex', 'p-4', 'bg-blue-500']))
    })

    it('should return empty set for non-existent file', async () => {
      const scanner = new Scanner([])
      const classes = await scanner.scanFile(join(TEST_DIR, 'non-existent.html'))
      expect(classes.size).toBe(0)
    })
  })

  describe('scan', () => {
    it('should scan all files matching pattern', async () => {
      const scanner = new Scanner([join(TEST_DIR, '*.html')])
      const { classes } = await scanner.scan()
      expect(classes.has('flex')).toBe(true)
      expect(classes.has('p-4')).toBe(true)
      expect(classes.has('bg-blue-500')).toBe(true)
    })

    it('should scan multiple patterns', async () => {
      const scanner = new Scanner([
        join(TEST_DIR, '*.html'),
        join(TEST_DIR, '*.tsx'),
      ])
      const { classes } = await scanner.scan()
      expect(classes.has('flex')).toBe(true)
      expect(classes.has('px-4')).toBe(true)
      expect(classes.has('py-2')).toBe(true)
      expect(classes.has('rounded')).toBe(true)
    })

    it('should handle JSX files', async () => {
      const scanner = new Scanner([join(TEST_DIR, '*.jsx')])
      const { classes } = await scanner.scan()
      expect(classes.has('text-center')).toBe(true)
      expect(classes.has('font-bold')).toBe(true)
    })

    it('should scan all file types with glob pattern', async () => {
      const scanner = new Scanner([join(TEST_DIR, '*.{html,tsx,jsx}')])
      const { classes } = await scanner.scan()
      expect(classes.size).toBeGreaterThan(5)
      expect(classes.has('flex')).toBe(true)
      expect(classes.has('px-4')).toBe(true)
      expect(classes.has('text-center')).toBe(true)
    })
  })
})

describe('Scanner concurrency', () => {
  const CONCURRENCY_DIR = join(import.meta.dir, '.scanner-concurrency')

  beforeAll(async () => {
    await mkdir(CONCURRENCY_DIR, { recursive: true })
  })

  afterAll(async () => {
    await rm(CONCURRENCY_DIR, { recursive: true, force: true })
  })

  it('reads many files without dropping any classes', async () => {
    // More files than the read pool is wide, so the pool has to cycle workers.
    const count = 120
    await Promise.all(
      Array.from({ length: count }, (_, i) =>
        writeFile(join(CONCURRENCY_DIR, `file-${i}.html`), `<div class="p-${i}"></div>`)),
    )
    const scanner = new Scanner([join(CONCURRENCY_DIR, '*.html')])
    const { classes } = await scanner.scan()
    for (let i = 0; i < count; i++) {
      expect(classes.has(`p-${i}`)).toBe(true)
    }
  })

  it('reports unmatched patterns in config order', async () => {
    await writeFile(join(CONCURRENCY_DIR, 'only.html'), '<div class="flex"></div>')
    const scanner = new Scanner([
      join(CONCURRENCY_DIR, 'nope-a', '*.html'),
      join(CONCURRENCY_DIR, 'only.*'),
      join(CONCURRENCY_DIR, 'nope-b', '*.html'),
    ])
    const { unmatchedPatterns } = await scanner.scan()
    expect(unmatchedPatterns).toEqual([
      join(CONCURRENCY_DIR, 'nope-a', '*.html'),
      join(CONCURRENCY_DIR, 'nope-b', '*.html'),
    ])
  })

  it('deduplicates files matched by overlapping patterns', async () => {
    await writeFile(join(CONCURRENCY_DIR, 'shared.html'), '<div class="gap-7"></div>')
    const scanner = new Scanner([
      join(CONCURRENCY_DIR, '*.html'),
      join(CONCURRENCY_DIR, 'shared.*'),
    ])
    const { classes, unmatchedPatterns } = await scanner.scan()
    expect(classes.has('gap-7')).toBe(true)
    expect(unmatchedPatterns).toEqual([])
  })

  it('treats a pattern rooted at a missing directory as unmatched, not fatal', async () => {
    // Bun's glob throws ENOENT here; that used to abort the whole build.
    const missing = join(CONCURRENCY_DIR, 'does-not-exist', '**', '*.html')
    const scanner = new Scanner([missing, join(CONCURRENCY_DIR, '*.html')])
    const { classes, unmatchedPatterns } = await scanner.scan()
    expect(unmatchedPatterns).toEqual([missing])
    expect(classes.size).toBeGreaterThan(0)
  })
})
