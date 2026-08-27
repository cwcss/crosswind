import { describe, expect, it } from 'bun:test'
import { parseClass } from '../src/parser'

describe('utility/value splitting', () => {
  it('splits at the first dash', () => {
    expect(parseClass('p-4')).toMatchObject({ utility: 'p', value: '4' })
    expect(parseClass('bg-red-500')).toMatchObject({ utility: 'bg', value: 'red-500' })
    expect(parseClass('text-current')).toMatchObject({ utility: 'text', value: 'current' })
  })

  it('handles negatives, fractions and opacity modifiers', () => {
    expect(parseClass('-mt-4')).toMatchObject({ utility: 'mt', value: '-4' })
    expect(parseClass('w-1/2')).toMatchObject({ utility: 'w', value: '1/2' })
    expect(parseClass('bg-blue-500/50')).toMatchObject({ utility: 'bg', value: 'blue-500/50' })
    expect(parseClass('bg-white/[0.04]')).toMatchObject({ utility: 'bg', value: 'white/[0.04]' })
    expect(parseClass('from-red-500/50')).toMatchObject({ utility: 'from', value: 'red-500/50' })
  })

  it('leaves value-less utilities whole', () => {
    expect(parseClass('flex')).toMatchObject({ utility: 'flex', value: undefined })
    expect(parseClass('block')).toMatchObject({ utility: 'block', value: undefined })
  })

  it('does not split when there is nothing after the dash', () => {
    expect(parseClass('p-')).toMatchObject({ utility: 'p-', value: undefined })
  })

  it('only treats the slash as opacity for colour utilities', () => {
    // `grid-cols-2/3` is not a colour utility, so the slash stays in the value
    // rather than being read as an alpha modifier.
    expect(parseClass('basis-1/2')).toMatchObject({ utility: 'basis', value: '1/2' })
  })

  it('parses long dashed class names in linear time', () => {
    // The previous nested-quantifier regex backtracked super-linearly on
    // all-lowercase dashed input; this must stay fast rather than hang.
    const pathological = `${'a-'.repeat(2000)}b`
    const start = performance.now()
    const parsed = parseClass(pathological)
    expect(performance.now() - start).toBeLessThan(100)
    expect(parsed.utility).toBe('a')
  })
})
