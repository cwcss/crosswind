import type { UtilityRule } from './rules'

// Layout utilities

export const aspectRatioRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'aspect') {
    const ratios: Record<string, string> = {
      auto: 'auto',
      square: '1 / 1',
      video: '16 / 9',
    }
    return parsed.value ? { 'aspect-ratio': ratios[parsed.value] || parsed.value } : undefined
  }
}

export const columnsRule: UtilityRule = (parsed, config) => {
  if (parsed.utility === 'columns' && parsed.value) {
    // Named column counts
    const columnCounts: Record<string, string> = {
      '1': '1',
      '2': '2',
      '3': '3',
      '4': '4',
      '5': '5',
      '6': '6',
      '7': '7',
      '8': '8',
      '9': '9',
      '10': '10',
      '11': '11',
      '12': '12',
      'auto': 'auto',
    }

    // Named column widths (like Tailwind)
    const columnWidths: Record<string, string> = {
      '3xs': '16rem',
      '2xs': '18rem',
      'xs': '20rem',
      'sm': '24rem',
      'md': '28rem',
      'lg': '32rem',
      'xl': '36rem',
      '2xl': '42rem',
      '3xl': '48rem',
      '4xl': '56rem',
      '5xl': '64rem',
      '6xl': '72rem',
      '7xl': '80rem',
    }

    // Check column counts first
    if (columnCounts[parsed.value]) {
      return { columns: columnCounts[parsed.value] }
    }

    // Check named widths
    if (columnWidths[parsed.value]) {
      return { columns: columnWidths[parsed.value] }
    }

    // Check spacing config
    if (config.theme.spacing[parsed.value]) {
      return { columns: config.theme.spacing[parsed.value] }
    }

    // Arbitrary value support
    return { columns: parsed.value }
  }
}

// Column fill
export const columnFillRule: UtilityRule = (parsed) => {
  const values: Record<string, string> = {
    'column-fill-auto': 'auto',
    'column-fill-balance': 'balance',
    'column-fill-balance-all': 'balance-all',
  }
  return values[parsed.raw] ? { 'column-fill': values[parsed.raw] } : undefined
}

// Column gap (different from grid gap)
export const columnGapRule: UtilityRule = (parsed, config) => {
  if (parsed.utility === 'column-gap' && parsed.value) {
    return { 'column-gap': config.theme.spacing[parsed.value] || parsed.value }
  }
}

// Column rule (border between columns)
export const columnRuleRule: UtilityRule = (parsed, config) => {
  // column-rule-width
  if (parsed.utility === 'column-rule' && parsed.value) {
    const widths: Record<string, string> = {
      '0': '0px',
      '1': '1px',
      '2': '2px',
      '4': '4px',
      '8': '8px',
    }
    if (widths[parsed.value]) {
      return { 'column-rule-width': widths[parsed.value] }
    }

    // Check for colors
    const parts = parsed.value.split('-')
    if (parts.length === 2) {
      const [colorName, shade] = parts
      const colorValue = config.theme.colors[colorName]
      if (typeof colorValue === 'object' && colorValue[shade]) {
        return { 'column-rule-color': colorValue[shade] }
      }
    }

    // Direct color
    const directColor = config.theme.colors[parsed.value]
    if (typeof directColor === 'string') {
      return { 'column-rule-color': directColor }
    }

    // Style
    const styles: Record<string, string> = {
      solid: 'solid',
      dashed: 'dashed',
      dotted: 'dotted',
      double: 'double',
      hidden: 'hidden',
      none: 'none',
    }
    if (styles[parsed.value]) {
      return { 'column-rule-style': styles[parsed.value] }
    }
  }
}

// Column span
export const columnSpanRule: UtilityRule = (parsed) => {
  const values: Record<string, string> = {
    'column-span-all': 'all',
    'column-span-none': 'none',
  }
  return values[parsed.raw] ? { 'column-span': values[parsed.raw] } : undefined
}

