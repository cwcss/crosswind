import type { AttributifyConfig, BracketSyntaxConfig, ParsedClass } from './types'

// Cache for parsed classes to avoid re-parsing
const parseCache = new Map<string, ParsedClass>()

// Cache for expanded bracket syntax
const bracketExpansionCache = new Map<string, string[]>()

/**
 * Options for class extraction
 */
export interface ExtractClassesOptions {
  attributify?: AttributifyConfig
  bracketSyntax?: BracketSyntaxConfig
}

/**
 * Default aliases for bracket syntax
 * Maps shorthand to full utility part
 */
const defaultBracketAliases: Record<string, string> = {
  // Flexbox direction
  'col': 'col',
  'row': 'row',
  // Justify/align abbreviations
  'jc': 'justify',
  'ji': 'justify-items',
  'js': 'justify-self',
  'ai': 'items',
  'ac': 'content',
  'as': 'self',
  // Wrap
  'wrap': 'wrap',
  'nowrap': 'nowrap',
  // Common values
  'c': 'center',
  's': 'start',
  'e': 'end',
  'sb': 'between',
  'sa': 'around',
  'se': 'evenly',
  'st': 'stretch',
  // Font weights
  'thin': 'thin',
  'extralight': 'extralight',
  'light': 'light',
  'normal': 'normal',
  'medium': 'medium',
  'semibold': 'semibold',
  'bold': 'bold',
  'extrabold': 'extrabold',
  'black': 'black',
  // Position
  't': 'top',
  'r': 'right',
  'b': 'bottom',
  'l': 'left',
}

/**
 * Pre-compiled regex patterns for performance (avoid regex compilation on each call)
 */
