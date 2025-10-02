import { describe, expect, it } from 'bun:test'
import { CSSGenerator } from '../src/generator'
import { defaultConfig } from '../src/config'

describe('Flexbox Utilities', () => {
  describe('Display', () => {
    it('should generate flex', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('flex')
      expect(gen.toCSS()).toContain('display: flex;')
    })

    it('should generate inline-flex', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('inline-flex')
      expect(gen.toCSS()).toContain('display: inline-flex;')
    })
  })

  describe('Direction', () => {
    it('should generate flex-row', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('flex-row')
      expect(gen.toCSS()).toContain('flex-direction: row;')
    })

    it('should generate flex-row-reverse', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('flex-row-reverse')
      expect(gen.toCSS()).toContain('flex-direction: row-reverse;')
    })

    it('should generate flex-col', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('flex-col')
      expect(gen.toCSS()).toContain('flex-direction: column;')
    })

    it('should generate flex-col-reverse', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('flex-col-reverse')
      expect(gen.toCSS()).toContain('flex-direction: column-reverse;')
    })
  })

  describe('Wrap', () => {
    it('should generate flex-wrap', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('flex-wrap')
      expect(gen.toCSS()).toContain('flex-wrap: wrap;')
    })

    it('should generate flex-wrap-reverse', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('flex-wrap-reverse')
      expect(gen.toCSS()).toContain('flex-wrap: wrap-reverse;')
    })

    it('should generate flex-nowrap', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('flex-nowrap')
      expect(gen.toCSS()).toContain('flex-wrap: nowrap;')
    })
  })

  describe('Justify Content', () => {
    it('should generate justify-start', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('justify-start')
      expect(gen.toCSS()).toContain('justify-content: flex-start;')
    })

    it('should generate justify-end', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('justify-end')
      expect(gen.toCSS()).toContain('justify-content: flex-end;')
    })

    it('should generate justify-center', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('justify-center')
      expect(gen.toCSS()).toContain('justify-content: center;')
    })

    it('should generate justify-between', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('justify-between')
      expect(gen.toCSS()).toContain('justify-content: space-between;')
    })

    it('should generate justify-around', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('justify-around')
      expect(gen.toCSS()).toContain('justify-content: space-around;')
    })

    it('should generate justify-evenly', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('justify-evenly')
      expect(gen.toCSS()).toContain('justify-content: space-evenly;')
    })
  })

  describe('Align Items', () => {
    it('should generate items-start', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('items-start')
      expect(gen.toCSS()).toContain('align-items: flex-start;')
    })

    it('should generate items-end', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('items-end')
      expect(gen.toCSS()).toContain('align-items: flex-end;')
    })

    it('should generate items-center', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('items-center')
      expect(gen.toCSS()).toContain('align-items: center;')
    })

    it('should generate items-baseline', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('items-baseline')
      expect(gen.toCSS()).toContain('align-items: baseline;')
    })

    it('should generate items-stretch', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('items-stretch')
      expect(gen.toCSS()).toContain('align-items: stretch;')
    })
  })

  describe('Align Self', () => {
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

    it('should generate self-end', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('self-end')
      expect(gen.toCSS()).toContain('align-self: flex-end;')
    })
  })

  describe('Flex', () => {
    it('should generate flex-1', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('flex-1')
      expect(gen.toCSS()).toContain('flex: 1 1 0%;')
    })

    it('should generate flex-auto', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('flex-auto')
      expect(gen.toCSS()).toContain('flex: 1 1 auto;')
    })

    it('should generate flex-initial', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('flex-initial')
      expect(gen.toCSS()).toContain('flex: 0 1 auto;')
    })

    it('should generate flex-none', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('flex-none')
      expect(gen.toCSS()).toContain('flex: none;')
    })
  })

  describe('Order', () => {
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

    it('should generate order-none', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('order-none')
      expect(gen.toCSS()).toContain('order: 0;')
    })

    it('should generate order with arbitrary value', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('order-[99]')
      expect(gen.toCSS()).toContain('order: 99;')
    })
  })

  describe('Flex Basis', () => {
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

    it('should generate basis-0', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('basis-0')
      expect(gen.toCSS()).toContain('flex-basis: 0;')
    })

    it('should handle basis with very small fraction', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('basis-1/100')
      expect(gen.toCSS()).toContain('flex-basis: 1%;')
    })

    it('should handle basis with calc', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('basis-[calc(50%-1rem)]')
      expect(gen.toCSS()).toContain('flex-basis: calc(50%-1rem);')
    })
  })

  describe('Justify Self', () => {
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

    it('should generate justify-self-end', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('justify-self-end')
      expect(gen.toCSS()).toContain('justify-self: end;')
    })
  })
})
