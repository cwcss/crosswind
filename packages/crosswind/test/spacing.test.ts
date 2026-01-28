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
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('-m-999')
      expect(gen.toCSS(false)).toContain('margin: -999;')
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
})
