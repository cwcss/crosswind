import type { HeadwindOptions } from './src/types'

const config: HeadwindOptions = {
  content: ['./example/**/*.html'],
  output: './example/output.css',
  minify: false,
}

export default config
