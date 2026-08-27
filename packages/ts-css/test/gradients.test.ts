import { describe, expect, it } from 'bun:test'
import { defaultConfig } from '../src/config'
import { CSSGenerator } from '../src/generator'

describe('Gradient Utilities', () => {
  describe('Radial gradients', () => {
    it('should generate bg-radial', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('bg-radial')
      const css = gen.toCSS(false)
      expect(css).toContain('background-image: radial-gradient(var(--tc-gradient-stops))')
    })

    it('should generate bg-radial-at-t', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('bg-radial-at-t')
      const css = gen.toCSS(false)
      expect(css).toContain('radial-gradient(at top')
    })

    it('should generate bg-radial-at-br', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('bg-radial-at-br')
      const css = gen.toCSS(false)
      expect(css).toContain('radial-gradient(at bottom right')
    })

    it('should generate bg-radial-at-c', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('bg-radial-at-c')
      const css = gen.toCSS(false)
      expect(css).toContain('radial-gradient(at center')
    })

    it('should work with gradient stops', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('bg-radial')
      gen.generate('from-blue-500')
      gen.generate('to-purple-500')
      const css = gen.toCSS(false)
      expect(css).toContain('radial-gradient')
      expect(css).toContain('--tc-gradient-from')
    })
  })

  describe('Conic gradients', () => {
    it('should generate bg-conic', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('bg-conic')
      const css = gen.toCSS(false)
      expect(css).toContain('background-image: conic-gradient(var(--tc-gradient-stops))')
    })

    it('should generate bg-conic-from-t', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('bg-conic-from-t')
      const css = gen.toCSS(false)
      expect(css).toContain('conic-gradient(from 0deg')
    })

    it('should generate bg-conic-from-r', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('bg-conic-from-r')
      const css = gen.toCSS(false)
      expect(css).toContain('conic-gradient(from 90deg')
    })

    it('should generate bg-conic-from-b', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('bg-conic-from-b')
      const css = gen.toCSS(false)
      expect(css).toContain('conic-gradient(from 180deg')
    })

    it('should generate bg-conic-from-l', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('bg-conic-from-l')
      const css = gen.toCSS(false)
      expect(css).toContain('conic-gradient(from 270deg')
    })
  })

  // Regression: gradient color stops (`from-*`, `via-*`, `to-*`) now accept
  // the `/alpha` opacity modifier. Previously the parser's opacity-modifier
  // whitelist excluded `from/via/to`, so `from-red-500/50` fell through to
  // generic parsing and produced no CSS at all — every Tailwind-style
  // translucent gradient was silently broken.
  describe('Gradient stops with opacity modifier (regression)', () => {
    it('from-<color>/<alpha> emits --tc-gradient-from with alpha', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('from-red-500/50')
      const css = gen.toCSS(false)
      expect(css).toContain('--tc-gradient-from:')
      expect(css).toContain('/ 0.5')
    })

    it('via-<color>/<alpha> lands in the gradient-stops stack', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('via-purple-500/75')
      const css = gen.toCSS(false)
      expect(css).toContain('--tc-gradient-stops:')
      expect(css).toContain('/ 0.75')
    })

    it('to-<color>/<alpha> applies alpha to the final stop', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('to-blue-500/25')
      const css = gen.toCSS(false)
      expect(css).toContain('--tc-gradient-to:')
      expect(css).toContain('/ 0.25')
    })

    it('arbitrary-hex color strips brackets and applies alpha (rgb fallback)', () => {
      // `[#FF3E54]/60` arrives with brackets still attached because it
      // went through the opacity-modifier branch (not the arbitrary-value
      // branch). The gradient rule now strips brackets before alpha
      // handling, converts the hex to rgb(), and injects the alpha at 60%.
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('from-[#FF3E54]/60')
      const css = gen.toCSS(false)
      expect(css).toContain('--tc-gradient-from:')
      expect(css).toContain('rgb(255 62 84 / 0.6)')
      expect(css).not.toContain('[#FF3E54]')
    })

    it('solid gradient stop (no alpha) still works after the change', () => {
      // Guardrail — the regression fix must not break the simple form.
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('from-red-500')
      expect(gen.toCSS(false)).toContain('--tc-gradient-from: oklch(')
    })
  })
})

describe('bg-linear (Tailwind v4 naming)', () => {
  function css(...classNames: string[]): string {
    const gen = new CSSGenerator(defaultConfig)
    for (const className of classNames) gen.generate(className)
    return gen.toCSS(false)
  }

  it('accepts the v4 bg-linear-to-* spelling alongside bg-gradient-to-*', () => {
    for (const [suffix, direction] of [
      ['t', 'to top'],
      ['tr', 'to top right'],
      ['r', 'to right'],
      ['br', 'to bottom right'],
      ['b', 'to bottom'],
      ['bl', 'to bottom left'],
      ['l', 'to left'],
      ['tl', 'to top left'],
    ] as const) {
      const expected = `linear-gradient(${direction}, var(--tc-gradient-stops))`
      expect(css(`bg-linear-to-${suffix}`)).toContain(expected)
      expect(css(`bg-gradient-to-${suffix}`)).toContain(expected)
    }
  })

  it('supports angles, including negative and arbitrary ones', () => {
    expect(css('bg-linear-45')).toContain('linear-gradient(45deg, var(--tc-gradient-stops))')
    expect(css('-bg-linear-45')).toContain('linear-gradient(-45deg, var(--tc-gradient-stops))')
    expect(css('bg-linear-[0.25turn]')).toContain('linear-gradient(0.25turn, var(--tc-gradient-stops))')
  })

  it('composes with the gradient stop utilities', () => {
    const out = css('bg-linear-to-r', 'from-blue-500', 'to-green-500')
    expect(out).toContain('linear-gradient(to right, var(--tc-gradient-stops))')
    expect(out).toContain('--tc-gradient-from:')
    expect(out).toContain('--tc-gradient-to:')
  })

  it('rejects unknown directions and leaves other bg-* utilities alone', () => {
    expect(css('bg-linear-foo')).toBe('')
    expect(css('bg-linear-to-x')).toBe('')
    expect(css('bg-cover')).toContain('background-size: cover;')
    expect(css('bg-red-500')).toContain('background-color:')
  })

  it('works under variants', () => {
    const out = css('md:bg-linear-to-r')
    expect(out).toContain('@media (min-width: 768px)')
    expect(out).toContain('linear-gradient(to right, var(--tc-gradient-stops))')
  })
})
