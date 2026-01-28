import type { CrosswindOptions } from './src/types'

const config: CrosswindOptions = {
  content: ['./example/**/*.html'],
  output: './example/output.css',
  minify: false,
}

export default config
