import type { HeadwindConfig, ParsedClass, UtilityRuleResult } from './types'
import { advancedRules } from './rules-advanced'
import { effectsRules } from './rules-effects'
import { formsRules } from './rules-forms'
import { gridRules } from './rules-grid'
import { interactivityRules } from './rules-interactivity'
import { layoutRules } from './rules-layout'
import { transformsRules } from './rules-transforms'
import { typographyRules } from './rules-typography'

export type UtilityRule = (parsed: ParsedClass, config: HeadwindConfig) => Record<string, string> | UtilityRuleResult | undefined

/**
 * Built-in utility rules
 * Each rule checks if it matches the parsed class and returns CSS properties
 */

// Display utilities
export const displayRule: UtilityRule = (parsed) => {
  const displays = ['block', 'inline-block', 'inline', 'flex', 'inline-flex', 'grid', 'inline-grid', 'hidden', 'none']
  if (displays.includes(parsed.utility)) {
    return { display: parsed.utility === 'hidden' ? 'none' : parsed.utility }
  }
}

// Container utilities (for container queries)
export const containerRule: UtilityRule = (parsed) => {
  // @container -> container-type: inline-size (most common use case)
  if (parsed.utility === '@container') {
    return { 'container-type': 'inline-size' }
  }
  // @container-normal -> container-type: normal (for size containment without inline-size)
  if (parsed.utility === '@container-normal') {
    return { 'container-type': 'normal' }
  }
  // @container/name -> container-type: inline-size; container-name: name
  if (parsed.utility.startsWith('@container/')) {
    const name = parsed.utility.slice(11) // Remove '@container/'
    return {
      'container-type': 'inline-size',
      'container-name': name,
    }
  }
}

// Flexbox utilities
export const flexDirectionRule: UtilityRule = (parsed) => {
  const directions: Record<string, string> = {
    'flex-row': 'row',
    'flex-row-reverse': 'row-reverse',
    'flex-col': 'column',
    'flex-col-reverse': 'column-reverse',
  }
  return directions[parsed.utility] ? { 'flex-direction': directions[parsed.utility] } : undefined
}

export const flexWrapRule: UtilityRule = (parsed) => {
  const wraps: Record<string, string> = {
    'flex-wrap': 'wrap',
    'flex-wrap-reverse': 'wrap-reverse',
    'flex-nowrap': 'nowrap',
  }
  return wraps[parsed.utility] ? { 'flex-wrap': wraps[parsed.utility] } : undefined
}

export const flexRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'flex' || parsed.utility.startsWith('flex-')) {
    // Handle named flex values
    const flexValues: Record<string, string> = {
      'flex-1': '1 1 0%',
      'flex-auto': '1 1 auto',
      'flex-initial': '0 1 auto',
      'flex-none': 'none',
    }
    if (flexValues[parsed.utility]) {
      return { flex: flexValues[parsed.utility] }
    }
    // Handle arbitrary flex values
    if (parsed.utility === 'flex' && parsed.arbitrary && parsed.value) {
      return { flex: parsed.value.replace(/_/g, ' ') }
    }
  }
  return undefined
}

export const flexGrowRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'flex-grow' && !parsed.value) {
    return { 'flex-grow': '1' }
  }
  if (parsed.utility === 'flex-grow' && parsed.value) {
    return { 'flex-grow': parsed.value }
  }
}

export const flexShrinkRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'flex-shrink' && !parsed.value) {
    return { 'flex-shrink': '1' }
  }
  if (parsed.utility === 'flex-shrink' && parsed.value) {
    return { 'flex-shrink': parsed.value }
  }
}

export const justifyContentRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'justify' && parsed.value) {
    const values: Record<string, string> = {
      start: 'flex-start',
      end: 'flex-end',
      center: 'center',
      between: 'space-between',
      around: 'space-around',
      evenly: 'space-evenly',
    }
    // Handle named values
    if (values[parsed.value]) {
      return { 'justify-content': values[parsed.value] }
    }
    // Handle arbitrary values
    if (parsed.arbitrary) {
      return { 'justify-content': parsed.value }
    }
  }
  return undefined
}

