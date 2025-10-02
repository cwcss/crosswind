import { describe, expect, it } from 'bun:test'
import { CSSGenerator } from '../src/generator'
import { defaultConfig } from '../src/config'

describe('Typography Utilities', () => {
  describe('Font size', () => {
    it('should generate text-sm', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('text-sm')
      const css = gen.toCSS()
      expect(css).toContain('font-size:')
      expect(css).toContain('line-height:')
    })

    it('should generate text-lg', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('text-lg')
      const css = gen.toCSS()
      expect(css).toContain('font-size:')
    })
  })

  describe('Font weight', () => {
    it('should generate font-bold', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('font-bold')
      expect(gen.toCSS()).toContain('font-weight: 700;')
    })

    it('should generate font-normal', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('font-normal')
      expect(gen.toCSS()).toContain('font-weight: 400;')
    })

    it('should generate font-semibold', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('font-semibold')
      expect(gen.toCSS()).toContain('font-weight: 600;')
    })
  })

  describe('Text align', () => {
    it('should generate text-center', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('text-center')
      expect(gen.toCSS()).toContain('text-align: center;')
    })

    it('should generate text-left', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('text-left')
      expect(gen.toCSS()).toContain('text-align: left;')
    })

    it('should generate text-right', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('text-right')
      expect(gen.toCSS()).toContain('text-align: right;')
    })
  })

  describe('Text transform', () => {
    it('should generate uppercase', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('uppercase')
      expect(gen.toCSS()).toContain('text-transform: uppercase;')
    })

    it('should generate lowercase', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('lowercase')
      expect(gen.toCSS()).toContain('text-transform: lowercase;')
    })

    it('should generate capitalize', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('capitalize')
      expect(gen.toCSS()).toContain('text-transform: capitalize;')
    })
  })

  describe('Text decoration', () => {
    it('should generate underline', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('underline')
      expect(gen.toCSS()).toContain('text-decoration-line: underline;')
    })

    it('should generate line-through', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('line-through')
      expect(gen.toCSS()).toContain('text-decoration-line: line-through;')
    })

    it('should generate decoration-wavy', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('decoration-wavy')
      expect(gen.toCSS()).toContain('text-decoration-style: wavy;')
    })

    it('should generate underline-offset', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('underline-offset-4')
      expect(gen.toCSS()).toContain('text-underline-offset: 4px;')
    })

    it('should generate decoration-color', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('decoration-blue-500')
      expect(gen.toCSS()).toContain('text-decoration-color: #3b82f6;')
    })
  })

  describe('Font style', () => {
    it('should generate italic', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('italic')
      expect(gen.toCSS()).toContain('font-style: italic;')
    })

    it('should generate not-italic', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('not-italic')
      expect(gen.toCSS()).toContain('font-style: normal;')
    })
  })

  describe('Line height', () => {
    it('should generate leading-tight', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('leading-tight')
      expect(gen.toCSS()).toContain('line-height: 1.25;')
    })

    it('should generate leading-loose', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('leading-loose')
      expect(gen.toCSS()).toContain('line-height: 2;')
    })

    it('should generate leading-normal', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('leading-normal')
      expect(gen.toCSS()).toContain('line-height: 1.5;')
    })
  })

  describe('White space', () => {
    it('should generate whitespace-nowrap', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('whitespace-nowrap')
      expect(gen.toCSS()).toContain('white-space: nowrap;')
    })

    it('should generate whitespace-normal', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('whitespace-normal')
      expect(gen.toCSS()).toContain('white-space: normal;')
    })
  })

  describe('Letter spacing', () => {
    it('should generate tracking-tight', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('tracking-tight')
      expect(gen.toCSS()).toContain('letter-spacing:')
    })

    it('should generate tracking-wide', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('tracking-wide')
      expect(gen.toCSS()).toContain('letter-spacing:')
    })
  })

  describe('Edge Cases', () => {
    describe('Arbitrary font sizes', () => {
      it('should handle arbitrary font size', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('text-[32px]')
        expect(gen.toCSS()).toContain('font-size: 32px;')
      })

      it('should handle arbitrary font size with rem', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('text-[2.5rem]')
        expect(gen.toCSS()).toContain('font-size: 2.5rem;')
      })

      it('should handle arbitrary font size with clamp', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('text-[clamp(1rem,2.5vw,3rem)]')
        expect(gen.toCSS()).toContain('font-size: clamp(1rem,2.5vw,3rem);')
      })
    })

    describe('Font families', () => {
      it('should handle font-sans', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('font-sans')
        expect(gen.toCSS()).toContain('font-family:')
        expect(gen.toCSS()).toContain('ui-sans-serif')
      })

      it('should handle font-serif', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('font-serif')
        expect(gen.toCSS()).toContain('font-family:')
        expect(gen.toCSS()).toContain('ui-serif')
      })

      it('should handle font-mono', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('font-mono')
        expect(gen.toCSS()).toContain('font-family:')
        expect(gen.toCSS()).toContain('ui-monospace')
      })
    })

    describe('Arbitrary font weights', () => {
      it('should handle arbitrary font weight', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('font-[450]')
        expect(gen.toCSS()).toContain('font-weight: 450;')
      })

      it('should handle arbitrary font weight with variable', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('font-[var(--font-weight)]')
        expect(gen.toCSS()).toContain('font-weight: var(--font-weight);')
      })
    })

    describe('Text overflow utilities', () => {
      it('should handle truncate', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('truncate')
        const css = gen.toCSS()
        expect(css).toContain('overflow: hidden;')
        expect(css).toContain('text-overflow: ellipsis;')
        expect(css).toContain('white-space: nowrap;')
      })

      it('should handle text-ellipsis', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('text-ellipsis')
        expect(gen.toCSS()).toContain('text-overflow: ellipsis;')
      })

      it('should handle text-clip', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('text-clip')
        expect(gen.toCSS()).toContain('text-overflow: clip;')
      })
    })

    describe('Vertical align', () => {
      it('should handle align-baseline', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('align-baseline')
        expect(gen.toCSS()).toContain('vertical-align: baseline;')
      })

      it('should handle align-top', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('align-top')
        expect(gen.toCSS()).toContain('vertical-align: top;')
      })

      it('should handle align-middle', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('align-middle')
        expect(gen.toCSS()).toContain('vertical-align: middle;')
      })

      it('should handle align-bottom', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('align-bottom')
        expect(gen.toCSS()).toContain('vertical-align: bottom;')
      })

      it('should handle align-text-top', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('align-text-top')
        expect(gen.toCSS()).toContain('vertical-align: text-top;')
      })

      it('should handle align-text-bottom', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('align-text-bottom')
        expect(gen.toCSS()).toContain('vertical-align: text-bottom;')
      })

      it('should handle align-sub', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('align-sub')
        expect(gen.toCSS()).toContain('vertical-align: sub;')
      })

      it('should handle align-super', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('align-super')
        expect(gen.toCSS()).toContain('vertical-align: super;')
      })
    })

    describe('Text indent', () => {
      it('should handle indent with spacing scale', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('indent-4')
        expect(gen.toCSS()).toContain('text-indent: 1rem;')
      })

      it('should handle arbitrary indent', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('indent-[2.5rem]')
        expect(gen.toCSS()).toContain('text-indent: 2.5rem;')
      })

      it('should handle negative indent', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('-indent-4')
        expect(gen.toCSS()).toContain('text-indent: -1rem;')
      })
    })

    describe('Word and overflow wrap', () => {
      it('should handle break-normal', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('break-normal')
        const css = gen.toCSS()
        expect(css).toContain('overflow-wrap: normal;')
        expect(css).toContain('word-break: normal;')
      })

      it('should handle break-words', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('break-words')
        expect(gen.toCSS()).toContain('overflow-wrap: break-word;')
      })

      it('should handle break-all', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('break-all')
        expect(gen.toCSS()).toContain('word-break: break-all;')
      })

      it('should handle break-keep', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('break-keep')
        expect(gen.toCSS()).toContain('word-break: keep-all;')
      })
    })

    describe('List style', () => {
      it('should handle list-none', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('list-none')
        expect(gen.toCSS()).toContain('list-style-type: none;')
      })

      it('should handle list-disc', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('list-disc')
        expect(gen.toCSS()).toContain('list-style-type: disc;')
      })

      it('should handle list-decimal', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('list-decimal')
        expect(gen.toCSS()).toContain('list-style-type: decimal;')
      })

      it('should handle list-inside', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('list-inside')
        expect(gen.toCSS()).toContain('list-style-position: inside;')
      })

      it('should handle list-outside', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('list-outside')
        expect(gen.toCSS()).toContain('list-style-position: outside;')
      })
    })

    describe('Arbitrary letter spacing and line height', () => {
      it('should handle arbitrary letter spacing', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('tracking-[0.5em]')
        expect(gen.toCSS()).toContain('letter-spacing: 0.5em;')
      })

      it('should handle arbitrary line height', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('leading-[3rem]')
        expect(gen.toCSS()).toContain('line-height: 3rem;')
      })

      it('should handle negative letter spacing with arbitrary value', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('tracking-[-0.05em]')
        expect(gen.toCSS()).toContain('letter-spacing: -0.05em;')
      })
    })

    describe('Font variant numeric', () => {
      it('should handle normal-nums', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('normal-nums')
        expect(gen.toCSS()).toContain('font-variant-numeric: normal;')
      })

      it('should handle ordinal', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('ordinal')
        expect(gen.toCSS()).toContain('font-variant-numeric: ordinal;')
      })

      it('should handle slashed-zero', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('slashed-zero')
        expect(gen.toCSS()).toContain('font-variant-numeric: slashed-zero;')
      })

      it('should handle lining-nums', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('lining-nums')
        expect(gen.toCSS()).toContain('font-variant-numeric: lining-nums;')
      })

      it('should handle oldstyle-nums', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('oldstyle-nums')
        expect(gen.toCSS()).toContain('font-variant-numeric: oldstyle-nums;')
      })

      it('should handle proportional-nums', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('proportional-nums')
        expect(gen.toCSS()).toContain('font-variant-numeric: proportional-nums;')
      })

      it('should handle tabular-nums', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('tabular-nums')
        expect(gen.toCSS()).toContain('font-variant-numeric: tabular-nums;')
      })

      it('should handle diagonal-fractions', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('diagonal-fractions')
        expect(gen.toCSS()).toContain('font-variant-numeric: diagonal-fractions;')
      })

      it('should handle stacked-fractions', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('stacked-fractions')
        expect(gen.toCSS()).toContain('font-variant-numeric: stacked-fractions;')
      })
    })

    describe('Text decoration thickness', () => {
      it('should handle decoration-auto', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('decoration-auto')
        expect(gen.toCSS()).toContain('text-decoration-thickness: auto;')
      })

      it('should handle decoration-from-font', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('decoration-from-font')
        expect(gen.toCSS()).toContain('text-decoration-thickness: from-font;')
      })

      it('should handle decoration-0', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('decoration-0')
        expect(gen.toCSS()).toContain('text-decoration-thickness: 0px;')
      })

      it('should handle decoration-1', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('decoration-1')
        expect(gen.toCSS()).toContain('text-decoration-thickness: 1px;')
      })

      it('should handle decoration-2', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('decoration-2')
        expect(gen.toCSS()).toContain('text-decoration-thickness: 2px;')
      })

      it('should handle arbitrary decoration thickness', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('decoration-[3px]')
        expect(gen.toCSS()).toContain('text-decoration-thickness: 3px;')
      })
    })

    describe('Typography with variants', () => {
      it('should handle text-center with responsive variant', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('md:text-center')
        const css = gen.toCSS()
        expect(css).toContain('@media (min-width: 768px)')
        expect(css).toContain('text-align: center;')
      })

      it('should handle font-bold with hover variant', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('hover:font-bold')
        const css = gen.toCSS()
        expect(css).toContain(':hover')
        expect(css).toContain('font-weight: 700;')
      })

      it('should handle text-lg with dark mode variant', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('dark:text-lg')
        const css = gen.toCSS()
        expect(css).toContain('.dark')
        expect(css).toContain('font-size:')
      })
    })

    describe('Text with CSS variables', () => {
      it('should handle font size with CSS variable', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('text-[var(--font-size)]')
        expect(gen.toCSS()).toContain('font-size: var(--font-size);')
      })

      it('should handle line height with CSS variable', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('leading-[var(--line-height)]')
        expect(gen.toCSS()).toContain('line-height: var(--line-height);')
      })
    })

    describe('Hyphens', () => {
      it('should handle hyphens-none', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('hyphens-none')
        expect(gen.toCSS()).toContain('hyphens: none;')
      })

      it('should handle hyphens-manual', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('hyphens-manual')
        expect(gen.toCSS()).toContain('hyphens: manual;')
      })

      it('should handle hyphens-auto', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('hyphens-auto')
        expect(gen.toCSS()).toContain('hyphens: auto;')
      })
    })

    describe('Text wrap', () => {
      it('should handle text-wrap', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('text-wrap')
        expect(gen.toCSS()).toContain('text-wrap: wrap;')
      })

      it('should handle text-nowrap', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('text-nowrap')
        expect(gen.toCSS()).toContain('text-wrap: nowrap;')
      })

      it('should handle text-balance', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('text-balance')
        expect(gen.toCSS()).toContain('text-wrap: balance;')
      })

      it('should handle text-pretty', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('text-pretty')
        expect(gen.toCSS()).toContain('text-wrap: pretty;')
      })
    })

    describe('Content utilities', () => {
      it('should handle content with arbitrary value', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('content-["Hello"]')
        expect(gen.toCSS()).toContain('content: "Hello";')
      })

      it('should handle content-none', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('content-none')
        expect(gen.toCSS()).toContain('content: none;')
      })
    })

    describe('Edge cases', () => {
      it('should handle very large font sizes', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('text-[500px]')
        const css = gen.toCSS()
        expect(css).toContain('500px')
      })

      it('should handle very small font sizes', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('text-[1px]')
        const css = gen.toCSS()
        expect(css).toContain('1px')
      })

      it('should handle line-clamp with large numbers', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('line-clamp-999')
        const css = gen.toCSS()
        expect(css).toContain('-webkit-line-clamp')
      })

      it('should handle font family with spaces', () => {
        const gen = new CSSGenerator(defaultConfig)
        gen.generate('font-[\'Comic_Sans_MS\']')
        const css = gen.toCSS()
        expect(css.length).toBeGreaterThan(0)
      })
    })
  })
})
