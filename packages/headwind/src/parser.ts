import type { ParsedClass } from './types'

/**
 * Parses a utility class string into its components
 * Examples: "p-4" -> {raw: "p-4", variants: [], utility: "p", value: "4", important: false, arbitrary: false}
 *          "hover:bg-blue-500" -> {raw: "hover:bg-blue-500", variants: ["hover"], utility: "bg", value: "blue-500", important: false, arbitrary: false}
 *          "!p-4" -> {raw: "!p-4", variants: [], utility: "p", value: "4", important: true, arbitrary: false}
 *          "w-[100px]" -> {raw: "w-[100px]", variants: [], utility: "w", value: "100px", important: false, arbitrary: true}
 */
export function parseClass(className: string): ParsedClass {
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
  const preArbitraryMatch = cleanClassName.match(/^((?:[a-z-]+:)*)([a-z-]+?)-\[(.+)\]$/)
  if (preArbitraryMatch) {
    const variantPart = preArbitraryMatch[1]
    const variants = variantPart ? variantPart.split(':').filter(Boolean) : []
    return {
      raw: className,
      variants,
      utility: preArbitraryMatch[2],
      value: preArbitraryMatch[3],
      important,
      arbitrary: true,
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

  // Check for arbitrary values: w-[100px] or bg-[#ff0000]
  const arbitraryMatch = utility.match(/^([a-z-]+?)-\[(.+?)\]$/)
  if (arbitraryMatch) {
    return {
      raw: className,
      variants,
      utility: arbitraryMatch[1],
      value: arbitraryMatch[2],
      important,
      arbitrary: true,
    }
  }

  // Handle compound utilities with specific prefixes
  // grid-cols-3, grid-rows-2, translate-x-4, etc.
  const compoundPrefixes = [
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
    const match = positiveUtility.match(/^([a-z-]+?)(?:-(.+))?$/)
    if (match) {
      return {
        raw: className,
        variants,
        utility: match[1],
        value: match[2] ? `-${match[2]}` : undefined,
        important,
        arbitrary: false,
      }
    }
  }

  // Check for color opacity modifiers: bg-blue-500/50, text-red-500/75
  // Must come before fractional values to avoid conflict
  const opacityMatch = utility.match(/^([a-z-]+?)-(.+?)\/(\d+)$/)
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
  const fractionMatch = utility.match(/^([a-z-]+?)-(\d+)\/(\d+)$/)
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
  const match = utility.match(/^([a-z-]+?)(?:-(.+))?$/)
  if (!match) {
    return {
      raw: className,
      variants,
      utility,
      important,
      arbitrary: false,
    }
  }

  return {
    raw: className,
    variants,
    utility: match[1],
    value: match[2],
    important,
    arbitrary: false,
  }
}

/**
 * Extracts all utility classes from content
 * Matches class patterns in HTML/JSX attributes and template strings
 */
export function extractClasses(content: string): Set<string> {
  const classes = new Set<string>()

  // Match class="..." and className="..." and className={...}
  const patterns = [
    /class(?:Name)?=["']([^"']+)["']/g,
    /class(?:Name)?=\{["']([^"']+)["']\}/g,
    /class(?:Name)?=\{`([^`]+)`\}/g,
  ]

  for (const pattern of patterns) {
    let match
    while ((match = pattern.exec(content)) !== null) {
      const classStr = match[1]
      // Extract all quoted strings from the class string (handles template literals with expressions)
      const quotedStrings = classStr.match(/["']([^"']+)["']/g)
      if (quotedStrings) {
        for (const quoted of quotedStrings) {
          const cleaned = quoted.replace(/["']/g, '')
          const classNames = cleaned.split(/\s+/).filter(Boolean)
          for (const className of classNames) {
            classes.add(className)
          }
        }
      }

      // Also extract classes not in quotes (for simple cases)
      const classNames = classStr
        .replace(/["'`]/g, ' ')
        .replace(/\$\{[^}]+\}/g, ' ')
        .split(/\s+/)
        .filter(Boolean)
        .filter(name => /^[a-z][a-z0-9-]*(?::[a-z][a-z0-9-]*)*$/i.test(name))

      for (const className of classNames) {
        classes.add(className)
      }
    }
  }

  return classes
}
