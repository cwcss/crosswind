import { describe, expect, it } from 'bun:test'
import { defaultConfig } from '../src/config'
import { CSSGenerator } from '../src/generator'
import { parseClass } from '../src/parser'

describe('Transform Utilities', () => {
  describe('Scale', () => {
    it('should generate scale-150', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('scale-150')
      expect(gen.toCSS(false)).toContain('transform: scale(1.5);')
    })

    it('should generate scale-0', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('scale-0')
      expect(gen.toCSS(false)).toContain('transform: scale(0);')
    })

    it('should generate scale-x-50', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('scale-x-50')
      expect(gen.toCSS(false)).toContain('transform: scaleX(0.5);')
    })

    it('should generate scale-y-125', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('scale-y-125')
      expect(gen.toCSS(false)).toContain('transform: scaleY(1.25);')
    })

    it('should generate scale-z-150', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('scale-z-150')
      expect(gen.toCSS(false)).toContain('transform: scaleZ(1.5);')
    })
  })

  describe('Rotate', () => {
    it('should generate rotate-45', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('rotate-45')
      expect(gen.toCSS(false)).toContain('transform: rotate(45deg);')
    })

    it('should generate rotate-90', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('rotate-90')
      expect(gen.toCSS(false)).toContain('transform: rotate(90deg);')
    })

    it('should generate rotate-180', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('rotate-180')
      expect(gen.toCSS(false)).toContain('transform: rotate(180deg);')
    })
  })

  describe('3D Rotate', () => {
    it('should generate rotate-x-45', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('rotate-x-45')
      expect(gen.toCSS(false)).toContain('transform: rotateX(45deg);')
    })

    it('should generate rotate-y-90', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('rotate-y-90')
      expect(gen.toCSS(false)).toContain('transform: rotateY(90deg);')
    })

    it('should generate rotate-z-180', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('rotate-z-180')
      expect(gen.toCSS(false)).toContain('transform: rotateZ(180deg);')
    })
  })

  describe('Translate', () => {
    it('should generate translate-x-4', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('translate-x-4')
      expect(gen.toCSS(false)).toContain('transform: translateX(1rem);')
    })

    it('should generate translate-y-8', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('translate-y-8')
      expect(gen.toCSS(false)).toContain('transform: translateY(2rem);')
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

    it('should generate negative translate-x CSS', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('-translate-x-4')
      expect(gen.toCSS(false)).toContain('transform: translateX(-1rem);')
    })

    it('should generate translate-z-4', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('translate-z-4')
      expect(gen.toCSS(false)).toContain('transform: translateZ(1rem);')
    })
  })

  describe('Skew', () => {
    it('should generate skew-x-3', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('skew-x-3')
      expect(gen.toCSS(false)).toContain('transform: skewX(3deg);')
    })

    it('should generate skew-y-6', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('skew-y-6')
      expect(gen.toCSS(false)).toContain('transform: skewY(6deg);')
    })
  })

  describe('Transform properties', () => {
    it('should generate backface-hidden', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('backface-hidden')
      expect(gen.toCSS(false)).toContain('backface-visibility: hidden;')
    })

    it('should generate transform-3d', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('transform-3d')
      expect(gen.toCSS(false)).toContain('transform-style: preserve-3d;')
    })

    it('should generate perspective-origin-center', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('perspective-origin-center')
      expect(gen.toCSS(false)).toContain('perspective-origin: center;')
    })
  })

  describe('Edge Cases', () => {
    describe('Arbitrary transform values', () => {
      it('should handle arbitrary scale', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('scale-[1.15]')
        expect(gen.toCSS(false)).toContain('transform: scale(1.15);')
      })

      it('should handle arbitrary rotate', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('rotate-[17deg]')
        expect(gen.toCSS(false)).toContain('transform: rotate(17deg);')
      })

      it('should handle arbitrary translate', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('translate-x-[45px]')
        expect(gen.toCSS(false)).toContain('transform: translateX(45px);')
      })

      it('should handle arbitrary skew', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('skew-x-[15deg]')
        expect(gen.toCSS(false)).toContain('transform: skewX(15deg);')
      })
    })

    describe('Transform origin', () => {
      it('should handle origin-center', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('origin-center')
        expect(gen.toCSS(false)).toContain('transform-origin: center;')
      })

      it('should handle origin-top', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('origin-top')
        expect(gen.toCSS(false)).toContain('transform-origin: top;')
      })

      it('should handle origin-top-right', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('origin-top-right')
        expect(gen.toCSS(false)).toContain('transform-origin: top right;')
      })

      it('should handle origin-right', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('origin-right')
        expect(gen.toCSS(false)).toContain('transform-origin: right;')
      })

      it('should handle origin-bottom-right', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('origin-bottom-right')
        expect(gen.toCSS(false)).toContain('transform-origin: bottom right;')
      })

      it('should handle origin-bottom', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('origin-bottom')
        expect(gen.toCSS(false)).toContain('transform-origin: bottom;')
      })

      it('should handle origin-bottom-left', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('origin-bottom-left')
        expect(gen.toCSS(false)).toContain('transform-origin: bottom left;')
      })

      it('should handle origin-left', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('origin-left')
        expect(gen.toCSS(false)).toContain('transform-origin: left;')
      })

      it('should handle origin-top-left', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('origin-top-left')
        expect(gen.toCSS(false)).toContain('transform-origin: top left;')
      })

      it('should handle arbitrary origin', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('origin-[25%_75%]')
        expect(gen.toCSS(false)).toContain('transform-origin: 25% 75%;')
      })
    })

    describe('Perspective', () => {
      it('should handle perspective-500', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('perspective-500')
        expect(gen.toCSS(false)).toContain('perspective: 500px;')
      })

      it('should handle perspective-1000', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('perspective-1000')
        expect(gen.toCSS(false)).toContain('perspective: 1000px;')
      })

      it('should handle perspective-none', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('perspective-none')
        expect(gen.toCSS(false)).toContain('perspective: none;')
      })

      it('should handle arbitrary perspective', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('perspective-[750px]')
        expect(gen.toCSS(false)).toContain('perspective: 750px;')
      })

      it('should handle perspective-origin-top', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('perspective-origin-top')
        expect(gen.toCSS(false)).toContain('perspective-origin: top;')
      })

      it('should handle perspective-origin-bottom', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('perspective-origin-bottom')
        expect(gen.toCSS(false)).toContain('perspective-origin: bottom;')
      })

      it('should handle perspective-origin-left', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('perspective-origin-left')
        expect(gen.toCSS(false)).toContain('perspective-origin: left;')
      })

      it('should handle perspective-origin-right', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('perspective-origin-right')
        expect(gen.toCSS(false)).toContain('perspective-origin: right;')
      })
    })

    describe('Negative transforms', () => {
      it('should handle negative scale', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('-scale-x-100')
        expect(gen.toCSS(false)).toContain('transform: scaleX(-1);')
      })

      it('should handle negative rotate', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('-rotate-45')
        expect(gen.toCSS(false)).toContain('transform: rotate(-45deg);')
      })

      it('should handle negative translate-y', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('-translate-y-4')
        expect(gen.toCSS(false)).toContain('transform: translateY(-1rem);')
      })

      it('should handle negative skew', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('-skew-x-3')
        expect(gen.toCSS(false)).toContain('transform: skewX(-3deg);')
      })
    })

    describe('Transform GPU', () => {
      it('should handle transform-gpu', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('transform-gpu')
        const css = gen.toCSS(false)
        expect(css).toContain('transform:')
        expect(css).toContain('translate3d')
      })

      it('should handle transform-none', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('transform-none')
        expect(gen.toCSS(false)).toContain('transform: none;')
      })
    })

    describe('Backface visibility', () => {
      it('should handle backface-visible', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('backface-visible')
        expect(gen.toCSS(false)).toContain('backface-visibility: visible;')
      })
    })

    describe('Transform style', () => {
      it('should handle transform-flat', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('transform-flat')
        expect(gen.toCSS(false)).toContain('transform-style: flat;')
      })
    })

    describe('Transforms with variants', () => {
      it('should handle scale with responsive variant', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('md:scale-110')
        const css = gen.toCSS(false)
        expect(css).toContain('@media (min-width: 768px)')
        expect(css).toContain('transform: scale(1.1);')
      })

      it('should handle rotate with hover variant', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('hover:rotate-90')
        const css = gen.toCSS(false)
        expect(css).toContain(':hover')
        expect(css).toContain('transform: rotate(90deg);')
      })

      it('should handle translate with dark mode variant', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('dark:translate-x-4')
        const css = gen.toCSS(false)
        expect(css).toContain('.dark')
        expect(css).toContain('transform: translateX(1rem);')
      })
    })

    describe('Extreme and edge values', () => {
      it('should handle scale-0', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('scale-0')
        expect(gen.toCSS(false)).toContain('transform: scale(0);')
      })

      it('should handle rotate-0', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('rotate-0')
        expect(gen.toCSS(false)).toContain('transform: rotate(0deg);')
      })

      it('should handle very large rotate', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('rotate-[720deg]')
        expect(gen.toCSS(false)).toContain('transform: rotate(720deg);')
      })

      it('should handle fractional rotate', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('rotate-[0.5deg]')
        expect(gen.toCSS(false)).toContain('transform: rotate(0.5deg);')
      })
    })

    describe('Transform with CSS variables', () => {
      it('should handle scale with CSS variable', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('scale-[var(--scale)]')
        expect(gen.toCSS(false)).toContain('transform: scale(var(--scale));')
      })

      it('should handle rotate with CSS variable', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('rotate-[var(--rotation)]')
        expect(gen.toCSS(false)).toContain('transform: rotate(var(--rotation));')
      })

      it('should handle translate with calc', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('translate-x-[calc(100%+1rem)]')
        expect(gen.toCSS(false)).toContain('transform: translateX(calc(100%+1rem));')
      })
    })

    describe('Translate with percentage', () => {
      it('should handle translate-x-1/2', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('translate-x-1/2')
        expect(gen.toCSS(false)).toContain('transform: translateX(50%);')
      })

      it('should handle translate-y-1/3', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('translate-y-1/3')
        const css = gen.toCSS(false)
        expect(css).toContain('transform: translateY(33.')
        expect(css).toContain('%);')
      })

      it('should handle translate-y-full', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('translate-y-full')
        expect(gen.toCSS(false)).toContain('transform: translateY(100%);')
      })

      it('should handle negative translate with fraction', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('-translate-x-1/2')
        expect(gen.toCSS(false)).toContain('transform: translateX(-50%);')
      })
    })
  })
})
