import { describe, expect, it } from 'bun:test'
import { defaultConfig } from '../src/config'
import { CSSGenerator } from '../src/generator'

describe('web fonts (config.fonts)', () => {
  it('emits a Google Fonts @import as the very first rule', () => {
    const gen = new CSSGenerator({
      ...defaultConfig,
      fonts: { google: ['Inter:wght@400;600;700', 'JetBrains Mono:wght@400;700'] },
    })
    gen.generate('font-sans')
    const css = gen.toCSS(true)

    // @import must precede everything else in the stylesheet.
    expect(css.trimStart().startsWith('@import')).toBe(true)
    expect(css).toContain('https://fonts.googleapis.com/css2?')
    expect(css).toContain('family=Inter:wght@400;600;700')
    // Spaces in family names become '+'
    expect(css).toContain('family=JetBrains+Mono:wght@400;700')
    expect(css).toContain('&display=swap')
  })

  it('honours a custom font-display', () => {
    const gen = new CSSGenerator({
      ...defaultConfig,
      fonts: { google: ['Inter'], display: 'optional' },
    })
    expect(gen.toCSS(true)).toContain('&display=optional')
  })

  it('emits raw @font-face blocks for self-hosted fonts', () => {
    const face = `@font-face { font-family: 'Berkeley Mono'; src: url('/fonts/bm.woff2') format('woff2'); }`
    const gen = new CSSGenerator({ ...defaultConfig, fonts: { faces: [face] } })
    expect(gen.toCSS(true)).toContain("font-family: 'Berkeley Mono'")
  })

  it('emits nothing when no fonts are configured', () => {
    const gen = new CSSGenerator(defaultConfig)
    expect(gen.toCSS(true)).not.toContain('@import')
  })
})
