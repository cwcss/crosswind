[Compare changes](https://github.com/cwcss/crosswind/compare/v0.2.17...v0.2.18)

## 🐛 Bug Fixes

- **parser**: generate the classes an stx x-class binding names ([82f3077](https://github.com/cwcss/crosswind/commit/82f3077)) _(by Chris <chrisbreuer93@gmail.com>)_

## 🧹 Chores

- release v0.2.18 ([b9c15b0](https://github.com/cwcss/crosswind/commit/b9c15b0)) _(by Chris <chrisbreuer93@gmail.com>)_

## Contributors

- _Chris <chrisbreuer93@gmail.com>_

[Compare changes](https://github.com/cwcss/crosswind/compare/v0.2.16...v0.2.17)

## 🐛 Bug Fixes

- **divide**: resolve arbitrary colours instead of re-implementing the resolver ([007fa2a](https://github.com/cwcss/crosswind/commit/007fa2a)) _(by Chris <chrisbreuer93@gmail.com>)_

## 🧹 Chores

- release v0.2.17 ([2bc65d9](https://github.com/cwcss/crosswind/commit/2bc65d9)) _(by Chris <chrisbreuer93@gmail.com>)_

## Contributors

- _Chris <chrisbreuer93@gmail.com>_

[Compare changes](https://github.com/cwcss/crosswind/compare/v0.2.15...v0.2.16)

## 🐛 Bug Fixes

- **preflight**: default uncoloured borders to grey, not currentColor ([d1ec7a0](https://github.com/cwcss/crosswind/commit/d1ec7a0)) _(by Chris <chrisbreuer93@gmail.com>)_

## 🧹 Chores

- release v0.2.16 ([1c87195](https://github.com/cwcss/crosswind/commit/1c87195)) _(by Chris <chrisbreuer93@gmail.com>)_

## Contributors

- _Chris <chrisbreuer93@gmail.com>_

[Compare changes](https://github.com/cwcss/crosswind/compare/v0.2.13...v0.2.14)

## 🐛 Bug Fixes

- **parser**: ignore unrelated markup attributes ([1d46197](https://github.com/cwcss/crosswind/commit/1d46197)) _(by Chris <chrisbreuer93@gmail.com>)_

## 🧹 Chores

- release v0.2.14 ([73eb5bc](https://github.com/cwcss/crosswind/commit/73eb5bc)) _(by Chris <chrisbreuer93@gmail.com>)_

## Contributors

- _Chris <chrisbreuer93@gmail.com>_

[Compare changes](https://github.com/cwcss/crosswind/compare/v0.2.12...v0.2.13)

## 🚀 Features

- extract utility classes from string literals in code ([3f48fe5](https://github.com/cwcss/crosswind/commit/3f48fe5)) _(by Chris <chrisbreuer93@gmail.com>)_
- fill in missing Tailwind v4 utility families ([8f228fb](https://github.com/cwcss/crosswind/commit/8f228fb)) _(by Chris <chrisbreuer93@gmail.com>)_
- support the v4 bg-linear-* gradient spelling ([79cead8](https://github.com/cwcss/crosswind/commit/79cead8)) _(by Chris <chrisbreuer93@gmail.com>)_
- add CSS containment utilities ([19806d6](https://github.com/cwcss/crosswind/commit/19806d6)) _(by Chris <chrisbreuer93@gmail.com>)_

## 🐛 Bug Fixes

- **types**: declare transform constants ([21b9336](https://github.com/cwcss/crosswind/commit/21b9336)) _(by Chris <chrisbreuer93@gmail.com>)_
- **colors**: preserve functional slash alpha ([c59a59b](https://github.com/cwcss/crosswind/commit/c59a59b)) _(by Chris <chrisbreuer93@gmail.com>)_
- normalize arbitrary math operators ([6145562](https://github.com/cwcss/crosswind/commit/6145562)) _(by Chris <chrisbreuer93@gmail.com>)_
- rank stateful utilities by their class, not their pseudo-class ([93ad42a](https://github.com/cwcss/crosswind/commit/93ad42a)) _(by Chris <chrisbreuer93@gmail.com>)_
- bring the scroll-snap fallback rule back in step with the fast path ([f2755ef](https://github.com/cwcss/crosswind/commit/f2755ef)) _(by Chris <chrisbreuer93@gmail.com>)_
- register font-stretch and list-image as compound utilities ([968c937](https://github.com/cwcss/crosswind/commit/968c937)) _(by Chris <chrisbreuer93@gmail.com>)_
- cap generated percentages at six decimals ([9f19da7](https://github.com/cwcss/crosswind/commit/9f19da7)) _(by Chris <chrisbreuer93@gmail.com>)_
- match whole-class utilities on the variant-stripped class ([1fa45c5](https://github.com/cwcss/crosswind/commit/1fa45c5)) _(by Chris <chrisbreuer93@gmail.com>)_

## ⚡ Performance Improvements

- read scanned files through a bounded pool ([868e2fc](https://github.com/cwcss/crosswind/commit/868e2fc)) _(by Chris <chrisbreuer93@gmail.com>)_
- split utility and value in linear time ([284a0cd](https://github.com/cwcss/crosswind/commit/284a0cd)) _(by Chris <chrisbreuer93@gmail.com>)_
- hoist rule lookup tables to module scope ([2bc83a8](https://github.com/cwcss/crosswind/commit/2bc83a8)) _(by Chris <chrisbreuer93@gmail.com>)_
- memoize utility cascade ranking per selector ([a81d4f2](https://github.com/cwcss/crosswind/commit/a81d4f2)) _(by Chris <chrisbreuer93@gmail.com>)_
- bound the parse caches and memoize bracket alias resolution ([af5da84](https://github.com/cwcss/crosswind/commit/af5da84)) _(by Chris <chrisbreuer93@gmail.com>)_

## 🧹 Chores

- release v0.2.13 ([31661e2](https://github.com/cwcss/crosswind/commit/31661e2)) _(by Chris <chrisbreuer93@gmail.com>)_
- drop a scratch probe script committed by accident ([26a3b10](https://github.com/cwcss/crosswind/commit/26a3b10)) _(by Chris <chrisbreuer93@gmail.com>)_

## Contributors

- _Chris <chrisbreuer93@gmail.com>_

[Compare changes](https://github.com/cwcss/crosswind/compare/v0.2.11...v0.2.12)

## 🐛 Bug Fixes

- compose filter utilities instead of overwriting each other ([7462d1d](https://github.com/cwcss/crosswind/commit/7462d1d)) _(by Chris <chrisbreuer93@gmail.com>)_
- give the scroll-snap strictness variable a proximity fallback ([5adeefc](https://github.com/cwcss/crosswind/commit/5adeefc)) _(by Chris <chrisbreuer93@gmail.com>)_

## 🧹 Chores

- release v0.2.12 ([ac10410](https://github.com/cwcss/crosswind/commit/ac10410)) _(by Chris <chrisbreuer93@gmail.com>)_

## Contributors

- _Chris <chrisbreuer93@gmail.com>_

[Compare changes](https://github.com/cwcss/crosswind/compare/v0.2.10...v0.2.11)

## 🐛 Bug Fixes

- emit CSS for arbitrary box shadows and shadow colors ([5ec4b94](https://github.com/cwcss/crosswind/commit/5ec4b94)) _(by Chris <chrisbreuer93@gmail.com>)_

## 📚 Documentation

- link the community as stacksjs.com/discord ([1ba2f60](https://github.com/cwcss/crosswind/commit/1ba2f60)) _(by Chris <chrisbreuer93@gmail.com>)_

## 🧪 Tests

- **performance**: account for CI scheduler variance ([6ba83a9](https://github.com/cwcss/crosswind/commit/6ba83a9)) _(by Chris <chrisbreuer93@gmail.com>)_

## 🧹 Chores

- release v0.2.11 ([799efe4](https://github.com/cwcss/crosswind/commit/799efe4)) _(by Chris <chrisbreuer93@gmail.com>)_
- **deps**: refresh pantry lockfile ([001ec62](https://github.com/cwcss/crosswind/commit/001ec62)) _(by Chris <chrisbreuer93@gmail.com>)_
- **deps**: update bunfig to 0.15.15 ([aa5635d](https://github.com/cwcss/crosswind/commit/aa5635d)) _(by Chris <chrisbreuer93@gmail.com>)_
- **deps**: declare bun ^1.3.14 in deps.yaml ([30e3874](https://github.com/cwcss/crosswind/commit/30e3874)) _(by Chris <chrisbreuer93@gmail.com>)_

## Contributors

- _Chris <chrisbreuer93@gmail.com>_

[Compare changes](https://github.com/cwcss/crosswind/compare/v0.2.9...v0.2.10)

## 🚀 Features

- reload the config file during watch mode ([807b74d](https://github.com/cwcss/crosswind/commit/807b74d)) _(by Chris <chrisbreuer93@gmail.com>)_
- adopt the Tailwind v4 radius and shadow scales ([deac57c](https://github.com/cwcss/crosswind/commit/deac57c)) _(by Chris <chrisbreuer93@gmail.com>)_
- nest stacked at-rule variants and add darkMode media strategy ([53e0fda](https://github.com/cwcss/crosswind/commit/53e0fda)) _(by Chris <chrisbreuer93@gmail.com>)_
- support max-* breakpoint variants and order media types first ([362c833](https://github.com/cwcss/crosswind/commit/362c833)) _(by Chris <chrisbreuer93@gmail.com>)_
- extract classes from clsx/array/class:list/:class expressions ([2d45ae5](https://github.com/cwcss/crosswind/commit/2d45ae5)) _(by Chris <chrisbreuer93@gmail.com>)_

## 🐛 Bug Fixes

- use Tailwind v4's adaptive placeholder color in preflight ([67b8176](https://github.com/cwcss/crosswind/commit/67b8176)) _(by Chris <chrisbreuer93@gmail.com>)_
- resolve iconify collections from Bun's isolated-install store ([1a0d618](https://github.com/cwcss/crosswind/commit/1a0d618)) _(by Chris <chrisbreuer93@gmail.com>)_
- compose touch pan/pinch utilities through variables ([c229564](https://github.com/cwcss/crosswind/commit/c229564)) _(by Chris <chrisbreuer93@gmail.com>)_
- emit only custom colors as :root CSS variables ([3160b0a](https://github.com/cwcss/crosswind/commit/3160b0a)) _(by Chris <chrisbreuer93@gmail.com>)_
- canonical colon-syntax negatives and valid bracket color families ([597e2b3](https://github.com/cwcss/crosswind/commit/597e2b3)) _(by Chris <chrisbreuer93@gmail.com>)_
- correct utility cascade ranking for important, rounded corners, and gaps ([0427381](https://github.com/cwcss/crosswind/commit/0427381)) _(by Chris <chrisbreuer93@gmail.com>)_
- stop fast-path lookup tables shadowing theme overrides ([a6065ab](https://github.com/cwcss/crosswind/commit/a6065ab)) _(by Chris <chrisbreuer93@gmail.com>)_
- compose ring utilities through the variable system with fallbacks ([faa09db](https://github.com/cwcss/crosswind/commit/faa09db)) _(by Chris <chrisbreuer93@gmail.com>)_
- give transition utilities Tailwind's default duration and easing ([14e0799](https://github.com/cwcss/crosswind/commit/14e0799)) _(by Chris <chrisbreuer93@gmail.com>)_
- make form-* utilities generate CSS at all ([a03b48d](https://github.com/cwcss/crosswind/commit/a03b48d)) _(by Chris <chrisbreuer93@gmail.com>)_
- reject negative padding utilities ([aee4139](https://github.com/cwcss/crosswind/commit/aee4139)) _(by Chris <chrisbreuer93@gmail.com>)_
- clear compiled-class state in generator reset ([0c19f0c](https://github.com/cwcss/crosswind/commit/0c19f0c)) _(by Chris <chrisbreuer93@gmail.com>)_
- honor config watch/verbose fields and warn on zero-match content patterns ([2dc0a15](https://github.com/cwcss/crosswind/commit/2dc0a15)) _(by Chris <chrisbreuer93@gmail.com>)_
- apply preset rules, shortcuts, variants, and preflights ([36302ad](https://github.com/cwcss/crosswind/commit/36302ad)) _(by Chris <chrisbreuer93@gmail.com>)_
- make analyze stats honest and dedupe overlapping scan patterns ([b600be6](https://github.com/cwcss/crosswind/commit/b600be6)) _(by Chris <chrisbreuer93@gmail.com>)_
- ignore non-string safelist entries instead of crashing the build ([182fa84](https://github.com/cwcss/crosswind/commit/182fa84)) _(by Chris <chrisbreuer93@gmail.com>)_
- emit real CSS for compile-class groups under the hashed selector ([154b7c7](https://github.com/cwcss/crosswind/commit/154b7c7)) _(by Chris <chrisbreuer93@gmail.com>)_
- deep-merge plugin theme overrides, honor extract options, inject into fragments ([f1925b5](https://github.com/cwcss/crosswind/commit/f1925b5)) _(by Chris <chrisbreuer93@gmail.com>)_
- stop watch mode crashing on non-** content patterns and debounce rebuilds ([05b9f7d](https://github.com/cwcss/crosswind/commit/05b9f7d)) _(by Chris <chrisbreuer93@gmail.com>)_
- make --no-preflight work and scan .stx in the init template ([202a5d2](https://github.com/cwcss/crosswind/commit/202a5d2)) _(by Chris <chrisbreuer93@gmail.com>)_
- validate decoration, SVG dash, and text-emphasis values; accept hwb() and short-hex alpha ([4b9ba1b](https://github.com/cwcss/crosswind/commit/4b9ba1b)) _(by Chris <chrisbreuer93@gmail.com>)_
- validate border-radius side/corner values and support bare side forms ([a6f2529](https://github.com/cwcss/crosswind/commit/a6f2529)) _(by Chris <chrisbreuer93@gmail.com>)_
- validate outline, mask, and text-shadow values ([3a3d788](https://github.com/cwcss/crosswind/commit/3a3d788)) _(by Chris <chrisbreuer93@gmail.com>)_
- drop rules with unknown variants and support arbitrary variants ([7d54f25](https://github.com/cwcss/crosswind/commit/7d54f25)) _(by Chris <chrisbreuer93@gmail.com>)_
- emit media query blocks in mobile-first breakpoint order ([900bf90](https://github.com/cwcss/crosswind/commit/900bf90)) _(by Chris <chrisbreuer93@gmail.com>)_
- generate static-map utilities under variants ([fdb6304](https://github.com/cwcss/crosswind/commit/fdb6304)) _(by Chris <chrisbreuer93@gmail.com>)_
- validate scroll margin/padding, column-gap, and perspective values ([16fdc32](https://github.com/cwcss/crosswind/commit/16fdc32)) _(by Chris <chrisbreuer93@gmail.com>)_
- expand short hex with alpha correctly in opacity modifiers ([b54a337](https://github.com/cwcss/crosswind/commit/b54a337)) _(by Chris <chrisbreuer93@gmail.com>)_
- reject unknown words in gradient color stops ([323b9f1](https://github.com/cwcss/crosswind/commit/323b9f1)) _(by Chris <chrisbreuer93@gmail.com>)_
- validate divide, space-between, and ring/border opacity values ([268d6d0](https://github.com/cwcss/crosswind/commit/268d6d0)) _(by Chris <chrisbreuer93@gmail.com>)_
- escape all non-identifier characters in class selectors ([45d9cd8](https://github.com/cwcss/crosswind/commit/45d9cd8)) _(by Chris <chrisbreuer93@gmail.com>)_
- stop the important modifier mutating shared rule property objects ([2b3a5ab](https://github.com/cwcss/crosswind/commit/2b3a5ab)) _(by Chris <chrisbreuer93@gmail.com>)_
- validate filter, ring, columns, aspect, align-self, and border-spacing values ([d53348d](https://github.com/cwcss/crosswind/commit/d53348d)) _(by Chris <chrisbreuer93@gmail.com>)_
- validate spacing-derived utility values ([c5fd362](https://github.com/cwcss/crosswind/commit/c5fd362)) _(by Chris <chrisbreuer93@gmail.com>)_
- validate width, height, size, and min/max sizing values ([5670e7a](https://github.com/cwcss/crosswind/commit/5670e7a)) _(by Chris <chrisbreuer93@gmail.com>)_
- validate typography values and stop quoting bare words as content ([b2ef16c](https://github.com/cwcss/crosswind/commit/b2ef16c)) _(by Chris <chrisbreuer93@gmail.com>)_
- validate transform scale, rotate, skew, and translate values ([dfa7487](https://github.com/cwcss/crosswind/commit/dfa7487)) _(by Chris <chrisbreuer93@gmail.com>)_
- validate transition and animation time values ([fbd1e87](https://github.com/cwcss/crosswind/commit/fbd1e87)) _(by Chris <chrisbreuer93@gmail.com>)_
- validate z-index, order, and opacity values instead of passing words through ([52a5c42](https://github.com/cwcss/crosswind/commit/52a5c42)) _(by Chris <chrisbreuer93@gmail.com>)_

## ⚡ Performance Improvements

- actually minify preflight and keyframes in minified output ([f27abc5](https://github.com/cwcss/crosswind/commit/f27abc5)) _(by Chris <chrisbreuer93@gmail.com>)_

## 📚 Documentation

- declare Tailwind v4 semantics as the compass ([c40c586](https://github.com/cwcss/crosswind/commit/c40c586)) _(by Chris <chrisbreuer93@gmail.com>)_
- align README init snippet with the actual scaffold ([8123862](https://github.com/cwcss/crosswind/commit/8123862)) _(by Chris <chrisbreuer93@gmail.com>)_

## 💅 Styles

- build the color fast-path overlay from a diff map ([c9bc43b](https://github.com/cwcss/crosswind/commit/c9bc43b)) _(by Chris <chrisbreuer93@gmail.com>)_

## 🧹 Chores

- release v0.2.10 ([8cbe056](https://github.com/cwcss/crosswind/commit/8cbe056)) _(by Chris <chrisbreuer93@gmail.com>)_
- **pkg**: add sideEffects:false for bundler tree-shaking (publint) ([1bd41bc](https://github.com/cwcss/crosswind/commit/1bd41bc)) _(by Chris <chrisbreuer93@gmail.com>)_

## Contributors

- _Chris <chrisbreuer93@gmail.com>_

[Compare changes](https://github.com/cwcss/crosswind/compare/v0.2.8...v0.2.9)

## 🐛 Bug Fixes

- resolve CLI --config from cwd and auto-discover project config ([f1a2b0a](https://github.com/cwcss/crosswind/commit/f1a2b0a)) _(by Chris <chrisbreuer93@gmail.com>)_
- use printable delimiter in shortcut selector cache key ([2fa55ef](https://github.com/cwcss/crosswind/commit/2fa55ef)) _(by Chris <chrisbreuer93@gmail.com>)_
- expand shortcut variants onto the shortcut's own selector ([e474ca3](https://github.com/cwcss/crosswind/commit/e474ca3)) _(by Chris <chrisbreuer93@gmail.com>)_
- apply opacity modifiers to var()-based theme colors via color-mix ([8da8ace](https://github.com/cwcss/crosswind/commit/8da8ace)) _(by Chris <chrisbreuer93@gmail.com>)_

## 🧹 Chores

- release v0.2.9 ([345e14a](https://github.com/cwcss/crosswind/commit/345e14a)) _(by Chris <chrisbreuer93@gmail.com>)_

## Contributors

- _Chris <chrisbreuer93@gmail.com>_

[Compare changes](https://github.com/cwcss/crosswind/compare/v0.2.7...v0.2.8)

## 🐛 Bug Fixes

- add repository metadata to crosswind-vscode for npm provenance ([1976b04](https://github.com/cwcss/crosswind/commit/1976b04)) _(by Chris <chrisbreuer93@gmail.com>)_

## 🧹 Chores

- release v0.2.8 ([65acc86](https://github.com/cwcss/crosswind/commit/65acc86)) _(by Chris <chrisbreuer93@gmail.com>)_

## Contributors

- _Chris <chrisbreuer93@gmail.com>_

[Compare changes](https://github.com/cwcss/crosswind/compare/v0.2.6...v0.2.7)

## 🐛 Bug Fixes

- restrict grid template and auto track values to counts, keywords, and arbitrary ([9258172](https://github.com/cwcss/crosswind/commit/9258172)) _(by Chris <chrisbreuer93@gmail.com>)_
- restrict col/row span, start, and end values to numbers, auto, and arbitrary ([ee32313](https://github.com/cwcss/crosswind/commit/ee32313)) _(by Chris <chrisbreuer93@gmail.com>)_
- stop bare row-/col-<word> classes emitting named grid lines ([09cad29](https://github.com/cwcss/crosswind/commit/09cad29)) _(by Chris <chrisbreuer93@gmail.com>)_
- **preflight**: emit reset in an @layer so author styles win ([086871e](https://github.com/cwcss/crosswind/commit/086871e)) _(by Chris <chrisbreuer93@gmail.com>)_

## ♻️ Code Refactoring

- rename Headwind/hw to Crosswind/cw ([fc6280c](https://github.com/cwcss/crosswind/commit/fc6280c)) _(by Chris <chrisbreuer93@gmail.com>)_

## 🧹 Chores

- release v0.2.7 ([e9d38fe](https://github.com/cwcss/crosswind/commit/e9d38fe)) _(by Chris <chrisbreuer93@gmail.com>)_
- upgrade to TypeScript 7 ([65d8e26](https://github.com/cwcss/crosswind/commit/65d8e26)) _(by Chris <chrisbreuer93@gmail.com>)_
- **deps**: refresh bun.lock to pick up pickier 0.1.37 ([035ca9b](https://github.com/cwcss/crosswind/commit/035ca9b)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- **config**: move crosswind.config.ts to config/crosswind.ts ([5316196](https://github.com/cwcss/crosswind/commit/5316196)) _(by glennmichael123 <gtorregosa@gmail.com>)_

## Contributors

- _Chris <chrisbreuer93@gmail.com>_
- _glennmichael123 <gtorregosa@gmail.com>_

[Compare changes](https://github.com/cwcss/crosswind/compare/v0.2.4...v0.2.5)

### 🚀 Features

- load web fonts via a `fonts` config ([4d881d7](https://github.com/cwcss/crosswind/commit/4d881d7)) _(by Chris <chrisbreuer93@gmail.com>)_

### 🐛 Bug Fixes

- **scripts**: stop double-generating CHANGELOG on release ([525a512](https://github.com/cwcss/crosswind/commit/525a512)) _(by Glenn Michael Torregosa <gtorregosa@gmail.com>)_

### 🧹 Chores

- release v0.2.5 ([7fa5e3f](https://github.com/cwcss/crosswind/commit/7fa5e3f)) _(by Chris <chrisbreuer93@gmail.com>)_
- wip ([47efff3](https://github.com/cwcss/crosswind/commit/47efff3)) _(by Chris <chrisbreuer93@gmail.com>)_
- **deps**: bump better-dx to ^0.2.15 ([1affc1c](https://github.com/cwcss/crosswind/commit/1affc1c)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- **ci**: bump actions/checkout to v6, actions/cache to v5 ([acd6fc4](https://github.com/cwcss/crosswind/commit/acd6fc4)) _(by glennmichael123 <gtorregosa@gmail.com>)_

### Contributors

- _Chris <chrisbreuer93@gmail.com>_
- _Glenn Michael Torregosa <gtorregosa@gmail.com>_
- _glennmichael123 <gtorregosa@gmail.com>_

[Compare changes](https://github.com/cwcss/crosswind/compare/v0.2.3...v0.2.4)

### 🚀 Features

- **rules**: table display family, flow-root/list-item/contents, arbitrary accent/caret ([f31d55c](https://github.com/cwcss/crosswind/commit/f31d55c))

### 🧹 Chores

- release v0.2.4 ([09382bd](https://github.com/cwcss/crosswind/commit/09382bd))

### Contributors

- Chris <chrisbreuer93@gmail.com>

[Compare changes](https://github.com/cwcss/crosswind/compare/v0.2.3...HEAD)

### 🚀 Features

- **rules**: table display family, flow-root/list-item/contents, arbitrary accent/caret ([f31d55c](https://github.com/cwcss/crosswind/commit/f31d55c))

### Contributors

- Chris <chrisbreuer93@gmail.com>

[Compare changes](https://github.com/cwcss/crosswind/compare/v0.2.2...v0.2.3)

### 🧹 Chores

- release v0.2.3 ([0af1adb](https://github.com/cwcss/crosswind/commit/0af1adb))
- split and minify dist ([23aef98](https://github.com/cwcss/crosswind/commit/23aef98))

### Contributors

- Chris <chrisbreuer93@gmail.com>

[Compare changes](https://github.com/cwcss/crosswind/compare/v0.2.2...HEAD)

### 🧹 Chores

- split and minify dist ([23aef98](https://github.com/cwcss/crosswind/commit/23aef98))

### Contributors

- Chris <chrisbreuer93@gmail.com>

[Compare changes](https://github.com/cwcss/crosswind/compare/v0.2.1...v0.2.2)

### 🐛 Bug Fixes

- **build**: emit dist/index.js + dist/cli.js to match exports/bin paths ([1544b47](https://github.com/cwcss/crosswind/commit/1544b47))

### 🧹 Chores

- release v0.2.2 ([a0ceda7](https://github.com/cwcss/crosswind/commit/a0ceda7))

### Contributors

- Chris <chrisbreuer93@gmail.com>

[Compare changes](https://github.com/cwcss/crosswind/compare/v0.2.1...HEAD)

### 🐛 Bug Fixes

- **build**: emit dist/index.js + dist/cli.js to match exports/bin paths ([1544b47](https://github.com/cwcss/crosswind/commit/1544b47))

### Contributors

- Chris <chrisbreuer93@gmail.com>

[Compare changes](https://github.com/cwcss/crosswind/compare/v0.2.0...v0.2.1)

### 🚀 Features

- add `css` alias ([bcc203d](https://github.com/cwcss/crosswind/commit/bcc203d))
- **rules**: pure-CSS iconify rule for any @iconify-json/* collection ([d57a427](https://github.com/cwcss/crosswind/commit/d57a427))

### 🐛 Bug Fixes

- add setup-bun to publish-commit job ([1a02e04](https://github.com/cwcss/crosswind/commit/1a02e04))
- resolve typecheck errors ([e6caa08](https://github.com/cwcss/crosswind/commit/e6caa08))

### 🤖 Continuous Integration

- drop redundant setup-bun (pantry installs bun via deps.yaml) ([b506af1](https://github.com/cwcss/crosswind/commit/b506af1))

### 🧹 Chores

- release v0.2.1 ([fb65a3d](https://github.com/cwcss/crosswind/commit/fb65a3d))
- remove headwind refs ([2290f5e](https://github.com/cwcss/crosswind/commit/2290f5e))
- fresh install to pick up dtsx 0.9.14 and bunfig 0.15.9 ([074e1fa](https://github.com/cwcss/crosswind/commit/074e1fa))
- fresh install to pick up pickier 0.1.21 ([c7d15c0](https://github.com/cwcss/crosswind/commit/c7d15c0))
- cascade order improvements ([126617c](https://github.com/cwcss/crosswind/commit/126617c))
- several minor improvements ([04caac1](https://github.com/cwcss/crosswind/commit/04caac1))
- improve arbitrary values ([36d341d](https://github.com/cwcss/crosswind/commit/36d341d))
- wip ([38d57fd](https://github.com/cwcss/crosswind/commit/38d57fd))
- merge and resolve conflict ([1e00cce](https://github.com/cwcss/crosswind/commit/1e00cce))
- fix lint errors ([12526b8](https://github.com/cwcss/crosswind/commit/12526b8))
- minor improvements ([0a2924a](https://github.com/cwcss/crosswind/commit/0a2924a))
- improve `group-has-*` and `peer-has-*` ([7de7dc3](https://github.com/cwcss/crosswind/commit/7de7dc3))
- several minor improvements ([cc6ffe4](https://github.com/cwcss/crosswind/commit/cc6ffe4))

### Contributors

- Chris <chrisbreuer93@gmail.com>
- glennmichael123 <gtorregosa@gmail.com>

[Compare changes](https://github.com/cwcss/crosswind/compare/v0.2.0...HEAD)

### 🚀 Features

- add `css` alias ([bcc203d](https://github.com/cwcss/crosswind/commit/bcc203d))
- **rules**: pure-CSS iconify rule for any @iconify-json/* collection ([d57a427](https://github.com/cwcss/crosswind/commit/d57a427))

### 🐛 Bug Fixes

- add setup-bun to publish-commit job ([1a02e04](https://github.com/cwcss/crosswind/commit/1a02e04))
- resolve typecheck errors ([e6caa08](https://github.com/cwcss/crosswind/commit/e6caa08))

### 🤖 Continuous Integration

- drop redundant setup-bun (pantry installs bun via deps.yaml) ([b506af1](https://github.com/cwcss/crosswind/commit/b506af1))

### 🧹 Chores

- remove headwind refs ([2290f5e](https://github.com/cwcss/crosswind/commit/2290f5e))
- fresh install to pick up dtsx 0.9.14 and bunfig 0.15.9 ([074e1fa](https://github.com/cwcss/crosswind/commit/074e1fa))
- fresh install to pick up pickier 0.1.21 ([c7d15c0](https://github.com/cwcss/crosswind/commit/c7d15c0))
- cascade order improvements ([126617c](https://github.com/cwcss/crosswind/commit/126617c))
- several minor improvements ([04caac1](https://github.com/cwcss/crosswind/commit/04caac1))
- improve arbitrary values ([36d341d](https://github.com/cwcss/crosswind/commit/36d341d))
- wip ([38d57fd](https://github.com/cwcss/crosswind/commit/38d57fd))
- merge and resolve conflict ([1e00cce](https://github.com/cwcss/crosswind/commit/1e00cce))
- fix lint errors ([12526b8](https://github.com/cwcss/crosswind/commit/12526b8))
- minor improvements ([0a2924a](https://github.com/cwcss/crosswind/commit/0a2924a))
- improve `group-has-*` and `peer-has-*` ([7de7dc3](https://github.com/cwcss/crosswind/commit/7de7dc3))
- several minor improvements ([cc6ffe4](https://github.com/cwcss/crosswind/commit/cc6ffe4))

### Contributors

- Chris <chrisbreuer93@gmail.com>
- glennmichael123 <gtorregosa@gmail.com>

[Compare changes](https://github.com/cwcss/crosswind/compare/v0.1.6...v0.2.0)

### 🚀 Features

- improve arbitrary values ([9c6af1e](https://github.com/cwcss/crosswind/commit/9c6af1e))
- handle arbitrary bracket opacity on named colors ([af6f0f3](https://github.com/cwcss/crosswind/commit/af6f0f3))

### 🐛 Bug Fixes

- resolve typecheck errors ([8876156](https://github.com/cwcss/crosswind/commit/8876156))
- resolve typecheck errors ([18bbc68](https://github.com/cwcss/crosswind/commit/18bbc68))

### 🧹 Chores

- release v0.2.0 ([74a6cfa](https://github.com/cwcss/crosswind/commit/74a6cfa))
- update lockfile ([a95e37f](https://github.com/cwcss/crosswind/commit/a95e37f))
- release updates ([c3908da](https://github.com/cwcss/crosswind/commit/c3908da))
- adjust test ([ce9472c](https://github.com/cwcss/crosswind/commit/ce9472c))
- repo cleanup and modernization ([9f1d450](https://github.com/cwcss/crosswind/commit/9f1d450))
- repo cleanup and modernization ([f5e5369](https://github.com/cwcss/crosswind/commit/f5e5369))
- remove unocss ([4446ec1](https://github.com/cwcss/crosswind/commit/4446ec1))
- remove @stacksjs/docs ([8ca150e](https://github.com/cwcss/crosswind/commit/8ca150e))
- remove redundant docs/.vitepress ([9496179](https://github.com/cwcss/crosswind/commit/9496179))
- use Pantry action for publish-commit and add job dependencies ([35b820a](https://github.com/cwcss/crosswind/commit/35b820a))
- fix better-dx version to ^0.2.7 ([4afffd7](https://github.com/cwcss/crosswind/commit/4afffd7))
- migrate to better-dx ([2489f19](https://github.com/cwcss/crosswind/commit/2489f19))
- wip ([c636898](https://github.com/cwcss/crosswind/commit/c636898))
- remove file ignores from pickier config ([2d048d6](https://github.com/cwcss/crosswind/commit/2d048d6))
- add CLAUDE.md and CHANGELOG.md to pickier ignores ([4cfef69](https://github.com/cwcss/crosswind/commit/4cfef69))
- fix lint warnings ([a5cba77](https://github.com/cwcss/crosswind/commit/a5cba77))
- remove .pickierignore ([b7ba810](https://github.com/cwcss/crosswind/commit/b7ba810))
- update better-dx to ^0.2.7 ([1f8781a](https://github.com/cwcss/crosswind/commit/1f8781a))
- enrich CLAUDE.md with detailed project context from README ([2d63389](https://github.com/cwcss/crosswind/commit/2d63389))
- update CLAUDE.md with project context and crosswind details ([b904cf8](https://github.com/cwcss/crosswind/commit/b904cf8))
- add proper claude code guidelines ([5a9eda4](https://github.com/cwcss/crosswind/commit/5a9eda4))
- use pantry monorepo action instead of pantry-setup ([521ecd4](https://github.com/cwcss/crosswind/commit/521ecd4))
- ignore claude config in linter ([0661f46](https://github.com/cwcss/crosswind/commit/0661f46))
- add claude code guidelines ([083b738](https://github.com/cwcss/crosswind/commit/083b738))
- wip ([2c27184](https://github.com/cwcss/crosswind/commit/2c27184))
- wip ([8737237](https://github.com/cwcss/crosswind/commit/8737237))
- wip ([ac03495](https://github.com/cwcss/crosswind/commit/ac03495))
- wip ([a9b683a](https://github.com/cwcss/crosswind/commit/a9b683a))
- wip ([decfd0c](https://github.com/cwcss/crosswind/commit/decfd0c))
- wip ([73a2c17](https://github.com/cwcss/crosswind/commit/73a2c17))
- wip ([82f534d](https://github.com/cwcss/crosswind/commit/82f534d))
- wip ([e02936f](https://github.com/cwcss/crosswind/commit/e02936f))
- wip ([29df3e3](https://github.com/cwcss/crosswind/commit/29df3e3))
- wip ([06de5a7](https://github.com/cwcss/crosswind/commit/06de5a7))
- wip ([d62a10b](https://github.com/cwcss/crosswind/commit/d62a10b))
- wip ([686497b](https://github.com/cwcss/crosswind/commit/686497b))
- wip ([c8e4b32](https://github.com/cwcss/crosswind/commit/c8e4b32))
- wip ([e8abd7b](https://github.com/cwcss/crosswind/commit/e8abd7b))
- wip ([1734035](https://github.com/cwcss/crosswind/commit/1734035))
- wip ([9f100ba](https://github.com/cwcss/crosswind/commit/9f100ba))
- wip ([592599c](https://github.com/cwcss/crosswind/commit/592599c))
- wip ([c3bea5d](https://github.com/cwcss/crosswind/commit/c3bea5d))

### Contributors

- Chris <chrisbreuer93@gmail.com>
- glennmichael123 <gtorregosa@gmail.com>

[Compare changes](https://github.com/cwcss/crosswind/compare/v0.1.6...HEAD)

### 🚀 Features

- improve arbitrary values ([9c6af1e](https://github.com/cwcss/crosswind/commit/9c6af1e))
- handle arbitrary bracket opacity on named colors ([af6f0f3](https://github.com/cwcss/crosswind/commit/af6f0f3))

### 🐛 Bug Fixes

- resolve typecheck errors ([8876156](https://github.com/cwcss/crosswind/commit/8876156))
- resolve typecheck errors ([18bbc68](https://github.com/cwcss/crosswind/commit/18bbc68))

### 🧹 Chores

- update lockfile ([a95e37f](https://github.com/cwcss/crosswind/commit/a95e37f))
- release updates ([c3908da](https://github.com/cwcss/crosswind/commit/c3908da))
- adjust test ([ce9472c](https://github.com/cwcss/crosswind/commit/ce9472c))
- repo cleanup and modernization ([9f1d450](https://github.com/cwcss/crosswind/commit/9f1d450))
- repo cleanup and modernization ([f5e5369](https://github.com/cwcss/crosswind/commit/f5e5369))
- remove unocss ([4446ec1](https://github.com/cwcss/crosswind/commit/4446ec1))
- remove @stacksjs/docs ([8ca150e](https://github.com/cwcss/crosswind/commit/8ca150e))
- remove redundant docs/.vitepress ([9496179](https://github.com/cwcss/crosswind/commit/9496179))
- use Pantry action for publish-commit and add job dependencies ([35b820a](https://github.com/cwcss/crosswind/commit/35b820a))
- fix better-dx version to ^0.2.7 ([4afffd7](https://github.com/cwcss/crosswind/commit/4afffd7))
- migrate to better-dx ([2489f19](https://github.com/cwcss/crosswind/commit/2489f19))
- wip ([c636898](https://github.com/cwcss/crosswind/commit/c636898))
- remove file ignores from pickier config ([2d048d6](https://github.com/cwcss/crosswind/commit/2d048d6))
- add CLAUDE.md and CHANGELOG.md to pickier ignores ([4cfef69](https://github.com/cwcss/crosswind/commit/4cfef69))
- fix lint warnings ([a5cba77](https://github.com/cwcss/crosswind/commit/a5cba77))
- remove .pickierignore ([b7ba810](https://github.com/cwcss/crosswind/commit/b7ba810))
- update better-dx to ^0.2.7 ([1f8781a](https://github.com/cwcss/crosswind/commit/1f8781a))
- enrich CLAUDE.md with detailed project context from README ([2d63389](https://github.com/cwcss/crosswind/commit/2d63389))
- update CLAUDE.md with project context and crosswind details ([b904cf8](https://github.com/cwcss/crosswind/commit/b904cf8))
- add proper claude code guidelines ([5a9eda4](https://github.com/cwcss/crosswind/commit/5a9eda4))
- use pantry monorepo action instead of pantry-setup ([521ecd4](https://github.com/cwcss/crosswind/commit/521ecd4))
- ignore claude config in linter ([0661f46](https://github.com/cwcss/crosswind/commit/0661f46))
- add claude code guidelines ([083b738](https://github.com/cwcss/crosswind/commit/083b738))
- wip ([2c27184](https://github.com/cwcss/crosswind/commit/2c27184))
- wip ([8737237](https://github.com/cwcss/crosswind/commit/8737237))
- wip ([ac03495](https://github.com/cwcss/crosswind/commit/ac03495))
- wip ([a9b683a](https://github.com/cwcss/crosswind/commit/a9b683a))
- wip ([decfd0c](https://github.com/cwcss/crosswind/commit/decfd0c))
- wip ([73a2c17](https://github.com/cwcss/crosswind/commit/73a2c17))
- wip ([82f534d](https://github.com/cwcss/crosswind/commit/82f534d))
- wip ([e02936f](https://github.com/cwcss/crosswind/commit/e02936f))
- wip ([29df3e3](https://github.com/cwcss/crosswind/commit/29df3e3))
- wip ([06de5a7](https://github.com/cwcss/crosswind/commit/06de5a7))
- wip ([d62a10b](https://github.com/cwcss/crosswind/commit/d62a10b))
- wip ([686497b](https://github.com/cwcss/crosswind/commit/686497b))
- wip ([c8e4b32](https://github.com/cwcss/crosswind/commit/c8e4b32))
- wip ([e8abd7b](https://github.com/cwcss/crosswind/commit/e8abd7b))
- wip ([1734035](https://github.com/cwcss/crosswind/commit/1734035))
- wip ([9f100ba](https://github.com/cwcss/crosswind/commit/9f100ba))
- wip ([592599c](https://github.com/cwcss/crosswind/commit/592599c))
- wip ([c3bea5d](https://github.com/cwcss/crosswind/commit/c3bea5d))

### Contributors

- Chris <chrisbreuer93@gmail.com>
- glennmichael123 <gtorregosa@gmail.com>

[Compare changes](https://github.com/cwcss/crosswind/compare/v0.1.4...v0.1.5)

### 🧹 Chores

- release v0.1.5 ([663f6dc](https://github.com/cwcss/crosswind/commit/663f6dc))

### Contributors

- glennmichael123 <gtorregosa@gmail.com>

[Compare changes](https://github.com/cwcss/crosswind/compare/v0.1.3...v0.1.4)

### 🧹 Chores

- release v0.1.4 ([3719b4c](https://github.com/cwcss/crosswind/commit/3719b4c))
- wip ([311a34a](https://github.com/cwcss/crosswind/commit/311a34a))
- wip ([a8f0eac](https://github.com/cwcss/crosswind/commit/a8f0eac))
- wip ([666877a](https://github.com/cwcss/crosswind/commit/666877a))
- wip ([cf2d716](https://github.com/cwcss/crosswind/commit/cf2d716))
- wip ([9d4fc6f](https://github.com/cwcss/crosswind/commit/9d4fc6f))
- wip ([6a58870](https://github.com/cwcss/crosswind/commit/6a58870))
- wip ([7a891d8](https://github.com/cwcss/crosswind/commit/7a891d8))
- wip ([b8d8d0d](https://github.com/cwcss/crosswind/commit/b8d8d0d))
- wip ([a365623](https://github.com/cwcss/crosswind/commit/a365623))
- wip ([a189f76](https://github.com/cwcss/crosswind/commit/a189f76))
- wip ([266fdc5](https://github.com/cwcss/crosswind/commit/266fdc5))
- release v0.1.4 ([d3c7763](https://github.com/cwcss/crosswind/commit/d3c7763))
- wip ([5c3b3f2](https://github.com/cwcss/crosswind/commit/5c3b3f2))
- wip ([ca1795c](https://github.com/cwcss/crosswind/commit/ca1795c))
- wip ([bcb554e](https://github.com/cwcss/crosswind/commit/bcb554e))
- wip ([0b35e2b](https://github.com/cwcss/crosswind/commit/0b35e2b))
- wip ([6ad0cc4](https://github.com/cwcss/crosswind/commit/6ad0cc4))
- wip ([5ca440d](https://github.com/cwcss/crosswind/commit/5ca440d))
- wip ([155be12](https://github.com/cwcss/crosswind/commit/155be12))
- wip ([1b1ff35](https://github.com/cwcss/crosswind/commit/1b1ff35))
- wip ([fc69e98](https://github.com/cwcss/crosswind/commit/fc69e98))
- release v0.1.4 ([27a66ba](https://github.com/cwcss/crosswind/commit/27a66ba))
- wip ([a4c6d8a](https://github.com/cwcss/crosswind/commit/a4c6d8a))
- wip ([e1e3f4f](https://github.com/cwcss/crosswind/commit/e1e3f4f))
- wip ([352b160](https://github.com/cwcss/crosswind/commit/352b160))
- wip ([46b97c2](https://github.com/cwcss/crosswind/commit/46b97c2))
- wip ([e15e163](https://github.com/cwcss/crosswind/commit/e15e163))
- wip ([b5c003b](https://github.com/cwcss/crosswind/commit/b5c003b))
- wip ([0547ef5](https://github.com/cwcss/crosswind/commit/0547ef5))
- wip ([56b34ea](https://github.com/cwcss/crosswind/commit/56b34ea))
- wip ([23e3c54](https://github.com/cwcss/crosswind/commit/23e3c54))
- wip ([69a9fbc](https://github.com/cwcss/crosswind/commit/69a9fbc))
- wip ([c31cbbd](https://github.com/cwcss/crosswind/commit/c31cbbd))
- wip ([66adcf1](https://github.com/cwcss/crosswind/commit/66adcf1))
- wip ([385d534](https://github.com/cwcss/crosswind/commit/385d534))

### 📄 Miscellaneous

- Update release.yml ([ded3699](https://github.com/cwcss/crosswind/commit/ded3699))
- Merge pull request #14 from cwcss/feat/pantry-release ([1e8e98c](https://github.com/cwcss/crosswind/commit/1e8e98c)) ([#14](https://github.com/cwcss/crosswind/issues/14), [#14](https://github.com/cwcss/crosswind/issues/14))

### Contributors

- Chris <chrisbreuer93@gmail.com>
- Glenn Michael Torregosa <gtorregosa@gmail.com>
- glennmichael123 <gtorregosa@gmail.com>

[Compare changes](https://github.com/cwcss/crosswind/compare/v0.1.3...HEAD)

### 🧹 Chores

- wip ([311a34a](https://github.com/cwcss/crosswind/commit/311a34a))
- wip ([a8f0eac](https://github.com/cwcss/crosswind/commit/a8f0eac))
- wip ([666877a](https://github.com/cwcss/crosswind/commit/666877a))
- wip ([cf2d716](https://github.com/cwcss/crosswind/commit/cf2d716))
- wip ([9d4fc6f](https://github.com/cwcss/crosswind/commit/9d4fc6f))
- wip ([6a58870](https://github.com/cwcss/crosswind/commit/6a58870))
- wip ([7a891d8](https://github.com/cwcss/crosswind/commit/7a891d8))
- wip ([b8d8d0d](https://github.com/cwcss/crosswind/commit/b8d8d0d))
- wip ([a365623](https://github.com/cwcss/crosswind/commit/a365623))
- wip ([a189f76](https://github.com/cwcss/crosswind/commit/a189f76))
- wip ([266fdc5](https://github.com/cwcss/crosswind/commit/266fdc5))
- release v0.1.4 ([d3c7763](https://github.com/cwcss/crosswind/commit/d3c7763))
- wip ([5c3b3f2](https://github.com/cwcss/crosswind/commit/5c3b3f2))
- wip ([ca1795c](https://github.com/cwcss/crosswind/commit/ca1795c))
- wip ([bcb554e](https://github.com/cwcss/crosswind/commit/bcb554e))
- wip ([0b35e2b](https://github.com/cwcss/crosswind/commit/0b35e2b))
- wip ([6ad0cc4](https://github.com/cwcss/crosswind/commit/6ad0cc4))
- wip ([5ca440d](https://github.com/cwcss/crosswind/commit/5ca440d))
- wip ([155be12](https://github.com/cwcss/crosswind/commit/155be12))
- wip ([1b1ff35](https://github.com/cwcss/crosswind/commit/1b1ff35))
- wip ([fc69e98](https://github.com/cwcss/crosswind/commit/fc69e98))
- release v0.1.4 ([27a66ba](https://github.com/cwcss/crosswind/commit/27a66ba))
- wip ([a4c6d8a](https://github.com/cwcss/crosswind/commit/a4c6d8a))
- wip ([e1e3f4f](https://github.com/cwcss/crosswind/commit/e1e3f4f))
- wip ([352b160](https://github.com/cwcss/crosswind/commit/352b160))
- wip ([46b97c2](https://github.com/cwcss/crosswind/commit/46b97c2))
- wip ([e15e163](https://github.com/cwcss/crosswind/commit/e15e163))
- wip ([b5c003b](https://github.com/cwcss/crosswind/commit/b5c003b))
- wip ([0547ef5](https://github.com/cwcss/crosswind/commit/0547ef5))
- wip ([56b34ea](https://github.com/cwcss/crosswind/commit/56b34ea))
- wip ([23e3c54](https://github.com/cwcss/crosswind/commit/23e3c54))
- wip ([69a9fbc](https://github.com/cwcss/crosswind/commit/69a9fbc))
- wip ([c31cbbd](https://github.com/cwcss/crosswind/commit/c31cbbd))
- wip ([66adcf1](https://github.com/cwcss/crosswind/commit/66adcf1))
- wip ([385d534](https://github.com/cwcss/crosswind/commit/385d534))

### 📄 Miscellaneous

- Update release.yml ([ded3699](https://github.com/cwcss/crosswind/commit/ded3699))
- Merge pull request #14 from cwcss/feat/pantry-release ([1e8e98c](https://github.com/cwcss/crosswind/commit/1e8e98c)) ([#14](https://github.com/cwcss/crosswind/issues/14), [#14](https://github.com/cwcss/crosswind/issues/14))

### Contributors

- Chris <chrisbreuer93@gmail.com>
- Glenn Michael Torregosa <gtorregosa@gmail.com>
- glennmichael123 <gtorregosa@gmail.com>

[Compare changes](https://github.com/cwcss/crosswind/compare/v0.1.3...HEAD)

### 🧹 Chores

- wip ([a8f0eac](https://github.com/cwcss/crosswind/commit/a8f0eac))
- wip ([666877a](https://github.com/cwcss/crosswind/commit/666877a))
- wip ([cf2d716](https://github.com/cwcss/crosswind/commit/cf2d716))
- wip ([9d4fc6f](https://github.com/cwcss/crosswind/commit/9d4fc6f))
- wip ([6a58870](https://github.com/cwcss/crosswind/commit/6a58870))
- wip ([7a891d8](https://github.com/cwcss/crosswind/commit/7a891d8))
- wip ([b8d8d0d](https://github.com/cwcss/crosswind/commit/b8d8d0d))
- wip ([a365623](https://github.com/cwcss/crosswind/commit/a365623))
- wip ([a189f76](https://github.com/cwcss/crosswind/commit/a189f76))
- wip ([266fdc5](https://github.com/cwcss/crosswind/commit/266fdc5))
- release v0.1.4 ([d3c7763](https://github.com/cwcss/crosswind/commit/d3c7763))
- wip ([5c3b3f2](https://github.com/cwcss/crosswind/commit/5c3b3f2))
- wip ([ca1795c](https://github.com/cwcss/crosswind/commit/ca1795c))
- wip ([bcb554e](https://github.com/cwcss/crosswind/commit/bcb554e))
- wip ([0b35e2b](https://github.com/cwcss/crosswind/commit/0b35e2b))
- wip ([6ad0cc4](https://github.com/cwcss/crosswind/commit/6ad0cc4))
- wip ([5ca440d](https://github.com/cwcss/crosswind/commit/5ca440d))
- wip ([155be12](https://github.com/cwcss/crosswind/commit/155be12))
- wip ([1b1ff35](https://github.com/cwcss/crosswind/commit/1b1ff35))
- wip ([fc69e98](https://github.com/cwcss/crosswind/commit/fc69e98))
- release v0.1.4 ([27a66ba](https://github.com/cwcss/crosswind/commit/27a66ba))
- wip ([a4c6d8a](https://github.com/cwcss/crosswind/commit/a4c6d8a))
- wip ([e1e3f4f](https://github.com/cwcss/crosswind/commit/e1e3f4f))
- wip ([352b160](https://github.com/cwcss/crosswind/commit/352b160))
- wip ([46b97c2](https://github.com/cwcss/crosswind/commit/46b97c2))
- wip ([e15e163](https://github.com/cwcss/crosswind/commit/e15e163))
- wip ([b5c003b](https://github.com/cwcss/crosswind/commit/b5c003b))
- wip ([0547ef5](https://github.com/cwcss/crosswind/commit/0547ef5))
- wip ([56b34ea](https://github.com/cwcss/crosswind/commit/56b34ea))
- wip ([23e3c54](https://github.com/cwcss/crosswind/commit/23e3c54))
- wip ([69a9fbc](https://github.com/cwcss/crosswind/commit/69a9fbc))
- wip ([c31cbbd](https://github.com/cwcss/crosswind/commit/c31cbbd))
- wip ([66adcf1](https://github.com/cwcss/crosswind/commit/66adcf1))
- wip ([385d534](https://github.com/cwcss/crosswind/commit/385d534))

### 📄 Miscellaneous

- Update release.yml ([ded3699](https://github.com/cwcss/crosswind/commit/ded3699))
- Merge pull request #14 from cwcss/feat/pantry-release ([1e8e98c](https://github.com/cwcss/crosswind/commit/1e8e98c)) ([#14](https://github.com/cwcss/crosswind/issues/14), [#14](https://github.com/cwcss/crosswind/issues/14))

### Contributors

- Chris <chrisbreuer93@gmail.com>
- Glenn Michael Torregosa <gtorregosa@gmail.com>
- glennmichael123 <gtorregosa@gmail.com>

[Compare changes](https://github.com/cwcss/crosswind/compare/v0.1.3...v0.1.4)

### 🧹 Chores

- release v0.1.4 ([3810aff](https://github.com/cwcss/crosswind/commit/3810aff))
- wip ([5c3b3f2](https://github.com/cwcss/crosswind/commit/5c3b3f2))
- wip ([ca1795c](https://github.com/cwcss/crosswind/commit/ca1795c))
- wip ([bcb554e](https://github.com/cwcss/crosswind/commit/bcb554e))
- wip ([0b35e2b](https://github.com/cwcss/crosswind/commit/0b35e2b))
- wip ([6ad0cc4](https://github.com/cwcss/crosswind/commit/6ad0cc4))
- wip ([5ca440d](https://github.com/cwcss/crosswind/commit/5ca440d))
- wip ([155be12](https://github.com/cwcss/crosswind/commit/155be12))
- wip ([1b1ff35](https://github.com/cwcss/crosswind/commit/1b1ff35))
- wip ([fc69e98](https://github.com/cwcss/crosswind/commit/fc69e98))
- release v0.1.4 ([27a66ba](https://github.com/cwcss/crosswind/commit/27a66ba))
- wip ([a4c6d8a](https://github.com/cwcss/crosswind/commit/a4c6d8a))
- wip ([e1e3f4f](https://github.com/cwcss/crosswind/commit/e1e3f4f))
- wip ([352b160](https://github.com/cwcss/crosswind/commit/352b160))
- wip ([46b97c2](https://github.com/cwcss/crosswind/commit/46b97c2))
- wip ([e15e163](https://github.com/cwcss/crosswind/commit/e15e163))
- wip ([b5c003b](https://github.com/cwcss/crosswind/commit/b5c003b))
- wip ([0547ef5](https://github.com/cwcss/crosswind/commit/0547ef5))
- wip ([56b34ea](https://github.com/cwcss/crosswind/commit/56b34ea))
- wip ([23e3c54](https://github.com/cwcss/crosswind/commit/23e3c54))
- wip ([69a9fbc](https://github.com/cwcss/crosswind/commit/69a9fbc))
- wip ([c31cbbd](https://github.com/cwcss/crosswind/commit/c31cbbd))
- wip ([66adcf1](https://github.com/cwcss/crosswind/commit/66adcf1))
- wip ([385d534](https://github.com/cwcss/crosswind/commit/385d534))

### 📄 Miscellaneous

- Merge pull request #14 from cwcss/feat/pantry-release ([1e8e98c](https://github.com/cwcss/crosswind/commit/1e8e98c)) ([#14](https://github.com/cwcss/crosswind/issues/14), [#14](https://github.com/cwcss/crosswind/issues/14))

### Contributors

- Chris <chrisbreuer93@gmail.com>
- Glenn Michael Torregosa <gtorregosa@gmail.com>
- glennmichael123 <gtorregosa@gmail.com>

[Compare changes](https://github.com/cwcss/crosswind/compare/v0.1.3...HEAD)

### 🧹 Chores

- wip ([5c3b3f2](https://github.com/cwcss/crosswind/commit/5c3b3f2))
- wip ([ca1795c](https://github.com/cwcss/crosswind/commit/ca1795c))
- wip ([bcb554e](https://github.com/cwcss/crosswind/commit/bcb554e))
- wip ([0b35e2b](https://github.com/cwcss/crosswind/commit/0b35e2b))
- wip ([6ad0cc4](https://github.com/cwcss/crosswind/commit/6ad0cc4))
- wip ([5ca440d](https://github.com/cwcss/crosswind/commit/5ca440d))
- wip ([155be12](https://github.com/cwcss/crosswind/commit/155be12))
- wip ([1b1ff35](https://github.com/cwcss/crosswind/commit/1b1ff35))
- wip ([fc69e98](https://github.com/cwcss/crosswind/commit/fc69e98))
- release v0.1.4 ([27a66ba](https://github.com/cwcss/crosswind/commit/27a66ba))
- wip ([a4c6d8a](https://github.com/cwcss/crosswind/commit/a4c6d8a))
- wip ([e1e3f4f](https://github.com/cwcss/crosswind/commit/e1e3f4f))
- wip ([352b160](https://github.com/cwcss/crosswind/commit/352b160))
- wip ([46b97c2](https://github.com/cwcss/crosswind/commit/46b97c2))
- wip ([e15e163](https://github.com/cwcss/crosswind/commit/e15e163))
- wip ([b5c003b](https://github.com/cwcss/crosswind/commit/b5c003b))
- wip ([0547ef5](https://github.com/cwcss/crosswind/commit/0547ef5))
- wip ([56b34ea](https://github.com/cwcss/crosswind/commit/56b34ea))
- wip ([23e3c54](https://github.com/cwcss/crosswind/commit/23e3c54))
- wip ([69a9fbc](https://github.com/cwcss/crosswind/commit/69a9fbc))
- wip ([c31cbbd](https://github.com/cwcss/crosswind/commit/c31cbbd))
- wip ([66adcf1](https://github.com/cwcss/crosswind/commit/66adcf1))
- wip ([385d534](https://github.com/cwcss/crosswind/commit/385d534))

### 📄 Miscellaneous

- Merge pull request #14 from cwcss/feat/pantry-release ([1e8e98c](https://github.com/cwcss/crosswind/commit/1e8e98c)) ([#14](https://github.com/cwcss/crosswind/issues/14), [#14](https://github.com/cwcss/crosswind/issues/14))

### Contributors

- Chris <chrisbreuer93@gmail.com>
- Glenn Michael Torregosa <gtorregosa@gmail.com>
- glennmichael123 <gtorregosa@gmail.com>

[Compare changes](https://github.com/cwcss/crosswind/compare/v0.1.3...v0.1.4)

### 🧹 Chores

- release v0.1.4 ([233963b](https://github.com/cwcss/crosswind/commit/233963b))
- wip ([a4c6d8a](https://github.com/cwcss/crosswind/commit/a4c6d8a))
- wip ([e1e3f4f](https://github.com/cwcss/crosswind/commit/e1e3f4f))
- wip ([352b160](https://github.com/cwcss/crosswind/commit/352b160))
- wip ([46b97c2](https://github.com/cwcss/crosswind/commit/46b97c2))
- wip ([e15e163](https://github.com/cwcss/crosswind/commit/e15e163))
- wip ([b5c003b](https://github.com/cwcss/crosswind/commit/b5c003b))
- wip ([0547ef5](https://github.com/cwcss/crosswind/commit/0547ef5))
- wip ([56b34ea](https://github.com/cwcss/crosswind/commit/56b34ea))
- wip ([23e3c54](https://github.com/cwcss/crosswind/commit/23e3c54))
- wip ([69a9fbc](https://github.com/cwcss/crosswind/commit/69a9fbc))
- wip ([c31cbbd](https://github.com/cwcss/crosswind/commit/c31cbbd))
- wip ([66adcf1](https://github.com/cwcss/crosswind/commit/66adcf1))
- wip ([385d534](https://github.com/cwcss/crosswind/commit/385d534))

### Contributors

- Chris <chrisbreuer93@gmail.com>
- glennmichael123 <gtorregosa@gmail.com>

[Compare changes](https://github.com/cwcss/crosswind/compare/v0.1.3...HEAD)

### 🧹 Chores

- wip ([a4c6d8a](https://github.com/cwcss/crosswind/commit/a4c6d8a))
- wip ([e1e3f4f](https://github.com/cwcss/crosswind/commit/e1e3f4f))
- wip ([352b160](https://github.com/cwcss/crosswind/commit/352b160))
- wip ([46b97c2](https://github.com/cwcss/crosswind/commit/46b97c2))
- wip ([e15e163](https://github.com/cwcss/crosswind/commit/e15e163))
- wip ([b5c003b](https://github.com/cwcss/crosswind/commit/b5c003b))
- wip ([0547ef5](https://github.com/cwcss/crosswind/commit/0547ef5))
- wip ([56b34ea](https://github.com/cwcss/crosswind/commit/56b34ea))
- wip ([23e3c54](https://github.com/cwcss/crosswind/commit/23e3c54))
- wip ([69a9fbc](https://github.com/cwcss/crosswind/commit/69a9fbc))
- wip ([c31cbbd](https://github.com/cwcss/crosswind/commit/c31cbbd))
- wip ([66adcf1](https://github.com/cwcss/crosswind/commit/66adcf1))
- wip ([385d534](https://github.com/cwcss/crosswind/commit/385d534))

### Contributors

- Chris <chrisbreuer93@gmail.com>
- glennmichael123 <gtorregosa@gmail.com>

[Compare changes](https://github.com/cwcss/crosswind/compare/v0.1.2...v0.1.3)

### 🧹 Chores

- release v0.1.3 ([bf49808](https://github.com/cwcss/crosswind/commit/bf49808))
- update `bun-git-hooks`([9e24c59](https://github.com/cwcss/crosswind/commit/9e24c59))
- adjust expectation ([6d9ca20](https://github.com/cwcss/crosswind/commit/6d9ca20))
- use`clapp`([355811b](https://github.com/cwcss/crosswind/commit/355811b))

### Contributors

- Chris <chrisbreuer93@gmail.com>

[Compare changes](https://github.com/cwcss/crosswind/compare/v0.1.2...HEAD)

### 🧹 Chores

- update`bun-git-hooks`([9e24c59](https://github.com/cwcss/crosswind/commit/9e24c59))
- adjust expectation ([6d9ca20](https://github.com/cwcss/crosswind/commit/6d9ca20))
- use`clapp`([355811b](https://github.com/cwcss/crosswind/commit/355811b))

### Contributors

- Chris <chrisbreuer93@gmail.com>

[Compare changes](https://github.com/cwcss/crosswind/compare/v0.1.1...v0.1.2)

### 🚀 Features

- add bun plugin ([63d0176](https://github.com/cwcss/crosswind/commit/63d0176))

### 🧹 Chores

- release v0.1.2 ([26255be](https://github.com/cwcss/crosswind/commit/26255be))
- lint ([1bf7619](https://github.com/cwcss/crosswind/commit/1bf7619))
- minor updates ([c4367f9](https://github.com/cwcss/crosswind/commit/c4367f9))
- rename to`hw`prefix ([92a4264](https://github.com/cwcss/crosswind/commit/92a4264))
- add crosswind ([7f4b4e9](https://github.com/cwcss/crosswind/commit/7f4b4e9))
- allow for multi-segment color names ([a07301a](https://github.com/cwcss/crosswind/commit/a07301a))
- resolve typecheck ([78be83a](https://github.com/cwcss/crosswind/commit/78be83a))
- add crosswind path ([afca37b](https://github.com/cwcss/crosswind/commit/afca37b))

### Contributors

- Chris <chrisbreuer93@gmail.com>

[Compare changes](https://github.com/cwcss/crosswind/compare/v0.1.1...HEAD)

### 🚀 Features

- add bun plugin ([63d0176](https://github.com/cwcss/crosswind/commit/63d0176))

### 🧹 Chores

- lint ([1bf7619](https://github.com/cwcss/crosswind/commit/1bf7619))
- minor updates ([c4367f9](https://github.com/cwcss/crosswind/commit/c4367f9))
- rename to`hw` prefix ([92a4264](https://github.com/cwcss/crosswind/commit/92a4264))
- add crosswind ([7f4b4e9](https://github.com/cwcss/crosswind/commit/7f4b4e9))
- allow for multi-segment color names ([a07301a](https://github.com/cwcss/crosswind/commit/a07301a))
- resolve typecheck ([78be83a](https://github.com/cwcss/crosswind/commit/78be83a))
- add crosswind path ([afca37b](https://github.com/cwcss/crosswind/commit/afca37b))

### Contributors

- Chris <chrisbreuer93@gmail.com>

[Compare changes](https://github.com/cwcss/crosswind/compare/v0.1.0...v0.1.1)

### 🧹 Chores

- release v0.1.1 ([0bc1686](https://github.com/cwcss/crosswind/commit/0bc1686))
- adjust permission ([9a9f5e1](https://github.com/cwcss/crosswind/commit/9a9f5e1))
- wip ([85f06be](https://github.com/cwcss/crosswind/commit/85f06be))

### Contributors

- Chris <chrisbreuer93@gmail.com>

[Compare changes](https://github.com/cwcss/crosswind/compare/v0.1.0...HEAD)

### 🧹 Chores

- adjust permission ([9a9f5e1](https://github.com/cwcss/crosswind/commit/9a9f5e1))
- wip ([85f06be](https://github.com/cwcss/crosswind/commit/85f06be))

### Contributors

- Chris <chrisbreuer93@gmail.com>

### 🧹 Chores

- wip ([3e3542b](https://github.com/cwcss/crosswind/commit/3e3542b))
- wip ([4369902](https://github.com/cwcss/crosswind/commit/4369902))
- wip ([3bcb09c](https://github.com/cwcss/crosswind/commit/3bcb09c))
- wip ([5386559](https://github.com/cwcss/crosswind/commit/5386559))
- wip ([d3bd93a](https://github.com/cwcss/crosswind/commit/d3bd93a))
- wip ([11ce8e7](https://github.com/cwcss/crosswind/commit/11ce8e7))
- wip ([2c5faf0](https://github.com/cwcss/crosswind/commit/2c5faf0))
- wip ([1db0349](https://github.com/cwcss/crosswind/commit/1db0349))
- wip ([298a2e7](https://github.com/cwcss/crosswind/commit/298a2e7))
- wip ([edfa7f4](https://github.com/cwcss/crosswind/commit/edfa7f4))
- wip ([32f94f1](https://github.com/cwcss/crosswind/commit/32f94f1))
- wip ([f3ca297](https://github.com/cwcss/crosswind/commit/f3ca297))
- wip ([63f7efc](https://github.com/cwcss/crosswind/commit/63f7efc))
- wip ([c948bc7](https://github.com/cwcss/crosswind/commit/c948bc7))
- wip ([3f61664](https://github.com/cwcss/crosswind/commit/3f61664))
- wip ([c4e1a63](https://github.com/cwcss/crosswind/commit/c4e1a63))
- wip ([4a1d104](https://github.com/cwcss/crosswind/commit/4a1d104))
- wip ([b9b7a7d](https://github.com/cwcss/crosswind/commit/b9b7a7d))
- wip ([462be98](https://github.com/cwcss/crosswind/commit/462be98))
- wip ([751b30f](https://github.com/cwcss/crosswind/commit/751b30f))
- wip ([d768974](https://github.com/cwcss/crosswind/commit/d768974))
- wip ([a759581](https://github.com/cwcss/crosswind/commit/a759581))
- wip ([23c1356](https://github.com/cwcss/crosswind/commit/23c1356))
- wip ([7cbee34](https://github.com/cwcss/crosswind/commit/7cbee34))
- wip ([b71e60f](https://github.com/cwcss/crosswind/commit/b71e60f))
- wip ([a036bd9](https://github.com/cwcss/crosswind/commit/a036bd9))
- wip ([9453e16](https://github.com/cwcss/crosswind/commit/9453e16))
- wip ([a75b2cd](https://github.com/cwcss/crosswind/commit/a75b2cd))
- wip ([57b7141](https://github.com/cwcss/crosswind/commit/57b7141))
- wip ([71a4c5f](https://github.com/cwcss/crosswind/commit/71a4c5f))
- wip ([5581a78](https://github.com/cwcss/crosswind/commit/5581a78))

### Contributors

- Chris <chrisbreuer93@gmail.com>
