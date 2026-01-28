import { describe, expect, it } from 'bun:test'
import { defaultConfig } from '../src/config'
import { CSSGenerator } from '../src/generator'

describe('Flexbox Utilities', () => {
  describe('Display', () => {
    it('should generate flex', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('flex')
      expect(gen.toCSS(false)).toContain('display: flex;')
    })

    it('should generate inline-flex', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('inline-flex')
      expect(gen.toCSS(false)).toContain('display: inline-flex;')
    })
  })

  describe('Direction', () => {
    it('should generate flex-row', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('flex-row')
      expect(gen.toCSS(false)).toContain('flex-direction: row;')
    })

    it('should generate flex-row-reverse', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('flex-row-reverse')
      expect(gen.toCSS(false)).toContain('flex-direction: row-reverse;')
    })

    it('should generate flex-col', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('flex-col')
      expect(gen.toCSS(false)).toContain('flex-direction: column;')
    })

    it('should generate flex-col-reverse', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('flex-col-reverse')
      expect(gen.toCSS(false)).toContain('flex-direction: column-reverse;')
    })
  })

  describe('Wrap', () => {
    it('should generate flex-wrap', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('flex-wrap')
      expect(gen.toCSS(false)).toContain('flex-wrap: wrap;')
    })

    it('should generate flex-wrap-reverse', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('flex-wrap-reverse')
      expect(gen.toCSS(false)).toContain('flex-wrap: wrap-reverse;')
    })

    it('should generate flex-nowrap', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('flex-nowrap')
      expect(gen.toCSS(false)).toContain('flex-wrap: nowrap;')
    })
  })

  describe('Justify Content', () => {
    it('should generate justify-start', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('justify-start')
      expect(gen.toCSS(false)).toContain('justify-content: flex-start;')
    })

    it('should generate justify-end', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('justify-end')
      expect(gen.toCSS(false)).toContain('justify-content: flex-end;')
    })

    it('should generate justify-center', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('justify-center')
      expect(gen.toCSS(false)).toContain('justify-content: center;')
    })

    it('should generate justify-between', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('justify-between')
      expect(gen.toCSS(false)).toContain('justify-content: space-between;')
    })

    it('should generate justify-around', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('justify-around')
      expect(gen.toCSS(false)).toContain('justify-content: space-around;')
    })

    it('should generate justify-evenly', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('justify-evenly')
      expect(gen.toCSS(false)).toContain('justify-content: space-evenly;')
    })
  })

  describe('Align Items', () => {
    it('should generate items-start', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('items-start')
      expect(gen.toCSS(false)).toContain('align-items: flex-start;')
    })

    it('should generate items-end', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('items-end')
      expect(gen.toCSS(false)).toContain('align-items: flex-end;')
    })

    it('should generate items-center', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('items-center')
      expect(gen.toCSS(false)).toContain('align-items: center;')
    })

    it('should generate items-baseline', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('items-baseline')
      expect(gen.toCSS(false)).toContain('align-items: baseline;')
    })

    it('should generate items-stretch', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('items-stretch')
      expect(gen.toCSS(false)).toContain('align-items: stretch;')
    })
  })

  describe('Align Self', () => {
    it('should generate self-start', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('self-start')
      expect(gen.toCSS(false)).toContain('align-self: flex-start;')
    })

    it('should generate self-center', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('self-center')
      expect(gen.toCSS(false)).toContain('align-self: center;')
    })

    it('should generate self-end', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('self-end')
      expect(gen.toCSS(false)).toContain('align-self: flex-end;')
    })
  })

  describe('Flex', () => {
    it('should generate flex-1', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('flex-1')
      expect(gen.toCSS(false)).toContain('flex: 1 1 0%;')
    })

    it('should generate flex-auto', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('flex-auto')
      expect(gen.toCSS(false)).toContain('flex: 1 1 auto;')
    })

    it('should generate flex-initial', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('flex-initial')
      expect(gen.toCSS(false)).toContain('flex: 0 1 auto;')
    })

    it('should generate flex-none', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('flex-none')
      expect(gen.toCSS(false)).toContain('flex: none;')
    })
  })

  describe('Order', () => {
    it('should generate order-1', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('order-1')
      expect(gen.toCSS(false)).toContain('order: 1;')
    })

    it('should generate order-first', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('order-first')
      expect(gen.toCSS(false)).toContain('order: -9999;')
    })

    it('should generate order-last', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('order-last')
      expect(gen.toCSS(false)).toContain('order: 9999;')
    })

    it('should generate order-none', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('order-none')
      expect(gen.toCSS(false)).toContain('order: 0;')
    })

    it('should generate order with arbitrary value', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('order-[99]')
      expect(gen.toCSS(false)).toContain('order: 99;')
    })
  })

  describe('Flex Basis', () => {
    it('should generate basis-1/2', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('basis-1/2')
      expect(gen.toCSS(false)).toContain('flex-basis: 50%;')
    })

    it('should generate basis-auto', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('basis-auto')
      expect(gen.toCSS(false)).toContain('flex-basis: auto;')
    })

    it('should generate basis-full', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('basis-full')
      expect(gen.toCSS(false)).toContain('flex-basis: 100%;')
    })

    it('should generate basis-0', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('basis-0')
      expect(gen.toCSS(false)).toContain('flex-basis: 0;')
    })

    it('should handle basis with very small fraction', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('basis-1/100')
      expect(gen.toCSS(false)).toContain('flex-basis: 1%;')
    })

    it('should handle basis with calc', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('basis-[calc(50%-1rem)]')
      expect(gen.toCSS(false)).toContain('flex-basis: calc(50%-1rem);')
    })
  })

  describe('Justify Self', () => {
    it('should generate justify-self-start', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('justify-self-start')
      expect(gen.toCSS(false)).toContain('justify-self: start;')
    })

    it('should generate justify-self-center', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('justify-self-center')
      expect(gen.toCSS(false)).toContain('justify-self: center;')
    })

    it('should generate justify-self-end', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('justify-self-end')
      expect(gen.toCSS(false)).toContain('justify-self: end;')
    })
  })
})

