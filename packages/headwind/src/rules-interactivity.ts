import type { UtilityRule } from './rules'

// Filters, Tables, Interactivity, SVG, Accessibility utilities

// Filter utilities
export const filterRule: UtilityRule = (parsed) => {
  // Handle filter-none
  if (parsed.raw === 'filter-none') {
    return { filter: 'none' }
  }
  if (parsed.utility === 'blur' && parsed.value) {
    const blurMap: Record<string, string> = {
      'none': '0',
      'sm': '4px',
      'DEFAULT': '8px',
      'md': '12px',
      'lg': '16px',
      'xl': '24px',
      '2xl': '40px',
      '3xl': '64px',
    }
    return { filter: `blur(${blurMap[parsed.value] || parsed.value})` }
  }
  if (parsed.utility === 'brightness' && parsed.value) {
    return { filter: `brightness(${Number(parsed.value) / 100})` }
  }
  if (parsed.utility === 'contrast' && parsed.value) {
    return { filter: `contrast(${Number(parsed.value) / 100})` }
  }
  if (parsed.utility === 'grayscale' && parsed.value) {
    return { filter: `grayscale(${Number(parsed.value) / 100})` }
  }
  if (parsed.utility === 'invert' && parsed.value) {
    return { filter: `invert(${Number(parsed.value) / 100})` }
  }
  if (parsed.utility === 'saturate' && parsed.value) {
    return { filter: `saturate(${Number(parsed.value) / 100})` }
  }
  if (parsed.utility === 'sepia' && parsed.value) {
    return { filter: `sepia(${Number(parsed.value) / 100})` }
  }
  if (parsed.utility === 'hue-rotate' && parsed.value) {
    return { filter: `hue-rotate(${parsed.value}deg)` }
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
    return { filter: parsed.value ? (shadows[parsed.value] || `drop-shadow(${parsed.value})`) : shadows.DEFAULT }
  }
}

export const backdropFilterRule: UtilityRule = (parsed) => {
  // Handle backdrop-filter-none
  if (parsed.raw === 'backdrop-filter-none') {
    return { 'backdrop-filter': 'none' }
  }
  if (parsed.utility === 'backdrop-blur' && parsed.value) {
    return { 'backdrop-filter': `blur(${parsed.value}px)` }
  }
  if (parsed.utility === 'backdrop-brightness' && parsed.value) {
    return { 'backdrop-filter': `brightness(${Number(parsed.value) / 100})` }
  }
  if (parsed.utility === 'backdrop-contrast' && parsed.value) {
    return { 'backdrop-filter': `contrast(${Number(parsed.value) / 100})` }
  }
  if (parsed.utility === 'backdrop-grayscale' && parsed.value) {
    return { 'backdrop-filter': `grayscale(${Number(parsed.value) / 100})` }
  }
  if (parsed.utility === 'backdrop-invert' && parsed.value) {
    return { 'backdrop-filter': `invert(${Number(parsed.value) / 100})` }
  }
  if (parsed.utility === 'backdrop-saturate' && parsed.value) {
    return { 'backdrop-filter': `saturate(${Number(parsed.value) / 100})` }
  }
  if (parsed.utility === 'backdrop-sepia' && parsed.value) {
    return { 'backdrop-filter': `sepia(${Number(parsed.value) / 100})` }
  }
}

// Table utilities
export const borderCollapseRule: UtilityRule = (parsed) => {
  const values: Record<string, string> = {
    'border-collapse': 'collapse',
    'border-separate': 'separate',
  }
  return values[parsed.raw] ? { 'border-collapse': values[parsed.raw] } : undefined
}

export const borderSpacingRule: UtilityRule = (parsed, config) => {
  if (parsed.utility === 'border-spacing' && parsed.value) {
    return { 'border-spacing': config.theme.spacing[parsed.value] || parsed.value }
  }
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
  const values: Record<string, string> = {
    'caption-top': 'top',
    'caption-bottom': 'bottom',
  }
  return values[parsed.raw] ? { 'caption-side': values[parsed.raw] } : undefined
}

// Interactivity utilities
export const accentColorRule: UtilityRule = (parsed, config) => {
  if (parsed.utility === 'accent') {
    if (parsed.value === 'auto') {
      return { 'accent-color': 'auto' }
    }
    if (parsed.value) {
      const parts = parsed.value.split('-')
      if (parts.length === 2) {
        const [colorName, shade] = parts
        const colorValue = config.theme.colors[colorName]
        if (typeof colorValue === 'object' && colorValue[shade]) {
          return { 'accent-color': colorValue[shade] }
        }
      }
    }
  }
}

export const appearanceRule: UtilityRule = (parsed) => {
  const values: Record<string, string> = {
    'appearance-none': 'none',
    'appearance-auto': 'auto',
  }
  return values[parsed.raw] ? { appearance: values[parsed.raw] } : undefined
}

export const caretColorRule: UtilityRule = (parsed, config) => {
  if (parsed.utility === 'caret' && parsed.value) {
    const parts = parsed.value.split('-')
    if (parts.length === 2) {
      const [colorName, shade] = parts
      const colorValue = config.theme.colors[colorName]
      if (typeof colorValue === 'object' && colorValue[shade]) {
        return { 'caret-color': colorValue[shade] }
      }
    }
  }
}

export const colorSchemeRule: UtilityRule = (parsed) => {
  const schemes: Record<string, string> = {
    'color-scheme-normal': 'normal',
    'color-scheme-light': 'light',
    'color-scheme-dark': 'dark',
    'color-scheme-light-dark': 'light dark',
  }
  return schemes[parsed.raw] ? { 'color-scheme': schemes[parsed.raw] } : undefined
}

