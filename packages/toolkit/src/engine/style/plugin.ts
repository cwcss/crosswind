import type { BunPlugin } from 'bun'
import { extname } from 'node:path'
import { importStyleModule } from './evaluate'
import { renderStyles } from './registry'

export interface StylePluginOptions {
  /**
   * Which modules may declare styles.
   * @default /\.[cm]?[jt]sx?$/
   */
  include?: RegExp
  /**
   * Module specifiers that expose the style API. A file is only evaluated if
   * it imports from one of these.
   *
   * Override it when the API reaches your components through a module of your
   * own — re-exporting `css` from `~/styles` is a common enough pattern that
   * the default would miss every style in the codebase.
   *
   * @default ['ts-css']
   */
  styleModules?: string[]
  /**
   * Where to write the collected stylesheet. Omit to handle the CSS yourself
   * via `onCSS`.
   */
  output?: string
  /** @default false */
  minify?: boolean
  /** Called whenever the collected stylesheet changes. */
  onCSS?: (css: string) => void | Promise<void>
}

/** Only `.ts`/`.tsx`/`.js`/… get considered; `.css` and assets never do. */
const DEFAULT_INCLUDE = /\.[cm]?[jt]sx?$/

/** Evaluating a module has side effects, so both pre-filters must pass. */
const CALLS_STYLE_API = /\b(?:create|defineVars|keyframes|createTheme)\s*\(/

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Matches `from 'spec'`, `from 'spec/sub'` and the `require()` equivalents. */
function importPattern(specifiers: string[]): RegExp {
  const alternatives = specifiers.map(escapeRegExp).join('|')
  return new RegExp(`(?:from|require\\(\\s*)\\s*['"](?:${alternatives})(?:/[^'"]*)?['"]`)
}

const LOADERS: Record<string, 'ts' | 'tsx' | 'js' | 'jsx'> = {
  '.ts': 'ts',
  '.mts': 'ts',
  '.cts': 'ts',
  '.tsx': 'tsx',
  '.js': 'js',
  '.mjs': 'js',
  '.cjs': 'js',
  '.jsx': 'jsx',
}

/**
 * Bun plugin that collects `css.create()` styles during a build.
 *
 * Style modules register their rules when they evaluate, so the plugin
 * imports each matching module as the bundler loads it and writes the
 * accumulated stylesheet out. Sources pass through untouched — the class
 * names are already plain strings by the time the bundler sees them.
 *
 * @example
 * ```ts
 * await Bun.build({
 *   entrypoints: ['./src/index.tsx'],
 *   outdir: './dist',
 *   plugins: [stylePlugin({ output: './dist/styles.css', minify: true })],
 * })
 * ```
 */
export function stylePlugin(options: StylePluginOptions = {}): BunPlugin {
  const include = options.include ?? DEFAULT_INCLUDE
  const minify = options.minify ?? false
  const importsStyleAPI = importPattern(options.styleModules ?? ['ts-css'])
  let lastCSS: string | null = null

  return {
    name: 'bun-plugin-ts-css-styles',
    setup(build) {
      build.onLoad({ filter: include }, async ({ path }) => {
        const contents = await Bun.file(path).text()

        if (!importsStyleAPI.test(contents) || !CALLS_STYLE_API.test(contents))
          return undefined

        await importStyleModule(path)

        // The bundler awaits every onLoad, so writing on change means the file
        // on disk is complete by the time the build resolves — without needing
        // an end-of-build hook Bun doesn't expose.
        const css = renderStyles(minify)
        if (css !== lastCSS) {
          lastCSS = css
          if (options.output)
            await Bun.write(options.output, css)
          await options.onCSS?.(css)
        }

        return { contents, loader: LOADERS[extname(path)] ?? 'ts' }
      })
    },
  }
}

export default stylePlugin
