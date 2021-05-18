import { babel } from '@rollup/plugin-babel';
import alias from '@rollup/plugin-alias';

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
  plugins: [
    alias({
      entries: [
        { find: 'react', replacement: 'preact/compat' },
        { find: 'react-dom', replacement: 'preact/compat' },
      ],
    }),
    // babel({
    //   plugins: [
    //     [
    //       'module-resolver',
    //       {
    //         // root: ['./src'],
    //         alias: {
    //           react: 'preact/compat',
    //           'react-dom': 'preact/compat',
    //         },
    //       },
    //     ],
    //   ],
    // }),
    ...plugins,
  ],
  // plugins: plugins.map((plugin) =>
  //   plugin.name === 'babel'
  //     ? babel({
  //         babelHelpers: 'bundled',
  //         // exclude: 'node_modules/**',
  //         extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  //         include: 'node_modules/**',
  //         rootMode: 'upward',
  //       })
  //     : plugin
  // ),
};
