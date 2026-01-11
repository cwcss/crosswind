import type { CSSRule, HeadwindConfig, ParsedClass } from './types'
import type { UtilityRule } from './rules'
import { parseClass } from './parser'
import { builtInRules } from './rules'

/**
 * Deep merge objects
 */
function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const result = { ...target }
  for (const key in source) {
    const sourceValue = source[key]
    const targetValue = result[key]
    if (sourceValue && typeof sourceValue === 'object' && !Array.isArray(sourceValue) && targetValue && typeof targetValue === 'object' && !Array.isArray(targetValue)) {
      result[key] = deepMerge(targetValue, sourceValue)
    }
    else if (sourceValue !== undefined) {
      result[key] = sourceValue as any
    }
  }
  return result
}

// Pre-computed variant selector map for O(1) lookup (shared across all instances)
const VARIANT_SELECTORS: Record<string, string> = {
  // Pseudo-class variants
  'hover': ':hover',
  'focus': ':focus',
  'active': ':active',
  'disabled': ':disabled',
  'visited': ':visited',
  'checked': ':checked',
  'focus-within': ':focus-within',
  'focus-visible': ':focus-visible',
  // Positional variants
  'first': ':first-child',
  'last': ':last-child',
  'odd': ':nth-child(odd)',
  'even': ':nth-child(even)',
  'first-of-type': ':first-of-type',
  'last-of-type': ':last-of-type',
  // Pseudo-elements
  'before': '::before',
  'after': '::after',
  'marker': '::marker',
  'placeholder': '::placeholder',
  'selection': '::selection',
  'file': '::file-selector-button',
  // Form state pseudo-classes
  'required': ':required',
  'valid': ':valid',
  'invalid': ':invalid',
  'read-only': ':read-only',
  'autofill': ':autofill',
  // Additional state pseudo-classes
  'open': '[open]',
  'closed': ':not([open])',
  'empty': ':empty',
  'enabled': ':enabled',
  'only': ':only-child',
  'target': ':target',
  'indeterminate': ':indeterminate',
  'default': ':default',
  'optional': ':optional',
}

// Pre-computed prefix variants (these modify the selector prefix, not suffix)
const PREFIX_VARIANTS: Record<string, string> = {
  'dark': '.dark ',
  'rtl': '[dir="rtl"] ',
  'ltr': '[dir="ltr"] ',
}

/**
 * Generates CSS rules from parsed utility classes
 */
export class CSSGenerator {
  private rules: Map<string, CSSRule[]> = new Map()
  private classCache: Set<string> = new Set()
  private blocklistRegexCache: RegExp[] = []
  private blocklistExact: Set<string> = new Set()
  private selectorCache: Map<string, string> = new Map()
  private mediaQueryCache: Map<string, string | undefined> = new Map()
  private ruleCache: Map<string, UtilityRule[]> = new Map()
  private variantEnabled: Record<string, boolean>
  private screenBreakpoints: Map<string, string>
  // Cache for utility+value combinations that don't match any rule (negative cache)
  private noMatchCache: Set<string> = new Set()

  constructor(private config: HeadwindConfig) {
    // Merge preset themes into the main config theme
    if (config.presets && config.presets.length > 0) {
      for (const preset of config.presets) {
        if (preset.theme) {
          this.config.theme = deepMerge(this.config.theme, preset.theme)
        }
      }
    }

    // Merge theme.extend into theme (allows users to add custom values without replacing defaults)
    if (config.theme.extend) {
      const { extend, ...baseTheme } = this.config.theme
      if (extend) {
        this.config.theme = deepMerge(baseTheme, extend) as typeof this.config.theme
      }
    }

    // Pre-compile blocklist patterns for performance
    for (const pattern of this.config.blocklist) {
      if (pattern.includes('*')) {
        const regexPattern = pattern.replace(/\*/g, '.*')
        this.blocklistRegexCache.push(new RegExp(`^${regexPattern}$`))
      }
      else {
        this.blocklistExact.add(pattern)
      }
    }

    // Pre-cache variant enabled state for faster lookup
    this.variantEnabled = this.config.variants as Record<string, boolean>

    // Pre-cache screen breakpoints as Map for faster lookup
    this.screenBreakpoints = new Map(Object.entries(this.config.theme.screens))

    // Build rule lookup map for faster matching
    this.buildRuleLookup()
  }

