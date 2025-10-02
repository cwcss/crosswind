import type { UtilityRule } from './rules'

// Typography utilities

export const fontFamilyRule: UtilityRule = (parsed, config) => {
  if (parsed.utility === 'font' && parsed.value) {
    const family = config.theme.fontFamily[parsed.value]
    if (family) {
      return { 'font-family': family.join(', ') }
    }
  }
}

export const fontSmoothingRule: UtilityRule = (parsed) => {
  const values: Record<string, Record<string, string>> = {
    antialiased: {
      '-webkit-font-smoothing': 'antialiased',
      '-moz-osx-font-smoothing': 'grayscale',
    },
    'subpixel-antialiased': {
      '-webkit-font-smoothing': 'auto',
      '-moz-osx-font-smoothing': 'auto',
    },
  }
  return values[parsed.raw]
}

export const fontStyleRule: UtilityRule = (parsed) => {
  const styles: Record<string, string> = {
    italic: 'italic',
    'not-italic': 'normal',
  }
  return styles[parsed.raw] ? { 'font-style': styles[parsed.raw] } : undefined
}

export const fontStretchRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'font-stretch') {
    const stretches = ['ultra-condensed', 'extra-condensed', 'condensed', 'semi-condensed', 'normal', 'semi-expanded', 'expanded', 'extra-expanded', 'ultra-expanded']
    return parsed.value && stretches.includes(parsed.value) ? { 'font-stretch': parsed.value } : undefined
  }
}

export const fontVariantNumericRule: UtilityRule = (parsed) => {
  const variants: Record<string, string> = {
    'normal-nums': 'normal',
    ordinal: 'ordinal',
    'slashed-zero': 'slashed-zero',
    'lining-nums': 'lining-nums',
    'oldstyle-nums': 'oldstyle-nums',
    'proportional-nums': 'proportional-nums',
    'tabular-nums': 'tabular-nums',
    'diagonal-fractions': 'diagonal-fractions',
    'stacked-fractions': 'stacked-fractions',
  }
  return variants[parsed.raw] ? { 'font-variant-numeric': variants[parsed.raw] } : undefined
}

export const letterSpacingRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'tracking') {
    const values: Record<string, string> = {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0em',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    }
    if (!parsed.value) {
      return undefined
    }
    // Handle negative values
    if (parsed.value.startsWith('-')) {
      const positiveValue = parsed.value.slice(1)
      return { 'letter-spacing': `-${values[positiveValue] || positiveValue}` }
    }
    return { 'letter-spacing': values[parsed.value] || parsed.value }
  }
}

export const lineClampRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'line-clamp' && parsed.value) {
    return {
      overflow: 'hidden',
      display: '-webkit-box',
      '-webkit-box-orient': 'vertical',
      '-webkit-line-clamp': parsed.value,
    }
  }
}

export const listStyleImageRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'list-image' && parsed.value) {
    return { 'list-style-image': parsed.value === 'none' ? 'none' : `url(${parsed.value})` }
  }
}

export const listStylePositionRule: UtilityRule = (parsed) => {
  const positions: Record<string, string> = {
    'list-inside': 'inside',
    'list-outside': 'outside',
  }
  return positions[parsed.raw] ? { 'list-style-position': positions[parsed.raw] } : undefined
}

export const listStyleTypeRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'list') {
    const types: Record<string, string> = {
      none: 'none',
      disc: 'disc',
      decimal: 'decimal',
    }
    return parsed.value ? { 'list-style-type': types[parsed.value] || parsed.value } : undefined
  }
}

export const textDecorationRule: UtilityRule = (parsed, config) => {
  const decorations: Record<string, string> = {
    underline: 'underline',
    overline: 'overline',
    'line-through': 'line-through',
    'no-underline': 'none',
  }
  if (decorations[parsed.raw]) {
    return { 'text-decoration-line': decorations[parsed.raw] }
  }

  if (parsed.utility === 'decoration' && parsed.value) {
    const styles: Record<string, string> = {
      solid: 'solid',
      double: 'double',
      dotted: 'dotted',
      dashed: 'dashed',
      wavy: 'wavy',
    }

    // Check if it's a style
    if (styles[parsed.value]) {
      return { 'text-decoration-style': styles[parsed.value] }
    }

    // Check if it's a thickness
    const thicknesses: Record<string, string> = {
      auto: 'auto',
      'from-font': 'from-font',
      0: '0px',
      1: '1px',
      2: '2px',
      4: '4px',
      8: '8px',
    }
    if (thicknesses[parsed.value]) {
      return { 'text-decoration-thickness': thicknesses[parsed.value] }
    }

    // Handle arbitrary thickness
    if (parsed.arbitrary) {
      return { 'text-decoration-thickness': parsed.value }
    }

    // Otherwise treat it as a color: decoration-blue-500
    const parts = parsed.value.split('-')
    if (parts.length === 2) {
      const [colorName, shade] = parts
      const colorValue = config.theme.colors[colorName]
      if (typeof colorValue === 'object' && colorValue[shade]) {
        return { 'text-decoration-color': colorValue[shade] }
      }
    }

    // Direct color
    const directColor = config.theme.colors[parsed.value]
    if (typeof directColor === 'string') {
      return { 'text-decoration-color': directColor }
    }

    // Fallback
    return { 'text-decoration-color': parsed.value }
  }

  return undefined
}

export const underlineOffsetRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'underline-offset' && parsed.value) {
    const offsets: Record<string, string> = {
      auto: 'auto',
      0: '0px',
      1: '1px',
      2: '2px',
      4: '4px',
      8: '8px',
    }
    return { 'text-underline-offset': offsets[parsed.value] || parsed.value }
  }
}

