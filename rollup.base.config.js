import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import filesize from 'rollup-plugin-filesize';
import { terser } from 'rollup-plugin-terser';

const preactPlugins = [
  [
    'module-resolver',
    {
      alias: {
        react: 'preact/compat',
        'react-dom': 'preact/compat',
      },
    },
  ],
];

export const plugins = [
  replace({
    preventAssignment: true,
    values: {
      __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
    },
  }),
  json(),
  resolve({
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  }),
  commonjs(),
  babel({
    exclude: 'node_modules/**',
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    rootMode: 'upward',
    babelHelpers: 'runtime',
    plugins: process.env.BUILD_PREACT ? preactPlugins : [],
  }),
  terser(),
  filesize({
    showMinifiedSize: false,
    showGzippedSize: true,
  }),
];
