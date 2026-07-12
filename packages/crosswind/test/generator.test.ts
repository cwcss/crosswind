import { describe, expect, it } from 'bun:test'
import { defaultConfig } from '../src/config'
import { CSSGenerator } from '../src/generator'

describe('CSSGenerator', () => {
  describe('Display utilities', () => {
    it('should generate flex utility', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('flex')
      const css = gen.toCSS(false)
      expect(css).toContain('.flex {')
      expect(css).toContain('display: flex;')
    })

    it('should generate block utility', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('block')
      const css = gen.toCSS(false)
      expect(css).toContain('display: block;')
    })

    it('should generate hidden utility', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('hidden')
      const css = gen.toCSS(false)
      expect(css).toContain('display: none;')
    })
  })

  describe('Flexbox utilities', () => {
    it('should generate flex-col utility', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('flex-col')
      const css = gen.toCSS(false)
      expect(css).toContain('flex-direction: column;')
    })

    it('should generate justify-center utility', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('justify-center')
      const css = gen.toCSS(false)
      expect(css).toContain('justify-content: center;')
    })

    it('should generate items-center utility', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('items-center')
      const css = gen.toCSS(false)
      expect(css).toContain('align-items: center;')
    })
  })

  describe('Spacing utilities', () => {
    it('should generate padding utility', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('p-4')
      const css = gen.toCSS(false)
      expect(css).toContain('.p-4 {')
      expect(css).toContain('padding: 1rem;')
    })

    it('should generate margin utility', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('m-2')
      const css = gen.toCSS(false)
      expect(css).toContain('margin: 0.5rem;')
    })

    it('should generate horizontal padding', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('px-4')
      const css = gen.toCSS(false)
      expect(css).toContain('padding-left: 1rem;')
      expect(css).toContain('padding-right: 1rem;')
    })

    it('should generate vertical margin', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('my-8')
      const css = gen.toCSS(false)
      expect(css).toContain('margin-top: 2rem;')
      expect(css).toContain('margin-bottom: 2rem;')
    })

    it('should generate specific side padding', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('pt-2')
      const css = gen.toCSS(false)
      expect(css).toContain('padding-top: 0.5rem;')
    })
  })

  describe('Sizing utilities', () => {
    it('should generate width utility', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('w-full')
      const css = gen.toCSS(false)
      expect(css).toContain('width: 100%;')
    })

    it('should generate height utility', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('h-screen')
      const css = gen.toCSS(false)
      expect(css).toContain('height: 100vh;')
    })
  })

  describe('Color utilities', () => {
    it('should generate background color', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('bg-gray-500')
      const css = gen.toCSS(false)
      expect(css).toContain('background-color: oklch(55.1% 0.027 264.364);')
    })

    it('should generate text color', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('text-gray-800')
      const css = gen.toCSS(false)
      expect(css).toContain('color: oklch(27.8% 0.033 256.848);')
    })

    it('should generate border color', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('border-gray-300')
      const css = gen.toCSS(false)
      expect(css).toContain('border-color: oklch(87.2% 0.01 258.338);')
    })

    it('should handle direct color names', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('bg-black')
      const css = gen.toCSS(false)
      expect(css).toContain('background-color: #000;')
    })
  })

  describe('Typography utilities', () => {
    it('should generate font size with line height', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('text-xl')
      const css = gen.toCSS(false)
      expect(css).toContain('font-size: 1.25rem;')
      expect(css).toContain('line-height: 1.75rem;')
    })

    it('should generate font weight', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('font-bold')
      const css = gen.toCSS(false)
      expect(css).toContain('font-weight: 700;')
    })

    it('should generate text alignment', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('text-center')
      const css = gen.toCSS(false)
      expect(css).toContain('text-align: center;')
    })
  })

  describe('Border utilities', () => {
    it('should generate border width', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('border')
      const css = gen.toCSS(false)
      expect(css).toContain('border-width: 1px;')
    })

    it('should generate border radius', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('rounded-lg')
      const css = gen.toCSS(false)
      expect(css).toContain('border-radius: 0.5rem;')
    })

    it('should generate border-s (logical inline-start) with default 1px', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('border-s')
      const css = gen.toCSS(false)
      expect(css).toContain('border-inline-start-width: 1px')
    })

    it('should generate border-e (logical inline-end) with default 1px', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('border-e')
      const css = gen.toCSS(false)
      expect(css).toContain('border-inline-end-width: 1px')
    })

    // Regression: directional border widths accept arbitrary values AND
    // color values. Previously `border-t-[2px]`, `border-x-[3px]`, etc. got
    // skipped because the width map was hardcoded to {0, 2, 4, 8}; and
    // `border-r-red-500` emitted nothing because the rule didn't route
    // palette names to border-*-color.
    it('border-t-[2px] accepts arbitrary widths', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('border-t-[2px]')
      expect(gen.toCSS(false)).toContain('border-top-width: 2px;')
    })

    it('border-x-[3px] sets both horizontal edges', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('border-x-[3px]')
      const css = gen.toCSS(false)
      expect(css).toContain('border-left-width: 3px;')
      expect(css).toContain('border-right-width: 3px;')
    })

    it('border-b-[0.5rem] handles rem arbitrary values', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('border-b-[0.5rem]')
      expect(gen.toCSS(false)).toContain('border-bottom-width: 0.5rem;')
    })

    it('border-r-red-500 emits border-right-color from palette', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('border-r-red-500')
      const css = gen.toCSS(false)
      expect(css).toContain('border-right-color:')
      // Guard — must NOT emit border-right-width for a color value
      expect(css).not.toContain('border-right-width:')
    })

    it('border-t-gray-800 resolves deeper-shade palette', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('border-t-gray-800')
      expect(gen.toCSS(false)).toContain('border-top-color:')
    })

    it('border-t-[#FF3E54] accepts arbitrary hex colors', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('border-t-[#FF3E54]')
      expect(gen.toCSS(false)).toContain('border-top-color: #FF3E54;')
    })

    it('border-t-transparent emits border-top-color: transparent', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('border-t-transparent')
      expect(gen.toCSS(false)).toContain('border-top-color: transparent;')
    })

    // Regression: physical rounded corners (`rounded-tl`, `rounded-tr`,
    // `rounded-bl`, `rounded-br`) and physical sides (`rounded-t`,
    // `rounded-r`, `rounded-b`, `rounded-l`) previously only resolved for
    // a handful of hardcoded size keywords (`-lg`, `-sm`, `-none`).
    // Arbitrary values and theme-extension sizes were silently dropped.
    it('rounded-tr-2xl resolves via the rule (not the fast-path table)', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('rounded-tr-2xl')
      expect(gen.toCSS(false)).toContain('border-top-right-radius: 1rem;')
    })

    it('rounded-bl-[6px] accepts arbitrary corner radii', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('rounded-bl-[6px]')
      expect(gen.toCSS(false)).toContain('border-bottom-left-radius: 6px;')
    })

    it('rounded-br-full uses full keyword', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('rounded-br-full')
      expect(gen.toCSS(false)).toContain('border-bottom-right-radius: 9999px;')
    })

    it('rounded-t-xl sets both top corners', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('rounded-t-xl')
      const css = gen.toCSS(false)
      expect(css).toContain('border-top-left-radius: 0.75rem;')
      expect(css).toContain('border-top-right-radius: 0.75rem;')
    })

    it('rounded-b-[8px] sets both bottom corners with arbitrary radius', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('rounded-b-[8px]')
      const css = gen.toCSS(false)
      expect(css).toContain('border-bottom-left-radius: 8px;')
      expect(css).toContain('border-bottom-right-radius: 8px;')
    })

    it('rounded-l-none zeroes left corners', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('rounded-l-none')
      const css = gen.toCSS(false)
      expect(css).toContain('border-top-left-radius: 0;')
      expect(css).toContain('border-bottom-left-radius: 0;')
    })
  })

  describe('Pseudo-class variants', () => {
    it('should generate hover variant', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('hover:bg-gray-500')
      const css = gen.toCSS(false)
      expect(css).toContain('.hover\\:bg-gray-500:hover {')
      expect(css).toContain('background-color: oklch(55.1% 0.027 264.364);')
    })

    it('should generate focus variant', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('focus:border-gray-300')
      const css = gen.toCSS(false)
      expect(css).toContain('.focus\\:border-gray-300:focus {')
    })

    it('should handle multiple variants', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('hover:focus:bg-gray-500')
      const css = gen.toCSS(false)
      expect(css).toContain(':hover:focus')
    })
  })

  describe('Responsive variants', () => {
    it('should generate responsive utility', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('sm:flex')
      const css = gen.toCSS(false)
      expect(css).toContain('@media (min-width: 640px)')
      expect(css).toContain('.sm\\:flex {')
      expect(css).toContain('display: flex;')
    })

    it('should generate md breakpoint', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('md:p-8')
      const css = gen.toCSS(false)
      expect(css).toContain('@media (min-width: 768px)')
    })

    it('should combine responsive and pseudo-class variants', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('md:hover:bg-gray-500')
      const css = gen.toCSS(false)
      expect(css).toContain('@media (min-width: 768px)')
      expect(css).toContain(':hover')
    })
  })

  describe('Minification', () => {
    it('should generate minified CSS', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('p-4')
      gen.generate('m-2')
      const css = gen.toCSS(false, true)
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
      const css = gen.toCSS(false)
      expect(css).toContain('padding-left: 1rem;')
      expect(css).toContain('padding-top: 0.5rem;')
      expect(css).toContain('border-radius: 0.25rem;')
    })

    // Issue #18: shortcut rules must target the shortcut's own class name —
    // markup carries `btn`, not `bg-blue-500` — and variant utilities inside
    // a definition must become pseudo-class / prefix / media rules on that
    // selector instead of being silently dropped.
    it('should emit rules under the shortcut selector', () => {
      const gen = new CSSGenerator({
        ...defaultConfig,
        shortcuts: { btn: 'bg-blue-500 text-white' },
      })
      gen.generate('btn')
      const css = gen.toCSS(false)
      expect(css).toContain('.btn {')
      expect(css).not.toContain('.bg-blue-500')
      expect(css).not.toContain('.text-white')
    })

    it('should expand hover:/focus: variants onto the shortcut selector', () => {
      const gen = new CSSGenerator({
        ...defaultConfig,
        shortcuts: { 'btn-primary': 'bg-blue-500 hover:bg-blue-700 focus:ring-2' },
      })
      gen.generate('btn-primary')
      const css = gen.toCSS(false)
      expect(css).toContain('.btn-primary:hover {')
      expect(css).toContain('.btn-primary:focus {')
      expect(css).not.toContain('.hover\\:bg-blue-700')
    })

    it('should expand dark: and responsive variants onto the shortcut selector', () => {
      const gen = new CSSGenerator({
        ...defaultConfig,
        shortcuts: { btn: 'px-4 dark:bg-blue-900 md:px-8' },
      })
      gen.generate('btn')
      const css = gen.toCSS(false)
      expect(css).toContain('.dark .btn {')
      expect(css).toContain('@media (min-width: 768px)')
      expect(css.slice(css.indexOf('@media'))).toContain('.btn {')
    })

    it('should flatten nested shortcuts onto the outer selector', () => {
      const gen = new CSSGenerator({
        ...defaultConfig,
        shortcuts: {
          'btn': 'px-4 hover:bg-blue-700',
          'btn-lg': 'btn py-3',
        },
      })
      gen.generate('btn-lg')
      const css = gen.toCSS(false)
      expect(css).toContain('.btn-lg {')
      expect(css).toContain('.btn-lg:hover {')
      expect(css).toContain('padding-top: 0.75rem;')
    })

    it('should survive shortcut cycles without hanging', () => {
      const gen = new CSSGenerator({
        ...defaultConfig,
        shortcuts: { a: 'b px-4', b: 'a py-2' },
      })
      gen.generate('a')
      const css = gen.toCSS(false)
      expect(css).toContain('.a {')
      expect(css).toContain('padding-left: 1rem;')
      expect(css).toContain('padding-top: 0.5rem;')
    })

    it('should keep standalone utilities working alongside shortcut expansion', () => {
      const gen = new CSSGenerator({
        ...defaultConfig,
        shortcuts: { btn: 'bg-blue-500 hover:bg-blue-700' },
      })
      // Standalone first, then shortcut, to prove neither direction is
      // swallowed by the class cache.
      gen.generate('bg-blue-500')
      gen.generate('btn')
      gen.generate('hover:bg-blue-700')
      const css = gen.toCSS(false)
      expect(css).toContain('.bg-blue-500 {')
      expect(css).toContain('.btn {')
      expect(css).toContain('.btn:hover {')
      expect(css).toContain('.hover\\:bg-blue-700:hover {')
    })

    it('should support array-form shortcut definitions', () => {
      const gen = new CSSGenerator({
        ...defaultConfig,
        shortcuts: { card: ['p-4', 'rounded', 'hover:shadow-lg'] },
      })
      gen.generate('card')
      const css = gen.toCSS(false)
      expect(css).toContain('.card {')
      expect(css).toContain('.card:hover {')
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
      const css = gen.toCSS(false)
      expect(css).not.toContain('display: flex;')
    })
  })
})