export const alignItemsRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'items' && parsed.value) {
    const values: Record<string, string> = {
      start: 'flex-start',
      end: 'flex-end',
      center: 'center',
      baseline: 'baseline',
      stretch: 'stretch',
    }
    // Handle named values
    if (values[parsed.value]) {
      return { 'align-items': values[parsed.value] }
    }
    // Handle arbitrary values
    if (parsed.arbitrary) {
      return { 'align-items': parsed.value }
    }
  }
  return undefined
}

export const justifyItemsRule: UtilityRule = (parsed) => {
  // Parsed as utility="justify", value="items-center"
  // Need to reconstruct full utility name
  if (parsed.utility === 'justify' && parsed.value && parsed.value.startsWith('items-')) {
    const values: Record<string, string> = {
      'items-start': 'start',
      'items-end': 'end',
      'items-center': 'center',
      'items-stretch': 'stretch',
    }
    return values[parsed.value] ? { 'justify-items': values[parsed.value] } : undefined
  }
  return undefined
}

export const alignContentRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'content' && parsed.value) {
    const values: Record<string, string> = {
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
    return values[parsed.value] ? { 'align-content': values[parsed.value] } : undefined
  }
  return undefined
}

// Spacing utilities (margin, padding)
export const spacingRule: UtilityRule = (parsed, config) => {
  const prefixes: Record<string, string[]> = {
    p: ['padding'],
    px: ['padding-left', 'padding-right'],
    py: ['padding-top', 'padding-bottom'],
    pt: ['padding-top'],
    pr: ['padding-right'],
    pb: ['padding-bottom'],
    pl: ['padding-left'],
    // Logical padding (for RTL support)
    ps: ['padding-inline-start'],
    pe: ['padding-inline-end'],
    m: ['margin'],
    mx: ['margin-left', 'margin-right'],
    my: ['margin-top', 'margin-bottom'],
    mt: ['margin-top'],
    mr: ['margin-right'],
    mb: ['margin-bottom'],
    ml: ['margin-left'],
    // Logical margin (for RTL support)
    ms: ['margin-inline-start'],
    me: ['margin-inline-end'],
  }

  const properties = prefixes[parsed.utility]
  if (!properties || !parsed.value)
    return undefined

  // Handle negative values
  let value: string
  if (parsed.value.startsWith('-')) {
    const positiveValue = parsed.value.slice(1)
    const spacing = config.theme.spacing[positiveValue]
    // Special case: -0 should just be 0
    if (positiveValue === '0') {
      value = spacing || '0'
    }
    else {
      value = spacing ? `-${spacing}` : parsed.value
    }
  }
  else {
    value = config.theme.spacing[parsed.value] || parsed.value
  }

  const result: Record<string, string> = {}
  for (const prop of properties) {
    result[prop] = value
  }
  return result
}

// Width and height utilities
export const sizingRule: UtilityRule = (parsed, config) => {
  if (parsed.utility === 'w' && parsed.value) {
    const sizeMap: Record<string, string> = {
      full: '100%',
      screen: '100vw',
      auto: 'auto',
      min: 'min-content',
      max: 'max-content',
      fit: 'fit-content',
    }
    // Handle fractions: 1/2 -> 50%
    if (parsed.value.includes('/')) {
      const [num, denom] = parsed.value.split('/').map(Number)
      // Validate: skip invalid fractions (NaN or division by zero)
      if (Number.isNaN(num) || Number.isNaN(denom) || denom === 0) {
        return undefined
      }
      return { width: `${(num / denom) * 100}%` } as Record<string, string>
    }
    // Check spacing config first, then sizeMap, then raw value
    const value = config.theme.spacing[parsed.value] || sizeMap[parsed.value] || parsed.value
    return { width: value } as Record<string, string>
  }

  if (parsed.utility === 'h' && parsed.value) {
    const sizeMap: Record<string, string> = {
      full: '100%',
      screen: '100vh',
      auto: 'auto',
      min: 'min-content',
      max: 'max-content',
      fit: 'fit-content',
    }
    // Handle fractions: 3/4 -> 75%
    if (parsed.value.includes('/')) {
      const [num, denom] = parsed.value.split('/').map(Number)
      // Validate: skip invalid fractions (NaN or division by zero)
      if (Number.isNaN(num) || Number.isNaN(denom) || denom === 0) {
        return undefined
      }
      return { height: `${(num / denom) * 100}%` } as Record<string, string>
    }
    // Check spacing config first, then sizeMap, then raw value
    const value = config.theme.spacing[parsed.value] || sizeMap[parsed.value] || parsed.value
    return { height: value } as Record<string, string>
  }

  // Size utility (width + height shorthand)
  if (parsed.utility === 'size' && parsed.value) {
    const sizeMap: Record<string, string> = {
      full: '100%',
      auto: 'auto',
      min: 'min-content',
      max: 'max-content',
      fit: 'fit-content',
    }
    // Handle fractions: 1/2 -> 50%
    if (parsed.value.includes('/')) {
      const [num, denom] = parsed.value.split('/').map(Number)
      if (Number.isNaN(num) || Number.isNaN(denom) || denom === 0) {
        return undefined
      }
      const percent = `${(num / denom) * 100}%`
      return { width: percent, height: percent } as Record<string, string>
    }
    const value = config.theme.spacing[parsed.value] || sizeMap[parsed.value] || parsed.value
    return { width: value, height: value } as Record<string, string>
  }

  return undefined
}

