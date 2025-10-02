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

  const parts = cleanClassName.split(':')
  const utility = parts[parts.length - 1]
  const variants = parts.slice(0, -1)

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
    'col-start',
    'col-end',
    'row-start',
    'row-end',
    'translate-x',
    'translate-y',
    'scale-x',
    'scale-y',
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
  ]

  for (const prefix of compoundPrefixes) {
    if (utility.startsWith(prefix + '-')) {
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
