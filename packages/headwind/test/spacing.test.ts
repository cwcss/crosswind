import { describe, expect, it } from 'bun:test'
import { CSSGenerator } from '../src/generator'
import { parseClass } from '../src/parser'
import { defaultConfig } from '../src/config'

describe('Spacing Utilities', () => {
  describe('Padding', () => {
    it('should generate p-4', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('p-4')
      expect(gen.toCSS()).toContain('padding: 1rem;')
    })

    it('should generate px-4', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('px-4')
      const css = gen.toCSS()
      expect(css).toContain('padding-left: 1rem;')
      expect(css).toContain('padding-right: 1rem;')
    })

    it('should generate py-2', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('py-2')
      const css = gen.toCSS()
      expect(css).toContain('padding-top: 0.5rem;')
      expect(css).toContain('padding-bottom: 0.5rem;')
    })

    it('should generate pt-4', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('pt-4')
      expect(gen.toCSS()).toContain('padding-top: 1rem;')
    })

    it('should generate pr-8', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('pr-8')
      expect(gen.toCSS()).toContain('padding-right: 2rem;')
    })

    it('should generate pb-0', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('pb-0')
      expect(gen.toCSS()).toContain('padding-bottom: 0;')
    })

    it('should generate pl-1', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('pl-1')
      expect(gen.toCSS()).toContain('padding-left: 0.25rem;')
    })
  })

  describe('Margin', () => {
    it('should generate m-4', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('m-4')
      expect(gen.toCSS()).toContain('margin: 1rem;')
    })

    it('should generate mx-auto', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('mx-auto')
      const css = gen.toCSS()
      expect(css).toContain('margin-left: auto;')
      expect(css).toContain('margin-right: auto;')
    })

    it('should generate my-4', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('my-4')
      const css = gen.toCSS()
      expect(css).toContain('margin-top: 1rem;')
      expect(css).toContain('margin-bottom: 1rem;')
    })

    it('should generate mt-8', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('mt-8')
      expect(gen.toCSS()).toContain('margin-top: 2rem;')
    })

    it('should generate mr-2', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('mr-2')
      expect(gen.toCSS()).toContain('margin-right: 0.5rem;')
    })

    it('should generate mb-0', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('mb-0')
      expect(gen.toCSS()).toContain('margin-bottom: 0;')
    })

    it('should generate ml-1', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('ml-1')
      expect(gen.toCSS()).toContain('margin-left: 0.25rem;')
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
      expect(gen.toCSS()).toContain('margin: -1rem;')
    })

    it('should generate negative margin-top', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('-mt-2')
      expect(gen.toCSS()).toContain('margin-top: -0.5rem;')
    })

    it('should generate negative margin-left', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('-ml-8')
      expect(gen.toCSS()).toContain('margin-left: -2rem;')
    })

    it('should handle very large negative margin', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('-m-999')
      expect(gen.toCSS()).toContain('margin: -999;')
    })

    it('should handle negative arbitrary values', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('-m-[100px]')
      const css = gen.toCSS()
      expect(css).toBeDefined()
    })
  })

  describe('Arbitrary spacing values', () => {
    it('should support arbitrary padding', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('p-[2.5rem]')
      expect(gen.toCSS()).toContain('padding: 2.5rem;')
    })

    it('should support arbitrary margin', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('m-[15px]')
      expect(gen.toCSS()).toContain('margin: 15px;')
    })
  })
})