// Color utilities (background, text, border)
// Cache for color lookups
const colorCache = new Map<string, string>()
// Cache for theme color object lookups
const themeColorCache = new Map<string, any>()

// Pre-computed color property map (avoid object creation)
const COLOR_PROPS: Record<string, string> = {
  bg: 'background-color',
  text: 'color',
  border: 'border-color',
}

// Special color keywords (pre-defined)
const SPECIAL_COLORS: Record<string, string> = {
  current: 'currentColor',
  transparent: 'transparent',
  inherit: 'inherit',
}

export const colorRule: UtilityRule = (parsed, config) => {
  const prop = COLOR_PROPS[parsed.utility]
  if (!prop || !parsed.value)
    return undefined

  const value = parsed.value

  // Check cache first (single lookup) - use the raw value directly as key
  const cached = colorCache.get(value)
  if (cached) {
    return { [prop]: cached }
  }

  // Fast path: Most common case in benchmarks - color-shade format without opacity
  // Optimize for "blue-500" pattern (no slash)
  const lastDashIndex = value.lastIndexOf('-')
  if (lastDashIndex > 0 && !value.includes('/')) {
    const shade = value.slice(lastDashIndex + 1)
    const colorName = value.slice(0, lastDashIndex)

    // Try cached theme color object lookup
    let colorObj = themeColorCache.get(colorName)
    const actualColorObj = config.theme.colors[colorName]

    // Verify cache is valid for current config (important for tests with custom configs)
    if (colorObj !== actualColorObj) {
      colorObj = actualColorObj
      themeColorCache.set(colorName, colorObj || null)
    }

    if (colorObj && colorObj[shade]) {
      const result = colorObj[shade]
      colorCache.set(value, result)
      return { [prop]: result }
    }
  }

  // Slower paths for special cases

  // Check for opacity modifier
  let opacity: number | undefined
  let colorValue = value

  if (value.includes('/')) {
    const slashIndex = value.lastIndexOf('/')
    colorValue = value.slice(0, slashIndex)
    const opacityValue = Number.parseInt(value.slice(slashIndex + 1), 10)

    // Validate opacity is in 0-100 range
    if (Number.isNaN(opacityValue) || opacityValue < 0 || opacityValue > 100) {
      return undefined // Invalid opacity, skip this utility
    }
    opacity = opacityValue / 100

    // Re-check cache for the base color value
    const baseColor = colorCache.get(colorValue)
    if (baseColor) {
      const result = applyOpacity(baseColor, opacity)
      colorCache.set(value, result)
      return { [prop]: result }
    }
  }

  // Special color keywords
  const specialColor = SPECIAL_COLORS[colorValue]
  if (specialColor) {
    colorCache.set(value, specialColor)
    return { [prop]: specialColor }
  }

  // Direct color lookup (colors.black, etc.)
  let themeColor = themeColorCache.get(colorValue)
  const actualThemeColor = config.theme.colors[colorValue]

  // Verify cache is valid for current config
  if (themeColor !== actualThemeColor) {
    themeColor = actualThemeColor
    themeColorCache.set(colorValue, themeColor || null)
  }

  if (themeColor && typeof themeColor === 'string') {
    const result = opacity !== undefined
      ? applyOpacity(themeColor, opacity)
      : themeColor
    colorCache.set(value, result)
    return { [prop]: result }
  }

  // Color-shade with opacity (already handled lastIndexOf above, but may have opacity)
  if (lastDashIndex > 0 && opacity !== undefined) {
    const shade = colorValue.slice(lastDashIndex + 1)
    const colorName = colorValue.slice(0, lastDashIndex)

    let colorObj = themeColorCache.get(colorName)
    const actualColorObj = config.theme.colors[colorName]

    // Verify cache is valid for current config
    if (colorObj !== actualColorObj) {
      colorObj = actualColorObj
      themeColorCache.set(colorName, colorObj || null)
    }

    if (colorObj && typeof colorObj === 'object' && colorObj[shade]) {
      const result = applyOpacity(colorObj[shade], opacity)
      colorCache.set(value, result)
      return { [prop]: result }
    }
  }

  // Only use fallback for arbitrary values (e.g., border-[#ff0000], text-[#ff0000]/50)
  // Don't return invalid values like 'b' as colors
  // Check parsed.arbitrary OR if colorValue looks like an arbitrary value (starts with '[')
  const isArbitrary = parsed.arbitrary || (colorValue && colorValue.charCodeAt(0) === 91) // '[' char
  if (isArbitrary && colorValue) {
    const result = opacity !== undefined
      ? applyOpacity(colorValue, opacity)
      : colorValue
    colorCache.set(value, result)
    return { [prop]: result }
  }

  // No valid color found - let other rules handle this
  return undefined
}

