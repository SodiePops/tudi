import typescript from 'rollup-plugin-typescript'
import resolveNodeModules from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import builtins from 'rollup-plugin-node-builtins'
import builtinsGlobals from 'rollup-plugin-node-globals'

export default {
  entry: 'src/index.ts',
  format: 'umd',
  dest: 'lib/umd/tudi.js',
  moduleName: 'tudi',

  plugins: [
    typescript({ typescript: require('typescript')} ),
    resolveNodeModules({ module: true, jsnext: true, main: true }),
    commonjs({
      namedExports: {
        'node_modules/pixi.js/lib/index.js': ['autoDetectRenderer', 'Container', 'Sprite'],
        'node_modules/pixi.js/lib/polyfill/Math.sign.js': ['default'],
      }
    }),
    builtins(),
    builtinsGlobals(),
  ],
}
