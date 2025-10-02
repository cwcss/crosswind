import { describe, expect, it } from 'bun:test'
import { CSSGenerator } from '../src/generator'
import { parseClass } from '../src/parser'
import { defaultConfig } from '../src/config'

describe('Sizing Utilities', () => {
  describe('Width', () => {
    it('should generate w-full', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('w-full')
      expect(gen.toCSS()).toContain('width: 100%;')
    })

    it('should generate w-screen', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('w-screen')
      expect(gen.toCSS()).toContain('width: 100vw;')
    })

    it('should generate w-auto', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('w-auto')
      expect(gen.toCSS()).toContain('width: auto;')
    })

    it('should generate w-min', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('w-min')
      expect(gen.toCSS()).toContain('width: min-content;')
    })

    it('should generate w-max', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('w-max')
      expect(gen.toCSS()).toContain('width: max-content;')
    })

    it('should generate w-fit', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('w-fit')
      expect(gen.toCSS()).toContain('width: fit-content;')
    })

    it('should support arbitrary width', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('w-[100px]')
      expect(gen.toCSS()).toContain('width: 100px;')
    })
  })

  describe('Height', () => {
    it('should generate h-full', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('h-full')
      expect(gen.toCSS()).toContain('height: 100%;')
    })

    it('should generate h-screen', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('h-screen')
      expect(gen.toCSS()).toContain('height: 100vh;')
    })

    it('should generate h-auto', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('h-auto')
      expect(gen.toCSS()).toContain('height: auto;')
    })
  })

  describe('Fractional values', () => {
    it('should parse fractional width', () => {
      const result = parseClass('w-1/2')
      expect(result).toEqual({
        raw: 'w-1/2',
        variants: [],
        utility: 'w',
        value: '1/2',
        important: false,
        arbitrary: false,
      })
    })

    it('should generate 50% width for w-1/2', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('w-1/2')
      expect(gen.toCSS()).toContain('width: 50%;')
    })

    it('should generate 33.333% width for w-1/3', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('w-1/3')
      expect(gen.toCSS()).toContain('width: 33.33333333333333%;')
    })

    it('should generate 66.666% width for w-2/3', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('w-2/3')
      expect(gen.toCSS()).toContain('width: 66.66666666666666%;')
    })

    it('should generate 75% height for h-3/4', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('h-3/4')
      expect(gen.toCSS()).toContain('height: 75%;')
    })

    it('should handle improper fractions', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('w-5/3')
      expect(gen.toCSS()).toMatch(/width: 166\.666/)
    })

    it('should handle very large fraction denominator', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('w-1/10000')
      expect(gen.toCSS()).toContain('width: 0.01%;')
    })
  })

  describe('Min-width', () => {
    it('should generate min-w-0', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('min-w-0')
      expect(gen.toCSS()).toContain('min-width: 0;')
    })

    it('should generate min-w-full', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('min-w-full')
      expect(gen.toCSS()).toContain('min-width: 100%;')
    })

    it('should generate min-w-min', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('min-w-min')
      expect(gen.toCSS()).toContain('min-width: min-content;')
    })

    it('should generate min-w-max', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('min-w-max')
      expect(gen.toCSS()).toContain('min-width: max-content;')
    })

    it('should generate min-w-fit', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('min-w-fit')
      expect(gen.toCSS()).toContain('min-width: fit-content;')
    })
  })

  describe('Max-width', () => {
    it('should generate max-w-xl', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('max-w-xl')
      expect(gen.toCSS()).toContain('max-width: 36rem;')
    })

    it('should generate max-w-screen', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('max-w-screen')
      expect(gen.toCSS()).toContain('max-width: 100vw;')
    })

    it('should generate max-w-none', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('max-w-none')
      expect(gen.toCSS()).toContain('max-width: none;')
    })

    it('should generate max-w-full', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('max-w-full')
      expect(gen.toCSS()).toContain('max-width: 100%;')
    })

    it('should handle max-w with arbitrary value', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('max-w-[1920px]')
      expect(gen.toCSS()).toContain('max-width: 1920px;')
    })
  })

  describe('Min-height', () => {
    it('should generate min-h-screen', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('min-h-screen')
      expect(gen.toCSS()).toContain('min-height: 100vh;')
    })

    it('should generate min-h-full', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('min-h-full')
      expect(gen.toCSS()).toContain('min-height: 100%;')
    })

    it('should handle min-h-screen on mobile', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('min-h-[100dvh]')
      expect(gen.toCSS()).toContain('min-height: 100dvh;')
    })
  })

  describe('Max-height', () => {
    it('should generate max-h-full', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('max-h-full')
      expect(gen.toCSS()).toContain('max-height: 100%;')
    })

    it('should generate max-h-screen', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('max-h-screen')
      expect(gen.toCSS()).toContain('max-height: 100vh;')
    })
  })
})
