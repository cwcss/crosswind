import { beforeEach, describe, expect, it } from 'bun:test'
import { css, renderStyles, resetStyles, styleCount } from '../src/style'

describe('css.create', () => {
  beforeEach(() => {
    resetStyles()
  })

  it('compiles each declaration into its own class', () => {
    const styles = css.create({
      card: { padding: 16, color: 'blue' },
    })

    const { className } = css.props(styles.card)
    expect(className!.split(' ')).toHaveLength(2)
    expect(styleCount()).toBe(2)
  })

  it('appends px to numbers on length properties', () => {
    css.create({ box: { padding: 16, width: 100 } })
    const sheet = renderStyles()
    expect(sheet).toContain('padding: 16px')
    expect(sheet).toContain('width: 100px')
  })

  it('leaves unitless properties and zero alone', () => {
    css.create({ box: { opacity: 1, zIndex: 10, lineHeight: 1.5, margin: 0 } })
    const sheet = renderStyles()
    expect(sheet).toContain('opacity: 1')
    expect(sheet).toContain('z-index: 10')
    expect(sheet).toContain('line-height: 1.5')
    expect(sheet).toContain('margin: 0')
    expect(sheet).not.toContain('0px')
  })

  it('kebab-cases property names, vendor prefixes included', () => {
    css.create({ box: { backgroundColor: 'red', WebkitLineClamp: 2 } })
    const sheet = renderStyles()
    expect(sheet).toContain('background-color: red')
    expect(sheet).toContain('-webkit-line-clamp: 2')
  })

  it('deduplicates identical declarations across styles', () => {
    const styles = css.create({
      a: { padding: 16 },
      b: { padding: 16 },
    })
    expect(css.props(styles.a).className).toBe(css.props(styles.b).className!)
    expect(styleCount()).toBe(1)
  })

  it('produces stable class names across separate create calls', () => {
    const first = css.props(css.create({ x: { color: 'red' } }).x).className
    resetStyles()
    const second = css.props(css.create({ y: { color: 'red' } }).y).className
    expect(first).toBe(second!)
  })

  it('nests pseudo-classes onto the generated selector', () => {
    css.create({ link: { ':hover': { color: 'red' } } })
    expect(renderStyles()).toMatch(/\.tc[a-z0-9]+:hover \{ color: red \}/)
  })

  it('nests pseudo-elements onto the generated selector', () => {
    css.create({ tick: { '::before': { content: '"*"' } } })
    expect(renderStyles()).toMatch(/\.tc[a-z0-9]+::before \{ content: "\*" \}/)
  })

  it('wraps at-rule conditions around the rule', () => {
    css.create({ box: { '@media (min-width: 768px)': { padding: 24 } } })
    expect(renderStyles()).toMatch(/@media \(min-width: 768px\) \{ \.tc[a-z0-9]+ \{ padding: 24px \} \}/)
  })

  it('substitutes & in a nested selector', () => {
    css.create({ item: { '[data-open] &': { display: 'block' } } })
    expect(renderStyles()).toMatch(/\[data-open\] \.tc[a-z0-9]+ \{ display: block \}/)
  })

  it('accepts per-property condition maps', () => {
    css.create({
      link: { color: { default: 'blue', ':hover': 'red' } },
    })
    const sheet = renderStyles()
    expect(sheet).toMatch(/\.tc[a-z0-9]+ \{ color: blue \}/)
    expect(sheet).toMatch(/\.tc[a-z0-9]+:hover \{ color: red \}/)
  })

  it('emits array values as ordered fallback declarations', () => {
    css.create({ bar: { position: ['fixed', 'sticky'] } })
    expect(renderStyles()).toContain('position: fixed; position: sticky')
  })
})

