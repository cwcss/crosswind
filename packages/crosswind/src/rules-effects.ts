import type { UtilityRule } from './rules'
import { resolveColorValue } from './rules'

// =============================================================================
// Shadow color helpers
// =============================================================================

// Flat color cache for shadow color lookups
let shadowColorCache: Map<string, string> | null = null
let shadowColorCacheConfig: any = null

function buildShadowColorCache(colors: Record<string, any>): Map<string, string> {
  const cache = new Map<string, string>()
  for (const [name, value] of Object.entries(colors)) {
    if (typeof value === 'string') {
      cache.set(name, value)
    }
    else if (typeof value === 'object' && value !== null) {
      for (const [shade, shadeValue] of Object.entries(value)) {
        if (typeof shadeValue === 'string') {
          // The `DEFAULT` shade maps to the bare color name (Tailwind convention).
          cache.set(shade === 'DEFAULT' ? name : `${name}-${shade}`, shadeValue)
        }
      }
    }
  }
  return cache
}

function applyShadowOpacity(color: string, opacity: number): string {
  if (color.charCodeAt(0) === 35) { // '#'
    let hex = color.slice(1)
    // Expand 3-char hex (#rgb) to 6-char (#rrggbb)
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
    }
    const r = Number.parseInt(hex.slice(0, 2), 16)
    const g = Number.parseInt(hex.slice(2, 4), 16)
    const b = Number.parseInt(hex.slice(4, 6), 16)
    return `rgb(${r} ${g} ${b} / ${opacity})`
  }
  return color
}

/**
 * Replace color values in a shadow string with var(--cw-shadow-color)
 * e.g., '0 10px 15px -3px rgb(0 0 0 / 0.1)' -> '0 10px 15px -3px var(--cw-shadow-color)'
*/
function createColoredShadow(shadow: string): string {
  return shadow.replace(/rgba?\([^)]+\)/g, 'var(--cw-shadow-color)')
}

// =============================================================================
// Backgrounds, Borders, Effects utilities
// =============================================================================

// Background utilities
export const backgroundAttachmentRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'bg' && parsed.value) {
    const values: Record<string, string> = {
      fixed: 'fixed',
      local: 'local',
      scroll: 'scroll',
    }
    return values[parsed.value] ? { 'background-attachment': values[parsed.value] } : undefined
  }
  return undefined
}

export const backgroundClipRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'bg' && parsed.value && parsed.value.startsWith('clip-')) {
    const val = parsed.value.replace('clip-', '')
    const values: Record<string, string> = {
      border: 'border-box',
      padding: 'padding-box',
      content: 'content-box',
      text: 'text',
    }
    return values[val] ? { 'background-clip': values[val] } : undefined
  }
  return undefined
}

export const backgroundImageRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'bg' && parsed.value) {
    const gradients: Record<string, string> = {
      'gradient-to-t': 'linear-gradient(to top, var(--cw-gradient-stops))',
      'gradient-to-tr': 'linear-gradient(to top right, var(--cw-gradient-stops))',
      'gradient-to-r': 'linear-gradient(to right, var(--cw-gradient-stops))',
      'gradient-to-br': 'linear-gradient(to bottom right, var(--cw-gradient-stops))',
      'gradient-to-b': 'linear-gradient(to bottom, var(--cw-gradient-stops))',
      'gradient-to-bl': 'linear-gradient(to bottom left, var(--cw-gradient-stops))',
      'gradient-to-l': 'linear-gradient(to left, var(--cw-gradient-stops))',
      'gradient-to-tl': 'linear-gradient(to top left, var(--cw-gradient-stops))',
    }
    if (gradients[parsed.value]) {
      return { 'background-image': gradients[parsed.value] } as Record<string, string>
    }
  }
}

export const backgroundOriginRule: UtilityRule = (parsed) => {
  const values: Record<string, string> = {
    'bg-origin-border': 'border-box',
    'bg-origin-padding': 'padding-box',
    'bg-origin-content': 'content-box',
  }
  return values[parsed.raw] ? { 'background-origin': values[parsed.raw] } : undefined
}

export const backgroundPositionRule: UtilityRule = (parsed) => {
  const positions: Record<string, string> = {
    'bg-bottom': 'bottom',
    'bg-center': 'center',
    'bg-left': 'left',
    'bg-left-bottom': 'left bottom',
    'bg-left-top': 'left top',
    'bg-right': 'right',
    'bg-right-bottom': 'right bottom',
    'bg-right-top': 'right top',
    'bg-top': 'top',
  }
  return positions[parsed.raw] ? { 'background-position': positions[parsed.raw] } : undefined
}

