import type { CompileClassTransformer } from './transformer-compile-class'
import type { ExtractClassesOptions } from './parser'
import { Glob } from 'bun'
import { extractClasses } from './parser'

export interface ScanResult {
  classes: Set<string>
  transformedFiles: Map<string, string>
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

    // Use Promise.all to scan all patterns concurrently for better performance
    await Promise.all(
      this.patterns.map(async (pattern) => {
        const glob = new Glob(pattern)

        // Bun's glob.scan() returns an async iterable
        for await (const file of glob.scan('.')) {
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

            const classes = extractClasses(content, this.extractOptions)

            for (const cls of classes) {
              allClasses.add(cls)
            }
          }
          catch {
            // Silently skip files that can't be read
            // (e.g., binary files, permission issues)
            continue
          }
        }
      }),
    )

    return { classes: allClasses, transformedFiles }
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
