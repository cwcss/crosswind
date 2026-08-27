import { statSync } from 'node:fs'
import { styleGeneration } from './registry'

/**
 * Imports a module for its style side effects, defeating the module cache
 * when — and only when — the result would otherwise be wrong.
 *
 * Styles register themselves while their module evaluates, and a module
 * evaluates once per specifier. Two things therefore have to reach the
 * specifier: the file's mtime, so an edit re-registers the module's rules
 * during a watch rebuild; and the registry generation, so a reset re-runs
 * every module instead of leaving the registry permanently empty.
 */
export async function importStyleModule(path: string): Promise<void> {
  try {
    await import(`${path}?mtime=${mtimeOf(path)}&gen=${styleGeneration()}`)
  }
  catch (error) {
    throw new Error(`Failed to evaluate style module ${path}: ${(error as Error).message}`, {
      cause: error,
    })
  }
}

function mtimeOf(path: string): number {
  try {
    return statSync(path).mtimeMs
  }
  catch {
    return 0
  }
}
