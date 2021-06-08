import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import filesize from 'rollup-plugin-filesize';
import { terser } from 'rollup-plugin-terser';

import { getBundleBanner } from '../getBundleBanner.mjs';

const isReactBuild = process.env.BUILD === 'react';

const extensions = ['.js', '.jsx', '.ts', '.tsx', '.json'];
const plugins = [
  replace({
    preventAssignment: true,
    values: {
      __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
    },
  }),
  json(),
  resolve({
    extensions,
  }),
  commonjs(),
  babel({
    exclude: 'node_modules/**',
    extensions,
    rootMode: 'upward',
    babelHelpers: 'runtime',
  }),
  terser(),
  filesize({
    showMinifiedSize: false,
    showGzippedSize: true,
  }),
];
const external = isReactBuild ? ['react', 'react-dom'] : undefined;
const globals = isReactBuild
  ? { react: 'React', 'react-dom': 'ReactDOM' }
  : undefined;

export function createRollupConfig(pkg) {
  return {
    input: pkg.source,
    external,
    output: {
      banner: getBundleBanner(pkg),
      file: pkg['umd:main'],
      format: 'umd',
      name: pkg.name,
      sourcemap: true,
      globals,
    },
    plugins,
  };
}
