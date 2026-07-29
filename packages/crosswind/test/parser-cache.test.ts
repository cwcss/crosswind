import type { BracketSyntaxConfig } from '../src/types'
import { describe, expect, it } from 'bun:test'
import { clearParseCaches, expandBracketSyntax, parseClass } from '../src/parser'

describe('parse cache bounds', () => {
  it('stays bounded as unique classes accumulate', () => {
    clearParseCaches()
    // Far more distinct arbitrary values than the cache ceiling. A watching
    // build hits this shape constantly: every keystroke in `w-[137px]` mints a
    // new key, and an unbounded cache never gives the memory back.
    for (let i = 0; i < 12_000; i++) {
      expect(parseClass(`w-[${i}px]`).value).toBe(`${i}px`)
    }
    // Recently parsed classes are still served correctly whether or not they
    // survived eviction.
    expect(parseClass('w-[11999px]').value).toBe('11999px')
    expect(parseClass('w-[0px]').value).toBe('0px')
  })

  it('keeps returning correct results after eviction', () => {
    clearParseCaches()
    const first = parseClass('hover:!bg-red-500')
    for (let i = 0; i < 11_000; i++) parseClass(`p-[${i}px]`)
    const again = parseClass('hover:!bg-red-500')
    expect(again).toEqual(first)
  })
})

describe('bracket syntax alias memoization', () => {
  it('expands identically whether or not the config is reused', () => {
    const config: BracketSyntaxConfig = {
      enabled: true,
      aliases: { fx: 'flex' },
    }
    const first = expandBracketSyntax('flex[col jc-center]', config)
    const second = expandBracketSyntax('flex[col jc-center]', config)
    expect(first).toEqual(['flex-col', 'justify-center'])
    expect(second).toEqual(first)
  })

  it('does not let one config leak aliases into another', () => {
    clearParseCaches()
    const withAlias: BracketSyntaxConfig = { enabled: true, aliases: { c: 'end' } }
    const withoutAlias: BracketSyntaxConfig = { enabled: true }
    // 'c' aliases to 'center' by default; the first config overrides it.
    expect(expandBracketSyntax('flex[jc-c]', withAlias)).toEqual(['justify-end'])
    expect(expandBracketSyntax('flex[jc-c]', withoutAlias)).toEqual(['justify-center'])
    // And the memo must not have been poisoned by the other config.
    expect(expandBracketSyntax('flex[jc-c]', withAlias)).toEqual(['justify-end'])
  })
})
