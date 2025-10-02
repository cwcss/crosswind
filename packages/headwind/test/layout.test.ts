import { describe, expect, it } from 'bun:test'
import { CSSGenerator } from '../src/generator'
import { defaultConfig } from '../src/config'

describe('Layout Utilities', () => {
  describe('Display', () => {
    it('should generate block', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('block')
      expect(gen.toCSS()).toContain('display: block;')
    })

    it('should generate inline-block', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('inline-block')
      expect(gen.toCSS()).toContain('display: inline-block;')
    })

    it('should generate hidden', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('hidden')
      expect(gen.toCSS()).toContain('display: none;')
    })
  })

  describe('Position', () => {
    it('should generate absolute', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('absolute')
      expect(gen.toCSS()).toContain('position: absolute;')
    })

    it('should generate relative', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('relative')
      expect(gen.toCSS()).toContain('position: relative;')
    })

    it('should generate fixed', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('fixed')
      expect(gen.toCSS()).toContain('position: fixed;')
    })

    it('should generate sticky', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('sticky')
      expect(gen.toCSS()).toContain('position: sticky;')
    })
  })

  describe('Inset', () => {
    it('should generate top-4', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('top-4')
      expect(gen.toCSS()).toContain('top: 1rem;')
    })

    it('should generate right-0', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('right-0')
      expect(gen.toCSS()).toContain('right: 0;')
    })

    it('should generate bottom-2', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('bottom-2')
      expect(gen.toCSS()).toContain('bottom: 0.5rem;')
    })

    it('should generate left-8', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('left-8')
      expect(gen.toCSS()).toContain('left: 2rem;')
    })

    it('should generate inset-0', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('inset-0')
      const css = gen.toCSS()
      expect(css).toContain('top: 0;')
      expect(css).toContain('right: 0;')
      expect(css).toContain('bottom: 0;')
      expect(css).toContain('left: 0;')
    })

    it('should generate negative top', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('-top-4')
      expect(gen.toCSS()).toContain('top: -1rem;')
    })
  })

  describe('Z-index', () => {
    it('should generate z-10', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('z-10')
      expect(gen.toCSS()).toContain('z-index: 10;')
    })

    it('should generate z-0', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('z-0')
      expect(gen.toCSS()).toContain('z-index: 0;')
    })

    it('should generate z-50', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('z-50')
      expect(gen.toCSS()).toContain('z-index: 50;')
    })
  })

  describe('Overflow', () => {
    it('should generate overflow-hidden', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('overflow-hidden')
      expect(gen.toCSS()).toContain('overflow: hidden;')
    })

    it('should generate overflow-auto', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('overflow-auto')
      expect(gen.toCSS()).toContain('overflow: auto;')
    })

    it('should generate overflow-scroll', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('overflow-scroll')
      expect(gen.toCSS()).toContain('overflow: scroll;')
    })

    it('should generate overflow-x-hidden', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('overflow-x-hidden')
      expect(gen.toCSS()).toContain('overflow-x: hidden;')
    })

    it('should generate overflow-y-auto', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('overflow-y-auto')
      expect(gen.toCSS()).toContain('overflow-y: auto;')
    })
  })

  describe('Aspect Ratio', () => {
    it('should generate aspect-square', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('aspect-square')
      expect(gen.toCSS()).toContain('aspect-ratio: 1 / 1;')
    })

    it('should generate aspect-video', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('aspect-video')
      expect(gen.toCSS()).toContain('aspect-ratio: 16 / 9;')
    })
  })
})
