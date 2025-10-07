import type { CSSRule, HeadwindConfig, ParsedClass } from './types'
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

/**
 * Generates CSS rules from parsed utility classes
 */
export class CSSGenerator {
  private rules: Map<string, CSSRule[]> = new Map()

  constructor(private config: HeadwindConfig) {
    // Merge preset themes into the main config theme
    if (config.presets && config.presets.length > 0) {
      for (const preset of config.presets) {
        if (preset.theme) {
          this.config.theme = deepMerge(this.config.theme, preset.theme)
        }
      }
    }
  }

  /**
   * Generate CSS for a utility class
   */
  generate(className: string): void {
    const parsed = parseClass(className)

    // Check if class is blocklisted (supports wildcards)
    for (const pattern of this.config.blocklist) {
      if (pattern.includes('*')) {
        // Convert wildcard pattern to regex
        const regexPattern = pattern.replace(/\*/g, '.*')
        const regex = new RegExp(`^${regexPattern}$`)
        if (regex.test(className)) {
          return
        }
      }
      else if (pattern === className) {
        // Exact match
        return
      }
    }

    // Try custom rules from config first (allows overriding built-in rules)
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

    // Try built-in rules
    for (const rule of builtInRules) {
      const result = rule(parsed, this.config)
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

    // Check shortcuts
    const shortcut = this.config.shortcuts[className]
    if (shortcut) {
      const classes = Array.isArray(shortcut) ? shortcut : shortcut.split(/\s+/)
      for (const cls of classes) {
        this.generate(cls)
      }
    }
  }

  /**
   * Add a CSS rule with variants applied
   */
  private addRule(parsed: ParsedClass, properties: Record<string, string>, childSelector?: string): void {
    let selector = this.buildSelector(parsed)

    // Append child selector if provided
    if (childSelector) {
      selector += ` ${childSelector}`
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
   */
  private buildSelector(parsed: ParsedClass): string {
    let selector = `.${this.escapeSelector(parsed.raw)}`
    let prefix = ''

    // Apply variants
    for (const variant of parsed.variants) {
      // Pseudo-class variants
      if (variant === 'hover' && this.config.variants.hover) {
        selector += ':hover'
      }
      else if (variant === 'focus' && this.config.variants.focus) {
        selector += ':focus'
      }
      else if (variant === 'active' && this.config.variants.active) {
        selector += ':active'
      }
      else if (variant === 'disabled' && this.config.variants.disabled) {
        selector += ':disabled'
      }
      else if (variant === 'visited' && this.config.variants.visited) {
        selector += ':visited'
      }
      else if (variant === 'checked' && this.config.variants.checked) {
        selector += ':checked'
      }
      else if (variant === 'focus-within' && this.config.variants['focus-within']) {
        selector += ':focus-within'
      }
      else if (variant === 'focus-visible' && this.config.variants['focus-visible']) {
        selector += ':focus-visible'
      }
      // Positional variants
      else if (variant === 'first' && this.config.variants.first) {
        selector += ':first-child'
      }
      else if (variant === 'last' && this.config.variants.last) {
        selector += ':last-child'
      }
      else if (variant === 'odd' && this.config.variants.odd) {
        selector += ':nth-child(odd)'
      }
      else if (variant === 'even' && this.config.variants.even) {
        selector += ':nth-child(even)'
      }
      else if (variant === 'first-of-type' && this.config.variants['first-of-type']) {
        selector += ':first-of-type'
      }
      else if (variant === 'last-of-type' && this.config.variants['last-of-type']) {
        selector += ':last-of-type'
      }
      // Pseudo-elements
      else if (variant === 'before' && this.config.variants.before) {
        selector += '::before'
      }
      else if (variant === 'after' && this.config.variants.after) {
        selector += '::after'
      }
      else if (variant === 'marker' && this.config.variants.marker) {
        selector += '::marker'
      }
      else if (variant === 'placeholder' && this.config.variants.placeholder) {
        selector += '::placeholder'
      }
      else if (variant === 'selection' && this.config.variants.selection) {
        selector += '::selection'
      }
      else if (variant === 'file' && this.config.variants.file) {
        selector += '::file-selector-button'
      }
      // Form state pseudo-classes
      else if (variant === 'required' && this.config.variants.required) {
        selector += ':required'
      }
      else if (variant === 'valid' && this.config.variants.valid) {
        selector += ':valid'
      }
      else if (variant === 'invalid' && this.config.variants.invalid) {
        selector += ':invalid'
      }
      else if (variant === 'read-only' && this.config.variants['read-only']) {
        selector += ':read-only'
      }
      else if (variant === 'autofill' && this.config.variants.autofill) {
        selector += ':autofill'
      }
      // Additional state pseudo-classes
      else if (variant === 'open' && this.config.variants.open) {
        selector += '[open]'
      }
      else if (variant === 'closed' && this.config.variants.closed) {
        selector += ':not([open])'
      }
      else if (variant === 'empty' && this.config.variants.empty) {
        selector += ':empty'
      }
      else if (variant === 'enabled' && this.config.variants.enabled) {
        selector += ':enabled'
      }
      else if (variant === 'only' && this.config.variants.only) {
        selector += ':only-child'
      }
      else if (variant === 'target' && this.config.variants.target) {
        selector += ':target'
      }
      else if (variant === 'indeterminate' && this.config.variants.indeterminate) {
        selector += ':indeterminate'
      }
      else if (variant === 'default' && this.config.variants.default) {
        selector += ':default'
      }
      else if (variant === 'optional' && this.config.variants.optional) {
        selector += ':optional'
      }
      // Group/Peer variants
      else if (variant.startsWith('group-') && this.config.variants.group) {
        const groupVariant = variant.slice(6) // Remove 'group-'
        prefix = `.group:${groupVariant} `
      }
      else if (variant.startsWith('peer-') && this.config.variants.peer) {
        const peerVariant = variant.slice(5) // Remove 'peer-'
        prefix = `.peer:${peerVariant} ~ `
      }
      // Dark mode
      else if (variant === 'dark' && this.config.variants.dark) {
        prefix = '.dark '
      }
      // Direction variants
      else if (variant === 'rtl' && this.config.variants.rtl) {
        prefix = '[dir="rtl"] '
      }
      else if (variant === 'ltr' && this.config.variants.ltr) {
        prefix = '[dir="ltr"] '
      }
    }

    return prefix + selector
  }

  /**
   * Get media query for responsive and media variants
   */
  private getMediaQuery(parsed: ParsedClass): string | undefined {
    for (const variant of parsed.variants) {
      // Responsive breakpoints
      if (this.config.variants.responsive) {
        const breakpoint = this.config.theme.screens[variant]
        if (breakpoint) {
          return `@media (min-width: ${breakpoint})`
        }
      }

      // Print media
      if (variant === 'print' && this.config.variants.print) {
        return '@media print'
      }

      // Motion preferences
      if (variant === 'motion-safe' && this.config.variants['motion-safe']) {
        return '@media (prefers-reduced-motion: no-preference)'
      }
      if (variant === 'motion-reduce' && this.config.variants['motion-reduce']) {
        return '@media (prefers-reduced-motion: reduce)'
      }

      // Contrast preferences
      if (variant === 'contrast-more' && this.config.variants['contrast-more']) {
        return '@media (prefers-contrast: more)'
      }
      if (variant === 'contrast-less' && this.config.variants['contrast-less']) {
        return '@media (prefers-contrast: less)'
      }
    }

    return undefined
  }

  /**
   * Escape special characters in class names for CSS selectors
   */
  private escapeSelector(className: string): string {
    return className.replace(/[:./]/g, '\\$&')
  }

  /**
   * Generate final CSS output
   */
  toCSS(includePreflight = true, minify = false): string {
    const parts: string[] = []

    // Add preflight CSS first (if requested)
    if (includePreflight) {
      for (const preflight of this.config.preflights) {
        const preflightCSS = preflight.getCSS()
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
  }
}
