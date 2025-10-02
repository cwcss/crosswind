import type { HeadwindConfig, ParsedClass, UtilityRuleResult } from './types'
import { advancedRules } from './rules-advanced'
import { effectsRules } from './rules-effects'
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
  return directions[parsed.raw] ? { 'flex-direction': directions[parsed.raw] } : undefined
}

export const flexWrapRule: UtilityRule = (parsed) => {
  const wraps: Record<string, string> = {
    'flex-wrap': 'wrap',
    'flex-wrap-reverse': 'wrap-reverse',
    'flex-nowrap': 'nowrap',
  }
  return wraps[parsed.raw] ? { 'flex-wrap': wraps[parsed.raw] } : undefined
}

export const flexRule: UtilityRule = (parsed) => {
  const flexValues: Record<string, string> = {
    'flex-1': '1 1 0%',
    'flex-auto': '1 1 auto',
    'flex-initial': '0 1 auto',
    'flex-none': 'none',
  }
  return flexValues[parsed.raw] ? { flex: flexValues[parsed.raw] } : undefined
}

export const justifyContentRule: UtilityRule = (parsed) => {
  const values: Record<string, string> = {
    'justify-start': 'flex-start',
    'justify-end': 'flex-end',
    'justify-center': 'center',
    'justify-between': 'space-between',
    'justify-around': 'space-around',
    'justify-evenly': 'space-evenly',
  }
  return values[parsed.raw] ? { 'justify-content': values[parsed.raw] } : undefined
}

export const alignItemsRule: UtilityRule = (parsed) => {
  const values: Record<string, string> = {
    'items-start': 'flex-start',
    'items-end': 'flex-end',
    'items-center': 'center',
    'items-baseline': 'baseline',
    'items-stretch': 'stretch',
  }
  return values[parsed.raw] ? { 'align-items': values[parsed.raw] } : undefined
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
    value = spacing ? `-${spacing}` : parsed.value
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
export const sizingRule: UtilityRule = (parsed) => {
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
      return { width: `${(num / denom) * 100}%` }
    }
    return { width: sizeMap[parsed.value] || parsed.value }
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
      return { height: `${(num / denom) * 100}%` }
    }
    return { height: sizeMap[parsed.value] || parsed.value }
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

  // Parse color value: "blue-500" -> colors.blue[500]
  const parts = parsed.value.split('-')
  if (parts.length === 2) {
    const [colorName, shade] = parts
    const colorValue = config.theme.colors[colorName]
    if (typeof colorValue === 'object' && colorValue[shade]) {
      return { [prop]: colorValue[shade] }
    }
  }

  // Direct color: "black" -> colors.black
  const directColor = config.theme.colors[parsed.value]
  if (typeof directColor === 'string') {
    return { [prop]: directColor }
  }

  // Fallback to raw value for custom colors like "bg-#ff0000"
  return { [prop]: parsed.value }
}

// Typography utilities
export const fontSizeRule: UtilityRule = (parsed, config) => {
  if (parsed.utility === 'text' && parsed.value) {
    const fontSize = config.theme.fontSize[parsed.value]
    if (fontSize) {
      return {
        'font-size': fontSize[0],
        'line-height': fontSize[1].lineHeight,
      }
    }
  }
}

export const fontWeightRule: UtilityRule = (parsed) => {
  const weights: Record<string, string> = {
    'font-thin': '100',
    'font-extralight': '200',
    'font-light': '300',
    'font-normal': '400',
    'font-medium': '500',
    'font-semibold': '600',
    'font-bold': '700',
    'font-extrabold': '800',
    'font-black': '900',
  }
  return weights[parsed.raw] ? { 'font-weight': weights[parsed.raw] } : undefined
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
    const sideMap: Record<string, string> = {
      t: 'border-top-width',
      r: 'border-right-width',
      b: 'border-bottom-width',
      l: 'border-left-width',
    }
    const prop = sideMap[parsed.value]
    return prop ? { [prop]: '1px' } : undefined
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
  justifyContentRule,
  alignItemsRule,

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
