import type { UtilityRule } from './rules'
import { resolveColorValue } from './rules'

const BORDER_COLLAPSE_VALUES: Record<string, string> = {
  'border-collapse': 'collapse',
  'border-separate': 'separate',
}

const CAPTION_SIDE_VALUES: Record<string, string> = {
  'caption-top': 'top',
  'caption-bottom': 'bottom',
}

const FIELD_SIZING_VALUES: Record<string, string> = {
  'field-sizing-content': 'content',
  'field-sizing-fixed': 'fixed',
}

const CURSOR_CURSORS: Record<string, string> = {
  'cursor-auto': 'auto',
  'cursor-default': 'default',
  'cursor-pointer': 'pointer',
  'cursor-wait': 'wait',
  'cursor-text': 'text',
  'cursor-move': 'move',
  'cursor-help': 'help',
  'cursor-not-allowed': 'not-allowed',
  'cursor-none': 'none',
  'cursor-context-menu': 'context-menu',
  'cursor-progress': 'progress',
  'cursor-cell': 'cell',
  'cursor-crosshair': 'crosshair',
  'cursor-vertical-text': 'vertical-text',
  'cursor-alias': 'alias',
  'cursor-copy': 'copy',
  'cursor-no-drop': 'no-drop',
  'cursor-grab': 'grab',
  'cursor-grabbing': 'grabbing',
  'cursor-all-scroll': 'all-scroll',
  'cursor-col-resize': 'col-resize',
  'cursor-row-resize': 'row-resize',
  'cursor-n-resize': 'n-resize',
  'cursor-e-resize': 'e-resize',
  'cursor-s-resize': 's-resize',
  'cursor-w-resize': 'w-resize',
  'cursor-ne-resize': 'ne-resize',
  'cursor-nw-resize': 'nw-resize',
  'cursor-se-resize': 'se-resize',
  'cursor-sw-resize': 'sw-resize',
  'cursor-ew-resize': 'ew-resize',
  'cursor-ns-resize': 'ns-resize',
  'cursor-nesw-resize': 'nesw-resize',
  'cursor-nwse-resize': 'nwse-resize',
  'cursor-zoom-in': 'zoom-in',
  'cursor-zoom-out': 'zoom-out',
}

const POINTER_EVENTS_VALUES: Record<string, string> = {
  'pointer-events-none': 'none',
  'pointer-events-auto': 'auto',
}

const RESIZE_VALUES: Record<string, string> = {
  'resize-none': 'none',
  'resize': 'both',
  'resize-y': 'vertical',
  'resize-x': 'horizontal',
}

const SCROLL_BEHAVIOR_VALUES: Record<string, string> = {
  'scroll-auto': 'auto',
  'scroll-smooth': 'smooth',
}

// Kept in step with the generator's static scroll-snap map. The axis
// utilities defer the strictness to a variable (default proximity, as
// Tailwind does) so snap-mandatory / snap-proximity can change it; the
// strictness utilities only set that variable, because `scroll-snap-type:
// mandatory` on its own is not a valid declaration.
const SCROLL_SNAP_TYPES: Record<string, string> = {
  'snap-none': 'none',
  'snap-x': 'x var(--cw-scroll-snap-strictness, proximity)',
  'snap-y': 'y var(--cw-scroll-snap-strictness, proximity)',
  'snap-both': 'both var(--cw-scroll-snap-strictness, proximity)',
}

const SCROLL_SNAP_STRICTNESS: Record<string, string> = {
  'snap-mandatory': 'mandatory',
  'snap-proximity': 'proximity',
}

const SCROLL_SNAP_ALIGNS: Record<string, string> = {
  'snap-start': 'start',
  'snap-end': 'end',
  'snap-center': 'center',
  'snap-align-none': 'none',
}

const SCROLL_SNAP_STOPS: Record<string, string> = {
  'snap-normal': 'normal',
  'snap-always': 'always',
}

