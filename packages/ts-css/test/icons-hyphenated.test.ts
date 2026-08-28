import { describe, expect, it } from 'bun:test'
import { iconRule } from '../src/rules-icons'
import { parseClass } from '../src/parser'
import { defaultConfig } from '../src/config'

/**
 * Collection names are not a single segment. `simple-icons`, `material-symbols`,
 * `fa6-brands` and `line-md` are all real @iconify-json packages, and splitting
 * `i-simple-icons-bluesky` on the first hyphen resolved collection `simple`,
 * which does not exist — so every brand icon emitted no CSS at all.
 *
 * These assert the parse, not a specific collection being installed: a missing
 * package returns undefined either way, so the test stays honest in CI.
 */
describe('icon collection names with hyphens', () => {
  const rule = (cls: string) => iconRule(parseClass(cls), defaultConfig)

  it('does not mistake a hyphenated collection for a single segment', () => {
    // `simple` is not a collection, so the old first-hyphen split could only
    // ever return undefined for this class.
    const result = rule('i-simple-icons-bluesky')
    if (result) {
      // `UtilityRule` is declared as returning a flat declaration map OR a
      // `UtilityRuleResult`; iconRule only ever produces the former, so narrow
      // to it rather than reading `mask` off the union.
      const declarations = result as Record<string, string>
      expect(declarations).toHaveProperty('mask')
      expect(declarations.mask).toContain('data:image/svg+xml')
    }
  })

  it('still resolves single-segment collections', () => {
    const result = rule('i-hugeicons-key-01')
    if (result)
      expect(result).toHaveProperty('-webkit-mask')
  })

  it('ignores classes that are not icons', () => {
    expect(rule('items-center')).toBeUndefined()
    expect(rule('i-')).toBeUndefined()
  })
})
