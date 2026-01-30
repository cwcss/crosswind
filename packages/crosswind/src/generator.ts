import type { CSSRule, CrosswindConfig, ParsedClass } from './types'
import type { UtilityRule } from './rules'
import { parseClass } from './parser'
import { builtInRules } from './rules'

/**
 * Deep merge objects
 */
function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const result = { ...target }
  for (const key in source) {
    const sourceValue = source[key]
    const targetValue = result[key]
    if (sourceValue && typeof sourceValue === 'object' && !Array.isArray(sourceValue) && targetValue && typeof targetValue === 'object' && !Array.isArray(targetValue)) {
      result[key] = deepMerge(targetValue, sourceValue)
    }
    else if (sourceValue !== undefined) {
      result[key] = sourceValue as any
    }
  }
  return result
}

// =============================================================================
// STATIC UTILITY MAPS - Pre-computed at module load for O(1) lookup
// These never change and are shared across all CSSGenerator instances
// =============================================================================

// Display utilities - direct raw class to CSS value
const DISPLAY_MAP: Record<string, Record<string, string>> = {
  'block': { display: 'block' },
  'inline-block': { display: 'inline-block' },
  'inline': { display: 'inline' },
  'flex': { display: 'flex' },
  'inline-flex': { display: 'inline-flex' },
  'grid': { display: 'grid' },
  'inline-grid': { display: 'inline-grid' },
  'hidden': { display: 'none' },
  'none': { display: 'none' },
}

// Flex direction - direct raw class to CSS
const FLEX_DIRECTION_MAP: Record<string, Record<string, string>> = {
  'flex-row': { 'flex-direction': 'row' },
  'flex-row-reverse': { 'flex-direction': 'row-reverse' },
  'flex-col': { 'flex-direction': 'column' },
  'flex-col-reverse': { 'flex-direction': 'column-reverse' },
}

// Flex wrap - direct raw class to CSS
const FLEX_WRAP_MAP: Record<string, Record<string, string>> = {
  'flex-wrap': { 'flex-wrap': 'wrap' },
  'flex-wrap-reverse': { 'flex-wrap': 'wrap-reverse' },
  'flex-nowrap': { 'flex-wrap': 'nowrap' },
}

// Flex values - direct raw class to CSS
const FLEX_VALUES_MAP: Record<string, Record<string, string>> = {
  'flex-1': { flex: '1 1 0%' },
  'flex-auto': { flex: '1 1 auto' },
  'flex-initial': { flex: '0 1 auto' },
  'flex-none': { flex: 'none' },
}

// Grow/Shrink - direct raw class to CSS
const GROW_SHRINK_MAP: Record<string, Record<string, string>> = {
  'grow': { 'flex-grow': '1' },
  'grow-0': { 'flex-grow': '0' },
  'shrink': { 'flex-shrink': '1' },
  'shrink-0': { 'flex-shrink': '0' },
}

// Justify content - utility="justify", value lookup
const JUSTIFY_CONTENT_VALUES: Record<string, string> = {
  start: 'flex-start',
  end: 'flex-end',
  center: 'center',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
}

// Align items - utility="items", value lookup
const ALIGN_ITEMS_VALUES: Record<string, string> = {
  start: 'flex-start',
  end: 'flex-end',
  center: 'center',
  baseline: 'baseline',
  stretch: 'stretch',
}

// Align content - utility="content", value lookup
const ALIGN_CONTENT_VALUES: Record<string, string> = {
  normal: 'normal',
  center: 'center',
  start: 'flex-start',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
  baseline: 'baseline',
  stretch: 'stretch',
}

// Align self - utility="self", value lookup
const ALIGN_SELF_VALUES: Record<string, string> = {
  auto: 'auto',
  start: 'flex-start',
  end: 'flex-end',
  center: 'center',
  stretch: 'stretch',
  baseline: 'baseline',
}

// Border style - direct raw class to CSS
const BORDER_STYLE_MAP: Record<string, Record<string, string>> = {
  'border-solid': { 'border-style': 'solid' },
  'border-dashed': { 'border-style': 'dashed' },
  'border-dotted': { 'border-style': 'dotted' },
  'border-double': { 'border-style': 'double' },
  'border-none': { 'border-style': 'none' },
}

// Transform utilities - direct raw class to CSS
const TRANSFORM_MAP: Record<string, Record<string, string>> = {
  'transform': { transform: 'translate(var(--hw-translate-x), var(--hw-translate-y)) rotate(var(--hw-rotate)) skewX(var(--hw-skew-x)) skewY(var(--hw-skew-y)) scaleX(var(--hw-scale-x)) scaleY(var(--hw-scale-y))' },
  'transform-cpu': { transform: 'translate(var(--hw-translate-x), var(--hw-translate-y)) rotate(var(--hw-rotate)) skewX(var(--hw-skew-x)) skewY(var(--hw-skew-y)) scaleX(var(--hw-scale-x)) scaleY(var(--hw-scale-y))' },
  'transform-gpu': { transform: 'translate3d(var(--hw-translate-x), var(--hw-translate-y), 0) rotate(var(--hw-rotate)) skewX(var(--hw-skew-x)) skewY(var(--hw-skew-y)) scaleX(var(--hw-scale-x)) scaleY(var(--hw-scale-y))' },
  'transform-none': { transform: 'none' },
}

// Transition utilities - direct raw class to CSS
const TRANSITION_MAP: Record<string, Record<string, string>> = {
  'transition-none': { 'transition-property': 'none' },
  'transition-all': { 'transition-property': 'all' },
  'transition': { 'transition-property': 'color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter' },
  'transition-colors': { 'transition-property': 'color, background-color, border-color, text-decoration-color, fill, stroke' },
  'transition-opacity': { 'transition-property': 'opacity' },
  'transition-shadow': { 'transition-property': 'box-shadow' },
  'transition-transform': { 'transition-property': 'transform' },
}

// Timing functions - direct raw class to CSS
const TIMING_MAP: Record<string, Record<string, string>> = {
  'ease-linear': { 'transition-timing-function': 'linear' },
  'ease-in': { 'transition-timing-function': 'cubic-bezier(0.4, 0, 1, 1)' },
  'ease-out': { 'transition-timing-function': 'cubic-bezier(0, 0, 0.2, 1)' },
  'ease-in-out': { 'transition-timing-function': 'cubic-bezier(0.4, 0, 0.2, 1)' },
}

