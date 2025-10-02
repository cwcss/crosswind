import type { UtilityRule } from './rules'

// Grid utilities

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
    }
    return parsed.value ? { 'grid-template-columns': cols[parsed.value] || parsed.value } : undefined
  }
}

export const gridColumnRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'col') {
    const spans: Record<string, string> = {
      auto: 'auto',
      'span-1': 'span 1 / span 1',
      'span-2': 'span 2 / span 2',
      'span-3': 'span 3 / span 3',
      'span-4': 'span 4 / span 4',
      'span-5': 'span 5 / span 5',
      'span-6': 'span 6 / span 6',
      'span-7': 'span 7 / span 7',
      'span-8': 'span 8 / span 8',
      'span-9': 'span 9 / span 9',
      'span-10': 'span 10 / span 10',
      'span-11': 'span 11 / span 11',
      'span-12': 'span 12 / span 12',
      'span-full': '1 / -1',
    }
    return parsed.value ? { 'grid-column': spans[parsed.value] || parsed.value } : undefined
  }
  if (parsed.utility === 'col-start' && parsed.value) {
    return { 'grid-column-start': parsed.value }
  }
  if (parsed.utility === 'col-end' && parsed.value) {
    return { 'grid-column-end': parsed.value }
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
    }
    return parsed.value ? { 'grid-template-rows': rows[parsed.value] || parsed.value } : undefined
  }
}

export const gridRowRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'row') {
    const spans: Record<string, string> = {
      auto: 'auto',
      'span-1': 'span 1 / span 1',
      'span-2': 'span 2 / span 2',
      'span-3': 'span 3 / span 3',
      'span-4': 'span 4 / span 4',
      'span-5': 'span 5 / span 5',
      'span-6': 'span 6 / span 6',
      'span-full': '1 / -1',
    }
    return parsed.value ? { 'grid-row': spans[parsed.value] || parsed.value } : undefined
  }
  if (parsed.utility === 'row-start' && parsed.value) {
    return { 'grid-row-start': parsed.value }
  }
  if (parsed.utility === 'row-end' && parsed.value) {
    return { 'grid-row-end': parsed.value }
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

export const gapRule: UtilityRule = (parsed, config) => {
  if (parsed.utility === 'gap' && parsed.value) {
    return { gap: config.theme.spacing[parsed.value] || parsed.value }
  }
  if (parsed.utility === 'gap-x' && parsed.value) {
    return { 'column-gap': config.theme.spacing[parsed.value] || parsed.value }
  }
  if (parsed.utility === 'gap-y' && parsed.value) {
    return { 'row-gap': config.theme.spacing[parsed.value] || parsed.value }
  }
}

export const placeContentRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'place' && parsed.value && parsed.value.startsWith('content-')) {
    const val = parsed.value.replace('content-', '')
    const values: Record<string, string> = {
      'center': 'center',
      'start': 'start',
      'end': 'end',
      'between': 'space-between',
      'around': 'space-around',
      'evenly': 'space-evenly',
      'stretch': 'stretch',
    }
    return values[val] ? { 'place-content': values[val] } : undefined
  }
  return undefined
}

export const placeItemsRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'place' && parsed.value && parsed.value.startsWith('items-')) {
    const val = parsed.value.replace('items-', '')
    const values: Record<string, string> = {
      'start': 'start',
      'end': 'end',
      'center': 'center',
      'stretch': 'stretch',
    }
    return values[val] ? { 'place-items': values[val] } : undefined
  }
  return undefined
}

export const placeSelfRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'place' && parsed.value && parsed.value.startsWith('self-')) {
    const val = parsed.value.replace('self-', '')
    const values: Record<string, string> = {
      'auto': 'auto',
      'start': 'start',
      'end': 'end',
      'center': 'center',
      'stretch': 'stretch',
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