export const backgroundRepeatRule: UtilityRule = (parsed) => {
  const repeats: Record<string, string> = {
    'bg-repeat': 'repeat',
    'bg-no-repeat': 'no-repeat',
    'bg-repeat-x': 'repeat-x',
    'bg-repeat-y': 'repeat-y',
    'bg-repeat-round': 'round',
    'bg-repeat-space': 'space',
  }
  return repeats[parsed.raw] ? { 'background-repeat': repeats[parsed.raw] } : undefined
}

export const backgroundSizeRule: UtilityRule = (parsed) => {
  const sizes: Record<string, string> = {
    'bg-auto': 'auto',
    'bg-cover': 'cover',
    'bg-contain': 'contain',
  }
  return sizes[parsed.raw] ? { 'background-size': sizes[parsed.raw] } : undefined
}

// Border utilities
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
    return styles[parsed.value] ? { 'border-style': styles[parsed.value] } : undefined
  }
  return undefined
}

export const outlineRule: UtilityRule = (parsed, config) => {
  // Outline offset
  if (parsed.utility === 'outline-offset' && parsed.value) {
    const offsets: Record<string, string> = {
      0: '0px',
      1: '1px',
      2: '2px',
      4: '4px',
      8: '8px',
    }
    if (offsets[parsed.value])
      return { 'outline-offset': offsets[parsed.value] } as Record<string, string>
    if (parsed.arbitrary)
      return { 'outline-offset': parsed.value } as Record<string, string>
    // Off-scale numbers keep the px scale; unknown words are rejected
    if (/^\d+(?:\.\d+)?$/.test(parsed.value))
      return { 'outline-offset': `${parsed.value}px` } as Record<string, string>
    return undefined
  }

  // Outline styles
  if (parsed.utility === 'outline' && parsed.value) {
    const outlineStyles: Record<string, string> = {
      none: 'none',
      solid: 'solid',
      dashed: 'dashed',
      dotted: 'dotted',
      double: 'double',
    }
    if (outlineStyles[parsed.value]) {
      return { 'outline-style': outlineStyles[parsed.value] } as Record<string, string>
    }
    // Tailwind v4: outline-hidden hides the outline but preserves it in
    // forced-colors mode via a transparent outline.
    if (parsed.value === 'hidden') {
      return { 'outline': '2px solid transparent', 'outline-offset': '2px' } as Record<string, string>
    }
  }

  if (parsed.utility === 'outline') {
    if (!parsed.value) {
      return { 'outline-width': '1px' } as Record<string, string>
    }

    // Check for colors (e.g., outline-blue-500, outline-white/50)
    const color = resolveColorValue(parsed.value, config)
    if (color) {
      return { 'outline-color': color } as Record<string, string>
    }

    // Widths: scale keys, bare numbers (px implied), or arbitrary values.
    // Unknown words previously leaked into outline-width verbatim.
    const widths: Record<string, string> = {
      0: '0px',
      1: '1px',
      2: '2px',
      4: '4px',
      8: '8px',
    }
    if (widths[parsed.value]) {
      return { 'outline-width': widths[parsed.value] } as Record<string, string>
    }
    if (parsed.arbitrary) {
      return { 'outline-width': parsed.value } as Record<string, string>
    }
    if (/^\d+(?:\.\d+)?$/.test(parsed.value)) {
      return { 'outline-width': `${parsed.value}px` } as Record<string, string>
    }
    return undefined
  }
}

// Effect utilities
export const boxShadowThemeRule: UtilityRule = (parsed, config) => {
  if (parsed.utility === 'shadow') {
    // An arbitrary value is either a whole shadow (`shadow-[0_1px_4px_black]`)
    // or just a shadow COLOR (`shadow-[#ff0000]`), which shadowColorRule
    // below owns. A shadow definition always has offsets, so the presence of
    // whitespace — underscores in the class, spaces once parsed — tells the
    // two apart. Without this branch every arbitrary shadow fell through the
    // theme lookup and emitted no CSS at all, silently dropping the utility.
    const isArbitraryShadow = parsed.arbitrary
      && !!parsed.value
      && (/\s/.test(parsed.value) || parsed.value === 'none')

    const shadow = isArbitraryShadow
      ? parsed.value
      : parsed.value
        ? config.theme.boxShadow[parsed.value]
        : config.theme.boxShadow.DEFAULT
    if (!shadow) return undefined

    // shadow-none is a simple reset — no CSS variables needed
    if (shadow === 'none') {
      return {
        '--cw-shadow': '0 0 #0000',
        'box-shadow': 'var(--cw-ring-offset-shadow, 0 0 #0000), var(--cw-ring-shadow, 0 0 #0000), var(--cw-shadow)',
      } as Record<string, string>
    }

    // Generate CSS variable-based shadow for color support
    const colored = createColoredShadow(shadow)
    return {
      '--cw-shadow': shadow,
      '--cw-shadow-colored': colored,
      'box-shadow': 'var(--cw-ring-offset-shadow, 0 0 #0000), var(--cw-ring-shadow, 0 0 #0000), var(--cw-shadow)',
    } as Record<string, string>
  }
}

