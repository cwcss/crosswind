import { describe, expect, it } from 'bun:test'
import { defaultConfig } from '../src/config'
import { CSSGenerator } from '../src/generator'

// Utilities must treat their value maps as allowlists, not alias tables:
// an unknown bare word (often a semantic class name like `z-modal` or
// `order-summary`) must generate NO css, while numbers, keywords, and
// arbitrary [...] values keep working. Mirrors the grid-placement fix.

function css(cls: string): string {
  const gen = new CSSGenerator(defaultConfig)
  gen.generate(cls)
  return gen.toCSS(false).trim()
}

describe('z-index value validation', () => {
  it('rejects unknown words', () => {
    expect(css('z-foo')).toBe('')
    expect(css('z-modal')).toBe('')
  })

  it('accepts any integer, negatives, auto, and arbitrary', () => {
    expect(css('z-40')).toContain('z-index: 40;')
    expect(css('z-100')).toContain('z-index: 100;')
    expect(css('-z-1')).toContain('z-index: -1;')
    expect(css('z-auto')).toContain('z-index: auto;')
    expect(css('z-[999]')).toContain('z-index: 999;')
  })
})

describe('order value validation', () => {
  it('rejects unknown words', () => {
    expect(css('order-foo')).toBe('')
    expect(css('order-summary')).toBe('')
  })

  it('accepts integers, keywords, and arbitrary', () => {
    expect(css('order-3')).toContain('order: 3;')
    expect(css('order-13')).toContain('order: 13;')
    expect(css('order-first')).toContain('order: -9999;')
    expect(css('order-none')).toContain('order: 0;')
    expect(css('-order-1')).toContain('order: -1;')
    expect(css('order-[42]')).toContain('order: 42;')
  })
})

describe('opacity value validation', () => {
  it('rejects unknown words', () => {
    expect(css('opacity-foo')).toBe('')
  })

  it('accepts scale steps, off-scale integers, and arbitrary', () => {
    expect(css('opacity-50')).toContain('opacity: 0.5;')
    expect(css('opacity-33')).toContain('opacity: 0.33;')
    expect(css('opacity-[0.125]')).toContain('opacity: 0.125;')
  })

  it('rejects out-of-range integers', () => {
    expect(css('opacity-150')).toBe('')
  })
})

describe('transition/animation time value validation', () => {
  it('rejects unknown words instead of emitting fooms', () => {
    expect(css('duration-foo')).toBe('')
    expect(css('delay-foo')).toBe('')
    expect(css('animate-duration-foo')).toBe('')
    expect(css('animate-delay-foo')).toBe('')
    expect(css('animate-iteration-foo')).toBe('')
  })

  it('keeps presets and bare numbers', () => {
    expect(css('duration-300')).toContain('transition-duration: 300ms;')
    expect(css('duration-250')).toContain('transition-duration: 250ms;')
    expect(css('delay-0')).toContain('transition-delay: 0s;')
    expect(css('animate-duration-500')).toContain('animation-duration: 500ms;')
    expect(css('animate-iteration-3')).toContain('animation-iteration-count: 3;')
    expect(css('animate-iteration-infinite')).toContain('animation-iteration-count: infinite;')
  })

  it('passes arbitrary values through verbatim (no double ms suffix)', () => {
    expect(css('duration-[2s]')).toContain('transition-duration: 2s;')
    expect(css('delay-[150ms]')).toContain('transition-delay: 150ms;')
    expect(css('duration-[var(--speed)]')).toContain('transition-duration: var(--speed);')
  })
})
