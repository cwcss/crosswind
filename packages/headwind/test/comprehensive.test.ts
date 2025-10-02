import { describe, expect, it } from 'bun:test'
import { CSSGenerator } from '../src/generator'
import { defaultConfig } from '../src/config'

describe('Comprehensive Utility Tests', () => {
  describe('Layout utilities', () => {
    it('should generate aspect-ratio', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('aspect-square')
      expect(gen.toCSS()).toContain('aspect-ratio: 1 / 1;')
    })

    it('should generate position utilities', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('absolute')
      gen.generate('relative')
      const css = gen.toCSS()
      expect(css).toContain('position: absolute;')
      expect(css).toContain('position: relative;')
    })

    it('should generate inset utilities', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('top-4')
      expect(gen.toCSS()).toContain('top: 1rem;')
    })

    it('should generate z-index', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('z-10')
      expect(gen.toCSS()).toContain('z-index: 10;')
    })

    it('should generate overflow utilities', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('overflow-hidden')
      expect(gen.toCSS()).toContain('overflow: hidden;')
    })
  })

  describe('Grid utilities', () => {
    it('should generate grid-cols', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('grid-cols-3')
      expect(gen.toCSS()).toContain('grid-template-columns: repeat(3, minmax(0, 1fr));')
    })

    it('should generate grid-rows', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('grid-rows-2')
      expect(gen.toCSS()).toContain('grid-template-rows: repeat(2, minmax(0, 1fr));')
    })

    it('should generate gap', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('gap-4')
      expect(gen.toCSS()).toContain('gap: 1rem;')
    })
  })

  describe('Typography utilities', () => {
    it('should generate text-transform', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('uppercase')
      expect(gen.toCSS()).toContain('text-transform: uppercase;')
    })

    it('should generate text-decoration', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('underline')
      expect(gen.toCSS()).toContain('text-decoration-line: underline;')
    })

    it('should generate font-style', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('italic')
      expect(gen.toCSS()).toContain('font-style: italic;')
    })

    it('should generate white-space', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('whitespace-nowrap')
      expect(gen.toCSS()).toContain('white-space: nowrap;')
    })
  })

  describe('Transform utilities', () => {
    it('should generate scale', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('scale-150')
      expect(gen.toCSS()).toContain('transform: scale(1.5);')
    })

    it('should generate rotate', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('rotate-45')
      expect(gen.toCSS()).toContain('transform: rotate(45deg);')
    })

    it('should generate translate', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('translate-x-4')
      expect(gen.toCSS()).toContain('transform: translateX(1rem);')
    })
  })

  describe('Transition utilities', () => {
    it('should generate transition-all', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('transition-all')
      expect(gen.toCSS()).toContain('transition-property: all;')
    })

    it('should generate duration', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('duration-300')
      expect(gen.toCSS()).toContain('transition-duration: 300ms;')
    })
  })

  describe('Effect utilities', () => {
    it('should generate opacity', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('opacity-50')
      expect(gen.toCSS()).toContain('opacity: 0.5;')
    })

    it('should generate background utilities', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('bg-cover')
      expect(gen.toCSS()).toContain('background-size: cover;')
    })
  })

  describe('Filter utilities', () => {
    it('should generate blur', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('blur-sm')
      expect(gen.toCSS()).toContain('filter: blur(4px);')
    })

    it('should generate grayscale', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('grayscale-100')
      expect(gen.toCSS()).toContain('filter: grayscale(1);')
    })
  })

  describe('Interactivity utilities', () => {
    it('should generate cursor', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('cursor-pointer')
      expect(gen.toCSS()).toContain('cursor: pointer;')
    })

    it('should generate pointer-events', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('pointer-events-none')
      expect(gen.toCSS()).toContain('pointer-events: none;')
    })

    it('should generate user-select', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('select-none')
      expect(gen.toCSS()).toContain('user-select: none;')
    })
  })

  describe('Arbitrary values', () => {
    it('should support arbitrary width', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('w-[100px]')
      expect(gen.toCSS()).toContain('width: 100px;')
    })

    it('should support arbitrary color', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('bg-[#ff0000]')
      expect(gen.toCSS()).toContain('background-color: #ff0000;')
    })

    it('should support arbitrary padding', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('p-[2.5rem]')
      expect(gen.toCSS()).toContain('padding: 2.5rem;')
    })
  })

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
  })

  describe('SVG utilities', () => {
    it('should generate fill utilities', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('fill-current')
      expect(gen.toCSS()).toContain('fill: currentColor;')
    })

    it('should generate stroke utilities', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('stroke-current')
      expect(gen.toCSS()).toContain('stroke: currentColor;')
    })
  })

  describe('Table utilities', () => {
    it('should generate border-collapse', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('border-collapse')
      expect(gen.toCSS()).toContain('border-collapse: collapse;')
    })

    it('should generate table-layout', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('table-fixed')
      expect(gen.toCSS()).toContain('table-layout: fixed;')
    })
  })
})
