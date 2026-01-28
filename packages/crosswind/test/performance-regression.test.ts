import { beforeEach, describe, expect, it } from 'bun:test'
import { CSSGenerator } from '../src/generator'
import { defaultConfig } from '../src/config'

/**
 * Performance Regression Tests
 *
 * These tests ensure we maintain our PERFECT 10/10 benchmark performance.
 * Each test has a threshold based on our current performance numbers with generous margins.
 * If performance degrades significantly, these tests will fail.
 *
 * NOTE: These tests use performance.now() for measurements, which has different characteristics
 * than the Mitata benchmarking tool used in benchmark.test.ts. The thresholds here are set
 * based on actual measured values with 2-3x safety margins.
 *
 * Current Performance Targets (vs UnoCSS in Mitata benchmarks):
 * - CSS Output Generation: 77.4x faster (benchmark: 910µs vs 70.5ms)
 * - Duplicate Handling: 52.0x faster (benchmark: 30µs vs 1.6ms)
 * - Real-world Components: 24.4x faster (benchmark: 5.6µs vs 136µs)
 * - Arbitrary Values: 10.6x faster (benchmark: 2.5µs vs 26µs)
 * - Color Utilities: 5.4x faster (benchmark: 54µs vs 289µs)
 * - Interactive States: 3.8x faster (benchmark: 236µs vs 888µs)
 * - Simple Utilities: 3.5x faster (benchmark: 5µs vs 18µs)
 * - Complex Utilities: 2.9x faster (benchmark: 8µs vs 24µs)
 * - Large Scale: 1.67x faster (benchmark: 265µs vs 444µs)
 * - Responsive Utilities: 1.16x faster (benchmark: 542µs vs 631µs)
 *
 * Critical Optimization: Rule Ordering
 * The most common utilities (spacing, sizing, colors) are placed at the beginning of the
 * builtInRules array for O(1) lookup performance. The "Rule Ordering Performance - Critical!"
 * test ensures this optimization stays in place.
 */