  /**
   * Build a prefix-based lookup map for rules
   * This allows O(1) lookup instead of O(n) iteration
   */
  private buildRuleLookup(): void {
    // Pre-processing done in constructor
    // Rule caching happens during generation
  }

  /**
   * Generate CSS for a utility class
   */
  generate(className: string): void {
    // Check cache for already processed classes
    if (this.classCache.has(className)) {
      return
    }

    // Check shortcuts first (before marking as cached)
    const shortcut = this.config.shortcuts[className]
    if (shortcut) {
      this.classCache.add(className)
      const classes = Array.isArray(shortcut) ? shortcut : shortcut.split(/\s+/)
      for (const cls of classes) {
        this.generate(cls)
      }
      return
    }

    this.classCache.add(className)

    // Check exact match blocklist first (O(1) Set lookup)
    if (this.blocklistExact.size > 0 && this.blocklistExact.has(className)) {
      return
    }

    // Check if class is blocklisted (use pre-compiled regexes)
    if (this.blocklistRegexCache.length > 0) {
      for (let i = 0; i < this.blocklistRegexCache.length; i++) {
        if (this.blocklistRegexCache[i].test(className)) {
          return
        }
      }
    }

    const parsed = parseClass(className)

    // Check no-match cache - if this utility+value combo was already determined to not match
    // any rule, skip the expensive rule iteration (especially helpful for variant classes)
    const utilityKey = `${parsed.utility}:${parsed.value || ''}`
    if (this.noMatchCache.has(utilityKey)) {
      return
    }

    // Try custom rules from config first (allows overriding built-in rules)
    if (this.config.rules.length > 0) {
      for (const [pattern, handler] of this.config.rules) {
        const match = className.match(pattern)
        if (match) {
          const properties = handler(match)
          if (properties) {
            this.addRule(parsed, properties)
            return
          }
        }
      }
    }

    // Try built-in rules with optimized iteration
    const rulesLength = builtInRules.length
    for (let i = 0; i < rulesLength; i++) {
      const result = builtInRules[i](parsed, this.config)
      if (result) {
        // Handle both old format (just properties) and new format (object with properties and childSelector)
        if ('properties' in result && typeof result.properties === 'object') {
          this.addRule(parsed, result.properties, result.childSelector)
        }
        else {
          this.addRule(parsed, result as Record<string, string>)
        }
        return
      }
    }

    // No rule matched - cache this utility+value combo to skip future iterations
    this.noMatchCache.add(utilityKey)
  }

  /**
   * Add a CSS rule with variants applied
   */
  private addRule(parsed: ParsedClass, properties: Record<string, string>, childSelector?: string): void {
    // Use cached selector if available
    const cacheKey = `${parsed.raw}${childSelector || ''}`
    let selector = this.selectorCache.get(cacheKey)
    if (!selector) {
      selector = this.buildSelector(parsed)
      // Append child selector if provided
      if (childSelector) {
        selector += ` ${childSelector}`
      }
      this.selectorCache.set(cacheKey, selector)
    }

    const mediaQuery = this.getMediaQuery(parsed)

    // Apply !important modifier
    if (parsed.important) {
      for (const key in properties) {
        properties[key] += ' !important'
      }
    }

    const key = mediaQuery || 'base'
    if (!this.rules.has(key)) {
      this.rules.set(key, [])
    }

    this.rules.get(key)!.push({
      selector,
      properties,
      mediaQuery,
      childSelector,
    })
  }

