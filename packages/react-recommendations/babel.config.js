const isRollup = process.env.BUILD === 'umd';

module.exports = {
  extends: '../../babel.config.js',
  overrides: [
    {
      test: 'packages/react-recommendations',
      plugins: [
        [
          '@babel/plugin-transform-runtime',
          {
            corejs: false,
            helpers: true,
            regenerator: false,
            useESModules: isRollup,
          },
        ],
      ],
    },
  ],
};