export const breakRule: UtilityRule = (parsed) => {
  const breaks: Record<string, Record<string, string>> = {
    'break-before-auto': { 'break-before': 'auto' },
    'break-before-avoid': { 'break-before': 'avoid' },
    'break-before-all': { 'break-before': 'all' },
    'break-before-avoid-page': { 'break-before': 'avoid-page' },
    'break-before-page': { 'break-before': 'page' },
    'break-after-auto': { 'break-after': 'auto' },
    'break-after-avoid': { 'break-after': 'avoid' },
    'break-after-all': { 'break-after': 'all' },
    'break-after-avoid-page': { 'break-after': 'avoid-page' },
    'break-after-page': { 'break-after': 'page' },
    'break-inside-auto': { 'break-inside': 'auto' },
    'break-inside-avoid': { 'break-inside': 'avoid' },
    'break-inside-avoid-page': { 'break-inside': 'avoid-page' },
    'break-inside-avoid-column': { 'break-inside': 'avoid-column' },
  }
  return breaks[parsed.raw]
}

export const boxDecorationRule: UtilityRule = (parsed) => {
  const values: Record<string, string> = {
    'box-decoration-clone': 'clone',
    'box-decoration-slice': 'slice',
  }
  return values[parsed.raw] ? { 'box-decoration-break': values[parsed.raw] } : undefined
}

export const boxSizingRule: UtilityRule = (parsed) => {
  const values: Record<string, string> = {
    'box-border': 'border-box',
    'box-content': 'content-box',
  }
  return values[parsed.raw] ? { 'box-sizing': values[parsed.raw] } : undefined
}

export const floatRule: UtilityRule = (parsed) => {
  const floats: Record<string, string> = {
    'float-start': 'inline-start',
    'float-end': 'inline-end',
    'float-right': 'right',
    'float-left': 'left',
    'float-none': 'none',
  }
  return floats[parsed.raw] ? { float: floats[parsed.raw] } : undefined
}

export const clearRule: UtilityRule = (parsed) => {
  const clears: Record<string, string> = {
    'clear-start': 'inline-start',
    'clear-end': 'inline-end',
    'clear-left': 'left',
    'clear-right': 'right',
    'clear-both': 'both',
    'clear-none': 'none',
  }
  return clears[parsed.raw] ? { clear: clears[parsed.raw] } : undefined
}

export const isolationRule: UtilityRule = (parsed) => {
  const values: Record<string, string> = {
    'isolate': 'isolate',
    'isolation-auto': 'auto',
  }
  return values[parsed.raw] ? { isolation: values[parsed.raw] } : undefined
}

export const objectFitRule: UtilityRule = (parsed) => {
  const fits: Record<string, string> = {
    'object-contain': 'contain',
    'object-cover': 'cover',
    'object-fill': 'fill',
    'object-none': 'none',
    'object-scale-down': 'scale-down',
  }
  return fits[parsed.raw] ? { 'object-fit': fits[parsed.raw] } : undefined
}

export const objectPositionRule: UtilityRule = (parsed) => {
  const positions: Record<string, string> = {
    'object-bottom': 'bottom',
    'object-center': 'center',
    'object-left': 'left',
    'object-left-bottom': 'left bottom',
    'object-left-top': 'left top',
    'object-right': 'right',
    'object-right-bottom': 'right bottom',
    'object-right-top': 'right top',
    'object-top': 'top',
  }
  return positions[parsed.raw] ? { 'object-position': positions[parsed.raw] } : undefined
}

export const overflowRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'overflow') {
    const values = ['auto', 'hidden', 'clip', 'visible', 'scroll']
    if (parsed.value && values.includes(parsed.value)) {
      return { overflow: parsed.value }
    }
  }
  if (parsed.utility === 'overflow-x' || parsed.utility === 'overflow-y') {
    const values = ['auto', 'hidden', 'clip', 'visible', 'scroll']
    if (parsed.value && values.includes(parsed.value)) {
      return { [parsed.utility]: parsed.value }
    }
  }
}

