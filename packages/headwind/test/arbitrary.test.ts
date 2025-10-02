import { describe, expect, it } from 'bun:test'
import { CSSGenerator } from '../src/generator'
import { parseClass } from '../src/parser'
import { defaultConfig } from '../src/config'

describe('Arbitrary Values and Properties', () => {
  describe('Arbitrary values', () => {
    it('should support arbitrary width', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('w-[100px]')
      expect(gen.toCSS()).toContain('width: 100px;')
    })

    it('should support arbitrary color', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('bg-[#ff0000]')
      expect(gen.toCSS()).toContain('background-color: #ff0000;')
    })

    it('should support arbitrary padding', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('p-[2.5rem]')
      expect(gen.toCSS()).toContain('padding: 2.5rem;')
    })

    it('should work with negative arbitrary values', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('-m-[100px]')
      const css = gen.toCSS()
      expect(css).toBeDefined()
    })
  })

  describe('Arbitrary properties', () => {
    it('should parse arbitrary property', () => {
      const result = parseClass('[color:red]')
      expect(result).toEqual({
        raw: '[color:red]',
        variants: [],
        utility: 'color',
        value: 'red',
        important: false,
        arbitrary: true,
      })
    })

    it('should parse arbitrary property with dashes', () => {
      const result = parseClass('[mask-type:luminance]')
      expect(result).toEqual({
        raw: '[mask-type:luminance]',
        variants: [],
        utility: 'mask-type',
        value: 'luminance',
        important: false,
        arbitrary: true,
      })
    })

    it('should generate arbitrary property CSS', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('[display:grid]')
      expect(gen.toCSS()).toContain('display: grid;')
    })

    it('should generate arbitrary property with dashes', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('[mask-type:alpha]')
      expect(gen.toCSS()).toContain('mask-type: alpha;')
    })

    it('should handle arbitrary property with spaces', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('[grid-template-areas:auto]')
      expect(gen.toCSS()).toContain('grid-template-areas: auto;')
    })

    it('should handle arbitrary property with CSS functions', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('[background:linear-gradient(red,blue)]')
      expect(gen.toCSS()).toContain('background: linear-gradient(red,blue);')
    })

    it('should handle arbitrary property with important', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('![z-index:9999]')
      expect(gen.toCSS()).toContain('z-index: 9999 !important;')
    })
  })
})
