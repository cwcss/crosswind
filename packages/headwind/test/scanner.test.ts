import { afterAll, beforeAll, describe, expect, it } from 'bun:test'
import { Scanner } from '../src/scanner'
import { mkdir, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

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
