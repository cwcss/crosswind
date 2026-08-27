import { afterAll, beforeAll, describe, expect, it } from 'bun:test'
import { mkdir, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { defaultConfig } from '../src/config'
import { CSSGenerator } from '../src/generator'

// Bun isolated installs store packages under
// node_modules/.bun/<pkg>+<name>@<version>/node_modules/<pkg>/<name>.
// The icon loader claimed to walk this layout but never did, so i-* icons
// silently emitted nothing under isolated installs.
const TEST_DIR = join(import.meta.dir, '.icons-bun-store-test')
const STORE = join(TEST_DIR, 'node_modules', '.bun', '@iconify-json+testset@1.0.0', 'node_modules', '@iconify-json', 'testset')

describe('iconify collection loading from the Bun store', () => {
  let prevCwd: string

  beforeAll(async () => {
    prevCwd = process.cwd()
    await mkdir(STORE, { recursive: true })
    await writeFile(join(STORE, 'icons.json'), JSON.stringify({
      prefix: 'testset',
      icons: { star: { body: '<path d="M0 0h16v16z"/>' } },
      width: 16,
      height: 16,
    }))
    process.chdir(TEST_DIR)
  })

  afterAll(async () => {
    process.chdir(prevCwd)
    await rm(TEST_DIR, { recursive: true, force: true })
  })

  it('resolves collections from the isolated-install store', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('i-testset-star')
    const out = gen.toCSS(false)
    expect(out).toContain('.i-testset-star')
    expect(out).toContain('mask')
  })
})
