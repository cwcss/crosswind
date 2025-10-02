import { describe, expect, it } from 'bun:test'
import { CSSGenerator } from '../src/generator'
import { parseClass } from '../src/parser'
import { defaultConfig } from '../src/config'

describe('New Features - Form Pseudo-Class Variants', () => {
  it('should handle placeholder variant', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('placeholder:text-gray-500')
    const css = gen.toCSS()
    expect(css).toContain('::placeholder')
    expect(css).toContain('color: #6b7280')
  })

  it('should handle selection variant', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('selection:bg-blue-500')
    const css = gen.toCSS()
    expect(css).toContain('::selection')
  })

  it('should handle file variant', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('file:border-blue-500')
    const css = gen.toCSS()
    expect(css).toContain('::file-selector-button')
  })

  it('should handle required variant', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('required:border-red-500')
    const css = gen.toCSS()
    expect(css).toContain(':required')
  })

  it('should handle valid variant', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('valid:border-green-500')
    const css = gen.toCSS()
    expect(css).toContain(':valid')
  })

  it('should handle invalid variant', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('invalid:border-red-500')
    const css = gen.toCSS()
    expect(css).toContain(':invalid')
  })

  it('should handle read-only variant', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('read-only:bg-gray-100')
    const css = gen.toCSS()
    expect(css).toContain(':read-only')
  })

  it('should handle autofill variant', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('autofill:bg-yellow-100')
    const css = gen.toCSS()
    expect(css).toContain(':autofill')
  })
})

describe('New Features - Additional State Variants', () => {
  it('should handle open variant', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('open:bg-blue-500')
    const css = gen.toCSS()
    expect(css).toContain('[open]')
  })

  it('should handle closed variant', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('closed:hidden')
    const css = gen.toCSS()
    expect(css).toContain(':not([open])')
  })

  it('should handle empty variant', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('empty:hidden')
    const css = gen.toCSS()
    expect(css).toContain(':empty')
  })

  it('should handle enabled variant', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('enabled:bg-white')
    const css = gen.toCSS()
    expect(css).toContain(':enabled')
  })

  it('should handle only variant', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('only:m-0')
    const css = gen.toCSS()
    expect(css).toContain(':only-child')
  })

  it('should handle target variant', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('target:bg-yellow-100')
    const css = gen.toCSS()
    expect(css).toContain(':target')
  })

  it('should handle indeterminate variant', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('indeterminate:bg-gray-300')
    const css = gen.toCSS()
    expect(css).toContain(':indeterminate')
  })

  it('should handle default variant', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('default:border-2')
    const css = gen.toCSS()
    expect(css).toContain(':default')
  })

  it('should handle optional variant', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('optional:border-gray-300')
    const css = gen.toCSS()
    expect(css).toContain(':optional')
  })
})

describe('New Features - Marker Pseudo-Element', () => {
  it('should handle marker variant', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('marker:text-blue-500')
    const css = gen.toCSS()
    expect(css).toContain('::marker')
  })

  it('should handle marker with color utility', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('marker:text-red-500')
    const css = gen.toCSS()
    expect(css).toContain('::marker')
    expect(css).toContain('color: #ef4444')
  })
})

describe('New Features - Color Opacity Modifiers', () => {
  it('should parse bg-blue-500/50', () => {
    const parsed = parseClass('bg-blue-500/50')
    expect(parsed.utility).toBe('bg')
    expect(parsed.value).toBe('blue-500/50')
  })

  it('should generate color with opacity', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('bg-gray-900/50')
    const css = gen.toCSS()
    expect(css).toContain('background-color')
    expect(css).toMatch(/rgb\(.*\/.*0\.5\)/)
  })

  it('should handle text color with opacity', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('text-blue-500/75')
    const css = gen.toCSS()
    expect(css).toContain('color')
    expect(css).toMatch(/0\.75/)
  })

  it('should handle border color with opacity', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('border-red-500/25')
    const css = gen.toCSS()
    expect(css).toContain('border-color')
    expect(css).toMatch(/0\.25/)
  })

  it('should handle opacity with variants', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('hover:bg-blue-500/50')
    const css = gen.toCSS()
    expect(css).toContain(':hover')
    expect(css).toContain('background-color')
  })
})

describe('New Features - Standalone Line-Height', () => {
  it('should handle leading-none', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('leading-none')
    const css = gen.toCSS()
    expect(css).toContain('line-height: 1')
  })

  it('should handle leading-tight', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('leading-tight')
    const css = gen.toCSS()
    expect(css).toContain('line-height: 1.25')
  })

  it('should handle leading-snug', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('leading-snug')
    const css = gen.toCSS()
    expect(css).toContain('line-height: 1.375')
  })

  it('should handle leading-normal', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('leading-normal')
    const css = gen.toCSS()
    expect(css).toContain('line-height: 1.5')
  })

  it('should handle leading-relaxed', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('leading-relaxed')
    const css = gen.toCSS()
    expect(css).toContain('line-height: 1.625')
  })

  it('should handle leading-loose', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('leading-loose')
    const css = gen.toCSS()
    expect(css).toContain('line-height: 2')
  })

  it('should handle leading with numeric values', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('leading-6')
    const css = gen.toCSS()
    expect(css).toContain('line-height: 1.5rem')
  })
})

