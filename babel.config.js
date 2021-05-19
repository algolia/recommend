module.exports = (api) => {
  const isTest = api.env('test');
  const modules = isTest ? 'commonjs' : false;
  const targets = {};

  if (isTest) {
    targets.node = true;
  } else {
    targets.browsers = ['last 2 versions', 'ie >= 9'];
  }

  return {
    presets: [
      ['@babel/preset-typescript'],
      [
        '@babel/preset-env',
        {
          modules,
          targets,
        },
      ],
    ],
    overrides: [
      {
        test: [
          'packages/react-recommendations',
          'packages/horizontal-slider-react',
          'examples/demo',
        ],
        presets: [['@babel/preset-react']],
      },
      {
        test: [
          // 'packages/js-recommendations',
          // 'packages/horizontal-slider-js',
          'examples/js-demo',
        ],
        presets: [
          [
            '@babel/preset-react',
            {
              pragma: 'h',
              pragmaFrag: 'Fragment',
            },
          ],
        ],
        plugins: [
          [
            'module-resolver',
            {
              // root: ['./src'],
              alias: {
                react: 'preact/compat',
                'react-dom': 'preact/compat',
              },
            },
          ],
        ],
      },
    ],
  };
};