  /**
   * Build CSS selector with pseudo-classes and variants
   * Optimized with pre-computed lookup maps for O(1) variant resolution
   */
  private buildSelector(parsed: ParsedClass): string {
    let selector = `.${this.escapeSelector(parsed.raw)}`
    let prefix = ''

    const variants = parsed.variants
    const variantsLen = variants.length

    // Fast path: no variants
    if (variantsLen === 0) {
      return selector
    }

    // Apply variants using pre-computed maps
    for (let i = 0; i < variantsLen; i++) {
      const variant = variants[i]

      // Try suffix selector lookup first (most common case)
      const suffixSelector = VARIANT_SELECTORS[variant]
      if (suffixSelector !== undefined) {
        // Check if variant is enabled
        if (this.variantEnabled[variant]) {
          selector += suffixSelector
        }
        continue
      }

      // Try prefix selector lookup (dark, rtl, ltr)
      const prefixSelector = PREFIX_VARIANTS[variant]
      if (prefixSelector !== undefined) {
        if (this.variantEnabled[variant]) {
          prefix = prefixSelector
        }
        continue
      }

      // Handle group-* variants
      if (variant.charCodeAt(0) === 103 && variant.startsWith('group-')) { // 'g' = 103
        if (this.variantEnabled.group) {
          const groupVariant = variant.slice(6)
          prefix = `.group:${groupVariant} `
        }
        continue
      }

      // Handle peer-* variants
      if (variant.charCodeAt(0) === 112 && variant.startsWith('peer-')) { // 'p' = 112
        if (this.variantEnabled.peer) {
          const peerVariant = variant.slice(5)
          prefix = `.peer:${peerVariant} ~ `
        }
      }
    }

    return prefix + selector
  }

  /**
   * Get media query for responsive and media variants
   * Optimized with pre-cached lookups and early returns
   */
  private getMediaQuery(parsed: ParsedClass): string | undefined {
    const variants = parsed.variants
    const variantsLen = variants.length

    // Fast path: no variants
    if (variantsLen === 0) {
      return undefined
    }

    // Use cached media query if available
    const cacheKey = variants.join(':')
    const cached = this.mediaQueryCache.get(cacheKey)
    if (cached !== undefined) {
      return cached || undefined // Convert empty string to undefined
    }

    let result: string | undefined

    for (let i = 0; i < variantsLen; i++) {
      const variant = variants[i]
      const firstChar = variant.charCodeAt(0)

      // Container queries (@sm, @md, @lg, etc.) - '@' = 64
      if (firstChar === 64) {
        const breakpointKey = variant.slice(1)
        const breakpoint = this.screenBreakpoints.get(breakpointKey)
        if (breakpoint) {
          result = `@container (min-width: ${breakpoint})`
          this.mediaQueryCache.set(cacheKey, result)
          return result
        }
        continue
      }

      // Responsive breakpoints - check if variant is a screen breakpoint
      if (this.variantEnabled.responsive) {
        const breakpoint = this.screenBreakpoints.get(variant)
        if (breakpoint) {
          result = `@media (min-width: ${breakpoint})`
          this.mediaQueryCache.set(cacheKey, result)
          return result
        }
      }

      // Media preference variants - use switch for common cases
      switch (variant) {
        case 'print':
          if (this.variantEnabled.print) {
            result = '@media print'
            this.mediaQueryCache.set(cacheKey, result)
            return result
          }
          break
        case 'motion-safe':
          if (this.variantEnabled['motion-safe']) {
            result = '@media (prefers-reduced-motion: no-preference)'
            this.mediaQueryCache.set(cacheKey, result)
            return result
          }
          break
        case 'motion-reduce':
          if (this.variantEnabled['motion-reduce']) {
            result = '@media (prefers-reduced-motion: reduce)'
            this.mediaQueryCache.set(cacheKey, result)
            return result
          }
          break
        case 'contrast-more':
          if (this.variantEnabled['contrast-more']) {
            result = '@media (prefers-contrast: more)'
            this.mediaQueryCache.set(cacheKey, result)
            return result
          }
          break
        case 'contrast-less':
          if (this.variantEnabled['contrast-less']) {
            result = '@media (prefers-contrast: less)'
            this.mediaQueryCache.set(cacheKey, result)
            return result
          }
          break
      }
    }

    this.mediaQueryCache.set(cacheKey, '')  // Use empty string as "no result" marker
    return undefined
  }

