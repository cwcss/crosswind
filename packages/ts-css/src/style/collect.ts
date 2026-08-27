import { resolve } from 'node:path'
import { Glob } from 'bun'
import { importStyleModule } from './evaluate'
import { renderStyles } from './registry'

export interface CollectResult {
  /** The rendered stylesheet for every style the modules declared. */
  css: string
  /** Absolute paths of the modules that were evaluated. */
  modules: string[]
  /** Patterns that matched no files — almost always a config typo. */
  unmatchedPatterns: string[]
}

/**
 * Collects the CSS declared by `css.create()` and friends.
 *
 * Styles register themselves as a side effect of module evaluation, so
 * collecting them is just importing the modules that declare them. That is
 * deliberately not an AST pass: a static extractor has to re-implement
 * JavaScript to understand `padding: spacing.lg * 2`, and it silently drops
 * whatever it fails to parse. Importing the module cannot disagree with the
 * class names the app renders, because it is the same code computing them.
 *
 * @example
 * ```ts
 * const { css } = await collectStyles(['./src/**\/*.styles.ts'])
 * await Bun.write('./dist/styles.css', css)
 * ```
 */
export async function collectStyles(
  patterns: string[],
  options: { minify?: boolean, cwd?: string } = {},
): Promise<CollectResult> {
  const cwd = options.cwd ?? process.cwd()
  const seen = new Set<string>()
  const matched: boolean[] = Array.from({ length: patterns.length }, () => false)

  await Promise.all(patterns.map(async (pattern, index) => {
    try {
      const glob = new Glob(pattern)
      for await (const file of glob.scan(cwd)) {
        matched[index] = true
        seen.add(resolve(cwd, file))
      }
    }
    catch {
      // A pattern rooted at a missing directory throws ENOENT. That's a config
      // typo, not a reason to fail the build — it comes back as unmatched.
    }
  }))

  // Sorted so module evaluation order — and therefore the order equal-priority
  // rules land in the stylesheet — doesn't depend on filesystem iteration.
  const modules = [...seen].sort()

  for (const module of modules)
    await importStyleModule(module)

  return {
    css: renderStyles(options.minify ?? false),
    modules,
    unmatchedPatterns: patterns.filter((_, index) => !matched[index]),
  }
}
