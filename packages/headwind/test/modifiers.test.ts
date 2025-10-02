import { describe, expect, it } from 'bun:test'
import { CSSGenerator } from '../src/generator'
import { defaultConfig } from '../src/config'

describe('Modifiers', () => {
  describe('Important modifier', () => {
    it('should add !important to utilities', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('!p-4')
      expect(gen.toCSS()).toContain('padding: 1rem !important;')
    })

    it('should work with arbitrary values', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('!w-[100px]')
      expect(gen.toCSS()).toContain('width: 100px !important;')
    })

    it('should work with colors', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('!bg-gray-500')
      expect(gen.toCSS()).toContain('background-color: #6b7280 !important;')
    })

    it('should work with variants', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('!placeholder:text-gray-400')
      expect(gen.toCSS()).toContain('!important')
    })

    it('should work with ring-offset', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('!ring-offset-4')
      expect(gen.toCSS()).toContain('!important')
    })

    it('should work with container', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('!container')
      expect(gen.toCSS()).toContain('!important')
    })

    it('should work with before pseudo-element', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('!before:block')
      const css = gen.toCSS()
      expect(css).toContain('::before')
      expect(css).toContain('!important')
    })
  })
})
