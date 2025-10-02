import { describe, expect, it } from 'bun:test'
import { CSSGenerator } from '../src/generator'
import { parseClass } from '../src/parser'
import { defaultConfig } from '../src/config'

describe('Transform Utilities', () => {
  describe('Scale', () => {
    it('should generate scale-150', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('scale-150')
      expect(gen.toCSS()).toContain('transform: scale(1.5);')
    })

    it('should generate scale-0', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('scale-0')
      expect(gen.toCSS()).toContain('transform: scale(0);')
    })

    it('should generate scale-x-50', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('scale-x-50')
      expect(gen.toCSS()).toContain('transform: scaleX(0.5);')
    })

    it('should generate scale-y-125', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('scale-y-125')
      expect(gen.toCSS()).toContain('transform: scaleY(1.25);')
    })

    it('should generate scale-z-150', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('scale-z-150')
      expect(gen.toCSS()).toContain('transform: scaleZ(1.5);')
    })
  })

  describe('Rotate', () => {
    it('should generate rotate-45', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('rotate-45')
      expect(gen.toCSS()).toContain('transform: rotate(45deg);')
    })

    it('should generate rotate-90', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('rotate-90')
      expect(gen.toCSS()).toContain('transform: rotate(90deg);')
    })

    it('should generate rotate-180', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('rotate-180')
      expect(gen.toCSS()).toContain('transform: rotate(180deg);')
    })
  })

  describe('3D Rotate', () => {
    it('should generate rotate-x-45', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('rotate-x-45')
      expect(gen.toCSS()).toContain('transform: rotateX(45deg);')
    })

    it('should generate rotate-y-90', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('rotate-y-90')
      expect(gen.toCSS()).toContain('transform: rotateY(90deg);')
    })

    it('should generate rotate-z-180', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('rotate-z-180')
      expect(gen.toCSS()).toContain('transform: rotateZ(180deg);')
    })
  })

  describe('Translate', () => {
    it('should generate translate-x-4', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('translate-x-4')
      expect(gen.toCSS()).toContain('transform: translateX(1rem);')
    })

    it('should generate translate-y-8', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('translate-y-8')
      expect(gen.toCSS()).toContain('transform: translateY(2rem);')
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
      expect(gen.toCSS()).toContain('transform: translateX(-1rem);')
    })

    it('should generate translate-z-4', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('translate-z-4')
      expect(gen.toCSS()).toContain('transform: translateZ(1rem);')
    })
  })

  describe('Skew', () => {
    it('should generate skew-x-3', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('skew-x-3')
      expect(gen.toCSS()).toContain('transform: skewX(3deg);')
    })

    it('should generate skew-y-6', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('skew-y-6')
      expect(gen.toCSS()).toContain('transform: skewY(6deg);')
    })
  })

  describe('Transform properties', () => {
    it('should generate backface-hidden', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('backface-hidden')
      expect(gen.toCSS()).toContain('backface-visibility: hidden;')
    })

    it('should generate transform-3d', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('transform-3d')
      expect(gen.toCSS()).toContain('transform-style: preserve-3d;')
    })

    it('should generate perspective-origin-center', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('perspective-origin-center')
      expect(gen.toCSS()).toContain('perspective-origin: center;')
    })
  })
})