describe('New Features - Text Decoration Enhancements', () => {
  it('should handle decoration-wavy', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('decoration-wavy')
    const css = gen.toCSS()
    expect(css).toContain('text-decoration-style: wavy')
  })

  it('should handle decoration-dotted', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('decoration-dotted')
    const css = gen.toCSS()
    expect(css).toContain('text-decoration-style: dotted')
  })

  it('should handle decoration-dashed', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('decoration-dashed')
    const css = gen.toCSS()
    expect(css).toContain('text-decoration-style: dashed')
  })

  it('should handle decoration thickness', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('decoration-2')
    const css = gen.toCSS()
    expect(css).toContain('text-decoration-thickness: 2px')
  })

  it('should handle decoration-auto', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('decoration-auto')
    const css = gen.toCSS()
    expect(css).toContain('text-decoration-thickness: auto')
  })

  it('should handle underline-offset', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('underline-offset-2')
    const css = gen.toCSS()
    expect(css).toContain('text-underline-offset: 2px')
  })

  it('should handle underline-offset-auto', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('underline-offset-auto')
    const css = gen.toCSS()
    expect(css).toContain('text-underline-offset: auto')
  })

  it('should handle decoration color', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('decoration-blue-500')
    const css = gen.toCSS()
    expect(css).toContain('text-decoration-color')
  })
})

describe('New Features - Border Shortcuts', () => {
  it('should handle border-x', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('border-x')
    const css = gen.toCSS()
    expect(css).toContain('border-left-width: 1px')
    expect(css).toContain('border-right-width: 1px')
  })

  it('should handle border-y', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('border-y')
    const css = gen.toCSS()
    expect(css).toContain('border-top-width: 1px')
    expect(css).toContain('border-bottom-width: 1px')
  })

  it('should handle border-solid', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('border-solid')
    const css = gen.toCSS()
    expect(css).toContain('border-style: solid')
  })

  it('should handle border-dashed', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('border-dashed')
    const css = gen.toCSS()
    expect(css).toContain('border-style: dashed')
  })

  it('should handle border-dotted', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('border-dotted')
    const css = gen.toCSS()
    expect(css).toContain('border-style: dotted')
  })

  it('should handle ring-inset', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('ring-inset')
    const css = gen.toCSS()
    expect(css).toContain('--tw-ring-inset: inset')
  })

  it('should handle divide-solid', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('divide-solid')
    const css = gen.toCSS()
    expect(css).toContain('border-style: solid')
    expect(css).toContain('> :not([hidden]) ~ :not([hidden])')
  })

  it('should handle divide-dashed', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('divide-dashed')
    const css = gen.toCSS()
    expect(css).toContain('border-style: dashed')
    expect(css).toContain('> :not([hidden]) ~ :not([hidden])')
  })

  it('should handle divide-dotted', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('divide-dotted')
    const css = gen.toCSS()
    expect(css).toContain('border-style: dotted')
  })
})

describe('New Features - 3D Transforms', () => {
  it('should parse rotate-x-45', () => {
    const parsed = parseClass('rotate-x-45')
    expect(parsed.utility).toBe('rotate-x')
    expect(parsed.value).toBe('45')
  })

  it('should generate rotate-x', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('rotate-x-45')
    const css = gen.toCSS()
    expect(css).toContain('transform: rotateX(45deg)')
  })

  it('should generate rotate-y', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('rotate-y-90')
    const css = gen.toCSS()
    expect(css).toContain('transform: rotateY(90deg)')
  })

  it('should generate rotate-z', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('rotate-z-180')
    const css = gen.toCSS()
    expect(css).toContain('transform: rotateZ(180deg)')
  })

  it('should parse translate-z-4', () => {
    const parsed = parseClass('translate-z-4')
    expect(parsed.utility).toBe('translate-z')
    expect(parsed.value).toBe('4')
  })

  it('should generate translate-z', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('translate-z-4')
    const css = gen.toCSS()
    expect(css).toContain('transform: translateZ(1rem)')
  })

  it('should handle negative translate-z', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('-translate-z-4')
    const css = gen.toCSS()
    expect(css).toContain('transform: translateZ(-1rem)')
  })

  it('should parse scale-z-50', () => {
    const parsed = parseClass('scale-z-50')
    expect(parsed.utility).toBe('scale-z')
    expect(parsed.value).toBe('50')
  })

  it('should generate scale-z', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('scale-z-150')
    const css = gen.toCSS()
    expect(css).toContain('transform: scaleZ(1.5)')
  })

  it('should handle perspective', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('perspective-1000')
    const css = gen.toCSS()
    expect(css).toContain('perspective: 1000px')
  })

  it('should handle perspective-none', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('perspective-none')
    const css = gen.toCSS()
    expect(css).toContain('perspective: none')
  })
})

describe('New Features - Complex Combinations', () => {
  it('should handle multiple new variants together', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('hover:focus:placeholder:text-gray-500/50')
    const css = gen.toCSS()
    expect(css).toContain(':hover')
    expect(css).toContain(':focus')
    expect(css).toContain('::placeholder')
  })

  it('should handle responsive with new variants', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('md:required:border-red-500')
    const css = gen.toCSS()
    expect(css).toContain('@media (min-width: 768px)')
    expect(css).toContain(':required')
  })

  it('should handle important with opacity', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('!bg-blue-500/50')
    const css = gen.toCSS()
    expect(css).toContain('!important')
  })

  it('should combine 3D transforms with responsive', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('lg:rotate-x-45')
    const css = gen.toCSS()
    expect(css).toContain('@media (min-width: 1024px)')
    expect(css).toContain('rotateX')
  })

  it('should handle all new pseudo-classes in sequence', () => {
    const gen = new CSSGenerator(defaultConfig)
    gen.generate('required:text-red-500')
    gen.generate('valid:text-green-500')
    gen.generate('invalid:text-red-700')
    gen.generate('optional:text-gray-500')
    const css = gen.toCSS()
    expect(css).toContain(':required')
    expect(css).toContain(':valid')
    expect(css).toContain(':invalid')
    expect(css).toContain(':optional')
  })
})
