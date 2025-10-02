import { describe, expect, it } from 'bun:test'
import { CSSGenerator } from '../src/generator'
import { parseClass } from '../src/parser'
import { defaultConfig } from '../src/config'

describe('Arbitrary Values and Properties', () => {
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

    it('should work with negative arbitrary values', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('-m-[100px]')
      const css = gen.toCSS()
      expect(css).toBeDefined()
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

    it('should handle arbitrary property with spaces', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('[grid-template-areas:auto]')
      expect(gen.toCSS()).toContain('grid-template-areas: auto;')
    })

    it('should handle arbitrary property with CSS functions', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('[background:linear-gradient(red,blue)]')
      expect(gen.toCSS()).toContain('background: linear-gradient(red,blue);')
    })

    it('should handle arbitrary property with important', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('![z-index:9999]')
      expect(gen.toCSS()).toContain('z-index: 9999 !important;')
    })
  })

  describe('Edge Cases', () => {
    describe('Complex arbitrary values', () => {
      it('should handle calc() in arbitrary values', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('w-[calc(100%-2rem)]')
        expect(gen.toCSS()).toContain('width: calc(100%-2rem);')
      })

      it('should handle clamp() in arbitrary values', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('text-[clamp(1rem,2.5vw,3rem)]')
        expect(gen.toCSS()).toContain('font-size: clamp(1rem,2.5vw,3rem);')
      })

      it('should handle min() in arbitrary values', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('w-[min(100%,500px)]')
        expect(gen.toCSS()).toContain('width: min(100%,500px);')
      })

      it('should handle max() in arbitrary values', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('h-[max(50vh,300px)]')
        expect(gen.toCSS()).toContain('height: max(50vh,300px);')
      })

      it('should handle CSS variables', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('text-[var(--font-size)]')
        expect(gen.toCSS()).toContain('font-size: var(--font-size);')
      })

      it('should handle multiple CSS variables', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('[color:var(--primary,#000)]')
        expect(gen.toCSS()).toContain('color: var(--primary,#000);')
      })
    })

    describe('Modern CSS units', () => {
      it('should handle dvh units', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('h-[100dvh]')
        expect(gen.toCSS()).toContain('height: 100dvh;')
      })

      it('should handle svh units', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('h-[100svh]')
        expect(gen.toCSS()).toContain('height: 100svh;')
      })

      it('should handle lvh units', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('h-[100lvh]')
        expect(gen.toCSS()).toContain('height: 100lvh;')
      })

      it('should handle cqw units', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('w-[50cqw]')
        expect(gen.toCSS()).toContain('width: 50cqw;')
      })

      it('should handle cqh units', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('h-[50cqh]')
        expect(gen.toCSS()).toContain('height: 50cqh;')
      })

      it('should handle ch units', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('w-[60ch]')
        expect(gen.toCSS()).toContain('width: 60ch;')
      })

      it('should handle ex units', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('h-[10ex]')
        expect(gen.toCSS()).toContain('height: 10ex;')
      })
    })

    describe('Complex arbitrary properties', () => {
      it('should handle grid-template-columns with complex value', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('[grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]')
        expect(gen.toCSS()).toContain('grid-template-columns: repeat(auto-fit,minmax(200px,1fr));')
      })

      it('should handle background with gradients', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('[background:linear-gradient(45deg,red,blue)]')
        expect(gen.toCSS()).toContain('background: linear-gradient(45deg,red,blue);')
      })

      it('should handle filter with blur', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('[filter:blur(10px)]')
        expect(gen.toCSS()).toContain('filter: blur(10px);')
      })

      it('should handle transform property', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('[transform:translateX(10px)]')
        expect(gen.toCSS()).toContain('transform: translateX(10px);')
      })

      it('should handle box-shadow', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('[box-shadow:inset_0_2px_4px_0_#0f172a]')
        const css = gen.toCSS()
        expect(css).toContain('box-shadow:')
      })
    })

    describe('Arbitrary values with variants', () => {
      it('should handle arbitrary value with responsive variant', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('md:w-[450px]')
        const css = gen.toCSS()
        expect(css).toContain('@media (min-width: 768px)')
        expect(css).toContain('width: 450px;')
      })

      it('should handle arbitrary value with hover variant', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('hover:bg-[#ff6600]')
        const css = gen.toCSS()
        expect(css).toContain(':hover')
        expect(css).toContain('background-color: #ff6600;')
      })

      it('should handle arbitrary value with multiple variants', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('md:hover:w-[500px]')
        const css = gen.toCSS()
        expect(css).toContain('@media')
        expect(css).toContain(':hover')
      })
    })

    describe('Edge values', () => {
      it('should handle zero arbitrary value', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('w-[0]')
        expect(gen.toCSS()).toContain('width: 0;')
      })

      it('should handle very large arbitrary value', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('w-[9999px]')
        expect(gen.toCSS()).toContain('width: 9999px;')
      })

      it('should handle decimal arbitrary value', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('opacity-[0.37]')
        expect(gen.toCSS()).toContain('opacity: 0.37;')
      })

      it('should handle fractional values', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('w-[75.5%]')
        expect(gen.toCSS()).toContain('width: 75.5%;')
      })
    })

    describe('URL and image arbitrary values', () => {
      it('should handle url() in background-image', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('[background-image:url(/images/bg.jpg)]')
        expect(gen.toCSS()).toContain('background-image: url(/images/bg.jpg);')
      })

      it('should handle data URL', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('[background:url(data:image/svg+xml;base64,ABC)]')
        expect(gen.toCSS()).toContain('background: url(data:image/svg+xml;base64,ABC);')
      })
    })

    describe('Special characters in arbitrary values', () => {
      it('should handle parentheses in arbitrary values', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('[clip-path:circle(50%)]')
        expect(gen.toCSS()).toContain('clip-path: circle(50%);')
      })

      it('should handle complex values', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('[animation:spin_1s_linear_infinite]')
        const css = gen.toCSS()
        expect(css).toContain('animation:')
      })
    })

    describe('Color formats in arbitrary', () => {
      it('should handle hex colors', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('bg-[#123456]')
        expect(gen.toCSS()).toContain('background-color: #123456;')
      })

      it('should handle rgb colors', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('bg-[rgb(255,0,0)]')
        expect(gen.toCSS()).toContain('background-color: rgb(255,0,0);')
      })

      it('should handle rgba colors', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('bg-[rgba(0,0,0,0.5)]')
        expect(gen.toCSS()).toContain('background-color: rgba(0,0,0,0.5);')
      })

      it('should handle hsl colors', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('bg-[hsl(200,100%,50%)]')
        expect(gen.toCSS()).toContain('background-color: hsl(200,100%,50%);')
      })

      it('should handle hsla colors', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('bg-[hsla(120,50%,50%,0.8)]')
        expect(gen.toCSS()).toContain('background-color: hsla(120,50%,50%,0.8);')
      })
    })

    describe('Angle units', () => {
      it('should handle deg units', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('rotate-[17deg]')
        expect(gen.toCSS()).toContain('transform: rotate(17deg);')
      })

      it('should handle rad units', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('rotate-[1.5rad]')
        expect(gen.toCSS()).toContain('transform: rotate(1.5rad);')
      })

      it('should handle turn units', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('rotate-[0.25turn]')
        expect(gen.toCSS()).toContain('transform: rotate(0.25turn);')
      })
    })
  })
})
