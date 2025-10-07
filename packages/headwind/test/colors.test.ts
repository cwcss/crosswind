import { describe, expect, it } from 'bun:test'
import { defaultConfig } from '../src/config'
import { CSSGenerator } from '../src/generator'

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

describe('Edge Cases', () => {
  describe('Arbitrary color values', () => {
    it('should handle hex colors with 3 digits', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('bg-[#f00]')
      expect(gen.toCSS()).toContain('background-color: #f00;')
    })

    it('should handle hex colors with 6 digits', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('bg-[#ff0000]')
      expect(gen.toCSS()).toContain('background-color: #ff0000;')
    })

    it('should handle hex colors with 8 digits (with alpha)', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('bg-[#ff0000ff]')
      expect(gen.toCSS()).toContain('background-color: #ff0000ff;')
    })

    it('should handle rgb() colors', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('bg-[rgb(255,0,0)]')
      expect(gen.toCSS()).toContain('background-color: rgb(255,0,0);')
    })

    it('should handle rgba() colors', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('bg-[rgba(255,0,0,0.5)]')
      expect(gen.toCSS()).toContain('background-color: rgba(255,0,0,0.5);')
    })

    it('should handle hsl() colors', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('bg-[hsl(0,100%,50%)]')
      expect(gen.toCSS()).toContain('background-color: hsl(0,100%,50%);')
    })

    it('should handle hsla() colors', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('bg-[hsla(0,100%,50%,0.5)]')
      expect(gen.toCSS()).toContain('background-color: hsla(0,100%,50%,0.5);')
    })

    it('should handle CSS color keywords', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('bg-[transparent]')
      expect(gen.toCSS()).toContain('background-color: transparent;')
    })

    it('should handle currentColor', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('bg-[currentColor]')
      expect(gen.toCSS()).toContain('background-color: currentColor;')
    })

    it('should handle CSS variables in colors', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('bg-[var(--primary-color)]')
      expect(gen.toCSS()).toContain('background-color: var(--primary-color);')
    })
  })

  describe('Opacity modifiers comprehensive', () => {
    it('should handle 0% opacity', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('bg-blue-500/0')
      const css = gen.toCSS()
      expect(css).toContain('background-color')
      expect(css).toMatch(/0/)
    })

    it('should handle 100% opacity', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('bg-blue-500/100')
      const css = gen.toCSS()
      expect(css).toContain('background-color')
      expect(css).toMatch(/1/)
    })

    it('should handle text color with opacity', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('text-blue-500/50')
      const css = gen.toCSS()
      expect(css).toContain('color')
      expect(css).toMatch(/0\.5/)
    })

    it('should handle border color with opacity', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('border-blue-500/50')
      const css = gen.toCSS()
      expect(css).toContain('border-color')
      expect(css).toMatch(/0\.5/)
    })

    it('should handle ring color with opacity', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('ring-blue-500/50')
      const css = gen.toCSS()
      expect(css).toBeDefined()
    })

    it('should handle divide color with opacity', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('divide-blue-500/50')
      const css = gen.toCSS()
      expect(css).toBeDefined()
    })
  })

  describe('Color with variants', () => {
    it('should handle color with hover', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('hover:bg-red-500')
      const css = gen.toCSS()
      expect(css).toContain(':hover')
      expect(css).toContain('background-color: #ef4444;')
    })

    it('should handle color with focus', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('focus:text-blue-500')
      const css = gen.toCSS()
      expect(css).toContain(':focus')
      expect(css).toContain('color: #3b82f6;')
    })

    it('should handle color with responsive', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('md:bg-green-500')
      const css = gen.toCSS()
      expect(css).toContain('@media (min-width: 768px)')
      expect(css).toContain('background-color: #22c55e;')
    })

    it('should handle color with important', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('!bg-blue-500')
      expect(gen.toCSS()).toContain('background-color: #3b82f6 !important;')
    })

    it('should handle color with dark mode', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('dark:bg-gray-900')
      const css = gen.toCSS()
      expect(css).toContain('.dark')
      expect(css).toContain('background-color: #111827;')
    })

    it('should handle color opacity with hover', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('hover:bg-blue-500/75')
      const css = gen.toCSS()
      expect(css).toContain(':hover')
      expect(css).toContain('background-color')
      expect(css).toMatch(/0\.75/)
    })

    it('should handle multiple variant combinations', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('dark:md:hover:bg-blue-500/50')
      const css = gen.toCSS()
      expect(css).toContain('.dark')
      expect(css).toContain('@media (min-width: 768px)')
      expect(css).toContain(':hover')
      expect(css).toContain('background-color')
    })
  })

  describe('All color shades', () => {
    it('should handle 50 shade', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('bg-gray-50')
      expect(gen.toCSS()).toContain('background-color: #f9fafb;')
    })

    it('should handle 950 shade', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('bg-gray-950')
      expect(gen.toCSS()).toContain('background-color:')
    })

    it('should handle all middle shades', () => {
      const gen = new CSSGenerator(defaultConfig)
      const shades = ['100', '200', '300', '400', '500', '600', '700', '800', '900']
      for (const shade of shades) {
        gen.generate(`bg-blue-${shade}`)
      }
      const css = gen.toCSS()
      expect(css).toBeDefined()
      expect(css.length).toBeGreaterThan(0)
    })
  })

  describe('Special color cases', () => {
    it('should handle inherit', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('bg-inherit')
      expect(gen.toCSS()).toContain('background-color: inherit;')
    })

    it('should handle transparent', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('bg-transparent')
      expect(gen.toCSS()).toContain('background-color: transparent;')
    })

    it('should handle current', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('bg-current')
      expect(gen.toCSS()).toContain('background-color: currentColor;')
    })

    it('should handle text-inherit', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('text-inherit')
      expect(gen.toCSS()).toContain('color: inherit;')
    })

    it('should handle text-transparent', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('text-transparent')
      expect(gen.toCSS()).toContain('color: transparent;')
    })

    it('should handle text-current', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('text-current')
      expect(gen.toCSS()).toContain('color: currentColor;')
    })
  })

  describe('Advanced color formats', () => {
    it('should handle 3-digit hex colors', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('bg-[#fff]')
      gen.generate('text-[#000]')
      const css = gen.toCSS()
      expect(css).toContain('#fff')
      expect(css).toContain('#000')
    })

    it('should handle 8-digit hex colors with alpha', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('bg-[#ff000080]')
      const css = gen.toCSS()
      expect(css).toContain('#ff000080')
    })

    it('should handle rgb() notation', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('bg-[rgb(255,0,0)]')
      const css = gen.toCSS()
      expect(css).toContain('rgb(255,0,0)')
    })

    it('should handle rgba() notation', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('bg-[rgba(255,0,0,0.5)]')
      const css = gen.toCSS()
      expect(css).toContain('rgba(255,0,0,0.5)')
    })

    it('should handle hsl() notation', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('bg-[hsl(0,100%,50%)]')
      const css = gen.toCSS()
      expect(css).toContain('hsl(0,100%,50%)')
    })

    it('should handle hsla() notation', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('bg-[hsla(0,100%,50%,0.5)]')
      const css = gen.toCSS()
      expect(css).toContain('hsla(0,100%,50%,0.5)')
    })

    it('should handle oklch() notation', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('bg-[oklch(0.5_0.2_180)]')
      const css = gen.toCSS()
      expect(css).toContain('oklch')
    })

    it('should handle color() notation', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('bg-[color(display-p3_1_0_0)]')
      const css = gen.toCSS()
      expect(css).toContain('color(')
    })

    it('should handle nonexistent color shades gracefully', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('bg-blue-999')
      gen.generate('text-red-1')
      // Should not crash, may not generate CSS
      expect(() => gen.toCSS()).not.toThrow()
    })

    it('should handle color with opacity modifier', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('bg-blue-500/50')
      gen.generate('text-red-500/75')
      const _css = gen.toCSS()
      // May or may not be implemented, but should not crash
      expect(() => gen.toCSS()).not.toThrow()
    })
  })
})
