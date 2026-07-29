import { describe, expect, it } from 'bun:test'
import { defaultConfig } from '../src/config'
import { CSSGenerator } from '../src/generator'

function css(className: string): string {
  const gen = new CSSGenerator(defaultConfig)
  gen.generate(className)
  return gen.toCSS(false)
}

describe('perspective', () => {
  it('generates the named scale', () => {
    expect(css('perspective-dramatic')).toContain('perspective: 100px;')
    expect(css('perspective-near')).toContain('perspective: 300px;')
    expect(css('perspective-normal')).toContain('perspective: 500px;')
    expect(css('perspective-midrange')).toContain('perspective: 800px;')
    expect(css('perspective-distant')).toContain('perspective: 1200px;')
    expect(css('perspective-none')).toContain('perspective: none;')
  })

  it('still takes bare numbers and arbitrary lengths', () => {
    expect(css('perspective-500')).toContain('perspective: 500px;')
    expect(css('perspective-[37rem]')).toContain('perspective: 37rem;')
  })

  it('rejects unknown words', () => {
    expect(css('perspective-foo')).toBe('')
  })
})

describe('tab-size', () => {
  it('generates integer and arbitrary sizes', () => {
    expect(css('tab-2')).toContain('tab-size: 2;')
    expect(css('tab-4')).toContain('tab-size: 4;')
    expect(css('tab-[6]')).toContain('tab-size: 6;')
  })

  it('rejects non-integers', () => {
    expect(css('tab-foo')).toBe('')
    expect(css('tab-2.5')).toBe('')
  })

  it('works under a variant', () => {
    expect(css('md:tab-8')).toContain('tab-size: 8;')
  })
})

describe('color-scheme', () => {
  it('generates the v4 scheme-* spelling', () => {
    expect(css('scheme-normal')).toContain('color-scheme: normal;')
    expect(css('scheme-light')).toContain('color-scheme: light;')
    expect(css('scheme-dark')).toContain('color-scheme: dark;')
    expect(css('scheme-light-dark')).toContain('color-scheme: light dark;')
    expect(css('scheme-only-dark')).toContain('color-scheme: only dark;')
    expect(css('scheme-only-light')).toContain('color-scheme: only light;')
  })

  it('keeps the longer color-scheme-* form accepted', () => {
    expect(css('color-scheme-dark')).toContain('color-scheme: dark;')
    expect(css('color-scheme-light-dark')).toContain('color-scheme: light dark;')
  })

  it('rejects unknown schemes', () => {
    expect(css('scheme-foo')).toBe('')
  })
})

describe('appearance', () => {
  it('supports the v4 base value alongside none and auto', () => {
    expect(css('appearance-none')).toContain('appearance: none;')
    expect(css('appearance-auto')).toContain('appearance: auto;')
    expect(css('appearance-base')).toContain('appearance: base;')
  })
})

describe('overflow-wrap', () => {
  it('accepts the v4 wrap-* spelling', () => {
    expect(css('wrap-normal')).toContain('overflow-wrap: normal;')
    expect(css('wrap-break-word')).toContain('overflow-wrap: break-word;')
    expect(css('wrap-anywhere')).toContain('overflow-wrap: anywhere;')
  })

  it('keeps the overflow-wrap-* form accepted', () => {
    expect(css('overflow-wrap-normal')).toContain('overflow-wrap: normal;')
    expect(css('overflow-wrap-break')).toContain('overflow-wrap: break-word;')
    expect(css('overflow-wrap-anywhere')).toContain('overflow-wrap: anywhere;')
  })

  it('leaves the flex-wrap utilities alone', () => {
    expect(css('flex-wrap')).toContain('flex-wrap: wrap;')
    expect(css('flex-nowrap')).toContain('flex-wrap: nowrap;')
  })
})
