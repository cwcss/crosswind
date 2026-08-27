import { describe, expect, it } from 'bun:test'
import {
  CompileClassTransformer,
  extractCompileClasses,
  generateCompiledClassNames,
  transformContent,
} from '../src/transformer-compile-class'

describe('Compile Class Transformer', () => {
  describe('extractCompileClasses', () => {
    it('should extract classes with default trigger', () => {
      const content = '<div class=":cw: text-center sm:text-left">Content</div>'
      const result = extractCompileClasses(content)

      expect(result.size).toBe(1)
      const classes = Array.from(result.values())[0]
      expect(classes.sort()).toEqual(['sm:text-left', 'text-center'])
    })

    it('should extract classes with custom trigger', () => {
      const content = '<div class=":cw: p-4 m-2">Content</div>'
      const result = extractCompileClasses(content, { trigger: ':cw:' })

      expect(result.size).toBe(1)
      const classes = Array.from(result.values())[0]
      expect(classes.sort()).toEqual(['m-2', 'p-4'])
    })

    it('should handle multiple elements', () => {
      const content = `
        <div class=":cw: text-center sm:text-left">
          <span class=":cw: font-bold text-red-500">Text</span>
        </div>
      `
      const result = extractCompileClasses(content)

      expect(result.size).toBe(2)
    })

    it('should ignore elements without trigger', () => {
      const content = `
        <div class="regular-class another-class">
          <span class=":cw: compiled-class">Compiled</span>
        </div>
      `
      const result = extractCompileClasses(content)

      expect(result.size).toBe(1)
      const classes = Array.from(result.values())[0]
      expect(classes.sort()).toEqual(['compiled-class'])
    })

    it('should handle className attribute (React)', () => {
      const content = '<div className=":cw: flex items-center">Content</div>'
      const result = extractCompileClasses(content)

      expect(result.size).toBe(1)
      const classes = Array.from(result.values())[0]
      expect(classes.sort()).toEqual(['flex', 'items-center'])
    })

    it('should deduplicate identical class groups', () => {
      const content = `
        <div class=":cw: p-4 m-2">First</div>
        <div class=":cw: m-2 p-4">Second</div>
      `
      const result = extractCompileClasses(content)

      // Should be 1 because both have same classes (order doesn't matter after sorting)
      expect(result.size).toBe(1)
    })
  })

  describe('generateCompiledClassNames', () => {
    it('should generate unique class names', () => {
      const compiledClasses = new Map([
        ['text-center sm:text-left', ['text-center', 'sm:text-left']],
        ['p-4 m-2', ['p-4', 'm-2']],
      ])

      const result = generateCompiledClassNames(compiledClasses)

      expect(result.size).toBe(2)
      for (const className of result.values()) {
        expect(className).toMatch(/^cw-[a-z0-9]+$/)
      }
    })

    it('should use custom prefix', () => {
      const compiledClasses = new Map([
        ['text-center', ['text-center']],
      ])

      const result = generateCompiledClassNames(compiledClasses, {
        classPrefix: 'cw-',
      })

      const className = Array.from(result.values())[0]
      expect(className).toMatch(/^cw-[a-z0-9]+$/)
    })

    it('should generate same hash for same content', () => {
      const compiledClasses = new Map([
        ['text-center sm:text-left', ['text-center', 'sm:text-left']],
      ])

      const result1 = generateCompiledClassNames(compiledClasses)
      const result2 = generateCompiledClassNames(compiledClasses)

      expect(Array.from(result1.values())[0]).toBe(Array.from(result2.values())[0])
    })
  })

  describe('transformContent', () => {
    it('should replace compile markers with generated class names', () => {
      const content = '<div class=":cw: text-center sm:text-left">Content</div>'
      const classMap = new Map([
        ['sm:text-left text-center', 'cw-abc123'],
      ])

      const result = transformContent(content, classMap)

      expect(result).toBe('<div class="cw-abc123">Content</div>')
    })

    it('should handle multiple replacements', () => {
      const content = `
        <div class=":cw: p-4 m-2">First</div>
        <span class=":cw: font-bold">Second</span>
      `
      const classMap = new Map([
        ['m-2 p-4', 'cw-abc'],
        ['font-bold', 'cw-def'],
      ])

      const result = transformContent(content, classMap)

      expect(result).toContain('class="cw-abc"')
      expect(result).toContain('class="cw-def"')
      expect(result).not.toContain(':cw:')
    })

    it('should preserve non-compile classes', () => {
      const content = '<div class="regular-class another-class">Content</div>'
      const classMap = new Map()

      const result = transformContent(content, classMap)

      expect(result).toBe(content)
    })

    it('should handle className attribute', () => {
      const content = '<div className=":cw: flex items-center">Content</div>'
      const classMap = new Map([
        ['flex items-center', 'cw-xyz'],
      ])

      const result = transformContent(content, classMap)

      expect(result).toBe('<div className="cw-xyz">Content</div>')
    })
  })

  describe('CompileClassTransformer', () => {
    it('should process file and extract compile classes', () => {
      const transformer = new CompileClassTransformer()
      const content = '<div class=":cw: text-center sm:text-left">Content</div>'

      const result = transformer.processFile(content)

      expect(result.hasChanges).toBe(true)
      expect(result.content).not.toContain(':cw:')
      expect(result.content).toMatch(/class="cw-[a-z0-9]+"/)
    })

    it('should not modify content without compile markers', () => {
      const transformer = new CompileClassTransformer()
      const content = '<div class="regular-class">Content</div>'

      const result = transformer.processFile(content)

      expect(result.hasChanges).toBe(false)
      expect(result.content).toBe(content)
    })

    it('should accumulate compiled classes across multiple files', () => {
      const transformer = new CompileClassTransformer()

      transformer.processFile('<div class=":cw: p-4 m-2">File 1</div>')
      transformer.processFile('<div class=":cw: font-bold">File 2</div>')

      const compiledClasses = transformer.getCompiledClasses()
      expect(compiledClasses.size).toBe(2)
    })

    it('should deduplicate identical class groups across files', () => {
      const transformer = new CompileClassTransformer()

      transformer.processFile('<div class=":cw: p-4 m-2">File 1</div>')
      transformer.processFile('<div class=":cw: m-2 p-4">File 2</div>')

      const compiledClasses = transformer.getCompiledClasses()
      expect(compiledClasses.size).toBe(1)
    })

    it('should provide accurate statistics', () => {
      const transformer = new CompileClassTransformer()

      transformer.processFile('<div class=":cw: p-4 m-2">File 1</div>')
      transformer.processFile('<div class=":cw: font-bold text-sm">File 2</div>')

      const stats = transformer.getStats()
      expect(stats.totalGroups).toBe(2)
      expect(stats.totalUtilities).toBe(4) // p-4, m-2, font-bold, text-sm
      expect(stats.averageUtilitiesPerGroup).toBe(2)
    })

    it('should reset state correctly', () => {
      const transformer = new CompileClassTransformer()

      transformer.processFile('<div class=":cw: p-4 m-2">Content</div>')
      expect(transformer.getCompiledClasses().size).toBe(1)

      transformer.reset()
      expect(transformer.getCompiledClasses().size).toBe(0)
    })

    it('should use custom options', () => {
      const transformer = new CompileClassTransformer({
        trigger: ':cw:',
        classPrefix: 'crosswind-',
      })

      const content = '<div class=":cw: p-4 m-2">Content</div>'
      const result = transformer.processFile(content)

      expect(result.hasChanges).toBe(true)
      expect(result.content).toMatch(/class="crosswind-[a-z0-9]+"/)
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty trigger marker', () => {
      const content = '<div class=":cw: ">Content</div>'
      const result = extractCompileClasses(content)

      expect(result.size).toBe(0)
    })

    it('should handle trigger with extra spaces', () => {
      const content = '<div class=":cw:   p-4   m-2  ">Content</div>'
      const result = extractCompileClasses(content)

      expect(result.size).toBe(1)
      const classes = Array.from(result.values())[0]
      expect(classes.sort()).toEqual(['m-2', 'p-4'])
    })

    it('should handle single class', () => {
      const content = '<div class=":cw: single-class">Content</div>'
      const result = extractCompileClasses(content)

      expect(result.size).toBe(1)
      const classes = Array.from(result.values())[0]
      expect(classes.sort()).toEqual(['single-class'])
    })

    it('should handle classes with special characters', () => {
      const content = '<div class=":cw: hover:bg-blue-500 md:w-1/2">Content</div>'
      const result = extractCompileClasses(content)

      expect(result.size).toBe(1)
      const classes = Array.from(result.values())[0].sort()
      expect(classes).toContain('hover:bg-blue-500')
      expect(classes).toContain('md:w-1/2')
    })

    it('should handle single quotes', () => {
      const content = '<div class=\':cw: p-4 m-2\'>Content</div>'
      const result = extractCompileClasses(content)

      expect(result.size).toBe(1)
      const classes = Array.from(result.values())[0]
      expect(classes.sort()).toEqual(['m-2', 'p-4'])
    })
  })
})

