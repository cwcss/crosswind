<p align="center"><img src=".github/art/cover.jpg" alt="Social Card of this repo"></p>

[![npm version][npm-version-src]][npm-version-href]
[![GitHub Actions][github-actions-src]][github-actions-href]
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

# ts-css

A CSS engine with two front ends and one atomic output.

Write **utility classes** when you are laying out markup, and Tailwind v4 semantics apply unchanged. Write **typed style objects** when a style has to be computed, tokenised, or merged across a component boundary, and you get StyleX's authoring model. Both compile through the same pipeline into the same deduplicated atomic CSS, in one stylesheet, with nothing left at runtime.

```bash
bun add ts-css
```

## Why two APIs

Utility classes are unbeatable for the common case, and they run out in three specific places. Style objects cover exactly those:

|  | Utility classes | Style objects |
| --- | --- | --- |
| Laying out markup | `flex items-center gap-4` | verbose |
| A value known only at runtime | needs a safelist, or inline `style` | `css.create({ bar: w => ({ width: w }) })` |
| Merging across a component boundary | last class in the string does **not** reliably win | later argument wins, per property |
| Design tokens | theme config, stringly typed | `css.defineVars()`, typed and refactorable |

You do not have to choose per project — only per file.

## Utility classes

```html
<div class="flex items-center justify-between p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
  <h1 class="text-2xl font-bold">Hello</h1>
</div>
```

```bash
bunx cssx init     # writes css.config.ts
bunx cssx build    # scans content, writes the stylesheet
bunx cssx watch    # rebuilds on change
```

```ts
// css.config.ts
import type { TsCssOptions } from 'ts-css'

export default {
  content: ['./src/**/*.{html,ts,tsx,stx}'],
  output: './dist/styles.css',
  minify: true,
} satisfies TsCssOptions
```

> **Semantics:** utility names, value scales, and validation follow **Tailwind v4**. A class Tailwind rejects generates nothing, rather than leaking a raw word into your CSS. Bracket syntax (`flex[col jc-center]`), colon syntax (`bg:black`), attributify mode, the compile-class transformer, and `text-shadow-*` / `word-spacing-*` are deliberate extensions, held to the same validation rules.

## Style objects

```ts
import { css } from 'ts-css'

const theme = css.defineVars({
  accent: '#0b7',
  surface: { default: '#fff', '@media (prefers-color-scheme: dark)': '#111' },
})

const styles = css.create({
  card: {
    padding: 16,
    backgroundColor: theme.surface,
    ':hover': { transform: 'translateY(-2px)' },
    '@media (min-width: 768px)': { padding: 24 },
  },
  danger: { color: 'red' },
  sized: (width: number) => ({ width }),
})

function Card({ danger, width }) {
  return <div {...css.props(styles.card, danger && styles.danger, styles.sized(width))} />
}
```

Point the config at the modules that declare styles, and `cssx build` emits their CSS alongside the utilities:

```ts
export default {
  content: ['./src/**/*.tsx'],
  styles: ['./src/**/*.styles.ts'],
  output: './dist/styles.css',
} satisfies TsCssOptions
```

### Merging is per property, not per class

This is the part that concatenating class names cannot do:

```ts
const s = css.create({
  base: { color: 'blue', padding: 16 },
  override: { color: 'red' },
})

css.props(s.base, s.override)
// -> exactly two classes: red's colour, blue's padding.
// The blue colour class is dropped, not merely outranked.
```

Argument order decides — not declaration order in the stylesheet, not specificity. `null` removes a property outright, and falsy arguments are skipped, so `isActive && styles.active` reads the way it looks.

### Dynamic styles cost one rule

A style factory's arguments become inline custom properties, so a component rendered a thousand times at a thousand widths still emits a single rule:

```ts
const s = css.create({ sized: (width: number) => ({ width }) })

css.props(s.sized(120))
// { className: 'tc4v6jq55q', style: { '--tc2hxvo7bz': '120px' } }
// .tc4v6jq55q { width: var(--tc2hxvo7bz) }
```

### The rest of the API

| | |
| --- | --- |
| `css.create(styles)` | compile named style objects into atomic classes |
| `css.props(...styles)` | merge compiled styles into `className` / `style` |
| `css.defineVars(vars)` | declare custom properties, get typed `var()` references |
| `css.createTheme(vars, overrides)` | redeclare a variable group under a generated class |
| `css.keyframes(frames)` | declare an animation, get its generated name |
| `css.firstThatWorks(...values)` | progressive-enhancement fallbacks, in CSS order |
| `css.defineConsts(consts)` | build-time constants that never become CSS |

