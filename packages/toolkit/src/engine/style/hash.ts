/**
 * Deterministic, environment-independent hashing for atomic class names.
 *
 * The same style object has to hash to the same class name in the build that
 * emits the CSS and in the browser that evaluates `css.create()`, so this is
 * plain arithmetic — no `Bun.hash`, no `node:crypto`.
 */

const FNV_OFFSET = 0x811C9DC5
const FNV_PRIME = 0x01000193

/**
 * 32-bit FNV-1a. `Math.imul` keeps the multiply in 32-bit integer space
 * instead of drifting into float territory the way `*` would.
 */
function fnv1a(input: string, seed: number): number {
  let hash = seed >>> 0
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i)
    hash = Math.imul(hash, FNV_PRIME)
  }
  return hash >>> 0
}

/**
 * 40-bit hash rendered in base36 (8 chars or fewer).
 *
 * 32 bits alone collides at roughly 1-in-300 across 5k atomic rules — well
 * inside the range a real design system hits — so a second seeded pass adds
 * another byte, taking that to ~1-in-100,000.
 */
export function hashString(input: string): string {
  const low = fnv1a(input, FNV_OFFSET)
  const high = fnv1a(input, 0x1F83D9AB) & 0xFF
  return (high * 0x100000000 + low).toString(36)
}

/**
 * Class names must start with a letter, so every hash is prefixed. The
 * default `tc` matches the framework's `tc-` class prefix while staying
 * distinct from it — compiled utility groups are `tc-<hash>`, atomic style
 * classes are `tc<hash>`, and the two can never collide.
 */
export function hashedClassName(input: string, prefix = 'tc'): string {
  return prefix + hashString(input)
}
