import type { CssOptions } from '../packages/toolkit/src/engine/types'

const config = {
  verbose: true,
} satisfies Partial<CssOptions>

export default config as Partial<CssOptions>
