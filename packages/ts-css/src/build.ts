import type { TsCssConfig } from './types'
import { CSSGenerator } from './generator'
import { Scanner } from './scanner'
import { CompileClassTransformer } from './transformer-compile-class'

export interface BuildResult {
  css: string
  classes: Set<string>
  duration: number
  compiledClasses?: Map<string, { className: string, utilities: string[] }>
  transformedFiles?: Map<string, string>
  /** Content patterns that matched no files (likely config typos). */
  unmatchedPatterns?: string[]
}

/**
 * Build CSS from content patterns
*/
export async function build(config: TsCssConfig): Promise<BuildResult> {
  const startTime = performance.now()

  // Initialize compile class transformer if enabled
  const transformer = config.compileClass?.enabled
    ? new CompileClassTransformer({
      trigger: config.compileClass.trigger,
      classPrefix: config.compileClass.classPrefix,
      layer: config.compileClass.layer,
    })
    : null

  // Scan files for utility classes
  const scanner = new Scanner(config.content, transformer, {
    attributify: config.attributify,
    bracketSyntax: config.bracketSyntax,
    codeStrings: config.codeStrings,
  })
  const { classes, transformedFiles, unmatchedPatterns } = await scanner.scan()

  // Add safelist classes. Only strings are supported — a Tailwind-style
  // { pattern: /.../ } entry previously reached parseClass and crashed the
  // whole build with 'className.startsWith is not a function'.
  for (const cls of config.safelist) {
    if (typeof cls === 'string') {
      classes.add(cls)
    }
    else {
      console.warn(`⚠️  Ignoring non-string safelist entry (patterns are not supported): ${JSON.stringify(cls)}`)
    }
  }

  // Generate CSS
  const generator = new CSSGenerator(config)

  for (const className of classes) {
    generator.generate(className)
  }

  // Compiled class groups (:cw: markers) emit under their own hashed
  // selector. Previously the group's utilities were dumped into the main
  // class set instead — but the transformer had just REMOVED those class
  // names from the markup, so the rewritten `class="cw-<hash>"` matched
  // nothing and elements rendered unstyled.
  if (transformer) {
    const compiledClasses = transformer.getCompiledClasses()
    for (const [, { className, utilities }] of compiledClasses) {
      generator.generateCompiledClass(className, utilities)
    }
  }

  // Preflight CSS is now added by generator.toCSS()
  const css = generator.toCSS(config.includePreflight !== false, config.minify)
  const duration = performance.now() - startTime

  return {
    css,
    classes,
    duration,
    compiledClasses: transformer?.getCompiledClasses(),
    transformedFiles,
    unmatchedPatterns,
  }
}

/**
 * Write CSS to output file
*/
export async function writeCSS(css: string, outputPath: string): Promise<void> {
  await Bun.write(outputPath, css)
}

/**
 * Write transformed files to disk
*/
export async function writeTransformedFiles(transformedFiles: Map<string, string>): Promise<void> {
  const writes = Array.from(transformedFiles.entries()).map(([path, content]) =>
    Bun.write(path, content),
  )
  await Promise.all(writes)
}

/**
 * Build and write CSS to output file
*/
export async function buildAndWrite(config: TsCssConfig): Promise<BuildResult> {
  const result = await build(config)
  await writeCSS(result.css, config.output)

  // Write transformed files if compile class is enabled
  if (result.transformedFiles && result.transformedFiles.size > 0) {
    await writeTransformedFiles(result.transformedFiles)
  }

  return result
}
