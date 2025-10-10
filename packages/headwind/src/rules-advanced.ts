import type { UtilityRule } from './rules'

// Advanced utilities

// Min/Max sizing
export const minMaxSizingRule: UtilityRule = (parsed, config) => {
  const minMaxMap: Record<string, string> = {
    '0': '0',
    'full': '100%',
    'min': 'min-content',
    'max': 'max-content',
    'fit': 'fit-content',
    'none': 'none',
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
    'screen': '100vw',
  }

  if (parsed.utility === 'min-w' && parsed.value) {
    const value = config.theme.spacing[parsed.value] || minMaxMap[parsed.value] || parsed.value
    return { 'min-width': value } as Record<string, string>
  }
  if (parsed.utility === 'max-w' && parsed.value) {
    const value = config.theme.spacing[parsed.value] || minMaxMap[parsed.value] || parsed.value
    return { 'max-width': value } as Record<string, string>
  }
  if (parsed.utility === 'min-h' && parsed.value) {
    const hMap: Record<string, string> = { ...minMaxMap, screen: '100vh' }
    const value = config.theme.spacing[parsed.value] || hMap[parsed.value] || parsed.value
    return { 'min-height': value } as Record<string, string>
  }
  if (parsed.utility === 'max-h' && parsed.value) {
    const hMap: Record<string, string> = { ...minMaxMap, screen: '100vh' }
    const value = config.theme.spacing[parsed.value] || hMap[parsed.value] || parsed.value
    return { 'max-height': value } as Record<string, string>
  }
}

// Ring utilities
export const ringRule: UtilityRule = (parsed, config) => {
  if (parsed.utility === 'ring') {
    // Handle ring-inset
    if (parsed.value === 'inset') {
      return { '--hw-ring-inset': 'inset' } as Record<string, string>
    }

    // Check if this is a ring color (e.g., ring-sky-500)
    if (parsed.value) {
      const parts = parsed.value.split('-')
      if (parts.length >= 2) {
        const colorName = parts.slice(0, -1).join('-')
        const shade = parts[parts.length - 1]
        const colorValue = config.theme.colors[colorName]
        if (typeof colorValue === 'object' && colorValue[shade]) {
          return { '--hw-ring-color': colorValue[shade] } as Record<string, string>
        }
        // Also check if it's a direct color value (like custom colors)
        if (config.theme.colors[parsed.value]) {
          return { '--hw-ring-color': config.theme.colors[parsed.value] } as Record<string, string>
        }
      }
    }

    // Handle ring width
    const widths: Record<string, string> = {
      0: '0',
      1: '1px',
      2: '2px',
      4: '4px',
      8: '8px',
      DEFAULT: '3px',
    }
    const width = parsed.value ? widths[parsed.value] || parsed.value : widths.DEFAULT
    return {
      '--hw-ring-offset-shadow': 'var(--hw-ring-inset) 0 0 0 var(--hw-ring-offset-width) var(--hw-ring-offset-color)',
      '--hw-ring-shadow': `var(--hw-ring-inset) 0 0 0 calc(${width} + var(--hw-ring-offset-width)) var(--hw-ring-color)`,
      'box-shadow': 'var(--hw-ring-offset-shadow), var(--hw-ring-shadow), var(--hw-shadow, 0 0 #0000)',
    } as Record<string, string>
  }

  if (parsed.utility === 'ring-offset' && parsed.value) {
    const widths: Record<string, string> = {
      0: '0px',
      1: '1px',
      2: '2px',
      4: '4px',
      8: '8px',
    }
    return { '--hw-ring-offset-width': widths[parsed.value] || parsed.value } as Record<string, string>
  }

  if (parsed.utility === 'ring-offset-color' || (parsed.utility === 'ring-offset' && parsed.value)) {
    // Handle ring-offset-{color}
    const value = parsed.value
    if (value) {
      const parts = value.split('-')
      if (parts.length >= 2) {
        const colorName = parts.slice(0, -1).join('-')
        const shade = parts[parts.length - 1]
        const colorValue = config.theme.colors[colorName]
        if (typeof colorValue === 'object' && colorValue[shade]) {
          return { '--hw-ring-offset-color': colorValue[shade] } as Record<string, string>
        }
      }
    }
  }
}