  /**
   * Escape special characters in class names for CSS selectors
   * Optimized with charCode checks for common fast path
   */
  private escapeSelector(className: string): string {
    // Fast path: check if string needs escaping at all
    let needsEscape = false
    for (let i = 0; i < className.length; i++) {
      const c = className.charCodeAt(i)
      // Check for : (58), . (46), / (47), @ (64), space (32), [ (91), ] (93)
      if (c === 58 || c === 46 || c === 47 || c === 64 || c === 32 || c === 91 || c === 93) {
        needsEscape = true
        break
      }
    }
    if (!needsEscape) {
      return className
    }
    return className.replace(/[:./@ \[\]]/g, '\\$&')
  }

  /**
   * Generate final CSS output
   */
  toCSS(includePreflight = true, minify = false): string {
    const parts: string[] = []

    // Add preflight CSS first (if requested)
    if (includePreflight) {
      for (const preflight of this.config.preflights) {
        let preflightCSS = preflight.getCSS()
        // Replace hardcoded font-family in preflight with theme's sans font
        const sansFonts = this.config.theme?.fontFamily?.sans
        if (sansFonts && Array.isArray(sansFonts)) {
          const fontFamilyValue = sansFonts.join(', ')
          // Replace the default ui-sans-serif stack in html/:host selector
          preflightCSS = preflightCSS.replace(
            /font-family:\s*ui-sans-serif[^;]+;/g,
            `font-family: ${fontFamilyValue};`,
          )
        }
        parts.push(minify ? preflightCSS.replace(/\s+/g, ' ').trim() : preflightCSS)
      }
    }

    // Base rules (no media query)
    const baseRules = this.rules.get('base') || []
    if (baseRules.length > 0) {
      parts.push(this.rulesToCSS(baseRules, minify))
    }

    // Media query rules
    for (const [key, rules] of this.rules.entries()) {
      if (key !== 'base' && rules.length > 0) {
        const mediaQuery = rules[0].mediaQuery!
        const css = this.rulesToCSS(rules, minify)
        parts.push(minify ? `${mediaQuery}{${css}}` : `${mediaQuery} {\n${css}\n}`)
      }
    }

    return minify ? parts.join('') : parts.join('\n\n')
  }

  /**
   * Convert rules to CSS string
   */
  private rulesToCSS(rules: CSSRule[], minify: boolean): string {
    const grouped = this.groupRulesBySelector(rules)
    const parts: string[] = []

    for (const [selector, properties] of grouped.entries()) {
      const props = Array.from(properties.entries())
        .map(([prop, value]) => minify ? `${prop}:${value}` : `  ${prop}: ${value};`)
        .join(minify ? ';' : '\n')

      if (minify) {
        parts.push(`${selector}{${props}}`)
      }
      else {
        parts.push(`${selector} {\n${props}\n}`)
      }
    }

    return minify ? parts.join('') : parts.join('\n\n')
  }

  /**
   * Group rules by selector and merge properties
   */
  private groupRulesBySelector(rules: CSSRule[]): Map<string, Map<string, string>> {
    const grouped = new Map<string, Map<string, string>>()

    for (const rule of rules) {
      if (!grouped.has(rule.selector)) {
        grouped.set(rule.selector, new Map())
      }
      const props = grouped.get(rule.selector)!
      for (const [prop, value] of Object.entries(rule.properties)) {
        props.set(prop, value)
      }
    }

    return grouped
  }

  /**
   * Reset the generator state
   */
  reset(): void {
    this.rules.clear()
    this.classCache.clear()
    this.selectorCache.clear()
    this.mediaQueryCache.clear()
    this.noMatchCache.clear()
  }
}
