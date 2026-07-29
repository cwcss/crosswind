import { describe, expect, it } from 'bun:test'
import { defaultConfig } from '../src/config'
import { formatNumber, fractionToPercent } from '../src/format'
import { CSSGenerator } from '../src/generator'

function css(className: string): string {
  const gen = new CSSGenerator(defaultConfig)
  gen.generate(className)
  return gen.toCSS(false)
}

describe('fractionToPercent', () => {
  it('caps precision at six decimals', () => {
    expect(fractionToPercent(1, 3)).toBe('33.333333%')
    expect(fractionToPercent(2, 3)).toBe('66.666667%')
    expect(fractionToPercent(1, 6)).toBe('16.666667%')
    expect(fractionToPercent(5, 6)).toBe('83.333333%')
  })

  it('keeps exact ratios free of trailing zeros', () => {
    expect(fractionToPercent(1, 2)).toBe('50%')
    expect(fractionToPercent(3, 4)).toBe('75%')
    expect(fractionToPercent(4, 5)).toBe('80%')
  })

  it('rejects denominators that would produce Infinity or NaN', () => {
    expect(fractionToPercent(1, 0)).toBeUndefined()
    expect(fractionToPercent(1, Number.NaN)).toBeUndefined()
  })
})

describe('formatNumber', () => {
  it('leaves integers alone', () => {
    expect(formatNumber(50)).toBe('50')
    expect(formatNumber(0)).toBe('0')
  })

  it('trims float noise', () => {
    expect(formatNumber(33.33333333333333)).toBe('33.333333')
    expect(formatNumber(1.5)).toBe('1.5')
  })
})

describe('generated fractions', () => {
  // The generator's fast-path size table and the rule fallback used to be two
  // independent sources of truth; the fast path carried raw float output like
  // '33.33333333333333%'.
  it('emits the same precision on the fast path and the rule path', () => {
    // w-1/3 hits the precomputed size table, w-1/12 falls through to the rule.
    expect(css('w-1/3')).toContain('width: 33.333333%;')
    expect(css('w-4/12')).toContain('width: 33.333333%;')
    expect(css('h-2/3')).toContain('height: 66.666667%;')
    expect(css('basis-1/3')).toContain('flex-basis: 33.333333%;')
    expect(css('inset-1/3')).toContain('top: 33.333333%;')
    expect(css('translate-x-1/3')).toContain('translateX(33.333333%)')
  })

  it('keeps whole percentages clean', () => {
    expect(css('w-1/2')).toContain('width: 50%;')
    expect(css('w-3/6')).toContain('width: 50%;')
  })
})
