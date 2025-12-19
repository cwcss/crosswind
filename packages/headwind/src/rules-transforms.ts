import type { UtilityRule } from './rules'

// Transform, Transition, Animation utilities

export const transformRule: UtilityRule = (parsed) => {
  const values: Record<string, string> = {
    'transform': 'translate(var(--hw-translate-x), var(--hw-translate-y)) rotate(var(--hw-rotate)) skewX(var(--hw-skew-x)) skewY(var(--hw-skew-y)) scaleX(var(--hw-scale-x)) scaleY(var(--hw-scale-y))',
    'transform-cpu': 'translate(var(--hw-translate-x), var(--hw-translate-y)) rotate(var(--hw-rotate)) skewX(var(--hw-skew-x)) skewY(var(--hw-skew-y)) scaleX(var(--hw-scale-x)) scaleY(var(--hw-scale-y))',
    'transform-gpu': 'translate3d(var(--hw-translate-x), var(--hw-translate-y), 0) rotate(var(--hw-rotate)) skewX(var(--hw-skew-x)) skewY(var(--hw-skew-y)) scaleX(var(--hw-scale-x)) scaleY(var(--hw-scale-y))',
    'transform-none': 'none',
  }
  return values[parsed.raw] ? { transform: values[parsed.raw] } : undefined
}

export const scaleRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'scale') {
    if (!parsed.value)
      return { transform: 'scale(1)' }
    // If arbitrary, use value as-is
    if (parsed.arbitrary) {
      return { transform: `scale(${parsed.value})` }
    }
    const scale = Number(parsed.value) / 100
    return { transform: `scale(${scale})` }
  }
  if (parsed.utility === 'scale-x') {
    if (!parsed.value)
      return { transform: 'scaleX(1)' }
    if (parsed.arbitrary) {
      return { transform: `scaleX(${parsed.value})` }
    }
    const scale = Number(parsed.value) / 100
    return { transform: `scaleX(${scale})` }
  }
  if (parsed.utility === 'scale-y') {
    if (!parsed.value)
      return { transform: 'scaleY(1)' }
    if (parsed.arbitrary) {
      return { transform: `scaleY(${parsed.value})` }
    }
    const scale = Number(parsed.value) / 100
    return { transform: `scaleY(${scale})` }
  }
  if (parsed.utility === 'scale-z') {
    if (!parsed.value)
      return { transform: 'scaleZ(1)' }
    if (parsed.arbitrary) {
      return { transform: `scaleZ(${parsed.value})` }
    }
    const scale = Number(parsed.value) / 100
    return { transform: `scaleZ(${scale})` }
  }
}

export const rotateRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'rotate' && parsed.value) {
    // If arbitrary or already has unit, use as-is, otherwise add deg
    const value = parsed.arbitrary || parsed.value.includes('deg') || parsed.value.includes('rad') || parsed.value.includes('turn')
      ? parsed.value
      : `${parsed.value}deg`
    return { transform: `rotate(${value})` }
  }
  if (parsed.utility === 'rotate-x' && parsed.value) {
    const value = parsed.arbitrary || parsed.value.includes('deg') || parsed.value.includes('rad') || parsed.value.includes('turn')
      ? parsed.value
      : `${parsed.value}deg`
    return { transform: `rotateX(${value})` }
  }
  if (parsed.utility === 'rotate-y' && parsed.value) {
    const value = parsed.arbitrary || parsed.value.includes('deg') || parsed.value.includes('rad') || parsed.value.includes('turn')
      ? parsed.value
      : `${parsed.value}deg`
    return { transform: `rotateY(${value})` }
  }
  if (parsed.utility === 'rotate-z' && parsed.value) {
    const value = parsed.arbitrary || parsed.value.includes('deg') || parsed.value.includes('rad') || parsed.value.includes('turn')
      ? parsed.value
      : `${parsed.value}deg`
    return { transform: `rotateZ(${value})` }
  }
}

export const translateRule: UtilityRule = (parsed, config) => {
  const getTranslateValue = (val: string): string => {
    // Handle fractions: 1/2 -> 50%, 1/3 -> 33.333333%, etc.
    if (val.includes('/')) {
      const [num, denom] = val.split('/')
      const percentage = (Number(num) / Number(denom)) * 100
      return `${percentage}%`
    }
    // Handle special keywords
    if (val === 'full')
      return '100%'
    if (val === 'half')
      return '50%'
    // Check spacing config
    return config.theme.spacing[val] || val
  }

  if (parsed.utility === 'translate-x' && parsed.value) {
    let value: string
    if (parsed.value.startsWith('-')) {
      const positiveValue = parsed.value.slice(1)
      value = `-${getTranslateValue(positiveValue)}`
    }
    else {
      value = getTranslateValue(parsed.value)
    }
    return { transform: `translateX(${value})` }
  }
  if (parsed.utility === 'translate-y' && parsed.value) {
    let value: string
    if (parsed.value.startsWith('-')) {
      const positiveValue = parsed.value.slice(1)
      value = `-${getTranslateValue(positiveValue)}`
    }
    else {
      value = getTranslateValue(parsed.value)
    }
    return { transform: `translateY(${value})` }
  }
  if (parsed.utility === 'translate-z' && parsed.value) {
    let value: string
    if (parsed.value.startsWith('-')) {
      const positiveValue = parsed.value.slice(1)
      value = `-${getTranslateValue(positiveValue)}`
    }
    else {
      value = getTranslateValue(parsed.value)
    }
    return { transform: `translateZ(${value})` }
  }
}

export const skewRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'skew-x' && parsed.value) {
    const value = parsed.arbitrary || parsed.value.includes('deg') || parsed.value.includes('rad') || parsed.value.includes('turn')
      ? parsed.value
      : `${parsed.value}deg`
    return { transform: `skewX(${value})` }
  }
  if (parsed.utility === 'skew-y' && parsed.value) {
    const value = parsed.arbitrary || parsed.value.includes('deg') || parsed.value.includes('rad') || parsed.value.includes('turn')
      ? parsed.value
      : `${parsed.value}deg`
    return { transform: `skewY(${value})` }
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
    return { 'transition-duration': durations[parsed.value] || `${parsed.value}ms` }
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
    return { 'transition-delay': delays[parsed.value] || `${parsed.value}ms` }
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
]
