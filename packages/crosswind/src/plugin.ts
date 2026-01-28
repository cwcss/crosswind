import type { BunPlugin } from 'bun'
import type { CrosswindConfig, CrosswindOptions } from './types'
import { loadConfig } from 'bunfig'
import { defaultConfig } from './config'
import { CSSGenerator } from './generator'
import { extractClasses } from './parser'

export interface CrosswindPluginOptions {
  /**
   * Custom config to override default config
   */
  config?: CrosswindOptions
  /**
   * Include preflight CSS
   * @default true
   */
  includePreflight?: boolean
}

/**
 * Crosswind Bun plugin for processing HTML files
 *
 * @example
 * ```typescript
 * import { plugin } from '@cwcss/crosswind'
 *
 * await Bun.build({
 *   entrypoints: ['./src/index.ts'],
 *   outdir: './dist',
 *   plugins: [plugin()],
 * })
 * ```
 */
export function plugin(options: CrosswindPluginOptions = {}): BunPlugin {
  return {
    name: 'bun-plugin-crosswind',
    async setup(build) {
    // Load configuration from crosswind.config.ts or use defaults
      const loadedConfig = await loadConfig<CrosswindConfig>({
        name: 'crosswind',
        defaultConfig,
      })

      // Merge with provided options
      const config = {
        ...loadedConfig,
        ...options.config,
        theme: {
          ...loadedConfig.theme,
          ...options.config?.theme,
        },
        shortcuts: {
          ...loadedConfig.shortcuts,
          ...options.config?.shortcuts,
        },
        rules: [
          ...(loadedConfig.rules || []),
          ...(options.config?.rules || []),
        ],
        variants: {
          ...loadedConfig.variants,
          ...options.config?.variants,
        },
        safelist: [
          ...(loadedConfig.safelist || []),
          ...(options.config?.safelist || []),
        ],
        blocklist: [
          ...(loadedConfig.blocklist || []),
          ...(options.config?.blocklist || []),
        ],
        preflights: [
          ...(loadedConfig.preflights || []),
          ...(options.config?.preflights || []),
        ],
        presets: [
          ...(loadedConfig.presets || []),
          ...(options.config?.presets || []),
        ],
      } as CrosswindConfig

      const includePreflight = options.includePreflight ?? true

      // Process HTML files
      build.onLoad({ filter: /\.html?$/ }, async ({ path }) => {
        const html = await Bun.file(path).text()

        // Extract utility classes from HTML
        const classes = extractClasses(html)

        // Add safelist classes
        for (const cls of config.safelist) {
          classes.add(cls)
        }

        // Generate CSS
        const generator = new CSSGenerator(config)

        for (const className of classes) {
          generator.generate(className)
        }

        // Generate CSS output
        const css = generator.toCSS(includePreflight, config.minify)

        // Inject CSS into HTML
        const contents = html.replace('</head>', `<style>${css}</style>\n</head>`)

        return {
          contents,
          loader: 'text',
        }
      })
    },
  }
}

export default plugin
