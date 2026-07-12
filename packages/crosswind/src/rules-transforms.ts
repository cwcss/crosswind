import type { UtilityRule } from './rules'

// Transform, Transition, Animation utilities

export const transformRule: UtilityRule = (parsed) => {
  const values: Record<string, string> = {
    'transform': 'translate(var(--cw-translate-x), var(--cw-translate-y)) rotate(var(--cw-rotate)) skewX(var(--cw-skew-x)) skewY(var(--cw-skew-y)) scaleX(var(--cw-scale-x)) scaleY(var(--cw-scale-y))',
    'transform-cpu': 'translate(var(--cw-translate-x), var(--cw-translate-y)) rotate(var(--cw-rotate)) skewX(var(--cw-skew-x)) skewY(var(--cw-skew-y)) scaleX(var(--cw-scale-x)) scaleY(var(--cw-scale-y))',
    'transform-gpu': 'translate3d(var(--cw-translate-x), var(--cw-translate-y), 0) rotate(var(--cw-rotate)) skewX(var(--cw-skew-x)) skewY(var(--cw-skew-y)) scaleX(var(--cw-scale-x)) scaleY(var(--cw-scale-y))',
    'transform-none': 'none',
  }
  return values[parsed.raw] ? { transform: values[parsed.raw] } : undefined
}

// A bare scale token is a percentage number (scale-150 -> 1.5). Unknown
// words previously coerced through Number() and emitted transform: scale(NaN).
function scaleTransform(fn: string, parsed: { value?: string, arbitrary: boolean }): Record<string, string> | undefined {
  if (!parsed.value)
    return { transform: `${fn}(1)` }
  if (parsed.arbitrary)
    return { transform: `${fn}(${parsed.value})` }
  if (/^-?\d+(?:\.\d+)?$/.test(parsed.value))
    return { transform: `${fn}(${Number(parsed.value) / 100})` }
  return undefined
}

// A bare angle token is a number (deg implied) or a number with an explicit
// CSS angle unit. Unknown words previously emitted rotate(foodeg).
function angleToken(parsed: { value?: string, arbitrary: boolean }): string | undefined {
  const value = parsed.value!
  if (parsed.arbitrary)
    return value
  if (/^-?\d+(?:\.\d+)?$/.test(value))
    return `${value}deg`
  if (/^-?\d+(?:\.\d+)?(?:deg|rad|grad|turn)$/.test(value))
    return value
  return undefined
}

export const scaleRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'scale')
    return scaleTransform('scale', parsed)
  if (parsed.utility === 'scale-x')
    return scaleTransform('scaleX', parsed)
  if (parsed.utility === 'scale-y')
    return scaleTransform('scaleY', parsed)
  if (parsed.utility === 'scale-z')
    return scaleTransform('scaleZ', parsed)
}

export const rotateRule: UtilityRule = (parsed) => {
  if (!parsed.value)
    return undefined
  const fns: Record<string, string> = {
    'rotate': 'rotate',
    'rotate-x': 'rotateX',
    'rotate-y': 'rotateY',
    'rotate-z': 'rotateZ',
  }
  const fn = fns[parsed.utility]
  if (!fn)
    return undefined
  const value = angleToken(parsed)
  return value !== undefined ? { transform: `${fn}(${value})` } : undefined
}

export const translateRule: UtilityRule = (parsed, config) => {
  const getTranslateValue = (val: string): string | undefined => {
    // Handle fractions: 1/2 -> 50%, 1/3 -> 33.333333%, etc.
    if (val.includes('/')) {
      const [num, denom] = val.split('/')
      const percentage = (Number(num) / Number(denom)) * 100
      return Number.isFinite(percentage) ? `${percentage}%` : undefined
    }
    // Handle special keywords
    if (val === 'full')
      return '100%'
    if (val === 'half')
      return '50%'
    // Arbitrary values pass through; theme scale and off-scale numbers
    // resolve like spacing. Unknown words are rejected — they previously
    // emitted translateX(foo).
    if (parsed.arbitrary)
      return val
    const hit = config.theme.spacing[val]
    if (hit !== undefined)
      return hit
    if (/^\d+(?:\.\d+)?$/.test(val))
      return `${Number.parseFloat(val) * 0.25}rem`
    return undefined
  }

  const fns: Record<string, string> = {
    'translate-x': 'translateX',
    'translate-y': 'translateY',
    'translate-z': 'translateZ',
  }
  const fn = fns[parsed.utility]
  if (!fn || !parsed.value)
    return undefined

  let value: string | undefined
  if (parsed.value.startsWith('-')) {
    const resolved = getTranslateValue(parsed.value.slice(1))
    value = resolved === undefined ? undefined : `-${resolved}`
  }
  else {
    value = getTranslateValue(parsed.value)
  }
  return value !== undefined ? { transform: `${fn}(${value})` } : undefined
}

