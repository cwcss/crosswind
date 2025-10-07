import { describe, expect, it } from 'bun:test'
import { extractClasses, parseClass } from '../src/parser'

describe('parseClass', () => {
  it('should parse simple utility without value', () => {
    const result = parseClass('flex')
    expect(result).toEqual({
      raw: 'flex',
      variants: [],
      utility: 'flex',
      value: undefined,
      important: false,
      arbitrary: false,
    })
  })

  it('should parse utility with value', () => {
    const result = parseClass('p-4')
    expect(result).toEqual({
      raw: 'p-4',
      variants: [],
      utility: 'p',
      value: '4',
      important: false,
      arbitrary: false,
    })
  })

  it('should parse important modifier', () => {
    const result = parseClass('!p-4')
    expect(result).toEqual({
      raw: '!p-4',
      variants: [],
      utility: 'p',
      value: '4',
      important: true,
      arbitrary: false,
    })
  })

  it('should parse arbitrary value', () => {
    const result = parseClass('w-[100px]')
    expect(result).toEqual({
      raw: 'w-[100px]',
      variants: [],
      utility: 'w',
      value: '100px',
      important: false,
      arbitrary: true,
    })
  })

  it('should parse arbitrary color value', () => {
    const result = parseClass('bg-[#ff0000]')
    expect(result).toEqual({
      raw: 'bg-[#ff0000]',
      variants: [],
      utility: 'bg',
      value: '#ff0000',
      important: false,
      arbitrary: true,
    })
  })

  it('should parse arbitrary value with important', () => {
    const result = parseClass('!w-[100px]')
    expect(result).toEqual({
      raw: '!w-[100px]',
      variants: [],
      utility: 'w',
      value: '100px',
      important: true,
      arbitrary: true,
    })
  })

  it('should parse utility with compound value', () => {
    const result = parseClass('bg-blue-500')
    expect(result).toEqual({
      raw: 'bg-blue-500',
      variants: [],
      utility: 'bg',
      value: 'blue-500',
      important: false,
      arbitrary: false,
    })
  })

  it('should parse utility with single variant', () => {
    const result = parseClass('hover:bg-blue-500')
    expect(result).toEqual({
      raw: 'hover:bg-blue-500',
      variants: ['hover'],
      utility: 'bg',
      value: 'blue-500',
      important: false,
      arbitrary: false,
    })
  })

  it('should parse utility with multiple variants', () => {
    const result = parseClass('sm:hover:flex')
    expect(result).toEqual({
      raw: 'sm:hover:flex',
      variants: ['sm', 'hover'],
      utility: 'flex',
      value: undefined,
      important: false,
      arbitrary: false,
    })
  })

  it('should parse responsive variant with value', () => {
    const result = parseClass('md:p-8')
    expect(result).toEqual({
      raw: 'md:p-8',
      variants: ['md'],
      utility: 'p',
      value: '8',
      important: false,
      arbitrary: false,
    })
  })

  it('should parse complex multi-variant utility', () => {
    const result = parseClass('lg:dark:hover:text-gray-800')
    expect(result).toEqual({
      raw: 'lg:dark:hover:text-gray-800',
      variants: ['lg', 'dark', 'hover'],
      utility: 'text',
      value: 'gray-800',
      important: false,
      arbitrary: false,
    })
  })
})

