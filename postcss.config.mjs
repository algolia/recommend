import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import color from 'postcss-color-rgb';
import comment from 'postcss-comment';
import presetEnv from 'postcss-preset-env';

export default {
  parser: comment,
  plugins: [
    presetEnv({
      features: {
        'nesting-rules': false,
      },
    }),
    color,
    autoprefixer,
    cssnano,
  ],
};