const TOUCH_ACTION_ACTIONS: Record<string, string> = {
  'touch-auto': 'auto',
  'touch-none': 'none',
  'touch-pan-x': 'pan-x',
  'touch-pan-left': 'pan-left',
  'touch-pan-right': 'pan-right',
  'touch-pan-y': 'pan-y',
  'touch-pan-up': 'pan-up',
  'touch-pan-down': 'pan-down',
  'touch-pinch-zoom': 'pinch-zoom',
  'touch-manipulation': 'manipulation',
}

const USER_SELECT_SELECTS: Record<string, string> = {
  'select-none': 'none',
  'select-text': 'text',
  'select-all': 'all',
  'select-auto': 'auto',
}

const WILL_CHANGE_VALUES: Record<string, string> = {
  'will-change-auto': 'auto',
  'will-change-scroll': 'scroll-position',
  'will-change-contents': 'contents',
  'will-change-transform': 'transform',
}

const STROKE_LINECAP_VALUES: Record<string, string> = {
  'stroke-linecap-butt': 'butt',
  'stroke-linecap-round': 'round',
  'stroke-linecap-square': 'square',
}

const STROKE_LINEJOIN_VALUES: Record<string, string> = {
  'stroke-linejoin-miter': 'miter',
  'stroke-linejoin-round': 'round',
  'stroke-linejoin-bevel': 'bevel',
}

const FORCED_COLOR_ADJUST_VALUES: Record<string, string> = {
  'forced-color-adjust-auto': 'auto',
  'forced-color-adjust-none': 'none',
}


// Filters, Tables, Interactivity, SVG, Accessibility utilities

// Shared named-size map for `blur-*` and `backdrop-blur-*` (Tailwind parity).
// Callers fall back to `<value>px` when the value isn't a named key.
const BLUR_SIZES: Record<string, string> = {
  'none': '0',
  'sm': '4px',
  'DEFAULT': '8px',
  'md': '12px',
  'lg': '16px',
  'xl': '24px',
  '2xl': '40px',
  '3xl': '64px',
}

// Percentage-scale filter amount: brightness-150 -> 1.5. Rejects unknown
// words — Number('foo')/100 previously emitted filter: brightness(NaN).
function filterAmount(parsed: { value?: string, arbitrary: boolean }): string | undefined {
  if (parsed.arbitrary)
    return parsed.value
  if (/^\d+(?:\.\d+)?$/.test(parsed.value!))
    return `${Number(parsed.value) / 100}`
  return undefined
}

// Blur size: named scale, bare numbers (px implied), or arbitrary. Unknown
// words previously emitted filter: blur(foo).
function blurSize(parsed: { value?: string, arbitrary: boolean }): string | undefined {
  if (!parsed.value)
    return BLUR_SIZES.DEFAULT
  if (BLUR_SIZES[parsed.value] !== undefined)
    return BLUR_SIZES[parsed.value]
  if (parsed.arbitrary)
    return parsed.value
  if (/^\d+(?:\.\d+)?$/.test(parsed.value))
    return `${parsed.value}px`
  return undefined
}

const PERCENT_FILTERS = ['brightness', 'contrast', 'grayscale', 'invert', 'saturate', 'sepia']

/**
 * Filter utilities compose through one custom property per function instead
 * of each writing a complete `filter` / `backdrop-filter`.
 *
 * A whole-property write means two filter utilities on one element cannot
 * coexist: `backdrop-blur-[50px] backdrop-saturate-[180%]` emitted two rules
 * that each set `backdrop-filter`, so whichever landed later in the sheet
 * won and the other silently did nothing. Naming each function lets the
 * shared declaration list them all, and the empty `var(--x, )` fallback means
 * a function nobody set contributes nothing — no global reset rule needed.
 */
const FILTER_FUNCTIONS = ['blur', 'brightness', 'contrast', 'grayscale', 'hue-rotate', 'invert', 'saturate', 'sepia', 'drop-shadow']
const BACKDROP_FUNCTIONS = ['blur', 'brightness', 'contrast', 'grayscale', 'hue-rotate', 'invert', 'opacity', 'saturate', 'sepia']

const FILTER_COMPOSED = FILTER_FUNCTIONS.map(fn => `var(--cw-${fn}, )`).join(' ')
const BACKDROP_COMPOSED = BACKDROP_FUNCTIONS.map(fn => `var(--cw-backdrop-${fn}, )`).join(' ')

