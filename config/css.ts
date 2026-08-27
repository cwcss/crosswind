import type { TsCssOptions } from '../packages/ts-css/src/types'

const config = {
  verbose: true,
} satisfies Partial<TsCssOptions>

export default config as Partial<TsCssOptions>
