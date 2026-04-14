import { describe, expect, it } from 'bun:test'
import { defaultConfig } from '../src/config'
import { CSSGenerator } from '../src/generator'

describe('Gradient Utilities', () => {
  describe('Radial gradients', () => {
    it('should generate bg-radial', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('bg-radial')
      const css = gen.toCSS(false)
      expect(css).toContain('background-image: radial-gradient(var(--hw-gradient-stops))')
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
      expect(css).toContain('--hw-gradient-from')
    })
  })

  describe('Conic gradients', () => {
    it('should generate bg-conic', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('bg-conic')
      const css = gen.toCSS(false)
      expect(css).toContain('background-image: conic-gradient(var(--hw-gradient-stops))')
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
})