/** One filter function, plus the composed `filter` that includes it. */
function filterDecl(fn: string, value: string): Record<string, string> {
  return {
    [`--cw-${fn}`]: value,
    filter: FILTER_COMPOSED,
  }
}

/** One backdrop function, plus the composed `backdrop-filter`. */
function backdropDecl(fn: string, value: string): Record<string, string> {
  return {
    [`--cw-backdrop-${fn}`]: value,
    '-webkit-backdrop-filter': BACKDROP_COMPOSED,
    'backdrop-filter': BACKDROP_COMPOSED,
  }
}

// Filter utilities
export const filterRule: UtilityRule = (parsed) => {
  // Handle filter-none
  if (parsed.base === 'filter-none') {
    return { filter: 'none' }
  }
  if (parsed.utility === 'blur') {
    const size = blurSize(parsed)
    return size !== undefined ? filterDecl('blur', `blur(${size})`) : undefined
  }
  if (PERCENT_FILTERS.includes(parsed.utility) && parsed.value) {
    const amount = filterAmount(parsed)
    return amount !== undefined ? filterDecl(parsed.utility, `${parsed.utility}(${amount})`) : undefined
  }
  if (parsed.utility === 'hue-rotate' && parsed.value) {
    if (parsed.arbitrary)
      return filterDecl('hue-rotate', `hue-rotate(${parsed.value})`)
    if (/^-?\d+(?:\.\d+)?$/.test(parsed.value))
      return filterDecl('hue-rotate', `hue-rotate(${parsed.value}deg)`)
    return undefined
  }
  if (parsed.utility === 'drop-shadow') {
    const shadows: Record<string, string> = {
      'sm': 'drop-shadow(0 1px 1px rgb(0 0 0 / 0.05))',
      'DEFAULT': 'drop-shadow(0 1px 2px rgb(0 0 0 / 0.1)) drop-shadow(0 1px 1px rgb(0 0 0 / 0.06))',
      'md': 'drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06))',
      'lg': 'drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1))',
      'xl': 'drop-shadow(0 20px 13px rgb(0 0 0 / 0.03)) drop-shadow(0 8px 5px rgb(0 0 0 / 0.08))',
      '2xl': 'drop-shadow(0 25px 25px rgb(0 0 0 / 0.15))',
      'none': 'drop-shadow(0 0 #0000)',
    }
    if (!parsed.value)
      return filterDecl('drop-shadow', shadows.DEFAULT)
    if (shadows[parsed.value])
      return filterDecl('drop-shadow', shadows[parsed.value])
    if (parsed.arbitrary)
      return filterDecl('drop-shadow', `drop-shadow(${parsed.value})`)
    return undefined
  }
}

export const backdropFilterRule: UtilityRule = (parsed): Record<string, string> | undefined => {
  // Handle backdrop-filter-none
  if (parsed.base === 'backdrop-filter-none') {
    return { 'backdrop-filter': 'none' }
  }
  if (parsed.utility === 'backdrop-blur') {
    const size = blurSize(parsed)
    return size !== undefined ? backdropDecl('blur', `blur(${size})`) : undefined
  }
  if (parsed.utility.startsWith('backdrop-') && parsed.value) {
    const fn = parsed.utility.slice(9)
    if (PERCENT_FILTERS.includes(fn) || fn === 'opacity') {
      const amount = filterAmount(parsed)
      if (amount === undefined)
        return undefined
      return backdropDecl(fn, `${fn}(${amount})`)
    }
    if (fn === 'hue-rotate') {
      if (parsed.arbitrary)
        return backdropDecl(fn, `hue-rotate(${parsed.value})`)
      if (/^-?\d+(?:\.\d+)?$/.test(parsed.value))
        return backdropDecl(fn, `hue-rotate(${parsed.value}deg)`)
      return undefined
    }
  }
}

// Table utilities
export const borderCollapseRule: UtilityRule = (parsed) => {
  return BORDER_COLLAPSE_VALUES[parsed.base] ? { 'border-collapse': BORDER_COLLAPSE_VALUES[parsed.base] } : undefined
}

