/**
 * Value formatting helpers shared by the generator and the rule modules.
 */

/**
 * Render `num / denom` as a CSS percentage.
 *
 * Plain `(1 / 3) * 100` stringifies to `33.33333333333333%` — sixteen
 * significant digits of float noise in every generated stylesheet, well past
 * any renderer's precision. Tailwind emits six decimals, so match that and
 * drop trailing zeros so exact ratios stay clean (`1/2` → `50%`, not
 * `50.000000%`).
 *
 * Returns undefined for a zero or non-numeric denominator rather than
 * emitting `Infinity%` / `NaN%`.
 */
export function fractionToPercent(num: number, denom: number): string | undefined {
  const value = (num / denom) * 100
  if (!Number.isFinite(value))
    return undefined
  return `${formatNumber(value)}%`
}

/**
 * Round to at most 6 decimal places and strip trailing zeros.
 */
export function formatNumber(value: number): string {
  if (Number.isInteger(value))
    return String(value)
  return value.toFixed(6).replace(/\.?0+$/, '')
}
