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
    m: ['margin'],
    mx: ['margin-left', 'margin-right'],
    my: ['margin-top', 'margin-bottom'],
    mt: ['margin-top'],
    mr: ['margin-right'],
    mb: ['margin-bottom'],
    ml: ['margin-left'],
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
      return { height: `${(num / denom) * 100}%` } as Record<string, string>
    }
    // Check spacing config first, then sizeMap, then raw value
    const value = config.theme.spacing[parsed.value] || sizeMap[parsed.value] || parsed.value
    return { height: value } as Record<string, string>
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
    opacity = Number.parseInt(value.slice(slashIndex + 1), 10) / 100

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

  // Fallback to raw value for custom colors
  const result = opacity !== undefined
    ? applyOpacity(colorValue, opacity)
    : colorValue
  colorCache.set(value, result)
  return { [prop]: result }
}

// Helper to apply opacity to color (moved outside to reduce function creation)
function applyOpacity(color: string, opacity: number): string {
  // If color is hex (#rrggbb), convert to rgb with alpha
  if (color.charCodeAt(0) === 35) { // '#' char code for faster check
    const hex = color.slice(1)
    const r = Number.parseInt(hex.slice(0, 2), 16)
    const g = Number.parseInt(hex.slice(2, 4), 16)
    const b = Number.parseInt(hex.slice(4, 6), 16)
    return `rgb(${r} ${g} ${b} / ${opacity})`
  }
  // If color already has rgb/rgba format, add/replace alpha
  if (color.charCodeAt(0) === 114) { // 'r' char code for 'rgb'
    const rgbMatch = color.match(/rgb\((\d+)\s+(\d+)\s+(\d+)/)
    if (rgbMatch) {
      return `rgb(${rgbMatch[1]} ${rgbMatch[2]} ${rgbMatch[3]} / ${opacity})`
    }
  }
  // Fallback: use opacity as-is with the color
  return color
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

export const borderRadiusRule: UtilityRule = (parsed, config) => {
  if (parsed.utility === 'rounded') {
    const value = parsed.value ? config.theme.borderRadius[parsed.value] : config.theme.borderRadius.DEFAULT
    return value ? { 'border-radius': value } : undefined
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

  // Border rules
  borderWidthRule,
  borderRadiusRule,

  // Display rule last (most general - matches many utility names)
  displayRule,
]