export const borderSpacingRule: UtilityRule = (parsed, config) => {
  if (!parsed.utility.startsWith('border-spacing') || !parsed.value)
    return undefined
  // Theme spacing, off-scale numbers (0.25rem steps), or arbitrary values;
  // unknown words previously emitted border-spacing: foo foo.
  let value: string | undefined = config.theme.spacing[parsed.value]
  if (value === undefined && parsed.arbitrary)
    value = parsed.value
  if (value === undefined && /^\d+(?:\.\d+)?$/.test(parsed.value))
    value = `${Number.parseFloat(parsed.value) * 0.25}rem`
  if (value === undefined)
    return undefined
  if (parsed.utility === 'border-spacing')
    return { 'border-spacing': `${value} ${value}` }
  if (parsed.utility === 'border-spacing-x')
    return { 'border-spacing': `${value} 0` }
  if (parsed.utility === 'border-spacing-y')
    return { 'border-spacing': `0 ${value}` }
}

export const tableLayoutRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'table' && parsed.value) {
    const values: Record<string, string> = {
      auto: 'auto',
      fixed: 'fixed',
    }
    return values[parsed.value] ? { 'table-layout': values[parsed.value] } : undefined
  }
  return undefined
}

export const captionSideRule: UtilityRule = (parsed) => {
  return CAPTION_SIDE_VALUES[parsed.base] ? { 'caption-side': CAPTION_SIDE_VALUES[parsed.base] } : undefined
}

// Interactivity utilities
export const accentColorRule: UtilityRule = (parsed, config) => {
  if (parsed.utility === 'accent' && parsed.value) {
    const color = resolveColorValue(parsed.value, config)
    if (color) return { 'accent-color': color }
  }
}

export const appearanceRule: UtilityRule = (parsed) => {
  const values: Record<string, string> = {
    'appearance-none': 'none',
    'appearance-auto': 'auto',
    // v4: opts a form control into the browser's new base styling.
    'appearance-base': 'base',
  }
  return values[parsed.base] ? { appearance: values[parsed.base] } : undefined
}


export const caretColorRule: UtilityRule = (parsed, config) => {
  if (parsed.utility === 'caret' && parsed.value) {
    const color = resolveColorValue(parsed.value, config)
    if (color) return { 'caret-color': color }
  }
}

/**
 * Which colour schemes an element renders its UI in.
 *
 * Tailwind v4 spells these `scheme-*`; the longer `color-scheme-*` form this
 * package shipped first stays accepted. `only-*` maps to CSS's `only <scheme>`.
 */
const COLOR_SCHEMES: Record<string, string> = {
  normal: 'normal',
  light: 'light',
  dark: 'dark',
  'light-dark': 'light dark',
  'only-dark': 'only dark',
  'only-light': 'only light',
}

export const colorSchemeRule: UtilityRule = (parsed) => {
  const base = parsed.base
  const suffix = base.startsWith('scheme-')
    ? base.slice(7)
    : base.startsWith('color-scheme-') ? base.slice(13) : undefined
  if (suffix === undefined)
    return undefined
  const scheme = COLOR_SCHEMES[suffix]
  return scheme ? { 'color-scheme': scheme } : undefined
}

export const fieldSizingRule: UtilityRule = (parsed) => {
  return FIELD_SIZING_VALUES[parsed.base] ? { 'field-sizing': FIELD_SIZING_VALUES[parsed.base] } : undefined
}

export const cursorRule: UtilityRule = (parsed) => {
  return CURSOR_CURSORS[parsed.base] ? { cursor: CURSOR_CURSORS[parsed.base] } : undefined
}

export const pointerEventsRule: UtilityRule = (parsed) => {
  return POINTER_EVENTS_VALUES[parsed.base] ? { 'pointer-events': POINTER_EVENTS_VALUES[parsed.base] } : undefined
}

export const resizeRule: UtilityRule = (parsed) => {
  return RESIZE_VALUES[parsed.base] ? { resize: RESIZE_VALUES[parsed.base] } : undefined
}

export const scrollBehaviorRule: UtilityRule = (parsed) => {
  return SCROLL_BEHAVIOR_VALUES[parsed.base] ? { 'scroll-behavior': SCROLL_BEHAVIOR_VALUES[parsed.base] } : undefined
}

