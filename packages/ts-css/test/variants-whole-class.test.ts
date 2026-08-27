import { describe, expect, it } from 'bun:test'
import { defaultConfig } from '../src/config'
import { CSSGenerator } from '../src/generator'
import { parseClass } from '../src/parser'
import { scrollSnapRule } from '../src/rules-interactivity'

function css(className: string): string {
  const gen = new CSSGenerator(defaultConfig)
  gen.generate(className)
  return gen.toCSS(false)
}

/**
 * Utilities recognised by their whole class name (rather than by a
 * utility/value split) used to match against `parsed.raw`, which still carries
 * the variant prefixes and the important marker. Every one of them generated
 * nothing at all under any variant — `md:break-inside-avoid` and
 * `hover:backface-hidden` were silently dropped.
 *
 * They now match on `parsed.base`, so a variant is purely additive.
 */
describe('whole-class utilities under variants', () => {
  // One representative from each rule module that matches on the full class.
  const utilities = [
    ['backface-hidden', 'backface-visibility: hidden'],
    ['transform-3d', 'transform-style: preserve-3d'],
    ['break-inside-avoid', 'break-inside: avoid'],
    ['field-sizing-content', 'field-sizing: content'],
    ['writing-vertical-rl', 'writing-mode: vertical-rl'],
    ['overflow-wrap-anywhere', 'overflow-wrap: anywhere'],
    ['tabular-nums', 'font-variant-numeric: tabular-nums'],
    ['column-span-all', 'column-span: all'],
    ['direction-rtl', 'direction: rtl'],
    ['animate-paused', 'animation-play-state: paused'],
    ['cursor-not-allowed', 'cursor: not-allowed'],
  ] as const

  for (const [utility, declaration] of utilities) {
    it(`generates ${utility} unprefixed, responsive, stateful and important`, () => {
      expect(css(utility)).toContain(declaration)

      const responsive = css(`md:${utility}`)
      expect(responsive).toContain('@media (min-width: 768px)')
      expect(responsive).toContain(declaration)

      expect(css(`hover:${utility}`)).toContain(':hover')
      expect(css(`hover:${utility}`)).toContain(declaration)

      expect(css(`!${utility}`)).toContain(`${declaration} !important`)
      expect(css(`${utility}!`)).toContain(`${declaration} !important`)
    })
  }

  /**
   * The cursor family is the one people hit first: a disabled button that
   * still shows a pointer is the canonical symptom of this whole bug class,
   * and `disabled:`/`hover:` cursors appear in almost every real UI.
   */
  it('generates the cursor family under interaction variants', () => {
    expect(css('disabled:cursor-not-allowed')).toContain('cursor: not-allowed')
    expect(css('disabled:cursor-not-allowed')).toContain(':disabled')
    expect(css('hover:cursor-pointer')).toContain('cursor: pointer')
    expect(css('hover:cursor-pointer')).toContain(':hover')
    expect(css('group-hover:cursor-grab')).toContain('cursor: grab')
  })

  it('stacks variants without losing the utility', () => {
    const out = css('dark:md:hover:backface-hidden')
    expect(out).toContain('@media (min-width: 768px)')
    expect(out).toContain('backface-visibility: hidden')
  })
})

describe('parseClass base', () => {
  it('strips variants and both important forms', () => {
    expect(parseClass('flex').base).toBe('flex')
    expect(parseClass('hover:flex').base).toBe('flex')
    expect(parseClass('dark:md:hover:flex').base).toBe('flex')
    expect(parseClass('!p-4').base).toBe('p-4')
    expect(parseClass('p-4!').base).toBe('p-4')
    expect(parseClass('hover:!p-4').base).toBe('p-4')
    expect(parseClass('md:p-4!').base).toBe('p-4')
  })

  it('leaves arbitrary properties intact', () => {
    expect(parseClass('[color:red]').base).toBe('[color:red]')
    expect(parseClass('![mask-type:luminance]').base).toBe('[mask-type:luminance]')
  })
})

describe('scroll-snap rule fallback', () => {
  it('agrees with the generator fast path', () => {
    // scrollSnapRule shadows the static map and had drifted: it defaulted the
    // strictness to `mandatory` instead of proximity, and emitted the invalid
    // `scroll-snap-type: mandatory` for snap-mandatory.
    expect(scrollSnapRule(parseClass('snap-x'), defaultConfig))
      .toEqual({ 'scroll-snap-type': 'x var(--cw-scroll-snap-strictness, proximity)' })
    expect(scrollSnapRule(parseClass('snap-mandatory'), defaultConfig))
      .toEqual({ '--cw-scroll-snap-strictness': 'mandatory' })
    expect(scrollSnapRule(parseClass('snap-proximity'), defaultConfig))
      .toEqual({ '--cw-scroll-snap-strictness': 'proximity' })
    expect(scrollSnapRule(parseClass('snap-none'), defaultConfig))
      .toEqual({ 'scroll-snap-type': 'none' })
  })
})
