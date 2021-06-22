import autoprefixer from 'autoprefixer';
import color from 'postcss-color-rgb';
import comment from 'postcss-comment';
import presetEnv from 'postcss-preset-env';
import tailwindcss from 'tailwindcss';

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
    tailwindcss,
  ],
};
