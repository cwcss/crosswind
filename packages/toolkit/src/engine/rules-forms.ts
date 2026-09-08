import type { UtilityRule } from './rules'

/**
 * Tailwind Forms utility classes
 * Provides form-* classes that can be used to explicitly apply form styles
*/

const baseInputStyles = {
  'appearance': 'none',
  'background-color': '#fff',
  'border-color': '#6b7280',
  'border-width': '1px',
  'border-radius': '0px',
  'padding-top': '0.5rem',
  'padding-right': '0.75rem',
  'padding-bottom': '0.5rem',
  'padding-left': '0.75rem',
  'font-size': '1rem',
  'line-height': '1.5rem',
}

const baseCheckboxRadioStyles = {
  'appearance': 'none',
  'padding': '0',
  'print-color-adjust': 'exact',
  'display': 'inline-block',
  'vertical-align': 'middle',
  'background-origin': 'border-box',
  'user-select': 'none',
  'flex-shrink': '0',
  'height': '1rem',
  'width': '1rem',
  'color': '#2563eb',
  'background-color': '#fff',
  'border-color': '#6b7280',
  'border-width': '1px',
}

// The parser splits `form-input` into utility `form` + value `input`, so
// guards on `parsed.utility === 'form-input'` NEVER matched — every form-*
// class silently emitted nothing. Match the parsed shape (and keep the
// compound form for robustness).
function isFormUtility(parsed: { utility: string, value?: string }, name: string): boolean {
  return (parsed.utility === 'form' && parsed.value === name)
    || (parsed.utility === `form-${name}` && !parsed.value)
}

export const formInputRule: UtilityRule = (parsed) => {
  if (isFormUtility(parsed, 'input')) {
    return baseInputStyles
  }
}

export const formTextareaRule: UtilityRule = (parsed) => {
  if (isFormUtility(parsed, 'textarea')) {
    return baseInputStyles
  }
}

export const formSelectRule: UtilityRule = (parsed) => {
  if (isFormUtility(parsed, 'select')) {
    return {
      ...baseInputStyles,
      'background-image': 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")',
      'background-position': 'right 0.5rem center',
      'background-repeat': 'no-repeat',
      'background-size': '1.5em 1.5em',
      'padding-right': '2.5rem',
      'print-color-adjust': 'exact',
    }
  }
}

export const formMultiselectRule: UtilityRule = (parsed) => {
  if (isFormUtility(parsed, 'multiselect')) {
    return {
      ...baseInputStyles,
      'background-image': 'initial',
      'background-position': 'initial',
      'background-repeat': 'unset',
      'background-size': 'initial',
      'print-color-adjust': 'unset',
    }
  }
}

export const formCheckboxRule: UtilityRule = (parsed) => {
  if (isFormUtility(parsed, 'checkbox')) {
    return {
      ...baseCheckboxRadioStyles,
      'border-radius': '0px',
    }
  }
}

export const formRadioRule: UtilityRule = (parsed) => {
  if (isFormUtility(parsed, 'radio')) {
    return {
      ...baseCheckboxRadioStyles,
      'border-radius': '100%',
    }
  }
}

export const formsRules: UtilityRule[] = [
  formInputRule,
  formTextareaRule,
  formSelectRule,
  formMultiselectRule,
  formCheckboxRule,
  formRadioRule,
]