describe('Edge Cases', () => {
  describe('Gap utilities', () => {
    it('should generate gap-4', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('gap-4')
      expect(gen.toCSS(false)).toContain('gap: 1rem;')
    })

    it('should generate gap-x-2', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('gap-x-2')
      expect(gen.toCSS(false)).toContain('column-gap: 0.5rem;')
    })

    it('should generate gap-y-8', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('gap-y-8')
      expect(gen.toCSS(false)).toContain('row-gap: 2rem;')
    })

    it('should handle gap-0', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('gap-0')
      expect(gen.toCSS(false)).toContain('gap: 0;')
    })

    it('should handle gap-px', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('gap-px')
      expect(gen.toCSS(false)).toContain('gap: 1px;')
    })

    it('should handle gap with arbitrary value', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('gap-[2.5rem]')
      expect(gen.toCSS(false)).toContain('gap: 2.5rem;')
    })
  })

  describe('Flex grow and shrink', () => {
    it('should generate flex-grow', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('flex-grow')
      expect(gen.toCSS(false)).toContain('flex-grow: 1;')
    })

    it('should generate flex-grow-0', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('flex-grow-0')
      expect(gen.toCSS(false)).toContain('flex-grow: 0;')
    })

    it('should generate flex-shrink', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('flex-shrink')
      expect(gen.toCSS(false)).toContain('flex-shrink: 1;')
    })

    it('should generate flex-shrink-0', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('flex-shrink-0')
      expect(gen.toCSS(false)).toContain('flex-shrink: 0;')
    })

    it('should handle arbitrary grow value', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('flex-grow-[2]')
      expect(gen.toCSS(false)).toContain('flex-grow: 2;')
    })

    it('should handle arbitrary shrink value', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('flex-shrink-[3]')
      expect(gen.toCSS(false)).toContain('flex-shrink: 3;')
    })
  })

  describe('Align content', () => {
    it('should generate content-normal', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('content-normal')
      expect(gen.toCSS(false)).toContain('align-content: normal;')
    })

    it('should generate content-center', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('content-center')
      expect(gen.toCSS(false)).toContain('align-content: center;')
    })

    it('should generate content-start', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('content-start')
      expect(gen.toCSS(false)).toContain('align-content: flex-start;')
    })

    it('should generate content-end', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('content-end')
      expect(gen.toCSS(false)).toContain('align-content: flex-end;')
    })

    it('should generate content-between', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('content-between')
      expect(gen.toCSS(false)).toContain('align-content: space-between;')
    })

    it('should generate content-around', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('content-around')
      expect(gen.toCSS(false)).toContain('align-content: space-around;')
    })

    it('should generate content-evenly', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('content-evenly')
      expect(gen.toCSS(false)).toContain('align-content: space-evenly;')
    })

    it('should generate content-baseline', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('content-baseline')
      expect(gen.toCSS(false)).toContain('align-content: baseline;')
    })

    it('should generate content-stretch', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('content-stretch')
      expect(gen.toCSS(false)).toContain('align-content: stretch;')
    })
  })

  describe('Justify items', () => {
    it('should generate justify-items-start', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('justify-items-start')
      expect(gen.toCSS(false)).toContain('justify-items: start;')
    })

    it('should generate justify-items-end', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('justify-items-end')
      expect(gen.toCSS(false)).toContain('justify-items: end;')
    })

    it('should generate justify-items-center', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('justify-items-center')
      expect(gen.toCSS(false)).toContain('justify-items: center;')
    })

    it('should generate justify-items-stretch', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('justify-items-stretch')
      expect(gen.toCSS(false)).toContain('justify-items: stretch;')
    })
  })

  describe('Order edge cases', () => {
    it('should handle negative order', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('order-[-1]')
      expect(gen.toCSS(false)).toContain('order: -1;')
    })

    it('should handle very large order', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('order-[999999]')
      expect(gen.toCSS(false)).toContain('order: 999999;')
    })

    it('should handle order-2 through order-12', () => {
      const gen = new CSSGenerator(defaultConfig)
      for (let i = 2; i <= 12; i++) {
        gen.generate(`order-${i}`)
      }
      const css = gen.toCSS(false)
      expect(css).toBeDefined()
    })
  })

  describe('Flex basis edge cases', () => {
    it('should handle basis with spacing values', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('basis-4')
      expect(gen.toCSS(false)).toContain('flex-basis: 1rem;')
    })

    it('should handle basis-px', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('basis-px')
      expect(gen.toCSS(false)).toContain('flex-basis: 1px;')
    })

    it('should handle basis with CSS variables', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('basis-[var(--basis-width)]')
      expect(gen.toCSS(false)).toContain('flex-basis: var(--basis-width);')
    })

    it('should handle basis with min()', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('basis-[min(50%,300px)]')
      expect(gen.toCSS(false)).toContain('flex-basis: min(50%,300px);')
    })

    it('should handle basis with clamp()', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('basis-[clamp(100px,50%,500px)]')
      expect(gen.toCSS(false)).toContain('flex-basis: clamp(100px,50%,500px);')
    })
  })

  describe('Arbitrary values', () => {
    it('should handle arbitrary flex direction', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('flex-[0_1_250px]')
      expect(gen.toCSS(false)).toContain('flex: 0 1 250px;')
    })

    it('should handle arbitrary justify-content', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('justify-[flex-start]')
      expect(gen.toCSS(false)).toContain('justify-content: flex-start;')
    })

    it('should handle arbitrary align-items', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('items-[baseline]')
      expect(gen.toCSS(false)).toContain('align-items: baseline;')
    })
  })

  describe('Flexbox with variants', () => {
    it('should handle flex with hover', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('hover:flex')
      const css = gen.toCSS(false)
      expect(css).toContain(':hover')
      expect(css).toContain('display: flex;')
    })

    it('should handle flex-direction with responsive', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('md:flex-col')
      const css = gen.toCSS(false)
      expect(css).toContain('@media (min-width: 768px)')
      expect(css).toContain('flex-direction: column;')
    })

    it('should handle gap with important', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('!gap-4')
      expect(gen.toCSS(false)).toContain('gap: 1rem !important;')
    })

    it('should handle justify-content with dark mode', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('dark:justify-center')
      const css = gen.toCSS(false)
      expect(css).toContain('.dark')
      expect(css).toContain('justify-content: center;')
    })

    it('should handle multiple variant combinations', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('lg:hover:flex-row')
      const css = gen.toCSS(false)
      expect(css).toContain('@media (min-width: 1024px)')
      expect(css).toContain(':hover')
      expect(css).toContain('flex-direction: row;')
    })
  })

  describe('Align self edge cases', () => {
    it('should generate self-auto', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('self-auto')
      expect(gen.toCSS(false)).toContain('align-self: auto;')
    })

    it('should generate self-stretch', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('self-stretch')
      expect(gen.toCSS(false)).toContain('align-self: stretch;')
    })

    it('should generate self-baseline', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('self-baseline')
      expect(gen.toCSS(false)).toContain('align-self: baseline;')
    })
  })

  describe('Place content', () => {
    it('should generate place-content-center', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('place-content-center')
      expect(gen.toCSS(false)).toContain('place-content: center;')
    })

    it('should generate place-content-start', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('place-content-start')
      expect(gen.toCSS(false)).toContain('place-content: start;')
    })

    it('should generate place-content-end', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('place-content-end')
      expect(gen.toCSS(false)).toContain('place-content: end;')
    })

    it('should generate place-content-between', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('place-content-between')
      expect(gen.toCSS(false)).toContain('place-content: space-between;')
    })

    it('should generate place-content-around', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('place-content-around')
      expect(gen.toCSS(false)).toContain('place-content: space-around;')
    })

    it('should generate place-content-evenly', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('place-content-evenly')
      expect(gen.toCSS(false)).toContain('place-content: space-evenly;')
    })

    it('should generate place-content-stretch', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('place-content-stretch')
      expect(gen.toCSS(false)).toContain('place-content: stretch;')
    })
  })

  describe('Place items', () => {
    it('should generate place-items-center', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('place-items-center')
      expect(gen.toCSS(false)).toContain('place-items: center;')
    })

    it('should generate place-items-start', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('place-items-start')
      expect(gen.toCSS(false)).toContain('place-items: start;')
    })

    it('should generate place-items-end', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('place-items-end')
      expect(gen.toCSS(false)).toContain('place-items: end;')
    })

    it('should generate place-items-stretch', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('place-items-stretch')
      expect(gen.toCSS(false)).toContain('place-items: stretch;')
    })
  })

  describe('Place self', () => {
    it('should generate place-self-center', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('place-self-center')
      expect(gen.toCSS(false)).toContain('place-self: center;')
    })

    it('should generate place-self-start', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('place-self-start')
      expect(gen.toCSS(false)).toContain('place-self: start;')
    })

    it('should generate place-self-end', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('place-self-end')
      expect(gen.toCSS(false)).toContain('place-self: end;')
    })

    it('should generate place-self-auto', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('place-self-auto')
      expect(gen.toCSS(false)).toContain('place-self: auto;')
    })

    it('should generate place-self-stretch', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('place-self-stretch')
      expect(gen.toCSS(false)).toContain('place-self: stretch;')
    })
  })
})