export const skewRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'skew-x' && parsed.value) {
    const value = angleToken(parsed)
    return value !== undefined ? { transform: `skewX(${value})` } : undefined
  }
  if (parsed.utility === 'skew-y' && parsed.value) {
    const value = angleToken(parsed)
    return value !== undefined ? { transform: `skewY(${value})` } : undefined
  }
}

export const transformOriginRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'origin' && parsed.value) {
    // Handle arbitrary values with underscores as spaces
    if (parsed.arbitrary) {
      return { 'transform-origin': parsed.value.replace(/_/g, ' ') }
    }
    // Handle predefined values
    const origins: Record<string, string> = {
      'center': 'center',
      'top': 'top',
      'top-right': 'top right',
      'right': 'right',
      'bottom-right': 'bottom right',
      'bottom': 'bottom',
      'bottom-left': 'bottom left',
      'left': 'left',
      'top-left': 'top left',
    }
    return origins[parsed.value] ? { 'transform-origin': origins[parsed.value] } : undefined
  }
  return undefined
}

export const perspectiveRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'perspective' && parsed.value) {
    // If value is 'none', use as-is
    if (parsed.value === 'none') {
      return { perspective: 'none' }
    }
    // If arbitrary or already has unit, use as-is
    if (parsed.arbitrary || parsed.value.includes('px') || parsed.value.includes('rem') || parsed.value.includes('em')) {
      return { perspective: parsed.value }
    }
    // Otherwise add px
    return { perspective: `${parsed.value}px` }
  }
  return undefined
}

export const perspectiveOriginRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'perspective-origin' && parsed.value) {
    const origins: Record<string, string> = {
      'center': 'center',
      'top': 'top',
      'top-right': 'top right',
      'right': 'right',
      'bottom-right': 'bottom right',
      'bottom': 'bottom',
      'bottom-left': 'bottom left',
      'left': 'left',
      'top-left': 'top left',
    }
    return { 'perspective-origin': origins[parsed.value] || parsed.value }
  }
}

export const backfaceVisibilityRule: UtilityRule = (parsed) => {
  const values: Record<string, string> = {
    'backface-visible': 'visible',
    'backface-hidden': 'hidden',
  }
  return values[parsed.raw] ? { 'backface-visibility': values[parsed.raw] } : undefined
}

export const transformStyleRule: UtilityRule = (parsed) => {
  const values: Record<string, string> = {
    'transform-flat': 'flat',
    'transform-3d': 'preserve-3d',
  }
  return values[parsed.raw] ? { 'transform-style': values[parsed.raw] } : undefined
}

// Transition utilities
export const transitionPropertyRule: UtilityRule = (parsed) => {
  const properties: Record<string, string> = {
    'transition-none': 'none',
    'transition-all': 'all',
    'transition': 'color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter',
    'transition-colors': 'color, background-color, border-color, text-decoration-color, fill, stroke',
    'transition-opacity': 'opacity',
    'transition-shadow': 'box-shadow',
    'transition-transform': 'transform',
  }
  return properties[parsed.raw] ? { 'transition-property': properties[parsed.raw] } : undefined
}

// Resolve a duration/delay token: presets keep their exact form, arbitrary
// values pass through verbatim (duration-[2s] must not become "2sms"),
// bare numbers get the ms suffix, and unknown words are rejected.
function resolveTimeToken(parsed: { value?: string, arbitrary: boolean }, presets: Record<string, string>): string | undefined {
  const value = parsed.value!
  if (presets[value])
    return presets[value]
  if (parsed.arbitrary)
    return value
  if (/^\d+(?:\.\d+)?$/.test(value))
    return `${value}ms`
  return undefined
}

export const transitionDurationRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'duration' && parsed.value) {
    // Named duration presets (like Tailwind)
    const durations: Record<string, string> = {
      '0': '0s',
      '75': '75ms',
      '100': '100ms',
      '150': '150ms',
      '200': '200ms',
      '300': '300ms',
      '500': '500ms',
      '700': '700ms',
      '1000': '1000ms',
    }
    const time = resolveTimeToken(parsed, durations)
    return time !== undefined ? { 'transition-duration': time } : undefined
  }
}

export const transitionTimingRule: UtilityRule = (parsed) => {
  const timings: Record<string, string> = {
    'ease-linear': 'linear',
    'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
    'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
    'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
  }
  return timings[parsed.raw] ? { 'transition-timing-function': timings[parsed.raw] } : undefined
}