export const overscrollRule: UtilityRule = (parsed) => {
  const behaviors: Record<string, string> = {
    'overscroll-auto': 'auto',
    'overscroll-contain': 'contain',
    'overscroll-none': 'none',
    'overscroll-x-auto': 'auto',
    'overscroll-x-contain': 'contain',
    'overscroll-x-none': 'none',
    'overscroll-y-auto': 'auto',
    'overscroll-y-contain': 'contain',
    'overscroll-y-none': 'none',
  }
  const prop = parsed.raw.startsWith('overscroll-x')
    ? 'overscroll-behavior-x'
    : parsed.raw.startsWith('overscroll-y')
      ? 'overscroll-behavior-y'
      : 'overscroll-behavior'
  return behaviors[parsed.raw] ? { [prop]: behaviors[parsed.raw] } : undefined
}

export const positionRule: UtilityRule = (parsed) => {
  const positions = ['static', 'fixed', 'absolute', 'relative', 'sticky']
  if (positions.includes(parsed.utility)) {
    return { position: parsed.utility }
  }
}

export const insetRule: UtilityRule = (parsed, config) => {
  const directions: Record<string, string[]> = {
    'inset': ['top', 'right', 'bottom', 'left'],
    'inset-x': ['left', 'right'],
    'inset-y': ['top', 'bottom'],
    'top': ['top'],
    'right': ['right'],
    'bottom': ['bottom'],
    'left': ['left'],
  }

  const props = directions[parsed.utility]
  if (!props || !parsed.value)
    return undefined

  // Helper to resolve inset value (handles fractions, spacing, keywords)
  const resolveInsetValue = (val: string): string => {
    // Handle fractions: 1/2 -> 50%, 1/3 -> 33.333333%, etc.
    if (val.includes('/')) {
      const [num, denom] = val.split('/').map(Number)
      if (!Number.isNaN(num) && !Number.isNaN(denom) && denom !== 0) {
        return `${(num / denom) * 100}%`
      }
    }
    // Handle special keywords
    if (val === 'full')
      return '100%'
    if (val === 'auto')
      return 'auto'
    // Check spacing config, then fall back to raw value
    return config.theme.spacing[val] || val
  }

  // Handle negative values
  let value: string
  if (parsed.value.startsWith('-')) {
    const positiveValue = parsed.value.slice(1)
    const resolved = resolveInsetValue(positiveValue)
    // For percentage values, negate properly
    if (resolved.endsWith('%')) {
      const numericPart = Number.parseFloat(resolved)
      value = `${-numericPart}%`
    }
    else {
      value = resolved.startsWith('-') ? resolved : `-${resolved}`
    }
  }
  else {
    value = resolveInsetValue(parsed.value)
  }

  const result: Record<string, string> = {}
  for (const prop of props) {
    result[prop] = value
  }
  return result
}

export const visibilityRule: UtilityRule = (parsed) => {
  const values: Record<string, string> = {
    visible: 'visible',
    invisible: 'hidden',
    collapse: 'collapse',
  }
  return values[parsed.utility] ? { visibility: values[parsed.utility] } : undefined
}

export const zIndexRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'z' && parsed.value) {
    const zIndexMap: Record<string, string> = {
      0: '0',
      10: '10',
      20: '20',
      30: '30',
      40: '40',
      50: '50',
      auto: 'auto',
    }
    return { 'z-index': zIndexMap[parsed.value] || parsed.value }
  }
}

export const layoutRules: UtilityRule[] = [
  aspectRatioRule,
  columnsRule,
  columnFillRule,
  columnGapRule,
  columnRuleRule,
  columnSpanRule,
  breakRule,
  boxDecorationRule,
  boxSizingRule,
  floatRule,
  clearRule,
  isolationRule,
  objectFitRule,
  objectPositionRule,
  overflowRule,
  overscrollRule,
  positionRule,
  insetRule,
  visibilityRule,
  zIndexRule,
]
