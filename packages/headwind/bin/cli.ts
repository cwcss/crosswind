#!/usr/bin/env bun
import type { HeadwindConfig } from '../src/types'
import { existsSync, watch } from 'node:fs'
import { unlink } from 'node:fs/promises'
import process from 'node:process'
import { CAC } from 'cac'
import { version } from '../package.json'
import { build, buildAndWrite } from '../src/build'
import { config } from '../src/config'
import { tailwindPreflight } from '../src/preflight'

const cli = new CAC('headwind')

interface GlobalOptions {
  verbose?: boolean
  config?: string
}

interface BuildOptions extends GlobalOptions {
  output?: string
  minify?: boolean
  watch?: boolean
  content?: string
  noPreflight?: boolean
}

interface InitOptions {
  force?: boolean
}

interface AnalyzeOptions extends GlobalOptions {
  json?: boolean
  top?: number
}

/**
 * Load custom config if specified
 */
async function loadCustomConfig(configPath?: string): Promise<HeadwindConfig> {
  if (configPath) {
    if (!existsSync(configPath)) {
      console.error(`❌ Config file not found: ${configPath}`)
      process.exit(1)
    }
    try {
      const customConfig = await import(configPath)
      return { ...config, ...(customConfig.default || customConfig) }
    }
    catch (error) {
      console.error(`❌ Failed to load config file: ${configPath}`)
      console.error(error)
      process.exit(1)
    }
  }
  return config
}

/**
 * Merge CLI options with config
 */
function mergeConfig(baseConfig: HeadwindConfig, options: BuildOptions): HeadwindConfig {
  return {
    ...baseConfig,
    output: options.output || baseConfig.output,
    minify: options.minify ?? baseConfig.minify,
    content: options.content ? [options.content] : baseConfig.content,
    verbose: options.verbose ?? baseConfig.verbose,
  }
}

/**
 * Run the build process
 */
async function runBuild(buildConfig: HeadwindConfig, options: BuildOptions): Promise<void> {
  try {
    const startMsg = options.verbose ? '🚀 Building CSS (verbose mode)...' : '🚀 Building CSS...'
    console.log(startMsg)

    if (options.verbose) {
      console.log(`📂 Content patterns: ${buildConfig.content.join(', ')}`)
      console.log(`📝 Output: ${buildConfig.output}`)
      console.log(`🗜️  Minify: ${buildConfig.minify ? 'Yes' : 'No'}`)
    }

    const result = await buildAndWrite(buildConfig)

    console.log(`✅ Built ${result.classes.size} classes in ${result.duration.toFixed(2)}ms`)
    console.log(`📝 Output: ${buildConfig.output}`)

    // Show compile class stats if enabled
    if (result.compiledClasses && result.compiledClasses.size > 0) {
      console.log(`🔨 Compiled ${result.compiledClasses.size} class groups`)
      if (result.transformedFiles) {
        console.log(`📝 Transformed ${result.transformedFiles.size} files`)
      }

      if (options.verbose) {
        console.log(`\n📦 Compiled classes:`)
        for (const [, { className, utilities }] of result.compiledClasses) {
          console.log(`  ${className} ← ${utilities.join(' ')}`)
        }
      }
    }

    if (options.verbose && result.classes.size > 0) {
      const classesArray = Array.from(result.classes).sort()
      console.log(`\n📋 Classes found (${result.classes.size}):`)
      classesArray.forEach(cls => console.log(`  - ${cls}`))
    }

    // Show size info
    if (existsSync(buildConfig.output)) {
      const file = Bun.file(buildConfig.output)
      const sizeKB = (file.size / 1024).toFixed(2)
      console.log(`📦 File size: ${sizeKB} KB`)
    }
  }
  catch (error) {
    console.error('❌ Build failed:', error)
    if (options.verbose && error instanceof Error) {
      console.error(error.stack)
    }
    process.exit(1)
  }
}

/**
 * Setup file watching
 */
function setupWatch(buildConfig: HeadwindConfig, options: BuildOptions): void {
  console.log('👀 Watching for changes...')

  // Watch content directories
  const watchDirs = new Set<string>()
  for (const pattern of buildConfig.content) {
    const dir = pattern.split('**')[0] || '.'
    watchDirs.add(dir)
  }

  for (const dir of watchDirs) {
    watch(dir, { recursive: true }, async (eventType, filename) => {
      if (filename && /\.(?:html|js|ts|jsx|tsx|stx)$/.test(filename)) {
        console.log(`\n📝 ${filename} changed, rebuilding...`)
        await runBuild(buildConfig, options)
      }
    })
  }

  console.log(`\n👀 Watching: ${Array.from(watchDirs).join(', ')}`)
}

// Build command
cli
  .command('build', 'Build CSS from content files')
  .option('--output <path>', 'Output CSS file path')
  .option('--minify', 'Minify CSS output')
  .option('--watch', 'Watch for file changes')
  .option('--content <pattern>', 'Content file pattern (can override config)')
  .option('--config <path>', 'Path to config file')
  .option('--verbose', 'Show detailed output')
  .option('--no-preflight', 'Skip preflight CSS')
  .example('headwind build')
  .example('headwind build --output ./dist/styles.css')
  .example('headwind build --minify --watch')
  .example('headwind build --verbose')
  .example('headwind build --config ./custom.config.ts')
  .action(async (options: BuildOptions) => {
    const baseConfig = await loadCustomConfig(options.config)
    const buildConfig = mergeConfig(baseConfig, options)

    await runBuild(buildConfig, options)

    if (options.watch) {
      setupWatch(buildConfig, options)
    }
  })

