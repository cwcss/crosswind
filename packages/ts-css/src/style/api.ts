import type {
  CompiledStyle,
  CreatedStyles,
  DynamicStyle,
  KeyframeDefinition,
  StyleArg,
  StyleProps,
  StyleRule,
  StyleValue,
  VarGroup,
  VarValue,
} from './types'
import { hashedClassName, hashString } from './hash'
import { rulePriority } from './priority'
import { registry } from './registry'
import { DYNAMIC_STYLE } from './types'
import { normalizeValue, normalizeValues, toKebabCase } from './value'

/** Prefix for every generated class, custom property, and animation name. */
const PREFIX = 'tc'

/** Var names carried alongside a `defineVars` group, for `createTheme`. */
const VAR_NAMES: unique symbol = Symbol.for('ts-css.varNames')

/**
 * Keys that open a nested block rather than declaring a property:
 * `:hover`, `::before`, `@media …`, and any selector containing `&`.
 */
function isCondition(key: string): boolean {
  return key.charCodeAt(0) === 58 /* : */
    || key.charCodeAt(0) === 64 /* @ */
    || key.includes('&')
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Walks a style object into flat (property, value, conditions) triples.
 *
 * Both nesting forms are supported, because both read naturally depending on
 * what varies: `{ ':hover': { color: 'red' } }` when several properties share
 * a state, `{ color: { default: 'blue', ':hover': 'red' } }` when one property
 * varies across states.
 */
function flatten(
  rule: StyleRule,
  conditions: readonly string[],
  emit: (property: string, value: StyleValue, conditions: readonly string[]) => void,
): void {
  for (const key in rule) {
    const value = rule[key]
    if (value === undefined)
      continue

    if (isCondition(key)) {
      if (isPlainObject(value))
        flatten(value as StyleRule, [...conditions, key], emit)
      continue
    }

    if (isPlainObject(value)) {
      for (const condition in value as Record<string, StyleValue>) {
        const nested = (value as Record<string, StyleValue>)[condition]
        if (nested === undefined)
          continue
        emit(key, nested, condition === 'default' ? conditions : [...conditions, condition])
      }
      continue
    }

    emit(key, value as StyleValue, conditions)
  }
}

/**
 * The key two declarations must share to be considered "the same style" during
 * a merge. Property plus conditions — never the value, which is exactly what
 * makes `props(base, override)` predictable.
 */
function mergeKey(property: string, conditions: readonly string[]): string {
  return conditions.length === 0 ? property : `${conditions.join('')}|${property}`
}

function register(
  property: string,
  value: StyleValue,
  conditions: readonly string[],
  target: Record<string, string | null>,
): void {
  const key = mergeKey(property, conditions)

  // `null` is a real instruction: it means "whatever an earlier style set for
  // this property, drop it", so it has to occupy the key rather than skip it.
  if (value === null) {
    target[key] = null
    return
  }

  const values = normalizeValues(property, value as string | number | readonly (string | number)[])
  const className = hashedClassName(`${key}|${values.join(',')}`, PREFIX)

  registry.addRule({
    className,
    property,
    values,
    conditions: [...conditions],
    priority: rulePriority(property, conditions),
  })

  target[key] = className
}

/**
 * Compiles named style objects into atomic class names.
 *
 * Every declaration becomes its own class, deduplicated across the whole
 * program by content hash, so two components that both say `padding: 16`
 * share one rule.
 *
 * @example
 * ```ts
 * const styles = css.create({
 *   card: { padding: 16, ':hover': { transform: 'translateY(-2px)' } },
 *   danger: { color: 'red' },
 *   sized: (width: number) => ({ width }),
 * })
 * ```
 */
export function create<T extends Record<string, StyleRule | ((...args: any[]) => StyleRule)>>(
  styles: T,
): CreatedStyles<T> {
  const result: Record<string, unknown> = {}

  for (const name in styles) {
    const definition = styles[name]

    if (typeof definition === 'function') {
      result[name] = createDynamic(definition as (...args: any[]) => StyleRule)
      continue
    }

    const compiled: Record<string, string | null> = {}
    flatten(definition as StyleRule, [], (property, value, conditions) =>
      register(property, value, conditions, compiled))
    result[name] = Object.freeze(compiled)
  }

  return Object.freeze(result) as CreatedStyles<T>
}

/**
 * Turns a style factory into one that returns class names plus the inline
 * custom properties carrying its arguments.
 *
 * The generated rules read `var(--tc…)`, so a component rendered a thousand
 * times with a thousand widths still produces exactly one CSS rule.
 */
function createDynamic(fn: (...args: any[]) => StyleRule): (...args: any[]) => DynamicStyle {
  const build = (...args: any[]): DynamicStyle => {
    const rule = fn(...args)
    const compiled: Record<string, string | null> = {}
    const vars: Record<string, string> = {}

    flatten(rule, [], (property, value, conditions) => {
      const key = mergeKey(property, conditions)

      if (value === null) {
        compiled[key] = null
        return
      }

      const varName = `--${hashedClassName(key, PREFIX)}`
      const className = hashedClassName(`${key}|var(${varName})`, PREFIX)

      registry.addRule({
        className,
        property,
        values: [`var(${varName})`],
        conditions: [...conditions],
        priority: rulePriority(property, conditions),
      })

      compiled[key] = className
      vars[varName] = normalizeValue(property, value as string | number)
    })

    const tuple = [Object.freeze(compiled), Object.freeze(vars)] as unknown as DynamicStyle
    Object.defineProperty(tuple, DYNAMIC_STYLE, { value: true })
    return tuple
  }

  // Register the rules up front by probing the factory. Only the
  // property/condition shape matters here — the values are supplied per call
  // as custom properties — which is what lets a build collect a dynamic
  // style's CSS without ever rendering the component.
  //
  // `0` rather than `undefined`: a declaration whose value is `undefined` is
  // skipped as "not set", so probing with it would discover no properties at
  // all, and `0` survives the arithmetic these factories usually do.
  try {
    build(...Array.from({ length: fn.length }, () => 0))
  }
  catch {
    // A factory that dereferences its arguments can't be probed; its rules
    // register on the first real call instead.
  }

  return build
}

function isDynamic(value: unknown): value is DynamicStyle {
  return Array.isArray(value) && DYNAMIC_STYLE in (value as object)
}

/**
 * Merges compiled styles into the props an element needs.
 *
 * Later arguments win, property by property — not class by class — so
 * `props(base, override)` behaves like object spread rather than like the
 * cascade. Falsy arguments are skipped, which makes conditional styles read
 * as `isActive && styles.active`.
 *
 * @example
 * ```ts
 * <div {...css.props(styles.card, isActive && styles.active)} />
 * ```
 */
export function props(...args: StyleArg[]): StyleProps {
  const merged = new Map<string, string | null>()
  let vars: Record<string, string> | undefined

  const visit = (arg: StyleArg): void => {
    if (!arg)
      return

    if (isDynamic(arg)) {
      const [compiled, dynamicVars] = arg
      for (const key in compiled)
        merged.set(key, compiled[key])
      vars = vars ? { ...vars, ...dynamicVars } : { ...dynamicVars }
      return
    }

    if (Array.isArray(arg)) {
      for (const entry of arg)
        visit(entry as StyleArg)
      return
    }

    const compiled = arg as CompiledStyle
    for (const key in compiled)
      merged.set(key, compiled[key])
  }

  for (const arg of args)
    visit(arg)

  const classNames: string[] = []
  for (const className of merged.values()) {
    if (className !== null)
      classNames.push(className)
  }

  const result: StyleProps = {}
  if (classNames.length > 0)
    result.className = classNames.join(' ')
  if (vars && Object.keys(vars).length > 0)
    result.style = vars

  return result
}

/**
 * Declares a group of CSS custom properties and returns `var(…)` references
 * for each, ready to drop into any style object.
 *
 * A value may itself be conditional, which is how a theme responds to the
 * viewer's colour scheme without any style needing to know about it.
 *
 * @example
 * ```ts
 * export const theme = css.defineVars({
 *   accent: '#0b7',
 *   surface: { default: '#fff', '@media (prefers-color-scheme: dark)': '#111' },
 * })
 * ```
 */
export function defineVars<T extends Record<string, VarValue>>(vars: T): VarGroup<T> {
  // Content-addressed: the same declaration always yields the same custom
  // property name, so the emitted CSS is stable build over build.
  const groupHash = hashString(JSON.stringify(vars))

  const references: Record<string, string> = {}
  const names: Record<string, string> = {}
  const root: Record<string, string> = {}
  const conditional = new Map<string, Record<string, string>>()

  for (const key in vars) {
    const varName = `--${hashedClassName(`${groupHash}|${key}`, PREFIX)}`
    names[key] = varName
    references[key] = `var(${varName})`

    const value = vars[key]
    if (isPlainObject(value)) {
      for (const condition in value) {
        const rendered = normalizeValue(key, value[condition] as string | number)
        if (condition === 'default') {
          root[varName] = rendered
          continue
        }
        const bucket = conditional.get(condition) ?? {}
        bucket[varName] = rendered
        conditional.set(condition, bucket)
      }
      continue
    }

    root[varName] = normalizeValue(key, value as string | number)
  }

  registry.addVars({ selector: ':root', declarations: root })
  for (const [condition, declarations] of conditional)
    registry.addVars({ selector: ':root', atRule: condition, declarations })

  Object.defineProperty(references, VAR_NAMES, { value: names })
  return Object.freeze(references) as VarGroup<T>
}

/**
 * Re-declares an existing variable group under a generated class name.
 *
 * Put the returned class on any element and every style beneath it that reads
 * those variables picks up the override — theming without threading props.
 *
 * @example
 * ```ts
 * const dark = css.createTheme(theme, { surface: '#111' })
 * <section className={dark}>…</section>
 * ```
 */
export function createTheme<T extends Record<string, string>>(
  vars: T,
  overrides: Partial<Record<keyof T, string | number>>,
): string {
  const names = (vars as Record<PropertyKey, unknown>)[VAR_NAMES] as Record<string, string> | undefined
  if (!names)
    throw new TypeError('css.createTheme() expects a group created by css.defineVars()')

  const declarations: Record<string, string> = {}
  for (const key in overrides) {
    const varName = names[key as string]
    if (!varName)
      continue
    declarations[varName] = normalizeValue(key as string, overrides[key] as string | number)
  }

  const className = hashedClassName(`theme|${JSON.stringify(declarations)}`, PREFIX)
  registry.addVars({ selector: `.${className}`, declarations })
  return className
}

/**
 * Declares an `@keyframes` animation and returns its generated name.
 *
 * @example
 * ```ts
 * const fade = css.keyframes({ from: { opacity: 0 }, to: { opacity: 1 } })
 * const styles = css.create({ intro: { animationName: fade } })
 * ```
 */
export function keyframes(definition: KeyframeDefinition): string {
  const name = hashedClassName(`keyframes|${JSON.stringify(definition)}`, PREFIX)

  const steps: string[] = []
  for (const step in definition) {
    const declarations: string[] = []
    flatten(definition[step], [], (property, value) => {
      if (value === null || value === undefined)
        return
      for (const rendered of normalizeValues(property, value as string | number))
        declarations.push(`${toKebabCase(property)}: ${rendered}`)
    })
    steps.push(`${step} { ${declarations.join('; ')} }`)
  }

  registry.addKeyframes({ name, css: `@keyframes ${name} { ${steps.join(' ')} }` })
  return name
}

/**
 * Declares a value with progressive-enhancement fallbacks.
 *
 * Returns the values in CSS fallback order — least-supported last — so a
 * browser that understands `position: sticky` uses it and one that doesn't
 * keeps the previous declaration.
 *
 * @example
 * ```ts
 * css.create({ bar: { position: css.firstThatWorks('sticky', '-webkit-sticky', 'fixed') } })
 * ```
 */
export function firstThatWorks<T extends string>(...values: T[]): T[] {
  return [...values].reverse()
}

/**
 * Freezes build-time constants — media query strings, spacing scales — that
 * styles reference but that never become CSS of their own.
 *
 * @example
 * ```ts
 * const breakpoints = css.defineConsts({ md: '@media (min-width: 768px)' })
 * css.create({ grid: { [breakpoints.md]: { display: 'grid' } } })
 * ```
 */
export function defineConsts<T extends Record<string, string | number>>(consts: T): Readonly<T> {
  return Object.freeze({ ...consts })
}
