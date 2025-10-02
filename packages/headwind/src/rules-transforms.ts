import type { UtilityRule } from './rules'

// Transform, Transition, Animation utilities

export const transformRule: UtilityRule = (parsed) => {
  const values: Record<string, string> = {
    transform: 'translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))',
    'transform-cpu': 'translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))',
    'transform-gpu': 'translate3d(var(--tw-translate-x), var(--tw-translate-y), 0) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))',
    'transform-none': 'none',
  }
  return values[parsed.raw] ? { transform: values[parsed.raw] } : undefined
}

export const scaleRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'scale') {
    const scale = parsed.value ? Number(parsed.value) / 100 : 1
    return { transform: `scale(${scale})` }
  }
  if (parsed.utility === 'scale-x') {
    const scale = parsed.value ? Number(parsed.value) / 100 : 1
    return { transform: `scaleX(${scale})` }
  }
  if (parsed.utility === 'scale-y') {
    const scale = parsed.value ? Number(parsed.value) / 100 : 1
    return { transform: `scaleY(${scale})` }
  }
}

export const rotateRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'rotate' && parsed.value) {
    return { transform: `rotate(${parsed.value}deg)` }
  }
}

export const translateRule: UtilityRule = (parsed, config) => {
  if (parsed.utility === 'translate-x' && parsed.value) {
    let value: string
    if (parsed.value.startsWith('-')) {
      const positiveValue = parsed.value.slice(1)
      const spacing = config.theme.spacing[positiveValue]
      value = spacing ? `-${spacing}` : parsed.value
    }
    else {
      value = config.theme.spacing[parsed.value] || parsed.value
    }
    return { transform: `translateX(${value})` }
  }
  if (parsed.utility === 'translate-y' && parsed.value) {
    let value: string
    if (parsed.value.startsWith('-')) {
      const positiveValue = parsed.value.slice(1)
      const spacing = config.theme.spacing[positiveValue]
      value = spacing ? `-${spacing}` : parsed.value
    }
    else {
      value = config.theme.spacing[parsed.value] || parsed.value
    }
    return { transform: `translateY(${value})` }
  }
}

export const skewRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'skew-x' && parsed.value) {
    return { transform: `skewX(${parsed.value}deg)` }
  }
  if (parsed.utility === 'skew-y' && parsed.value) {
    return { transform: `skewY(${parsed.value}deg)` }
  }
}

export const transformOriginRule: UtilityRule = (parsed) => {
  const origins: Record<string, string> = {
    'origin-center': 'center',
    'origin-top': 'top',
    'origin-top-right': 'top right',
    'origin-right': 'right',
    'origin-bottom-right': 'bottom right',
    'origin-bottom': 'bottom',
    'origin-bottom-left': 'bottom left',
    'origin-left': 'left',
    'origin-top-left': 'top left',
  }
  return origins[parsed.raw] ? { 'transform-origin': origins[parsed.raw] } : undefined
}

export const perspectiveRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'perspective' && parsed.value) {
    return { perspective: `${parsed.value}px` }
  }
  const values: Record<string, string> = {
    'perspective-none': 'none',
  }
  return values[parsed.raw] ? { perspective: values[parsed.raw] } : undefined
}

// Transition utilities
export const transitionPropertyRule: UtilityRule = (parsed) => {
  const properties: Record<string, string> = {
    'transition-none': 'none',
    'transition-all': 'all',
    transition: 'color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter',
    'transition-colors': 'color, background-color, border-color, text-decoration-color, fill, stroke',
    'transition-opacity': 'opacity',
    'transition-shadow': 'box-shadow',
    'transition-transform': 'transform',
  }
  return properties[parsed.raw] ? { 'transition-property': properties[parsed.raw] } : undefined
}

export const transitionDurationRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'duration' && parsed.value) {
    return { 'transition-duration': `${parsed.value}ms` }
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
    return { 'transition-delay': `${parsed.value}ms` }
  }
}

export const animationRule: UtilityRule = (parsed) => {
  const animations: Record<string, string> = {
    'animate-none': 'none',
    'animate-spin': 'spin 1s linear infinite',
    'animate-ping': 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
    'animate-pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    'animate-bounce': 'bounce 1s infinite',
  }
  return animations[parsed.raw] ? { animation: animations[parsed.raw] } : undefined
}

export const transformsRules: UtilityRule[] = [
  transformRule,
  scaleRule,
  rotateRule,
  translateRule,
  skewRule,
  transformOriginRule,
  perspectiveRule,
  transitionPropertyRule,
  transitionDurationRule,
  transitionTimingRule,
  transitionDelayRule,
  animationRule,
]
