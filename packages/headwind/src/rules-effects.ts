import type { UtilityRule } from './rules'

// Backgrounds, Borders, Effects utilities

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
      'gradient-to-t': 'linear-gradient(to top, var(--tw-gradient-stops))',
      'gradient-to-tr': 'linear-gradient(to top right, var(--tw-gradient-stops))',
      'gradient-to-r': 'linear-gradient(to right, var(--tw-gradient-stops))',
      'gradient-to-br': 'linear-gradient(to bottom right, var(--tw-gradient-stops))',
      'gradient-to-b': 'linear-gradient(to bottom, var(--tw-gradient-stops))',
      'gradient-to-bl': 'linear-gradient(to bottom left, var(--tw-gradient-stops))',
      'gradient-to-l': 'linear-gradient(to left, var(--tw-gradient-stops))',
      'gradient-to-tl': 'linear-gradient(to top left, var(--tw-gradient-stops))',
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
    return { 'outline-offset': offsets[parsed.value] || parsed.value } as Record<string, string>
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
  }

  if (parsed.utility === 'outline') {
    if (!parsed.value) {
      return { 'outline-width': '1px' } as Record<string, string>
    }

    // Check for colors first (e.g., outline-blue-500)
    const parts = parsed.value.split('-')
    if (parts.length === 2) {
      const [colorName, shade] = parts
      const colorValue = config.theme.colors[colorName]
      if (typeof colorValue === 'object' && colorValue[shade]) {
        return { 'outline-color': colorValue[shade] } as Record<string, string>
      }
    }

    // Direct color (e.g., outline-black)
    const directColor = config.theme.colors[parsed.value]
    if (typeof directColor === 'string') {
      return { 'outline-color': directColor } as Record<string, string>
    }

    // Check for width values
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

    // Fallback to raw value as width
    return { 'outline-width': parsed.value } as Record<string, string>
  }
}

// Effect utilities
export const boxShadowThemeRule: UtilityRule = (parsed, config) => {
  if (parsed.utility === 'shadow' && parsed.value) {
    const shadow = config.theme.boxShadow[parsed.value]
    return shadow ? { 'box-shadow': shadow } : undefined
  }
  if (parsed.utility === 'shadow' && !parsed.value) {
    return { 'box-shadow': config.theme.boxShadow.DEFAULT }
  }
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
    return parsed.value ? { 'text-shadow': shadows[parsed.value] || parsed.value } : undefined
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
    return { opacity: opacityMap[parsed.value] || parsed.value }
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
    return { 'mask-clip': clips[parsed.value] || parsed.value } as Record<string, string>
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
    return { 'mask-image': `url(${parsed.value})` } as Record<string, string>
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
    return { 'mask-origin': origins[parsed.value] || parsed.value } as Record<string, string>
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
    return { 'mask-position': positions[parsed.value] || parsed.value } as Record<string, string>
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
    return { 'mask-repeat': repeats[parsed.value] || parsed.value } as Record<string, string>
  }

  // mask-size
  if (parsed.utility === 'mask-size' && parsed.value) {
    const sizes: Record<string, string> = {
      auto: 'auto',
      cover: 'cover',
      contain: 'contain',
    }
    return { 'mask-size': sizes[parsed.value] || parsed.value } as Record<string, string>
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
  textShadowRule,
  opacityRule,
  mixBlendModeRule,
  backgroundBlendModeRule,
  maskRule,
]