Outside a `cssx build`, `collectStyles(patterns)` returns the stylesheet directly, and `stylePlugin()` collects styles during a `Bun.build()`.

### How collection works

Styles register themselves as their module evaluates, so collecting them means importing the modules that declare them — not parsing them. A static extractor has to re-implement JavaScript to understand `padding: spacing.lg * 2`, and silently drops whatever it fails to parse. Running the code cannot disagree with the class names your app renders, because it is the same code computing them.

## Performance

Apple M3 Pro, Bun 1.3.14. Reproduce with `bun run benchmark` (~40 s) and `bun run benchmark:style`.

### Against StyleX

Both engines compile the same style objects. The benchmark asserts they emit the same number of atomic rules before timing anything — 4, 41, 27 and 326 respectively.

| Workload | ts-css | StyleX | |
| --- | ---: | ---: | ---: |
| simple (2 declarations) | **4.62 µs** | 417.21 µs | 90× |
| component (8) | **48.08 µs** | 1.05 ms | 22× |
| conditional (18) | **39.05 µs** | 719.25 µs | 18× |
| design system (200) | **759.11 µs** | 18.83 ms | 25× |

StyleX's only path from a style object to CSS is its Babel transform, so that is what it is measured on — the same way PostCSS is the only path Tailwind v3 offers. A second group removes the asymmetry by making ts-css parse its own source too, and ts-css stays 8–14× ahead:

| Source module → stylesheet | ts-css | StyleX |
| --- | ---: | ---: |
| simple | **29.58 µs** | 319.10 µs |
| component | **107.15 µs** | 881.36 µs |
| conditional | **89.70 µs** | 845.71 µs |
| design system | **1.30 ms** | 18.15 ms |

### Against Tailwind and UnoCSS

**Cold build** — every engine constructed from scratch on each iteration, which is what a production build does:

| Scenario | ts-css | UnoCSS | Tailwind v4 | Tailwind v3 |
| --- | ---: | ---: | ---: | ---: |
| Simple utilities (10) | **86.80 µs** | 1.09 ms | 1.23 ms | 11.95 ms |
| Variants (11) | **76.88 µs** | 1.14 ms | 1.09 ms | 11.74 ms |
| Arbitrary values (10) | **79.52 µs** | 951.58 µs | 933.17 µs | 12.30 ms |
| Real-world components (~60) | **153.88 µs** | 1.92 ms | 1.65 ms | 14.93 ms |
| Large scale (500) | **429.41 µs** | 8.82 ms | 2.97 ms | 16.39 ms |
| 1000 arbitrary values | **1.60 ms** | 117.71 ms | 4.48 ms | 32.69 ms |
| Full project (~800) | **414.22 µs** | 7.98 ms | 2.75 ms | 17.81 ms |

**Warm rebuild** — engines held open the way watch mode holds them, with no new classes to generate. Every engine answers from its own cache here, Tailwind v4 included:

| Scenario | ts-css | Tailwind v4 | UnoCSS |
| --- | ---: | ---: | ---: |
| Simple utilities (10) | **45.02 ns** | 105.91 ns | 42.27 µs |
| Real-world components (~60) | **306.43 ns** | 588.55 ns | 163.76 µs |
| Color utilities (330) | **2.20 µs** | 4.31 µs | 1.47 ms |
| Responsive utilities (500) | **1.25 µs** | 2.69 µs | 411.78 µs |
| Full project (~800) | **1.23 µs** | 2.77 µs | 519.58 µs |

Two things this benchmark had to fix before its numbers meant anything, both documented at the top of [`benchmark/framework-comparison.bench.ts`](benchmark/framework-comparison.bench.ts):

- **Cold and warm were mixed.** Tailwind v4's `build()` memoises per candidate set, so the old file's pre-warmed Tailwind was returning a cache hit while ts-css regenerated from scratch. That flattered Tailwind by four orders of magnitude. The two modes are now measured and reported separately.
- **The engines weren't asked for the same thing.** Tailwind's default entry pulls in preflight and the full theme layer, so it was emitting 5,370 bytes of reset and custom properties where ts-css emitted 397 bytes of utilities. It is now given a utilities-only input, which puts the outputs within a few rules of each other (10 vs 13 on the first scenario).

