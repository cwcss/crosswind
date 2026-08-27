import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'bun:test'
import { mkdir, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { resetStyles } from '../src/style'
import { stylePlugin } from '../src/style/plugin'

const FIXTURE_DIR = join(import.meta.dir, '.style-plugin-fixtures')
const STYLE_MODULE = join(import.meta.dir, '..', 'src', 'style', 'index.ts')

describe('stylePlugin', () => {
  beforeAll(async () => {
    await mkdir(join(FIXTURE_DIR, 'src'), { recursive: true })

    await writeFile(
      join(FIXTURE_DIR, 'src', 'button.ts'),
      `import { css } from '${STYLE_MODULE}'

export const styles = css.create({
  button: { paddingInline: 12, backgroundColor: 'teal' },
})
`,
    )

    await writeFile(
      join(FIXTURE_DIR, 'src', 'plain.ts'),
      `export const unrelated = 'no styles here'\n`,
    )

    await writeFile(
      join(FIXTURE_DIR, 'src', 'index.ts'),
      `import { styles } from './button'\nimport { unrelated } from './plain'\n\nexport { styles, unrelated }\n`,
    )
  })

  afterAll(async () => {
    await rm(FIXTURE_DIR, { recursive: true, force: true })
  })

  beforeEach(() => {
    resetStyles()
  })

  async function bundle(output?: string): Promise<{ css: string, success: boolean }> {
    let captured = ''
    const result = await Bun.build({
      entrypoints: [join(FIXTURE_DIR, 'src', 'index.ts')],
      outdir: join(FIXTURE_DIR, 'dist'),
      target: 'bun',
      plugins: [stylePlugin({
        // Point the detector at the source module the fixtures import, rather
        // than the published 'ts-css' specifier.
        styleModules: [STYLE_MODULE],
        output,
        onCSS: css => void (captured = css),
      })],
    })
    return { css: captured, success: result.success }
  }

  it('collects styles from modules the bundler loads', async () => {
    const { css, success } = await bundle()
    expect(success).toBe(true)
    expect(css).toContain('padding-inline: 12px')
    expect(css).toContain('background-color: teal')
  })

  it('writes the stylesheet to the configured output', async () => {
    const output = join(FIXTURE_DIR, 'dist', 'styles.css')
    await rm(output, { force: true })

    const { success } = await bundle(output)
    expect(success).toBe(true)
    expect(await Bun.file(output).text()).toContain('background-color: teal')
  })

  it('leaves the bundled source unchanged', async () => {
    await bundle()
    const bundled = await Bun.file(join(FIXTURE_DIR, 'dist', 'index.js')).text()
    expect(bundled).toContain('no styles here')
  })
})
