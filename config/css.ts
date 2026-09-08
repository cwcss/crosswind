import type { TsCssOptions } from '../packages/toolkit/src/engine/types'

const config = {
  verbose: true,
} satisfies Partial<TsCssOptions>

export default config as Partial<TsCssOptions>