A third mode — warm engine, previously unseen classes — is deliberately absent: feeding each iteration a new class grows the sheet without bound, so the measurement never converges. The marginal cost of generating genuinely new classes is what the cold group already measures, minus engine setup.

## What's in the box

**Utilities** — layout, flexbox and grid, spacing with logical properties, sizing, typography, colours with opacity modifiers (`bg-white/50`), gradients, borders, effects, filters and backdrop-filter, transforms including 3D, transitions and animations with `@keyframes`, interactivity, content, and SVG.

**Variants** — responsive (`sm:`…`2xl:`), state (`hover:`, `focus-visible:`, `disabled:`…), pseudo-elements (`before:`, `marker:`, `selection:`…), positional (`first:`, `odd:`…), negation (`not-disabled:`), group and peer including named (`group/sidebar:`) and `has-[]` forms, `dark:` / `light:`, `aria-*`, `data-*`, `supports-[]`, container queries (`@sm:`), direction, print and motion queries, and `!` for important. Media variants stack: `lg:landscape:flex-row`.

**Arbitrary values** — `w-[500px]`, `h-[calc(100vh-4rem)]`, `grid-cols-[120px_1fr_200px]`, and arbitrary properties like `[mask-type:luminance]`.

**Class compilation** — mark a group with `:tc:` and the transformer rewrites it to a single hashed class:

```html
<div class=":tc: flex items-center px-4 py-2 rounded-lg">   <!-- before -->
<div class="tc-2k9d3a">                                     <!-- after -->
```

**Also** — shortcuts, presets, custom rules, safelist and blocklist, attributify mode, web-font loading, preflight, minification, a compiled standalone binary, and full type definitions.

## CLI

```bash
cssx build          # build once
cssx watch          # build and watch
cssx init           # create css.config.ts
cssx analyze        # report utility usage
cssx preflight      # emit preflight CSS only
cssx clean          # remove the output file
```

## Configuration

```ts
import type { TsCssOptions } from 'ts-css'

export default {
  content: ['./src/**/*.{html,ts,tsx}'],
  styles: ['./src/**/*.styles.ts'],
  output: './dist/styles.css',
  minify: false,

  theme: {
    extend: {
      colors: { brand: { 500: '#3b82f6', 900: '#1e3a5a' } },
      spacing: { 18: '4.5rem' },
    },
  },

  shortcuts: {
    btn: 'px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600',
  },

  safelist: ['bg-red-500'],
  blocklist: ['debug-*'],
} satisfies TsCssOptions
```

Full reference: [packages/ts-css/README.md](packages/ts-css/README.md).

## Development

```bash
git clone https://github.com/cwcss/crosswind.git
cd crosswind
bun install
bun test                    # 1900+ tests
bun run benchmark           # vs Tailwind and UnoCSS
bun run benchmark:style     # vs StyleX
```

## Documentation

[crosswind.stacksjs.org](https://crosswind.stacksjs.org)

## Changelog

See [releases](https://github.com/cwcss/crosswind/releases).

## Contributing

See [CONTRIBUTING](.github/CONTRIBUTING.md).

## Community

[Discussions on GitHub](https://github.com/cwcss/crosswind/discussions) · [Stacks Discord](https://stacksjs.com/discord)

## Postcardware

"Software that is free, but hopes for a postcard." We love receiving postcards from around the world showing where Stacks is being used! We showcase them on our website too.

Our address: Stacks.js, 12665 Village Ln #2306, Playa Vista, CA 90094, United States

## Sponsors

We would like to extend our thanks to the following sponsors for funding Stacks development. If you are interested in becoming a sponsor, please reach out to us.

- [JetBrains](https://www.jetbrains.com/)
- [The Solana Foundation](https://solana.com/)

## License

The MIT License (MIT). Please see [LICENSE](LICENSE.md) for more information.

Made with 💙

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/ts-css?style=flat-square
[npm-version-href]: https://npmjs.com/package/ts-css
[github-actions-src]: https://img.shields.io/github/actions/workflow/status/cwcss/crosswind/ci.yml?style=flat-square&branch=main
[github-actions-href]: https://github.com/cwcss/crosswind/actions?query=workflow%3Aci
