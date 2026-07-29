import type { UtilityRule } from './rules'
import { resolveColorValue } from './rules'

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
    'antialiased': {
      '-webkit-font-smoothing': 'antialiased',
      '-moz-osx-font-smoothing': 'grayscale',
    },
    'subpixel-antialiased': {
      '-webkit-font-smoothing': 'auto',
      '-moz-osx-font-smoothing': 'auto',
    },
  }
  return values[parsed.base]
}

export const fontStyleRule: UtilityRule = (parsed) => {
  const styles: Record<string, string> = {
    'italic': 'italic',
    'not-italic': 'normal',
  }
  return styles[parsed.base] ? { 'font-style': styles[parsed.base] } : undefined
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
    'ordinal': 'ordinal',
    'slashed-zero': 'slashed-zero',
    'lining-nums': 'lining-nums',
    'oldstyle-nums': 'oldstyle-nums',
    'proportional-nums': 'proportional-nums',
    'tabular-nums': 'tabular-nums',
    'diagonal-fractions': 'diagonal-fractions',
    'stacked-fractions': 'stacked-fractions',
  }
  return variants[parsed.base] ? { 'font-variant-numeric': variants[parsed.base] } : undefined
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
    if (parsed.arbitrary)
      return { 'letter-spacing': parsed.value }
    // Handle negative values (named scale only: -tracking-wide)
    if (parsed.value.startsWith('-')) {
      const positiveValue = parsed.value.slice(1)
      return values[positiveValue] ? { 'letter-spacing': `-${values[positiveValue]}` } : undefined
    }
    // Unknown words are rejected — `letter-spacing: foo` is not a declaration.
    return values[parsed.value] ? { 'letter-spacing': values[parsed.value] } : undefined
  }
}

export const lineClampRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'line-clamp' && parsed.value) {
    // Tailwind: line-clamp-none unsets the clamp
    if (parsed.value === 'none') {
      return {
        'overflow': 'visible',
        'display': 'block',
        '-webkit-box-orient': 'horizontal',
        '-webkit-line-clamp': 'none',
      }
    }
    // A clamp is a line count: integers or arbitrary values only
    if (!parsed.arbitrary && !/^\d+$/.test(parsed.value))
      return undefined
    return {
      'overflow': 'hidden',
      'display': '-webkit-box',
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
  return positions[parsed.base] ? { 'list-style-position': positions[parsed.base] } : undefined
}

export const listStyleTypeRule: UtilityRule = (parsed) => {
  if (parsed.utility !== 'list' || !parsed.value)
    return undefined
  const types: Record<string, string> = {
    none: 'none',
    disc: 'disc',
    decimal: 'decimal',
  }
  // Only match recognized list-style-type values. Returning the raw value as
  // a fallback turned `list-item` (which is `display: list-item`, handled by
  // displayRule) into an invalid `list-style-type: item` rule and shadowed
  // the display utility entirely.
  return types[parsed.value] ? { 'list-style-type': types[parsed.value] } : undefined
}

export const textDecorationRule: UtilityRule = (parsed, config) => {
  const decorations: Record<string, string> = {
    'underline': 'underline',
    'overline': 'overline',
    'line-through': 'line-through',
    'no-underline': 'none',
  }
  if (decorations[parsed.base]) {
    return { 'text-decoration-line': decorations[parsed.base] } as Record<string, string>
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
      return { 'text-decoration-style': styles[parsed.value] } as Record<string, string>
    }

    // Check if it's a thickness
    const thicknesses: Record<string, string> = {
      'auto': 'auto',
      'from-font': 'from-font',
      '0': '0px',
      '1': '1px',
      '2': '2px',
      '4': '4px',
      '8': '8px',
    }
    if (thicknesses[parsed.value]) {
      return { 'text-decoration-thickness': thicknesses[parsed.value] } as Record<string, string>
    }

    // Handle arbitrary thickness
    if (parsed.arbitrary) {
      return { 'text-decoration-thickness': parsed.value } as Record<string, string>
    }

    // Otherwise treat it as a color: decoration-blue-500, decoration-white/50
    const color = resolveColorValue(parsed.value, config)
    if (color) {
      return { 'text-decoration-color': color } as Record<string, string>
    }

    // Unknown words are not colors — the fallback leaked decoration-foo
    // into text-decoration-color verbatim. (Arbitrary values were already
    // consumed by the thickness/color branches above.)
    return undefined
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
    if (offsets[parsed.value])
      return { 'text-underline-offset': offsets[parsed.value] }
    if (parsed.arbitrary)
      return { 'text-underline-offset': parsed.value }
    // Off-scale numbers keep the px scale; unknown words are rejected
    if (/^\d+(?:\.\d+)?$/.test(parsed.value))
      return { 'text-underline-offset': `${parsed.value}px` }
    return undefined
  }
}

