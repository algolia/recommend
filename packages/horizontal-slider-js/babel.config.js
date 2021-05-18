module.exports = {
  extends: '../../babel.config.js',
  plugins: [
    ['@babel/plugin-transform-react-jsx'],
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          react: 'preact/compat',
          'react-dom': 'preact/compat',
        },
      },
    ],
  ],
};