// Watch command (alias for build --watch)
cli
  .command('watch', 'Build and watch for changes')
  .option('--output <path>', 'Output CSS file path')
  .option('--minify', 'Minify CSS output')
  .option('--content <pattern>', 'Content file pattern')
  .option('--config <path>', 'Path to config file')
  .option('--verbose', 'Show detailed output')
  .example('headwind watch')
  .example('headwind watch --output ./dist/styles.css')
  .example('headwind watch --verbose')
  .action(async (options: BuildOptions) => {
    const baseConfig = await loadCustomConfig(options.config)
    const buildConfig = mergeConfig(baseConfig, options)

    await runBuild(buildConfig, options)
    setupWatch(buildConfig, options)
  })

// Init command - Create a config file
cli
  .command('init', 'Create a headwind.config.ts file')
  .option('--force', 'Overwrite existing config file')
  .example('headwind init')
  .example('headwind init --force')
  .action(async (options: InitOptions) => {
    const configPath = './headwind.config.ts'

    if (existsSync(configPath) && !options.force) {
      console.error('❌ Config file already exists. Use --force to overwrite.')
      process.exit(1)
    }

    const defaultConfig = `import type { HeadwindConfig } from 'headwind'

const config = {
  content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
  output: './dist/headwind.css',
  minify: false,
  watch: false,
} satisfies Partial<HeadwindConfig>

export default config
`

    try {
      await Bun.write(configPath, defaultConfig)
      console.log('✅ Created headwind.config.ts')
      console.log('\nNext steps:')
      console.log('  1. Update the content paths in headwind.config.ts')
      console.log('  2. Run: headwind build')
    }
    catch (error) {
      console.error('❌ Failed to create config file:', error)
      process.exit(1)
    }
  })

// Analyze command - Show statistics
cli
  .command('analyze', 'Analyze utility class usage')
  .option('--config <path>', 'Path to config file')
  .option('--verbose', 'Show detailed output')
  .option('--json', 'Output as JSON')
  .option('--top <n>', 'Show top N most used classes', { default: 10 })
  .example('headwind analyze')
  .example('headwind analyze --top 20')
  .example('headwind analyze --json')
  .action(async (options: AnalyzeOptions) => {
    try {
      const baseConfig = await loadCustomConfig(options.config)

      if (!options.json) {
        console.log('🔍 Analyzing utility classes...\n')
      }

      const result = await build(baseConfig)

      // Group classes by utility type
      const utilityGroups = new Map<string, string[]>()
      for (const cls of result.classes) {
        const utility = cls.split('-')[0].split(':').pop() || 'other'
        if (!utilityGroups.has(utility)) {
          utilityGroups.set(utility, [])
        }
        utilityGroups.get(utility)!.push(cls)
      }

      const stats = {
        totalClasses: result.classes.size,
        buildTime: result.duration,
        outputSize: existsSync(baseConfig.output) ? Bun.file(baseConfig.output).size : 0,
        utilityGroups: Object.fromEntries(
          Array.from(utilityGroups.entries())
            .map(([key, value]) => [key, value.length] as [string, number])
            .sort((a, b) => (b[1] as number) - (a[1] as number)),
        ),
        topClasses: Array.from(result.classes).slice(0, options.top || 10),
      }

      if (options.json) {
        console.log(JSON.stringify(stats, null, 2))
      }
      else {
        console.log(`📊 Total classes: ${stats.totalClasses}`)
        console.log(`⏱️  Build time: ${stats.buildTime.toFixed(2)}ms`)
        console.log(`📦 Output size: ${(stats.outputSize / 1024).toFixed(2)} KB\n`)

        console.log(`🏷️  Utility groups (top ${options.top}):`)
        const topGroups = Object.entries(stats.utilityGroups).slice(0, options.top || 10)
        for (const [utility, count] of topGroups) {
          console.log(`  ${utility.padEnd(20)} ${count} classes`)
        }

        if (options.verbose) {
          console.log(`\n📋 All classes:`)
          for (const cls of Array.from(result.classes).sort()) {
            console.log(`  - ${cls}`)
          }
        }
      }
    }
    catch (error) {
      console.error('❌ Analysis failed:', error)
      process.exit(1)
    }
  })

// Clean command - Remove output file
cli
  .command('clean', 'Remove the output CSS file')
  .option('--config <path>', 'Path to config file')
  .example('headwind clean')
  .action(async (options: GlobalOptions) => {
    try {
      const baseConfig = await loadCustomConfig(options.config)

      if (!existsSync(baseConfig.output)) {
        console.log('ℹ️  Output file does not exist')
        return
      }

      await unlink(baseConfig.output)
      console.log(`✅ Removed ${baseConfig.output}`)
    }
    catch (error) {
      console.error('❌ Failed to remove output file:', error)
      process.exit(1)
    }
  })

// Preflight command - Generate just the preflight CSS
cli
  .command('preflight', 'Generate preflight CSS only')
  .option('--output <path>', 'Output CSS file path', { default: './preflight.css' })
  .example('headwind preflight')
  .example('headwind preflight --output ./reset.css')
  .action(async (options: { output?: string }) => {
    try {
      const outputPath = options.output || './preflight.css'
      const preflightCSS = tailwindPreflight.getCSS()

      await Bun.write(outputPath, preflightCSS)
      console.log(`✅ Generated preflight CSS`)
      console.log(`📝 Output: ${outputPath}`)

      const file = Bun.file(outputPath)
      const sizeKB = (file.size / 1024).toFixed(2)
      console.log(`📦 File size: ${sizeKB} KB`)
    }
    catch (error) {
      console.error('❌ Failed to generate preflight CSS:', error)
      process.exit(1)
    }
  })

// Version command
cli
  .command('version', 'Show the version of Headwind')
  .action(() => {
    console.log(version)
  })

cli.version(version)
cli.help()

// Parse arguments
cli.parse()
