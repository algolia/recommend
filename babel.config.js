module.exports = (api) => {
  const isTest = api.env('test');
  const modules = isTest ? 'commonjs' : false;

  return {
    presets: [
      ['@babel/preset-typescript'],
      ['@babel/preset-react'],
      [
        '@babel/preset-env',
        {
          modules,
        },
      ],
    ],
  };
};