// Helper to apply opacity to color (moved outside to reduce function creation)
function applyOpacity(color: string, opacity: number): string {
  // Strip brackets from arbitrary values: [#ff0000] -> #ff0000
  let cleanColor = color
  if (color.charCodeAt(0) === 91 && color.charCodeAt(color.length - 1) === 93) { // '[' and ']'
    cleanColor = color.slice(1, -1)
  }

  // If color is hex (#rrggbb), convert to rgb with alpha
  if (cleanColor.charCodeAt(0) === 35) { // '#' char code for faster check
    const hex = cleanColor.slice(1)
    const r = Number.parseInt(hex.slice(0, 2), 16)
    const g = Number.parseInt(hex.slice(2, 4), 16)
    const b = Number.parseInt(hex.slice(4, 6), 16)
    return `rgb(${r} ${g} ${b} / ${opacity})`
  }
  // If color already has rgb/rgba format, add/replace alpha
  if (cleanColor.charCodeAt(0) === 114) { // 'r' char code for 'rgb'
    const rgbMatch = cleanColor.match(/rgb\((\d+)\s+(\d+)\s+(\d+)/)
    if (rgbMatch) {
      return `rgb(${rgbMatch[1]} ${rgbMatch[2]} ${rgbMatch[3]} / ${opacity})`
    }
  }
  // If color is oklch format, add alpha channel
  if (cleanColor.charCodeAt(0) === 111) { // 'o' char code for 'oklch'
    const oklchMatch = cleanColor.match(/oklch\(([^)]+)\)/)
    if (oklchMatch) {
      // oklch values are: lightness chroma hue
      // Add alpha: oklch(L C H / alpha)
      return `oklch(${oklchMatch[1]} / ${opacity})`
    }
  }
  // If color is hsl/hsla format, add/replace alpha
  if (cleanColor.charCodeAt(0) === 104) { // 'h' char code for 'hsl'
    const hslMatch = cleanColor.match(/hsl\(([^)]+)\)/)
    if (hslMatch) {
      return `hsl(${hslMatch[1]} / ${opacity})`
    }
  }
  // Fallback: use opacity as-is with the color
  return cleanColor
}