export const transitionDelayRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'delay' && parsed.value) {
    // Named delay presets (like Tailwind)
    const delays: Record<string, string> = {
      '0': '0s',
      '75': '75ms',
      '100': '100ms',
      '150': '150ms',
      '200': '200ms',
      '300': '300ms',
      '500': '500ms',
      '700': '700ms',
      '1000': '1000ms',
    }
    const time = resolveTimeToken(parsed, delays)
    return time !== undefined ? { 'transition-delay': time } : undefined
  }
}

export const transitionBehaviorRule: UtilityRule = (parsed) => {
  const values: Record<string, string> = {
    'transition-behavior-normal': 'normal',
    'transition-behavior-allow-discrete': 'allow-discrete',
  }
  return values[parsed.raw] ? { 'transition-behavior': values[parsed.raw] } : undefined
}

export const animationRule: UtilityRule = (parsed) => {
  if (parsed.utility !== 'animate') {
    return undefined
  }

  const animations: Record<string, string> = {
    none: 'none',
    spin: 'spin 1s linear infinite',
    ping: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
    pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    bounce: 'bounce 1s infinite',
  }

  // Support arbitrary animation values
  if (parsed.arbitrary && parsed.value) {
    // Replace underscores with spaces for arbitrary animation values
    return { animation: parsed.value.replace(/_/g, ' ') }
  }

  // Support predefined animations
  if (parsed.value && animations[parsed.value]) {
    return { animation: animations[parsed.value] }
  }

  return undefined
}

// Animation play state
export const animationPlayStateRule: UtilityRule = (parsed) => {
  const values: Record<string, string> = {
    'animate-running': 'running',
    'animate-paused': 'paused',
  }
  return values[parsed.raw] ? { 'animation-play-state': values[parsed.raw] } : undefined
}

// Animation direction
export const animationDirectionRule: UtilityRule = (parsed) => {
  const values: Record<string, string> = {
    'animate-normal': 'normal',
    'animate-reverse': 'reverse',
    'animate-alternate': 'alternate',
    'animate-alternate-reverse': 'alternate-reverse',
  }
  return values[parsed.raw] ? { 'animation-direction': values[parsed.raw] } : undefined
}

// Animation fill mode
export const animationFillModeRule: UtilityRule = (parsed) => {
  const values: Record<string, string> = {
    'animate-fill-none': 'none',
    'animate-fill-forwards': 'forwards',
    'animate-fill-backwards': 'backwards',
    'animate-fill-both': 'both',
  }
  return values[parsed.raw] ? { 'animation-fill-mode': values[parsed.raw] } : undefined
}

// Animation iteration count
export const animationIterationRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'animate-iteration' && parsed.value) {
    // A count is a number (fractions allowed per spec), infinite, or arbitrary.
    if (parsed.value === 'infinite' || parsed.arbitrary || /^\d+(?:\.\d+)?$/.test(parsed.value))
      return { 'animation-iteration-count': parsed.value }
    return undefined
  }
}

// Animation duration
export const animationDurationRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'animate-duration' && parsed.value) {
    const durations: Record<string, string> = {
      '75': '75ms', '100': '100ms', '150': '150ms', '200': '200ms',
      '300': '300ms', '500': '500ms', '700': '700ms', '1000': '1000ms',
    }
    const time = resolveTimeToken(parsed, durations)
    return time !== undefined ? { 'animation-duration': time } : undefined
  }
}

// Animation delay
export const animationDelayRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'animate-delay' && parsed.value) {
    const delays: Record<string, string> = {
      '75': '75ms', '100': '100ms', '150': '150ms', '200': '200ms',
      '300': '300ms', '500': '500ms', '700': '700ms', '1000': '1000ms',
    }
    const time = resolveTimeToken(parsed, delays)
    return time !== undefined ? { 'animation-delay': time } : undefined
  }
}

// Animation timing function
export const animationTimingRule: UtilityRule = (parsed) => {
  const values: Record<string, string> = {
    'animate-ease-linear': 'linear',
    'animate-ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
    'animate-ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
    'animate-ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
  }
  return values[parsed.raw] ? { 'animation-timing-function': values[parsed.raw] } : undefined
}

export const transformsRules: UtilityRule[] = [
  transformRule,
  scaleRule,
  rotateRule,
  translateRule,
  skewRule,
  transformOriginRule,
  perspectiveRule,
  perspectiveOriginRule,
  backfaceVisibilityRule,
  transformStyleRule,
  transitionPropertyRule,
  transitionBehaviorRule,
  transitionDurationRule,
  transitionTimingRule,
  transitionDelayRule,
  animationRule,
  animationPlayStateRule,
  animationDirectionRule,
  animationFillModeRule,
  animationIterationRule,
  animationDurationRule,
  animationDelayRule,
  animationTimingRule,
]