export const scrollMarginRule: UtilityRule = (parsed, config) => {
  const directions: Record<string, string[]> = {
    'scroll-m': ['scroll-margin'],
    'scroll-mx': ['scroll-margin-left', 'scroll-margin-right'],
    'scroll-my': ['scroll-margin-top', 'scroll-margin-bottom'],
    'scroll-mt': ['scroll-margin-top'],
    'scroll-mr': ['scroll-margin-right'],
    'scroll-mb': ['scroll-margin-bottom'],
    'scroll-ml': ['scroll-margin-left'],
  }

  const props = directions[parsed.utility]
  if (!props || !parsed.value)
    return undefined

  // Theme scale, off-scale numbers (0.25rem steps), or arbitrary values;
  // unknown words previously leaked verbatim (scroll-mt-foo).
  let value: string | undefined = config.theme.spacing[parsed.value]
  if (value === undefined && parsed.arbitrary)
    value = parsed.value
  if (value === undefined && /^\d+(?:\.\d+)?$/.test(parsed.value))
    value = `${Number.parseFloat(parsed.value) * 0.25}rem`
  if (value === undefined)
    return undefined
  const result: Record<string, string> = {}
  for (const prop of props) {
    result[prop] = value
  }
  return result
}

export const scrollPaddingRule: UtilityRule = (parsed, config) => {
  const directions: Record<string, string[]> = {
    'scroll-p': ['scroll-padding'],
    'scroll-px': ['scroll-padding-left', 'scroll-padding-right'],
    'scroll-py': ['scroll-padding-top', 'scroll-padding-bottom'],
    'scroll-pt': ['scroll-padding-top'],
    'scroll-pr': ['scroll-padding-right'],
    'scroll-pb': ['scroll-padding-bottom'],
    'scroll-pl': ['scroll-padding-left'],
  }

  const props = directions[parsed.utility]
  if (!props || !parsed.value)
    return undefined

  // Theme scale, off-scale numbers (0.25rem steps), or arbitrary values;
  // unknown words previously leaked verbatim (scroll-mt-foo).
  let value: string | undefined = config.theme.spacing[parsed.value]
  if (value === undefined && parsed.arbitrary)
    value = parsed.value
  if (value === undefined && /^\d+(?:\.\d+)?$/.test(parsed.value))
    value = `${Number.parseFloat(parsed.value) * 0.25}rem`
  if (value === undefined)
    return undefined
  const result: Record<string, string> = {}
  for (const prop of props) {
    result[prop] = value
  }
  return result
}

export const scrollSnapRule: UtilityRule = (parsed) => {
  if (SCROLL_SNAP_TYPES[parsed.base]) {
    return { 'scroll-snap-type': SCROLL_SNAP_TYPES[parsed.base] }
  }

  if (SCROLL_SNAP_STRICTNESS[parsed.base]) {
    return { '--cw-scroll-snap-strictness': SCROLL_SNAP_STRICTNESS[parsed.base] }
  }

  if (SCROLL_SNAP_ALIGNS[parsed.base]) {
    return { 'scroll-snap-align': SCROLL_SNAP_ALIGNS[parsed.base] } as Record<string, string>
  }

  if (SCROLL_SNAP_STOPS[parsed.base]) {
    return { 'scroll-snap-stop': SCROLL_SNAP_STOPS[parsed.base] } as Record<string, string>
  }
}

export const touchActionRule: UtilityRule = (parsed) => {
  return TOUCH_ACTION_ACTIONS[parsed.base] ? { 'touch-action': TOUCH_ACTION_ACTIONS[parsed.base] } : undefined
}

export const userSelectRule: UtilityRule = (parsed) => {
  return USER_SELECT_SELECTS[parsed.base] ? { 'user-select': USER_SELECT_SELECTS[parsed.base] } : undefined
}

export const willChangeRule: UtilityRule = (parsed) => {
  return WILL_CHANGE_VALUES[parsed.base] ? { 'will-change': WILL_CHANGE_VALUES[parsed.base] } : undefined
}