describe('css.props', () => {
  beforeEach(() => {
    resetStyles()
  })

  it('lets a later style win per property, not per class', () => {
    const styles = css.create({
      base: { color: 'blue', padding: 16 },
      override: { color: 'red' },
    })

    const merged = css.props(styles.base, styles.override).className!.split(' ')
    const base = css.props(styles.base).className!.split(' ')
    const override = css.props(styles.override).className!

    expect(merged).toHaveLength(2)
    expect(merged).toContain(override)
    expect(merged).not.toContain(base[0])
  })

  it('keeps conditional declarations separate from their base', () => {
    const styles = css.create({
      base: { color: 'blue', ':hover': { color: 'green' } },
      override: { color: 'red' },
    })
    // Only the unconditional colour is replaced; the hover rule survives.
    expect(css.props(styles.base, styles.override).className!.split(' ')).toHaveLength(2)
  })

  it('skips falsy arguments', () => {
    const styles = css.create({ base: { color: 'blue' } })
    const expected = css.props(styles.base)
    expect(css.props(styles.base, false)).toEqual(expected)
    expect(css.props(styles.base, null)).toEqual(expected)
    expect(css.props(styles.base, undefined)).toEqual(expected)
  })

  it('flattens arrays of styles', () => {
    const styles = css.create({ a: { color: 'blue' }, b: { padding: 8 } })
    expect(css.props([styles.a, styles.b])).toEqual(css.props(styles.a, styles.b))
  })

  it('returns no className when nothing applies', () => {
    expect(css.props(false, null, undefined)).toEqual({})
  })

  it('drops a property a later style sets to null', () => {
    const styles = css.create({
      base: { color: 'blue', padding: 16 },
      bare: { padding: null },
    })
    expect(css.props(styles.base, styles.bare).className).toBe(
      css.props(css.create({ only: { color: 'blue' } }).only).className!,
    )
  })
})

describe('dynamic styles', () => {
  beforeEach(() => {
    resetStyles()
  })

  it('parameterises the rule with a custom property', () => {
    const styles = css.create({ sized: (width: number) => ({ width }) })
    const { className, style } = css.props(styles.sized(120))

    expect(className).toMatch(/^tc[a-z0-9]+$/)
    expect(Object.values(style!)).toEqual(['120px'])
    expect(renderStyles()).toMatch(/\.tc[a-z0-9]+ \{ width: var\(--tc[a-z0-9]+\) \}/)
  })

  it('emits one rule no matter how many values are used', () => {
    const styles = css.create({ sized: (width: number) => ({ width }) })
    css.props(styles.sized(1))
    css.props(styles.sized(2))
    css.props(styles.sized(3))
    expect(styleCount()).toBe(1)
  })

  it('registers its rule at create time, before any call', () => {
    css.create({ sized: (width: number) => ({ width }) })
    expect(renderStyles()).toContain('width: var(')
  })

  it('merges with static styles by property', () => {
    const styles = css.create({
      base: { width: 10, color: 'red' },
      sized: (width: number) => ({ width }),
    })
    const merged = css.props(styles.base, styles.sized(50))
    expect(merged.className!.split(' ')).toHaveLength(2)
    expect(Object.values(merged.style!)).toEqual(['50px'])
  })
})

