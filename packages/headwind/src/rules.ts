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
export const colorRule: UtilityRule = (parsed, config) => {
  const colorProps: Record<string, string> = {
    bg: 'background-color',
    text: 'color',
    border: 'border-color',
  }

  const prop = colorProps[parsed.utility]
  if (!prop || !parsed.value)
    return undefined

  // Check for opacity modifier: "blue-500/50" -> 50% opacity
  let opacity: number | undefined
  let colorValue = parsed.value

  if (parsed.value.includes('/')) {
    const slashIndex = parsed.value.lastIndexOf('/')
    const opacityStr = parsed.value.slice(slashIndex + 1)
    colorValue = parsed.value.slice(0, slashIndex)
    opacity = Number.parseInt(opacityStr, 10) / 100
  }

  // Helper to apply opacity to color
  const applyOpacity = (color: string, opacity: number): string => {
    // If color is hex (#rrggbb), convert to rgb with alpha
    if (color.startsWith('#')) {
      const hex = color.slice(1)
      const r = Number.parseInt(hex.slice(0, 2), 16)
      const g = Number.parseInt(hex.slice(2, 4), 16)
      const b = Number.parseInt(hex.slice(4, 6), 16)
      return `rgb(${r} ${g} ${b} / ${opacity})`
    }
    // If color already has rgb/rgba format, add/replace alpha
    if (color.startsWith('rgb')) {
      const rgbMatch = color.match(/rgb\((\d+)\s+(\d+)\s+(\d+)/)
      if (rgbMatch) {
        return `rgb(${rgbMatch[1]} ${rgbMatch[2]} ${rgbMatch[3]} / ${opacity})`
      }
    }
    // Fallback: use opacity as-is with the color
    return color
  }

  // Handle special color keywords
  const specialColors: Record<string, string> = {
    current: 'currentColor',
    transparent: 'transparent',
    inherit: 'inherit',
  }
  if (specialColors[colorValue]) {
    return { [prop]: specialColors[colorValue] }
  }

  // Parse color value: "blue-500" -> colors.blue[500]
  const parts = colorValue.split('-')
  if (parts.length === 2) {
    const [colorName, shade] = parts
    const themeColorValue = config.theme.colors[colorName]
    if (typeof themeColorValue === 'object' && themeColorValue[shade]) {
      const finalColor = opacity !== undefined
        ? applyOpacity(themeColorValue[shade], opacity)
        : themeColorValue[shade]
      return { [prop]: finalColor }
    }
  }

  // Direct color: "black" -> colors.black
  const directColor = config.theme.colors[colorValue]
  if (typeof directColor === 'string') {
    const finalColor = opacity !== undefined
      ? applyOpacity(directColor, opacity)
      : directColor
    return { [prop]: finalColor }
  }

  // Fallback to raw value for custom colors
  const finalColor = opacity !== undefined
    ? applyOpacity(colorValue, opacity)
    : colorValue
  return { [prop]: finalColor }
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
  // Advanced rules (container, ring, space, divide, gradients, etc.)
  ...advancedRules,

  // Layout rules (specific positioning and display)
  ...layoutRules,

  // Flexbox rules before display (flex-col before display: flex)
  flexDirectionRule,
  flexWrapRule,
  flexRule,
  flexGrowRule,
  flexShrinkRule,
  justifyContentRule,
  alignItemsRule,
  justifyItemsRule,
  alignContentRule,

  // Grid rules
  ...gridRules,

  // Typography rules (specific before general)
  ...typographyRules,
  fontSizeRule,
  textAlignRule,
  fontWeightRule,

  // Transform and transition rules
  ...transformsRules,

  // Effects and filters
  ...effectsRules,

  // Interactivity, SVG, and accessibility
  ...interactivityRules,

  // Forms utilities
  ...formsRules,

  // Spacing and sizing rules
  spacingRule,
  sizingRule,

  // Border rules
  borderWidthRule,
  borderRadiusRule,

  // Display and color rules last (most general)
  displayRule,
  colorRule,
]
