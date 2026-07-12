import { describe, expect, it } from 'bun:test'
import { defaultConfig } from '../src/config'
import { CSSGenerator } from '../src/generator'

describe('Grid Utilities', () => {
  describe('Display', () => {
    it('should generate grid', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('grid')
      expect(gen.toCSS(false)).toContain('display: grid;')
    })

    it('should generate inline-grid', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('inline-grid')
      expect(gen.toCSS(false)).toContain('display: inline-grid;')
    })
  })

  describe('Grid Template Columns', () => {
    it('should generate grid-cols-3', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('grid-cols-3')
      expect(gen.toCSS(false)).toContain('grid-template-columns: repeat(3, minmax(0, 1fr));')
    })

    it('should generate grid-cols-12', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('grid-cols-12')
      expect(gen.toCSS(false)).toContain('grid-template-columns: repeat(12, minmax(0, 1fr));')
    })

    it('should generate grid-cols-none', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('grid-cols-none')
      expect(gen.toCSS(false)).toContain('grid-template-columns: none;')
    })

    // Regression: `grid-cols-[300px_1fr]` must emit a space-separated value.
    // Tailwind's arbitrary-value underscore convention requires `_` → ` `,
    // because CSS class names can't contain literal spaces. Previously
    // crosswind preserved underscores inside any parentheses, which was fine
    // for `grid-cols-[300px_1fr]` (no parens) but still mis-emitted because
    // the grid-cols rule passed the value through verbatim.
    it('should convert underscores to spaces in arbitrary multi-track columns', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('grid-cols-[300px_1fr]')
      const css = gen.toCSS(false)
      expect(css).toContain('grid-template-columns: 300px 1fr;')
      expect(css).not.toMatch(/grid-template-columns:\s*300px_1fr/)
    })

    it('should convert underscores in arbitrary columns with three tracks', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('grid-cols-[200px_1fr_auto]')
      expect(gen.toCSS(false)).toContain('grid-template-columns: 200px 1fr auto;')
    })

    it('should convert underscores in arbitrary columns under lg: variant', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('lg:grid-cols-[300px_1fr]')
      const css = gen.toCSS(false)
      expect(css).toContain('grid-template-columns: 300px 1fr;')
      // The selector still contains the raw `_1fr]` in the escaped class name
      expect(css).toContain('.lg\\:grid-cols-\\[300px_1fr\\]')
    })

    it('should convert underscores inside nested CSS functions (repeat/minmax)', () => {
      // This exercises the inside-parens code path. Previously `_` inside
      // parens stayed an underscore, producing `minmax(200px,_1fr)` — invalid.
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))]')
      expect(gen.toCSS(false)).toContain('grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));')
    })

    it('should convert underscores in arbitrary rows the same way', () => {
      // Mirror test for grid-rows so rule coverage stays symmetric.
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('grid-rows-[50px_1fr_40px]')
      expect(gen.toCSS(false)).toContain('grid-template-rows: 50px 1fr 40px;')
    })
  })

  describe('Grid Template Rows', () => {
    it('should generate grid-rows-2', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('grid-rows-2')
      expect(gen.toCSS(false)).toContain('grid-template-rows: repeat(2, minmax(0, 1fr));')
    })

    it('should generate grid-rows-6', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('grid-rows-6')
      expect(gen.toCSS(false)).toContain('grid-template-rows: repeat(6, minmax(0, 1fr));')
    })
  })

  describe('Gap', () => {
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
  })

  describe('Justify Items', () => {
    it('should generate justify-items-center', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('justify-items-center')
      expect(gen.toCSS(false)).toContain('justify-items: center;')
    })

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

    it('should generate justify-items-stretch', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('justify-items-stretch')
      expect(gen.toCSS(false)).toContain('justify-items: stretch;')
    })
  })

  describe('Align Content', () => {
    it('should generate content-between', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('content-between')
      expect(gen.toCSS(false)).toContain('align-content: space-between;')
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
  })

  describe('Grid Auto Flow', () => {
    it('should generate grid-flow-row', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('grid-flow-row')
      expect(gen.toCSS(false)).toContain('grid-auto-flow: row;')
    })

    it('should generate grid-flow-col', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('grid-flow-col')
      expect(gen.toCSS(false)).toContain('grid-auto-flow: column;')
    })

    it('should generate grid-flow-dense', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('grid-flow-dense')
      expect(gen.toCSS(false)).toContain('grid-auto-flow: dense;')
    })
  })

  describe('Grid Column Span', () => {
    it('should generate col-span-2', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('col-span-2')
      expect(gen.toCSS(false)).toContain('grid-column: span 2 / span 2;')
    })

    it('should generate col-span-full', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('col-span-full')
      expect(gen.toCSS(false)).toContain('grid-column: 1 / -1;')
    })
  })

  describe('Grid Row Span', () => {
    it('should generate row-span-2', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('row-span-2')
      expect(gen.toCSS(false)).toContain('grid-row: span 2 / span 2;')
    })

    it('should generate row-span-full', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('row-span-full')
      expect(gen.toCSS(false)).toContain('grid-row: 1 / -1;')
    })
  })

  // Same rejection rules for the compound placement utilities: an unknown
  // word after span/start/end is not a grid line number and must not reach
  // the emitted CSS. Named lines remain available via arbitrary values
  // (row-start-[header]).
  describe('Compound grid placement rejection', () => {
    it('should not emit CSS for row-span-foo / col-span-foo', () => {
      for (const cls of ['row-span-foo', 'col-span-foo']) {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate(cls)
        expect(gen.toCSS(false).trim()).toBe('')
      }
    })

    it('should not emit CSS for start/end with bare words', () => {
      for (const cls of ['row-start-name', 'row-end-name', 'col-start-header', 'col-end-header']) {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate(cls)
        expect(gen.toCSS(false).trim()).toBe('')
      }
    })

    it('should span any bare number beyond the classic 12 (col-span-16)', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('col-span-16')
      expect(gen.toCSS(false)).toContain('grid-column: span 16 / span 16;')
    })

    it('should still generate negative start values (col-start--1)', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('-col-start-1')
      expect(gen.toCSS(false)).toContain('grid-column-start: -1;')
    })

    it('should still pass named lines through arbitrary start/end values', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('row-start-[header]')
      gen.generate('col-end-[sidebar-end]')
      const css = gen.toCSS(false)
      expect(css).toContain('grid-row-start: header;')
      expect(css).toContain('grid-column-end: sidebar-end;')
    })
  })

  // Regression: semantic class names sharing the `row-` / `col-` prefix
  // (e.g. `row-list` on a list wrapper) must not emit `grid-row: list` —
  // an unknown word is not a utility value, and the named-grid-line
  // placement it produced silently broke real grid layouts.
  describe('Bare grid placement rejection', () => {
    it('should not emit CSS for row-list', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('row-list')
      const css = gen.toCSS(false)
      expect(css).not.toContain('grid-row')
      expect(css).not.toContain('.row-list')
    })

    it('should not emit CSS for other semantic row-* names', () => {
      for (const cls of ['row-name', 'row-desc', 'row-meta']) {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate(cls)
        expect(gen.toCSS(false)).not.toContain('grid-row')
      }
    })

    it('should not emit CSS for col-header', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('col-header')
      const css = gen.toCSS(false)
      expect(css).not.toContain('grid-column')
      expect(css).not.toContain('.col-header')
    })

    it('should still generate row-auto and col-auto', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('row-auto')
      gen.generate('col-auto')
      const css = gen.toCSS(false)
      expect(css).toContain('grid-row: auto;')
      expect(css).toContain('grid-column: auto;')
    })

    it('should still generate bare integer placements (col-7, row-2)', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('col-7')
      gen.generate('row-2')
      const css = gen.toCSS(false)
      expect(css).toContain('grid-column: 7;')
      expect(css).toContain('grid-row: 2;')
    })

    it('should still pass arbitrary values through (row-[span_16_/_span_16], col-[my-line])', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('row-[span_16_/_span_16]')
      gen.generate('col-[my-line]')
      const css = gen.toCSS(false)
      expect(css).toContain('grid-row: span 16 / span 16;')
      expect(css).toContain('grid-column: my-line;')
    })
  })
})