// Space utilities (child spacing)
export const spaceRule: UtilityRule = (parsed, config) => {
  if (parsed.utility === 'space-x' && parsed.value) {
    let spacing: string
    if (parsed.value.startsWith('-')) {
      const positiveValue = parsed.value.slice(1)
      const baseSpacing = config.theme.spacing[positiveValue]
      spacing = baseSpacing ? `-${baseSpacing}` : parsed.value
    }
    else {
      spacing = config.theme.spacing[parsed.value] || parsed.value
    }

    return {
      properties: {
        '--hw-space-x-reverse': '0',
        'margin-right': `calc(${spacing} * var(--hw-space-x-reverse))`,
        'margin-left': `calc(${spacing} * calc(1 - var(--hw-space-x-reverse)))`,
      } as Record<string, string>,
      childSelector: '> :not([hidden]) ~ :not([hidden])',
    }
  }

  if (parsed.utility === 'space-y' && parsed.value) {
    let spacing: string
    if (parsed.value.startsWith('-')) {
      const positiveValue = parsed.value.slice(1)
      const baseSpacing = config.theme.spacing[positiveValue]
      spacing = baseSpacing ? `-${baseSpacing}` : parsed.value
    }
    else {
      spacing = config.theme.spacing[parsed.value] || parsed.value
    }

    return {
      properties: {
        '--hw-space-y-reverse': '0',
        'margin-top': `calc(${spacing} * calc(1 - var(--hw-space-y-reverse)))`,
        'margin-bottom': `calc(${spacing} * var(--hw-space-y-reverse))`,
      } as Record<string, string>,
      childSelector: '> :not([hidden]) ~ :not([hidden])',
    }
  }
}

// Border style utilities
export const borderStyleRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'border' && parsed.value) {
    const styles: Record<string, string> = {
      solid: 'solid',
      dashed: 'dashed',
      dotted: 'dotted',
      double: 'double',
      hidden: 'hidden',
      none: 'none',
    }
    if (styles[parsed.value]) {
      return { 'border-style': styles[parsed.value] }
    }
  }
}

// Divide utilities (borders between children)
export const divideRule: UtilityRule = (parsed, config) => {
  // Handle divide styles: divide-solid, divide-dashed, divide-dotted
  if (parsed.utility === 'divide' && parsed.value) {
    const styles: Record<string, string> = {
      solid: 'solid',
      dashed: 'dashed',
      dotted: 'dotted',
      double: 'double',
      none: 'none',
    }
    if (styles[parsed.value]) {
      return {
        properties: {
          'border-style': styles[parsed.value],
        } as Record<string, string>,
        childSelector: '> :not([hidden]) ~ :not([hidden])',
      }
    }
  }

  if (parsed.utility === 'divide-x') {
    const widths: Record<string, string> = {
      0: '0',
      2: '2px',
      4: '4px',
      8: '8px',
      DEFAULT: '1px',
    }
    const width = parsed.value ? (widths[parsed.value] || parsed.value) : widths.DEFAULT

    return {
      properties: {
        '--hw-divide-x-reverse': '0',
        'border-right-width': `calc(${width} * var(--hw-divide-x-reverse))`,
        'border-left-width': `calc(${width} * calc(1 - var(--hw-divide-x-reverse)))`,
      } as Record<string, string>,
      childSelector: '> :not([hidden]) ~ :not([hidden])',
    }
  }

  if (parsed.utility === 'divide-y') {
    const widths: Record<string, string> = {
      0: '0',
      2: '2px',
      4: '4px',
      8: '8px',
      DEFAULT: '1px',
    }
    const width = parsed.value ? (widths[parsed.value] || parsed.value) : widths.DEFAULT

    return {
      properties: {
        '--hw-divide-y-reverse': '0',
        'border-top-width': `calc(${width} * calc(1 - var(--hw-divide-y-reverse)))`,
        'border-bottom-width': `calc(${width} * var(--hw-divide-y-reverse))`,
      } as Record<string, string>,
      childSelector: '> :not([hidden]) ~ :not([hidden])',
    }
  }

  if (parsed.utility === 'divide' && parsed.value) {
    // divide-{color}-{shade}
    const parts = parsed.value.split('-')
    if (parts.length >= 2) {
      const colorName = parts.slice(0, -1).join('-')
      const shade = parts[parts.length - 1]
      const colorValue = config.theme.colors[colorName]
      if (typeof colorValue === 'object' && colorValue[shade]) {
        return {
          properties: {
            'border-color': colorValue[shade],
          } as Record<string, string>,
          childSelector: '> :not([hidden]) ~ :not([hidden])',
        }
      }
    }
  }
}

