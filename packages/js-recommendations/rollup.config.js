import { plugins } from '../../rollup.base.config';

import pkg from './package.json';

if (!process.env.BUILD) {
  throw new Error('The `BUILD` environment variable is required to build.');
}

const output = {
  umd: {
    file: pkg.main,
    format: 'umd',
    sourcemap: true,
    name: pkg.name,
  },
  esm: {
    file: pkg.module,
    format: 'es',
    sourcemap: true,
  },
};

export default {
  input: pkg.source,
  output: output[process.env.BUILD],
  plugins,
};
