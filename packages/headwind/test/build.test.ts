import { afterAll, beforeAll, describe, expect, it } from 'bun:test'
import { mkdir, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { build, buildAndWrite } from '../src/build'
import { defaultConfig } from '../src/config'

const TEST_DIR = join(import.meta.dir, '.build-test')

describe('build', () => {
  beforeAll(async () => {
    await mkdir(TEST_DIR, { recursive: true })

    await writeFile(
      join(TEST_DIR, 'test.html'),
      '<div class="flex p-4 m-2 bg-gray-500 text-white hover:bg-gray-600"></div>',
    )
  })

  afterAll(async () => {
    await rm(TEST_DIR, { recursive: true, force: true })
  })

  it('should build CSS from files', async () => {
    const config = {
      ...defaultConfig,
      content: [join(TEST_DIR, '*.html')],
      minify: false,
    }

    const result = await build(config)

    expect(result.css).toContain('.flex')
    expect(result.css).toContain('display: flex;')
    expect(result.css).toContain('.p-4')
    expect(result.css).toContain('padding: 1rem;')
    expect(result.css).toContain('.m-2')
    expect(result.css).toContain('margin: 0.5rem;')
    expect(result.css).toContain('.bg-gray-500')
    expect(result.css).toContain('background-color: #6b7280;')
    expect(result.css).toContain('.text-white')
    expect(result.css).toContain('color: #fff;')
    expect(result.classes.size).toBeGreaterThan(0)
    expect(result.duration).toBeGreaterThan(0)
  })

  it('should include hover variants', async () => {
    const config = {
      ...defaultConfig,
      content: [join(TEST_DIR, '*.html')],
      minify: false,
    }

    const result = await build(config)
    expect(result.css).toContain(':hover')
  })

  it('should minify CSS when enabled', async () => {
    const config = {
      ...defaultConfig,
      content: [join(TEST_DIR, '*.html')],
      minify: true,
    }

    const result = await build(config)
    expect(result.css).not.toContain('\n  ')
    expect(result.css).toContain('.flex{display:flex}')
  })

  it('should include safelist classes', async () => {
    const config = {
      ...defaultConfig,
      content: [join(TEST_DIR, '*.html')],
      safelist: ['container', 'hidden'],
      minify: false,
    }

    const result = await build(config)
    expect(result.css).toContain('.hidden')
    expect(result.classes.has('container')).toBe(true)
    expect(result.classes.has('hidden')).toBe(true)
  })

  it('should write CSS to file', async () => {
    const outputPath = join(TEST_DIR, 'output.css')
    const config = {
      ...defaultConfig,
      content: [join(TEST_DIR, '*.html')],
      output: outputPath,
      minify: false,
    }

    const result = await buildAndWrite(config)
    const file = Bun.file(outputPath)
    const content = await file.text()

    expect(content).toBe(result.css)
    expect(content).toContain('.flex')
  })
})
