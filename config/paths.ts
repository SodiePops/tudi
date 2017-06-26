import * as path from 'path'

const appRoot = process.cwd()

const paths = {
  appRoot,
  entry: path.resolve('./src/index.ts'),
  outDir: path.resolve('./lib'),
  tsconfig: path.resolve('./config/tsconfig.json'),
}

export default paths
