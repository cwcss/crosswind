import type { UtilityRule } from './rules'

// Grid utilities

// Grid placement values a class token may resolve to without brackets:
// `auto`, integers (including negatives for *-start/*-end), `span-<n>`, and
// `span-full`. Anything else must come through an arbitrary value
// (`row-[header]`). Passing unknown words through verbatim would turn
// unrelated semantic class names like `row-list` or `col-header` into
// named-grid-line placements that silently break grid layouts.
const GRID_LINE_INTEGER_RE = /^-?\d+$/
const GRID_SPAN_RE = /^span-(\d+)$/

export const gridTemplateColumnsRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'grid-cols' && parsed.value) {
    if (parsed.arbitrary)
      return { 'grid-template-columns': parsed.value } as Record<string, string>
    if (parsed.value === 'none' || parsed.value === 'subgrid')
      return { 'grid-template-columns': parsed.value } as Record<string, string>
    if (/^\d+$/.test(parsed.value))
      return { 'grid-template-columns': `repeat(${parsed.value}, minmax(0, 1fr))` } as Record<string, string>
    return undefined
  }
}

export const gridColumnRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'col') {
    if (!parsed.value)
      return undefined
    if (parsed.arbitrary)
      return { 'grid-column': parsed.value } as Record<string, string>
    if (parsed.value === 'auto')
      return { 'grid-column': 'auto' } as Record<string, string>
    if (parsed.value === 'span-full')
      return { 'grid-column': '1 / -1' } as Record<string, string>
    const span = parsed.value.match(GRID_SPAN_RE)
    if (span)
      return { 'grid-column': `span ${span[1]} / span ${span[1]}` } as Record<string, string>
    if (GRID_LINE_INTEGER_RE.test(parsed.value))
      return { 'grid-column': parsed.value } as Record<string, string>
    return undefined
  }
  if (parsed.utility === 'col-span' && parsed.value) {
    // Handle arbitrary values: col-span-[15] -> span 15 / span 15
    if (parsed.arbitrary) {
      return { 'grid-column': `span ${parsed.value} / span ${parsed.value}` } as Record<string, string>
    }
    if (parsed.value === 'auto')
      return { 'grid-column': 'auto' } as Record<string, string>
    if (parsed.value === 'full')
      return { 'grid-column': '1 / -1' } as Record<string, string>
    if (/^\d+$/.test(parsed.value))
      return { 'grid-column': `span ${parsed.value} / span ${parsed.value}` } as Record<string, string>
    return undefined
  }
  if (parsed.utility === 'col-start' && parsed.value) {
    if (parsed.arbitrary || parsed.value === 'auto' || GRID_LINE_INTEGER_RE.test(parsed.value))
      return { 'grid-column-start': parsed.value } as Record<string, string>
    return undefined
  }
  if (parsed.utility === 'col-end' && parsed.value) {
    if (parsed.arbitrary || parsed.value === 'auto' || GRID_LINE_INTEGER_RE.test(parsed.value))
      return { 'grid-column-end': parsed.value } as Record<string, string>
    return undefined
  }
}

export const gridTemplateRowsRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'grid-rows' && parsed.value) {
    if (parsed.arbitrary)
      return { 'grid-template-rows': parsed.value } as Record<string, string>
    if (parsed.value === 'none' || parsed.value === 'subgrid')
      return { 'grid-template-rows': parsed.value } as Record<string, string>
    if (/^\d+$/.test(parsed.value))
      return { 'grid-template-rows': `repeat(${parsed.value}, minmax(0, 1fr))` } as Record<string, string>
    return undefined
  }
}

export const gridRowRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'row') {
    if (!parsed.value)
      return undefined
    if (parsed.arbitrary)
      return { 'grid-row': parsed.value } as Record<string, string>
    if (parsed.value === 'auto')
      return { 'grid-row': 'auto' } as Record<string, string>
    if (parsed.value === 'span-full')
      return { 'grid-row': '1 / -1' } as Record<string, string>
    const span = parsed.value.match(GRID_SPAN_RE)
    if (span)
      return { 'grid-row': `span ${span[1]} / span ${span[1]}` } as Record<string, string>
    if (GRID_LINE_INTEGER_RE.test(parsed.value))
      return { 'grid-row': parsed.value } as Record<string, string>
    return undefined
  }
  if (parsed.utility === 'row-span' && parsed.value) {
    // Handle arbitrary values: row-span-[15] -> span 15 / span 15
    if (parsed.arbitrary) {
      return { 'grid-row': `span ${parsed.value} / span ${parsed.value}` } as Record<string, string>
    }
    if (parsed.value === 'auto')
      return { 'grid-row': 'auto' } as Record<string, string>
    if (parsed.value === 'full')
      return { 'grid-row': '1 / -1' } as Record<string, string>
    if (/^\d+$/.test(parsed.value))
      return { 'grid-row': `span ${parsed.value} / span ${parsed.value}` } as Record<string, string>
    return undefined
  }
  if (parsed.utility === 'row-start' && parsed.value) {
    if (parsed.arbitrary || parsed.value === 'auto' || GRID_LINE_INTEGER_RE.test(parsed.value))
      return { 'grid-row-start': parsed.value } as Record<string, string>
    return undefined
  }
  if (parsed.utility === 'row-end' && parsed.value) {
    if (parsed.arbitrary || parsed.value === 'auto' || GRID_LINE_INTEGER_RE.test(parsed.value))
      return { 'grid-row-end': parsed.value } as Record<string, string>
    return undefined
  }
}

