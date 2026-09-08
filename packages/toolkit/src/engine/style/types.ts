/**
 * Public types for the style object API.
 */

/** A single declaration's value. `null` explicitly unsets an inherited style. */
export type StyleValue = string | number | null | undefined | readonly (string | number)[]

/**
 * A style object. Keys are camelCase CSS properties; keys starting with `:`,
 * `::` or `@`, or containing `&`, open a nested condition instead.
 *
 * A property may also map to an object of conditions:
 * `{ color: { default: 'blue', ':hover': 'red' } }`.
 */
export interface StyleRule {
  [key: string]: StyleValue | StyleRule
}

/** The compiled form of one named style: merge key -> class name. */
export interface CompiledStyle {
  readonly [key: string]: string | null
}

/** Marks the tuple a dynamic style returns, so `props` never mistakes it for a list. */
export const DYNAMIC_STYLE: unique symbol = Symbol.for('ts-css.dynamic')

/** A compiled style plus the inline custom properties that parameterise it. */
export type DynamicStyle = readonly [CompiledStyle, Readonly<Record<string, string>>] & {
  readonly [DYNAMIC_STYLE]?: true
}

/** Anything `css.props()` accepts. Falsy entries are skipped. */
export type StyleArg =
  | CompiledStyle
  | DynamicStyle
  | false
  | null
  | undefined
  | readonly StyleArg[]

/** What `css.props()` spreads onto an element. */
export interface StyleProps {
  className?: string
  style?: Record<string, string>
}

// `_args` only names the tuple that `A` is inferred from — matching the
// `_match` convention the `CustomRule` signature already uses.
export type CompiledOf<T> = T extends (..._args: infer A) => any
  ? (..._args: A) => DynamicStyle
  : CompiledStyle

/** The map `css.create()` hands back, one entry per named style. */
export type CreatedStyles<T> = { readonly [K in keyof T]: CompiledOf<T[K]> }

/** A variable group's value: a plain value, or per-condition values. */
export type VarValue =
  | string
  | number
  | { default: string | number, [condition: string]: string | number }

/** What `css.defineVars()` returns — every key is a ready-to-use `var(…)`. */
export type VarGroup<T> = { readonly [K in keyof T]: string }

/** A `@keyframes` body: percentage/`from`/`to` keys mapping to style objects. */
export interface KeyframeDefinition {
  [step: string]: StyleRule
}
