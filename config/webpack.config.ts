import * as webpack from 'webpack'
const DirectoryNamedWebpackPlugin = require('directory-named-webpack-plugin')

import paths from './paths'

const config: webpack.Configuration = {
  entry: paths.entry,
  devtool: 'source-map',
  output: {
    path: paths.outDir,
    filename: 'tudi.js',
    library: 'tudi',
    libraryTarget: 'umd',
  },
  resolve: {
    extensions: ['.ts', '.js'],
    plugins: [
      // Allows importing files with the same name as their parent directory
      // eg: import foo from './components/foo'
      //     resolves to `./components/foo/foo.js`
      new DirectoryNamedWebpackPlugin(true),
    ],
  },
  module: {
    rules: [
      {
        test: /.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'awesome-typescript-loader',
            options: {
              configFileName: paths.tsconfig,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
  ],
}

export default config
