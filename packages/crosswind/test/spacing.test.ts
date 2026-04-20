import { describe, expect, it } from 'bun:test'
import { defaultConfig } from '../src/config'
import { CSSGenerator } from '../src/generator'
import { parseClass } from '../src/parser'

describe('Spacing Utilities', () => {
  describe('Padding', () => {
    it('should generate p-4', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('p-4')
      expect(gen.toCSS(false)).toContain('padding: 1rem;')
    })

    it('should generate px-4', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('px-4')
      const css = gen.toCSS(false)
      expect(css).toContain('padding-left: 1rem;')
      expect(css).toContain('padding-right: 1rem;')
    })

    it('should generate py-2', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('py-2')
      const css = gen.toCSS(false)
      expect(css).toContain('padding-top: 0.5rem;')
      expect(css).toContain('padding-bottom: 0.5rem;')
    })

    it('should generate pt-4', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('pt-4')
      expect(gen.toCSS(false)).toContain('padding-top: 1rem;')
    })

    it('should generate pr-8', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('pr-8')
      expect(gen.toCSS(false)).toContain('padding-right: 2rem;')
    })

    it('should generate pb-0', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('pb-0')
      expect(gen.toCSS(false)).toContain('padding-bottom: 0;')
    })

    it('should generate pl-1', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('pl-1')
      expect(gen.toCSS(false)).toContain('padding-left: 0.25rem;')
    })
  })

  describe('Margin', () => {
    it('should generate m-4', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('m-4')
      expect(gen.toCSS(false)).toContain('margin: 1rem;')
    })

    it('should generate mx-auto', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('mx-auto')
      const css = gen.toCSS(false)
      expect(css).toContain('margin-left: auto;')
      expect(css).toContain('margin-right: auto;')
    })

    it('should generate my-4', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('my-4')
      const css = gen.toCSS(false)
      expect(css).toContain('margin-top: 1rem;')
      expect(css).toContain('margin-bottom: 1rem;')
    })

    it('should generate mt-8', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('mt-8')
      expect(gen.toCSS(false)).toContain('margin-top: 2rem;')
    })

    it('should generate mr-2', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('mr-2')
      expect(gen.toCSS(false)).toContain('margin-right: 0.5rem;')
    })

    it('should generate mb-0', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('mb-0')
      expect(gen.toCSS(false)).toContain('margin-bottom: 0;')
    })

    it('should generate ml-1', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('ml-1')
      expect(gen.toCSS(false)).toContain('margin-left: 0.25rem;')
    })
  })

  describe('Negative margins', () => {
    it('should parse negative margin', () => {
      const result = parseClass('-m-4')
      expect(result).toEqual({
        raw: '-m-4',
        variants: [],
        utility: 'm',
        value: '-4',
        important: false,
        arbitrary: false,
      })
    })

    it('should generate negative margin CSS', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('-m-4')
      expect(gen.toCSS(false)).toContain('margin: -1rem;')
    })

    it('should generate negative margin-top', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('-mt-2')
      expect(gen.toCSS(false)).toContain('margin-top: -0.5rem;')
    })

    it('should generate negative margin-left', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('-ml-8')
      expect(gen.toCSS(false)).toContain('margin-left: -2rem;')
    })

    it('should handle very large negative margin', () => {
      // Tailwind v4 scaling behavior — any numeric token (even off-scale)
      // resolves to `<n> * 0.25rem`. Pre-fix behavior emitted the raw
      // number verbatim (`margin: -999;`), which browsers reject as
      // invalid. Now we emit a valid length: 999 * 0.25 = 249.75rem.
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('-m-999')
      expect(gen.toCSS(false)).toContain('margin: -249.75rem;')
    })

    it('should handle negative arbitrary values', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('-m-[100px]')
      const css = gen.toCSS(false)
      expect(css).toBeDefined()
    })
  })

  describe('Arbitrary spacing values', () => {
    it('should support arbitrary padding', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('p-[2.5rem]')
      expect(gen.toCSS(false)).toContain('padding: 2.5rem;')
    })

    it('should support arbitrary margin', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('m-[15px]')
      expect(gen.toCSS(false)).toContain('margin: 15px;')
    })
  })

  // Regression: negative arbitrary values. `-mt-[20px]`, `-translate-x-[50%]`,
  // etc. Previously the preArbitraryMatch regex only matched utilities that
  // started with a letter, so the dash-prefixed variants fell through to
  // the name-based negative-handling code — which then couldn't unwrap the
  // brackets. Result: utility=`-mt`, no rule matched, zero CSS emitted. The
  // fix peels the leading dash off the utility during parse and prefixes
  // the value with `-`, so the existing rule code sees `utility: mt,
  // value: -20px`.
  describe('Negative arbitrary spacing (regression)', () => {
    it('-mt-[20px] emits negative margin-top', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('-mt-[20px]')
      expect(gen.toCSS(false)).toContain('margin-top: -20px;')
    })

    it('-mt-[1.5rem] handles rem units', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('-mt-[1.5rem]')
      expect(gen.toCSS(false)).toContain('margin-top: -1.5rem;')
    })

    it('-mx-[10px] covers left + right with negative', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('-mx-[10px]')
      const css = gen.toCSS(false)
      expect(css).toContain('margin-left: -10px;')
      expect(css).toContain('margin-right: -10px;')
    })

    it('-translate-x-[50%] generates negative translate', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('-translate-x-[50%]')
      expect(gen.toCSS(false)).toContain('translateX(-50%)')
    })

    it('-top-[5rem] emits negative position offset', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('-top-[5rem]')
      expect(gen.toCSS(false)).toContain('top: -5rem;')
    })

    it('-z-[5] emits negative z-index', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('-z-[5]')
      expect(gen.toCSS(false)).toContain('z-index: -5;')
    })

    it('hover:-mt-[20px] works through variants', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('hover:-mt-[20px]')
      const css = gen.toCSS(false)
      expect(css).toContain(':hover')
      expect(css).toContain('margin-top: -20px;')
    })
  })

  // Regression: decimal / off-scale numeric tokens. The Tailwind v3 spacing
  // table is fixed (`0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, ...`), so
  // `p-4.5` falls off the table. Previously crosswind emitted the raw
  // number as the CSS value (`padding: 4.5;` — invalid CSS, silently
  // dropped by browsers). Tailwind v4's scaling behavior handles this by
  // multiplying by `0.25rem`, and we now mirror that so drivly-style
  // `px-4.5`, `mt-9.5`, etc. produce correct CSS lengths.
  describe('Off-scale decimal spacing (Tailwind v4 scaling, regression)', () => {
    it('p-4.5 emits 1.125rem (4.5 × 0.25rem)', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('p-4.5')
      expect(gen.toCSS(false)).toContain('padding: 1.125rem;')
      // Pre-fix output was `padding: 4.5;` — guard against it
      expect(gen.toCSS(false)).not.toMatch(/padding:\s*4\.5;/)
    })

    it('px-4.5 applies to both horizontal sides', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('px-4.5')
      const css = gen.toCSS(false)
      expect(css).toContain('padding-left: 1.125rem;')
      expect(css).toContain('padding-right: 1.125rem;')
    })

    it('mt-9.5 scales to 2.375rem', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('mt-9.5')
      expect(gen.toCSS(false)).toContain('margin-top: 2.375rem;')
    })

    it('gap-4.5 uses the same resolver (rule lives in rules-grid)', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('gap-4.5')
      expect(gen.toCSS(false)).toContain('gap: 1.125rem;')
      expect(gen.toCSS(false)).not.toMatch(/gap:\s*4\.5;/)
    })

    it('gap-x-4.5 / gap-y-4.5 resolve column/row gap', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('gap-x-4.5')
      gen.generate('gap-y-4.5')
      const css = gen.toCSS(false)
      expect(css).toContain('column-gap: 1.125rem;')
      expect(css).toContain('row-gap: 1.125rem;')
    })

    it('integer tokens off the scale still scale (p-13 → 3.25rem)', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('p-13')
      expect(gen.toCSS(false)).toContain('padding: 3.25rem;')
    })

    it('negative off-scale tokens scale with sign flipped', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('-mt-4.5')
      expect(gen.toCSS(false)).toContain('margin-top: -1.125rem;')
    })

    it('keywords / arbitrary values are NOT accidentally scaled', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('p-px')          // p-px resolves from theme, not scaling
      gen.generate('p-[calc(1rem+5px)]')
      const css = gen.toCSS(false)
      expect(css).toContain('padding: 1px;')
      expect(css).toContain('padding: calc(1rem+5px);')
    })

    // Guardrail — the existing theme-scale lookups must keep winning.
    it('p-4 still resolves from the theme scale (1rem, not 1rem-via-scaling)', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('p-4')
      expect(gen.toCSS(false)).toContain('padding: 1rem;')
    })
  })
})

