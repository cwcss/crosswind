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
}

export interface Theme {
  colors: Record<string, string | Record<string, string>>
  spacing: Record<string, string>
  fontSize: Record<string, [string, { lineHeight: string }]>
  fontFamily: Record<string, string[]>
  screens: Record<string, string>
  borderRadius: Record<string, string>
  boxShadow: Record<string, string>
}

export interface VariantConfig {
  responsive: boolean
  hover: boolean
  focus: boolean
  active: boolean
  disabled: boolean
  dark: boolean
  // Group/Peer
  group: boolean
  peer: boolean
  // Pseudo-elements
  before: boolean
  after: boolean
  marker: boolean
  // Pseudo-classes - Basic
  first: boolean
  last: boolean
  odd: boolean
  even: boolean
  'first-of-type': boolean
  'last-of-type': boolean
  visited: boolean
  checked: boolean
  'focus-within': boolean
  'focus-visible': boolean
  // Pseudo-classes - Form states
  placeholder: boolean
  selection: boolean
  file: boolean
  required: boolean
  valid: boolean
  invalid: boolean
  'read-only': boolean
  autofill: boolean
  // Pseudo-classes - Additional states
  open: boolean
  closed: boolean
  empty: boolean
  enabled: boolean
  only: boolean
  target: boolean
  indeterminate: boolean
  default: boolean
  optional: boolean
  // Media
  print: boolean
  // Direction
  rtl: boolean
  ltr: boolean
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

export type HeadwindOptions = Partial<HeadwindConfig>
