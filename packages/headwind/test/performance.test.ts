/* eslint-disable no-console */
import { describe, expect, it } from 'bun:test'
import { defaultConfig } from '../src/config'
import { CSSGenerator } from '../src/generator'

describe('Performance Tests', () => {
  describe('CSS Generation Performance', () => {
    it('should generate 1000 utilities in under 100ms', () => {
      const gen = new CSSGenerator(defaultConfig)
      const utilities: string[] = []

      // Generate variety of utilities
      for (let i = 0; i < 250; i++) {
        utilities.push(`w-${i}`, `h-${i}`, `p-${i}`, `m-${i}`)
      }

      const start = performance.now()
      for (const util of utilities) {
        gen.generate(util)
      }
      const elapsed = performance.now() - start

      expect(elapsed).toBeLessThan(100)
    })

    it('should generate 5000 utilities in under 500ms', () => {
      const gen = new CSSGenerator(defaultConfig)
      const utilities: string[] = []

      // Generate variety of utilities
      for (let i = 0; i < 500; i++) {
        utilities.push(
          `w-${i}`,
          `h-${i}`,
          `p-${i}`,
          `m-${i}`,
          `text-${i}`,
          `bg-blue-${i % 900}`,
          `border-${i}`,
          `gap-${i}`,
          `grid-cols-${i % 12}`,
          `flex-${i % 10}`,
        )
      }

      const start = performance.now()
      for (const util of utilities) {
        gen.generate(util)
      }
      const elapsed = performance.now() - start

      expect(elapsed).toBeLessThan(500)
    })

    it('should generate complex responsive utilities efficiently', () => {
      const gen = new CSSGenerator(defaultConfig)
      const utilities = [
        'sm:md:lg:xl:2xl:w-full',
        'sm:hover:focus:bg-blue-500',
        'md:group-hover:text-red-500',
        'lg:peer-focus:border-green-500',
        'xl:dark:bg-gray-900',
      ]

      const start = performance.now()
      for (let i = 0; i < 200; i++) {
        for (const util of utilities) {
          gen.generate(util)
        }
      }
      const elapsed = performance.now() - start

      expect(elapsed).toBeLessThan(200)
    })

    it('should handle arbitrary values efficiently', () => {
      const gen = new CSSGenerator(defaultConfig)
      const utilities: string[] = []

      for (let i = 0; i < 100; i++) {
        utilities.push(
          `w-[${i}px]`,
          `h-[${i * 2}rem]`,
          `text-[${i}px]`,
          `bg-[#${i.toString(16).padStart(6, '0')}]`,
          `p-[${i}em]`,
          `m-[${i}%]`,
          `grid-cols-[repeat(${i},1fr)]`,
          `shadow-[0_${i}px_${i * 2}px_rgba(0,0,0,0.1)]`,
        )
      }

      const start = performance.now()
      for (const util of utilities) {
        gen.generate(util)
      }
      const elapsed = performance.now() - start

      expect(elapsed).toBeLessThan(100)
    })
  })

  describe('Duplicate Detection Performance', () => {
    it('should efficiently handle duplicate utilities', () => {
      const gen = new CSSGenerator(defaultConfig)
      const utilities = ['w-4', 'h-4', 'p-4', 'm-4', 'text-lg', 'bg-blue-500']

      const start = performance.now()
      // Generate each utility 1000 times
      for (let i = 0; i < 1000; i++) {
        for (const util of utilities) {
          gen.generate(util)
        }
      }
      const elapsed = performance.now() - start

      const css = gen.toCSS(false)
      // Count only utility rules (not preflight)
      const utilityRules = css.split('\n').filter(line =>
        line.startsWith('.w-4') || line.startsWith('.h-4')
        || line.startsWith('.p-4') || line.startsWith('.m-4')
        || line.startsWith('.text-lg') || line.startsWith('.bg-blue-500'),
      ).length

      expect(elapsed).toBeLessThan(150) // Allow more time for CI environments
      expect(utilityRules).toBe(6) // Should only have 6 unique utility classes
    })

    it('should cache parsed utilities efficiently', () => {
      const gen = new CSSGenerator(defaultConfig)
      const utility = 'sm:hover:focus:disabled:bg-blue-500'

      // First generation (parsing + generation)
      const start1 = performance.now()
      for (let i = 0; i < 100; i++) {
        gen.generate(utility)
      }
      const elapsed1 = performance.now() - start1

      // Second generation (should be cached)
      const start2 = performance.now()
      for (let i = 0; i < 100; i++) {
        gen.generate(utility)
      }
      const elapsed2 = performance.now() - start2

      // Cache should make second run faster or similar
      expect(elapsed2).toBeLessThanOrEqual(elapsed1 * 1.5)
    })
  })

  describe('CSS Output Performance', () => {
    it('should convert to CSS string efficiently for large rulesets', () => {
      const gen = new CSSGenerator(defaultConfig)

      // Generate 2000 unique utilities
      for (let i = 0; i < 2000; i++) {
        gen.generate(`w-[${i}px]`)
      }

      const start = performance.now()
      const css = gen.toCSS(false)
      const elapsed = performance.now() - start

      expect(elapsed).toBeLessThan(50)
      expect(css.length).toBeGreaterThan(0)
    })

    it('should generate CSS with minify option efficiently', () => {
      const gen = new CSSGenerator({ ...defaultConfig, minify: true })

      // Generate utilities
      for (let i = 0; i < 500; i++) {
        gen.generate(`w-${i}`)
        gen.generate(`h-${i}`)
        gen.generate(`p-${i}`)
      }

      const start = performance.now()
      const css = gen.toCSS(false)
      const elapsed = performance.now() - start

      // Performance should be similar whether minified or not
      expect(elapsed).toBeLessThan(50)
      expect(css.length).toBeGreaterThan(0)
    })
  })

  describe('Variant Processing Performance', () => {
    it('should handle multiple variants efficiently', () => {
      const gen = new CSSGenerator(defaultConfig)
      const variants = [
        'hover:',
        'focus:',
        'active:',
        'disabled:',
        'group-hover:',
        'peer-focus:',
        'first:',
        'last:',
        'odd:',
        'even:',
        'dark:',
      ]

      const utilities: string[] = []
      for (const variant of variants) {
        for (let i = 0; i < 50; i++) {
          utilities.push(`${variant}bg-blue-${i}`)
        }
      }

      const start = performance.now()
      for (const util of utilities) {
        gen.generate(util)
      }
      const elapsed = performance.now() - start

      expect(elapsed).toBeLessThan(100)
    })

    it('should handle important modifier efficiently', () => {
      const gen = new CSSGenerator(defaultConfig)

      const start = performance.now()
      for (let i = 0; i < 1000; i++) {
        gen.generate(`!w-${i}`)
        gen.generate(`!h-${i}`)
        gen.generate(`!p-${i}`)
      }
      const elapsed = performance.now() - start

      expect(elapsed).toBeLessThan(100)
    })

    it('should handle responsive breakpoints efficiently', () => {
      const gen = new CSSGenerator(defaultConfig)
      const breakpoints = ['sm', 'md', 'lg', 'xl', '2xl']

      const start = performance.now()
      for (const bp of breakpoints) {
        for (let i = 0; i < 200; i++) {
          gen.generate(`${bp}:w-${i}`)
        }
      }
      const elapsed = performance.now() - start

      expect(elapsed).toBeLessThan(150)
    })
  })

  describe('Color Processing Performance', () => {
    it('should handle color utilities efficiently', () => {
      const gen = new CSSGenerator(defaultConfig)
      const colors = ['blue', 'red', 'green', 'yellow', 'purple', 'pink', 'indigo', 'gray']
      const shades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900']

      const start = performance.now()
      for (const color of colors) {
        for (const shade of shades) {
          gen.generate(`bg-${color}-${shade}`)
          gen.generate(`text-${color}-${shade}`)
          gen.generate(`border-${color}-${shade}`)
        }
      }
      const elapsed = performance.now() - start

      expect(elapsed).toBeLessThan(50)
    })

    it('should handle gradient utilities efficiently', () => {
      const gen = new CSSGenerator(defaultConfig)
      const directions = ['to-t', 'to-tr', 'to-r', 'to-br', 'to-b', 'to-bl', 'to-l', 'to-tl']
      const colors = ['blue-500', 'red-500', 'green-500', 'purple-500']

      const start = performance.now()
      for (const dir of directions) {
        for (const from of colors) {
          for (const to of colors) {
            gen.generate(`bg-gradient-${dir}`)
            gen.generate(`from-${from}`)
            gen.generate(`to-${to}`)
          }
        }
      }
      const elapsed = performance.now() - start

      expect(elapsed).toBeLessThan(100)
    })
  })

  describe('Grid and Flexbox Performance', () => {
    it('should handle grid utilities efficiently', () => {
      const gen = new CSSGenerator(defaultConfig)

      const start = performance.now()
      for (let i = 1; i <= 12; i++) {
        gen.generate(`grid-cols-${i}`)
        gen.generate(`col-span-${i}`)
        gen.generate(`col-start-${i}`)
        gen.generate(`col-end-${i}`)
        gen.generate(`gap-${i}`)
        gen.generate(`gap-x-${i}`)
        gen.generate(`gap-y-${i}`)
      }
      const elapsed = performance.now() - start

      expect(elapsed).toBeLessThan(20)
    })

    it('should handle flexbox utilities efficiently', () => {
      const gen = new CSSGenerator(defaultConfig)
      const values = ['1', '2', '3', 'auto', 'none']

      const start = performance.now()
      for (let i = 0; i < 200; i++) {
        gen.generate('flex')
        gen.generate('inline-flex')
        gen.generate('flex-row')
        gen.generate('flex-col')
        gen.generate('flex-wrap')
        gen.generate('flex-nowrap')
        values.forEach(val => gen.generate(`flex-${val}`))
        values.forEach(val => gen.generate(`grow-${val}`))
        values.forEach(val => gen.generate(`shrink-${val}`))
      }
      const elapsed = performance.now() - start

      expect(elapsed).toBeLessThan(100)
    })
  })

  describe('Memory Efficiency', () => {
    it('should not leak memory with repeated generations', () => {
      const iterations = 10
      const memorySamples: number[] = []

      for (let i = 0; i < iterations; i++) {
        const gen = new CSSGenerator(defaultConfig)

        // Generate a lot of utilities
        for (let j = 0; j < 1000; j++) {
          gen.generate(`w-${j}`)
          gen.generate(`h-${j}`)
          gen.generate(`p-${j}`)
        }

        gen.toCSS(false)

        // Force garbage collection if available
        if (globalThis.gc) {
          globalThis.gc()
        }

        if (typeof process !== 'undefined' && process.memoryUsage) {
          memorySamples.push(process.memoryUsage().heapUsed)
        }
      }

      // If we have memory samples, check they're not growing exponentially
      if (memorySamples.length > 5) {
        const firstHalf = memorySamples.slice(0, 5).reduce((a, b) => a + b) / 5
        const secondHalf = memorySamples.slice(5).reduce((a, b) => a + b) / 5

        // Second half should not be more than 3x the first half
        // (allowing for normal variance and JIT optimization)
        expect(secondHalf).toBeLessThan(firstHalf * 3)
      }
    })

    it('should handle large class strings efficiently', () => {
      const gen = new CSSGenerator(defaultConfig)

      // Create a very large class string
      const classes = Array.from({ length: 500 }, (_, i) =>
        `w-${i} h-${i} p-${i} m-${i} bg-blue-${i % 900} text-${i}`).join(' ')

      const start = performance.now()
      gen.generate(classes)
      const elapsed = performance.now() - start

      expect(elapsed).toBeLessThan(200)
    })
  })

  describe('Edge Cases Performance', () => {
    it('should handle deeply nested variants efficiently', () => {
      const gen = new CSSGenerator(defaultConfig)

      const start = performance.now()
      for (let i = 0; i < 100; i++) {
        gen.generate('sm:md:lg:xl:hover:focus:active:dark:group-hover:w-full')
        gen.generate('md:lg:xl:2xl:first:last:odd:even:bg-blue-500')
      }
      const elapsed = performance.now() - start

      expect(elapsed).toBeLessThan(50)
    })

    it('should handle very long arbitrary values efficiently', () => {
      const gen = new CSSGenerator(defaultConfig)
      const longValue = 'rgba(255,255,255,0.1),rgba(0,0,0,0.2),rgba(100,100,100,0.3)'

      const start = performance.now()
      for (let i = 0; i < 100; i++) {
        gen.generate(`bg-[${longValue}]`)
        gen.generate(`shadow-[0_0_100px_50px_${longValue}]`)
      }
      const elapsed = performance.now() - start

      expect(elapsed).toBeLessThan(50)
    })

    it('should handle invalid utilities gracefully without performance degradation', () => {
      const gen = new CSSGenerator(defaultConfig)
      const invalidUtilities = [
        'invalid-utility-name',
        'w-',
        'h-',
        'bg-nonexistent-color',
        'text-invalid-size',
        '::invalid::modifier::w-4',
      ]

      const start = performance.now()
      for (let i = 0; i < 500; i++) {
        for (const util of invalidUtilities) {
          gen.generate(util)
        }
      }
      const elapsed = performance.now() - start

      expect(elapsed).toBeLessThan(100)
    })
  })

  describe('Real-world Scenarios', () => {
    it('should handle typical component class list efficiently', () => {
      const gen = new CSSGenerator(defaultConfig)

      const componentClasses = [
        'flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md',
        'w-full max-w-md mx-auto space-y-4 sm:space-y-6',
        'text-lg font-semibold text-gray-900 dark:text-white',
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
        'hover:bg-blue-50 hover:dark:bg-blue-900 transition-colors duration-200',
        'border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500',
      ]

      const start = performance.now()
      for (let i = 0; i < 200; i++) {
        for (const classes of componentClasses) {
          gen.generate(classes)
        }
      }
      const elapsed = performance.now() - start

      expect(elapsed).toBeLessThan(150)
    })

    it('should handle entire page worth of utilities efficiently', () => {
      const gen = new CSSGenerator(defaultConfig)

      // Simulate a page with 100 components, each with 10-20 utility classes
      const utilities: string[] = []
      for (let i = 0; i < 100; i++) {
        utilities.push(
          `container mx-auto px-${i % 8}`,
          `grid grid-cols-${(i % 12) + 1} gap-${i % 16}`,
          `flex flex-col md:flex-row items-center justify-between`,
          `text-${['sm', 'base', 'lg', 'xl', '2xl'][i % 5]} font-${['normal', 'medium', 'semibold', 'bold'][i % 4]}`,
          `bg-${['white', 'gray-50', 'gray-100', 'blue-50'][i % 4]} dark:bg-gray-${800 + (i % 2) * 100}`,
          `rounded-${['none', 'sm', 'md', 'lg', 'xl'][i % 5]} shadow-${['sm', 'md', 'lg', 'xl'][i % 4]}`,
          `p-${i % 12} m-${i % 12} space-y-${i % 8}`,
          `hover:bg-blue-${(i % 9) * 100 + 100} hover:scale-105 transition-all duration-${100 + (i % 5) * 100}`,
          `border border-gray-${200 + (i % 7) * 100} focus:ring-${(i % 4) + 1} focus:ring-blue-500`,
          `w-${['full', 'auto', '1/2', '1/3', '2/3', '1/4', '3/4'][i % 7]} h-${i % 96}`,
        )
      }

      const start = performance.now()
      for (const util of utilities) {
        gen.generate(util)
      }
      const css = gen.toCSS(false)
      const elapsed = performance.now() - start

      expect(elapsed).toBeLessThan(300)
      expect(css.length).toBeGreaterThan(0)
    })

    it('should handle progressive enhancement patterns efficiently', () => {
      const gen = new CSSGenerator(defaultConfig)

      const start = performance.now()
      for (let i = 0; i < 100; i++) {
        // Mobile-first responsive design
        gen.generate(`w-full sm:w-auto md:w-1/2 lg:w-1/3 xl:w-1/4`)
        gen.generate(`text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl`)
        gen.generate(`p-2 sm:p-4 md:p-6 lg:p-8 xl:p-10`)
        gen.generate(`grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`)

        // Dark mode support
        gen.generate(`bg-white dark:bg-gray-900 text-gray-900 dark:text-white`)
        gen.generate(`border-gray-200 dark:border-gray-700`)

        // Interactive states
        gen.generate(`hover:bg-blue-500 focus:bg-blue-600 active:bg-blue-700`)
        gen.generate(`hover:scale-105 focus:ring-2 active:scale-95`)
      }
      const elapsed = performance.now() - start

      expect(elapsed).toBeLessThan(100)
    })
  })

  describe('Benchmark Comparison', () => {
    it('should demonstrate performance baseline', () => {
      const results: Record<string, number> = {}

      // Benchmark: Simple utilities
      const gen1 = new CSSGenerator(defaultConfig)
      const start1 = performance.now()
      for (let i = 0; i < 1000; i++) {
        gen1.generate(`w-${i}`)
      }
      results.simpleUtilities = performance.now() - start1

      // Benchmark: Complex utilities
      const gen2 = new CSSGenerator(defaultConfig)
      const start2 = performance.now()
      for (let i = 0; i < 1000; i++) {
        gen2.generate(`sm:md:hover:dark:w-${i}`)
      }
      results.complexUtilities = performance.now() - start2

      // Benchmark: Arbitrary values
      const gen3 = new CSSGenerator(defaultConfig)
      const start3 = performance.now()
      for (let i = 0; i < 1000; i++) {
        gen3.generate(`w-[${i}px]`)
      }
      results.arbitraryValues = performance.now() - start3

      // Benchmark: CSS output
      const gen4 = new CSSGenerator(defaultConfig)
      for (let i = 0; i < 1000; i++) {
        gen4.generate(`w-${i}`)
      }
      const start4 = performance.now()
      gen4.toCSS(false)
      results.cssOutput = performance.now() - start4

      // Log results for reference
      console.log('\nPerformance Benchmarks:')
      console.log(`  Simple utilities (1000): ${results.simpleUtilities.toFixed(2)}ms`)
      console.log(`  Complex utilities (1000): ${results.complexUtilities.toFixed(2)}ms`)
      console.log(`  Arbitrary values (1000): ${results.arbitraryValues.toFixed(2)}ms`)
      console.log(`  CSS output (1000 rules): ${results.cssOutput.toFixed(2)}ms`)

      // Ensure reasonable performance
      expect(results.simpleUtilities).toBeLessThan(100)
      expect(results.complexUtilities).toBeLessThan(200)
      expect(results.arbitraryValues).toBeLessThan(150)
      expect(results.cssOutput).toBeLessThan(50)
    })
  })
})
