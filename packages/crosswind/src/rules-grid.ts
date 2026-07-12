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
  if (parsed.utility === 'grid-cols') {
    const cols: Record<string, string> = {
      1: 'repeat(1, minmax(0, 1fr))',
      2: 'repeat(2, minmax(0, 1fr))',
      3: 'repeat(3, minmax(0, 1fr))',
      4: 'repeat(4, minmax(0, 1fr))',
      5: 'repeat(5, minmax(0, 1fr))',
      6: 'repeat(6, minmax(0, 1fr))',
      7: 'repeat(7, minmax(0, 1fr))',
      8: 'repeat(8, minmax(0, 1fr))',
      9: 'repeat(9, minmax(0, 1fr))',
      10: 'repeat(10, minmax(0, 1fr))',
      11: 'repeat(11, minmax(0, 1fr))',
      12: 'repeat(12, minmax(0, 1fr))',
      none: 'none',
      subgrid: 'subgrid',
    }
    return parsed.value ? { 'grid-template-columns': cols[parsed.value] || parsed.value } : undefined
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
  if (parsed.utility === 'grid-rows') {
    const rows: Record<string, string> = {
      1: 'repeat(1, minmax(0, 1fr))',
      2: 'repeat(2, minmax(0, 1fr))',
      3: 'repeat(3, minmax(0, 1fr))',
      4: 'repeat(4, minmax(0, 1fr))',
      5: 'repeat(5, minmax(0, 1fr))',
      6: 'repeat(6, minmax(0, 1fr))',
      none: 'none',
      subgrid: 'subgrid',
    }
    return parsed.value ? { 'grid-template-rows': rows[parsed.value] || parsed.value } : undefined
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
  if (parsed.utility === 'auto-cols') {
    const values: Record<string, string> = {
      auto: 'auto',
      min: 'min-content',
      max: 'max-content',
      fr: 'minmax(0, 1fr)',
    }
    return parsed.value ? { 'grid-auto-columns': values[parsed.value] || parsed.value } : undefined
  }
}

export const gridAutoRowsRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'auto-rows') {
    const values: Record<string, string> = {
      auto: 'auto',
      min: 'min-content',
      max: 'max-content',
      fr: 'minmax(0, 1fr)',
    }
    return parsed.value ? { 'grid-auto-rows': values[parsed.value] || parsed.value } : undefined
  }
}

// Resolve a token against the spacing theme, falling back to Tailwind v4
// behavior for off-scale numbers (`gap-4.5` → `1.125rem`). Keeps keywords
// and arbitrary values (with units, functions) passing through unchanged.
function resolveSpacing(config: any, token: string): string {
  const hit = config.theme.spacing?.[token]
  if (hit !== undefined) return hit
  if (/^\d+(?:\.\d+)?$/.test(token)) {
    const n = Number.parseFloat(token)
    if (Number.isFinite(n)) return `${n * 0.25}rem`
  }
  return token
}

export const gapRule: UtilityRule = (parsed, config) => {
  if (parsed.utility === 'gap' && parsed.value) {
    return { gap: resolveSpacing(config, parsed.value) } as Record<string, string>
  }
  if (parsed.utility === 'gap-x' && parsed.value) {
    return { 'column-gap': resolveSpacing(config, parsed.value) } as Record<string, string>
  }
  if (parsed.utility === 'gap-y' && parsed.value) {
    return { 'row-gap': resolveSpacing(config, parsed.value) } as Record<string, string>
  }
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
