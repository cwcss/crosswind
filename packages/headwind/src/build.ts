import type { HeadwindConfig } from './types'
import { CSSGenerator } from './generator'
import { Scanner } from './scanner'

export interface BuildResult {
  css: string
  classes: Set<string>
  duration: number
}

/**
 * Build CSS from content patterns
 */
export async function build(config: HeadwindConfig): Promise<BuildResult> {
  const startTime = performance.now()

  // Scan files for utility classes
  const scanner = new Scanner(config.content)
  const classes = await scanner.scan()

  // Add safelist classes
  for (const cls of config.safelist) {
    classes.add(cls)
  }

  // Generate CSS
  const generator = new CSSGenerator(config)

  for (const className of classes) {
    generator.generate(className)
  }

  // Preflight CSS is now added by generator.toCSS()
  const css = generator.toCSS(config.minify)
  const duration = performance.now() - startTime

  return {
    css,
    classes,
    duration,
  }
}

/**
 * Write CSS to output file
 */
export async function writeCSS(css: string, outputPath: string): Promise<void> {
  await Bun.write(outputPath, css)
}

/**
 * Build and write CSS to output file
 */
export async function buildAndWrite(config: HeadwindConfig): Promise<BuildResult> {
  const result = await build(config)
  await writeCSS(result.css, config.output)
  return result
}