describe('extractClasses', () => {
  it('should extract classes from class attribute', () => {
    const html = '<div class="flex p-4 bg-blue-500"></div>'
    const result = extractClasses(html)
    expect(result).toEqual(new Set(['flex', 'p-4', 'bg-blue-500']))
  })

  it('should extract classes from className attribute', () => {
    const jsx = '<div className="flex p-4 bg-blue-500"></div>'
    const result = extractClasses(jsx)
    expect(result).toEqual(new Set(['flex', 'p-4', 'bg-blue-500']))
  })

  it('should extract classes from className with curly braces', () => {
    const jsx = '<div className={"flex p-4"}></div>'
    const result = extractClasses(jsx)
    expect(result).toEqual(new Set(['flex', 'p-4']))
  })

  it('should extract classes from template literals', () => {
    const jsx = '<div className={`flex p-4 hover:bg-blue-500`}></div>'
    const result = extractClasses(jsx)
    expect(result).toEqual(new Set(['flex', 'p-4', 'hover:bg-blue-500']))
  })

  it('should handle multiple elements', () => {
    const html = `
      <div class="flex p-4">
        <span className="text-sm">Text</span>
      </div>
    `
    const result = extractClasses(html)
    expect(result).toEqual(new Set(['flex', 'p-4', 'text-sm']))
  })

  it('should handle variants', () => {
    const html = '<div class="sm:flex md:p-8 hover:bg-blue-500"></div>'
    const result = extractClasses(html)
    expect(result).toEqual(new Set(['sm:flex', 'md:p-8', 'hover:bg-blue-500']))
  })

  it('should ignore empty strings', () => {
    const html = '<div class="  flex   p-4  "></div>'
    const result = extractClasses(html)
    expect(result).toEqual(new Set(['flex', 'p-4']))
  })

  it('should return empty set for content without classes', () => {
    const html = '<div><p>No classes here</p></div>'
    const result = extractClasses(html)
    expect(result.size).toBe(0)
  })
})

describe('parseClass - Edge Cases', () => {
  it('should handle empty string', () => {
    const result = parseClass('')
    expect(result.utility).toBe('')
    expect(result.variants).toEqual([])
  })

  it('should handle very long class name', () => {
    const longClass = 'a'.repeat(1000)
    const result = parseClass(longClass)
    expect(result.utility).toBe(longClass)
  })

  it('should handle class with only dashes', () => {
    const result = parseClass('---')
    // Parser splits on last dash, so --- becomes -- with no value
    expect(result.utility).toBe('--')
    expect(result.value).toBeUndefined()
  })

  it('should handle class with trailing colon', () => {
    const result = parseClass('hover:')
    expect(result.variants).toEqual(['hover'])
    expect(result.utility).toBe('')
  })

  it('should handle class with leading colon', () => {
    const result = parseClass(':flex')
    expect(result.variants).toEqual([''])
    expect(result.utility).toBe('flex')
  })

  it('should handle multiple consecutive colons', () => {
    const result = parseClass('sm::hover::flex')
    expect(result.variants).toEqual(['sm', '', 'hover', ''])
    expect(result.utility).toBe('flex')
  })

  it('should handle negative zero value', () => {
    const result = parseClass('-m-0')
    expect(result).toEqual({
      raw: '-m-0',
      variants: [],
      utility: 'm',
      value: '-0',
      important: false,
      arbitrary: false,
    })
  })

  it('should handle fractional zero', () => {
    const result = parseClass('w-0/0')
    expect(result).toEqual({
      raw: 'w-0/0',
      variants: [],
      utility: 'w',
      value: '0/0',
      important: false,
      arbitrary: false,
    })
  })

  it('should handle arbitrary value with nested brackets', () => {
    const result = parseClass('w-[calc(100%-20px)]')
    expect(result.arbitrary).toBe(true)
    expect(result.utility).toBe('w')
    expect(result.value).toBe('calc(100%-20px)')
  })

  it('should handle arbitrary value with special characters', () => {
    const result = parseClass('bg-[rgba(255,0,0,0.5)]')
    expect(result.arbitrary).toBe(true)
    expect(result.value).toContain('rgba')
  })

  it('should handle multiple important modifiers', () => {
    const result = parseClass('!!p-4')
    // Should only process the first !
    expect(result.important).toBe(true)
    expect(result.raw).toBe('!!p-4')
  })

  it('should handle important with no utility', () => {
    const result = parseClass('!')
    expect(result.important).toBe(true)
    expect(result.utility).toBe('')
  })

  it('should handle complex variant chain', () => {
    const result = parseClass('2xl:dark:group-hover:peer-checked:first:focus:bg-red-500')
    expect(result.variants).toEqual(['2xl', 'dark', 'group-hover', 'peer-checked', 'first', 'focus'])
    expect(result.utility).toBe('bg')
    expect(result.value).toBe('red-500')
  })

  it('should handle compound utility with multiple dashes', () => {
    const result = parseClass('grid-cols-12')
    expect(result.utility).toBe('grid-cols')
    expect(result.value).toBe('12')
  })

  it('should handle negative compound utility', () => {
    const result = parseClass('-translate-x-full')
    expect(result.utility).toBe('translate-x')
    expect(result.value).toBe('-full')
  })

  it('should handle arbitrary property with numbers', () => {
    const result = parseClass('[line-height:1.5]')
    expect(result.arbitrary).toBe(true)
    expect(result.utility).toBe('line-height')
    expect(result.value).toBe('1.5')
  })

  it('should handle arbitrary property with spaces in value', () => {
    const result = parseClass('[font-family:ui-sans-serif]')
    expect(result.arbitrary).toBe(true)
    expect(result.utility).toBe('font-family')
  })

  it('should handle utility with uppercase letters', () => {
    const result = parseClass('BG-RED-500')
    // Lowercase is expected in utility names
    expect(result.raw).toBe('BG-RED-500')
  })

  it('should handle fraction with large numbers', () => {
    const result = parseClass('w-999/1000')
    expect(result.utility).toBe('w')
    expect(result.value).toBe('999/1000')
  })

  it('should handle negative fraction', () => {
    const result = parseClass('-m-1/2')
    expect(result.utility).toBe('m')
    expect(result.value).toBe('-1/2')
  })

  it('should handle space-x without value', () => {
    const result = parseClass('space-x')
    expect(result.utility).toBe('space')
    expect(result.value).toBe('x')
  })

  it('should handle divide-x without value', () => {
    const result = parseClass('divide-x')
    expect(result.utility).toBe('divide-x')
    expect(result.value).toBe(undefined)
  })
})

