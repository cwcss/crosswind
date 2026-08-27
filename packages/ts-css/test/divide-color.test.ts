import { describe, expect, it } from 'bun:test'
import { defaultConfig } from '../src/config'
import { CSSGenerator } from '../src/generator'

function css(cls: string): string {
  const gen = new CSSGenerator(defaultConfig)
  gen.generate(cls)
  return gen.toCSS(false)
}

describe('divide colors', () => {
  // Divide used to re-implement the shared color resolver inline and had
  // drifted: every arbitrary value generated no CSS at all, so a
  // `divide-y divide-[var(--line)]` pair silently fell back to the preflight
  // border color and a dark theme grew bright dividers.
  describe('arbitrary values', () => {
    it('supports an arbitrary hex', () => {
      expect(css('divide-[#262625]')).toContain('border-color: #262625;')
    })

    it('supports a CSS variable', () => {
      expect(css('divide-[var(--line)]')).toContain('border-color: var(--line);')
    })

    it('supports a function with underscore-encoded spaces', () => {
      expect(css('divide-[rgb(1_2_3)]')).toContain('border-color: rgb(1 2 3);')
    })

    it('supports an arbitrary hex with an opacity modifier', () => {
      // The parser leaves the brackets on when a modifier is present, so this
      // is the case the inline implementation could never reach.
      expect(css('divide-[#262625]/50')).toContain('border-color: rgb(38 38 37 / 0.5);')
    })

    it('supports a CSS variable with an arbitrary opacity modifier', () => {
      expect(css('divide-[var(--line)]/[0.4]')).toContain('color-mix(in srgb, var(--line) 40%, transparent)')
    })

    it('applies to the divide child selector, not the parent', () => {
      expect(css('divide-[#262625]')).toContain('> :not([hidden]) ~ :not([hidden])')
    })
  })

  describe('theme colors still resolve', () => {
    it('resolves a named shade', () => {
      expect(css('divide-red-500')).toContain('border-color: oklch(63.7% 0.237 25.331);')
    })

    it('resolves a named shade with opacity', () => {
      expect(css('divide-red-500/50')).toContain('/ 0.5)')
    })

    it('resolves currentColor', () => {
      expect(css('divide-current')).toContain('border-color: currentColor;')
    })

    it('resolves transparent', () => {
      expect(css('divide-transparent')).toContain('border-color: transparent;')
    })
  })

  describe('non-colors are left alone', () => {
    it('does not emit border-color for divide-auto', () => {
      // `auto` is valid for accent-color, which the shared resolver also
      // serves, but it is not a valid border-color.
      expect(css('divide-auto')).toBe('')
    })

    it('does not emit anything for an unknown color', () => {
      expect(css('divide-notacolor')).toBe('')
    })

    it('still emits widths, not colors, for divide-y-[3px]', () => {
      const out = css('divide-y-[3px]')
      expect(out).toContain('border-top-width')
      expect(out).not.toContain('border-color')
    })

    it('still emits styles for divide-dashed', () => {
      expect(css('divide-dashed')).toContain('border-style: dashed;')
    })
  })
})