const SPECIAL_CHARS_REGEX = /[%#()]/
const CSS_UNITS_REGEX = /^\d+(\.\d+)?(px|rem|em|vh|vw|dvh|dvw|svh|svw|lvh|lvw|ch|ex|lh|cap|ic|rlh|vi|vb|vmin|vmax|cqw|cqh|cqi|cqb|cqmin|cqmax|cm|mm|in|pt|pc|Q)$/

/**
 * Check if value needs arbitrary bracket syntax
 */
function needsArbitraryBrackets(value: string): boolean {
  return SPECIAL_CHARS_REGEX.test(value) || CSS_UNITS_REGEX.test(value)
}

/**
 * Handle min/max prefix patterns for sizing utilities
 * w[min 200px] -> min-w-[200px], h[max screen] -> max-h-screen
 */
function handleMinMaxPattern(prefix: string, parts: string[]): string[] | null {
  if (parts.length !== 2) return null
  const [modifier, value] = parts
  if (modifier !== 'min' && modifier !== 'max') return null

  const result = needsArbitraryBrackets(value)
    ? `${modifier}-${prefix}-[${value}]`
    : `${modifier}-${prefix}-${value}`
  return [result]
}

/**
 * Mapping of bracket utility prefixes to their expansion patterns
 * This defines how utilities like flex[col jc-center] expand to real classes
 */
const bracketUtilityMappings: Record<string, {
  // How to expand each part within brackets
  expand: (part: string, aliases: Record<string, string>) => string | null
  // Optional: handle multi-value patterns like w[min 200px]
  multiValue?: (parts: string[], aliases: Record<string, string>) => string[] | null
}> = {
  'flex': {
    expand: (part, aliases) => {
      const aliased = aliases[part] || part
      // flex[col] -> flex-col, flex[row] -> flex-row
      if (['col', 'row', 'col-reverse', 'row-reverse', 'wrap', 'nowrap', 'wrap-reverse'].includes(aliased)) {
        return `flex-${aliased}`
      }
      // flex[jc-center] -> justify-center, flex[ai-center] -> items-center
      const match = part.match(/^(jc|ji|js|ai|ac|as)-(.+)$/)
      if (match) {
        const prefix = aliases[match[1]] || match[1]
        const value = aliases[match[2]] || match[2]
        return `${prefix}-${value}`
      }
      // flex[1] -> flex-1, flex[grow] -> flex-grow
      if (/^\d+$/.test(aliased) || ['grow', 'shrink', 'auto', 'initial', 'none'].includes(aliased)) {
        return `flex-${aliased}`
      }
      return null
    },
  },
  'grid': {
    expand: (part, aliases) => {
      const aliased = aliases[part] || part
      // grid[cols-3] -> grid-cols-3
      if (part.startsWith('cols-') || part.startsWith('rows-')) {
        return `grid-${part}`
      }
      // grid[flow-row] -> grid-flow-row
      if (part.startsWith('flow-')) {
        return `grid-${part}`
      }
      // grid[gap-4] -> gap-4
      if (part.startsWith('gap-')) {
        return part
      }
      return null
    },
  },
  'text': {
    expand: (part, aliases) => {
      const aliased = aliases[part] || part
      // text[2rem] or text[16px] -> text-[2rem] or text-[16px] (arbitrary size)
      if (needsArbitraryBrackets(aliased)) {
        return `text-[${aliased}]`
      }
      // text[700] -> font-bold (weight), text[500] -> font-medium
      if (/^\d{3}$/.test(aliased)) {
        const weightMap: Record<string, string> = {
          '100': 'font-thin',
          '200': 'font-extralight',
          '300': 'font-light',
          '400': 'font-normal',
          '500': 'font-medium',
          '600': 'font-semibold',
          '700': 'font-bold',
          '800': 'font-extrabold',
          '900': 'font-black',
        }
        return weightMap[aliased] || `font-[${aliased}]`
      }
      // text[arial] -> font-[arial] (font family)
      if (/^[a-z-]+$/i.test(aliased) && !['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl', '9xl'].includes(aliased)) {
        // Check if it's a color name
        const colorNames = ['white', 'black', 'red', 'blue', 'green', 'yellow', 'purple', 'pink', 'gray', 'slate', 'zinc', 'neutral', 'stone', 'orange', 'amber', 'lime', 'emerald', 'teal', 'cyan', 'sky', 'indigo', 'violet', 'fuchsia', 'rose', 'inherit', 'current', 'transparent']
        if (colorNames.includes(aliased.toLowerCase())) {
          return `text-${aliased}`
        }
        // Otherwise treat as font family
        return `font-[${aliased}]`
      }
      // text[sm], text[lg], etc -> text-sm, text-lg
      return `text-${aliased}`
    },
  },
  'font': {
    expand: (part, aliases) => {
      const aliased = aliases[part] || part
      // font[bold] -> font-bold, font[sans] -> font-sans
      const weights = ['thin', 'extralight', 'light', 'normal', 'medium', 'semibold', 'bold', 'extrabold', 'black']
      const families = ['sans', 'serif', 'mono']
      if (weights.includes(aliased) || families.includes(aliased)) {
        return `font-${aliased}`
      }
      // font[700] -> font-bold
      if (/^\d{3}$/.test(aliased)) {
        const weightMap: Record<string, string> = {
          '100': 'font-thin',
          '200': 'font-extralight',
          '300': 'font-light',
          '400': 'font-normal',
          '500': 'font-medium',
          '600': 'font-semibold',
          '700': 'font-bold',
          '800': 'font-extrabold',
          '900': 'font-black',
        }
        return weightMap[aliased] || `font-[${aliased}]`
      }
      // font[arial] -> font-[arial]
      return `font-[${aliased}]`
    },
  },
  'bg': {
    expand: (part, aliases) => {
      const aliased = aliases[part] || part
      return `bg-${aliased}`
    },
  },
  'w': {
    expand: (part, aliases) => {
      const aliased = aliases[part] || part
      if (needsArbitraryBrackets(aliased)) {
        return `w-[${aliased}]`
      }
      return `w-${aliased}`
    },
    multiValue: (parts) => handleMinMaxPattern('w', parts),
  },
  'h': {
    expand: (part, aliases) => {
      const aliased = aliases[part] || part
      if (needsArbitraryBrackets(aliased)) {
        return `h-[${aliased}]`
      }
      return `h-${aliased}`
    },
    multiValue: (parts) => handleMinMaxPattern('h', parts),
  },
  'p': {
    expand: (part) => `p-${part}`,
  },
  'px': {
    expand: (part) => `px-${part}`,
  },
  'py': {
    expand: (part) => `py-${part}`,
  },
  'pt': {
    expand: (part) => `pt-${part}`,
  },
  'pr': {
    expand: (part) => `pr-${part}`,
  },
  'pb': {
    expand: (part) => `pb-${part}`,
  },
  'pl': {
    expand: (part) => `pl-${part}`,
  },
  'm': {
    expand: (part) => `m-${part}`,
  },
  'mx': {
    expand: (part) => `mx-${part}`,
  },
  'my': {
    expand: (part) => `my-${part}`,
  },
  'mt': {
    expand: (part) => `mt-${part}`,
  },
  'mr': {
    expand: (part) => `mr-${part}`,
  },
  'mb': {
    expand: (part) => `mb-${part}`,
  },
  'ml': {
    expand: (part) => `ml-${part}`,
  },
  'scroll': {
    expand: (part) => {
      // scroll[y auto] -> overflow-y-auto
      if (['x', 'y'].includes(part)) {
        return null // Will be combined with next value
      }
      if (['auto', 'hidden', 'scroll', 'visible'].includes(part)) {
        return `overflow-${part}`
      }
      return null
    },
    multiValue: (parts) => {
      if (parts.length === 2) {
        const [axis, value] = parts
        if (['x', 'y'].includes(axis) && ['auto', 'hidden', 'scroll', 'visible'].includes(value)) {
          return [`overflow-${axis}-${value}`]
        }
      }
      return null
    },
  },
  'overflow': {
    expand: (part) => `overflow-${part}`,
    multiValue: (parts) => {
      if (parts.length === 2) {
        const [axis, value] = parts
        if (['x', 'y'].includes(axis)) {
          return [`overflow-${axis}-${value}`]
        }
      }
      return null
    },
  },
  'border': {
    expand: (part) => `border-${part}`,
  },
  'rounded': {
    expand: (part) => `rounded-${part}`,
  },
  'shadow': {
    expand: (part) => `shadow-${part}`,
  },
  'gap': {
    expand: (part) => {
      // gap[x-4] -> gap-x-4
      if (part.startsWith('x-') || part.startsWith('y-')) {
        return `gap-${part}`
      }
      return `gap-${part}`
    },
  },
  'space': {
    expand: (part) => `space-${part}`,
  },
  // New utilities
  'opacity': {
    expand: (part) => `opacity-${part}`,
  },
  'z': {
    expand: (part) => `z-${part}`,
  },
  'inset': {
    expand: (part, aliases) => {
      const aliased = aliases[part] || part
      // inset[x-0] -> inset-x-0, inset[y-auto] -> inset-y-auto
      if (aliased.startsWith('x-') || aliased.startsWith('y-')) {
        return `inset-${aliased}`
      }
      if (needsArbitraryBrackets(aliased)) {
        return `inset-[${aliased}]`
      }
      return `inset-${aliased}`
    },
  },
  'top': {
    expand: (part) => needsArbitraryBrackets(part) ? `top-[${part}]` : `top-${part}`,
  },
  'right': {
    expand: (part) => needsArbitraryBrackets(part) ? `right-[${part}]` : `right-${part}`,
  },
  'bottom': {
    expand: (part) => needsArbitraryBrackets(part) ? `bottom-[${part}]` : `bottom-${part}`,
  },
  'left': {
    expand: (part) => needsArbitraryBrackets(part) ? `left-[${part}]` : `left-${part}`,
  },
  'duration': {
    expand: (part) => `duration-${part}`,
  },
  'delay': {
    expand: (part) => `delay-${part}`,
  },
  'ease': {
    expand: (part) => `ease-${part}`,
  },
  'transition': {
    expand: (part) => {
      // transition[all] -> transition-all
      if (['all', 'none', 'colors', 'opacity', 'shadow', 'transform'].includes(part)) {
        return `transition-${part}`
      }
      // transition[300] -> duration-300
      if (/^\d+$/.test(part)) {
        return `duration-${part}`
      }
      // transition[ease-in-out] -> ease-in-out
      if (['linear', 'in', 'out', 'in-out', 'ease-linear', 'ease-in', 'ease-out', 'ease-in-out'].includes(part)) {
        return part.startsWith('ease-') ? part : `ease-${part}`
      }
      return `transition-${part}`
    },
  },
  'translate': {
    expand: (part) => {
      // translate[x-4] -> translate-x-4
      if (part.startsWith('x-') || part.startsWith('y-') || part.startsWith('z-')) {
        return `translate-${part}`
      }
      // translate[4] -> translate-4 (Tailwind v4 syntax)
      return `translate-${part}`
    },
  },
  'rotate': {
    expand: (part) => {
      if (part.startsWith('x-') || part.startsWith('y-') || part.startsWith('z-')) {
        return `rotate-${part}`
      }
      return `rotate-${part}`
    },
  },
  'scale': {
    expand: (part) => {
      if (part.startsWith('x-') || part.startsWith('y-') || part.startsWith('z-')) {
        return `scale-${part}`
      }
      return `scale-${part}`
    },
  },
  'skew': {
    expand: (part) => {
      if (part.startsWith('x-') || part.startsWith('y-')) {
        return `skew-${part}`
      }
      return `skew-${part}`
    },
  },
  'origin': {
    expand: (part) => `origin-${part}`,
  },
  'cursor': {
    expand: (part) => `cursor-${part}`,
  },
  'select': {
    expand: (part) => `select-${part}`,
  },
  'resize': {
    expand: (part) => `resize-${part}`,
  },
  'appearance': {
    expand: (part) => `appearance-${part}`,
  },
  'pointer': {
    expand: (part) => `pointer-events-${part}`,
  },
  'outline': {
    expand: (part) => `outline-${part}`,
  },
  'ring': {
    expand: (part) => `ring-${part}`,
  },
  'blur': {
    expand: (part) => `blur-${part}`,
  },
  'brightness': {
    expand: (part) => `brightness-${part}`,
  },
  'contrast': {
    expand: (part) => `contrast-${part}`,
  },
  'grayscale': {
    expand: (part) => `grayscale-${part}`,
  },
  'saturate': {
    expand: (part) => `saturate-${part}`,
  },
  'sepia': {
    expand: (part) => `sepia-${part}`,
  },
  'backdrop': {
    expand: (part) => `backdrop-${part}`,
  },
  'aspect': {
    expand: (part) => `aspect-${part}`,
  },
  'columns': {
    expand: (part) => `columns-${part}`,
  },
  'break': {
    expand: (part) => `break-${part}`,
  },
  'object': {
    expand: (part) => `object-${part}`,
  },
  'overscroll': {
    expand: (part) => `overscroll-${part}`,
  },
  'place': {
    expand: (part) => `place-${part}`,
  },
  'items': {
    expand: (part) => `items-${part}`,
  },
  'justify': {
    expand: (part) => `justify-${part}`,
  },
  'content': {
    expand: (part) => `content-${part}`,
  },
  'self': {
    expand: (part) => `self-${part}`,
  },
  'order': {
    expand: (part) => `order-${part}`,
  },
  'col': {
    expand: (part) => `col-${part}`,
  },
  'row': {
    expand: (part) => `row-${part}`,
  },
  'tracking': {
    expand: (part) => `tracking-${part}`,
  },
  'leading': {
    expand: (part) => `leading-${part}`,
  },
  'list': {
    expand: (part) => `list-${part}`,
  },
  'decoration': {
    expand: (part) => `decoration-${part}`,
  },
  'underline': {
    expand: (part) => `underline-${part}`,
  },
  'accent': {
    expand: (part) => `accent-${part}`,
  },
  'caret': {
    expand: (part) => `caret-${part}`,
  },
  'scroll-m': {
    expand: (part) => `scroll-m-${part}`,
  },
  'scroll-p': {
    expand: (part) => `scroll-p-${part}`,
  },
  'snap': {
    expand: (part) => `snap-${part}`,
  },
  'touch': {
    expand: (part) => `touch-${part}`,
  },
  'will': {
    expand: (part) => `will-change-${part}`,
  },
  'fill': {
    expand: (part) => `fill-${part}`,
  },
  'stroke': {
    expand: (part) => `stroke-${part}`,
  },
  'sr': {
    expand: (part) => `sr-${part}`,
  },
  // Filter utilities
  'invert': {
    expand: (part) => `invert-${part}`,
  },
  'hue-rotate': {
    expand: (part) => needsArbitraryBrackets(part) ? `hue-rotate-[${part}]` : `hue-rotate-${part}`,
  },
  'drop-shadow': {
    expand: (part) => `drop-shadow-${part}`,
  },
  'backdrop-invert': {
    expand: (part) => `backdrop-invert-${part}`,
  },
  'backdrop-hue-rotate': {
    expand: (part) => needsArbitraryBrackets(part) ? `backdrop-hue-rotate-[${part}]` : `backdrop-hue-rotate-${part}`,
  },
  // Animation utilities
  'animate': {
    expand: (part) => `animate-${part}`,
  },
  // Accessibility utilities
  'forced-colors': {
    expand: (part) => `forced-colors-${part}`,
  },
}

/**
 * Common variant prefixes for responsive and state variants
 * Using Set for O(1) lookup instead of O(n) array search
 */
const variantPrefixes = new Set([
  // Responsive
  'sm', 'md', 'lg', 'xl', '2xl',
  // State
  'hover', 'focus', 'active', 'visited', 'disabled', 'enabled',
  'focus-within', 'focus-visible',
  // Group/peer
  'group-hover', 'group-focus', 'peer-hover', 'peer-focus',
  // Dark mode
  'dark',
  // First/last/odd/even
  'first', 'last', 'odd', 'even', 'only',
  'first-of-type', 'last-of-type',
  // Form states
  'checked', 'indeterminate', 'default', 'required', 'valid', 'invalid',
  'in-range', 'out-of-range', 'placeholder-shown', 'autofill', 'read-only',
  // Content
  'empty', 'before', 'after',
  // Selection
  'selection', 'marker', 'file',
  // Print
  'print',
  // Motion
  'motion-safe', 'motion-reduce',
  // Contrast
  'contrast-more', 'contrast-less',
  // RTL/LTR
  'rtl', 'ltr',
  // Portrait/Landscape
  'portrait', 'landscape',
  // Container queries
  '@sm', '@md', '@lg', '@xl', '@2xl',
])

/**
 * Expand bracket/grouped syntax into individual class names
 * e.g., flex[col jc-center ai-center] -> ['flex-col', 'justify-center', 'items-center']
 * e.g., text[white 2rem 700] -> ['text-white', 'text-[2rem]', 'font-bold']
 * e.g., h[min 100vh] -> ['min-h-[100vh]']
 * e.g., hover:flex[col] -> ['hover:flex-col']
 * e.g., flex[md:col lg:row] -> ['md:flex-col', 'lg:flex-row']
 * e.g., -m[4] or m[-4] -> ['-m-4']
 */
export function expandBracketSyntax(className: string, config?: BracketSyntaxConfig): string[] {
  // Check cache first
  const cacheKey = `${className}:${config?.colonSyntax}:${JSON.stringify(config?.aliases || {})}`
  const cached = bracketExpansionCache.get(cacheKey)
  if (cached) {
    return cached
  }

  const aliases = { ...defaultBracketAliases, ...config?.aliases }

  // Handle colon syntax: bg:black -> bg-black, w:100% -> w-[100%]
  // Only if colonSyntax is explicitly enabled
  // But NOT if it looks like a variant (hover:bg, sm:flex, etc.)
  if (config?.colonSyntax === true) {
    const colonMatch = className.match(/^([a-z][a-z0-9-]*):([^[\]:]+)$/i)
    if (colonMatch) {
      const [, prefix, value] = colonMatch
      // Skip if prefix is a variant
      if (!variantPrefixes.has(prefix)) {
        // If value contains special characters, use arbitrary syntax
        if (needsArbitraryBrackets(value)) {
          const result = [`${prefix}-[${value}]`]
          bracketExpansionCache.set(cacheKey, result)
          return result
        }
        const result = [`${prefix}-${value}`]
        bracketExpansionCache.set(cacheKey, result)
        return result
      }
    }
  }

  // Handle variant prefix: hover:flex[col] -> expand with hover: prefix
  let variantPrefix = ''
  let workingClassName = className

  // Check for negative prefix: -m[4] -> negative class
  let isNegative = false
  if (workingClassName.startsWith('-')) {
    isNegative = true
    workingClassName = workingClassName.slice(1)
  }

  // Extract variant prefix if present (e.g., hover:flex[col] or dark:hover:bg[black])
  const variantMatch = workingClassName.match(/^((?:[a-z@][a-z0-9-]*:)+)(.+)$/i)
  if (variantMatch) {
    const potentialVariants = variantMatch[1].slice(0, -1).split(':')
    // Verify all are valid variants
    const allVariants = potentialVariants.every(v => variantPrefixes.has(v))
    if (allVariants) {
      variantPrefix = variantMatch[1]
      workingClassName = variantMatch[2]
    }
  }

  // Handle bracket syntax: flex[col jc-center]
  // But NOT arbitrary values like w-[100px] (note the dash before bracket)
  const bracketMatch = workingClassName.match(/^([a-z][a-z0-9-]*)\[([^\]]*)\]$/i)
  if (!bracketMatch || workingClassName.includes('-[')) {
    // No bracket syntax or it's an arbitrary value, return as-is
    const result = [className]
    bracketExpansionCache.set(cacheKey, result)
    return result
  }

  const [, prefix, content] = bracketMatch
  const parts = content.split(/\s+/).filter(Boolean)

  // Handle empty brackets
  if (parts.length === 0) {
    bracketExpansionCache.set(cacheKey, [])
    return []
  }

  const mapping = bracketUtilityMappings[prefix.toLowerCase()]

  // Try multi-value handler first if available
  if (mapping?.multiValue) {
    const multiResult = mapping.multiValue(parts, aliases)
    if (multiResult) {
      const results = multiResult.map(cls => {
        const neg = isNegative ? '-' : ''
        return `${variantPrefix}${neg}${cls}`
      })
      bracketExpansionCache.set(cacheKey, results)
      return results
    }
  }

  if (!mapping) {
    // Unknown prefix, try generic expansion: prefix[a b c] -> prefix-a prefix-b prefix-c
    const results: string[] = []
    for (const part of parts) {
      // Check for variant inside brackets: flex[md:col lg:row]
      const innerVariantMatch = part.match(/^([a-z@][a-z0-9-]*):(.+)$/i)
      let innerVariant = ''
      let partValue = part

      if (innerVariantMatch && variantPrefixes.has(innerVariantMatch[1])) {
        innerVariant = `${innerVariantMatch[1]}:`
        partValue = innerVariantMatch[2]
      }

      // Handle negative values inside brackets: m[-4]
      let partNegative = ''
      if (partValue.startsWith('-')) {
        partNegative = '-'
        partValue = partValue.slice(1)
      }

      // Handle important modifier: p[4!] -> !p-4
      let important = ''
      if (partValue.endsWith('!')) {
        important = '!'
        partValue = partValue.slice(0, -1)
      }

      const neg = isNegative ? '-' : ''
      if (needsArbitraryBrackets(partValue)) {
        results.push(`${variantPrefix}${innerVariant}${important}${neg}${partNegative}${prefix}-[${partValue}]`)
      } else {
        results.push(`${variantPrefix}${innerVariant}${important}${neg}${partNegative}${prefix}-${partValue}`)
      }
    }
    bracketExpansionCache.set(cacheKey, results)
    return results
  }

  const results: string[] = []

  // Normal expansion for each part
  for (const part of parts) {
    // Check for variant inside brackets: flex[md:col lg:row]
    const innerVariantMatch = part.match(/^([a-z@][a-z0-9-]*):(.+)$/i)
    let innerVariant = ''
    let partValue = part

    if (innerVariantMatch && variantPrefixes.has(innerVariantMatch[1])) {
      innerVariant = `${innerVariantMatch[1]}:`
      partValue = innerVariantMatch[2]
    }

    // Handle negative values inside brackets: m[-4]
    let partNegative = ''
    if (partValue.startsWith('-')) {
      partNegative = '-'
      partValue = partValue.slice(1)
    }

    // Handle important modifier: p[4!] -> !p-4
    let important = ''
    if (partValue.endsWith('!')) {
      important = '!'
      partValue = partValue.slice(0, -1)
    }

    const expanded = mapping.expand(partValue, aliases)
    if (expanded) {
      const neg = isNegative ? '-' : ''
      results.push(`${variantPrefix}${innerVariant}${important}${neg}${partNegative}${expanded}`)
    }
  }

  bracketExpansionCache.set(cacheKey, results)
  return results
}