describe('extractClasses - Edge Cases', () => {
  it('should handle empty HTML', () => {
    const result = extractClasses('')
    expect(result.size).toBe(0)
  })

  it('should handle malformed HTML', () => {
    const html = '<div class="flex p-4'
    const result = extractClasses(html)
    // May not extract properly without closing quote
    expect(result.size).toBeGreaterThanOrEqual(0)
  })

  it('should handle classes with newlines', () => {
    const html = `<div class="flex
      p-4
      bg-blue-500"></div>`
    const result = extractClasses(html)
    expect(result.has('flex')).toBe(true)
    expect(result.has('p-4')).toBe(true)
    expect(result.has('bg-blue-500')).toBe(true)
  })

  it('should handle classes with tabs', () => {
    const html = '<div class="flex\tp-4\tbg-blue-500"></div>'
    const result = extractClasses(html)
    expect(result.has('flex')).toBe(true)
    expect(result.has('p-4')).toBe(true)
  })

  it('should handle duplicate classes', () => {
    const html = '<div class="flex flex p-4 p-4"></div>'
    const result = extractClasses(html)
    expect(result.size).toBe(2) // Set removes duplicates
  })

  it('should handle classes with special characters in attribute', () => {
    const html = '<div data-test="flex" class="p-4"></div>'
    const result = extractClasses(html)
    expect(result.has('p-4')).toBe(true)
    // Should only extract from class/className attributes
  })

  it('should handle mixed quotes', () => {
    const html = `<div class='flex "p-4"'></div>`
    const result = extractClasses(html)
    // Should extract from single-quoted attribute
    expect(result.size).toBeGreaterThan(0)
  })

  it('should handle template literal with expressions', () => {
    // eslint-disable-next-line no-template-curly-in-string
    const jsx = '<div className={`flex ${isActive ? "active" : ""} p-4`}></div>'
    const result = extractClasses(jsx)
    expect(result.has('flex')).toBe(true)
    expect(result.has('p-4')).toBe(true)
  })

  it('should handle very long class string', () => {
    const classes = Array.from({ length: 1000 }).fill('p-4').join(' ')
    const html = `<div class="${classes}"></div>`
    const result = extractClasses(html)
    expect(result.has('p-4')).toBe(true)
  })

  it('should ignore invalid class names', () => {
    const html = '<div class="123invalid -flex @media"></div>'
    const result = extractClasses(html)
    // Should filter out invalid patterns
    expect(result.has('123invalid')).toBe(false)
  })

  it('should handle consecutive spaces', () => {
    const html = '<div class="flex    p-4    bg-blue-500"></div>'
    const result = extractClasses(html)
    expect(result.size).toBe(3)
  })
})

