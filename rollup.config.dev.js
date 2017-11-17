import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'

export default {
  input: 'src/juejin-lazyload.js',
  output: {
    format: 'umd',
    name: 'JuejinLazyload',
    file: 'dev/juejin-lazyload.js'
  },
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**'
    })
  ]
}
