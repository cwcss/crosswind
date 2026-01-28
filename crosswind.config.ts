import type { CrosswindOptions } from './packages/crosswind/src/types'

const config = {
  verbose: true,
} satisfies Partial<CrosswindOptions>

export default config as Partial<CrosswindOptions>
