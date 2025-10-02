import { describe, expect, it } from 'bun:test'
import { CSSGenerator } from '../src/generator'
import { defaultConfig } from '../src/config'

describe('Grid Utilities', () => {
  describe('Display', () => {
    it('should generate grid', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('grid')
      expect(gen.toCSS()).toContain('display: grid;')
    })

    it('should generate inline-grid', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('inline-grid')
      expect(gen.toCSS()).toContain('display: inline-grid;')
    })
  })

  describe('Grid Template Columns', () => {
    it('should generate grid-cols-3', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('grid-cols-3')
      expect(gen.toCSS()).toContain('grid-template-columns: repeat(3, minmax(0, 1fr));')
    })

    it('should generate grid-cols-12', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('grid-cols-12')
      expect(gen.toCSS()).toContain('grid-template-columns: repeat(12, minmax(0, 1fr));')
    })

    it('should generate grid-cols-none', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('grid-cols-none')
      expect(gen.toCSS()).toContain('grid-template-columns: none;')
    })
  })

  describe('Grid Template Rows', () => {
    it('should generate grid-rows-2', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('grid-rows-2')
      expect(gen.toCSS()).toContain('grid-template-rows: repeat(2, minmax(0, 1fr));')
    })

    it('should generate grid-rows-6', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('grid-rows-6')
      expect(gen.toCSS()).toContain('grid-template-rows: repeat(6, minmax(0, 1fr));')
    })
  })

  describe('Gap', () => {
    it('should generate gap-4', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('gap-4')
      expect(gen.toCSS()).toContain('gap: 1rem;')
    })

    it('should generate gap-x-2', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('gap-x-2')
      expect(gen.toCSS()).toContain('column-gap: 0.5rem;')
    })

    it('should generate gap-y-8', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('gap-y-8')
      expect(gen.toCSS()).toContain('row-gap: 2rem;')
    })
  })

  describe('Justify Items', () => {
    it('should generate justify-items-center', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('justify-items-center')
      expect(gen.toCSS()).toContain('justify-items: center;')
    })

    it('should generate justify-items-start', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('justify-items-start')
      expect(gen.toCSS()).toContain('justify-items: start;')
    })

    it('should generate justify-items-end', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('justify-items-end')
      expect(gen.toCSS()).toContain('justify-items: end;')
    })

    it('should generate justify-items-stretch', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('justify-items-stretch')
      expect(gen.toCSS()).toContain('justify-items: stretch;')
    })
  })

  describe('Align Content', () => {
    it('should generate content-between', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('content-between')
      expect(gen.toCSS()).toContain('align-content: space-between;')
    })

    it('should generate content-center', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('content-center')
      expect(gen.toCSS()).toContain('align-content: center;')
    })

    it('should generate content-start', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('content-start')
      expect(gen.toCSS()).toContain('align-content: flex-start;')
    })

    it('should generate content-end', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('content-end')
      expect(gen.toCSS()).toContain('align-content: flex-end;')
    })

    it('should generate content-around', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('content-around')
      expect(gen.toCSS()).toContain('align-content: space-around;')
    })

    it('should generate content-evenly', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('content-evenly')
      expect(gen.toCSS()).toContain('align-content: space-evenly;')
    })
  })

  describe('Grid Auto Flow', () => {
    it('should generate grid-flow-row', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('grid-flow-row')
      expect(gen.toCSS()).toContain('grid-auto-flow: row;')
    })

    it('should generate grid-flow-col', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('grid-flow-col')
      expect(gen.toCSS()).toContain('grid-auto-flow: column;')
    })

    it('should generate grid-flow-dense', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('grid-flow-dense')
      expect(gen.toCSS()).toContain('grid-auto-flow: dense;')
    })
  })

  describe('Grid Column Span', () => {
    it('should generate col-span-2', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('col-span-2')
      expect(gen.toCSS()).toContain('grid-column: span 2 / span 2;')
    })

    it('should generate col-span-full', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('col-span-full')
      expect(gen.toCSS()).toContain('grid-column: 1 / -1;')
    })
  })

  describe('Grid Row Span', () => {
    it('should generate row-span-2', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('row-span-2')
      expect(gen.toCSS()).toContain('grid-row: span 2 / span 2;')
    })

    it('should generate row-span-full', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('row-span-full')
      expect(gen.toCSS()).toContain('grid-row: 1 / -1;')
    })
  })
})
