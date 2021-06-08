import { plugins } from '../../rollup.base.config';

import pkg from './package.json';

export default {
  input: pkg.source,
  output: {
    file: pkg['umd:main'],
    format: 'umd',
    sourcemap: true,
    name: pkg.name,
  },
  plugins,
};
