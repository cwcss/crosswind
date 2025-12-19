export interface CompileClassConfig {
  /**
   * Enable compile class transformer
   * @default false
   */
  enabled?: boolean
  /**
   * Trigger string to mark classes for compilation
   * @default ':hw:'
   */
  trigger?: string
  /**
   * Prefix for generated class names
   * @default 'hw-'
   */
  classPrefix?: string
  /**
   * Layer name for compiled classes
   * @default 'shortcuts'
   */
  layer?: string
}

export interface AttributifyConfig {
  /**
   * Enable attributify mode
   * Allows using HTML attributes instead of class names
   * e.g., <div hw-flex hw-bg="blue-500">
   * @default false
   */
  enabled?: boolean
  /**
   * Prefix for attributify attributes (to avoid conflicts with HTML attributes)
   * e.g., with prefix 'hw-': <div hw-flex hw-bg="blue-500">
   * @default 'hw-'
   */
  prefix?: string
  /**
   * Attributes to ignore (won't be treated as utilities)
   * @default ['class', 'className', 'style', 'id', ...]
   */
  ignoreAttributes?: string[]
}

export interface BracketSyntaxConfig {
  /**
   * Enable bracket/grouped syntax
   * Allows grouping utilities like: flex[col jc-center ai-center] or text[white 2rem 700]
   * @default false
   */
  enabled?: boolean
  /**
   * Enable colon syntax for simple values
   * e.g., bg:black, w:100%, text:white
   * @default false
   */
  colonSyntax?: boolean
  /**
   * Mapping of shorthand abbreviations to full utility names
   * e.g., { 'jc': 'justify', 'ai': 'items', 'col': 'col' }
   */
  aliases?: Record<string, string>
}

export interface HeadwindConfig {
  content: string[]
  output: string
  minify: boolean
  watch: boolean
  verbose?: boolean
  theme: Theme
  shortcuts: Record<string, string | string[]>
  rules: CustomRule[]
  variants: VariantConfig
  safelist: string[]
  blocklist: string[]
  preflights: Preflight[]
  presets: Preset[]
  compileClass?: CompileClassConfig
  attributify?: AttributifyConfig
  bracketSyntax?: BracketSyntaxConfig
}

export interface Theme {
  colors: Record<string, string | Record<string, string>>
  spacing: Record<string, string>
  fontSize: Record<string, [string, { lineHeight: string }]>
  fontFamily: Record<string, string[]>
  screens: Record<string, string>
  borderRadius: Record<string, string>
  boxShadow: Record<string, string>
  /** Extend theme values without replacing defaults */
  extend?: Partial<Omit<Theme, 'extend'>>
}

export interface VariantConfig {
  'responsive': boolean
  'hover': boolean
  'focus': boolean
  'active': boolean
  'disabled': boolean
  'dark': boolean
  // Group/Peer
  'group': boolean
  'peer': boolean
  // Pseudo-elements
  'before': boolean
  'after': boolean
  'marker': boolean
  // Pseudo-classes - Basic
  'first': boolean
  'last': boolean
  'odd': boolean
  'even': boolean
  'first-of-type': boolean
  'last-of-type': boolean
  'visited': boolean
  'checked': boolean
  'focus-within': boolean
  'focus-visible': boolean
  // Pseudo-classes - Form states
  'placeholder': boolean
  'selection': boolean
  'file': boolean
  'required': boolean
  'valid': boolean
  'invalid': boolean
  'read-only': boolean
  'autofill': boolean
  // Pseudo-classes - Additional states
  'open': boolean
  'closed': boolean
  'empty': boolean
  'enabled': boolean
  'only': boolean
  'target': boolean
  'indeterminate': boolean
  'default': boolean
  'optional': boolean
  // Media
  'print': boolean
  // Direction
  'rtl': boolean
  'ltr': boolean
  // Motion
  'motion-safe': boolean
  'motion-reduce': boolean
  // Contrast
  'contrast-more': boolean
  'contrast-less': boolean
}

export interface ParsedClass {
  raw: string
  variants: string[]
  utility: string
  value?: string
  important: boolean
  arbitrary: boolean
}

export interface CSSRule {
  selector: string
  properties: Record<string, string>
  mediaQuery?: string
  childSelector?: string // For utilities like space-x that need child selectors
}

export interface UtilityRuleResult {
  properties: Record<string, string>
  childSelector?: string
}

export type CustomRule = [RegExp, (match: RegExpMatchArray) => Record<string, string> | undefined]

export interface Preflight {
  getCSS: () => string
}

export interface Preset {
  name: string
  theme?: Partial<Theme>
  rules?: CustomRule[]
  shortcuts?: Record<string, string | string[]>
  variants?: Partial<VariantConfig>
  preflights?: Preflight[]
}

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type HeadwindOptions = DeepPartial<HeadwindConfig>
