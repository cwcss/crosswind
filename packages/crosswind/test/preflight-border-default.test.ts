import { describe, expect, it } from 'bun:test'
import { tailwindPreflight } from '../src/preflight'

/**
 * The uncoloured-border default.
 *
 * This used to fall back to currentColor, which made every border whose
 * colour was never set take the TEXT colour: near-black on a light page,
 * near-white on a dark one. A plain divide-y therefore rendered as a heavy
 * black rule rather than a hairline, and setting border-color on the parent
 * did not help, because divide targets the children and this block's
 * declaration won on them.
 */
describe('preflight uncoloured border default', () => {
  const css = tailwindPreflight.getCSS()

  it('falls back to a neutral grey rather than the text colour', () => {
    expect(css).toContain('border-color: var(--border-color, #e5e7eb)')
    expect(css).not.toContain('border-color: var(--border-color, currentColor)')
  })

  it('keeps --border-color as the escape hatch', () => {
    // An app sets this once on :root and every uncoloured border follows,
    // which is what makes per-theme borders a one-line change.
    expect(css).toContain('var(--border-color')
  })
})
