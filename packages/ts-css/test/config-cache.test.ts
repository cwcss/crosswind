import type { TsCssConfig } from '../src/types'
import { describe, expect, it } from 'bun:test'
import { defaultConfig } from '../src/config'
import { CSSGenerator } from '../src/generator'

/**
 * Theme-derived lookup tables are memoised on the theme sub-object they derive
 * from, shared across every generator that reuses that object. That is what
 * makes a cold build cheap, and it is also the kind of cache that fails
 * silently — a leak between configs shows up as one project rendering another
 * project's colours, not as an exception. These pin the boundaries.
 */
describe('theme-derived caches', () => {
  function css(config: TsCssConfig, classes: string[]): string {
    const gen = new CSSGenerator(config)
    gen.generateBatch(classes)
    return gen.toCSS(false)
  }

  it('does not leak a custom colour into a config using the default theme', () => {
    const custom = {
      ...defaultConfig,
      theme: {
        ...defaultConfig.theme,
        colors: { ...defaultConfig.theme.colors, red: { ...(defaultConfig.theme.colors.red as object), 500: '#ff0000' } },
      },
    }

    expect(css(custom, ['text-red-500'])).toContain('#ff0000')
    // The default config shares neither the colours object nor its cache entry.
    expect(css({ ...defaultConfig }, ['text-red-500'])).not.toContain('#ff0000')
  })

  it('keeps two custom palettes independent', () => {
    const make = (hex: string) => ({
      ...defaultConfig,
      theme: {
        ...defaultConfig.theme,
        colors: { ...defaultConfig.theme.colors, brand: hex },
      },
    })

    expect(css(make('#111111'), ['text-brand'])).toContain('#111111')
    expect(css(make('#222222'), ['text-brand'])).toContain('#222222')
  })

  it('applies a custom spacing scale without affecting the defaults', () => {
    const custom = {
      ...defaultConfig,
      theme: { ...defaultConfig.theme, spacing: { ...defaultConfig.theme.spacing, 4: '99px' } },
    }

    expect(css(custom, ['p-4'])).toContain('99px')
    expect(css({ ...defaultConfig }, ['p-4'])).toContain('1rem')
  })

  it('applies custom screens without affecting the defaults', () => {
    const custom = {
      ...defaultConfig,
      theme: { ...defaultConfig.theme, screens: { ...defaultConfig.theme.screens, md: '900px' } },
    }

    expect(css(custom, ['md:flex'])).toContain('900px')
    expect(css({ ...defaultConfig }, ['md:flex'])).toContain('768px')
  })

  it('applies a custom border radius without affecting the defaults', () => {
    const custom = {
      ...defaultConfig,
      theme: { ...defaultConfig.theme, borderRadius: { ...defaultConfig.theme.borderRadius, lg: '3rem' } },
    }

    expect(css(custom, ['rounded-lg'])).toContain('3rem')
    expect(css({ ...defaultConfig }, ['rounded-lg'])).toContain('0.5rem')
  })

  it('honours theme.extend through the same caches', () => {
    const extended = {
      ...defaultConfig,
      theme: {
        ...defaultConfig.theme,
        extend: { colors: { brand: { 500: '#0b7a55' } }, spacing: { 18: '4.5rem' } },
      },
    }

    const out = css(extended, ['text-brand-500', 'p-18'])
    expect(out).toContain('#0b7a55')
    expect(out).toContain('4.5rem')
  })

  it('produces identical output for repeated builds of the same config', () => {
    const first = css({ ...defaultConfig }, ['p-4', 'text-red-500', 'md:flex'])
    const second = css({ ...defaultConfig }, ['p-4', 'text-red-500', 'md:flex'])
    expect(second).toBe(first)
  })
})