// SVG utilities
export const fillRule: UtilityRule = (parsed, config) => {
  if (parsed.utility === 'fill' && parsed.value) {
    if (parsed.value === 'none') return { fill: 'none' }
    const color = resolveColorValue(parsed.value, config)
    if (color) return { fill: color }
  }
}

export const strokeRule: UtilityRule = (parsed, config) => {
  if (parsed.utility === 'stroke' && parsed.value) {
    if (parsed.value === 'none') return { stroke: 'none' }
    const color = resolveColorValue(parsed.value, config)
    if (color) return { stroke: color }
  }
}

export const strokeWidthRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'stroke' && parsed.value) {
    // Stroke widths are numbers or arbitrary values; other tokens are
    // stroke colors (handled by strokeColorRule) and unknown words must
    // not leak into stroke-width.
    if (parsed.arbitrary || /^\d+(?:\.\d+)?$/.test(parsed.value))
      return { 'stroke-width': parsed.value }
    return undefined
  }
}

// SVG stroke-dasharray
export const strokeDasharrayRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'stroke-dasharray' && parsed.value) {
    if (parsed.value === 'none')
      return { 'stroke-dasharray': 'none' }
    // Dash lists are numbers (or arbitrary values); words are not dashes
    if (parsed.arbitrary || /^\d+(?:\.\d+)?$/.test(parsed.value))
      return { 'stroke-dasharray': parsed.value }
    return undefined
  }
}

// SVG stroke-dashoffset
export const strokeDashoffsetRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'stroke-dashoffset' && parsed.value) {
    if (parsed.arbitrary || /^-?\d+(?:\.\d+)?$/.test(parsed.value))
      return { 'stroke-dashoffset': parsed.value }
    return undefined
  }
}

// SVG stroke-linecap
export const strokeLinecapRule: UtilityRule = (parsed) => {
  return STROKE_LINECAP_VALUES[parsed.base] ? { 'stroke-linecap': STROKE_LINECAP_VALUES[parsed.base] } : undefined
}

// SVG stroke-linejoin
export const strokeLinejoinRule: UtilityRule = (parsed) => {
  return STROKE_LINEJOIN_VALUES[parsed.base] ? { 'stroke-linejoin': STROKE_LINEJOIN_VALUES[parsed.base] } : undefined
}

// Accessibility
export const screenReaderRule: UtilityRule = (parsed) => {
  if (parsed.base === 'sr-only') {
    return {
      'position': 'absolute',
      'width': '1px',
      'height': '1px',
      'padding': '0',
      'margin': '-1px',
      'overflow': 'hidden',
      'clip': 'rect(0, 0, 0, 0)',
      'white-space': 'nowrap',
      'border-width': '0',
    } as Record<string, string>
  }
  if (parsed.base === 'not-sr-only') {
    return {
      'position': 'static',
      'width': 'auto',
      'height': 'auto',
      'padding': '0',
      'margin': '0',
      'overflow': 'visible',
      'clip': 'auto',
      'white-space': 'normal',
    } as Record<string, string>
  }
  return undefined
}

export const forcedColorAdjustRule: UtilityRule = (parsed) => {
  return FORCED_COLOR_ADJUST_VALUES[parsed.base] ? { 'forced-color-adjust': FORCED_COLOR_ADJUST_VALUES[parsed.base] } : undefined
}

export const interactivityRules: UtilityRule[] = [
  filterRule,
  backdropFilterRule,
  borderCollapseRule,
  borderSpacingRule,
  tableLayoutRule,
  captionSideRule,
  accentColorRule,
  appearanceRule,
  colorSchemeRule,
  caretColorRule,
  colorSchemeRule,
  fieldSizingRule,
  cursorRule,
  pointerEventsRule,
  resizeRule,
  scrollBehaviorRule,
  scrollMarginRule,
  scrollPaddingRule,
  scrollSnapRule,
  touchActionRule,
  userSelectRule,
  willChangeRule,
  fillRule,
  strokeRule,
  strokeWidthRule,
  strokeDasharrayRule,
  strokeDashoffsetRule,
  strokeLinecapRule,
  strokeLinejoinRule,
  screenReaderRule,
  forcedColorAdjustRule,
]