// Shadow color utilities (shadow-{color}, shadow-{color}/{opacity})
export const shadowColorRule: UtilityRule = (parsed, config) => {
  if (parsed.utility !== 'shadow' || !parsed.value)
    return undefined

  // Skip if it matches a theme shadow size (sm, md, lg, xl, none, DEFAULT)
  if (config.theme.boxShadow[parsed.value])
    return undefined

  // Skip a full arbitrary shadow definition — boxShadowThemeRule owns those.
  // Only a bare arbitrary COLOR (`shadow-[#ff0000]`) belongs here.
  if (parsed.arbitrary && /\s/.test(parsed.value))
    return undefined

  // Build/update color cache if needed
  if (shadowColorCache === null || shadowColorCacheConfig !== config.theme.colors) {
    shadowColorCache = buildShadowColorCache(config.theme.colors)
    shadowColorCacheConfig = config.theme.colors
  }

  const value = parsed.value
  const slashIdx = value.indexOf('/')

  let colorName: string
  let opacity: number | undefined

  if (slashIdx !== -1) {
    colorName = value.slice(0, slashIdx)
    const opacityStr = value.slice(slashIdx + 1)

    // Handle arbitrary opacity: /[0.04], /[0.5]
    if (opacityStr.charCodeAt(0) === 91 && opacityStr.charCodeAt(opacityStr.length - 1) === 93) {
      const arbitraryOpacity = Number.parseFloat(opacityStr.slice(1, -1))
      if (Number.isNaN(arbitraryOpacity) || arbitraryOpacity < 0 || arbitraryOpacity > 1)
        return undefined
      opacity = arbitraryOpacity
    }
    else {
      const opacityValue = Number.parseInt(opacityStr, 10)
      if (Number.isNaN(opacityValue) || opacityValue < 0 || opacityValue > 100)
        return undefined
      opacity = opacityValue / 100
    }
  }
  else {
    colorName = value
  }

  // An arbitrary literal (`shadow-[#ff0000]`, `shadow-[rgb(1_2_3)]`) is a
  // real colour the theme has never heard of, so fall back to using it
  // verbatim rather than dropping the utility.
  const resolvedColor = shadowColorCache.get(colorName)
    ?? (parsed.arbitrary ? colorName : undefined)
  if (!resolvedColor) return undefined

  const finalColor = opacity !== undefined
    ? applyShadowOpacity(resolvedColor, opacity)
    : resolvedColor

  return {
    '--cw-shadow-color': finalColor,
    '--cw-shadow': 'var(--cw-shadow-colored)',
  } as Record<string, string>
}

export const textShadowRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'text-shadow') {
    const shadows: Record<string, string> = {
      sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
      DEFAULT: '0 1px 3px rgba(0, 0, 0, 0.1)',
      md: '0 4px 6px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
      xl: '0 20px 25px rgba(0, 0, 0, 0.1)',
      none: 'none',
    }
    if (!parsed.value)
      return { 'text-shadow': shadows.DEFAULT }
    if (shadows[parsed.value])
      return { 'text-shadow': shadows[parsed.value] }
    return parsed.arbitrary ? { 'text-shadow': parsed.value } : undefined
  }
}

export const opacityRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'opacity' && parsed.value) {
    const opacityMap: Record<string, string> = {
      0: '0',
      5: '0.05',
      10: '0.1',
      20: '0.2',
      25: '0.25',
      30: '0.3',
      40: '0.4',
      50: '0.5',
      60: '0.6',
      70: '0.7',
      75: '0.75',
      80: '0.8',
      90: '0.9',
      95: '0.95',
      100: '1',
    }
    if (opacityMap[parsed.value])
      return { opacity: opacityMap[parsed.value] }
    // Arbitrary values pass through; any bare integer maps to n/100
    // (Tailwind v4: `opacity-33` → 0.33). Unknown words are rejected —
    // `opacity: foo` is not a declaration.
    if (parsed.arbitrary)
      return { opacity: parsed.value }
    if (/^\d+$/.test(parsed.value)) {
      const n = Number.parseInt(parsed.value, 10)
      if (n >= 0 && n <= 100)
        return { opacity: `${n / 100}` }
    }
    return undefined
  }
}

export const mixBlendModeRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'mix-blend') {
    const modes = ['normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity']
    return parsed.value && modes.includes(parsed.value) ? { 'mix-blend-mode': parsed.value } : undefined
  }
}

export const backgroundBlendModeRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'bg-blend') {
    const modes = ['normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity']
    return parsed.value && modes.includes(parsed.value) ? { 'background-blend-mode': parsed.value } : undefined
  }
}

