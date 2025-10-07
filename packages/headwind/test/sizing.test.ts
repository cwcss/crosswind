import { describe, expect, it } from 'bun:test'
import { defaultConfig } from '../src/config'
import { CSSGenerator } from '../src/generator'
import { parseClass } from '../src/parser'

describe('Sizing Utilities', () => {
  describe('Width', () => {
    it('should generate w-full', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('w-full')
      expect(gen.toCSS()).toContain('width: 100%;')
    })

    it('should generate w-screen', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('w-screen')
      expect(gen.toCSS()).toContain('width: 100vw;')
    })

    it('should generate w-auto', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('w-auto')
      expect(gen.toCSS()).toContain('width: auto;')
    })

    it('should generate w-min', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('w-min')
      expect(gen.toCSS()).toContain('width: min-content;')
    })

    it('should generate w-max', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('w-max')
      expect(gen.toCSS()).toContain('width: max-content;')
    })

    it('should generate w-fit', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('w-fit')
      expect(gen.toCSS()).toContain('width: fit-content;')
    })

    it('should support arbitrary width', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('w-[100px]')
      expect(gen.toCSS()).toContain('width: 100px;')
    })
  })

  describe('Height', () => {
    it('should generate h-full', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('h-full')
      expect(gen.toCSS()).toContain('height: 100%;')
    })

    it('should generate h-screen', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('h-screen')
      expect(gen.toCSS()).toContain('height: 100vh;')
    })

    it('should generate h-auto', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('h-auto')
      expect(gen.toCSS()).toContain('height: auto;')
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

    it('should generate 66.666% width for w-2/3', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('w-2/3')
      expect(gen.toCSS()).toContain('width: 66.66666666666666%;')
    })

    it('should generate 75% height for h-3/4', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('h-3/4')
      expect(gen.toCSS()).toContain('height: 75%;')
    })

    it('should handle improper fractions', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('w-5/3')
      expect(gen.toCSS()).toMatch(/width: 166\.666/)
    })

    it('should handle very large fraction denominator', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('w-1/10000')
      expect(gen.toCSS()).toContain('width: 0.01%;')
    })
  })

  describe('Min-width', () => {
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

    it('should generate min-w-min', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('min-w-min')
      expect(gen.toCSS()).toContain('min-width: min-content;')
    })

    it('should generate min-w-max', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('min-w-max')
      expect(gen.toCSS()).toContain('min-width: max-content;')
    })

    it('should generate min-w-fit', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('min-w-fit')
      expect(gen.toCSS()).toContain('min-width: fit-content;')
    })
  })

  describe('Max-width', () => {
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

    it('should generate max-w-none', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('max-w-none')
      expect(gen.toCSS()).toContain('max-width: none;')
    })

    it('should generate max-w-full', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('max-w-full')
      expect(gen.toCSS()).toContain('max-width: 100%;')
    })

    it('should handle max-w with arbitrary value', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('max-w-[1920px]')
      expect(gen.toCSS()).toContain('max-width: 1920px;')
    })
  })

  describe('Min-height', () => {
    it('should generate min-h-screen', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('min-h-screen')
      expect(gen.toCSS()).toContain('min-height: 100vh;')
    })

    it('should generate min-h-full', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('min-h-full')
      expect(gen.toCSS()).toContain('min-height: 100%;')
    })

    it('should handle min-h-screen on mobile', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('min-h-[100dvh]')
      expect(gen.toCSS()).toContain('min-height: 100dvh;')
    })
  })

  describe('Max-height', () => {
    it('should generate max-h-full', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('max-h-full')
      expect(gen.toCSS()).toContain('max-height: 100%;')
    })

    it('should generate max-h-screen', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('max-h-screen')
      expect(gen.toCSS()).toContain('max-height: 100vh;')
    })
  })
})