describe('Edge Cases', () => {
  describe('Grid with variants', () => {
    it('should handle grid with responsive', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('md:grid')
      const css = gen.toCSS(false)
      expect(css).toContain('@media (min-width: 768px)')
      expect(css).toContain('display: grid;')
    })

    it('should handle grid-cols with responsive', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('lg:grid-cols-3')
      const css = gen.toCSS(false)
      expect(css).toContain('@media (min-width: 1024px)')
      expect(css).toContain('grid-template-columns: repeat(3, minmax(0, 1fr));')
    })

    it('should handle grid-flow with variants', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('md:grid-flow-row')
      const css = gen.toCSS(false)
      expect(css).toContain('@media (min-width: 768px)')
      expect(css).toContain('grid-auto-flow: row;')
    })

    it('should handle place-content with variants', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('sm:place-content-center')
      const css = gen.toCSS(false)
      expect(css).toContain('@media (min-width: 640px)')
      expect(css).toContain('place-content: center;')
    })

    it('should handle place-items with variants', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('md:place-items-center')
      const css = gen.toCSS(false)
      expect(css).toContain('@media (min-width: 768px)')
      expect(css).toContain('place-items: center;')
    })

    it('should handle place-self with variants', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('lg:place-self-center')
      const css = gen.toCSS(false)
      expect(css).toContain('@media (min-width: 1024px)')
      expect(css).toContain('place-self: center;')
    })

    it('should handle gap with important', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('!gap-4')
      expect(gen.toCSS(false)).toContain('gap: 1rem !important;')
    })

    it('should handle justify-items with hover', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('hover:justify-items-center')
      const css = gen.toCSS(false)
      expect(css).toContain(':hover')
      expect(css).toContain('justify-items: center;')
    })
  })

  describe('Grid auto columns and rows', () => {
    it('should generate auto-cols-auto', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('auto-cols-auto')
      expect(gen.toCSS(false)).toContain('grid-auto-columns: auto;')
    })

    it('should generate auto-cols-min', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('auto-cols-min')
      expect(gen.toCSS(false)).toContain('grid-auto-columns: min-content;')
    })

    it('should generate auto-cols-max', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('auto-cols-max')
      expect(gen.toCSS(false)).toContain('grid-auto-columns: max-content;')
    })

    it('should generate auto-cols-fr', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('auto-cols-fr')
      expect(gen.toCSS(false)).toContain('grid-auto-columns: minmax(0, 1fr);')
    })

    it('should generate auto-rows-auto', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('auto-rows-auto')
      expect(gen.toCSS(false)).toContain('grid-auto-rows: auto;')
    })

    it('should generate auto-rows-min', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('auto-rows-min')
      expect(gen.toCSS(false)).toContain('grid-auto-rows: min-content;')
    })

    it('should generate auto-rows-max', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('auto-rows-max')
      expect(gen.toCSS(false)).toContain('grid-auto-rows: max-content;')
    })

    it('should generate auto-rows-fr', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('auto-rows-fr')
      expect(gen.toCSS(false)).toContain('grid-auto-rows: minmax(0, 1fr);')
    })

    it('should handle auto-cols with arbitrary value', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('auto-cols-[200px]')
      expect(gen.toCSS(false)).toContain('grid-auto-columns: 200px;')
    })

    it('should handle auto-rows with arbitrary value', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('auto-rows-[minmax(0,2fr)]')
      expect(gen.toCSS(false)).toContain('grid-auto-rows: minmax(0,2fr);')
    })
  })

  describe('Grid column and row start/end', () => {
    it('should generate col-start-1', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('col-start-1')
      expect(gen.toCSS(false)).toContain('grid-column-start: 1;')
    })

    it('should generate col-start-auto', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('col-start-auto')
      expect(gen.toCSS(false)).toContain('grid-column-start: auto;')
    })

    it('should generate col-end-4', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('col-end-4')
      expect(gen.toCSS(false)).toContain('grid-column-end: 4;')
    })

    it('should generate col-end-auto', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('col-end-auto')
      expect(gen.toCSS(false)).toContain('grid-column-end: auto;')
    })

    it('should generate row-start-2', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('row-start-2')
      expect(gen.toCSS(false)).toContain('grid-row-start: 2;')
    })

    it('should generate row-end-3', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('row-end-3')
      expect(gen.toCSS(false)).toContain('grid-row-end: 3;')
    })

    it('should handle negative col-start', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('col-start-[-1]')
      expect(gen.toCSS(false)).toContain('grid-column-start: -1;')
    })

    it('should handle large column numbers', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('col-start-[13]')
      expect(gen.toCSS(false)).toContain('grid-column-start: 13;')
    })
  })

  describe('Grid template columns/rows edge cases', () => {
    it('should handle grid-cols-1', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('grid-cols-1')
      expect(gen.toCSS(false)).toContain('grid-template-columns: repeat(1, minmax(0, 1fr));')
    })

    it('should handle grid-rows-1', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('grid-rows-1')
      expect(gen.toCSS(false)).toContain('grid-template-rows: repeat(1, minmax(0, 1fr));')
    })

    it('should handle arbitrary grid-cols with subgrid', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('grid-cols-[subgrid]')
      expect(gen.toCSS(false)).toContain('grid-template-columns: subgrid;')
    })

    it('should handle arbitrary grid-rows with subgrid', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('grid-rows-[subgrid]')
      expect(gen.toCSS(false)).toContain('grid-template-rows: subgrid;')
    })

    it('should handle grid-cols with arbitrary repeat', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('grid-cols-[100px]')
      expect(gen.toCSS(false)).toContain('grid-template-columns: 100px;')
    })

    it('should convert underscores to spaces in arbitrary grid-cols values', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('grid-cols-[120px_1fr_200px]')
      expect(gen.toCSS(false)).toContain('grid-template-columns: 120px 1fr 200px;')
    })

    it('should convert underscores to spaces in complex arbitrary grid-cols', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('grid-cols-[1fr_auto_1fr]')
      expect(gen.toCSS(false)).toContain('grid-template-columns: 1fr auto 1fr;')
    })

    it('should convert underscores to spaces in arbitrary grid-rows values', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('grid-rows-[auto_1fr_auto]')
      expect(gen.toCSS(false)).toContain('grid-template-rows: auto 1fr auto;')
    })
  })

  describe('Grid flow combinations', () => {
    it('should generate grid-flow-row-dense', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('grid-flow-row-dense')
      expect(gen.toCSS(false)).toContain('grid-auto-flow: row dense;')
    })

    it('should generate grid-flow-col-dense', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('grid-flow-col-dense')
      expect(gen.toCSS(false)).toContain('grid-auto-flow: column dense;')
    })
  })

  describe('Place utilities comprehensive', () => {
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

    it('should generate place-items-center', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('place-items-center')
      expect(gen.toCSS(false)).toContain('place-items: center;')
    })

    it('should generate place-items-stretch', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('place-items-stretch')
      expect(gen.toCSS(false)).toContain('place-items: stretch;')
    })

    it('should generate place-self-auto', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('place-self-auto')
      expect(gen.toCSS(false)).toContain('place-self: auto;')
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

    it('should generate place-self-center', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('place-self-center')
      expect(gen.toCSS(false)).toContain('place-self: center;')
    })

    it('should generate place-self-stretch', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('place-self-stretch')
      expect(gen.toCSS(false)).toContain('place-self: stretch;')
    })
  })

  describe('Gap edge cases', () => {
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

    it('should handle gap-x-0', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('gap-x-0')
      expect(gen.toCSS(false)).toContain('column-gap: 0;')
    })

    it('should handle gap-y-px', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('gap-y-px')
      expect(gen.toCSS(false)).toContain('row-gap: 1px;')
    })

    it('should handle gap with arbitrary value', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('gap-[2.5rem]')
      expect(gen.toCSS(false)).toContain('gap: 2.5rem;')
    })

    it('should handle gap-x with calc', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('gap-x-[calc(100%-2rem)]')
      expect(gen.toCSS(false)).toContain('column-gap: calc(100%-2rem);')
    })
  })

  describe('Grid span edge cases', () => {
    it('should handle col-span-auto', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('col-span-auto')
      expect(gen.toCSS(false)).toContain('grid-column: auto;')
    })

    it('should handle row-span-auto', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('row-span-auto')
      expect(gen.toCSS(false)).toContain('grid-row: auto;')
    })

    it('should handle col-span with large number', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('col-span-[20]')
      expect(gen.toCSS(false)).toContain('grid-column: span 20 / span 20;')
    })

    it('should handle row-span with large number', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('row-span-[15]')
      expect(gen.toCSS(false)).toContain('grid-row: span 15 / span 15;')
    })
  })

  describe('Grid with multiple variants', () => {
    it('should handle dark mode with grid', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('dark:grid-cols-4')
      const css = gen.toCSS(false)
      expect(css).toContain('.dark')
      expect(css).toContain('grid-template-columns: repeat(4, minmax(0, 1fr));')
    })

    it('should handle combined responsive and hover', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('md:hover:grid-cols-2')
      const css = gen.toCSS(false)
      expect(css).toContain('@media (min-width: 768px)')
      expect(css).toContain(':hover')
      expect(css).toContain('grid-template-columns: repeat(2, minmax(0, 1fr));')
    })
  })
})
