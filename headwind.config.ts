import type { HeadwindOptions } from './packages/headwind/src/types'

const config = {
  verbose: true,
} satisfies Partial<HeadwindOptions>

export default config as Partial<HeadwindOptions>