describe('css.defineVars', () => {
  beforeEach(() => {
    resetStyles()
  })

  it('returns var() references and declares them on :root', () => {
    const theme = css.defineVars({ accent: '#0b7' })
    expect(theme.accent).toMatch(/^var\(--tc[a-z0-9]+\)$/)
    expect(renderStyles()).toMatch(/:root \{ --tc[a-z0-9]+: #0b7 \}/)
  })

  it('declares conditional values under their at-rule', () => {
    css.defineVars({
      surface: { default: '#fff', '@media (prefers-color-scheme: dark)': '#111' },
    })
    const sheet = renderStyles()
    expect(sheet).toMatch(/:root \{ --tc[a-z0-9]+: #fff \}/)
    expect(sheet).toMatch(/@media \(prefers-color-scheme: dark\) \{ :root \{ --tc[a-z0-9]+: #111 \} \}/)
  })

  it('is content-addressed, so the same group hashes the same', () => {
    const first = css.defineVars({ accent: '#0b7' }).accent
    resetStyles()
    expect(css.defineVars({ accent: '#0b7' }).accent).toBe(first)
  })
})

describe('css.createTheme', () => {
  beforeEach(() => {
    resetStyles()
  })

  it('redeclares the group under a generated class', () => {
    const theme = css.defineVars({ accent: '#0b7' })
    const dark = css.createTheme(theme, { accent: '#fff' })

    expect(dark).toMatch(/^tc[a-z0-9]+$/)
    const varName = theme.accent.slice('var('.length, -1)
    expect(renderStyles()).toContain(`.${dark} { ${varName}: #fff }`)
  })

  it('rejects an object that did not come from defineVars', () => {
    expect(() => css.createTheme({ accent: 'var(--x)' }, { accent: 'red' })).toThrow(TypeError)
  })
})

describe('css.keyframes', () => {
  beforeEach(() => {
    resetStyles()
  })

  it('registers the animation and returns its name', () => {
    const name = css.keyframes({ from: { opacity: 0 }, to: { opacity: 1 } })
    expect(name).toMatch(/^tc[a-z0-9]+$/)
    expect(renderStyles()).toContain(`@keyframes ${name} { from { opacity: 0 } to { opacity: 1 } }`)
  })

  it('is usable as an animationName value', () => {
    const name = css.keyframes({ from: { opacity: 0 }, to: { opacity: 1 } })
    css.create({ intro: { animationName: name } })
    expect(renderStyles()).toContain(`animation-name: ${name}`)
  })
})

describe('css.firstThatWorks', () => {
  it('orders values so the most preferred is declared last', () => {
    expect(css.firstThatWorks('sticky', '-webkit-sticky', 'fixed'))
      .toEqual(['fixed', '-webkit-sticky', 'sticky'])
  })
})

describe('css.defineConsts', () => {
  it('freezes the constants it hands back', () => {
    const consts = css.defineConsts({ md: '@media (min-width: 768px)' })
    expect(consts.md).toBe('@media (min-width: 768px)')
    expect(Object.isFrozen(consts)).toBe(true)
  })
})

describe('rule ordering', () => {
  beforeEach(() => {
    resetStyles()
  })

  it('emits longhands after the shorthands they refine', () => {
    css.create({ box: { paddingTop: 4, padding: 16 } })
    const sheet = renderStyles()
    expect(sheet.indexOf('padding: 16px')).toBeLessThan(sheet.indexOf('padding-top: 4px'))
  })

  it('emits conditional rules after the unconditional ones', () => {
    css.create({ box: { color: 'blue', ':hover': { color: 'red' } } })
    const sheet = renderStyles()
    expect(sheet.indexOf('color: blue')).toBeLessThan(sheet.indexOf('color: red'))
  })

  it('orders pseudo-classes so :active beats :hover', () => {
    css.create({
      button: {
        ':active': { color: 'green' },
        ':hover': { color: 'red' },
      },
    })
    const sheet = renderStyles()
    expect(sheet.indexOf('color: red')).toBeLessThan(sheet.indexOf('color: green'))
  })

  it('emits at-rule variants after the base declaration', () => {
    css.create({
      box: {
        padding: 8,
        '@media (min-width: 768px)': { padding: 24 },
      },
    })
    const sheet = renderStyles()
    expect(sheet.indexOf('padding: 8px')).toBeLessThan(sheet.indexOf('padding: 24px'))
  })
})

describe('minified output', () => {
  beforeEach(() => {
    resetStyles()
  })

  it('drops every optional space', () => {
    css.create({ box: { padding: 16, '@media (min-width: 768px)': { color: 'red' } } })
    const sheet = renderStyles(true)
    expect(sheet).toContain('{padding:16px}')
    expect(sheet).toContain('@media (min-width: 768px){')
    expect(sheet).not.toContain('{ ')
  })
})