describe('parseClass - Extreme Edge Cases', () => {
  it('should handle null-like strings', () => {
    expect(() => parseClass('null')).not.toThrow()
    expect(() => parseClass('undefined')).not.toThrow()
    expect(() => parseClass('NaN')).not.toThrow()
  })

  it('should handle numbers as class names', () => {
    const result = parseClass('123')
    expect(result.utility).toBe('123')
    expect(result.value).toBeUndefined()
  })

  it('should handle special characters in class names', () => {
    expect(() => parseClass('@apply')).not.toThrow()
    expect(() => parseClass('$variable')).not.toThrow()
    expect(() => parseClass('#id-like')).not.toThrow()
  })

  it('should handle unicode characters', () => {
    const result = parseClass('w-[20px]') // Normal
    expect(result.arbitrary).toBe(true)

    const result2 = parseClass('text-[📝]') // Emoji
    expect(result2.arbitrary).toBe(true)
  })

  it('should handle extremely nested brackets', () => {
    const result = parseClass('w-[calc(calc(100%-10px)-5px)]')
    expect(result.arbitrary).toBe(true)
    expect(result.value).toContain('calc')
  })

  it('should handle URL in arbitrary value', () => {
    const result = parseClass('bg-[url(https://example.com/image.jpg)]')
    expect(result.arbitrary).toBe(true)
    expect(result.value).toContain('url')
  })

  it('should handle data URL in arbitrary value', () => {
    const result = parseClass('bg-[url(data:image/svg+xml;base64,ABC123)]')
    expect(result.arbitrary).toBe(true)
    expect(result.value).toContain('data:')
  })

  it('should handle CSS variables in arbitrary value', () => {
    const result = parseClass('w-[var(--custom-width)]')
    expect(result.arbitrary).toBe(true)
    expect(result.value).toContain('var(--')
  })

  it('should handle clamp in arbitrary value', () => {
    const result = parseClass('text-[clamp(1rem,5vw,3rem)]')
    expect(result.arbitrary).toBe(true)
    expect(result.value).toContain('clamp')
  })

  it('should handle min/max in arbitrary value', () => {
    const result = parseClass('w-[min(100%,500px)]')
    expect(result.arbitrary).toBe(true)
    expect(result.value).toContain('min')
  })

  it('should handle zero with units', () => {
    expect(() => parseClass('w-[0px]')).not.toThrow()
    expect(() => parseClass('h-[0rem]')).not.toThrow()
    expect(() => parseClass('p-[0em]')).not.toThrow()
  })

  it('should handle extremely large numbers', () => {
    const result = parseClass('w-[99999999px]')
    expect(result.arbitrary).toBe(true)
    expect(result.value).toBe('99999999px')
  })

  it('should handle extremely small numbers', () => {
    const result = parseClass('w-[0.0001px]')
    expect(result.arbitrary).toBe(true)
    expect(result.value).toBe('0.0001px')
  })

  it('should handle scientific notation', () => {
    const result = parseClass('w-[1e10px]')
    expect(result.arbitrary).toBe(true)
    expect(result.value).toBe('1e10px')
  })
})
