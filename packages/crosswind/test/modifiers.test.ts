import { describe, expect, it } from 'bun:test'
import { defaultConfig } from '../src/config'
import { CSSGenerator } from '../src/generator'

describe('Modifiers', () => {
  describe('Important modifier', () => {
    it('should add !important to utilities', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('!p-4')
      expect(gen.toCSS(false)).toContain('padding: 1rem !important;')
    })

    it('should work with arbitrary values', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('!w-[100px]')
      expect(gen.toCSS(false)).toContain('width: 100px !important;')
    })

    it('should work with colors', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('!bg-gray-500')
      expect(gen.toCSS(false)).toContain('background-color: oklch(55.1% 0.027 264.364) !important;')
    })

    it('should work with variants', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('!placeholder:text-gray-400')
      expect(gen.toCSS(false)).toContain('!important')
    })

    it('should work with ring-offset', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('!ring-offset-4')
      expect(gen.toCSS(false)).toContain('!important')
    })

    it('should work with container', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('!container')
      expect(gen.toCSS(false)).toContain('!important')
    })

    it('should work with before pseudo-element', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('!before:block')
      const css = gen.toCSS(false)
      expect(css).toContain('::before')
      expect(css).toContain('!important')
    })
  })

  describe('Edge Cases', () => {
    describe('Important with all utility types', () => {
      it('should work with display utilities', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('!block')
        expect(gen.toCSS(false)).toContain('display: block !important;')
      })

      it('should work with flexbox utilities', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('!flex-col')
        expect(gen.toCSS(false)).toContain('flex-direction: column !important;')
      })

      it('should work with grid utilities', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('!grid-cols-3')
        expect(gen.toCSS(false)).toContain('grid-template-columns: repeat(3, minmax(0, 1fr)) !important;')
      })

      it('should work with transform utilities', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('!rotate-45')
        expect(gen.toCSS(false)).toContain('transform: rotate(45deg) !important;')
      })

      it('should work with opacity', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('!opacity-50')
        expect(gen.toCSS(false)).toContain('opacity: 0.5 !important;')
      })

      it('should work with border utilities', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('!border')
        expect(gen.toCSS(false)).toContain('border-width: 1px !important;')
      })

      it('should work with rounded utilities', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('!rounded-lg')
        expect(gen.toCSS(false)).toContain('border-radius: 0.5rem !important;')
      })

      it('should work with shadow utilities', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('!shadow-md')
        expect(gen.toCSS(false)).toContain('box-shadow:')
        expect(gen.toCSS(false)).toContain('!important')
      })
    })

    describe('Important with responsive variants', () => {
      it('should work with md breakpoint', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('!md:p-8')
        const css = gen.toCSS(false)
        expect(css).toContain('@media (min-width: 768px)')
        expect(css).toContain('padding: 2rem !important;')
      })

      it('should work with lg breakpoint', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('!lg:text-2xl')
        const css = gen.toCSS(false)
        expect(css).toContain('@media (min-width: 1024px)')
        expect(css).toContain('!important')
      })

      it('should work with multiple responsive utilities', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('!sm:w-full')
        gen.generate('!md:w-1/2')
        gen.generate('!lg:w-1/3')
        const css = gen.toCSS(false)
        expect(css).toContain('@media (min-width: 640px)')
        expect(css).toContain('@media (min-width: 768px)')
        expect(css).toContain('@media (min-width: 1024px)')
      })
    })

    describe('Important with state variants', () => {
      it('should work with hover', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('!hover:bg-blue-500')
        const css = gen.toCSS(false)
        expect(css).toContain(':hover')
        expect(css).toContain('!important')
      })

      it('should work with focus', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('!focus:outline-none')
        const css = gen.toCSS(false)
        expect(css).toContain(':focus')
        expect(css).toContain('!important')
      })

      it('should work with active', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('!active:scale-95')
        const css = gen.toCSS(false)
        expect(css).toContain(':active')
        expect(css).toContain('!important')
      })

      it('should work with disabled', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('!disabled:opacity-50')
        const css = gen.toCSS(false)
        expect(css).toContain(':disabled')
        expect(css).toContain('!important')
      })

      it('should work with checked', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('!checked:bg-green-500')
        const css = gen.toCSS(false)
        expect(css).toContain(':checked')
        expect(css).toContain('!important')
      })
    })

    describe('Important with pseudo-elements', () => {
      it('should work with after', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('!after:content-["*"]')
        const css = gen.toCSS(false)
        expect(css).toContain('::after')
        expect(css).toContain('!important')
      })

      it('should work with marker', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('!marker:text-red-500')
        const css = gen.toCSS(false)
        expect(css).toContain('::marker')
        expect(css).toContain('!important')
      })

      it('should work with selection', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('!selection:bg-yellow-100')
        const css = gen.toCSS(false)
        expect(css).toContain('::selection')
        expect(css).toContain('!important')
      })

      it('should work with placeholder', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('!placeholder:text-gray-400')
        const css = gen.toCSS(false)
        expect(css).toContain('::placeholder')
        expect(css).toContain('!important')
      })
    })

    describe('Important with group/peer variants', () => {
      it('should work with group-hover', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('!group-hover:visible')
        const css = gen.toCSS(false)
        expect(css).toContain('.group:hover')
        expect(css).toContain('!important')
      })

      it('should work with peer-checked', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('!peer-checked:block')
        const css = gen.toCSS(false)
        expect(css).toContain('.peer:checked')
        expect(css).toContain('!important')
      })
    })

    describe('Important with dark mode', () => {
      it('should work with dark variant', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('!dark:bg-gray-900')
        const css = gen.toCSS(false)
        expect(css).toContain('.dark')
        expect(css).toContain('!important')
      })

      it('should work with dark and hover combined', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('!dark:hover:bg-gray-800')
        const css = gen.toCSS(false)
        expect(css).toContain('.dark')
        expect(css).toContain(':hover')
        expect(css).toContain('!important')
      })
    })

    describe('Important with positional variants', () => {
      it('should work with first', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('!first:mt-0')
        const css = gen.toCSS(false)
        expect(css).toContain(':first-child')
        expect(css).toContain('!important')
      })

      it('should work with last', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('!last:mb-0')
        const css = gen.toCSS(false)
        expect(css).toContain(':last-child')
        expect(css).toContain('!important')
      })

      it('should work with odd', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('!odd:bg-gray-50')
        const css = gen.toCSS(false)
        expect(css).toContain(':nth-child(odd)')
        expect(css).toContain('!important')
      })

      it('should work with even', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('!even:bg-gray-100')
        const css = gen.toCSS(false)
        expect(css).toContain(':nth-child(even)')
        expect(css).toContain('!important')
      })
    })

    describe('Important with arbitrary values', () => {
      it('should work with arbitrary width', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('!w-[350px]')
        expect(gen.toCSS(false)).toContain('width: 350px !important;')
      })

      it('should work with arbitrary color', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('!bg-[#1a1a1a]')
        expect(gen.toCSS(false)).toContain('background-color: #1a1a1a !important;')
      })

      it('should work with arbitrary spacing', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('!gap-[2.5rem]')
        expect(gen.toCSS(false)).toContain('gap: 2.5rem !important;')
      })
    })

    describe('Important with complex combinations', () => {
      it('should work with responsive + hover + important', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('!md:hover:scale-110')
        const css = gen.toCSS(false)
        expect(css).toContain('@media')
        expect(css).toContain(':hover')
        expect(css).toContain('!important')
      })

      it('should work with dark + responsive + state', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('!dark:lg:focus:ring-2')
        const css = gen.toCSS(false)
        expect(css).toContain('.dark')
        expect(css).toContain('@media')
        expect(css).toContain(':focus')
        expect(css).toContain('!important')
      })

      it('should work with group + responsive + important', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('!sm:group-hover:opacity-100')
        const css = gen.toCSS(false)
        expect(css).toContain('@media')
        expect(css).toContain('.group:hover')
        expect(css).toContain('!important')
      })
    })

    describe('Important edge cases', () => {
      it('should handle important on negative values', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('!-m-4')
        expect(gen.toCSS(false)).toContain('margin: -1rem !important;')
      })

      it('should handle important with zero values', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('!p-0')
        expect(gen.toCSS(false)).toContain('padding: 0 !important;')
      })

      it('should handle important with fractional values', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('!w-1/2')
        expect(gen.toCSS(false)).toContain('width: 50% !important;')
      })

      it('should preserve important through multiple utilities', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('!p-4')
        gen.generate('!m-2')
        const css = gen.toCSS(false)
        expect(css).toContain('padding: 1rem !important;')
        expect(css).toContain('margin: 0.5rem !important;')
      })
    })

    describe('Extreme variant stacking', () => {
      it('should handle 10+ stacked variants', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('sm:md:lg:xl:2xl:hover:focus:active:dark:group-hover:w-4')
        const css = gen.toCSS(false)
        expect(css).toContain('width')
      })

      it('should handle duplicate variants', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('hover:hover:hover:bg-blue-500')
        const css = gen.toCSS(false)
        expect(css).toContain('background-color')
      })

      it('should handle conflicting responsive variants', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('sm:lg:md:xl:w-full')
        const css = gen.toCSS(false)
        // Should handle all variants even if order seems wrong
        expect(css.length).toBeGreaterThan(0)
      })

      it('should handle all pseudo-class variants together', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('hover:focus:active:visited:disabled:checked:bg-red-500')
        const css = gen.toCSS(false)
        expect(css).toContain(':hover')
        expect(css).toContain(':focus')
      })

      it('should handle mixing responsive and pseudo-elements', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('md:before:content-["test"]')
        gen.generate('lg:after:block')
        const css = gen.toCSS(false)
        expect(css).toContain('::before')
        expect(css).toContain('::after')
      })

      it('should handle group and peer variants together', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('group-hover:peer-focus:bg-blue-500')
        const css = gen.toCSS(false)
        // Complex stacking of group and peer variants
        // Generator handles these by applying the variants in order
        expect(css).toContain('background-color')
        expect(css).toContain('oklch(62.3% 0.214 259.815)')
      })

      it('should handle important with all variant types', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('!sm:hover:dark:first:bg-red-500')
        const css = gen.toCSS(false)
        expect(css).toContain('!important')
      })
    })
  })
})
