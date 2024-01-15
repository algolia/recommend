import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import filesize from 'rollup-plugin-filesize';
import { terser } from 'rollup-plugin-terser';

import { getBundleBanner } from '../getBundleBanner.mjs';

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

export function createRollupConfig(pkg) {
  const sources = {
    [pkg['umd:main']]: pkg.source,
  };

  if (
    pkg.name === '@algolia/recommend-js' ||
    pkg.name === '@algolia/recommend-react'
  ) {
    sources['dist/umd/experimental-personalization/index.js'] =
      'src/experimental-personalization/index.ts';
  }

  return Object.entries(sources).map(([file, source]) => {
    return {
      input: source,
      output: {
        banner: getBundleBanner(pkg),
        file,
        format: 'umd',
        name: pkg.name,
        sourcemap: true,
      },
      plugins,
    };
  });
}

export function createRollupConfigForReact(pkg) {
  const configs = createRollupConfig(pkg);

  return configs.map((config) => {
    return {
      ...config,
      external: ['react', 'react-dom'],
      output: {
        ...config.output,
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    };
  });
}
