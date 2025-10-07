import type { HeadwindConfig } from './types'
import { CSSGenerator } from './generator'
import { Scanner } from './scanner'
import { CompileClassTransformer } from './transformer-compile-class'

export interface BuildResult {
  css: string
  classes: Set<string>
  duration: number
  compiledClasses?: Map<string, { className: string, utilities: string[] }>
  transformedFiles?: Map<string, string>
}

/**
 * Build CSS from content patterns
 */
export async function build(config: HeadwindConfig): Promise<BuildResult> {
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
  const scanner = new Scanner(config.content, transformer)
  const { classes, transformedFiles } = await scanner.scan()

  // Add safelist classes
  for (const cls of config.safelist) {
    classes.add(cls)
  }

  // If using compile class transformer, also add compiled utilities
  if (transformer) {
    const compiledClasses = transformer.getCompiledClasses()
    for (const [, { utilities }] of compiledClasses) {
      for (const utility of utilities) {
        classes.add(utility)
      }
    }
  }

  // Generate CSS
  const generator = new CSSGenerator(config)

  for (const className of classes) {
    generator.generate(className)
  }

  // Preflight CSS is now added by generator.toCSS()
  const css = generator.toCSS(true, config.minify)
  const duration = performance.now() - startTime

  return {
    css,
    classes,
    duration,
    compiledClasses: transformer?.getCompiledClasses(),
    transformedFiles,
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
export async function buildAndWrite(config: HeadwindConfig): Promise<BuildResult> {
  const result = await build(config)
  await writeCSS(result.css, config.output)

  // Write transformed files if compile class is enabled
  if (result.transformedFiles && result.transformedFiles.size > 0) {
    await writeTransformedFiles(result.transformedFiles)
  }

  return result
}
