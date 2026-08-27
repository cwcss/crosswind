/**
 * Property-name and value normalisation for the style object API.
 */

/**
 * Properties that take a bare number in CSS. Everything else gets `px`
 * appended when given a number, matching the React/StyleX convention.
 */
const UNITLESS_PROPERTIES = new Set([
  'animationIterationCount',
  'aspectRatio',
  'borderImageOutset',
  'borderImageSlice',
  'borderImageWidth',
  'boxFlex',
  'boxFlexGroup',
  'boxOrdinalGroup',
  'columnCount',
  'columns',
  'fillOpacity',
  'flex',
  'flexGrow',
  'flexNegative',
  'flexOrder',
  'flexPositive',
  'flexShrink',
  'floodOpacity',
  'fontWeight',
  'gridArea',
  'gridColumn',
  'gridColumnEnd',
  'gridColumnSpan',
  'gridColumnStart',
  'gridRow',
  'gridRowEnd',
  'gridRowSpan',
  'gridRowStart',
  'lineClamp',
  'lineHeight',
  'opacity',
  'order',
  'orphans',
  'rotate',
  'scale',
  'shapeImageThreshold',
  'stopOpacity',
  'strokeDasharray',
  'strokeDashoffset',
  'strokeMiterlimit',
  'strokeOpacity',
  'strokeWidth',
  'tabSize',
  'widows',
  'zIndex',
  'zoom',
  'WebkitBoxFlex',
  'WebkitBoxOrdinalGroup',
  'WebkitLineClamp',
  'MozBoxFlex',
  'MozBoxOrdinalGroup',
])

const kebabCache = new Map<string, string>()

/**
 * `backgroundColor` -> `background-color`, `WebkitLineClamp` ->
 * `-webkit-line-clamp`. Custom properties (`--brand`) pass through untouched.
 */
export function toKebabCase(property: string): string {
  const cached = kebabCache.get(property)
  if (cached !== undefined)
    return cached

  let result: string
  if (property.startsWith('--')) {
    result = property
  }
  else {
    // A leading capital marks a vendor prefix (`WebkitFoo` -> `-webkit-foo`),
    // so the replace below already emits the leading dash for it.
    result = property.replace(/[A-Z]/g, char => `-${char.toLowerCase()}`)
  }

  kebabCache.set(property, result)
  return result
}

/**
 * Numbers become `px` unless the property is unitless or the value is zero.
 * Everything else is stringified as-is.
 */
export function normalizeValue(property: string, value: string | number): string {
  if (typeof value !== 'number')
    return value

  if (value === 0 || UNITLESS_PROPERTIES.has(property) || property.startsWith('--'))
    return String(value)

  return `${value}px`
}

/**
 * Renders one declaration's value. Arrays become CSS fallbacks — the caller
 * emits one declaration per entry, in order, so the last supported one wins.
 */
export function normalizeValues(
  property: string,
  value: string | number | readonly (string | number)[],
): string[] {
  if (Array.isArray(value))
    return value.map(entry => normalizeValue(property, entry))
  return [normalizeValue(property, value as string | number)]
}
