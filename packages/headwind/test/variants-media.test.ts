import { describe, expect, it } from 'bun:test'
import { defaultConfig } from '../src/config'
import { CSSGenerator } from '../src/generator'

describe('Media Query and Feature Variants', () => {
  describe('Responsive variants', () => {
    it('should generate responsive sm variant', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('sm:p-4')
      const css = gen.toCSS(false)
      expect(css).toContain('@media (min-width: 640px)')
    })

    it('should generate responsive md variant', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('md:p-4')
      const css = gen.toCSS(false)
      expect(css).toContain('@media (min-width: 768px)')
    })

    it('should generate responsive lg variant', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('lg:p-4')
      const css = gen.toCSS(false)
      expect(css).toContain('@media (min-width: 1024px)')
    })
  })

  describe('Print variant', () => {
    it('should generate print variant', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('print:hidden')
      const css = gen.toCSS(false)
      expect(css).toContain('@media print')
      expect(css).toContain('display: none;')
    })

    it('should handle print with dark mode', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('print:dark:text-black')
      const css = gen.toCSS(false)
      expect(css).toContain('@media print')
      expect(css).toContain('.dark')
    })
  })

  describe('Dark mode variant', () => {
    it('should generate dark variant', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('dark:bg-gray-900')
      const css = gen.toCSS(false)
      expect(css).toContain('.dark')
      expect(css).toContain('background-color: oklch(21% 0.034 264.665);')
    })

    it('should handle dark + responsive + hover', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('dark:md:hover:text-gray-100')
      const css = gen.toCSS(false)
      expect(css).toContain('.dark')
      expect(css).toContain('@media (min-width: 768px)')
      expect(css).toContain(':hover')
    })
  })

  describe('Direction variants', () => {
    it('should generate rtl variant', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('rtl:text-right')
      const css = gen.toCSS(false)
      expect(css).toContain('[dir="rtl"]')
      expect(css).toContain('text-align: right;')
    })

    it('should generate ltr variant', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('ltr:text-left')
      const css = gen.toCSS(false)
      expect(css).toContain('[dir="ltr"]')
      expect(css).toContain('text-align: left;')
    })

    it('should handle rtl with responsive and hover', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('rtl:md:hover:text-right')
      const css = gen.toCSS(false)
      expect(css).toContain('[dir="rtl"]')
      expect(css).toContain('@media (min-width: 768px)')
      expect(css).toContain(':hover')
    })
  })

  describe('Motion variants', () => {
    it('should generate motion-safe variant', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('motion-safe:p-4')
      const css = gen.toCSS(false)
      expect(css).toContain('@media (prefers-reduced-motion: no-preference)')
      expect(css).toContain('padding: 1rem;')
    })

    it('should generate motion-reduce variant', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('motion-reduce:p-0')
      const css = gen.toCSS(false)
      expect(css).toContain('@media (prefers-reduced-motion: reduce)')
      expect(css).toContain('padding: 0;')
    })

    it('should handle motion-safe with responsive', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('motion-safe:lg:p-4')
      const css = gen.toCSS(false)
      expect(css).toContain('@media (prefers-reduced-motion: no-preference)')
      expect(css).toContain('padding: 1rem;')
    })
  })

  describe('Contrast variants', () => {
    it('should generate contrast-more variant', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('contrast-more:border-gray-900')
      const css = gen.toCSS(false)
      expect(css).toContain('@media (prefers-contrast: more)')
    })

    it('should generate contrast-less variant', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('contrast-less:border-gray-400')
      const css = gen.toCSS(false)
      expect(css).toContain('@media (prefers-contrast: less)')
    })
  })

  describe('Container query variants', () => {
    it('should generate @container utility', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('@container')
      const css = gen.toCSS(false)
      expect(css).toContain('container-type: inline-size;')
    })

    it('should generate @container-normal utility', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('@container-normal')
      const css = gen.toCSS(false)
      expect(css).toContain('container-type: normal;')
    })

    it('should generate named container with @container/name', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('@container/sidebar')
      const css = gen.toCSS(false)
      expect(css).toContain('container-type: inline-size;')
      expect(css).toContain('container-name: sidebar;')
    })

    it('should generate @sm container query variant', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('@sm:p-4')
      const css = gen.toCSS(false)
      expect(css).toContain('@container (min-width: 640px)')
      expect(css).toContain('padding: 1rem;')
    })

    it('should generate @md container query variant', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('@md:flex')
      const css = gen.toCSS(false)
      expect(css).toContain('@container (min-width: 768px)')
      expect(css).toContain('display: flex;')
    })

    it('should generate @lg container query variant', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('@lg:hidden')
      const css = gen.toCSS(false)
      expect(css).toContain('@container (min-width: 1024px)')
      expect(css).toContain('display: none;')
    })

    it('should generate @xl container query variant', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('@xl:grid')
      const css = gen.toCSS(false)
      expect(css).toContain('@container (min-width: 1280px)')
      expect(css).toContain('display: grid;')
    })

    it('should generate @2xl container query variant', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('@2xl:inline-flex')
      const css = gen.toCSS(false)
      expect(css).toContain('@container (min-width: 1536px)')
      expect(css).toContain('display: inline-flex;')
    })

    it('should escape @ in selector for container queries', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('@sm:p-4')
      const css = gen.toCSS(false)
      expect(css).toContain('.\\@sm\\:p-4')
    })

    it('should handle container query with hover variant', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('@md:hover:bg-blue-500')
      const css = gen.toCSS(false)
      expect(css).toContain('@container (min-width: 768px)')
      expect(css).toContain(':hover')
    })
  })
})
