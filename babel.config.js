module.exports = (api) => {
  const isTest = api.env('test');

  const config = {
    presets: [
      ['@babel/preset-typescript'],
      [
        '@babel/preset-react',
        {
          runtime: 'classic',
        },
      ],
    ],
    plugins: [
      [
        '@babel/plugin-transform-runtime',
        {
          corejs: false,
          helpers: true,
          regenerator: true,
        },
      ],
      [
        'inline-replace-variables',
        {
          __DEV__: {
            type: 'node',
            replacement: "process.env.NODE_ENV !== 'production'",
          },
        },
      ],
    ],
  };

  if (isTest) {
    config.presets.push([
      '@babel/preset-env',
      {
        modules: 'commonjs',
        targets: {
          node: true,
        },
      },
    ]);
  }

  return config;
};
