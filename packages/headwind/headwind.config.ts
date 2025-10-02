import type { HeadwindConfig } from './src/types'

const config = {
  content: ['./example/**/*.html'],
  output: './example/output.css',
  minify: false,
} satisfies Partial<HeadwindConfig>

export default config as Partial<HeadwindConfig>
