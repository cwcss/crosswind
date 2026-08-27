import { describe, expect, it } from 'bun:test'
import { defaultConfig } from '../src/config'
import { CSSGenerator } from '../src/generator'

function css(...classNames: string[]): string {
  const gen = new CSSGenerator(defaultConfig)
  for (const className of classNames) gen.generate(className)
  return gen.toCSS(false)
}

describe('CSS containment utilities', () => {
  it('generates the standalone values', () => {
    expect(css('contain-none')).toContain('contain: none;')
    expect(css('contain-content')).toContain('contain: content;')
    expect(css('contain-strict')).toContain('contain: strict;')
  })

  it('generates each combinable keyword', () => {
    for (const keyword of ['size', 'inline-size', 'layout', 'paint', 'style']) {
      const out = css(`contain-${keyword}`)
      expect(out).toContain(`--cw-contain-${keyword}: ${keyword};`)
      expect(out).toContain('contain: var(--cw-contain-size, )')
    }
  })

  it('lets combinable keywords stack instead of overwriting each other', () => {
    // Both utilities land on the same element in real markup, so each must
    // contribute its own keyword to a shared `contain` declaration.
    const out = css('contain-layout', 'contain-paint')
    expect(out).toContain('--cw-contain-layout: layout;')
    expect(out).toContain('--cw-contain-paint: paint;')
  })

  it('accepts arbitrary values', () => {
    expect(css('contain-[layout_paint]')).toContain('contain: layout paint;')
  })

  it('rejects unknown words', () => {
    expect(css('contain-foo')).toBe('')
    expect(css('contain-modal')).toBe('')
  })

  it('works under variants', () => {
    const out = css('md:contain-layout')
    expect(out).toContain('@media (min-width: 768px)')
    expect(out).toContain('--cw-contain-layout: layout;')
  })
})
