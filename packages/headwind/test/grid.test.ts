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

describe('Edge Cases', () => {
  describe('Grid with variants', () => {
    it('should handle grid with responsive', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('md:grid')
      const css = gen.toCSS()
      expect(css).toContain('@media (min-width: 768px)')
      expect(css).toContain('display: grid;')
    })

    it('should handle grid-cols with responsive', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('lg:grid-cols-3')
      const css = gen.toCSS()
      expect(css).toContain('@media (min-width: 1024px)')
      expect(css).toContain('grid-template-columns: repeat(3, minmax(0, 1fr));')
    })

    it('should handle grid-flow with variants', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('md:grid-flow-row')
      const css = gen.toCSS()
      expect(css).toContain('@media (min-width: 768px)')
      expect(css).toContain('grid-auto-flow: row;')
    })

    it('should handle place-content with variants', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('sm:place-content-center')
      const css = gen.toCSS()
      expect(css).toContain('@media (min-width: 640px)')
      expect(css).toContain('place-content: center;')
    })

    it('should handle place-items with variants', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('md:place-items-center')
      const css = gen.toCSS()
      expect(css).toContain('@media (min-width: 768px)')
      expect(css).toContain('place-items: center;')
    })

    it('should handle place-self with variants', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('lg:place-self-center')
      const css = gen.toCSS()
      expect(css).toContain('@media (min-width: 1024px)')
      expect(css).toContain('place-self: center;')
    })

    it('should handle gap with important', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('!gap-4')
      expect(gen.toCSS()).toContain('gap: 1rem !important;')
    })

    it('should handle justify-items with hover', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('hover:justify-items-center')
      const css = gen.toCSS()
      expect(css).toContain(':hover')
      expect(css).toContain('justify-items: center;')
    })
  })

  describe('Grid auto columns and rows', () => {
    it('should generate auto-cols-auto', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('auto-cols-auto')
      expect(gen.toCSS()).toContain('grid-auto-columns: auto;')
    })

    it('should generate auto-cols-min', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('auto-cols-min')
      expect(gen.toCSS()).toContain('grid-auto-columns: min-content;')
    })

    it('should generate auto-cols-max', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('auto-cols-max')
      expect(gen.toCSS()).toContain('grid-auto-columns: max-content;')
    })

    it('should generate auto-cols-fr', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('auto-cols-fr')
      expect(gen.toCSS()).toContain('grid-auto-columns: minmax(0, 1fr);')
    })

    it('should generate auto-rows-auto', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('auto-rows-auto')
      expect(gen.toCSS()).toContain('grid-auto-rows: auto;')
    })

    it('should generate auto-rows-min', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('auto-rows-min')
      expect(gen.toCSS()).toContain('grid-auto-rows: min-content;')
    })

    it('should generate auto-rows-max', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('auto-rows-max')
      expect(gen.toCSS()).toContain('grid-auto-rows: max-content;')
    })

    it('should generate auto-rows-fr', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('auto-rows-fr')
      expect(gen.toCSS()).toContain('grid-auto-rows: minmax(0, 1fr);')
    })

    it('should handle auto-cols with arbitrary value', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('auto-cols-[200px]')
      expect(gen.toCSS()).toContain('grid-auto-columns: 200px;')
    })

    it('should handle auto-rows with arbitrary value', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('auto-rows-[minmax(0,2fr)]')
      expect(gen.toCSS()).toContain('grid-auto-rows: minmax(0,2fr);')
    })
  })

  describe('Grid column and row start/end', () => {
    it('should generate col-start-1', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('col-start-1')
      expect(gen.toCSS()).toContain('grid-column-start: 1;')
    })

    it('should generate col-start-auto', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('col-start-auto')
      expect(gen.toCSS()).toContain('grid-column-start: auto;')
    })

    it('should generate col-end-4', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('col-end-4')
      expect(gen.toCSS()).toContain('grid-column-end: 4;')
    })

    it('should generate col-end-auto', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('col-end-auto')
      expect(gen.toCSS()).toContain('grid-column-end: auto;')
    })

    it('should generate row-start-2', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('row-start-2')
      expect(gen.toCSS()).toContain('grid-row-start: 2;')
    })

    it('should generate row-end-3', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('row-end-3')
      expect(gen.toCSS()).toContain('grid-row-end: 3;')
    })

    it('should handle negative col-start', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('col-start-[-1]')
      expect(gen.toCSS()).toContain('grid-column-start: -1;')
    })

    it('should handle large column numbers', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('col-start-[13]')
      expect(gen.toCSS()).toContain('grid-column-start: 13;')
    })
  })

  describe('Grid template columns/rows edge cases', () => {
    it('should handle grid-cols-1', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('grid-cols-1')
      expect(gen.toCSS()).toContain('grid-template-columns: repeat(1, minmax(0, 1fr));')
    })

    it('should handle grid-rows-1', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('grid-rows-1')
      expect(gen.toCSS()).toContain('grid-template-rows: repeat(1, minmax(0, 1fr));')
    })

    it('should handle arbitrary grid-cols with subgrid', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('grid-cols-[subgrid]')
      expect(gen.toCSS()).toContain('grid-template-columns: subgrid;')
    })

    it('should handle arbitrary grid-rows with subgrid', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('grid-rows-[subgrid]')
      expect(gen.toCSS()).toContain('grid-template-rows: subgrid;')
    })

    it('should handle grid-cols with arbitrary repeat', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('grid-cols-[100px]')
      expect(gen.toCSS()).toContain('grid-template-columns: 100px;')
    })
  })

  describe('Grid flow combinations', () => {
    it('should generate grid-flow-row-dense', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('grid-flow-row-dense')
      expect(gen.toCSS()).toContain('grid-auto-flow: row dense;')
    })

    it('should generate grid-flow-col-dense', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('grid-flow-col-dense')
      expect(gen.toCSS()).toContain('grid-auto-flow: column dense;')
    })
  })

  describe('Place utilities comprehensive', () => {
    it('should generate place-content-start', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('place-content-start')
      expect(gen.toCSS()).toContain('place-content: start;')
    })

    it('should generate place-content-end', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('place-content-end')
      expect(gen.toCSS()).toContain('place-content: end;')
    })

    it('should generate place-content-between', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('place-content-between')
      expect(gen.toCSS()).toContain('place-content: space-between;')
    })

    it('should generate place-content-around', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('place-content-around')
      expect(gen.toCSS()).toContain('place-content: space-around;')
    })

    it('should generate place-content-evenly', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('place-content-evenly')
      expect(gen.toCSS()).toContain('place-content: space-evenly;')
    })

    it('should generate place-content-stretch', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('place-content-stretch')
      expect(gen.toCSS()).toContain('place-content: stretch;')
    })

    it('should generate place-items-start', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('place-items-start')
      expect(gen.toCSS()).toContain('place-items: start;')
    })

    it('should generate place-items-end', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('place-items-end')
      expect(gen.toCSS()).toContain('place-items: end;')
    })

    it('should generate place-items-center', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('place-items-center')
      expect(gen.toCSS()).toContain('place-items: center;')
    })

    it('should generate place-items-stretch', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('place-items-stretch')
      expect(gen.toCSS()).toContain('place-items: stretch;')
    })

    it('should generate place-self-auto', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('place-self-auto')
      expect(gen.toCSS()).toContain('place-self: auto;')
    })

    it('should generate place-self-start', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('place-self-start')
      expect(gen.toCSS()).toContain('place-self: start;')
    })

    it('should generate place-self-end', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('place-self-end')
      expect(gen.toCSS()).toContain('place-self: end;')
    })

    it('should generate place-self-center', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('place-self-center')
      expect(gen.toCSS()).toContain('place-self: center;')
    })

    it('should generate place-self-stretch', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('place-self-stretch')
      expect(gen.toCSS()).toContain('place-self: stretch;')
    })
  })

  describe('Gap edge cases', () => {
    it('should handle gap-0', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('gap-0')
      expect(gen.toCSS()).toContain('gap: 0;')
    })

    it('should handle gap-px', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('gap-px')
      expect(gen.toCSS()).toContain('gap: 1px;')
    })

    it('should handle gap-x-0', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('gap-x-0')
      expect(gen.toCSS()).toContain('column-gap: 0;')
    })

    it('should handle gap-y-px', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('gap-y-px')
      expect(gen.toCSS()).toContain('row-gap: 1px;')
    })

    it('should handle gap with arbitrary value', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('gap-[2.5rem]')
      expect(gen.toCSS()).toContain('gap: 2.5rem;')
    })

    it('should handle gap-x with calc', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('gap-x-[calc(100%-2rem)]')
      expect(gen.toCSS()).toContain('column-gap: calc(100%-2rem);')
    })
  })

  describe('Grid span edge cases', () => {
    it('should handle col-span-auto', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('col-span-auto')
      expect(gen.toCSS()).toContain('grid-column: auto;')
    })

    it('should handle row-span-auto', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('row-span-auto')
      expect(gen.toCSS()).toContain('grid-row: auto;')
    })

    it('should handle col-span with large number', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('col-span-[20]')
      expect(gen.toCSS()).toContain('grid-column: span 20 / span 20;')
    })

    it('should handle row-span with large number', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('row-span-[15]')
      expect(gen.toCSS()).toContain('grid-row: span 15 / span 15;')
    })
  })

  describe('Grid with multiple variants', () => {
    it('should handle dark mode with grid', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('dark:grid-cols-4')
      const css = gen.toCSS()
      expect(css).toContain('.dark')
      expect(css).toContain('grid-template-columns: repeat(4, minmax(0, 1fr));')
    })

    it('should handle combined responsive and hover', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('md:hover:grid-cols-2')
      const css = gen.toCSS()
      expect(css).toContain('@media (min-width: 768px)')
      expect(css).toContain(':hover')
      expect(css).toContain('grid-template-columns: repeat(2, minmax(0, 1fr));')
    })
  })
})
