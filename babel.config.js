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
      ['@babel/preset-react'],
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
        test: ['examples/js-demo'],
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
      },
    ],
  };
};
