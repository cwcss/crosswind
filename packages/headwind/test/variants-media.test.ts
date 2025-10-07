import { describe, expect, it } from 'bun:test'
import { defaultConfig } from '../src/config'
import { CSSGenerator } from '../src/generator'

describe('Media Query and Feature Variants', () => {
  describe('Responsive variants', () => {
    it('should generate responsive sm variant', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('sm:p-4')
      const css = gen.toCSS()
      expect(css).toContain('@media (min-width: 640px)')
    })

    it('should generate responsive md variant', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('md:p-4')
      const css = gen.toCSS()
      expect(css).toContain('@media (min-width: 768px)')
    })

    it('should generate responsive lg variant', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('lg:p-4')
      const css = gen.toCSS()
      expect(css).toContain('@media (min-width: 1024px)')
    })
  })

  describe('Print variant', () => {
    it('should generate print variant', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('print:hidden')
      const css = gen.toCSS()
      expect(css).toContain('@media print')
      expect(css).toContain('display: none;')
    })

    it('should handle print with dark mode', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('print:dark:text-black')
      const css = gen.toCSS()
      expect(css).toContain('@media print')
      expect(css).toContain('.dark')
    })
  })

  describe('Dark mode variant', () => {
    it('should generate dark variant', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('dark:bg-gray-900')
      const css = gen.toCSS()
      expect(css).toContain('.dark')
      expect(css).toContain('background-color: #111827;')
    })

    it('should handle dark + responsive + hover', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('dark:md:hover:text-gray-100')
      const css = gen.toCSS()
      expect(css).toContain('.dark')
      expect(css).toContain('@media (min-width: 768px)')
      expect(css).toContain(':hover')
    })
  })

  describe('Direction variants', () => {
    it('should generate rtl variant', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('rtl:text-right')
      const css = gen.toCSS()
      expect(css).toContain('[dir="rtl"]')
      expect(css).toContain('text-align: right;')
    })

    it('should generate ltr variant', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('ltr:text-left')
      const css = gen.toCSS()
      expect(css).toContain('[dir="ltr"]')
      expect(css).toContain('text-align: left;')
    })

    it('should handle rtl with responsive and hover', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('rtl:md:hover:text-right')
      const css = gen.toCSS()
      expect(css).toContain('[dir="rtl"]')
      expect(css).toContain('@media (min-width: 768px)')
      expect(css).toContain(':hover')
    })
  })

  describe('Motion variants', () => {
    it('should generate motion-safe variant', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('motion-safe:p-4')
      const css = gen.toCSS()
      expect(css).toContain('@media (prefers-reduced-motion: no-preference)')
      expect(css).toContain('padding: 1rem;')
    })

    it('should generate motion-reduce variant', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('motion-reduce:p-0')
      const css = gen.toCSS()
      expect(css).toContain('@media (prefers-reduced-motion: reduce)')
      expect(css).toContain('padding: 0;')
    })

    it('should handle motion-safe with responsive', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('motion-safe:lg:p-4')
      const css = gen.toCSS()
      expect(css).toContain('@media (prefers-reduced-motion: no-preference)')
      expect(css).toContain('padding: 1rem;')
    })
  })

  describe('Contrast variants', () => {
    it('should generate contrast-more variant', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('contrast-more:border-gray-900')
      const css = gen.toCSS()
      expect(css).toContain('@media (prefers-contrast: more)')
    })

    it('should generate contrast-less variant', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('contrast-less:border-gray-400')
      const css = gen.toCSS()
      expect(css).toContain('@media (prefers-contrast: less)')
    })
  })
})
