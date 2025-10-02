import { describe, expect, it } from 'bun:test'
import { CSSGenerator } from '../src/generator'
import { defaultConfig } from '../src/config'

describe('Pseudo-element Variants', () => {
  describe('before and after', () => {
    it('should generate before variant', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('before:content-[""]')
      const css = gen.toCSS()
      expect(css).toContain('::before')
    })

    it('should generate after variant', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('after:content-[""]')
      const css = gen.toCSS()
      expect(css).toContain('::after')
    })

    it('should generate before with block display', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('before:block')
      const css = gen.toCSS()
      expect(css).toContain('::before')
      expect(css).toContain('display: block;')
    })

    it('should handle responsive + hover + pseudo-element', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('md:hover:before:block')
      const css = gen.toCSS()
      expect(css).toContain('@media (min-width: 768px)')
      expect(css).toContain(':hover')
      expect(css).toContain('::before')
      expect(css).toContain('display: block;')
    })

    it('should handle before with important', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('!before:block')
      const css = gen.toCSS()
      expect(css).toContain('::before')
      expect(css).toContain('!important')
    })
  })
})