/**
 * Extract classes from attributify syntax
 * e.g., <div hw-flex hw-items-center hw-bg="blue-500" hw-p="4">
 * Returns classes like: flex, items-center, bg-blue-500, p-4
 *
 * Also supports variant attributes:
 * e.g., <div hw-hover:bg="blue-600" hw-dark:text="white">
 * Returns classes like: hover:bg-blue-600, dark:text-white
 */
export function extractAttributifyClasses(content: string, config?: AttributifyConfig): Set<string> {
  const classes = new Set<string>()

  if (!config?.enabled) {
    return classes
  }

  const prefix = config.prefix ?? 'hw-'
  const defaultIgnoreList = [
    'class',
    'className',
    'style',
    'id',
    'name',
    'type',
    'value',
    'href',
    'src',
    'alt',
    'title',
    'role',
    'for',
    'action',
    'method',
    'target',
    'rel',
    'placeholder',
    'disabled',
    'checked',
    'selected',
    'readonly',
    'required',
    'maxlength',
    'minlength',
    'pattern',
    'autocomplete',
    'autofocus',
    'tabindex',
    'contenteditable',
    'draggable',
    'spellcheck',
    'lang',
    'dir',
    'hidden',
    'slot',
    'part',
    'is',
    'key',
    'ref',
  ]
  const ignoreList = config.ignoreAttributes || defaultIgnoreList

  const shouldIgnore = (attr: string): boolean => {
    // Remove any variant prefix for ignore check
    const baseAttr = attr.includes(':') ? attr.split(':').pop()! : attr

    // Check ignore list
    for (const pattern of ignoreList) {
      if (pattern.endsWith('*')) {
        if (baseAttr.startsWith(pattern.slice(0, -1))) return true
      } else if (baseAttr === pattern) {
        return true
      }
    }
    // Also ignore attributes starting with on (event handlers)
    if (baseAttr.startsWith('on')) return true
    // Ignore data-* and aria-*
    if (baseAttr.startsWith('data-') || baseAttr.startsWith('aria-')) return true
    return false
  }

  // Extract all attributes from all tags
  // Match each tag separately
  const tagPattern = /<([a-z][a-z0-9-]*)\s([^>]*)>/gi
  let tagMatch

  // eslint-disable-next-line no-cond-assign
  while ((tagMatch = tagPattern.exec(content)) !== null) {
    const attributesStr = tagMatch[2]

    // Parse attributes from this tag
    // Match both value attributes and boolean attributes
    // Updated pattern to support colons in attribute names for variants: hw-hover:bg="blue-500"
    // Use greedy match for attribute name to capture full dark:hover:bg style names
    const attrPattern = /([a-z][a-z0-9-:]*)(?:=["']([^"']*)["'])?(?=\s|$|\/?>)/gi
    let attrMatch

    // eslint-disable-next-line no-cond-assign
    while ((attrMatch = attrPattern.exec(attributesStr)) !== null) {
      let attrName = attrMatch[1]
      const attrValue = attrMatch[2]

      // Handle prefix
      if (prefix) {
        if (!attrName.startsWith(prefix)) continue
        attrName = attrName.slice(prefix.length)
      }

      // Skip ignored attributes
      if (shouldIgnore(attrName)) continue

      // Check for variant prefix in attribute name: hover:bg, dark:text, etc.
      let variantPrefix = ''
      let utilityName = attrName

      // Extract variant(s) if present
      const variantMatch = attrName.match(/^((?:[a-z@][a-z0-9-]*:)+)([a-z][a-z0-9-]*)$/i)
      if (variantMatch) {
        const potentialVariants = variantMatch[1].slice(0, -1).split(':')
        // Verify all are valid variants
        const allVariants = potentialVariants.every(v => variantPrefixes.has(v))
        if (allVariants) {
          variantPrefix = variantMatch[1]
          utilityName = variantMatch[2]
        }
      }

      if (attrValue !== undefined) {
        // Value attribute: bg="blue-500" -> bg-blue-500
        // Or with variant: hover:bg="blue-600" -> hover:bg-blue-600
        const values = attrValue.split(/\s+/).filter(Boolean)
        for (const v of values) {
          const className = `${variantPrefix}${utilityName}-${v}`
          // Strip all variant prefixes for validation (e.g., dark:hover:bg-gray-800 -> bg-gray-800)
          if (isValidUtilityName(className.replace(/^(?:[a-z@][a-z0-9-]*:)+/gi, ''))) {
            classes.add(className)
          }
        }
      } else {
        // Boolean attribute: flex -> flex
        // Or with variant: hover:underline -> hover:underline
        const className = `${variantPrefix}${utilityName}`
        if (isValidUtilityName(utilityName)) {
          classes.add(className)
        }
      }
    }
  }

  return classes
}

