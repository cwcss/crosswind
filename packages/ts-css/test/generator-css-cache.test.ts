import { describe, expect, it } from 'bun:test'
import { defaultConfig } from '../src/config'
import { CSSGenerator } from '../src/generator'

/**
 * `toCSS()` memoises its output, so these cover the invalidation paths — a
 * stale stylesheet is a far worse bug than a slow one.
 */
describe('toCSS output cache', () => {
  it('returns the same CSS when nothing changed', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('p-4')
    expect(gen.toCSS(false)).toBe(gen.toCSS(false))
  })

  it('invalidates when a new class is generated', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('p-4')
    const before = gen.toCSS(false)

    gen.generate('m-2')
    const after = gen.toCSS(false)

    expect(after).not.toBe(before)
    expect(after).toContain('.m-2')
    expect(after).toContain('.p-4')
  })

  it('does not invalidate when a class is generated twice', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('p-4')
    const before = gen.toCSS(false)
    gen.generate('p-4')
    expect(gen.toCSS(false)).toBe(before)
  })

  it('keeps the preflight and minify flags apart', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('p-4')

    const plain = gen.toCSS(false, false)
    const minified = gen.toCSS(false, true)
    const withPreflight = gen.toCSS(true, false)

    expect(minified).not.toBe(plain)
    expect(withPreflight).not.toBe(plain)
    expect(minified).toContain('.p-4{')
    expect(withPreflight).toContain('box-sizing: border-box')

    // Asking again for an earlier combination must not hand back the last one.
    expect(gen.toCSS(false, false)).toBe(plain)
  })

  it('invalidates on reset', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('p-4')
    expect(gen.toCSS(false)).toContain('.p-4')

    gen.reset()
    expect(gen.toCSS(false)).not.toContain('.p-4')
  })

  it('invalidates when an animation registers keyframes', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('p-4')
    gen.toCSS(false)

    gen.generate('animate-spin')
    expect(gen.toCSS(false)).toContain('@keyframes spin')
  })

  it('invalidates when a compiled class group is added', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('p-4')
    gen.toCSS(false)

    gen.generateCompiledClass('tc-abc123', ['flex', 'items-center'])
    expect(gen.toCSS(false)).toContain('.tc-abc123')
  })
})
