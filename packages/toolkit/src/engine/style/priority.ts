/**
 * Rule ordering for atomic CSS.
 *
 * Every declaration becomes its own class, so two classes on one element can
 * both set `color` and the winner is decided purely by source order in the
 * stylesheet. That makes emission order the whole correctness story: rules are
 * sorted by the priority computed here, and equal priorities keep insertion
 * order.
 */

/** Resets everything — must lose to every other declaration. */
const RESET_PRIORITY = 1000

/** Top-level shorthands: `margin`, `border`, `background`, … */
const SHORTHAND_PRIORITY = 2000

/** Shorthands of shorthands: `marginInline`, `borderColor`, … */
const SUB_SHORTHAND_PRIORITY = 3000

/** Longhands — the most specific thing an author can write. */
const LONGHAND_PRIORITY = 4000

const SHORTHANDS = new Set([
  'animation',
  'background',
  'border',
  'borderImage',
  'columnRule',
  'columns',
  'container',
  'flex',
  'flexFlow',
  'font',
  'gap',
  'grid',
  'gridArea',
  'gridColumn',
  'gridRow',
  'gridTemplate',
  'inset',
  'listStyle',
  'margin',
  'mask',
  'offset',
  'outline',
  'overflow',
  'overscrollBehavior',
  'padding',
  'placeContent',
  'placeItems',
  'placeSelf',
  'scrollMargin',
  'scrollPadding',
  'scrollTimeline',
  'textDecoration',
  'textEmphasis',
  'transition',
])

const SUB_SHORTHANDS = new Set([
  'borderBlock',
  'borderBlockEnd',
  'borderBlockStart',
  'borderBottom',
  'borderColor',
  'borderInline',
  'borderInlineEnd',
  'borderInlineStart',
  'borderLeft',
  'borderRadius',
  'borderRight',
  'borderStyle',
  'borderTop',
  'borderWidth',
  'insetBlock',
  'insetInline',
  'marginBlock',
  'marginInline',
  'paddingBlock',
  'paddingInline',
  'scrollMarginBlock',
  'scrollMarginInline',
  'scrollPaddingBlock',
  'scrollPaddingInline',
])

/**
 * Pseudo-class weights follow the LVHFA order every CSS guide teaches, so
 * `:active` beats `:hover` beats `:link` no matter which order the author
 * wrote them in.
 */
const PSEUDO_CLASS_PRIORITY: Record<string, number> = {
  ':first-child': 40,
  ':first-of-type': 40,
  ':last-child': 40,
  ':last-of-type': 40,
  ':only-child': 40,
  ':nth-child': 40,
  ':nth-of-type': 40,
  ':empty': 50,
  ':target': 60,
  ':link': 70,
  ':visited': 80,
  ':enabled': 90,
  ':required': 100,
  ':optional': 100,
  ':read-only': 100,
  ':read-write': 100,
  ':placeholder-shown': 110,
  ':default': 110,
  ':checked': 120,
  ':indeterminate': 120,
  ':valid': 130,
  ':invalid': 130,
  ':in-range': 130,
  ':out-of-range': 130,
  ':autofill': 140,
  ':focus-within': 150,
  ':hover': 160,
  ':focus': 170,
  ':focus-visible': 180,
  ':active': 190,
  ':disabled': 200,
}

/** How much a single at-rule wrapper adds. */
const AT_RULE_PRIORITY = 300

/** Unknown pseudo-classes sit with the structural selectors. */
const DEFAULT_PSEUDO_PRIORITY = 40

export function propertyPriority(property: string): number {
  if (property === 'all')
    return RESET_PRIORITY
  if (SHORTHANDS.has(property))
    return SHORTHAND_PRIORITY
  if (SUB_SHORTHANDS.has(property))
    return SUB_SHORTHAND_PRIORITY
  return LONGHAND_PRIORITY
}

/**
 * A condition is an at-rule (`@media …`), a pseudo-element (`::before`) or a
 * pseudo-class / nested selector (`:hover`, `&[data-open] &`).
 */
export function conditionPriority(condition: string): number {
  if (condition.startsWith('@'))
    return AT_RULE_PRIORITY

  // Pseudo-elements address a different box entirely, so they never conflict
  // with the base element's rules. The +1 only breaks ties deterministically.
  if (condition.startsWith('::'))
    return 1

  if (condition.startsWith(':')) {
    // `:nth-child(2n)` has to match the bare `:nth-child` table entry.
    const name = condition.replace(/\(.*$/, '')
    return PSEUDO_CLASS_PRIORITY[name] ?? DEFAULT_PSEUDO_PRIORITY
  }

  return DEFAULT_PSEUDO_PRIORITY
}

/**
 * Property class dominates: a longhand always beats a shorthand, however
 * deeply the shorthand is nested. Conditions only order rules that set the
 * same property.
 */
export function rulePriority(property: string, conditions: readonly string[]): number {
  let priority = propertyPriority(property)
  for (const condition of conditions)
    priority += conditionPriority(condition)
  return priority
}