/**
 * Check if a string looks like a valid utility name (for attributify)
 * More permissive than isValidClassName since we need to match potential utilities
 */
function isValidUtilityName(name: string): boolean {
  if (!name || name.length === 0) return false
  // Must start with letter, can contain letters, numbers, dashes, slashes (for fractions)
  // Can have arbitrary values in brackets
  return /^[a-z][a-z0-9-/]*(?:-\[[^\]]+\])?$/i.test(name)
}

/**
 * Parses a utility class string into its components
 * Examples: "p-4" -> {raw: "p-4", variants: [], utility: "p", value: "4", important: false, arbitrary: false}
 *          "hover:bg-blue-500" -> {raw: "hover:bg-blue-500", variants: ["hover"], utility: "bg", value: "blue-500", important: false, arbitrary: false}
 *          "!p-4" -> {raw: "!p-4", variants: [], utility: "p", value: "4", important: true, arbitrary: false}
 *          "w-[100px]" -> {raw: "w-[100px]", variants: [], utility: "w", value: "100px", important: false, arbitrary: true}
 */
export function parseClass(className: string): ParsedClass {
  // Check cache first
  const cached = parseCache.get(className)
  if (cached) {
    return cached
  }

  const result = parseClassImpl(className)
  parseCache.set(className, result)
  return result
}

