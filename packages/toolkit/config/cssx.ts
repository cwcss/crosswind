import type { TsCssOptions } from '../src/types'

const config: TsCssOptions = {
  content: ['./example/**/*.html'],
  output: './example/output.css',
  minify: false,
}

export default config
