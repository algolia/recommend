const path = require('path');

const nodeExternals = require('webpack-node-externals');

module.exports = [
  {
    entry: './src/server.js',
    target: 'node',
    externals: [nodeExternals()],
    output: {
      path: path.join(__dirname, 'dist'),
      publicPath: '/',
      filename: 'server.js',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: 'babel-loader',
        },
      ],
    },
  },
  {
    entry: './src/index.js',
    output: {
      path: path.join(__dirname, 'dist'),
      publicPath: '/',
      filename: 'bundle.js',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: 'babel-loader',
        },
      ],
    },
  },
];