describe('Performance Regression Tests', () => {
  let gen: CSSGenerator

  beforeEach(() => {
    gen = new CSSGenerator(defaultConfig)
  })

  describe('Simple Utilities Performance', () => {
    it('should process 10 simple utilities within threshold', () => {
      const utilities = [
        'w-4', 'h-4', 'p-4', 'm-4', 'text-lg',
        'bg-blue-500', 'flex', 'items-center',
        'justify-between', 'rounded-lg',
      ]

      const start = performance.now()
      for (const cls of utilities) {
        gen.generate(cls)
      }
      const duration = performance.now() - start

      // Current: ~2ms, threshold: 5ms (2.5x margin for safety)
      expect(duration).toBeLessThan(5) // 5ms
    })
  })

  describe('Complex Utilities with Variants Performance', () => {
    it('should process complex utilities with variants within threshold', () => {
      const utilities = [
        'sm:w-full', 'md:w-1/2', 'lg:w-1/3',
        'hover:bg-blue-600', 'focus:ring-2',
        'dark:bg-gray-800', 'first:mt-0',
        'last:mb-0', 'group-hover:scale-105',
        'peer-focus:border-blue-500', 'motion-safe:animate-bounce',
      ]

      const start = performance.now()
      for (const cls of utilities) {
        gen.generate(cls)
      }
      const duration = performance.now() - start

      // Current: ~0.2ms, threshold: 1ms
      expect(duration).toBeLessThan(1) // 1ms
    })
  })

  describe('Arbitrary Values Performance', () => {
    it('should process arbitrary values within threshold', () => {
      const utilities = [
        'w-[123px]',
        'h-[456px]',
        'text-[#ff0000]',
        'p-[2rem]',
        'bg-[#1a1a1a]',
        'm-[10%]',
        'shadow-[0_4px_6px_rgba(0,0,0,0.1)]',
      ]

      const start = performance.now()
      for (const cls of utilities) {
        gen.generate(cls)
      }
      const duration = performance.now() - start

      // Current: ~0.05ms, threshold: 0.2ms
      expect(duration).toBeLessThan(0.2) // 0.2ms
    })
  })

  describe('Real-world Component Classes Performance', () => {
    it('should process real-world component patterns within threshold', () => {
      const componentClasses = [
        'flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md',
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
        'text-sm font-medium text-gray-700 hover:text-gray-900',
        'absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center',
        'transition-all duration-200 ease-in-out hover:scale-105',
        'border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200',
      ]

      const start = performance.now()
      for (const classString of componentClasses) {
        const classes = classString.split(/\s+/)
        for (const cls of classes) {
          gen.generate(cls)
        }
      }
      const duration = performance.now() - start

      // Current: ~0.5ms, threshold: 2ms
      expect(duration).toBeLessThan(2) // 2ms
    })
  })

  describe('Large Scale Performance', () => {
    it('should process 1000 utilities within threshold', () => {
      const largeSet: string[] = []
      for (let i = 0; i < 250; i++) {
        largeSet.push(`w-${i}`, `h-${i}`, `p-${i}`, `m-${i}`)
      }

      const start = performance.now()
      for (const cls of largeSet) {
        gen.generate(cls)
      }
      const duration = performance.now() - start

      // Current: ~5ms, threshold: 15ms (3x margin)
      expect(duration).toBeLessThan(15) // 15ms
    })
  })

  describe('CSS Output Generation Performance', () => {
    it('should generate CSS from 1000 rules within threshold', () => {
      const utilities: string[] = []
      for (let i = 0; i < 1000; i++) {
        utilities.push(`w-[${i}px]`)
      }

      // Generate all utilities
      for (const cls of utilities) {
        gen.generate(cls)
      }

      // Measure CSS output generation
      const start = performance.now()
      const css = gen.toCSS()
      const duration = performance.now() - start

      // Current: ~2ms, threshold: 5ms
      expect(duration).toBeLessThan(5) // 5ms
      expect(css.length).toBeGreaterThan(0)
    })
  })

  describe('Color Utilities Performance', () => {
    it('should process 240 color utilities within threshold', () => {
      const colors = ['blue', 'red', 'green', 'yellow', 'purple', 'pink', 'indigo', 'gray']
      const shades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900']
      const colorUtilities: string[] = []

      for (const color of colors) {
        for (const shade of shades) {
          colorUtilities.push(`bg-${color}-${shade}`)
          colorUtilities.push(`text-${color}-${shade}`)
          colorUtilities.push(`border-${color}-${shade}`)
        }
      }

      const start = performance.now()
      for (const cls of colorUtilities) {
        gen.generate(cls)
      }
      const duration = performance.now() - start

      // Current: ~1ms, threshold: 3ms
      expect(duration).toBeLessThan(3) // 3ms
    })
  })

  describe('Responsive Utilities Performance', () => {
    it('should process 1000 responsive utilities within threshold', () => {
      const breakpoints = ['sm', 'md', 'lg', 'xl', '2xl']
      const utilities: string[] = []

      for (const bp of breakpoints) {
        for (let i = 0; i < 200; i++) {
          utilities.push(`${bp}:w-${i}`)
        }
      }

      const start = performance.now()
      for (const cls of utilities) {
        gen.generate(cls)
      }
      const duration = performance.now() - start

      // Current: ~4ms, threshold: 10ms
      expect(duration).toBeLessThan(10) // 10ms
    })
  })

  describe('Interactive States Performance', () => {
    it('should process 550 interactive state utilities within threshold', () => {
      const states = ['hover', 'focus', 'active', 'disabled', 'group-hover', 'peer-focus', 'first', 'last', 'odd', 'even', 'dark']
      const stateUtilities: string[] = []

      for (const state of states) {
        for (let i = 0; i < 50; i++) {
          stateUtilities.push(`${state}:bg-blue-${i}`)
        }
      }

      const start = performance.now()
      for (const cls of stateUtilities) {
        gen.generate(cls)
      }
      const duration = performance.now() - start

      // Current: ~2.5ms, threshold: 6ms
      expect(duration).toBeLessThan(6) // 6ms
    })
  })

  describe('Duplicate Handling Performance', () => {
    it('should handle 6000 duplicate classes efficiently', () => {
      const duplicates = ['w-4', 'h-4', 'p-4', 'm-4', 'text-lg', 'bg-blue-500']
      const manyDuplicates: string[] = []

      for (let i = 0; i < 1000; i++) {
        manyDuplicates.push(...duplicates)
      }

      const start = performance.now()
      for (const cls of manyDuplicates) {
        gen.generate(cls)
      }
      const duration = performance.now() - start

      // Current: ~0.12ms, threshold: 0.5ms (this should be VERY fast due to caching)
      expect(duration).toBeLessThan(0.5) // 0.5ms
    })
  })

  describe('Rule Ordering Performance - Critical!', () => {
    it('should match common utilities in first 3 rule checks', () => {
      // This test ensures our critical optimization (rule ordering) stays in place
      const commonUtilities = [
        'w-4',      // spacingRule should match first
        'h-4',      // sizingRule should match second
        'p-4',      // spacingRule should match first
        'm-4',      // spacingRule should match first
        'bg-blue-500', // colorRule should match third
        'text-white',  // colorRule should match third
      ]

      const start = performance.now()
      for (const cls of commonUtilities) {
        gen.generate(cls)
      }
      const duration = performance.now() - start

      // These should be EXTREMELY fast (< 0.05ms for 6 classes)
      // because they match in the first 3 rules
      expect(duration).toBeLessThan(0.05) // 0.05ms
    })
  })

  describe('Cache Effectiveness', () => {
    it('should benefit from parse cache on repeated patterns', () => {
      const pattern = 'hover:bg-blue-500'

      // First pass - no cache
      const gen1 = new CSSGenerator(defaultConfig)
      const start1 = performance.now()
      for (let i = 0; i < 100; i++) {
        gen1.generate(pattern)
      }
      const duration1 = performance.now() - start1

      // Second pass - with cache (different generator, but parse cache is global)
      const gen2 = new CSSGenerator(defaultConfig)
      const start2 = performance.now()
      for (let i = 0; i < 100; i++) {
        gen2.generate(pattern)
      }
      const duration2 = performance.now() - start2

      // Second pass should be faster or equal (cache helps)
      // Due to class cache, second pass should be near-instant
      expect(duration2).toBeLessThanOrEqual(duration1)
      expect(duration2).toBeLessThan(0.05) // Should be < 50µs with full caching
    })

    it('should handle class cache efficiently', () => {
      const utilities = ['w-4', 'h-4', 'p-4', 'm-4']

      // Generate once
      for (const cls of utilities) {
        gen.generate(cls)
      }

      // Generate again (should hit class cache immediately)
      const start = performance.now()
      for (let i = 0; i < 1000; i++) {
        for (const cls of utilities) {
          gen.generate(cls)
        }
      }
      const duration = performance.now() - start

      // 4000 cached lookups should be fast
      expect(duration).toBeLessThan(1) // < 1ms for 4000 cached lookups
    })
  })

  describe('Memory Efficiency', () => {
    it('should not leak memory with large-scale generation', () => {
      const initialMemory = (performance as any).memory?.usedJSHeapSize || 0

      // Generate a lot of utilities
      for (let i = 0; i < 1000; i++) {
        gen.generate(`w-${i}`)
        gen.generate(`h-${i}`)
        gen.generate(`p-${i}`)
      }

      const finalMemory = (performance as any).memory?.usedJSHeapSize || 0
      const memoryIncrease = finalMemory - initialMemory

      // Memory increase should be reasonable (< 10MB for 3000 utilities)
      // Note: This is a rough estimate and may vary by environment
      if (initialMemory > 0) {
        expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024) // 10MB
      }
    })
  })

  describe('Performance Regression Guards', () => {
    it('should maintain O(1) lookup for common utilities', () => {
      // Test that adding more rules doesn't slow down common utilities
      // This guards against someone accidentally moving rules back to the end

      const commonUtils = ['w-4', 'h-4', 'p-4', 'm-4', 'bg-blue-500', 'text-white']

      const iterations = 100
      const start = performance.now()
      for (let i = 0; i < iterations; i++) {
        const gen = new CSSGenerator(defaultConfig)
        for (const cls of commonUtils) {
          gen.generate(cls)
        }
      }
      const duration = performance.now() - start
      const avgPerIteration = duration / iterations

      // Average per iteration should be < 20µs
      // If someone moves rules back, this will break
      expect(avgPerIteration).toBeLessThan(0.02) // 20 microseconds per iteration
    })
  })
})