describe('compiled classes generate real CSS (build integration)', () => {
  it('emits a rule for the hashed class with the group declarations', async () => {
    const { build } = await import('../src/build')
    const { defaultConfig } = await import('../src/config')
    const dir = `${import.meta.dir}/.compile-css-test`
    await Bun.write(`${dir}/index.html`, '<div class=":cw: flex items-center gap-2 hover:underline">hi</div>')
    try {
      const result = await build({
        ...defaultConfig,
        content: [`${dir}/*.html`],
        minify: false,
        compileClass: { enabled: true },
      } as any)
      const compiled = [...result.compiledClasses!.values()][0]
      expect(compiled.className).toMatch(/^cw-/)
      // The hashed selector carries the group's declarations
      expect(result.css).toContain(`.${compiled.className} {`)
      expect(result.css).toContain('display: flex;')
      expect(result.css).toContain('align-items: center;')
      // Variant utilities inside the group expand onto the compiled selector
      expect(result.css).toContain(`.${compiled.className}:hover`)
      // The raw utilities are NOT emitted under their own selectors — the
      // markup no longer contains them
      expect(result.css).not.toContain('.items-center {')
      // And the transformed markup references the hashed class
      const transformed = [...result.transformedFiles!.values()][0]
      expect(transformed).toContain(`class="${compiled.className}"`)
    }
    finally {
      const { rm } = await import('node:fs/promises')
      await rm(dir, { recursive: true, force: true })
    }
  })
})