export const textTransformRule: UtilityRule = (parsed) => {
  const transforms: Record<string, string> = {
    'uppercase': 'uppercase',
    'lowercase': 'lowercase',
    'capitalize': 'capitalize',
    'normal-case': 'none',
  }
  return transforms[parsed.base] ? { 'text-transform': transforms[parsed.base] } : undefined
}

export const textOverflowRule: UtilityRule = (parsed) => {
  const overflows: Record<string, Record<string, string>> = {
    'truncate': {
      'overflow': 'hidden',
      'text-overflow': 'ellipsis',
      'white-space': 'nowrap',
    },
    'text-ellipsis': { 'text-overflow': 'ellipsis' },
    'text-clip': { 'text-overflow': 'clip' },
  }
  return overflows[parsed.base]
}

export const textWrapRule: UtilityRule = (parsed) => {
  const wraps: Record<string, string> = {
    'text-wrap': 'wrap',
    'text-nowrap': 'nowrap',
    'text-balance': 'balance',
    'text-pretty': 'pretty',
  }
  return wraps[parsed.base] ? { 'text-wrap': wraps[parsed.base] } : undefined
}

export const textIndentRule: UtilityRule = (parsed, config) => {
  if (parsed.utility === 'indent' && parsed.value) {
    if (parsed.arbitrary)
      return { 'text-indent': parsed.value }
    // Theme scale or off-scale numbers (0.25rem steps); unknown words
    // previously leaked into `text-indent` verbatim.
    const resolve = (token: string): string | undefined => {
      const hit = config.theme.spacing[token]
      if (hit !== undefined)
        return hit
      if (/^\d+(?:\.\d+)?$/.test(token))
        return `${Number.parseFloat(token) * 0.25}rem`
      return undefined
    }
    if (parsed.value.startsWith('-')) {
      const spacing = resolve(parsed.value.slice(1))
      return spacing !== undefined ? { 'text-indent': `-${spacing}` } : undefined
    }
    const spacing = resolve(parsed.value)
    return spacing !== undefined ? { 'text-indent': spacing } : undefined
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
  return aligns[parsed.base] ? { 'vertical-align': aligns[parsed.base] } : undefined
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
  return spaces[parsed.base] ? { 'white-space': spaces[parsed.base] } : undefined
}

export const wordBreakRule: UtilityRule = (parsed) => {
  if (parsed.base === 'break-normal') {
    return {
      'overflow-wrap': 'normal',
      'word-break': 'normal',
    } as Record<string, string>
  }
  if (parsed.base === 'break-words') {
    return { 'overflow-wrap': 'break-word' } as Record<string, string>
  }
  const breaks: Record<string, string> = {
    'break-all': 'break-all',
    'break-keep': 'keep-all',
  }
  return breaks[parsed.base] ? { 'word-break': breaks[parsed.base] } : undefined
}

export const overflowWrapRule: UtilityRule = (parsed) => {
  const wraps: Record<string, string> = {
    'overflow-wrap-normal': 'normal',
    'overflow-wrap-break': 'break-word',
    'overflow-wrap-anywhere': 'anywhere',
  }
  return wraps[parsed.base] ? { 'overflow-wrap': wraps[parsed.base] } : undefined
}

export const hyphensRule: UtilityRule = (parsed) => {
  const values: Record<string, string> = {
    'hyphens-none': 'none',
    'hyphens-manual': 'manual',
    'hyphens-auto': 'auto',
  }
  return values[parsed.base] ? { hyphens: values[parsed.base] } : undefined
}

export const contentRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'content' && parsed.value) {
    const values: Record<string, string> = {
      none: 'none',
    }
    // If value is already quoted or is a special value, use as-is
    // Only none, already-quoted strings, and arbitrary values. Auto-quoting
    // bare words turned semantic class names like `content-wrapper` into
    // `content: "wrapper"`; align-content keywords (content-center, ...)
    // are handled by their own rule.
    if (values[parsed.value] || parsed.value.startsWith('"') || parsed.value.startsWith('\'')) {
      return { content: values[parsed.value] || parsed.value }
    }
    if (parsed.arbitrary)
      return { content: parsed.value }
    return undefined
  }
}

export const lineHeightRule: UtilityRule = (parsed, _config) => {
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

    if (lineHeights[parsed.value])
      return { 'line-height': lineHeights[parsed.value] }
    if (parsed.arbitrary)
      return { 'line-height': parsed.value }
    // Off-scale numbers keep the 0.25rem step (Tailwind v4 leading-<number>);
    // unknown words previously leaked into `line-height` verbatim.
    if (/^\d+(?:\.\d+)?$/.test(parsed.value))
      return { 'line-height': `${Number.parseFloat(parsed.value) * 0.25}rem` }
    return undefined
  }
}

