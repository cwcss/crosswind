import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'bun:test'
import { mkdir, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { build } from '../src/build'
import { defaultConfig } from '../src/config'
import { resetStyles } from '../src/style'
import { collectStyles } from '../src/style/collect'

const FIXTURE_DIR = join(import.meta.dir, '.style-fixtures')
const STYLE_MODULE = join(import.meta.dir, '..', 'src', 'style', 'index.ts')

describe('collectStyles', () => {
  beforeAll(async () => {
    await mkdir(join(FIXTURE_DIR, 'src'), { recursive: true })

    await writeFile(
      join(FIXTURE_DIR, 'src', 'card.styles.ts'),
      `import { css } from '${STYLE_MODULE}'

export const styles = css.create({
  card: { padding: 16, color: 'rebeccapurple' },
})
`,
    )

    await writeFile(
      join(FIXTURE_DIR, 'src', 'button.styles.ts'),
      `import { css } from '${STYLE_MODULE}'

export const styles = css.create({
  button: { borderRadius: 4, ':hover': { opacity: 0.8 } },
})
`,
    )

    // Not a style module — it must be ignored by the glob below.
    await writeFile(join(FIXTURE_DIR, 'src', 'index.ts'), 'export const noop = 1\n')
    await writeFile(join(FIXTURE_DIR, 'src', 'app.html'), '<div class="p-4 text-red-500"></div>')
  })

  afterAll(async () => {
    await rm(FIXTURE_DIR, { recursive: true, force: true })
  })

  beforeEach(() => {
    resetStyles()
  })

  it('evaluates matching modules and renders their CSS', async () => {
    const result = await collectStyles(['./src/**/*.styles.ts'], { cwd: FIXTURE_DIR })

    expect(result.modules).toHaveLength(2)
    expect(result.css).toContain('color: rebeccapurple')
    expect(result.css).toContain('border-radius: 4px')
    expect(result.css).toMatch(/\.tc[a-z0-9]+:hover \{ opacity: 0\.8 \}/)
  })

  it('evaluates modules in a stable order', async () => {
    const first = await collectStyles(['./src/**/*.styles.ts'], { cwd: FIXTURE_DIR })
    resetStyles()
    const second = await collectStyles(['./src/**/*.styles.ts'], { cwd: FIXTURE_DIR })
    expect(second.css).toBe(first.css)
  })

  it('reports patterns that matched nothing', async () => {
    const result = await collectStyles(
      ['./src/**/*.styles.ts', './nowhere/**/*.ts'],
      { cwd: FIXTURE_DIR },
    )
    expect(result.unmatchedPatterns).toEqual(['./nowhere/**/*.ts'])
  })

  it('minifies when asked', async () => {
    const result = await collectStyles(['./src/**/*.styles.ts'], {
      cwd: FIXTURE_DIR,
      minify: true,
    })
    expect(result.css).toContain('{padding:16px}')
  })

  it('appends style CSS to a utility build', async () => {
    const cwd = process.cwd()
    process.chdir(FIXTURE_DIR)
    try {
      const result = await build({
        ...defaultConfig,
        content: ['./src/**/*.html'],
        output: './out.css',
        minify: false,
        styles: ['./src/**/*.styles.ts'],
      })

      // Both engines contributed to one stylesheet.
      expect(result.css).toContain('.text-red-500')
      expect(result.css).toContain('color: rebeccapurple')
      expect(result.styleModules).toHaveLength(2)
    }
    finally {
      process.chdir(cwd)
    }
  })

  it('leaves the stylesheet untouched when no styles are configured', async () => {
    const cwd = process.cwd()
    process.chdir(FIXTURE_DIR)
    try {
      const result = await build({
        ...defaultConfig,
        content: ['./src/**/*.html'],
        output: './out.css',
        minify: false,
      })
      expect(result.styleModules).toBeUndefined()
      expect(result.css).not.toContain('rebeccapurple')
    }
    finally {
      process.chdir(cwd)
    }
  })
})