/**
 * Internal implementation of parseClass
 */
function parseClassImpl(className: string): ParsedClass {
  // Check for important modifier
  let important = false
  let cleanClassName = className
  if (className.startsWith('!')) {
    important = true
    cleanClassName = className.slice(1)
  }

  // Check for arbitrary properties BEFORE splitting on colons: [color:red], [mask-type:luminance]
  const arbitraryPropMatch = cleanClassName.match(/^\[([a-z-]+):(.+)\]$/)
  if (arbitraryPropMatch) {
    return {
      raw: className,
      variants: [],
      utility: arbitraryPropMatch[1],
      value: arbitraryPropMatch[2],
      important,
      arbitrary: true,
    }
  }

  // Check for arbitrary values with brackets BEFORE splitting on colons
  // This handles cases like bg-[url(https://...)] where the URL contains colons
  // Also handles type hints like text-[color:var(--muted)]
  const preArbitraryMatch = cleanClassName.match(/^((?:[a-z-]+:)*)([a-z-]+?)-\[(.+)\]$/)
  if (preArbitraryMatch) {
    const variantPart = preArbitraryMatch[1]
    const variants = variantPart ? variantPart.split(':').filter(Boolean) : []
    let value = preArbitraryMatch[3]
    let typeHint: string | undefined

    // Check for type hint in arbitrary value: text-[color:var(--muted)]
    // Type hints are: color, length, url, number, percentage, position, etc.
    // Don't match if it looks like a CSS variable var(--...) or CSS function
    const typeHintMatch = value.match(/^(color|length|url|number|percentage|position|line-width|absolute-size|relative-size|image|angle|time|flex|string|family-name):(.*)/i)
    if (typeHintMatch) {
      typeHint = typeHintMatch[1].toLowerCase()
      value = typeHintMatch[2]
    }

    return {
      raw: className,
      variants,
      utility: preArbitraryMatch[2],
      value,
      important,
      arbitrary: true,
      typeHint,
    }
  }

  const parts = cleanClassName.split(':')
  const utility = parts[parts.length - 1]
  const variants = parts.slice(0, -1)

  // Check for full utility names that should not be split
  const fullUtilityNames = [
    // Display utilities
    'inline-block',
    'inline-flex',
    'inline-grid',
    // Flex utilities without values
    'flex-row',
    'flex-row-reverse',
    'flex-col',
    'flex-col-reverse',
    'flex-wrap',
    'flex-wrap-reverse',
    'flex-nowrap',
    'flex-1',
    'flex-auto',
    'flex-initial',
    'flex-none',
    'flex-grow',
    'flex-shrink',
  ]
  if (fullUtilityNames.includes(utility)) {
    return {
      raw: className,
      variants,
      utility,
      value: undefined,
      important,
      arbitrary: false,
    }
  }

  // Check for arbitrary values: w-[100px] or bg-[#ff0000] or text-[color:var(--muted)]
  const arbitraryMatch = utility.match(/^([a-z-]+?)-\[(.+?)\]$/)
  if (arbitraryMatch) {
    let value = arbitraryMatch[2]
    let typeHint: string | undefined

    // Check for type hint in arbitrary value: text-[color:var(--muted)]
    // Type hints are: color, length, url, number, percentage, position, etc.
    const typeHintMatch = value.match(/^(color|length|url|number|percentage|position|line-width|absolute-size|relative-size|image|angle|time|flex|string|family-name):(.*)/i)
    if (typeHintMatch) {
      typeHint = typeHintMatch[1].toLowerCase()
      value = typeHintMatch[2]
    }

    return {
      raw: className,
      variants,
      utility: arbitraryMatch[1],
      value,
      important,
      arbitrary: true,
      typeHint,
    }
  }

  // Handle compound utilities with specific prefixes
  // grid-cols-3, grid-rows-2, translate-x-4, etc.
  const compoundPrefixes = [
    // Border side utilities (border-t-0, border-r-2, etc.)
    'border-t',
    'border-r',
    'border-b',
    'border-l',
    'border-x',
    'border-y',
    // Logical border utilities (for RTL support)
    'border-s',
    'border-e',
    'grid-cols',
    'grid-rows',
    'grid-flow',
    'auto-cols',
    'auto-rows',
    'col-span',
    'row-span',
    'col-start',
    'col-end',
    'row-start',
    'row-end',
    'translate-x',
    'translate-y',
    'translate-z',
    'scale-x',
    'scale-y',
    'scale-z',
    'rotate-x',
    'rotate-y',
    'rotate-z',
    'skew-x',
    'skew-y',
    'scroll-m',
    'scroll-mx',
    'scroll-my',
    'scroll-mt',
    'scroll-mr',
    'scroll-mb',
    'scroll-ml',
    'scroll-p',
    'scroll-px',
    'scroll-py',
    'scroll-pt',
    'scroll-pr',
    'scroll-pb',
    'scroll-pl',
    'gap-x',
    'gap-y',
    'overflow-x',
    'overflow-y',
    'min-w',
    'max-w',
    'min-h',
    'max-h',
    'space-x',
    'space-y',
    'ring-offset',
    'underline-offset',
    'outline-offset',
    'backdrop-blur',
    'backdrop-brightness',
    'backdrop-contrast',
    'backdrop-grayscale',
    'backdrop-invert',
    'backdrop-saturate',
    'backdrop-sepia',
    'hue-rotate',
    'drop-shadow',
    'mask-clip',
    'flex-grow',
    'flex-shrink',
    'mask-composite',
    'mask-image',
    'mask-mode',
    'mask-origin',
    'mask-position',
    'mask-repeat',
    'mask-size',
    'mask-type',
    'perspective-origin',
    'justify-self',
    'form-input',
    'form-textarea',
    'form-select',
    'form-multiselect',
    'form-checkbox',
    'form-radio',
    'mix-blend',
    'bg-blend',
    'line-clamp',
    'border-spacing',
    'border-spacing-x',
    'border-spacing-y',
    'rounded-s',
    'rounded-e',
    'rounded-ss',
    'rounded-se',
    'rounded-es',
    'rounded-ee',
    'border-opacity',
    'ring-opacity',
    'stroke-dasharray',
    'stroke-dashoffset',
    'animate-iteration',
    'animate-duration',
    'animate-delay',
    'text-emphasis',
    'text-emphasis-color',
    'word-spacing',
    'column-gap',
    'column-rule',
  ]

  // Special case for divide-x and divide-y (without values, they should be treated as compound)
  // divide-x -> utility: "divide-x", value: undefined
  // divide-x-2 -> utility: "divide-x", value: "2"
  if (utility === 'divide-x' || utility === 'divide-y') {
    return {
      raw: className,
      variants,
      utility,
      value: undefined,
      important,
      arbitrary: false,
    }
  }

  // Check for divide-x-{width} and divide-y-{width}
  const divideMatch = utility.match(/^(divide-[xy])-(.+)$/)
  if (divideMatch) {
    return {
      raw: className,
      variants,
      utility: divideMatch[1],
      value: divideMatch[2],
      important,
      arbitrary: false,
    }
  }

  for (const prefix of compoundPrefixes) {
    if (utility.startsWith(`${prefix}-`)) {
      return {
        raw: className,
        variants,
        utility: prefix,
        value: utility.slice(prefix.length + 1),
        important,
        arbitrary: false,
      }
    }
  }

  // Check for negative values: -m-4, -top-4, -translate-x-4
  if (utility.startsWith('-')) {
    const positiveUtility = utility.slice(1)

    // Try compound prefixes first
    for (const prefix of compoundPrefixes) {
      if (positiveUtility.startsWith(`${prefix}-`)) {
        return {
          raw: className,
          variants,
          utility: prefix,
          value: `-${positiveUtility.slice(prefix.length + 1)}`,
          important,
          arbitrary: false,
        }
      }
    }

    // Regular negative value
    const match = positiveUtility.match(/^([a-z]+(?:-[a-z]+)*?)-(.+)$/)
    if (match) {
      return {
        raw: className,
        variants,
        utility: match[1],
        value: `-${match[2]}`,
        important,
        arbitrary: false,
      }
    }
    // If no match, it's a standalone utility with just a negative sign (e.g., -flex doesn't make sense)
    // Return as-is
    return {
      raw: className,
      variants,
      utility: positiveUtility,
      value: undefined,
      important,
      arbitrary: false,
    }
  }

  // Check for color opacity modifiers: bg-blue-500/50, text-red-500/75
  // Must come before fractional values to avoid conflict
  const opacityMatch = utility.match(/^([a-z]+(?:-[a-z]+)*?)-(.+?)\/(\d+)$/)
  if (opacityMatch && ['bg', 'text', 'border', 'ring', 'placeholder', 'divide'].includes(opacityMatch[1])) {
    return {
      raw: className,
      variants,
      utility: opacityMatch[1],
      value: `${opacityMatch[2]}/${opacityMatch[3]}`,
      important,
      arbitrary: false,
    }
  }

  // Check for fractional values: w-1/2, h-3/4
  const fractionMatch = utility.match(/^([a-z]+(?:-[a-z]+)*?)-(\d+)\/(\d+)$/)
  if (fractionMatch) {
    return {
      raw: className,
      variants,
      utility: fractionMatch[1],
      value: `${fractionMatch[2]}/${fractionMatch[3]}`,
      important,
      arbitrary: false,
    }
  }

  // Regular parsing - split on last dash
  // First try: utility-value pattern (e.g., text-current, p-4)
  const matchWithValue = utility.match(/^([a-z]+(?:-[a-z]+)*?)-(.+)$/)
  if (matchWithValue) {
    return {
      raw: className,
      variants,
      utility: matchWithValue[1],
      value: matchWithValue[2],
      important,
      arbitrary: false,
    }
  }

  // If no dash, treat entire string as utility with no value (e.g., flex, block)
  return {
    raw: className,
    variants,
    utility,
    value: undefined,
    important,
    arbitrary: false,
  }
}


