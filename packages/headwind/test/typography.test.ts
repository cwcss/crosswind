import { describe, expect, it } from 'bun:test'
import { CSSGenerator } from '../src/generator'
import { defaultConfig } from '../src/config'

describe('Typography Utilities', () => {
  describe('Font size', () => {
    it('should generate text-sm', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('text-sm')
      const css = gen.toCSS()
      expect(css).toContain('font-size:')
      expect(css).toContain('line-height:')
    })

    it('should generate text-lg', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('text-lg')
      const css = gen.toCSS()
      expect(css).toContain('font-size:')
    })
  })

  describe('Font weight', () => {
    it('should generate font-bold', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('font-bold')
      expect(gen.toCSS()).toContain('font-weight: 700;')
    })

    it('should generate font-normal', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('font-normal')
      expect(gen.toCSS()).toContain('font-weight: 400;')
    })

    it('should generate font-semibold', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('font-semibold')
      expect(gen.toCSS()).toContain('font-weight: 600;')
    })
  })

  describe('Text align', () => {
    it('should generate text-center', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('text-center')
      expect(gen.toCSS()).toContain('text-align: center;')
    })

    it('should generate text-left', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('text-left')
      expect(gen.toCSS()).toContain('text-align: left;')
    })

    it('should generate text-right', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('text-right')
      expect(gen.toCSS()).toContain('text-align: right;')
    })
  })

  describe('Text transform', () => {
    it('should generate uppercase', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('uppercase')
      expect(gen.toCSS()).toContain('text-transform: uppercase;')
    })

    it('should generate lowercase', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('lowercase')
      expect(gen.toCSS()).toContain('text-transform: lowercase;')
    })

    it('should generate capitalize', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('capitalize')
      expect(gen.toCSS()).toContain('text-transform: capitalize;')
    })
  })

  describe('Text decoration', () => {
    it('should generate underline', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('underline')
      expect(gen.toCSS()).toContain('text-decoration-line: underline;')
    })

    it('should generate line-through', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('line-through')
      expect(gen.toCSS()).toContain('text-decoration-line: line-through;')
    })

    it('should generate decoration-wavy', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('decoration-wavy')
      expect(gen.toCSS()).toContain('text-decoration-style: wavy;')
    })

    it('should generate underline-offset', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('underline-offset-4')
      expect(gen.toCSS()).toContain('text-underline-offset: 4px;')
    })

    it('should generate decoration-color', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('decoration-blue-500')
      expect(gen.toCSS()).toContain('text-decoration-color: #3b82f6;')
    })
  })

  describe('Font style', () => {
    it('should generate italic', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('italic')
      expect(gen.toCSS()).toContain('font-style: italic;')
    })

    it('should generate not-italic', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('not-italic')
      expect(gen.toCSS()).toContain('font-style: normal;')
    })
  })

  describe('Line height', () => {
    it('should generate leading-tight', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('leading-tight')
      expect(gen.toCSS()).toContain('line-height: 1.25;')
    })

    it('should generate leading-loose', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('leading-loose')
      expect(gen.toCSS()).toContain('line-height: 2;')
    })

    it('should generate leading-normal', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('leading-normal')
      expect(gen.toCSS()).toContain('line-height: 1.5;')
    })
  })

  describe('White space', () => {
    it('should generate whitespace-nowrap', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('whitespace-nowrap')
      expect(gen.toCSS()).toContain('white-space: nowrap;')
    })

    it('should generate whitespace-normal', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('whitespace-normal')
      expect(gen.toCSS()).toContain('white-space: normal;')
    })
  })

  describe('Letter spacing', () => {
    it('should generate tracking-tight', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('tracking-tight')
      expect(gen.toCSS()).toContain('letter-spacing:')
    })

    it('should generate tracking-wide', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('tracking-wide')
      expect(gen.toCSS()).toContain('letter-spacing:')
    })
  })
})
