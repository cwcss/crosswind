import { describe, expect, it } from 'bun:test'
import { defaultConfig } from '../src/config'
import { CSSGenerator } from '../src/generator'

describe('Positional Variants', () => {
  it('should generate first variant', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('first:bg-gray-500')
    const css = gen.toCSS(false)
    expect(css).toContain(':first-child')
    expect(css).toContain('background-color: oklch(55.1% 0.027 264.364);')
  })

  it('should generate last variant', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('last:border-gray-300')
    const css = gen.toCSS(false)
    expect(css).toContain(':last-child')
  })

  it('should generate odd variant', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('odd:bg-gray-50')
    const css = gen.toCSS(false)
    expect(css).toContain(':nth-child(odd)')
    expect(css).toContain('background-color: oklch(98.5% 0.002 247.839);')
  })

  it('should generate even variant', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('even:bg-gray-100')
    const css = gen.toCSS(false)
    expect(css).toContain(':nth-child(even)')
    expect(css).toContain('background-color: oklch(96.7% 0.003 264.542);')
  })

  it('should generate first-of-type variant', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('first-of-type:mt-0')
    const css = gen.toCSS(false)
    expect(css).toContain(':first-of-type')
  })

  it('should generate last-of-type variant', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('last-of-type:mb-0')
    const css = gen.toCSS(false)
    expect(css).toContain(':last-of-type')
  })

  it('should handle all positional variants', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('first:last:odd:even:bg-red-500')
    const css = gen.toCSS(false)
    expect(css).toContain(':first-child')
    expect(css).toContain(':last-child')
  })
})
