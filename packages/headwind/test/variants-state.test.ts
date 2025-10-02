import { describe, expect, it } from 'bun:test'
import { CSSGenerator } from '../src/generator'
import { defaultConfig } from '../src/config'

describe('State Variants', () => {
  it('should generate visited variant', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('visited:text-gray-500')
    const css = gen.toCSS()
    expect(css).toContain(':visited')
    expect(css).toContain('color: #6b7280;')
  })

  it('should generate checked variant', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('checked:bg-gray-500')
    const css = gen.toCSS()
    expect(css).toContain(':checked')
  })

  it('should generate focus-within variant', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('focus-within:border-gray-300')
    const css = gen.toCSS()
    expect(css).toContain(':focus-within')
  })

  it('should generate focus-visible variant', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('focus-visible:ring')
    const css = gen.toCSS()
    expect(css).toContain(':focus-visible')
  })

  it('should generate disabled variant', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('disabled:opacity-50')
    const css = gen.toCSS()
    expect(css).toContain(':disabled')
  })

  it('should generate hover variant', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('hover:bg-gray-100')
    const css = gen.toCSS()
    expect(css).toContain(':hover')
  })

  it('should generate focus variant', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('focus:outline-none')
    const css = gen.toCSS()
    expect(css).toContain(':focus')
  })

  it('should generate active variant', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('active:bg-gray-200')
    const css = gen.toCSS()
    expect(css).toContain(':active')
  })
})
