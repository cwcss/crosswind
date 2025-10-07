import type { BunPlugin } from 'bun'
import type { HeadwindConfig, HeadwindOptions } from './types'
import { loadConfig } from 'bunfig'
import { defaultConfig } from './config'
import { CSSGenerator } from './generator'
import { extractClasses } from './parser'

export interface HeadwindPluginOptions {
  /**
   * Custom config to override default config
   */
  config?: HeadwindOptions
  /**
   * Include preflight CSS
   * @default true
   */
  includePreflight?: boolean
}

/**
 * Headwind Bun plugin for processing HTML files
 *
 * @example
 * ```typescript
 * import { plugin } from '@stacksjs/headwind'
 *
 * await Bun.build({
 *   entrypoints: ['./src/index.ts'],
 *   outdir: './dist',
 *   plugins: [plugin()],
 * })
 * ```
 */
export function plugin(options: HeadwindPluginOptions = {}): BunPlugin {
  return {
    name: 'bun-plugin-headwind',
    async setup(build) {
    // Load configuration from headwind.config.ts or use defaults
      const loadedConfig = await loadConfig<HeadwindConfig>({
        name: 'headwind',
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
      } as HeadwindConfig

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
