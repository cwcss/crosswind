import { describe, expect, it } from 'bun:test'
import { CSSGenerator } from '../src/generator'
import { defaultConfig } from '../src/config'

describe('Color Utilities', () => {
  describe('Text colors', () => {
    it('should generate text-blue-500', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('text-blue-500')
      expect(gen.toCSS()).toContain('color: #3b82f6;')
    })

    it('should generate text-gray-800', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('text-gray-800')
      expect(gen.toCSS()).toContain('color: #1f2937;')
    })

    it('should generate text-red-500', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('text-red-500')
      expect(gen.toCSS()).toContain('color: #ef4444;')
    })

    it('should generate text-white', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('text-white')
      expect(gen.toCSS()).toContain('color: #fff;')
    })

    it('should generate text-black', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('text-black')
      expect(gen.toCSS()).toContain('color: #000;')
    })
  })

  describe('Background colors', () => {
    it('should generate bg-blue-500', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('bg-blue-500')
      expect(gen.toCSS()).toContain('background-color: #3b82f6;')
    })

    it('should generate bg-gray-100', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('bg-gray-100')
      expect(gen.toCSS()).toContain('background-color: #f3f4f6;')
    })

    it('should support arbitrary color', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('bg-[#ff0000]')
      expect(gen.toCSS()).toContain('background-color: #ff0000;')
    })
  })

  describe('Border colors', () => {
    it('should generate border-gray-300', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('border-gray-300')
      expect(gen.toCSS()).toContain('border-color: #d1d5db;')
    })

    it('should generate border-blue-500', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('border-blue-500')
      expect(gen.toCSS()).toContain('border-color: #3b82f6;')
    })
  })

  describe('Color opacity modifiers', () => {
    it('should generate background with opacity', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('bg-blue-500/50')
      const css = gen.toCSS()
      expect(css).toContain('background-color')
      expect(css).toMatch(/rgb.*0\.5/)
    })

    it('should generate text with opacity', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('text-red-500/75')
      const css = gen.toCSS()
      expect(css).toContain('color')
      expect(css).toMatch(/0\.75/)
    })

    it('should generate border with opacity', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('border-gray-500/25')
      const css = gen.toCSS()
      expect(css).toContain('border-color')
      expect(css).toMatch(/0\.25/)
    })
  })
})