/**
 * Validates if a string is a valid Tailwind utility class name
 * Supports arbitrary values like z-[1], w-[100px], bg-[#ff0000]
 * Supports variants like hover:, focus:, sm:, md:
 * Supports important modifier !
 * Supports negative values like -m-4
 * Supports bracket syntax like flex[col jc-center] when enabled
 * Supports colon syntax like bg:black when enabled
 */
function isValidClassName(name: string, bracketConfig?: BracketSyntaxConfig): boolean {
  // Quick check for obviously invalid names
  if (!name || name.length === 0) return false

  // Arbitrary properties like [color:red], [mask-type:luminance]
  if (/^\[[a-z-]+:[^\]]+\]$/i.test(name)) return true

  // Bracket syntax: flex[col jc-center ai-center]
  if (bracketConfig?.enabled && /^[a-z]+\[[^\]]+\]$/i.test(name)) return true

  // Colon syntax: bg:black, w:100%
  if (bracketConfig?.colonSyntax && /^[a-z]+:[^[\]:]+$/i.test(name)) return true

  // Standard utility classes with optional:
  // - ! prefix (important)
  // - - prefix (negative values)
  // - Arbitrary values in brackets like -[100px] or -[#ff0000]
  // - Variant prefixes with colons like hover:, sm:, focus:
  // - Decimal values like py-2.5, gap-0.5
  return /^!?-?[a-z][a-z0-9.-]*(?:-\[[^\]]+\])?(?::!?-?[a-z][a-z0-9.-]*(?:-\[[^\]]+\])?)*$/i.test(name)
}