// Gradient color stops
export const gradientStopsRule: UtilityRule = (parsed, config) => {
  const getColor = (value: string) => {
    const parts = value.split('-')
    if (parts.length >= 2) {
      const colorName = parts.slice(0, -1).join('-')
      const shade = parts[parts.length - 1]
      const colorValue = config.theme.colors[colorName]
      if (typeof colorValue === 'object' && colorValue[shade]) {
        return colorValue[shade]
      }
    }
    return value
  }

  if (parsed.utility === 'from' && parsed.value) {
    const color = getColor(parsed.value)
    return {
      '--hw-gradient-from': color,
      '--hw-gradient-to': 'rgb(255 255 255 / 0)',
      '--hw-gradient-stops': 'var(--hw-gradient-from), var(--hw-gradient-to)',
    } as Record<string, string>
  }

  if (parsed.utility === 'via' && parsed.value) {
    const color = getColor(parsed.value)
    return {
      '--hw-gradient-to': 'rgb(255 255 255 / 0)',
      '--hw-gradient-stops': `var(--hw-gradient-from), ${color}, var(--hw-gradient-to)`,
    } as Record<string, string>
  }

  if (parsed.utility === 'to' && parsed.value) {
    const color = getColor(parsed.value)
    return {
      '--hw-gradient-to': color,
    } as Record<string, string>
  }
}

// Flex order
export const flexOrderRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'order' && parsed.value) {
    const orders: Record<string, string> = {
      first: '-9999',
      last: '9999',
      none: '0',
      1: '1',
      2: '2',
      3: '3',
      4: '4',
      5: '5',
      6: '6',
      7: '7',
      8: '8',
      9: '9',
      10: '10',
      11: '11',
      12: '12',
    }
    return { order: orders[parsed.value] || parsed.value }
  }
}

// Flex basis
export const flexBasisRule: UtilityRule = (parsed, config) => {
  if (parsed.utility === 'basis' && parsed.value) {
    // Handle fractions
    if (parsed.value.includes('/')) {
      const [num, denom] = parsed.value.split('/').map(Number)
      return { 'flex-basis': `${(num / denom) * 100}%` }
    }

    const bases: Record<string, string> = {
      auto: 'auto',
      full: '100%',
      0: '0',
    }
    return { 'flex-basis': bases[parsed.value] || config.theme.spacing[parsed.value] || parsed.value }
  }
}

// Justify/Align self
export const justifySelfRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'justify-self') {
    const values: Record<string, string> = {
      auto: 'auto',
      start: 'start',
      end: 'end',
      center: 'center',
      stretch: 'stretch',
    }
    return parsed.value ? { 'justify-self': values[parsed.value] || parsed.value } : undefined
  }
}

export const alignSelfRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'self') {
    const values: Record<string, string> = {
      auto: 'auto',
      start: 'flex-start',
      end: 'flex-end',
      center: 'center',
      stretch: 'stretch',
      baseline: 'baseline',
    }
    return parsed.value ? { 'align-self': values[parsed.value] || parsed.value } : undefined
  }
}

// Container utility
// TODO: Requires nested media query support in generator
export const containerRule: UtilityRule = (parsed, _config) => {
  if (parsed.utility === 'container' && !parsed.value) {
    // Simplified version without responsive max-widths
    return {
      'width': '100%',
      'margin-left': 'auto',
      'margin-right': 'auto',
      'padding-left': '1rem',
      'padding-right': '1rem',
    }
  }
}

// Arbitrary properties
export const arbitraryPropertyRule: UtilityRule = (parsed) => {
  // Only handle true arbitrary properties: [color:red], [mask-type:alpha]
  // NOT arbitrary values like w-[100px]
  const rawWithoutImportant = parsed.raw.replace(/^!/, '')
  if (parsed.arbitrary && parsed.utility && parsed.value && rawWithoutImportant.startsWith('[')) {
    // Arbitrary properties start with [ and have the pattern [prop:value]
    return { [parsed.utility]: parsed.value }
  }
}

export const advancedRules: UtilityRule[] = [
  minMaxSizingRule,
  ringRule,
  borderStyleRule,
  spaceRule,
  divideRule,
  gradientStopsRule,
  flexOrderRule,
  flexBasisRule,
  justifySelfRule,
  alignSelfRule,
  containerRule,
  arbitraryPropertyRule,
]
