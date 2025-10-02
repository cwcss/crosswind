import { describe, expect, it } from 'bun:test'
import { CSSGenerator } from '../src/generator'
import { parseClass } from '../src/parser'
import { defaultConfig } from '../src/config'

describe('Advanced Features', () => {
  describe('Negative values', () => {
    it('should parse negative margin', () => {
      const result = parseClass('-m-4')
      expect(result).toEqual({
        raw: '-m-4',
        variants: [],
        utility: 'm',
        value: '-4',
        important: false,
        arbitrary: false,
      })
    })

    it('should parse negative top position', () => {
      const result = parseClass('-top-4')
      expect(result).toEqual({
        raw: '-top-4',
        variants: [],
        utility: 'top',
        value: '-4',
        important: false,
        arbitrary: false,
      })
    })

    it('should parse negative translate-x', () => {
      const result = parseClass('-translate-x-4')
      expect(result).toEqual({
        raw: '-translate-x-4',
        variants: [],
        utility: 'translate-x',
        value: '-4',
        important: false,
        arbitrary: false,
      })
    })

    it('should generate negative margin CSS', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('-m-4')
      expect(gen.toCSS()).toContain('margin: -1rem;')
    })

    it('should generate negative translate-x CSS', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('-translate-x-4')
      expect(gen.toCSS()).toContain('transform: translateX(-1rem);')
    })
  })

  describe('Fractional values', () => {
    it('should parse fractional width', () => {
      const result = parseClass('w-1/2')
      expect(result).toEqual({
        raw: 'w-1/2',
        variants: [],
        utility: 'w',
        value: '1/2',
        important: false,
        arbitrary: false,
      })
    })

    it('should parse fractional width 1/3', () => {
      const result = parseClass('w-1/3')
      expect(result).toEqual({
        raw: 'w-1/3',
        variants: [],
        utility: 'w',
        value: '1/3',
        important: false,
        arbitrary: false,
      })
    })

    it('should parse fractional height', () => {
      const result = parseClass('h-3/4')
      expect(result).toEqual({
        raw: 'h-3/4',
        variants: [],
        utility: 'h',
        value: '3/4',
        important: false,
        arbitrary: false,
      })
    })

    it('should generate 50% width for w-1/2', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('w-1/2')
      expect(gen.toCSS()).toContain('width: 50%;')
    })

    it('should generate 33.333% width for w-1/3', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('w-1/3')
      expect(gen.toCSS()).toContain('width: 33.33333333333333%;')
    })

    it('should generate 75% height for h-3/4', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('h-3/4')
      expect(gen.toCSS()).toContain('height: 75%;')
    })

    it('should support w-2/3', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('w-2/3')
      expect(gen.toCSS()).toContain('width: 66.66666666666666%;')
    })
  })

  describe('Min/Max sizing', () => {
    it('should generate min-w-0', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('min-w-0')
      expect(gen.toCSS()).toContain('min-width: 0;')
    })

    it('should generate min-w-full', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('min-w-full')
      expect(gen.toCSS()).toContain('min-width: 100%;')
    })

    it('should generate max-w-xl', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('max-w-xl')
      expect(gen.toCSS()).toContain('max-width: 36rem;')
    })

    it('should generate max-w-screen', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('max-w-screen')
      expect(gen.toCSS()).toContain('max-width: 100vw;')
    })

    it('should generate min-h-screen', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('min-h-screen')
      expect(gen.toCSS()).toContain('min-height: 100vh;')
    })

    it('should generate max-h-full', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('max-h-full')
      expect(gen.toCSS()).toContain('max-height: 100%;')
    })
  })

  describe('Ring utilities', () => {
    it('should generate default ring', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('ring')
      const css = gen.toCSS()
      expect(css).toContain('--tw-ring-shadow')
      expect(css).toContain('box-shadow')
    })

    it('should generate ring-2', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('ring-2')
      const css = gen.toCSS()
      expect(css).toContain('2px')
    })

    it('should generate ring-offset-2', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('ring-offset-2')
      const css = gen.toCSS()
      expect(css).toContain('--tw-ring-offset-width: 2px;')
    })
  })

  describe('Space utilities', () => {
    it('should generate space-x-4', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('space-x-4')
      const css = gen.toCSS()
      expect(css).toContain('--tw-space-x-reverse')
      expect(css).toContain('margin-right')
      expect(css).toContain('margin-left')
      expect(css).toContain('> :not([hidden]) ~ :not([hidden])')
    })

    it('should generate space-y-2', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('space-y-2')
      const css = gen.toCSS()
      expect(css).toContain('--tw-space-y-reverse')
      expect(css).toContain('margin-top')
      expect(css).toContain('margin-bottom')
      expect(css).toContain('> :not([hidden]) ~ :not([hidden])')
    })
  })

  describe('Divide utilities', () => {
    it('should generate divide-x', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('divide-x')
      const css = gen.toCSS()
      expect(css).toContain('--tw-divide-x-reverse')
      expect(css).toContain('border-right-width')
      expect(css).toContain('border-left-width')
      expect(css).toContain('> :not([hidden]) ~ :not([hidden])')
    })

    it('should generate divide-y-2', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('divide-y-2')
      const css = gen.toCSS()
      expect(css).toContain('--tw-divide-y-reverse')
      expect(css).toContain('2px')
      expect(css).toContain('> :not([hidden]) ~ :not([hidden])')
    })
  })

  describe('Gradient stops', () => {
    it('should generate from-blue-500', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('from-gray-500')
      const css = gen.toCSS()
      expect(css).toContain('--tw-gradient-from')
      expect(css).toContain('#6b7280')
    })

    it('should generate via color', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('via-gray-400')
      const css = gen.toCSS()
      expect(css).toContain('--tw-gradient-stops')
      expect(css).toContain('#9ca3af')
    })

    it('should generate to color', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('to-gray-300')
      const css = gen.toCSS()
      expect(css).toContain('--tw-gradient-to')
      expect(css).toContain('#d1d5db')
    })
  })

  describe('Flex order and basis', () => {
    it('should generate order-1', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('order-1')
      expect(gen.toCSS()).toContain('order: 1;')
    })

    it('should generate order-first', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('order-first')
      expect(gen.toCSS()).toContain('order: -9999;')
    })

    it('should generate order-last', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('order-last')
      expect(gen.toCSS()).toContain('order: 9999;')
    })

    it('should generate basis-1/2', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('basis-1/2')
      expect(gen.toCSS()).toContain('flex-basis: 50%;')
    })

    it('should generate basis-auto', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('basis-auto')
      expect(gen.toCSS()).toContain('flex-basis: auto;')
    })

    it('should generate basis-full', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('basis-full')
      expect(gen.toCSS()).toContain('flex-basis: 100%;')
    })
  })

  describe('Justify-self and align-self', () => {
    it('should generate justify-self-start', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('justify-self-start')
      expect(gen.toCSS()).toContain('justify-self: start;')
    })

    it('should generate justify-self-center', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('justify-self-center')
      expect(gen.toCSS()).toContain('justify-self: center;')
    })

    it('should generate self-start', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('self-start')
      expect(gen.toCSS()).toContain('align-self: flex-start;')
    })

    it('should generate self-center', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('self-center')
      expect(gen.toCSS()).toContain('align-self: center;')
    })
  })

  describe('Container utility', () => {
    it('should generate container with auto margins', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('container')
      const css = gen.toCSS()
      expect(css).toContain('width: 100%;')
      expect(css).toContain('margin-left: auto;')
      expect(css).toContain('margin-right: auto;')
      // TODO: Responsive max-widths require nested media query support
    })
  })

  describe('Arbitrary properties', () => {
    it('should parse arbitrary property', () => {
      const result = parseClass('[color:red]')
      expect(result).toEqual({
        raw: '[color:red]',
        variants: [],
        utility: 'color',
        value: 'red',
        important: false,
        arbitrary: true,
      })
    })

    it('should parse arbitrary property with dashes', () => {
      const result = parseClass('[mask-type:luminance]')
      expect(result).toEqual({
        raw: '[mask-type:luminance]',
        variants: [],
        utility: 'mask-type',
        value: 'luminance',
        important: false,
        arbitrary: true,
      })
    })

    it('should generate arbitrary property CSS', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('[display:grid]')
      expect(gen.toCSS()).toContain('display: grid;')
    })

    it('should generate arbitrary property with dashes', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('[mask-type:alpha]')
      expect(gen.toCSS()).toContain('mask-type: alpha;')
    })
  })

  describe('Group variants', () => {
    it('should generate group-hover', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('group-hover:bg-gray-500')
      const css = gen.toCSS()
      expect(css).toContain('.group:hover')
      expect(css).toContain('background-color: #6b7280;')
    })

    it('should generate group-focus', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('group-focus:text-gray-800')
      const css = gen.toCSS()
      expect(css).toContain('.group:focus')
      expect(css).toContain('color: #1f2937;')
    })
  })

  describe('Peer variants', () => {
    it('should generate peer-checked', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('peer-checked:bg-gray-500')
      const css = gen.toCSS()
      expect(css).toContain('.peer:checked')
      expect(css).toContain('background-color: #6b7280;')
    })

    it('should generate peer-focus', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('peer-focus:border-gray-300')
      const css = gen.toCSS()
      expect(css).toContain('.peer:focus')
      expect(css).toContain('border-color: #d1d5db;')
    })
  })

  describe('Pseudo-element variants', () => {
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
  })

  describe('Positional variants', () => {
    it('should generate first variant', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('first:bg-gray-500')
      const css = gen.toCSS()
      expect(css).toContain(':first-child')
      expect(css).toContain('background-color: #6b7280;')
    })

    it('should generate last variant', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('last:border-gray-300')
      const css = gen.toCSS()
      expect(css).toContain(':last-child')
    })

    it('should generate odd variant', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('odd:bg-gray-50')
      const css = gen.toCSS()
      expect(css).toContain(':nth-child(odd)')
      expect(css).toContain('background-color: #f9fafb;')
    })

    it('should generate even variant', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('even:bg-gray-100')
      const css = gen.toCSS()
      expect(css).toContain(':nth-child(even)')
      expect(css).toContain('background-color: #f3f4f6;')
    })

    it('should generate first-of-type variant', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('first-of-type:mt-0')
      const css = gen.toCSS()
      expect(css).toContain(':first-of-type')
    })

    it('should generate last-of-type variant', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('last-of-type:mb-0')
      const css = gen.toCSS()
      expect(css).toContain(':last-of-type')
    })
  })

  describe('State variants', () => {
    it('should generate visited variant', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('visited:text-gray-500')
      const css = gen.toCSS()
      expect(css).toContain(':visited')
      expect(css).toContain('color: #6b7280;')
    })

    it('should generate checked variant', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('checked:bg-gray-500')
      const css = gen.toCSS()
      expect(css).toContain(':checked')
    })

    it('should generate focus-within variant', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('focus-within:border-gray-300')
      const css = gen.toCSS()
      expect(css).toContain(':focus-within')
    })

    it('should generate focus-visible variant', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('focus-visible:ring')
      const css = gen.toCSS()
      expect(css).toContain(':focus-visible')
    })
  })

  describe('Media query variants', () => {
    it('should generate print variant', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('print:hidden')
      const css = gen.toCSS()
      expect(css).toContain('@media print')
      expect(css).toContain('display: none;')
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

  describe('Dark mode variant', () => {
    it('should generate dark variant', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('dark:bg-gray-900')
      const css = gen.toCSS()
      expect(css).toContain('.dark')
      expect(css).toContain('background-color: #111827;')
    })
  })

  describe('Combined variants', () => {
    it('should handle responsive + hover + pseudo-element', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('md:hover:before:block')
      const css = gen.toCSS()
      expect(css).toContain('@media (min-width: 768px)')
      expect(css).toContain(':hover')
      expect(css).toContain('::before')
      expect(css).toContain('display: block;')
    })

    it('should handle group + responsive + state', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('lg:group-hover:first:bg-gray-500')
      const css = gen.toCSS()
      expect(css).toContain('@media (min-width: 1024px)')
      expect(css).toContain('.group:hover')
      expect(css).toContain(':first-child')
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

  describe('Preflight CSS', () => {
    it('should include preflight CSS in output', () => {
      const gen = new CSSGenerator(defaultConfig)
      const css = gen.toCSS()
      expect(css).toContain('box-sizing: border-box')
      expect(css).toContain('border-width: 0')
    })
  })
})
