/**
 * Find an opacity modifier slash without mistaking a slash inside a CSS color
 * function for the utility modifier.
 *
 * `bg-red-500/50` and `bg-[rgb(1_2_3)]/[0.5]` have a top-level modifier,
 * while `bg-[rgb(1_2_3_/_0.5)]` carries its alpha inside `rgb(...)`.
 */
export function colorModifierSlashIndex(value: string): number {
  const firstSlash = value.indexOf('/')
  if (firstSlash === -1)
    return -1

  let parentheses = 0
  let brackets = 0
  let quote = ''

  for (let index = 0; index < value.length; index++) {
    const character = value[index]

    if (character === '\\') {
      index++
      continue
    }

    if (quote) {
      if (character === quote)
        quote = ''
      continue
    }

    if (character === '"' || character === '\'') {
      quote = character
      continue
    }

    if (character === '(')
      parentheses++
    else if (character === ')')
      parentheses = Math.max(0, parentheses - 1)
    else if (character === '[')
      brackets++
    else if (character === ']')
      brackets = Math.max(0, brackets - 1)
    else if (character === '/' && parentheses === 0 && brackets === 0)
      return index
  }

  return -1
}
