import { describe, expect, it } from 'bun:test'
import { defaultConfig } from '../src/config'
import { CSSGenerator } from '../src/generator'

describe('Group and Peer Variants', () => {
  describe('Group variants', () => {
    it('should generate group-hover', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('group-hover:bg-gray-500')
      const css = gen.toCSS(false)
      expect(css).toContain('.group:hover')
      expect(css).toContain('background-color: oklch(55.1% 0.027 264.364);')
    })

    it('should generate group-focus', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('group-focus:text-gray-800')
      const css = gen.toCSS(false)
      expect(css).toContain('.group:focus')
      expect(css).toContain('color: oklch(27.8% 0.033 256.848);')
    })

    it('should handle group with responsive and state', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('lg:group-hover:first:bg-gray-500')
      const css = gen.toCSS(false)
      expect(css).toContain('@media (min-width: 1024px)')
      expect(css).toContain('.group:hover')
      expect(css).toContain(':first-child')
    })

    it('should handle group with new variants', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('group-hover:marker:text-blue-500')
      const css = gen.toCSS(false)
      expect(css).toContain('.group:hover')
      expect(css).toContain('::marker')
    })
  })

  describe('Peer variants', () => {
    it('should generate peer-checked', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('peer-checked:bg-gray-500')
      const css = gen.toCSS(false)
      expect(css).toContain('.peer:checked')
      expect(css).toContain('background-color: oklch(55.1% 0.027 264.364);')
    })

    it('should generate peer-focus', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('peer-focus:border-gray-300')
      const css = gen.toCSS(false)
      expect(css).toContain('.peer:focus')
      expect(css).toContain('border-color: oklch(87.2% 0.01 258.338);')
    })

    it('should handle peer-checked with responsive', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('lg:peer-checked:bg-green-500')
      const css = gen.toCSS(false)
      expect(css).toContain('@media (min-width: 1024px)')
      expect(css).toContain('.peer:checked')
    })
  })
})