// Mask utilities
export const maskRule: UtilityRule = (parsed) => {
  // mask-clip
  if (parsed.utility === 'mask-clip' && parsed.value) {
    const clips: Record<string, string> = {
      'border': 'border-box',
      'padding': 'padding-box',
      'content': 'content-box',
      'text': 'text',
      'fill': 'fill-box',
      'stroke': 'stroke-box',
      'view': 'view-box',
      'no-clip': 'no-clip',
    }
    if (clips[parsed.value])
      return { 'mask-clip': clips[parsed.value] } as Record<string, string>
    return parsed.arbitrary ? { 'mask-clip': parsed.value } as Record<string, string> : undefined
  }

  // mask-composite
  if (parsed.utility === 'mask-composite' && parsed.value) {
    const composites = ['add', 'subtract', 'intersect', 'exclude']
    return composites.includes(parsed.value) ? { 'mask-composite': parsed.value } as Record<string, string> : undefined
  }

  // mask-image
  if (parsed.utility === 'mask-image' && parsed.value) {
    if (parsed.value === 'none') {
      return { 'mask-image': 'none' } as Record<string, string>
    }
    // Arbitrary values only: url(...) and gradients pass through; wrapping a
    // bare word produced mask-image: url(foo) — a bogus relative request.
    if (parsed.arbitrary) {
      const value = parsed.value.startsWith('url(') || parsed.value.includes('gradient(')
        ? parsed.value
        : `url(${parsed.value})`
      return { 'mask-image': value } as Record<string, string>
    }
    return undefined
  }

  // mask-mode
  if (parsed.utility === 'mask-mode' && parsed.value) {
    const modes = ['alpha', 'luminance', 'match-source']
    return modes.includes(parsed.value) ? { 'mask-mode': parsed.value } as Record<string, string> : undefined
  }

  // mask-origin
  if (parsed.utility === 'mask-origin' && parsed.value) {
    const origins: Record<string, string> = {
      border: 'border-box',
      padding: 'padding-box',
      content: 'content-box',
      fill: 'fill-box',
      stroke: 'stroke-box',
      view: 'view-box',
    }
    if (origins[parsed.value])
      return { 'mask-origin': origins[parsed.value] } as Record<string, string>
    return parsed.arbitrary ? { 'mask-origin': parsed.value } as Record<string, string> : undefined
  }

  // mask-position
  if (parsed.utility === 'mask-position' && parsed.value) {
    const positions: Record<string, string> = {
      'center': 'center',
      'top': 'top',
      'right': 'right',
      'bottom': 'bottom',
      'left': 'left',
      'top-left': 'top left',
      'top-right': 'top right',
      'bottom-left': 'bottom left',
      'bottom-right': 'bottom right',
    }
    if (positions[parsed.value])
      return { 'mask-position': positions[parsed.value] } as Record<string, string>
    return parsed.arbitrary ? { 'mask-position': parsed.value } as Record<string, string> : undefined
  }

  // mask-repeat
  if (parsed.utility === 'mask-repeat' && parsed.value) {
    const repeats: Record<string, string> = {
      'repeat': 'repeat',
      'no-repeat': 'no-repeat',
      'repeat-x': 'repeat-x',
      'repeat-y': 'repeat-y',
      'round': 'round',
      'space': 'space',
    }
    if (repeats[parsed.value])
      return { 'mask-repeat': repeats[parsed.value] } as Record<string, string>
    return parsed.arbitrary ? { 'mask-repeat': parsed.value } as Record<string, string> : undefined
  }

  // mask-size
  if (parsed.utility === 'mask-size' && parsed.value) {
    const sizes: Record<string, string> = {
      auto: 'auto',
      cover: 'cover',
      contain: 'contain',
    }
    if (sizes[parsed.value])
      return { 'mask-size': sizes[parsed.value] } as Record<string, string>
    return parsed.arbitrary ? { 'mask-size': parsed.value } as Record<string, string> : undefined
  }

  // mask-type
  if (parsed.utility === 'mask-type' && parsed.value) {
    const types = ['alpha', 'luminance']
    return types.includes(parsed.value) ? { 'mask-type': parsed.value } as Record<string, string> : undefined
  }
}

export const effectsRules: UtilityRule[] = [
  backgroundAttachmentRule,
  backgroundClipRule,
  backgroundImageRule,
  backgroundOriginRule,
  backgroundPositionRule,
  backgroundRepeatRule,
  backgroundSizeRule,
  borderStyleRule,
  outlineRule,
  boxShadowThemeRule,
  shadowColorRule,
  textShadowRule,
  opacityRule,
  mixBlendModeRule,
  backgroundBlendModeRule,
  maskRule,
]