// Animation presets
const ANIMATION_MAP: Record<string, Record<string, string>> = {
  'animate-none': { animation: 'none' },
  'animate-spin': { animation: 'spin 1s linear infinite' },
  'animate-ping': { animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite' },
  'animate-pulse': { animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' },
  'animate-bounce': { animation: 'bounce 1s infinite' },
}

// Transform origin - utility="origin", value lookup
const TRANSFORM_ORIGIN_VALUES: Record<string, string> = {
  'center': 'center',
  'top': 'top',
  'top-right': 'top right',
  'right': 'right',
  'bottom-right': 'bottom right',
  'bottom': 'bottom',
  'bottom-left': 'bottom left',
  'left': 'left',
  'top-left': 'top left',
}

// Grid template columns - utility="grid-cols", value lookup
const GRID_COLS_VALUES: Record<string, string> = {
  '1': 'repeat(1, minmax(0, 1fr))',
  '2': 'repeat(2, minmax(0, 1fr))',
  '3': 'repeat(3, minmax(0, 1fr))',
  '4': 'repeat(4, minmax(0, 1fr))',
  '5': 'repeat(5, minmax(0, 1fr))',
  '6': 'repeat(6, minmax(0, 1fr))',
  '7': 'repeat(7, minmax(0, 1fr))',
  '8': 'repeat(8, minmax(0, 1fr))',
  '9': 'repeat(9, minmax(0, 1fr))',
  '10': 'repeat(10, minmax(0, 1fr))',
  '11': 'repeat(11, minmax(0, 1fr))',
  '12': 'repeat(12, minmax(0, 1fr))',
  'none': 'none',
  'subgrid': 'subgrid',
}

// Grid template rows - utility="grid-rows", value lookup
const GRID_ROWS_VALUES: Record<string, string> = {
  '1': 'repeat(1, minmax(0, 1fr))',
  '2': 'repeat(2, minmax(0, 1fr))',
  '3': 'repeat(3, minmax(0, 1fr))',
  '4': 'repeat(4, minmax(0, 1fr))',
  '5': 'repeat(5, minmax(0, 1fr))',
  '6': 'repeat(6, minmax(0, 1fr))',
  'none': 'none',
  'subgrid': 'subgrid',
}

// Grid column span - utility="col", value lookup
const GRID_COL_VALUES: Record<string, string> = {
  'auto': 'auto',
  'span-1': 'span 1 / span 1',
  'span-2': 'span 2 / span 2',
  'span-3': 'span 3 / span 3',
  'span-4': 'span 4 / span 4',
  'span-5': 'span 5 / span 5',
  'span-6': 'span 6 / span 6',
  'span-7': 'span 7 / span 7',
  'span-8': 'span 8 / span 8',
  'span-9': 'span 9 / span 9',
  'span-10': 'span 10 / span 10',
  'span-11': 'span 11 / span 11',
  'span-12': 'span 12 / span 12',
  'span-full': '1 / -1',
}

// Grid row span - utility="row", value lookup
const GRID_ROW_VALUES: Record<string, string> = {
  'auto': 'auto',
  'span-1': 'span 1 / span 1',
  'span-2': 'span 2 / span 2',
  'span-3': 'span 3 / span 3',
  'span-4': 'span 4 / span 4',
  'span-5': 'span 5 / span 5',
  'span-6': 'span 6 / span 6',
  'span-full': '1 / -1',
}

// Grid auto flow - utility="grid-flow", value lookup
const GRID_FLOW_VALUES: Record<string, string> = {
  'row': 'row',
  'col': 'column',
  'dense': 'dense',
  'row-dense': 'row dense',
  'col-dense': 'column dense',
}

// Auto cols/rows - utility="auto-cols"/"auto-rows", value lookup
const AUTO_COLS_ROWS_VALUES: Record<string, string> = {
  'auto': 'auto',
  'min': 'min-content',
  'max': 'max-content',
  'fr': 'minmax(0, 1fr)',
}

// Place content/items/self - utility="place", value lookup
const PLACE_CONTENT_VALUES: Record<string, string> = {
  'center': 'center',
  'start': 'start',
  'end': 'end',
  'between': 'space-between',
  'around': 'space-around',
  'evenly': 'space-evenly',
  'stretch': 'stretch',
}

// Ring utilities - direct raw class to CSS
const RING_MAP: Record<string, Record<string, string>> = {
  'ring': { 'box-shadow': '0 0 0 3px var(--hw-ring-color, rgba(59, 130, 246, 0.5))' },
  'ring-0': { 'box-shadow': '0 0 0 0px var(--hw-ring-color, rgba(59, 130, 246, 0.5))' },
  'ring-1': { 'box-shadow': '0 0 0 1px var(--hw-ring-color, rgba(59, 130, 246, 0.5))' },
  'ring-2': { 'box-shadow': '0 0 0 2px var(--hw-ring-color, rgba(59, 130, 246, 0.5))' },
  'ring-4': { 'box-shadow': '0 0 0 4px var(--hw-ring-color, rgba(59, 130, 246, 0.5))' },
  'ring-8': { 'box-shadow': '0 0 0 8px var(--hw-ring-color, rgba(59, 130, 246, 0.5))' },
  'ring-inset': { '--hw-ring-inset': 'inset' },
}

// Shadow utilities - use CSS variable system for shadow color support
// --hw-shadow holds the default shadow, --hw-shadow-colored replaces colors with var(--hw-shadow-color)
// box-shadow references --hw-shadow which can be swapped to --hw-shadow-colored by a shadow-{color} utility
const SHADOW_MAP: Record<string, Record<string, string>> = {
  'shadow-sm': {
    '--hw-shadow': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    '--hw-shadow-colored': '0 1px 2px 0 var(--hw-shadow-color)',
    'box-shadow': 'var(--hw-ring-offset-shadow, 0 0 #0000), var(--hw-ring-shadow, 0 0 #0000), var(--hw-shadow)',
  },
  'shadow': {
    '--hw-shadow': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    '--hw-shadow-colored': '0 1px 3px 0 var(--hw-shadow-color), 0 1px 2px -1px var(--hw-shadow-color)',
    'box-shadow': 'var(--hw-ring-offset-shadow, 0 0 #0000), var(--hw-ring-shadow, 0 0 #0000), var(--hw-shadow)',
  },
  'shadow-md': {
    '--hw-shadow': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    '--hw-shadow-colored': '0 4px 6px -1px var(--hw-shadow-color), 0 2px 4px -2px var(--hw-shadow-color)',
    'box-shadow': 'var(--hw-ring-offset-shadow, 0 0 #0000), var(--hw-ring-shadow, 0 0 #0000), var(--hw-shadow)',
  },
  'shadow-lg': {
    '--hw-shadow': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    '--hw-shadow-colored': '0 10px 15px -3px var(--hw-shadow-color), 0 4px 6px -4px var(--hw-shadow-color)',
    'box-shadow': 'var(--hw-ring-offset-shadow, 0 0 #0000), var(--hw-ring-shadow, 0 0 #0000), var(--hw-shadow)',
  },
  'shadow-xl': {
    '--hw-shadow': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '--hw-shadow-colored': '0 20px 25px -5px var(--hw-shadow-color), 0 8px 10px -6px var(--hw-shadow-color)',
    'box-shadow': 'var(--hw-ring-offset-shadow, 0 0 #0000), var(--hw-ring-shadow, 0 0 #0000), var(--hw-shadow)',
  },
  'shadow-2xl': {
    '--hw-shadow': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '--hw-shadow-colored': '0 25px 50px -12px var(--hw-shadow-color)',
    'box-shadow': 'var(--hw-ring-offset-shadow, 0 0 #0000), var(--hw-ring-shadow, 0 0 #0000), var(--hw-shadow)',
  },
  'shadow-inner': {
    '--hw-shadow': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    '--hw-shadow-colored': 'inset 0 2px 4px 0 var(--hw-shadow-color)',
    'box-shadow': 'var(--hw-ring-offset-shadow, 0 0 #0000), var(--hw-ring-shadow, 0 0 #0000), var(--hw-shadow)',
  },
  'shadow-none': {
    '--hw-shadow': '0 0 #0000',
    'box-shadow': 'var(--hw-ring-offset-shadow, 0 0 #0000), var(--hw-ring-shadow, 0 0 #0000), var(--hw-shadow)',
  },
}

// Border radius - direct raw class to CSS
const BORDER_RADIUS_MAP: Record<string, Record<string, string>> = {
  'rounded-none': { 'border-radius': '0px' },
  'rounded-sm': { 'border-radius': '0.125rem' },
  'rounded': { 'border-radius': '0.25rem' },
  'rounded-md': { 'border-radius': '0.375rem' },
  'rounded-lg': { 'border-radius': '0.5rem' },
  'rounded-xl': { 'border-radius': '0.75rem' },
  'rounded-2xl': { 'border-radius': '1rem' },
  'rounded-3xl': { 'border-radius': '1.5rem' },
  'rounded-full': { 'border-radius': '9999px' },
  // Corner-specific rounded utilities
  'rounded-t-none': { 'border-top-left-radius': '0px', 'border-top-right-radius': '0px' },
  'rounded-t-sm': { 'border-top-left-radius': '0.125rem', 'border-top-right-radius': '0.125rem' },
  'rounded-t-lg': { 'border-top-left-radius': '0.5rem', 'border-top-right-radius': '0.5rem' },
  'rounded-r-lg': { 'border-top-right-radius': '0.5rem', 'border-bottom-right-radius': '0.5rem' },
  'rounded-b-lg': { 'border-bottom-left-radius': '0.5rem', 'border-bottom-right-radius': '0.5rem' },
  'rounded-l-lg': { 'border-top-left-radius': '0.5rem', 'border-bottom-left-radius': '0.5rem' },
  'rounded-tl-lg': { 'border-top-left-radius': '0.5rem' },
  'rounded-tr-lg': { 'border-top-right-radius': '0.5rem' },
  'rounded-br-lg': { 'border-bottom-right-radius': '0.5rem' },
  'rounded-bl-lg': { 'border-bottom-left-radius': '0.5rem' },
}

// Border width - direct raw class to CSS
const BORDER_WIDTH_MAP: Record<string, Record<string, string>> = {
  'border': { 'border-width': '1px' },
  'border-0': { 'border-width': '0px' },
  'border-2': { 'border-width': '2px' },
  'border-4': { 'border-width': '4px' },
  'border-8': { 'border-width': '8px' },
  // Side-specific border width
  'border-t': { 'border-top-width': '1px' },
  'border-r': { 'border-right-width': '1px' },
  'border-b': { 'border-bottom-width': '1px' },
  'border-l': { 'border-left-width': '1px' },
  'border-t-0': { 'border-top-width': '0px' },
  'border-r-0': { 'border-right-width': '0px' },
  'border-b-0': { 'border-bottom-width': '0px' },
  'border-l-0': { 'border-left-width': '0px' },
  'border-t-2': { 'border-top-width': '2px' },
  'border-r-2': { 'border-right-width': '2px' },
  'border-b-2': { 'border-bottom-width': '2px' },
  'border-l-2': { 'border-left-width': '2px' },
  'border-t-4': { 'border-top-width': '4px' },
  'border-r-4': { 'border-right-width': '4px' },
  'border-b-4': { 'border-bottom-width': '4px' },
  'border-l-4': { 'border-left-width': '4px' },
  'border-x': { 'border-left-width': '1px', 'border-right-width': '1px' },
  'border-y': { 'border-top-width': '1px', 'border-bottom-width': '1px' },
  'border-x-0': { 'border-left-width': '0px', 'border-right-width': '0px' },
  'border-y-0': { 'border-top-width': '0px', 'border-bottom-width': '0px' },
  'border-x-2': { 'border-left-width': '2px', 'border-right-width': '2px' },
  'border-y-2': { 'border-top-width': '2px', 'border-bottom-width': '2px' },
}

// Ring offset - direct raw class to CSS
const RING_OFFSET_MAP: Record<string, Record<string, string>> = {
  'ring-offset-0': { '--hw-ring-offset-width': '0px' },
  'ring-offset-1': { '--hw-ring-offset-width': '1px' },
  'ring-offset-2': { '--hw-ring-offset-width': '2px' },
  'ring-offset-4': { '--hw-ring-offset-width': '4px' },
  'ring-offset-8': { '--hw-ring-offset-width': '8px' },
}

// Opacity utilities - direct raw class to CSS
const OPACITY_MAP: Record<string, Record<string, string>> = {
  'opacity-0': { opacity: '0' },
  'opacity-5': { opacity: '0.05' },
  'opacity-10': { opacity: '0.1' },
  'opacity-20': { opacity: '0.2' },
  'opacity-25': { opacity: '0.25' },
  'opacity-30': { opacity: '0.3' },
  'opacity-40': { opacity: '0.4' },
  'opacity-50': { opacity: '0.5' },
  'opacity-60': { opacity: '0.6' },
  'opacity-70': { opacity: '0.7' },
  'opacity-75': { opacity: '0.75' },
  'opacity-80': { opacity: '0.8' },
  'opacity-90': { opacity: '0.9' },
  'opacity-95': { opacity: '0.95' },
  'opacity-100': { opacity: '1' },
}

// Pre-computed spacing values for O(1) lookup
const SPACING_VALUES: Record<string, string> = {
  '0': '0',
  'px': '1px',
  '0.5': '0.125rem',
  '1': '0.25rem',
  '1.5': '0.375rem',
  '2': '0.5rem',
  '2.5': '0.625rem',
  '3': '0.75rem',
  '3.5': '0.875rem',
  '4': '1rem',
  '5': '1.25rem',
  '6': '1.5rem',
  '7': '1.75rem',
  '8': '2rem',
  '9': '2.25rem',
  '10': '2.5rem',
  '11': '2.75rem',
  '12': '3rem',
  '14': '3.5rem',
  '16': '4rem',
  '20': '5rem',
  '24': '6rem',
  '28': '7rem',
  '32': '8rem',
  '36': '9rem',
  '40': '10rem',
  '44': '11rem',
  '48': '12rem',
  '52': '13rem',
  '56': '14rem',
  '60': '15rem',
  '64': '16rem',
  '72': '18rem',
  '80': '20rem',
  '96': '24rem',
}

// Size values (spacing + special values)
const SIZE_VALUES: Record<string, string> = {
  ...SPACING_VALUES,
  'auto': 'auto',
  'full': '100%',
  'screen': '100vw',
  'min': 'min-content',
  'max': 'max-content',
  'fit': 'fit-content',
  // Common fractions (using same precision as original implementation)
  '1/2': '50%',
  '1/3': '33.33333333333333%',
  '2/3': '66.66666666666666%',
  '1/4': '25%',
  '2/4': '50%',
  '3/4': '75%',
  '1/5': '20%',
  '2/5': '40%',
  '3/5': '60%',
  '4/5': '80%',
  '1/6': '16.666666666666664%',
  '2/6': '33.33333333333333%',
  '3/6': '50%',
  '4/6': '66.66666666666666%',
  '5/6': '83.33333333333334%',
}

// Pre-computed color values for common Tailwind colors (O(1) lookup)
// These are the most commonly used colors in the benchmark
const COMMON_COLORS: Record<string, string> = {
  // Gray
  'gray-50': 'oklch(98.5% 0.002 247.839)', 'gray-100': 'oklch(96.7% 0.003 264.542)',
  'gray-200': 'oklch(92.8% 0.006 264.531)', 'gray-300': 'oklch(87.2% 0.01 258.338)',
  'gray-400': 'oklch(70.7% 0.022 261.325)', 'gray-500': 'oklch(55.1% 0.027 264.364)',
  'gray-600': 'oklch(44.6% 0.03 256.802)', 'gray-700': 'oklch(37.3% 0.034 259.733)',
  'gray-800': 'oklch(27.8% 0.033 256.848)', 'gray-900': 'oklch(21% 0.034 264.665)',
  'gray-950': 'oklch(13% 0.028 261.692)',
  // Red
  'red-50': 'oklch(97.1% 0.013 17.38)', 'red-100': 'oklch(93.6% 0.032 17.717)',
  'red-200': 'oklch(88.5% 0.062 18.334)', 'red-300': 'oklch(80.8% 0.114 19.571)',
  'red-400': 'oklch(70.4% 0.191 22.216)', 'red-500': 'oklch(63.7% 0.237 25.331)',
  'red-600': 'oklch(57.7% 0.245 27.325)', 'red-700': 'oklch(50.5% 0.213 27.518)',
  'red-800': 'oklch(44.4% 0.177 26.899)', 'red-900': 'oklch(39.6% 0.141 25.723)',
  'red-950': 'oklch(25.8% 0.092 26.042)',
  // Blue
  'blue-50': 'oklch(97% 0.014 254.604)', 'blue-100': 'oklch(93.2% 0.032 255.585)',
  'blue-200': 'oklch(88.2% 0.059 254.128)', 'blue-300': 'oklch(80.9% 0.105 251.813)',
  'blue-400': 'oklch(70.7% 0.165 254.624)', 'blue-500': 'oklch(62.3% 0.214 259.815)',
  'blue-600': 'oklch(54.6% 0.245 262.881)', 'blue-700': 'oklch(48.8% 0.243 264.376)',
  'blue-800': 'oklch(42.4% 0.199 265.638)', 'blue-900': 'oklch(37.9% 0.146 265.522)',
  'blue-950': 'oklch(28.2% 0.091 267.935)',
  // Green
  'green-50': 'oklch(98.2% 0.018 155.826)', 'green-100': 'oklch(96.2% 0.044 156.743)',
  'green-200': 'oklch(92.5% 0.084 155.995)', 'green-300': 'oklch(87.1% 0.15 154.449)',
  'green-400': 'oklch(79.2% 0.209 151.711)', 'green-500': 'oklch(72.3% 0.219 149.579)',
  'green-600': 'oklch(62.7% 0.194 149.214)', 'green-700': 'oklch(52.7% 0.154 150.069)',
  'green-800': 'oklch(44.8% 0.119 151.328)', 'green-900': 'oklch(39.3% 0.095 152.535)',
  'green-950': 'oklch(26.6% 0.065 152.934)',
  // Yellow
  'yellow-50': 'oklch(98.7% 0.026 102.212)', 'yellow-100': 'oklch(97.3% 0.071 103.193)',
  'yellow-200': 'oklch(94.5% 0.129 101.54)', 'yellow-300': 'oklch(90.5% 0.182 98.111)',
  'yellow-400': 'oklch(85.2% 0.199 91.936)', 'yellow-500': 'oklch(79.5% 0.184 86.047)',
  'yellow-600': 'oklch(68.1% 0.162 75.834)', 'yellow-700': 'oklch(55.4% 0.135 66.442)',
  'yellow-800': 'oklch(47.6% 0.114 61.907)', 'yellow-900': 'oklch(42.1% 0.095 57.708)',
  'yellow-950': 'oklch(28.6% 0.066 53.813)',
  // Purple
  'purple-50': 'oklch(97.7% 0.014 308.299)', 'purple-100': 'oklch(94.6% 0.033 307.174)',
  'purple-200': 'oklch(90.2% 0.063 306.703)', 'purple-300': 'oklch(82.7% 0.119 306.383)',
  'purple-400': 'oklch(71.4% 0.203 305.504)', 'purple-500': 'oklch(62.7% 0.265 303.9)',
  'purple-600': 'oklch(55.8% 0.288 302.321)', 'purple-700': 'oklch(49.6% 0.265 301.924)',
  'purple-800': 'oklch(43.8% 0.218 303.724)', 'purple-900': 'oklch(38.1% 0.176 304.987)',
  'purple-950': 'oklch(29.1% 0.149 302.717)',
  // Pink
  'pink-50': 'oklch(97.1% 0.014 343.198)', 'pink-100': 'oklch(94.8% 0.028 342.258)',
  'pink-200': 'oklch(89.9% 0.061 343.231)', 'pink-300': 'oklch(82.3% 0.116 346.018)',
  'pink-400': 'oklch(71.8% 0.202 349.761)', 'pink-500': 'oklch(65.6% 0.241 354.308)',
  'pink-600': 'oklch(59.2% 0.249 0.584)', 'pink-700': 'oklch(52.5% 0.223 3.958)',
  'pink-800': 'oklch(45.9% 0.187 3.815)', 'pink-900': 'oklch(40.8% 0.153 2.432)',
  'pink-950': 'oklch(28.4% 0.109 3.907)',
  // Indigo
  'indigo-50': 'oklch(96.2% 0.018 272.314)', 'indigo-100': 'oklch(93% 0.034 272.788)',
  'indigo-200': 'oklch(87% 0.065 274.039)', 'indigo-300': 'oklch(78.5% 0.115 274.713)',
  'indigo-400': 'oklch(67.3% 0.182 276.935)', 'indigo-500': 'oklch(58.5% 0.233 277.117)',
  'indigo-600': 'oklch(51.1% 0.262 276.966)', 'indigo-700': 'oklch(45.7% 0.24 277.023)',
  'indigo-800': 'oklch(39.8% 0.195 277.366)', 'indigo-900': 'oklch(35.9% 0.144 278.697)',
  'indigo-950': 'oklch(26.9% 0.096 280.79)',
  // Cyan
  'cyan-50': 'oklch(98.4% 0.019 200.873)', 'cyan-100': 'oklch(95.6% 0.045 203.388)',
  'cyan-200': 'oklch(91.7% 0.08 205.041)', 'cyan-300': 'oklch(86.5% 0.127 207.078)',
  'cyan-400': 'oklch(78.9% 0.154 211.53)', 'cyan-500': 'oklch(71.5% 0.143 215.221)',
  'cyan-600': 'oklch(60.9% 0.126 221.723)', 'cyan-700': 'oklch(52% 0.105 223.128)',
  'cyan-800': 'oklch(45% 0.085 224.283)', 'cyan-900': 'oklch(39.8% 0.07 227.392)',
  'cyan-950': 'oklch(30.2% 0.056 229.695)',
  // Emerald
  'emerald-50': 'oklch(97.9% 0.021 166.113)', 'emerald-100': 'oklch(95% 0.052 163.051)',
  'emerald-200': 'oklch(90.5% 0.093 164.15)', 'emerald-300': 'oklch(84.5% 0.143 164.978)',
  'emerald-400': 'oklch(76.5% 0.177 163.223)', 'emerald-500': 'oklch(69.6% 0.17 162.48)',
  'emerald-600': 'oklch(59.6% 0.145 163.225)', 'emerald-700': 'oklch(50.8% 0.118 165.612)',
  'emerald-800': 'oklch(43.2% 0.095 166.913)', 'emerald-900': 'oklch(37.8% 0.077 168.94)',
  'emerald-950': 'oklch(26.2% 0.051 172.552)',
  // Special colors
  'white': '#fff', 'black': '#000', 'transparent': 'transparent', 'current': 'currentColor',
}

// =============================================================================
// TYPOGRAPHY UTILITIES - Fast path for font/text utilities
// =============================================================================

// Font weight - direct raw class to CSS
const FONT_WEIGHT_MAP: Record<string, Record<string, string>> = {
  'font-thin': { 'font-weight': '100' },
  'font-extralight': { 'font-weight': '200' },
  'font-light': { 'font-weight': '300' },
  'font-normal': { 'font-weight': '400' },
  'font-medium': { 'font-weight': '500' },
  'font-semibold': { 'font-weight': '600' },
  'font-bold': { 'font-weight': '700' },
  'font-extrabold': { 'font-weight': '800' },
  'font-black': { 'font-weight': '900' },
}

// Font style - direct raw class to CSS
const FONT_STYLE_MAP: Record<string, Record<string, string>> = {
  'italic': { 'font-style': 'italic' },
  'not-italic': { 'font-style': 'normal' },
}

// Text transform - direct raw class to CSS
const TEXT_TRANSFORM_MAP: Record<string, Record<string, string>> = {
  'uppercase': { 'text-transform': 'uppercase' },
  'lowercase': { 'text-transform': 'lowercase' },
  'capitalize': { 'text-transform': 'capitalize' },
  'normal-case': { 'text-transform': 'none' },
}

// Text decoration line - direct raw class to CSS
const TEXT_DECORATION_MAP: Record<string, Record<string, string>> = {
  'underline': { 'text-decoration-line': 'underline' },
  'overline': { 'text-decoration-line': 'overline' },
  'line-through': { 'text-decoration-line': 'line-through' },
  'no-underline': { 'text-decoration-line': 'none' },
}

// Text decoration style - direct raw class to CSS
const TEXT_DECORATION_STYLE_MAP: Record<string, Record<string, string>> = {
  'decoration-solid': { 'text-decoration-style': 'solid' },
  'decoration-double': { 'text-decoration-style': 'double' },
  'decoration-dotted': { 'text-decoration-style': 'dotted' },
  'decoration-dashed': { 'text-decoration-style': 'dashed' },
  'decoration-wavy': { 'text-decoration-style': 'wavy' },
}

// Text align - direct raw class to CSS
const TEXT_ALIGN_MAP: Record<string, Record<string, string>> = {
  'text-left': { 'text-align': 'left' },
  'text-center': { 'text-align': 'center' },
  'text-right': { 'text-align': 'right' },
  'text-justify': { 'text-align': 'justify' },
  'text-start': { 'text-align': 'start' },
  'text-end': { 'text-align': 'end' },
}

// Text overflow - direct raw class to CSS
const TEXT_OVERFLOW_MAP: Record<string, Record<string, string>> = {
  'truncate': { 'overflow': 'hidden', 'text-overflow': 'ellipsis', 'white-space': 'nowrap' },
  'text-ellipsis': { 'text-overflow': 'ellipsis' },
  'text-clip': { 'text-overflow': 'clip' },
}

// Text wrap - direct raw class to CSS
const TEXT_WRAP_MAP: Record<string, Record<string, string>> = {
  'text-wrap': { 'text-wrap': 'wrap' },
  'text-nowrap': { 'text-wrap': 'nowrap' },
  'text-balance': { 'text-wrap': 'balance' },
  'text-pretty': { 'text-wrap': 'pretty' },
}

// Whitespace - direct raw class to CSS
const WHITESPACE_MAP: Record<string, Record<string, string>> = {
  'whitespace-normal': { 'white-space': 'normal' },
  'whitespace-nowrap': { 'white-space': 'nowrap' },
  'whitespace-pre': { 'white-space': 'pre' },
  'whitespace-pre-line': { 'white-space': 'pre-line' },
  'whitespace-pre-wrap': { 'white-space': 'pre-wrap' },
  'whitespace-break-spaces': { 'white-space': 'break-spaces' },
}

// Word break - direct raw class to CSS
const WORD_BREAK_MAP: Record<string, Record<string, string>> = {
  'break-normal': { 'overflow-wrap': 'normal', 'word-break': 'normal' },
  'break-words': { 'overflow-wrap': 'break-word' },
  'break-all': { 'word-break': 'break-all' },
  'break-keep': { 'word-break': 'keep-all' },
}

// Vertical align - direct raw class to CSS
const VERTICAL_ALIGN_MAP: Record<string, Record<string, string>> = {
  'align-baseline': { 'vertical-align': 'baseline' },
  'align-top': { 'vertical-align': 'top' },
  'align-middle': { 'vertical-align': 'middle' },
  'align-bottom': { 'vertical-align': 'bottom' },
  'align-text-top': { 'vertical-align': 'text-top' },
  'align-text-bottom': { 'vertical-align': 'text-bottom' },
  'align-sub': { 'vertical-align': 'sub' },
  'align-super': { 'vertical-align': 'super' },
}

// List style type - direct raw class to CSS
const LIST_STYLE_MAP: Record<string, Record<string, string>> = {
  'list-none': { 'list-style-type': 'none' },
  'list-disc': { 'list-style-type': 'disc' },
  'list-decimal': { 'list-style-type': 'decimal' },
  'list-inside': { 'list-style-position': 'inside' },
  'list-outside': { 'list-style-position': 'outside' },
}

// Hyphens - direct raw class to CSS
const HYPHENS_MAP: Record<string, Record<string, string>> = {
  'hyphens-none': { hyphens: 'none' },
  'hyphens-manual': { hyphens: 'manual' },
  'hyphens-auto': { hyphens: 'auto' },
}

// =============================================================================
// LAYOUT UTILITIES - Fast path for layout/positioning
// =============================================================================

// Position - direct raw class to CSS
const POSITION_MAP: Record<string, Record<string, string>> = {
  'static': { position: 'static' },
  'fixed': { position: 'fixed' },
  'absolute': { position: 'absolute' },
  'relative': { position: 'relative' },
  'sticky': { position: 'sticky' },
}

// Visibility - direct raw class to CSS
const VISIBILITY_MAP: Record<string, Record<string, string>> = {
  'visible': { visibility: 'visible' },
  'invisible': { visibility: 'hidden' },
  'collapse': { visibility: 'collapse' },
}

// Float - direct raw class to CSS
const FLOAT_MAP: Record<string, Record<string, string>> = {
  'float-left': { float: 'left' },
  'float-right': { float: 'right' },
  'float-none': { float: 'none' },
  'float-start': { float: 'inline-start' },
  'float-end': { float: 'inline-end' },
}

// Clear - direct raw class to CSS
const CLEAR_MAP: Record<string, Record<string, string>> = {
  'clear-left': { clear: 'left' },
  'clear-right': { clear: 'right' },
  'clear-both': { clear: 'both' },
  'clear-none': { clear: 'none' },
  'clear-start': { clear: 'inline-start' },
  'clear-end': { clear: 'inline-end' },
}

// Isolation - direct raw class to CSS
const ISOLATION_MAP: Record<string, Record<string, string>> = {
  'isolate': { isolation: 'isolate' },
  'isolation-auto': { isolation: 'auto' },
}

// Object fit - direct raw class to CSS
const OBJECT_FIT_MAP: Record<string, Record<string, string>> = {
  'object-contain': { 'object-fit': 'contain' },
  'object-cover': { 'object-fit': 'cover' },
  'object-fill': { 'object-fit': 'fill' },
  'object-none': { 'object-fit': 'none' },
  'object-scale-down': { 'object-fit': 'scale-down' },
}

// Object position - direct raw class to CSS
const OBJECT_POSITION_MAP: Record<string, Record<string, string>> = {
  'object-bottom': { 'object-position': 'bottom' },
  'object-center': { 'object-position': 'center' },
  'object-left': { 'object-position': 'left' },
  'object-left-bottom': { 'object-position': 'left bottom' },
  'object-left-top': { 'object-position': 'left top' },
  'object-right': { 'object-position': 'right' },
  'object-right-bottom': { 'object-position': 'right bottom' },
  'object-right-top': { 'object-position': 'right top' },
  'object-top': { 'object-position': 'top' },
}

// Overflow - direct raw class to CSS
const OVERFLOW_MAP: Record<string, Record<string, string>> = {
  'overflow-auto': { overflow: 'auto' },
  'overflow-hidden': { overflow: 'hidden' },
  'overflow-clip': { overflow: 'clip' },
  'overflow-visible': { overflow: 'visible' },
  'overflow-scroll': { overflow: 'scroll' },
  'overflow-x-auto': { 'overflow-x': 'auto' },
  'overflow-x-hidden': { 'overflow-x': 'hidden' },
  'overflow-x-clip': { 'overflow-x': 'clip' },
  'overflow-x-visible': { 'overflow-x': 'visible' },
  'overflow-x-scroll': { 'overflow-x': 'scroll' },
  'overflow-y-auto': { 'overflow-y': 'auto' },
  'overflow-y-hidden': { 'overflow-y': 'hidden' },
  'overflow-y-clip': { 'overflow-y': 'clip' },
  'overflow-y-visible': { 'overflow-y': 'visible' },
  'overflow-y-scroll': { 'overflow-y': 'scroll' },
}

// Overscroll - direct raw class to CSS
const OVERSCROLL_MAP: Record<string, Record<string, string>> = {
  'overscroll-auto': { 'overscroll-behavior': 'auto' },
  'overscroll-contain': { 'overscroll-behavior': 'contain' },
  'overscroll-none': { 'overscroll-behavior': 'none' },
  'overscroll-x-auto': { 'overscroll-behavior-x': 'auto' },
  'overscroll-x-contain': { 'overscroll-behavior-x': 'contain' },
  'overscroll-x-none': { 'overscroll-behavior-x': 'none' },
  'overscroll-y-auto': { 'overscroll-behavior-y': 'auto' },
  'overscroll-y-contain': { 'overscroll-behavior-y': 'contain' },
  'overscroll-y-none': { 'overscroll-behavior-y': 'none' },
}

// Z-index - direct raw class to CSS
const Z_INDEX_MAP: Record<string, Record<string, string>> = {
  'z-0': { 'z-index': '0' },
  'z-10': { 'z-index': '10' },
  'z-20': { 'z-index': '20' },
  'z-30': { 'z-index': '30' },
  'z-40': { 'z-index': '40' },
  'z-50': { 'z-index': '50' },
  'z-auto': { 'z-index': 'auto' },
}

// Aspect ratio - direct raw class to CSS
const ASPECT_RATIO_MAP: Record<string, Record<string, string>> = {
  'aspect-auto': { 'aspect-ratio': 'auto' },
  'aspect-square': { 'aspect-ratio': '1 / 1' },
  'aspect-video': { 'aspect-ratio': '16 / 9' },
}

// Box sizing - direct raw class to CSS
const BOX_SIZING_MAP: Record<string, Record<string, string>> = {
  'box-border': { 'box-sizing': 'border-box' },
  'box-content': { 'box-sizing': 'content-box' },
}

// Box decoration break - direct raw class to CSS
const BOX_DECORATION_MAP: Record<string, Record<string, string>> = {
  'box-decoration-clone': { 'box-decoration-break': 'clone' },
  'box-decoration-slice': { 'box-decoration-break': 'slice' },
}

// =============================================================================
// BACKGROUND UTILITIES - Fast path for background
// =============================================================================

// Background attachment - direct raw class to CSS
const BG_ATTACHMENT_MAP: Record<string, Record<string, string>> = {
  'bg-fixed': { 'background-attachment': 'fixed' },
  'bg-local': { 'background-attachment': 'local' },
  'bg-scroll': { 'background-attachment': 'scroll' },
}

// Background clip - direct raw class to CSS
const BG_CLIP_MAP: Record<string, Record<string, string>> = {
  'bg-clip-border': { 'background-clip': 'border-box' },
  'bg-clip-padding': { 'background-clip': 'padding-box' },
  'bg-clip-content': { 'background-clip': 'content-box' },
  'bg-clip-text': { 'background-clip': 'text', '-webkit-background-clip': 'text' },
}

// Background origin - direct raw class to CSS
const BG_ORIGIN_MAP: Record<string, Record<string, string>> = {
  'bg-origin-border': { 'background-origin': 'border-box' },
  'bg-origin-padding': { 'background-origin': 'padding-box' },
  'bg-origin-content': { 'background-origin': 'content-box' },
}

// Background position - direct raw class to CSS
const BG_POSITION_MAP: Record<string, Record<string, string>> = {
  'bg-bottom': { 'background-position': 'bottom' },
  'bg-center': { 'background-position': 'center' },
  'bg-left': { 'background-position': 'left' },
  'bg-left-bottom': { 'background-position': 'left bottom' },
  'bg-left-top': { 'background-position': 'left top' },
  'bg-right': { 'background-position': 'right' },
  'bg-right-bottom': { 'background-position': 'right bottom' },
  'bg-right-top': { 'background-position': 'right top' },
  'bg-top': { 'background-position': 'top' },
}

// Background repeat - direct raw class to CSS
const BG_REPEAT_MAP: Record<string, Record<string, string>> = {
  'bg-repeat': { 'background-repeat': 'repeat' },
  'bg-no-repeat': { 'background-repeat': 'no-repeat' },
  'bg-repeat-x': { 'background-repeat': 'repeat-x' },
  'bg-repeat-y': { 'background-repeat': 'repeat-y' },
  'bg-repeat-round': { 'background-repeat': 'round' },
  'bg-repeat-space': { 'background-repeat': 'space' },
}

// Background size - direct raw class to CSS
const BG_SIZE_MAP: Record<string, Record<string, string>> = {
  'bg-auto': { 'background-size': 'auto' },
  'bg-cover': { 'background-size': 'cover' },
  'bg-contain': { 'background-size': 'contain' },
}

// Gradient direction - direct raw class to CSS
const GRADIENT_MAP: Record<string, Record<string, string>> = {
  'bg-none': { 'background-image': 'none' },
  'bg-gradient-to-t': { 'background-image': 'linear-gradient(to top, var(--hw-gradient-stops))' },
  'bg-gradient-to-tr': { 'background-image': 'linear-gradient(to top right, var(--hw-gradient-stops))' },
  'bg-gradient-to-r': { 'background-image': 'linear-gradient(to right, var(--hw-gradient-stops))' },
  'bg-gradient-to-br': { 'background-image': 'linear-gradient(to bottom right, var(--hw-gradient-stops))' },
  'bg-gradient-to-b': { 'background-image': 'linear-gradient(to bottom, var(--hw-gradient-stops))' },
  'bg-gradient-to-bl': { 'background-image': 'linear-gradient(to bottom left, var(--hw-gradient-stops))' },
  'bg-gradient-to-l': { 'background-image': 'linear-gradient(to left, var(--hw-gradient-stops))' },
  'bg-gradient-to-tl': { 'background-image': 'linear-gradient(to top left, var(--hw-gradient-stops))' },
}

// =============================================================================
// INTERACTIVITY UTILITIES - Fast path for cursor/pointer/etc
// =============================================================================

// Cursor - direct raw class to CSS
const CURSOR_MAP: Record<string, Record<string, string>> = {
  'cursor-auto': { cursor: 'auto' },
  'cursor-default': { cursor: 'default' },
  'cursor-pointer': { cursor: 'pointer' },
  'cursor-wait': { cursor: 'wait' },
  'cursor-text': { cursor: 'text' },
  'cursor-move': { cursor: 'move' },
  'cursor-help': { cursor: 'help' },
  'cursor-not-allowed': { cursor: 'not-allowed' },
  'cursor-none': { cursor: 'none' },
  'cursor-context-menu': { cursor: 'context-menu' },
  'cursor-progress': { cursor: 'progress' },
  'cursor-cell': { cursor: 'cell' },
  'cursor-crosshair': { cursor: 'crosshair' },
  'cursor-vertical-text': { cursor: 'vertical-text' },
  'cursor-alias': { cursor: 'alias' },
  'cursor-copy': { cursor: 'copy' },
  'cursor-no-drop': { cursor: 'no-drop' },
  'cursor-grab': { cursor: 'grab' },
  'cursor-grabbing': { cursor: 'grabbing' },
  'cursor-all-scroll': { cursor: 'all-scroll' },
  'cursor-col-resize': { cursor: 'col-resize' },
  'cursor-row-resize': { cursor: 'row-resize' },
  'cursor-n-resize': { cursor: 'n-resize' },
  'cursor-e-resize': { cursor: 'e-resize' },
  'cursor-s-resize': { cursor: 's-resize' },
  'cursor-w-resize': { cursor: 'w-resize' },
  'cursor-ne-resize': { cursor: 'ne-resize' },
  'cursor-nw-resize': { cursor: 'nw-resize' },
  'cursor-se-resize': { cursor: 'se-resize' },
  'cursor-sw-resize': { cursor: 'sw-resize' },
  'cursor-ew-resize': { cursor: 'ew-resize' },
  'cursor-ns-resize': { cursor: 'ns-resize' },
  'cursor-nesw-resize': { cursor: 'nesw-resize' },
  'cursor-nwse-resize': { cursor: 'nwse-resize' },
  'cursor-zoom-in': { cursor: 'zoom-in' },
  'cursor-zoom-out': { cursor: 'zoom-out' },
}

// Pointer events - direct raw class to CSS
const POINTER_EVENTS_MAP: Record<string, Record<string, string>> = {
  'pointer-events-none': { 'pointer-events': 'none' },
  'pointer-events-auto': { 'pointer-events': 'auto' },
}

// Resize - direct raw class to CSS
const RESIZE_MAP: Record<string, Record<string, string>> = {
  'resize-none': { resize: 'none' },
  'resize-y': { resize: 'vertical' },
  'resize-x': { resize: 'horizontal' },
  'resize': { resize: 'both' },
}

// User select - direct raw class to CSS
const USER_SELECT_MAP: Record<string, Record<string, string>> = {
  'select-none': { 'user-select': 'none' },
  'select-text': { 'user-select': 'text' },
  'select-all': { 'user-select': 'all' },
  'select-auto': { 'user-select': 'auto' },
}

// Scroll behavior - direct raw class to CSS
const SCROLL_BEHAVIOR_MAP: Record<string, Record<string, string>> = {
  'scroll-auto': { 'scroll-behavior': 'auto' },
  'scroll-smooth': { 'scroll-behavior': 'smooth' },
}

// Scroll snap type - direct raw class to CSS
const SCROLL_SNAP_MAP: Record<string, Record<string, string>> = {
  'snap-none': { 'scroll-snap-type': 'none' },
  'snap-x': { 'scroll-snap-type': 'x var(--hw-scroll-snap-strictness)' },
  'snap-y': { 'scroll-snap-type': 'y var(--hw-scroll-snap-strictness)' },
  'snap-both': { 'scroll-snap-type': 'both var(--hw-scroll-snap-strictness)' },
  'snap-mandatory': { '--hw-scroll-snap-strictness': 'mandatory' },
  'snap-proximity': { '--hw-scroll-snap-strictness': 'proximity' },
  'snap-start': { 'scroll-snap-align': 'start' },
  'snap-end': { 'scroll-snap-align': 'end' },
  'snap-center': { 'scroll-snap-align': 'center' },
  'snap-align-none': { 'scroll-snap-align': 'none' },
  'snap-normal': { 'scroll-snap-stop': 'normal' },
  'snap-always': { 'scroll-snap-stop': 'always' },
}

// Touch action - direct raw class to CSS
const TOUCH_ACTION_MAP: Record<string, Record<string, string>> = {
  'touch-auto': { 'touch-action': 'auto' },
  'touch-none': { 'touch-action': 'none' },
  'touch-pan-x': { 'touch-action': 'pan-x' },
  'touch-pan-left': { 'touch-action': 'pan-left' },
  'touch-pan-right': { 'touch-action': 'pan-right' },
  'touch-pan-y': { 'touch-action': 'pan-y' },
  'touch-pan-up': { 'touch-action': 'pan-up' },
  'touch-pan-down': { 'touch-action': 'pan-down' },
  'touch-pinch-zoom': { 'touch-action': 'pinch-zoom' },
  'touch-manipulation': { 'touch-action': 'manipulation' },
}

// Will change - direct raw class to CSS
const WILL_CHANGE_MAP: Record<string, Record<string, string>> = {
  'will-change-auto': { 'will-change': 'auto' },
  'will-change-scroll': { 'will-change': 'scroll-position' },
  'will-change-contents': { 'will-change': 'contents' },
  'will-change-transform': { 'will-change': 'transform' },
}

// Appearance - direct raw class to CSS
const APPEARANCE_MAP: Record<string, Record<string, string>> = {
  'appearance-none': { appearance: 'none' },
  'appearance-auto': { appearance: 'auto' },
}

// =============================================================================
// TABLE UTILITIES - Fast path for table styling
// =============================================================================

// Border collapse - direct raw class to CSS
const BORDER_COLLAPSE_MAP: Record<string, Record<string, string>> = {
  'border-collapse': { 'border-collapse': 'collapse' },
  'border-separate': { 'border-collapse': 'separate' },
}

// Table layout - direct raw class to CSS
const TABLE_LAYOUT_MAP: Record<string, Record<string, string>> = {
  'table-auto': { 'table-layout': 'auto' },
  'table-fixed': { 'table-layout': 'fixed' },
}

// Caption side - direct raw class to CSS
const CAPTION_SIDE_MAP: Record<string, Record<string, string>> = {
  'caption-top': { 'caption-side': 'top' },
  'caption-bottom': { 'caption-side': 'bottom' },
}

// =============================================================================
// ACCESSIBILITY UTILITIES - Fast path for a11y
// =============================================================================

// Screen reader only - direct raw class to CSS
const SR_ONLY_MAP: Record<string, Record<string, string>> = {
  'sr-only': {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: '0',
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    'white-space': 'nowrap',
    'border-width': '0',
  },
  'not-sr-only': {
    position: 'static',
    width: 'auto',
    height: 'auto',
    padding: '0',
    margin: '0',
    overflow: 'visible',
    clip: 'auto',
    'white-space': 'normal',
  },
}

// Forced color adjust - direct raw class to CSS
const FORCED_COLOR_MAP: Record<string, Record<string, string>> = {
  'forced-color-adjust-auto': { 'forced-color-adjust': 'auto' },
  'forced-color-adjust-none': { 'forced-color-adjust': 'none' },
}

// =============================================================================
// SVG UTILITIES - Fast path for SVG
// =============================================================================

// Fill - direct raw class to CSS
const FILL_MAP: Record<string, Record<string, string>> = {
  'fill-none': { fill: 'none' },
  'fill-current': { fill: 'currentColor' },
  'fill-inherit': { fill: 'inherit' },
}

// Stroke - direct raw class to CSS
const STROKE_MAP: Record<string, Record<string, string>> = {
  'stroke-none': { stroke: 'none' },
  'stroke-current': { stroke: 'currentColor' },
  'stroke-inherit': { stroke: 'inherit' },
  'stroke-0': { 'stroke-width': '0' },
  'stroke-1': { 'stroke-width': '1' },
  'stroke-2': { 'stroke-width': '2' },
}

// Stroke linecap - direct raw class to CSS
const STROKE_LINECAP_MAP: Record<string, Record<string, string>> = {
  'stroke-linecap-butt': { 'stroke-linecap': 'butt' },
  'stroke-linecap-round': { 'stroke-linecap': 'round' },
  'stroke-linecap-square': { 'stroke-linecap': 'square' },
}

// Stroke linejoin - direct raw class to CSS
const STROKE_LINEJOIN_MAP: Record<string, Record<string, string>> = {
  'stroke-linejoin-miter': { 'stroke-linejoin': 'miter' },
  'stroke-linejoin-round': { 'stroke-linejoin': 'round' },
  'stroke-linejoin-bevel': { 'stroke-linejoin': 'bevel' },
}

// =============================================================================
// FILTER UTILITIES - Fast path for filters
// =============================================================================

// Blur - direct raw class to CSS
const BLUR_MAP: Record<string, Record<string, string>> = {
  'blur-none': { filter: 'blur(0)' },
  'blur-sm': { filter: 'blur(4px)' },
  'blur': { filter: 'blur(8px)' },
  'blur-md': { filter: 'blur(12px)' },
  'blur-lg': { filter: 'blur(16px)' },
  'blur-xl': { filter: 'blur(24px)' },
  'blur-2xl': { filter: 'blur(40px)' },
  'blur-3xl': { filter: 'blur(64px)' },
}

// Backdrop blur - direct raw class to CSS
const BACKDROP_BLUR_MAP: Record<string, Record<string, string>> = {
  'backdrop-blur-none': { 'backdrop-filter': 'blur(0)' },
  'backdrop-blur-sm': { 'backdrop-filter': 'blur(4px)' },
  'backdrop-blur': { 'backdrop-filter': 'blur(8px)' },
  'backdrop-blur-md': { 'backdrop-filter': 'blur(12px)' },
  'backdrop-blur-lg': { 'backdrop-filter': 'blur(16px)' },
  'backdrop-blur-xl': { 'backdrop-filter': 'blur(24px)' },
  'backdrop-blur-2xl': { 'backdrop-filter': 'blur(40px)' },
  'backdrop-blur-3xl': { 'backdrop-filter': 'blur(64px)' },
}

// Grayscale/invert/sepia - direct raw class to CSS
const FILTER_TOGGLE_MAP: Record<string, Record<string, string>> = {
  'grayscale-0': { filter: 'grayscale(0)' },
  'grayscale': { filter: 'grayscale(100%)' },
  'invert-0': { filter: 'invert(0)' },
  'invert': { filter: 'invert(100%)' },
  'sepia-0': { filter: 'sepia(0)' },
  'sepia': { filter: 'sepia(100%)' },
}

// Backdrop grayscale/invert/sepia - direct raw class to CSS
const BACKDROP_FILTER_TOGGLE_MAP: Record<string, Record<string, string>> = {
  'backdrop-grayscale-0': { 'backdrop-filter': 'grayscale(0)' },
  'backdrop-grayscale': { 'backdrop-filter': 'grayscale(100%)' },
  'backdrop-invert-0': { 'backdrop-filter': 'invert(0)' },
  'backdrop-invert': { 'backdrop-filter': 'invert(100%)' },
  'backdrop-sepia-0': { 'backdrop-filter': 'sepia(0)' },
  'backdrop-sepia': { 'backdrop-filter': 'sepia(100%)' },
}

// Drop shadow - direct raw class to CSS
const DROP_SHADOW_MAP: Record<string, Record<string, string>> = {
  'drop-shadow-sm': { filter: 'drop-shadow(0 1px 1px rgb(0 0 0 / 0.05))' },
  'drop-shadow': { filter: 'drop-shadow(0 1px 2px rgb(0 0 0 / 0.1)) drop-shadow(0 1px 1px rgb(0 0 0 / 0.06))' },
  'drop-shadow-md': { filter: 'drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06))' },
  'drop-shadow-lg': { filter: 'drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1))' },
  'drop-shadow-xl': { filter: 'drop-shadow(0 20px 13px rgb(0 0 0 / 0.03)) drop-shadow(0 8px 5px rgb(0 0 0 / 0.08))' },
  'drop-shadow-2xl': { filter: 'drop-shadow(0 25px 25px rgb(0 0 0 / 0.15))' },
  'drop-shadow-none': { filter: 'drop-shadow(0 0 #0000)' },
}

// Mix blend mode - direct raw class to CSS
const MIX_BLEND_MAP: Record<string, Record<string, string>> = {
  'mix-blend-normal': { 'mix-blend-mode': 'normal' },
  'mix-blend-multiply': { 'mix-blend-mode': 'multiply' },
  'mix-blend-screen': { 'mix-blend-mode': 'screen' },
  'mix-blend-overlay': { 'mix-blend-mode': 'overlay' },
  'mix-blend-darken': { 'mix-blend-mode': 'darken' },
  'mix-blend-lighten': { 'mix-blend-mode': 'lighten' },
  'mix-blend-color-dodge': { 'mix-blend-mode': 'color-dodge' },
  'mix-blend-color-burn': { 'mix-blend-mode': 'color-burn' },
  'mix-blend-hard-light': { 'mix-blend-mode': 'hard-light' },
  'mix-blend-soft-light': { 'mix-blend-mode': 'soft-light' },
  'mix-blend-difference': { 'mix-blend-mode': 'difference' },
  'mix-blend-exclusion': { 'mix-blend-mode': 'exclusion' },
  'mix-blend-hue': { 'mix-blend-mode': 'hue' },
  'mix-blend-saturation': { 'mix-blend-mode': 'saturation' },
  'mix-blend-color': { 'mix-blend-mode': 'color' },
  'mix-blend-luminosity': { 'mix-blend-mode': 'luminosity' },
  'mix-blend-plus-darker': { 'mix-blend-mode': 'plus-darker' },
  'mix-blend-plus-lighter': { 'mix-blend-mode': 'plus-lighter' },
}

// Background blend mode - direct raw class to CSS
const BG_BLEND_MAP: Record<string, Record<string, string>> = {
  'bg-blend-normal': { 'background-blend-mode': 'normal' },
  'bg-blend-multiply': { 'background-blend-mode': 'multiply' },
  'bg-blend-screen': { 'background-blend-mode': 'screen' },
  'bg-blend-overlay': { 'background-blend-mode': 'overlay' },
  'bg-blend-darken': { 'background-blend-mode': 'darken' },
  'bg-blend-lighten': { 'background-blend-mode': 'lighten' },
  'bg-blend-color-dodge': { 'background-blend-mode': 'color-dodge' },
  'bg-blend-color-burn': { 'background-blend-mode': 'color-burn' },
  'bg-blend-hard-light': { 'background-blend-mode': 'hard-light' },
  'bg-blend-soft-light': { 'background-blend-mode': 'soft-light' },
  'bg-blend-difference': { 'background-blend-mode': 'difference' },
  'bg-blend-exclusion': { 'background-blend-mode': 'exclusion' },
  'bg-blend-hue': { 'background-blend-mode': 'hue' },
  'bg-blend-saturation': { 'background-blend-mode': 'saturation' },
  'bg-blend-color': { 'background-blend-mode': 'color' },
  'bg-blend-luminosity': { 'background-blend-mode': 'luminosity' },
}

// Combined static map for raw class lookups (display, flex, transform, etc.)
const STATIC_UTILITY_MAP: Record<string, Record<string, string>> = {
  ...DISPLAY_MAP,
  ...FLEX_DIRECTION_MAP,
  ...FLEX_WRAP_MAP,
  ...FLEX_VALUES_MAP,
  ...GROW_SHRINK_MAP,
  ...BORDER_STYLE_MAP,
  ...TRANSFORM_MAP,
  ...TRANSITION_MAP,
  ...TIMING_MAP,
  ...ANIMATION_MAP,
  ...RING_MAP,
  ...SHADOW_MAP,
  ...BORDER_RADIUS_MAP,
  ...BORDER_WIDTH_MAP,
  ...RING_OFFSET_MAP,
  ...OPACITY_MAP,
  // Typography
  ...FONT_WEIGHT_MAP,
  ...FONT_STYLE_MAP,
  ...TEXT_TRANSFORM_MAP,
  ...TEXT_DECORATION_MAP,
  ...TEXT_DECORATION_STYLE_MAP,
  ...TEXT_ALIGN_MAP,
  ...TEXT_OVERFLOW_MAP,
  ...TEXT_WRAP_MAP,
  ...WHITESPACE_MAP,
  ...WORD_BREAK_MAP,
  ...VERTICAL_ALIGN_MAP,
  ...LIST_STYLE_MAP,
  ...HYPHENS_MAP,
  // Layout
  ...POSITION_MAP,
  ...VISIBILITY_MAP,
  ...FLOAT_MAP,
  ...CLEAR_MAP,
  ...ISOLATION_MAP,
  ...OBJECT_FIT_MAP,
  ...OBJECT_POSITION_MAP,
  ...OVERFLOW_MAP,
  ...OVERSCROLL_MAP,
  ...Z_INDEX_MAP,
  ...ASPECT_RATIO_MAP,
  ...BOX_SIZING_MAP,
  ...BOX_DECORATION_MAP,
  // Background
  ...BG_ATTACHMENT_MAP,
  ...BG_CLIP_MAP,
  ...BG_ORIGIN_MAP,
  ...BG_POSITION_MAP,
  ...BG_REPEAT_MAP,
  ...BG_SIZE_MAP,
  ...GRADIENT_MAP,
  // Interactivity
  ...CURSOR_MAP,
  ...POINTER_EVENTS_MAP,
  ...RESIZE_MAP,
  ...USER_SELECT_MAP,
  ...SCROLL_BEHAVIOR_MAP,
  ...SCROLL_SNAP_MAP,
  ...TOUCH_ACTION_MAP,
  ...WILL_CHANGE_MAP,
  ...APPEARANCE_MAP,
  // Table
  ...BORDER_COLLAPSE_MAP,
  ...TABLE_LAYOUT_MAP,
  ...CAPTION_SIDE_MAP,
  // Accessibility
  ...SR_ONLY_MAP,
  ...FORCED_COLOR_MAP,
  // SVG
  ...FILL_MAP,
  ...STROKE_MAP,
  ...STROKE_LINECAP_MAP,
  ...STROKE_LINEJOIN_MAP,
  // Filters
  ...BLUR_MAP,
  ...BACKDROP_BLUR_MAP,
  ...FILTER_TOGGLE_MAP,
  ...BACKDROP_FILTER_TOGGLE_MAP,
  ...DROP_SHADOW_MAP,
  ...MIX_BLEND_MAP,
  ...BG_BLEND_MAP,
}

// Pre-computed variant selector map for O(1) lookup (shared across all instances)
const VARIANT_SELECTORS: Record<string, string> = {
  // Pseudo-class variants
  'hover': ':hover',
  'focus': ':focus',
  'active': ':active',
  'disabled': ':disabled',
  'visited': ':visited',
  'checked': ':checked',
  'focus-within': ':focus-within',
  'focus-visible': ':focus-visible',
  // Positional variants
  'first': ':first-child',
  'last': ':last-child',
  'odd': ':nth-child(odd)',
  'even': ':nth-child(even)',
  'first-of-type': ':first-of-type',
  'last-of-type': ':last-of-type',
  // Pseudo-elements
  'before': '::before',
  'after': '::after',
  'marker': '::marker',
  'placeholder': '::placeholder',
  'selection': '::selection',
  'file': '::file-selector-button',
  // Form state pseudo-classes
  'required': ':required',
  'valid': ':valid',
  'invalid': ':invalid',
  'read-only': ':read-only',
  'autofill': ':autofill',
  // Additional state pseudo-classes
  'open': '[open]',
  'closed': ':not([open])',
  'empty': ':empty',
  'enabled': ':enabled',
  'only': ':only-child',
  'target': ':target',
  'indeterminate': ':indeterminate',
  'default': ':default',
  'optional': ':optional',
}

// Pre-computed prefix variants (these modify the selector prefix, not suffix)
const PREFIX_VARIANTS: Record<string, string> = {
  'dark': '.dark ',
  'rtl': '[dir="rtl"] ',
  'ltr': '[dir="ltr"] ',
}

/**
 * Generates CSS rules from parsed utility classes
 */
export class CSSGenerator {
  private rules: Map<string, CSSRule[]> = new Map()
  private classCache: Set<string> = new Set()
  private blocklistRegexCache: RegExp[] = []
  private blocklistExact: Set<string> = new Set()
  private selectorCache: Map<string, string> = new Map()
  private mediaQueryCache: Map<string, string | undefined> = new Map()
  private ruleCache: Map<string, UtilityRule[]> = new Map()
  private variantEnabled: Record<string, boolean>
  private screenBreakpoints: Map<string, string>
  // Cache for utility+value combinations that don't match any rule (negative cache)
  private noMatchCache: Set<string> = new Set()
  // Preserve extend colors for CSS variable generation (only custom colors, not defaults)
  private extendColors: Record<string, string | Record<string, string>> | null = null

  constructor(private config: CrosswindConfig) {
    // Merge preset themes into the main config theme
    if (config.presets && config.presets.length > 0) {
      for (const preset of config.presets) {
        if (preset.theme) {
          this.config.theme = deepMerge(this.config.theme, preset.theme)
        }
      }
    }

    // Save extend colors before merging (for CSS variable generation)
    if (config.theme.extend?.colors) {
      this.extendColors = config.theme.extend.colors as Record<string, string | Record<string, string>>
    }

    // Merge theme.extend into theme (allows users to add custom values without replacing defaults)
    if (config.theme.extend) {
      const { extend, ...baseTheme } = this.config.theme
      if (extend) {
        this.config.theme = deepMerge(baseTheme, extend) as typeof this.config.theme
      }
    }

    // Pre-compile blocklist patterns for performance
    for (const pattern of this.config.blocklist) {
      if (pattern.includes('*')) {
        const regexPattern = pattern.replace(/\*/g, '.*')
        this.blocklistRegexCache.push(new RegExp(`^${regexPattern}$`))
      }
      else {
        this.blocklistExact.add(pattern)
      }
    }

    // Pre-cache variant enabled state for faster lookup
    this.variantEnabled = this.config.variants as unknown as Record<string, boolean>

    // Pre-cache screen breakpoints as Map for faster lookup
    this.screenBreakpoints = new Map(Object.entries(this.config.theme.screens))

    // Build rule lookup map for faster matching
    this.buildRuleLookup()
  }

  /**
   * Build a prefix-based lookup map for rules
   * This allows O(1) lookup instead of O(n) iteration
   */
  private buildRuleLookup(): void {
    // Pre-processing done in constructor
    // Rule caching happens during generation
  }

  /**
   * Generate CSS for a utility class
   */
  generate(className: string): void {
    // Check cache for already processed classes
    if (this.classCache.has(className)) {
      return
    }

    // Check shortcuts first (before marking as cached)
    const shortcut = this.config.shortcuts[className]
    if (shortcut) {
      this.classCache.add(className)
      const classes = Array.isArray(shortcut) ? shortcut : shortcut.split(/\s+/)
      for (const cls of classes) {
        this.generate(cls)
      }
      return
    }

    this.classCache.add(className)

    // Check exact match blocklist first (O(1) Set lookup)
    if (this.blocklistExact.size > 0 && this.blocklistExact.has(className)) {
      return
    }

    // Check if class is blocklisted (use pre-compiled regexes)
    if (this.blocklistRegexCache.length > 0) {
      for (let i = 0; i < this.blocklistRegexCache.length; i++) {
        if (this.blocklistRegexCache[i].test(className)) {
          return
        }
      }
    }

    const parsed = parseClass(className)

    // ==========================================================================
    // FAST PATH: Static utility map lookup (O(1))
    // Handles ~80% of common utilities without any rule iteration
    // ==========================================================================

    // Check static raw class map first (display, flex-direction, transform, transition, etc.)
    const staticResult = STATIC_UTILITY_MAP[parsed.raw]
    if (staticResult) {
      this.addRule(parsed, staticResult)
      return
    }

    // Fast path for utility-based lookups
    const utility = parsed.utility
    const value = parsed.value

    // ==========================================================================
    // SPACING UTILITIES - Most common, use pre-computed values
    // ==========================================================================

    // Width: w-{size}
    if (utility === 'w' && value) {
      const sizeVal = SIZE_VALUES[value]
      if (sizeVal) {
        this.addRule(parsed, { width: sizeVal })
        return
      }
    }

    // Height: h-{size}
    if (utility === 'h' && value) {
      const sizeVal = SIZE_VALUES[value]
      if (sizeVal) {
        this.addRule(parsed, { height: value === 'screen' ? '100vh' : sizeVal })
        return
      }
    }

    // Padding: p-{size}
    if (utility === 'p' && value) {
      const spacingVal = SPACING_VALUES[value]
      if (spacingVal) {
        this.addRule(parsed, { padding: spacingVal })
        return
      }
    }

    // Padding X: px-{size}
    if (utility === 'px' && value) {
      const spacingVal = SPACING_VALUES[value]
      if (spacingVal) {
        this.addRule(parsed, { 'padding-left': spacingVal, 'padding-right': spacingVal })
        return
      }
    }

    // Padding Y: py-{size}
    if (utility === 'py' && value) {
      const spacingVal = SPACING_VALUES[value]
      if (spacingVal) {
        this.addRule(parsed, { 'padding-top': spacingVal, 'padding-bottom': spacingVal })
        return
      }
    }

    // Padding sides: pt, pr, pb, pl
    if ((utility === 'pt' || utility === 'pr' || utility === 'pb' || utility === 'pl') && value) {
      const spacingVal = SPACING_VALUES[value]
      if (spacingVal) {
        const propMap: Record<string, string> = { pt: 'padding-top', pr: 'padding-right', pb: 'padding-bottom', pl: 'padding-left' }
        this.addRule(parsed, { [propMap[utility]]: spacingVal })
        return
      }
    }

    // Margin: m-{size}
    if (utility === 'm' && value) {
      const spacingVal = SPACING_VALUES[value]
      if (spacingVal) {
        this.addRule(parsed, { margin: spacingVal })
        return
      }
    }

    // Margin X: mx-{size}
    if (utility === 'mx' && value) {
      const spacingVal = SPACING_VALUES[value]
      if (spacingVal) {
        this.addRule(parsed, { 'margin-left': spacingVal, 'margin-right': spacingVal })
        return
      }
    }

    // Margin Y: my-{size}
    if (utility === 'my' && value) {
      const spacingVal = SPACING_VALUES[value]
      if (spacingVal) {
        this.addRule(parsed, { 'margin-top': spacingVal, 'margin-bottom': spacingVal })
        return
      }
    }

    // Margin sides: mt, mr, mb, ml
    if ((utility === 'mt' || utility === 'mr' || utility === 'mb' || utility === 'ml') && value) {
      const spacingVal = SPACING_VALUES[value]
      if (spacingVal) {
        const propMap: Record<string, string> = { mt: 'margin-top', mr: 'margin-right', mb: 'margin-bottom', ml: 'margin-left' }
        this.addRule(parsed, { [propMap[utility]]: spacingVal })
        return
      }
    }

    // Position: top, right, bottom, left
    if ((utility === 'top' || utility === 'right' || utility === 'bottom' || utility === 'left') && value) {
      const spacingVal = SPACING_VALUES[value]
      if (spacingVal) {
        this.addRule(parsed, { [utility]: spacingVal })
        return
      }
    }

    // Inset: inset-{size}
    if (utility === 'inset' && value) {
      const spacingVal = SPACING_VALUES[value]
      if (spacingVal) {
        this.addRule(parsed, { top: spacingVal, right: spacingVal, bottom: spacingVal, left: spacingVal })
        return
      }
    }

    // Inset X/Y: inset-x-{size}, inset-y-{size}
    if (utility === 'inset-x' && value) {
      const spacingVal = SPACING_VALUES[value]
      if (spacingVal) {
        this.addRule(parsed, { left: spacingVal, right: spacingVal })
        return
      }
    }
    if (utility === 'inset-y' && value) {
      const spacingVal = SPACING_VALUES[value]
      if (spacingVal) {
        this.addRule(parsed, { top: spacingVal, bottom: spacingVal })
        return
      }
    }

    // ==========================================================================
    // COLOR UTILITIES - Fast path using pre-computed color map
    // ==========================================================================

    // Background color: bg-{color}-{shade}
    if (utility === 'bg' && value) {
      const colorVal = COMMON_COLORS[value]
      if (colorVal) {
        this.addRule(parsed, { 'background-color': colorVal })
        return
      }
    }

    // Text color: text-{color}-{shade}
    if (utility === 'text' && value) {
      const colorVal = COMMON_COLORS[value]
      if (colorVal) {
        this.addRule(parsed, { color: colorVal })
        return
      }
    }

    // Border color: border-{color}-{shade}
    if (utility === 'border' && value) {
      const colorVal = COMMON_COLORS[value]
      if (colorVal) {
        this.addRule(parsed, { 'border-color': colorVal })
        return
      }
    }

    // Justify content: justify-{start|end|center|between|around|evenly}
    if (utility === 'justify' && value) {
      const justifyValue = JUSTIFY_CONTENT_VALUES[value]
      if (justifyValue) {
        this.addRule(parsed, { 'justify-content': justifyValue })
        return
      }
    }

    // Align items: items-{start|end|center|baseline|stretch}
    if (utility === 'items' && value) {
      const itemsValue = ALIGN_ITEMS_VALUES[value]
      if (itemsValue) {
        this.addRule(parsed, { 'align-items': itemsValue })
        return
      }
    }

    // Align content: content-{normal|center|start|end|between|around|evenly|baseline|stretch}
    if (utility === 'content' && value) {
      const contentValue = ALIGN_CONTENT_VALUES[value]
      if (contentValue) {
        this.addRule(parsed, { 'align-content': contentValue })
        return
      }
    }

    // Align self: self-{auto|start|end|center|stretch|baseline}
    if (utility === 'self' && value) {
      const selfValue = ALIGN_SELF_VALUES[value]
      if (selfValue) {
        this.addRule(parsed, { 'align-self': selfValue })
        return
      }
    }

    // Grid columns: grid-cols-{1-12|none|subgrid}
    if (utility === 'grid-cols' && value) {
      const colsValue = GRID_COLS_VALUES[value]
      if (colsValue) {
        this.addRule(parsed, { 'grid-template-columns': colsValue })
        return
      }
    }

    // Grid rows: grid-rows-{1-6|none|subgrid}
    if (utility === 'grid-rows' && value) {
      const rowsValue = GRID_ROWS_VALUES[value]
      if (rowsValue) {
        this.addRule(parsed, { 'grid-template-rows': rowsValue })
        return
      }
    }

    // Grid column span: col-{auto|span-1..12|span-full}
    if (utility === 'col' && value) {
      const colValue = GRID_COL_VALUES[value]
      if (colValue) {
        this.addRule(parsed, { 'grid-column': colValue })
        return
      }
    }

    // Grid row span: row-{auto|span-1..6|span-full}
    if (utility === 'row' && value) {
      const rowValue = GRID_ROW_VALUES[value]
      if (rowValue) {
        this.addRule(parsed, { 'grid-row': rowValue })
        return
      }
    }

    // Grid auto flow: grid-flow-{row|col|dense|row-dense|col-dense}
    if (utility === 'grid-flow' && value) {
      const flowValue = GRID_FLOW_VALUES[value]
      if (flowValue) {
        this.addRule(parsed, { 'grid-auto-flow': flowValue })
        return
      }
    }

    // Auto cols: auto-cols-{auto|min|max|fr}
    if (utility === 'auto-cols' && value) {
      const autoColsValue = AUTO_COLS_ROWS_VALUES[value]
      if (autoColsValue) {
        this.addRule(parsed, { 'grid-auto-columns': autoColsValue })
        return
      }
    }

    // Auto rows: auto-rows-{auto|min|max|fr}
    if (utility === 'auto-rows' && value) {
      const autoRowsValue = AUTO_COLS_ROWS_VALUES[value]
      if (autoRowsValue) {
        this.addRule(parsed, { 'grid-auto-rows': autoRowsValue })
        return
      }
    }

    // Transform origin: origin-{center|top|top-right|...}
    if (utility === 'origin' && value) {
      const originValue = TRANSFORM_ORIGIN_VALUES[value]
      if (originValue) {
        this.addRule(parsed, { 'transform-origin': originValue })
        return
      }
    }

    // Scale: scale-{0-150} -> transform: scale(value/100)
    if (utility === 'scale' && value && !parsed.arbitrary) {
      const scaleNum = Number(value) / 100
      if (!Number.isNaN(scaleNum)) {
        this.addRule(parsed, { transform: `scale(${scaleNum})` })
        return
      }
    }
    if (utility === 'scale-x' && value && !parsed.arbitrary) {
      const scaleNum = Number(value) / 100
      if (!Number.isNaN(scaleNum)) {
        this.addRule(parsed, { transform: `scaleX(${scaleNum})` })
        return
      }
    }
    if (utility === 'scale-y' && value && !parsed.arbitrary) {
      const scaleNum = Number(value) / 100
      if (!Number.isNaN(scaleNum)) {
        this.addRule(parsed, { transform: `scaleY(${scaleNum})` })
        return
      }
    }

    // Rotate: rotate-{0-180} -> transform: rotate(Ndeg)
    if (utility === 'rotate' && value && !parsed.arbitrary) {
      this.addRule(parsed, { transform: `rotate(${value}deg)` })
      return
    }

    // Duration: duration-{75|100|150|200|300|500|700|1000}
    if (utility === 'duration' && value) {
      this.addRule(parsed, { 'transition-duration': `${value}ms` })
      return
    }

    // Delay: delay-{75|100|150|200|300|500|700|1000}
    if (utility === 'delay' && value) {
      this.addRule(parsed, { 'transition-delay': `${value}ms` })
      return
    }

    // Gap: gap-{spacing}
    if (utility === 'gap' && value) {
      const gapValue = this.config.theme.spacing[value] || value
      this.addRule(parsed, { gap: gapValue })
      return
    }
    if (utility === 'gap-x' && value) {
      const gapValue = this.config.theme.spacing[value] || value
      this.addRule(parsed, { 'column-gap': gapValue })
      return
    }
    if (utility === 'gap-y' && value) {
      const gapValue = this.config.theme.spacing[value] || value
      this.addRule(parsed, { 'row-gap': gapValue })
      return
    }

    // Place content/items/self
    if (utility === 'place' && value) {
      if (value.startsWith('content-')) {
        const placeValue = PLACE_CONTENT_VALUES[value.slice(8)]
        if (placeValue) {
          this.addRule(parsed, { 'place-content': placeValue })
          return
        }
      }
      if (value.startsWith('items-')) {
        const placeValue = PLACE_CONTENT_VALUES[value.slice(6)]
        if (placeValue) {
          this.addRule(parsed, { 'place-items': placeValue })
          return
        }
      }
      if (value.startsWith('self-')) {
        const placeValue = PLACE_CONTENT_VALUES[value.slice(5)]
        if (placeValue) {
          this.addRule(parsed, { 'place-self': placeValue })
          return
        }
      }
    }

    // ==========================================================================
    // SLOW PATH: Rule iteration (only if fast path didn't match)
    // ==========================================================================

    // Check no-match cache - if this utility+value combo was already determined to not match
    // any rule, skip the expensive rule iteration (especially helpful for variant classes)
    const utilityKey = `${parsed.utility}:${parsed.value || ''}`
    if (this.noMatchCache.has(utilityKey)) {
      return
    }

    // Try custom rules from config first (allows overriding built-in rules)
    if (this.config.rules.length > 0) {
      for (const [pattern, handler] of this.config.rules) {
        const match = className.match(pattern)
        if (match) {
          const properties = handler(match)
          if (properties) {
            this.addRule(parsed, properties)
            return
          }
        }
      }
    }

    // Try built-in rules with optimized iteration
    const rulesLength = builtInRules.length
    for (let i = 0; i < rulesLength; i++) {
      const result = builtInRules[i](parsed, this.config)
      if (result) {
        // Handle both old format (just properties) and new format (object with properties and childSelector/pseudoElement)
        if ('properties' in result && typeof result.properties === 'object') {
          this.addRule(parsed, result.properties, result.childSelector, result.pseudoElement)
        }
        else {
          this.addRule(parsed, result as Record<string, string>)
        }
        return
      }
    }

    // No rule matched - cache this utility+value combo to skip future iterations
    this.noMatchCache.add(utilityKey)
  }

  /**
   * Add a CSS rule with variants applied
   */
  private addRule(parsed: ParsedClass, properties: Record<string, string>, childSelector?: string, pseudoElement?: string): void {
    // Use cached selector if available
    const cacheKey = `${parsed.raw}${childSelector || ''}${pseudoElement || ''}`
    let selector = this.selectorCache.get(cacheKey)
    if (!selector) {
      selector = this.buildSelector(parsed)
      // Append pseudo-element directly (no space)
      if (pseudoElement) {
        selector += pseudoElement
      }
      // Append child selector if provided
      if (childSelector) {
        selector += ` ${childSelector}`
      }
      this.selectorCache.set(cacheKey, selector)
    }

    const mediaQuery = this.getMediaQuery(parsed)

    // Apply !important modifier
    if (parsed.important) {
      for (const key in properties) {
        properties[key] += ' !important'
      }
    }

    const key = mediaQuery || 'base'
    if (!this.rules.has(key)) {
      this.rules.set(key, [])
    }

    this.rules.get(key)!.push({
      selector,
      properties,
      mediaQuery,
      childSelector,
    })
  }

  /**
   * Build CSS selector with pseudo-classes and variants
   * Optimized with pre-computed lookup maps for O(1) variant resolution
   */
  private buildSelector(parsed: ParsedClass): string {
    let selector = `.${this.escapeSelector(parsed.raw)}`
    let prefix = ''

    const variants = parsed.variants
    const variantsLen = variants.length

    // Fast path: no variants
    if (variantsLen === 0) {
      return selector
    }

    // Apply variants using pre-computed maps
    for (let i = 0; i < variantsLen; i++) {
      const variant = variants[i]

      // Try suffix selector lookup first (most common case)
      const suffixSelector = VARIANT_SELECTORS[variant]
      if (suffixSelector !== undefined) {
        // Check if variant is enabled
        if (this.variantEnabled[variant]) {
          selector += suffixSelector
        }
        continue
      }

      // Try prefix selector lookup (dark, rtl, ltr)
      const prefixSelector = PREFIX_VARIANTS[variant]
      if (prefixSelector !== undefined) {
        if (this.variantEnabled[variant]) {
          prefix = prefixSelector
        }
        continue
      }

      // Handle group-* variants
      if (variant.charCodeAt(0) === 103 && variant.startsWith('group-')) { // 'g' = 103
        if (this.variantEnabled.group) {
          const groupVariant = variant.slice(6)
          prefix = `.group:${groupVariant} `
        }
        continue
      }

      // Handle peer-* variants
      if (variant.charCodeAt(0) === 112 && variant.startsWith('peer-')) { // 'p' = 112
        if (this.variantEnabled.peer) {
          const peerVariant = variant.slice(5)
          prefix = `.peer:${peerVariant} ~ `
        }
      }
    }

    return prefix + selector
  }

  /**
   * Get media query for responsive and media variants
   * Optimized with pre-cached lookups and early returns
   */
  private getMediaQuery(parsed: ParsedClass): string | undefined {
    const variants = parsed.variants
    const variantsLen = variants.length

    // Fast path: no variants
    if (variantsLen === 0) {
      return undefined
    }

    // Use cached media query if available
    const cacheKey = variants.join(':')
    const cached = this.mediaQueryCache.get(cacheKey)
    if (cached !== undefined) {
      return cached || undefined // Convert empty string to undefined
    }

    let result: string | undefined

    for (let i = 0; i < variantsLen; i++) {
      const variant = variants[i]
      const firstChar = variant.charCodeAt(0)

      // Container queries (@sm, @md, @lg, etc.) - '@' = 64
      if (firstChar === 64) {
        const breakpointKey = variant.slice(1)
        const breakpoint = this.screenBreakpoints.get(breakpointKey)
        if (breakpoint) {
          result = `@container (min-width: ${breakpoint})`
          this.mediaQueryCache.set(cacheKey, result)
          return result
        }
        continue
      }

      // Responsive breakpoints - check if variant is a screen breakpoint
      if (this.variantEnabled.responsive) {
        const breakpoint = this.screenBreakpoints.get(variant)
        if (breakpoint) {
          result = `@media (min-width: ${breakpoint})`
          this.mediaQueryCache.set(cacheKey, result)
          return result
        }
      }

      // Media preference variants - use switch for common cases
      switch (variant) {
        case 'print':
          if (this.variantEnabled.print) {
            result = '@media print'
            this.mediaQueryCache.set(cacheKey, result)
            return result
          }
          break
        case 'motion-safe':
          if (this.variantEnabled['motion-safe']) {
            result = '@media (prefers-reduced-motion: no-preference)'
            this.mediaQueryCache.set(cacheKey, result)
            return result
          }
          break
        case 'motion-reduce':
          if (this.variantEnabled['motion-reduce']) {
            result = '@media (prefers-reduced-motion: reduce)'
            this.mediaQueryCache.set(cacheKey, result)
            return result
          }
          break
        case 'contrast-more':
          if (this.variantEnabled['contrast-more']) {
            result = '@media (prefers-contrast: more)'
            this.mediaQueryCache.set(cacheKey, result)
            return result
          }
          break
        case 'contrast-less':
          if (this.variantEnabled['contrast-less']) {
            result = '@media (prefers-contrast: less)'
            this.mediaQueryCache.set(cacheKey, result)
            return result
          }
          break
      }
    }

    this.mediaQueryCache.set(cacheKey, '')  // Use empty string as "no result" marker
    return undefined
  }

  /**
   * Escape special characters in class names for CSS selectors
   * Optimized with charCode checks for common fast path
   */
  private escapeSelector(className: string): string {
    // Fast path: check if string needs escaping at all
    let needsEscape = false
    for (let i = 0; i < className.length; i++) {
      const c = className.charCodeAt(i)
      // Check for : (58), . (46), / (47), @ (64), space (32), [ (91), ] (93)
      if (c === 58 || c === 46 || c === 47 || c === 64 || c === 32 || c === 91 || c === 93) {
        needsEscape = true
        break
      }
    }
    if (!needsEscape) {
      return className
    }
    return className.replace(/[:./@ \[\]]/g, '\\$&')
  }

  /**
   * Generate final CSS output
   */
  toCSS(includePreflight = true, minify = false): string {
    const parts: string[] = []

    // Add preflight CSS first (if requested)
    if (includePreflight) {
      for (const preflight of this.config.preflights) {
        let preflightCSS = preflight.getCSS()
        // Replace hardcoded font-family in preflight with theme's sans font
        const sansFonts = this.config.theme?.fontFamily?.sans
        if (sansFonts && Array.isArray(sansFonts)) {
          const fontFamilyValue = sansFonts.join(', ')
          // Replace the default ui-sans-serif stack in html/:host selector
          preflightCSS = preflightCSS.replace(
            /font-family:\s*ui-sans-serif[^;]+;/g,
            `font-family: ${fontFamilyValue};`,
          )
        }
        parts.push(minify ? preflightCSS.replace(/\s+/g, ' ').trim() : preflightCSS)
      }
    }

    // Generate CSS variables from theme colors if enabled
    if (this.config.cssVariables) {
      const vars = this.generateCSSVariables()
      if (vars) {
        parts.push(minify ? vars.replace(/\s+/g, ' ').trim() : vars)
      }
    }

    // Base rules (no media query)
    const baseRules = this.rules.get('base') || []
    if (baseRules.length > 0) {
      parts.push(this.rulesToCSS(baseRules, minify))
    }

    // Media query rules
    for (const [key, rules] of this.rules.entries()) {
      if (key !== 'base' && rules.length > 0) {
        const mediaQuery = rules[0].mediaQuery!
        const css = this.rulesToCSS(rules, minify)
        parts.push(minify ? `${mediaQuery}{${css}}` : `${mediaQuery} {\n${css}\n}`)
      }
    }

    return minify ? parts.join('') : parts.join('\n\n')
  }

  /**
   * Convert rules to CSS string
   */
  private rulesToCSS(rules: CSSRule[], minify: boolean): string {
    const grouped = this.groupRulesBySelector(rules)
    const parts: string[] = []

    for (const [selector, properties] of grouped.entries()) {
      const props = Array.from(properties.entries())
        .map(([prop, value]) => minify ? `${prop}:${value}` : `  ${prop}: ${value};`)
        .join(minify ? ';' : '\n')

      if (minify) {
        parts.push(`${selector}{${props}}`)
      }
      else {
        parts.push(`${selector} {\n${props}\n}`)
      }
    }

    return minify ? parts.join('') : parts.join('\n\n')
  }

  /**
   * Group rules by selector and merge properties
   */
  private groupRulesBySelector(rules: CSSRule[]): Map<string, Map<string, string>> {
    const grouped = new Map<string, Map<string, string>>()

    for (const rule of rules) {
      if (!grouped.has(rule.selector)) {
        grouped.set(rule.selector, new Map())
      }
      const props = grouped.get(rule.selector)!
      for (const [prop, value] of Object.entries(rule.properties)) {
        props.set(prop, value)
      }
    }

    return grouped
  }

  /**
   * Generate :root CSS variables from theme colors
   * Uses only extend colors (custom) if available, to avoid dumping 300+ default Tailwind colors.
   * Flattens nested color objects: { monokai: { bg: '#2d2a2e' } } -> --monokai-bg: #2d2a2e
   */
  private generateCSSVariables(): string | null {
    // Prefer extend colors (user's custom colors only), fall back to all theme colors
    const colors = this.extendColors || this.config.theme.colors
    if (!colors || Object.keys(colors).length === 0) return null

    const vars: string[] = []
    for (const [name, value] of Object.entries(colors)) {
      if (typeof value === 'string') {
        vars.push(`  --${name}: ${value};`)
      }
      else if (typeof value === 'object' && value !== null) {
        for (const [shade, shadeValue] of Object.entries(value)) {
          if (typeof shadeValue === 'string') {
            vars.push(`  --${name}-${shade}: ${shadeValue};`)
          }
        }
      }
    }

    if (vars.length === 0) return null
    return `:root {\n${vars.join('\n')}\n}`
  }

  /**
   * Reset the generator state
   */
  reset(): void {
    this.rules.clear()
    this.classCache.clear()
    this.selectorCache.clear()
    this.mediaQueryCache.clear()
    this.noMatchCache.clear()
  }
}