export const fieldSizingRule: UtilityRule = (parsed) => {
  const values: Record<string, string> = {
    'field-sizing-content': 'content',
    'field-sizing-fixed': 'fixed',
  }
  return values[parsed.raw] ? { 'field-sizing': values[parsed.raw] } : undefined
}

export const cursorRule: UtilityRule = (parsed) => {
  const cursors: Record<string, string> = {
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
  return cursors[parsed.raw] ? { cursor: cursors[parsed.raw] } : undefined
}

export const pointerEventsRule: UtilityRule = (parsed) => {
  const values: Record<string, string> = {
    'pointer-events-none': 'none',
    'pointer-events-auto': 'auto',
  }
  return values[parsed.raw] ? { 'pointer-events': values[parsed.raw] } : undefined
}

export const resizeRule: UtilityRule = (parsed) => {
  const values: Record<string, string> = {
    'resize-none': 'none',
    'resize': 'both',
    'resize-y': 'vertical',
    'resize-x': 'horizontal',
  }
  return values[parsed.raw] ? { resize: values[parsed.raw] } : undefined
}

export const scrollBehaviorRule: UtilityRule = (parsed) => {
  const values: Record<string, string> = {
    'scroll-auto': 'auto',
    'scroll-smooth': 'smooth',
  }
  return values[parsed.raw] ? { 'scroll-behavior': values[parsed.raw] } : undefined
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

  const value = config.theme.spacing[parsed.value] || parsed.value
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

  const value = config.theme.spacing[parsed.value] || parsed.value
  const result: Record<string, string> = {}
  for (const prop of props) {
    result[prop] = value
  }
  return result
}

export const scrollSnapRule: UtilityRule = (parsed) => {
  const types: Record<string, string> = {
    'snap-none': 'none',
    'snap-x': 'x mandatory',
    'snap-y': 'y mandatory',
    'snap-both': 'both mandatory',
    'snap-mandatory': 'mandatory',
    'snap-proximity': 'proximity',
  }
  if (types[parsed.raw]) {
    return parsed.raw.includes('mandatory') || parsed.raw.includes('proximity')
      ? { 'scroll-snap-type': types[parsed.raw] } as Record<string, string>
      : { 'scroll-snap-type': types[parsed.raw] } as Record<string, string>
  }

  const aligns: Record<string, string> = {
    'snap-start': 'start',
    'snap-end': 'end',
    'snap-center': 'center',
    'snap-align-none': 'none',
  }
  if (aligns[parsed.raw]) {
    return { 'scroll-snap-align': aligns[parsed.raw] } as Record<string, string>
  }

  const stops: Record<string, string> = {
    'snap-normal': 'normal',
    'snap-always': 'always',
  }
  if (stops[parsed.raw]) {
    return { 'scroll-snap-stop': stops[parsed.raw] } as Record<string, string>
  }
}

export const touchActionRule: UtilityRule = (parsed) => {
  const actions: Record<string, string> = {
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
  return actions[parsed.raw] ? { 'touch-action': actions[parsed.raw] } : undefined
}

export const userSelectRule: UtilityRule = (parsed) => {
  const selects: Record<string, string> = {
    'select-none': 'none',
    'select-text': 'text',
    'select-all': 'all',
    'select-auto': 'auto',
  }
  return selects[parsed.raw] ? { 'user-select': selects[parsed.raw] } : undefined
}

export const willChangeRule: UtilityRule = (parsed) => {
  const values: Record<string, string> = {
    'will-change-auto': 'auto',
    'will-change-scroll': 'scroll-position',
    'will-change-contents': 'contents',
    'will-change-transform': 'transform',
  }
  return values[parsed.raw] ? { 'will-change': values[parsed.raw] } : undefined
}

// SVG utilities
export const fillRule: UtilityRule = (parsed, config) => {
  if (parsed.utility === 'fill' && parsed.value) {
    if (parsed.value === 'none') {
      return { fill: 'none' }
    }
    if (parsed.value === 'current') {
      return { fill: 'currentColor' }
    }
    const parts = parsed.value.split('-')
    if (parts.length === 2) {
      const [colorName, shade] = parts
      const colorValue = config.theme.colors[colorName]
      if (typeof colorValue === 'object' && colorValue[shade]) {
        return { fill: colorValue[shade] }
      }
    }
  }
}

export const strokeRule: UtilityRule = (parsed, config) => {
  if (parsed.utility === 'stroke' && parsed.value) {
    if (parsed.value === 'none') {
      return { stroke: 'none' }
    }
    if (parsed.value === 'current') {
      return { stroke: 'currentColor' }
    }
    const parts = parsed.value.split('-')
    if (parts.length === 2) {
      const [colorName, shade] = parts
      const colorValue = config.theme.colors[colorName]
      if (typeof colorValue === 'object' && colorValue[shade]) {
        return { stroke: colorValue[shade] }
      }
    }
  }
}

export const strokeWidthRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'stroke' && parsed.value) {
    const widths: Record<string, string> = {
      0: '0',
      1: '1',
      2: '2',
    }
    return { 'stroke-width': widths[parsed.value] || parsed.value }
  }
}

// Accessibility
export const forcedColorAdjustRule: UtilityRule = (parsed) => {
  const values: Record<string, string> = {
    'forced-color-adjust-auto': 'auto',
    'forced-color-adjust-none': 'none',
  }
  return values[parsed.raw] ? { 'forced-color-adjust': values[parsed.raw] } : undefined
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
  forcedColorAdjustRule,
]