export const textTransformRule: UtilityRule = (parsed) => {
  const transforms: Record<string, string> = {
    uppercase: 'uppercase',
    lowercase: 'lowercase',
    capitalize: 'capitalize',
    'normal-case': 'none',
  }
  return transforms[parsed.raw] ? { 'text-transform': transforms[parsed.raw] } : undefined
}

export const textOverflowRule: UtilityRule = (parsed) => {
  const overflows: Record<string, Record<string, string>> = {
    truncate: {
      overflow: 'hidden',
      'text-overflow': 'ellipsis',
      'white-space': 'nowrap',
    },
    'text-ellipsis': { 'text-overflow': 'ellipsis' },
    'text-clip': { 'text-overflow': 'clip' },
  }
  return overflows[parsed.raw]
}

export const textWrapRule: UtilityRule = (parsed) => {
  const wraps: Record<string, string> = {
    'text-wrap': 'wrap',
    'text-nowrap': 'nowrap',
    'text-balance': 'balance',
    'text-pretty': 'pretty',
  }
  return wraps[parsed.raw] ? { 'text-wrap': wraps[parsed.raw] } : undefined
}

export const textIndentRule: UtilityRule = (parsed, config) => {
  if (parsed.utility === 'indent' && parsed.value) {
    // Handle negative values
    if (parsed.value.startsWith('-')) {
      const positiveValue = parsed.value.slice(1)
      const spacing = config.theme.spacing[positiveValue] || positiveValue
      return { 'text-indent': `-${spacing}` }
    }
    return { 'text-indent': config.theme.spacing[parsed.value] || parsed.value }
  }
}

export const verticalAlignRule: UtilityRule = (parsed) => {
  const aligns: Record<string, string> = {
    'align-baseline': 'baseline',
    'align-top': 'top',
    'align-middle': 'middle',
    'align-bottom': 'bottom',
    'align-text-top': 'text-top',
    'align-text-bottom': 'text-bottom',
    'align-sub': 'sub',
    'align-super': 'super',
  }
  return aligns[parsed.raw] ? { 'vertical-align': aligns[parsed.raw] } : undefined
}

export const whiteSpaceRule: UtilityRule = (parsed) => {
  const spaces: Record<string, string> = {
    'whitespace-normal': 'normal',
    'whitespace-nowrap': 'nowrap',
    'whitespace-pre': 'pre',
    'whitespace-pre-line': 'pre-line',
    'whitespace-pre-wrap': 'pre-wrap',
    'whitespace-break-spaces': 'break-spaces',
  }
  return spaces[parsed.raw] ? { 'white-space': spaces[parsed.raw] } : undefined
}

export const wordBreakRule: UtilityRule = (parsed) => {
  if (parsed.raw === 'break-normal') {
    return {
      'overflow-wrap': 'normal',
      'word-break': 'normal',
    }
  }
  if (parsed.raw === 'break-words') {
    return { 'overflow-wrap': 'break-word' }
  }
  const breaks: Record<string, string> = {
    'break-all': 'break-all',
    'break-keep': 'keep-all',
  }
  return breaks[parsed.raw] ? { 'word-break': breaks[parsed.raw] } : undefined
}

export const overflowWrapRule: UtilityRule = (parsed) => {
  const wraps: Record<string, string> = {
    'overflow-wrap-normal': 'normal',
    'overflow-wrap-break': 'break-word',
    'overflow-wrap-anywhere': 'anywhere',
  }
  return wraps[parsed.raw] ? { 'overflow-wrap': wraps[parsed.raw] } : undefined
}

export const hyphensRule: UtilityRule = (parsed) => {
  const values: Record<string, string> = {
    'hyphens-none': 'none',
    'hyphens-manual': 'manual',
    'hyphens-auto': 'auto',
  }
  return values[parsed.raw] ? { hyphens: values[parsed.raw] } : undefined
}

export const contentRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'content' && parsed.value) {
    const values: Record<string, string> = {
      none: 'none',
    }
    // If value is already quoted or is a special value, use as-is
    if (values[parsed.value] || parsed.value.startsWith('"') || parsed.value.startsWith("'")) {
      return { content: values[parsed.value] || parsed.value }
    }
    // Otherwise wrap in quotes
    return { content: `"${parsed.value}"` }
  }
}

export const lineHeightRule: UtilityRule = (parsed, config) => {
  if (parsed.utility === 'leading') {
    if (!parsed.value) {
      return undefined
    }

    const lineHeights: Record<string, string> = {
      none: '1',
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2',
      3: '.75rem',
      4: '1rem',
      5: '1.25rem',
      6: '1.5rem',
      7: '1.75rem',
      8: '2rem',
      9: '2.25rem',
      10: '2.5rem',
    }

    return { 'line-height': lineHeights[parsed.value] || parsed.value }
  }
}

export const typographyRules: UtilityRule[] = [
  fontFamilyRule,
  fontSmoothingRule,
  fontStyleRule,
  fontStretchRule,
  fontVariantNumericRule,
  letterSpacingRule,
  lineHeightRule,
  lineClampRule,
  listStyleImageRule,
  listStylePositionRule,
  listStyleTypeRule,
  textDecorationRule,
  underlineOffsetRule,
  textTransformRule,
  textOverflowRule,
  textWrapRule,
  textIndentRule,
  verticalAlignRule,
  whiteSpaceRule,
  wordBreakRule,
  overflowWrapRule,
  hyphensRule,
  contentRule,
]