/**
 * Split class string preserving bracket groups
 * e.g., "flex[col jc-center] bg:black p-4" -> ["flex[col jc-center]", "bg:black", "p-4"]
 */
function splitClassString(classStr: string): string[] {
  const classes: string[] = []
  let current = ''
  let bracketDepth = 0

  for (const char of classStr) {
    if (char === '[') {
      bracketDepth++
      current += char
    } else if (char === ']') {
      bracketDepth--
      current += char
    } else if (/\s/.test(char) && bracketDepth === 0) {
      if (current) {
        classes.push(current)
        current = ''
      }
    } else {
      current += char
    }
  }

  if (current) {
    classes.push(current)
  }

  return classes
}

/**
 * Extracts all utility classes from content
 * Matches class patterns in HTML/JSX attributes and template strings
 * Supports bracket syntax (e.g., flex[col jc-center]) and attributify mode
 */
export function extractClasses(content: string, options?: ExtractClassesOptions): Set<string> {
  const classes = new Set<string>()

  // Match class="..." and className="..." and className={...}
  const patterns = [
    /class(?:Name)?=["']([^"']+)["']/g,
    /class(?:Name)?=\{["']([^"']+)["']\}/g,
    /class(?:Name)?=\{`([^`]+)`\}/g,
  ]

  for (const pattern of patterns) {
    let match
    // eslint-disable-next-line no-cond-assign
    while ((match = pattern.exec(content)) !== null) {
      const classStr = match[1]
      // Extract all quoted strings from the class string (handles template literals with expressions)
      const quotedStrings = classStr.match(/["']([^"']+)["']/g)
      if (quotedStrings) {
        for (const quoted of quotedStrings) {
          const cleaned = quoted.replace(/["']/g, '')
          const classNames = splitClassString(cleaned)
          for (const className of classNames) {
            addClassWithExpansion(classes, className, options)
          }
        }
      }

      // Also extract classes not in quotes (for simple cases)
      const cleanedStr = classStr
        .replace(/["'`]/g, ' ')
        .replace(/\$\{[^}]+\}/g, ' ')

      const classNames = splitClassString(cleanedStr)
        .filter(name => isValidClassName(name, options?.bracketSyntax))

      for (const className of classNames) {
        addClassWithExpansion(classes, className, options)
      }
    }
  }

  // Extract attributify classes if enabled
  if (options?.attributify?.enabled) {
    const attributifyClasses = extractAttributifyClasses(content, options.attributify)
    for (const cls of attributifyClasses) {
      classes.add(cls)
    }
  }

  return classes
}

/**
 * Helper to add a class with potential bracket syntax expansion
 */
function addClassWithExpansion(classes: Set<string>, className: string, options?: ExtractClassesOptions): void {
  if (options?.bracketSyntax?.enabled) {
    // Check if this is bracket or colon syntax
    const hasBracket = /^[a-z]+\[[^\]]+\]$/i.test(className)
    const hasColon = options.bracketSyntax.colonSyntax && /^[a-z]+:[^[\]]+$/i.test(className)

    if (hasBracket || hasColon) {
      const expanded = expandBracketSyntax(className, options.bracketSyntax)
      for (const cls of expanded) {
        classes.add(cls)
      }
      return
    }
  }
  classes.add(className)
}