describe('CSSGenerator - Edge Cases', () => {
  it('should handle empty class name', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('')
    const css = gen.toCSS(false)
    // Should not crash
    expect(css).toBeDefined()
  })

  it('should handle undefined utility', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('nonexistent-utility-xyz')
    const css = gen.toCSS(false)
    // Should not generate CSS for unknown utility
    expect(css).not.toContain('nonexistent-utility-xyz')
  })

  it('should handle conflicting utilities', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('p-4')
    gen.generate('p-8')
    const css = gen.toCSS(false)
    // Both should be in CSS (last one wins in cascade)
    expect(css).toContain('padding: 1rem;')
    expect(css).toContain('padding: 2rem;')
  })

  it('should handle same class generated multiple times', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('p-4')
    gen.generate('p-4')
    gen.generate('p-4')
    const css = gen.toCSS(false)
    // Should merge into single rule
    const matches = css.match(/\.p-4/g)
    expect(matches?.length).toBe(1)
  })

  it('should handle very long selector', () => {
    const gen = new CSSGenerator(defaultConfig)
    const longClass = `${'a'.repeat(500)}-4`
    gen.generate(longClass)
    const css = gen.toCSS(false)
    expect(css).toBeDefined()
  })

  it('should handle special characters in selector escaping', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('hover:p-4')
    const css = gen.toCSS(false)
    expect(css).toContain('.hover\\:p-4:hover')
  })

  it('should handle multiple variants on same utility', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('hover:p-4')
    gen.generate('focus:p-4')
    gen.generate('active:p-4')
    const css = gen.toCSS(false)
    expect(css).toContain(':hover')
    expect(css).toContain(':focus')
    expect(css).toContain(':active')
  })

  it('should handle important modifier with zero value', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('!m-0')
    const css = gen.toCSS(false)
    expect(css).toContain('margin: 0 !important;')
  })

  it('should handle important with arbitrary value', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('!w-[500px]')
    const css = gen.toCSS(false)
    expect(css).toContain('width: 500px !important;')
  })

  it('should handle negative zero margin', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('-m-0')
    const css = gen.toCSS(false)
    expect(css).toContain('margin: 0;') // -0 is normalized to 0
  })

  it('should handle fraction resulting in zero', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('w-0/100')
    const css = gen.toCSS(false)
    expect(css).toContain('width: 0%;')
  })

  it('should handle very small fraction', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('w-1/1000')
    const css = gen.toCSS(false)
    expect(css).toContain('width: 0.1%;')
  })

  it('should handle arbitrary value with calc', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('w-[calc(100vw-2rem)]')
    const css = gen.toCSS(false)
    expect(css).toContain('width: calc(100vw-2rem);')
  })

  it('should handle arbitrary value with CSS variables', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('w-[var(--custom-width)]')
    const css = gen.toCSS(false)
    expect(css).toContain('width: var(--custom-width);')
  })

  it('should handle responsive variant at largest breakpoint', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('2xl:p-4')
    const css = gen.toCSS(false)
    expect(css).toContain('@media (min-width: 1536px)')
  })

  it('should handle mixed responsive and pseudo-class variants', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('md:hover:focus:p-4')
    const css = gen.toCSS(false)
    expect(css).toContain('@media (min-width: 768px)')
    expect(css).toContain(':hover:focus')
  })

  it('should handle dark mode with responsive', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('dark:lg:hover:bg-gray-900')
    const css = gen.toCSS(false)
    expect(css).toContain('.dark')
    expect(css).toContain('@media (min-width: 1024px)')
    expect(css).toContain(':hover')
  })

  it('should handle group variant with multiple states', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('group-hover:group-focus:bg-blue-500')
    const css = gen.toCSS(false)
    // Should handle last group variant
    expect(css).toContain('.group:')
  })

  it('should handle peer variant with complex selector', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('peer-checked:peer-focus:bg-red-500')
    const css = gen.toCSS(false)
    expect(css).toContain('.peer:')
    expect(css).toContain('~')
  })

  it('should handle child selector utilities', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('space-x-4')
    const css = gen.toCSS(false)
    expect(css).toContain('> :not([hidden]) ~ :not([hidden])')
  })

  it('should handle minified output with special characters', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('hover:focus:bg-[#ff0000]')
    const css = gen.toCSS(false, true)
    expect(css).not.toContain('\n')
    expect(css).not.toContain('  ')
  })

  it('should handle color with three-digit hex', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('bg-[#f00]')
    const css = gen.toCSS(false)
    expect(css).toContain('background-color: #f00;')
  })

  it('should handle color with rgba', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('bg-[rgba(255,0,0,0.5)]')
    const css = gen.toCSS(false)
    expect(css).toContain('background-color: rgba(255,0,0,0.5);')
  })

  it('should handle arbitrary property with important', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('![display:grid]')
    const css = gen.toCSS(false)
    expect(css).toContain('display: grid !important;')
  })

  it('should handle multiple classes with same selector different properties', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('p-4')
    gen.generate('m-4')
    const css = gen.toCSS(false)
    expect(css).toContain('padding: 1rem;')
    expect(css).toContain('margin: 1rem;')
  })

  it('should escape forward slash in fractions', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('w-1/2')
    const css = gen.toCSS(false)
    expect(css).toContain('.w-1\\/2')
  })

  it('should escape dots and brackets in arbitrary values', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('text-[1.5rem]')
    const css = gen.toCSS(false)
    // Check selector escaping for the class (both brackets and dots should be escaped)
    expect(css).toContain('.text-\\[1\\.5rem\\]')
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
    const css = gen.toCSS(false)
    // Should still generate but without :hover
    expect(css).toBeDefined()
  })

  it('should handle reset and regenerate', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('p-4')
    gen.reset()
    gen.generate('m-4')
    const css = gen.toCSS(false)
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
      const css = gen.toCSS(false)
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
      const css = gen.toCSS(false)
      expect(css).toContain(longValue)
    })

    it('should handle generating arbitrary property with colon in value', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('[background-image:url(http://example.com)]')
      const css = gen.toCSS(false)
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
      expect(() => gen.toCSS(false)).not.toThrow()
    })

    it('should handle generating with no spacing scale', () => {
      const gen = new CSSGenerator({ ...defaultConfig, theme: { ...defaultConfig.theme, spacing: {} } })
      gen.generate('p-4')
      gen.generate('m-8')
      // Should fall back to raw values
      expect(() => gen.toCSS(false)).not.toThrow()
    })

    it('should handle important modifier on invalid utility', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('!invalid-utility-name')
      expect(() => gen.toCSS(false)).not.toThrow()
    })

    it('should handle multiple variants on invalid utility', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('sm:md:lg:invalid-utility')
      expect(() => gen.toCSS(false)).not.toThrow()
    })
  })
})
