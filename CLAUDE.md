# Claude Code Guidelines

## About

A blazingly fast, on-demand utility-first CSS framework built with Bun that generates only the CSS classes actually used in your files. It provides Tailwind CSS-compatible utility classes with full variant support (responsive, state, dark mode, pseudo-elements), arbitrary values, shortcut aliases, compile-class HTML optimization, and both CLI and programmatic APIs. Zero runtime dependencies, with 1700+ tests and benchmarks showing it outperforms UnoCSS and Tailwind in all 20 benchmark scenarios.

## Semantics compass

**Crosswind targets Tailwind v4 semantics.** When a utility's behavior, value scale, or validity is in question, Tailwind v4 is the reference: a class Tailwind rejects should generate nothing (never pass raw words through to CSS), and a class Tailwind accepts should produce the same declarations. Bracket syntax (`flex[col jc-center]`), colon syntax (`bg:black`), attributify mode, the compile-class transformer, and the `text-shadow-*` / `word-spacing-*` utilities are deliberate extensions beyond Tailwind — keep them working, but design them to be consistent with the same validation rules (numbers/keywords/theme values/arbitrary `[...]` only).

## Linting

- Use **pickier** for linting — never use eslint directly
- Run `bunx --bun pickier .` to lint, `bunx --bun pickier . --fix` to auto-fix
- When fixing unused variable warnings, prefer `// eslint-disable-next-line` comments over prefixing with `_`

## Frontend

- Use **stx** for templating — never write vanilla JS (`var`, `document.*`, `window.*`) in stx templates
- Use **crosswind** as the default CSS framework which enables standard Tailwind-like utility classes
- stx `<script>` tags should only contain stx-compatible code (signals, composables, directives)

## Dependencies

- **buddy-bot** handles dependency updates — not renovatebot
- **better-dx** provides shared dev tooling as peer dependencies — do not install its peers (e.g., `typescript`, `pickier`, `bun-plugin-dtsx`) separately if `better-dx` is already in `package.json`
- If `better-dx` is in `package.json`, ensure `bunfig.toml` includes `linker = "hoisted"`

## Commits

- Use conventional commit messages (e.g., `fix:`, `feat:`, `chore:`)
