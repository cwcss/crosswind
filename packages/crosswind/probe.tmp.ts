import { CSSGenerator } from './src/generator'
import { defaultConfig } from './src/config'
for (const c of process.argv.slice(2)) {
  const g = new CSSGenerator({ ...defaultConfig })
  g.generate(c)
  console.log(`--- ${c}\n${g.toCSS(false, false).trim() || '(EMPTY)'}`)
}
