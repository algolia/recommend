import babel from '@rollup/plugin-babel';

import { plugins } from '../../rollup.base.config';

import pkg from './package.json';

if (!process.env.BUILD) {
  throw new Error('The `BUILD` environment variable is required to build.');
}

const output = {
  umd: {
    file: pkg['umd:main'],
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
  plugins: plugins.map((plugin) =>
    plugin.name === 'babel'
      ? babel({
          exclude: 'node_modules/**',
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
          rootMode: 'upward',
          babelHelpers: 'bundled',
          presets: [['@babel/preset-react']],
          plugins: [
            [
              'module-resolver',
              {
                alias: {
                  react: 'preact/compat',
                  'react-dom': 'preact/compat',
                },
              },
            ],
          ],
        })
      : plugin
  ),
};