describe('Edge Cases', () => {
  describe('Zero and auto values', () => {
    it('should handle p-0', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('p-0')
      expect(gen.toCSS(false)).toContain('padding: 0;')
    })

    it('should handle m-auto', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('m-auto')
      expect(gen.toCSS(false)).toContain('margin: auto;')
    })

    it('should handle px-0 and py-0', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('px-0')
      gen.generate('py-0')
      const css = gen.toCSS(false)
      expect(css).toContain('padding-left: 0;')
      expect(css).toContain('padding-right: 0;')
      expect(css).toContain('padding-top: 0;')
      expect(css).toContain('padding-bottom: 0;')
    })
  })

  describe('Extreme values', () => {
    it('should handle very large padding', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('p-[500px]')
      expect(gen.toCSS(false)).toContain('padding: 500px;')
    })

    it('should handle very large negative margin', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('-m-[500px]')
      const css = gen.toCSS(false)
      expect(css).toBeDefined()
    })

    it('should handle padding with decimal values', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('p-[2.5rem]')
      expect(gen.toCSS(false)).toContain('padding: 2.5rem;')
    })

    it('should handle margin with decimal values', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('m-[1.25rem]')
      expect(gen.toCSS(false)).toContain('margin: 1.25rem;')
    })
  })

  describe('CSS functions', () => {
    it('should handle padding with calc()', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('p-[calc(100%-2rem)]')
      expect(gen.toCSS(false)).toContain('padding: calc(100%-2rem);')
    })

    it('should handle margin with calc()', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('m-[calc(50%+10px)]')
      expect(gen.toCSS(false)).toContain('margin: calc(50%+10px);')
    })

    it('should handle padding with CSS variables', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('p-[var(--spacing)]')
      expect(gen.toCSS(false)).toContain('padding: var(--spacing);')
    })

    it('should handle margin with CSS variables', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('m-[var(--margin-size)]')
      expect(gen.toCSS(false)).toContain('margin: var(--margin-size);')
    })
  })

  describe('Negative values comprehensive', () => {
    it('should handle negative px', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('-px-4')
      const css = gen.toCSS(false)
      expect(css).toContain('padding-left: -1rem;')
      expect(css).toContain('padding-right: -1rem;')
    })

    it('should handle negative py', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('-py-4')
      const css = gen.toCSS(false)
      expect(css).toContain('padding-top: -1rem;')
      expect(css).toContain('padding-bottom: -1rem;')
    })

    it('should handle negative mx', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('-mx-8')
      const css = gen.toCSS(false)
      expect(css).toContain('margin-left: -2rem;')
      expect(css).toContain('margin-right: -2rem;')
    })

    it('should handle negative my', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('-my-8')
      const css = gen.toCSS(false)
      expect(css).toContain('margin-top: -2rem;')
      expect(css).toContain('margin-bottom: -2rem;')
    })

    it('should handle -m-0 (negative zero)', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('-m-0')
      const css = gen.toCSS(false)
      expect(css).toContain('margin: 0;')
    })
  })

  describe('Percentage and viewport units', () => {
    it('should handle padding with percentage', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('p-[10%]')
      expect(gen.toCSS(false)).toContain('padding: 10%;')
    })

    it('should handle margin with vw', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('m-[5vw]')
      expect(gen.toCSS(false)).toContain('margin: 5vw;')
    })

    it('should handle padding with vh', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('p-[10vh]')
      expect(gen.toCSS(false)).toContain('padding: 10vh;')
    })
  })

  describe('With variants', () => {
    it('should handle spacing with important', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('!p-4')
      expect(gen.toCSS(false)).toContain('padding: 1rem !important;')
    })

    it('should handle negative margin with important', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('!-m-4')
      expect(gen.toCSS(false)).toContain('margin: -1rem !important;')
    })

    it('should handle spacing with hover', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('hover:p-8')
      const css = gen.toCSS(false)
      expect(css).toContain(':hover')
      expect(css).toContain('padding: 2rem;')
    })

    it('should handle spacing with responsive', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('md:p-6')
      const css = gen.toCSS(false)
      expect(css).toContain('@media (min-width: 768px)')
      expect(css).toContain('padding: 1.5rem;')
    })
  })

  describe('Individual side combinations', () => {
    it('should handle all four sides independently', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('pt-1')
      gen.generate('pr-2')
      gen.generate('pb-3')
      gen.generate('pl-4')
      const css = gen.toCSS(false)
      expect(css).toContain('padding-top: 0.25rem;')
      expect(css).toContain('padding-right: 0.5rem;')
      expect(css).toContain('padding-bottom: 0.75rem;')
      expect(css).toContain('padding-left: 1rem;')
    })

    it('should handle mixed negative margins', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('-mt-4')
      gen.generate('mr-4')
      gen.generate('-mb-4')
      gen.generate('ml-4')
      const css = gen.toCSS(false)
      expect(css).toContain('margin-top: -1rem;')
      expect(css).toContain('margin-right: 1rem;')
      expect(css).toContain('margin-bottom: -1rem;')
      expect(css).toContain('margin-left: 1rem;')
    })
  })

  describe('Edge cases', () => {
    it('should handle zero spacing', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('p-0')
      gen.generate('m-0')
      const css = gen.toCSS(false)
      expect(css).toContain('0')
    })

    it('should handle negative zero', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('-m-0')
      gen.generate('-p-0')
      const css = gen.toCSS(false)
      expect(css).toContain('margin')
    })

    it('should handle decimal spacing values', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('p-0.5')
      gen.generate('m-2.5')
      const css = gen.toCSS(false)
      expect(css.length).toBeGreaterThan(0)
    })

    it('should handle negative fractional spacing', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('-m-1/2')
      gen.generate('-translate-x-1/2')
      const css = gen.toCSS(false)
      expect(css).toContain('-')
    })
  })

  // ============================================================================
  // Regression: Tailwind-style cascade ordering. Shorthand utilities (`m-0`,
  // `p-0`, etc.) MUST emit before directional counterparts (`mx-auto`) so that
  // a combination like `class="m-0 mx-auto"` keeps the auto margins — the
  // shorthand coming last would otherwise reset them and silently break
  // horizontal centering.
  // ============================================================================
  describe('Cascade order — shorthand vs directional', () => {
    it('emits m-0 BEFORE mx-auto regardless of generate() order', () => {
      const gen = new CSSGenerator(defaultConfig)
      // Authoring order: mx-auto first, m-0 second — the buggy case
      gen.generate('mx-auto')
      gen.generate('m-0')
      const css = gen.toCSS(false)
      const mPos = css.indexOf('.m-0')
      const mxPos = css.indexOf('.mx-auto')
      expect(mPos).toBeGreaterThan(-1)
      expect(mxPos).toBeGreaterThan(-1)
      // mx-auto must appear AFTER m-0 in the output
      expect(mxPos).toBeGreaterThan(mPos)
    })

    it('emits p-2 BEFORE py-4 so py overrides shorthand on equal specificity', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('py-4')
      gen.generate('p-2')
      const css = gen.toCSS(false)
      expect(css.indexOf('.py-4')).toBeGreaterThan(css.indexOf('.p-2'))
    })

    it('emits mx-auto BEFORE mt-4 (axis before single-side)', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('mt-4')
      gen.generate('mx-auto')
      const css = gen.toCSS(false)
      expect(css.indexOf('.mt-4')).toBeGreaterThan(css.indexOf('.mx-auto'))
    })

    it('stably preserves order within the same rank', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('p-2')
      gen.generate('m-0')
      const css = gen.toCSS(false)
      // Both rank 0; p-2 was emitted first, so it stays first
      expect(css.indexOf('.p-2')).toBeLessThan(css.indexOf('.m-0'))
    })
  })
})
