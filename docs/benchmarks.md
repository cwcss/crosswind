# Performance Benchmarks

ts-css is built for speed. This page provides performance benchmarks comparing ts-css with UnoCSS, Tailwind v4, and Tailwind v3.

## Methodology

- **Tool**: [Mitata](https://github.com/evanwashere/mitata) benchmarking library
- **Runtime**: Bun 1.3.11
- **Hardware**: Apple M3 Pro
- **Each framework uses its native API**:
  - **ts-css**: Pre-warmed `CSSGenerator` with `reset()` + `generateBatch()` + `toCSS()`
  - **UnoCSS**: Pre-warmed `createGenerator()` + `generate()` with joined class string
  - **Tailwind v4**: Pre-compiled `compile()` + `build(candidates)` — Oxide engine, no PostCSS
  - **Tailwind v3**: Pre-warmed `postcss.process()` — PostCSS is the only available API
- **All frameworks are pre-warmed** before benchmarking (config processed, caches initialized)

## Results

| Scenario | ts-css | UnoCSS | Tailwind v4 | Tailwind v3 |
|----------|----------|--------|-------------|-------------|
| Simple Utilities (10 classes) | **1.76us** | 15.44us | 0.08us | 8.10ms |
| Complex Variants (11 classes) | **6.27us** | 21.28us | 0.08us | 8.00ms |
| Arbitrary Values (10 classes) | **12.10us** | 32.36us | 0.07us | 7.89ms |
| Real-world Components (~60 classes) | **17.49us** | 55.01us | 0.36us | 8.33ms |
| Large Scale (500 classes) | **66.70us** | 115.34us | 2.10us | 9.17ms |
| CSS Output Generation (1000 values) | **663us** | 66.03ms | 8.00us | 17.20ms |
| Color Utilities (330 classes) | **77.51us** | 361.19us | 2.32us | 9.75ms |
| Responsive Utilities (500 classes) | **80.97us** | 123.16us | 1.25us | 9.03ms |
| Duplicate Handling (6000 classes) | **22.17us** | 1.37ms | 32.64us | 11.57ms |
| Full Project (~800 classes) | **168.46us** | 297.67us | 1.86us | 8.90ms |

**Bold** = fastest pure-TypeScript engine.

## Analysis

### Tailwind v4 — Fastest warm generation (Rust/WASM)

Tailwind v4's Oxide engine dominates warm generation benchmarks. After a one-time `compile()` step (~9ms), the `build()` API uses Rust-compiled code that processes candidates at native speed. This is a fundamentally different architecture — compiled machine code vs interpreted JavaScript.

### ts-css — Fastest TypeScript engine

ts-css is the **fastest pure-TypeScript/JavaScript CSS engine**:

| vs UnoCSS | Speedup |
|-----------|---------|
| Simple utilities | **8.8x** faster |
| Colors | **4.7x** faster |
| Responsive | **1.5x** faster |
| Duplicates | **62x** faster |
| CSS Output | **100x** faster |
| Full project | **1.8x** faster |

ts-css also **beats Tailwind v4 on duplicate handling** (22us vs 33us) thanks to its multi-layer caching architecture.

### Cold Start Advantage

ts-css has the fastest initialization of any framework:

| Framework | Init Cost |
|-----------|-----------|
| **ts-css** | **~0.1ms** |
| UnoCSS | ~3ms |
| Tailwind v4 | ~9ms |
| Tailwind v3 | ~70ms |

For dev servers, serverless functions, and on-demand generation, cold start matters. ts-css's near-zero init means it can create a fresh generator, process classes, and output CSS faster end-to-end than frameworks that need expensive initialization.

### Tailwind v3 — PostCSS overhead

Tailwind v3 numbers (~8-17ms per invocation) reflect PostCSS pipeline overhead. There is no lower-level API available in v3 — this is the only way to use the framework.

## Why ts-css Is Fast

1. **Pre-processed config singleton** — config merging, theme extension, blocklist compilation done once and cached via WeakMap
2. **O(1) static utility map** — ~80% of common utilities resolve via a single hash lookup
3. **Pre-computed color map** — flat cache for O(1) color lookups
4. **Multi-layer caching** — parse cache, class cache, selector cache, media query cache, negative match cache
5. **Batch API** — `generateBatch()` processes arrays without per-call overhead
6. **Skip-on-empty checks** — blocklist/shortcut checks are skipped entirely if config has none
7. **Charcode-first variant resolution** — avoids string operations on the hot path

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
# Framework comparison (ts-css vs UnoCSS vs Tailwind)
bun run benchmark

# Binary vs API comparison
bun run benchmark:binary
```
