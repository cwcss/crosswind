import type { CustomRule } from '../src/types'
import { describe, expect, it } from 'bun:test'
import { defaultConfig } from '../src/config'
import { CSSGenerator } from '../src/generator'

describe('Advanced Features', () => {
  describe('Filter utilities', () => {
    it('should handle blur filter', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('blur')
      gen.generate('blur-sm')
      gen.generate('blur-lg')
      gen.generate('blur-none')
      const css = gen.toCSS(false)
      expect(css).toContain('blur')
    })

    it('should handle brightness filter', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('brightness-0')
      gen.generate('brightness-50')
      gen.generate('brightness-100')
      gen.generate('brightness-150')
      const css = gen.toCSS(false)
      expect(css).toContain('brightness')
    })

    it('should handle contrast filter', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('contrast-0')
      gen.generate('contrast-100')
      gen.generate('contrast-150')
      const css = gen.toCSS(false)
      expect(css).toContain('contrast')
    })

    it('should handle grayscale filter', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('grayscale-0')
      gen.generate('grayscale')
      const css = gen.toCSS(false)
      expect(css).toContain('grayscale')
    })

    it('should handle invert filter', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('invert-0')
      gen.generate('invert')
      const css = gen.toCSS(false)
      expect(css).toContain('invert')
    })

    it('should handle saturate filter', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('saturate-0')
      gen.generate('saturate-50')
      gen.generate('saturate-100')
      gen.generate('saturate-200')
      const css = gen.toCSS(false)
      expect(css).toContain('saturate')
    })

    it('should handle sepia filter', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('sepia-0')
      gen.generate('sepia')
      const css = gen.toCSS(false)
      expect(css).toContain('sepia')
    })

    it('should handle hue-rotate filter', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('hue-rotate-0')
      gen.generate('hue-rotate-30')
      gen.generate('hue-rotate-90')
      gen.generate('hue-rotate-180')
      const css = gen.toCSS(false)
      expect(css).toContain('hue')
    })

    it('should handle drop-shadow filter', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('drop-shadow')
      gen.generate('drop-shadow-sm')
      gen.generate('drop-shadow-lg')
      gen.generate('drop-shadow-none')
      const css = gen.toCSS(false)
      expect(css).toContain('drop-shadow')
    })

    it('should handle filter-none', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('filter-none')
      const css = gen.toCSS(false)
      expect(css).toContain('filter')
    })
  })

  describe('Backdrop filter utilities', () => {
    it('should handle backdrop-blur', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('backdrop-blur')
      gen.generate('backdrop-blur-sm')
      gen.generate('backdrop-blur-lg')
      gen.generate('backdrop-blur-none')
      const css = gen.toCSS(false)
      expect(css).toContain('backdrop')
    })

    it('should handle backdrop-brightness', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('backdrop-brightness-0')
      gen.generate('backdrop-brightness-100')
      gen.generate('backdrop-brightness-150')
      const css = gen.toCSS(false)
      expect(css).toContain('backdrop')
    })

    it('should handle backdrop-contrast', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('backdrop-contrast-0')
      gen.generate('backdrop-contrast-100')
      const css = gen.toCSS(false)
      expect(css).toContain('backdrop')
    })

    it('should handle backdrop-grayscale', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('backdrop-grayscale-0')
      gen.generate('backdrop-grayscale')
      const css = gen.toCSS(false)
      expect(css).toContain('backdrop')
    })

    it('should handle backdrop-saturate', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('backdrop-saturate-0')
      gen.generate('backdrop-saturate-100')
      const css = gen.toCSS(false)
      expect(css).toContain('backdrop')
    })

    it('should handle backdrop-sepia', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('backdrop-sepia-0')
      gen.generate('backdrop-sepia')
      const css = gen.toCSS(false)
      expect(css).toContain('backdrop')
    })

    it('should handle backdrop-invert', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('backdrop-invert-0')
      gen.generate('backdrop-invert')
      const css = gen.toCSS(false)
      expect(css).toContain('backdrop')
    })
  })

  describe('Transition utilities', () => {
    it('should handle transition property', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('transition')
      gen.generate('transition-none')
      gen.generate('transition-all')
      gen.generate('transition-colors')
      gen.generate('transition-opacity')
      gen.generate('transition-shadow')
      gen.generate('transition-transform')
      const css = gen.toCSS(false)
      expect(css).toContain('transition')
    })

    it('should handle transition duration', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('duration-75')
      gen.generate('duration-100')
      gen.generate('duration-150')
      gen.generate('duration-200')
      gen.generate('duration-300')
      gen.generate('duration-500')
      gen.generate('duration-700')
      gen.generate('duration-1000')
      const css = gen.toCSS(false)
      expect(css).toContain('duration')
    })

    it('should handle transition timing', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('ease-linear')
      gen.generate('ease-in')
      gen.generate('ease-out')
      gen.generate('ease-in-out')
      const css = gen.toCSS(false)
      expect(css).toContain('ease')
    })

    it('should handle transition delay', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('delay-75')
      gen.generate('delay-100')
      gen.generate('delay-150')
      gen.generate('delay-200')
      gen.generate('delay-300')
      const css = gen.toCSS(false)
      expect(css).toContain('delay')
    })

    it('should handle custom transition duration', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('duration-[2s]')
      gen.generate('delay-[500ms]')
      const css = gen.toCSS(false)
      expect(css).toContain('2s')
      expect(css).toContain('500ms')
    })
  })

  describe('Animation utilities', () => {
    it('should handle animation types', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('animate-none')
      gen.generate('animate-spin')
      gen.generate('animate-ping')
      gen.generate('animate-pulse')
      gen.generate('animate-bounce')
      const css = gen.toCSS(false)
      expect(css).toContain('animation')
    })

    it('should handle custom animation', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('animate-[wiggle_1s_ease-in-out_infinite]')
      const css = gen.toCSS(false)
      expect(css).toContain('wiggle')
    })
  })

  describe('Table utilities', () => {
    it('should handle border-collapse', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('border-collapse')
      gen.generate('border-separate')
      const css = gen.toCSS(false)
      expect(css).toContain('border-collapse')
    })

    it('should handle border-spacing', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('border-spacing-0')
      gen.generate('border-spacing-1')
      gen.generate('border-spacing-2')
      gen.generate('border-spacing-x-4')
      gen.generate('border-spacing-y-4')
      const css = gen.toCSS(false)
      expect(css).toContain('border-spacing')
    })

    it('should handle table-layout', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('table-auto')
      gen.generate('table-fixed')
      const css = gen.toCSS(false)
      expect(css).toContain('table-layout')
    })

    it('should handle caption-side', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('caption-top')
      gen.generate('caption-bottom')
      const css = gen.toCSS(false)
      expect(css).toContain('caption-side')
    })
  })

  describe('Advanced interactivity', () => {
    it('should handle accent-color', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('accent-auto')
      gen.generate('accent-blue-500')
      gen.generate('accent-red-500')
      const css = gen.toCSS(false)
      expect(css).toContain('accent-color')
    })

    it('should handle appearance', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('appearance-none')
      gen.generate('appearance-auto')
      const css = gen.toCSS(false)
      expect(css).toContain('appearance')
    })

    it('should handle caret-color', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('caret-auto')
      gen.generate('caret-blue-500')
      gen.generate('caret-transparent')
      const css = gen.toCSS(false)
      expect(css).toContain('caret-color')
    })

    it('should handle color-scheme', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('color-scheme-light')
      gen.generate('color-scheme-dark')
      gen.generate('color-scheme-auto')
      const css = gen.toCSS(false)
      expect(css).toContain('color-scheme')
    })

    it('should handle field-sizing', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('field-sizing-content')
      gen.generate('field-sizing-fixed')
      const css = gen.toCSS(false)
      expect(css).toContain('field-sizing')
    })

    it('should handle touch-action', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('touch-auto')
      gen.generate('touch-none')
      gen.generate('touch-pan-x')
      gen.generate('touch-pan-y')
      gen.generate('touch-pan-left')
      gen.generate('touch-pan-right')
      gen.generate('touch-pan-up')
      gen.generate('touch-pan-down')
      gen.generate('touch-pinch-zoom')
      gen.generate('touch-manipulation')
      const css = gen.toCSS(false)
      expect(css).toContain('touch-action')
    })
  })

  describe('Scroll utilities', () => {
    it('should handle scroll-margin', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('scroll-m-0')
      gen.generate('scroll-m-4')
      gen.generate('scroll-mx-4')
      gen.generate('scroll-my-4')
      gen.generate('scroll-mt-4')
      gen.generate('scroll-mr-4')
      gen.generate('scroll-mb-4')
      gen.generate('scroll-ml-4')
      const css = gen.toCSS(false)
      expect(css).toContain('scroll-margin')
    })

    it('should handle scroll-padding', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('scroll-p-0')
      gen.generate('scroll-p-4')
      gen.generate('scroll-px-4')
      gen.generate('scroll-py-4')
      gen.generate('scroll-pt-4')
      gen.generate('scroll-pr-4')
      gen.generate('scroll-pb-4')
      gen.generate('scroll-pl-4')
      const css = gen.toCSS(false)
      expect(css).toContain('scroll-padding')
    })

    it('should handle scroll-snap-type', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('snap-none')
      gen.generate('snap-x')
      gen.generate('snap-y')
      gen.generate('snap-both')
      gen.generate('snap-mandatory')
      gen.generate('snap-proximity')
      const css = gen.toCSS(false)
      expect(css).toContain('scroll-snap')
    })

    it('should handle scroll-snap-align', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('snap-start')
      gen.generate('snap-end')
      gen.generate('snap-center')
      gen.generate('snap-align-none')
      const css = gen.toCSS(false)
      expect(css).toContain('scroll-snap-align')
    })

    it('should handle scroll-snap-stop', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('snap-normal')
      gen.generate('snap-always')
      const css = gen.toCSS(false)
      expect(css).toContain('scroll-snap-stop')
    })
  })

  describe('Child selectors', () => {
    it('should handle space-x utilities', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('space-x-0')
      gen.generate('space-x-4')
      gen.generate('space-x-8')
      gen.generate('space-x-reverse')
      const css = gen.toCSS(false)
      expect(css).toContain('--hw-space-x-reverse')
      expect(css).toContain('margin-right')
      expect(css).toContain('margin-left')
    })

    it('should handle space-y utilities', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('space-y-0')
      gen.generate('space-y-4')
      gen.generate('space-y-8')
      gen.generate('space-y-reverse')
      const css = gen.toCSS(false)
      expect(css).toContain('--hw-space-y-reverse')
      expect(css).toContain('margin-top')
      expect(css).toContain('margin-bottom')
    })

    it('should handle negative space values', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('-space-x-4')
      gen.generate('-space-y-4')
      const css = gen.toCSS(false)
      expect(css).toContain('-')
    })

    it('should handle divide-x utilities', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('divide-x')
      gen.generate('divide-x-0')
      gen.generate('divide-x-2')
      gen.generate('divide-x-4')
      gen.generate('divide-x-reverse')
      const css = gen.toCSS(false)
      expect(css).toContain('border')
    })

    it('should handle divide-y utilities', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('divide-y')
      gen.generate('divide-y-0')
      gen.generate('divide-y-2')
      gen.generate('divide-y-4')
      gen.generate('divide-y-reverse')
      const css = gen.toCSS(false)
      expect(css).toContain('border')
    })

    it('should handle divide style utilities', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('divide-solid')
      gen.generate('divide-dashed')
      gen.generate('divide-dotted')
      gen.generate('divide-double')
      gen.generate('divide-none')
      const css = gen.toCSS(false)
      expect(css).toContain('border-style')
    })

    it('should handle divide color utilities', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('divide-blue-500')
      gen.generate('divide-red-500')
      gen.generate('divide-gray-300')
      const css = gen.toCSS(false)
      expect(css).toContain('border-color')
    })
  })

  describe('Custom rules', () => {
    it('should apply custom rules', () => {
      const customRule: CustomRule = [
        /^custom-utility$/,
        () => ({ 'custom-property': 'custom-value' }),
      ]
      const config = {
        ...defaultConfig,
        rules: [customRule],
      }
      const gen = new CSSGenerator(config)
      gen.generate('custom-utility')
      const css = gen.toCSS(false)
      expect(css).toContain('custom-property: custom-value')
    })

    it('should handle multiple custom rules', () => {
      const rules: CustomRule[] = [
        [/^rule1-/, () => ({ prop1: 'value1' })],
        [/^rule2-/, () => ({ prop2: 'value2' })],
      ]
      const config = {
        ...defaultConfig,
        rules,
      }
      const gen = new CSSGenerator(config)
      gen.generate('rule1-test')
      gen.generate('rule2-test')
      const css = gen.toCSS(false)
      expect(css).toContain('prop1: value1')
      expect(css).toContain('prop2: value2')
    })

    it('should prioritize custom rules over default rules', () => {
      const customRule: CustomRule = [
        /^p-custom$/,
        () => ({ padding: '999px' }),
      ]
      const config = {
        ...defaultConfig,
        rules: [customRule],
      }
      const gen = new CSSGenerator(config)
      gen.generate('p-custom')
      const css = gen.toCSS(false)
      expect(css).toContain('padding: 999px')
    })
  })

  describe('Presets', () => {
    it('should apply preset theme', () => {
      const preset = {
        name: 'custom-preset',
        theme: {
          colors: {
            preset: {
              500: '#custom',
            },
          },
        },
      }
      const config = {
        ...defaultConfig,
        presets: [preset],
      }
      const gen = new CSSGenerator(config)
      gen.generate('bg-preset-500')
      const css = gen.toCSS(false)
      expect(css).toContain('#custom')
    })

    it('should apply multiple presets', () => {
      const preset1 = {
        name: 'preset1',
        theme: {
          colors: {
            preset1: {
              500: '#preset1',
            },
          },
        },
      }
      const preset2 = {
        name: 'preset2',
        theme: {
          colors: {
            preset2: {
              500: '#preset2',
            },
          },
        },
      }
      const config = {
        ...defaultConfig,
        presets: [preset1, preset2],
      }
      const gen = new CSSGenerator(config)
      gen.generate('bg-preset1-500')
      gen.generate('bg-preset2-500')
      const css = gen.toCSS(false)
      expect(css).toContain('#preset1')
      expect(css).toContain('#preset2')
    })

    it('should merge preset rules with default rules', () => {
      const preset = {
        name: 'spacing-preset',
        theme: {
          spacing: {
            huge: '10rem',
          },
        },
      }
      const config = {
        ...defaultConfig,
        presets: [preset],
      }
      const gen = new CSSGenerator(config)
      gen.generate('p-huge')
      gen.generate('p-4') // Default spacing
      const css = gen.toCSS(false)
      expect(css).toContain('10rem')
      expect(css).toContain('1rem')
    })
  })

  describe('Blocklist', () => {
    it('should exclude blocklisted classes', () => {
      const config = {
        ...defaultConfig,
        blocklist: ['debug-*', 'test-*'],
      }
      const gen = new CSSGenerator(config)
      gen.generate('debug-border')
      gen.generate('test-utility')
      gen.generate('p-4') // Should work
      const css = gen.toCSS(false)
      expect(css).not.toContain('debug')
      expect(css).not.toContain('test')
      expect(css).toContain('padding: 1rem')
    })

    it('should handle wildcard blocklist patterns', () => {
      const config = {
        ...defaultConfig,
        blocklist: ['*-deprecated', 'old-*'],
      }
      const gen = new CSSGenerator(config)
      gen.generate('flex-deprecated')
      gen.generate('old-utility')
      gen.generate('flex') // Should work
      const css = gen.toCSS(false)
      expect(css).not.toContain('.flex-deprecated')
      expect(css).not.toContain('.old-utility')
      expect(css).toContain('display: flex')
    })

    it('should handle exact match blocklist', () => {
      const config = {
        ...defaultConfig,
        blocklist: ['p-4', 'm-4'],
      }
      const gen = new CSSGenerator(config)
      gen.generate('p-4')
      gen.generate('m-4')
      gen.generate('p-8') // Should work
      const css = gen.toCSS(false)
      expect(css).not.toContain('padding: 1rem')
      expect(css).not.toContain('margin: 1rem')
      expect(css).toContain('padding: 2rem')
    })
  })

  describe('Complex combinations', () => {
    it('should handle filters with variants', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('hover:blur-sm')
      gen.generate('focus:brightness-150')
      gen.generate('dark:grayscale-100')
      const css = gen.toCSS(false)
      expect(css).toContain(':hover')
      expect(css).toContain(':focus')
      expect(css).toContain('blur')
      expect(css).toContain('brightness')
      expect(css).toContain('grayscale')
    })

    it('should handle transitions with important', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('!transition-all')
      gen.generate('!duration-300')
      gen.generate('!ease-in-out')
      const css = gen.toCSS(false)
      expect(css).toContain('!important')
      expect(css).toContain('transition')
      expect(css).toContain('duration')
    })

    it('should handle child selectors with responsive variants', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('sm:space-x-4')
      gen.generate('md:divide-y-2')
      gen.generate('lg:space-y-8')
      const css = gen.toCSS(false)
      expect(css).toContain('@media')
      expect(css).toContain('space')
    })

    it('should handle animations with responsive variants', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('sm:animate-spin')
      gen.generate('md:animate-bounce')
      gen.generate('hover:animate-pulse')
      const css = gen.toCSS(false)
      expect(css).toContain('animation')
    })
  })

  describe('Multi-segment color names', () => {
    it('should handle blue-gray color', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('text-blue-gray-200')
      gen.generate('bg-blue-gray-500')
      gen.generate('border-blue-gray-700')
      const css = gen.toCSS(false)
      expect(css).toContain('#e2e8f0') // blue-gray-200
      expect(css).toContain('#64748b') // blue-gray-500
      expect(css).toContain('#334155') // blue-gray-700
    })

    it('should handle sky color', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('text-sky-400')
      gen.generate('bg-sky-500')
      gen.generate('border-sky-600')
      const css = gen.toCSS(false)
      expect(css).toContain('#38bdf8') // sky-400
      expect(css).toContain('#0ea5e9') // sky-500
      expect(css).toContain('#0284c7') // sky-600
    })

    it('should handle cyan color', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('text-cyan-400')
      gen.generate('bg-cyan-500')
      gen.generate('border-cyan-600')
      const css = gen.toCSS(false)
      expect(css).toContain('#22d3ee') // cyan-400
      expect(css).toContain('#06b6d4') // cyan-500
      expect(css).toContain('#0891b2') // cyan-600
    })
  })

  describe('Ring offset colors', () => {
    it('should handle ring-offset width', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('ring-offset-0')
      gen.generate('ring-offset-1')
      gen.generate('ring-offset-2')
      gen.generate('ring-offset-4')
      const css = gen.toCSS(false)
      expect(css).toContain('--hw-ring-offset-width')
      expect(css).toContain('0px')
      expect(css).toContain('1px')
      expect(css).toContain('2px')
      expect(css).toContain('4px')
    })

    it('should handle ring-offset with single color', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('ring-offset-black')
      gen.generate('ring-offset-white')
      const css = gen.toCSS(false)
      expect(css).toContain('--hw-ring-offset-color')
      expect(css).toContain('#000')
      expect(css).toContain('#fff')
    })

    it('should handle ring-offset with two-segment color', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('ring-offset-blue-500')
      gen.generate('ring-offset-red-500')
      gen.generate('ring-offset-gray-300')
      const css = gen.toCSS(false)
      expect(css).toContain('--hw-ring-offset-color')
      expect(css).toContain('#3b82f6') // blue-500
      expect(css).toContain('#ef4444') // red-500
      expect(css).toContain('#d1d5db') // gray-300
    })

    it('should handle ring-offset with multi-segment color names', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('ring-offset-blue-gray-500')
      gen.generate('ring-offset-sky-400')
      gen.generate('ring-offset-cyan-600')
      const css = gen.toCSS(false)
      expect(css).toContain('--hw-ring-offset-color')
      expect(css).toContain('#64748b') // blue-gray-500
      expect(css).toContain('#38bdf8') // sky-400
      expect(css).toContain('#0891b2') // cyan-600
    })
  })

  describe('Gradient utilities', () => {
    it('should handle gradient direction utilities', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('bg-gradient-to-r')
      gen.generate('bg-gradient-to-l')
      gen.generate('bg-gradient-to-t')
      gen.generate('bg-gradient-to-b')
      gen.generate('bg-gradient-to-tr')
      gen.generate('bg-gradient-to-br')
      gen.generate('bg-gradient-to-bl')
      gen.generate('bg-gradient-to-tl')
      const css = gen.toCSS(false)
      expect(css).toContain('linear-gradient')
      expect(css).toContain('to right')
      expect(css).toContain('to left')
      expect(css).toContain('to top')
      expect(css).toContain('to bottom')
    })

    it('should handle gradient color stops', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('from-blue-500')
      gen.generate('via-gray-300')
      gen.generate('to-red-500')
      const css = gen.toCSS(false)
      expect(css).toContain('--hw-gradient-from')
      expect(css).toContain('--hw-gradient-to')
      expect(css).toContain('--hw-gradient-stops')
      expect(css).toContain('#3b82f6') // blue-500
      expect(css).toContain('#ef4444') // red-500
    })

    it('should handle gradient with multi-segment colors', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('from-blue-gray-500')
      gen.generate('via-sky-400')
      gen.generate('to-cyan-600')
      const css = gen.toCSS(false)
      expect(css).toContain('--hw-gradient-from')
      expect(css).toContain('--hw-gradient-to')
      expect(css).toContain('--hw-gradient-stops')
      expect(css).toContain('#64748b') // blue-gray-500
      expect(css).toContain('#38bdf8') // sky-400
      expect(css).toContain('#0891b2') // cyan-600
    })

    it('should handle gradient with hover variants', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('hover:from-sky-500')
      gen.generate('hover:to-cyan-500')
      gen.generate('hover:via-blue-500')
      const css = gen.toCSS(false)
      expect(css).toContain(':hover')
      expect(css).toContain('--hw-gradient-from')
      expect(css).toContain('--hw-gradient-to')
      expect(css).toContain('#0ea5e9') // sky-500
      expect(css).toContain('#06b6d4') // cyan-500
    })

    it('should handle complete gradient combination', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('bg-gradient-to-r')
      gen.generate('from-sky-500')
      gen.generate('to-cyan-500')
      const css = gen.toCSS(false)
      expect(css).toContain('linear-gradient(to right, var(--hw-gradient-stops))')
      expect(css).toContain('--hw-gradient-from: #0ea5e9') // sky-500
      expect(css).toContain('--hw-gradient-to: #06b6d4') // cyan-500
    })

    it('should properly update gradient stops when using to-{color}', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('from-blue-500')
      gen.generate('to-red-500')
      const css = gen.toCSS(false)
      // Both from and to should set --hw-gradient-stops
      const fromMatch = css.match(/\.from-blue-500\s*\{[^}]*\}/)
      const toMatch = css.match(/\.to-red-500\s*\{[^}]*\}/)
      expect(fromMatch).toBeTruthy()
      expect(toMatch).toBeTruthy()
      expect(fromMatch![0]).toContain('--hw-gradient-stops')
      expect(toMatch![0]).toContain('--hw-gradient-stops')
    })
  })

  describe('Accessibility utilities', () => {
    it('should handle sr-only utility', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('sr-only')
      const css = gen.toCSS(false)
      expect(css).toContain('position: absolute')
      expect(css).toContain('width: 1px')
      expect(css).toContain('height: 1px')
      expect(css).toContain('padding: 0')
      expect(css).toContain('margin: -1px')
      expect(css).toContain('overflow: hidden')
      expect(css).toContain('clip: rect(0, 0, 0, 0)')
      expect(css).toContain('white-space: nowrap')
      expect(css).toContain('border-width: 0')
    })

    it('should handle not-sr-only utility', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('not-sr-only')
      const css = gen.toCSS(false)
      expect(css).toContain('position: static')
      expect(css).toContain('width: auto')
      expect(css).toContain('height: auto')
      expect(css).toContain('padding: 0')
      expect(css).toContain('margin: 0')
      expect(css).toContain('overflow: visible')
      expect(css).toContain('clip: auto')
      expect(css).toContain('white-space: normal')
    })

    it('should handle accessibility in forms', () => {
      const gen = new CSSGenerator(defaultConfig)
      // sr-only is typically used for labels and screen reader text
      gen.generate('sr-only')
      const css = gen.toCSS(false)
      // Verify all required properties for accessibility
      expect(css).toContain('position')
      expect(css).toContain('width')
      expect(css).toContain('height')
    })
  })
})
