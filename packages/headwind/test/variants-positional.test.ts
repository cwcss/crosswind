import { describe, expect, it } from 'bun:test'
import { defaultConfig } from '../src/config'
import { CSSGenerator } from '../src/generator'

describe('Positional Variants', () => {
  it('should generate first variant', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('first:bg-gray-500')
    const css = gen.toCSS()
    expect(css).toContain(':first-child')
    expect(css).toContain('background-color: #6b7280;')
  })

  it('should generate last variant', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('last:border-gray-300')
    const css = gen.toCSS()
    expect(css).toContain(':last-child')
  })

  it('should generate odd variant', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('odd:bg-gray-50')
    const css = gen.toCSS()
    expect(css).toContain(':nth-child(odd)')
    expect(css).toContain('background-color: #f9fafb;')
  })

  it('should generate even variant', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('even:bg-gray-100')
    const css = gen.toCSS()
    expect(css).toContain(':nth-child(even)')
    expect(css).toContain('background-color: #f3f4f6;')
  })

  it('should generate first-of-type variant', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('first-of-type:mt-0')
    const css = gen.toCSS()
    expect(css).toContain(':first-of-type')
  })

  it('should generate last-of-type variant', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('last-of-type:mb-0')
    const css = gen.toCSS()
    expect(css).toContain(':last-of-type')
  })

  it('should handle all positional variants', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('first:last:odd:even:bg-red-500')
    const css = gen.toCSS()
    expect(css).toContain(':first-child')
    expect(css).toContain(':last-child')
  })
})