describe('Edge Cases', () => {
  describe('Width edge cases', () => {
    it('should handle w-0', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('w-0')
      expect(gen.toCSS()).toContain('width: 0;')
    })

    it('should handle w-px (1px)', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('w-px')
      expect(gen.toCSS()).toContain('width: 1px;')
    })

    it('should handle width with calc()', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('w-[calc(100vw-2rem)]')
      expect(gen.toCSS()).toContain('width: calc(100vw-2rem);')
    })

    it('should handle width with CSS variables', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('w-[var(--custom-width)]')
      expect(gen.toCSS()).toContain('width: var(--custom-width);')
    })

    it('should handle width with clamp()', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('w-[clamp(200px,50vw,600px)]')
      expect(gen.toCSS()).toContain('width: clamp(200px,50vw,600px);')
    })

    it('should handle width with min()', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('w-[min(100%,500px)]')
      expect(gen.toCSS()).toContain('width: min(100%,500px);')
    })

    it('should handle width with max()', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('w-[max(300px,50%)]')
      expect(gen.toCSS()).toContain('width: max(300px,50%);')
    })

    it('should handle width 100dvw', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('w-[100dvw]')
      expect(gen.toCSS()).toContain('width: 100dvw;')
    })

    it('should handle width with ch units', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('w-[80ch]')
      expect(gen.toCSS()).toContain('width: 80ch;')
    })
  })

  describe('Height edge cases', () => {
    it('should handle h-0', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('h-0')
      expect(gen.toCSS()).toContain('height: 0;')
    })

    it('should handle h-px', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('h-px')
      expect(gen.toCSS()).toContain('height: 1px;')
    })

    it('should handle height with svh units', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('h-[100svh]')
      expect(gen.toCSS()).toContain('height: 100svh;')
    })

    it('should handle height with dvh units', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('h-[100dvh]')
      expect(gen.toCSS()).toContain('height: 100dvh;')
    })

    it('should handle height with lvh units', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('h-[100lvh]')
      expect(gen.toCSS()).toContain('height: 100lvh;')
    })

    it('should handle height with calc()', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('h-[calc(100vh-80px)]')
      expect(gen.toCSS()).toContain('height: calc(100vh-80px);')
    })
  })

  describe('Fractional edge cases', () => {
    it('should handle w-1/12', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('w-1/12')
      expect(gen.toCSS()).toMatch(/width: 8\.333/)
    })

    it('should handle w-11/12', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('w-11/12')
      expect(gen.toCSS()).toMatch(/width: 91\.666/)
    })

    it('should handle w-full (100%)', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('w-full')
      expect(gen.toCSS()).toContain('width: 100%;')
    })

    it('should handle fraction with result > 100%', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('w-[5/4]')
      expect(gen.toCSS()).toContain('width: 125%;')
    })

    it('should handle very precise fraction', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('w-[1/7]')
      expect(gen.toCSS()).toMatch(/width: 14\.285/)
    })
  })

  describe('Min/Max edge cases', () => {
    it('should handle min-w-0', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('min-w-0')
      expect(gen.toCSS()).toContain('min-width: 0;')
    })

    it('should handle max-w-none', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('max-w-none')
      expect(gen.toCSS()).toContain('max-width: none;')
    })

    it('should handle min-h-0', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('min-h-0')
      expect(gen.toCSS()).toContain('min-height: 0;')
    })

    it('should handle max-h-none', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('max-h-none')
      expect(gen.toCSS()).toContain('max-height: none;')
    })

    it('should handle min-w with calc()', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('min-w-[calc(100%-40px)]')
      expect(gen.toCSS()).toContain('min-width: calc(100%-40px);')
    })

    it('should handle max-w with vw', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('max-w-[90vw]')
      expect(gen.toCSS()).toContain('max-width: 90vw;')
    })

    it('should handle min-h-screen', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('min-h-screen')
      expect(gen.toCSS()).toContain('min-height: 100vh;')
    })

    it('should handle max-h-screen', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('max-h-screen')
      expect(gen.toCSS()).toContain('max-height: 100vh;')
    })
  })

  describe('Size with variants', () => {
    it('should handle sizing with important', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('!w-full')
      expect(gen.toCSS()).toContain('width: 100% !important;')
    })

    it('should handle sizing with hover', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('hover:w-auto')
      const css = gen.toCSS()
      expect(css).toContain(':hover')
      expect(css).toContain('width: auto;')
    })

    it('should handle sizing with responsive', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('lg:w-1/2')
      const css = gen.toCSS()
      expect(css).toContain('@media (min-width: 1024px)')
      expect(css).toContain('width: 50%;')
    })
  })

  describe('Container query units', () => {
    it('should handle width with cqw', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('w-[50cqw]')
      expect(gen.toCSS()).toContain('width: 50cqw;')
    })

    it('should handle height with cqh', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('h-[80cqh]')
      expect(gen.toCSS()).toContain('height: 80cqh;')
    })
  })

  describe('Edge cases', () => {
    it('should handle fractional sizing', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('w-1/2')
      gen.generate('w-1/3')
      gen.generate('w-2/3')
      gen.generate('w-1/4')
      gen.generate('w-3/4')
      gen.generate('w-1/5')
      const css = gen.toCSS()
      expect(css).toContain('width')
    })

    it('should handle full width/height', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('w-full')
      gen.generate('h-full')
      const css = gen.toCSS()
      expect(css).toContain('100%')
    })

    it('should handle screen width/height', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('w-screen')
      gen.generate('h-screen')
      const css = gen.toCSS()
      expect(css).toContain('100v')
    })

    it('should handle min/max content sizing', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('w-min')
      gen.generate('w-max')
      gen.generate('w-fit')
      const css = gen.toCSS()
      expect(css).toContain('content')
    })

    it('should handle auto sizing', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('w-auto')
      gen.generate('h-auto')
      const css = gen.toCSS()
      expect(css).toContain('auto')
    })
  })
})
