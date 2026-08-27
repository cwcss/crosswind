import { toKebabCase } from './value'

/**
 * One atomic declaration: a single property/value pair under a fixed chain of
 * conditions, owning exactly one class name.
 */
export interface AtomicRule {
  className: string
  /** camelCase, as authored — the priority table is keyed on it. */
  property: string
  /** Already normalised; more than one entry means CSS fallbacks. */
  values: string[]
  /** At-rules and selector suffixes, in authoring order. */
  conditions: string[]
  priority: number
}

/** A `@keyframes` block keyed by its generated animation name. */
export interface KeyframesRule {
  name: string
  css: string
}

/** A custom-property definition, optionally scoped to a selector/at-rule. */
export interface VarRule {
  /** Selector the variables land on — `:root` unless a theme overrides it. */
  selector: string
  /** At-rule wrapper, e.g. `@media (prefers-color-scheme: dark)`. */
  atRule?: string
  declarations: Record<string, string>
}

/**
 * Process-wide store of everything the style API has generated.
 *
 * `css.create()` registers as a side effect of module evaluation, which is
 * what lets the build collect styles by simply importing the modules that
 * declare them — no AST pass, and no chance of the emitted CSS disagreeing
 * with the class names the app actually renders.
 */
class StyleRegistry {
  private rules = new Map<string, AtomicRule>()
  private keyframes = new Map<string, KeyframesRule>()
  private vars: VarRule[] = []
  private varKeys = new Set<string>()
  /** Monotonic, so equal-priority rules keep the order they were declared. */
  private insertionOrder = new Map<string, number>()
  private nextIndex = 0
  /** Bumped on every clear; see `styleGeneration`. */
  private generation = 0

  addRule(rule: AtomicRule): void {
    // Identical declarations from different files collapse onto one class —
    // that dedup is the entire point of atomic CSS.
    if (this.rules.has(rule.className))
      return
    this.rules.set(rule.className, rule)
    this.insertionOrder.set(rule.className, this.nextIndex++)
  }

  addKeyframes(rule: KeyframesRule): void {
    if (!this.keyframes.has(rule.name))
      this.keyframes.set(rule.name, rule)
  }

  addVars(rule: VarRule): void {
    const key = `${rule.atRule ?? ''}|${rule.selector}|${Object.keys(rule.declarations).join(',')}`
    if (this.varKeys.has(key))
      return
    this.varKeys.add(key)
    this.vars.push(rule)
  }

  has(className: string): boolean {
    return this.rules.has(className)
  }

  get size(): number {
    return this.rules.size
  }

  clear(): void {
    this.rules.clear()
    this.keyframes.clear()
    this.vars = []
    this.varKeys.clear()
    this.insertionOrder.clear()
    this.nextIndex = 0
    this.generation++
  }

  get currentGeneration(): number {
    return this.generation
  }

  /**
   * Renders every registered rule to CSS, ordered so that later rules win the
   * cascade for the property they set.
   */
  toCSS(minify = false): string {
    const nl = minify ? '' : '\n'
    const parts: string[] = []

    for (const rule of this.vars)
      parts.push(renderVarRule(rule, minify))

    for (const frames of this.keyframes.values())
      parts.push(frames.css)

    const sorted = [...this.rules.values()].sort((a, b) => {
      if (a.priority !== b.priority)
        return a.priority - b.priority
      return (this.insertionOrder.get(a.className) ?? 0) - (this.insertionOrder.get(b.className) ?? 0)
    })

    for (const rule of sorted)
      parts.push(renderRule(rule, minify))

    return parts.join(nl)
  }
}

function renderDeclarations(rule: AtomicRule, minify: boolean): string {
  const property = toKebabCase(rule.property)
  const space = minify ? '' : ' '
  return rule.values.map(value => `${property}:${space}${value}`).join(minify ? ';' : '; ')
}

function renderRule(rule: AtomicRule, minify: boolean): string {
  const atRules = rule.conditions.filter(condition => condition.startsWith('@'))
  const selectorParts = rule.conditions.filter(condition => !condition.startsWith('@'))

  // `&` marks where the class goes in a nested selector; without one the
  // condition is a plain suffix (`:hover`, `::before`).
  let selector = `.${rule.className}`
  for (const part of selectorParts) {
    selector = part.includes('&')
      ? part.replace(/&/g, selector)
      : `${selector}${part}`
  }

  const body = `${selector}${minify ? '' : ' '}{${minify ? '' : ' '}${renderDeclarations(rule, minify)}${minify ? '' : ' '}}`
  return wrapInAtRules(body, atRules, minify)
}

function renderVarRule(rule: VarRule, minify: boolean): string {
  const space = minify ? '' : ' '
  const declarations = Object.entries(rule.declarations)
    .map(([name, value]) => `${name}:${space}${value}`)
    .join(minify ? ';' : '; ')
  const body = `${rule.selector}${minify ? '' : ' '}{${space}${declarations}${space}}`
  return wrapInAtRules(body, rule.atRule ? [rule.atRule] : [], minify)
}

function wrapInAtRules(body: string, atRules: string[], minify: boolean): string {
  let result = body
  // Innermost at-rule first so the outermost ends up outermost.
  for (let i = atRules.length - 1; i >= 0; i--)
    result = `${atRules[i]}${minify ? '' : ' '}{${minify ? '' : ' '}${result}${minify ? '' : ' '}}`
  return result
}

export const registry: StyleRegistry = new StyleRegistry()

/** Serialises everything `css.create()` and friends have registered so far. */
export function renderStyles(minify = false): string {
  return registry.toCSS(minify)
}

/** Empties the registry. Tests and watch-mode rebuilds need this. */
export function resetStyles(): void {
  registry.clear()
}

/** How many distinct atomic classes exist right now. */
export function styleCount(): number {
  return registry.size
}

/**
 * Increments every time the registry is cleared.
 *
 * Rules are registered as a side effect of module evaluation, and a module
 * only evaluates once per specifier — so after a reset the modules that
 * declared those rules would stay cached and never re-register them. Folding
 * this counter into the import specifier makes a reset genuinely start over.
 */
export function styleGeneration(): number {
  return registry.currentGeneration
}
