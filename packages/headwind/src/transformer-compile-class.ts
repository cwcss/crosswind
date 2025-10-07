import type { HeadwindConfig } from './types'

export interface CompileClassOptions {
  /**
   * Trigger string to mark classes for compilation
   * @default ':hw:'
   */
  trigger?: string
  /**
   * Prefix for generated class names
   * @default 'hw-'
   */
  classPrefix?: string
  /**
   * Hash function to generate class names
   */
  hashFn?: (content: string) => string
  /**
   * Layer name for compiled classes
   * @default 'shortcuts'
   */
  layer?: string
}

/**
 * Simple hash function for generating class names
 */
function simpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36)
}

/**
 * Extract compile class markers from content
 */
export function extractCompileClasses(
  content: string,
  options: CompileClassOptions = {},
): Map<string, string[]> {
  const trigger = options.trigger || ':hw:'
  const compiledClasses = new Map<string, string[]>()

  // Match class attributes with the trigger
  // Supports: class=":uno: ..." and className=":uno: ..."
  const classRegex = /(?:class|className)=["']([^"']*)["']/g
  let match: RegExpExecArray | null

  while ((match = classRegex.exec(content)) !== null) {
    const fullClass = match[1]

    // Check if it starts with the trigger
    if (fullClass.trim().startsWith(trigger)) {
      // Remove the trigger and get the classes
      const classes = fullClass
        .replace(trigger, '')
        .trim()
        .split(/\s+/)
        .filter(Boolean)

      if (classes.length > 0) {
        // Generate a unique identifier for this group of classes
        const classKey = classes.sort().join(' ')
        if (!compiledClasses.has(classKey)) {
          compiledClasses.set(classKey, classes)
        }
      }
    }
  }

  return compiledClasses
}

/**
 * Transform content by replacing compile markers with generated class names
 */
export function transformContent(
  content: string,
  compiledClassMap: Map<string, string>,
  options: CompileClassOptions = {},
): string {
  const trigger = options.trigger || ':hw:'
  let transformed = content

  const classRegex = /(?:class|className)=["']([^"']*)["']/g
  let match: RegExpExecArray | null

  // We need to replace in reverse order to maintain string positions
  const replacements: Array<{ start: number, end: number, replacement: string }> = []

  while ((match = classRegex.exec(content)) !== null) {
    const fullClass = match[1]

    if (fullClass.trim().startsWith(trigger)) {
      const classes = fullClass
        .replace(trigger, '')
        .trim()
        .split(/\s+/)
        .filter(Boolean)

      const classKey = classes.sort().join(' ')
      const generatedClass = compiledClassMap.get(classKey)

      if (generatedClass) {
        const attrName = match[0].startsWith('class=') ? 'class' : 'className'
        const quote = match[0].includes('"') ? '"' : '\''
        const replacement = `${attrName}=${quote}${generatedClass}${quote}`

        replacements.push({
          start: match.index,
          end: match.index + match[0].length,
          replacement,
        })
      }
    }
  }

  // Apply replacements in reverse order
  for (let i = replacements.length - 1; i >= 0; i--) {
    const { start, end, replacement } = replacements[i]
    transformed = transformed.substring(0, start) + replacement + transformed.substring(end)
  }

  return transformed
}

/**
 * Generate class names for compiled classes
 */
export function generateCompiledClassNames(
  compiledClasses: Map<string, string[]>,
  options: CompileClassOptions = {},
): Map<string, string> {
  const classPrefix = options.classPrefix || 'hw-'
  const hashFn = options.hashFn || simpleHash

  const classMap = new Map<string, string>()

  for (const [classKey] of compiledClasses) {
    const hash = hashFn(classKey)
    const generatedClassName = `${classPrefix}${hash}`
    classMap.set(classKey, generatedClassName)
  }

  return classMap
}

/**
 * Main transformer class
 */
export class CompileClassTransformer {
  private compiledClasses = new Map<string, string[]>()
  private classNameMap = new Map<string, string>()
  private options: CompileClassOptions

  constructor(options: CompileClassOptions = {}) {
    this.options = {
      trigger: ':hw:',
      classPrefix: 'hw-',
      layer: 'shortcuts',
      ...options,
    }
  }

  /**
   * Process a file and extract compile classes
   */
  processFile(content: string): { content: string, hasChanges: boolean } {
    const extracted = extractCompileClasses(content, this.options)

    if (extracted.size === 0) {
      return { content, hasChanges: false }
    }

    // Merge with existing compiled classes
    let hasNewClasses = false
    for (const [key, classes] of extracted) {
      if (!this.compiledClasses.has(key)) {
        this.compiledClasses.set(key, classes)
        hasNewClasses = true
      }
    }

    // Generate class names if we have new classes
    if (hasNewClasses || this.classNameMap.size !== this.compiledClasses.size) {
      this.classNameMap = generateCompiledClassNames(this.compiledClasses, this.options)
    }

    // Transform the content
    const transformed = transformContent(content, this.classNameMap, this.options)

    return {
      content: transformed,
      hasChanges: transformed !== content,
    }
  }

  /**
   * Get all compiled classes and their generated names
   */
  getCompiledClasses(): Map<string, { className: string, utilities: string[] }> {
    const result = new Map<string, { className: string, utilities: string[] }>()

    for (const [key, utilities] of this.compiledClasses) {
      const className = this.classNameMap.get(key)
      if (className) {
        result.set(key, { className, utilities })
      }
    }

    return result
  }

  /**
   * Generate CSS for compiled classes
   */
  generateCSS(config: HeadwindConfig, generator: any): string {
    const compiledClasses = this.getCompiledClasses()
    let css = ''

    for (const [, { className, utilities }] of compiledClasses) {
      // Generate CSS for each utility in the group
      for (const utility of utilities) {
        generator.generate(utility)
      }

      // Get the generated CSS and wrap it with the compiled class name
      const _generatedCSS = generator.toCSS(false)

      // We need to extract just the CSS for these utilities
      // This is a simplified approach - in production you'd want to track
      // which rules were generated for which utilities
      css += `\n/* Compiled class: ${className} */\n`
      css += `/* Original utilities: ${utilities.join(' ')} */\n`
    }

    return css
  }

  /**
   * Reset the transformer state
   */
  reset(): void {
    this.compiledClasses.clear()
    this.classNameMap.clear()
  }

  /**
   * Get statistics about compiled classes
   */
  getStats(): {
    totalGroups: number
    totalUtilities: number
    averageUtilitiesPerGroup: number
  } {
    let totalUtilities = 0
    for (const [, utilities] of this.compiledClasses) {
      totalUtilities += utilities.length
    }

    return {
      totalGroups: this.compiledClasses.size,
      totalUtilities,
      averageUtilitiesPerGroup: this.compiledClasses.size > 0
        ? totalUtilities / this.compiledClasses.size
        : 0,
    }
  }
}
