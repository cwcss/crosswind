import { rm } from 'node:fs/promises'
import { dts } from 'bun-plugin-dtsx'

// Wipe dist first so renamed/removed source files don't leave stale output
// behind (this bit us in 0.2.0/0.2.1 — a stray top-level dist/index.js from
// an older layout masked the fact that the current build was emitting the
// real index.js under dist/src/).
await rm('./dist', { recursive: true, force: true })

// Two passes with `root` set to the entrypoint's directory so output lands
// directly under dist/ instead of dist/src/ or dist/bin/. The package.json
// `exports` field declares ./dist/index.js and `bin` declares ./dist/cli.js;
// without `root` Bun preserves the entrypoint's relative path and produces
// dist/src/index.js + dist/bin/cli.js, breaking both consumers and the CLI.
await Bun.build({
  entrypoints: ['src/index.ts', 'bin/cli.ts'],
  outdir: './dist',
  splitting: true,
  minify: true,
  target: 'bun',
  plugins: [dts()],
})