export const gridAutoFlowRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'grid-flow' && parsed.value) {
    const flows: Record<string, string> = {
      'row': 'row',
      'col': 'column',
      'dense': 'dense',
      'row-dense': 'row dense',
      'col-dense': 'column dense',
    }
    return flows[parsed.value] ? { 'grid-auto-flow': flows[parsed.value] } : undefined
  }
  return undefined
}

export const gridAutoColumnsRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'auto-cols' && parsed.value) {
    const values: Record<string, string> = {
      auto: 'auto',
      min: 'min-content',
      max: 'max-content',
      fr: 'minmax(0, 1fr)',
    }
    if (parsed.arbitrary)
      return { 'grid-auto-columns': parsed.value } as Record<string, string>
    return values[parsed.value] ? { 'grid-auto-columns': values[parsed.value] } : undefined
  }
}

export const gridAutoRowsRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'auto-rows' && parsed.value) {
    const values: Record<string, string> = {
      auto: 'auto',
      min: 'min-content',
      max: 'max-content',
      fr: 'minmax(0, 1fr)',
    }
    if (parsed.arbitrary)
      return { 'grid-auto-rows': parsed.value } as Record<string, string>
    return values[parsed.value] ? { 'grid-auto-rows': values[parsed.value] } : undefined
  }
}

// Resolve a token against the spacing theme, falling back to Tailwind v4
// behavior for off-scale numbers (`gap-4.5` → `1.125rem`). Arbitrary values
// (with units, functions) pass through; unknown words are rejected.
function resolveSpacing(parsed: { arbitrary: boolean }, config: any, token: string): string | undefined {
  const hit = config.theme.spacing?.[token]
  if (hit !== undefined) return hit
  if (parsed.arbitrary) return token
  if (/^\d+(?:\.\d+)?$/.test(token)) {
    const n = Number.parseFloat(token)
    if (Number.isFinite(n)) return `${n * 0.25}rem`
  }
  return undefined
}

export const gapRule: UtilityRule = (parsed, config) => {
  const props: Record<string, string> = {
    'gap': 'gap',
    'gap-x': 'column-gap',
    'gap-y': 'row-gap',
  }
  const prop = props[parsed.utility]
  if (!prop || !parsed.value)
    return undefined
  const value = resolveSpacing(parsed, config, parsed.value)
  return value !== undefined ? { [prop]: value } as Record<string, string> : undefined
}

export const placeContentRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'place' && parsed.value && parsed.value.startsWith('content-')) {
    const val = parsed.value.replace('content-', '')
    const values: Record<string, string> = {
      center: 'center',
      start: 'start',
      end: 'end',
      between: 'space-between',
      around: 'space-around',
      evenly: 'space-evenly',
      stretch: 'stretch',
    }
    return values[val] ? { 'place-content': values[val] } : undefined
  }
  return undefined
}

export const placeItemsRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'place' && parsed.value && parsed.value.startsWith('items-')) {
    const val = parsed.value.replace('items-', '')
    const values: Record<string, string> = {
      start: 'start',
      end: 'end',
      center: 'center',
      stretch: 'stretch',
    }
    return values[val] ? { 'place-items': values[val] } : undefined
  }
  return undefined
}

export const placeSelfRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'place' && parsed.value && parsed.value.startsWith('self-')) {
    const val = parsed.value.replace('self-', '')
    const values: Record<string, string> = {
      auto: 'auto',
      start: 'start',
      end: 'end',
      center: 'center',
      stretch: 'stretch',
    }
    return values[val] ? { 'place-self': values[val] } : undefined
  }
  return undefined
}

export const gridRules: UtilityRule[] = [
  gridTemplateColumnsRule,
  gridColumnRule,
  gridTemplateRowsRule,
  gridRowRule,
  gridAutoFlowRule,
  gridAutoColumnsRule,
  gridAutoRowsRule,
  gapRule,
  placeContentRule,
  placeItemsRule,
  placeSelfRule,
]
