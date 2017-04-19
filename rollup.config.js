import typescript from 'rollup-plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';

export default {
  entry: 'src/index.ts',
  format: 'umd',
  dest: 'lib/umd/tudi.js',
  moduleName: 'tudi',

  plugins: [
    typescript(),
    resolve({ module: true, jsnext: true, main: true }),
    commonjs(),
    builtins(),
  ],
};