// Writing mode
export const writingModeRule: UtilityRule = (parsed) => {
  const values: Record<string, string> = {
    'writing-horizontal-tb': 'horizontal-tb',
    'writing-vertical-rl': 'vertical-rl',
    'writing-vertical-lr': 'vertical-lr',
  }
  return values[parsed.base] ? { 'writing-mode': values[parsed.base] } : undefined
}

// Text orientation
export const textOrientationRule: UtilityRule = (parsed) => {
  const values: Record<string, string> = {
    'text-orientation-mixed': 'mixed',
    'text-orientation-upright': 'upright',
    'text-orientation-sideways': 'sideways',
  }
  return values[parsed.base] ? { 'text-orientation': values[parsed.base] } : undefined
}

// Direction (ltr/rtl)
export const directionRule: UtilityRule = (parsed) => {
  const values: Record<string, string> = {
    'direction-ltr': 'ltr',
    'direction-rtl': 'rtl',
  }
  return values[parsed.base] ? { direction: values[parsed.base] } : undefined
}

// Text emphasis
export const textEmphasisRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'text-emphasis' && parsed.value) {
    const styles: Record<string, string> = {
      'none': 'none',
      'filled': 'filled',
      'open': 'open',
      'dot': 'dot',
      'circle': 'circle',
      'double-circle': 'double-circle',
      'triangle': 'triangle',
      'sesame': 'sesame',
    }
    if (styles[parsed.value])
      return { 'text-emphasis': styles[parsed.value] }
    return parsed.arbitrary ? { 'text-emphasis': parsed.value } : undefined
  }
}

// Text emphasis color
export const textEmphasisColorRule: UtilityRule = (parsed, config) => {
  if (parsed.utility === 'text-emphasis-color' && parsed.value) {
    const parts = parsed.value.split('-')
    if (parts.length === 2) {
      const [colorName, shade] = parts
      const colorValue = config.theme.colors[colorName]
      if (typeof colorValue === 'object' && colorValue[shade]) {
        return { 'text-emphasis-color': colorValue[shade] }
      }
    }
    const directColor = config.theme.colors[parsed.value]
    if (typeof directColor === 'string') {
      return { 'text-emphasis-color': directColor }
    }

    // Nested color object referenced by its bare name → `DEFAULT` shade.
    if (typeof directColor === 'object' && directColor !== null && typeof directColor.DEFAULT === 'string') {
      return { 'text-emphasis-color': directColor.DEFAULT }
    }
  }
}

// Word spacing
export const wordSpacingRule: UtilityRule = (parsed, config) => {
  if (parsed.utility === 'word-spacing' && parsed.value) {
    const values: Record<string, string> = {
      'tighter': '-0.05em',
      'tight': '-0.025em',
      'normal': 'normal',
      'wide': '0.025em',
      'wider': '0.05em',
      'widest': '0.1em',
    }
    if (values[parsed.value])
      return { 'word-spacing': values[parsed.value] }
    if (config.theme.spacing[parsed.value])
      return { 'word-spacing': config.theme.spacing[parsed.value] }
    if (parsed.arbitrary)
      return { 'word-spacing': parsed.value }
    return undefined
  }
}

// Font variant caps
export const fontVariantCapsRule: UtilityRule = (parsed) => {
  const values: Record<string, string> = {
    'small-caps': 'small-caps',
    'all-small-caps': 'all-small-caps',
    'petite-caps': 'petite-caps',
    'all-petite-caps': 'all-petite-caps',
    'unicase': 'unicase',
    'titling-caps': 'titling-caps',
    'normal-caps': 'normal',
  }
  return values[parsed.base] ? { 'font-variant-caps': values[parsed.base] } : undefined
}

// Font variant ligatures
export const fontVariantLigaturesRule: UtilityRule = (parsed) => {
  const values: Record<string, string> = {
    'ligatures-normal': 'normal',
    'ligatures-none': 'none',
    'common-ligatures': 'common-ligatures',
    'no-common-ligatures': 'no-common-ligatures',
    'discretionary-ligatures': 'discretionary-ligatures',
    'no-discretionary-ligatures': 'no-discretionary-ligatures',
    'historical-ligatures': 'historical-ligatures',
    'no-historical-ligatures': 'no-historical-ligatures',
    'contextual': 'contextual',
    'no-contextual': 'no-contextual',
  }
  return values[parsed.base] ? { 'font-variant-ligatures': values[parsed.base] } : undefined
}

export const typographyRules: UtilityRule[] = [
  fontFamilyRule,
  fontSmoothingRule,
  fontStyleRule,
  fontStretchRule,
  fontVariantNumericRule,
  fontVariantCapsRule,
  fontVariantLigaturesRule,
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
  writingModeRule,
  textOrientationRule,
  directionRule,
  textEmphasisRule,
  textEmphasisColorRule,
  wordSpacingRule,
]