// Typography utilities
export const fontSizeRule: UtilityRule = (parsed, config) => {
  if (parsed.utility === 'text' && parsed.value) {
    // Handle arbitrary values first
    if (parsed.arbitrary) {
      return { 'font-size': parsed.value } as Record<string, string>
    }
    const fontSize = config.theme.fontSize[parsed.value]
    if (fontSize) {
      return {
        'font-size': fontSize[0],
        'line-height': fontSize[1].lineHeight,
      } as Record<string, string>
    }
  }
}

export const fontWeightRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'font' && parsed.value) {
    // Handle arbitrary values first
    if (parsed.arbitrary) {
      return { 'font-weight': parsed.value }
    }
    const weights: Record<string, string> = {
      thin: '100',
      extralight: '200',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    }
    return weights[parsed.value] ? { 'font-weight': weights[parsed.value] } : undefined
  }
  return undefined
}

export const leadingRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'leading' && parsed.value) {
    // Handle arbitrary values first
    if (parsed.arbitrary) {
      return { 'line-height': parsed.value }
    }
    // Named line-height values
    const lineHeights: Record<string, string> = {
      none: '1',
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2',
      // Numeric values (rem-based)
      '3': '0.75rem',
      '4': '1rem',
      '5': '1.25rem',
      '6': '1.5rem',
      '7': '1.75rem',
      '8': '2rem',
      '9': '2.25rem',
      '10': '2.5rem',
    }
    return lineHeights[parsed.value] ? { 'line-height': lineHeights[parsed.value] } : undefined
  }
  return undefined
}

export const textAlignRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'text' && parsed.value) {
    const aligns: Record<string, string> = {
      left: 'left',
      center: 'center',
      right: 'right',
      justify: 'justify',
    }
    return aligns[parsed.value] ? { 'text-align': aligns[parsed.value] } : undefined
  }
}

// Border utilities
export const borderWidthRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'border') {
    if (!parsed.value) {
      return { 'border-width': '1px' }
    }

    // Border width values: 0, 2, 4, 8
    const widthMap: Record<string, string> = {
      0: '0px',
      2: '2px',
      4: '4px',
      8: '8px',
    }

    // Handle border-0, border-2, border-4, border-8
    if (widthMap[parsed.value]) {
      return { 'border-width': widthMap[parsed.value] }
    }

    const sideMap: Record<string, string | string[]> = {
      t: 'border-top-width',
      r: 'border-right-width',
      b: 'border-bottom-width',
      l: 'border-left-width',
    }

    // Handle border-x and border-y shortcuts
    if (parsed.value === 'x') {
      return {
        'border-left-width': '1px',
        'border-right-width': '1px',
      } as Record<string, string>
    }
    if (parsed.value === 'y') {
      return {
        'border-top-width': '1px',
        'border-bottom-width': '1px',
      } as Record<string, string>
    }

    const prop = sideMap[parsed.value]
    if (typeof prop === 'string') {
      return { [prop]: '1px' } as Record<string, string>
    }
    return undefined
  }
}

// Border side width utilities (border-t-0, border-r-2, border-x-4, etc.)
export const borderSideWidthRule: UtilityRule = (parsed) => {
  const sideUtilities: Record<string, string | string[]> = {
    'border-t': 'border-top-width',
    'border-r': 'border-right-width',
    'border-b': 'border-bottom-width',
    'border-l': 'border-left-width',
    'border-x': ['border-left-width', 'border-right-width'],
    'border-y': ['border-top-width', 'border-bottom-width'],
    // Logical borders (for RTL support)
    'border-s': 'border-inline-start-width',
    'border-e': 'border-inline-end-width',
  }

  const prop = sideUtilities[parsed.utility]
  if (!prop)
    return undefined

  // Width values: 0, 2, 4, 8 (or default to 1px if no value)
  const widthMap: Record<string, string> = {
    0: '0px',
    2: '2px',
    4: '4px',
    8: '8px',
  }

  const width = parsed.value ? widthMap[parsed.value] : '1px'
  if (!width)
    return undefined

  if (Array.isArray(prop)) {
    return prop.reduce((acc, p) => ({ ...acc, [p]: width }), {} as Record<string, string>)
  }

  return { [prop]: width }
}

