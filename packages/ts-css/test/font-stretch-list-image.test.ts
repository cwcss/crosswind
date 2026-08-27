import { describe, expect, it } from 'bun:test'
import { defaultConfig } from '../src/config'
import { CSSGenerator } from '../src/generator'
import { parseClass } from '../src/parser'

function css(className: string): string {
  const gen = new CSSGenerator(defaultConfig)
  gen.generate(className)
  return gen.toCSS(false)
}

describe('font-stretch', () => {
  it('parses as one compound utility', () => {
    // Without font-stretch in the compound-prefix list the parser split at the
    // first dash (`font` / `stretch-expanded`) and the rule never matched.
    const parsed = parseClass('font-stretch-expanded')
    expect(parsed.utility).toBe('font-stretch')
    expect(parsed.value).toBe('expanded')
  })

  it('generates the named scale', () => {
    expect(css('font-stretch-ultra-condensed')).toContain('font-stretch: ultra-condensed;')
    expect(css('font-stretch-condensed')).toContain('font-stretch: condensed;')
    expect(css('font-stretch-normal')).toContain('font-stretch: normal;')
    expect(css('font-stretch-expanded')).toContain('font-stretch: expanded;')
    expect(css('font-stretch-ultra-expanded')).toContain('font-stretch: ultra-expanded;')
  })

  it('accepts percentages and arbitrary values', () => {
    expect(css('font-stretch-75%')).toContain('font-stretch: 75%;')
    expect(css('font-stretch-[87.5%]')).toContain('font-stretch: 87.5%;')
  })

  it('rejects unknown words', () => {
    expect(css('font-stretch-foo')).toBe('')
  })

  it('still leaves font-weight and font-family alone', () => {
    expect(css('font-bold')).toContain('font-weight: 700;')
    expect(css('font-sans')).toContain('font-family:')
  })

  it('works under a variant', () => {
    expect(css('md:font-stretch-expanded')).toContain('font-stretch: expanded;')
  })
})

describe('list-image', () => {
  it('parses as one compound utility', () => {
    const parsed = parseClass('list-image-none')
    expect(parsed.utility).toBe('list-image')
    expect(parsed.value).toBe('none')
  })

  it('generates none and arbitrary values', () => {
    expect(css('list-image-none')).toContain('list-style-image: none;')
    // An arbitrary value already carries its own function — it must not be
    // wrapped again into url(url(...)).
    expect(css('list-image-[url(/img.png)]')).toContain('list-style-image: url(/img.png);')
    expect(css('list-image-[linear-gradient(white,black)]'))
      .toContain('list-style-image: linear-gradient(white,black);')
  })

  it('still leaves the other list utilities alone', () => {
    expect(css('list-disc')).toContain('list-style-type: disc;')
    expect(css('list-inside')).toContain('list-style-position: inside;')
  })
})
