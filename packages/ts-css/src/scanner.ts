import type { CompileClassTransformer } from './transformer-compile-class'
import type { ExtractClassesOptions } from './parser'
import { Glob } from 'bun'
import { extractClasses } from './parser'

/**
 * How many files to read at once. High enough to keep the disk busy, low
 * enough to stay well clear of the default file-descriptor limit.
 */
const MAX_OPEN_FILES = 32

export interface ScanResult {
  classes: Set<string>
  transformedFiles: Map<string, string>
  /** Content patterns that matched no files (likely config typos). */
  unmatchedPatterns: string[]
}

/**
 * Scans files for utility classes using Bun's fast Glob API
*/
export class Scanner {
  constructor(
    private patterns: string[],
    private transformer: CompileClassTransformer | null | undefined = undefined,
    private extractOptions: ExtractClassesOptions | undefined = undefined,
  ) {}

  /**
   * Scan all files matching the patterns and extract utility classes
  */
  async scan(): Promise<ScanResult> {
    const allClasses = new Set<string>()
    const transformedFiles = new Map<string, string>()
    // Overlapping patterns previously read and transformed the same file
    // once per pattern — wasted I/O and duplicate transformer passes.
    const seenFiles = new Set<string>()

    // Indexed rather than pushed, so the reported order follows the config
    // instead of whichever glob happened to finish first.
    const patternMatched: boolean[] = Array.from({ length: this.patterns.length }, () => false)

    // Walk every pattern concurrently, collecting paths only. Reading is a
    // separate phase so that one pattern matching thousands of files doesn't
    // serialise them all behind a single async iterator.
    const files: string[] = []
    await Promise.all(
      this.patterns.map(async (pattern, index) => {
        try {
          const glob = new Glob(pattern)
          for await (const file of glob.scan('.')) {
            patternMatched[index] = true
            if (seenFiles.has(file))
              continue
            seenFiles.add(file)
            files.push(file)
          }
        }
        catch {
          // A pattern rooted at a directory that doesn't exist makes Bun's
          // glob throw ENOENT. That's a config typo, not a reason to abort the
          // build — it comes back as an unmatched pattern like any other.
        }
      }),
    )

    // Read with a bounded worker pool: unbounded Promise.all over a large repo
    // opens every file at once and hits the process file-descriptor limit,
    // while reading one at a time leaves the disk idle between awaits.
    const concurrency = Math.min(files.length, MAX_OPEN_FILES)
    let next = 0
    const worker = async (): Promise<void> => {
      while (next < files.length) {
        const file = files[next++]
        try {
          let content = await Bun.file(file).text()

          // Apply transformer if enabled
          if (this.transformer) {
            const result = this.transformer.processFile(content)
            if (result.hasChanges) {
              transformedFiles.set(file, result.content)
              content = result.content
            }
          }

          for (const cls of extractClasses(content, this.extractOptions)) {
            allClasses.add(cls)
          }
        }
        catch {
          // Skip unreadable files (permission/FS errors). Note: binary
          // content does NOT throw — text() decodes it — so extension
          // globs should target source files only.
        }
      }
    }
    await Promise.all(Array.from({ length: concurrency }, worker))

    const unmatchedPatterns = this.patterns.filter((_, index) => !patternMatched[index])

    return { classes: allClasses, transformedFiles, unmatchedPatterns }
  }

  /**
   * Scan a single file for utility classes
  */
  async scanFile(filePath: string): Promise<Set<string>> {
    try {
      const content = await Bun.file(filePath).text()
      return extractClasses(content, this.extractOptions)
    }
    catch {
      return new Set<string>()
    }
  }

  /**
   * Scan content string for utility classes
  */
  scanContent(content: string): Set<string> {
    return extractClasses(content, this.extractOptions)
  }
}
