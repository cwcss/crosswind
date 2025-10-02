import { describe, expect, it } from 'bun:test'
import { CSSGenerator } from '../src/generator'
import { defaultConfig } from '../src/config'

describe('CSSGenerator', () => {
  describe('Display utilities', () => {
    it('should generate flex utility', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('flex')
      const css = gen.toCSS()
      expect(css).toContain('.flex {')
      expect(css).toContain('display: flex;')
    })

    it('should generate block utility', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('block')
      const css = gen.toCSS()
      expect(css).toContain('display: block;')
    })

    it('should generate hidden utility', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('hidden')
      const css = gen.toCSS()
      expect(css).toContain('display: none;')
    })
  })

  describe('Flexbox utilities', () => {
    it('should generate flex-col utility', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('flex-col')
      const css = gen.toCSS()
      expect(css).toContain('flex-direction: column;')
    })

    it('should generate justify-center utility', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('justify-center')
      const css = gen.toCSS()
      expect(css).toContain('justify-content: center;')
    })

    it('should generate items-center utility', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('items-center')
      const css = gen.toCSS()
      expect(css).toContain('align-items: center;')
    })
  })

  describe('Spacing utilities', () => {
    it('should generate padding utility', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('p-4')
      const css = gen.toCSS()
      expect(css).toContain('.p-4 {')
      expect(css).toContain('padding: 1rem;')
    })

    it('should generate margin utility', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('m-2')
      const css = gen.toCSS()
      expect(css).toContain('margin: 0.5rem;')
    })

    it('should generate horizontal padding', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('px-4')
      const css = gen.toCSS()
      expect(css).toContain('padding-left: 1rem;')
      expect(css).toContain('padding-right: 1rem;')
    })

    it('should generate vertical margin', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('my-8')
      const css = gen.toCSS()
      expect(css).toContain('margin-top: 2rem;')
      expect(css).toContain('margin-bottom: 2rem;')
    })

    it('should generate specific side padding', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('pt-2')
      const css = gen.toCSS()
      expect(css).toContain('padding-top: 0.5rem;')
    })
  })

  describe('Sizing utilities', () => {
    it('should generate width utility', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('w-full')
      const css = gen.toCSS()
      expect(css).toContain('width: 100%;')
    })

    it('should generate height utility', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('h-screen')
      const css = gen.toCSS()
      expect(css).toContain('height: 100vh;')
    })
  })

  describe('Color utilities', () => {
    it('should generate background color', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('bg-gray-500')
      const css = gen.toCSS()
      expect(css).toContain('background-color: #6b7280;')
    })

    it('should generate text color', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('text-gray-800')
      const css = gen.toCSS()
      expect(css).toContain('color: #1f2937;')
    })

    it('should generate border color', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('border-gray-300')
      const css = gen.toCSS()
      expect(css).toContain('border-color: #d1d5db;')
    })

    it('should handle direct color names', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('bg-black')
      const css = gen.toCSS()
      expect(css).toContain('background-color: #000;')
    })
  })

  describe('Typography utilities', () => {
    it('should generate font size with line height', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('text-xl')
      const css = gen.toCSS()
      expect(css).toContain('font-size: 1.25rem;')
      expect(css).toContain('line-height: 1.75rem;')
    })

    it('should generate font weight', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('font-bold')
      const css = gen.toCSS()
      expect(css).toContain('font-weight: 700;')
    })

    it('should generate text alignment', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('text-center')
      const css = gen.toCSS()
      expect(css).toContain('text-align: center;')
    })
  })

  describe('Border utilities', () => {
    it('should generate border width', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('border')
      const css = gen.toCSS()
      expect(css).toContain('border-width: 1px;')
    })

    it('should generate border radius', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('rounded-lg')
      const css = gen.toCSS()
      expect(css).toContain('border-radius: 0.5rem;')
    })
  })

  describe('Pseudo-class variants', () => {
    it('should generate hover variant', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('hover:bg-gray-500')
      const css = gen.toCSS()
      expect(css).toContain('.hover\\:bg-gray-500:hover {')
      expect(css).toContain('background-color: #6b7280;')
    })

    it('should generate focus variant', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('focus:border-gray-300')
      const css = gen.toCSS()
      expect(css).toContain('.focus\\:border-gray-300:focus {')
    })

    it('should handle multiple variants', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('hover:focus:bg-gray-500')
      const css = gen.toCSS()
      expect(css).toContain(':hover:focus')
    })
  })

  describe('Responsive variants', () => {
    it('should generate responsive utility', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('sm:flex')
      const css = gen.toCSS()
      expect(css).toContain('@media (min-width: 640px)')
      expect(css).toContain('.sm\\:flex {')
      expect(css).toContain('display: flex;')
    })

    it('should generate md breakpoint', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('md:p-8')
      const css = gen.toCSS()
      expect(css).toContain('@media (min-width: 768px)')
    })

    it('should combine responsive and pseudo-class variants', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('md:hover:bg-gray-500')
      const css = gen.toCSS()
      expect(css).toContain('@media (min-width: 768px)')
      expect(css).toContain(':hover')
    })
  })

  describe('Minification', () => {
    it('should generate minified CSS', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('p-4')
      gen.generate('m-2')
      const css = gen.toCSS(true)
      expect(css).not.toContain('\n')
      expect(css).not.toContain('  ')
      expect(css).toContain('.p-4{padding:1rem}')
      expect(css).toContain('.m-2{margin:0.5rem}')
    })
  })

  describe('Shortcuts', () => {
    it('should expand shortcuts', () => {
      const config = {
        ...defaultConfig,
        shortcuts: {
          btn: 'px-4 py-2 rounded bg-blue-500',
        },
      }
      const gen = new CSSGenerator(config)
      gen.generate('btn')
      const css = gen.toCSS()
      expect(css).toContain('padding-left: 1rem;')
      expect(css).toContain('padding-top: 0.5rem;')
      expect(css).toContain('border-radius: 0.25rem;')
    })
  })

  describe('Blocklist', () => {
    it('should ignore blocklisted classes', () => {
      const config = {
        ...defaultConfig,
        blocklist: ['flex'],
      }
      const gen = new CSSGenerator(config)
      gen.generate('flex')
      const css = gen.toCSS()
      expect(css).not.toContain('display: flex;')
    })
  })
})

