import { describe, expect, it } from 'bun:test'
import { defaultConfig } from '../src/config'
import { CSSGenerator } from '../src/generator'

describe('Content Utility', () => {
  it('should generate content-none', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('content-none')
    const css = gen.toCSS(false)
    expect(css).toContain('content: none')
  })

  it('should generate content-empty', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('content-empty')
    const css = gen.toCSS(false)
    expect(css).toContain('content: ""')
  })

  it('should generate arbitrary content: content-[\'hello\']', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate("content-['hello']")
    const css = gen.toCSS(false)
    expect(css).toContain("content: 'hello'")
  })

  it('should generate arbitrary content with attr: content-[attr(data-label)]', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('content-[attr(data-label)]')
    const css = gen.toCSS(false)
    expect(css).toContain('content: attr(data-label)')
  })

  it('should generate arbitrary content with empty string: content-[\'\']', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate("content-['']")
    const css = gen.toCSS(false)
    expect(css).toContain("content: ''")
  })

  it('should work with before: variant', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate("before:content-['*']")
    const css = gen.toCSS(false)
    expect(css).toContain('::before')
    expect(css).toContain("content: '*'")
  })
})

describe('Scrollbar Utilities', () => {
  it('should generate scrollbar-auto', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('scrollbar-auto')
    const css = gen.toCSS(false)
    expect(css).toContain('scrollbar-width: auto')
  })

  it('should generate scrollbar-thin', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('scrollbar-thin')
    const css = gen.toCSS(false)
    expect(css).toContain('scrollbar-width: thin')
  })

  it('should generate scrollbar-none', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('scrollbar-none')
    const css = gen.toCSS(false)
    expect(css).toContain('scrollbar-width: none')
  })

  it('should work with hover variant', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('hover:scrollbar-thin')
    const css = gen.toCSS(false)
    expect(css).toContain(':hover')
    expect(css).toContain('scrollbar-width: thin')
  })
})
