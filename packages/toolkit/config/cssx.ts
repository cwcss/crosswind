import type { CssOptions } from '../src/types'

const config: CssOptions = {
  content: ['./example/**/*.html'],
  output: './example/output.css',
  minify: false,
}

export default config
