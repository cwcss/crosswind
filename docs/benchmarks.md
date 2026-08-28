# Performance Benchmarks

ts-css is built for speed. This page provides performance benchmarks comparing ts-css with UnoCSS, Tailwind v4, and Tailwind v3.

## Methodology

- **Tool**: [Mitata](https://github.com/evanwashere/mitata)
- **Runtime**: Bun 1.3.14
- **Hardware**: Apple M3 Pro

Two modes are measured, and keeping them apart is the whole point.

**Cold build** — every engine is constructed from scratch on each iteration and
produces a stylesheet. This is a production build, and it is the number that
decides CI time.

| Engine | Cold path |
| --- | --- |
| ts-css | `new CSSGenerator(config)` + `generateBatch()` + `toCSS()` |
| UnoCSS | `await createGenerator({ presets })` + `generate()` |
| Tailwind v4 | `await compile(css)` + `build(candidates)` |
| Tailwind v3 | `postcss([tailwindcss(…)])` + `process()` |

ts-css is handed a fresh `{ ...defaultConfig }` object rather than the shared
one. Theme processing is memoised per config object, so reusing the module-level
`defaultConfig` would skip it and understate the cold cost by about half.
Tailwind re-parses its design system on every `compile()`; this makes ts-css pay
the same way.

**Warm rebuild** — a watch-mode pass over an already-built project where no new
class appeared. Every engine keeps its caches and answers from them.

Every engine is given a **utilities-only input**, so all four are asked for the
same thing. Tailwind's default entry also pulls in preflight and the full theme
layer; left alone it emitted 5,370 bytes of reset and custom properties where
ts-css emitted 397 bytes of utilities. With a utilities-only input the outputs
land within a few rules of each other, and the benchmark asserts every engine
produced non-empty CSS before timing anything.

## Results

### Cold build

| Scenario | ts-css | UnoCSS | Tailwind v4 | Tailwind v3 |
| --- | ---: | ---: | ---: | ---: |
| Simple utilities (10) | **86.80 µs** | 1.09 ms | 1.23 ms | 11.95 ms |
| Complex variants (11) | **76.88 µs** | 1.14 ms | 1.09 ms | 11.74 ms |
| Arbitrary values (10) | **79.52 µs** | 951.58 µs | 933.17 µs | 12.30 ms |
| Real-world components (~60) | **153.88 µs** | 1.92 ms | 1.65 ms | 14.93 ms |
| Large scale (500) | **429.41 µs** | 8.82 ms | 2.97 ms | 16.39 ms |
| CSS output (1000 arbitrary values) | **1.60 ms** | 117.71 ms | 4.48 ms | 32.69 ms |
| Full project (~800) | **414.22 µs** | 7.98 ms | 2.75 ms | 17.81 ms |

### Warm rebuild

| Scenario | ts-css | Tailwind v4 | UnoCSS |
| --- | ---: | ---: | ---: |
| Simple utilities (10) | **45.02 ns** | 105.91 ns | 42.27 µs |
| Real-world components (~60) | **306.43 ns** | 588.55 ns | 163.76 µs |
| Color utilities (330) | **2.20 µs** | 4.31 µs | 1.47 ms |
| Responsive utilities (500) | **1.25 µs** | 2.69 µs | 411.78 µs |
| Full project (~800) | **1.23 µs** | 2.77 µs | 519.58 µs |

### Style objects vs StyleX

Both engines compile the same style objects, and the benchmark asserts they emit
the same number of atomic rules before timing anything.

| Workload | ts-css | StyleX | |
| --- | ---: | ---: | ---: |
| simple (2 declarations) | **4.62 µs** | 417.21 µs | 90× |
| component (8) | **48.08 µs** | 1.05 ms | 22× |
| conditional (18) | **39.05 µs** | 719.25 µs | 18× |
| design system (200) | **759.11 µs** | 18.83 ms | 25× |

StyleX's only path from a style object to CSS is its Babel transform, so that is
what it is measured on. A second group makes ts-css parse its own source too;
ts-css stays 8–14× ahead there.

## What this benchmark used to get wrong

Worth stating plainly, because the old numbers on this page were not meaningful:

- **Cold and warm were mixed.** Tailwind v4's `build()` memoises its result for a
  candidate set it has already seen, returning in ~0.1 µs without generating
  anything. The old file pre-warmed Tailwind once and then compared that cache
  hit against a full ts-css regeneration, which flattered Tailwind by four orders
  of magnitude.
- **The engines were not asked for the same thing.** Tailwind was emitting
  preflight and the entire theme layer alongside the utilities it was being timed
  on.

A third mode — warm engine, previously unseen classes — is deliberately absent.
Feeding each iteration a new class grows the stylesheet without bound, so the
measurement never converges. The marginal cost of generating genuinely new
classes is what the cold group already measures, minus engine setup.

## Why ts-css Is Fast

1. **Pre-processed config singleton** — config merging, theme extension, blocklist compilation done once and cached via WeakMap
2. **O(1) static utility map** — ~80% of common utilities resolve via a single hash lookup
3. **Pre-computed color map** — flat cache for O(1) color lookups
4. **Multi-layer caching** — parse cache, class cache, selector cache, media query cache, negative match cache
5. **Batch API** — `generateBatch()` processes arrays without per-call overhead
6. **Skip-on-empty checks** — blocklist/shortcut checks are skipped entirely if config has none
7. **Charcode-first variant resolution** — avoids string operations on the hot path
8. **Memoised `toCSS()`** — serialising is O(rules) and watch mode calls it every pass, usually with nothing new to say; a revision counter turns an unchanged rebuild into three integer comparisons
9. **Content-hashed atomic rules** — two components declaring `padding: 16` share one class

## JS/TS API vs Compiled Binary

ts-css can run as a JS/TS library (embedded in your app) or as a compiled standalone binary (`bun build --compile`).

### JS/TS API (in-process)

| Fixture | Classes | Cold (new gen) | Warm (reset) | Full E2E (read + extract + gen) |
|---------|---------|---------------|-------------|-------------------------------|
| Small page (4 lines) | 20 | 0.039ms | **0.018ms** | 0.043ms |
| Medium page (100 lines) | 117 | 0.138ms | **0.105ms** | 0.256ms |
| Large page (500 lines) | 117 | 0.097ms | **0.091ms** | 0.639ms |

### Compiled Binary (subprocess)

| Fixture | Avg | Min | Max |
|---------|-----|-----|-----|
| Small page | 31.5ms | 30.8ms | 34.2ms |
| Medium page | 31.3ms | 30.8ms | 31.8ms |
| Large page | 32.2ms | 30.8ms | 34.8ms |

The ~31ms overhead is process startup cost (Bun runtime initialization). The actual CSS generation is near-instant — note that small, medium, and large pages all take roughly the same time.

**When to use which:**
- **JS/TS API** — dev servers, plugins, SSR, anywhere you need sub-millisecond responses
- **Compiled Binary** — CI/CD pipelines, CLI usage, one-shot builds

## Running Benchmarks

```bash
# Framework comparison (ts-css vs UnoCSS vs Tailwind) — takes about 40s
bun run benchmark

# Style objects (ts-css vs StyleX)
bun run benchmark:style

# Binary vs API comparison
bun run benchmark:binary
```