describe('CSSGenerator - Edge Cases', () => {
  it('should handle empty class name', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('')
    const css = gen.toCSS()
    // Should not crash
    expect(css).toBeDefined()
  })

  it('should handle undefined utility', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('nonexistent-utility-xyz')
    const css = gen.toCSS()
    // Should not generate CSS for unknown utility
    expect(css).not.toContain('nonexistent-utility-xyz')
  })

  it('should handle conflicting utilities', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('p-4')
    gen.generate('p-8')
    const css = gen.toCSS()
    // Both should be in CSS (last one wins in cascade)
    expect(css).toContain('padding: 1rem;')
    expect(css).toContain('padding: 2rem;')
  })

  it('should handle same class generated multiple times', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('p-4')
    gen.generate('p-4')
    gen.generate('p-4')
    const css = gen.toCSS()
    // Should merge into single rule
    const matches = css.match(/\.p-4/g)
    expect(matches?.length).toBe(1)
  })

  it('should handle very long selector', () => {
    const gen = new CSSGenerator(defaultConfig)
    const longClass = 'a'.repeat(500) + '-4'
    gen.generate(longClass)
    const css = gen.toCSS()
    expect(css).toBeDefined()
  })

  it('should handle special characters in selector escaping', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('hover:p-4')
    const css = gen.toCSS()
    expect(css).toContain('.hover\\:p-4:hover')
  })

  it('should handle multiple variants on same utility', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('hover:p-4')
    gen.generate('focus:p-4')
    gen.generate('active:p-4')
    const css = gen.toCSS()
    expect(css).toContain(':hover')
    expect(css).toContain(':focus')
    expect(css).toContain(':active')
  })

  it('should handle important modifier with zero value', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('!m-0')
    const css = gen.toCSS()
    expect(css).toContain('margin: 0 !important;')
  })

  it('should handle important with arbitrary value', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('!w-[500px]')
    const css = gen.toCSS()
    expect(css).toContain('width: 500px !important;')
  })

  it('should handle negative zero margin', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('-m-0')
    const css = gen.toCSS()
    expect(css).toContain('margin: -0;')
  })

  it('should handle fraction resulting in zero', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('w-0/100')
    const css = gen.toCSS()
    expect(css).toContain('width: 0%;')
  })

  it('should handle very small fraction', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('w-1/1000')
    const css = gen.toCSS()
    expect(css).toContain('width: 0.1%;')
  })

  it('should handle arbitrary value with calc', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('w-[calc(100vw-2rem)]')
    const css = gen.toCSS()
    expect(css).toContain('width: calc(100vw-2rem);')
  })

  it('should handle arbitrary value with CSS variables', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('w-[var(--custom-width)]')
    const css = gen.toCSS()
    expect(css).toContain('width: var(--custom-width);')
  })

  it('should handle responsive variant at largest breakpoint', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('2xl:p-4')
    const css = gen.toCSS()
    expect(css).toContain('@media (min-width: 1536px)')
  })

  it('should handle mixed responsive and pseudo-class variants', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('md:hover:focus:p-4')
    const css = gen.toCSS()
    expect(css).toContain('@media (min-width: 768px)')
    expect(css).toContain(':hover:focus')
  })

  it('should handle dark mode with responsive', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('dark:lg:hover:bg-gray-900')
    const css = gen.toCSS()
    expect(css).toContain('.dark')
    expect(css).toContain('@media (min-width: 1024px)')
    expect(css).toContain(':hover')
  })

  it('should handle group variant with multiple states', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('group-hover:group-focus:bg-blue-500')
    const css = gen.toCSS()
    // Should handle last group variant
    expect(css).toContain('.group:')
  })

  it('should handle peer variant with complex selector', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('peer-checked:peer-focus:bg-red-500')
    const css = gen.toCSS()
    expect(css).toContain('.peer:')
    expect(css).toContain('~')
  })

  it('should handle child selector utilities', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('space-x-4')
    const css = gen.toCSS()
    expect(css).toContain('> :not([hidden]) ~ :not([hidden])')
  })

  it('should handle minified output with special characters', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('hover:focus:bg-[#ff0000]')
    const css = gen.toCSS(true)
    expect(css).not.toContain('\n')
    expect(css).not.toContain('  ')
  })

  it('should handle color with three-digit hex', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('bg-[#f00]')
    const css = gen.toCSS()
    expect(css).toContain('background-color: #f00;')
  })

  it('should handle color with rgba', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('bg-[rgba(255,0,0,0.5)]')
    const css = gen.toCSS()
    expect(css).toContain('background-color: rgba(255,0,0,0.5);')
  })

  it('should handle arbitrary property with important', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('![display:grid]')
    const css = gen.toCSS()
    expect(css).toContain('display: grid !important;')
  })

  it('should handle multiple classes with same selector different properties', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('p-4')
    gen.generate('m-4')
    const css = gen.toCSS()
    expect(css).toContain('padding: 1rem;')
    expect(css).toContain('margin: 1rem;')
  })

  it('should escape forward slash in fractions', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('w-1/2')
    const css = gen.toCSS()
    expect(css).toContain('.w-1\\/2')
  })

  it('should escape dots in arbitrary values', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('text-[1.5rem]')
    const css = gen.toCSS()
    // Check selector escaping for the class
    expect(css).toContain('.text-[1\\.5rem]')
  })

  it('should handle all variants disabled', () => {
    const config = {
      ...defaultConfig,
      variants: {
        ...defaultConfig.variants,
        hover: false,
        focus: false,
      },
    }
    const gen = new CSSGenerator(config)
    gen.generate('hover:p-4')
    const css = gen.toCSS()
    // Should still generate but without :hover
    expect(css).toBeDefined()
  })

  it('should handle reset and regenerate', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('p-4')
    gen.reset()
    gen.generate('m-4')
    const css = gen.toCSS()
    expect(css).toContain('margin: 1rem;')
    expect(css).not.toContain('padding: 1rem;')
  })

  it('should handle preflight CSS with minification', () => {
    const gen = new CSSGenerator(defaultConfig)
    const css = gen.toCSS(true)
    expect(css).toContain('box-sizing')
  })

  describe('Extreme Edge Cases', () => {
    it('should handle generating the same class 1000 times', () => {
      const gen = new CSSGenerator(defaultConfig)
      for (let i = 0; i < 1000; i++) {
        gen.generate('w-4')
      }
      const css = gen.toCSS()
      // Should only have one .w-4 rule
      const matches = css.match(/\.w-4\s*\{/g) || []
      expect(matches.length).toBe(1)
    })

    it('should handle generating invalid utilities without crashing', () => {
      const gen = new CSSGenerator(defaultConfig)
      expect(() => gen.generate('')).not.toThrow()
      expect(() => gen.generate('   ')).not.toThrow()
      expect(() => gen.generate('invalid-utility-xyz-123')).not.toThrow()
      expect(() => gen.generate('!!!!!')).not.toThrow()
      expect(() => gen.generate(':::::')).not.toThrow()
    })

    it('should handle generating utilities with null/undefined-like names', () => {
      const gen = new CSSGenerator(defaultConfig)
      expect(() => gen.generate('null')).not.toThrow()
      expect(() => gen.generate('undefined')).not.toThrow()
      expect(() => gen.generate('false')).not.toThrow()
    })

    it('should handle very long arbitrary values', () => {
      const gen = new CSSGenerator(defaultConfig)
      const longValue = 'a'.repeat(1000)
      gen.generate(`w-[${longValue}]`)
      const css = gen.toCSS()
      expect(css).toContain(longValue)
    })

    it('should handle generating arbitrary property with colon in value', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('[background-image:url(http://example.com)]')
      const css = gen.toCSS()
      expect(css.length).toBeGreaterThan(0)
    })

    it('should handle malformed arbitrary syntax', () => {
      const gen = new CSSGenerator(defaultConfig)
      expect(() => gen.generate('w-[')).not.toThrow() // Missing closing bracket
      expect(() => gen.generate('w-]')).not.toThrow() // Missing opening bracket
      expect(() => gen.generate('w-[[]]')).not.toThrow() // Double brackets
      expect(() => gen.generate('w-[[]')).not.toThrow() // Unbalanced
    })

    it('should handle generating with no config theme colors', () => {
      const gen = new CSSGenerator({ ...defaultConfig, theme: { ...defaultConfig.theme, colors: {} } })
      gen.generate('bg-blue-500')
      gen.generate('text-red-500')
      // Should not crash even if colors don't exist
      expect(() => gen.toCSS()).not.toThrow()
    })

    it('should handle generating with no spacing scale', () => {
      const gen = new CSSGenerator({ ...defaultConfig, theme: { ...defaultConfig.theme, spacing: {} } })
      gen.generate('p-4')
      gen.generate('m-8')
      // Should fall back to raw values
      expect(() => gen.toCSS()).not.toThrow()
    })

    it('should handle important modifier on invalid utility', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('!invalid-utility-name')
      expect(() => gen.toCSS()).not.toThrow()
    })

    it('should handle multiple variants on invalid utility', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('sm:md:lg:invalid-utility')
      expect(() => gen.toCSS()).not.toThrow()
    })
  })
})
