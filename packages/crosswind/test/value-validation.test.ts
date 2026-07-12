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

describe('transform value validation', () => {
  it('rejects unknown words for scale/rotate/skew/translate', () => {
    expect(css('scale-foo')).toBe('')
    expect(css('scale-x-foo')).toBe('')
    expect(css('rotate-foo')).toBe('')
    expect(css('rotate-x-foo')).toBe('')
    expect(css('skew-x-foo')).toBe('')
    expect(css('skew-y-foo')).toBe('')
    expect(css('translate-x-foo')).toBe('')
    expect(css('-translate-y-foo')).toBe('')
  })

  it('keeps numeric and unit forms', () => {
    expect(css('scale-150')).toContain('transform: scale(1.5);')
    expect(css('scale-x-50')).toContain('transform: scaleX(0.5);')
    expect(css('rotate-45')).toContain('transform: rotate(45deg);')
    expect(css('-rotate-90')).toContain('transform: rotate(-90deg);')
    expect(css('rotate-x-30')).toContain('transform: rotateX(30deg);')
    expect(css('skew-x-12')).toContain('transform: skewX(12deg);')
    expect(css('translate-x-4')).toContain('transform: translateX(1rem);')
    expect(css('-translate-y-1/2')).toContain('transform: translateY(-50%);')
    expect(css('translate-x-full')).toContain('transform: translateX(100%);')
  })

  it('keeps arbitrary transform values', () => {
    expect(css('scale-[1.7]')).toContain('transform: scale(1.7);')
    expect(css('rotate-[17deg]')).toContain('transform: rotate(17deg);')
    expect(css('rotate-[0.5turn]')).toContain('transform: rotate(0.5turn);')
    expect(css('translate-x-[10px]')).toContain('transform: translateX(10px);')
    expect(css('skew-y-[3deg]')).toContain('transform: skewY(3deg);')
  })
})

describe('typography value validation', () => {
  it('rejects unknown words', () => {
    expect(css('leading-foo')).toBe('')
    expect(css('tracking-foo')).toBe('')
    expect(css('-tracking-foo')).toBe('')
    expect(css('line-clamp-foo')).toBe('')
    expect(css('indent-foo')).toBe('')
    expect(css('word-spacing-foo')).toBe('')
  })

  it('does not quote bare words as content (content-wrapper)', () => {
    expect(css('content-wrapper')).toBe('')
    expect(css('content-area')).toBe('')
  })

  it('keeps named scales, numbers, and arbitrary values', () => {
    expect(css('leading-tight')).toContain('line-height: 1.25;')
    expect(css('leading-7')).toContain('line-height: 1.75rem;')
    expect(css('leading-[1.15]')).toContain('line-height: 1.15;')
    expect(css('tracking-wide')).toContain('letter-spacing: 0.025em;')
    expect(css('-tracking-wide')).toContain('letter-spacing: -0.025em;')
    expect(css('tracking-[0.2em]')).toContain('letter-spacing: 0.2em;')
    expect(css('line-clamp-3')).toContain('-webkit-line-clamp: 3;')
    expect(css('indent-4')).toContain('text-indent: 1rem;')
    expect(css('-indent-2')).toContain('text-indent: -0.5rem;')
  })

  it('keeps content keywords and arbitrary strings', () => {
    expect(css('content-none')).toContain('content: none;')
    expect(css('content-center')).toContain('align-content:')
    expect(css("content-['hello']")).toContain('content: \'hello\';')
  })

  it('line-clamp-none unsets the clamp', () => {
    const out = css('line-clamp-none')
    expect(out).toContain('-webkit-line-clamp: none;')
    expect(out).toContain('overflow: visible;')
  })
})

describe('sizing value validation', () => {
  it('rejects unknown words', () => {
    expect(css('w-foo')).toBe('')
    expect(css('w-sidebar')).toBe('')
    expect(css('h-foo')).toBe('')
    expect(css('size-foo')).toBe('')
    expect(css('min-w-foo')).toBe('')
    expect(css('max-h-foo')).toBe('')
  })

  it('keeps keywords, scale, fractions, off-scale numbers, and arbitrary', () => {
    expect(css('w-full')).toContain('width: 100%;')
    expect(css('w-dvw')).toContain('width: 100dvw;')
    expect(css('w-4')).toContain('width: 1rem;')
    expect(css('w-1/2')).toContain('width: 50%;')
    expect(css('h-screen')).toContain('height: 100vh;')
    expect(css('size-8')).toContain('width: 2rem;')
    expect(css('max-w-2xl')).toContain('max-width: 42rem;')
    expect(css('min-h-screen')).toContain('min-height: 100vh;')
    expect(css('w-[calc(100%-2rem)]')).toContain('width: calc(100%-2rem);')
    expect(css('max-w-[70ch]')).toContain('max-width: 70ch;')
  })
})