export const borderRadiusRule: UtilityRule = (parsed, config) => {
  if (parsed.utility === 'rounded') {
    const value = parsed.value ? config.theme.borderRadius[parsed.value] : config.theme.borderRadius.DEFAULT
    return value ? { 'border-radius': value } : undefined
  }

  // Logical border-radius utilities (for RTL/LTR support)
  // rounded-s-* (start) - applies to start corners
  if (parsed.utility === 'rounded-s' && parsed.value) {
    const value = config.theme.borderRadius[parsed.value] || parsed.value
    return {
      'border-start-start-radius': value,
      'border-end-start-radius': value,
    } as Record<string, string>
  }
  // rounded-e-* (end) - applies to end corners
  if (parsed.utility === 'rounded-e' && parsed.value) {
    const value = config.theme.borderRadius[parsed.value] || parsed.value
    return {
      'border-start-end-radius': value,
      'border-end-end-radius': value,
    } as Record<string, string>
  }
  // rounded-ss-* (start-start corner)
  if (parsed.utility === 'rounded-ss' && parsed.value) {
    const value = config.theme.borderRadius[parsed.value] || parsed.value
    return { 'border-start-start-radius': value } as Record<string, string>
  }
  // rounded-se-* (start-end corner)
  if (parsed.utility === 'rounded-se' && parsed.value) {
    const value = config.theme.borderRadius[parsed.value] || parsed.value
    return { 'border-start-end-radius': value } as Record<string, string>
  }
  // rounded-es-* (end-start corner)
  if (parsed.utility === 'rounded-es' && parsed.value) {
    const value = config.theme.borderRadius[parsed.value] || parsed.value
    return { 'border-end-start-radius': value } as Record<string, string>
  }
  // rounded-ee-* (end-end corner)
  if (parsed.utility === 'rounded-ee' && parsed.value) {
    const value = config.theme.borderRadius[parsed.value] || parsed.value
    return { 'border-end-end-radius': value } as Record<string, string>
  }
}

// Export all rules (order matters - more specific rules first)
export const builtInRules: UtilityRule[] = [
  // CRITICAL: Most common utilities first for O(1) lookup performance
  // Rule order matters! More specific rules must come before more general ones.

  // Spacing and sizing rules (w, h, p, m are extremely common)
  spacingRule,
  sizingRule,

  // ALL rules that use utility names that might conflict MUST be ordered correctly!
  // More specific rules must come before more general ones.

  // Flexbox/Grid alignment rules (content-* for align-content)
  // MUST come before typography contentRule which generates CSS content property
  alignContentRule,  // handles content-center, content-start, etc. -> align-content

  // Typography rules (text-*)
  fontSizeRule,      // handles text-{size} (text-xl, text-sm, etc.)
  textAlignRule,     // handles text-{align} (text-center, text-left, etc.)
  ...typographyRules, // handles text-ellipsis, text-wrap, text-transform, contentRule, etc.
  fontWeightRule,
  leadingRule,       // handles leading-{size} (leading-tight, leading-none, etc.)

  // Effects rules that use 'bg' utility (bg-gradient-*, bg-fixed, bg-clip-*, etc.)
  ...effectsRules,

  // Color rule (bg, text, border are very common)
  // IMPORTANT: This must come AFTER all specific text-*, bg-*, border-* rules
  // because it will match ANY text-*, bg-*, border-* class
  colorRule,

  // Advanced rules (container, ring, space, divide, gradients, etc.)
  ...advancedRules,

  // Layout rules (specific positioning and display)
  ...layoutRules,

  // Other Flexbox rules
  flexDirectionRule,
  flexWrapRule,
  flexRule,
  flexGrowRule,
  flexShrinkRule,
  justifyContentRule,
  alignItemsRule,
  justifyItemsRule,

  // Grid rules
  ...gridRules,

  // Transform and transition rules
  ...transformsRules,

  // Effects and filters
  ...effectsRules,

  // Interactivity, SVG, and accessibility
  ...interactivityRules,

  // Forms utilities
  ...formsRules,

  // Border rules (specific side rules first)
  borderSideWidthRule,
  borderWidthRule,
  borderRadiusRule,

  // Container query utilities (@container, @container-normal, @container/name)
  containerRule,

  // Display rule last (most general - matches many utility names)
  displayRule,
]
